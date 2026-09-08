/* =====================================================
   Prompt Studio JavaScript
   AI Capability Open Platform
   Redesigned: Card Grid + Editor + Tabbed Detail Panel
   ===================================================== */

class PromptStudio {
  constructor() {
    this.data = null;
    this.currentPrompt = null;
    this.currentTab = 'system';
    this.currentDetailTab = 'variables';
    this.isRunning = false;

    // Pagination & filter state
    this.page = 1;
    this.pageSize = 6;
    this.filterCategory = '';
    this.filterStatus = '';
    this.searchQuery = '';

    this.init();
  }

  async init() {
    try {
      await this.loadData();
      this.render();
      this.bindEvents();
    } catch (error) {
      console.error('Failed to initialize Prompt Studio:', error);
    }
  }

  async loadData() {
    try {
      const analytics = await loadMockData('analytics');
      if (analytics && analytics.promptStudio) {
        this.data = analytics.promptStudio;
      } else {
        console.error('Failed to load prompt data: analytics.promptStudio is null');
        this.showToast('加载数据失败', 'error');
      }
    } catch (error) {
      console.error('Failed to load prompt data:', error);
      this.showToast('加载数据失败', 'error');
    }
  }

  /* ---- Render Methods ---- */

  render() {
    this.renderCardGrid();
    this.renderPagination();
    if (this.currentPrompt) {
      this.renderEditor();
      this.renderVariables();
      this.renderPerformanceStats();
      this.renderVersionHistory();
      this.renderTestInputs();
    } else {
      this.renderEmptyEditor();
    }
  }

  getFilteredPrompts() {
    let list = [...(this.data?.promptList || [])];

    if (this.filterCategory) {
      list = list.filter(p => p.category === this.filterCategory);
    }
    if (this.filterStatus) {
      list = list.filter(p => p.status === this.filterStatus);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }

  renderCardGrid() {
    const container = document.getElementById('promptCardGrid');
    const countEl = document.getElementById('cardsCount');
    if (!container) return;

    const allFiltered = this.getFilteredPrompts();
    const totalPages = Math.max(1, Math.ceil(allFiltered.length / this.pageSize));
    if (this.page > totalPages) this.page = totalPages;

    const start = (this.page - 1) * this.pageSize;
    const prompts = allFiltered.slice(start, start + this.pageSize);

    if (countEl) countEl.textContent = allFiltered.length;

    if (allFiltered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-inline" style="padding: var(--space-8);">
          <i class="fa-solid fa-search"></i>
          <h3>未找到匹配</h3>
          <p>尝试调整筛选条件</p>
        </div>
      `;
      return;
    }

    container.innerHTML = prompts.map(prompt => `
      <div class="prompt-card ${this.currentPrompt?.id === prompt.id ? 'active' : ''}" data-id="${prompt.id}">
        <div class="prompt-card-header">
          <div class="prompt-card-name">${this.escapeHtml(prompt.name)}</div>
          <span class="prompt-card-status status-${prompt.status}">${this.getStatusText(prompt.status)}</span>
        </div>
        <div class="prompt-card-category">
          <i class="fa-solid fa-folder"></i>
          ${prompt.category}
        </div>
        <div class="prompt-card-desc">${this.escapeHtml(prompt.description || '')}</div>
        <div class="prompt-card-tags">
          ${(prompt.tags || []).slice(0, 3).map(tag => `<span class="prompt-card-tag">${this.escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="prompt-card-footer">
          <div class="prompt-card-meta">
            <span class="prompt-card-version">v${prompt.version}</span>
            <span class="prompt-card-calls">${this.formatNumber(prompt.calls)}次调用</span>
          </div>
          <div class="prompt-card-meta">
            <i class="fa-solid fa-user"></i> ${prompt.owner}
          </div>
        </div>
      </div>
    `).join('');
  }

  renderPagination() {
    const container = document.getElementById('promptPagination');
    if (!container) return;

    const total = this.getFilteredPrompts().length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));

    if (totalPages <= 1) {
      container.innerHTML = `<span class="pagination-info">共 ${total} 条</span><div class="pagination-controls"></div>`;
      return;
    }

    const start = (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, total);

    let pagesHtml = '';
    pagesHtml += `<button class="pagination-item" data-page="prev" ${this.page === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
      pagesHtml += `<button class="pagination-item ${i === this.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    pagesHtml += `<button class="pagination-item" data-page="next" ${this.page === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;

    container.innerHTML = `
      <span class="pagination-info">${start}-${end} / 共 ${total} 条</span>
      <div class="pagination-controls">${pagesHtml}</div>
    `;
  }

  goToPage(page) {
    const totalPages = Math.max(1, Math.ceil(this.getFilteredPrompts().length / this.pageSize));
    if (page === 'prev') page = this.page - 1;
    else if (page === 'next') page = this.page + 1;
    page = Number(page);
    if (isNaN(page) || page < 1 || page > totalPages || page === this.page) return;
    this.page = page;
    this.renderCardGrid();
    this.renderPagination();
  }

  renderEditor() {
    const detail = this.data.promptDetail;

    document.getElementById('editorTitle').textContent = detail.name;
    document.getElementById('editorBadge').textContent = `v${detail.version}`;

    const systemEditor = document.getElementById('systemPromptEditor');
    systemEditor.innerHTML = this.highlightVariables(detail.systemPrompt);

    const userEditor = document.getElementById('userPromptEditor');
    userEditor.innerHTML = this.highlightVariables(detail.userPrompt);

    const assistantEditor = document.getElementById('assistantPromptEditor');
    assistantEditor.innerHTML = this.escapeHtml(detail.assistantPrompt);

    document.getElementById('modelName').textContent = detail.model;
    document.getElementById('tempValue').textContent = detail.temperature;
    document.getElementById('tempSlider').value = detail.temperature;

    const versionSelect = document.getElementById('versionSelect');
    versionSelect.innerHTML = detail.versions.map(v =>
      `<option value="${v}" ${v === detail.version ? 'selected' : ''}>v${v}</option>`
    ).join('');

    document.getElementById('versionCount').textContent = `${detail.versions.length} 个版本`;
  }

  renderEmptyEditor() {
    document.getElementById('editorTitle').textContent = '选择 Prompt';
    document.getElementById('editorBadge').textContent = '';
    document.getElementById('modelName').textContent = '--';
    document.getElementById('tempValue').textContent = '0.7';

    const systemEditor = document.getElementById('systemPromptEditor');
    if (systemEditor) {
      systemEditor.innerHTML = `
        <div class="empty-state-inline">
          <i class="fa-solid fa-hand-pointer"></i>
          <h3>选择左侧 Prompt</h3>
          <p>从卡片列表中选择一个 Prompt 开始编辑</p>
        </div>
      `;
    }

    const userEditor = document.getElementById('userPromptEditor');
    if (userEditor) userEditor.innerHTML = '';

    const assistantEditor = document.getElementById('assistantPromptEditor');
    if (assistantEditor) assistantEditor.innerHTML = '';

    document.getElementById('versionSelect').innerHTML = '<option value="">--</option>';
    document.getElementById('versionCount').textContent = '0 个版本';
  }

  /* ---- Detail Tab Rendering ---- */

  renderVariables() {
    const variables = this.data.variables || [];
    const container = document.getElementById('variablesList');
    if (!container) return;

    if (!this.currentPrompt) {
      container.innerHTML = `
        <div class="empty-state-inline" style="padding: var(--space-8);">
          <i class="fa-solid fa-list-check" style="font-size:28px;"></i>
          <h3>暂无变量</h3>
          <p>选择一个 Prompt 查看其变量</p>
        </div>
      `;
      return;
    }

    if (variables.length === 0) {
      container.innerHTML = `
        <div class="empty-state-inline" style="padding: var(--space-6);">
          <i class="fa-solid fa-list-check" style="font-size:24px;"></i>
          <p style="font-size: var(--font-size-xs);">暂无变量</p>
        </div>
      `;
      return;
    }

    container.innerHTML = variables.map(v => `
      <div class="variable-item" data-id="${v.id}">
        <div class="variable-item-header">
          <div class="variable-name">
            ${this.escapeHtml(v.name)}
            ${v.required ? '<span class="required-dot"></span>' : ''}
          </div>
          <span class="variable-type-badge">${v.type}</span>
        </div>
        <div class="variable-item-actions">
          <button class="btn-icon-sm" data-action="edit-var" data-var-id="${v.id}" title="编辑">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-icon-sm" data-action="delete-var" data-var-id="${v.id}" title="删除">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        <div class="variable-default">默认值: <span class="variable-default-value">${v.defaultValue || '无'}</span></div>
        <div class="variable-desc">${this.escapeHtml(v.description || '')}</div>
      </div>
    `).join('');
  }

  renderPerformanceStats() {
    const detail = this.data.promptDetail || {};
    const container = document.getElementById('performanceStats');
    if (!container) return;

    if (!this.currentPrompt) {
      container.innerHTML = `
        <div class="empty-state-inline" style="padding: var(--space-8);">
          <i class="fa-solid fa-gauge-high" style="font-size:28px;"></i>
          <h3>暂无数据</h3>
          <p>选择一个 Prompt 查看指标</p>
        </div>
      `;
      return;
    }

    const stats = [
      { label: '日调用次数', value: this.formatNumber(detail.dailyCalls || 0), icon: 'fa-chart-line' },
      { label: '活跃应用', value: detail.activeApps || 0, icon: 'fa-rocket' },
      { label: '成功率', value: (detail.successRate || 0) + '%', icon: 'fa-check-circle', class: detail.successRate >= 99 ? 'success' : 'warning' },
      { label: 'P99延迟', value: (detail.p99Latency || 0) + 'ms', icon: 'fa-gauge' },
      { label: 'Token消耗/日', value: this.formatNumber(detail.dailyTokens || 0), icon: 'fa-coins' }
    ];

    container.innerHTML = stats.map(s => `
      <div class="perf-stat-item">
        <div class="perf-stat-label">
          <i class="fa-solid ${s.icon}"></i>
          ${s.label}
        </div>
        <div class="perf-stat-value ${s.class || ''}">${s.value}</div>
      </div>
    `).join('');
  }

  renderVersionHistory() {
    const versions = this.data.versionHistory || [];
    const container = document.getElementById('versionList');
    if (!container) return;

    if (!this.currentPrompt) {
      container.innerHTML = `
        <div class="empty-state-inline" style="padding: var(--space-8);">
          <i class="fa-solid fa-history" style="font-size:28px;"></i>
          <h3>暂无版本</h3>
          <p>选择一个 Prompt 查看版本</p>
        </div>
      `;
      return;
    }

    container.innerHTML = versions.map(v => `
      <div class="version-item ${v.isCurrent ? 'current' : ''}" data-version="${v.version}">
        <div class="version-dot"></div>
        <div class="version-content">
          <div class="version-number">v${v.version}</div>
          <div class="version-meta">
            <span>${v.updatedBy}</span>
            <span>·</span>
            <span>${v.updatedAt}</span>
            ${v.isCurrent ? '<span class="version-current-badge">当前</span>' : ''}
          </div>
          <div class="version-changes">${this.escapeHtml(v.changes || '')}</div>
        </div>
      </div>
    `).join('');
  }

  renderTestInputs() {
    const container = document.getElementById('testInputs');
    if (!container) return;

    const variables = this.data.variables || [];
    const testResult = this.data.testResult;

    if (!this.currentPrompt || variables.length === 0) {
      container.innerHTML = `
        <div class="empty-state-inline">
          <i class="fa-solid fa-keyboard" style="font-size:24px;"></i>
          <p>选择 Prompt 后在此填写变量</p>
        </div>
      `;
      return;
    }

    container.innerHTML = variables.map(v => `
      <div class="test-variable">
        <label class="test-variable-label">
          ${this.escapeHtml(v.name)}
          ${v.required ? '<span class="required">*</span>' : ''}
        </label>
        ${v.type === 'select'
          ? `<select class="test-variable-input" data-var="${v.name}">
              <option value="">请选择</option>
              ${(v.options || []).map(opt => `<option value="${opt}">${opt}</option>`).join('')}
             </select>`
          : `<textarea class="test-variable-input" data-var="${v.name}"
              placeholder="输入 ${v.name}...">${testResult?.input?.[v.name] || ''}</textarea>`
        }
      </div>
    `).join('');
  }

  /* ---- Event Binding ---- */

  bindEvents() {
    // Card grid selection
    document.getElementById('promptCardGrid')?.addEventListener('click', (e) => {
      const card = e.target.closest('.prompt-card');
      if (card) {
        this.selectPrompt(card.dataset.id);
      }
    });

    // Editor tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });

    // Detail tabs
    document.querySelectorAll('.detail-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchDetailTab(tab.dataset.detailTab);
      });
    });

    // Version selector
    document.getElementById('versionSelect')?.addEventListener('change', (e) => {
      this.switchVersion(e.target.value);
    });

    // Temperature slider
    document.getElementById('tempSlider')?.addEventListener('input', (e) => {
      document.getElementById('tempValue').textContent = e.target.value;
    });

    // Filter selects
    document.getElementById('categoryFilter')?.addEventListener('change', () => {
      this.applyFilters();
    });

    document.getElementById('statusFilter')?.addEventListener('change', () => {
      this.applyFilters();
    });

    // Search
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
      this.searchPrompts(e.target.value);
    });

    // Pagination clicks
    document.getElementById('promptPagination')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.pagination-item');
      if (btn && !btn.disabled) {
        this.goToPage(btn.dataset.page);
      }
    });

    // New prompt button
    document.getElementById('newPrompt')?.addEventListener('click', () => {
      this.showNewPromptDialog();
    });

    // Import button
    document.getElementById('importPrompt')?.addEventListener('click', () => {
      this.showImportDialog();
    });

    // Add variable button
    document.getElementById('addVariableBtn')?.addEventListener('click', () => {
      this.showAddVariableDialog();
    });

    // Run test button
    document.getElementById('runTestBtn')?.addEventListener('click', () => {
      this.runTest();
    });

    // Variable list actions
    document.getElementById('variablesList')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="edit-var"]');
      if (btn) {
        this.showEditVariableDialog(btn.dataset.varId);
        return;
      }
      const delBtn = e.target.closest('[data-action="delete-var"]');
      if (delBtn) {
        Modal.confirm({
          title: '确认删除',
          message: '确定要删除这个变量吗？',
          type: 'danger',
          confirmText: '删除',
          onConfirm: () => {
            this.deleteVariable(delBtn.dataset.varId);
          }
        });
      }
    });

    // Test model select syncs with editor
    document.getElementById('testModel')?.addEventListener('change', (e) => {
      document.getElementById('modelName').textContent = e.target.value;
    });
  }

  /* ---- Action Methods ---- */

  selectPrompt(id) {
    const prompt = this.data.promptList.find(p => p.id === id);
    if (prompt) {
      this.currentPrompt = prompt;
      this.renderCardGrid();
      this.renderPagination();
      this.renderEditor();
      this.renderVariables();
      this.renderPerformanceStats();
      this.renderVersionHistory();
      this.renderTestInputs();

      // Switch to variables tab when selecting a new prompt
      this.switchDetailTab('variables');
    }
  }

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.editor-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.querySelectorAll('.editor-pane').forEach(p => {
      p.classList.toggle('active', p.id === `${tab}PromptPane`);
    });
  }

  switchDetailTab(tab) {
    this.currentDetailTab = tab;
    document.querySelectorAll('.detail-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.detailTab === tab);
    });
    document.querySelectorAll('.detail-pane').forEach(p => {
      p.classList.toggle('active', p.id === `detail${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    });
  }

  switchVersion(version) {
    this.showToast(`切换到版本 v${version}（Mock）`, 'info');
  }

  applyFilters() {
    this.filterCategory = document.getElementById('categoryFilter')?.value || '';
    this.filterStatus = document.getElementById('statusFilter')?.value || '';
    this.page = 1;
    this.renderCardGrid();
    this.renderPagination();
  }

  searchPrompts(query) {
    this.searchQuery = (query || '').trim();
    this.page = 1;
    this.renderCardGrid();
    this.renderPagination();
  }

  async runTest() {
    if (!this.currentPrompt) {
      this.showToast('请先选择 Prompt', 'error');
      return;
    }

    if (this.isRunning) return;
    this.isRunning = true;

    const btn = document.getElementById('runTestBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner spinner"></i> 运行中';
    }

    const outputSection = document.getElementById('testOutputSection');
    const outputBody = document.getElementById('testOutputBody');
    const outputMeta = document.getElementById('testOutputMeta');

    if (outputSection) outputSection.style.display = 'block';
    if (outputBody) {
      outputBody.innerHTML = `
        <div class="test-output-loading">
          <div class="spinner"></div>
          <span>正在运行测试...</span>
        </div>
      `;
    }

    // Sync temperature
    const temp = parseFloat(document.getElementById('tempSlider')?.value || 0.7);
    document.getElementById('testTempDisplay').textContent = temp.toFixed(1);

    // Simulate API call
    await this.delay(1500);

    this.isRunning = false;
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-play"></i>运行';
    }

    // Show mock result
    const result = this.data.testResult;
    if (result && outputBody) {
      outputBody.innerHTML = this.highlightJson(result.output.result);
      if (outputMeta) {
        outputMeta.innerHTML = `
          <span class="test-output-stat tokens"><i class="fa-solid fa-hashtag"></i> ${result.tokens.totalTokens} tokens</span>
          <span class="test-output-stat latency"><i class="fa-solid fa-clock"></i> ${result.latency}ms</span>
          <span class="test-output-stat version"><i class="fa-solid fa-code-branch"></i> v${this.data.promptDetail.version}</span>
        `;
      }
    }

    this.showToast('测试完成（Mock 数据）', 'success');
  }

  /* ---- Utility Methods ---- */

  highlightVariables(text) {
    if (!text) return '';
    return this.escapeHtml(text).replace(
      /\{\{(\w+)\}\}/g,
      '<span class="variable">{{$1}}</span>'
    );
  }

  highlightJson(text) {
    try {
      const obj = JSON.parse(text);
      const formatted = JSON.stringify(obj, null, 2);
      return this.escapeHtml(formatted)
        .replace(/"([^"]+)":/g, '<span class="keyword">"$1"</span>:')
        .replace(/: "([^"]+)"/g, ': <span class="string">"$1"</span>');
    } catch {
      return this.escapeHtml(text);
    }
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  getStatusText(status) {
    const map = { published: '已发布', draft: '草稿', testing: '测试中' };
    return map[status] || status;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showToast(message, type = 'info') {
    const typeMap = { success: 'success', error: 'danger', info: 'info', warning: 'warning' };
    const toastType = typeMap[type] || 'info';
    Toast.show({ type: toastType, message, duration: 3000 });
  }

  /* ---- Dialog Methods ---- */

  showNewPromptDialog() {
    const categories = this.data.categories || [];
    const models = this.data.models || [];

    const modal = Modal.create({
      id: 'newPromptDialog',
      title: '新建 Prompt',
      size: 'lg',
      content: `
        <div class="form-group">
          <label class="form-label form-label-required">Prompt 名称</label>
          <input type="text" class="form-input" id="newPromptName" placeholder="输入 Prompt 名称">
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label form-label-required">所属分类</label>
            <select class="form-select" id="newPromptCategory">
              ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label form-label-required">绑定模型</label>
            <select class="form-select" id="newPromptModel">
              ${models.map(m => `<option value="${m}">${m}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">描述</label>
          <textarea class="form-textarea" id="newPromptDesc" rows="3" placeholder="输入 Prompt 描述"></textarea>
        </div>
      `,
      footer: `
        <button class="btn btn-secondary" data-action="close">取消</button>
        <button class="btn btn-primary" id="confirmNewPrompt">创建</button>
      `
    });

    modal.open();

    setTimeout(() => {
      document.getElementById('confirmNewPrompt')?.addEventListener('click', () => {
        const name = document.getElementById('newPromptName')?.value?.trim();
        const category = document.getElementById('newPromptCategory')?.value;
        const model = document.getElementById('newPromptModel')?.value;
        const desc = document.getElementById('newPromptDesc')?.value?.trim();

        if (!name) {
          this.showToast('请输入 Prompt 名称', 'error');
          return;
        }

        const newPrompt = {
          id: 'prompt-' + Date.now(),
          name: name,
          description: desc || '',
          category: category,
          tags: [],
          model: model,
          variables: [],
          status: 'draft',
          calls: 0,
          owner: '当前用户',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          version: '1.0',
          versions: ['1.0']
        };

        this.data.promptList.unshift(newPrompt);
        this.currentPrompt = newPrompt;
        this.page = 1;

        this.render();
        modal.close();
        this.showToast('Prompt 创建成功', 'success');
      });
    }, 100);
  }

  showImportDialog() {
    const modal = Modal.create({
      id: 'importPromptDialog',
      title: '导入 Prompt',
      size: 'lg',
      content: `
        <div class="form-group">
          <label class="form-label">导入方式</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="importType" value="json" checked> JSON 文件
            </label>
            <label class="radio-label">
              <input type="radio" name="importType" value="text"> 文本粘贴
            </label>
          </div>
        </div>
        <div class="form-group" id="jsonImportSection">
          <label class="form-label">选择 JSON 文件</label>
          <div class="file-upload">
            <input type="file" class="file-input" id="importFile" accept=".json">
            <div class="file-upload-area">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <p>点击或拖拽文件到此处上传</p>
              <span class="file-hint">支持 .json 格式</span>
            </div>
          </div>
        </div>
        <div class="form-group" id="textImportSection" style="display: none;">
          <label class="form-label">粘贴 Prompt 内容</label>
          <textarea class="form-textarea" id="importText" rows="8" placeholder="粘贴 Prompt 内容..."></textarea>
        </div>
      `,
      footer: `
        <button class="btn btn-secondary" data-action="close">取消</button>
        <button class="btn btn-primary" id="confirmImport">导入</button>
      `
    });

    modal.open();

    setTimeout(() => {
      document.querySelectorAll('input[name="importType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          const isJson = e.target.value === 'json';
          document.getElementById('jsonImportSection').style.display = isJson ? 'block' : 'none';
          document.getElementById('textImportSection').style.display = isJson ? 'none' : 'block';
        });
      });

      document.getElementById('importFile')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              JSON.parse(e.target.result);
              this.showToast(`已选择文件: ${file.name}`, 'success');
            } catch {
              this.showToast('JSON 格式错误', 'error');
            }
          };
          reader.readAsText(file);
        }
      });

      document.getElementById('confirmImport')?.addEventListener('click', () => {
        const importType = document.querySelector('input[name="importType"]:checked')?.value;

        if (importType === 'text') {
          const text = document.getElementById('importText')?.value?.trim();
          if (!text) {
            this.showToast('请输入 Prompt 内容', 'error');
            return;
          }

          const newPrompt = {
            id: 'prompt-' + Date.now(),
            name: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
            description: '从文本导入',
            category: '数据问答',
            tags: ['导入'],
            model: 'GPT-4o',
            variables: [],
            status: 'draft',
            calls: 0,
            owner: '当前用户',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            version: '1.0',
            versions: ['1.0'],
            systemPrompt: text
          };

          this.data.promptList.unshift(newPrompt);
          this.currentPrompt = newPrompt;
          this.page = 1;
          this.render();

          modal.close();
          this.showToast('Prompt 导入成功', 'success');
        } else {
          modal.close();
        }
      });
    }, 100);
  }

  showAddVariableDialog() {
    if (!this.currentPrompt) {
      this.showToast('请先选择 Prompt', 'error');
      return;
    }

    const types = ['string', 'textarea', 'number', 'boolean', 'select', 'array', 'json'];
    const typesHtml = types.map(t => `<option value="${t}">${t}</option>`).join('');

    const modal = Modal.create({
      id: 'addVariableDialog',
      title: '添加变量',
      size: 'md',
      content: `
        <div class="form-group">
          <label class="form-label form-label-required">变量名称</label>
          <input type="text" class="form-input" id="varName" placeholder="输入变量名称">
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label form-label-required">变量类型</label>
            <select class="form-select" id="varType">${typesHtml}</select>
          </div>
          <div class="form-group">
            <label class="form-label">必填</label>
            <div class="toggle-wrapper">
              <input type="checkbox" id="varRequired" checked>
              <label class="toggle-label" for="varRequired"></label>
            </div>
          </div>
        </div>
        <div class="form-group" id="optionsGroup" style="display: none;">
          <label class="form-label">选项（逗号分隔）</label>
          <input type="text" class="form-input" id="varOptions" placeholder="选项1, 选项2, 选项3">
        </div>
        <div class="form-group">
          <label class="form-label">默认值</label>
          <input type="text" class="form-input" id="varDefault" placeholder="默认值（可选）">
        </div>
        <div class="form-group">
          <label class="form-label">描述</label>
          <textarea class="form-textarea" id="varDesc" rows="2" placeholder="变量描述（可选）"></textarea>
        </div>
      `,
      footer: `
        <button class="btn btn-secondary" data-action="close">取消</button>
        <button class="btn btn-primary" id="confirmAddVar">添加</button>
      `
    });

    modal.open();

    setTimeout(() => {
      document.getElementById('varType')?.addEventListener('change', (e) => {
        document.getElementById('optionsGroup').style.display = e.target.value === 'select' ? 'block' : 'none';
      });

      document.getElementById('confirmAddVar')?.addEventListener('click', () => {
        const name = document.getElementById('varName')?.value?.trim();
        const type = document.getElementById('varType')?.value;
        const required = document.getElementById('varRequired')?.checked;
        const options = document.getElementById('varOptions')?.value;
        const defaultVal = document.getElementById('varDefault')?.value;
        const desc = document.getElementById('varDesc')?.value?.trim();

        if (!name) {
          this.showToast('请输入变量名称', 'error');
          return;
        }

        const newVar = {
          id: 'var-' + Date.now(),
          name: name,
          type: type,
          required: required,
          defaultValue: defaultVal || '',
          description: desc || '',
          options: type === 'select' && options ? options.split(',').map(o => o.trim()) : []
        };

        if (!this.currentPrompt.variables) this.currentPrompt.variables = [];
        this.currentPrompt.variables.push(newVar);

        this.renderVariables();
        this.renderTestInputs();

        modal.close();
        this.showToast('变量添加成功', 'success');
      });
    }, 100);
  }

  showEditVariableDialog(varId) {
    if (!this.currentPrompt) {
      this.showToast('请先选择 Prompt', 'error');
      return;
    }

    const variable = this.currentPrompt.variables?.find(v => v.id === varId);
    if (!variable) {
      this.showToast('未找到变量', 'error');
      return;
    }

    const types = ['string', 'textarea', 'number', 'boolean', 'select', 'array', 'json'];
    const typesHtml = types.map(t => `<option value="${t}" ${t === variable.type ? 'selected' : ''}>${t}</option>`).join('');

    const modal = Modal.create({
      id: 'editVariableDialog',
      title: '编辑变量',
      size: 'md',
      content: `
        <div class="form-group">
          <label class="form-label form-label-required">变量名称</label>
          <input type="text" class="form-input" id="editVarName" value="${this.escapeHtml(variable.name)}">
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label form-label-required">变量类型</label>
            <select class="form-select" id="editVarType">${typesHtml}</select>
          </div>
          <div class="form-group">
            <label class="form-label">必填</label>
            <div class="toggle-wrapper">
              <input type="checkbox" id="editVarRequired" ${variable.required ? 'checked' : ''}>
              <label class="toggle-label" for="editVarRequired"></label>
            </div>
          </div>
        </div>
        <div class="form-group" id="editOptionsGroup" style="display: ${variable.type === 'select' ? 'block' : 'none'};">
          <label class="form-label">选项（逗号分隔）</label>
          <input type="text" class="form-input" id="editVarOptions" value="${variable.options?.join(', ') || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">默认值</label>
          <input type="text" class="form-input" id="editVarDefault" value="${this.escapeHtml(variable.defaultValue || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">描述</label>
          <textarea class="form-textarea" id="editVarDesc" rows="2">${this.escapeHtml(variable.description || '')}</textarea>
        </div>
      `,
      footer: `
        <button class="btn btn-secondary" data-action="close">取消</button>
        <button class="btn btn-primary" id="confirmEditVar">保存</button>
      `
    });

    modal.open();

    setTimeout(() => {
      document.getElementById('editVarType')?.addEventListener('change', (e) => {
        document.getElementById('editOptionsGroup').style.display = e.target.value === 'select' ? 'block' : 'none';
      });

      document.getElementById('confirmEditVar')?.addEventListener('click', () => {
        const name = document.getElementById('editVarName')?.value?.trim();
        const type = document.getElementById('editVarType')?.value;
        const required = document.getElementById('editVarRequired')?.checked;
        const options = document.getElementById('editVarOptions')?.value;
        const defaultVal = document.getElementById('editVarDefault')?.value;
        const desc = document.getElementById('editVarDesc')?.value?.trim();

        if (!name) {
          this.showToast('请输入变量名称', 'error');
          return;
        }

        variable.name = name;
        variable.type = type;
        variable.required = required;
        variable.defaultValue = defaultVal || '';
        variable.description = desc || '';
        variable.options = type === 'select' && options ? options.split(',').map(o => o.trim()) : [];

        this.renderVariables();
        this.renderTestInputs();

        modal.close();
        this.showToast('变量保存成功', 'success');
      });
    }, 100);
  }

  deleteVariable(varId) {
    if (!this.currentPrompt?.variables) return;
    const index = this.currentPrompt.variables.findIndex(v => v.id === varId);
    if (index !== -1) {
      this.currentPrompt.variables.splice(index, 1);
      this.renderVariables();
      this.renderTestInputs();
      this.showToast('变量已删除', 'success');
    }
  }
}

/* ---- Initialize ---- */
document.addEventListener('DOMContentLoaded', () => {
  window.promptStudio = new PromptStudio();
});
