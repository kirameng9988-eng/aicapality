/* =====================================================
   AI Capability Open Platform - Agent 管理
   Agent = 面向特定业务岗位的智能执行主体
   数据层 + 平台目录解析 + Agent 列表页逻辑
   ===================================================== */

/* ---------- 基础常量 ---------- */
const AGENT_CATEGORIES = ['数据治理', '数据分析', '数据运营', '业务服务', '通用助手'];

const AGENT_STATUS_META = {
  draft: { label: '草稿', cls: 'draft' },
  enabled: { label: '已启用', cls: 'enabled' },
  submitted: { label: '待审核', cls: 'warning' },
  published: { label: '已上架', cls: 'published' },
  stopped: { label: '已停用', cls: 'stopped' }
};

/* 岗位分类展示（头像/图标/标签配色，不使用大面积渐变） */
const AGENT_CATEGORY_META = {
  '数据治理': { icon: 'fa-shield-halved', color: '#4F46E5' },
  '数据分析': { icon: 'fa-chart-line', color: '#0EA5E9' },
  '数据运营': { icon: 'fa-chart-pie', color: '#F59E0B' },
  '业务服务': { icon: 'fa-briefcase', color: '#10B981' },
  '通用助手': { icon: 'fa-robot', color: '#8B5CF6' }
};

/* 岗位说明 @资源类型：第一层展示的资源类别 */
const RESOURCE_TYPE_META = {
  skill: { label: 'Skill', icon: 'fa-puzzle-piece', desc: '定义任务执行方法' },
  mcp: { label: 'MCP工具', icon: 'fa-wrench', desc: '调用外部数据和业务能力' },
  knowledge: { label: '知识库', icon: 'fa-book-open', desc: '提供专业知识和业务规则' },
  agent: { label: 'Agent', icon: 'fa-robot', desc: '调用其他智能岗位' }
};

const AGENT_STORE_KEY = 'acp_agent_store';
const AGENT_RECENT_KEY = 'acp_agent_recent';
const AGENT_STORE_VERSION = 'v2';

const AGENT_DEFAULT_SETTINGS = {
  temperature: 0.3,
  maxIterations: 5,
  timeout: 120,
  autoToolCall: true,
  preserveContext: true
};

const AGENT_DEFAULT_MODEL = 'model-005'; // Qwen-Max

/* ---------- 平台目录：Skill / MCP / 知识库 / 模型 ----------
   Agent 引用平台既有能力。此处只保留“最小引用目录 + 降级回退”，
   页面渲染时优先读取对应模块的真实目录：Skill(localStorage)、
   知识库(mock-loader)、MCP/模型(mock/*.json fetch)，以保证改名后同步体现。 */

const AGENT_SKILL_FALLBACK = [
  { id: 'skl-001', name: '数据资源智能编目', code: 'data-cataloging', type: '数据治理', status: 'published' },
  { id: 'skl-002', name: '数据资源摘要生成', code: 'data-resource-summary', type: '内容生成', status: 'published' },
  { id: 'skl-003', name: '数据质量分析', code: 'data-quality-analysis', type: '数据分析', status: 'draft' },
  { id: 'skl-004', name: '数据标准检查', code: 'data-standard-check', type: '数据治理', status: 'published' }
];

const AGENT_MCP_FALLBACK = {
  servers: [
    { id: 'mcp-001', name: '数据资源MCP', desc: '提供数据资源访问、目录检索、元数据读取等能力' },
    { id: 'mcp-002', name: '数据目录MCP', desc: '提供数据血缘、质量评估等能力' },
    { id: 'mcp-003', name: '知识库MCP', desc: '提供知识检索与智能问答能力' },
    { id: 'mcp-004', name: '审批MCP', desc: '提供业务审批相关能力' },
    { id: 'mcp-005', name: '地图MCP', desc: '提供位置与路径规划能力' },
    { id: 'mcp-007', name: '企业服务MCP', desc: '提供组织与员工信息服务' },
    { id: 'mcp-008', name: '文件系统MCP', desc: '提供文件读写能力' }
  ],
  tools: [
    { id: 'tool-001', serverId: 'mcp-001', serverName: '数据资源MCP', name: 'get_data_resources', displayName: '获取数据资源列表', desc: '按条件查询可用的数据资源，返回资源列表及基本信息', status: 'active' },
    { id: 'tool-002', serverId: 'mcp-001', serverName: '数据资源MCP', name: 'get_resource_metadata', displayName: '获取资源元数据', desc: '根据资源ID获取资源的字段与元数据详情', status: 'active' },
    { id: 'tool-003', serverId: 'mcp-001', serverName: '数据资源MCP', name: 'search_data_catalog', displayName: '搜索数据目录', desc: '按关键词检索数据资产目录', status: 'active' },
    { id: 'tool-004', serverId: 'mcp-002', serverName: '数据目录MCP', name: 'get_data_lineage', displayName: '获取数据血缘', desc: '查询数据表或字段的血缘关系', status: 'active' },
    { id: 'tool-005', serverId: 'mcp-002', serverName: '数据目录MCP', name: 'assess_data_quality', displayName: '数据质量评估', desc: '对指定数据集执行多维度质量评估', status: 'active' },
    { id: 'tool-006', serverId: 'mcp-003', serverName: '知识库MCP', name: 'search_knowledge', displayName: '知识库检索', desc: '基于语义从知识库中检索相关内容', status: 'active' },
    { id: 'tool-007', serverId: 'mcp-003', serverName: '知识库MCP', name: 'rag_answer', displayName: 'RAG智能问答', desc: '结合知识库检索内容生成问答结果', status: 'active' },
    { id: 'tool-008', serverId: 'mcp-004', serverName: '审批MCP', name: 'start_approval', displayName: '发起审批', desc: '发起一条业务审批流程', status: 'active' },
    { id: 'tool-009', serverId: 'mcp-004', serverName: '审批MCP', name: 'get_approval_status', displayName: '查询审批状态', desc: '查询指定审批单的处理状态', status: 'active' },
    { id: 'tool-010', serverId: 'mcp-005', serverName: '地图MCP', name: 'get_location_info', displayName: '获取位置信息', desc: '根据关键词获取地点位置信息', status: 'active' },
    { id: 'tool-011', serverId: 'mcp-005', serverName: '地图MCP', name: 'route_planning', displayName: '路径规划', desc: '规划两地之间的出行路径', status: 'active' },
    { id: 'tool-012', serverId: 'mcp-007', serverName: '企业服务MCP', name: 'get_employee_info', displayName: '获取员工信息', desc: '查询企业内部员工档案信息', status: 'active' },
    { id: 'tool-013', serverId: 'mcp-007', serverName: '企业服务MCP', name: 'get_org_structure', displayName: '获取组织架构', desc: '查询企业组织架构与部门信息', status: 'active' },
    { id: 'tool-014', serverId: 'mcp-008', serverName: '文件系统MCP', name: 'read_file', displayName: '读取文件', desc: '按路径读取文本或表格文件内容', status: 'active' },
    { id: 'tool-015', serverId: 'mcp-008', serverName: '文件系统MCP', name: 'search_files', displayName: '搜索文件', desc: '按文件名或路径模糊搜索文件', status: 'active' }
  ]
};

const AGENT_MODEL_FALLBACK = [
  { id: 'model-001', name: 'GPT-4o', provider: 'OpenAI', type: '多模态', description: '支持文本与图像理解的多模态模型', status: 'active' },
  { id: 'model-002', name: 'GPT-4o-Mini', provider: 'OpenAI', type: '大语言模型', description: '轻量高效的通用对话模型', status: 'active' },
  { id: 'model-005', name: 'Qwen-Max', provider: '阿里百炼', type: '大语言模型', description: '通义千问旗舰模型，中文理解能力强，支持函数调用', status: 'active' },
  { id: 'model-006', name: 'Qwen-Plus', provider: '阿里百炼', type: '大语言模型', description: '通义千问高效版，推理与生成兼顾', status: 'active' },
  { id: 'model-007', name: 'ERNIE-4-Turbo', provider: '百度千帆', type: '大语言模型', description: '文心大模型旗舰版，支持工具调用', status: 'active' },
  { id: 'model-008', name: 'ERNIE-Speed', provider: '百度千帆', type: '大语言模型', description: '文心大模型高效版', status: 'active' },
  { id: 'model-009', name: 'DeepSeek-V2.5', provider: '深度求索', type: '大语言模型', description: '擅长代码与深度推理的开源大模型', status: 'active' },
  { id: 'model-010', name: 'GLM-4-Plus', provider: '智谱AI', type: '大语言模型', description: '通用对话与工具调用模型', status: 'active' },
  { id: 'model-012', name: 'k1.5', provider: '月之暗面', type: '大语言模型', description: '擅长长文本理解的模型', status: 'active' },
  { id: 'model-013', name: 'abab6.5s', provider: 'MiniMax', type: '大语言模型', description: '内容生成能力突出的对话模型', status: 'active' }
];

const AGENT_KB_FALLBACK = [
  { id: 'kb-001', name: '政企数据标准库', type: '标准规范' },
  { id: 'kb-002', name: '数据资产目录库', type: '资产目录' },
  { id: 'kb-003', name: '运营知识库', type: '运营手册' },
  { id: 'kb-004', name: 'API文档库', type: '技术文档' },
  { id: 'kb-005', name: '脱敏规则库', type: '规则配置' },
  { id: 'kb-006', name: '政策法规库', type: '政策法规' },
  { id: 'kb-007', name: '数据质量规则库', type: '规则配置' },
  { id: 'kb-008', name: '行业标准库', type: '标准规范' },
  { id: 'kb-009', name: '案例知识库', type: '运营手册' },
  { id: 'kb-010', name: '数据分类分级库', type: '规则配置' }
];

/* =====================================================
   AgentRefs - 平台目录加载与解析
   统一对外提供：skills/tools/servers/kbs/models/agents
   ===================================================== */
const AgentRefs = {
  _catalog: null,

  async loadCatalog() {
    if (this._catalog) return this._catalog;

    /* Skills：优先读 Skill 模块的 localStorage 目录（改名实时同步） */
    let skills = null;
    try {
      const raw = localStorage.getItem('acp_skill_store');
      if (raw) {
        const p = JSON.parse(raw);
        if (p && Array.isArray(p.skills) && p.skills.length) skills = p.skills;
      }
    } catch (e) { /* ignore */ }
    if (!skills) skills = AGENT_SKILL_FALLBACK;

    /* 知识库：优先 mock-loader 内嵌目录 */
    let kbs = null;
    try {
      if (typeof loadMockData === 'function') {
        const data = loadMockData('knowledge');
        if (data && Array.isArray(data.knowledgeBases)) kbs = data.knowledgeBases;
      }
    } catch (e) { /* ignore */ }
    if (!kbs) kbs = AGENT_KB_FALLBACK;

    /* MCP 服务与工具：优先 mock/mcp.json（fetch），file:// 下回退内嵌目录 */
    let tools = null;
    let servers = null;
    try {
      const res = await fetch('../../mock/mcp.json');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tools) && Array.isArray(data.servers)) {
          tools = data.tools; servers = data.servers;
        }
      }
    } catch (e) { /* ignore */ }
    if (!tools) tools = AGENT_MCP_FALLBACK.tools;
    if (!servers) servers = AGENT_MCP_FALLBACK.servers;

    /* 模型：优先 mock/model.json（fetch），file:// 下回退内嵌目录 */
    let models = null;
    try {
      const res = await fetch('../../mock/model.json');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.models)) models = data.models;
      }
    } catch (e) { /* ignore */ }
    if (!models) models = AGENT_MODEL_FALLBACK;

    /* Agents：本模块目录（自身 store） */
    const agents = AgentStore.list();

    this._catalog = { skills, tools, servers, kbs, models, agents };
    return this._catalog;
  },

  resetCache() { this._catalog = null; },

  /* 名称解析（找不到返回空） */
  skillById(cat, id) { return (cat.skills || []).find(s => s.id === id); },
  toolById(cat, id) { return (cat.tools || []).find(t => t.id === id); },
  serverById(cat, id) { return (cat.servers || []).find(s => s.id === id); },
  kbById(cat, id) { return (cat.kbs || []).find(k => k.id === id); },
  modelById(cat, id) { return (cat.models || []).find(m => m.id === id); },
  agentById(cat, id) { return (cat.agents || []).find(a => a.id === id); },

  /* Agent 行级解析：把 id 引用解析为可展示对象 */
  resolveAgent(agent, cat) {
    const skills = (agent.skills || []).map(id => this.skillById(cat, id)).filter(Boolean);
    const tools = (agent.tools || []).map(t => {
      const tool = this.toolById(cat, t.toolId);
      if (!tool) return null;
      return { serverId: tool.serverId, serverName: tool.serverName || '', toolId: tool.id, name: tool.displayName || tool.name, desc: tool.desc || tool.description || '', icon: 'fa-wrench' };
    }).filter(Boolean);
    const kbs = (agent.knowledgeBases || []).map(id => this.kbById(cat, id)).filter(Boolean);
    const agents = (agent.agents || []).map(id => this.agentById(cat, id)).filter(Boolean);
    const model = this.modelById(cat, agent.model);
    return {
      skills, tools, kbs, agents,
      model,
      modelName: model ? model.name : '—',
      skillCount: skills.length, toolCount: tools.length, kbCount: kbs.length, agentCount: agents.length
    };
  }
};

/* =====================================================
   岗位说明（自然语言）工具
   ===================================================== */

function mentionSpan(type, id, name) {
  const t = RESOURCE_TYPE_META[type];
  return `<span class="ag-mn ag-mn-${type}" contenteditable="false" data-type="${type}" data-id="${escapeHtml(id)}" data-name="${escapeHtml(name)}">${t ? '<i class="fa-solid ' + t.icon + '"></i>' : ''}@${escapeHtml(name)}</span>`;
}

/* 由 skills/tools/kbs/agents 数组生成一句“已关联能力”的引用片段 */
function mentionListHtml(agent, agentNameById) {
  const parts = [];
  const skillName = id => { const s = (AGENT_SKILL_FALLBACK.find(x => x.id === id) || {}); return s.name || id; };
  const toolName = id => { const t = (AGENT_MCP_FALLBACK.tools.find(x => x.id === id) || {}); return t.displayName || id; };
  const kbName = id => { const k = (AGENT_KB_FALLBACK.find(x => x.id === id) || {}); return k.name || id; };
  const agName = id => { const m = (agentNameById || {}); return (m && m[id]) || id; };
  (agent.skills || []).forEach(id => parts.push(mentionSpan('skill', id, skillName(id))));
  (agent.tools || []).forEach(t => parts.push(mentionSpan('mcp', t.toolId, toolName(t.toolId))));
  (agent.knowledgeBases || []).forEach(id => parts.push(mentionSpan('knowledge', id, kbName(id))));
  (agent.agents || []).forEach(id => parts.push(mentionSpan('agent', id, agName(id))));
  return parts.join(' ');
}

/* HTML → 纯文本（保留 @名称），供检索/展示 */
function htmlToText(html) {
  const wrap = document.createElement('div');
  wrap.innerHTML = html || '';

  function walk(node) {
    const text = [];
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        text.push(child.textContent.replace(/\u00a0/g, ' '));
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName ? child.tagName.toUpperCase() : '';
        if (tag === 'BR') { text.push('\n'); }
        else if (tag === 'P' || tag === 'DIV' || tag === 'LI') { text.push(walk(child) + '\n'); }
        else if (child.classList && child.classList.contains('ag-mn')) {
          text.push('@' + (child.getAttribute('data-name') || ''));
        } else { text.push(walk(child)); }
      }
    });
    return text.join('');
  }
  return walk(wrap).replace(/\n{3,}/g, '\n\n');
}


/* 从 HTML 中提取资源引用 {type,id,name}，去重保序 */
function extractMentions(html) {
  const wrap = document.createElement('div');
  wrap.innerHTML = html || '';
  const out = [];
  const seen = {};
  wrap.querySelectorAll('span.ag-mn').forEach(span => {
    const type = span.getAttribute('data-type');
    const id = span.getAttribute('data-id');
    const name = span.getAttribute('data-name') || span.textContent.replace(/^@/, '');
    if (!type || !id) return;
    const key = type + ':' + id;
    if (seen[key]) return;
    seen[key] = 1;
    out.push({ type, id, name });
  });
  return out;
}

/* 从岗位描述文本推断岗位分类（用于新建 Agent） */
function inferCategory(name, roleName, desc) {
  const text = (name || '') + ' ' + (roleName || '') + ' ' + (desc || '');
  if (/编目|目录|治理|标准|审核|规范|档案|血缘/.test(text)) return '数据治理';
  if (/分析|挖掘|统计|质量评估|报表|数据质量/.test(text)) return '数据分析';
  if (/运营|资产|产品|商机|推广/.test(text)) return '数据运营';
  if (/业务|审批|风控|客服|营销|服务|申请/.test(text)) return '业务服务';
  return '通用助手';
}

/* =====================================================
   Seed 数据：平台初始化 Agent（6 个智能岗位）
   ===================================================== */

function seedAgents() {
  const now = '2026-09-05 09:20';
  const catMeta = AGENT_CATEGORY_META;

  const a1 = {
    id: 'agt-001',
    name: '数据资源智能编目助手',
    roleName: '数据资源编目专员',
    category: '数据治理',
    description: '负责根据数据资源元数据及编目规范，完成数据资源分类、名称优化、描述生成和目录字段补全。',
    model: 'model-005',
    settings: Object.assign({}, AGENT_DEFAULT_SETTINGS, { temperature: 0.2 }),
    skills: ['skl-001', 'skl-002'],
    tools: [
      { mcpId: 'mcp-001', toolId: 'tool-001' },
      { mcpId: 'mcp-001', toolId: 'tool-002' },
      { mcpId: 'mcp-001', toolId: 'tool-003' }
    ],
    knowledgeBases: ['kb-001', 'kb-002'],
    agents: ['agt-005'],
    status: 'published',
    version: 'v1.0',
    creator: '林砚舟',
    usageCount: 1286,
    recent7d: 312,
    createdAt: '2026-08-15 10:20',
    updatedAt: now,
    _seedBlocks: {
      duties: [
        '分析数据资源元数据与字段结构，识别资源主题与业务含义；',
        '依据分类标准判断资源所属类别，输出分类编码；',
        '根据编目规范生成规范化的资源描述与标签；',
        '补全目录字段，输出符合平台数据结构的编目结果；',
        '对编目结果进行完整性检查，必要时移交人工复核。'
      ],
      rules: ['不得臆造不存在的数据内容', '无法判断时应明确说明', '输出必须符合平台规定的数据结构']
    }
  };

  const a2 = {
    id: 'agt-002',
    name: '数据质量分析助手',
    roleName: '数据质量分析专员',
    category: '数据分析',
    description: '负责对指定数据集开展完整性、准确性、一致性与时效性评估，输出质量评分与问题明细。',
    model: 'model-009',
    settings: Object.assign({}, AGENT_DEFAULT_SETTINGS, { temperature: 0.1 }),
    skills: ['skl-003'],
    tools: [
      { mcpId: 'mcp-002', toolId: 'tool-005' },
      { mcpId: 'mcp-002', toolId: 'tool-004' }
    ],
    knowledgeBases: ['kb-007', 'kb-001'],
    agents: [],
    status: 'enabled',
    version: 'v1.0',
    creator: '林砚舟',
    usageCount: 684,
    recent7d: 126,
    createdAt: '2026-08-18 16:40',
    updatedAt: now,
    _seedBlocks: {
      duties: [
        '获取目标数据集的结构、规模与抽样数据；',
        '按评估维度逐一核验完整性、准确性、一致性与时效性；',
        '对发现的问题归类，评估业务影响并给出改进建议；',
        '输出质量评分与问题明细报告。'
      ],
      rules: ['评估口径必须遵循数据质量评估规范', '异常结论需给出依据，不得臆断', '不修改被评估的原始数据']
    }
  };

  const a3 = {
    id: 'agt-003',
    name: '数据资产运营助手',
    roleName: '数据资产运营专员',
    category: '数据运营',
    description: '负责数据资产目录的日常运营，跟踪资源上架与使用情况，主动发现并推动资产增值运营。',
    model: 'model-006',
    settings: Object.assign({}, AGENT_DEFAULT_SETTINGS, { temperature: 0.4 }),
    skills: ['skl-002'],
    tools: [
      { mcpId: 'mcp-001', toolId: 'tool-003' },
      { mcpId: 'mcp-003', toolId: 'tool-006' }
    ],
    knowledgeBases: ['kb-002', 'kb-003'],
    agents: ['agt-002'],
    status: 'published',
    version: 'v1.1',
    creator: '林砚舟',
    usageCount: 523,
    recent7d: 87,
    createdAt: '2026-08-20 14:00',
    updatedAt: now,
    _seedBlocks: {
      duties: [
        '巡检数据资产目录，识别未上架、未更新与低活资源；',
        '基于资源使用情况输出资产运营周报与优化建议；',
        '协同质量分析专员定位高价值资产的治理缺口；',
        '跟进资产上架与推广，提升资源复用率。'
      ],
      rules: ['运营建议需基于真实调用数据', '对外文案不得夸大资源能力', '处理敏感数据需遵循脱敏规范']
    }
  };

  const a4 = {
    id: 'agt-004',
    name: '公共数据分析助手',
    roleName: '数据分析专员',
    category: '数据分析',
    description: '面向公共数据开放场景，帮助业务方快速理解数据资源，支持取数、统计分析与洞察解读。',
    model: 'model-005',
    settings: Object.assign({}, AGENT_DEFAULT_SETTINGS, { temperature: 0.3 }),
    skills: [],
    tools: [
      { mcpId: 'mcp-003', toolId: 'tool-007' },
      { mcpId: 'mcp-002', toolId: 'tool-004' },
      { mcpId: 'mcp-003', toolId: 'tool-006' }
    ],
    knowledgeBases: ['kb-009', 'kb-006'],
    agents: ['agt-002'],
    status: 'enabled',
    version: 'v1.0',
    creator: '林砚舟',
    usageCount: 412,
    recent7d: 96,
    createdAt: '2026-08-25 09:10',
    updatedAt: now,
    _seedBlocks: {
      duties: [
        '理解用户对数据资源的取数与分析诉求；',
        '检索知识库与数据血缘，定位可用数据与口径；',
        '开展统计分析并输出可读的分析结论；',
        '对口径不明的场景明确说明假设与局限。'
      ],
      rules: ['结论须忠于数据本身', '无法确定的口径应说明假设', '涉及个人敏感信息需先咨询合规要求']
    }
  };

  const a5 = {
    id: 'agt-005',
    name: '数据目录审核助手',
    roleName: '数据资源审核专员',
    category: '数据治理',
    description: '负责对编目结果与数据目录变更进行合规性、完整性、一致性审核，保障目录质量。',
    model: 'model-005',
    settings: Object.assign({}, AGENT_DEFAULT_SETTINGS, { temperature: 0.1 }),
    skills: ['skl-004'],
    tools: [
      { mcpId: 'mcp-001', toolId: 'tool-002' },
      { mcpId: 'mcp-001', toolId: 'tool-003' }
    ],
    knowledgeBases: ['kb-008', 'kb-001'],
    agents: [],
    status: 'published',
    version: 'v1.0',
    creator: '林砚舟',
    usageCount: 298,
    recent7d: 45,
    createdAt: '2026-08-28 11:30',
    updatedAt: now,
    _seedBlocks: {
      duties: [
        '复核编目助手的编目结果，检查分类、描述与字段是否合规；',
        '对照标准库核验目录变更是否满足规范要求；',
        '输出审核意见，对不通过项给出退回说明与修改建议；',
        '登记审核记录，形成可追溯的目录质量台账。'
      ],
      rules: ['审核依据必须来自被引用的标准文档', '不直接修改目录内容，只输出审核结论', '退回意见应具体可执行']
    }
  };

  const a6 = {
    id: 'agt-006',
    name: '数据产品运营助手',
    roleName: '数据产品运营专员',
    category: '业务服务',
    description: '面向数据产品使用者提供指引与自助服务，支撑产品答疑、使用建议与问题跟进。',
    model: 'model-006',
    settings: Object.assign({}, AGENT_DEFAULT_SETTINGS, { temperature: 0.5 }),
    skills: ['skl-002'],
    tools: [
      { mcpId: 'mcp-003', toolId: 'tool-006' },
      { mcpId: 'mcp-004', toolId: 'tool-008' },
      { mcpId: 'mcp-004', toolId: 'tool-009' }
    ],
    knowledgeBases: ['kb-003', 'kb-009'],
    agents: [],
    status: 'draft',
    version: 'v1.0',
    creator: '林砚舟',
    usageCount: 0,
    recent7d: 0,
    createdAt: '2026-09-01 15:00',
    updatedAt: '2026-09-02 10:00',
    _seedBlocks: {
      duties: [
        '解答数据产品的功能与接入问题，给出使用指引；',
        '主动收集用户反馈并归纳为产品优化建议；',
        '对需要协同处理的问题发起审批并跟踪进展。'
      ],
      rules: ['不承诺产品未开放的能力', '涉及审批需按流程提交并告知处理进度', '引用规范以运营知识库为准']
    }
  };

  const a7 = {
    id: 'agt-007',
    name: '智能问答助手',
    roleName: '智能问答专员',
    category: '通用助手',
    description: '基于知识库与检索增强,提供政务数据领域的多轮问答与溯源引用。',
    model: 'model-009',
    settings: Object.assign({}, AGENT_DEFAULT_SETTINGS, { temperature: 0.3 }),
    skills: ['skl-004'],
    tools: [],
    knowledgeBases: ['kb-001', 'kb-003'],
    agents: [],
    status: 'published',
    version: 'v1.0',
    creator: '林砚舟',
    usageCount: 98600,
    recent7d: 15200,
    rating: 4.8,
    reviews: 126,
    createdAt: '2026-08-10 09:00',
    updatedAt: '2026-09-03 09:20'
  };

  const a8 = {
    id: 'agt-008',
    name: '数据脱敏助手',
    roleName: '数据安全脱敏专员',
    category: '数据治理',
    description: '自动识别姓名、证件号、手机号等敏感字段并输出可配置的脱敏结果。',
    model: 'model-005',
    settings: Object.assign({}, AGENT_DEFAULT_SETTINGS, { temperature: 0.1 }),
    skills: [],
    tools: [],
    knowledgeBases: ['kb-001'],
    agents: [],
    status: 'published',
    version: 'v1.0',
    creator: '林砚舟',
    usageCount: 45200,
    recent7d: 6800,
    rating: 4.6,
    reviews: 63,
    createdAt: '2026-08-12 10:00',
    updatedAt: '2026-09-04 10:10'
  };

  const a9 = {
    id: 'agt-009',
    name: '报表生成助手',
    roleName: '数据分析报表专员',
    category: '数据分析',
    description: '根据自然语言指标描述自动生成数据报表、图表与解读结论。',
    model: 'model-005',
    settings: Object.assign({}, AGENT_DEFAULT_SETTINGS, { temperature: 0.4 }),
    skills: [],
    tools: [],
    knowledgeBases: ['kb-004'],
    agents: [],
    status: 'published',
    version: 'v1.0',
    creator: '林砚舟',
    usageCount: 66800,
    recent7d: 9800,
    rating: 4.7,
    reviews: 89,
    createdAt: '2026-08-14 11:00',
    updatedAt: '2026-09-05 11:15'
  };

  const a10 = {
    id: 'agt-010',
    name: '开发文档助手',
    roleName: '开发文档生成专员',
    category: '通用助手',
    description: '根据接口与代码描述生成接口文档、字段说明与调用示例。',
    model: 'model-001',
    settings: Object.assign({}, AGENT_DEFAULT_SETTINGS, { temperature: 0.3 }),
    skills: [],
    tools: [],
    knowledgeBases: [],
    agents: [],
    status: 'published',
    version: 'v1.0',
    creator: '林砚舟',
    usageCount: 21300,
    recent7d: 3200,
    rating: 4.5,
    reviews: 41,
    createdAt: '2026-08-18 14:00',
    updatedAt: '2026-09-06 14:30'
  };

  const a11 = {
    id: 'agt-011',
    name: '数据血缘分析助手',
    roleName: '数据血缘分析专员',
    category: '数据治理',
    description: '追踪数据表与字段级血缘关系,输出链路视图与影响分析。',
    model: 'model-009',
    settings: Object.assign({}, AGENT_DEFAULT_SETTINGS, { temperature: 0.2 }),
    skills: [],
    tools: [],
    knowledgeBases: [],
    agents: [],
    status: 'published',
    version: 'v1.0',
    creator: '林砚舟',
    usageCount: 8200,
    recent7d: 1100,
    rating: 4.4,
    reviews: 28,
    createdAt: '2026-08-20 15:00',
    updatedAt: '2026-09-06 15:20'
  };

  const seeds = [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11];

  /* 相互引用（Agent → Agent）的名称解析表 */
  const agentNameById = {};
  seeds.forEach(s => { agentNameById[s.id] = s.name; });

  seeds.forEach(a => {
    a.instructionsHtml = buildSeedInstructionsHtml(a, agentNameById);
    a.instructions = htmlToText(a.instructionsHtml);
    a.versions = [];
    delete a._seedBlocks;
  });

  /* 已发布 Agent 的版本快照 */
  const snap = agent => ({
    name: agent.name, roleName: agent.roleName, category: agent.category,
    description: agent.description, instructionsHtml: agent.instructionsHtml, instructions: agent.instructions,
    skills: (agent.skills || []).slice(), tools: (agent.tools || []).map(t => ({ ...t })),
    knowledgeBases: (agent.knowledgeBases || []).slice(), agents: (agent.agents || []).slice(),
    model: agent.model, settings: Object.assign({}, agent.settings)
  });
  const pub = (agent, version, note, date) => {
    agent.versions.unshift({ version, note, state: 'published', createdAt: date, creator: agent.creator, snap: snap(agent) });
    agent.publishInfo = { time: date, approver: '林砚舟', result: 'approved', note };
    agent.calls = agent.usageCount || 0;
    agent.rating = agent.rating || 4.5;
    agent.reviews = agent.reviews || 0;
    agent.protocols = agent.protocols || ['MCP', 'OpenAPI', 'SDK'];
    agent.applyMode = agent.applyMode || 'approval';
  };
  pub(seeds[0], 'v1.0', '首次发布：上线数据资源编目岗位。', '2026-08-20 09:30');
  pub(seeds[2], 'v1.0', '首次发布：上线数据资产运营岗位。', '2026-08-26 14:00');
  pub(seeds[2], 'v1.1', '新增协同质量分析专员能力，优化运营周报输出。', '2026-09-02 16:20');
  pub(seeds[4], 'v1.0', '首次发布：上线目录审核岗位。', '2026-09-01 10:00');
  pub(seeds[6], 'v1.0', '首次发布：上线智能问答岗位。', '2026-09-03 09:20');
  pub(seeds[7], 'v1.0', '首次发布：上线数据脱敏岗位。', '2026-09-04 10:10');
  pub(seeds[8], 'v1.0', '首次发布：上线报表生成岗位。', '2026-09-05 11:15');
  pub(seeds[9], 'v1.0', '首次发布：上线开发文档岗位。', '2026-09-06 14:30');
  pub(seeds[10], 'v1.0', '首次发布：上线血缘分析岗位。', '2026-09-06 15:20');

  return seeds;
}

function buildSeedInstructionsHtml(a, agentNameById) {
  const duties = (a._seedBlocks && a._seedBlocks.duties) || [];
  const rules = (a._seedBlocks && a._seedBlocks.rules) || [];
  const dutyText = duties.length
    ? '<br>' + duties.map((d, i) => (i + 1) + '. ' + escapeHtml(d)).join('<br>')
    : '';
  const ruleText = rules.length
    ? '<br><br>工作要求：<br>' + rules.map(r => '· ' + escapeHtml(r)).join('<br>')
    : '';
  return '<p>你是一名专业的「' + escapeHtml(a.roleName) + '」，为完成下述岗位职责而工作。</p>'
    + '<p>主要职责：' + dutyText + '</p>'
    + '<p>执行任务时可使用的能力与资源：' + mentionListHtml(a, agentNameById) + '</p>'
    + ruleText;
}

/* =====================================================
   AgentStore - localStorage 持久化
   ===================================================== */
const AgentStore = {
  _state: null,

  load() {
    if (this._state) return this._state;
    try {
      const raw = localStorage.getItem(AGENT_STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.agents)) {
          this._state = parsed;
          this.mergeSeedAgents();
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Agent store 读取失败，使用初始化数据');
    }
    const fresh = { version: AGENT_STORE_VERSION, agents: seedAgents() };
    this._state = fresh;
    this.save();
    return fresh;
  },

  /* 旧版本数据迁移: 保留用户已建/已改的 Agent, 只补缺失的新种子(如市场 Mock 扩充) */
  mergeSeedAgents() {
    const state = this._state;
    if (!state || !Array.isArray(state.agents)) return;
    const have = new Set(state.agents.map(a => a.id));
    const missing = seedAgents().filter(s => !have.has(s.id));
    if (!missing.length) return;
    state.agents = state.agents.concat(missing);
    state.version = AGENT_STORE_VERSION;
    this.save();
  },

  save() {
    try {
      localStorage.setItem(AGENT_STORE_KEY, JSON.stringify(this._state));
    } catch (e) {
      console.warn('Agent store 保存失败', e);
    }
  },

  list() {
    return this.load().agents;
  },

  get(id) {
    return this.list().find(a => a.id === id);
  },

  upsert(agent) {
    const state = this.load();
    const idx = state.agents.findIndex(a => a.id === agent.id);
    if (idx >= 0) state.agents[idx] = agent;
    else state.agents.unshift(agent);
    this.save();
    return agent;
  },

  remove(id) {
    const state = this.load();
    state.agents = state.agents.filter(a => a.id !== id);
    this.save();
  },

  genId() {
    return 'agt-' + String(Date.now()).slice(-8) + Math.random().toString(36).slice(2, 6);
  },

  /* 被其他 Agent 引用的检查 */
  referencedBy(id) {
    return this.list().filter(a => (a.agents || []).includes(id));
  },

  /* 复制 Agent：生成草稿副本 */
  copy(sourceId) {
    const src = this.get(sourceId);
    if (!src) return null;
    const copy = {
      id: this.genId(),
      name: src.name + '（副本）',
      roleName: src.roleName,
      category: src.category,
      description: src.description,
      instructionsHtml: src.instructionsHtml,
      instructions: src.instructions,
      model: src.model,
      settings: Object.assign({}, src.settings),
      skills: (src.skills || []).slice(),
      tools: (src.tools || []).map(t => ({ ...t })),
      knowledgeBases: (src.knowledgeBases || []).slice(),
      agents: (src.agents || []).slice(),
      status: 'draft',
      version: 'v1.0',
      creator: '林砚舟',
      usageCount: 0, recent7d: 0,
      protocols: (src.protocols || ['MCP', 'OpenAPI', 'SDK']).slice(),
      applyMode: src.applyMode || 'approval',
      calls: 0, rating: src.rating || 0, reviews: 0,
      publishInfo: null,
      versions: [],
      createdAt: fmtNow(), updatedAt: fmtNow()
    };
    this.upsert(copy);
    return copy;
  },

  /* 下一版本号：基于已发布版本次版本递增 v1.x */
  nextVersion(row) {
    const vs = (row.versions || []).map(v => v.version).filter(Boolean);
    let maxMinor = -1;
    vs.forEach(v => {
      const m = /^v(\d+)\.(\d+)$/i.exec(String(v).trim());
      if (m) maxMinor = Math.max(maxMinor, parseInt(m[2], 10));
    });
    return maxMinor >= 0 ? 'v1.' + (maxMinor + 1) : 'v1.0';
  },

  /* 提交发布审核: draft/enabled/stopped -> submitted, 生成候选版本快照 */
  submitForReview(row, note) {
    const now = fmtNow();
    const version = this.nextVersion(row);
    const rowSnap = {
      name: row.name, roleName: row.roleName, category: row.category, description: row.description,
      instructionsHtml: row.instructionsHtml, instructions: row.instructions,
      skills: (row.skills || []).slice(), tools: (row.tools || []).map(t => ({ ...t })),
      knowledgeBases: (row.knowledgeBases || []).slice(), agents: (row.agents || []).slice(),
      model: row.model, settings: Object.assign({}, row.settings)
    };
    row.versions = row.versions || [];
    row.versions.unshift({
      version, state: 'submitted', note: (note && note.trim()) || '提交发布审核。',
      createdAt: now, creator: '林砚舟', snap: rowSnap
    });
    row.version = version;
    row.status = 'submitted';
    row.publishInfo = { time: now, result: 'submitted', note: (note && note.trim()) || '' };
    row.updatedAt = now;
    this.upsert(row);
    return row;
  },

  /* 审核通过: submitted -> published, 上架市场 */
  approveReview(row, approver) {
    const now = fmtNow();
    if (!row || row.status !== 'submitted') return null;
    row.status = 'published';
    if (row.versions && row.versions[0]) row.versions[0].state = 'published';
    row.publishInfo = Object.assign({}, row.publishInfo || {}, {
      time: now, approver: approver || '林砚舟', result: 'approved'
    });
    row.updatedAt = now;
    this.upsert(row);
    return row;
  },

  /* 驳回: submitted -> draft */
  rejectReview(row, reason) {
    const now = fmtNow();
    if (!row || row.status !== 'submitted') return null;
    row.status = 'draft';
    if (row.versions && row.versions[0]) row.versions[0].state = 'rejected';
    row.publishInfo = Object.assign({}, row.publishInfo || {}, {
      time: now, result: 'rejected', reason: reason || ''
    });
    row.updatedAt = now;
    this.upsert(row);
    return row;
  },

  /* 已上架 Agent 发布新版本: 保持 published, 直接生成新版本快照 */
  publishNewVersion(row, note) {
    const now = fmtNow();
    const version = this.nextVersion(row);
    const rowSnap = {
      name: row.name, roleName: row.roleName, category: row.category, description: row.description,
      instructionsHtml: row.instructionsHtml, instructions: row.instructions,
      skills: (row.skills || []).slice(), tools: (row.tools || []).map(t => ({ ...t })),
      knowledgeBases: (row.knowledgeBases || []).slice(), agents: (row.agents || []).slice(),
      model: row.model, settings: Object.assign({}, row.settings)
    };
    row.versions = row.versions || [];
    row.versions.unshift({
      version, state: 'published', note: (note && note.trim()) || '发布新版本。',
      createdAt: now, creator: '林砚舟', snap: rowSnap
    });
    row.version = version;
    row.publishInfo = Object.assign({}, row.publishInfo || {}, {
      time: now, approver: '林砚舟', result: 'approved', note: (note && note.trim()) || ''
    });
    row.updatedAt = now;
    this.upsert(row);
    return row;
  },

  /* 回滚到指定版本 */
  rollback(row, version) {
    const item = (row.versions || []).find(v => v.version === version);
    if (!item || !item.snap) return null;
    const s = item.snap;
    row.instructionsHtml = s.instructionsHtml;
    row.instructions = s.instructions;
    row.skills = (s.skills || []).slice();
    row.tools = (s.tools || []).map(t => ({ ...t }));
    row.knowledgeBases = (s.knowledgeBases || []).slice();
    row.agents = (s.agents || []).slice();
    row.model = s.model;
    row.settings = Object.assign({}, AGENT_DEFAULT_SETTINGS, s.settings || {});
    row.status = 'draft';
    row.updatedAt = fmtNow();
    this.upsert(row);
    return row;
  },

  /* @最近引用记录 */
  addRecent(type, id, name) {
    let recents = [];
    try { recents = JSON.parse(localStorage.getItem(AGENT_RECENT_KEY)) || []; } catch (e) { recents = []; }
    recents = recents.filter(r => !(r.type === type && r.id === id));
    recents.unshift({ type, id, name, ts: Date.now() });
    if (recents.length > 12) recents = recents.slice(0, 12);
    try { localStorage.setItem(AGENT_RECENT_KEY, JSON.stringify(recents)); } catch (e) { /* ignore */ }
  },

  listRecents(type) {
    try {
      const recents = JSON.parse(localStorage.getItem(AGENT_RECENT_KEY)) || [];
      return type ? recents.filter(r => r.type === type) : recents;
    } catch (e) { return []; }
  }
};

/* =====================================================
   展示辅助
   ===================================================== */
function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return String(dateStr).slice(0, 10);
}

function fmtDateTime(dateStr) {
  if (!dateStr) return '—';
  return String(dateStr).slice(0, 16);
}

function fmtNow() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

function statusPill(status) {
  const meta = AGENT_STATUS_META[status] || { label: status, cls: 'draft' };
  return `<span class="ag-status ${meta.cls}"><span class="dot"></span>${meta.label}</span>`;
}

function categoryTag(category) {
  const meta = AGENT_CATEGORY_META[category] || { icon: 'fa-robot', color: '#8B5CF6' };
  return `<span class="ag-cat-tag" style="--cat:${meta.color}"><i class="fa-solid ${meta.icon}"></i>${escapeHtml(category)}</span>`;
}

/* 列表卡片上的能力标签：技能/工具名称（最多 3 个 + 计数） */
function agentCapabilityChips(meta) {
  const chips = [];
  meta.skills.slice(0, 2).forEach(s => chips.push({ name: s.name, cls: 'skill' }));
  meta.tools.slice(0, 1).forEach(t => chips.push({ name: t.name, cls: 'mcp' }));
  if (chips.length < 3) meta.kbs.slice(0, 1).forEach(k => chips.push({ name: k.name, cls: 'kb' }));
  const shown = chips.slice(0, 3);
  const total = meta.skillCount + meta.toolCount + meta.kbCount;
  const more = total - shown.length;
  return shown.map(c => `<span class="ag-cap-chip ${c.cls}">${escapeHtml(c.name)}</span>`).join('')
    + (more > 0 ? `<span class="ag-cap-chip more">+${more}</span>` : '');
}

/* =====================================================
   Agent 管理 列表页逻辑（卡片式）
   ===================================================== */
const AgentListPage = {
  state: { keyword: '', category: '', status: '', onlyDraft: false },
  rows: [],
  cat: null,

  async init() {
    this.rows = AgentStore.list();
    this.cat = await AgentRefs.loadCatalog();
    this.renderSummary();
    this.renderCards();
    this.bindEvents();
  },

  filtered() {
    const { keyword, category, status } = this.state;
    const kw = keyword.trim().toLowerCase();
    return this.rows.slice().filter(a => {
      if (category && a.category !== category) return false;
      if (status && a.status !== status) return false;
      if (kw) {
        const hit = (a.name + ' ' + a.roleName + ' ' + (a.description || '') + ' ' + (a.instructions || '')).toLowerCase();
        if (!hit.includes(kw)) return false;
      }
      return true;
    }).sort((x, y) => (y.updatedAt || '').localeCompare(x.updatedAt || ''));
  },

  renderSummary() {
    const list = this.filtered();
    const countEl = document.getElementById('ag-count-info');
    if (countEl) {
      const published = this.rows.filter(a => a.status === 'published').length;
      countEl.innerHTML = `共 <b>${list.length}</b> 个智能岗位${this.rows.length ? ` · ${published} 个已发布` : ''}`;
    }
    const empty = document.getElementById('ag-list-empty');
    if (empty) {
      const noData = this.rows.length === 0;
      const noHit = this.rows.length > 0 && list.length === 0;
      empty.style.display = (noData || noHit) ? '' : 'none';
      empty.querySelector('.ag-empty-title').textContent = noData ? '还没有智能岗位' : '未找到匹配的智能岗位';
      empty.querySelector('.ag-empty-desc').textContent = noData
        ? '点击「创建Agent」，定义你的第一个智能岗位。'
        : '请调整搜索关键词或筛选条件后重试。';
    }
  },

  renderCards() {
    const list = this.filtered();
    const grid = document.getElementById('agent-card-grid');
    grid.innerHTML = list.map(a => this.cardHtml(a)).join('');
    this.renderEmpty();
  },

  renderEmpty() {
    const grid = document.getElementById('agent-card-grid');
    const empty = document.getElementById('ag-list-empty');
    if (!listEmpty() && empty) empty.style.display = 'none';
    function listEmpty() { return grid.children.length === 0; }
  },

  cardHtml(a) {
    const meta = AgentRefs.resolveAgent(a, this.cat);
    const catM = AGENT_CATEGORY_META[a.category] || { icon: 'fa-robot', color: '#8B5CF6' };
    const chips = agentCapabilityChips(meta);
    const desc = escapeHtml(a.description || '');
    const moreItems = [];
    moreItems.push(`<button type="button" class="ag-more-item" onclick="AgentListPage.open('${a.id}')"><i class="fa-solid fa-window-restore"></i>打开工作台</button>`);
    if (a.status === 'stopped') {
      moreItems.push(`<button type="button" class="ag-more-item" onclick="AgentListPage.enable('${a.id}')"><i class="fa-solid fa-play"></i>启用</button>`);
    } else {
      moreItems.push(`<button type="button" class="ag-more-item" onclick="AgentListPage.stop('${a.id}')"><i class="fa-solid fa-pause"></i>停用</button>`);
    }
    moreItems.push(`<button type="button" class="ag-more-item" onclick="AgentListPage.copy('${a.id}')"><i class="fa-regular fa-copy"></i>复制</button>`);
    const refCount = AgentStore.referencedBy(a.id).length;
    moreItems.push(`<button type="button" class="ag-more-item danger" onclick="AgentListPage.del('${a.id}')" ${refCount ? 'disabled' : ''}><i class="fa-regular fa-trash-can"></i>删除</button>`);

    return `
      <div class="ag-card" data-id="${a.id}">
        <div class="ag-card-top">
          <div class="ag-avatar" style="--cat:${catM.color}"><i class="fa-solid ${catM.icon}"></i></div>
          <div class="ag-card-head">
            <div class="ag-name" title="${escapeHtml(a.name)}">${escapeHtml(a.name)}</div>
            <div class="ag-role"><i class="fa-solid fa-user-tie"></i>${escapeHtml(a.roleName || '—')}</div>
          </div>
          <div class="ag-card-status">${statusPill(a.status)}</div>
        </div>
        <div class="ag-desc">${desc || '尚未填写岗位描述。'}</div>
        <div class="ag-caps">${chips || '<span class="muted-text">暂未关联能力</span>'}</div>
        <div class="ag-card-foot">
          <span class="ag-time"><i class="fa-regular fa-clock"></i>${fmtDate(a.updatedAt)} 更新</span>
          <div class="ag-ops">
            <button type="button" class="ag-op-btn" onclick="AgentListPage.open('${a.id}')" title="进入工作台"><i class="fa-solid fa-pen"></i><span>编辑</span></button>
            <button type="button" class="ag-op-btn" onclick="AgentListPage.test('${a.id}')" title="测试"><i class="fa-solid fa-flask-vial"></i><span>测试</span></button>
            <div class="ag-more">
              <button type="button" class="ag-op-btn ag-more-btn" title="更多" onclick="event.stopPropagation();AgentListPage.toggleMore(this)"><i class="fa-solid fa-ellipsis"></i></button>
              <div class="ag-more-menu">${moreItems.join('')}</div>
            </div>
          </div>
        </div>
      </div>`;
  },

  toggleMore(btn) {
    document.querySelectorAll('.ag-more-menu.show').forEach(m => { if (m !== btn.nextElementSibling) m.classList.remove('show'); });
    const menu = btn.nextElementSibling;
    if (menu) menu.classList.toggle('show');
  },

  open(id) { window.parent.postMessage({ type: 'navigate', url: 'pages/ai-build/agent-workbench.html?id=' + encodeURIComponent(id) }, '*'); },
  test(id) { window.parent.postMessage({ type: 'navigate', url: 'pages/ai-build/agent-test.html?id=' + encodeURIComponent(id) }, '*'); },
  edit(id) { this.open(id); },

  stop(id) {
    const a = AgentStore.get(id);
    if (!a) return;
    Modal.confirm({
      title: '停用智能岗位',
      message: `停用后，「${a.name}」将不再对外提供能力。是否继续？`,
      type: 'warning',
      confirmText: '确认停用',
      onConfirm: () => {
        a.status = 'stopped';
        a.updatedAt = fmtNow();
        AgentStore.upsert(a);
        Toast.warning(`「${a.name}」已停用`);
        this.reload();
      }
    });
  },

  enable(id) {
    const a = AgentStore.get(id);
    if (!a) return;
    Modal.confirm({
      title: '启用智能岗位',
      message: `启用后，「${a.name}」将恢复可调用状态。是否继续？`,
      type: 'success',
      confirmText: '确认启用',
      onConfirm: () => {
        a.status = 'enabled';
        a.updatedAt = fmtNow();
        AgentStore.upsert(a);
        Toast.success(`「${a.name}」已启用`);
        this.reload();
      }
    });
  },

  copy(id) {
    const copied = AgentStore.copy(id);
    if (!copied) { Toast.danger('复制失败'); return; }
    Toast.success(`已生成「${copied.name}」草稿副本`);
    setTimeout(() => { window.parent.postMessage({ type: 'navigate', url: 'pages/ai-build/agent-workbench.html?id=' + encodeURIComponent(copied.id) }, '*'); }, 700);
  },

  del(id) {
    const a = AgentStore.get(id);
    if (!a) return;
    const refs = AgentStore.referencedBy(id);
    if (refs.length) {
      Modal.alert({ title: '无法删除', message: `「${a.name}」已被 ${refs.map(r => r.name).join('、')} 等智能岗位引用，请先解除引用后再删除。`, type: 'danger' });
      return;
    }
    Modal.confirm({
      title: '删除智能岗位',
      message: `确定删除「${a.name}」吗？删除后不可恢复。`,
      type: 'danger',
      confirmText: '确认删除',
      onConfirm: () => {
        AgentStore.remove(id);
        Toast.success('智能岗位已删除');
        this.reload();
      }
    });
  },

  reload() {
    this.rows = AgentStore.list();
    this.cat = null;
    const self = this;
    AgentRefs.loadCatalog().then(cat => { self.cat = cat; self.renderSummary(); self.renderCards(); });
  },

  bindEvents() {
    const keywordEl = document.getElementById('ag-search');
    const catEl = document.getElementById('ag-category-filter');
    const statusEl = document.getElementById('ag-status-filter');
    const newBtn = document.getElementById('ag-create-btn');

    if (keywordEl) {
      let t = null;
      keywordEl.addEventListener('input', e => {
        clearTimeout(t);
        t = setTimeout(() => { this.state.keyword = e.target.value; this.renderSummary(); this.renderCards(); }, 200);
      });
    }
    if (catEl) catEl.addEventListener('change', e => {
      this.state.category = e.target.value;
      if (e.target.value === '__clear') { this.state.category = ''; catEl.value = ''; }
      this.renderSummary(); this.renderCards();
    });
    if (statusEl) statusEl.addEventListener('change', e => {
      this.state.status = e.target.value;
      if (e.target.value === '__clear') { this.state.status = ''; statusEl.value = ''; }
      this.renderSummary(); this.renderCards();
    });
    if (newBtn) newBtn.addEventListener('click', () => { window.parent.postMessage({ type: 'navigate', url: 'pages/ai-build/agent-create.html' }, '*'); });

    /* 关闭卡片“更多”菜单 */
    document.addEventListener('click', e => {
      if (!e.target.closest('.ag-more')) {
        document.querySelectorAll('.ag-more-menu.show').forEach(m => m.classList.remove('show'));
      }
    });
  }
};

/* 若页面是独立打开（非 iframe），暴露到 window 便于调试/onclick */
if (typeof window !== 'undefined') {
  window.AgentStore = AgentStore;
  window.AgentRefs = AgentRefs;
  window.AgentListPage = AgentListPage;
}
