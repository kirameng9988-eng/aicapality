/* =====================================================
   Agent 管理 - 创建 Agent 页逻辑
   创建只定义岗位身份：Agent名称 / 岗位名称 / 岗位描述。
   Skill、MCP、知识库、模型等一律放到工作台细化。
   ===================================================== */

const AgentCreate = {
  init() {
    this.preview();
    this.bindLive();
  },

  el(id) { return document.getElementById(id); },

  value(id) {
    const el = this.el(id);
    return el ? el.value.trim() : '';
  },

  bindLive() {
    ['ac-name', 'ac-role', 'ac-desc'].forEach(id => {
      const el = this.el(id);
      if (el) el.addEventListener('input', () => {
        this.clearError(id);
        this.preview();
      });
    });
  },

  preview() {
    const name = this.value('ac-name');
    const role = this.value('ac-role');
    const desc = this.value('ac-desc');
    const category = inferCategory(name, role, desc);
    const meta = AGENT_CATEGORY_META[category] || AGENT_CATEGORY_META['通用助手'];
    const avatar = this.el('ac-preview').querySelector('.ag-preview-avatar');
    if (avatar) {
      avatar.style.setProperty('--cat', meta.color);
      avatar.innerHTML = `<i class="fa-solid ${meta.icon}"></i>`;
    }
    const nameEl = this.el('ac-preview-name');
    if (nameEl) {
      nameEl.textContent = name || '智能岗位名称';
      nameEl.classList.toggle('placeholder', !name);
    }
    const roleEl = this.el('ac-preview-role');
    if (roleEl) {
      roleEl.textContent = role || '岗位名称';
      roleEl.classList.toggle('placeholder', !role);
    }
    const descEl = this.el('ac-preview-desc');
    if (descEl) {
      descEl.textContent = desc || '岗位描述将在保存后展示在这里，作为团队识别该Agent职责的依据。';
      descEl.classList.toggle('placeholder', !desc);
    }
  },

  markError(id) {
    const el = this.el(id);
    if (el) el.classList.add('ag-input-error');
  },

  clearError(id) {
    const el = this.el(id);
    if (el) el.classList.remove('ag-input-error');
  },

  submit() {
    const name = this.value('ac-name');
    const role = this.value('ac-role');
    const desc = this.value('ac-desc');
    let errId = null;
    let errMsg = null;
    if (!name) { this.markError('ac-name'); errId = errId || 'ac-name'; errMsg = errMsg || '请填写Agent名称'; }
    if (!role) { this.markError('ac-role'); errId = errId || 'ac-role'; errMsg = errMsg || '请填写岗位名称'; }
    if (!desc) { this.markError('ac-desc'); errId = errId || 'ac-desc'; errMsg = errMsg || '请填写岗位描述'; }

    if (errMsg) {
      Toast.warning(errMsg, '信息不完整');
      const errEl = this.el(errId);
      if (errEl) errEl.focus();
      return;
    }

    const now = fmtNow();
    const category = inferCategory(name, role, desc);
    const agent = {
      id: AgentStore.genId(),
      name: name,
      roleName: role,
      category: category,
      description: desc,
      instructionsHtml: '',
      instructions: '',
      skills: [],
      tools: [],
      knowledgeBases: [],
      agents: [],
      model: AGENT_DEFAULT_MODEL,
      settings: Object.assign({}, AGENT_DEFAULT_SETTINGS),
      status: 'draft',
      version: 'v1.0',
      creator: '林砚舟',
      usageCount: 0,
      recent7d: 0,
      protocols: ['MCP', 'OpenAPI', 'SDK'],
      applyMode: 'approval',
      calls: 0,
      rating: 0,
      reviews: 0,
      publishInfo: null,
      versions: [],
      createdAt: now,
      updatedAt: now
    };
    AgentStore.upsert(agent);

    const btn = this.el('ac-submit');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> 创建中...';
    }

    Toast.success(`「${agent.name}」已创建，继续完善它的岗位能力。`, '创建成功');
    setTimeout(() => {
      window.parent.postMessage({ type: 'navigate', url: 'pages/ai-build/agent-workbench.html?id=' + encodeURIComponent(agent.id) }, '*');
    }, 650);
  },

  goBack() {
    const name = this.value('ac-name');
    const role = this.value('ac-role');
    const desc = this.value('ac-desc');
    if (name || role || desc) {
      Modal.confirm({
        title: '放弃创建',
        message: '当前已填写的内容将不会保存，确定返回Agent列表吗？',
        type: 'warning',
        confirmText: '放弃并返回',
        onConfirm: () => { window.parent.postMessage({ type: 'navigate', url: 'pages/ai-build/agent.html' }, '*'); }
      });
      return;
    }
    window.parent.postMessage({ type: 'navigate', url: 'pages/ai-build/agent.html' }, '*');
  }
};

window.AgentCreate = AgentCreate;
