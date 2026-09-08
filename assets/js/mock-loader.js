/* =====================================================
   AI Capability Open Platform - Mock Data (Inline)
   All data is embedded directly — no fetch required.
   Works with file:// protocol (double-click to run).
   ===================================================== */

const MockData = {
  dashboard: {
    kpi: {
      totalCapabilities: { value: 48, trend: "up", change: 12.5 },
      activeCapabilities: { value: 42, trend: "up", change: 8.3 },
      totalCalls: { value: 128394, trend: "up", change: 23.1 },
      successRate: { value: 99.5, trend: "up", change: 0.3 }
    },
    lifecycle: [
      { stage: "建设", label: "能力建设", icon: "fa-wand-magic-sparkles", page: "pages/ai-build/capability.html", color: "blue", active: true },
      { stage: "开放", label: "能力开放", icon: "fa-door-open", page: "pages/ai-open/open.html", color: "cyan" },
      { stage: "消费", label: "能力消费", icon: "fa-cart-shopping", page: "pages/ai-open/consume.html", color: "purple" },
      { stage: "运营", label: "能力运营", icon: "fa-chart-line", page: "pages/ai-operate/monitor.html", color: "green" },
      { stage: "优化", label: "持续优化", icon: "fa-arrows-rotate", page: "pages/ai-build/prompt.html", color: "orange" }
    ],
    stats: {
      health: 99.9,
      onlineCapabilities: 42,
      successRate: 99.5,
      avgResponse: 230,
      errorRate: 0.12
    },
    trend: [
      { date: "07-09", calls: 3210 },
      { date: "07-10", calls: 3456 },
      { date: "07-11", calls: 3892 },
      { date: "07-12", calls: 3567 },
      { date: "07-13", calls: 4123 },
      { date: "07-14", calls: 3847 },
      { date: "07-15", calls: 4102 }
    ],
    trend30d: [
      2800, 2950, 3120, 3080, 3340, 3560, 3890, 3450, 3680, 3920,
      4120, 3980, 3750, 3560, 3890, 4120, 4350, 3980, 3720, 3560,
      3890, 4120, 3840, 3560, 3210, 3456, 3892, 3567, 4123, 3847
    ],
    categories: [
      { label: "数据治理", icon: "fa-database", count: 12, change: 8.3, color: "blue", page: "pages/ai-build/capability.html" },
      { label: "数据检索", icon: "fa-magnifying-glass", count: 9, change: 15.2, color: "purple", page: "pages/ai-build/capability.html" },
      { label: "运营支持", icon: "fa-headset", count: 8, change: -2.1, color: "cyan", page: "pages/ai-operate/monitor.html" },
      { label: "开发支持", icon: "fa-code", count: 11, change: 22.1, color: "green", page: "pages/ai-build/capability.html" },
      { label: "数据安全", icon: "fa-shield-halved", count: 5, change: 5.7, color: "orange", page: "pages/ai-build/capability.html" },
      { label: "分析洞察", icon: "fa-chart-pie", count: 6, change: 0, color: "gray", page: "pages/ai-build/capability.html" }
    ],
    quickAccess: [
      { label: "能力管理", icon: "fa-cube", color: "blue", page: "pages/ai-build/capability.html" },
      { label: "Prompt工程", icon: "fa-wand-magic-sparkles", color: "cyan", page: "pages/ai-build/prompt.html" },
      { label: "知识库", icon: "fa-books", color: "green", page: "pages/ai-build/knowledge.html" },
      { label: "模型管理", icon: "fa-brain", color: "orange", page: "pages/ai-build/model.html" },
      { label: "MCP服务", icon: "fa-plug", color: "blue", page: "pages/ai-build/mcp.html" },
      { label: "数据分析", icon: "fa-chart-line", color: "purple", page: "pages/ai-operate/monitor.html" },
      { label: "开放市场", icon: "fa-store", color: "cyan", page: "pages/ai-open/market.html" }
    ],
    latestCapability: [
      { id: "cap-101", name: "智能编目", category: "数据治理", owner: "张明", time: "07-15 10:23", status: "published" },
      { id: "cap-102", name: "数据血缘分析", category: "数据治理", owner: "李华", time: "07-14 16:08", status: "published" },
      { id: "cap-103", name: "异常检测", category: "数据安全", owner: "王芳", time: "07-13 14:30", status: "published" },
      { id: "cap-104", name: "文本纠错", category: "开发支持", owner: "刘强", time: "07-12 09:15", status: "draft" },
      { id: "cap-105", name: "语义搜索", category: "数据检索", owner: "陈思", time: "07-11 11:45", status: "published" }
    ],
    latestInvocation: [
      { app: "政务数据平台", capability: "智能编目", tokens: 1284, latency: 215, result: "success", time: "07-15 11:23" },
      { app: "经信局系统", capability: "找数寻源", tokens: 896, latency: 198, result: "success", time: "07-15 11:18" },
      { app: "教育局系统", capability: "数据脱敏", tokens: 564, latency: 180, result: "success", time: "07-15 11:12" },
      { app: "人社局平台", capability: "运营助手", tokens: 2340, latency: 310, result: "success", time: "07-15 11:05" },
      { app: "卫健委系统", capability: "OCR识别", tokens: 420, latency: 145, result: "fail", time: "07-15 10:58" }
    ],
    topCapabilities: [
      { rank: 1, name: "智能编目", calls: 126000, successRate: 99.8, avgTime: "215ms", tokens: "42.3万" },
      { rank: 2, name: "找数寻源", calls: 83000, successRate: 99.2, avgTime: "198ms", tokens: "28.1万" },
      { rank: 3, name: "OCR识别", calls: 52000, successRate: 98.7, avgTime: "145ms", tokens: "18.6万" },
      { rank: 4, name: "数据脱敏", calls: 45600, successRate: 99.9, avgTime: "180ms", tokens: "15.2万" },
      { rank: 5, name: "运营助手", calls: 38900, successRate: 99.5, avgTime: "310ms", tokens: "86.5万" },
      { rank: 6, name: "开发助手", calls: 28400, successRate: 99.6, avgTime: "280ms", tokens: "62.8万" },
      { rank: 7, name: "智能问答", calls: 19600, successRate: 98.9, avgTime: "220ms", tokens: "35.4万" },
      { rank: 8, name: "文本纠错", calls: 14200, successRate: 99.1, avgTime: "165ms", tokens: "8.9万" },
      { rank: 9, name: "数据对比", calls: 9800, successRate: 99.4, avgTime: "195ms", tokens: "6.2万" },
      { rank: 10, name: "报告生成", calls: 7200, successRate: 98.5, avgTime: "420ms", tokens: "24.6万" }
    ],
    announcement: {
      version: "v2.1.0",
      updates: [
        { tag: "新增", text: "新增多模态推理与智能体协同能力" },
        { tag: "优化", text: "平台响应时间降低40%" },
        { tag: "修复", text: "知识库同步稳定性问题" }
      ]
    }
  },

  capability: {
    overview: {
      totalCapabilities: 128,
      publishedCapabilities: 86,
      draftCapabilities: 32,
      deprecatedCapabilities: 10
    },
    categoryStats: [
      { type: "Prompt", label: "Prompt", icon: "fa-terminal", color: "blue", count: 42, percentage: 32.8, trend: 15, status: "active" },
      { type: "Agent", label: "Agent", icon: "fa-robot", color: "gray", count: 35, percentage: 27.3, trend: 22, status: "active" },
      { type: "Knowledge", label: "Knowledge", icon: "fa-book", color: "cyan", count: 24, percentage: 18.8, trend: 8, status: "active" },
      { type: "Model", label: "Model", icon: "fa-microchip", color: "orange", count: 15, percentage: 11.7, trend: 5, status: "active" },
      { type: "MCP", label: "MCP", icon: "fa-plug", color: "green", count: 12, percentage: 9.4, trend: 30, status: "active" }
    ],
    tableData: [
      { id: "cap-001", name: "智能编目", code: "cap-smart-catalog", type: "Agent", category: "数据治理", version: "2.1.0", owner: "张明", publishTime: "2026-06-20 10:23", calls: 28430, status: "published", updatedAt: "2026-06-28 10:30", description: "基于大模型自动对数据集进行分类、标签标注和目录编制", sourceType: "agent", sourceId: "agt-001", sourceName: "数据资源智能编目助手", sourceVersion: "v1.0" },
      { id: "cap-002", name: "找数寻源", code: "cap-data-search", type: "Agent", category: "数据检索", version: "1.8.0", owner: "李娜", publishTime: "2026-06-18 16:45", calls: 21890, status: "published", updatedAt: "2026-06-27 14:20", description: "根据自然语言描述快速定位目标数据资产及其来源", sourceType: "agent", sourceId: "agt-004", sourceName: "公共数据分析助手", sourceVersion: "v1.0" },
      { id: "cap-003", name: "运营助手", code: "cap-ops-assistant", type: "Prompt", category: "运营支持", version: "1.5.0", owner: "王强", publishTime: "2026-06-15 09:00", calls: 19240, status: "published", updatedAt: "2026-06-26 11:15", description: "辅助数据运营人员进行日常数据质量监控和问题诊断" },
      { id: "cap-004", name: "开发助手", code: "cap-dev-assistant", type: "Agent", category: "开发支持", version: "2.0.0", owner: "刘伟", publishTime: "2026-06-22 11:20", calls: 14560, status: "published", updatedAt: "2026-06-28 09:45", description: "辅助开发人员完成数据接口文档生成和示例代码编写", sourceType: "agent", sourceId: "agt-006", sourceName: "数据产品运营助手", sourceVersion: "v1.0" },
      { id: "cap-005", name: "数据脱敏", code: "cap-data-mask", type: "Knowledge", category: "数据安全", version: "1.2.0", owner: "赵雪", publishTime: "2026-06-19 14:30", calls: 9870, status: "published", updatedAt: "2026-06-25 16:00", description: "对敏感数据进行自动识别和脱敏处理" },
      { id: "cap-006", name: "数据血缘分析", code: "cap-data-lineage", type: "Agent", category: "数据治理", version: "0.9.0", owner: "张明", publishTime: "-", calls: 0, status: "draft", updatedAt: "2026-06-27 18:20", description: "自动追踪和可视化数据流转路径及依赖关系", sourceType: "agent", sourceId: "agt-002", sourceName: "数据质量分析助手", sourceVersion: "v1.0" },
      { id: "cap-007", name: "指标预测", code: "cap-metric-forecast", type: "Model", category: "数据治理", version: "1.0.0", owner: "陈晓燕", publishTime: "2026-06-10 10:00", calls: 8560, status: "published", updatedAt: "2026-06-24 15:30", description: "基于时序模型预测关键业务指标趋势" },
      { id: "cap-008", name: "异常检测", code: "cap-anomaly-detect", type: "MCP", category: "数据安全", version: "1.1.0", owner: "赵雪", publishTime: "2026-06-12 11:00", calls: 12450, status: "published", updatedAt: "2026-06-23 10:45", description: "自动识别数据流中的异常值和异常模式" },
      { id: "cap-009", name: "文档智能解析", code: "cap-doc-parse", type: "Prompt", category: "开发支持", version: "1.3.0", owner: "刘伟", publishTime: "-", calls: 0, status: "testing", updatedAt: "2026-06-26 17:00", description: "对PDF、Word等文档进行智能解析和结构化提取" },
      { id: "cap-010", name: "知识问答", code: "cap-kb-qa", type: "Knowledge", category: "运营支持", version: "2.2.0", owner: "王强", publishTime: "2026-06-05 09:30", calls: 32100, status: "published", updatedAt: "2026-06-28 08:00", description: "基于知识库的智能问答系统" },
      { id: "cap-011", name: "接口测试助手", code: "cap-api-test", type: "Agent", category: "开发支持", version: "0.8.0", owner: "刘伟", publishTime: "-", calls: 0, status: "draft", updatedAt: "2026-06-25 14:00", description: "自动化接口测试用例生成与执行", sourceType: "agent", sourceId: "agt-005", sourceName: "数据目录审核助手", sourceVersion: "v1.0" },
      { id: "cap-012", name: "法规合规检查", code: "cap-compliance", type: "Knowledge", category: "数据安全", version: "1.0.0", owner: "赵雪", publishTime: "2026-05-28 10:00", calls: 5620, status: "deprecated", updatedAt: "2026-06-15 12:00", description: "自动检查数据处理是否符合法规要求" }
    ],
    cardData: [
      { id: "cap-001", name: "智能编目", description: "基于大模型自动对数据集进行分类、标签标注和目录编制", type: "Agent", tags: ["GPT-4o", "自动编目", "政企数据"], calls: 28430, version: "2.1.0", owner: "张明", status: "published" },
      { id: "cap-002", name: "找数寻源", description: "根据自然语言描述快速定位目标数据资产及其来源", type: "Agent", tags: ["Claude", "语义检索", "数据定位"], calls: 21890, version: "1.8.0", owner: "李娜", status: "published" },
      { id: "cap-003", name: "运营助手", description: "辅助数据运营人员进行日常数据质量监控和问题诊断", type: "Prompt", tags: ["Qwen-Max", "运营监控", "智能诊断"], calls: 19240, version: "1.5.0", owner: "王强", status: "published" },
      { id: "cap-004", name: "开发助手", description: "辅助开发人员完成数据接口文档生成和示例代码编写", type: "Agent", tags: ["GPT-4o", "代码生成", "文档自动化"], calls: 14560, version: "2.0.0", owner: "刘伟", status: "published" },
      { id: "cap-005", name: "数据脱敏", description: "对敏感数据进行自动识别和脱敏处理", type: "Knowledge", tags: ["ERNIE-4", "隐私保护", "数据安全"], calls: 9870, version: "1.2.0", owner: "赵雪", status: "published" },
      { id: "cap-006", name: "数据血缘分析", description: "自动追踪和可视化数据流转路径及依赖关系", type: "Agent", tags: ["图数据库", "血缘追踪"], calls: 0, version: "0.9.0", owner: "张明", status: "draft" }
    ],
    detail: {
      id: "cap-001", name: "智能编目", code: "cap-smart-catalog",
      description: "基于大模型自动对数据集进行分类、标签标注和目录编制",
      type: "Agent", category: "数据治理", version: "2.1.0", status: "published",
      owner: "张明", model: "GPT-4o", promptTemplate: "数据编目Prompt v3",
      sourceType: "agent", sourceName: "数据资源智能编目助手", sourceVersion: "v1.0",
      knowledgeBase: "政企数据标准库", mcpEnabled: true, apiEnabled: true, sdkEnabled: true,
      calls: 28430, avgLatency: 185, createdAt: "2026-05-10", updatedAt: "2026-06-20", publishTime: "2026-06-20 10:23"
    },
    version: [
      { version: "2.1.0", time: "2026-06-20 10:23", changes: "支持批量编目，优化标签生成算法", status: "current" },
      { version: "2.0.0", time: "2026-06-10 14:00", changes: "集成知识库检索，提升分类准确性", status: "previous" },
      { version: "1.5.0", time: "2026-05-25 09:00", changes: "支持多语言数据集", status: "history" },
      { version: "1.0.0", time: "2026-05-10 11:00", changes: "初始版本发布", status: "history" }
    ],
    recentInvoke: [
      { time: "2026-06-28 10:25:30", app: "公共数据门户", tokens: 2840, latency: 185, result: "success" },
      { time: "2026-06-28 10:20:15", app: "企业数据控制台", tokens: 1920, latency: 190, result: "success" },
      { time: "2026-06-28 10:15:42", app: "数据治理平台", tokens: 3200, latency: 178, result: "success" },
      { time: "2026-06-28 10:10:08", app: "政务数据交换平台", tokens: 2150, latency: 195, result: "success" },
      { time: "2026-06-28 10:05:33", app: "公共数据门户", tokens: 2800, latency: 182, result: "failed" }
    ],
    owners: ["张明", "李娜", "王强", "刘伟", "赵雪", "陈晓燕"],
    categories: ["数据治理", "数据检索", "运营支持", "开发支持", "数据安全"],
    capabilityTypes: ["Prompt", "Agent", "Knowledge", "Model", "MCP"],
    availableAgents: [
      { id: "agt-001", name: "数据资源智能编目助手", version: "v1.0" },
      { id: "agt-002", name: "数据质量分析助手", version: "v1.0" },
      { id: "agt-003", name: "数据资产运营助手", version: "v1.1" },
      { id: "agt-004", name: "公共数据分析助手", version: "v1.0" },
      { id: "agt-005", name: "数据目录审核助手", version: "v1.0" },
      { id: "agt-006", name: "数据产品运营助手", version: "v1.0" }
    ]
  },

  market: {
    featured: [
      { id: "cap-001", name: "智能编目", description: "基于大模型自动对数据集进行分类、标签标注和目录编制", category: "数据治理", rating: 4.8, reviews: 126, calls: 28430, status: "published", version: "2.1.0", tags: ["GPT-4o", "自动编目", "政企数据"], provider: "数据治理组", updatedAt: "2026-06-20", icon: "fa-folder-tree", color: "#4F46E5" },
      { id: "cap-002", name: "找数寻源", description: "根据自然语言描述快速定位目标数据资产及其来源", category: "数据检索", rating: 4.6, reviews: 89, calls: 21890, status: "published", version: "1.8.0", tags: ["Claude", "语义检索", "数据定位"], provider: "数据平台组", updatedAt: "2026-06-18", icon: "fa-magnifying-glass", color: "#0EA5E9" },
      { id: "cap-003", name: "运营助手", description: "辅助数据运营人员进行日常数据质量监控和问题诊断", category: "运营助手", rating: 4.9, reviews: 203, calls: 19240, status: "published", version: "1.5.0", tags: ["Qwen-Max", "运营监控", "智能诊断"], provider: "运营支持组", updatedAt: "2026-06-15", icon: "fa-chart-line", color: "#10B981" },
      { id: "cap-004", name: "开发助手", description: "辅助开发人员完成数据接口文档生成和示例代码编写", category: "开发助手", rating: 4.7, reviews: 67, calls: 14560, status: "published", version: "2.0.0", tags: ["GPT-4o", "代码生成", "文档自动化"], provider: "开发平台组", updatedAt: "2026-06-22", icon: "fa-code", color: "#8B5CF6" },
      { id: "cap-005", name: "智能审核", description: "基于AI对数据质量、合规性进行自动化审核", category: "数据治理", rating: 4.5, reviews: 52, calls: 11230, status: "published", version: "1.3.0", tags: ["GPT-4o", "合规检查", "自动审核"], provider: "安全合规组", updatedAt: "2026-06-10", icon: "fa-clipboard-check", color: "#F59E0B" },
      { id: "cap-006", name: "知识问答", description: "基于知识库的智能问答系统，支持多轮对话", category: "运营助手", rating: 4.8, reviews: 156, calls: 32100, status: "published", version: "2.2.0", tags: ["Claude", "知识检索", "智能问答"], provider: "运营支持组", updatedAt: "2026-06-25", icon: "fa-comments", color: "#06B6D4" }
    ],
    categories: [
      { id: "prompt", name: "Prompt", icon: "fa-terminal", count: 24 },
      { id: "agent", name: "Agent", icon: "fa-robot", count: 20 },
      { id: "knowledge", name: "Knowledge", icon: "fa-book", count: 18 },
      { id: "model", name: "Model", icon: "fa-microchip", count: 14 },
      { id: "mcp", name: "MCP", icon: "fa-plug", count: 10 }
    ],
    capabilities: [
      { id: "cap-001", name: "智能编目", description: "基于大模型自动对数据集进行分类、标签标注和目录编制", category: "数据治理", categoryId: "datagovernance", rating: 4.8, reviews: 126, calls: 28430, status: "published", version: "2.1.0", tags: ["GPT-4o", "自动编目", "政企数据"], provider: "数据治理组", owner: "张明", updatedAt: "2026-06-20", publishedAt: "2026-06-20", icon: "fa-folder-tree", color: "#4F46E5", type: "Prompt", detail: { inputParams: [{ name: "dataset_name", type: "string", required: true, desc: "数据集名称" }, { name: "dataset_desc", type: "string", required: false, desc: "数据集描述" }, { name: "file_list", type: "array", required: true, desc: "文件列表" }], outputParams: [{ name: "category", type: "string", desc: "分类结果" }, { name: "tags", type: "array", desc: "标签列表" }, { name: "catalog", type: "object", desc: "目录结构" }], protocols: ["MCP", "Open API", "SDK"], models: ["GPT-4o"], knowledgeBases: ["政企数据标准库"], promptTemplate: "你是一位资深数据治理专家。请根据以下信息对数据集进行自动编目：\n数据集名称：{{dataset_name}}\n数据集描述：{{dataset_desc}}\n文件列表：{{file_list}}\n请输出 JSON：{ category, tags, catalog }", variables: [{ name: "dataset_name", desc: "数据集名称", required: true }, { name: "dataset_desc", desc: "数据集描述", required: false }, { name: "file_list", desc: "文件列表", required: true }], lastUpdate: "2026-06-20", example: "输入：数据集名称='销售数据'，描述='2024年各地区销售明细'\n输出：category='业务数据/销售', tags=['销售', '明细', '地区'], catalog={...}" } },
      { id: "cap-002", name: "找数寻源", description: "根据自然语言描述快速定位目标数据资产及其来源", category: "数据检索", categoryId: "agent", rating: 4.6, reviews: 89, calls: 21890, status: "published", version: "1.8.0", tags: ["Claude", "语义检索", "数据定位"], provider: "数据平台组", owner: "李娜", updatedAt: "2026-06-18", publishedAt: "2026-06-18", icon: "fa-robot", color: "#64748B", type: "Agent", detail: { inputParams: [{ name: "query", type: "string", required: true, desc: "自然语言查询" }], outputParams: [{ name: "data_assets", type: "array", desc: "匹配的数据资产" }, { name: "sources", type: "array", desc: "数据来源信息" }], protocols: ["MCP", "Open API", "SDK"], models: ["Claude"], knowledgeBases: ["数据资产目录库"], skills: [{ name: "资产检索", desc: "在数据资产目录中检索匹配资产" }, { name: "来源溯源", desc: "定位数据来源系统" }], lastUpdate: "2026-06-18", example: "输入：query='最近一年华东地区销售额'\n输出：data_assets=['sales_east_2024', 'regional_sales'], sources=['数据仓库/销售主题']" } },
      { id: "cap-003", name: "运营助手", description: "辅助数据运营人员进行日常数据质量监控和问题诊断", category: "运营助手", categoryId: "ops", rating: 4.9, reviews: 203, calls: 19240, status: "published", version: "1.5.0", tags: ["Qwen-Max", "运营监控", "智能诊断"], provider: "运营支持组", owner: "王强", updatedAt: "2026-06-15", publishedAt: "2026-06-15", icon: "fa-chart-line", color: "#10B981", type: "Prompt", detail: { inputParams: [{ name: "metric_name", type: "string", required: true, desc: "指标名称" }, { name: "time_range", type: "string", required: true, desc: "时间范围" }], outputParams: [{ name: "diagnosis", type: "string", desc: "诊断结果" }, { name: "suggestions", type: "array", desc: "优化建议" }], protocols: ["MCP", "Open API", "SDK"], models: ["Qwen-Max"], knowledgeBases: ["运营知识库"], promptTemplate: "你是一位数据运营专家。请根据指标 {{metric_name}} 在 {{time_range}} 的表现进行诊断，分析异常原因并给出可执行的优化建议。", variables: [{ name: "metric_name", desc: "指标名称", required: true }, { name: "time_range", desc: "时间范围", required: true }], lastUpdate: "2026-06-15", example: "输入：metric_name='数据更新延迟', time_range='最近24小时'\n输出：diagnosis='检测到3个异常节点', suggestions=['建议重启ETL任务']" } },
      { id: "cap-004", name: "开发助手", description: "辅助开发人员完成数据接口文档生成和示例代码编写", category: "开发助手", categoryId: "agent", rating: 4.7, reviews: 67, calls: 14560, status: "published", version: "2.0.0", tags: ["GPT-4o", "代码生成", "文档自动化"], provider: "开发平台组", owner: "刘伟", updatedAt: "2026-06-22", publishedAt: "2026-06-22", icon: "fa-robot", color: "#64748B", type: "Agent", detail: { inputParams: [{ name: "api_spec", type: "object", required: true, desc: "API规格说明" }], outputParams: [{ name: "documentation", type: "string", desc: "生成的文档" }, { name: "code_samples", type: "object", desc: "代码示例" }], protocols: ["MCP", "Open API", "SDK"], models: ["GPT-4o"], knowledgeBases: ["API文档库"], skills: [{ name: "接口解析", desc: "解析 API 规格说明" }, { name: "文档生成", desc: "生成接口文档" }, { name: "代码示例", desc: "生成多语言代码示例" }], lastUpdate: "2026-06-22", example: "输入：api_spec={endpoint:'/api/sales', method:'GET'}\n输出：documentation='# 销售接口\n...', code_samples={python:'...', javascript:'...'}" } },
      { id: "cap-005", name: "数据脱敏", description: "对敏感数据进行自动识别和脱敏处理", category: "数据治理", categoryId: "datagovernance", rating: 4.5, reviews: 45, calls: 9870, status: "published", version: "1.2.0", tags: ["ERNIE-4", "隐私保护", "数据安全"], provider: "安全合规组", owner: "赵雪", updatedAt: "2026-06-19", publishedAt: "2026-06-19", icon: "fa-user-shield", color: "#F59E0B", type: "Knowledge", detail: { inputParams: [{ name: "data_content", type: "string", required: true, desc: "原始数据" }, { name: "sensitivity_level", type: "string", required: false, desc: "敏感级别" }], outputParams: [{ name: "masked_data", type: "string", desc: "脱敏后数据" }, { name: "detected_types", type: "array", desc: "检测到的敏感类型" }], protocols: ["MCP", "Open API", "SDK"], models: ["ERNIE-4"], knowledgeBases: ["脱敏规则库"], retrievalConfig: { topK: 5, chunkSize: 512, similarity: 0.78, embeddingModel: "bge-large-zh" }, lastUpdate: "2026-06-19", example: "输入：data_content='姓名:张三，手机:13800138000'\n输出：masked_data='姓名:张**, 手机:138****8000', detected_types=['姓名', '手机号']" } },
      { id: "cap-006", name: "知识问答", description: "基于知识库的智能问答系统，支持多轮对话", category: "运营助手", categoryId: "ops", rating: 4.8, reviews: 156, calls: 32100, status: "published", version: "2.2.0", tags: ["Claude", "知识检索", "智能问答"], provider: "运营支持组", owner: "王强", updatedAt: "2026-06-25", publishedAt: "2026-06-05", icon: "fa-comments", color: "#06B6D4", type: "Knowledge", detail: { inputParams: [{ name: "question", type: "string", required: true, desc: "问题内容" }, { name: "kb_id", type: "string", required: false, desc: "知识库ID" }], outputParams: [{ name: "answer", type: "string", desc: "回答内容" }, { name: "references", type: "array", desc: "参考文档" }], protocols: ["MCP", "Open API", "SDK"], models: ["Claude"], knowledgeBases: ["政企数据标准库", "运营知识库", "API文档库"], retrievalConfig: { topK: 8, chunkSize: 512, similarity: 0.75, embeddingModel: "text-embedding-3-large" }, lastUpdate: "2026-06-25", example: "输入：question='如何申请数据权限？'\n输出：answer='您可以通过数据门户提交申请...', references=['数据权限申请流程.docx']" } },
      { id: "cap-007", name: "指标预测", description: "基于时序模型预测关键业务指标趋势", category: "数据治理", categoryId: "datagovernance", rating: 4.4, reviews: 38, calls: 8560, status: "published", version: "1.0.0", tags: ["时序预测", "业务智能", "趋势分析"], provider: "数据治理组", owner: "陈晓燕", updatedAt: "2026-06-12", publishedAt: "2026-06-12", icon: "fa-chart-area", color: "#EC4899", type: "Model", detail: { inputParams: [{ name: "metric", type: "string", required: true, desc: "指标名称" }, { name: "history_data", type: "array", required: true, desc: "历史数据" }], outputParams: [{ name: "forecast", type: "array", desc: "预测结果" }, { name: "confidence", type: "number", desc: "置信度" }], protocols: ["Open API", "SDK"], models: ["Prophet", "ARIMA"], knowledgeBases: [], modelSpec: { provider: "自研时序模型", contextWindow: 16384, modalities: ["文本", "数值序列"], maxTokens: 4096, framework: "Prophet + ARIMA" }, lastUpdate: "2026-06-12", example: "输入：metric='销售额', history_data=[...]\n输出：forecast=[{date:'2024-07', value:120}], confidence=0.85" } },
      { id: "cap-008", name: "异常检测", description: "自动识别数据流中的异常值和异常模式", category: "数据治理", categoryId: "datagovernance", rating: 4.3, reviews: 29, calls: 6540, status: "published", version: "1.1.0", tags: ["机器学习", "异常识别", "数据质量"], provider: "数据平台组", owner: "李娜", updatedAt: "2026-06-08", publishedAt: "2026-06-08", icon: "fa-triangle-exclamation", color: "#EF4444", type: "MCP", detail: { inputParams: [{ name: "data_stream", type: "array", required: true, desc: "数据流" }, { name: "threshold", type: "number", required: false, desc: "阈值" }], outputParams: [{ name: "anomalies", type: "array", desc: "异常列表" }, { name: "scores", type: "array", desc: "异常分数" }], protocols: ["MCP", "SDK"], models: ["Isolation Forest"], knowledgeBases: [], mcpServer: { name: "anomaly-detector", version: "1.1.0", transport: "stdio / SSE" }, mcpTools: [{ name: "detect_anomalies", desc: "检测数据流中的异常值" }, { name: "get_anomaly_scores", desc: "获取各点异常分数" }, { name: "set_threshold", desc: "设置检测阈值" }], lastUpdate: "2026-06-08", example: "输入：data_stream=[1,2,3,100,4,5]\n输出：anomalies=[{index:3, value:100, score:0.9}], scores=[0.1,0.1,0.2,0.9,0.1,0.1]" } }
    ],
    experience: {
      inputPlaceholder: "请输入您的问题，例如：帮我编目'销售数据集'",
      submitText: "运行",
      examples: ["帮我编目销售数据集", "最近一周销售额最高的产品是什么？", "如何申请数据权限？"]
    },
    integration: [
      { id: "mcp", name: "MCP", fullName: "Model Context Protocol", icon: "fa-plug", color: "#10B981", description: "标准化模型上下文协议，支持工具调用、资源访问和提示词模板", scenario: "适用于需要调用多种AI能力的复杂应用场景，特别是Agent和多工具协同场景", docUrl: "#", status: "available" },
      { id: "openapi", name: "Open API", fullName: "RESTful API", icon: "fa-code", color: "#4F46E5", description: "基于RESTful设计的HTTP接口，提供JSON格式的数据交换", scenario: "适用于Web和移动应用接入，跨语言、跨平台的标准HTTP调用", docUrl: "#", status: "available" },
      { id: "sdk", name: "SDK", fullName: "Software Development Kit", icon: "fa-box", color: "#8B5CF6", description: "多语言软件开发包，提供Python、JavaScript、Java等SDK支持", scenario: "适用于需要深度集成的企业级应用，提供完整的能力封装", docUrl: "#", status: "available" },
      { id: "a2a", name: "A2A", fullName: "Agent to Agent Protocol", icon: "fa-robot", color: "#64748B", description: "智能体间通信协议，支持多智能体协作与任务分发", scenario: "预留协议，适用于未来多智能体协作场景", docUrl: "#", status: "coming" }
    ],
    recommend: {
      guessYouLike: [
        { id: "cap-009", name: "文档智能解析", description: "对PDF、Word等文档进行智能解析和结构化提取", rating: 4.6, calls: 8920, icon: "fa-file-alt", color: "#0EA5E9" },
        { id: "cap-010", name: "数据血缘分析", description: "自动追踪和可视化数据流转路径及依赖关系", rating: 4.5, calls: 7230, icon: "fa-project-diagram", color: "#8B5CF6" },
        { id: "cap-011", name: "法规合规检查", description: "自动检查数据处理是否符合法规要求", rating: 4.7, calls: 5620, icon: "fa-scale-balanced", color: "#F59E0B" }
      ],
      latestPublish: [
        { id: "cap-012", name: "接口测试助手", description: "自动化接口测试用例生成与执行", rating: 4.3, calls: 0, icon: "fa-vial", color: "#06B6D4", publishedAt: "2026-06-28" },
        { id: "cap-013", name: "数据质量评分", description: "对数据集完整性、准确性进行多维度评分", rating: 4.2, calls: 2340, icon: "fa-award", color: "#EC4899", publishedAt: "2026-06-27" },
        { id: "cap-014", name: "指标计算引擎", description: "高性能业务指标实时计算服务", rating: 4.8, calls: 15600, icon: "fa-calculator", color: "#10B981", publishedAt: "2026-06-26" }
      ],
      hotCalls: [
        { id: "cap-001", name: "智能编目", description: "基于大模型自动对数据集进行分类标注", rating: 4.8, calls: 28430, icon: "fa-folder-tree", color: "#4F46E5" },
        { id: "cap-002", name: "找数寻源", description: "根据自然语言描述定位数据资产", rating: 4.6, calls: 21890, icon: "fa-magnifying-glass", color: "#0EA5E9" },
        { id: "cap-003", name: "运营助手", description: "数据质量监控和问题诊断", rating: 4.9, calls: 19240, icon: "fa-chart-line", color: "#10B981" }
      ]
    }
  },

  system: {
    users: [
      { id: "u-001", name: "张明", email: "zhangming@enterprise.com", role: "管理员", dept: "信息技术部", status: "active", lastLogin: "2026-06-28 09:12" },
      { id: "u-002", name: "李娜", email: "lina@enterprise.com", role: "运维工程师", dept: "数据平台部", status: "active", lastLogin: "2026-06-27 17:45" },
      { id: "u-003", name: "王强", email: "wangqiang@enterprise.com", role: "算法工程师", dept: "人工智能部", status: "active", lastLogin: "2026-06-28 10:03" },
      { id: "u-004", name: "陈晓燕", email: "chenxiaoyan@enterprise.com", role: "数据运营", dept: "数据运营部", status: "active", lastLogin: "2026-06-26 14:22" },
      { id: "u-005", name: "刘伟", email: "liuwei@enterprise.com", role: "开发工程师", dept: "开发平台部", status: "inactive", lastLogin: "2026-06-20 11:30" },
      { id: "u-006", name: "赵雪", email: "zhaoxue@enterprise.com", role: "安全审计", dept: "安全合规部", status: "active", lastLogin: "2026-06-28 08:55" }
    ],
    roles: [
      { id: "r-001", name: "管理员", desc: "平台最高权限，可管理所有模块", userCount: 2 },
      { id: "r-002", name: "运维工程师", desc: "负责平台运维和监控", userCount: 3 },
      { id: "r-003", name: "算法工程师", desc: "负责AI能力建设与Agent配置优化", userCount: 5 },
      { id: "r-004", name: "数据运营", desc: "负责AI能力调用和数据分析", userCount: 12 },
      { id: "r-005", name: "开发工程师", desc: "通过API/SDK接入AI能力", userCount: 8 }
    ],
    logs: [
      { time: "2026-06-28 10:23:45", user: "张明", action: "能力发布", target: "智能编目 v2.1.0", result: "成功", ip: "10.0.1.15" },
      { time: "2026-06-28 09:45:12", user: "系统", action: "MCP服务激活", target: "文件系统-MCP", result: "成功", ip: "127.0.0.1" },
      { time: "2026-06-28 09:12:33", user: "陈晓燕", action: "知识库更新", target: "政企数据标准库", result: "成功", ip: "10.0.2.28" },
      { time: "2026-06-27 17:30:08", user: "王强", action: "能力创建", target: "数据血缘分析", result: "成功", ip: "10.0.3.42" },
      { time: "2026-06-27 16:08:21", user: "张明", action: "SDK发布", target: "Python SDK v1.2.0", result: "成功", ip: "10.0.1.15" },
      { time: "2026-06-27 15:44:09", user: "李娜", action: "模型配置变更", target: "GPT-4o", result: "成功", ip: "10.0.2.11" },
      { time: "2026-06-27 14:22:37", user: "刘伟", action: "API Key申请", target: "找数寻源", result: "成功", ip: "10.0.4.18" },
      { time: "2026-06-27 11:05:52", user: "赵雪", action: "权限变更", target: "u-005", result: "成功", ip: "10.0.5.33" }
    ]
  },

  monitor: {
    overview: {
      totalCapabilities: 128,
      runningCapabilities: 86,
      abnormalCapabilities: 5,
      todayCalls: 38472,
      successRate: 99.88,
      avgResponseTime: 230
    },
    health: {
      healthy: { count: 82, percentage: 64.1, trend: "+3" },
      warning: { count: 35, percentage: 27.3, trend: "-2" },
      abnormal: { count: 5, percentage: 3.9, trend: "+1" },
      stopped: { count: 6, percentage: 4.7, trend: "0" }
    },
    trend: {
      timePoints: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
      calls: [1200, 890, 650, 580, 520, 680, 950, 1450, 2100, 2850, 3200, 3400, 3100, 2950, 3200, 3350, 3100, 2900, 2650, 2400, 2100, 1850, 1600, 1350],
      responseTime: [180, 165, 155, 150, 148, 152, 165, 190, 220, 245, 260, 270, 255, 248, 262, 275, 260, 245, 230, 215, 200, 188, 175, 168],
      successRate: [99.95, 99.97, 99.98, 99.99, 99.99, 99.98, 99.97, 99.95, 99.92, 99.88, 99.85, 99.82, 99.86, 99.88, 99.84, 99.80, 99.85, 99.88, 99.90, 99.92, 99.94, 99.95, 99.96, 99.97]
    },
    running: [
      { id: "cap-001", name: "智能编目", status: "healthy", qps: 128, avgTime: 185, errorRate: 0.05, owner: "张明" },
      { id: "cap-002", name: "找数寻源", status: "warning", qps: 86, avgTime: 420, errorRate: 0.28, owner: "李娜" },
      { id: "cap-003", name: "运营助手", status: "healthy", qps: 64, avgTime: 210, errorRate: 0.02, owner: "王强" },
      { id: "cap-004", name: "开发助手", status: "healthy", qps: 52, avgTime: 195, errorRate: 0.09, owner: "刘伟" },
      { id: "cap-005", name: "数据脱敏", status: "healthy", qps: 38, avgTime: 150, errorRate: 0.01, owner: "赵雪" },
      { id: "cap-006", name: "数据血缘分析", status: "abnormal", qps: 12, avgTime: 850, errorRate: 2.35, owner: "陈刚" },
      { id: "cap-007", name: "质量评估", status: "healthy", qps: 45, avgTime: 220, errorRate: 0.08, owner: "周琳" },
      { id: "cap-008", name: "报表生成", status: "warning", qps: 28, avgTime: 580, errorRate: 0.45, owner: "吴昊" },
      { id: "cap-009", name: "智能问答", status: "healthy", qps: 92, avgTime: 175, errorRate: 0.03, owner: "郑欣" },
      { id: "cap-010", name: "代码审查", status: "stopped", qps: 0, avgTime: 0, errorRate: 0, owner: "孙鹏" }
    ],
    events: [
      { id: "evt-001", level: "critical", time: "2026-06-28 10:23", title: "Prompt执行失败", status: "处理中", desc: "智能编目能力Prompt执行异常，错误码 ERR_PROMPT_EXEC" },
      { id: "evt-002", level: "warning", time: "2026-06-28 09:15", title: "模型超时", status: "已解决", desc: "GPT-4 模型调用超时，P99延迟超过3000ms" },
      { id: "evt-003", level: "warning", time: "2026-06-28 08:42", title: "MCP连接失败", status: "已解决", desc: "MCP Server 连接重试3次后成功" },
      { id: "evt-004", level: "info", time: "2026-06-28 08:30", title: "知识库异常", status: "已解决", desc: "知识库索引重建完成，共处理文档 12,850 篇" },
      { id: "evt-005", level: "info", time: "2026-06-28 07:00", title: "API异常", status: "已解决", desc: "Open API 调用限流触发，已自动扩容" },
      { id: "evt-006", level: "critical", time: "2026-06-27 22:15", title: "模型服务不可用", status: "已解决", desc: "Claude-3 模型服务宕机，已切换至备用模型" },
      { id: "evt-007", level: "warning", time: "2026-06-27 18:30", title: "MCP连接失败", status: "已解决", desc: "Filesystem MCP 连接超时，已自动重连" }
    ],
    alarm: {
      stats: {
        active: 3,
        todayTotal: 12,
        handled: 9,
        handledRate: 75.0,
        critical: 1,
        warning: 4
      },
      incidents: [
        { id: "inc-001", ruleId: "rule-001", ruleName: "调用失败率告警", level: "critical", capability: "数据血缘分析", triggerTime: "2026-07-25 10:24", value: "2.35%", threshold: "5%", status: "active", desc: "数据血缘分析能力调用失败率达 2.35%，持续触发失败率告警" },
        { id: "inc-002", ruleId: "rule-002", ruleName: "响应超时告警", level: "warning", capability: "找数寻源", triggerTime: "2026-07-25 09:15", value: "420ms", threshold: "1000ms", status: "acknowledged", desc: "找数寻源平均响应时间 420ms，P99 偶发超时" },
        { id: "inc-003", ruleId: "rule-004", ruleName: "Token超限告警", level: "warning", capability: "智能问答", triggerTime: "2026-07-25 08:50", value: "67420", threshold: "100000", status: "active", desc: "智能问答 Token 消耗持续上升，已达 67420" },
        { id: "inc-004", ruleId: "rule-005", ruleName: "MCP异常告警", level: "info", capability: "代码审查", triggerTime: "2026-07-25 08:30", value: "1次/5min", threshold: "3次/5min", status: "resolved", desc: "MCP Server 短暂重连，已自动恢复" }
      ],
      rules: [
        { id: "rule-001", name: "调用失败率告警", type: "error-rate", metric: "错误率", operator: ">=", threshold: "5%", current: "0.12%", status: "active", level: "critical", enabled: true, channels: ["邮件", "短信"], notifyGroup: "平台运维组" },
        { id: "rule-002", name: "响应超时告警", type: "latency", metric: "P99响应时间", operator: ">", threshold: "1000ms", current: "230ms", status: "active", level: "warning", enabled: true, channels: ["邮件", "钉钉"], notifyGroup: "平台运维组" },
        { id: "rule-003", name: "QPS异常告警", type: "qps", metric: "QPS", operator: ">", threshold: "500", current: "128", status: "active", level: "info", enabled: false, channels: ["邮件"], notifyGroup: "能力负责人" },
        { id: "rule-004", name: "Token超限告警", type: "token", metric: "Token消耗", operator: ">", threshold: "100000", current: "67420", status: "active", level: "warning", enabled: true, channels: ["邮件", "短信", "钉钉"], notifyGroup: "能力负责人" },
        { id: "rule-005", name: "MCP异常告警", type: "mcp", metric: "MCP失败次数", operator: ">=", threshold: "3次/5min", current: "1次/5min", status: "active", level: "info", enabled: true, channels: ["钉钉"], notifyGroup: "平台运维组" }
      ],
      channels: [
        { id: "ch-1", name: "邮件通知", type: "email", target: "ops@platform.com", enabled: true },
        { id: "ch-2", name: "短信通知", type: "sms", target: "138****8888", enabled: true },
        { id: "ch-3", name: "钉钉群机器人", type: "dingtalk", target: "运维告警群", enabled: true },
        { id: "ch-4", name: "企业微信", type: "wecom", target: "运维告警组", enabled: false }
      ]
    },
    topology: {
      nodes: [
        { id: "app-001", name: "业务系统", type: "app", icon: "fa-server" },
        { id: "cap-001", name: "AI能力", type: "capability", icon: "fa-brain" },
        { id: "agt-001", name: "Agent", type: "agent", icon: "fa-robot" },
        { id: "prompt-001", name: "Prompt", type: "prompt", icon: "fa-terminal" },
        { id: "kb-001", name: "Knowledge", type: "knowledge", icon: "fa-book" },
        { id: "model-001", name: "Model", type: "model", icon: "fa-microchip" },
        { id: "mcp-001", name: "MCP", type: "mcp", icon: "fa-plug" }
      ],
      links: [
        { source: "app-001", target: "cap-001" },
        { source: "cap-001", target: "agt-001" },
        { source: "agt-001", target: "prompt-001" },
        { source: "agt-001", target: "kb-001" },
        { source: "prompt-001", target: "model-001" },
        { source: "model-001", target: "mcp-001" }
      ]
    },
    logs: [
      { time: "2026-06-28 10:25:32", capability: "智能编目", status: "success", duration: 185, summary: "POST /api/capability/catalog - 200 OK" },
      { time: "2026-06-28 10:25:18", capability: "找数寻源", status: "warning", duration: 420, summary: "POST /api/capability/search - 200 OK (slow)" },
      { time: "2026-06-28 10:25:05", capability: "运营助手", status: "success", duration: 210, summary: "POST /api/capability/assist - 200 OK" },
      { time: "2026-06-28 10:24:52", capability: "开发助手", status: "success", duration: 195, summary: "POST /api/capability/dev - 200 OK" },
      { time: "2026-06-28 10:24:38", capability: "数据血缘分析", status: "error", duration: 850, summary: "POST /api/capability/lineage - 500 ERR_PROMPT_EXEC" },
      { time: "2026-06-28 10:24:20", capability: "数据脱敏", status: "success", duration: 150, summary: "POST /api/capability/mask - 200 OK" },
      { time: "2026-06-28 10:24:05", capability: "质量评估", status: "success", duration: 220, summary: "POST /api/capability/quality - 200 OK" },
      { time: "2026-06-28 10:23:48", capability: "报表生成", status: "warning", duration: 580, summary: "POST /api/capability/report - 200 OK (slow)" },
      { time: "2026-06-28 10:23:30", capability: "智能问答", status: "success", duration: 175, summary: "POST /api/capability/qa - 200 OK" },
      { time: "2026-06-28 10:23:15", capability: "代码审查", status: "stopped", duration: 0, summary: "能力已停用" }
    ]
  },

  analytics: {
    overview: {
      aiCapabilityCount: 156,
      totalCalls: 2847392,
      activeApps: 89,
      serviceCompanies: 234,
      tokenConsumption: 156789456,
      successRate: 99.45
    },
    topCapability: [
      { id: "cap-001", name: "智能编目", calls: 489230, apps: 45, rating: 4.8, valueIndex: 98.5, growthRate: 23.5 },
      { id: "cap-002", name: "找数寻源", calls: 412890, apps: 38, rating: 4.6, valueIndex: 95.2, growthRate: 18.2 },
      { id: "cap-003", name: "运营助手", calls: 356120, apps: 52, rating: 4.9, valueIndex: 97.8, growthRate: 31.5 },
      { id: "cap-004", name: "开发助手", calls: 298450, apps: 34, rating: 4.7, valueIndex: 93.4, growthRate: 15.8 },
      { id: "cap-005", name: "数据脱敏", calls: 234560, apps: 28, rating: 4.5, valueIndex: 88.9, growthRate: 12.3 },
      { id: "cap-006", name: "报表生成", calls: 198230, apps: 41, rating: 4.4, valueIndex: 85.6, growthRate: 22.1 },
      { id: "cap-007", name: "数据清洗", calls: 176890, apps: 25, rating: 4.3, valueIndex: 82.1, growthRate: 8.5 },
      { id: "cap-008", name: "智能问答", calls: 154320, apps: 33, rating: 4.6, valueIndex: 87.3, growthRate: 28.9 },
      { id: "cap-009", name: "文本分类", calls: 132450, apps: 19, rating: 4.2, valueIndex: 79.8, growthRate: 5.2 },
      { id: "cap-010", name: "实体识别", calls: 108920, apps: 15, rating: 4.4, valueIndex: 81.5, growthRate: 11.7 }
    ],
    department: [
      { id: "dept-001", name: "运营部", calls: 892340, ratio: 31.3, growth: 28.5, users: 156, topCap: "运营助手" },
      { id: "dept-002", name: "开发部", calls: 756230, ratio: 26.6, growth: 18.2, users: 132, topCap: "开发助手" },
      { id: "dept-003", name: "数据治理部", calls: 523450, ratio: 18.4, growth: 35.8, users: 98, topCap: "智能编目" },
      { id: "dept-004", name: "审批部", calls: 298120, ratio: 10.5, growth: 12.3, users: 45, topCap: "报表生成" },
      { id: "dept-005", name: "数据开放部", calls: 276890, ratio: 9.7, growth: 45.2, users: 67, topCap: "找数寻源" },
      { id: "dept-006", name: "其他", calls: 100362, ratio: 3.5, growth: 8.9, users: 28, topCap: "文本分类" }
    ],
    prompt: [
      { id: "prompt-001", name: "智能编目Prompt", hitRate: 94.5, successRate: 99.2, failRate: 0.8, satisfaction: 4.8, currentVersion: "v3.2", previousVersion: "v3.1", previousSuccessRate: 97.8, previousFailRate: 2.2 },
      { id: "prompt-002", name: "运营助手Prompt", hitRate: 91.2, successRate: 98.5, failRate: 1.5, satisfaction: 4.9, currentVersion: "v2.5", previousVersion: "v2.4", previousSuccessRate: 96.2, previousFailRate: 3.8 },
      { id: "prompt-003", name: "找数寻源Prompt", hitRate: 88.7, successRate: 97.8, failRate: 2.2, satisfaction: 4.6, currentVersion: "v4.1", previousVersion: "v4.0", previousSuccessRate: 95.5, previousFailRate: 4.5 },
      { id: "prompt-004", name: "开发助手Prompt", hitRate: 92.3, successRate: 99.1, failRate: 0.9, satisfaction: 4.7, currentVersion: "v2.8", previousVersion: "v2.7", previousSuccessRate: 98.3, previousFailRate: 1.7 },
      { id: "prompt-005", name: "数据脱敏Prompt", hitRate: 96.8, successRate: 99.6, failRate: 0.4, satisfaction: 4.5, currentVersion: "v1.9", previousVersion: "v1.8", previousSuccessRate: 98.9, previousFailRate: 1.1 }
    ],

    // Prompt Studio full data
    promptStudio: {
      overview: {
        total: 24,
        published: 18,
        draft: 4,
        testing: 2,
        totalCalls: 284930,
        dailyCalls: 12846,
        activeApps: 38,
        avgLatency: 1268,
        successRate: 99.2,
        p99Latency: 2850,
        dailyTokens: 2849300
      },
      promptList: [
        { id: "prompt-001", name: "数据编目Prompt v3", description: "用于智能编目场景的提示词模板，支持多维度分类和标签生成", category: "数据编目", tags: ["数据治理", "智能分类", "标签生成"], model: "GPT-4o", variables: [{ name: "数据集名称", type: "string", required: true }, { name: "数据集描述", type: "textarea", required: true }, { name: "数据字段列表", type: "array", required: true }], status: "published", calls: 28430, owner: "张明", createdAt: "2026-05-10", updatedAt: "2026-06-20", version: "3.2", versions: ["1.0", "2.0", "3.0", "3.1", "3.2"] },
        { id: "prompt-002", name: "数据检索Prompt v2", description: "用于语义检索场景，支持自然语言查询转换为结构化查询条件", category: "数据问答", tags: ["检索", "语义理解", "结构化查询"], model: "Claude-3.5-Sonnet", variables: [{ name: "用户查询", type: "string", required: true }, { name: "检索范围", type: "select", required: false, options: ["全量", "指定库", "指定表"] }], status: "published", calls: 21890, owner: "李华", createdAt: "2026-05-15", updatedAt: "2026-06-18", version: "2.1", versions: ["1.0", "1.5", "2.0", "2.1"] },
        { id: "prompt-003", name: "运营助手Prompt v1", description: "用于数据运营辅助诊断，支持异常指标解读和质量报告生成", category: "运营助手", tags: ["运营", "诊断", "报告生成"], model: "Qwen-Max", variables: [{ name: "异常指标", type: "string", required: true }, { name: "上下文数据", type: "json", required: false }], status: "published", calls: 19240, owner: "王芳", createdAt: "2026-05-20", updatedAt: "2026-06-15", version: "1.3", versions: ["1.0", "1.1", "1.2", "1.3"] },
        { id: "prompt-004", name: "开发助手Prompt v4", description: "用于接口文档生成和示例代码编写，支持多语言输出", category: "开发助手", tags: ["代码生成", "文档生成", "多语言"], model: "GPT-4o", variables: [{ name: "接口描述", type: "textarea", required: true }, { name: "请求参数", type: "json", required: true }, { name: "输出格式", type: "select", required: true, options: ["JSON", "XML", "Markdown"] }], status: "published", calls: 14560, owner: "赵强", createdAt: "2026-06-01", updatedAt: "2026-06-22", version: "4.0", versions: ["1.0", "2.0", "3.0", "4.0"] },
        { id: "prompt-005", name: "数据脱敏Prompt v1", description: "用于敏感数据识别和脱敏处理规则生成", category: "数据开发", tags: ["数据安全", "脱敏", "隐私保护"], model: "ERNIE-4", variables: [{ name: "原始数据", type: "textarea", required: true }, { name: "数据类型", type: "select", required: true, options: ["手机号", "身份证", "银行卡", "邮箱", "地址"] }], status: "published", calls: 9870, owner: "周琳", createdAt: "2026-06-05", updatedAt: "2026-06-19", version: "1.2", versions: ["1.0", "1.1", "1.2"] },
        { id: "prompt-006", name: "血缘分析Prompt v0", description: "用于数据血缘关系抽取和分析（草稿版本）", category: "数据编目", tags: ["血缘分析", "数据治理", "草稿"], model: "Claude-3.5-Sonnet", variables: [{ name: "表名列表", type: "array", required: true }, { name: "字段映射", type: "json", required: false }], status: "draft", calls: 0, owner: "张明", createdAt: "2026-06-25", updatedAt: "2026-06-27", version: "0.1", versions: ["0.1"] },
        { id: "prompt-007", name: "质量报告Prompt v2", description: "自动生成数据质量评估报告，支持多维度评分", category: "运营助手", tags: ["质量评估", "报告生成", "自动化"], model: "GPT-4o", variables: [{ name: "数据表名", type: "string", required: true }, { name: "评估维度", type: "array", required: true }], status: "published", calls: 8540, owner: "王芳", createdAt: "2026-06-08", updatedAt: "2026-06-21", version: "2.0", versions: ["1.0", "2.0"] },
        { id: "prompt-008", name: "知识问答Prompt v1", description: "基于知识库的智能问答Prompt，支持多轮对话", category: "知识问答", tags: ["知识库", "问答", "多轮对话"], model: "Claude-3.5-Sonnet", variables: [{ name: "问题", type: "string", required: true }, { name: "上下文", type: "array", required: false }], status: "testing", calls: 320, owner: "刘洋", createdAt: "2026-06-20", updatedAt: "2026-06-26", version: "1.0", versions: ["1.0"] }
      ],
      promptDetail: {
        id: "prompt-001",
        name: "数据编目Prompt v3",
        version: "3.2",
        versions: ["1.0", "2.0", "3.0", "3.1", "3.2"],
        systemPrompt: "你是一个专业的数据治理专家。你的任务是根据用户提供的元数据信息，帮助他们完成数据集的编目工作。\n\n## 你的能力\n1. 分析数据集名称和描述，理解业务含义\n2. 识别数据字段，提取业务标签\n3. 推荐合适的分类体系\n4. 生成规范的元数据描述\n\n## 分类体系\n- 按业务域：营销、供应链、财务、人力资源、客户关系、技术运维\n- 按数据类型：结构化数据、非结构化数据、半结构化数据\n- 按敏感级别：公开、内部、机密、绝密\n\n## 输出格式\n请以JSON格式输出编目结果：\n{\n  \"category\": \"分类路径\",\n  \"tags\": [\"标签列表\"],\n  \"description\": \"规范的数据集描述\",\n  \"confidence\": 0.95\n}\n\n## 注意事项\n- 始终使用中文输出\n- 标签数量控制在3-5个\n- 描述需要专业且准确",
        userPrompt: "# 数据集信息\n\n数据集名称：{{数据集名称}}\n\n数据集描述：\n{{数据集描述}}\n\n数据字段列表：\n{{数据字段列表}}\n\n请根据以上信息，完成数据集的智能编目。",
        assistantPrompt: "好的，我将根据您提供的信息为数据集「{{数据集名称}}」进行智能编目。\n\n正在分析数据集特征...",
        category: "数据编目",
        tags: ["数据治理", "智能分类", "标签生成"],
        model: "GPT-4o",
        temperature: 0.7,
        maxTokens: 2048,
        status: "published",
        dailyCalls: 3248,
        activeApps: 12,
        avgLatency: 892,
        successRate: 99.5,
        p99Latency: 1850,
        dailyTokens: 528400,
        createdAt: "2026-05-10",
        updatedAt: "2026-06-20"
      },
      variables: [
        { id: "var-001", name: "数据集名称", type: "string", required: true, defaultValue: "", description: "要编目的数据集名称" },
        { id: "var-002", name: "数据集描述", type: "textarea", required: true, defaultValue: "", description: "数据集的业务描述和用途" },
        { id: "var-003", name: "数据字段列表", type: "array", required: true, defaultValue: "[]", description: "数据集包含的字段列表，JSON数组格式" }
      ],
      versionHistory: [
        { version: "3.2", updatedAt: "2026-06-20 14:30", updatedBy: "张明", changes: "优化标签生成逻辑，增加业务域识别", isCurrent: true },
        { version: "3.1", updatedAt: "2026-06-15 10:20", updatedBy: "张明", changes: "修复分类体系映射错误", isCurrent: false },
        { version: "3.0", updatedAt: "2026-06-01 16:45", updatedBy: "李华", changes: "新增多语言支持，扩展分类体系", isCurrent: false },
        { version: "2.0", updatedAt: "2026-05-25 09:15", updatedBy: "李华", changes: "重构Prompt结构，增加置信度输出", isCurrent: false },
        { version: "1.0", updatedAt: "2026-05-10 11:00", updatedBy: "张明", changes: "初始版本", isCurrent: false }
      ],
      testResult: {
        input: { "数据集名称": "customer_orders_2026", "数据集描述": "2026年客户订单数据，包含客户信息、订单明细、支付信息等", "数据字段列表": ["order_id:string", "customer_id:string", "order_date:datetime", "total_amount:decimal", "status:string"] },
        model: "GPT-4o",
        temperature: 0.7,
        output: { result: '{\n  "category": "客户关系/订单管理",\n  "tags": ["客户数据", "订单分析", "交易数据", "CRM"],\n  "description": "2026年度客户订单数据集，记录客户购买行为及订单详情，适用于客户分群、订单分析和销售趋势预测等场景。",\n  "confidence": 0.94\n}' },
        tokens: { promptTokens: 486, completionTokens: 128, totalTokens: 614 },
        latency: 1243,
        testedAt: "2026-06-28 10:30:25",
        status: "success"
      },
      categories: ["数据问答", "数据编目", "数据开发", "运营助手", "审批助手", "开发助手", "知识问答", "Agent Prompt"],
      models: ["GPT-4o", "Claude-3.5-Sonnet", "Qwen-Max", "ERNIE-4", "GPT-4o-Mini"]
    },
    knowledge: {
      knowledgeBaseCount: 18,
      ragHitRate: 87.5,
      citationCount: 89234,
      coverage: 92.3,
      avgRetrievalMs: 280
    },
    services: {
      api: [
        { id: "svc-api-001", name: "能力调用API", calls: 612340, responseTime: 96, failRate: 0.09 },
        { id: "svc-api-002", name: "数据查询API", calls: 489230, responseTime: 132, failRate: 0.12 },
        { id: "svc-api-003", name: "文件上传API", calls: 176890, responseTime: 210, failRate: 0.18 },
        { id: "svc-api-004", name: "鉴权API", calls: 892340, responseTime: 45, failRate: 0.03 },
        { id: "svc-api-005", name: "回调通知API", calls: 98450, responseTime: 168, failRate: 0.22 }
      ],
      mcp: [
        { id: "svc-mcp-001", name: "文件系统MCP", calls: 234560, responseTime: 125, failRate: 0.12 },
        { id: "svc-mcp-002", name: "数据库MCP", calls: 198230, responseTime: 89, failRate: 0.08 },
        { id: "svc-mcp-003", name: "API网关MCP", calls: 176890, responseTime: 156, failRate: 0.15 },
        { id: "svc-mcp-004", name: "搜索MCP", calls: 154320, responseTime: 203, failRate: 0.21 },
        { id: "svc-mcp-005", name: "邮件MCP", calls: 132450, responseTime: 178, failRate: 0.18 }
      ],
      agent: [
        { id: "svc-agent-001", name: "智能编目Agent", calls: 489230, responseTime: 1850, failRate: 0.14 },
        { id: "svc-agent-002", name: "数据脱敏Agent", calls: 234560, responseTime: 1320, failRate: 0.11 },
        { id: "svc-agent-003", name: "报表生成Agent", calls: 198230, responseTime: 2240, failRate: 0.19 },
        { id: "svc-agent-004", name: "数据清洗Agent", calls: 176890, responseTime: 1680, failRate: 0.16 },
        { id: "svc-agent-005", name: "智能问答Agent", calls: 154320, responseTime: 980, failRate: 0.07 }
      ]
    },
    advice: [
      { id: "advice-001", type: "optimize", title: "建议优化：运营助手Prompt", desc: "运营助手用户满意度4.9分，但命中率仅91.2%，低于92%阈值。建议优化Prompt结构，提升意图识别准确率，预计可提升命中率至95%+。", metric: "命中率 91.2% · 低于92%阈值", priority: "high", icon: "fa-wand-magic-sparkles" },
      { id: "advice-002", type: "upgrade", title: "建议推广：数据脱敏能力", desc: "数据脱敏调用增长12.3%，但覆盖应用仅28个，低于平台均值。建议在数据治理场景加强推广，扩大应用覆盖。", metric: "覆盖应用 28个 · 增长率 12.3%", priority: "medium", icon: "fa-arrow-up" },
      { id: "advice-003", type: "new", title: "建议新增：数据治理知识库", desc: "当前RAG命中率87.5%，知识覆盖率92.3%。建议新增数据治理专业知识库，进一步提升检索效果与覆盖率。", metric: "RAG命中率 87.5% · 覆盖率 92.3%", priority: "medium", icon: "fa-book-plus" },
      { id: "advice-004", type: "republish", title: "建议重新发布：数据清洗能力", desc: "数据清洗能力增长率仅8.5%，连续3个月下降，低于平台均值。建议优化能力介绍并重新发布。", metric: "增长率 8.5% · 连续3月下降", priority: "low", icon: "fa-rocket" },
      { id: "advice-005", type: "optimize", title: "建议优化：找数寻源延迟", desc: "找数寻源P99延迟达1200ms，高于800ms阈值，影响用户体验。建议优化缓存策略或升级模型版本。", metric: "P99延迟 1200ms · 高于800ms阈值", priority: "high", icon: "fa-gauge-high" }
    ]
  },

  optimize: {
    overview: {
      pendingOptimization: 12,
      optimizationTasks: 8,
      completedThisMonth: 23,
      avgEffectImprovement: 18.5,
      successRate: 92.3,
      totalVersionsPublished: 156
    },
    suggestions: [
      { id: "sug-001", type: "prompt", typeLabel: "Prompt优化", capabilityName: "运营助手", capabilityId: "cap-003", priority: "high", priorityLabel: "高", reason: "当前Prompt命中率仅91.2%，低于平台平均水平95%。用户意图识别不够精准。", expectedBenefit: "预计提升命中率至96%+，用户满意度提升0.2分", status: "pending", statusLabel: "待处理", createdAt: "2026-06-20", basis: ["近7天调用量 1,240 次，命中率 91.2%（低于均值 95%）", "用户满意度评分 4.7 分，意图识别错误集中在数据治理场景", "平均响应时间 1,250ms，Prompt 结构缺少 Few-shot 示例"] },
      { id: "sug-002", type: "model", typeLabel: "模型切换", capabilityName: "找数寻源", capabilityId: "cap-002", priority: "medium", priorityLabel: "中", reason: "DeepSeek-V2性价比更高，效果与当前模型相当，成本降低40%。", expectedBenefit: "预计节省成本40%，响应时间降低15%", status: "pending", statusLabel: "待处理", createdAt: "2026-06-18", basis: ["当前模型调用成本占比 35.2%，DeepSeek-V2 性价比高 40%", "响应质量评分对比：当前 92.1分 vs DeepSeek-V2 91.8分（差异 < 1%）", "近30天调用量 8,320 次，月均成本 ¥3,248"] },
      { id: "sug-003", type: "knowledge", typeLabel: "知识库补充", capabilityName: "智能编目", capabilityId: "cap-001", priority: "high", priorityLabel: "高", reason: "知识库覆盖率为85%，数据治理领域专业知识缺失较多。", expectedBenefit: "预计RAG命中率提升至92%+", status: "pending", statusLabel: "待处理", createdAt: "2026-06-22", basis: ["知识库文档总量 320 篇，覆盖率 85%（目标 > 92%）", "近30天用户纠错反馈 23 次，其中 18 次指向数据治理领域", "RAG 命中率 87.5%，低于平台均值 91.2%"] },
      { id: "sug-004", type: "agent", typeLabel: "Agent优化", capabilityName: "开发助手", capabilityId: "cap-004", priority: "medium", priorityLabel: "中", reason: "当前Agent引用的Skill与MCP工具存在重复调用，分析发现可精简执行配置。", expectedBenefit: "预计响应时间降低20%，维护成本降低30%", status: "pending", statusLabel: "待处理", createdAt: "2026-06-15", basis: ["当前 Agent 平均执行时间 3,200ms，Skill 引用 5 个", "调用链路分析：3 项 Skill/MCP 存在重复调用，可精简", "近30天 Agent 配置维护记录 5 次，维护成本 ¥12,000"] },
      { id: "sug-005", type: "mcp", typeLabel: "MCP升级", capabilityName: "数据脱敏", capabilityId: "cap-005", priority: "low", priorityLabel: "低", reason: "当前MCP服务版本为v1.2，最新版本v1.5修复了3个安全问题。", expectedBenefit: "安全性提升，服务稳定性增强", status: "pending", statusLabel: "待处理", createdAt: "2026-06-10", basis: ["当前版本 v1.2，存在 3 个已知安全漏洞（CVE-2026-01/02/03）", "最新版本 v1.5 已发布，修复上述漏洞并新增 2 项稳定性改进", "服务可用性 99.1%，升级后预计提升至 99.8%"] },
      { id: "sug-006", type: "prompt", typeLabel: "Prompt优化", capabilityName: "报表生成", capabilityId: "cap-006", priority: "medium", priorityLabel: "中", reason: "用户反馈生成的报表格式不够灵活，缺少自定义选项。", expectedBenefit: "预计满意度提升0.3分", status: "pending", statusLabel: "待处理", createdAt: "2026-06-25", basis: ["近30天用户满意度 4.2 分，低于均值 4.5 分", "用户反馈中 42% 提及「报表格式单一」「缺少导出选项」", "当前 Prompt 仅支持 3 种固定格式，应扩展至 8 种"] }
    ],
    tasks: [
      { id: "task-001", name: "运营助手Prompt优化", capabilityName: "运营助手", capabilityId: "cap-003", owner: "张明", status: "in_progress", statusLabel: "进行中", planEndDate: "2026-07-05", progress: 65, version: "v2.6", createdAt: "2026-06-20" },
      { id: "task-002", name: "找数寻源模型切换", capabilityName: "找数寻源", capabilityId: "cap-002", owner: "李华", status: "pending", statusLabel: "待开始", planEndDate: "2026-07-10", progress: 0, version: "v4.2", createdAt: "2026-06-18" },
      { id: "task-003", name: "智能编目知识库补充", capabilityName: "智能编目", capabilityId: "cap-001", owner: "王芳", status: "in_progress", statusLabel: "进行中", planEndDate: "2026-07-08", progress: 40, version: "v3.3", createdAt: "2026-06-22" },
      { id: "task-004", name: "开发助手Agent优化", capabilityName: "开发助手", capabilityId: "cap-004", owner: "赵强", status: "completed", statusLabel: "已完成", planEndDate: "2026-06-28", progress: 100, version: "v2.9", createdAt: "2026-06-15" },
      { id: "task-005", name: "数据脱敏MCP升级", capabilityName: "数据脱敏", capabilityId: "cap-005", owner: "钱伟", status: "pending", statusLabel: "待开始", planEndDate: "2026-07-15", progress: 0, version: "v2.0", createdAt: "2026-06-10" },
      { id: "task-006", name: "报表生成Prompt优化", capabilityName: "报表生成", capabilityId: "cap-006", owner: "孙丽", status: "pending", statusLabel: "待开始", planEndDate: "2026-07-12", progress: 0, version: "v2.4", createdAt: "2026-06-25" }
    ],
    versions: [
      { id: "ver-001", capabilityId: "cap-003", capabilityName: "运营助手", version: "v2.5", publishedAt: "2026-06-25", optimizationContent: "优化Prompt结构，增加示例3个，调整意图识别逻辑", effectImprovement: "命中率提升4.8%，满意度提升0.2分", publishRecord: "PUB-20260625-003" },
      { id: "ver-002", capabilityId: "cap-004", capabilityName: "开发助手", version: "v2.8", publishedAt: "2026-06-28", optimizationContent: "精简Agent引用的Skill与MCP工具，优化执行路径", effectImprovement: "响应时间降低22%，维护成本降低30%", publishRecord: "PUB-20260628-001" },
      { id: "ver-003", capabilityId: "cap-001", capabilityName: "智能编目", version: "v3.2", publishedAt: "2026-06-20", optimizationContent: "补充数据治理专业知识库文档120篇", effectImprovement: "RAG命中率从87.5%提升至93.2%", publishRecord: "PUB-20260620-002" },
      { id: "ver-004", capabilityId: "cap-002", capabilityName: "找数寻源", version: "v4.1", publishedAt: "2026-06-15", optimizationContent: "切换至DeepSeek-V2模型", effectImprovement: "成本降低38%，响应时间降低18%", publishRecord: "PUB-20260615-004" },
      { id: "ver-005", capabilityId: "cap-005", capabilityName: "数据脱敏", version: "v1.9", publishedAt: "2026-06-10", optimizationContent: "优化脱敏规则算法，提升处理速度", effectImprovement: "处理速度提升35%，准确率提升至99.6%", publishRecord: "PUB-20260610-005" },
      { id: "ver-006", capabilityId: "cap-006", capabilityName: "报表生成", version: "v2.3", publishedAt: "2026-06-05", optimizationContent: "增加报表自定义模板功能", effectImprovement: "用户满意度从4.2提升至4.5", publishRecord: "PUB-20260605-006" }
    ],
    comparison: {
      capabilityName: "运营助手",
      before: { successRate: 96.2, responseTime: 1250, satisfaction: 4.7, costPerCall: 0.052 },
      after: { successRate: 98.5, responseTime: 1180, satisfaction: 4.9, costPerCall: 0.048 },
      improvements: { successRate: "+2.3%", responseTime: "-5.6%", satisfaction: "+0.2", costPerCall: "-7.7%" }
    },
    insights: [
      { id: "insight-001", icon: "fa-wand-magic-sparkles", title: "Prompt命中率偏低", desc: "当前平台平均Prompt命中率为89.3%，建议为命中率低于85%的能力增加示例和Few-shot学习样本。", type: "warning" },
      { id: "insight-002", icon: "fa-coins", title: "模型成本优化空间大", desc: "GPT-4成本占比35.2%，但调用量仅占18%。建议将非核心场景切换至DeepSeek-V2，预计节省成本45%。", type: "success" },
      { id: "insight-003", icon: "fa-book", title: "知识库覆盖不足", desc: "12个能力的知识覆盖率低于90%，建议优先补充数据治理、财务、人力资源领域知识文档。", type: "info" },
      { id: "insight-004", icon: "fa-robot", title: "Agent工具引用有待精简", desc: "部分Agent同时引用多个功能重叠的Skill与MCP工具，导致执行链路冗余。建议梳理各Agent的引用清单、保留高价值工具，预计整体响应时间降低15%。", type: "warning" },
      { id: "insight-005", icon: "fa-rocket", title: "优化后发布及时性待提升", desc: "本月23次优化中，8次发布延迟超过3天。建议优化完成后立即发布，避免效果空窗期。", type: "danger" }
    ],
    history: [
      { id: "hist-001", capabilityName: "开发助手", optimizationType: "Agent优化", optimizedAt: "2026-06-28", optimizer: "赵强", result: "成功", version: "v2.8" },
      { id: "hist-002", capabilityName: "运营助手", optimizationType: "Prompt优化", optimizedAt: "2026-06-25", optimizer: "张明", result: "成功", version: "v2.5" },
      { id: "hist-003", capabilityName: "智能编目", optimizationType: "知识库补充", optimizedAt: "2026-06-20", optimizer: "王芳", result: "成功", version: "v3.2" },
      { id: "hist-004", capabilityName: "找数寻源", optimizationType: "模型切换", optimizedAt: "2026-06-15", optimizer: "李华", result: "成功", version: "v4.1" },
      { id: "hist-005", capabilityName: "数据脱敏", optimizationType: "Prompt优化", optimizedAt: "2026-06-10", optimizer: "钱伟", result: "成功", version: "v1.9" },
      { id: "hist-006", capabilityName: "报表生成", optimizationType: "Prompt优化", optimizedAt: "2026-06-05", optimizer: "孙丽", result: "成功", version: "v2.3" },
      { id: "hist-007", capabilityName: "智能问答", optimizationType: "知识库补充", optimizedAt: "2026-05-28", optimizer: "王芳", result: "成功", version: "v3.1" },
      { id: "hist-008", capabilityName: "数据清洗", optimizationType: "MCP升级", optimizedAt: "2026-05-20", optimizer: "钱伟", result: "成功", version: "v2.4" }
    ]
  },


  knowledge: {
    overview: {
      totalKnowledgeBases: 10,
      totalDocuments: 10661,
      totalChunks: 89234,
      embeddingCompletionRate: 96.8,
      totalKnowledgeCalls: 458920,
      totalStorage: "9.1GB"
    },
    knowledgeBases: [
      { id: "kb-001", name: "政企数据标准库", description: "收录国家和行业数据标准规范的文档知识库", business: "数据治理部", docCount: 1256, chunkCount: 28340, status: "active", lastSync: "2026-06-28 08:00", size: "2.3GB", type: "标准规范", embeddingModel: "text-embedding-3-large", embeddingRate: 98.5 },
      { id: "kb-002", name: "数据资产目录库", description: "平台内所有注册数据资产的元信息索引", business: "数据平台部", docCount: 8432, chunkCount: 45670, status: "active", lastSync: "2026-06-28 09:00", size: "5.7GB", type: "资产目录", embeddingModel: "text-embedding-3-large", embeddingRate: 99.2 },
      { id: "kb-003", name: "运营知识库", description: "日常运营问题处理经验和标准操作手册", business: "运营支持部", docCount: 456, chunkCount: 8920, status: "active", lastSync: "2026-06-27 18:00", size: "890MB", type: "运营手册", embeddingModel: "text-embedding-3-large", embeddingRate: 95.8 },
      { id: "kb-004", name: "API文档库", description: "平台所有对外API接口的说明文档", business: "开发平台部", docCount: 328, chunkCount: 4520, status: "active", lastSync: "2026-06-26 12:00", size: "156MB", type: "技术文档", embeddingModel: "text-embedding-3-large", embeddingRate: 100.0 },
      { id: "kb-005", name: "脱敏规则库", description: "各类敏感数据的脱敏规则和示例", business: "安全合规部", docCount: 189, chunkCount: 1784, status: "active", lastSync: "2026-06-25 10:00", size: "45MB", type: "规则配置", embeddingModel: "text-embedding-3-large", embeddingRate: 92.3 },
      { id: "kb-006", name: "政策法规库", description: "国家及地方数据相关政策法规文件汇编", business: "政策研究部", docCount: 612, chunkCount: 9821, status: "active", lastSync: "2026-06-24 09:30", size: "1.4GB", type: "政策法规", embeddingModel: "text-embedding-3-large", embeddingRate: 97.1 },
      { id: "kb-007", name: "数据质量规则库", description: "数据质量评估规则、阈值与校验逻辑", business: "数据治理部", docCount: 234, chunkCount: 3210, status: "active", lastSync: "2026-06-23 16:00", size: "210MB", type: "规则配置", embeddingModel: "text-embedding-3-large", embeddingRate: 96.4 },
      { id: "kb-008", name: "行业标准库", description: "信息技术与数据交换相关行业标准归档", business: "标准化部", docCount: 387, chunkCount: 5430, status: "active", lastSync: "2026-06-22 11:00", size: "680MB", type: "标准规范", embeddingModel: "text-embedding-3-large", embeddingRate: 98.9 },
      { id: "kb-009", name: "案例知识库", description: "数据治理与运营典型实践案例集", business: "运营支持部", docCount: 156, chunkCount: 2089, status: "active", lastSync: "2026-06-21 14:30", size: "320MB", type: "运营手册", embeddingModel: "text-embedding-3-large", embeddingRate: 94.2 },
      { id: "kb-010", name: "数据分类分级库", description: "数据分类分级标准与敏感数据识别指南", business: "安全合规部", docCount: 98, chunkCount: 1342, status: "active", lastSync: "2026-06-20 09:00", size: "75MB", type: "规则配置", embeddingModel: "text-embedding-3-large", embeddingRate: 99.5 }
    ],
    documents: [
      { id: "doc-001", kbId: "kb-001", name: "GB_T 35678-2017 公共数据开放平台技术规范.pdf", format: "PDF", size: "2.8MB", status: "active", parseStatus: "completed", chunkCount: 156, embeddingStatus: "completed", updatedAt: "2026-06-28 07:30" },
      { id: "doc-002", kbId: "kb-001", name: "政务数据共享交换标准规范V2.1.docx", format: "DOCX", size: "1.2MB", status: "active", parseStatus: "completed", chunkCount: 89, embeddingStatus: "completed", updatedAt: "2026-06-27 16:45" },
      { id: "doc-003", kbId: "kb-001", name: "数据元国家标准GB 21075-2007.pdf", format: "PDF", size: "3.5MB", status: "active", parseStatus: "completed", chunkCount: 203, embeddingStatus: "completed", updatedAt: "2026-06-26 14:20" },
      { id: "doc-004", kbId: "kb-002", name: "企业数据资产目录V3.0.xlsx", format: "XLSX", size: "5.6MB", status: "active", parseStatus: "completed", chunkCount: 1245, embeddingStatus: "completed", updatedAt: "2026-06-28 08:45" },
      { id: "doc-005", kbId: "kb-002", name: "数据字典定义规范.md", format: "MD", size: "45KB", status: "active", parseStatus: "completed", chunkCount: 28, embeddingStatus: "completed", updatedAt: "2026-06-27 10:00" },
      { id: "doc-006", kbId: "kb-003", name: "数据质量检查操作手册v2.pdf", format: "PDF", size: "1.8MB", status: "active", parseStatus: "completed", chunkCount: 112, embeddingStatus: "completed", updatedAt: "2026-06-27 17:30" },
      { id: "doc-007", kbId: "kb-003", name: "异常数据处理标准流程.docx", format: "DOCX", size: "890KB", status: "active", parseStatus: "completed", chunkCount: 67, embeddingStatus: "completed", updatedAt: "2026-06-26 11:15" },
      { id: "doc-008", kbId: "kb-004", name: "Open API 接口文档V4.2.html", format: "HTML", size: "320KB", status: "active", parseStatus: "completed", chunkCount: 156, embeddingStatus: "completed", updatedAt: "2026-06-26 12:00" },
      { id: "doc-009", kbId: "kb-004", name: "SDK集成指南v1.8.pdf", format: "PDF", size: "2.1MB", status: "active", parseStatus: "completed", chunkCount: 134, embeddingStatus: "completed", updatedAt: "2026-06-25 15:30" },
      { id: "doc-010", kbId: "kb-005", name: "个人信息脱敏规范V2.3.pdf", format: "PDF", size: "1.5MB", status: "active", parseStatus: "completed", chunkCount: 89, embeddingStatus: "completed", updatedAt: "2026-06-25 10:00" },
      { id: "doc-011", kbId: "kb-005", name: "企业敏感数据识别规则.json", format: "JSON", size: "28KB", status: "processing", parseStatus: "processing", chunkCount: 0, embeddingStatus: "pending", updatedAt: "2026-06-28 09:00" },
      { id: "doc-012", kbId: "kb-001", name: "数据安全管理条例2026版.pdf", format: "PDF", size: "1.9MB", status: "active", parseStatus: "completed", chunkCount: 98, embeddingStatus: "failed", updatedAt: "2026-06-24 09:00" },
      { id: "doc-013", kbId: "kb-006", name: "数据安全法实施细则2026.pdf", format: "PDF", size: "2.2MB", status: "active", parseStatus: "completed", chunkCount: 142, embeddingStatus: "completed", updatedAt: "2026-06-24 09:20" },
      { id: "doc-014", kbId: "kb-006", name: "个人信息保护法解读.docx", format: "DOCX", size: "780KB", status: "active", parseStatus: "completed", chunkCount: 76, embeddingStatus: "completed", updatedAt: "2026-06-23 15:00" },
      { id: "doc-015", kbId: "kb-007", name: "数据质量评估规范V1.2.pdf", format: "PDF", size: "1.6MB", status: "active", parseStatus: "completed", chunkCount: 104, embeddingStatus: "completed", updatedAt: "2026-06-23 16:10" },
      { id: "doc-016", kbId: "kb-008", name: "信息技术数据交换标准GB_T 21062.pdf", format: "PDF", size: "3.1MB", status: "active", parseStatus: "completed", chunkCount: 178, embeddingStatus: "completed", updatedAt: "2026-06-22 11:20" },
      { id: "doc-017", kbId: "kb-009", name: "数据治理典型案例集2026.docx", format: "DOCX", size: "2.4MB", status: "active", parseStatus: "completed", chunkCount: 132, embeddingStatus: "completed", updatedAt: "2026-06-21 14:40" },
      { id: "doc-018", kbId: "kb-010", name: "数据分类分级指南V2.0.pdf", format: "PDF", size: "1.3MB", status: "active", parseStatus: "processing", chunkCount: 0, embeddingStatus: "pending", updatedAt: "2026-06-20 09:15" }
    ],
    documentDetail: {
      id: "doc-001",
      name: "GB_T 35678-2017 公共数据开放平台技术规范.pdf",
      format: "PDF",
      size: "2.8MB",
      status: "active",
      parseStatus: "completed",
      chunkCount: 156,
      embeddingStatus: "completed",
      embeddingModel: "text-embedding-3-large",
      updatedAt: "2026-06-28 07:30",
      kbName: "政企数据标准库",
      kbId: "kb-001",
      relatedCapabilities: [
        { id: "cap-001", name: "智能编目", type: "Prompt" },
        { id: "cap-010", name: "知识问答", type: "Knowledge" }
      ],
      "引用次数": 128
    },
    chunks: [
      { id: "chunk-001", docId: "doc-001", index: 1, content: "本标准规定了公共数据开放平台的基本功能要求、数据管理要求、安全管理要求和运维管理要求。适用于各级政务数据开放平台的建设和管理。", length: 86, tokenCount: 22, embeddingStatus: "completed", "引用次数": 12 },
      { id: "chunk-002", docId: "doc-001", index: 2, content: "平台应具备数据分类分级功能，支持按照数据敏感程度进行分级管理，并提供相应的访问控制策略。数据分级包括公开数据、内部数据、敏感数据三类。", length: 95, tokenCount: 25, embeddingStatus: "completed", "引用次数": 8 },
      { id: "chunk-003", docId: "doc-001", index: 3, content: "数据开放接口应遵循RESTful设计规范，支持JSON格式的数据交换，并提供完善的API文档和SDK支持。接口响应时间应不超过200ms。", length: 78, tokenCount: 20, embeddingStatus: "completed", "引用次数": 15 },
      { id: "chunk-004", docId: "doc-001", index: 4, content: "平台应支持数据的批量导入和导出功能，导入文件格式包括Excel、CSV、JSON等。批量操作应支持断点续传，单次批量处理数据量不低于10万条。", length: 92, tokenCount: 24, embeddingStatus: "completed", "引用次数": 6 },
      { id: "chunk-005", docId: "doc-001", index: 5, content: "安全管理方面，平台应实现统一的身份认证和权限管理，支持OAuth2.0和JWT令牌机制。所有数据传输必须采用HTTPS加密，确保数据在传输过程中的安全性。", length: 98, tokenCount: 26, embeddingStatus: "completed", "引用次数": 19 },
      { id: "chunk-006", docId: "doc-002", index: 1, content: "政务数据共享交换采用统一的数据交换标准，包括数据元标准、编码规则和接口规范。各部门应按照统一标准进行数据改造和接入。", length: 82, tokenCount: 21, embeddingStatus: "completed", "引用次数": 11 },
      { id: "chunk-007", docId: "doc-002", index: 2, content: "数据交换平台支持实时交换和批量交换两种模式。实时交换适用于低延迟场景，批量交换适用于大规模数据传输。", length: 74, tokenCount: 19, embeddingStatus: "completed", "引用次数": 7 },
      { id: "chunk-008", docId: "doc-003", index: 1, content: "数据元是构成数据的基本单元，具有语义完整性、结构完整性和可扩展性。本标准定义了政府数据元的基本属性和命名规范。", length: 84, tokenCount: 22, embeddingStatus: "completed", "引用次数": 9 }
    ],
    ragTest: {
      question: "公共数据开放平台有哪些安全管理要求？",
      topK: 3,
      scoreThreshold: 0.7,
      results: [
        { docId: "doc-001", docName: "GB_T 35678-2017 公共数据开放平台技术规范.pdf", chunkId: "chunk-005", chunkIndex: 5, score: 0.94, content: "安全管理方面，平台应实现统一的身份认证和权限管理，支持OAuth2.0和JWT令牌机制。所有数据传输必须采用HTTPS加密，确保数据在传输过程中的安全性。" },
        { docId: "doc-001", docName: "GB_T 35678-2017 公共数据开放平台技术规范.pdf", chunkId: "chunk-002", chunkIndex: 2, score: 0.89, content: "平台应具备数据分类分级功能，支持按照数据敏感程度进行分级管理，并提供相应的访问控制策略。数据分级包括公开数据、内部数据、敏感数据三类。" },
        { docId: "doc-002", docName: "政务数据共享交换标准规范V2.1.docx", chunkId: "chunk-006", chunkIndex: 1, score: 0.82, content: "政务数据共享交换采用统一的数据交换标准，包括数据元标准、编码规则和接口规范。各部门应按照统一标准进行数据改造和接入。" }
      ],
      answer: "根据检索结果，公共数据开放平台的安全管理要求主要包括：\n\n1. **统一身份认证和权限管理**：平台应实现统一的身份认证和权限管理机制。\n\n2. **支持OAuth2.0和JWT令牌**：系统应支持OAuth2.0和JWT令牌机制进行身份验证。\n\n3. **数据传输加密**：所有数据传输必须采用HTTPS加密，确保数据在传输过程中的安全性。\n\n4. **数据分类分级管理**：平台应具备数据分类分级功能，支持按照数据敏感程度进行分级管理，数据分级包括公开数据、内部数据、敏感数据三类，并提供相应的访问控制策略。"
    },
    relationGraph: {
      nodes: [
        { id: "kb-001", name: "政企数据标准库", type: "knowledge", icon: "fa-book" },
        { id: "kb-002", name: "数据资产目录库", type: "knowledge", icon: "fa-book" },
        { id: "kb-003", name: "运营知识库", type: "knowledge", icon: "fa-book" },
        { id: "cap-001", name: "智能编目", type: "capability", icon: "fa-robot" },
        { id: "cap-002", name: "找数寻源", type: "capability", icon: "fa-robot" },
        { id: "cap-003", name: "运营助手", type: "capability", icon: "fa-terminal" },
        { id: "cap-010", name: "知识问答", type: "capability", icon: "fa-book" },
        { id: "prompt-001", name: "编目Prompt v3", type: "prompt", icon: "fa-terminal" },
        { id: "mcp-001", name: "文件系统MCP", type: "mcp", icon: "fa-plug" }
      ],
      links: [
        { source: "kb-001", target: "cap-001", relation: "检索" },
        { source: "kb-001", target: "cap-010", relation: "检索" },
        { source: "kb-002", target: "cap-002", relation: "检索" },
        { source: "kb-003", target: "cap-003", relation: "检索" },
        { source: "cap-001", target: "prompt-001", relation: "使用" },
        { source: "kb-001", target: "mcp-001", relation: "接入" },
        { source: "cap-010", target: "prompt-001", relation: "使用" },
        { source: "kb-002", target: "cap-010", relation: "检索" }
      ]
    },
    lifecycle: [
      { stage: "上传", icon: "fa-upload", desc: "文档上传至知识库", active: true, completed: true },
      { stage: "解析", icon: "fa-file-alt", desc: "文档内容结构化解析", active: true, completed: true },
      { stage: "语义块", icon: "fa-scissors", desc: "文档切分为语义块", active: true, completed: true },
      { stage: "Embedding", icon: "fa-brain", desc: "向量化存储", active: true, completed: true },
      { stage: "检索", icon: "fa-search", desc: "语义检索匹配", active: true, completed: false },
      { stage: "AI调用", icon: "fa-robot", desc: "作为上下文调用", active: false, completed: false }
    ],
    owners: ["张明", "李娜", "王强", "刘伟", "赵雪", "陈晓燕"],
    businessTypes: ["数据治理部", "数据平台部", "运营支持部", "开发平台部", "安全合规部"],
    knowledgeTypes: ["标准规范", "资产目录", "运营手册", "技术文档", "规则配置"]
  },

  open: {
    overview: {
      slogan: "一次发布，多种开放方式，让 AI 能力快速接入业务系统。",
      kpis: {
        openCapabilities: { value: 48, change: 5, trend: "up", label: "开放能力数" },
        mcpServices: { value: 12, change: 2, trend: "up", label: "MCP服务" },
        apiCount: { value: 36, change: 8, trend: "up", label: "API数量" },
        sdkCount: { value: 5, change: 0, trend: "neutral", label: "SDK数量" },
        totalCalls: { value: 2846390, change: 23, trend: "up", label: "调用次数" },
        appCount: { value: 28, change: 3, trend: "up", label: "接入应用" }
      }
    },
    flow: {
      steps: [
        { stage: "AI能力", label: "AI能力", icon: "fa-brain", desc: "平台建设的AI能力" },
        { stage: "发布", label: "发布", icon: "fa-rocket", desc: "发布至开放中心" },
        { stage: "Gateway", label: "Gateway", icon: "fa-server", desc: "统一接入网关" },
        { stage: "开放协议", label: "MCP / API / SDK", icon: "fa-plug", desc: "多协议适配" },
        { stage: "业务系统", label: "业务系统", icon: "fa-building", desc: "业务平台调用" }
      ]
    },
    mcp: {
      servers: [
        { id: "mcp-001", name: "文件系统MCP", description: "提供本地文件系统读写操作的MCP服务", endpoint: "http://mcp-gateway.local:8080/filesystem", status: "healthy", calls: 89234, tools: 8, resources: 12, prompts: 3, healthScore: 99.8, avgLatency: 45, lastHeartbeat: "2026-06-28 10:25:30" },
        { id: "mcp-002", name: "数据库MCP", description: "支持多类型数据库查询和操作的MCP服务", endpoint: "http://mcp-gateway.local:8080/database", status: "healthy", calls: 156780, tools: 15, resources: 24, prompts: 2, healthScore: 99.5, avgLatency: 82, lastHeartbeat: "2026-06-28 10:25:28" },
        { id: "mcp-003", name: "API网关MCP", description: "统一代理外部API调用的MCP服务", endpoint: "http://mcp-gateway.local:8080/apigateway", status: "healthy", calls: 234560, tools: 20, resources: 8, prompts: 1, healthScore: 99.9, avgLatency: 120, lastHeartbeat: "2026-06-28 10:25:26" },
        { id: "mcp-004", name: "搜索MCP", description: "企业级全文检索和语义搜索MCP服务", endpoint: "http://mcp-gateway.local:8080/search", status: "degraded", calls: 67890, tools: 5, resources: 3, prompts: 2, healthScore: 85.2, avgLatency: 380, lastHeartbeat: "2026-06-28 10:24:50" },
        { id: "mcp-005", name: "邮件MCP", description: "邮件发送和管理的MCP服务", endpoint: "http://mcp-gateway.local:8080/email", status: "healthy", calls: 34560, tools: 6, resources: 2, prompts: 1, healthScore: 99.7, avgLatency: 210, lastHeartbeat: "2026-06-28 10:25:20" },
        { id: "mcp-006", name: "日志MCP", description: "集中式日志查询和分析MCP服务", endpoint: "http://mcp-gateway.local:8080/logs", status: "healthy", calls: 123450, tools: 10, resources: 15, prompts: 2, healthScore: 99.6, avgLatency: 95, lastHeartbeat: "2026-06-28 10:25:24" }
      ]
    },
    api: {
      apis: [
        { id: "api-001", name: "智能编目", url: "https://api.example.com/v1/capabilities/smart-catalog", method: "POST", auth: "Bearer Token", version: "v2.1.0", status: "published", calls: 28430, description: "对数据集进行自动分类、标签标注和目录编制", category: "数据治理" },
        { id: "api-002", name: "找数寻源", url: "https://api.example.com/v1/capabilities/data-search", method: "POST", auth: "Bearer Token", version: "v1.8.0", status: "published", calls: 21890, description: "根据自然语言描述定位数据资产及其来源", category: "数据检索" },
        { id: "api-003", name: "运营助手", url: "https://api.example.com/v1/capabilities/ops-assistant", method: "POST", auth: "API Key", version: "v1.5.0", status: "published", calls: 19240, description: "数据质量监控和问题诊断", category: "运营支持" },
        { id: "api-004", name: "开发助手", url: "https://api.example.com/v1/capabilities/dev-assistant", method: "POST", auth: "OAuth2.0", version: "v2.0.0", status: "published", calls: 14560, description: "接口文档生成和示例代码编写", category: "开发支持" },
        { id: "api-005", name: "数据脱敏", url: "https://api.example.com/v1/capabilities/data-mask", method: "POST", auth: "Bearer Token", version: "v1.2.0", status: "published", calls: 9870, description: "敏感数据自动识别和脱敏处理", category: "数据安全" },
        { id: "api-006", name: "指标预测", url: "https://api.example.com/v1/capabilities/metric-forecast", method: "POST", auth: "API Key", version: "v1.0.0", status: "published", calls: 8560, description: "关键业务指标趋势预测", category: "数据治理" },
        { id: "api-007", name: "数据血缘分析", url: "https://api.example.com/v1/capabilities/data-lineage", method: "GET", auth: "Bearer Token", version: "v0.9.0", status: "testing", calls: 0, description: "追踪和可视化数据流转路径", category: "数据治理" },
        { id: "api-008", name: "知识问答", url: "https://api.example.com/v1/capabilities/kb-qa", method: "POST", auth: "OAuth2.0", version: "v2.2.0", status: "published", calls: 32100, description: "基于知识库的智能问答", category: "运营支持" }
      ]
    },
    sdk: {
      sdks: [
        { language: "Java", version: "v2.1.0", updatedAt: "2026-06-20", downloads: 4823, docUrl: "#", exampleCode: "import com.example.ai.*;\n\nAIClient client = new AIClient(\"your-api-key\");\nCapabilityResult result = client.invoke(\"智能编目\",\n  Map.of(\"text\", \"数据集描述\"));\nSystem.out.println(result.getData());", package: "com.example:ai-sdk:2.1.0" },
        { language: "Python", version: "v2.1.0", updatedAt: "2026-06-20", downloads: 8921, docUrl: "#", exampleCode: "from ai_sdk import AIClient\n\nclient = AIClient(api_key=\"your-api-key\")\nresult = client.invoke(\"智能编目\",\n  text=\"数据集描述\")\nprint(result.data)", package: "pip install ai-sdk==2.1.0" },
        { language: "Go", version: "v1.8.0", updatedAt: "2026-06-15", downloads: 2341, docUrl: "#", exampleCode: "import \"github.com/example/ai-sdk-go\"\n\nclient := ai.NewClient(\"your-api-key\")\nresult, err := client.Invoke(\"智能编目\",\n  map[string]interface{}{\n    \"text\": \"数据集描述\",\n  })", package: "go get github.com/example/ai-sdk-go@v1.8.0" },
        { language: "Node.js", version: "v2.0.0", updatedAt: "2026-06-18", downloads: 6543, docUrl: "#", exampleCode: "const { AIClient } = require('ai-sdk');\n\nconst client = new AIClient({ apiKey: 'your-api-key' });\nconst result = await client.invoke('智能编目', {\n  text: '数据集描述'\n});", package: "npm install ai-sdk@2.0.0" },
        { language: "C#", version: "v1.5.0", updatedAt: "2026-06-10", downloads: 1567, docUrl: "#", exampleCode: "using AiSdk;\n\nvar client = new AIClient(\"your-api-key\");\nvar result = await client.InvokeAsync(\"智能编目\",\n  new { text = \"数据集描述\" });\nConsole.WriteLine(result.Data);", package: "dotnet add package AiSdk --version 1.5.0" }
      ]
    },
    playground: {
      mcpServers: [
        { id: "mcp-001", name: "文件系统MCP" },
        { id: "mcp-002", name: "数据库MCP" },
        { id: "mcp-003", name: "API网关MCP" },
        { id: "mcp-005", name: "邮件MCP" },
        { id: "mcp-006", name: "日志MCP" }
      ],
      sampleResponse: {
        success: true,
        data: {
          result: "智能分类完成，共处理 128 条数据记录。",
          tags: ["政务数据", "公共数据", "高价值数据集"],
          catalogLevel: 2,
          confidence: 0.94,
          processingTime: "45ms"
        },
        requestId: "req-20260628-102530-a1b2c3",
        latency: 45,
        tokens: { inputTokens: 320, outputTokens: 280 }
      }
    }
  }
};

async function loadMockData(filename) {
  const data = MockData[filename];
  if (data) return data;
  console.warn(`[Mock] No data for: ${filename}`);
  return null;
}

function getMockDataSync(filename) {
  return MockData[filename] || null;
}
