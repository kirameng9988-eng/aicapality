/* =====================================================
   AI Capability Open Platform - 能力监控 (简化版)
   按照新的信息架构，只保留核心监控内容
   ===================================================== */

let trendChart = null;
let currentTrendRange = '7d';

// Mock数据(本地常量, 能力名称/数量由 AgentStore 派生)
const MOCK_OVERVIEW = {
  totalCapabilities: 48,
  runningCapabilities: 42,
  todayCalls: 18394,
  successRate: 99.5,
  avgResponseTime: 286
};

const MOCK_RUNNING = [
  { name: '数据资源智能编目', status: 'healthy', todayCalls: 5286, successRate: 99.8, avgTime: 312, recentError: '-' },
  { name: '数据质量分析', status: 'healthy', todayCalls: 3842, successRate: 99.2, avgTime: 428, recentError: '-' },
  { name: 'OCR识别', status: 'warning', todayCalls: 1832, successRate: 96.4, avgTime: 1200, recentError: '响应变慢' },
  { name: '数据分类助手', status: 'abnormal', todayCalls: 326, successRate: 82.1, avgTime: 2400, recentError: '模型调用失败' },
  { name: '数据血缘分析', status: 'healthy', todayCalls: 956, successRate: 99.6, avgTime: 520, recentError: '-' },
  { name: '智能问答', status: 'healthy', todayCalls: 2847, successRate: 99.9, avgTime: 198, recentError: '-' },
  { name: '报表生成', status: 'warning', todayCalls: 1243, successRate: 97.2, avgTime: 890, recentError: '响应变慢' },
  { name: '代码审查', status: 'stopped', todayCalls: 0, successRate: 0, avgTime: 0, recentError: '-' }
];

const MOCK_RECENT_EXCEPTIONS = [
  { name: '数据分类助手', error: '模型调用失败', time: '14:32' },
  { name: 'OCR识别', error: '平均响应时间超过阈值', time: '13:46' },
  { name: '数据质量分析', error: 'MCP调用失败', time: '11:28' }
];

const MOCK_APP_RANKING = [
  { name: '数据资源管理系统', calls: 5286 },
  { name: '公共数据目录系统', calls: 3842 },
  { name: '数据产品管理系统', calls: 2196 },
  { name: '数据治理平台', calls: 1832 },
  { name: '开放数据门户', calls: 926 }
];

const METRIC_POOL = [
  { status: 'healthy', todayCalls: 5286, successRate: 99.8, avgTime: 312, recentError: '-' },
  { status: 'healthy', todayCalls: 3842, successRate: 99.2, avgTime: 428, recentError: '-' },
  { status: 'warning', todayCalls: 1832, successRate: 96.4, avgTime: 1200, recentError: '响应变慢' },
  { status: 'abnormal', todayCalls: 326, successRate: 82.1, avgTime: 2400, recentError: '模型调用失败' },
  { status: 'healthy', todayCalls: 956, successRate: 99.6, avgTime: 520, recentError: '-' },
  { status: 'healthy', todayCalls: 2847, successRate: 99.9, avgTime: 198, recentError: '-' },
  { status: 'warning', todayCalls: 1243, successRate: 97.2, avgTime: 890, recentError: '响应变慢' },
  { status: 'stopped', todayCalls: 0, successRate: 0, avgTime: 0, recentError: '-' }
];

// 运行列表由 AgentStore 已上架 Agent 派生(Agent 即能力)
function buildRunningList() {
  const agents = (typeof AgentStore !== 'undefined')
    ? AgentStore.list().filter(a => a.status === 'published')
    : [];
  if (!agents.length) return MOCK_RUNNING;
  return agents.slice(0, 8).map((a, i) => {
    const m = METRIC_POOL[i % METRIC_POOL.length];
    return {
      id: a.id,
      name: a.name,
      status: m.status,
      todayCalls: m.todayCalls,
      successRate: m.successRate,
      avgTime: m.avgTime,
      recentError: m.recentError
    };
  });
}

const MOCK_TREND_7D = {
  timePoints: ['09-01', '09-02', '09-03', '09-04', '09-05', '09-06', '09-07'],
  calls: [15230, 16840, 17320, 15980, 18120, 17650, 18394]
};

const MOCK_TREND_30D = {
  timePoints: Array.from({length: 30}, (_, i) => String(i + 1).padStart(2, '0') + '日'),
  calls: Array.from({length: 30}, (_, i) => Math.round(15000 + Math.sin(i / 3) * 3000 + i * 120))
};

document.addEventListener('DOMContentLoaded', async () => {
  await renderMonitor();
  window.addEventListener('acp-store-change', () => renderMonitor());
});

async function renderMonitor() {
  const totalCapabilities = (typeof AgentStore !== 'undefined')
    ? AgentStore.list().filter(a => a.status === 'published').length
    : MOCK_OVERVIEW.totalCapabilities;
  const html = `
    <!-- ① 核心运行指标 -->
    <section class="monitor-section">
      <div class="monitor-kpi-grid">
        <div class="monitor-kpi-card">
          <div class="kpi-icon kpi-icon-purple"><i class="fa-solid fa-brain"></i></div>
          <div class="kpi-content">
            <div class="kpi-label">AI能力总数</div>
            <div class="kpi-value">${totalCapabilities}</div>
          </div>
        </div>
        <div class="monitor-kpi-card">
          <div class="kpi-icon kpi-icon-green"><i class="fa-solid fa-play"></i></div>
          <div class="kpi-content">
            <div class="kpi-label">运行中</div>
            <div class="kpi-value">${MOCK_OVERVIEW.runningCapabilities}</div>
          </div>
        </div>
        <div class="monitor-kpi-card">
          <div class="kpi-icon kpi-icon-orange"><i class="fa-solid fa-phone-volume"></i></div>
          <div class="kpi-content">
            <div class="kpi-label">今日调用</div>
            <div class="kpi-value">${formatNumber(MOCK_OVERVIEW.todayCalls)}</div>
          </div>
        </div>
        <div class="monitor-kpi-card">
          <div class="kpi-icon kpi-icon-cyan"><i class="fa-solid fa-circle-check"></i></div>
          <div class="kpi-content">
            <div class="kpi-label">调用成功率</div>
            <div class="kpi-value">${MOCK_OVERVIEW.successRate}<span class="kpi-unit">%</span></div>
          </div>
        </div>
        <div class="monitor-kpi-card">
          <div class="kpi-icon kpi-icon-blue"><i class="fa-solid fa-clock"></i></div>
          <div class="kpi-content">
            <div class="kpi-label">平均响应时间</div>
            <div class="kpi-value">${MOCK_OVERVIEW.avgResponseTime}<span class="kpi-unit">ms</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ② 能力调用趋势 -->
    <section class="monitor-section">
      <div class="monitor-card">
        <div class="card-header">
          <h3 class="card-title"><i class="fa-solid fa-chart-line"></i> 能力调用趋势</h3>
          <div class="trend-time-seg">
            <button class="trend-time-btn ${currentTrendRange === '7d' ? 'active' : ''}" data-range="7d" onclick="switchTrendRange('7d')">近7日</button>
            <button class="trend-time-btn ${currentTrendRange === '30d' ? 'active' : ''}" data-range="30d" onclick="switchTrendRange('30d')">近30日</button>
          </div>
        </div>
        <div class="trend-chart-container" id="trend-chart"></div>
      </div>
    </section>

    <!-- ③ 能力运行状态 -->
    <section class="monitor-section">
      <div class="monitor-card">
        <div class="card-header">
          <h3 class="card-title"><i class="fa-solid fa-desktop"></i> 能力运行状态</h3>
        </div>
        <div class="table-wrapper">
          <table class="monitor-table">
            <thead>
              <tr>
                <th>能力名称</th>
                <th>状态</th>
                <th>今日调用</th>
                <th>成功率</th>
                <th>平均耗时</th>
                <th>最近异常</th>
              </tr>
            </thead>
            <tbody>
              ${buildRunningList().map(item => `
                <tr>
                  <td><span class="font-medium">${item.name}</span></td>
                  <td><span class="status-badge ${item.status}"><span class="status-dot ${item.status}"></span>${getStatusLabel(item.status)}</span></td>
                  <td>${item.todayCalls > 0 ? formatNumber(item.todayCalls) : '-'}</td>
                  <td>${item.successRate > 0 ? item.successRate + '%' : '-'}</td>
                  <td>${item.avgTime > 0 ? item.avgTime + 'ms' : '-'}</td>
                  <td><span class="error-hint ${item.recentError !== '-' ? 'has-error' : ''}">${item.recentError}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ④ 最近异常 + ⑤ 调用应用TOP5 -->
    <section class="monitor-section monitor-two-col">
      <!-- 最近异常 -->
      <div class="monitor-card">
        <div class="card-header">
          <h3 class="card-title"><i class="fa-solid fa-triangle-exclamation"></i> 最近异常</h3>
        </div>
        <div class="exception-list">
          ${MOCK_RECENT_EXCEPTIONS.map(exc => `
            <div class="exception-item">
              <div class="exception-icon"><i class="fa-solid fa-circle-exclamation"></i></div>
              <div class="exception-content">
                <div class="exception-name">${exc.name}</div>
                <div class="exception-error">${exc.error}</div>
              </div>
              <div class="exception-time">${exc.time}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 调用应用 TOP5 -->
      <div class="monitor-card">
        <div class="card-header">
          <h3 class="card-title"><i class="fa-solid fa-mobile-screen"></i> 调用应用 TOP5</h3>
        </div>
        <div class="app-ranking">
          ${MOCK_APP_RANKING.map((app, idx) => `
            <div class="app-ranking-item">
              <div class="app-ranking-rank rank-${idx + 1}">${idx + 1}</div>
              <div class="app-ranking-name">${app.name}</div>
              <div class="app-ranking-calls">${formatNumber(app.calls)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  document.getElementById('app-content').innerHTML = html;

  // 初始化图表
  setTimeout(() => {
    initTrendChart();
  }, 100);

  // 隐藏loading
  const loadingEl = document.getElementById('dashboard-loading');
  if (loadingEl) loadingEl.style.display = 'none';
}

function initTrendChart() {
  const chartDom = document.getElementById('trend-chart');
  if (!chartDom) return;

  if (trendChart) {
    trendChart.dispose();
  }

  trendChart = echarts.init(chartDom);
  updateTrendChart();
}

function updateTrendChart() {
  if (!trendChart) return;

  const data = currentTrendRange === '7d' ? MOCK_TREND_7D : MOCK_TREND_30D;

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      textStyle: { color: '#E2E8F0' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.timePoints,
      axisLine: { lineStyle: { color: '#E5E7EB' } },
      axisLabel: { color: '#6B7280', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
      axisLabel: { color: '#6B7280', fontSize: 11 }
    },
    series: [{
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#6366F1', width: 2 },
      itemStyle: { color: '#6366F1' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(99, 102, 241, 0.15)' },
            { offset: 1, color: 'rgba(99, 102, 241, 0)' }
          ]
        }
      },
      data: data.calls
    }]
  };

  trendChart.setOption(option);
}

function switchTrendRange(range) {
  currentTrendRange = range;
  document.querySelectorAll('.trend-time-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.range === range);
  });
  updateTrendChart();
}

function getStatusLabel(status) {
  const labels = {
    'healthy': '正常',
    'warning': '性能下降',
    'abnormal': '异常',
    'stopped': '已停用'
  };
  return labels[status] || status;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
