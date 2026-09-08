/* =====================================================
   Agent 管理 - Agent 工作台逻辑
   结构：岗位说明(@引用) / 能力 / 模型 / 运行设置 / 版本
   原则：先定义岗位，再赋予能力；模型属运行配置，不通过 @ 引用。
   ===================================================== */

/* @推荐能力的别名词典（用于从岗位说明推断建议） */
const AGENT_REC_ALIAS = {
  'skl-001': ['编目', '目录字段', '分类', '描述', '标签'],
  'skl-002': ['摘要', '概要', '内容提炼'],
  'skl-003': ['质量', '评估', '完整性', '准确性', '时效'],
  'skl-004': ['标准检查', '合规', '字段命名', '标准', '核验'],
  'tool-001': ['查询', '资源列表', '数据资源'],
  'tool-002': ['元数据', '详情', 'metadata'],
  'tool-003': ['搜索目录', '检索目录', '目录'],
  'tool-004': ['血缘', '溯源', '关联'],
  'tool-005': ['质量评估', '数据质量', '评分'],
  'tool-006': ['知识检索', '语义检索', '检索'],
  'tool-007': ['问答', 'RAG', '答复'],
  'tool-008': ['审批', '流程', '提交'],
  'tool-009': ['审批状态', '进度'],
  'tool-012': ['员工', '人员'],
  'tool-013': ['组织', '部门'],
  'tool-014': ['文件', '读取'],
  'tool-015': ['搜索文件', '文件'],
  'kb-001': ['标准规范', '标准库', '国家标准'],
  'kb-002': ['资产目录', '目录库', '资产索引'],
  'kb-003': ['运营手册', '运营知识', '操作手册'],
  'kb-006': ['政策法规', '法规', '政策'],
  'kb-007': ['质量规则', '阈值', '规则库'],
  'kb-008': ['行业标准', '数据交换'],
  'kb-009': ['案例', '实践', '典型'],
  'kb-010': ['分级', '敏感', '合规']
};

const AgentWorkbench = {
  agent: null,
  cat: null,
  tab: 'inst',
  savedHtml: '',
  dirty: false,

  /* @选择器状态 */
  pick: { open: false, stage: 'type', type: null, view: 'all', kw: '', deleteAt: false, range: null, popId: null, isModal: false },

  init() {
    const q = new URLSearchParams(window.location.search);
    const id = q.get('id');
    this.agent = id ? AgentStore.get(id) : null;

    if (!this.agent) {
      document.getElementById('wb-head').style.display = 'none';
      document.getElementById('wb-tabs').style.display = 'none';
      const pane = document.getElementById('pane-inst');
      pane.innerHTML = `
        <div class="ag-empty" style="padding: 64px 0;">
          <div class="ag-empty-icon"><i class="fa-regular fa-folder-open"></i></div>
          <div class="ag-empty-title">未找到该智能岗位</div>
          <div class="ag-empty-desc">它可能已被删除，或链接已失效。</div>
          <div style="margin-top:16px;"><button class="btn btn-primary" onclick="AgentWorkbench.goList()"><i class="fa-solid fa-arrow-left"></i> 返回Agent列表</button></div>
        </div>`;
      return;
    }

    AgentRefs.loadCatalog().then(cat => {
      this.cat = cat;
      this.savedHtml = this.agent.instructionsHtml || '';
      this.renderHeader();
      this.renderVersionHead();
      this.renderSettings();
      this.fillEditor();
      this.bindEvents();
      this.setTab('inst');
    });
  },

  /* ==================== 基础渲染 ==================== */
  renderHeader() {
    const a = this.agent;
    document.getElementById('wb-head').style.display = '';
    document.getElementById('wb-tabs').style.display = '';
    const catM = AGENT_CATEGORY_META[a.category] || AGENT_CATEGORY_META['通用助手'];
    const avatar = document.getElementById('wb-avatar');
    avatar.style.setProperty('--cat', catM.color);
    avatar.innerHTML = `<i class="fa-solid ${catM.icon}"></i>`;
    document.getElementById('wb-name').textContent = a.name;
    const catTag = document.getElementById('wb-category');
    catTag.innerHTML = categoryTag(a.category);
    document.getElementById('wb-status').innerHTML = statusPill(a.status);
    const verEl = document.getElementById('wb-version');
    const modelName = (this.cat && AgentRefs.modelById(this.cat, a.model)) ? AgentRefs.modelById(this.cat, a.model).name : '—';
    verEl.textContent = a.version + ' · ' + modelName;
    document.getElementById('wb-role').textContent = '岗位：' + (a.roleName || '—');
    document.getElementById('wb-desc').textContent = a.description || '尚未填写岗位描述。';

    const pubBtn = document.getElementById('wb-publish-btn');
    pubBtn.innerHTML = a.status === 'published'
      ? '<i class="fa-solid fa-rocket"></i> 发布新版本'
      : '<i class="fa-solid fa-rocket"></i> 发布';
    pubBtn.classList.toggle('ag-btn-disabled', a.status === 'stopped');
  },

  setTab(name) {
    this.tab = name;
    document.querySelectorAll('.ag-wb-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    ['inst', 'cap', 'model', 'run', 'vers'].forEach(p => {
      document.getElementById('pane-' + p).classList.toggle('hidden', p !== name);
    });
    if (name === 'cap') this.renderCapabilityGroups();
    if (name === 'vers') this.renderVersions();
    if (name === 'inst') {
      this.refreshStatic();
      this.updateRecommend();
    }
    if (name === 'model') this.renderModel();
    document.getElementById('pane-' + name).scrollTop = 0;
  },

  /* ==================== 岗位说明编辑器 ==================== */
  fillEditor() {
    const editor = document.getElementById('wb-instr');
    editor.innerHTML = this.agent.instructionsHtml || '';
    this.refreshMentionLabels();
    this.togglePlaceholder();
  },

  editorCurrent() {
    const editor = document.getElementById('wb-instr');
    return editor ? editor.innerHTML : '';
  },

  togglePlaceholder() {
    const editor = document.getElementById('wb-instr');
    const ph = document.getElementById('wb-instr-ph');
    const empty = !editor.textContent.trim();
    if (ph) ph.style.display = empty ? '' : 'none';
  },

  /* 同步：editor DOM → agent 结构字段（含资源引用） */
  syncFromEditor() {
    const editor = document.getElementById('wb-instr');
    if (!editor) return;
    const html = editor.innerHTML;
    this.agent.instructionsHtml = html;
    this.agent.instructions = htmlToText(html);
    const mentions = extractMentions(html);
    this.agent.skills = mentions.filter(m => m.type === 'skill').map(m => m.id);
    this.agent.knowledgeBases = mentions.filter(m => m.type === 'knowledge').map(m => m.id);
    this.agent.agents = mentions.filter(m => m.type === 'agent').map(m => m.id);
    this.agent.tools = mentions.filter(m => m.type === 'mcp').map(m => {
      const tool = this.cat ? AgentRefs.toolById(this.cat, m.id) : null;
      return { mcpId: tool ? tool.serverId : '', toolId: m.id };
    }).filter(t => t.toolId);
  },

  capabilityCount() {
    const a = this.agent;
    return (a.skills || []).length + (a.tools || []).length + (a.knowledgeBases || []).length + (a.agents || []).length;
  },

  /* 刷新引用标签文字为目录最新名称 */
  refreshMentionLabels() {
    if (!this.cat) return;
    const editor = document.getElementById('wb-instr');
    if (!editor) return;
    editor.querySelectorAll('span.ag-mn').forEach(span => {
      const type = span.getAttribute('data-type');
      const id = span.getAttribute('data-id');
      let name = '';
      if (type === 'skill') { const s = AgentRefs.skillById(this.cat, id); name = s ? s.name : ''; }
      else if (type === 'mcp') { const t = AgentRefs.toolById(this.cat, id); name = t ? (t.displayName || t.name) : ''; }
      else if (type === 'knowledge') { const k = AgentRefs.kbById(this.cat, id); name = k ? k.name : ''; }
      else if (type === 'agent') { const ag = AgentRefs.agentById(this.cat, id); name = ag ? ag.name : ''; }
      if (!name) return;
      const tMeta = RESOURCE_TYPE_META[type];
      const icon = tMeta ? '<i class="fa-solid ' + tMeta.icon + '"></i>' : '';
      span.setAttribute('data-name', name);
      span.innerHTML = icon + '@' + escapeHtml(name);
    });
  },

  /* 刷新侧栏速览 + 页签角标（不含重排能力列表） */
  refreshStatic() {
    if (!this.agent) return;
    this.syncFromEditor();
    const a = this.agent;
    const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setTxt('side-skill', (a.skills || []).length);
    setTxt('side-tool', (a.tools || []).length);
    setTxt('side-kb', (a.knowledgeBases || []).length);
    setTxt('side-agent', (a.agents || []).length);
    setTxt('tab-badge-cap', this.capabilityCount());
    setTxt('tab-badge-vers', (a.versions || []).length);
    if (this.cat) {
      const m = AgentRefs.modelById(this.cat, a.model);
      const el = document.getElementById('wb-side-model-name');
      if (el) el.textContent = m ? m.name : '—';
    }
    this.renderSideRes();
  },

  renderSideRes() {
    const box = document.getElementById('wb-side-res');
    if (!box) return;
    const meta = this.cat ? AgentRefs.resolveAgent(this.agent, this.cat) : null;
    if (!meta) { box.innerHTML = ''; return; }
    const chips = [];
    const mk = (type, id, name) => `<span class="ag-mini-res ag-mini-${type}" data-type="${type}" data-id="${escapeHtml(id)}">${escapeHtml(name)}</span>`;
    (this.agent.skills || []).forEach(id => { const s = meta.skills.find(x => x.id === id); if (s) chips.push(mk('skill', id, s.name)); });
    (this.agent.tools || []).forEach(t => { const tool = meta.tools.find(x => x.toolId === t.toolId); if (tool) chips.push(mk('mcp', t.toolId, tool.name)); });
    (this.agent.knowledgeBases || []).forEach(id => { const k = meta.kbs.find(x => x.id === id); if (k) chips.push(mk('knowledge', id, k.name)); });
    (this.agent.agents || []).forEach(id => { const ag = meta.agents.find(x => x.id === id); if (ag) chips.push(mk('agent', id, ag.name)); });
    box.innerHTML = chips.length ? chips.join('') : '<span class="muted-text">尚未通过 @ 关联能力，键入 @ 或点击“引用资源”。</span>';
  },

  /* ==================== 事件 ==================== */
  bindEvents() {
    const editor = document.getElementById('wb-instr');

    editor.addEventListener('input', () => {
      this.togglePlaceholder();
      if (this.pick.open && !this.pick.isModal) this.closePick();
      this.scheduleStatic();
    });

    editor.addEventListener('keydown', e => {
      if (e.key === '@') { this.atPending = true; return; }
      if (e.key === 'Escape' && this.pick.open && !this.pick.isModal) {
        e.preventDefault();
        this.closePick();
      }
    });

    editor.addEventListener('keyup', e => {
      if (e.key === '@' && this.atPending) {
        this.atPending = false;
        this.openAtCaret(true);
      }
    });

    /* 点击弹层外任意位置关闭编辑器内弹层（不拦截弹层自身点击） */
    document.addEventListener('mousedown', e => {
      if (this.pick.open && !this.pick.isModal && !e.target.closest('#wb-pick-pop')) {
        this.closePick();
      }
    }, true);

    document.getElementById('wb-save-btn').addEventListener('click', () => this.save());
    document.getElementById('wb-test-btn').addEventListener('click', () => this.test());
    document.getElementById('wb-publish-btn').addEventListener('click', () => this.openPublish());
    document.getElementById('wb-model-btn').addEventListener('click', () => this.openModelPicker());

    const temp = document.getElementById('run-temp');
    temp.addEventListener('input', () => {
      const v = Number(temp.value).toFixed(2).replace(/\.?0+$/, '');
      document.getElementById('run-temp-val').textContent = v;
    });
  },

  _staticTimer: null,
  scheduleStatic() {
    clearTimeout(this._staticTimer);
    this._staticTimer = setTimeout(() => {
      if (this.tab === 'cap') this.renderCapabilityGroups();
      else this.refreshStatic();
      this.updateRecommend();
    }, 320);
  },

  /* ==================== 推荐能力 ==================== */
  updateRecommend() {
    const listEl = document.getElementById('wb-rec-list');
    const footEl = document.getElementById('wb-rec-foot');
    if (!listEl) return;
    const a = this.agent;
    this.syncFromEditor();
    const text = (a.instructions || '') + ' ' + (a.description || '');

    if (!text.trim()) {
      listEl.innerHTML = '<div class="ag-rec-empty">完善岗位说明后，将根据岗位职责推荐可关联的能力。</div>';
      footEl.innerHTML = '';
      return;
    }

    const recs = this.recommendCandidates(text);
    const notAdded = recs.filter(r => !this.hasResource(r.type, r.id));
    const added = recs.filter(r => this.hasResource(r.type, r.id));

    if (!recs.length) {
      listEl.innerHTML = '<div class="ag-rec-empty">当前说明较聚焦，暂无强相关推荐。可在编辑器中键入 @ 主动引用需要的能力。</div>';
      footEl.innerHTML = '';
      return;
    }

    const rows = notAdded.map(r => this.recRow(r)).join('')
      + added.map(r => this.recRow(r, true)).join('');
    listEl.innerHTML = rows || '<div class="ag-rec-empty">暂无可用推荐。</div>';
    footEl.innerHTML = notAdded.length
      ? `<button type="button" class="btn btn-sm btn-secondary" onclick="AgentWorkbench.addAllRecommended()"><i class="fa-solid fa-circle-plus"></i> 全部添加（${notAdded.length}）</button>
         <button type="button" class="btn btn-sm btn-ghost" onclick="AgentWorkbench.dismissRecommend()">忽略推荐</button>`
      : '<span class="ag-rec-done"><i class="fa-solid fa-circle-check"></i> 推荐能力已全部关联</span>';
  },

  recRow(r, done) {
    const tMeta = RESOURCE_TYPE_META[r.type];
    const btn = done
      ? '<span class="ag-rec-added"><i class="fa-solid fa-check"></i> 已关联</span>'
      : `<button type="button" class="btn btn-sm btn-primary" onclick="AgentWorkbench.addRecommended('${r.type}','${r.id}')">添加</button>`;
    return `
      <div class="ag-rec-item">
        <div class="ag-rec-ic" style="--cat:${r.color}"><i class="fa-solid ${r.icon || tMeta.icon}"></i></div>
        <div class="ag-rec-body">
          <div class="ag-rec-name">${escapeHtml(r.name)} <span class="ag-rec-type">${tMeta.label}</span></div>
          <div class="ag-rec-desc">${escapeHtml(r.desc || '')}</div>
        </div>
        ${btn}
      </div>`;
  },

  recommendCandidates(text) {
    const cat = this.cat;
    if (!cat) return [];
    const out = [];
    const score = (id, aliasList, extraNames) => {
      let s = 0;
      const all = [].concat(aliasList || [], extraNames || []);
      all.forEach(kw => { if (kw && text.indexOf(kw) !== -1) s += kw.length > 1 ? 1 : 0.5; });
      return s;
    };
    const catColor = {};
    Object.keys(AGENT_CATEGORY_META).forEach(k => { catColor[k] = AGENT_CATEGORY_META[k].color; });

    cat.skills.forEach(s => {
      const s2 = score(s.id, AGENT_REC_ALIAS[s.id], [s.name, s.type]);
      if (s2 > 0) out.push({ type: 'skill', id: s.id, name: s.name, desc: s.type + (s.description ? ' · ' + s.description : ''), score: s2, color: catColor[s.type] || '#4F46E5' });
    });
    cat.tools.forEach(t => {
      const tDesc = t.desc || t.description || '';
      const tName = t.displayName || t.name;
      const s2 = score(t.id, AGENT_REC_ALIAS[t.id], [tName, t.name, t.serverName, tDesc]);
      if (s2 > 0) out.push({ type: 'mcp', id: t.id, name: tName, desc: (t.serverName || '') + (tDesc ? ' · ' + tDesc : ''), score: s2, color: '#0EA5E9', icon: 'fa-wrench' });
    });
    cat.kbs.forEach(k => {
      const s2 = score(k.id, AGENT_REC_ALIAS[k.id], [k.name, k.type]);
      if (s2 > 0) out.push({ type: 'knowledge', id: k.id, name: k.name, desc: k.type || '', score: s2, color: '#F59E0B' });
    });
    (cat.agents || []).filter(x => x.id !== this.agent.id).forEach(ag => {
      const s2 = score(ag.id, [], [ag.name, ag.roleName, ag.description]);
      if (s2 > 0) out.push({ type: 'agent', id: ag.id, name: ag.name, desc: ag.roleName || ag.description || '', score: s2, color: '#8B5CF6' });
    });
    out.sort((x, y) => y.score - x.score);
    const order = { skill: 0, mcp: 1, knowledge: 2, agent: 3 };
    out.sort((x, y) => (y.score - x.score) || (order[x.type] - order[y.type]));
    return out.slice(0, 6);
  },

  hasResource(type, id) {
    const a = this.agent;
    if (type === 'skill') return (a.skills || []).includes(id);
    if (type === 'mcp') return (a.tools || []).some(t => t.toolId === id);
    if (type === 'knowledge') return (a.knowledgeBases || []).includes(id);
    if (type === 'agent') return (a.agents || []).includes(id);
    return false;
  },

  addRecommended(type, id) {
    this.insertResource(type, id);
    this.updateRecommend();
  },

  addAllRecommended() {
    this.syncFromEditor();
    const text = (this.agent.instructions || '') + ' ' + (this.agent.description || '');
    this.recommendCandidates(text).filter(r => !this.hasResource(r.type, r.id)).forEach(r => this.appendMentionToEditor(r.type, r.id, false));
    this.afterEditorMutation();
    Toast.success('已关联全部推荐能力');
    this.updateRecommend();
  },

  dismissRecommend() {
    const box = document.getElementById('wb-recommend');
    if (box) box.style.display = 'none';
  },

  /* ==================== 资源插入 / @两级选择器 ==================== */
  openAtCaret(deleteAt) {
    if (!this.agent || this.agent.status === 'stopped') { Toast.warning('已停用的岗位暂不可编辑'); return; }
    const editor = document.getElementById('wb-instr');
    editor.focus();
    const sel = window.getSelection();
    this.pick.range = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
    this.pick.deleteAt = !!deleteAt;
    this.pick.isModal = false;
    this.openPickLayer('type', null);
    this.positionPickPop();
  },

  insertMention() {
    if (!this.agent || this.agent.status === 'stopped') { Toast.warning('已停用的岗位暂不可编辑'); return; }
    const editor = document.getElementById('wb-instr');
    editor.focus();
    const len = editor.textContent.length;
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    this.pick.range = range.cloneRange();
    this.pick.deleteAt = false;
    this.pick.isModal = false;
    this.openPickLayer('type', null);
    this.positionPickPop();
  },

  openCapAdd() {
    if (!this.agent || this.agent.status === 'stopped') { Toast.warning('已停用的岗位暂不可编辑'); return; }
    this.pick.deleteAt = false;
    this.pick.isModal = true;
    this.pick.range = null; /* 模态添加统一追加到岗位说明末尾 */
    this.openPickLayer('type', null);
  },

  /* 打开选择器（layer1：资源类型 / layer2：具体资源） */
  openPickLayer(stage, type) {
    this.pick.stage = stage;
    this.pick.type = type || null;
    this.pick.view = 'all';
    this.pick.kw = '';
    this.pick.open = true;

    if (this.pick.isModal) {
      const body = this.capModalBody();
      if (!body) return;
      body.innerHTML = this.pickLayerHtml();
      const inp = body.querySelector('input.ag-pick-search');
      if (inp) inp.focus();
      return;
    }
    const pop = document.getElementById('wb-pick-pop');
    pop.classList.add('show');
    pop.innerHTML = this.pickLayerHtml();
    this.positionPickPop();
    const inp = pop.querySelector('input.ag-pick-search');
    if (inp) inp.focus();
  },

  /* 添加能力模态框（可复用；关闭后刷新能力页） */
  capModalBody() {
    let overlay = this.pick.popId ? document.getElementById(this.pick.popId) : null;
    if (overlay) {
      if (!overlay.classList.contains('show')) Modal.open(this.pick.popId);
      return overlay.querySelector('#wb-pick-modal-body');
    }
    const handle = Modal.create({
      title: '添加能力',
      content: '<div class="ag-picker" id="wb-pick-modal-body"></div>',
      size: '',
      showClose: true,
      closeOnOverlay: false,
      footer: '<button type="button" class="btn btn-primary" data-wb-done="1"><i class="fa-solid fa-check"></i> 完成添加</button>'
    });
    this.pick.popId = handle.id;
    const that = this;
    handle.element.querySelector('[data-wb-done="1"]').addEventListener('click', () => Modal.close(handle.id));
    handle.element.addEventListener('modalclose', () => { that.pick.open = false; that.renderCapabilityGroups(); });
    handle.open();
    return handle.element.querySelector('#wb-pick-modal-body');
  },

  pickLayerHtml() {
    if (this.pick.stage === 'type') return this.typeLayerHtml();
    return this.entityLayerHtml();
  },

  typeLayerHtml() {
    const rows = Object.keys(RESOURCE_TYPE_META).map(key => {
      const m = RESOURCE_TYPE_META[key];
      const count = this.typeCount(key);
      const icon = key === 'mcp' ? 'fa-wrench' : m.icon;
      const color = key === 'skill' ? '#4F46E5' : key === 'mcp' ? '#0EA5E9' : key === 'knowledge' ? '#F59E0B' : '#8B5CF6';
      return `
        <button type="button" class="ag-pick-type" onclick="AgentWorkbench.pickType('${key}')">
          <span class="ag-pick-type-ic" style="--cat:${color}"><i class="fa-solid ${icon}"></i></span>
          <span class="ag-pick-type-body">
            <span class="ag-pick-type-name">${m.label}<em>${count}</em></span>
            <span class="ag-pick-type-desc">${m.desc}</span>
          </span>
          <i class="fa-solid fa-angle-right ag-pick-type-arrow"></i>
        </button>`;
    }).join('');
    const closeHtml = this.pick.isModal ? '' : '<button type="button" class="ag-pick-close" onclick="AgentWorkbench.closePick()"><i class="fa-solid fa-xmark"></i></button>';
    return `<div class="ag-pick-head"><span><i class="fa-solid fa-link"></i> 引用平台能力</span>${closeHtml}</div>
      <div class="ag-pick-sub">选择要引用的资源类型，随后定位到具体资源</div>
      <div class="ag-pick-types">${rows}</div>`;
  },

  pickType(type) {
    this.openPickLayer('entity', type);
  },

  pickBack() {
    this.openPickLayer('type', null);
  },

  typeCount(type) {
    const cat = this.cat;
    if (!cat) return 0;
    if (type === 'skill') return (cat.skills || []).length;
    if (type === 'mcp') return (cat.tools || []).filter(t => t.status !== 'inactive').length;
    if (type === 'knowledge') return (cat.kbs || []).length;
    if (type === 'agent') return (cat.agents || []).filter(x => x.id !== this.agent.id).length;
    return 0;
  },

  entityPool() {
    const cat = this.cat;
    const t = this.pick.type;
    if (!cat) return [];
    if (t === 'skill') return (cat.skills || []).map(s => ({ type: 'skill', id: s.id, name: s.name, desc: (s.type || '') + (s.description ? ' · ' + s.description : ''), meta: s.type || '' }));
    if (t === 'mcp') return (cat.tools || []).filter(x => x.status !== 'inactive').map(x => ({ type: 'mcp', id: x.id, name: x.displayName || x.name, meta: x.serverName || '', desc: (x.serverName || '') + ((x.desc || x.description || '') ? ' · ' + (x.desc || x.description) : '') }));
    if (t === 'knowledge') return (cat.kbs || []).map(k => ({ type: 'knowledge', id: k.id, name: k.name, meta: k.type || '', desc: (k.type || '') + (k.description ? ' · ' + k.description : '') }));
    if (t === 'agent') return (cat.agents || []).filter(x => x.id !== this.agent.id).map(x => ({ type: 'agent', id: x.id, name: x.name, meta: x.roleName || '', desc: (x.roleName || x.description || '') }));
    return [];
  },

  entityLayerHtml() {
    const tMeta = RESOURCE_TYPE_META[this.pick.type];
    let pool = this.entityPool();
    let kw = this.pick.kw.trim().toLowerCase();
    let list;
    if (this.pick.view === 'recent') {
      const rec = AgentStore.listRecents(this.pick.type);
      list = rec.map(r => pool.find(p => p.id === r.id)).filter(Boolean);
    } else if (this.pick.view === 'rec') {
      const text = (this.agent.instructions || '');
      list = pool.filter(p => AGENT_REC_ALIAS[p.id] && AGENT_REC_ALIAS[p.id].some(a => a && text.indexOf(a) !== -1));
    } else {
      list = pool;
    }
    if (kw) list = list.filter(p => (p.name + ' ' + p.desc + ' ' + p.meta).toLowerCase().indexOf(kw) !== -1);

    const rows = list.length ? list.map(p => this.pickRow(p)).join('')
      : `<div class="ag-pick-none">${this.pick.view === 'recent' ? '暂无最近使用记录' : this.pick.view === 'rec' ? '暂无推荐资源' : '未找到匹配资源'}</div>`;

    const icon = this.pick.type === 'mcp' ? 'fa-wrench' : tMeta.icon;
    return `
      <div class="ag-pick-head">
        <button type="button" class="ag-pick-back" onclick="AgentWorkbench.pickBack()"><i class="fa-solid fa-arrow-left"></i></button>
        <span class="ag-pick-type-label"><i class="fa-solid ${icon}"></i> ${tMeta.label}</span>
        ${this.pick.isModal ? '' : '<button type="button" class="ag-pick-close" onclick="AgentWorkbench.closePick()"><i class="fa-solid fa-xmark"></i></button>'}
      </div>
      <div class="ag-pick-tools">
        <div class="ag-pick-search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" class="ag-pick-search" placeholder="搜索资源" value="${escapeHtml(this.pick.kw)}" oninput="AgentWorkbench.pickSearch(this.value)">
        </div>
        <div class="ag-pick-seg">
          <button type="button" class="${this.pick.view === 'recent' ? 'active' : ''}" onclick="AgentWorkbench.pickView('recent')">最近使用</button>
          <button type="button" class="${this.pick.view === 'rec' ? 'active' : ''}" onclick="AgentWorkbench.pickView('rec')">推荐资源</button>
          <button type="button" class="${this.pick.view === 'all' ? 'active' : ''}" onclick="AgentWorkbench.pickView('all')">全部资源</button>
        </div>
      </div>
      <div class="ag-pick-list">${rows}</div>`;
  },

  pickRow(p) {
    const tMeta = RESOURCE_TYPE_META[p.type];
    const color = p.type === 'skill' ? '#4F46E5' : p.type === 'mcp' ? '#0EA5E9' : p.type === 'knowledge' ? '#F59E0B' : '#8B5CF6';
    const icon = p.type === 'mcp' ? 'fa-wrench' : tMeta.icon;
    return `
      <button type="button" class="ag-pick-item" onclick="AgentWorkbench.pickSelect('${p.type}','${p.id}')">
        <span class="ag-pick-item-ic" style="--cat:${color}"><i class="fa-solid ${icon}"></i></span>
        <span class="ag-pick-item-body">
          <span class="ag-pick-item-name">${escapeHtml(p.name)}${p.meta ? '<em>' + escapeHtml(p.meta) + '</em>' : ''}</span>
          <span class="ag-pick-item-desc">${escapeHtml(p.desc || '')}</span>
        </span>
        <i class="fa-solid fa-plus ag-pick-item-add"></i>
      </button>`;
  },

  pickSearch(v) { this.pick.kw = v; this.renderPickBody(); },
  pickView(v) { this.pick.view = v; this.renderPickBody(); },

  renderPickBody() {
    const el = this.pick.isModal ? document.getElementById('wb-pick-modal-body') : document.getElementById('wb-pick-pop');
    if (!el) return;
    el.innerHTML = this.pickLayerHtml();
    const inp = el.querySelector('input.ag-pick-search');
    if (inp) inp.focus();
  },

  pickSelect(type, id) {
    if (type === 'agent' && id === this.agent.id) return;
    if (this.hasResource(type, id)) {
      Toast.warning('该资源已关联，无需重复添加');
      if (!this.pick.isModal) this.closePick();
      return;
    }
    this.appendMentionToEditor(type, id, this.pick.deleteAt);
    this.afterEditorMutation();
    const name = this.entityDisplayName(type, id);
    AgentStore.addRecent(type, id, name);
    if (!this.pick.isModal) {
      this.closePick();
      const tMeta = RESOURCE_TYPE_META[type];
      Toast.success(`已关联${tMeta.label}：${name}`);
    }
  },

  entityDisplayName(type, id) {
    if (!this.cat) return id;
    if (type === 'skill') { const s = AgentRefs.skillById(this.cat, id); return s ? s.name : id; }
    if (type === 'mcp') { const t = AgentRefs.toolById(this.cat, id); return t ? (t.displayName || t.name) : id; }
    if (type === 'knowledge') { const k = AgentRefs.kbById(this.cat, id); return k ? k.name : id; }
    if (type === 'agent') { const a = AgentRefs.agentById(this.cat, id); return a ? a.name : id; }
    return id;
  },

  insertResource(type, id) {
    this.appendMentionToEditor(type, id, false);
    this.afterEditorMutation();
  },

  /* 追加 @引用到编辑器末尾 */
  appendMentionToEditor(type, id, deleteAt) {
    const editor = document.getElementById('wb-instr');
    const name = this.entityDisplayName(type, id);
    if (!name || name === id) return;
    editor.focus();

    let range = this.pick.range;
    const sel = window.getSelection();
    if (deleteAt && range) {
      sel.removeAllRanges();
      sel.addRange(range);
      this.removeTypedAt();
      range = sel.getRangeAt(0);
    } else if (range && !deleteAt) {
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    /* 在光标处插入引用 chip + 空格 */
    const chip = mentionSpan(type, id, name);
    const wrap = document.createElement('div');
    wrap.innerHTML = chip;
    const chipEl = wrap.firstChild;
    range.deleteContents();
    range.insertNode(chipEl);
    const sp = document.createTextNode(' ');
    range.setStartAfter(chipEl);
    range.collapse(true);
    range.insertNode(sp);
    range.setStartAfter(sp);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    this.dirty = true;
    this.syncFromEditor();
  },

  /* 移除触发弹层时刚键入的 @ 字符 */
  removeTypedAt() {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    let node = range.startContainer;
    let offset = range.startOffset;
    if (node.nodeType === Node.TEXT_NODE && offset > 0 && node.data.charAt(offset - 1) === '@') {
      node.deleteData(offset - 1, 1);
      return;
    }
    /* 回退：向前找一个以 @ 结尾的文本节点 */
    const editor = document.getElementById('wb-instr');
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    let last = null;
    while (walker.nextNode()) {
      if (walker.currentNode.data.indexOf('@') !== -1) last = walker.currentNode;
    }
    if (last) {
      const idx = last.data.lastIndexOf('@');
      last.deleteData(idx, 1);
    }
  },

  afterEditorMutation() {
    this.togglePlaceholder();
    this.refreshMentionLabels();
    if (this.tab === 'cap') this.renderCapabilityGroups();
    else this.refreshStatic();
    if (this.tab === 'inst') this.updateRecommend();
  },

  /* ==================== 能力页 ==================== */
  renderCapabilityGroups() {
    this.syncFromEditor();
    const box = document.getElementById('wb-cap-groups');
    if (!box) return;
    const a = this.agent;
    const cat = this.cat;
    const meta = cat ? AgentRefs.resolveAgent(a, cat) : null;
    const groupDef = [
      { type: 'skill', label: 'Skill', icon: 'fa-puzzle-piece', color: '#4F46E5', hint: '定义任务执行方法', rows: meta ? meta.skills.map(s => ({ id: s.id, name: s.name, metaTxt: s.type || '', desc: s.description || '' })) : [] },
      { type: 'mcp', label: 'MCP工具', icon: 'fa-wrench', color: '#0EA5E9', hint: '调用外部数据与业务能力，精确到具体工具', rows: meta ? meta.tools.map(t => ({ id: t.toolId, name: t.name, metaTxt: t.serverName || '', desc: t.desc || '' })) : [] },
      { type: 'knowledge', label: '知识库', icon: 'fa-book-open', color: '#F59E0B', hint: '提供专业知识与业务规则', rows: meta ? meta.kbs.map(k => ({ id: k.id, name: k.name, metaTxt: k.type || '', desc: k.description || '' })) : [] },
      { type: 'agent', label: 'Agent', icon: 'fa-robot', color: '#8B5CF6', hint: '调用其它智能岗位协同', rows: meta ? meta.agents.map(x => ({ id: x.id, name: x.name, metaTxt: x.roleName || '', desc: x.description || '' })) : [] }
    ];

    box.innerHTML = groupDef.map(g => {
      const rowsHtml = g.rows.length ? g.rows.map(r => `
        <div class="ag-cap-row">
          <div class="ag-cap-row-ic" style="--cat:${g.color}"><i class="fa-solid ${g.icon}"></i></div>
          <div class="ag-cap-row-body">
            <div class="ag-cap-row-name">${escapeHtml(r.name)}<em>${escapeHtml(r.metaTxt || '')}</em></div>
            <div class="ag-cap-row-desc">${escapeHtml(r.desc || '')}</div>
          </div>
          <div class="ag-cap-row-ops">
            <button type="button" class="ag-link-btn" onclick="AgentWorkbench.viewResource('${g.type}','${r.id}')"><i class="fa-regular fa-eye"></i>查看</button>
            <button type="button" class="ag-link-btn danger" onclick="AgentWorkbench.removeResource('${g.type}','${r.id}')"><i class="fa-regular fa-trash-can"></i>移除</button>
          </div>
        </div>`).join('')
        : `<div class="ag-cap-empty">暂无关联${g.label}。可在岗位说明中键入 @ 添加，或点击右上「添加能力」。</div>`;
      return `
        <div class="ag-cap-group">
          <div class="ag-cap-group-head">
            <span class="ag-cap-group-ic" style="--cat:${g.color}"><i class="fa-solid ${g.icon}"></i></span>
            <div class="ag-cap-group-title">${g.label}<em>${g.rows.length}</em><span class="ag-cap-group-hint">${g.hint}</span></div>
            <button type="button" class="ag-link-btn" onclick="AgentWorkbench.openCapAddType('${g.type}')"><i class="fa-solid fa-plus"></i>添加</button>
          </div>
          <div class="ag-cap-list">${rowsHtml}</div>
        </div>`;
    }).join('');
    this.refreshStatic();
  },

  openCapAddType(type) {
    if (!this.agent || this.agent.status === 'stopped') { Toast.warning('已停用的岗位暂不可编辑'); return; }
    this.pick.deleteAt = false;
    this.pick.isModal = true;
    this.pick.range = null; /* 模态添加统一追加到岗位说明末尾 */
    this.openPickLayer('entity', type);
  },

  viewResource(type, id) {
    const cat = this.cat;
    if (!cat) return;
    let title = '', msg = '';
    if (type === 'skill') {
      const s = AgentRefs.skillById(cat, id);
      if (!s) return;
      title = 'Skill · ' + s.name;
      msg = `<div class="ag-view-modal">
        <p><b>类型：</b>${escapeHtml(s.type || '—')}</p>
        <p><b>编码：</b>${escapeHtml(s.code || '—')}</p>
        <p><b>说明：</b>${escapeHtml(s.description || '—')}</p>
        <p>作为「怎么做」的方法，在任务执行时由本Agent调用。</p></div>`;
    } else if (type === 'mcp') {
      const t = AgentRefs.toolById(cat, id);
      if (!t) return;
      const server = AgentRefs.serverById(cat, t.serverId);
      title = 'MCP工具 · ' + (t.displayName || t.name);
      msg = `<div class="ag-view-modal">
        <p><b>所属服务：</b>${escapeHtml(t.serverName || (server ? server.name : '—'))}</p>
        <p><b>调用标识：</b><code>${escapeHtml(t.name || '')}</code></p>
        <p><b>功能：</b>${escapeHtml((t.desc || t.description || '—'))}</p>
        <p>已授权本Agent在任务执行中调用该工具访问外部数据与业务能力。</p></div>`;
    } else if (type === 'knowledge') {
      const k = AgentRefs.kbById(cat, id);
      if (!k) return;
      title = '知识库 · ' + k.name;
      msg = `<div class="ag-view-modal">
        <p><b>类型：</b>${escapeHtml(k.type || '—')}</p>
        <p><b>说明：</b>${escapeHtml(k.description || '—')}</p>
        <p>任务执行时将作为专业知识与业务规则的检索来源。</p></div>`;
    } else if (type === 'agent') {
      const ag = AgentRefs.agentById(cat, id);
      if (!ag) return;
      title = 'Agent · ' + ag.name;
      msg = `<div class="ag-view-modal">
        <p><b>岗位：</b>${escapeHtml(ag.roleName || '—')}</p>
        <p><b>说明：</b>${escapeHtml(ag.description || '—')}</p>
        <p>必要时由本Agent协同调用该智能岗位完成任务。</p></div>`;
    } else { return; }
    const handle = Modal.create({
      title: title,
      content: msg,
      size: 'sm',
      footer: '<button class="btn btn-primary" data-close="1">知道了</button>'
    });
    const doneBtn = handle.element.querySelector('[data-close="1"]');
    if (doneBtn) doneBtn.addEventListener('click', () => Modal.close(handle.id));
    handle.open();
  },

  removeResource(type, id) {
    const a = this.agent;
    let removed = false;
    if (type === 'skill') { a.skills = (a.skills || []).filter(x => x !== id); removed = true; }
    else if (type === 'knowledge') { a.knowledgeBases = (a.knowledgeBases || []).filter(x => x !== id); removed = true; }
    else if (type === 'agent') { a.agents = (a.agents || []).filter(x => x !== id); removed = true; }
    else if (type === 'mcp') {
      const before = (a.tools || []).length;
      a.tools = (a.tools || []).filter(t => t.toolId !== id);
      removed = a.tools.length < before;
    }
    if (!removed) return;

    /* 同步从编辑器文案中移除对应 chip */
    const editor = document.getElementById('wb-instr');
    if (editor) {
      const spans = editor.querySelectorAll(`span.ag-mn[data-type="${type}"][data-id="${id}"]`);
      spans.forEach(s => {
        s.parentNode.removeChild(s);
        /* 清理多余空格 */
        const p = s.previousSibling;
        const n = s.nextSibling;
        if (p && p.nodeType === Node.TEXT_NODE && / $/.test(p.data)) p.data = p.data.replace(/ $/, '');
        if (n && n.nodeType === Node.TEXT_NODE && /^ /.test(n.data)) n.data = n.data.replace(/^ /, '');
      });
    }
    this.afterEditorMutation();
    const name = this.entityDisplayName(type, id);
    Toast.success(`已移除关联：${name}`);
    this.dirty = true;
  },

  /* ==================== 模型 ==================== */
  renderModel() {
    const cat = this.cat;
    const m = cat ? AgentRefs.modelById(cat, this.agent.model) : null;
    if (!m) return;
    document.getElementById('wb-model-name').textContent = m.name;
    document.getElementById('wb-model-meta').textContent = (m.provider || '') + ' · ' + (m.type || '') + (m.status === 'inactive' ? ' · 已下线' : ' · 可用');
    document.getElementById('wb-model-desc').textContent = m.description || '默认推理模型。';
  },

  openModelPicker() {
    const cat = this.cat;
    if (!cat) return;
    const list = (cat.models || []).filter(m => m.status !== 'inactive');
    if (!list.length) { Toast.warning('暂无可用模型'); return; }
    const rows = list.map(m => `
      <button type="button" class="ag-model-opt ${m.id === this.agent.model ? 'active' : ''}" data-id="${m.id}" onclick="AgentWorkbench.pickModel('${m.id}')">
        <i class="fa-solid fa-microchip"></i>
        <span class="ag-model-opt-body">
          <span class="ag-model-opt-name">${escapeHtml(m.name)}<em>${escapeHtml(m.provider || '')}</em></span>
          <span class="ag-model-opt-desc">${escapeHtml(m.description || '')}</span>
        </span>
        <span class="ag-model-opt-state">${m.id === this.agent.model ? '使用中' : ''}</span>
      </button>`).join('');
    const modal = Modal.create({
      title: '更换模型',
      content: `<div class="ag-model-opt-list">${rows}</div><div class="ag-model-opt-note">选择后模型将作为该岗位的默认推理引擎。</div>`,
      size: 'sm',
      footer: `<button class="btn btn-secondary" data-close="1">取消</button>`
    });
    const closeBtn = modal.element.querySelector('.btn[data-close="1"]');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.close());
    modal.open();
  },

  pickModel(id) {
    this.agent.model = id;
    this.agent.updatedAt = fmtNow();
    AgentStore.upsert(this.agent);
    const cat = this.cat;
    const m = AgentRefs.modelById(cat, id);
    if (m) { Toast.success(`已切换模型：${m.name}`); }
    this.savedHtml = this.editorCurrent();
    this.renderModel();
    this.renderHeader();
    Modal.closeAll();
  },

  /* ==================== 运行设置 ==================== */
  renderSettings() {
    const s = this.agent.settings || AGENT_DEFAULT_SETTINGS;
    const temp = document.getElementById('run-temp');
    temp.value = String(s.temperature);
    document.getElementById('run-temp-val').textContent = String(s.temperature);
    document.getElementById('run-iter').value = s.maxIterations;
    const to = document.getElementById('run-timeout');
    to.value = String(s.timeout);
    const auto = document.getElementById('run-auto');
    auto.checked = !!s.autoToolCall;
    const ctx = document.getElementById('run-ctx');
    ctx.checked = !!s.preserveContext;
    const tip = document.getElementById('run-auto-tip');
    if (tip) tip.textContent = auto.checked ? '开启后按需自动调用已授权的 MCP 工具' : '已关闭，工具调用需人工确认';
    auto.addEventListener('change', () => {
      if (tip) tip.textContent = auto.checked ? '开启后按需自动调用已授权的 MCP 工具' : '已关闭，工具调用需人工确认';
    });
  },

  collectSettings() {
    const temp = Number(document.getElementById('run-temp').value);
    return {
      temperature: Math.round(temp * 100) / 100,
      maxIterations: parseInt(document.getElementById('run-iter').value, 10) || 5,
      timeout: parseInt(document.getElementById('run-timeout').value, 10) || 120,
      autoToolCall: document.getElementById('run-auto').checked,
      preserveContext: document.getElementById('run-ctx').checked
    };
  },

  resetSettings() {
    this.agent.settings = Object.assign({}, AGENT_DEFAULT_SETTINGS);
    this.renderSettings();
    Toast.success('已恢复默认运行设置');
  },

  /* ==================== 保存 / 发布 / 版本 ==================== */
  save(silent) {
    if (!this.agent) return;
    this.syncFromEditor();
    this.agent.settings = this.collectSettings();
    this.agent.description = this.agent.description || (this.el('wb-desc') ? this.el('wb-desc').textContent : '');
    if (!this.agent.instructions) this.agent.instructionsHtml = this.editorCurrent();
    this.agent.updatedAt = fmtNow();
    AgentStore.upsert(this.agent);
    this.savedHtml = this.editorCurrent();
    this.dirty = false;
    if (!silent) {
      Toast.success('智能岗位已保存', '保存成功');
      this.refreshStatic();
      this.renderHeader();
    }
  },

  el(id) { return document.getElementById(id); },

  openPublish() {
    if (this.agent.status === 'stopped') { Toast.warning('已停用的岗位无法发布，请先启用'); return; }
    if (this.agent.status === 'submitted') { Toast.warning('该Agent已在发布中心待审核，请等待审核结果', '提示'); return; }
    const next = this.agent.status === 'published' ? AgentStore.nextVersion(this.agent) : (this.agent.versions && this.agent.versions.length ? AgentStore.nextVersion(this.agent) : 'v1.0');
    const isPublished = this.agent.status === 'published';
    const content = `
      <div class="ag-pub-form">
        <div class="ag-pub-row">
          <span class="ag-pub-label">当前版本</span>
          <span class="ag-pub-ver">${next}<em>${isPublished ? '（已上架,发布新版本立即生效）' : '（提交后进入发布中心审核）'}</em></span>
        </div>
        <div class="form-group">
          <label class="form-label">发布说明</label>
          <textarea class="form-textarea" id="pub-note" rows="3" placeholder="请输入本次发布说明"></textarea>
          <div class="form-help">${isPublished
            ? '发布新版本将直接上架,岗位说明与已关联能力固化为该版本快照。'
            : '提交后需在能力发布中心审核,审核通过即上架能力市场。'}</div>
        </div>
      </div>`;
    const modal = Modal.create({
      title: isPublished ? '发布新版本' : '提交发布',
      content,
      size: 'sm',
      footer: `<button class="btn btn-secondary" data-close="1">取消</button>
               <button class="btn btn-primary" id="pub-confirm"><i class="fa-solid fa-rocket"></i> ${isPublished ? '确认发布' : '提交审核'}</button>`
    });
    modal.element.querySelector('[data-close="1"]').addEventListener('click', () => modal.close());
    modal.open();
    modal.element.querySelector('#pub-confirm').addEventListener('click', () => {
      this.syncFromEditor();
      this.agent.settings = this.collectSettings();
      const note = (modal.element.querySelector('#pub-note') || {}).value || '';
      modal.close();
      this.savedHtml = this.editorCurrent();
      if (this.agent.status === 'published') {
        AgentStore.publishNewVersion(this.agent, note);
        Toast.success(`「${this.agent.name}」已发布新版本 ${this.agent.version}`, '发布成功');
      } else {
        AgentStore.submitForReview(this.agent, note);
        Toast.success(`「${this.agent.name}」已提交发布审核 (${this.agent.version})`, '已提交');
        Toast.info('请到「能力发布中心」完成审核上架', '下一步');
      }
      this.renderHeader();
      this.refreshStatic();
    });
  },

  renderVersionHead() {
    const a = this.agent;
    const head = document.getElementById('wb-vers-head');
    if (!head) return;
    if (a.status === 'draft') {
      head.innerHTML = `
        <div class="ag-vers-head-info">
          <i class="fa-solid fa-pen-ruler"></i>
          <div>当前处于<b>草稿</b>工作区（${a.version || 'v1.0'}）。完善岗位说明与能力并通过测试后，点击右上角「发布」对外开放。</div>
        </div>`;
    } else if (a.status === 'enabled') {
      head.innerHTML = `<div class="ag-vers-head-info"><i class="fa-solid fa-circle-play"></i><div>岗位已<b>启用</b>（${a.version || '—'}），可进行测试与内部调用。</div></div>`;
    } else if (a.status === 'published') {
      const cur = (a.versions && a.versions[0]) || {};
      head.innerHTML = `<div class="ag-vers-head-info"><i class="fa-solid fa-rocket"></i><div>当前线上版本 <b>${cur.version || a.version || '—'}</b>，新修改将通过「发布新版本」生成 v1.x 快照后生效。</div></div>`;
    } else if (a.status === 'stopped') {
      head.innerHTML = `<div class="ag-vers-head-info"><i class="fa-solid fa-circle-pause"></i><div>岗位已<b>停用</b>，不对外提供能力。启用后可再次发布。</div></div>`;
    }
  },

  renderVersions() {
    const a = this.agent;
    const listEl = document.getElementById('wb-vers-list');
    const items = (a.versions || []).slice();
    const draftRow = (a.status === 'draft')
      ? `<div class="ag-vers-row draft">
           <div class="ag-vers-ic draft"><i class="fa-solid fa-pen-nib"></i></div>
           <div class="ag-vers-body">
             <div class="ag-vers-line"><span class="ag-vers-tag draft">${escapeHtml(a.version || 'v1.0')}</span><span class="ag-vers-note">当前草稿工作区，尚未发布</span></div>
             <div class="ag-vers-meta">由 ${escapeHtml(a.creator || '—')} · ${escapeHtml(fmtDateTime(a.updatedAt))}</div>
           </div>
           <div class="ag-vers-state"><span class="ag-status draft"><span class="dot"></span>草稿</span></div>
           <div class="ag-vers-ops"><button class="btn btn-sm btn-secondary" onclick="AgentWorkbench.previewWorking()">查看</button></div>
         </div>`
      : '';

    const rows = items.length ? items.map((v, i) => {
      const isCurrent = i === 0 && a.status === 'published';
      const canRollback = a.status !== 'published' || i > 0;
      return `
        <div class="ag-vers-row published">
          <div class="ag-vers-ic published"><i class="fa-solid fa-rocket"></i></div>
          <div class="ag-vers-body">
            <div class="ag-vers-line">
              <span class="ag-vers-tag published">${escapeHtml(v.version)}</span>
              <span class="ag-vers-note">${escapeHtml(v.note || '')}</span>
            </div>
            <div class="ag-vers-meta">由 ${escapeHtml(v.creator || '—')} · ${escapeHtml(fmtDateTime(v.createdAt))} 发布</div>
          </div>
          <div class="ag-vers-state">${isCurrent ? '<span class="ag-status published"><span class="dot"></span>已发布</span><span class="ag-vers-current">当前</span>' : '<span class="ag-status published"><span class="dot"></span>已发布</span>'}</div>
          <div class="ag-vers-ops">
            <button type="button" class="ag-link-btn" onclick="AgentWorkbench.viewVersion('${escapeHtml(v.version)}')"><i class="fa-regular fa-eye"></i>查看</button>
            ${canRollback ? `<button type="button" class="ag-link-btn" onclick="AgentWorkbench.rollbackTo('${escapeHtml(v.version)}')"><i class="fa-solid fa-rotate-left"></i>回滚</button>` : ''}
          </div>
        </div>`;
    }).join('') : (a.status === 'draft'
      ? '<div class="ag-vers-empty">该岗位尚未发布版本。完成配置后点击「发布」，将生成 v1.0 版本快照。</div>'
      : '<div class="ag-vers-empty">暂无历史版本。</div>');

    listEl.innerHTML = draftRow + rows;
  },

  previewWorking() {
    const a = this.agent;
    this.syncFromEditor();
    const modal = Modal.create({
      title: '草稿工作区 ' + (a.version || 'v1.0'),
      content: `<div class="ag-view-modal">
        <p><b>岗位：</b>${escapeHtml(a.roleName || '—')}</p>
        <p><b>说明：</b>${escapeHtml(a.description || '—')}</p>
        <p><b>已关联能力：</b>Skill ${(a.skills || []).length} · MCP工具 ${(a.tools || []).length} · 知识库 ${(a.knowledgeBases || []).length} · Agent ${(a.agents || []).length}</p>
        <p><b>岗位说明：</b></p>
        <div class="ag-preview-text">${htmlToText(a.instructionsHtml || '').replace(/</g, '&lt;')}</div>
      </div>`,
      size: 'sm',
      footer: '<button class="btn btn-primary" data-close="1">关闭</button>'
    });
    const doneBtn = modal.element.querySelector('[data-close="1"]');
    if (doneBtn) doneBtn.addEventListener('click', () => modal.close());
    modal.open();
  },

  viewVersion(version) {
    const v = (this.agent.versions || []).find(x => x.version === version);
    if (!v) return;
    const snap = v.snap || {};
    const s = snap.settings || {};
    const modal = Modal.create({
      title: '版本详情 · ' + version,
      content: `<div class="ag-view-modal">
        <p><b>发布说明：</b>${escapeHtml(v.note || '—')}</p>
        <p><b>发布时间：</b>${escapeHtml(fmtDateTime(v.createdAt))}　<b>发布人：</b>${escapeHtml(v.creator || '—')}</p>
        <hr>
        <p><b>岗位：</b>${escapeHtml(snap.roleName || '—')}</p>
        <p><b>模型：</b>${escapeHtml((() => { const m = this.cat && AgentRefs.modelById(this.cat, snap.model); return m ? m.name : (snap.model || '—'); })())}</p>
        <p><b>能力快照：</b>Skill ${(snap.skills || []).length} · MCP工具 ${(snap.tools || []).length} · 知识库 ${(snap.knowledgeBases || []).length} · Agent ${(snap.agents || []).length}</p>
        <p><b>Temperature：</b>${s.temperature !== undefined ? s.temperature : '—'}　<b>最大轮次：</b>${s.maxIterations !== undefined ? s.maxIterations : '—'}</p>
      </div>`,
      size: 'sm',
      footer: '<button class="btn btn-primary" data-close="1">关闭</button>'
    });
    const doneBtn = modal.element.querySelector('[data-close="1"]');
    if (doneBtn) doneBtn.addEventListener('click', () => modal.close());
    modal.open();
  },

  rollbackTo(version) {
    const v = (this.agent.versions || []).find(x => x.version === version);
    if (!v) return;
    Modal.confirm({
      title: '回滚到 ' + version,
      message: '回滚将把岗位说明与已关联能力恢复到该版本的快照，回滚后需重新发布才能对外生效。是否继续？',
      type: 'warning',
      confirmText: '确认回滚',
      onConfirm: () => {
        AgentStore.rollback(this.agent, version);
        Toast.success(`已回滚到 ${version}，形成新的草稿工作区`, '回滚成功');
        this.renderHeader();
        this.renderVersionHead();
        this.renderVersions();
        this.renderSettings();
        this.fillEditor();
        this.refreshStatic();
        this.setTab('vers');
      }
    });
  },

  /* ==================== 弹层关闭 / 常用 ==================== */
  closePick() {
    this.pick.open = false;
    this.pick.stage = 'type';
    this.pick.type = null;
    const pop = document.getElementById('wb-pick-pop');
    if (pop) pop.classList.remove('show');
  },

  positionPickPop() {
    const pop = document.getElementById('wb-pick-pop');
    const wrap = document.getElementById('wb-instr-wrap');
    if (!pop || !wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    let top = 40;
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const rects = sel.getRangeAt(0).getClientRects();
      if (rects && rects.length) top = rects[0].bottom - wrapRect.top + 6;
    }
    const maxTop = Math.max(0, wrap.clientHeight - pop.offsetHeight - 8);
    if (top > maxTop) top = maxTop;
    pop.style.top = top + 'px';
    pop.style.left = '12px';
  },

  test() {
    if (this.dirty && this.editorCurrent() !== this.savedHtml) {
      this.syncFromEditor();
    }
    window.parent.postMessage({ type: 'navigate', url: 'pages/ai-build/agent-test.html?id=' + encodeURIComponent(this.agent.id) }, '*');
  },

  goList() {
    const current = this.editorCurrent();
    if (this.dirty && current !== this.savedHtml) {
      Modal.confirm({
        title: '离开工作台',
        message: '当前有未保存的修改，离开后将不会保留。确定返回Agent列表吗？',
        type: 'warning',
        confirmText: '离开',
        onConfirm: () => { window.parent.postMessage({ type: 'navigate', url: 'pages/ai-build/agent.html' }, '*'); }
      });
      return;
    }
    window.parent.postMessage({ type: 'navigate', url: 'pages/ai-build/agent.html' }, '*');
  }
};

window.AgentWorkbench = AgentWorkbench;
