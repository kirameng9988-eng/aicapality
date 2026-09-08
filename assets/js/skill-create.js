/* =====================================================
   AI Capability Open Platform - Skill 新建向导（精简版）
   两种入口：ZIP 技能包导入 / 引导式创建
   Skill = 可被 Agent 调用的专业任务能力
   ===================================================== */

/* 默认预填数据（新建 Skill 时快速展示效果） */
const DEFAULT_NEW_SKILL_DATA = {
  name: '数据资源智能编目',
  code: 'data-cataloging',
  type: '数据治理',
  description: '基于数据资源元数据和编目规范，自动生成数据资源描述、分类、标签和更新频率等标准化目录信息。',
  goal: '自动完成数据资源的标准化智能编目。',
  rules: {
    taskGoal: '根据输入的数据资源元数据，生成符合数据资源目录规范的标准化编目信息。',
    principles: [
      '获取数据资源的基础元数据与字段信息。',
      '依据数据资源分类标准判断资源所属类别。',
      '结合资源字段与业务含义生成资源描述。',
      '根据资源内容提取合适的标签。',
      '依据元数据中的更新信息识别更新频率。',
      '按输出Schema生成结构化编目结果。',
      '写入前对编目结果进行完整性校验。'
    ],
    constraints: [
      '不得修改原始数据。',
      '分类必须遵循数据资源分类标准。',
      '无法确定的信息不得自行编造。',
      '生成结果必须符合输出Schema。',
      '更新目录前必须完成结果校验。'
    ]
  },
  steps: [
    '获取数据资源的元数据与字段信息',
    '分析资源内容与业务含义',
    '检索数据资源分类规范',
    '生成标准化目录信息',
    '校验并回写编目结果'
  ],
  modelId: 'm-qwen-max',
  promptId: 'p-cataloging',
  knowledgeBaseIds: ['kb-catalog'],
  toolIds: ['t-res-list', 't-res-detail'],
  inputMode: 'form',
  inputs: [
    { key: 'resourceId', label: 'resourceId', type: 'String', required: true, desc: '待编目的数据资源ID', example: 'R20260001' },
    { key: 'resourceMetadata', label: 'resourceMetadata', type: 'Object', required: false, desc: '数据资源元数据', example: '' }
  ],
  outputMode: 'form',
  outputs: [
    { name: 'resourceId', type: 'String', desc: '数据资源ID' },
    { name: 'resourceName', type: 'String', desc: '数据资源名称' },
    { name: 'categoryCode', type: 'String', desc: '分类编码' },
    { name: 'categoryName', type: 'String', desc: '分类名称' },
    { name: 'tags', type: 'Array', desc: '资源标签' }
  ]
};

const SkillCreate = {
  // ---- 状态 ----
  id: null,
  original: null,
  newVersionMode: false,
  isNew: true,
  dirty: false,
  entry: 'entry',   // 'entry' | 'zip' | 'guided'
  pick: null,
  zipFile: null,

  // 折叠状态
  collapses: {
    basic: true,   // 始终展开
    goal: true,    // 默认展开
    prompt: true,   // 默认展开
    ability: true,  // 默认展开
    steps: false,
    principles: false,
    constraints: false,
    io: false
  },

  form: null,

  /* =============================================
     初始化
     ============================================= */
  init() {
    const q = new URLSearchParams(window.location.search);
    this.id = q.get('id') || null;
    const justCopied = q.get('justCopied') === '1';
    this.original = this.id ? SkillStore.get(this.id) || null : null;

    if (this.id && !this.original) {
      Toast.warning('未找到该 Skill，已进入新建流程');
      this.id = null;
    }

    this.newVersionMode = !!(this.original && this.original.status === 'published');
    this.isNew = !this.id;

    const seed = this.original
      ? Object.assign(cloneSkillConfig(this.original), { id: this.original.id })
      : this.buildDefaultForm();
    this.form = seed;

    if (justCopied && this.original) {
      Toast.info(`已复制生成草稿「${this.form.name}」，可在此基础上继续编辑`, '复制 Skill');
    }

    this.buildHeader();
    this.bindEvents();
    this.bindZipEvents();

    if (!this.isNew) {
      this.showGuidedForm();
      this.fillForm();
      this.renderAll();
    }
  },

  /* 构建默认空表单 */
  buildDefaultForm() {
    return {
      id: undefined,
      name: '', code: '', type: '', description: '', goal: '',
      modelId: '', promptId: '',
      knowledgeBaseIds: [], toolIds: [], declareNoTool: false,
      rules: { taskGoal: '', principles: [], constraints: [] },
      steps: [],
      inputMode: 'form', inputs: [], inputJson: '',
      outputMode: 'form', outputs: [], outputJson: ''
    };
  },

  /* 预填示例数据（新建时快速看到效果） */
  buildDefaultFormWithSample() {
    const d = DEFAULT_NEW_SKILL_DATA;
    return {
      id: undefined,
      name: d.name,
      code: d.code,
      type: d.type,
      description: d.description,
      goal: d.goal,
      modelId: d.modelId,
      promptId: d.promptId,
      knowledgeBaseIds: d.knowledgeBaseIds.slice(),
      toolIds: d.toolIds.slice(),
      declareNoTool: false,
      rules: {
        taskGoal: d.rules.taskGoal,
        principles: d.rules.principles.slice(),
        constraints: d.rules.constraints.slice()
      },
      steps: d.steps.slice(),
      inputMode: d.inputMode,
      inputs: d.inputs.map(i => ({ ...i })),
      inputJson: '',
      outputMode: d.outputMode,
      outputs: d.outputs.map(o => ({ ...o })),
      outputJson: ''
    };
  },

  buildHeader() {
    const titleEl = document.getElementById('create-page-title');
    const subEl = document.getElementById('create-page-sub');
    if (this.newVersionMode) {
      titleEl.textContent = `为「${this.form.name}」创建新版本`;
      subEl.textContent = '新版本将作为草稿编辑，发布后替换当前版本。';
      document.getElementById('edit-notice').classList.remove('hidden');
      document.getElementById('edit-notice-name').textContent = this.form.name;
      document.getElementById('edit-notice-version').textContent = ` ${SkillStore.nextVersion(this.original)} `;
    } else if (!this.isNew) {
      titleEl.textContent = `编辑「${this.form.name}」`;
      subEl.textContent = '对草稿 / 已停用 Skill 的配置直接修改，保存后立即生效。';
    }
  },

  /* =============================================
     入口切换
     ============================================= */
  showZipUpload() {
    this.entry = 'zip';
    document.getElementById('entry-section').classList.add('hidden');
    document.getElementById('guided-section').classList.add('hidden');
    document.getElementById('zip-section').classList.remove('hidden');
  },

  showGuidedForm() {
    this.entry = 'guided';
    document.getElementById('entry-section').classList.add('hidden');
    document.getElementById('zip-section').classList.add('hidden');
    document.getElementById('guided-section').classList.remove('hidden');

    if (this.isNew) {
      // 新建时预填示例数据
      this.form = this.buildDefaultFormWithSample();
    }

    this.fillForm();
    this.renderAll();
    this.refreshSummary();
  },

  backToEntry() {
    if (this.isNew) {
      this.entry = 'entry';
      document.getElementById('zip-section').classList.add('hidden');
      document.getElementById('guided-section').classList.add('hidden');
      document.getElementById('entry-section').classList.remove('hidden');
    } else {
      window.location.href = 'skill.html';
    }
  },

  /* =============================================
     折叠面板
     ============================================= */
  toggleCollapse(key) {
    this.collapses[key] = !this.collapses[key];
    const item = document.getElementById('block-' + key);
    if (item) {
      item.classList.toggle('show', this.collapses[key]);
    }
  },

  /* =============================================
     事件绑定
     ============================================= */
  bindEvents() {
    const bind = (ids, fn) => ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', fn);
      el.addEventListener('change', fn);
    });

    bind(['f-name', 'f-code', 'f-desc', 'f-taskgoal', 'f-prompt'], e => {
      const key = e.target.id.slice(2);
      if (key === 'taskgoal') {
        this.form.rules.taskGoal = e.target.value;
      } else if (key === 'prompt') {
        this.form.promptContent = e.target.value;
      } else {
        this.form[key] = e.target.value;
      }
      this.markDirty();
      this.scheduleSummary();
    });

    document.getElementById('f-type').addEventListener('change', e => {
      this.form.type = e.target.value;
      this.markDirty();
      this.refreshSummary();
    });
  },

  bindZipEvents() {
    const dropzone = document.getElementById('sk-dropzone');
    const input = document.getElementById('zip-file-input');
    if (!dropzone || !input) return;

    input.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) this.handleZipFile(file);
    });

    dropzone.addEventListener('dragover', e => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
    dropzone.addEventListener('drop', e => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) this.handleZipFile(file);
    });
  },

  markDirty() { this.dirty = true; },

  scheduleSummary() {
    if (this._sumT) clearTimeout(this._sumT);
    this._sumT = setTimeout(() => { this.refreshSummary(); this.refreshBadges(); }, 180);
  },

  /* =============================================
     ZIP 导入
     ============================================= */
  handleZipFile(file) {
    document.getElementById('zip-error').classList.add('hidden');
    document.getElementById('zip-yaml-preview').classList.add('hidden');

    if (!file.name.endsWith('.zip')) {
      this.showZipError('请选择 .zip 格式的文件');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.showZipError('文件大小不得超过 10MB');
      return;
    }

    this.zipFile = file;
    document.getElementById('zip-file-name').textContent = file.name;
    document.getElementById('zip-file-size').textContent = this.formatSize(file.size);
    document.getElementById('zip-preview').classList.remove('hidden');
    document.getElementById('import-zip-btn').disabled = false;

    const mockYaml = `# SKILL.md 示例（ZIP 包内文件）
name: ${file.name.replace('.zip', '')}
code: ${file.name.replace('.zip', '').replace(/[^a-zA-Z0-9一-龥]/g, '-').toLowerCase()}
type: 数据处理
description: 由技能包导入的 Skill。
goal: 完成数据处理任务
`;
    document.getElementById('yaml-content').textContent = mockYaml;
    document.getElementById('zip-yaml-preview').classList.remove('hidden');
  },

  formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  },

  showZipError(msg) {
    const el = document.getElementById('zip-error');
    el.textContent = msg;
    el.classList.remove('hidden');
  },

  clearZip() {
    this.zipFile = null;
    document.getElementById('zip-preview').classList.add('hidden');
    document.getElementById('zip-yaml-preview').classList.add('hidden');
    document.getElementById('zip-file-input').value = '';
    document.getElementById('import-zip-btn').disabled = true;
    document.getElementById('zip-error').classList.add('hidden');
  },

  importZip() {
    if (!this.zipFile) return;

    const name = this.zipFile.name.replace('.zip', '').replace(/[^a-zA-Z0-9一-龥]/g, '-').toLowerCase() || 'imported-skill';
    const code = name;

    const row = {
      id: SkillStore.genId(),
      name,
      code,
      type: '其他',
      description: '由技能包导入的 Skill。',
      goal: '',
      status: 'draft',
      version: 'V0.1',
      versions: [],
      modelId: '', promptId: '',
      knowledgeBaseIds: [], toolIds: [],
      rules: { taskGoal: '', principles: [], constraints: [] },
      steps: [],
      inputs: [], outputs: [],
      inputMode: 'form', inputJson: '',
      outputMode: 'form', outputJson: '',
      agentIds: [],
      usageCount: 0,
      recent7d: 0,
      createdAt: fmtNow(),
      updatedAt: fmtNow()
    };

    SkillStore.upsert(row);
    Toast.success(`「${row.name}」草稿已创建，可前往编辑完善`, '导入成功');
    setTimeout(() => { window.location.href = `skill-detail.html?id=${row.id}`; }, 800);
  },

  /* =============================================
     表单回填
     ============================================= */
  fillForm() {
    const f = this.form;
    const nameEl = document.getElementById('f-name');
    const codeEl = document.getElementById('f-code');
    const typeEl = document.getElementById('f-type');
    const descEl = document.getElementById('f-desc');
    const taskgoalEl = document.getElementById('f-taskgoal');
    const promptEl = document.getElementById('f-prompt');
    const inputJsonEl = document.getElementById('f-input-json');
    const outputJsonEl = document.getElementById('f-output-json');

    if (nameEl) nameEl.value = f.name || '';
    if (codeEl) codeEl.value = f.code || '';
    if (typeEl) typeEl.value = f.type || '';
    if (descEl) descEl.value = f.description || '';
    if (taskgoalEl) taskgoalEl.value = (f.rules && f.rules.taskGoal) || '';
    if (promptEl) promptEl.value = f.promptContent || '';
    if (inputJsonEl) inputJsonEl.value = f.inputJson || '';
    if (outputJsonEl) outputJsonEl.value = f.outputJson || '';

    this.setIoMode('input', f.inputMode || 'form', true);
    this.setIoMode('output', f.outputMode || 'form', true);
  },

  /* =============================================
     整体渲染
     ============================================= */
  renderAll() {
    this.renderCollapses();
    this.renderConfigCards();
    this.renderRules();
    this.renderSteps();
    this.renderIoRows('input');
    this.renderIoRows('output');
    this.refreshBadges();
    this.refreshSummary();
    this.refreshPublishBtn();
  },

  /* 渲染折叠状态 */
  renderCollapses() {
    Object.keys(this.collapses).forEach(key => {
      const item = document.getElementById('block-' + key);
      if (item) {
        item.classList.toggle('show', !!this.collapses[key]);
      }
    });
  },

  /* =============================================
     配置卡片
     ============================================= */
  renderConfigCards() {
    const f = this.form;
    const model = SkillLookup.modelById(f.modelId);
    const kbs = (f.knowledgeBaseIds || []).map(id => SkillLookup.kbById(id)).filter(Boolean);
    const tools = (f.toolIds || []).map(id => SkillLookup.toolById(id)).filter(Boolean);

    // 模型
    const mc = document.getElementById('model-card');
    if (mc) {
      mc.className = 'sk-choose-card' + (model ? '' : ' empty');
      mc.innerHTML = model ? `
        <div class="sk-choose-icon"><i class="fa-solid fa-microchip"></i></div>
        <div class="sk-choose-body">
          <div class="sk-choose-title">${escapeHtml(model.name)}</div>
          <div class="sk-choose-sub">${escapeHtml(model.vendor)} · ${escapeHtml(model.version)}</div>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); SkillCreate.openModelPicker()"><i class="fa-solid fa-arrows-rotate"></i> 更换</button>
      ` : `
        <div class="sk-choose-icon"><i class="fa-solid fa-microchip"></i></div>
        <div class="sk-choose-body"><div class="sk-choose-empty">点击选择执行模型</div></div>
        <button type="button" class="btn btn-primary btn-sm" onclick="event.stopPropagation(); SkillCreate.openModelPicker()"><i class="fa-solid fa-plus"></i> 选择</button>
      `;
    }

    // 知识库
    const kc = document.getElementById('kb-card');
    if (kc) {
      kc.className = 'sk-choose-card' + (kbs.length ? '' : ' empty');
      kc.innerHTML = kbs.length ? `
        <div class="sk-choose-icon"><i class="fa-solid fa-book-open"></i></div>
        <div class="sk-choose-body">
          <div class="sk-choose-title">已关联 ${kbs.length} 个知识库</div>
          <div class="sk-choose-sub">${escapeHtml(kbs.map(k => k.name).join('、'))}</div>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); SkillCreate.openKbPicker()"><i class="fa-solid fa-sliders"></i> 调整</button>
      ` : `
        <div class="sk-choose-icon"><i class="fa-solid fa-book-open"></i></div>
        <div class="sk-choose-body"><div class="sk-choose-empty">点击关联知识库</div></div>
        <button type="button" class="btn btn-primary btn-sm" onclick="event.stopPropagation(); SkillCreate.openKbPicker()"><i class="fa-solid fa-plus"></i> 添加</button>
      `;
    }

    // MCP工具
    const te = document.getElementById('tool-empty');
    const tp = document.getElementById('tool-picked');
    if (te) te.style.display = tools.length ? 'none' : '';
    if (tp) {
      tp.innerHTML = tools.map(t => `
        <div class="sk-picked-item">
          <div class="sk-choose-icon"><i class="fa-solid fa-plug"></i></div>
          <div class="sk-pick-main">
            <div class="sk-pick-name">${escapeHtml(t.displayName)}</div>
            <div class="sk-pick-meta">${escapeHtml(t.serverName)} · <span class="sk-code-mono">${escapeHtml(t.name)}</span></div>
          </div>
          <button type="button" class="sk-remove-chip" title="移除" onclick="SkillCreate.removeTool('${t.id}')"><i class="fa-regular fa-circle-xmark"></i></button>
        </div>`).join('');
    }
  },

  /* =============================================
     执行步骤
     ============================================= */
  addStep() {
    if (!this.form.steps) this.form.steps = [];
    this.form.steps.push('');
    this.renderSteps();
    this.markDirty();
    this.refreshBadges();
    this.refreshSummary();
  },

  removeStep(i) {
    if (!this.form.steps) return;
    this.form.steps.splice(i, 1);
    this.renderSteps();
    this.markDirty();
    this.refreshBadges();
    this.refreshSummary();
  },

  onStepInput(e, i) {
    if (this.form.steps[i] !== undefined) {
      this.form.steps[i] = e.target.value;
    }
    this.markDirty();
    this.scheduleSummary();
  },

  renderSteps() {
    const list = this.form.steps || [];
    const wrap = document.getElementById('steps-list');
    if (!wrap) return;
    if (!list.length) {
      wrap.innerHTML = '<div class="sk-help-note">暂无执行步骤，点击「添加步骤」补充。</div>';
      return;
    }
    wrap.innerHTML = list.map((s, i) => `
      <div class="sk-step-row">
        <div class="sk-step-handle"><i class="fa-solid fa-grip-vertical"></i></div>
        <input class="form-input" type="text" value="${escapeHtml(s || '')}" placeholder="描述该步骤的执行内容"
          oninput="SkillCreate.onStepInput(event, ${i})">
        <button type="button" class="sk-op-btn danger" title="删除" onclick="SkillCreate.removeStep(${i})"><i class="fa-regular fa-trash-can"></i></button>
      </div>`).join('');
  },

  /* =============================================
     工作原则 / 约束规则
     ============================================= */
  addPrinciple() {
    if (!this.form.rules.principles) this.form.rules.principles = [];
    this.form.rules.principles.push('');
    this.renderPrinciples();
    this.markDirty();
    this.refreshBadges();
    this.refreshSummary();
  },

  addConstraint() {
    if (!this.form.rules.constraints) this.form.rules.constraints = [];
    this.form.rules.constraints.push('');
    this.renderConstraints();
    this.markDirty();
    this.refreshBadges();
    this.refreshSummary();
  },

  removeRule(kind, i) {
    if (!this.form.rules[kind]) return;
    this.form.rules[kind].splice(i, 1);
    this.renderRules();
    this.markDirty();
    this.refreshBadges();
    this.refreshSummary();
  },

  onRuleInput(e, kind, i) {
    if (this.form.rules[kind][i] !== undefined) {
      this.form.rules[kind][i] = e.target.value;
    }
    this.markDirty();
    this.scheduleSummary();
  },

  renderRules() {
    this.renderPrinciples();
    this.renderConstraints();
  },

  renderPrinciples() {
    const list = this.form.rules.principles || [];
    const wrap = document.getElementById('principles-list');
    if (!wrap) return;
    if (!list.length) {
      wrap.innerHTML = '<div class="sk-help-note">暂无工作原则，点击「添加」补充行动指引。</div>';
      return;
    }
    wrap.innerHTML = list.map((p, i) => `
      <div class="sk-rule-input-row">
        <span class="sk-rule-index">${i + 1}</span>
        <input class="form-input" type="text" value="${escapeHtml(p || '')}" placeholder="例如：优先获取权威数据源"
          oninput="SkillCreate.onRuleInput(event, 'principles', ${i})">
        <button type="button" class="sk-op-btn danger" title="删除" onclick="SkillCreate.removeRule('principles', ${i})"><i class="fa-regular fa-trash-can"></i></button>
      </div>`).join('');
  },

  renderConstraints() {
    const list = this.form.rules.constraints || [];
    const wrap = document.getElementById('constraints-list');
    if (!wrap) return;
    if (!list.length) {
      wrap.innerHTML = '<div class="sk-help-note">暂无约束规则，点击「添加」设定执行红线。</div>';
      return;
    }
    wrap.innerHTML = list.map((c, i) => `
      <div class="sk-rule-input-row">
        <span class="sk-rule-index">${i + 1}</span>
        <input class="form-input" type="text" value="${escapeHtml(c || '')}" placeholder="例如：不得修改原始数据"
          oninput="SkillCreate.onRuleInput(event, 'constraints', ${i})">
        <button type="button" class="sk-op-btn danger" title="删除" onclick="SkillCreate.removeRule('constraints', ${i})"><i class="fa-regular fa-circle-xmark"></i></button>
      </div>`).join('');
  },

  /* =============================================
     输入输出
     ============================================= */
  setIoMode(kind, mode, silent) {
    this.form[kind === 'input' ? 'inputMode' : 'outputMode'] = mode;
    const seg = document.getElementById(kind + '-seg');
    if (seg) seg.querySelectorAll('.sk-seg-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    const formWrap = document.getElementById(kind + '-form-config');
    const jsonEl = document.getElementById(kind === 'input' ? 'f-input-json' : 'f-output-json');
    if (formWrap) formWrap.style.display = mode === 'form' ? '' : 'none';
    if (jsonEl) jsonEl.classList.toggle('hidden', mode !== 'json');
    const addBtn = document.getElementById(kind === 'input' ? 'add-input-btn' : 'add-output-btn');
    if (addBtn) addBtn.style.display = mode === 'form' ? '' : 'none';
    if (!silent) { this.markDirty(); this.refreshBadges(); this.refreshSummary(); }
  },

  addIoRow(kind) {
    const arr = kind === 'input' ? this.form.inputs : this.form.outputs;
    arr.push(kind === 'input'
      ? { key: '', label: '', type: 'String', required: false, desc: '', example: '' }
      : { name: '', type: 'String', desc: '' });
    this.renderIoRows(kind);
    this.markDirty();
    this.refreshBadges();
    this.refreshSummary();
  },

  removeIoRow(kind, i) {
    const arr = kind === 'input' ? this.form.inputs : this.form.outputs;
    arr.splice(i, 1);
    this.renderIoRows(kind);
    this.markDirty();
    this.refreshBadges();
    this.refreshSummary();
  },

  onIoInput(e, kind) {
    const row = e.target.closest('.sk-io-row');
    if (!row) return;
    const i = parseInt(row.dataset.i, 10);
    const arr = kind === 'input' ? this.form.inputs : this.form.outputs;
    if (!arr[i]) return;
    const field = e.target.dataset.f;
    if (field === 'required') arr[i].required = e.target.checked;
    else if (field === 'type') arr[i].type = e.target.value;
    else arr[i][field] = e.target.value;
    this.markDirty();
    this.scheduleSummary();
  },

  renderIoRows(kind) {
    const isInput = kind === 'input';
    const arr = isInput ? this.form.inputs : this.form.outputs;
    const wrap = document.getElementById(kind + '-form-config');
    if (!wrap) return;
    const typeOptions = ['String', 'Integer', 'Number', 'Boolean', 'Object', 'Array']
      .map(t => `<option value="${t}">${t}</option>`).join('');

    if (!arr.length) {
      wrap.innerHTML = `<div class="sk-help-note">暂无${isInput ? '输入' : '输出'}参数。</div>`;
      return;
    }

    wrap.innerHTML = arr.map((row, i) => {
      const opts = typeOptions.replace('>' + (row.type || 'String') + '<', ' selected>' + (row.type || 'String') + '<');
      if (isInput) {
        return `<div class="sk-io-row" data-i="${i}">
          <div class="sk-io-main">
            <div class="sk-io-line t1">
              <div class="sk-io-fld"><label>参数名</label><input class="form-input" data-f="key" value="${escapeHtml(row.key)}" placeholder="resourceId"></div>
              <div class="sk-io-fld"><label>类型</label><select class="form-select" data-f="type">${opts}</select></div>
              <div class="sk-io-fld"><label>必填</label><label class="form-checkbox-wrapper sk-io-req-chk"><input type="checkbox" class="form-checkbox" data-f="required" ${row.required ? 'checked' : ''}><span class="form-checkbox-label">是</span></label></div>
            </div>
            <div class="sk-io-line t2">
              <div class="sk-io-fld"><label>说明</label><input class="form-input" data-f="desc" value="${escapeHtml(row.desc)}" placeholder="参数含义"></div>
              <div class="sk-io-fld"><label>示例</label><input class="form-input" data-f="example" value="${escapeHtml(row.example)}" placeholder="示例值"></div>
            </div>
          </div>
          <button type="button" class="sk-op-btn danger sk-io-remove" title="删除" onclick="SkillCreate.removeIoRow('input', ${i})"><i class="fa-regular fa-trash-can"></i></button>
        </div>`;
      }
      return `<div class="sk-io-row" data-i="${i}">
        <div class="sk-io-main">
          <div class="sk-io-line t3">
            <div class="sk-io-fld"><label>字段名</label><input class="form-input" data-f="name" value="${escapeHtml(row.name)}" placeholder="resourceName"></div>
            <div class="sk-io-fld"><label>类型</label><select class="form-select" data-f="type">${opts}</select></div>
            <div class="sk-io-fld"><label>说明</label><input class="form-input" data-f="desc" value="${escapeHtml(row.desc)}" placeholder="字段含义"></div>
          </div>
        </div>
        <button type="button" class="sk-op-btn danger sk-io-remove" title="删除" onclick="SkillCreate.removeIoRow('output', ${i})"><i class="fa-regular fa-circle-xmark"></i></button>
      </div>`;
    }).join('');

    if (!wrap._bound) {
      wrap._bound = true;
      wrap.addEventListener('input', e => this.onIoInput(e, kind));
      wrap.addEventListener('change', e => this.onIoInput(e, kind));
    }
  },

  /* =============================================
     选择弹层
     ============================================= */
  openModelPicker() {
    const items = SkillLookup.enabledModels();
    const rows = items.map(m => `
      <div class="sk-pick-item ${this.form.modelId === m.id ? 'selected' : ''}" onclick="SkillCreate.pickModel('${m.id}')">
        <div class="sk-pick-check"><i class="fa-solid fa-check"></i></div>
        <div class="sk-pick-main">
          <div class="sk-pick-name">${escapeHtml(m.name)} <span class="sk-version-text">${escapeHtml(m.version)}</span></div>
          <div class="sk-pick-meta">${escapeHtml(m.vendor)} · 上下文 ${escapeHtml(m.contextLength)}</div>
        </div>
        <div class="sk-pick-right">已启用</div>
      </div>`).join('');
    this.openPick('model', '选择执行模型', rows, '仅展示已启用模型');
  },

  pickModel(id) {
    this.form.modelId = id;
    this.markDirty();
    this.renderConfigCards();
    this.refreshBadges();
    this.refreshSummary();
    this.refreshPublishBtn();
    this.closePick();
  },

  openPromptPicker() {
    const items = SkillCatalog.prompts.filter(p => p.status === 'published');
    const rows = items.map(p => `
      <div class="sk-pick-item ${this.form.promptId === p.id ? 'selected' : ''}" onclick="SkillCreate.pickPrompt('${p.id}')">
        <div class="sk-pick-check"><i class="fa-solid fa-check"></i></div>
        <div class="sk-pick-main">
          <div class="sk-pick-name">${escapeHtml(p.name)} <span class="sk-version-text">${escapeHtml(p.version || '')}</span></div>
          <div class="sk-pick-meta">${escapeHtml(p.category || '')} · 发布于 ${escapeHtml(p.updatedAt || '')}</div>
        </div>
        <div class="sk-pick-right">已发布</div>
      </div>`).join('');
    this.openPick('prompt', '选择指令模板（Prompt）', rows, 'Prompt 规定了模型如何完成任务');
  },

  pickPrompt(id) {
    this.form.promptId = id;
    const prompt = SkillLookup.promptById(id);
    if (prompt) {
      // 同步更新 prompt 内容
      const promptEl = document.getElementById('f-prompt');
      if (promptEl && !promptEl.value.trim()) {
        // 有模板内容时不做自动填充，用户可自行导入
      }
    }
    this.markDirty();
    this.renderConfigCards();
    this.refreshBadges();
    this.refreshSummary();
    this.refreshPublishBtn();
    this.closePick();
  },

  /* 从模板库导入 Prompt */
  importFromTemplate() {
    this.openPromptPicker();
  },

  /* 查看 Prompt 示例 */
  viewPromptExample() {
    const example = `【角色】你是一名专业的数据资源编目专家。

【输入】
- resourceId: 数据资源唯一标识
- resourceMetadata: 数据资源的字段与描述信息

【任务】
1. 解析资源元数据，获取资源名称、字段列表
2. 依据数据资源分类标准判断资源所属类别
3. 根据资源内容和字段含义生成资源描述
4. 提取能反映资源主题的标签
5. 识别资源的更新频率
6. 生成符合规范的标准化编目结果

【原则】
- 描述须忠于字段实际含义，不自行编造
- 分类必须遵循分类标准，不得随意划分
- 生成结果须符合输出 Schema

【输出格式】
{
  "resourceId": "R20260001",
  "resourceName": "企业登记信息",
  "description": "反映企业登记注册相关信息的数据资源",
  "categoryCode": "01",
  "categoryName": "法人数据",
  "tags": ["企业", "登记", "工商"],
  "updateFrequency": "每日",
  "confidence": 0.94
}`;

    Modal.create({
      title: '指令模板示例',
      content: `<div class="sk-example-modal"><pre class="sk-json" style="max-height:420px;overflow-y:auto;">${escapeHtml(example)}</pre></div>`,
      footer: '<button class="btn btn-primary btn-sm" onclick="SkillCreate.closePick()">关闭</button>',
      size: 'lg'
    }).open();
  },

  openKbPicker() {
    this.pick = { kind: 'kb', id: null };
    this._renderKbPicker();
  },

  _renderKbPicker() {
    const items = SkillCatalog.knowledgeBases;
    const rows = items.map(k => `
      <div class="sk-pick-item ${this.form.knowledgeBaseIds.indexOf(k.id) >= 0 ? 'selected' : ''}" onclick="SkillCreate.toggleKb('${k.id}')">
        <div class="sk-pick-check"><i class="fa-solid fa-check"></i></div>
        <div class="sk-pick-main">
          <div class="sk-pick-name">${escapeHtml(k.name)}</div>
          <div class="sk-pick-meta">${escapeHtml(k.type || '')} · ${k.docCount} 篇文档</div>
        </div>
      </div>`).join('');
    this._openPickMulti('kb', '关联知识库（可多选）', rows, `${this.form.knowledgeBaseIds.length} 个已选择`);
  },

  toggleKb(id) {
    const arr = this.form.knowledgeBaseIds;
    const i = arr.indexOf(id);
    i >= 0 ? arr.splice(i, 1) : arr.push(id);
    this.markDirty();
    this._renderKbPicker();
    this.renderConfigCards();
    this.refreshBadges();
    this.refreshSummary();
  },

  openToolPicker() {
    this.pick = { kind: 'tool', id: null };
    this._renderToolPicker();
  },

  _renderToolPicker() {
    const servers = SkillCatalog.toolServers;
    const groups = servers.map(sv => {
      const tools = SkillCatalog.tools.filter(t => t.serverId === sv.id);
      const rows = tools.map(t => `
        <div class="sk-pick-item ${this.form.toolIds.indexOf(t.id) >= 0 ? 'selected' : ''}" onclick="SkillCreate.toggleTool('${t.id}')">
          <div class="sk-pick-check"><i class="fa-solid fa-check"></i></div>
          <div class="sk-pick-main">
            <div class="sk-pick-name"><span class="sk-code-mono">${escapeHtml(t.name)}</span></div>
            <div class="sk-pick-meta">${escapeHtml(t.displayName)} · ${escapeHtml(t.desc || '')}</div>
          </div>
        </div>`).join('');
      return rows ? `<div style="font-size:12px;color:var(--color-text-muted);margin:4px 2px;font-weight:600;"><i class="fa-solid fa-server"></i> ${escapeHtml(sv.name)}</div>${rows}` : '';
    }).join('');
    this._openPickMulti('tool', '授权 MCP 工具（可多选）', groups, `${this.form.toolIds.length} 个已选择`);
  },

  toggleTool(id) {
    const arr = this.form.toolIds;
    const i = arr.indexOf(id);
    i >= 0 ? arr.splice(i, 1) : arr.push(id);
    this.markDirty();
    this._renderToolPicker();
    this.renderConfigCards();
    this.refreshBadges();
    this.refreshSummary();
    this.refreshPublishBtn();
  },

  removeTool(id) {
    this.form.toolIds = this.form.toolIds.filter(t => t !== id);
    this.markDirty();
    this.renderConfigCards();
    this.refreshBadges();
    this.refreshSummary();
    this.refreshPublishBtn();
  },

  /* --- 弹层封装 --- */
  openPick(kind, title, rowsHtml, footerText) {
    this.closePick();
    const content = `<div class="sk-pick-modal"><div class="sk-pick-list">${rowsHtml || '<div style="padding:24px;color:var(--color-text-muted);">暂无可选项</div>'}</div></div>`;
    const footer = `<div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
        <span class="muted-text">${footerText || ''}</span>
        <button class="btn btn-secondary btn-sm" onclick="SkillCreate.closePick()">取消</button>
      </div>`;
    const m = Modal.create({ title, content, footer, size: 'lg' });
    this.pick = { kind, id: m.id };
    m.open();
  },

  _openPickMulti(kind, title, rowsHtml, countText) {
    if (this.pick && this.pick.id) {
      const overlay = document.getElementById(this.pick.id);
      if (overlay) {
        overlay.querySelector('.modal-body').innerHTML = `<div class="sk-pick-modal"><div class="sk-pick-list">${rowsHtml || ''}</div></div>`;
        const footer = overlay.querySelector('.modal-footer');
        if (footer) footer.querySelector('.sk-pick-count').textContent = countText;
        return;
      }
    }
    const content = `<div class="sk-pick-modal"><div class="sk-pick-list">${rowsHtml || ''}</div></div>`;
    const footer = `<div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
        <span class="sk-pick-count muted-text">${countText}</span>
        <button class="btn btn-primary btn-sm" onclick="SkillCreate.closePick()">完成</button>
      </div>`;
    const m = Modal.create({ title, content, footer, size: 'lg' });
    this.pick = { kind, id: m.id };
    m.open();
  },

  closePick() {
    if (!this.pick || !this.pick.id) return;
    Modal.close(this.pick.id);
    const overlay = document.getElementById(this.pick.id);
    if (overlay) setTimeout(() => overlay.remove(), 300);
    this.pick = null;
  },

  /* =============================================
     状态徽标刷新
     ============================================= */
  refreshBadges() {
    const f = this.form;
    const has = v => v && String(v).trim().length > 0;
    const cnt = arr => arr && arr.length > 0;

    // 基本信息：名称+编码+类型+描述
    const basicOk = has(f.name) && has(f.code) && has(f.type) && has(f.description);
    this._setBadge('basic', basicOk);

    // 任务目标
    const goalOk = has(f.rules && f.rules.taskGoal);
    this._setBadge('goal', goalOk);

    // 指令模板
    const promptOk = has(f.promptContent) || has(f.promptId);
    this._setBadge('prompt', promptOk);

    // 执行步骤（可选）
    const stepsOk = cnt(f.steps);
    this._setBadge('steps', null, stepsOk);

    // 工作原则（可选）
    const principlesOk = cnt(f.rules && f.rules.principles);
    this._setBadge('principles', null, principlesOk);

    // 约束规则（可选）
    const constraintsOk = cnt(f.rules && f.rules.constraints);
    this._setBadge('constraints', null, constraintsOk);

    // 输入输出（可选）
    const ioOk = cnt(f.inputs) || cnt(f.outputs) || has(f.inputJson) || has(f.outputJson);
    this._setBadge('io', null, ioOk);

    // 使用能力
    const abilityOk = has(f.modelId) || cnt(f.toolIds) || cnt(f.knowledgeBaseIds);
    this._setBadge('ability', abilityOk);
  },

  _setBadge(key, requiredOk, optionalOk) {
    const el = document.getElementById('badge-' + key);
    if (!el) return;
    if (requiredOk === true) {
      el.textContent = '已配置';
      el.className = 'sk-collapse-badge configured';
    } else if (requiredOk === false) {
      el.textContent = '未配置';
      el.className = 'sk-collapse-badge missing';
    } else {
      // 可选区块
      if (optionalOk) {
        el.textContent = '已配置';
        el.className = 'sk-collapse-badge configured';
      } else {
        el.textContent = '可选';
        el.className = 'sk-collapse-badge optional';
      }
    }
  },

  /* =============================================
     右侧摘要
     ============================================= */
  refreshSummary() {
    const f = this.form;
    const model = SkillLookup.modelById(f.modelId);
    const prompt = SkillLookup.promptById(f.promptId);
    const kbs = (f.knowledgeBaseIds || []).map(id => SkillLookup.kbById(id)).filter(Boolean);
    const tools = (f.toolIds || []).map(id => SkillLookup.toolById(id)).filter(Boolean);

    // 计算完成度（6项：基本信息/任务目标/指令模板/执行模型/MCP工具/输入输出）
    const items = [
      { key: 'basic', label: '基本信息', ok: !!(f.name && f.code && f.type && f.description), req: true },
      { key: 'goal', label: '任务目标', ok: !!(f.rules && f.rules.taskGoal), req: true },
      { key: 'prompt', label: '指令模板', ok: !!(f.promptContent || f.promptId), req: true },
      { key: 'model', label: '执行模型', ok: !!f.modelId, req: false },
      { key: 'tool', label: 'MCP工具', ok: !!(f.toolIds && f.toolIds.length), req: false },
      { key: 'io', label: '输入输出', ok: !!((f.inputs && f.inputs.length) || (f.outputs && f.outputs.length) || f.inputJson || f.outputJson), req: false }
    ];

    const completedCount = items.filter(i => i.ok).length;
    const totalCount = items.length;
    const pct = Math.round((completedCount / totalCount) * 100);
    const isAllRequiredDone = items.filter(i => i.req).every(i => i.ok);

    const body = document.getElementById('summary-body');
    if (!body) return;

    body.innerHTML = `
      <div class="sk-sum-name">${escapeHtml(f.name || '未命名 Skill')}</div>

      <!-- 完成度进度条 -->
      <div class="sk-sum-progress-wrap">
        <div class="sk-sum-progress-head">
          <span class="sk-sum-progress-label">完成度</span>
          <span class="sk-sum-progress-pct">${pct}%</span>
        </div>
        <div class="sk-sum-progress-bar">
          <div class="sk-sum-progress-fill ${pct === 100 ? 'done' : ''}" style="width:${pct}%"></div>
        </div>
      </div>

      <!-- 逐项状态列表 -->
      <div class="sk-sum-checklist">
        ${items.map(item => `
          <div class="sk-sum-check-item">
            <div class="sk-sum-check-icon ${item.ok ? 'yes' : (item.req ? 'no' : 'skip')}">
              <i class="fa-solid ${item.ok ? 'fa-check' : (item.req ? 'fa-times' : 'fa-minus')}"></i>
            </div>
            <span class="sk-sum-check-text">${item.label}</span>
          </div>
        `).join('')}
      </div>

      <!-- 缺少提示 -->
      ${!isAllRequiredDone ? `
        <div class="sk-sum-lacking">
          <i class="fa-solid fa-circle-exclamation" style="margin-right:4px;"></i>
          还差：${
            items.filter(i => i.req && !i.ok).map(i => i.label).join('、')
          }
        </div>
      ` : ''}
    `;

    // 控制发布按钮
    this.refreshPublishBtn(isAllRequiredDone);
  },

  refreshPublishBtn(forcedState) {
    const btn = document.getElementById('publish-btn');
    if (!btn) return;
    const f = this.form;
    const isAllRequiredDone = forcedState !== undefined
      ? forcedState
      : !!(f.rules && f.rules.taskGoal) && !!(f.promptContent || f.promptId);
    btn.disabled = !isAllRequiredDone;
  },

  /* =============================================
     发布
     ============================================= */
  publishSkill() {
    const f = this.form;
    const missing = [];
    if (!f.rules || !f.rules.taskGoal) missing.push('任务目标');
    if (!f.promptContent && !f.promptId) missing.push('指令模板');

    if (missing.length > 0) {
      Toast.warning(`还差 ${missing.length} 项未配置：${missing.join('、')}`);
      return;
    }

    // 保存并发布
    this.saveGuidedDraft(true);
  },

  /* =============================================
     保存草稿
     ============================================= */
  saveGuidedDraft(isPublishing) {
    const f = this.form;
    if (!f.name.trim()) { Toast.warning('请填写 Skill 名称'); return; }
    if (!f.code.trim()) { Toast.warning('请填写 Skill 编码'); return; }
    if (!f.type) { Toast.warning('请选择 Skill 类型'); return; }

    let row;
    if (f.id) {
      row = SkillStore.get(f.id);
      if (!row) { Toast.danger('该草稿记录已不存在'); return; }
    } else {
      row = {
        id: SkillStore.genId(),
        status: 'draft',
        version: 'V0.1',
        versions: [],
        agentIds: [],
        usageCount: 0,
        recent7d: 0,
        createdAt: fmtNow()
      };
      f.id = row.id;
    }
    this._applyForm(row, f);
    SkillStore.upsert(row);

    if (isPublishing) {
      const published = SkillStore.publish(row, '');
      Toast.success(`「${row.name}」已发布`);
      setTimeout(() => { window.location.href = `skill-detail.html?id=${published.id}`; }, 700);
    } else {
      this.dirty = false;
      Toast.success(`「${row.name}」草稿已保存`, '保存成功');
      setTimeout(() => { window.location.href = `skill-detail.html?id=${row.id}`; }, 700);
    }
  },

  _applyForm(row, f) {
    row.name = f.name;
    row.code = f.code;
    row.type = f.type;
    row.description = f.description;
    row.goal = f.goal || '';
    row.modelId = f.modelId || '';
    row.promptId = f.promptId || '';
    row.knowledgeBaseIds = f.knowledgeBaseIds || [];
    row.toolIds = f.toolIds || [];
    row.declareNoTool = f.declareNoTool || false;
    row.rules = Object.assign({}, f.rules);
    row.steps = f.steps || [];
    row.inputs = f.inputs || [];
    row.outputs = f.outputs || [];
    row.inputMode = f.inputMode || 'form';
    row.inputJson = f.inputJson || '';
    row.outputMode = f.outputMode || 'form';
    row.outputJson = f.outputJson || '';
    row.promptContent = f.promptContent || '';
    row.updatedAt = fmtNow();
  },

  /* =============================================
     离开页面
     ============================================= */
  goBack() {
    if (this.dirty && !this.isNew) {
      Modal.confirm({
        title: '放弃当前编辑？',
        message: '当前修改尚未保存，离开后将丢失。确定离开吗？',
        type: 'warning',
        confirmText: '放弃编辑',
        onConfirm: () => { window.location.href = 'skill.html'; }
      });
      return;
    }
    window.location.href = 'skill.html';
  }
};

window.SkillCreate = SkillCreate;
