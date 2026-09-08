/* =====================================================
   Agent 管理 - 测试页逻辑
   展示 Agent 如何执行一次岗位任务（岗位目标驱动），
   而非聊天式对话。全部过程为可交互的演示走查。
   ===================================================== */

const AGENT_TEST_EXAMPLES = {
  '数据治理': [
    '对「企业资产经营月报.xlsx」进行编目，补充分类与标签，并生成资源描述。',
    '把「2024年人口普查数据.csv」按标准规范拆分入库，并检查命名是否合规。',
    '检索新接入的数据集，判断其是否达到国标目录的录入要求。'
  ],
  '数据分析': [
    '分析「华东区季度销售明细」最近三个季度的走势与异常波动，并给出结论。',
    '汇总各业务线数据质量得分，找出拖累整体的短板指标。',
    '解读这份质量评估结果，说明哪些规则触发的告警最频繁。'
  ],
  '数据运营': [
    '梳理本月数据资产盘点情况，输出可运营的资产清单与分级建议。',
    '整理待优化目录项，给出字段补全与去重的执行方案。',
    '汇总资产调用热度，识别高价值低利用的数据产品。'
  ],
  '业务服务': [
    '审核这份数据服务发布申请，核验合规性并给出结论。',
    '检查待上架数据产品的目录口径是否与元数据一致。',
    '对资源开放申请做合规预审，标注缺失材料。'
  ],
  '通用助手': [
    '把这段话提炼为一页要点，并按岗位口径结构化输出。',
    '检索相关资料并整理成一份可分发的工作摘要。'
  ]
};

const AgentTestPage = {
  agent: null,
  cat: null,
  meta: null,
  running: false,

  init() {
    const q = new URLSearchParams(window.location.search);
    const id = q.get('id');
    this.agent = id ? AgentStore.get(id) : null;
    if (!this.agent) {
      document.getElementById('test-head').style.display = 'none';
      const intro = document.querySelector('.ag-test-intro');
      if (intro) intro.innerHTML = `<i class="fa-regular fa-folder-open"></i>
        <div><b>未找到该智能岗位。</b><span>它可能已被删除或链接已失效。</span></div>`;
      const btn = document.querySelector('.ag-test-run');
      if (btn) { btn.style.display = 'none'; }
      document.querySelector('#test-task').disabled = true;
      const ph = document.getElementById('test-exec-placeholder');
      if (ph) ph.innerHTML = '<i class="fa-regular fa-folder-open"></i><div>请返回Agent列表重新进入。</div>';
      this.renderBackBtn();
      return;
    }
    AgentRefs.loadCatalog().then(cat => {
      this.cat = cat;
      this.meta = AgentRefs.resolveAgent(this.agent, cat);
      this.renderHead();
      this.renderCapLine();
      this.renderExamples();
      this.bindEvents();
    });
  },

  el(id) { return document.getElementById(id); },

  renderHead() {
    const a = this.agent;
    const head = this.el('test-head');
    head.style.display = '';
    const catM = AGENT_CATEGORY_META[a.category] || AGENT_CATEGORY_META['通用助手'];
    const avatar = this.el('test-avatar');
    avatar.style.setProperty('--cat', catM.color);
    avatar.innerHTML = `<i class="fa-solid ${catM.icon}"></i>`;
    this.el('test-name').textContent = a.name;
    this.el('test-category').innerHTML = categoryTag(a.category);
    this.el('test-status').innerHTML = statusPill(a.status);
    this.el('test-version').textContent = a.version || 'v1.0';
    this.el('test-role').textContent = '岗位：' + (a.roleName || '—');
    this.el('test-desc').textContent = a.description || '';
    this.el('test-role-tag').textContent = (a.roleName || '') || '';
  },

  renderCapLine() {
    const box = this.el('test-cap-line');
    const a = this.agent;
    const chips = [];
    const mk = (label, name, cls) => `<span class="ag-test-cap-chip ${cls}"><em>${label}</em>${escapeHtml(name)}</span>`;
    if (this.meta) {
      this.meta.skills.forEach(s => chips.push(mk('Skill', s.name, 'skill')));
      this.meta.tools.slice(0, 4).forEach(t => chips.push(mk('MCP', t.name, 'mcp')));
      this.meta.kbs.slice(0, 2).forEach(k => chips.push(mk('知识库', k.name, 'kb')));
      if (!chips.length) {
        box.innerHTML = '<span class="muted-text">该岗位尚未关联能力，可在工作台岗位说明中键入 @ 进行引用。</span>';
        return;
      }
    }
    box.innerHTML = '<span class="ag-test-cap-label">已授权能力</span>' + chips.join('');
  },

  renderExamples() {
    const box = this.el('test-examples');
    const ex = AGENT_TEST_EXAMPLES[this.agent.category] || AGENT_TEST_EXAMPLES['通用助手'];
    box.innerHTML = ex.slice(0, 3).map(t =>
      `<button type="button" class="ag-test-example" data-task="${escapeHtml(t)}">${escapeHtml(t)}</button>`
    ).join('');
  },

  bindEvents() {
    const that = this;
    this.el('test-back-btn').addEventListener('click', () => this.toWorkbench());
    this.el('test-workbench-btn').addEventListener('click', () => this.toWorkbench());
    this.el('test-run-btn').addEventListener('click', () => this.run());
    this.el('test-examples').addEventListener('click', e => {
      const btn = e.target.closest('.ag-test-example');
      if (!btn) return;
      this.el('test-task').value = btn.getAttribute('data-task');
      this.el('test-task').focus();
    });
    void that;
  },

  renderBackBtn() {
    this.el('test-back-btn').style.display = 'none';
  },

  toWorkbench() {
    window.parent.postMessage({ type: 'navigate', url: 'pages/ai-build/agent-workbench.html?id=' + encodeURIComponent(this.agent.id) }, '*');
  },

  /* ==================== 执行过程 ==================== */

  buildSteps(taskText) {
    const a = this.agent;
    const m = this.meta || {};
    const steps = [];
    const push = (icon, title, desc, opt) => steps.push(Object.assign({ icon, title, desc }, opt || {}));

    push('fa-inbox', '接收任务', '理解任务意图与输入范围', { tag: '输入' });
    push('fa-bullseye', '解析岗位目标', `以「${a.roleName || a.name}」的职责口径解读任务，确定产出规范与边界`, { tag: '规划' });

    const skills = m.skills || [];
    if (skills.length) {
      skills.forEach(s => push('fa-puzzle-piece', `激活 Skill「${s.name}」`, `按该方法组织执行流程（分类：${escapeHtml(s.type || '通用')}）`, { tag: 'Skill' }));
    } else {
      push('fa-puzzle-piece', '确定执行方法', '岗位尚未关联 Skill，采用内置基础方法推进', { tag: 'Skill' });
    }

    const kbs = m.kbs || [];
    if (kbs.length) {
      kbs.forEach(k => push('fa-book-open', `检索知识库「${k.name}」`, '召回规范、口径与历史案例作为判断依据', { tag: '知识库' }));
    } else {
      push('fa-book-open', '检索业务口径', '在平台标准口径中定位相关规则', { tag: '知识库' });
    }

    const tools = m.tools || [];
    if (tools.length) {
      tools.slice(0, 2).forEach(t => push('fa-wrench', `调用 MCP 工具「${t.name}」`, `经 ${escapeHtml(t.serverName || '已授权MCP服务')} 获取实时数据与元数据`, { tag: 'MCP' }));
    } else {
      push('fa-wrench', '获取数据元数据', '从资源元数据中心读取字段、负责人与更新信息', { tag: '工具' });
    }

    push('fa-clipboard-check', '核验与整理', '交叉核验结果一致性，排除与岗位口径冲突的噪声', { tag: '质检' });
    push('fa-flag-checkered', '交付结果', '按岗位产出规范整理成果，完成本轮任务', { tag: '完成' });
    return steps;
  },

  async run() {
    if (this.running || !this.agent) return;
    const task = this.el('test-task').value.trim();
    if (!task) {
      Toast.warning('请先输入要执行的任务，或点击上方示例任务。');
      this.el('test-task').focus();
      return;
    }

    this.running = true;
    const runBtn = this.el('test-run-btn');
    runBtn.disabled = true;
    runBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> 执行中...';
    this.el('test-result-state').textContent = '';
    this.el('test-result-body').style.display = 'none';
    this.el('test-result-placeholder').style.display = '';
    this.el('test-stats').style.display = 'none';

    const steps = this.buildSteps(task);
    const listEl = this.el('test-exec-list');
    const phEl = this.el('test-exec-placeholder');
    phEl.style.display = 'none';
    listEl.style.display = '';
    listEl.innerHTML = steps.map((s, i) => `
      <div class="ag-exec-step pending" id="exec-step-${i}">
        <div class="ag-exec-node"><i class="fa-solid ${s.icon}"></i></div>
        <div class="ag-exec-body">
          <div class="ag-exec-title">${s.title}${s.tag ? `<span class="ag-exec-tag">${s.tag}</span>` : ''}</div>
          <div class="ag-exec-desc">${s.desc || ''}</div>
        </div>
        <div class="ag-exec-state"><span class="ag-exec-state-ico"></span></div>
      </div>`).join('');

    const startTime = Date.now();
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const toolCount = steps.filter(s => s.tag === 'MCP').length;

    for (let i = 0; i < steps.length; i++) {
      const row = document.getElementById('exec-step-' + i);
      if (!row) continue;
      row.classList.remove('pending');
      row.classList.add('running');
      row.querySelector('.ag-exec-state-ico').className = 'ag-exec-state-ico fa-solid fa-circle-notch fa-spin';
      const base = 420 + Math.random() * 420;
      await sleep(base);
      row.classList.remove('running');
      row.classList.add('done');
      row.querySelector('.ag-exec-state-ico').className = 'ag-exec-state-ico fa-solid fa-circle-check';
      this.el('test-exec-meta').textContent = `步骤 ${i + 1}/${steps.length}`;
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    this.renderResult(task, steps, elapsed, toolCount);
    this.running = false;
    runBtn.disabled = false;
    runBtn.innerHTML = '<i class="fa-solid fa-play"></i> 运行测试';
    this.el('test-exec-meta').textContent = `共 ${steps.length} 步 · 耗时 ${elapsed}s`;
    Toast.success('任务执行完成，岗位已产出结果。');
  },

  /* ==================== 最终结果（演示产物） ==================== */

  renderResult(task, steps, elapsed, toolCount) {
    const body = this.el('test-result-body');
    const a = this.agent;
    const catM = AGENT_CATEGORY_META[a.category] || AGENT_CATEGORY_META['通用助手'];

    const result = this.produce(task);
    const usedSkills = (this.meta && this.meta.skills || []).map(s => s.name);
    const usedTools = (this.meta && this.meta.tools || []).slice(0, 2).map(t => t.name);
    const usedKbs = (this.meta && this.meta.kbs || []).map(k => k.name);

    body.innerHTML = `
      <div class="ag-result-summary">
        <div class="ag-result-avatar" style="--cat:${catM.color}"><i class="fa-solid ${catM.icon}"></i></div>
        <div>
          <div class="ag-result-verdict">${result.verdict}</div>
          <div class="ag-result-task">${escapeHtml(task)}</div>
        </div>
      </div>
      <div class="ag-result-section">
        <div class="ag-result-sec-title"><i class="fa-solid fa-list-check"></i> 结论</div>
        <p>${result.conclusion}</p>
      </div>
      <div class="ag-result-section">
        <div class="ag-result-sec-title"><i class="fa-solid fa-box-archive"></i> 交付物</div>
        ${result.artifacts.map(art => `<div class="ag-result-art">
          <span class="ag-result-art-name"><i class="fa-solid ${art.icon}"></i>${escapeHtml(art.name)}</span>
          <span class="ag-result-art-val">${escapeHtml(art.value)}</span>
        </div>`).join('')}
      </div>
      <div class="ag-result-section">
        <div class="ag-result-sec-title"><i class="fa-solid fa-pen-ruler"></i> 产出样例</div>
        <pre class="ag-result-pre">${escapeHtml(result.sample)}</pre>
      </div>
      <div class="ag-result-section">
        <div class="ag-result-sec-title"><i class="fa-solid fa-route"></i> 执行轨迹</div>
        <div class="ag-result-trail">
          ${(usedSkills.length ? '<span><i class="fa-solid fa-puzzle-piece"></i>Skill：' + usedSkills.map(escapeHtml).join('、') + '</span>' : '')}
          ${(usedKbs.length ? '<span><i class="fa-solid fa-book-open"></i>知识库：' + usedKbs.map(escapeHtml).join('、') + '</span>' : '')}
          ${(usedTools.length ? '<span><i class="fa-solid fa-wrench"></i>工具：' + usedTools.map(escapeHtml).join('、') + '</span>' : '')}
          <span><i class="fa-solid fa-microchip"></i>模型：${escapeHtml((this.meta && this.meta.modelName) || '—')}</span>
        </div>
      </div>`;

    this.el('test-result-placeholder').style.display = 'none';
    body.style.display = '';
    this.el('test-result-state').textContent = '已交付';
    this.el('test-result-state').classList.add('done');

    const statsEl = this.el('test-stats');
    statsEl.style.display = '';
    statsEl.innerHTML = `
      <div class="ag-stat"><b>${steps.length}</b><span>执行步骤</span></div>
      <div class="ag-stat"><b>${toolCount}</b><span>工具调用</span></div>
      <div class="ag-stat"><b>${elapsed}s</b><span>总耗时</span></div>
      <div class="ag-stat"><b>${escapeHtml(this.agent.version || 'v1.0')}</b><span>版本</span></div>`;
    void this.agent.settings;
  },

  produce(task) {
    const a = this.agent;
    const name = a.name;
    const cat = a.category;
    const verdict = `「${a.roleName || name}」已完成任务交付`;
    const keywords = this.pickKeywords(task);

    if (cat === '数据分析') {
      return {
        verdict,
        conclusion: `围绕“${keywords || '目标数据'}”，已完成波动识别与趋势研判：整体平稳，近期 ${keywords || '数据'} 呈现小幅上行，识别到 2 处需关注的异常区间，已结合业务口径给出解释与建议。`,
        artifacts: [
          { icon: 'fa-chart-line', name: '趋势结论', value: '3个周期环比均值 +4.6%' },
          { icon: 'fa-triangle-exclamation', name: '异常点', value: '2 处（已标注原因）' },
          { icon: 'fa-file-lines', name: '分析说明', value: '附完整说明文档' }
        ],
        sample: '结论摘要：\n- 趋势：稳定上行，波动收敛\n- 异常：2026-07 区域Y 触发告警，原因为口径切换\n- 建议：继续按周观察，下周复核'
      };
    }
    if (cat === '数据运营') {
      return {
        verdict,
        conclusion: `对“${keywords || '本期数据资产'}”完成盘点与运营梳理：共核验 ${4 + Math.floor(Math.random() * 20)} 项资产，输出可运营清单与分级建议，识别出 ${2 + Math.floor(Math.random() * 3)} 项高价值低利用资产并给出激活方案。`,
        artifacts: [
          { icon: 'fa-clipboard-list', name: '资产清单', value: '已按目录整理输出' },
          { icon: 'fa-ranking-star', name: '优先级', value: 'P1×3 / P2×5 / P3×n' },
          { icon: 'fa-lightbulb', name: '运营动作', value: '3 项建议已生成' }
        ],
        sample: '运营动作清单：\n1. P1 热点资产：进入下月推广排期\n2. 命名补全：12 个目录项待更新\n3. 调用监控：对 3 项高价值资产配置预警'
      };
    }
    if (cat === '业务服务') {
      return {
        verdict,
        conclusion: `对“${keywords || '本次申请/资料'}”完成岗位口径核验：主体资质与字段完备性符合要求，发现 ${1 + Math.floor(Math.random() * 2)} 处待补正项，已同步反馈处理意见。`,
        artifacts: [
          { icon: 'fa-circle-check', name: '核验结论', value: '通过（附条件）' },
          { icon: 'fa-pen', name: '补正项', value: '待补充说明材料' },
          { icon: 'fa-stamp', name: '处理状态', value: '已流转至下一环节' }
        ],
        sample: '核验记录：\n- 主体资格：符合\n- 字段口径：与元数据一致\n- 合规性：需补充授权范围说明后放行'
      };
    }
    if (cat === '数据治理') {
      return {
        verdict,
        conclusion: `对“${keywords || '目标数据资源'}”完成标准编目与合规检查：分类、命名与描述符合编目规范，字段口径已按标准核验，形成可入库的目录条目。`,
        artifacts: [
          { icon: 'fa-folder-tree', name: '建议分类', value: '业务数据 · 经营分析' },
          { icon: 'fa-tags', name: '标签', value: '经营、月报、企业资产' },
          { icon: 'fa-file-signature', name: '规范核验', value: '通过（命名合规）' }
        ],
        sample: '编目产出：\n名称：企业资产经营月报\n分类：业务数据 / 经营分析\n标签：经营 月报 企业资产\n描述：按标准口径补全后的资源说明\n字段：共 18 项，命名合规'
      };
    }
    return {
      verdict,
      conclusion: `已按岗位口径完成“${keywords || '该任务'}”的处理与梳理，形成要点化、可分发的成果交付。`,
      artifacts: [
        { icon: 'fa-list-check', name: '要点提炼', value: '结构化输出完成' },
        { icon: 'fa-paperclip', name: '依据', value: '已引用平台知识与口径' },
        { icon: 'fa-share-nodes', name: '分发形态', value: '可对外分发的摘要' }
      ],
      sample: '整理结果：\n- 已完成要点结构化\n- 依据来源均已标注\n- 可按模板分发'
    };
  },

  /* 从任务文本中提取一个指代对象作为“主角” */
  pickKeywords(task) {
    const m = task.match(/「([^」]+)」/);
    if (m) return m[1];
    const m2 = task.match(/[一-龥A-Za-z0-9]{2,12}\.(xlsx|csv|json|docx|xls)/);
    if (m2) return m2[0];
    const cut = task.replace(/[，。,.、对进行\s]+/g, ' ').trim();
    return cut ? cut.split(' ')[0].slice(0, 8) : '';
  }
};

window.AgentTestPage = AgentTestPage;
