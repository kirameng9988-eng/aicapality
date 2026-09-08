/* =====================================================
   Optimization Center Page Script
   AI Capability Open Platform
   Sprint 13 - Optimization Center
   ===================================================== */

// 全局状态
const STATE = {
  page: { suggestions: 1, tasks: 1, versions: 1, history: 1 },
  pageSize: 5
};

document.addEventListener('DOMContentLoaded', async () => {
  initHeaderDropdown();
  highlightActiveMenu();
  await renderOptimization();
});

function initHeaderDropdown() {}
function highlightActiveMenu() {}

/**
 * Main render function
 */
async function renderOptimization() {
  const data = await loadMockData('optimize');
  if (!data) {
    document.getElementById('app-content').innerHTML = '<div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-triangle-exclamation"></i></div><div>数据加载失败</div></div>';
    return;
  }

  const html = `
    <!-- ① Page Intro -->
    <div class="page-intro">
      <div class="page-intro-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
      <div class="page-intro-content">
        <div class="page-intro-title">AI能力优化中心</div>
        <div class="page-intro-desc">基于调用数据与用户反馈，持续发现 AI 能力的优化空间，驱动「建议 → 任务 → 发布 → 效果追踪」的优化闭环，让平台能力越用越准。</div>
        <div class="page-intro-flow">
          <span><i class="fa-solid fa-lightbulb"></i> 发现建议</span>
          <i class="fa-solid fa-angle-right"></i>
          <span><i class="fa-solid fa-list-check"></i> 执行任务</span>
          <i class="fa-solid fa-angle-right"></i>
          <span><i class="fa-solid fa-code-branch"></i> 发布版本</span>
          <i class="fa-solid fa-angle-right"></i>
          <span><i class="fa-solid fa-chart-line"></i> 效果追踪</span>
        </div>
      </div>
    </div>

    <!-- ① KPI Overview -->
    <div class="kpi-overview-grid">
      <div class="kpi-overview-card">
        <div class="kpi-overview-icon orange"><i class="fa-solid fa-clock"></i></div>
        <div class="kpi-overview-content">
          <div class="kpi-overview-value">${data.overview.pendingOptimization}</div>
          <div class="kpi-overview-label">待优化能力数</div>
        </div>
      </div>
      <div class="kpi-overview-card">
        <div class="kpi-overview-icon blue"><i class="fa-solid fa-list-check"></i></div>
        <div class="kpi-overview-content">
          <div class="kpi-overview-value">${data.overview.optimizationTasks}</div>
          <div class="kpi-overview-label">优化任务数</div>
        </div>
      </div>
      <div class="kpi-overview-card">
        <div class="kpi-overview-icon green"><i class="fa-solid fa-check-double"></i></div>
        <div class="kpi-overview-content">
          <div class="kpi-overview-value">${data.overview.completedThisMonth}</div>
          <div class="kpi-overview-label">本月完成优化</div>
        </div>
      </div>
      <div class="kpi-overview-card">
        <div class="kpi-overview-icon purple"><i class="fa-solid fa-arrow-trend-up"></i></div>
        <div class="kpi-overview-content">
          <div class="kpi-overview-value">${data.overview.avgEffectImprovement}%</div>
          <div class="kpi-overview-label">平均效果提升</div>
        </div>
      </div>
      <div class="kpi-overview-card">
        <div class="kpi-overview-icon cyan"><i class="fa-solid fa-percent"></i></div>
        <div class="kpi-overview-content">
          <div class="kpi-overview-value">${data.overview.successRate}%</div>
          <div class="kpi-overview-label">优化成功率</div>
        </div>
      </div>
      <div class="kpi-overview-card">
        <div class="kpi-overview-icon indigo"><i class="fa-solid fa-code-branch"></i></div>
        <div class="kpi-overview-content">
          <div class="kpi-overview-value">${data.overview.totalVersionsPublished}</div>
          <div class="kpi-overview-label">累计发布新版本</div>
        </div>
      </div>
    </div>

    <!-- Section Tabs -->
    <div class="opt-tabs">
      <button class="opt-tab active" data-tab="suggestions">优化建议</button>
      <button class="opt-tab" data-tab="tasks">优化任务</button>
      <button class="opt-tab" data-tab="versions">版本演进</button>
      <button class="opt-tab" data-tab="insights">运营洞察</button>
      <button class="opt-tab" data-tab="history">优化历史</button>
    </div>

    <!-- ② Suggestions Center -->
    <div class="opt-tab-panel active" data-panel="suggestions">
    <section class="optimization-section">
      <div class="section-header-row">
        <div>
          <h2 class="section-title-lg"><i class="fa-solid fa-lightbulb"></i> 优化建议中心</h2>
          <div class="section-desc">系统自动分析调用量、响应质量、用户反馈与成本，生成的能力优化建议清单。</div>
        </div>
        <div class="info-popover">
          <button class="btn btn-secondary btn-sm" title="查看建议生成逻辑"><i class="fa-solid fa-circle-info"></i> 生成逻辑</button>
          <div class="popover-content">
            <div class="popover-title"><i class="fa-solid fa-brain"></i> 建议生成逻辑说明</div>
            <ul class="popover-list">
              <li><i class="fa-solid fa-chart-line"></i> 调用量分析<span> — 基于近7天/30天调用数据波动检测异常</span></li>
              <li><i class="fa-solid fa-star"></i> 响应质量评分<span> — AI 评估每次响应的准确性与完整性</span></li>
              <li><i class="fa-solid fa-users"></i> 用户反馈聚合<span> — 汇总用户满意度与纠错反馈</span></li>
              <li><i class="fa-solid fa-coins"></i> 成本效率评估<span> — 单次调用成本与收益比分析</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="optimization-card">
        <div class="optimization-card-body" style="padding: 0">
          <table class="suggestions-table">
            <thead>
              <tr>
                <th>建议类型</th>
                <th>影响能力</th>
                <th>优先级</th>
                <th>建议原因</th>
                <th>预计收益</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody id="suggestions-tbody"></tbody>
          </table>
          <div class="pagination" id="suggestions-pagination"></div>
        </div>
      </div>
    </section>
    </div>

    <!-- ③ Tasks -->
    <div class="opt-tab-panel" data-panel="tasks">
    <section class="optimization-section">
      <div class="section-header-row">
        <div>
          <h2 class="section-title-lg"><i class="fa-solid fa-list-check"></i> 优化任务管理</h2>
          <div class="section-desc">将优化建议落地为执行任务，跟踪进度并发布新版本。点击任务卡片查看详情。</div>
        </div>
      </div>
      <div class="tasks-grid" id="tasks-grid"></div>
      <div class="pagination" id="tasks-pagination"></div>
    </section>
    </div>

    <!-- ④ Version Timeline (list) -->
    <div class="opt-tab-panel" data-panel="versions">
    <section class="optimization-section">
      <div class="section-header-row">
        <div>
          <h2 class="section-title-lg"><i class="fa-solid fa-code-branch"></i> 版本演进</h2>
          <div class="section-desc">记录每个能力每次优化发布后的版本变更与效果提升。点击版本查看发布详情与效果对比。</div>
        </div>
      </div>
      <div class="optimization-card">
        <div class="optimization-card-body">
          <div class="version-list" id="versions-list"></div>
          <div class="pagination" id="versions-pagination"></div>
        </div>
      </div>
    </section>
    </div>

    <!-- ⑤ Insights Dashboard -->
    <div class="opt-tab-panel" data-panel="insights">
    <section class="optimization-section">
      <div class="section-header-row">
        <div>
          <h2 class="section-title-lg"><i class="fa-solid fa-brain"></i> AI 运营洞察看板</h2>
          <div class="section-desc">跨能力聚合的运营健康度洞察，识别共性问题与优化方向。</div>
        </div>
      </div>
      <div class="insight-summary">
        <div class="insight-summary-card">
          <div class="insight-summary-label">平均 Prompt 命中率</div>
          <div class="insight-summary-value">89.3%</div>
          <div class="insight-summary-trend down"><i class="fa-solid fa-arrow-down"></i> 低于目标 92%</div>
        </div>
        <div class="insight-summary-card">
          <div class="insight-summary-label">高成本模型占比</div>
          <div class="insight-summary-value">35.2%</div>
          <div class="insight-summary-trend down"><i class="fa-solid fa-arrow-down"></i> 存在优化空间</div>
        </div>
        <div class="insight-summary-card">
          <div class="insight-summary-label">知识库平均覆盖率</div>
          <div class="insight-summary-value">87.5%</div>
          <div class="insight-summary-trend down"><i class="fa-solid fa-arrow-down"></i> 目标 90%+</div>
        </div>
        <div class="insight-summary-card">
          <div class="insight-summary-label">优化发布准时率</div>
          <div class="insight-summary-value">65.2%</div>
          <div class="insight-summary-trend up"><i class="fa-solid fa-arrow-up"></i> 环比 +8%</div>
        </div>
      </div>
      <div class="insights-grid" id="insights-grid"></div>
    </section>
    </div>

    <!-- ⑥ History -->
    <div class="opt-tab-panel" data-panel="history">
    <section class="optimization-section">
      <div class="section-header-row">
        <div>
          <h2 class="section-title-lg"><i class="fa-solid fa-history"></i> 优化历史</h2>
          <div class="section-desc">所有已完成的优化记录。点击记录查看优化详情与版本效果。</div>
        </div>
        <button class="btn btn-secondary btn-sm"><i class="fa-solid fa-download"></i> 导出</button>
      </div>
      <div class="optimization-card">
        <div class="optimization-card-body" style="padding: 0">
          <table class="history-table">
            <thead>
              <tr>
                <th>能力名称</th>
                <th>优化类型</th>
                <th>优化时间</th>
                <th>优化人</th>
                <th>结果</th>
                <th>版本号</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody id="history-tbody"></tbody>
          </table>
          <div class="pagination" id="history-pagination"></div>
        </div>
      </div>
    </section>
    </div>
  `;

  document.getElementById('app-content').innerHTML = html;
  initTabs();
  renderSuggestions();
  renderTasks();
  renderVersions();
  renderInsights();
  renderHistory();
}

/* =====================================================
   分页渲染
   ===================================================== */

function paginate(arr, page) {
  const size = STATE.pageSize;
  const total = arr.length;
  const pages = Math.max(1, Math.ceil(total / size));
  if (page > pages) page = pages;
  const start = (page - 1) * size;
  return { items: arr.slice(start, start + size), page, pages, total, start: start + (total ? 1 : 0), end: Math.min(start + size, total) };
}

function renderPagination(containerId, key, total, pages, current) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (total <= STATE.pageSize && pages <= 1) { el.innerHTML = ''; return; }
  let btns = '';
  btns += `<button class="page-btn ${current <= 1 ? 'disabled' : ''}" onclick="goPage('${key}', ${current - 1})"><i class="fa-solid fa-angle-left"></i></button>`;
  for (let i = 1; i <= pages; i++) {
    btns += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="goPage('${key}', ${i})">${i}</button>`;
  }
  btns += `<button class="page-btn ${current >= pages ? 'disabled' : ''}" onclick="goPage('${key}', ${current + 1})"><i class="fa-solid fa-angle-right"></i></button>`;
  const { start, end } = paginate(getList(key), current);
  el.innerHTML = `
    <span class="pagination-info">共 ${total} 条，第 ${total ? start : 0}-${end} 条 / ${pages} 页</span>
    <div class="pagination-btns">${btns}</div>
  `;
}

function getList(key) {
  const data = getMockDataSync('optimize');
  return { suggestions: data.suggestions, tasks: data.tasks, versions: data.versions, history: data.history }[key] || [];
}

function goPage(key, n) {
  const data = getMockDataSync('optimize');
  const list = { suggestions: data.suggestions, tasks: data.tasks, versions: data.versions, history: data.history }[key];
  const pages = Math.max(1, Math.ceil(list.length / STATE.pageSize));
  if (n < 1 || n > pages) return;
  STATE.page[key] = n;
  if (key === 'suggestions') renderSuggestions();
  else if (key === 'tasks') renderTasks();
  else if (key === 'versions') renderVersions();
  else if (key === 'history') renderHistory();
}

/* =====================================================
   优化建议
   ===================================================== */

function renderSuggestions() {
  const data = getMockDataSync('optimize');
  const { items, page, pages, total } = paginate(data.suggestions, STATE.page.suggestions);
  const tbody = document.getElementById('suggestions-tbody');
  if (tbody) {
    tbody.innerHTML = items.map(sug => `
      <tr>
        <td><span class="type-badge ${sug.type}">${sug.typeLabel}</span></td>
        <td><span class="font-medium text-primary">${sug.capabilityName}</span></td>
        <td><span class="priority-badge ${sug.priority}">${sug.priorityLabel}</span></td>
        <td style="max-width: 260px; color: var(--color-text-secondary);">${sug.reason}</td>
        <td style="color: var(--color-success); font-size: var(--font-size-xs);">${sug.expectedBenefit}</td>
        <td><span class="status-badge ${sug.status}">${sug.statusLabel}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="showSuggestionDetail('${sug.id}')"><i class="fa-solid fa-eye"></i> 详情</button>
        </td>
      </tr>
    `).join('');
  }
  renderPagination('suggestions-pagination', 'suggestions', total, pages, page);
}

function showSuggestionDetail(id) {
  const data = getMockDataSync('optimize');
  const sug = data.suggestions.find(s => s.id === id);
  if (!sug) return;
  showModal('优化建议详情', `
    <div class="form-grid">
      <div class="form-group" style="grid-column: span 2;">
        <label class="form-label">建议类型</label>
        <div class="form-value"><span class="type-badge ${sug.type}">${sug.typeLabel}</span></div>
      </div>
      <div class="form-group">
        <label class="form-label">影响能力</label>
        <div class="form-value">${sug.capabilityName}</div>
      </div>
      <div class="form-group">
        <label class="form-label">优先级</label>
        <div class="form-value"><span class="priority-badge ${sug.priority}">${sug.priorityLabel}</span></div>
      </div>
      <div class="form-group" style="grid-column: span 2;">
        <label class="form-label">建议原因</label>
        <div class="form-value">${sug.reason}</div>
      </div>
      <div class="form-group" style="grid-column: span 2;">
        <label class="form-label">预计收益</label>
        <div class="form-value" style="color: var(--color-success);">${sug.expectedBenefit}</div>
      </div>
      <div class="form-group">
        <label class="form-label">状态</label>
        <div class="form-value"><span class="status-badge ${sug.status}">${sug.statusLabel}</span></div>
      </div>
      <div class="form-group">
        <label class="form-label">创建时间</label>
        <div class="form-value">${sug.createdAt}</div>
      </div>
    </div>
    ${sug.basis ? `
    <div class="suggestion-basis">
      <div class="suggestion-basis-title"><i class="fa-solid fa-chart-bar"></i> 建议生成依据</div>
      <ul class="suggestion-basis-list">
        ${sug.basis.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
  `, true, '关闭', '创建优化任务', () => {
    createTaskFromSuggestion(sug.id);
  });
}

/* =====================================================
   优化任务
   ===================================================== */

function renderTasks() {
  const data = getMockDataSync('optimize');
  const { items, page, pages, total } = paginate(data.tasks, STATE.page.tasks);
  const grid = document.getElementById('tasks-grid');
  if (grid) {
    grid.innerHTML = items.map(task => `
      <div class="task-item" id="task-${task.id}" onclick="viewTaskDetail('${task.id}')" style="cursor: pointer;">
        <div class="task-icon ${task.status}">
          <i class="fa-solid ${task.status === 'completed' ? 'fa-check' : task.status === 'in_progress' ? 'fa-spinner fa-spin' : 'fa-clock'}"></i>
        </div>
        <div class="task-content">
          <div class="task-name">${task.name}</div>
          <div class="task-meta">
            <span class="task-meta-item"><i class="fa-solid fa-cube"></i> ${task.capabilityName}</span>
            <span class="task-meta-item"><i class="fa-solid fa-user"></i> ${task.owner}</span>
            <span class="task-meta-item"><i class="fa-solid fa-calendar"></i> ${task.planEndDate}</span>
          </div>
        </div>
        <div class="task-progress-wrap">
          <div class="task-progress-bar">
            <div class="task-progress-fill ${task.status}" style="width: ${task.progress}%"></div>
          </div>
          <div class="task-progress-text">${task.progress}%</div>
        </div>
        <div class="task-actions">
          ${task.status === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); startOptimization('${task.id}')"><i class="fa-solid fa-play"></i> 开始优化</button>` : ''}
          ${task.status !== 'pending' ? `<button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); viewTaskDetail('${task.id}')"><i class="fa-solid fa-eye"></i> 详情</button>` : ''}
          ${task.status === 'completed' ? `
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); showComparison('${task.capabilityId}')"><i class="fa-solid fa-code-compare"></i> 效果对比</button>
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); handleRepublish('${task.id}')"><i class="fa-solid fa-rocket"></i> 发布</button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }
  renderPagination('tasks-pagination', 'tasks', total, pages, page);
}

function startOptimization(taskId) {
  const data = getMockDataSync('optimize');
  const task = data.tasks.find(t => t.id === taskId);
  if (!task) return;

  const type = getTaskType(task);
  task.status = 'in_progress';
  task.statusLabel = '进行中';

  // 按建议类型分叉：prompt / model 由大模型自动优化完成；其余半自动，AI 仅生成方案待人工评审
  if (type === 'prompt' || type === 'model') {
    task.progress = 100;
    task.status = 'completed';
    task.statusLabel = '已完成';
    const newVer = bumpVersion(getLatestVersion(data, task.capabilityId));
    task.version = newVer;
    // 生成草稿版本（待评测发布）
    data.versions.unshift({
      id: `ver-${Date.now()}`,
      capabilityId: task.capabilityId,
      capabilityName: task.capabilityName,
      version: newVer,
      publishedAt: '—（待发布）',
      optimizationContent: getOptimizationContent(type),
      effectImprovement: task.expectedBenefit || '效果待发布后回评',
      publishRecord: '—'
    });
    showToast(`AI 自动优化完成，已生成草稿版本 ${newVer}，待评测发布`, 'success');
  } else {
    // knowledge / agent / mcp：AI 生成方案，卡在人工评审
    task.progress = type === 'knowledge' ? 40 : 30;
    showToast(`AI 已生成${task.typeLabel || getTaskTypeLabel(type)}方案，等待人工评审后落地`, 'info');
  }
  renderTasks();
}

/* ----- 优化执行辅助：类型识别 / 版本号 / 方案文案 ----- */

function getTaskType(task) {
  if (task.type) return task.type;
  const data = getMockDataSync('optimize');
  const sug = data.suggestions.find(s => s.capabilityId === task.capabilityId);
  if (sug) return sug.type;
  const name = task.name || '';
  if (name.includes('Prompt')) return 'prompt';
  if (name.includes('模型')) return 'model';
  if (name.includes('知识')) return 'knowledge';
  if (name.includes('Agent')) return 'agent';
  if (name.includes('MCP')) return 'mcp';
  return 'prompt';
}

function getTaskTypeLabel(type) {
  return ({ prompt: 'Prompt优化', model: '模型切换', knowledge: '知识库补充', agent: 'Agent优化', mcp: 'MCP升级' })[type] || '优化';
}

function getOptimizationContent(type) {
  return ({
    prompt: '基于 bad case 自动重写 Prompt，补充 Few-shot 示例，优化意图识别逻辑',
    model: '切换至性价比更高的模型，保持响应质量，降低单次调用成本',
    knowledge: 'AI 挖掘知识缺口并生成候选片段，待人工校验后入库',
    agent: 'AI 建议调整 Agent 的 Skill/MCP 引用与执行配置，精简冗余调用，待人工确认',
    mcp: '升级 MCP 服务版本，修复已知问题，待工程发布'
  })[type] || 'AI 自动优化';
}

function bumpVersion(ver) {
  if (!ver) return 'v1.0';
  const m = String(ver).match(/^v?(\d+)\.(\d+)$/);
  if (!m) return 'v1.0';
  return `v${m[1]}.${parseInt(m[2], 10) + 1}`;
}

function getLatestVersion(data, capabilityId) {
  const parsed = data.versions
    .filter(v => v.capabilityId === capabilityId)
    .map(v => String(v.version).match(/^v?(\d+)\.(\d+)$/))
    .filter(Boolean)
    .map(m => [parseInt(m[1], 10), parseInt(m[2], 10)]);
  if (!parsed.length) return null;
  parsed.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
  return `v${parsed[0][0]}.${parsed[0][1]}`;
}

function switchTab(name) {
  document.querySelectorAll('.opt-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.opt-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === name));
}

function viewTaskDetail(taskId) {
  const data = getMockDataSync('optimize');
  const task = data.tasks.find(t => t.id === taskId);
  if (!task) return;
  const sug = data.suggestions.find(s => s.capabilityId === task.capabilityId);
  showModal('优化任务详情', `
    <div class="form-grid">
      <div class="form-group" style="grid-column: span 2;">
        <label class="form-label">任务名称</label>
        <div class="form-value">${task.name}</div>
      </div>
      <div class="form-group">
        <label class="form-label">关联能力</label>
        <div class="form-value">${task.capabilityName}</div>
      </div>
      <div class="form-group">
        <label class="form-label">负责人</label>
        <div class="form-value">${task.owner}</div>
      </div>
      <div class="form-group">
        <label class="form-label">状态</label>
        <div class="form-value"><span class="status-badge ${task.status}">${task.statusLabel}</span></div>
      </div>
      <div class="form-group">
        <label class="form-label">计划完成</label>
        <div class="form-value">${task.planEndDate}</div>
      </div>
      <div class="form-group" style="grid-column: span 2;">
        <label class="form-label">当前进度</label>
        <div class="form-value">
          <div class="task-progress-bar" style="max-width: 300px; margin-bottom: var(--space-2);">
            <div class="task-progress-fill ${task.status}" style="width: ${task.progress}%"></div>
          </div>
          ${task.progress}%
        </div>
      </div>
      ${task.status === 'completed' ? `
      <div class="form-group" style="grid-column: span 2;">
        <label class="form-label">发布版本</label>
        <div class="form-value"><span class="version-tag">${task.version}</span></div>
      </div>
      ` : ''}
      ${sug ? `
      <div class="form-group" style="grid-column: span 2;">
        <label class="form-label">优化目标</label>
        <div class="form-value" style="color: var(--color-text-secondary);">${sug.expectedBenefit}</div>
      </div>
      ` : ''}
    </div>
    ${task.status === 'completed' ? `
    <div style="margin-top: var(--space-5); display: flex; gap: var(--space-3); justify-content: flex-end;">
      <button class="btn btn-secondary" onclick="hideModal()">关闭</button>
      <button class="btn btn-outline" onclick="showComparison('${task.capabilityId}')"><i class="fa-solid fa-code-compare"></i> 查看效果对比</button>
    </div>
    ` : ''}
  `, false);
}

function createTaskFromSuggestion(sugId) {
  const data = getMockDataSync('optimize');
  const sug = data.suggestions.find(s => s.id === sugId);
  if (!sug) { hideModal(); return; }

  // 同一建议已有进行中任务则不重复建
  if (data.tasks.some(t => t.suggestionId === sug.id && t.status !== 'completed')) {
    hideModal();
    showToast('该建议已存在进行中的优化任务', 'info');
    return;
  }

  const taskId = `task-${String(data.tasks.length + 1).padStart(3, '0')}`;
  const newTask = {
    id: taskId,
    name: `${sug.capabilityName}${sug.typeLabel}`,
    capabilityName: sug.capabilityName,
    capabilityId: sug.capabilityId,
    owner: '待分配',
    status: 'pending',
    statusLabel: '待开始',
    planEndDate: '2026-08-10',
    progress: 0,
    version: bumpVersion(getLatestVersion(data, sug.capabilityId)),
    createdAt: '2026-07-26',
    type: sug.type,
    typeLabel: sug.typeLabel,
    suggestionId: sug.id,
    expectedBenefit: sug.expectedBenefit
  };
  data.tasks.unshift(newTask);

  // 建议状态流转
  sug.status = 'processing';
  sug.statusLabel = '已建任务';

  hideModal();
  showToast(`已根据建议创建优化任务：${newTask.name}`, 'success');

  // 跳转到任务 Tab 并刷新
  switchTab('tasks');
  STATE.page.tasks = 1;
  renderTasks();
  renderSuggestions();
}

/* =====================================================
   版本演进
   ===================================================== */

function renderVersions() {
  const data = getMockDataSync('optimize');
  const { items, page, pages, total } = paginate(data.versions, STATE.page.versions);
  const list = document.getElementById('versions-list');
  if (list) {
    list.innerHTML = items.map(ver => `
      <div class="version-row" onclick="showVersionDetail('${ver.id}')">
        <span class="version-row-tag">${ver.version}</span>
        <div class="version-row-main">
          <div class="version-row-title">${ver.capabilityName}</div>
          <div class="version-row-desc">${ver.optimizationContent}</div>
        </div>
        <span class="version-row-effect"><i class="fa-solid fa-arrow-trend-up"></i> ${ver.effectImprovement}</span>
        <span class="version-row-date">${ver.publishedAt}</span>
      </div>
    `).join('');
  }
  renderPagination('versions-pagination', 'versions', total, pages, page);
}

function showVersionDetail(verId) {
  const data = getMockDataSync('optimize');
  const ver = data.versions.find(v => v.id === verId);
  if (!ver) return;
  const comp = data.comparison;
  showModal('版本发布详情', `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">版本号</label>
        <div class="form-value"><span class="version-tag">${ver.version}</span></div>
      </div>
      <div class="form-group">
        <label class="form-label">能力名称</label>
        <div class="form-value">${ver.capabilityName}</div>
      </div>
      <div class="form-group">
        <label class="form-label">发布时间</label>
        <div class="form-value">${ver.publishedAt}</div>
      </div>
      <div class="form-group">
        <label class="form-label">发布单号</label>
        <div class="form-value">${ver.publishRecord}</div>
      </div>
      <div class="form-group" style="grid-column: span 2;">
        <label class="form-label">优化内容</label>
        <div class="form-value">${ver.optimizationContent}</div>
      </div>
      <div class="form-group" style="grid-column: span 2;">
        <label class="form-label">效果提升</label>
        <div class="form-value" style="color: var(--color-success);">${ver.effectImprovement}</div>
      </div>
    </div>
    <div style="margin-top: var(--space-4);">
      <div class="comparison-improvement">
        <div class="improvement-item"><span class="improvement-label">调用成功率</span><span class="improvement-value">${comp.improvements.successRate}</span></div>
        <div class="improvement-item"><span class="improvement-label">响应时间</span><span class="improvement-value">${comp.improvements.responseTime}</span></div>
        <div class="improvement-item"><span class="improvement-label">满意度</span><span class="improvement-value">${comp.improvements.satisfaction}</span></div>
        <div class="improvement-item"><span class="improvement-label">单次成本</span><span class="improvement-value">${comp.improvements.costPerCall}</span></div>
      </div>
    </div>
    <div style="margin-top: var(--space-5); display: flex; gap: var(--space-3); justify-content: flex-end;">
      <button class="btn btn-secondary" onclick="hideModal()">关闭</button>
      <button class="btn btn-primary" onclick="showComparison('${ver.capabilityId}')"><i class="fa-solid fa-code-compare"></i> 完整效果对比</button>
    </div>
  `, false);
}

/* =====================================================
   运营洞察
   ===================================================== */

function renderInsights() {
  const data = getMockDataSync('optimize');
  const grid = document.getElementById('insights-grid');
  if (!grid) return;
  grid.innerHTML = data.insights.map(insight => `
    <div class="insight-card">
      <div class="insight-icon-wrap ${insight.type}">
        <i class="fa-solid ${insight.icon}"></i>
      </div>
      <div class="insight-content">
        <div class="insight-title">${insight.title}</div>
        <div class="insight-desc">${insight.desc}</div>
      </div>
    </div>
  `).join('');
}

/* =====================================================
   优化历史
   ===================================================== */

function renderHistory() {
  const data = getMockDataSync('optimize');
  const { items, page, pages, total } = paginate(data.history, STATE.page.history);
  const tbody = document.getElementById('history-tbody');
  if (tbody) {
    tbody.innerHTML = items.map(hist => `
      <tr>
        <td><span class="font-medium text-primary">${hist.capabilityName}</span></td>
        <td>${hist.optimizationType}</td>
        <td>${hist.optimizedAt}</td>
        <td>${hist.optimizer}</td>
        <td><span class="result-badge ${hist.result === '成功' ? 'success' : 'failed'}">${hist.result}</span></td>
        <td><span class="version-tag">${hist.version}</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="showHistoryDetail('${hist.id}')"><i class="fa-solid fa-eye"></i> 详情</button></td>
      </tr>
    `).join('');
  }
  renderPagination('history-pagination', 'history', total, pages, page);
}

function showHistoryDetail(histId) {
  const data = getMockDataSync('optimize');
  const hist = data.history.find(h => h.id === histId);
  if (!hist) return;
  // 关联版本记录
  const ver = data.versions.find(v => v.capabilityName === hist.capabilityName && v.version === hist.version)
    || data.versions.find(v => v.capabilityName === hist.capabilityName);
  const comp = data.comparison;
  showModal('优化历史详情', `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">能力名称</label>
        <div class="form-value">${hist.capabilityName}</div>
      </div>
      <div class="form-group">
        <label class="form-label">优化类型</label>
        <div class="form-value">${hist.optimizationType}</div>
      </div>
      <div class="form-group">
        <label class="form-label">优化时间</label>
        <div class="form-value">${hist.optimizedAt}</div>
      </div>
      <div class="form-group">
        <label class="form-label">优化人</label>
        <div class="form-value">${hist.optimizer}</div>
      </div>
      <div class="form-group">
        <label class="form-label">优化结果</label>
        <div class="form-value"><span class="result-badge ${hist.result === '成功' ? 'success' : 'failed'}">${hist.result}</span></div>
      </div>
      <div class="form-group">
        <label class="form-label">版本号</label>
        <div class="form-value"><span class="version-tag">${hist.version}</span></div>
      </div>
    </div>
    ${ver ? `
    <div class="suggestion-basis">
      <div class="suggestion-basis-title"><i class="fa-solid fa-code-branch"></i> 版本优化内容</div>
      <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-2);">${ver.optimizationContent}</div>
      <div style="font-size: var(--font-size-sm); color: var(--color-success); font-weight: var(--font-weight-medium);"><i class="fa-solid fa-arrow-trend-up"></i> ${ver.effectImprovement}</div>
      <div class="comparison-improvement" style="margin-top: var(--space-3);">
        <div class="improvement-item"><span class="improvement-label">调用成功率</span><span class="improvement-value">${comp.improvements.successRate}</span></div>
        <div class="improvement-item"><span class="improvement-label">响应时间</span><span class="improvement-value">${comp.improvements.responseTime}</span></div>
        <div class="improvement-item"><span class="improvement-label">满意度</span><span class="improvement-value">${comp.improvements.satisfaction}</span></div>
        <div class="improvement-item"><span class="improvement-label">单次成本</span><span class="improvement-value">${comp.improvements.costPerCall}</span></div>
      </div>
    </div>
    ` : ''}
  `, true, '关闭', null, null);
}

/* =====================================================
   效果对比 (弹框，针对单个能力)
   ===================================================== */

function showComparison(capabilityId) {
  const data = getMockDataSync('optimize');
  const comp = data.comparison;
  const cap = data.versions.find(v => v.capabilityId === capabilityId);
  const capName = cap ? cap.capabilityName : comp.capabilityName;
  showModal(`${capName} · 优化效果对比`, `
    <div class="comparison-grid" style="gap: var(--space-4);">
      <div class="comparison-card">
        <div class="comparison-card-label before"><i class="fa-solid fa-arrow-left"></i> 优化前</div>
        <div class="comparison-metrics">
          <div class="comparison-metric"><span class="comparison-metric-label">调用成功率</span><span class="comparison-metric-value">${comp.before.successRate}%</span></div>
          <div class="comparison-metric"><span class="comparison-metric-label">响应时间</span><span class="comparison-metric-value">${comp.before.responseTime}ms</span></div>
          <div class="comparison-metric"><span class="comparison-metric-label">满意度</span><span class="comparison-metric-value">${comp.before.satisfaction}</span></div>
          <div class="comparison-metric"><span class="comparison-metric-label">单次调用成本</span><span class="comparison-metric-value">¥${comp.before.costPerCall}</span></div>
        </div>
      </div>
      <div class="comparison-card">
        <div class="comparison-card-label after"><i class="fa-solid fa-arrow-right"></i> 优化后</div>
        <div class="comparison-metrics">
          <div class="comparison-metric"><span class="comparison-metric-label">调用成功率</span><span class="comparison-metric-value success">${comp.after.successRate}%</span></div>
          <div class="comparison-metric"><span class="comparison-metric-label">响应时间</span><span class="comparison-metric-value success">${comp.after.responseTime}ms</span></div>
          <div class="comparison-metric"><span class="comparison-metric-label">满意度</span><span class="comparison-metric-value success">${comp.after.satisfaction}</span></div>
          <div class="comparison-metric"><span class="comparison-metric-label">单次调用成本</span><span class="comparison-metric-value success">¥${comp.after.costPerCall}</span></div>
        </div>
      </div>
    </div>
    <div class="comparison-improvement" style="margin-top: var(--space-4);">
      <div class="improvement-item"><span class="improvement-label">成功率提升</span><span class="improvement-value">${comp.improvements.successRate}</span></div>
      <div class="improvement-item"><span class="improvement-label">响应时间降低</span><span class="improvement-value">${comp.improvements.responseTime}</span></div>
      <div class="improvement-item"><span class="improvement-label">满意度提升</span><span class="improvement-value">${comp.improvements.satisfaction}</span></div>
      <div class="improvement-item"><span class="improvement-label">成本降低</span><span class="improvement-value">${comp.improvements.costPerCall}</span></div>
    </div>
  `, true, '关闭', null, null);
}

function handleRepublish(taskId) {
  const data = getMockDataSync('optimize');
  const task = data.tasks.find(t => t.id === taskId);
  const version = task ? task.version : 'v2.6';
  showModal('确认发布新版本', `
    <div style="text-align: center; padding: var(--space-4) 0;">
      <div style="font-size: 44px; color: var(--color-success); margin-bottom: var(--space-3);">
        <i class="fa-solid fa-rocket"></i>
      </div>
      <div style="font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-2);">
        确认发布新版本 ${version}？
      </div>
      <div style="color: var(--color-text-muted); font-size: var(--font-size-sm);">
        发布后，所有业务系统将自动使用最新版本。
      </div>
      <div style="margin-top: var(--space-4); display: flex; justify-content: center; gap: var(--space-6);">
        <div style="text-align: center;">
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-1);">生成新版本</div>
          <div style="font-size: var(--font-size-md); font-weight: var(--font-weight-semibold);">${version}</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-1);">发布内容</div>
          <div style="font-size: var(--font-size-md); font-weight: var(--font-weight-semibold);">${task ? task.capabilityName : '智能问答助手'}</div>
        </div>
      </div>
    </div>
  `, true, '取消', '确认发布', () => {
    const d = getMockDataSync('optimize');
    const capId = task ? task.capabilityId : '';
    const capName = task ? task.capabilityName : '智能问答助手';
    // 草稿版本转正
    const ver = d.versions.find(v => v.capabilityId === capId && v.version === version);
    if (ver && String(ver.publishedAt).startsWith('—')) {
      ver.publishedAt = '2026-07-26';
      ver.publishRecord = `PUB-20260726-${String(Math.floor(Math.random() * 900) + 100)}`;
    }
    // 记录优化历史（效果回评闭环）
    d.history.unshift({
      id: `hist-${Date.now()}`,
      capabilityName: capName,
      optimizationType: task ? (task.typeLabel || getTaskTypeLabel(getTaskType(task))) : 'Prompt优化',
      optimizedAt: '2026-07-26',
      optimizer: task ? task.owner : '系统',
      result: '成功',
      version
    });
    hideModal();
    showToast(`发布成功！${version} 已上线。`, 'success');
    renderVersions();
    renderHistory();
  });
}

/* =====================================================
   Tabs
   ===================================================== */

function initTabs() {
  const tabs = document.querySelectorAll('.opt-tab');
  const panels = document.querySelectorAll('.opt-tab-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
    });
  });
}

/* =====================================================
   Modal
   ===================================================== */

function showModal(title, bodyHtml, showFooter = true, cancelText = '取消', confirmText = '确定', onConfirm = null) {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  const footer = document.getElementById('modal-footer');
  footer.style.display = showFooter ? 'flex' : 'none';
  const cancelBtn = document.getElementById('modal-cancel');
  const confirmBtn = document.getElementById('modal-confirm');
  cancelBtn.textContent = cancelText;
  cancelBtn.onclick = hideModal;
  if (confirmText) {
    confirmBtn.style.display = '';
    confirmBtn.textContent = confirmText;
    confirmBtn.onclick = onConfirm || hideModal;
  } else {
    confirmBtn.style.display = 'none';
  }
  overlay.classList.add('show');
}

function hideModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'modal-overlay') hideModal();
});

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.addEventListener('click', hideModal);
});

/* =====================================================
   Toast
   ===================================================== */

function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
