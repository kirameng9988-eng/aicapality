/* =====================================================
   Open Gateway - Page Logic
   AI Capability Open Platform
   ===================================================== */

(async function() {
  'use strict';

  // ---- Mock Data ----
  const data = await fetchMockData();

  // ---- State ----
  let currentTab = 'mcp';

  // ---- Init ----
  function init() {
    // Detect tab from URL param
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['mcp', 'api', 'sdk'].includes(tabParam)) {
      currentTab = tabParam;
    }

    renderGatewayOverview();
    renderOpenFlow();
    renderMCPTab();
    renderAPITab();
    renderSDKTab();
    setupTabNavigation();

    // Switch to correct tab on load
    switchTab(currentTab);
  }

  // ---- Fetch Mock Data ----
  async function fetchMockData() {
    // Use embedded MockData from mock-loader.js for consistency
    // and to avoid CORS/fetch path issues in iframe context
    if (typeof MockData !== 'undefined' && MockData.open) {
      return MockData.open;
    }
    // Fallback to fetch if MockData is not available
    try {
      const res = await fetch('../../mock/open.json');
      return await res.json();
    } catch (e) {
      console.error('Failed to load mock data:', e);
      return {};
    }
  }

  // ---- Render: Gateway Overview ----
  function renderGatewayOverview() {
    const kpis = data.overview?.kpis;
    const slogan = data.overview?.slogan;
    if (slogan) {
      const sub = document.getElementById('pageSubtitle');
      if (sub) sub.textContent = slogan;
    }
    if (!kpis) return;

    const kpiItems = [
      { key: 'openCapabilities', icon: 'fa-brain', color: 'kpi-blue' },
      { key: 'mcpServices', icon: 'fa-server', color: 'kpi-green' },
      { key: 'apiCount', icon: 'fa-code', color: 'kpi-cyan' },
      { key: 'sdkCount', icon: 'fa-box', color: 'kpi-purple' },
      { key: 'totalCalls', icon: 'fa-chart-line', color: 'kpi-orange' },
      { key: 'appCount', icon: 'fa-building', color: 'kpi-indigo' }
    ];

    const grid = document.getElementById('gatewayKpiGrid');
    if (!grid) return;

    grid.innerHTML = kpiItems.map(item => {
      const kpi = kpis[item.key];
      if (!kpi) return '';
      const displayValue = formatNumber(kpi.value);

      return `
        <div class="gateway-kpi-card ${item.color}">
          <div class="gateway-kpi-icon">
            <i class="fa-solid ${item.icon}"></i>
          </div>
          <div class="gateway-kpi-info">
            <div class="gateway-kpi-label">${kpi.label}</div>
            <div class="gateway-kpi-value">${displayValue}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ---- Render: Open Flow (hover popover) ----
  function renderOpenFlow() {
    const flow = data.flow?.steps;
    const body = document.getElementById('flowPopoverBody');
    if (!body || !flow) return;

    body.innerHTML = flow.map((step, i) => `
      <div class="flow-step">
        <div class="flow-step-index">${i + 1}</div>
        <div class="flow-step-content">
          <div class="flow-step-head">
            <i class="fa-solid ${step.icon}"></i>
            <span class="flow-step-label">${step.label}</span>
          </div>
          <div class="flow-step-desc">${step.desc || ''}</div>
        </div>
      </div>
    `).join('');
  }

  // ---- Render: MCP Tab ----
  function renderMCPTab() {
    const servers = data.mcp?.servers || [];
    const container = document.getElementById('mcpTableBody');
    if (!container) return;

    // Update badge
    const badge = document.getElementById('mcpBadge');
    if (badge) badge.textContent = servers.length;

    container.innerHTML = servers.length === 0 ? `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <div class="empty-state-icon"><i class="fa-solid fa-server"></i></div>
            <div class="empty-state-title">暂无 MCP 服务</div>
            <div class="empty-state-desc">请在 MCP 管理中配置并发布服务</div>
          </div>
        </td>
      </tr>
    ` : servers.map(server => `
      <tr>
        <td>
          <div class="mcp-server-name">${server.name}</div>
          <div class="mcp-server-desc">${server.description}</div>
        </td>
        <td>
          <div class="mcp-stats">
            <div class="mcp-stat">
              <div class="mcp-stat-value">${server.tools}</div>
              <div class="mcp-stat-label">Tools</div>
            </div>
            <div class="mcp-stat">
              <div class="mcp-stat-value">${server.resources}</div>
              <div class="mcp-stat-label">Resources</div>
            </div>
            <div class="mcp-stat">
              <div class="mcp-stat-value">${server.prompts}</div>
              <div class="mcp-stat-label">Prompts</div>
            </div>
          </div>
        </td>
        <td><div class="mcp-endpoint">${server.endpoint}</div></td>
        <td>
          <span class="health-indicator ${server.status}">
            <span class="health-dot"></span>
            ${statusLabel(server.status)}
          </span>
        </td>
        <td>${formatNumber(server.calls)}</td>
        <td>${server.healthScore}%</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-ghost" onclick="openDetailPage('mcp', '${server.id}')" title="查看详情">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-ghost" onclick="openDebugPage('mcp', '${server.id}')" title="在线调试">
              <i class="fa-solid fa-bug"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ---- Render: API Tab ----
  function renderAPITab() {
    const apis = data.api?.apis || [];
    const container = document.getElementById('apiTableBody');
    if (!container) return;

    // Update badge
    const badge = document.getElementById('apiBadge');
    if (badge) badge.textContent = apis.length;

    container.innerHTML = apis.length === 0 ? `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <div class="empty-state-icon"><i class="fa-solid fa-code"></i></div>
            <div class="empty-state-title">暂无 API</div>
            <div class="empty-state-desc">请先发布 AI 能力以生成 API</div>
          </div>
        </td>
      </tr>
    ` : apis.map(api => `
      <tr>
        <td>
          <div class="api-name">${api.name}</div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: 2px;">${api.description}</div>
        </td>
        <td><div class="api-url">${api.url}</div></td>
        <td><span class="method-tag ${api.method.toLowerCase()}">${api.method}</span></td>
        <td><span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${api.auth}</span></td>
        <td><span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${api.version}</span></td>
        <td><span class="status-tag ${api.status}">${statusLabel(api.status)}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-ghost" onclick="openDetailPage('api', '${api.id}')" title="查看详情">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-ghost" onclick="openDebugPage('api', '${api.id}')" title="在线调试">
              <i class="fa-solid fa-bug"></i>
            </button>
            <button class="btn btn-sm btn-ghost" onclick="copyUrl('${api.id}')" title="复制地址">
              <i class="fa-solid fa-copy"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ---- Render: SDK Tab ----
  function renderSDKTab() {
    const sdks = data.sdk?.sdks || [];
    const container = document.getElementById('sdkGrid');
    if (!container) return;

    // Update badge
    const badge = document.getElementById('sdkBadge');
    if (badge) badge.textContent = sdks.length;

    const langIcons = {
      'Java': 'fa-java',
      'Python': 'fa-python',
      'Go': 'fa-golang',
      'Node.js': 'fa-node-js',
      'JavaScript': 'fa-js'
    };

    const langClasses = {
      'Java': 'java',
      'Python': 'python',
      'Go': 'go',
      'Node.js': 'nodejs',
      'JavaScript': 'nodejs'
    };

    container.innerHTML = sdks.length === 0 ? `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-state-icon"><i class="fa-solid fa-box"></i></div>
        <div class="empty-state-title">暂无 SDK</div>
        <div class="empty-state-desc">SDK 正在开发中</div>
      </div>
    ` : sdks.map(sdk => `
      <div class="sdk-card">
        <div class="sdk-card-header">
          <div class="sdk-lang-icon ${langClasses[sdk.language] || 'python'}">
            <i class="fa-brands ${langIcons[sdk.language] || 'fa-code'}"></i>
          </div>
          <div>
            <div class="sdk-lang-name">${sdk.language}</div>
            <div class="sdk-lang-version">${sdk.version}</div>
          </div>
        </div>
        <div class="sdk-meta">
          <div class="sdk-meta-item">
            <i class="fa-solid fa-download"></i>
            <span>${formatNumber(sdk.downloads)} 下载</span>
          </div>
          <div class="sdk-meta-item">
            <i class="fa-solid fa-clock"></i>
            <span>更新于 ${sdk.updatedAt}</span>
          </div>
          <div class="sdk-meta-item">
            <i class="fa-solid fa-box"></i>
            <span style="font-family: var(--font-family-mono); font-size: 10px;">${sdk.package}</span>
          </div>
        </div>
        <div class="sdk-code">${sdk.exampleCode}</div>
        <div class="sdk-actions">
          <button class="btn btn-primary btn-sm" onclick="downloadSDK('${sdk.language}')">
            <i class="fa-solid fa-download"></i> 下载
          </button>
          <button class="btn btn-secondary btn-sm" onclick="showSDKDoc('${sdk.language}')">
            <i class="fa-solid fa-book"></i> 文档
          </button>
        </div>
      </div>
    `).join('');
  }

  // ---- Tab Navigation ----
  function setupTabNavigation() {
    document.querySelectorAll('.gateway-tab[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        switchTab(tabName);
      });
    });
  }

  function switchTab(tabName) {
    currentTab = tabName;

    // Update tab buttons
    document.querySelectorAll('.gateway-tab[data-tab]').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${tabName}`);
    });

    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('tab', tabName);
    window.history.replaceState({}, '', url);
  }

  // ---- Actions ----
  window.openDetailPage = function(type, id) {
    const pageMap = { mcp: 'mcp-detail.html', api: 'api-detail.html' };
    const page = pageMap[type];
    if (page) {
      const url = `pages/ai-open/${page}?id=${id}`;
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'navigate', url }, '*');
      } else {
        window.location.href = url;
      }
    }
  };

  window.openDebugPage = function(type, id) {
    const url = `pages/ai-open/debug.html?type=${type}&id=${id}`;
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'navigate', url }, '*');
    } else {
      window.location.href = url;
    }
  };

  window.copyUrl = function(id) {
    const api = data.api?.apis?.find(a => a.id === id);
    if (!api) return;
    copyText(api.url).then(() => {
      Toast.show('URL 已复制到剪贴板', 'success');
    });
  };

  window.copyText = function(text) {
    return navigator.clipboard?.writeText(text).catch(() => {});
  };

  window.downloadSDK = function(language) {
    Toast.show(`${language} SDK 下载已开始`, 'success');
  };

  window.showSDKDoc = function(language) {
    Toast.show(`查看 ${language} SDK 文档`, 'info');
  };

  // ---- Utilities ----
  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return String(num);
  }

  function statusLabel(status) {
    const labels = {
      online: '在线',
      testing: '测试中',
      offline: '停用',
      reviewing: '审核中',
      published: '已发布',
      healthy: '健康',
      degraded: '降级'
    };
    return labels[status] || status;
  }

  // ---- Start ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
