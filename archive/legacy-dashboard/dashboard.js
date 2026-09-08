/* =====================================================
   Dashboard Page Script - 运营驾驶舱优化版
   AI Capability Open Platform
   ===================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  await renderDashboard();
});

/**
 * Render the optimized dashboard
 */
async function renderDashboard() {
  const data = await loadMockData('dashboard');
  if (!data) {
    document.getElementById('app-content').innerHTML = '<div class="dashboard-loading">数据加载失败</div>';
    return;
  }

  const html = `
    <!-- 页面顶部快捷入口 -->
    <div class="dashboard-topbar">
      <div class="dashboard-topbar-right">
        <a href="pages/ai-operate/my-applications.html" class="topbar-link"><i class="fa-regular fa-file-lines"></i> 我的申请</a>
        <a href="pages/ai-operate/my-favorites.html" class="topbar-link"><i class="fa-regular fa-star"></i> 我的收藏</a>
      </div>
    </div>

    <!-- ⑤ Trend Chart (ECharts) -->
    <section class="section-gap">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa-solid fa-chart-line"></i> 调用趋势</div>
          <div class="trend-tabs">
            <button class="trend-tab active" data-range="7">近7日</button>
            <button class="trend-tab" data-range="30">近30日</button>
          </div>
        </div>
        <div class="card-body" style="padding:var(--space-4)">
          <div id="trend-chart" style="height:160px"></div>
        </div>
      </div>
    </section>

    <!-- ⑦ Recent Tables + TOP Ranking -->
    <section class="section-gap">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
        <!-- Latest Capability -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fa-solid fa-clock-rotate-left"></i> 最近发布能力</div>
            <a href="pages/ai-build/capability.html" class="btn btn-secondary">查看更多</a>
          </div>
          <div class="card-body">
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>能力名称</th>
                    <th>分类</th>
                    <th>状态</th>
                    <th>时间</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.latestCapability.map(cap => `
                    <tr>
                      <td><span class="font-medium text-primary">${cap.name}</span></td>
                      <td><span class="tag tag-gray">${cap.category}</span></td>
                      <td><span class="tag ${cap.status === 'published' ? 'tag-success' : 'tag-warning'}">${cap.status === 'published' ? '已发布' : '草稿'}</span></td>
                      <td class="text-muted">${cap.time}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Latest Invocation -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fa-solid fa-list-check"></i> 最近调用情况</div>
            <a href="pages/ai-operate/analytics.html" class="btn btn-secondary">查看更多</a>
          </div>
          <div class="card-body">
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>调用应用</th>
                    <th>能力</th>
                    <th>耗时</th>
                    <th>结果</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.latestInvocation.map(inv => `
                    <tr>
                      <td><span class="font-medium text-primary">${inv.app}</span></td>
                      <td>${inv.capability}</td>
                      <td class="text-muted">${inv.latency}ms</td>
                      <td><span class="tag ${inv.result === 'success' ? 'tag-success' : 'tag-danger'}">${inv.result === 'success' ? '成功' : '失败'}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑧ TOP Capabilities Ranking -->
    <section class="section-gap">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa-solid fa-trophy"></i> AI能力TOP排行榜</div>
          <a href="pages/ai-operate/analytics.html" class="btn btn-secondary">查看全部</a>
        </div>
        <div class="card-body">
          <div class="top-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>排名</th>
                  <th>能力名称</th>
                  <th>今日调用</th>
                  <th>Token消耗</th>
                  <th>平均耗时</th>
                  <th>成功率</th>
                </tr>
              </thead>
              <tbody>
                ${data.topCapabilities.map(cap => {
                  const rankClass = cap.rank === 1 ? 'rank-1' : cap.rank === 2 ? 'rank-2' : cap.rank === 3 ? 'rank-3' : 'rank-other';
                  return `
                    <tr>
                      <td><span class="rank-badge ${rankClass}">${cap.rank}</span></td>
                      <td><span class="font-medium text-primary">${cap.name}</span></td>
                      <td>${formatNumber(cap.calls)}</td>
                      <td class="text-muted">${cap.tokens}</td>
                      <td class="text-muted">${cap.avgTime}</td>
                      <td><span class="tag tag-success">${cap.successRate}%</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

  `;

  document.getElementById('app-content').innerHTML = html;
  const loadingEl = document.getElementById('dashboard-loading');
  if (loadingEl) loadingEl.style.display = 'none';

  // ECharts Trend Chart
  const chartDom = document.getElementById('trend-chart');
  if (chartDom) {
    const chart = echarts.init(chartDom, null, { renderer: 'canvas' });
    const dates7 = data.trend.map(d => d.date);
    const calls7 = data.trend.map(d => d.calls);
    const dates30 = Array.from({ length: 30 }, (_, i) => `${07 + Math.floor(i / 30)}-${String(9 + i).padStart(2, '0')}`);
    const calls30 = data.trend30d;

    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1F2937',
        borderColor: '#374151',
        textStyle: { color: '#F9FAFB', fontSize: 12 },
        formatter: function (params) {
          const p = params[0];
          return `${p.axisValue}<br/><span style="color:#818CF8;font-weight:600">${p.value.toLocaleString()}</span> 次`;
        }
      },
      grid: { top: 10, right: 16, bottom: 24, left: 50 },
      xAxis: {
        type: 'category',
        data: dates7,
        axisLine: { lineStyle: { color: '#E2E8F0' } },
        axisLabel: { color: '#94A3B8', fontSize: 10 },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
        axisLabel: { color: '#94A3B8', fontSize: 10, formatter: v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v }
      },
      series: [{
        type: 'line',
        data: calls7,
        smooth: 0.4,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: '#4F46E5', width: 2 },
        itemStyle: { color: '#4F46E5', borderColor: '#fff', borderWidth: 1.5 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(79,70,229,0.25)' },
            { offset: 1, color: 'rgba(79,70,229,0.02)' }
          ])
        }
      }]
    };

    chart.setOption(option);

    // Tab switch
    document.querySelectorAll('.trend-tab').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.trend-tab').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const range = parseInt(this.dataset.range);
        if (range === 7) {
          chart.setOption({
            xAxis: { data: dates7 },
            series: [{ data: calls7 }]
          });
        } else {
          chart.setOption({
            xAxis: { data: dates30 },
            series: [{ data: calls30 }]
          });
        }
      });
    });

    window.addEventListener('resize', () => chart.resize());
  }
}

/* ---- Modal Functions ---- */

function showModal(title, bodyHtml, showFooter = true) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-footer').style.display = showFooter ? 'flex' : 'none';
  document.getElementById('modal-overlay').classList.add('show');
}

function hideModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

document.getElementById('modal-close').addEventListener('click', hideModal);
document.getElementById('modal-cancel').addEventListener('click', hideModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) hideModal();
});

function showCapabilityDetail(id) {
  const data = getMockDataSync('dashboard');
  const cap = data.latestCapability.find(c => c.id === id);
  if (!cap) return;
  showModal('能力详情', `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">能力名称</label>
        <div class="form-value">${cap.name}</div>
      </div>
      <div class="form-group">
        <label class="form-label">分类</label>
        <div class="form-value">${cap.category}</div>
      </div>
      <div class="form-group">
        <label class="form-label">负责人</label>
        <div class="form-value">${cap.owner}</div>
      </div>
      <div class="form-group">
        <label class="form-label">发布时间</label>
        <div class="form-value">${cap.time}</div>
      </div>
      <div class="form-group">
        <label class="form-label">状态</label>
        <div class="form-value"><span class="tag ${cap.status === 'published' ? 'tag-success' : 'tag-warning'}">${cap.status === 'published' ? '已发布' : '草稿'}</span></div>
      </div>
    </div>
  `, false);
}

function editCapability(id) {
  const data = getMockDataSync('dashboard');
  const cap = data.latestCapability.find(c => c.id === id);
  if (!cap) return;
  showModal('编辑能力', `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">能力名称</label>
        <input type="text" class="form-input" value="${cap.name}">
      </div>
      <div class="form-group">
        <label class="form-label">分类</label>
        <select class="form-select">
          <option>数据治理</option>
          <option>数据检索</option>
          <option selected>${cap.category}</option>
          <option>运营支持</option>
          <option>开发支持</option>
          <option>数据安全</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">负责人</label>
        <input type="text" class="form-input" value="${cap.owner}">
      </div>
      <div class="form-group">
        <label class="form-label">状态</label>
        <select class="form-select">
          <option ${cap.status === 'draft' ? 'selected' : ''}>草稿</option>
          <option ${cap.status === 'published' ? 'selected' : ''}>已发布</option>
        </select>
      </div>
    </div>
  `, true);
  document.getElementById('modal-confirm').onclick = () => {
    hideModal();
    showToast('保存成功', 'success');
  };
}

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
