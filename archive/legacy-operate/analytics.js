/* =====================================================
   Analytics Center Page Script
   AI Capability Open Platform
   BI Style Analytics Dashboard — 6 horizontal tabs
   ===================================================== */

/**
 * Highlight active menu item
 */
function highlightActiveMenu() {
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-item').forEach(item => {
    if (item.getAttribute('href') === currentPage ||
        item.getAttribute('href') === `../pages/ai-operate/${currentPage}`) {
      item.classList.add('active');
    }
  });
}

/**
 * Initialize header dropdown
 */
function initHeaderDropdown() {
  const userEl = document.querySelector('.header-user');
  if (!userEl) return;
  userEl.addEventListener('click', () => {
    userEl.classList.toggle('show');
  });
  document.addEventListener('click', (e) => {
    if (!userEl.contains(e.target)) {
      userEl.classList.remove('show');
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  initHeaderDropdown();
  highlightActiveMenu();
  await renderAnalytics();
});

/**
 * Main render function
 */
async function renderAnalytics() {
  const data = await loadMockData('analytics');
  if (!data) {
    document.getElementById('app-content').innerHTML = '<div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-triangle-exclamation"></i></div><div class="empty-state-title">数据加载失败</div></div>';
    return;
  }

  const html = `
    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="filter-item">
        <span class="filter-label"><i class="fa-solid fa-calendar"></i> 时间</span>
        <select class="filter-select" id="filter-time">
          <option value="7">近7天</option>
          <option value="30" selected>近30天</option>
          <option value="90">近90天</option>
        </select>
      </div>
      <div class="filter-item">
        <span class="filter-label"><i class="fa-solid fa-building"></i> 部门</span>
        <select class="filter-select" id="filter-dept">
          <option value="">全部部门</option>
          <option value="dept-001">运营部</option>
          <option value="dept-002">开发部</option>
          <option value="dept-003">数据治理部</option>
          <option value="dept-004">审批部</option>
          <option value="dept-005">数据开放部</option>
        </select>
      </div>
      <div class="filter-item">
        <span class="filter-label"><i class="fa-solid fa-cube"></i> 能力</span>
        <select class="filter-select" id="filter-capability">
          <option value="">全部能力</option>
          <option value="cap-001">智能编目</option>
          <option value="cap-002">找数寻源</option>
          <option value="cap-003">运营助手</option>
          <option value="cap-004">开发助手</option>
          <option value="cap-005">数据脱敏</option>
        </select>
      </div>
      <div class="filter-actions">
        <button class="btn btn-secondary btn-sm" onclick="resetFilters()"><i class="fa-solid fa-rotate-left"></i> 重置</button>
        <button class="btn btn-primary btn-sm" onclick="applyFilters()"><i class="fa-solid fa-filter"></i> 应用</button>
      </div>
    </div>

    <!-- KPI Overview -->
    <div class="kpi-overview-grid">
      <div class="kpi-overview-card">
        <div class="kpi-overview-icon blue"><i class="fa-solid fa-brain"></i></div>
        <div class="kpi-overview-content">
          <div class="kpi-overview-value">${formatNumber(data.overview.aiCapabilityCount)}</div>
          <div class="kpi-overview-label">AI能力数</div>
        </div>
      </div>
      <div class="kpi-overview-card">
        <div class="kpi-overview-icon green"><i class="fa-solid fa-phone-volume"></i></div>
        <div class="kpi-overview-content">
          <div class="kpi-overview-value">${formatNumber(data.overview.totalCalls)}</div>
          <div class="kpi-overview-label">累计调用</div>
        </div>
      </div>
      <div class="kpi-overview-card">
        <div class="kpi-overview-icon purple"><i class="fa-solid fa-rocket"></i></div>
        <div class="kpi-overview-content">
          <div class="kpi-overview-value">${formatNumber(data.overview.activeApps)}</div>
          <div class="kpi-overview-label">活跃应用</div>
        </div>
      </div>
      <div class="kpi-overview-card">
        <div class="kpi-overview-icon orange"><i class="fa-solid fa-building"></i></div>
        <div class="kpi-overview-content">
          <div class="kpi-overview-value">${formatNumber(data.overview.serviceCompanies)}</div>
          <div class="kpi-overview-label">服务企业</div>
        </div>
      </div>
      <div class="kpi-overview-card">
        <div class="kpi-overview-icon cyan"><i class="fa-solid fa-coins"></i></div>
        <div class="kpi-overview-content">
          <div class="kpi-overview-value">${formatBigNumber(data.overview.tokenConsumption)}</div>
          <div class="kpi-overview-label">Token消耗</div>
        </div>
      </div>
      <div class="kpi-overview-card">
        <div class="kpi-overview-icon indigo"><i class="fa-solid fa-check-circle"></i></div>
        <div class="kpi-overview-content">
          <div class="kpi-overview-value">${data.overview.successRate}%</div>
          <div class="kpi-overview-label">综合成功率</div>
        </div>
      </div>
    </div>

    <!-- Horizontal Tab Navigation (6 analytics modules) -->
    <div class="tab-nav" id="analytics-tab-nav">
      <button class="tab-nav-item active" onclick="switchAnalyticsTab('ranking', this)"><i class="fa-solid fa-trophy"></i> 能力价值排行</button>
      <button class="tab-nav-item" onclick="switchAnalyticsTab('dept', this)"><i class="fa-solid fa-users-gear"></i> 部门使用分析</button>
      <button class="tab-nav-item" onclick="switchAnalyticsTab('prompt', this)"><i class="fa-solid fa-terminal"></i> Prompt效果分析</button>
      <button class="tab-nav-item" onclick="switchAnalyticsTab('knowledge', this)"><i class="fa-solid fa-book"></i> 知识库分析</button>
      <button class="tab-nav-item" onclick="switchAnalyticsTab('service', this)"><i class="fa-solid fa-plug"></i> 服务调用分析</button>
      <button class="tab-nav-item" onclick="switchAnalyticsTab('advice', this)"><i class="fa-solid fa-lightbulb"></i> AI运营建议</button>
    </div>

    <!-- Tab 1: Capability Value Ranking -->
    <section class="tab-content active" id="tab-ranking">
      <div class="analytics-card">
        <div class="analytics-card-header">
          <div class="analytics-card-title"><i class="fa-solid fa-ranking-star"></i> Top10 AI能力价值指数排行榜</div>
          <span class="analytics-card-sub">价值指数 = 调用量 × 覆盖应用 × 用户评分 综合归一化</span>
        </div>
        <div class="analytics-card-body" style="padding: 0">
          <table class="capability-ranking-table">
            <thead>
              <tr>
                <th style="width: 60px">排名</th>
                <th>能力名称</th>
                <th>调用次数</th>
                <th>覆盖应用</th>
                <th>用户评分</th>
                <th>价值指数</th>
                <th>增长率</th>
                <th style="width: 80px">操作</th>
              </tr>
            </thead>
            <tbody>
              ${data.topCapability.map((cap, idx) => `
                <tr>
                  <td><span class="rank-badge ${idx === 0 ? 'top1' : idx === 1 ? 'top2' : idx === 2 ? 'top3' : 'normal'}">${idx + 1}</span></td>
                  <td><span class="font-medium text-primary">${cap.name}</span></td>
                  <td>${formatNumber(cap.calls)}</td>
                  <td>${cap.apps} 个</td>
                  <td><i class="fa-solid fa-star" style="color: #F59E0B"></i> ${cap.rating}</td>
                  <td>
                    <div class="value-index-bar">
                      <div class="value-index-progress">
                        <div class="value-index-fill" style="width: ${cap.valueIndex}%"></div>
                      </div>
                      <span>${cap.valueIndex}</span>
                    </div>
                  </td>
                  <td>
                    <span class="growth-rate ${cap.growthRate > 0 ? 'up' : 'down'}">
                      <i class="fa-solid fa-arrow-trend-${cap.growthRate > 0 ? 'up' : 'down'}"></i>
                      ${cap.growthRate > 0 ? '+' : ''}${cap.growthRate}%
                    </span>
                  </td>
                  <td><button class="btn btn-secondary btn-sm" onclick="showCapabilityDetail('${cap.id}')"><i class="fa-solid fa-eye"></i> 详情</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Tab 2: Department Usage Analysis -->
    <section class="tab-content" id="tab-dept">
      <div class="analytics-card">
        <div class="analytics-card-header">
          <div class="analytics-card-title"><i class="fa-solid fa-users-gear"></i> 各部门 AI 能力调用分布与增长趋势</div>
          <span class="analytics-card-sub">谁在用 · 用多少 · 趋势如何 · 主力能力</span>
        </div>
        <div class="analytics-card-body">
          <div class="dept-analysis-grid">
            ${data.department.map(dept => `
              <div class="dept-item">
                <div class="dept-icon"><i class="fa-solid fa-building"></i></div>
                <div class="dept-name">${dept.name}</div>
                <div class="dept-calls">${formatNumber(dept.calls)}</div>
                <div class="dept-ratio">
                  <div class="dept-ratio-bar">
                    <div class="dept-ratio-fill" style="width: ${dept.ratio}%"></div>
                  </div>
                  <span>占比 ${dept.ratio}%</span>
                </div>
                <div class="dept-meta">
                  <span class="dept-growth ${dept.growth > 0 ? 'up' : 'down'}">
                    <i class="fa-solid fa-arrow-trend-${dept.growth > 0 ? 'up' : 'down'}"></i>
                    ${dept.growth > 0 ? '+' : ''}${dept.growth}%
                  </span>
                  <span class="dept-users"><i class="fa-solid fa-user"></i> ${formatNumber(dept.users)}</span>
                </div>
                <div class="dept-topcap"><i class="fa-solid fa-cube"></i> ${dept.topCap}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- Tab 3: Prompt Effect Analysis -->
    <section class="tab-content" id="tab-prompt">
      <div class="analytics-card">
        <div class="analytics-card-header">
          <div class="analytics-card-title"><i class="fa-solid fa-terminal"></i> Prompt 效果分析</div>
          <span class="analytics-card-sub">命中率=意图正确路由占比 · 成功率/失败率=调用完成情况 · 满意度=用户评分均值</span>
        </div>
        <div class="analytics-card-body">
          <div class="prompt-analysis-grid">
            ${data.prompt.map(p => `
              <div class="prompt-item">
                <div class="prompt-item-name" title="${p.name}">${p.name}</div>
                <div class="prompt-metrics">
                  <div class="prompt-metric">
                    <div class="prompt-metric-value">${p.hitRate}%</div>
                    <div class="prompt-metric-label">命中率</div>
                  </div>
                  <div class="prompt-metric">
                    <div class="prompt-metric-value">${p.successRate}%</div>
                    <div class="prompt-metric-label">成功率</div>
                  </div>
                  <div class="prompt-metric">
                    <div class="prompt-metric-value">${p.failRate}%</div>
                    <div class="prompt-metric-label">失败率</div>
                  </div>
                  <div class="prompt-metric">
                    <div class="prompt-metric-value"><i class="fa-solid fa-star" style="color: #F59E0B"></i> ${p.satisfaction}</div>
                    <div class="prompt-metric-label">满意度</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="prompt-version-compare">
            <div class="version-compare-title">版本效果对比（当前 vs 上个版本成功率）</div>
            <div class="version-bars">
              ${data.prompt.slice(0, 3).map(p => `
                <div class="version-bar-item">
                  <div class="version-bar-label">${p.name.replace('Prompt', '')}</div>
                  <div class="version-bar-track" style="position: relative;">
                    <div class="version-bar-previous" style="width: ${p.previousSuccessRate}%;"></div>
                    <div class="version-bar-current" style="width: ${p.successRate}%;"></div>
                  </div>
                  <div class="version-bar-value">${p.currentVersion}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tab 4: Knowledge Analysis -->
    <section class="tab-content" id="tab-knowledge">
      <div class="analytics-card">
        <div class="analytics-card-header">
          <div class="analytics-card-title"><i class="fa-solid fa-book"></i> 知识库分析</div>
          <span class="analytics-card-sub">RAG命中率=检索返回相关结果的query占比 · 覆盖率=已覆盖业务领域占比</span>
        </div>
        <div class="analytics-card-body">
          <div class="knowledge-stats-grid">
            <div class="knowledge-stat-item">
              <div class="knowledge-stat-value">${formatNumber(data.knowledge.knowledgeBaseCount)}</div>
              <div class="knowledge-stat-label">知识库数量</div>
            </div>
            <div class="knowledge-stat-item">
              <div class="knowledge-stat-value">${data.knowledge.ragHitRate}%</div>
              <div class="knowledge-stat-label">RAG命中率</div>
            </div>
            <div class="knowledge-stat-item">
              <div class="knowledge-stat-value">${formatNumber(data.knowledge.citationCount)}</div>
              <div class="knowledge-stat-label">引用次数</div>
            </div>
            <div class="knowledge-stat-item">
              <div class="knowledge-stat-value">${data.knowledge.coverage}%</div>
              <div class="knowledge-stat-label">知识覆盖率</div>
            </div>
            <div class="knowledge-stat-item">
              <div class="knowledge-stat-value">${data.knowledge.avgRetrievalMs}ms</div>
              <div class="knowledge-stat-label">平均检索耗时</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tab 5: Service Call Analysis -->
    <section class="tab-content" id="tab-service">
      <div class="analytics-card">
        <div class="analytics-card-header">
          <div class="analytics-card-title"><i class="fa-solid fa-plug"></i> 服务调用分析</div>
          <span class="analytics-card-sub">覆盖全部开放服务类型：API / MCP / Agent服务</span>
        </div>
        <div class="analytics-card-body">
          <div class="mcp-analysis-tabs">
            <button class="mcp-tab active" onclick="switchServiceTab('api', this)">API服务</button>
            <button class="mcp-tab" onclick="switchServiceTab('mcp', this)">MCP服务</button>
            <button class="mcp-tab" onclick="switchServiceTab('agent', this)">Agent服务</button>
          </div>
          ${renderServiceTable('api', data.services.api, true)}
          ${renderServiceTable('mcp', data.services.mcp, false)}
          ${renderServiceTable('agent', data.services.agent, false)}
        </div>
      </div>
    </section>

    <!-- Tab 6: AI Operation Advice -->
    <section class="tab-content" id="tab-advice">
      <div class="analytics-card">
        <div class="analytics-card-header">
          <div class="analytics-card-title"><i class="fa-solid fa-lightbulb"></i> AI 运营建议</div>
          <span class="analytics-card-sub">基于上述分析指标按阈值规则生成，每条建议关联触发指标</span>
        </div>
        <div class="analytics-card-body">
          <div class="advice-grid">
            ${data.advice.map(advice => `
              <div class="advice-card">
                <div class="advice-icon-wrap ${advice.type}">
                  <i class="fa-solid ${advice.icon}"></i>
                </div>
                <div class="advice-content">
                  <div class="advice-title">${advice.title}</div>
                  <div class="advice-desc">${advice.desc}</div>
                  <div class="advice-footer">
                    <span class="advice-metric"><i class="fa-solid fa-chart-simple"></i> ${advice.metric}</span>
                    <span class="advice-priority ${advice.priority}">
                      ${advice.priority === 'high' ? '高优先级' : advice.priority === 'medium' ? '中优先级' : '低优先级'}
                    </span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById('app-content').innerHTML = html;
  const loadingEl = document.getElementById('analytics-loading');
  if (loadingEl) loadingEl.style.display = 'none';
}

/**
 * Render a service ranking table for a given type
 */
function renderServiceTable(type, rows, active) {
  return `
    <div id="service-content-${type}" class="mcp-tab-content" style="display: ${active ? 'block' : 'none'};">
      <table class="mcp-ranking-table">
        <thead>
          <tr>
            <th>服务名称</th>
            <th>调用次数</th>
            <th>响应时间</th>
            <th>失败率</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(svc => `
            <tr>
              <td><span class="font-medium text-primary">${svc.name}</span></td>
              <td>${formatNumber(svc.calls)}</td>
              <td>${svc.responseTime}ms</td>
              <td>
                <span class="fail-rate ${svc.failRate < 0.1 ? 'low' : svc.failRate < 0.2 ? 'medium' : 'high'}">
                  <i class="fa-solid fa-circle"></i>
                  ${(svc.failRate * 100).toFixed(2)}%
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Switch top-level analytics tab
 */
function switchAnalyticsTab(tabName, btn) {
  document.querySelectorAll('#analytics-tab-nav .tab-nav-item').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

/**
 * Switch service sub-tab
 */
function switchServiceTab(tabName, btn) {
  document.querySelectorAll('.mcp-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.mcp-tab-content').forEach(c => c.style.display = 'none');
  document.getElementById(`service-content-${tabName}`).style.display = 'block';
}

/**
 * Filter functions
 */
function resetFilters() {
  document.getElementById('filter-time').value = '30';
  document.getElementById('filter-dept').value = '';
  document.getElementById('filter-capability').value = '';
  showToast('筛选条件已重置', 'info');
}

function applyFilters() {
  const time = document.getElementById('filter-time').value;
  const dept = document.getElementById('filter-dept').value;
  const capability = document.getElementById('filter-capability').value;
  showToast('筛选条件已应用', 'success');
}

/**
 * Show capability detail
 */
function showCapabilityDetail(id) {
  const data = getMockDataSync('analytics');
  const cap = data.topCapability.find(c => c.id === id);
  if (!cap) return;
  const rank = data.topCapability.findIndex(c => c.id === id) + 1;
  const rankClass = rank === 1 ? 'top1' : rank === 2 ? 'top2' : rank === 3 ? 'top3' : 'normal';
  const code = 'CAP-' + id.replace(/\D/g, '').padStart(3, '0');

  showModal('能力详情', `
    <div class="cap-detail">
      <div class="cap-detail-head">
        <span class="rank-badge ${rankClass}">${rank}</span>
        <div class="cap-detail-head-info">
          <div class="cap-detail-name">${cap.name}</div>
          <div class="cap-detail-sub">
            <span class="cap-detail-tag"><i class="fa-solid fa-hashtag"></i> ${code}</span>
            <span class="cap-detail-tag"><i class="fa-solid fa-fingerprint"></i> ${cap.id}</span>
          </div>
        </div>
        <span class="growth-rate ${cap.growthRate > 0 ? 'up' : 'down'} cap-detail-growth">
          <i class="fa-solid fa-arrow-trend-${cap.growthRate > 0 ? 'up' : 'down'}"></i>
          ${cap.growthRate > 0 ? '+' : ''}${cap.growthRate}%
        </span>
      </div>

      <div class="cap-detail-metrics">
        <div class="cap-detail-metric">
          <div class="cap-detail-metric-value">${formatNumber(cap.calls)}</div>
          <div class="cap-detail-metric-label">调用次数</div>
        </div>
        <div class="cap-detail-metric">
          <div class="cap-detail-metric-value">${cap.apps}</div>
          <div class="cap-detail-metric-label">覆盖应用</div>
        </div>
        <div class="cap-detail-metric">
          <div class="cap-detail-metric-value"><i class="fa-solid fa-star" style="color: #F59E0B"></i> ${cap.rating}</div>
          <div class="cap-detail-metric-label">用户评分</div>
        </div>
        <div class="cap-detail-metric">
          <div class="cap-detail-metric-value">${cap.valueIndex}</div>
          <div class="cap-detail-metric-label">价值指数</div>
        </div>
      </div>

      <div class="cap-detail-section">
        <div class="cap-detail-section-title"><i class="fa-solid fa-circle-info"></i> 基本信息</div>
        <div class="cap-detail-grid">
          <div class="cap-detail-item">
            <span class="cap-detail-label">能力名称</span>
            <span class="cap-detail-value">${cap.name}</span>
          </div>
          <div class="cap-detail-item">
            <span class="cap-detail-label">能力编码</span>
            <span class="cap-detail-value mono">${code}</span>
          </div>
          <div class="cap-detail-item">
            <span class="cap-detail-label">能力ID</span>
            <span class="cap-detail-value mono">${cap.id}</span>
          </div>
          <div class="cap-detail-item">
            <span class="cap-detail-label">价值指数</span>
            <span class="cap-detail-value">${cap.valueIndex}</span>
          </div>
          <div class="cap-detail-item">
            <span class="cap-detail-label">调用次数</span>
            <span class="cap-detail-value">${formatNumber(cap.calls)}</span>
          </div>
          <div class="cap-detail-item">
            <span class="cap-detail-label">覆盖应用</span>
            <span class="cap-detail-value">${cap.apps} 个</span>
          </div>
        </div>
      </div>

      <div class="cap-detail-section">
        <div class="cap-detail-section-title"><i class="fa-solid fa-chart-line"></i> 价值指数</div>
        <div class="cap-detail-valuebar">
          <div class="cap-detail-valuebar-track">
            <div class="cap-detail-valuebar-fill" style="width: ${cap.valueIndex}%"></div>
          </div>
          <span class="cap-detail-valuebar-num">${cap.valueIndex}</span>
        </div>
      </div>
    </div>
  `, false, 'modal-lg');
}

/**
 * Modal functions
 */
function showModal(title, bodyHtml, showFooter = true, sizeClass = '') {
  const modal = document.querySelector('.modal');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-footer').style.display = showFooter ? 'flex' : 'none';
  modal.classList.remove('modal-sm', 'modal-lg', 'modal-xl');
  if (sizeClass) modal.classList.add(sizeClass);
  document.getElementById('modal-overlay').classList.add('show');
}

function hideModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'modal-overlay') hideModal();
  if (e.target.closest('#modal-close') || e.target.closest('#modal-cancel')) hideModal();
  if (e.target.closest('#modal-confirm')) hideModal();
});

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

/**
 * Format number with commas
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format big numbers with K/M suffix
 */
function formatBigNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format decimal number
 */
function formatDecimal(num) {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
