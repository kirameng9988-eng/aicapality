/* =====================================================
   MCP Service Gateway - Page Logic
   AI Capability Open Platform - Sprint 10
   ===================================================== */

(async function() {
  'use strict';

  // ---- State ----
  let data = {};
  let currentProtocol = 'mcp';
  let currentDrawerService = null;
  let playgroundService = null;

  // ---- Init ----
  async function init() {
    data = await fetchMockData();
    renderStatusLegend();
    renderOverview();
    renderServiceList();
    renderOpenAPITable();
    renderSDKGrid();
    renderTrend();
    renderAuthInfo();
    setupProtocolTabs();
    setupDrawerClose();
    setupPlayground();
  }

  // ---- Fetch Mock Data ----
  async function fetchMockData() {
    try {
      const res = await fetch('../../mock/service.json');
      return await res.json();
    } catch (e) {
      console.error('Failed to load service data:', e);
      return {};
    }
  }

  // ---- Render: Status Legend ----
  function renderStatusLegend() {
    const legend = data.statusLegend;
    const container = document.getElementById('statusLegend');
    if (!container || !legend) return;

    const items = Object.entries(legend).map(([key, item]) => `
      <div class="status-legend-item">
        <span class="status-legend-dot" style="background: ${item.color}"></span>
        <span>${item.label}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <span class="status-legend-title">服务状态</span>
      <div class="status-legend-items">${items}</div>
    `;
  }

  // ---- Render: Overview KPIs ----
  function renderOverview() {
    const ov = data.overview;
    if (!ov) return;

    const container = document.getElementById('svcKpiGrid');
    if (!container) return;

    const kpis = [
      { label: '已发布服务', value: ov.publishedServices, icon: 'fa-rocket', color: 'blue' },
      { label: '在线服务', value: ov.onlineServices, icon: 'fa-check-circle', color: 'green' },
      { label: '今日调用', value: ov.todayCalls, icon: 'fa-chart-line', color: 'cyan' },
      { label: '累计调用', value: formatNumber(ov.totalCalls), icon: 'fa-trophy', color: 'orange' },
      { label: '平均响应', value: ov.avgResponseTime, icon: 'fa-stopwatch', color: 'purple' },
      { label: '成功率', value: ov.successRate, icon: 'fa-percent', color: 'green' }
    ];

    container.innerHTML = kpis.map(k => `
      <div class="svc-kpi-card">
        <div class="svc-kpi-icon ${k.color}">
          <i class="fa-solid ${k.icon}"></i>
        </div>
        <div class="svc-kpi-info">
          <div class="svc-kpi-label">${k.label}</div>
          <div class="svc-kpi-value">${k.value}</div>
        </div>
      </div>
    `).join('');
  }

  // ---- Render: Service List (MCP Tab) ----
  function renderServiceList() {
    const list = data.serviceList || [];
    const tbody = document.getElementById('serviceTableBody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--color-text-muted);">暂无数据</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(svc => `
      <tr onclick="openDrawer('${svc.id}')">
        <td>
          <div class="service-name">${svc.name}</div>
          <div class="service-capability">${svc.capabilityName}</div>
        </td>
        <td><span style="font-size:var(--font-size-xs);color:var(--color-text-muted);">${svc.version}</span></td>
        <td><span class="protocol-tag mcp">MCP</span></td>
        <td><div class="service-endpoint">${svc.endpoint}</div></td>
        <td>
          <span class="service-status ${svc.status}">
            <span class="service-status-dot"></span>
            ${statusLabel(svc.status)}
          </span>
        </td>
        <td>${formatNumber(svc.calls)}</td>
        <td><span style="font-size:var(--font-size-xs);color:var(--color-text-muted);">${svc.createdAt}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); openDrawer('${svc.id}')" title="查看">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); openPlayground('${svc.id}')" title="测试">
              <i class="fa-solid fa-play"></i>
            </button>
            <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); copyEndpoint('${svc.id}')" title="复制地址">
              <i class="fa-solid fa-copy"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); offlineService('${svc.id}')" title="下线">
              <i class="fa-solid fa-power-off"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ---- Render: OpenAPI Table ----
  function renderOpenAPITable() {
    const list = data.openapiList || [];
    const tbody = document.getElementById('openapiTableBody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--color-text-muted);">暂无数据</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(api => `
      <tr>
        <td>
          <div class="service-name">${api.name}</div>
        </td>
        <td><div class="service-endpoint" style="max-width:200px;">${api.url}</div></td>
        <td><span class="method-tag ${api.method.toLowerCase()}">${api.method}</span></td>
        <td><span style="font-size:var(--font-size-xs);color:var(--color-text-muted);">${api.auth}</span></td>
        <td><span style="font-size:var(--font-size-xs);color:var(--color-text-muted);">${api.version}</span></td>
        <td>
          <span class="service-status ${api.status}">
            <span class="service-status-dot"></span>
            ${statusLabel(api.status)}
          </span>
        </td>
        <td>${formatNumber(api.calls)}</td>
      </tr>
    `).join('');
  }

  // ---- Render: SDK Grid ----
  function renderSDKGrid() {
    const list = data.sdkList || [];
    const container = document.getElementById('sdkSvcGrid');
    if (!container) return;

    const langClasses = {
      'Python': 'python', 'Java': 'java', 'Go': 'go', 'Node.js': 'nodejs', 'C#': 'csharp'
    };
    const langIcons = {
      'Python': 'fa-python', 'Java': 'fa-java', 'Go': 'fa-golang', 'Node.js': 'fa-node-js', 'C#': 'fa-csharp'
    };

    container.innerHTML = list.map(sdk => `
      <div class="sdk-svc-card">
        <div class="sdk-svc-header">
          <div class="sdk-svc-lang-icon ${langClasses[sdk.language] || 'python'}">
            <i class="fa-brands ${langIcons[sdk.language] || 'fa-code'}"></i>
          </div>
          <div>
            <div class="sdk-svc-lang-name">${sdk.language}</div>
            <div class="sdk-svc-version">${sdk.version}</div>
          </div>
        </div>
        <div class="sdk-svc-downloads">
          <i class="fa-solid fa-download" style="margin-right:4px;"></i>${formatNumber(sdk.downloads)} 下载
        </div>
        <div class="sdk-svc-code">${sdk.exampleCode}</div>
        <div class="sdk-svc-actions">
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

  // ---- Render: 7-Day Trend Chart ----
  function renderTrend() {
    const trend = data.trend;
    const container = document.getElementById('trendBars');
    if (!container || !trend) return;

    const maxCalls = Math.max(...trend.calls);
    const total = trend.calls.reduce((a, b) => a + b, 0);

    container.innerHTML = trend.calls.map((calls, i) => {
      const height = maxCalls > 0 ? Math.max((calls / maxCalls) * 100, 5) : 5;
      return `
        <div class="trend-bar-wrapper">
          <div class="trend-bar" style="height: ${height}%;">
            <span class="trend-bar-value">${calls}</span>
          </div>
          <span class="trend-bar-label">${trend.labels[i]}</span>
        </div>
      `;
    }).join('');
  }

  // ---- Render: Auth Info ----
  function renderAuthInfo() {
    const clients = data.clients || [];
    const tbody = document.getElementById('authTableBody');
    if (!tbody) return;

    tbody.innerHTML = clients.map(c => {
      const statusClass = c.authStatus === '正常' ? 'normal' : c.authStatus === '待续期' ? 'pending' : 'paused';
      return `
        <tr>
          <td>${c.name}</td>
          <td>${formatNumber(c.calls)}</td>
          <td><span style="font-size:var(--font-size-xs);color:var(--color-text-muted);">${c.lastCall}</span></td>
          <td><span class="auth-status-tag ${statusClass}">${c.authStatus}</span></td>
        </tr>
      `;
    }).join('');
  }

  // ---- Protocol Tabs ----
  function setupProtocolTabs() {
    document.querySelectorAll('.protocol-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;
        switchProtocolTab(tabId);
      });
    });
  }

  function switchProtocolTab(tabId) {
    currentProtocol = tabId;

    document.querySelectorAll('.protocol-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabId);
    });

    document.getElementById('panel-mcp')?.classList.toggle('active', tabId === 'mcp');
    document.getElementById('panel-openapi')?.classList.toggle('active', tabId === 'openapi');
    document.getElementById('panel-sdk')?.classList.toggle('active', tabId === 'sdk');
  }

  // ---- Drawer ----
  window.openDrawer = function(id) {
    const svc = data.serviceList?.find(s => s.id === id);
    if (!svc) return;
    currentDrawerService = svc;

    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawerOverlay');

    // Fill drawer content
    document.getElementById('drawerTitle').textContent = svc.name;
    document.getElementById('drawerServiceId').textContent = svc.id;
    document.getElementById('drawerCapability').textContent = svc.capabilityName;
    document.getElementById('drawerVersion').textContent = svc.version;
    document.getElementById('drawerCategory').textContent = svc.category;
    document.getElementById('drawerProtocol').textContent = 'MCP';
    document.getElementById('drawerEndpoint').textContent = svc.endpoint;
    document.getElementById('drawerEndpoint').href = svc.endpoint;
    document.getElementById('drawerAuth').textContent = svc.authType;
    document.getElementById('drawerOwner').textContent = svc.owner;
    document.getElementById('drawerPublished').textContent = svc.publishedAt;
    document.getElementById('drawerTools').textContent = svc.tools + ' 个工具';
    document.getElementById('drawerToolsList').innerHTML = svc.toolsList.map(t =>
      `<span class="binding-item"><i class="fa-solid fa-check"></i>${t}</span>`
    ).join('');
    document.getElementById('drawerPrompt').textContent = svc.boundPrompt;
    document.getElementById('drawerModel').textContent = svc.boundModel;
    document.getElementById('drawerKnowledge').textContent = svc.boundKnowledge;
    document.getElementById('drawerCallExample').textContent = svc.callExample;
    document.getElementById('drawerResponseExample').textContent = svc.responseExample;

    drawer.classList.add('show');
    overlay.classList.add('show');
  };

  window.closeDrawer = function() {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawerOverlay');
    drawer.classList.remove('show');
    overlay.classList.remove('show');
    currentDrawerService = null;
  };

  function setupDrawerClose() {
    const overlay = document.getElementById('drawerOverlay');
    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  // ---- Playground Modal ----
  window.openPlayground = function(id) {
    const svc = data.serviceList?.find(s => s.id === id);
    if (!svc) return;
    playgroundService = svc;

    const modal = document.getElementById('playgroundModal');
    document.getElementById('playgroundTitle').textContent = svc.name + ' - MCP Playground';

    // Fill param inputs
    const paramsContainer = document.getElementById('playgroundParams');
    if (paramsContainer && svc.params) {
      paramsContainer.innerHTML = svc.params.map(p => `
        <div class="playground-form-group">
          <label class="playground-form-label">${p.label}${p.required ? ' *' : ''}</label>
          <input class="playground-form-input" type="text" value="${p.value}"
            data-param="${p.name}" placeholder="${p.type}: ${p.label}">
        </div>
      `).join('');
    }

    // Show mock response
    updatePlaygroundOutput();

    modal.classList.add('show');
  };

  window.closePlayground = function() {
    document.getElementById('playgroundModal').classList.remove('show');
    playgroundService = null;
  };

  function setupPlayground() {
    const runBtn = document.getElementById('playgroundRun');
    if (runBtn) {
      runBtn.addEventListener('click', runPlayground);
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePlayground();
    });
  }

  function runPlayground() {
    const output = document.getElementById('playgroundOutput');
    if (!output) return;

    output.innerHTML = '<span style="color:var(--color-text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> 执行中...</span>';

    setTimeout(() => {
      updatePlaygroundOutput();
      showToast('请求成功', 'success');
    }, 600);
  }

  function updatePlaygroundOutput() {
    const output = document.getElementById('playgroundOutput');
    const latencyEl = document.getElementById('playgroundLatency');
    const tokensEl = document.getElementById('playgroundTokens');

    const mock = data.playground?.mockResponse;
    if (mock && output) {
      output.innerHTML = JSON.stringify(mock.data, null, 2);
      if (latencyEl) latencyEl.textContent = mock.latency + 'ms';
      if (tokensEl) tokensEl.textContent = (mock.tokens?.input || 0) + (mock.tokens?.output || 0);
    }
  }

  // ---- Actions ----
  window.copyEndpoint = function(id) {
    const svc = data.serviceList?.find(s => s.id === id);
    if (!svc) return;
    navigator.clipboard?.writeText(svc.endpoint).then(() => {
      showToast('服务地址已复制', 'success');
    }).catch(() => {
      showToast('复制失败', 'error');
    });
  };

  window.offlineService = function(id) {
    const svc = data.serviceList?.find(s => s.id === id);
    if (!svc) return;
    showToast(`已将 ${svc.name} 下线`, 'info');
    // In real app, this would call API
  };

  window.downloadSDK = function(language) {
    showToast(`${language} SDK 下载已开始`, 'success');
  };

  window.showSDKDoc = function(language) {
    showToast(`查看 ${language} SDK 文档`, 'info');
  };

  // ---- Utilities ----
  function formatNumber(num) {
    if (typeof num === 'string') return num;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return String(num);
  }

  function statusLabel(status) {
    const labels = {
      online: '在线',
      maintenance: '维护',
      offline: '离线',
      error: '异常'
    };
    return labels[status] || status;
  }

  function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info-circle';
    toast.innerHTML = `<i class="fa-solid fa-${icon}"></i>${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ---- Start ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
