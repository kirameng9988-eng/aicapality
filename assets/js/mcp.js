/* =====================================================
   AI Capability Open Platform - MCP Hub JavaScript
   Studio Style Interactions
   ===================================================== */

// Mock Data Store
let mockData = {
  servers: [],
  tools: [],
  playground: {}
};

// Current State
let currentState = {
  selectedServer: null,
  selectedTool: null,
  currentTab: 'catalog',
  currentServerTag: 'all',
  playgroundServer: '',
  playgroundTool: '',
  playgroundParams: {},
  searchKeyword: '',
  toolPage: 1,
  toolPageSize: 12
};

// Inline Mock Data (fallback for file:// protocol)
const inlineMockData = {
  "servers": [
    {"id": "mcp-001", "name": "数据资源MCP", "description": "提供数据资源访问、数据目录检索、元数据读取等能力", "status": "active", "version": "2.1.0", "endpoint": "https://ai-platform.enterprise.com/mcp/data-resource", "protocol": "SSE", "owner": "张明", "updatedAt": "2026-06-28 10:00", "health": "healthy", "toolCount": 8, "calls": 342100, "avgLatency": 125, "onlineRate": 100, "tags": ["数据资源", "元数据", "目录检索"], "auth": {"type": "fixed", "headerKey": "X-API-Key", "headerValue": "sk-live-4a8f9c2e1b3d", "keyRotation": true, "rotationDays": 90, "tokenUrl": "", "tokenRefreshInterval": 60}},
    {"id": "mcp-002", "name": "数据目录MCP", "description": "提供数据资产目录浏览、血缘分析、质量评估等能力", "status": "active", "version": "1.8.0", "endpoint": "https://ai-platform.enterprise.com/mcp/data-catalog", "protocol": "WebSocket", "owner": "李娜", "updatedAt": "2026-06-27 16:30", "health": "healthy", "toolCount": 6, "calls": 218900, "avgLatency": 185, "onlineRate": 100, "tags": ["数据目录", "血缘分析", "质量评估"], "auth": {"type": "dynamic", "headerKey": "Authorization", "headerValue": "Bearer {token}", "keyRotation": true, "rotationDays": 30, "tokenUrl": "https://auth.enterprise.com/oauth/token", "tokenRefreshInterval": 60}},
    {"id": "mcp-003", "name": "知识库MCP", "description": "提供知识库检索、RAG增强、智能问答等能力", "status": "active", "version": "3.0.0", "endpoint": "https://ai-platform.enterprise.com/mcp/knowledge", "protocol": "SSE", "owner": "王强", "updatedAt": "2026-06-28 08:45", "health": "healthy", "toolCount": 5, "calls": 456200, "avgLatency": 220, "onlineRate": 100, "tags": ["知识库", "RAG", "智能问答"], "auth": {"type": "fixed", "headerKey": "X-API-Key", "headerValue": "sk-knowledge-7e2f4a8b1c3d", "keyRotation": false, "rotationDays": 0, "tokenUrl": "", "tokenRefreshInterval": 60}},
    {"id": "mcp-004", "name": "审批MCP", "description": "提供审批流程发起、状态查询、历史记录等能力", "status": "active", "version": "1.5.0", "endpoint": "https://ai-platform.enterprise.com/mcp/approval", "protocol": "SSE", "owner": "赵雪", "updatedAt": "2026-06-26 14:20", "health": "healthy", "toolCount": 4, "calls": 89200, "avgLatency": 95, "onlineRate": 100, "tags": ["审批", "流程"], "auth": {"type": "none", "headerKey": "", "headerValue": "", "keyRotation": false, "rotationDays": 0, "tokenUrl": "", "tokenRefreshInterval": 60}},
    {"id": "mcp-005", "name": "地图MCP", "description": "提供地理信息查询、路径规划、坐标转换等能力", "status": "active", "version": "1.2.0", "endpoint": "https://ai-platform.enterprise.com/mcp/map", "protocol": "WebSocket", "owner": "刘伟", "updatedAt": "2026-06-25 11:00", "health": "degraded", "toolCount": 6, "calls": 45600, "avgLatency": 350, "onlineRate": 66.7, "tags": ["地图", "地理信息", "路径规划"], "auth": {"type": "fixed", "headerKey": "X-Map-Token", "headerValue": "map-9x7k2m5n8p1q4r", "keyRotation": true, "rotationDays": 180, "tokenUrl": "", "tokenRefreshInterval": 60}},
    {"id": "mcp-006", "name": "天气MCP", "description": "提供实时天气查询、预报、预警等能力", "status": "inactive", "version": "1.0.0", "endpoint": "https://ai-platform.enterprise.com/mcp/weather", "protocol": "SSE", "owner": "陈晓燕", "updatedAt": "2026-06-20 09:30", "health": "offline", "toolCount": 5, "calls": 0, "avgLatency": 0, "onlineRate": 0, "tags": ["天气", "预报", "预警"], "auth": {"type": "none", "headerKey": "", "headerValue": "", "keyRotation": false, "rotationDays": 0, "tokenUrl": "", "tokenRefreshInterval": 60}},
    {"id": "mcp-007", "name": "企业服务MCP", "description": "提供企业信息查询、组织架构、通讯录等能力", "status": "active", "version": "2.0.0", "endpoint": "https://ai-platform.enterprise.com/mcp/enterprise", "protocol": "SSE", "owner": "张明", "updatedAt": "2026-06-28 09:00", "health": "healthy", "toolCount": 8, "calls": 123500, "avgLatency": 88, "onlineRate": 100, "tags": ["企业信息", "组织架构", "通讯录"], "auth": {"type": "dynamic", "headerKey": "X-Auth-Token", "headerValue": "eyJhbGciOiJIUzI1NiJ9.{token}", "keyRotation": true, "rotationDays": 7, "tokenUrl": "https://auth.enterprise.com/v2/token", "tokenRefreshInterval": 30}},
    {"id": "mcp-008", "name": "文件系统MCP", "description": "提供文件读取、写入、搜索等本地文件系统操作能力", "status": "active", "version": "1.6.0", "endpoint": "https://ai-platform.enterprise.com/mcp/filesystem", "protocol": "WebSocket", "owner": "刘伟", "updatedAt": "2026-06-27 17:00", "health": "healthy", "toolCount": 4, "calls": 89090, "avgLatency": 45, "onlineRate": 100, "tags": ["文件", "存储", "搜索"], "auth": {"type": "none", "headerKey": "", "headerValue": "", "keyRotation": false, "rotationDays": 0, "tokenUrl": "", "tokenRefreshInterval": 60}}
  ],
  "tools": [
    {"id": "tool-001", "skillRefCount": 6, "serverId": "mcp-001", "serverName": "数据资源MCP", "name": "get_data_resources", "displayName": "获取数据资源列表", "description": "根据条件查询可用的数据资源，返回资源列表及基本信息", "category": "数据资源", "icon": "fa-database", "inputParams": [{"name": "category", "type": "string", "required": false, "description": "资源分类"}, {"name": "tags", "type": "array", "required": false, "description": "资源标签"}, {"name": "page", "type": "integer", "required": false, "description": "页码"}], "outputSchema": "array[DataResource]", "apiConfig": {"method": "GET", "path": "/api/metadata/list", "paramMapping": [{"name": "category", "in": "query"}, {"name": "tags", "in": "query"}, {"name": "page", "in": "query"}], "responseMapping": "$.data.list", "pagination": {"totalPath": "$.data.total", "pageParam": "page", "pageSizeParam": "page_size"}}, "status": "active", "calls": 89200, "successRate": 99.95, "avgLatency": 125},
    {"id": "tool-002", "skillRefCount": 4, "serverId": "mcp-001", "serverName": "数据资源MCP", "name": "get_resource_metadata", "displayName": "获取资源元数据", "description": "根据资源ID获取详细的元数据信息，包括Schema、统计信息等", "category": "数据资源", "icon": "fa-info-circle", "inputParams": [{"name": "resource_id", "type": "string", "required": true, "description": "资源唯一标识"}], "outputSchema": "ResourceMetadata", "apiConfig": {"method": "GET", "path": "/api/metadata/{resource_id}", "paramMapping": [{"name": "resource_id", "in": "path"}], "responseMapping": "$.data", "pagination": null}, "status": "active", "calls": 65400, "successRate": 99.98, "avgLatency": 85},
    {"id": "tool-003", "skillRefCount": 8, "serverId": "mcp-001", "serverName": "数据资源MCP", "name": "search_data_catalog", "displayName": "搜索数据目录", "description": "基于关键词搜索数据目录，返回匹配的数据资产列表", "category": "数据资源", "icon": "fa-magnifying-glass", "inputParams": [{"name": "keyword", "type": "string", "required": true, "description": "搜索关键词"}, {"name": "filters", "type": "object", "required": false, "description": "筛选条件"}], "outputSchema": "array[DataAsset]", "status": "active", "calls": 187500, "successRate": 99.87, "avgLatency": 165},
    {"id": "tool-004", "skillRefCount": 5, "serverId": "mcp-002", "serverName": "数据目录MCP", "name": "get_data_lineage", "displayName": "获取数据血缘", "description": "查询指定数据表或字段的血缘关系，包括上游来源和下游去向", "category": "血缘分析", "icon": "fa-project-diagram", "inputParams": [{"name": "table_name", "type": "string", "required": true, "description": "表名称"}, {"name": "direction", "type": "enum", "required": false, "description": "血缘方向: upstream/downstream/both"}], "outputSchema": "LineageGraph", "status": "active", "calls": 45600, "successRate": 99.72, "avgLatency": 320},
    {"id": "tool-005", "skillRefCount": 4, "serverId": "mcp-002", "serverName": "数据目录MCP", "name": "assess_data_quality", "displayName": "数据质量评估", "description": "对指定数据集进行质量评估，返回完整性、一致性、准确性等指标", "category": "质量评估", "icon": "fa-chart-pie", "inputParams": [{"name": "dataset_id", "type": "string", "required": true, "description": "数据集ID"}, {"name": "dimensions", "type": "array", "required": false, "description": "评估维度"}], "outputSchema": "QualityReport", "status": "active", "calls": 78200, "successRate": 99.65, "avgLatency": 280},
    {"id": "tool-006", "skillRefCount": 9, "serverId": "mcp-003", "serverName": "知识库MCP", "name": "search_knowledge", "displayName": "知识库检索", "description": "基于语义检索从知识库中获取相关内容，支持向量相似度匹配", "category": "知识检索", "icon": "fa-book-open", "inputParams": [{"name": "query", "type": "string", "required": true, "description": "检索query"}, {"name": "kb_ids", "type": "array", "required": false, "description": "指定知识库ID列表"}, {"name": "top_k", "type": "integer", "required": false, "description": "返回数量"}], "outputSchema": "array[KnowledgeChunk]", "status": "active", "calls": 289600, "successRate": 99.92, "avgLatency": 195},
    {"id": "tool-007", "skillRefCount": 7, "serverId": "mcp-003", "serverName": "知识库MCP", "name": "rag_answer", "displayName": "RAG智能问答", "description": "结合知识库检索和大模型生成，提供基于知识库的智能问答", "category": "智能问答", "icon": "fa-robot", "inputParams": [{"name": "question", "type": "string", "required": true, "description": "问题"}, {"name": "kb_ids", "type": "array", "required": false, "description": "知识库ID列表"}, {"name": "model", "type": "string", "required": false, "description": "指定模型"}], "outputSchema": "RAGResponse", "status": "active", "calls": 156800, "successRate": 99.78, "avgLatency": 850},
    {"id": "tool-008", "skillRefCount": 3, "serverId": "mcp-004", "serverName": "审批MCP", "name": "start_approval", "displayName": "发起审批", "description": "创建新的审批流程实例，返回审批单号和当前状态", "category": "审批流程", "icon": "fa-paper-plane", "inputParams": [{"name": "template_id", "type": "string", "required": true, "description": "审批模板ID"}, {"name": "payload", "type": "object", "required": true, "description": "审批数据"}], "outputSchema": "ApprovalInstance", "status": "active", "calls": 34500, "successRate": 99.95, "avgLatency": 95},
    {"id": "tool-009", "skillRefCount": 2, "serverId": "mcp-004", "serverName": "审批MCP", "name": "get_approval_status", "displayName": "查询审批状态", "description": "根据审批单号查询当前审批状态和历史记录", "category": "审批流程", "icon": "fa-clipboard-list", "inputParams": [{"name": "approval_id", "type": "string", "required": true, "description": "审批单号"}], "outputSchema": "ApprovalStatus", "status": "active", "calls": 54700, "successRate": 99.99, "avgLatency": 65},
    {"id": "tool-010", "skillRefCount": 1, "serverId": "mcp-005", "serverName": "地图MCP", "name": "get_location_info", "displayName": "获取位置信息", "description": "根据坐标或地址名称获取地理位置信息", "category": "地理信息", "icon": "fa-location-dot", "inputParams": [{"name": "location", "type": "string", "required": true, "description": "坐标或地址"}], "outputSchema": "LocationInfo", "status": "active", "calls": 12300, "successRate": 98.50, "avgLatency": 280},
    {"id": "tool-011", "skillRefCount": 2, "serverId": "mcp-005", "serverName": "地图MCP", "name": "route_planning", "displayName": "路径规划", "description": "计算两个或多个地点之间的最优路径", "category": "路径规划", "icon": "fa-route", "inputParams": [{"name": "origin", "type": "string", "required": true, "description": "起点"}, {"name": "destination", "type": "string", "required": true, "description": "终点"}, {"name": "mode", "type": "enum", "required": false, "description": "出行方式"}], "outputSchema": "RouteResult", "status": "degraded", "calls": 8900, "successRate": 95.20, "avgLatency": 450},
    {"id": "tool-012", "skillRefCount": 3, "serverId": "mcp-007", "serverName": "企业服务MCP", "name": "get_employee_info", "displayName": "获取员工信息", "description": "根据工号或姓名查询员工基本信息", "category": "企业信息", "icon": "fa-user", "inputParams": [{"name": "employee_id", "type": "string", "required": false, "description": "员工工号"}, {"name": "name", "type": "string", "required": false, "description": "员工姓名"}], "outputSchema": "EmployeeInfo", "status": "active", "calls": 67800, "successRate": 99.98, "avgLatency": 55},
    {"id": "tool-013", "skillRefCount": 2, "serverId": "mcp-007", "serverName": "企业服务MCP", "name": "get_org_structure", "displayName": "获取组织架构", "description": "获取公司或指定部门的组织架构信息", "category": "组织架构", "icon": "fa-sitemap", "inputParams": [{"name": "dept_id", "type": "string", "required": false, "description": "部门ID"}], "outputSchema": "OrgStructure", "status": "active", "calls": 34500, "successRate": 99.99, "avgLatency": 78},
    {"id": "tool-014", "skillRefCount": 1, "serverId": "mcp-008", "serverName": "文件系统MCP", "name": "read_file", "displayName": "读取文件", "description": "读取指定路径的文件内容", "category": "文件操作", "icon": "fa-file-lines", "inputParams": [{"name": "path", "type": "string", "required": true, "description": "文件路径"}], "outputSchema": "FileContent", "status": "active", "calls": 45600, "successRate": 99.85, "avgLatency": 42},
    {"id": "tool-015", "skillRefCount": 1, "serverId": "mcp-008", "serverName": "文件系统MCP", "name": "search_files", "displayName": "搜索文件", "description": "根据条件搜索文件系统中的文件", "category": "文件操作", "icon": "fa-magnifying-glass", "inputParams": [{"name": "pattern", "type": "string", "required": true, "description": "搜索模式"}, {"name": "path", "type": "string", "required": false, "description": "搜索目录"}], "outputSchema": "array[FileInfo]", "status": "active", "calls": 23400, "successRate": 99.90, "avgLatency": 68}
  ],
  "playground": {
    "selectedServer": "mcp-001",
    "selectedTool": "tool-001",
    "inputParams": {"category": "sales", "tags": ["重要", "一手"], "page": 1},
    "response": {"success": true, "result": [{"resource_id": "res-001", "name": "销售主题库", "category": "sales", "tags": ["重要", "一手", "日报"], "owner": "销售部", "size": "2.3GB", "record_count": 1250000, "updated_at": "2026-06-28"}, {"resource_id": "res-002", "name": "客户主数据", "category": "sales", "tags": ["重要", "一手"], "owner": "客户管理部", "size": "856MB", "record_count": 450000, "updated_at": "2026-06-27"}], "total": 2, "page": 1, "page_size": 10},
    "executionTime": 187,
    "tokens": 2840,
    "status": "success",
    "logs": [
      {"time": "10:23:45.123", "level": "info", "message": "开始执行 MCP 调用"},
      {"time": "10:23:45.125", "level": "info", "message": "选择Server: 数据资源MCP (mcp-001)"},
      {"time": "10:23:45.128", "level": "info", "message": "选择Tool: get_data_resources"},
      {"time": "10:23:45.234", "level": "info", "message": "发送请求到 https://ai-platform.enterprise.com/mcp/data-resource"},
      {"time": "10:23:45.301", "level": "success", "message": "请求成功，耗时 187ms"},
      {"time": "10:23:45.310", "level": "info", "message": "解析响应数据，返回 2 条记录"}
    ]
  }
};

// Initialize MCP Hub
async function initMCPhub() {
  try {
    const response = await fetch('../../mock/mcp.json');
    mockData = await response.json();
  } catch (error) {
    console.warn('[MCP Hub] Using inline mock data');
    mockData = inlineMockData;
  }
  renderServerCatalog();
  renderToolBrowser();
  initPlayground();
}

// Render Server Catalog
function renderServerCatalog() {
  const servers = mockData.servers || [];
  const container = document.getElementById('serverList');
  if (!container) return;

  // Get all unique tags
  const allTags = ['all', ...new Set(servers.flatMap(s => s.tags || []))];

  // Render tags dropdown
  const tagsContainer = document.getElementById('serverTagsFilter');
  const tagSelect = document.getElementById('serverTagSelect');
  if (tagsContainer && tagSelect) {
    tagSelect.innerHTML = allTags.map(tag => `
      <option value="${tag}" ${tag === currentState.currentServerTag ? 'selected' : ''}>
        ${tag === 'all' ? '全部标签' : tag}
      </option>
    `).join('');
  }

  // Filter servers
  const filteredServers = servers.filter(server => {
    if (currentState.currentServerTag === 'all') return true;
    return server.tags && server.tags.includes(currentState.currentServerTag);
  }).filter(server => {
    if (!currentState.searchKeyword) return true;
    return server.name.toLowerCase().includes(currentState.searchKeyword.toLowerCase()) ||
           server.description.toLowerCase().includes(currentState.searchKeyword.toLowerCase());
  });

  // Render server list
  container.innerHTML = filteredServers.map(server => `
    <div class="server-item ${currentState.selectedServer === server.id ? 'active' : ''}" onclick="selectServer('${server.id}')" title="点击筛选右侧 Tools">
      <div class="server-item-icon ${server.status}">
        <i class="fa-solid fa-plug"></i>
      </div>
      <div class="server-item-info">
        <div class="server-item-name">${server.name}</div>
        <div class="server-item-meta">
          <span class="server-item-status ${server.health === 'healthy' ? 'online' : server.health === 'degraded' ? 'degraded' : 'offline'}"></span>
          <span>v${server.version}</span>
          <span>·</span>
          <span>${server.protocol}</span>
        </div>
      </div>
      <span class="server-item-tools">${server.toolCount} Tools</span>
      <button class="server-item-detail-btn" onclick="event.stopPropagation(); showServerDetail('${server.id}')" title="查看详情">
        <i class="fa-solid fa-eye"></i>
      </button>
    </div>
  `).join('');

  // Update tool browser title
  const toolBrowserTitle = document.getElementById('toolBrowserTitle');
  if (toolBrowserTitle) {
    if (currentState.selectedServer) {
      const selectedServerData = servers.find(s => s.id === currentState.selectedServer);
      toolBrowserTitle.textContent = selectedServerData ? selectedServerData.name : '请选择 Server';
    } else {
      toolBrowserTitle.textContent = '全部 Tools';
    }
  }
}

// Render Tool Browser
function renderToolBrowser() {
  const tools = mockData.tools || [];
  const container = document.getElementById('toolGrid');
  const paginationEl = document.getElementById('toolPagination');
  if (!container) return;

  // Filter tools by selected server
  const filteredTools = currentState.selectedServer
    ? tools.filter(t => t.serverId === currentState.selectedServer)
    : tools;

  if (filteredTools.length === 0) {
    container.innerHTML = `
      <div class="mcp-empty-state">
        <div class="mcp-empty-state-icon">
          <i class="fa-solid fa-toolbox"></i>
        </div>
        <div class="mcp-empty-state-title">暂无 Tools</div>
        <div class="mcp-empty-state-desc">请选择一个 MCP Server 查看其提供的 Tools</div>
      </div>
    `;
    if (paginationEl) paginationEl.innerHTML = '';
    return;
  }

  // Pagination slice
  const pageSize = currentState.toolPageSize || 12;
  const totalPages = Math.ceil(filteredTools.length / pageSize);
  if (currentState.toolPage > totalPages) currentState.toolPage = 1;
  const currentPage = currentState.toolPage;
  const pageStart = (currentPage - 1) * pageSize;
  const pageTools = filteredTools.slice(pageStart, pageStart + pageSize);

  container.innerHTML = pageTools.map(tool => `
    <div class="tool-card" onclick="showToolDetail('${tool.id}')">
      <div class="tool-card-header">
        <div class="tool-card-icon ${getToolIconClass(tool.category)}">
          <i class="fa-solid ${tool.icon || 'fa-toolbox'}"></i>
        </div>
        <div class="tool-card-info">
          <div class="tool-card-name">${tool.displayName}</div>
          <div class="tool-card-category">${tool.category}</div>
        </div>
        <div class="tool-card-badges">
          ${tool.apiConfig ? '<span class="tool-card-rest-badge" title="由 RESTful API 适配而来">REST</span>' : ''}
          <span class="tool-card-status ${tool.status}">
            <span class="tool-card-status-dot"></span>
            ${tool.status === 'active' ? '在线' : tool.status === 'degraded' ? '降级' : '离线'}
          </span>
        </div>
      </div>
      <div class="tool-card-desc">${tool.description}</div>
      <div class="tool-card-params">
        <div class="tool-card-params-title">输入参数</div>
        <div class="tool-card-params-list">
          ${tool.inputParams.slice(0, 4).map(p => `
            <span class="tool-card-param ${p.required ? 'required' : ''}">${p.name}: ${p.type}</span>
          `).join('')}
          ${tool.inputParams.length > 4 ? `<span class="tool-card-param">+${tool.inputParams.length - 4}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  // Render pagination
  if (paginationEl) {
    renderToolPagination(paginationEl, currentPage, totalPages, filteredTools.length);
  }
}

// Render tool list pagination controls
function renderToolPagination(el, currentPage, totalPages, totalItems) {
  if (totalPages <= 1) {
    el.innerHTML = `<span class="pagination-info">共 ${totalItems} 个 Tools</span>`;
    return;
  }

  // Build page number list with ellipsis folding
  const pages = [];
  const add = p => pages.push(p);
  const windowSize = 1;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= currentPage - windowSize && p <= currentPage + windowSize)) {
      add(p);
    } else if (pages[pages.length - 1] !== '...') {
      add('...');
    }
  }

  const items = pages.map(p => {
    if (p === '...') return '<span class="pagination-ellipsis">…</span>';
    return `<button class="pagination-item ${p === currentPage ? 'active' : ''}" onclick="changeToolPage(${p})">${p}</button>`;
  }).join('');

  el.innerHTML = `
    <span class="pagination-info">共 ${totalItems} 个 Tools，第 ${currentPage}/${totalPages} 页</span>
    <button class="pagination-item" ${currentPage === 1 ? 'disabled' : ''} onclick="changeToolPage(${currentPage - 1})">
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    ${items}
    <button class="pagination-item" ${currentPage === totalPages ? 'disabled' : ''} onclick="changeToolPage(${currentPage + 1})">
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  `;
}

// Change tool list page
function changeToolPage(page) {
  const tools = mockData.tools || [];
  const filteredTools = currentState.selectedServer
    ? tools.filter(t => t.serverId === currentState.selectedServer)
    : tools;
  const totalPages = Math.max(1, Math.ceil(filteredTools.length / (currentState.toolPageSize || 12)));
  if (page < 1 || page > totalPages) return;
  currentState.toolPage = page;
  renderToolBrowser();
  // scroll tool list back to top
  const content = document.querySelector('.tool-browser-content');
  if (content) content.scrollTop = 0;
}

function getToolIconClass(category) {
  const map = {
    '数据资源': 'data',
    '血缘分析': 'catalog',
    '质量评估': 'catalog',
    '知识检索': 'knowledge',
    '智能问答': 'knowledge',
    '审批流程': 'approval',
    '地理信息': 'map',
    '路径规划': 'map',
    '企业信息': 'enterprise',
    '组织架构': 'enterprise',
    '文件操作': 'file'
  };
  return map[category] || 'data';
}

// Select Server（仅筛选右侧 Tools，不弹抽屉）
function selectServer(serverId) {
  currentState.selectedServer = serverId;
  currentState.toolPage = 1;
  renderServerCatalog();
  renderToolBrowser();
}

// Show Server Detail（仅由详情按钮触发）
function handleServerListClick(serverId) {
  selectServer(serverId);
}

// Server Tag Change
function handleServerTagChange(tag) {
  currentState.currentServerTag = tag;
  renderServerCatalog();
}

// Server Search
function handleServerSearch(keyword) {
  currentState.searchKeyword = keyword;
  renderServerCatalog();
}

// Tab Switching
function switchTab(tabName) {
  currentState.currentTab = tabName;

  // Update tab buttons
  document.querySelectorAll('.mcp-tabs .tab-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update tab content
  document.querySelectorAll('.mcp-tabs-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tabName}`);
  });
}

// Initialize Playground
function initPlayground() {
  const serverSelect = document.getElementById('playgroundServerSelect');
  const toolSelect = document.getElementById('playgroundToolSelect');

  if (serverSelect && mockData.servers) {
    serverSelect.innerHTML = mockData.servers.map(s => `
      <option value="${s.id}">${s.name}</option>
    `).join('');
    serverSelect.addEventListener('change', handlePlaygroundServerChange);
  }

  if (toolSelect && mockData.tools) {
    const filteredTools = mockData.tools.filter(t => t.serverId === mockData.servers[0]?.id);
    toolSelect.innerHTML = filteredTools.map(t => `
      <option value="${t.id}">${t.displayName}</option>
    `).join('');
    toolSelect.addEventListener('change', handlePlaygroundToolChange);
  }

  renderPlaygroundParams();
  renderPlaygroundResponse();
}

function handlePlaygroundServerChange(e) {
  const serverId = e.target.value;
  const server = mockData.servers.find(s => s.id === serverId);
  const toolSelect = document.getElementById('playgroundToolSelect');

  if (toolSelect && server) {
    const tools = mockData.tools.filter(t => t.serverId === serverId);
    toolSelect.innerHTML = tools.map(t => `
      <option value="${t.id}">${t.displayName}</option>
    `).join('');
  }

  renderPlaygroundParams();
}

function handlePlaygroundToolChange(e) {
  renderPlaygroundParams();
}

function renderPlaygroundParams() {
  const serverSelect = document.getElementById('playgroundServerSelect');
  const toolSelect = document.getElementById('playgroundToolSelect');
  const container = document.getElementById('playgroundParams');

  if (!serverSelect || !toolSelect || !container) return;

  const serverId = serverSelect.value;
  const toolId = toolSelect.value;
  const tool = mockData.tools.find(t => t.id === toolId && t.serverId === serverId);

  if (!tool) {
    container.innerHTML = '<p class="param-hint">请选择一个 Tool 查看参数</p>';
    return;
  }

  container.innerHTML = `
    <div class="param-group">
      <div class="param-label-row">
        <span class="param-label">${tool.displayName}</span>
      </div>
      <div class="param-hint" style="margin-bottom: var(--space-3);">${tool.description}</div>
    </div>
    ${tool.inputParams.map(p => `
      <div class="param-group">
        <div class="param-label-row">
          <span class="param-label">
            ${p.name}
            ${p.required ? '<span class="param-required">*</span>' : ''}
          </span>
          <span class="param-type">${p.type}</span>
        </div>
        <input type="text" class="param-input" id="param-${p.name}"
               placeholder="${p.description}"
               value="${getDefaultParamValue(p)}">
        <div class="param-hint">${p.description}</div>
      </div>
    `).join('')}
  `;
}

function getDefaultParamValue(param) {
  const playground = mockData.playground || {};
  if (param.name === 'category') return playground.inputParams?.category || '';
  if (param.name === 'tags') return (playground.inputParams?.tags || []).join(', ');
  if (param.name === 'page') return playground.inputParams?.page || 1;
  if (param.name === 'keyword') return '销售';
  if (param.name === 'query') return '什么是MCP协议？';
  if (param.name === 'question') return 'MCP协议有哪些优势？';
  if (param.name === 'table_name') return 'dim_product';
  if (param.name === 'dataset_id') return 'ds-001';
  if (param.name === 'resource_id') return 'res-001';
  if (param.name === 'location') return '北京市朝阳区';
  if (param.name === 'origin') return '北京市朝阳区';
  if (param.name === 'destination') return '北京市海淀区';
  if (param.name === 'employee_id') return 'EMP-001';
  if (param.name === 'path') return '/data/reports/sales.csv';
  if (param.name === 'pattern') return '*.csv';
  if (param.name === 'template_id') return 'tpl-approval-001';
  if (param.name === 'approval_id') return 'APR-20260628001';
  return '';
}

function renderPlaygroundResponse() {
  const container = document.getElementById('playgroundResponse');
  const statsContainer = document.getElementById('playgroundResponseStats');
  const logsContainer = document.getElementById('playgroundLogs');

  if (!container) return;

  const playground = mockData.playground || {};

  // Render stats
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="response-stat">
        <div class="response-stat-icon time">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div class="response-stat-info">
          <div class="response-stat-value">${playground.executionTime}ms</div>
          <div class="response-stat-label">耗时</div>
        </div>
      </div>
      <div class="response-stat">
        <div class="response-stat-icon tokens">
          <i class="fa-solid fa-hashtag"></i>
        </div>
        <div class="response-stat-info">
          <div class="response-stat-value">${formatNumber(playground.tokens)}</div>
          <div class="response-stat-label">Token</div>
        </div>
      </div>
      <div class="response-stat">
        <div class="response-stat-icon status">
          <i class="fa-solid fa-check-circle"></i>
        </div>
        <div class="response-stat-info">
          <div class="response-stat-value">${playground.status === 'success' ? '成功' : '失败'}</div>
          <div class="response-stat-label">状态</div>
        </div>
      </div>
      <div class="response-stat">
        <div class="response-stat-icon cost">
          <i class="fa-solid fa-coins"></i>
        </div>
        <div class="response-stat-info">
          <div class="response-stat-value">${(playground.tokens * 0.001).toFixed(4)}</div>
          <div class="response-stat-label">预估成本</div>
        </div>
      </div>
    `;
  }

  // Render result
  container.innerHTML = `
    <pre class="playground-response-result">${JSON.stringify(playground.response?.result || [], null, 2)}</pre>
  `;

  // Render logs
  if (logsContainer) {
    logsContainer.innerHTML = (playground.logs || []).map(log => `
      <div class="log-entry">
        <span class="log-time">${log.time}</span>
        <span class="log-level ${log.level}">${log.level.toUpperCase()}</span>
        <span class="log-message">${log.message}</span>
      </div>
    `).join('');
  }
}

// Execute Playground
function executePlayground() {
  // Simulate execution
  const runBtn = document.getElementById('playgroundRunBtn');
  if (runBtn) {
    runBtn.disabled = true;
    runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 执行中...';
  }

  setTimeout(() => {
    if (runBtn) {
      runBtn.disabled = false;
      runBtn.innerHTML = '<i class="fa-solid fa-play"></i> 执行';
    }
    showToast('MCP 调用执行成功', 'success');
  }, 1500);
}

// Show Tool Detail (Drawer)
function showToolDetail(toolId) {
  const tool = mockData.tools.find(t => t.id === toolId);
  if (!tool) return;

  currentState.selectedTool = toolId;

  const container = document.getElementById('toolDetailContent');
  if (!container) return;

  container.innerHTML = `
    <div class="mcp-detail-header">
      <div class="mcp-detail-icon">
        <i class="fa-solid ${tool.icon || 'fa-toolbox'}"></i>
      </div>
      <div class="mcp-detail-info">
        <div class="mcp-detail-name">${tool.displayName}</div>
        <div class="mcp-detail-desc">${tool.description}</div>
        <div class="mcp-detail-badges">
          <span class="badge badge-primary">${tool.category}</span>
          <span class="badge badge-${tool.status === 'active' ? 'success' : tool.status === 'degraded' ? 'warning' : 'default'}">${tool.status === 'active' ? '在线' : tool.status === 'degraded' ? '降级' : '离线'}</span>
          <span class="badge badge-default">${tool.serverName}</span>
          ${tool.skillRefCount ? `<span class="badge badge-info"><i class="fa-solid fa-layer-group"></i> 被 ${tool.skillRefCount} 个 Skill 引用</span>` : ''}
        </div>
      </div>
    </div>
    <div class="mcp-detail-stats" style="padding: var(--space-5) var(--space-6); border-bottom: 1px solid var(--color-border);">
      <div class="mcp-detail-stat">
        <div class="mcp-detail-stat-value">${formatNumber(tool.calls)}</div>
        <div class="mcp-detail-stat-label">总调用</div>
      </div>
      <div class="mcp-detail-stat">
        <div class="mcp-detail-stat-value">${tool.successRate}%</div>
        <div class="mcp-detail-stat-label">成功率</div>
      </div>
      <div class="mcp-detail-stat">
        <div class="mcp-detail-stat-value">${tool.avgLatency}ms</div>
        <div class="mcp-detail-stat-label">平均耗时</div>
      </div>
      <div class="mcp-detail-stat">
        <div class="mcp-detail-stat-value">${tool.inputParams.length}</div>
        <div class="mcp-detail-stat-label">输入参数</div>
      </div>
    </div>
    <div class="mcp-detail-section">
      <div class="mcp-detail-section-title">
        <i class="fa-solid fa-arrow-right"></i> 输入参数
      </div>
      <div class="mcp-tools-list">
        ${tool.inputParams.map(p => `
          <div class="mcp-tool-item">
            <div class="mcp-tool-item-icon" style="background: ${p.required ? 'var(--color-warning-light)' : 'var(--color-bg-alt)'}; color: ${p.required ? 'var(--color-warning)' : 'var(--color-text-muted)'};">
              <i class="fa-solid ${p.required ? 'fa-asterisk' : 'fa-minus'}"></i>
            </div>
            <div class="mcp-tool-item-name">
              <strong>${p.name}</strong>
              <span style="color: var(--color-text-muted); margin-left: var(--space-2);">(${p.type})</span>
            </div>
          </div>
          <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-left: 44px; margin-bottom: var(--space-3);">${p.description}</div>
        `).join('')}
      </div>
    </div>
    <div class="mcp-detail-section">
      <div class="mcp-detail-section-title">
        <i class="fa-solid fa-arrow-left"></i> 输出 Schema
      </div>
      <div style="background: var(--color-bg); padding: var(--space-3); border-radius: var(--radius-md); font-family: var(--font-family-mono); font-size: var(--font-size-sm);">
        ${tool.outputSchema}
      </div>
    </div>
    ${renderToolApiConfigSection(tool)}
  `;

  openDrawer('toolDetailDrawer');
}

// Render API adapter config section in tool detail
function renderToolApiConfigSection(tool) {
  const api = tool.apiConfig;
  if (!api) {
    return `
      <div class="mcp-detail-section">
        <div class="mcp-detail-section-title">
          <i class="fa-solid fa-link"></i> API 适配
        </div>
        <div style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
          该 Tool 未绑定 RESTful API（仅 schema 定义）。
        </div>
      </div>
    `;
  }

  const methodColor = api.method === 'GET' ? 'var(--color-info)' : api.method === 'POST' ? 'var(--color-success)' : api.method === 'DELETE' ? 'var(--color-danger, #EF4444)' : 'var(--color-warning)';
  const paramRows = (api.paramMapping || []).map(p => `
    <tr>
      <td style="padding: 4px 8px; border-bottom: 1px solid var(--color-border);"><code>${p.name}</code></td>
      <td style="padding: 4px 8px; border-bottom: 1px solid var(--color-border);"><span class="badge badge-default">${p.in}</span></td>
    </tr>
  `).join('');

  return `
    <div class="mcp-detail-section">
      <div class="mcp-detail-section-title">
        <i class="fa-solid fa-link"></i> API 适配配置
      </div>
      <div style="display: flex; flex-direction: column; gap: var(--space-2); font-size: var(--font-size-sm);">
        <div>
          <span style="color: var(--color-text-muted);">请求：</span>
          <span class="badge" style="background: ${methodColor}; color: white; margin-right: 6px;">${api.method}</span>
          <code style="background: var(--color-bg); padding: 2px 6px; border-radius: var(--radius-md);">${api.path}</code>
        </div>
        <div>
          <span style="color: var(--color-text-muted);">响应映射：</span>
          <code style="background: var(--color-bg); padding: 2px 6px; border-radius: var(--radius-md);">${api.responseMapping || '—'}</code>
        </div>
        ${(api.paramMapping || []).length ? `
        <div>
          <div style="color: var(--color-text-muted); margin-bottom: 4px;">参数映射：</div>
          <table style="width: 100%; border-collapse: collapse; background: var(--color-bg); border-radius: var(--radius-md); overflow: hidden;">
            <thead>
              <tr style="background: var(--color-bg-alt);">
                <th style="padding: 4px 8px; text-align: left; font-weight: var(--font-weight-medium);">参数</th>
                <th style="padding: 4px 8px; text-align: left; font-weight: var(--font-weight-medium);">位置</th>
              </tr>
            </thead>
            <tbody>${paramRows}</tbody>
          </table>
        </div>` : ''}
        ${api.pagination ? `
        <div>
          <span style="color: var(--color-text-muted);">分页：</span>
          <code style="background: var(--color-bg); padding: 2px 6px; border-radius: var(--radius-md);">${JSON.stringify(api.pagination)}</code>
        </div>` : ''}
      </div>
    </div>
  `;
}

// Show Server Detail
function showServerDetail(serverId) {
  const server = mockData.servers.find(s => s.id === serverId);
  const tools = mockData.tools.filter(t => t.serverId === serverId);
  if (!server) return;

  const container = document.getElementById('serverDetailContent');
  if (!container) return;

  container.innerHTML = `
    <div class="mcp-detail-header">
      <div class="mcp-detail-icon">
        <i class="fa-solid fa-plug"></i>
      </div>
      <div class="mcp-detail-info">
        <div class="mcp-detail-name">${server.name}</div>
        <div class="mcp-detail-desc">${server.description}</div>
        <div class="mcp-detail-badges">
          <span class="badge badge-${server.health === 'healthy' ? 'success' : server.health === 'degraded' ? 'warning' : 'default'}">${server.health === 'healthy' ? '健康' : server.health === 'degraded' ? '降级' : '离线'}</span>
          <span class="badge badge-primary">v${server.version}</span>
          <span class="badge badge-info">${server.protocol}</span>
        </div>
      </div>
    </div>
    <div class="mcp-detail-stats" style="padding: var(--space-5) var(--space-6); border-bottom: 1px solid var(--color-border);">
      <div class="mcp-detail-stat">
        <div class="mcp-detail-stat-value">${formatNumber(server.calls)}</div>
        <div class="mcp-detail-stat-label">总调用</div>
      </div>
      <div class="mcp-detail-stat">
        <div class="mcp-detail-stat-value">${server.avgLatency}ms</div>
        <div class="mcp-detail-stat-label">平均耗时</div>
      </div>
      <div class="mcp-detail-stat">
        <div class="mcp-detail-stat-value">${server.onlineRate}%</div>
        <div class="mcp-detail-stat-label">在线率</div>
      </div>
      <div class="mcp-detail-stat">
        <div class="mcp-detail-stat-value">${server.toolCount}</div>
        <div class="mcp-detail-stat-label">Tools</div>
      </div>
    </div>
    <div class="mcp-detail-section">
      <div class="mcp-detail-section-title">
        <i class="fa-solid fa-info-circle"></i> 基本信息
      </div>
      <div class="mcp-info-grid">
        <div class="mcp-info-item">
          <div class="mcp-info-label">Server ID</div>
          <div class="mcp-info-value">${server.id}</div>
        </div>
        <div class="mcp-info-item">
          <div class="mcp-info-label">协议</div>
          <div class="mcp-info-value">${server.protocol}</div>
        </div>
        <div class="mcp-info-item">
          <div class="mcp-info-label">端点</div>
          <div class="mcp-info-value">${server.endpoint}</div>
        </div>
        <div class="mcp-info-item">
          <div class="mcp-info-label">负责人</div>
          <div class="mcp-info-value">${server.owner}</div>
        </div>
        <div class="mcp-info-item">
          <div class="mcp-info-label">更新时间</div>
          <div class="mcp-info-value">${server.updatedAt}</div>
        </div>
        <div class="mcp-info-item">
          <div class="mcp-info-label">标签</div>
          <div class="mcp-info-value">${server.tags?.join(', ') || '-'}</div>
        </div>
      </div>
    </div>
    <div class="mcp-detail-section">
      <div class="mcp-detail-section-title">
        <i class="fa-solid fa-shield-halved"></i> 鉴权配置
      </div>
      <div class="mcp-info-grid" id="serverAuthInfo">
        <!-- Rendered by JS -->
      </div>
    </div>
    <div class="mcp-detail-section">
      <div class="mcp-detail-section-title">
        <i class="fa-solid fa-toolbox"></i> 提供的 Tools (${tools.length})
      </div>
      <div class="mcp-tools-list">
        ${tools.slice(0, 8).map(tool => `
          <div class="mcp-tool-item">
            <div class="mcp-tool-item-icon" style="background: var(--color-primary-light); color: var(--color-primary);">
              <i class="fa-solid ${tool.icon || 'fa-toolbox'}"></i>
            </div>
            <div class="mcp-tool-item-name">${tool.displayName}</div>
            <div class="mcp-tool-item-calls">${formatNumber(tool.calls)} 调用</div>
          </div>
        `).join('')}
        ${tools.length > 8 ? `<div style="text-align: center; padding: var(--space-3); color: var(--color-text-muted); font-size: var(--font-size-sm);">还有 ${tools.length - 8} 个 Tools...</div>` : ''}
      </div>
    </div>
  `;

  // Render auth configuration
  const authInfo = document.getElementById('serverAuthInfo');
  if (authInfo && server.auth) {
    const auth = server.auth;
    let authHtml = '';

    if (auth.type === 'none') {
      authHtml = `
        <div class="mcp-info-item" style="grid-column: 1 / -1;">
          <div class="mcp-info-label">鉴权方式</div>
          <div class="mcp-info-value">
            <span class="badge badge-muted"><i class="fa-solid fa-unlock"></i> 无鉴权</span>
          </div>
        </div>
        <div class="mcp-info-item" style="grid-column: 1 / -1;">
          <div class="mcp-info-value" style="color: var(--color-text-muted);">此 Server 不需要鉴权配置</div>
        </div>
      `;
    } else if (auth.type === 'fixed') {
      authHtml = `
        <div class="mcp-info-item">
          <div class="mcp-info-label">鉴权方式</div>
          <div class="mcp-info-value">
            <span class="badge badge-primary"><i class="fa-solid fa-key"></i> 固定 API Key</span>
          </div>
        </div>
        <div class="mcp-info-item">
          <div class="mcp-info-label">Header Key</div>
          <div class="mcp-info-value">${auth.headerKey || '-'}</div>
        </div>
        <div class="mcp-info-item">
          <div class="mcp-info-label">API Key</div>
          <div class="mcp-info-value" style="font-family: var(--font-family-mono);">
            ${maskKeyValue(auth.headerValue)}
            <button class="btn btn-xs btn-secondary" onclick="copyToClipboard('${auth.headerValue}')" style="margin-left: var(--space-2);">
              <i class="fa-solid fa-copy"></i> 复制
            </button>
          </div>
        </div>
        <div class="mcp-info-item">
          <div class="mcp-info-label">Key 轮换</div>
          <div class="mcp-info-value">
            ${auth.keyRotation ? `<span class="badge badge-success">已启用</span> 每 ${auth.rotationDays} 天` : '<span class="badge badge-muted">未启用</span>'}
          </div>
        </div>
      `;
    } else if (auth.type === 'dynamic') {
      authHtml = `
        <div class="mcp-info-item">
          <div class="mcp-info-label">鉴权方式</div>
          <div class="mcp-info-value">
            <span class="badge badge-info"><i class="fa-solid fa-sync"></i> 动态 Token</span>
          </div>
        </div>
        <div class="mcp-info-item">
          <div class="mcp-info-label">Token URL</div>
          <div class="mcp-info-value">${auth.tokenUrl || '-'}</div>
        </div>
        <div class="mcp-info-item">
          <div class="mcp-info-label">Header Key</div>
          <div class="mcp-info-value">${auth.headerKey || '-'}</div>
        </div>
        <div class="mcp-info-item">
          <div class="mcp-info-label">刷新间隔</div>
          <div class="mcp-info-value">${auth.tokenRefreshInterval} 分钟</div>
        </div>
        <div class="mcp-info-item">
          <div class="mcp-info-label">Key 轮换</div>
          <div class="mcp-info-value">
            ${auth.keyRotation ? `<span class="badge badge-success">已启用</span> 每 ${auth.rotationDays} 天` : '<span class="badge badge-muted">未启用</span>'}
          </div>
        </div>
      `;
    }

    authInfo.innerHTML = authHtml;
  }

  openDrawer('serverDetailDrawer');
}

// Open/Close Drawer
function openDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  const overlay = document.getElementById('drawerOverlay');
  if (drawer && overlay) {
    overlay.classList.add('show');
    drawer.classList.add('show');
  }
}

function closeDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  const overlay = document.getElementById('drawerOverlay');
  if (drawer && overlay) {
    overlay.classList.remove('show');
    drawer.classList.remove('show');
  }
}

function closeAllDrawers() {
  document.querySelectorAll('.drawer').forEach(drawer => {
    drawer.classList.remove('show');
  });
  document.getElementById('drawerOverlay')?.classList.remove('show');
}

// Toast notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'xmark-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Format number helper
function formatNumber(num) {
  if (num == null) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// =====================================================
// Auth Configuration Helpers
// =====================================================

function handleAuthTypeChange() {
  const authType = document.getElementById('serverFormAuthType').value;
  const fixedFields = document.getElementById('authFixedFields');
  const dynamicFields = document.getElementById('authDynamicFields');

  fixedFields.style.display = authType === 'fixed' ? 'block' : 'none';
  dynamicFields.style.display = authType === 'dynamic' ? 'block' : 'none';
}

function handleKeyRotationChange() {
  const rotationEnabled = document.getElementById('serverFormKeyRotation').checked;
  document.getElementById('rotationDaysGroup').style.display = rotationEnabled ? 'block' : 'none';
}

function handleDynamicKeyRotationChange() {
  const rotationEnabled = document.getElementById('serverFormDynamicKeyRotation').checked;
  document.getElementById('dynamicRotationDaysGroup').style.display = rotationEnabled ? 'block' : 'none';
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const btn = input.nextElementSibling;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
  }
}

function maskKeyValue(value) {
  if (!value || value.length < 8) return '****';
  return '****-' + value.slice(-4);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('已复制到剪贴板', 'success');
  }).catch(() => {
    showToast('复制失败', 'error');
  });
}

// =====================================================
// Server CRUD Operations
// =====================================================

function openServerForm(serverId = null) {
  const modal = document.getElementById('serverFormModal');
  const title = document.getElementById('serverFormTitle');
  const form = document.getElementById('serverForm');

  form.reset();

  if (serverId) {
    // Edit mode
    const server = mockData.servers.find(s => s.id === serverId);
    if (!server) return;

    title.textContent = '编辑 Server';
    document.getElementById('serverFormId').value = server.id;
    document.getElementById('serverFormName').value = server.name;
    document.getElementById('serverFormVersion').value = server.version;
    document.getElementById('serverFormDescription').value = server.description || '';
    document.getElementById('serverFormEndpoint').value = server.endpoint;
    document.getElementById('serverFormProtocol').value = server.protocol;
    document.getElementById('serverFormOwner').value = server.owner;
    document.getElementById('serverFormTags').value = (server.tags || []).join(', ');

    // Load auth configuration
    const auth = server.auth || { type: 'none', headerKey: '', headerValue: '', keyRotation: false, rotationDays: 90, tokenUrl: '', tokenRefreshInterval: 60 };
    document.getElementById('serverFormAuthType').value = auth.type;
    document.getElementById('serverFormHeaderKey').value = auth.headerKey || '';
    document.getElementById('serverFormHeaderValue').value = auth.headerValue || '';
    document.getElementById('serverFormKeyRotation').checked = auth.keyRotation || false;
    document.getElementById('serverFormRotationDays').value = auth.rotationDays || 90;
    document.getElementById('serverFormTokenUrl').value = auth.tokenUrl || '';
    document.getElementById('serverFormDynamicHeaderKey').value = auth.headerKey || '';
    document.getElementById('serverFormDynamicHeaderValue').value = auth.headerValue || '';
    document.getElementById('serverFormTokenRefreshInterval').value = auth.tokenRefreshInterval || 60;
    document.getElementById('serverFormDynamicKeyRotation').checked = auth.keyRotation || false;
    document.getElementById('serverFormDynamicRotationDays').value = auth.rotationDays || 90;

    // Trigger UI updates for auth fields visibility
    handleAuthTypeChange();
    handleKeyRotationChange();
    handleDynamicKeyRotationChange();
  } else {
    // Create mode
    title.textContent = '新建 Server';
    document.getElementById('serverFormId').value = '';
    document.getElementById('serverFormAuthType').value = 'none';
    handleAuthTypeChange();
  }

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeServerForm() {
  const modal = document.getElementById('serverFormModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function saveServer() {
  const id = document.getElementById('serverFormId').value;
  const name = document.getElementById('serverFormName').value.trim();
  const version = document.getElementById('serverFormVersion').value.trim();
  const description = document.getElementById('serverFormDescription').value.trim();
  const endpoint = document.getElementById('serverFormEndpoint').value.trim();
  const protocol = document.getElementById('serverFormProtocol').value;
  const owner = document.getElementById('serverFormOwner').value.trim();
  const tagsStr = document.getElementById('serverFormTags').value.trim();
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

  // Gather auth configuration
  const authType = document.getElementById('serverFormAuthType').value;
  const auth = {
    type: authType,
    headerKey: '',
    headerValue: '',
    keyRotation: false,
    rotationDays: 0,
    tokenUrl: '',
    tokenRefreshInterval: 60
  };

  if (authType === 'fixed') {
    auth.headerKey = document.getElementById('serverFormHeaderKey').value.trim();
    auth.headerValue = document.getElementById('serverFormHeaderValue').value.trim();
    auth.keyRotation = document.getElementById('serverFormKeyRotation').checked;
    auth.rotationDays = parseInt(document.getElementById('serverFormRotationDays').value) || 90;
  } else if (authType === 'dynamic') {
    auth.tokenUrl = document.getElementById('serverFormTokenUrl').value.trim();
    auth.headerKey = document.getElementById('serverFormDynamicHeaderKey').value.trim();
    auth.headerValue = document.getElementById('serverFormDynamicHeaderValue').value.trim();
    auth.tokenRefreshInterval = parseInt(document.getElementById('serverFormTokenRefreshInterval').value) || 60;
    auth.keyRotation = document.getElementById('serverFormDynamicKeyRotation').checked;
    auth.rotationDays = parseInt(document.getElementById('serverFormDynamicRotationDays').value) || 90;
  }

  // Validation
  if (!name || !version || !endpoint || !owner) {
    showToast('请填写必填项', 'error');
    return;
  }

  if (id) {
    // Update existing
    const server = mockData.servers.find(s => s.id === id);
    if (server) {
      server.name = name;
      server.version = version;
      server.description = description;
      server.endpoint = endpoint;
      server.protocol = protocol;
      server.owner = owner;
      server.tags = tags;
      server.auth = auth;
      showToast('Server 更新成功', 'success');
    }
  } else {
    // Create new
    const newId = 'mcp-' + String(mockData.servers.length + 1).padStart(3, '0');
    const newServer = {
      id: newId,
      name,
      description,
      version,
      endpoint,
      protocol,
      owner,
      status: 'active',
      health: 'healthy',
      toolCount: 0,
      calls: 0,
      avgLatency: 0,
      onlineRate: 100,
      tags,
      auth,
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    mockData.servers.push(newServer);
    showToast('Server 创建成功', 'success');
  }

  closeServerForm();
  renderServerCatalog();
  renderToolBrowser();
  updateServerCount();
}

function deleteServer() {
  const serverId = currentState.selectedServer;
  if (!serverId) return;

  const server = mockData.servers.find(s => s.id === serverId);
  if (!server) return;

  Modal.confirm({
    title: '删除 Server',
    message: `确定要删除 "${server.name}" 吗？此操作将同时删除其所有 Tools，且不可恢复。`,
    type: 'danger',
    confirmText: '删除',
    cancelText: '取消',
    onConfirm: () => {
      // Remove server
      mockData.servers = mockData.servers.filter(s => s.id !== serverId);
      // Remove related tools
      mockData.tools = mockData.tools.filter(t => t.serverId !== serverId);

      currentState.selectedServer = null;
      closeDrawer('serverDetailDrawer');
      renderServerCatalog();
      renderToolBrowser();
      updateServerCount();
      showToast('Server 已删除', 'success');
    }
  });
}

function editCurrentServer() {
  if (currentState.selectedServer) {
    closeDrawer('serverDetailDrawer');
    openServerForm(currentState.selectedServer);
  }
}

// =====================================================
// Tool CRUD Operations
// =====================================================

function openToolForm(toolId = null) {
  const modal = document.getElementById('toolFormModal');
  const title = document.getElementById('toolFormTitle');
  const serverSelect = document.getElementById('toolFormServer');

  // Populate server dropdown
  serverSelect.innerHTML = mockData.servers.map(s =>
    `<option value="${s.id}">${s.name}</option>`
  ).join('');

  // Reset form
  document.getElementById('toolForm').reset();

  if (toolId) {
    // Edit mode
    const tool = mockData.tools.find(t => t.id === toolId);
    if (!tool) return;

    title.textContent = '编辑 Tool';
    document.getElementById('toolFormId').value = tool.id;
    document.getElementById('toolFormServer').value = tool.serverId;
    document.getElementById('toolFormName').value = tool.name;
    document.getElementById('toolFormDisplayName').value = tool.displayName;
    document.getElementById('toolFormCategory').value = tool.category;
    document.getElementById('toolFormDescription').value = tool.description || '';
    document.getElementById('toolFormOutputSchema').value = tool.outputSchema || '';

    // Render input params
    if (tool.inputParams && tool.inputParams.length > 0) {
      document.getElementById('toolFormInputParams').value = JSON.stringify(tool.inputParams, null, 2);
    }

    // Load API adapter config
    const api = tool.apiConfig || {};
    document.getElementById('toolFormMethod').value = api.method || 'GET';
    document.getElementById('toolFormPath').value = api.path || '';
    document.getElementById('toolFormParamMapping').value = api.paramMapping ? JSON.stringify(api.paramMapping, null, 2) : '';
    document.getElementById('toolFormResponseMapping').value = api.responseMapping || '';
    document.getElementById('toolFormPagination').value = api.pagination ? JSON.stringify(api.pagination, null, 2) : '';
  } else {
    // Create mode
    title.textContent = '新建 Tool';
    document.getElementById('toolFormId').value = '';

    // Pre-select current server if any
    if (currentState.selectedServer) {
      serverSelect.value = currentState.selectedServer;
    }

    // Reset API adapter fields
    document.getElementById('toolFormMethod').value = 'GET';
    document.getElementById('toolFormPath').value = '';
    document.getElementById('toolFormParamMapping').value = '';
    document.getElementById('toolFormResponseMapping').value = '';
    document.getElementById('toolFormPagination').value = '';
  }

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeToolForm() {
  const modal = document.getElementById('toolFormModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function saveTool() {
  const id = document.getElementById('toolFormId').value;
  const serverId = document.getElementById('toolFormServer').value;
  const name = document.getElementById('toolFormName').value.trim();
  const displayName = document.getElementById('toolFormDisplayName').value.trim();
  const category = document.getElementById('toolFormCategory').value;
  const description = document.getElementById('toolFormDescription').value.trim();
  const outputSchema = document.getElementById('toolFormOutputSchema').value.trim();
  const inputParamsStr = document.getElementById('toolFormInputParams').value.trim();

  // Validation
  if (!serverId || !name || !displayName || !outputSchema) {
    showToast('请填写必填项', 'error');
    return;
  }

  // Parse input params
  let inputParams = [];
  if (inputParamsStr) {
    try {
      inputParams = JSON.parse(inputParamsStr);
    } catch (e) {
      showToast('输入参数 JSON 格式错误', 'error');
      return;
    }
  }

  // Parse API adapter config
  const apiMethod = document.getElementById('toolFormMethod').value;
  const apiPath = document.getElementById('toolFormPath').value.trim();
  const paramMappingStr = document.getElementById('toolFormParamMapping').value.trim();
  const responseMapping = document.getElementById('toolFormResponseMapping').value.trim();
  const paginationStr = document.getElementById('toolFormPagination').value.trim();

  let paramMapping = [];
  if (paramMappingStr) {
    try {
      paramMapping = JSON.parse(paramMappingStr);
    } catch (e) {
      showToast('参数映射 JSON 格式错误', 'error');
      return;
    }
  }
  let pagination = null;
  if (paginationStr) {
    try {
      pagination = JSON.parse(paginationStr);
    } catch (e) {
      showToast('分页映射 JSON 格式错误', 'error');
      return;
    }
  }

  // Only attach apiConfig when a path is provided
  const apiConfig = apiPath ? {
    method: apiMethod,
    path: apiPath,
    paramMapping,
    responseMapping,
    pagination
  } : null;

  const server = mockData.servers.find(s => s.id === serverId);

  if (id) {
    // Update existing
    const tool = mockData.tools.find(t => t.id === id);
    if (tool) {
      tool.serverId = serverId;
      tool.serverName = server ? server.name : tool.serverName;
      tool.name = name;
      tool.displayName = displayName;
      tool.category = category;
      tool.description = description;
      tool.outputSchema = outputSchema;
      tool.inputParams = inputParams;
      tool.apiConfig = apiConfig;
      showToast('Tool 更新成功', 'success');
    }
  } else {
    // Create new
    const newId = 'tool-' + String(mockData.tools.length + 1).padStart(3, '0');
    const iconMap = {
      '数据资源': 'fa-database',
      '数据目录': 'fa-folder',
      '知识检索': 'fa-book-open',
      '智能问答': 'fa-robot',
      '审批流程': 'fa-paper-plane',
      '地理信息': 'fa-location-dot',
      '企业信息': 'fa-user',
      '文件操作': 'fa-file-lines',
      '其他': 'fa-toolbox'
    };
    const newTool = {
      id: newId,
      serverId,
      serverName: server ? server.name : '',
      name,
      displayName,
      description,
      category,
      icon: iconMap[category] || 'fa-toolbox',
      inputParams,
      outputSchema,
      apiConfig,
      status: 'active',
      calls: 0,
      successRate: 100,
      avgLatency: 0
    };
    mockData.tools.push(newTool);

    // Update server tool count
    if (server) {
      server.toolCount = (server.toolCount || 0) + 1;
    }

    showToast('Tool 创建成功', 'success');
  }

  closeToolForm();
  renderToolBrowser();
  renderServerCatalog();
  updateServerCount();
}

function deleteTool() {
  const toolId = currentState.selectedTool;
  if (!toolId) return;

  const tool = mockData.tools.find(t => t.id === toolId);
  if (!tool) return;

  Modal.confirm({
    title: '删除 Tool',
    message: `确定要删除 "${tool.displayName}" 吗？此操作不可恢复。`,
    type: 'danger',
    confirmText: '删除',
    cancelText: '取消',
    onConfirm: () => {
      // Remove tool
      mockData.tools = mockData.tools.filter(t => t.id !== toolId);

      // Update server tool count
      const server = mockData.servers.find(s => s.id === tool.serverId);
      if (server) {
        server.toolCount = Math.max(0, (server.toolCount || 1) - 1);
      }

      currentState.selectedTool = null;
      closeDrawer('toolDetailDrawer');
      renderToolBrowser();
      renderServerCatalog();
      updateServerCount();
      showToast('Tool 已删除', 'success');
    }
  });
}

function editCurrentTool() {
  if (currentState.selectedTool) {
    closeDrawer('toolDetailDrawer');
    openToolForm(currentState.selectedTool);
  }
}

// =====================================================
// Helper Functions
// =====================================================

function updateServerCount() {
  // Update server count in header
  const serverCountEl = document.getElementById('serverCount');
  if (serverCountEl) {
    serverCountEl.textContent = mockData.servers.length;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initMCPhub();

  // Drawer overlay click handler
  const overlay = document.getElementById('drawerOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeAllDrawers);
  }

  // Modal overlay click to close forms
  const serverFormModal = document.getElementById('serverFormModal');
  if (serverFormModal) {
    serverFormModal.addEventListener('click', e => {
      if (e.target === serverFormModal) closeServerForm();
    });
  }

  const toolFormModal = document.getElementById('toolFormModal');
  if (toolFormModal) {
    toolFormModal.addEventListener('click', e => {
      if (e.target === toolFormModal) closeToolForm();
    });
  }

  // Escape key to close modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeServerForm();
      closeToolForm();
    }
  });
});
