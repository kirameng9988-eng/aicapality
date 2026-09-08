/* =====================================================
   Capability Publish Center JavaScript
   AI Capability Open Platform
   Sprint 08
   ===================================================== */

// Mock Data (loaded from mock/publish.json)
let publishData = null;

// 当前正在配置发布的待发布项 id（用于校验时读取该项的就绪状态）
let currentPublishItemId = null;

// 待审核 Agent(发布中心数据源, Agent 即能力)
function getPendingAgents() {
  if (typeof AgentStore === 'undefined') return [];
  return AgentStore.list()
    .filter(a => a.status === 'submitted')
    .map(a => ({
      id: a.id,
      name: a.name,
      type: 'Agent',
      version: String(a.version || '').replace(/^v/, ''),
      owner: a.creator || '-',
      status: '待审核',
      description: a.description || '',
      changelog: (a.publishInfo && a.publishInfo.note) || ((a.versions && a.versions[0] && a.versions[0].note)) || '',
      agentName: a.name,
      boundResources: { model: a.model || '-', knowledge: '-', mcp: '-' },
      validation: {
        promptComplete: true,
        modelBound: !!a.model,
        knowledgeBound: true,
        mcpBound: true,
        permissionConfigured: (a.protocols && a.protocols.length > 0),
        documentationComplete: !!(a.description || '').length > 0
      }
    }));
}

// 已上架 Agent 历史(renderHistory 数据源)
function getPublishedAgents() {
  if (typeof AgentStore === 'undefined') return [];
  return AgentStore.list()
    .filter(a => a.status === 'published')
    .map(a => ({
      id: a.id,
      publishTime: (a.publishInfo && a.publishInfo.time) || '-',
      publisher: a.creator || '-',
      capabilityName: a.name,
      version: String(a.version || '').replace(/^v/, ''),
      result: '成功',
      approvalStatus: '已通过',
      environment: '生产',
      protocol: (a.protocols || []).join('/'),
      approver: (a.publishInfo && a.publishInfo.approver) || '-',
      approvalComment: (a.publishInfo && a.publishInfo.note) || '-',
      changelog: ((a.versions && a.versions[0] && a.versions[0].note)) || '-'
    }));
}

// 发布就绪检查项定义（critical 为 true 的为硬性拦截项）
const VALIDATION_ITEMS = [
  { key: 'promptComplete',      label: 'Prompt 完成',  icon: 'fa-terminal',        critical: false },
  { key: 'modelBound',          label: '模型绑定',     icon: 'fa-microchip',       critical: true  },
  { key: 'knowledgeBound',      label: '知识库绑定',   icon: 'fa-book',            critical: false },
  { key: 'mcpBound',            label: 'MCP 绑定',     icon: 'fa-plug',            critical: false },
  { key: 'permissionConfigured',label: '权限配置',     icon: 'fa-shield-halved',   critical: true  },
  { key: 'documentationComplete',label: '文档完成',    icon: 'fa-file-lines',      critical: false }
];

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
  await loadMockData();
  renderOverview();
  renderPendingList();
  renderHistory();
  initEventListeners();
  if (typeof window !== 'undefined') {
    window.addEventListener('acp-store-change', function () {
      renderOverview();
      renderPendingList();
      renderHistory();
    });
  }
});

// Load mock data
async function loadMockData() {
  try {
    const response = await fetch('../../mock/publish.json');
    publishData = await response.json();
  } catch (error) {
    console.warn('Failed to load mock data, using embedded data');
    publishData = getEmbeddedMockData();
  }
}

// Embedded mock data fallback
function getEmbeddedMockData() {
  return {
    overview: {
      pendingCount: 8,
      publishedCount: 24,
      approvingCount: 3,
      successRate: 94.2
    },
    pendingList: [
      { id: 'pend-001', name: '智能问答', type: 'Prompt', version: '1.0.0', owner: '李明', publishTime: '2026-06-28', status: '待发布',
        description: '基于 RAG 的智能问答能力，支持多轮对话与知识检索溯源',
        boundResources: { model: 'GLM-4', knowledge: '产品知识库 v3', mcp: '-' },
        changelog: '首次发布；新增多轮对话与溯源引用能力',
        validation: { promptComplete: true, modelBound: true, knowledgeBound: true, mcpBound: false, permissionConfigured: true, documentationComplete: true } },
      { id: 'pend-002', name: '数据清洗', type: 'Agent', version: '1.1.0', owner: '王芳', publishTime: '2026-06-28', status: '待发布',
        description: '面向数据清洗任务的智能体能力，支持自定义清洗规则与标准化处理',
        boundResources: { model: 'GLM-4-Air', knowledge: '-', mcp: '数据源连接器' },
        changelog: '新增地址字段标准化规则；修复空值处理缺陷',
        validation: { promptComplete: true, modelBound: true, knowledgeBound: false, mcpBound: true, permissionConfigured: true, documentationComplete: true } },
      { id: 'pend-003', name: '报表生成', type: 'Knowledge', version: '2.0.0', owner: '张强', publishTime: '2026-06-27', status: '待发布',
        description: '基于知识库的智能报表生成，支持自然语言驱动的数据透视',
        boundResources: { model: 'GLM-4', knowledge: '财务报表知识库', mcp: '-' },
        changelog: '2.0 大版本重构；支持多表关联与图表渲染',
        validation: { promptComplete: true, modelBound: true, knowledgeBound: true, mcpBound: false, permissionConfigured: true, documentationComplete: true } },
      { id: 'pend-004', name: '图像识别', type: 'Model', version: '1.5.0', owner: '陈静', publishTime: '2026-06-27', status: '待发布',
        description: '通用图像识别模型，支持 200+ 场景分类与目标检测',
        boundResources: { model: '视觉模型 v1.5', knowledge: '-', mcp: '-' },
        changelog: '模型精度提升 4.2%；新增 30 个细粒度场景',
        validation: { promptComplete: true, modelBound: true, knowledgeBound: false, mcpBound: false, permissionConfigured: false, documentationComplete: true } },
      { id: 'pend-005', name: '文件解析', type: 'MCP', version: '1.2.0', owner: '刘洋', publishTime: '2026-06-26', status: '待发布',
        description: '多格式文件解析 MCP 工具，支持 PDF/Word/Excel 结构化抽取',
        boundResources: { model: '-', knowledge: '-', mcp: '文件解析服务' },
        changelog: '新增 Excel 合并单元格处理；提升表格识别准确率',
        validation: { promptComplete: true, modelBound: false, knowledgeBound: false, mcpBound: true, permissionConfigured: true, documentationComplete: true } },
      { id: 'pend-006', name: '情感分析', type: 'Prompt', version: '1.0.0', owner: '赵雷', publishTime: '2026-06-26', status: '待发布',
        description: '文本情感分析与倾向判断，输出正/负/中性及置信度',
        boundResources: { model: 'GLM-4-Air', knowledge: '-', mcp: '-' },
        changelog: '首次发布；支持批量推理与置信度输出',
        validation: { promptComplete: true, modelBound: true, knowledgeBound: false, mcpBound: false, permissionConfigured: false, documentationComplete: false } },
      { id: 'pend-007', name: '数据抽取', type: 'Agent', version: '1.3.0', owner: '孙燕', publishTime: '2026-06-25', status: '待发布',
        description: '面向非结构化文本实体抽取的智能体能力，支持自定义抽取 schema',
        boundResources: { model: 'GLM-4', knowledge: '实体词典库', mcp: '数据源连接器' },
        changelog: '新增关系抽取技能；优化抽取吞吐性能',
        validation: { promptComplete: true, modelBound: true, knowledgeBound: true, mcpBound: true, permissionConfigured: true, documentationComplete: true } },
      { id: 'pend-008', name: '知识图谱', type: 'Knowledge', version: '1.0.0', owner: '周杰', publishTime: '2026-06-25', status: '待发布',
        description: '行业知识图谱构建与问答，支持实体关系推理',
        boundResources: { model: 'GLM-4', knowledge: '行业图谱库 v1', mcp: '-' },
        changelog: '首次发布；提供图谱可视化与推理问答',
        validation: { promptComplete: true, modelBound: true, knowledgeBound: true, mcpBound: false, permissionConfigured: true, documentationComplete: true } }
    ],
    publishFlow: {
      steps: [
        { id: 1, name: '能力创建', icon: 'fa-plus-circle', desc: '创建并配置能力' },
        { id: 2, name: '测试验证', icon: 'fa-vial', desc: '功能与性能测试' },
        { id: 3, name: '配置策略', icon: 'fa-sliders', desc: '开放策略与权限' },
        { id: 4, name: '发布审批', icon: 'fa-clipboard-check', desc: '审批流程确认' },
        { id: 5, name: '能力上线', icon: 'fa-rocket', desc: '正式发布上线' },
        { id: 6, name: '市场上架', icon: 'fa-store', desc: '同步至能力市场' }
      ],
      currentStep: 3
    },
    validation: {
      promptComplete: true,
      modelBound: true,
      knowledgeBound: true,
      mcpBound: true,
      permissionConfigured: true,
      documentationComplete: true
    },
    history: [
      { id: 'hist-001', publishTime: '2026-06-22 14:30:00', publisher: '张明', capabilityName: '开发助手', version: '2.0.0', result: '成功', duration: '4分32秒', approvalStatus: '已通过',
        environment: '生产', protocol: 'OpenAPI', approver: '周主管', approvalComment: '测试全部通过，性能达标，同意发布至生产', changelog: '支持代码补全多语言；上下文窗口扩展至 128K' },
      { id: 'hist-002', publishTime: '2026-06-20 10:15:00', publisher: '张明', capabilityName: '智能编目', version: '2.1.0', result: '成功', duration: '3分18秒', approvalStatus: '已通过',
        environment: '生产', protocol: 'MCP', approver: '周主管', approvalComment: '编目准确率达标，同意发布', changelog: '新增字段自动映射；编目准确率提升至 96%' },
      { id: 'hist-003', publishTime: '2026-06-19 16:45:00', publisher: '王芳', capabilityName: '数据脱敏', version: '1.2.0', result: '成功', duration: '5分02秒', approvalStatus: '已通过',
        environment: '预发布', protocol: 'SDK', approver: '李主管', approvalComment: '脱敏规则覆盖度达标，同意发布至预发布', changelog: '新增身份证与银行卡脱敏规则；支持自定义保留位' },
      { id: 'hist-004', publishTime: '2026-06-18 09:20:00', publisher: '李明', capabilityName: '找数寻源', version: '1.8.0', result: '成功', duration: '4分45秒', approvalStatus: '已通过',
        environment: '生产', protocol: 'OpenAPI', approver: '周主管', approvalComment: '同意发布', changelog: '优化数据源检索排序；修复分页缺陷' },
      { id: 'hist-005', publishTime: '2026-06-15 11:30:00', publisher: '张强', capabilityName: '运营助手', version: '1.5.0', result: '失败', duration: '2分10秒', approvalStatus: '已拒绝', failReason: '测试用例未通过',
        environment: '生产', protocol: 'OpenAPI', approver: '周主管', approvalComment: '回归测试 3 个用例未通过，驳回修复后重新提审', changelog: '新增运营看板模块（本次发布未成功）' }
    ]
  };
}

// Render Overview Section
function renderOverview() {
  const agents = (typeof AgentStore !== 'undefined') ? AgentStore.list() : [];
  const pendingCount = agents.filter(a => a.status === 'submitted').length;
  const approvingCount = pendingCount;
  const publishedCount = agents.filter(a => a.status === 'published').length;

  // Update KPI values
  document.querySelector('[data-kpi="pending"]').textContent = pendingCount;
  document.querySelector('[data-kpi="published"]').textContent = publishedCount;
  document.querySelector('[data-kpi="approving"]').textContent = approvingCount;
  const rateEl = document.querySelector('[data-kpi="rate"]');
  rateEl.textContent = ((publishData && publishData.overview && publishData.overview.successRate) || '94.2') + '%';
}

// Render Pending List
function renderPendingList(filter = 'all', search = '') {
  const pendingList = getPendingAgents();

  let filtered = pendingList;
  if (filter !== 'all') {
    if (filter === 'submitted') {
      filtered = filtered.filter(item => item.status === '待审核');
    } else {
      filtered = [];
    }
  }
  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.owner.toLowerCase().includes(search.toLowerCase())
    );
  }

  const tbody = document.getElementById('pending-table-body');
  tbody.innerHTML = filtered.map(item => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td><span class="capability-type-badge type-agent">${item.type}</span></td>
      <td>${item.version ? 'v' + item.version : '—'}</td>
      <td>${item.owner}</td>
      <td><span class="status-badge status-pending"><i class="fa-solid fa-clock"></i> ${item.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-primary" onclick="approveAgent('${item.id}')">
            <i class="fa-solid fa-check"></i> 审核通过
          </button>
          <button class="btn btn-sm btn-secondary" onclick="rejectAgent('${item.id}')">
            <i class="fa-solid fa-xmark"></i> 驳回
          </button>
          <button class="btn-icon" onclick="viewPendingDetail('${item.id}')" title="查看详情">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  // Update filter active state
  document.querySelectorAll('.filter-menu-item').forEach(item => {
    item.classList.toggle('active', item.dataset.filter === filter);
  });
}

// Render Publish Flow (into a given container)
function renderPublishFlow(container) {
  const { publishFlow } = publishData;

  container.innerHTML = publishFlow.steps.map((step, index) => {
    let state = 'pending';
    if (step.id < publishFlow.currentStep) state = 'completed';
    if (step.id === publishFlow.currentStep) state = 'current';

    const showArrow = index < publishFlow.steps.length - 1;
    const arrowState = step.id < publishFlow.currentStep ? 'completed' : '';

    return `
      <div class="flow-step ${state}">
        <div class="flow-step-icon-wrap">
          <i class="fa-solid ${step.icon}"></i>
        </div>
        <div class="flow-step-name">${step.name}</div>
        <div class="flow-step-desc">${step.desc}</div>
      </div>
      ${showArrow ? `<div class="flow-arrow ${arrowState}"><i class="fa-solid fa-chevron-right"></i></div>` : ''}
    `;
  }).join('');
}

// Render Validation (into a given container)
function renderValidation(container, validation) {
  const v = validation || publishData.validation;

  container.innerHTML = VALIDATION_ITEMS.map(item => `
    <div class="validation-item ${v[item.key] ? 'passed' : ''}">
      <div class="validation-icon">
        <i class="fa-solid ${v[item.key] ? 'fa-check' : 'fa-minus'}"></i>
      </div>
      <span class="validation-text">${item.label}${item.critical ? '<span class="validation-critical-tag">必检</span>' : ''}</span>
    </div>
  `).join('');
}

// Open Flow Modal
function openFlowModal() {
  const modal = document.getElementById('publish-modal');
  document.getElementById('publish-modal-title').innerHTML = `<i class="fa-solid fa-diagram-next"></i> 发布流程`;
  const body = document.getElementById('publish-modal-body');
  body.innerHTML = `
    <div class="publish-flow-container">
      <div class="publish-flow" id="publish-flow"></div>
    </div>
  `;
  renderPublishFlow(body.querySelector('#publish-flow'));
  modal.classList.add('show');
}

// Open Validation Modal
function openValidationModal() {
  const modal = document.getElementById('publish-modal');
  document.getElementById('publish-modal-title').innerHTML = `<i class="fa-solid fa-clipboard-check"></i> 发布校验`;
  const body = document.getElementById('publish-modal-body');
  body.innerHTML = `
    <div class="validation-container">
      <div class="validation-header">
        <i class="fa-solid fa-sparkles"></i>
        <h3>发布前自动校验</h3>
      </div>
      <div class="validation-list" id="validation-list"></div>
    </div>
  `;
  renderValidation(body.querySelector('#validation-list'));
  modal.classList.add('show');
}

// Close Publish Modal
function closePublishModal() {
  document.getElementById('publish-modal').classList.remove('show');
}

// Render History
function renderHistory() {
  const history = getPublishedAgents();
  const tbody = document.getElementById('history-table-body');

  tbody.innerHTML = history.map(item => `
    <tr>
      <td>${item.publishTime}</td>
      <td><strong>${item.capabilityName}</strong></td>
      <td>v${item.version}</td>
      <td><span class="result-badge result-${item.result === '成功' ? 'success' : 'failed'}">${item.result}</span></td>
      <td><span class="status-badge ${item.approvalStatus === '已通过' ? 'status-published' : 'status-failed'}">${item.approvalStatus}</span></td>
      <td>
        <button class="btn-icon" onclick="viewHistoryDetail('${item.id}')" title="查看详情">
          <i class="fa-solid fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Initialize Event Listeners
function initEventListeners() {
  // Search input
  const searchInput = document.querySelector('.search-box input');
  searchInput.addEventListener('input', debounce(function() {
    const filter = document.querySelector('.filter-menu-item.active')?.dataset.filter || 'all';
    renderPendingList(filter, this.value);
  }, 300));

  // Filter dropdown
  const filterBtn = document.querySelector('.filter-btn');
  const filterMenu = document.querySelector('.filter-menu');

  filterBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    filterMenu.classList.toggle('show');
  });

  document.addEventListener('click', function() {
    filterMenu.classList.remove('show');
  });

  // Filter menu items
  document.querySelectorAll('.filter-menu-item').forEach(item => {
    item.addEventListener('click', function() {
      renderPendingList(this.dataset.filter, searchInput.value);
      filterMenu.classList.remove('show');
    });
  });

  // Drawer close
  document.querySelectorAll('.drawer-close, .drawer-overlay').forEach(el => {
    el.addEventListener('click', closeDrawers);
  });

  // Publish modal: click backdrop to close
  const publishModal = document.getElementById('publish-modal');
  publishModal.addEventListener('click', function(e) {
    if (e.target === publishModal) closePublishModal();
  });

  // Tabs: 待发布 / 发布记录 切换
  document.querySelectorAll('.publish-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const target = this.dataset.tab;
      document.querySelectorAll('.publish-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === target);
      });
      document.querySelectorAll('.publish-tab-panel').forEach(p => {
        p.classList.toggle('active', p.id === `panel-${target}`);
      });
    });
  });

  // Environment selection
  document.querySelectorAll('.env-option').forEach(option => {
    option.addEventListener('click', function() {
      this.classList.toggle('selected');
    });
  });

  // Protocol selection
  document.querySelectorAll('.protocol-option').forEach(option => {
    option.addEventListener('click', function() {
      this.classList.toggle('selected');
    });
  });
}

// Open Publish Drawer
function openPublishDrawer(id) {
  const drawer = document.getElementById('publish-drawer');
  const overlay = document.getElementById('drawer-overlay');
  currentPublishItemId = id;

  // Find the pending item
  const item = getPendingAgents().find(p => p.id === id);
  if (item) {
    // Pre-fill form with item data
    document.getElementById('publish-name').value = item.name;
    document.getElementById('publish-version').value = item.version;
  }
  // Reset release note & selections each time
  document.getElementById('publish-note').value = '';
  document.querySelectorAll('.env-option.selected, .protocol-option.selected').forEach(el => el.classList.remove('selected'));

  drawer.classList.add('show');
  overlay.classList.add('show');
}

// View Pending Detail
function viewPendingDetail(id) {
  const item = getPendingAgents().find(p => p.id === id);
  if (!item) return;

  const res = item.boundResources || {};
  const validation = item.validation || publishData.validation;
  const failedCount = VALIDATION_ITEMS.filter(v => !validation[v.key]).length;

  const content = `
    <div class="detail-section">
      <div class="detail-section-title">基本信息</div>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">能力名称</span>
          <span class="detail-value">${item.name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">能力类型</span>
          <span class="detail-value"><span class="capability-type-badge type-${item.type.toLowerCase()}">${item.type}</span></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">版本</span>
          <span class="detail-value">v${item.version}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">负责人</span>
          <span class="detail-value">${item.owner}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">计划发布时间</span>
          <span class="detail-value">${item.publishTime}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">状态</span>
          <span class="detail-value"><span class="status-badge status-pending">${item.status}</span></span>
        </div>
        <div class="detail-item detail-item-full">
          <span class="detail-label">能力简介</span>
          <span class="detail-value detail-value-text">${item.description || '-'}</span>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">绑定资源</div>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label"><i class="fa-solid fa-microchip"></i> 模型</span>
          <span class="detail-value">${res.model || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fa-solid fa-book"></i> 知识库</span>
          <span class="detail-value">${res.knowledge || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fa-solid fa-plug"></i> MCP</span>
          <span class="detail-value">${res.mcp || '-'}</span>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">
        发布就绪校验
        <span class="detail-section-summary ${failedCount === 0 ? 'is-ok' : 'is-warn'}">
          ${failedCount === 0 ? '全部通过' : `${failedCount} 项未通过`}
        </span>
      </div>
      <div class="validation-list validation-list-compact" id="pending-detail-validation"></div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">本次变更说明</div>
      <div class="detail-changelog">${item.changelog || '-'}</div>
    </div>
  `;

  showDetailDrawer('待发布详情', content, {
    label: '去审核',
    icon: 'fa-rocket',
    primary: true,
    onClick: () => {
      closeDrawers();
      setTimeout(() => approveAgent(id), 320);
    }
  });

  // 渲染该项的就绪校验状态
  const validationEl = document.getElementById('pending-detail-validation');
  if (validationEl) renderValidation(validationEl, validation);
}

// View History Detail
function viewHistoryDetail(id) {
  const item = getPublishedAgents().find(h => h.id === id);
  if (!item) return;

  const content = `
    <div class="detail-section">
      <div class="detail-section-title">发布信息</div>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">发布时间</span>
          <span class="detail-value">${item.publishTime}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">发布人</span>
          <span class="detail-value">${item.publisher}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">能力名称</span>
          <span class="detail-value">${item.capabilityName}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">版本</span>
          <span class="detail-value">v${item.version}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">发布结果</span>
          <span class="detail-value"><span class="result-badge result-${item.result === '成功' ? 'success' : 'failed'}">${item.result}</span></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">发布耗时</span>
          <span class="detail-value">${item.duration}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">审批状态</span>
          <span class="detail-value"><span class="status-badge ${item.approvalStatus === '已通过' ? 'status-published' : 'status-failed'}">${item.approvalStatus}</span></span>
        </div>
        ${item.failReason ? `
        <div class="detail-item" style="grid-column: 1 / -1;">
          <span class="detail-label">失败原因</span>
          <span class="detail-value" style="color: var(--color-danger);">${item.failReason}</span>
        </div>
        ` : ''}
      </div>
    </div>
  `;

  showDetailDrawer('发布记录详情', content);
}

// Show Detail Drawer
function showDetailDrawer(title, content) {
  const drawer = document.getElementById('detail-drawer');
  const overlay = document.getElementById('drawer-overlay');

  document.getElementById('detail-drawer-title').textContent = title;
  document.getElementById('detail-drawer-body').innerHTML = content;

  drawer.classList.add('show');
  overlay.classList.add('show');
}

// Close All Drawers
function closeDrawers() {
  document.querySelectorAll('.drawer').forEach(drawer => drawer.classList.remove('show'));
  document.querySelectorAll('.drawer-overlay').forEach(overlay => overlay.classList.remove('show'));
}

// Confirm Publish
function confirmPublish() {
  const name = document.getElementById('publish-name').value.trim();
  const version = document.getElementById('publish-version').value.trim();
  const note = document.getElementById('publish-note').value.trim();
  const selectedEnvEls = document.querySelectorAll('.env-option.selected');
  const selectedProtocolEls = document.querySelectorAll('.protocol-option.selected');

  // 1) 必填项
  if (!name || !version) {
    showToast('请填写发布名称与版本', 'error');
    return;
  }

  // 2) 版本号格式（语义化 x.y.z）
  const versionRe = /^\d+\.\d+\.\d+$/;
  if (!versionRe.test(version)) {
    showToast('版本号格式不正确，需为 x.y.z（如 1.0.0）', 'error');
    return;
  }

  // 3) 发布环境 / 开放协议
  if (selectedEnvEls.length === 0) {
    showToast('请选择发布环境', 'error');
    return;
  }
  if (selectedProtocolEls.length === 0) {
    showToast('请选择开放协议', 'error');
    return;
  }

  const selectedEnvs = Array.from(selectedEnvEls).map(el => el.textContent.trim());
  const isProduction = selectedEnvs.includes('生产');

  // 4) 读取当前能力项的就绪检查状态
  const item = getPendingAgents().find(p => p.id === currentPublishItemId);
  const validation = item?.validation || publishData.validation;

  // 4a) 硬性拦截项（模型绑定 / 权限配置）任意一项未通过则禁止发布
  const failedCritical = VALIDATION_ITEMS.filter(v => v.critical && !validation[v.key]);
  if (failedCritical.length > 0) {
    showToast(`发布前校验未通过：${failedCritical.map(v => v.label).join('、')}`, 'error');
    return;
  }

  // 4b) 生产环境强校验：6 项就绪检查必须全部通过 + 发布说明必填
  if (isProduction) {
    const failedAll = VALIDATION_ITEMS.filter(v => !validation[v.key]);
    if (failedAll.length > 0) {
      showToast(`生产环境发布需全部校验通过：${failedAll.map(v => v.label).join('、')}`, 'error');
      return;
    }
    if (!note) {
      showToast('发布至生产环境需填写发布说明', 'error');
      return;
    }
  }

  // Simulate publish
  closeDrawers();
  const envText = selectedEnvs.join(' / ');
  showToast(`已提交发布：${name} v${version} → ${envText}`, 'success');
}

// Show Toast
function showToast(message, type = 'info') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>${message}`;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 审核通过: submitted -> published, Agent 上架能力市场
function approveAgent(id) {
  const agent = AgentStore.get(id);
  if (!agent) { showToast('Agent 不存在', 'error'); return; }
  AgentStore.approveReview(agent, '林砚舟');
  showToast(`「${agent.name}」已上架到能力市场 (${agent.version})`, 'success');
  renderOverview();
  renderPendingList();
  renderHistory();
}

// 驳回: submitted -> draft
function rejectAgent(id) {
  const agent = AgentStore.get(id);
  if (!agent) { showToast('Agent 不存在', 'error'); return; }
  const reason = window.prompt('请输入驳回原因(可留空)', '') || '';
  AgentStore.rejectReview(agent, reason);
  showToast('已驳回,Agent 回到草稿', 'info');
  renderOverview();
  renderPendingList();
  renderHistory();
}

// Utility: Debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
