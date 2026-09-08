/* =====================================================
   AI Capability Open Platform - Skill 详情页
   页签：概览 / 能力配置 / 执行规则 / 输入输出 / 测试记录 / 版本记录 / 使用情况
   ===================================================== */

const SkillDetail = {
  id: null,
  skill: null,
  tab: 'overview',

  init() {
    const q = new URLSearchParams(window.location.search);
    this.id = q.get('id');
    const tab = q.get('tab');
    this.skill = this.id ? SkillStore.get(this.id) : null;

    if (!this.skill) {
      document.getElementById('detail-missing').classList.remove('hidden');
      return;
    }

    document.getElementById('detail-main').classList.remove('hidden');
    document.getElementById('detail-top').classList.remove('hidden');
    document.getElementById('detail-title').textContent = this.skill.name;
    document.getElementById('detail-sub').textContent = `Skill · ${this.skill.code || ''}`;

    this.fillHeader();
    this.renderHeadActions();
    this.refreshBadges();

    const valid = ['overview', 'config', 'rules', 'io', 'tests', 'versions'];
    this.setTab(valid.indexOf(tab) >= 0 ? tab : 'overview');
  },

  /* ---------- 头部 ---------- */
  fillHeader() {
    const s = this.skill;
    document.getElementById('d-name').textContent = s.name;
    document.getElementById('d-status').innerHTML = statusPill(s.status);
    document.getElementById('d-version').innerHTML = (s.publishedAt || (s.versions || []).length)
      ? `<span class="sk-ver-chip"><i class="fa-solid fa-tag"></i> ${escapeHtml(s.version || '')}</span>`
      : '<span class="sk-ver-chip">未发布</span>';
    document.getElementById('d-type').textContent = s.type || '—';
    document.getElementById('d-desc').textContent = s.description || '该 Skill 暂无能力说明。';

    const fields = [
      ['fa-barcode', `编码：${escapeHtml(s.code || '—')}`],
      ['fa-user', `发布人：${escapeHtml(s.publisher || '—')}`],
      ['fa-clock', `最近更新：${escapeHtml(fmtDateTime(s.updatedAt) || '—')}`]
    ];
    if (s.publishedAt) fields.push(['fa-rocket', `发布于：${escapeHtml(fmtDateTime(s.publishedAt))}`]);
    document.getElementById('d-meta').innerHTML = fields.map(([ic, tx]) => `<span><i class="fa-solid ${ic}"></i>${tx}</span>`).join('');
  },

  renderHeadActions() {
    const s = this.skill;
    const used = (s.agentIds || []).length > 0;
    const canDelete = !used; // 未被 Agent 使用即可删除（含已发布），被使用则仅可停用
    const btns = [];

    if (s.status === 'published') {
      btns.push(`<button class="btn btn-primary" onclick="SkillDetail.editSkill()"><i class="fa-solid fa-code-branch"></i> 新建版本</button>`);
    } else {
      btns.push(`<button class="btn btn-primary" onclick="SkillDetail.editSkill()"><i class="fa-regular fa-pen-to-square"></i> 编辑</button>`);
    }
    btns.push(`<button class="btn btn-secondary" onclick="SkillDetail.copySkill()"><i class="fa-regular fa-copy"></i> 复制</button>`);

    if (s.status === 'stopped') {
      btns.push(`<button class="btn btn-success" onclick="SkillDetail.enableSkill()"><i class="fa-solid fa-play"></i> 启用</button>`);
    } else {
      btns.push(`<button class="btn btn-warning" onclick="SkillDetail.stopSkill()"><i class="fa-solid fa-pause"></i> 停用</button>`);
    }
    if (canDelete) {
      btns.push(`<button class="btn btn-danger" onclick="SkillDetail.delSkill()"><i class="fa-regular fa-trash-can"></i> 删除</button>`);
    }
    document.getElementById('head-actions').innerHTML = btns.join('');
  },

  refreshBadges() {
    const s = this.skill;
    const testCnt = SkillStore.testRecordsOf(this.id).length;
    const verCnt = (s.versions || []).length;
    document.getElementById('badge-tests').textContent = testCnt;
    document.getElementById('badge-versions').textContent = verCnt;
  },

  /* ---------- 操作 ---------- */
  goList() { window.location.href = 'skill.html'; },

  editSkill() { window.location.href = `skill-create.html?id=${this.id}`; },

  copySkill() {
    const copied = SkillStore.copy(this.id);
    if (!copied) { Toast.danger('复制失败'); return; }
    Toast.success(`已复制生成「${copied.name}」草稿`, '复制成功');
    setTimeout(() => { window.location.href = `skill-create.html?id=${copied.id}&justCopied=1`; }, 700);
  },

  stopSkill() {
    const s = this.skill;
    const agents = (s.agentIds || []).map(aid => SkillLookup.agentById(aid)).filter(Boolean);
    const usedText = agents.length
      ? `该 Skill 当前已被 ${agents.length} 个 Agent 使用（${agents.map(a => a.name).join('、')}），停用后相关 Agent 可能无法正常执行。是否继续？`
      : '停用后，该 Skill 将不再作为可调用能力对外提供。是否继续？';
    Modal.confirm({
      title: '停用 Skill',
      message: usedText,
      type: 'warning',
      confirmText: '确认停用',
      onConfirm: () => {
        s.status = 'stopped';
        s.updatedAt = fmtNow();
        SkillStore.upsert(s);
        Toast.warning(`「${s.name}」已停用`);
        this.skill = SkillStore.get(this.id);
        this.fillHeader(); this.renderHeadActions(); this.setTab(this.tab);
      }
    });
  },

  enableSkill() {
    const s = this.skill;
    Modal.confirm({
      title: '启用 Skill',
      message: `启用后，「${s.name}」将恢复为可调用能力。是否继续？`,
      type: 'success',
      confirmText: '确认启用',
      onConfirm: () => {
        s.status = 'published';
        s.updatedAt = fmtNow();
        SkillStore.upsert(s);
        Toast.success(`「${s.name}」已启用`);
        this.skill = SkillStore.get(this.id);
        this.fillHeader(); this.renderHeadActions(); this.setTab(this.tab);
      }
    });
  },

  delSkill() {
    const s = this.skill;
    Modal.confirm({
      title: '删除 Skill',
      message: `确定删除「${s.name}」吗？删除后不可恢复。`,
      type: 'danger',
      confirmText: '确认删除',
      onConfirm: () => {
        SkillStore.remove(s.id);
        Toast.success('Skill 已删除');
        window.location.href = 'skill.html';
      }
    });
  },

  /* ---------- 页签切换 ---------- */
  setTab(name) {
    this.tab = name;
    document.querySelectorAll('.sk-detail-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === name);
    });
    const renderers = {
      overview: this.renderOverview.bind(this),
      config: this.renderConfig.bind(this),
      rules: this.renderRules.bind(this),
      io: this.renderIo.bind(this),
      tests: this.renderTests.bind(this),
      versions: this.renderVersions.bind(this)
    };
    const body = document.getElementById('detail-body');
    body.innerHTML = '<div class="fade-in">' + (renderers[name] ? renderers[name]() : '') + '</div>';
    body.scrollTop = 0;
  },

  /* =============================================
     概览
     ============================================= */
  renderOverview() {
    const s = this.skill;
    const meta = resolveSkillMeta(s);
    const goal = (s.goal || (s.rules && s.rules.taskGoal) || '');
    const verCount = (s.versions || []).length;

    const info = (k, v) => `<div class="sk-kv-item"><div class="sk-kv-label">${k}</div><div class="sk-kv-value">${v}</div></div>`;

    return `
      <div class="sk-grid-2">
        <div class="sk-mini-card lead">
          <div class="sk-mini-label"><i class="fa-solid fa-bullseye"></i> 能力目标</div>
          <div class="sk-desc-block">${escapeHtml(goal || '尚未填写能力目标')}</div>
          <div class="sk-mini-label" style="margin-top: var(--space-4);"><i class="fa-regular fa-note-sticky"></i> 能力说明</div>
          <div class="sk-desc-block">${escapeHtml(s.description || '—')}</div>
        </div>
        <div>
          <div class="sk-mini-card">
            <div class="sk-mini-label"><i class="fa-solid fa-fingerprint"></i> 基本信息</div>
            ${info('Skill 编码', `<span class="sk-code-mono">${escapeHtml(s.code)}</span>`)}
            ${info('Skill 类型', s.type || '—')}
            ${info('当前状态', statusPill(s.status))}
            ${info('创建时间', fmtDateTime(s.createdAt))}
            ${info('最近更新', fmtDateTime(s.updatedAt))}
            ${s.publisher ? info('最后发布人', escapeHtml(s.publisher)) : ''}
          </div>
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-4);margin-top:var(--space-4);">
        <div class="sk-mini-card" style="flex:1;min-width:220px;">
          <div class="sk-mini-label"><i class="fa-solid fa-boxes-stacked"></i> 版本信息</div>
          <div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap;">
            ${s.versions && s.versions.length ? s.versions.slice(0, 2).map(v => `
              <span class="sk-ver-state ${v.state === 'current' ? 'current' : 'history'}">${escapeHtml(v.version)} · ${v.state === 'current' ? '当前版本' : '历史版本'}</span>`).join('')
            : '<span class="sk-ver-state history">未发布</span>'}
            <span class="muted-text">共 ${verCount} 个版本</span>
          </div>
        </div>
        <div class="sk-mini-card" style="flex:1;min-width:220px;">
          <div class="sk-mini-label"><i class="fa-solid fa-diagram-project"></i> 能力链路</div>
          <div style="display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;font-size:12px;color:var(--color-text-secondary);">
            <span class="sk-type-tag">${escapeHtml(meta.modelName)}</span>
            <i class="fa-solid fa-arrow-right" style="font-size:10px;color:var(--color-text-muted);"></i>
            <span class="sk-type-tag" style="background:var(--color-info-light);color:var(--color-info-dark);">${escapeHtml(s.name)}</span>
            ${meta.agentCount ? `<i class="fa-solid fa-arrow-right" style="font-size:10px;color:var(--color-text-muted);"></i><span class="sk-type-tag" style="background:var(--color-success-light);color:var(--color-success-dark);">${meta.agentCount} 个 Agent</span>` : ''}
          </div>
          <div class="sk-help-note" style="margin-top:8px;">Skill 是可复用单元：同一 Skill 可被多个 Agent 调用，用于不同的岗位角色。</div>
        </div>
      </div>`;
  },

  /* =============================================
     能力配置
     ============================================= */
  renderConfig() {
    const s = this.skill;
    const meta = resolveSkillMeta(s);
    const model = meta.model;
    const prompt = meta.prompt;

    const cardLabel = (ic, tx) => `<div class="sk-mini-label"><i class="fa-solid ${ic}"></i> ${tx}</div>`;
    const info = (k, v) => `<div class="sk-kv-item"><div class="sk-kv-label">${k}</div><div class="sk-kv-value">${v}</div></div>`;
    const tgs = (arr, extra) => (arr.length ? arr.map(x => `<span class="tg">${escapeHtml(x)}</span>`).join('') : (extra || ''));

    let html = `
      <div class="sk-grid-2">
        <div class="sk-mini-card">
          ${cardLabel('fa-microchip', '执行模型')}
          ${model ? info('模型名称', escapeHtml(model.name) + ' <span class="sk-version-text">' + escapeHtml(model.version) + '</span>')
            : info('模型名称', '<span class="muted-text">未选择</span>')}
          ${model ? info('供应商', escapeHtml(model.vendor)) : ''}
          ${model ? info('上下文窗口', escapeHtml(model.contextLength)) : ''}
          ${model ? `<div class="sk-kv-item"><div class="sk-kv-label">模型能力</div><div class="sk-kv-value"><div class="sk-tag-cloud">${tgs(model.capabilities)}</div></div></div>` : ''}
        </div>
        <div class="sk-mini-card">
          ${cardLabel('fa-terminal', '指令模板（Prompt）')}
          ${prompt ? info('模板名称', escapeHtml(prompt.name) + ' <span class="sk-version-text">' + escapeHtml(prompt.version) + '</span>') : info('模板名称', '<span class="muted-text">未选择</span>')}
          ${prompt ? info('所属分类', escapeHtml(prompt.category || '—')) : ''}
          ${prompt ? info('最近更新', escapeHtml(prompt.updatedAt || '—')) : ''}
        </div>
      </div>

      <div class="sk-mini-card" style="margin-top: var(--space-4);">
        ${cardLabel('fa-book-open', '关联知识库')}
        ${meta.kbs.length
          ? `<div class="sk-tag-cloud">${meta.kbs.map(k => `<span class="tg" style="background:var(--color-bg-alt);color:var(--color-text-secondary);">${escapeHtml(k.name)} · ${k.docCount} 篇</span>`).join('')}</div>`
          : '<div class="muted-text">未关联知识库，执行时仅依赖模型自身知识。</div>'}
      </div>

      <div class="sk-mini-card" style="margin-top: var(--space-4);">
        ${cardLabel('fa-plug', 'MCP 工具授权')}
        ${s.declareNoTool
          ? `<span class="sk-notool-tag">已声明无需工具</span> <span class="muted-text">执行时仅靠模型与知识库完成任务。</span>`
          : (meta.tools.length
            ? `<div class="sk-tag-cloud">${meta.tools.map(t => `<span class="tg" style="background:var(--color-info-light);color:var(--color-info-dark);" title="${escapeHtml(t.desc || '')}">${escapeHtml(t.displayName)}</span>`).join('')}</div>
               <div class="sk-help-note" style="margin-top:8px;">授权精确到具体工具，Agent 将按任务需要自主选择调用。</div>`
            : '<div class="muted-text">尚未授权工具，发布前需完成工具授权或声明无需工具。</div>')}
      </div>`;
    return html;
  },

  /* =============================================
     执行规则
     ============================================= */
  renderRules() {
    const s = this.skill;
    const rules = s.rules || {};
    const principles = (rules.principles || []).filter(x => x && x.trim());
    const constraints = (rules.constraints || []).filter(x => x && x.trim());
    const blockHead = (ic, tx) => `<div class="sk-rule-head"><i class="fa-solid ${ic}"></i> ${tx}</div>`;

    let html = `
      <div class="sk-rule-block">
        ${blockHead('fa-bullseye', '任务目标')}
        <div class="sk-desc-block">${escapeHtml(rules.taskGoal || '尚未填写任务目标。')}</div>
        <div class="sk-help-note" style="margin-top:8px;">Agent 依据任务目标决定如何组织资源完成任务——Skill 不限定执行步骤。</div>
      </div>

      <div class="sk-rule-block">
        ${blockHead('fa-list-check', '工作原则')}
        ${principles.length ? `<ol class="sk-ol">${principles.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ol>`
          : '<div class="muted-text">未填写工作原则。</div>'}
      </div>

      <div class="sk-rule-block">
        ${blockHead('fa-shield-halved', '约束规则（红线）')}
        ${constraints.length ? `<ul class="sk-ul">${constraints.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>`
          : '<div class="muted-text">未填写约束规则。</div>'}
      </div>`;
    return html;
  },

  /* =============================================
     输入输出
     ============================================= */
  renderIo() {
    const s = this.skill;
    const blockHead = (ic, tx) => `<div class="sk-rule-head"><i class="fa-solid ${ic}"></i> ${tx}</div>`;

    let html = `<div class="sk-rule-block">${blockHead('fa-arrow-right-to-bracket', '输入参数')}`;
    if (s.inputMode === 'json' && (s.inputJson || '').trim()) {
      html += `<div class="sk-kv-label" style="margin-bottom:6px;">JSON Schema</div><div class="sk-json">${escapeHtml(s.inputJson)}</div>`;
    } else if ((s.inputs || []).length) {
      html += `<table class="sk-io-table">
        <thead><tr><th>参数名</th><th>类型</th><th>必填</th><th>说明</th><th>示例</th></tr></thead>
        <tbody>${s.inputs.map(i => `<tr>
          <td class="mono">${escapeHtml(i.key)}</td>
          <td><span class="sk-code-mono">${escapeHtml(i.type || 'String')}</span></td>
          <td>${i.required ? '<span class="sk-req-badge yes">必填</span>' : '<span class="sk-req-badge no">可选</span>'}</td>
          <td>${escapeHtml(i.desc || '—')}</td>
          <td class="mono">${escapeHtml(i.example || '—')}</td>
        </tr>`).join('')}</tbody></table>`;
    } else {
      html += '<div class="muted-text">未配置输入参数。</div>';
    }
    html += `</div>`;

    html += `<div class="sk-rule-block">${blockHead('fa-arrow-right-from-bracket', '输出参数')}`;
    if (s.outputMode === 'json' && (s.outputJson || '').trim()) {
      html += `<div class="sk-kv-label" style="margin-bottom:6px;">JSON Schema</div><div class="sk-json">${escapeHtml(s.outputJson)}</div>`;
    }
    if ((s.outputs || []).length) {
      html += `<table class="sk-io-table" style="${s.outputMode === 'json' ? 'margin-top:var(--space-4);' : ''}">
        <thead><tr><th>字段名</th><th>类型</th><th>说明</th></tr></thead>
        <tbody>${s.outputs.map(o => `<tr>
          <td class="mono">${escapeHtml(o.name)}</td>
          <td><span class="sk-code-mono">${escapeHtml(o.type || 'String')}</span></td>
          <td>${escapeHtml(o.desc || '—')}</td>
        </tr>`).join('')}</tbody></table>`;
    } else if (!(s.outputMode === 'json' && (s.outputJson || '').trim())) {
      html += '<div class="muted-text">未配置输出参数。</div>';
    }
    if (s.outputSample) {
      html += `<div class="sk-kv-label" style="margin: var(--space-4) 0 6px;">输出结果示例</div><div class="sk-json">${escapeHtml(s.outputSample)}</div>`;
    }
    html += `</div>`;
    return html;
  },

  /* =============================================
     在线测试
     ============================================= */
  renderTests() {
    const s = this.skill;
    const inputs = s.inputs || [];
    const outputs = s.outputs || [];
    const hasInputForm = s.inputMode !== 'json' && inputs.length > 0;
    const hasInputJson = !!(s.inputJson || '').trim();
    const hasOutputJson = !!(s.outputJson || '').trim();

    const inputRows = hasInputForm ? inputs.map(i => `
      <div class="sk-test-field">
        <label class="sk-test-label">
          ${escapeHtml(i.label || i.key)}
          ${i.required ? '<span class="sk-req-badge yes">必填</span>' : '<span class="sk-req-badge no">可选</span>'}
        </label>
        <input type="text" class="sk-test-input" id="tinp-${escapeHtml(i.key)}"
          placeholder="${escapeHtml(i.example || i.desc || i.key)}"
          data-key="${escapeHtml(i.key)}" data-type="${escapeHtml(i.type || 'String')}">
        <div class="sk-test-hint">${escapeHtml(i.desc || '')}</div>
      </div>`).join('') : '';

    const outputRows = outputs.map(o => `
      <div class="sk-test-out-field" id="tout-${escapeHtml(o.name)}">
        <div class="sk-test-out-label">${escapeHtml(o.name)} <span class="sk-code-mono" style="font-size:11px;">${escapeHtml(o.type || 'String')}</span></div>
        <div class="sk-test-out-value muted-text">等待执行...</div>
      </div>`).join('');

    const recentRecords = SkillStore.testRecordsOf(this.id).slice(0, 3);

    return `
      <div class="sk-test-panel">
        <!-- 左侧：输入区 -->
        <div class="sk-test-left">
          <div class="sk-test-section-title"><i class="fa-solid fa-arrow-right-to-bracket"></i> 输入参数</div>
          ${hasInputForm ? `
            <div class="sk-test-inputs">${inputRows}</div>
          ` : hasInputJson ? `
            <div class="sk-test-json-hint">
              <div class="sk-kv-label" style="margin-bottom:6px;">输入 JSON</div>
              <div class="sk-json" style="font-size:12px;">${escapeHtml(s.inputJson)}</div>
              <div class="sk-help-note" style="margin-top:8px;">该 Skill 使用 JSON 模式输入，请在下方直接编辑 JSON。</div>
            </div>
          ` : `
            <div class="muted-text" style="padding:12px 0;">该 Skill 暂无输入参数配置。</div>
          `}

          <div class="sk-test-json-area">
            <div class="sk-test-section-title"><i class="fa-solid fa-code"></i> 请求体（JSON）</div>
            <textarea class="sk-test-textarea" id="test-request-json" rows="6" placeholder='{"key": "value"}'>${hasInputJson ? escapeHtml(s.inputJson) : ''}</textarea>
          </div>

          <div class="sk-test-actions">
            <button class="btn btn-primary" id="btn-run-test" onclick="SkillDetail.runTest()">
              <i class="fa-solid fa-play"></i> 执行测试
            </button>
            <button class="btn btn-secondary" onclick="SkillDetail.resetTest()">
              <i class="fa-solid fa-rotate-left"></i> 重置
            </button>
          </div>

          <!-- 最近测试记录 -->
          ${recentRecords.length ? `
            <div class="sk-test-section-title" style="margin-top:var(--space-5);"><i class="fa-solid fa-clock-rotate-left"></i> 最近测试</div>
            ${recentRecords.map(r => {
              const ok = r.status === 'success';
              return `<div class="sk-test-record-mini" onclick="SkillDetail.loadRecord('${r.id}')">
                <span class="sk-dot ${ok ? 'ok' : 'fail'}"></span>
                <span class="sk-test-record-scenario">${escapeHtml(r.scenario || '测试')}</span>
                <span class="muted-text" style="font-size:11px;">${fmtDateTime(r.ranAt)}</span>
              </div>`;
            }).join('')}
          ` : ''}
        </div>

        <!-- 右侧：输出区 -->
        <div class="sk-test-right">
          <div class="sk-test-section-title"><i class="fa-solid fa-arrow-right-from-bracket"></i> 执行结果</div>
          <div id="test-result-area">
            ${outputs.length ? `<div class="sk-test-out-grid">${outputRows}</div>` : '<div class="muted-text">该 Skill 暂无输出参数定义。</div>'}
          </div>

          <div id="test-result-raw" class="sk-test-raw hidden">
            <div class="sk-test-section-title" style="margin-top:var(--space-4);"><i class="fa-solid fa-code"></i> 原始响应</div>
            <pre class="sk-json" id="test-raw-content"></pre>
          </div>

          <div id="test-result-error" class="sk-test-error hidden">
            <div class="sk-test-section-title" style="margin-top:var(--space-4);color:var(--color-danger-dark);"><i class="fa-solid fa-circle-exclamation"></i> 执行异常</div>
            <div class="sk-test-error-msg" id="test-error-content"></div>
          </div>
        </div>
      </div>`;
  },

  runTest() {
    const s = this.skill;
    const requestJson = document.getElementById('test-request-json');
    if (!requestJson) return;
    let requestData = null;
    try {
      const raw = requestJson.value.trim();
      if (raw) {
        requestData = JSON.parse(raw);
        // 如果有表单输入，同步填充到 JSON
        (s.inputs || []).forEach(i => {
          const inp = document.getElementById('tinp-' + i.key);
          if (inp && inp.value.trim()) {
            const v = i.type === 'Integer' || i.type === 'Number' ? Number(inp.value) : inp.value;
            requestData[i.key] = v;
          }
        });
        requestJson.value = JSON.stringify(requestData, null, 2);
      }
    } catch (e) {
      Toast.danger('请求 JSON 格式错误：' + e.message);
      return;
    }

    const btn = document.getElementById('btn-run-test');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 执行中...'; }

    setTimeout(() => {
      const outputs = s.outputs || [];
      const ok = true;
      const mockResult = {};

      if (s.code === 'data-cataloging' || (s.name || '').includes('编目')) {
        Object.assign(mockResult, {
          resourceId: requestData && requestData.resourceId || 'R20260001',
          resourceName: '企业登记信息',
          description: '反映企业登记注册相关信息的数据资源，包含企业基本信息、注册资本、经营范围与登记状态等字段。',
          categoryCode: '01',
          categoryName: '法人数据',
          tags: ['企业', '登记', '工商'],
          updateFrequency: '每日',
          confidence: 0.94
        });
      } else if (requestData) {
        outputs.forEach(o => {
          if (o.name === 'resourceName') mockResult[o.name] = requestData.resourceId ? '数据资源示例' : '—';
          else if (o.name === 'summary') mockResult[o.name] = '这是一条摘要生成结果示例。';
          else if (o.name === 'qualityScore') mockResult[o.name] = 0.87;
          else if (o.name === 'passRate') mockResult[o.name] = 0.92;
          else mockResult[o.name] = o.type === 'Number' ? 0 : o.type === 'Array' ? [] : '—';
        });
      }

      outputs.forEach(o => {
        const el = document.getElementById('tout-' + o.name);
        if (el) {
          const val = mockResult[o.name] !== undefined ? mockResult[o.name] : '—';
          const valStr = typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
          el.querySelector('.sk-test-out-value').outerHTML = `<div class="sk-test-out-value">${escapeHtml(valStr)}</div>`;
        }
      });

      const rawEl = document.getElementById('test-raw-content');
      if (rawEl) rawEl.textContent = JSON.stringify(mockResult, null, 2);
      const rawWrap = document.getElementById('test-result-raw');
      if (rawWrap) rawWrap.classList.remove('hidden');

      const errWrap = document.getElementById('test-result-error');
      if (errWrap) errWrap.classList.add('hidden');

      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-play"></i> 执行测试'; }

      SkillStore.addTestRecord({
        skillId: this.id,
        scenario: s.name,
        status: 'success',
        message: '执行成功',
        costMs: 2100,
        ranAt: fmtNow()
      });
      this.refreshBadges();
      Toast.success('测试执行成功');
    }, 1500);
  },

  resetTest() {
    const s = this.skill;
    const requestJson = document.getElementById('test-request-json');
    if (requestJson) requestJson.value = s.inputJson || '';

    (s.inputs || []).forEach(i => {
      const inp = document.getElementById('tinp-' + i.key);
      if (inp) inp.value = '';
    });

    (s.outputs || []).forEach(o => {
      const el = document.getElementById('tout-' + o.name);
      if (el) el.querySelector('.sk-test-out-value').outerHTML = `<div class="sk-test-out-value muted-text">等待执行...</div>`;
    });

    const rawWrap = document.getElementById('test-result-raw');
    if (rawWrap) rawWrap.classList.add('hidden');
    const errWrap = document.getElementById('test-result-error');
    if (errWrap) errWrap.classList.add('hidden');
  },

  loadRecord(recId) {
    const records = SkillStore.testRecordsOf(this.id);
    const r = records.find(x => x.id === recId);
    if (!r) return;
    Toast.info('加载历史记录（仅作展示）');
    this.setTab('tests');
  },

  /* =============================================
     版本记录
     ============================================= */
  renderVersions() {
    const s = this.skill;
    const versions = (s.versions || []).slice().sort((a, b) => {
      if (a.state === 'current') return -1;
      if (b.state === 'current') return 1;
      return (b.publishedAt || '').localeCompare(a.publishedAt || '');
    });
    this._vers = versions;

    if (!versions.length) {
      return `<div class="empty-state" style="padding: 56px 16px;">
        <div class="empty-state-icon"><i class="fa-solid fa-tag"></i></div>
        <div class="empty-state-title">暂无版本记录</div>
        <div class="empty-state-desc">该 Skill 尚未发布。发布后将在此生成版本快照，历史版本可随时查看与追溯。</div>
        <div class="empty-state-action">
          <button class="btn btn-primary" onclick="SkillDetail.editSkill()"><i class="fa-solid fa-rocket"></i> 去发布</button>
        </div>
      </div>`;
    }

    return `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);margin-bottom:var(--space-4);">
        <span class="muted-text">共 ${versions.length} 个版本，历史版本不可直接修改，可通过「新建版本」迭代。</span>
        ${s.status === 'published' ? `<button class="btn btn-primary btn-sm" onclick="SkillDetail.editSkill()"><i class="fa-solid fa-code-branch"></i> 新建版本</button>` : ''}
      </div>
      <table class="sk-ver-table">
        <thead><tr><th>版本</th><th>状态</th><th>发布时间</th><th>发布人</th><th>变更说明</th><th style="width:110px;">操作</th></tr></thead>
        <tbody>${versions.map((v, i) => `<tr>
          <td><span class="sk-code-mono" style="font-size:13px;">${escapeHtml(v.version || '—')}</span></td>
          <td><span class="sk-ver-state ${v.state === 'current' ? 'current' : 'history'}">${v.state === 'current' ? '当前版本' : '历史版本'}</span></td>
          <td>${escapeHtml(fmtDateTime(v.publishedAt))}</td>
          <td>${escapeHtml(v.publisher || '—')}</td>
          <td style="color:var(--color-text-secondary);">${escapeHtml(v.changeNote || '—')}</td>
          <td>${v.snapshot ? `<button class="btn btn-secondary btn-sm" onclick="SkillDetail.viewSnapshotIndex(${i})"><i class="fa-regular fa-eye"></i> 查看快照</button>` : '<span class="muted-text">—</span>'}</td>
        </tr>`).join('')}</tbody>
      </table>`;
  },

  viewSnapshotIndex(i) {
    const v = (this._vers || [])[i];
    if (!v || !v.snapshot) { Toast.danger('该版本未保存配置快照'); return; }
    this.openSnapshot(v.snapshot);
  },

  openSnapshot(snap) {
    try {
      const model = SkillLookup.modelById(snap.modelId);
      const prompt = SkillLookup.promptById(snap.promptId);
      const kbs = (snap.knowledgeBaseIds || []).map(id => SkillLookup.kbById(id)).filter(Boolean);
      const tools = (snap.toolIds || []).map(id => SkillLookup.toolById(id)).filter(Boolean);
      const info = (k, v) => `<div class="sk-kv-item"><div class="sk-kv-label">${k}</div><div class="sk-kv-value">${v}</div></div>`;
      const html = `
        <div class="sk-grid-2">
          <div class="sk-mini-card">
            <div class="sk-mini-label">能力目标</div>
            <div class="sk-desc-block">${escapeHtml(snap.goal || snap.rules && snap.rules.taskGoal || '—')}</div>
          </div>
          <div class="sk-mini-card">
            ${info('类型', snap.type || '—')}
            ${info('执行模型', model ? escapeHtml(model.name) : '—')}
            ${info('指令模板', prompt ? escapeHtml(prompt.name) : '—')}
            ${info('知识库', kbs.length ? kbs.map(k => escapeHtml(k.name)).join('、') : '无')}
            ${info('工具', snap.declareNoTool ? '无需工具' : (tools.length ? tools.map(t => escapeHtml(t.displayName)).join('、') : '无'))}
            ${info('输入 / 输出', `${(snap.inputs || []).length} 个 / ${(snap.outputs || []).length} 个`)}
          </div>
        </div>
        <div class="sk-mini-card" style="margin-top:var(--space-4);">
          <div class="sk-mini-label">执行规则快照</div>
          <div class="sk-desc-block" style="border-left-color:var(--color-info-dark);">${escapeHtml((snap.rules && snap.rules.taskGoal) || '—')}</div>
          ${(snap.rules && snap.rules.principles && snap.rules.principles.length) ? `<div class="sk-help-note" style="margin-top:8px;">工作原则 ${snap.rules.principles.length} 条 · 约束规则 ${(snap.rules.constraints || []).length} 条</div>` : ''}
        </div>`;
      const m = Modal.create({ title: '版本配置快照', content: html, size: 'lg' });
      m.open();
    } catch (e) {
      Toast.danger('快照数据无法解析');
    }
  },

};

window.SkillDetail = SkillDetail;
