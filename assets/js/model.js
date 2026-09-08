/* =====================================================
   AI Capability Open Platform - Model Hub JavaScript
   Studio Style Interactions
   ===================================================== */

// Mock Data Store
let mockData = {
  overview: {},
  providers: [],
  models: [],
  parameters: {},
  playground: {},
  analytics: {},
  relations: []
};

// Current State
let currentState = {
  selectedModel: null,
  currentTab: 'library',
  playgroundInput: '',
  playgroundSystemPrompt: '',
  playgroundModel: 'model-001',
  playgroundParams: {},
  sortField: 'updatedAt',
  sortDirection: 'desc',
  currentPage: 1,
  pageSize: 5,
  typeFilter: 'all',
  testFilter: 'all'
};

// Inline Mock Data (fallback for file:// protocol)
const inlineMockData = {
  "overview": {
    "totalModels": 23, "onlineModels": 19, "providerCount": 8,
    "totalCalls": 1284560, "todayTokenConsumption": 45678920, "avgResponseTime": 187
  },
  "providers": [
    {"id": "provider-openai", "name": "OpenAI", "logo": "🧠", "status": "active", "modelsCount": 4, "description": "OpenAI GPT系列模型"},
    {"id": "provider-alibaba", "name": "阿里百炼", "logo": "🐉", "status": "active", "modelsCount": 5, "description": "阿里云通义千问系列"},
    {"id": "provider-deepseek", "name": "DeepSeek", "logo": "🔮", "status": "active", "modelsCount": 3, "description": "深度求索大模型"},
    {"id": "provider-zhipu", "name": "智谱AI", "logo": "💎", "status": "active", "modelsCount": 3, "description": "智谱清言大模型"},
    {"id": "provider-baidu", "name": "百度千帆", "logo": "🌊", "status": "active", "modelsCount": 4, "description": "百度文心大模型"},
    {"id": "provider-moonshot", "name": "Moonshot", "logo": "🌙", "status": "active", "modelsCount": 2, "description": "Moonshot AI大模型"},
    {"id": "provider-minimax", "name": "MiniMax", "logo": "🎯", "status": "active", "modelsCount": 2, "description": "MiniMax海螺大模型"},
    {"id": "provider-custom", "name": "自定义供应商", "logo": "🔧", "status": "active", "modelsCount": 1, "description": "用户自定义模型供应商"}
  ],
  "models": [
    {"id": "model-001", "series": "GPT-4", "version": "o", "name": "GPT-4o", "provider": "OpenAI", "providerId": "provider-openai", "type": "多模态", "contextWindow": "128K", "maxTokens": 4096, "status": "active", "isDefault": true, "updatedAt": "2026-06-20", "calls": 482300, "avgLatency": 185, "cost": 0.015, "description": "OpenAI 最新多模态大模型，支持文本和图像理解", "capabilities": ["vision", "function_calling", "json_mode", "streaming"], "pricing": {"input": 2.5, "output": 10}},
    {"id": "model-002", "series": "GPT-4", "version": "o-Mini", "name": "GPT-4o-Mini", "provider": "OpenAI", "providerId": "provider-openai", "type": "大语言模型", "contextWindow": "128K", "maxTokens": 4096, "status": "active", "isDefault": false, "updatedAt": "2026-06-18", "calls": 324100, "avgLatency": 120, "cost": 0.008, "description": "GPT-4o轻量版，高性价比", "capabilities": ["function_calling", "json_mode", "streaming"], "pricing": {"input": 0.15, "output": 0.6}},
    {"id": "model-005", "series": "Qwen", "version": "Max", "name": "Qwen-Max", "provider": "阿里百炼", "providerId": "provider-alibaba", "type": "大语言模型", "contextWindow": "100K", "maxTokens": 8192, "status": "active", "isDefault": true, "updatedAt": "2026-06-22", "calls": 281000, "avgLatency": 195, "cost": 0.008, "description": "阿里云通义千问旗舰模型，中文理解能力强", "capabilities": ["function_calling", "json_mode", "streaming", "mcp"], "pricing": {"input": 0.04, "output": 0.12}},
    {"id": "model-006", "series": "Qwen", "version": "Plus", "name": "Qwen-Plus", "provider": "阿里百炼", "providerId": "provider-alibaba", "type": "大语言模型", "contextWindow": "100K", "maxTokens": 4096, "status": "active", "isDefault": false, "updatedAt": "2026-06-20", "calls": 198300, "avgLatency": 150, "cost": 0.004, "description": "通义千问Plus版本，高性价比", "capabilities": ["function_calling", "json_mode", "streaming"], "pricing": {"input": 0.004, "output": 0.012}},
    {"id": "model-007", "series": "ERNIE-4", "version": "Turbo", "name": "ERNIE-4-Turbo", "provider": "百度千帆", "providerId": "provider-baidu", "type": "大语言模型", "contextWindow": "128K", "maxTokens": 4096, "status": "active", "isDefault": true, "updatedAt": "2026-06-19", "calls": 166440, "avgLatency": 210, "cost": 0.01, "description": "百度文心大模型4.0，政企场景适配度高", "capabilities": ["function_calling", "json_mode", "streaming"], "pricing": {"input": 0.02, "output": 0.06}},
    {"id": "model-008", "series": "ERNIE", "version": "Speed", "name": "ERNIE-Speed", "provider": "百度千帆", "providerId": "provider-baidu", "type": "大语言模型", "contextWindow": "128K", "maxTokens": 2048, "status": "active", "isDefault": false, "updatedAt": "2026-06-18", "calls": 98450, "avgLatency": 120, "cost": 0.006, "description": "百度高速推理模型", "capabilities": ["streaming"], "pricing": {"input": 0.008, "output": 0.02}},
    {"id": "model-009", "series": "DeepSeek", "version": "V2.5", "name": "DeepSeek-V2.5", "provider": "DeepSeek", "providerId": "provider-deepseek", "type": "大语言模型", "contextWindow": "128K", "maxTokens": 8192, "status": "active", "isDefault": true, "updatedAt": "2026-06-21", "calls": 245600, "avgLatency": 160, "cost": 0.005, "description": "深度求索开源大模型，性价比极高", "capabilities": ["function_calling", "json_mode", "streaming", "mcp"], "pricing": {"input": 0.001, "output": 0.002}},
    {"id": "model-010", "series": "GLM-4", "version": "Plus", "name": "GLM-4-Plus", "provider": "智谱AI", "providerId": "provider-zhipu", "type": "大语言模型", "contextWindow": "128K", "maxTokens": 4096, "status": "active", "isDefault": true, "updatedAt": "2026-06-20", "calls": 178900, "avgLatency": 180, "cost": 0.007, "description": "智谱清言旗舰模型", "capabilities": ["function_calling", "json_mode", "streaming"], "pricing": {"input": 0.01, "output": 0.01}},
    {"id": "model-012", "series": "Moonshot", "version": "k1.5", "name": "k1.5", "provider": "Moonshot", "providerId": "provider-moonshot", "type": "大语言模型", "contextWindow": "128K", "maxTokens": 16385, "status": "active", "isDefault": true, "updatedAt": "2026-06-20", "calls": 156300, "avgLatency": 175, "cost": 0.006, "description": "Moonshot AI 大模型，长上下文优秀", "capabilities": ["function_calling", "json_mode", "streaming"], "pricing": {"input": 0.003, "output": 0.006}},
    {"id": "model-013", "series": "MiniMax", "version": "abab6.5s", "name": "abab6.5s", "provider": "MiniMax", "providerId": "provider-minimax", "type": "大语言模型", "contextWindow": "100K", "maxTokens": 8192, "status": "active", "isDefault": true, "updatedAt": "2026-06-18", "calls": 89200, "avgLatency": 140, "cost": 0.005, "description": "MiniMax 海螺大模型", "capabilities": ["function_calling", "streaming"], "pricing": {"input": 0.001, "output": 0.002}},
    {"id": "model-016", "series": "Custom", "version": "v1", "name": "custom-llm-v1", "provider": "自定义供应商", "providerId": "provider-custom", "type": "大语言模型", "contextWindow": "32K", "maxTokens": 2048, "status": "inactive", "isDefault": false, "updatedAt": "2026-06-01", "calls": 0, "avgLatency": 0, "cost": 0.003, "description": "用户自定义LLM模型（当前未启用）", "capabilities": ["streaming"], "pricing": {"input": 0.001, "output": 0.002}}
  ],
  "parameters": {
    "temperature": {"label": "Temperature", "value": 0.7, "min": 0, "max": 2, "step": 0.1, "description": "控制输出随机性。值越低输出越确定、保守；值越高越发散、有创意，但可能偏离主题。"},
    "top_p": {"label": "Top P", "value": 1, "min": 0, "max": 1, "step": 0.05, "description": "核采样。值越小只从高概率token中采样，输出更聚焦保守；值越大候选范围越广，输出更多样。"},
    "top_k": {"label": "Top K", "value": 50, "min": 1, "max": 100, "step": 1, "description": "每步仅从概率最高的K个token中采样。K越小输出越确定；K越大多样性越高。"},
    "presence_penalty": {"label": "Presence Penalty", "value": 0, "min": -2, "max": 2, "step": 0.1, "description": "话题新鲜度惩罚。值越大模型越倾向引入新话题、减少重复主题；负值则相反。"},
    "frequency_penalty": {"label": "Frequency Penalty", "value": 0, "min": -2, "max": 2, "step": 0.1, "description": "词频惩罚。值越大越减少重复用词；负值则增加重复。"},
    "max_tokens": {"label": "Max Tokens", "value": 2048, "min": 1, "max": 32000, "step": 1, "description": "生成最大token数。值越大回答越长但耗时和成本越高；值过小可能截断回答。"},
    "seed": {"label": "Seed", "value": null, "min": 0, "max": 4294967295, "step": 1, "description": "随机种子，用于可复现输出。（留空则随机）"},
    "json_mode": {"label": "JSON Mode", "value": false, "description": "开启后强制模型输出合法JSON，适合结构化数据提取，可能略降创造性。"},
    "streaming": {"label": "Streaming", "value": true, "description": "开启后边生成边返回，首字延迟低、体验更流畅；关闭则等全部生成后一次性返回。"}
  },
  "playground": {
    "systemPrompt": "你是一个专业的AI助手，擅长回答各类问题，提供有用、准确的信息。",
    "selectedModel": "model-001",
    "messages": [
      {"role": "user", "content": "请用一段话介绍一下人工智能的发展历程，重点提及深度学习的突破。"},
      {"role": "assistant", "content": "人工智能的发展历程可以追溯到20世纪50年代。1956年的达特茅斯会议被视为AI作为一门学科的诞生标志。此后，AI经历了多次浪潮与寒冬。\n\n早期AI主要基于规则系统，能力有限。1980年代，机器学习开始兴起，但受限于算力和数据。\n\n2010年代是深度学习的时代。2012年，AlexNet在ImageNet竞赛中取得突破性成绩，引发了深度学习的革命。此后，卷积神经网络（CNN）、循环神经网络（RNN）、Transformer架构相继涌现。\n\n近年来，大语言模型（LLM）如GPT、Claude等相继问世，展现出惊人的通用能力。AI已广泛应用于计算机视觉、自然语言处理、自动驾驶、医疗诊断等领域，正深刻改变着人类社会的方方面面。"},
      {"role": "user", "content": "那在中国，有哪些比较知名的AI大模型？"},
      {"role": "assistant", "content": "中国AI大模型领域近年来发展迅速，出现了多个具有影响力的大模型：\n\n**互联网巨头系列：**\n• 百度「文心一言」(Ernie Bot) - 基于文心大模型，擅长中文理解与生成\n• 阿里「通义千问」(Tongyi Qianwen) - 阿里云推出，覆盖多种应用场景\n• 腾讯「混元」(Hunyuan) - 腾讯推出，与微信、QQ等生态深度整合\n• 字节跳动「云雀」- 今日头条、抖音等产品的AI能力支撑\n\n**科技公司与创业公司：**\n• 智谱AI「GLM-4」- 清华大学技术背景，中英双语表现优秀\n• 深度求索「DeepSeek-V2.5」- 开源模型，性能优异且成本效益高\n• 月之暗面「Kimi」- 长上下文处理能力突出，支持超长文本\n•  Minimax「海螺」- 在对话和内容创作方面表现不俗\n\n这些模型涵盖了通用对话、专业领域应用、长文本处理等多个方向，推动了中国AI技术的快速发展。"}
    ]
  },
  "analytics": {
    "today": {"calls": 12845, "tokens": 45678920, "avgLatency": 187, "successRate": 99.2, "cost": 128.56},
    "trend7Days": [
      {"date": "2026-06-22", "calls": 11200, "tokens": 38234500, "cost": 108.2},
      {"date": "2026-06-23", "calls": 12450, "tokens": 42567800, "cost": 118.5},
      {"date": "2026-06-24", "calls": 11890, "tokens": 39876500, "cost": 112.3},
      {"date": "2026-06-25", "calls": 13200, "tokens": 45678900, "cost": 135.8},
      {"date": "2026-06-26", "calls": 14560, "tokens": 51234600, "cost": 148.9},
      {"date": "2026-06-27", "calls": 13890, "tokens": 48901200, "cost": 142.1},
      {"date": "2026-06-28", "calls": 12845, "tokens": 45678920, "cost": 128.56}
    ],
    "topModels": [
      {"modelId": "model-001", "modelName": "GPT-4o", "calls": 482300, "percentage": 47.8},
      {"modelId": "model-005", "modelName": "Qwen-Max", "calls": 281000, "percentage": 27.9},
      {"modelId": "model-009", "modelName": "DeepSeek-V2.5", "calls": 245600, "percentage": 24.3}
    ],
    "tokenTrend": [
      {"date": "2026-06-22", "input": 28000000, "output": 10234500},
      {"date": "2026-06-23", "input": 31200000, "output": 11367800},
      {"date": "2026-06-24", "input": 29500000, "output": 10376500},
      {"date": "2026-06-25", "input": 33500000, "output": 12178900},
      {"date": "2026-06-26", "input": 37500000, "output": 13734600},
      {"date": "2026-06-27", "input": 35800000, "output": 13101200},
      {"date": "2026-06-28", "input": 33400000, "output": 12278920}
    ]
  },
  "relations": [
    {"modelId": "model-001", "modelName": "GPT-4o", "relations": [
      {"type": "capability", "id": "cap-001", "name": "智能问答", "count": 5},
      {"type": "prompt", "id": "prompt-001", "name": "通用助手Prompt", "count": 12},
      {"type": "mcp", "id": "mcp-001", "name": "Web Search", "count": 2}
    ]},
    {"modelId": "model-009", "modelName": "DeepSeek-V2.5", "relations": [
      {"type": "capability", "id": "cap-002", "name": "代码生成", "count": 8},
      {"type": "prompt", "id": "prompt-002", "name": "代码助手Prompt", "count": 6}
    ]},
    {"modelId": "model-005", "modelName": "Qwen-Max", "relations": [
      {"type": "capability", "id": "cap-003", "name": "中文理解", "count": 10},
      {"type": "prompt", "id": "prompt-003", "name": "中文写作Prompt", "count": 15},
      {"type": "mcp", "id": "mcp-002", "name": "Document Parser", "count": 3}
    ]}
  ]
};

// Initialize Model Hub
async function initModelHub() {
  try {
    const response = await fetch('../../mock/model.json');
    mockData = await response.json();
  } catch (error) {
    // Fallback to inline data for file:// protocol
    mockData = inlineMockData;
  }
  seedTestStatus();
  renderModelTable();
  initPlayground();
  initModelModalEvents();
}

// Seed connectivity-test metadata for existing records.
// Active models default to a passed test (正常); inactive ones remain untested (未检测).
function seedTestStatus() {
  mockData.models.forEach((model, idx) => {
    if (!model.testStatus) {
      model.testStatus = model.status === 'active' ? 'ok' : 'untested';
    }
    if (model.testStatus === 'ok' && !model.lastTestAt) {
      const base = model.updatedAt || '2026-06-01';
      const hh = String(9 + (idx % 8)).padStart(2, '0');
      model.lastTestAt = `${base} ${hh}:15`;
    }
  });
}

// Initialize Model Modal Events (switch label sync)
function initModelModalEvents() {
  // Model status switch toggle
  const modelStatusSwitch = document.getElementById('modelStatus');
  if (modelStatusSwitch) {
    modelStatusSwitch.addEventListener('change', () => {
      document.getElementById('modelStatusLabel').textContent = modelStatusSwitch.checked ? '启用' : '禁用';
    });
  }

  // Model default switch toggle
  const modelDefaultSwitch = document.getElementById('modelDefault');
  if (modelDefaultSwitch) {
    modelDefaultSwitch.addEventListener('change', () => {
      document.getElementById('modelDefaultLabel').textContent = modelDefaultSwitch.checked ? '是' : '否';
    });
  }
}

// Delete Confirm (model)
let pendingDeleteId = null;

function closeDeleteModal() {
  document.getElementById('deleteConfirmModal').classList.remove('show');
  pendingDeleteId = null;
}

function confirmDelete() {
  if (!pendingDeleteId) return;

  const model = mockData.models.find(m => m.id === pendingDeleteId);
  mockData.models = mockData.models.filter(m => m.id !== pendingDeleteId);
  closeDeleteModal();
  renderModelTable();
  showToast(`模型「${model?.name || ''}」已删除`, 'success');
}

// === Model Management ===
// Open Add Model Modal
function openAddModel() {
  document.getElementById('modelModalTitle').textContent = '添加模型';
  document.getElementById('modelForm').reset();
  document.getElementById('modelId').value = '';
  document.getElementById('modelStatus').checked = false;
  document.getElementById('modelStatusLabel').textContent = '禁用';
  document.getElementById('modelDefault').checked = false;
  document.getElementById('modelDefaultLabel').textContent = '否';
  document.getElementById('modelApiKey').type = 'password';
  document.getElementById('apiKeyToggleIcon').className = 'fa-solid fa-eye';
  resetModelConnTest();

  // Populate provider dropdown
  const providerSelect = document.getElementById('modelProvider');
  providerSelect.innerHTML = '<option value="">请选择供应商</option>' +
    mockData.providers.map(p => `<option value="${p.id}">${p.logo} ${p.name}</option>`).join('');

  document.getElementById('modelModal').classList.add('show');
}

// Edit Model
function editModel(modelId) {
  const model = mockData.models.find(m => m.id === modelId);
  if (!model) return;

  document.getElementById('modelModalTitle').textContent = '编辑模型';
  document.getElementById('modelId').value = model.id;
  document.getElementById('modelName').value = model.name;
  document.getElementById('modelType').value = model.type;
  document.getElementById('modelEndpoint').value = model.endpoint || '';
  document.getElementById('modelApiKey').value = model.apiKey || '';
  document.getElementById('modelApiKey').type = 'password';
  document.getElementById('apiKeyToggleIcon').className = 'fa-solid fa-eye';
  document.getElementById('modelDescription').value = model.description || '';
  document.getElementById('modelStatus').checked = model.status === 'active';
  document.getElementById('modelStatusLabel').textContent = model.status === 'active' ? '启用' : '禁用';
  document.getElementById('modelDefault').checked = model.isDefault;
  document.getElementById('modelDefaultLabel').textContent = model.isDefault ? '是' : '否';
  resetModelConnTest(model.testStatus === 'ok' ? 'ok' : 'off');

  // Populate provider dropdown
  const providerSelect = document.getElementById('modelProvider');
  providerSelect.innerHTML = '<option value="">请选择供应商</option>' +
    mockData.providers.map(p => `<option value="${p.id}" ${p.id === model.providerId ? 'selected' : ''}>${p.logo} ${p.name}</option>`).join('');

  document.getElementById('modelModal').classList.add('show');
}

// Reset the in-modal connectivity test chip
// state: 'ok' | 'off' | '' (idle)
function resetModelConnTest(state = '') {
  const btn = document.getElementById('modelConnTestBtn');
  const res = document.getElementById('modelConnTestResult');
  if (btn) btn.disabled = false;
  if (!res) return;
  res.className = 'model-conn-badge';
  res.innerHTML = '';
  if (state === 'ok') {
    res.className = 'model-conn-badge ok';
    res.innerHTML = '<i class="fa-solid fa-circle-check"></i> 正常';
  } else if (state === 'off') {
    res.className = 'model-conn-badge off';
    res.innerHTML = '<i class="fa-solid fa-circle"></i> 未检测';
  }
}

// Run in-modal connectivity test (mock, always passes on success)
function runModelConnTest() {
  const btn = document.getElementById('modelConnTestBtn');
  const res = document.getElementById('modelConnTestResult');
  const name = (document.getElementById('modelName')?.value || '').trim();
  const providerId = document.getElementById('modelProvider')?.value || '';
  const type = document.getElementById('modelType')?.value || '';

  if (!name || !providerId || !type) {
    showToast('请先填写模型名称、供应商和类型', 'warning');
    return;
  }
  if (!btn || !res) return;

  btn.disabled = true;
  res.className = 'model-conn-badge testing';
  res.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 检测中';
  showToast('正在执行连通性测试…', 'info');

  setTimeout(() => {
    btn.disabled = false;
    res.className = 'model-conn-badge ok';
    res.innerHTML = '<i class="fa-solid fa-circle-check"></i> 正常';

    // Auto-enable model on pass
    const statusSwitch = document.getElementById('modelStatus');
    if (statusSwitch && !statusSwitch.checked) {
      statusSwitch.checked = true;
      document.getElementById('modelStatusLabel').textContent = '启用';
    }
    showToast('连通性测试通过，模型已启用', 'success');
  }, 900);
}

// Toggle API Key visibility
function toggleApiKeyVisibility() {
  const input = document.getElementById('modelApiKey');
  const icon = document.getElementById('apiKeyToggleIcon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
}

// Close Model Modal
function closeModelModal() {
  document.getElementById('modelModal').classList.remove('show');
}

// Save Model
function saveModel() {
  const id = document.getElementById('modelId').value;
  const name = document.getElementById('modelName').value.trim();
  const providerId = document.getElementById('modelProvider').value;
  const type = document.getElementById('modelType').value;
  const endpoint = document.getElementById('modelEndpoint').value.trim();
  const apiKey = document.getElementById('modelApiKey').value.trim();
  const description = document.getElementById('modelDescription').value.trim();
  const status = document.getElementById('modelStatus').checked ? 'active' : 'inactive';
  const isDefault = document.getElementById('modelDefault').checked;

  if (!name || !providerId || !type) {
    showToast('请填写必填项', 'warning');
    return;
  }

  const provider = mockData.providers.find(p => p.id === providerId);

  if (id) {
    // Update existing
    const model = mockData.models.find(m => m.id === id);
    if (model) {
      model.name = name;
      model.providerId = providerId;
      model.provider = provider ? provider.name : '';
      model.type = type;
      model.endpoint = endpoint;
      model.apiKey = apiKey;
      model.description = description;
      model.status = status;
      model.isDefault = isDefault;
      model.updatedAt = new Date().toISOString().split('T')[0];

      // If set as default, unset others
      if (isDefault) {
        mockData.models.forEach(m => {
          if (m.id !== id) m.isDefault = false;
        });
      }

      showToast('模型更新成功', 'success');
    }
  } else {
    // Create new
    const newId = 'model-' + Date.now();
    mockData.models.push({
      id: newId,
      name,
      providerId,
      provider: provider ? provider.name : '',
      type,
      endpoint,
      apiKey,
      description,
      status,
      isDefault,
      updatedAt: new Date().toISOString().split('T')[0],
      calls: 0,
      avgLatency: 0,
      cost: 0.001,
      capabilities: [],
      pricing: { input: 0.001, output: 0.002 },
      testStatus: status === 'active' ? 'ok' : 'untested',
      lastTestAt: status === 'active' ? formatDateTime(new Date()) : null
    });

    // Update provider models count
    if (provider) {
      provider.modelsCount++;
    }

    // If set as default, unset others
    if (isDefault) {
      mockData.models.forEach(m => {
        if (m.id !== newId) m.isDefault = false;
      });
    }

    showToast('模型添加成功', 'success');
  }

  closeModelModal();
  renderModelTable();
}

// Delete Model
function deleteModel(modelId) {
  pendingDeleteId = modelId;
  const model = mockData.models.find(m => m.id === modelId);
  document.getElementById('deleteConfirmText').textContent =
    `确定要删除模型「${model?.name}」吗？删除后，与该模型关联的AI能力也将解除关联。此操作不可撤销。`;
  document.getElementById('deleteConfirmModal').classList.add('show');
}

// Render Model Table
function renderModelTable() {
  const container = document.getElementById('modelTableBody');
  if (!container) return;

  let models = mockData.models;

  // Apply search filter
  const searchInput = document.getElementById('modelSearch');
  if (searchInput && searchInput.value.trim()) {
    const query = searchInput.value.toLowerCase();
    models = models.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.provider.toLowerCase().includes(query) ||
      m.type.toLowerCase().includes(query)
    );
  }

  // Apply type filter (dropdown)
  if (currentState.typeFilter !== 'all') {
    models = models.filter(m => m.type === currentState.typeFilter);
  }

  // Apply test/status filter (dropdown)
  if (currentState.testFilter !== 'all') {
    if (currentState.testFilter === 'online') {
      models = models.filter(m => m.status === 'active');
    } else if (currentState.testFilter === 'offline') {
      models = models.filter(m => m.status === 'inactive');
    } else if (currentState.testFilter === 'default') {
      models = models.filter(m => m.isDefault);
    }
  }

  // Apply sorting
  models = [...models].sort((a, b) => {
    let valA = a[currentState.sortField];
    let valB = b[currentState.sortField];

    if (currentState.sortField === 'name' || currentState.sortField === 'type') {
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
    }

    if (valA < valB) return currentState.sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return currentState.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate pagination
  const totalItems = models.length;
  const totalPages = Math.ceil(totalItems / currentState.pageSize) || 1;
  if (currentState.currentPage > totalPages) currentState.currentPage = 1;

  const startIndex = (currentState.currentPage - 1) * currentState.pageSize;
  const endIndex = startIndex + currentState.pageSize;
  const paginatedModels = models.slice(startIndex, endIndex);

  if (models.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="model-empty-state">
            <div class="model-empty-state-icon"><i class="fa-solid fa-microchip"></i></div>
            <div class="model-empty-state-title">未找到模型</div>
            <div class="model-empty-state-desc">请尝试调整搜索或筛选条件</div>
          </div>
        </td>
      </tr>
    `;
    document.getElementById('modelPagination')?.remove();
    return;
  }

  container.innerHTML = paginatedModels.map(model => {
    const provider = mockData.providers.find(p => p.id === model.providerId);

    // Test status resolution: explicit field, else derive from enable state
    const testStatus = model.testStatus || (model.status === 'active' ? 'ok' : 'untested');
    const testMetaMap = {
      ok:       { cls: 'ok',       icon: 'fa-solid fa-circle-check', text: '正常' },
      untested: { cls: 'off',      icon: 'fa-solid fa-circle',       text: '未检测' },
      testing:  { cls: 'testing',  icon: 'fa-solid fa-spinner fa-spin', text: '检测中' },
      fail:     { cls: 'fail',     icon: 'fa-solid fa-circle-xmark', text: '异常' }
    };
    const testMeta = testMetaMap[testStatus] || testMetaMap.untested;
    const isTesting = testStatus === 'testing';
    const testTime = (testStatus === 'ok' && (model.lastTestAt || model.updatedAt)) || '';

    return `
    <tr class="${currentState.selectedModel === model.id ? 'selected' : ''}"
        data-model-id="${model.id}"
        onclick="selectModel('${model.id}')">
      <td>
        <div class="model-name-cell">
          <div>
            <div class="model-name">${model.name}</div>
            ${model.series ? `<div class="model-series-badge">${model.series}${model.version ? ' · ' + model.version : ''}</div>` : ''}
          </div>
        </div>
      </td>
      <td>
        <div class="model-provider-cell">
          <span>${model.provider || '未分配'}</span>
        </div>
      </td>
      <td>
        <span class="model-type-badge ${model.type === '多模态' ? 'multimodal' : model.type === '大语言模型' ? 'llm' : 'embedding'}">
          ${model.type}
        </span>
      </td>
      <td>
        <div class="model-test-result">
          <span class="model-conn-badge ${testMeta.cls}">
            <i class="${testMeta.icon}"></i> ${testMeta.text}
          </span>
          ${testTime ? `<span class="model-test-time" title="最近检测时间">${testTime}</span>` : ''}
        </div>
      </td>
      <td>
        ${model.isDefault ? '<span class="model-default-badge"><i class="fa-solid fa-star"></i> 默认</span>' : '-'}
      </td>
      <td>${model.updatedAt}</td>
      <td>
        <div class="model-op-cell">
          <div class="model-action-btns">
            <button class="btn btn-icon btn-sm" onclick="event.stopPropagation(); openModelDetail('${model.id}')" title="查看详情">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-icon btn-sm" onclick="event.stopPropagation(); runModelTest('${model.id}')" title="连通性测试" ${isTesting ? 'disabled' : ''}>
              <i class="fa-solid ${isTesting ? 'fa-spinner fa-spin' : 'fa-bolt'}"></i>
            </button>
            <button class="btn btn-icon btn-sm" onclick="event.stopPropagation(); editModel('${model.id}')" title="编辑">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-icon btn-sm" onclick="event.stopPropagation(); deleteModel('${model.id}')" title="删除">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </td>
    </tr>
  `;
  }).join('');

  // Render pagination
  renderPagination(totalItems, totalPages);
}

// Render Pagination
function renderPagination(totalItems, totalPages) {
  let pagination = document.getElementById('modelPagination');
  if (!pagination) {
    pagination = document.createElement('div');
    pagination.id = 'modelPagination';
    pagination.className = 'model-pagination';
    const tableWrapper = document.querySelector('.model-table-wrapper');
    tableWrapper.parentNode.insertBefore(pagination, tableWrapper.nextSibling);
  }

  const startItem = (currentState.currentPage - 1) * currentState.pageSize + 1;
  const endItem = Math.min(currentState.currentPage * currentState.pageSize, totalItems);

  pagination.innerHTML = `
    <div class="pagination-info">
      显示 ${startItem}-${endItem} 条，共 ${totalItems} 条
    </div>
    <div class="pagination-controls">
      <button class="btn btn-sm btn-secondary" onclick="goToPage(1)" ${currentState.currentPage === 1 ? 'disabled' : ''}>
        <i class="fa-solid fa-angle-left"></i><i class="fa-solid fa-angle-left"></i>
      </button>
      <button class="btn btn-sm btn-secondary" onclick="goToPage(currentState.currentPage - 1)" ${currentState.currentPage === 1 ? 'disabled' : ''}>
        <i class="fa-solid fa-angle-left"></i>
      </button>
      <span class="pagination-pages">第 ${currentState.currentPage} / ${totalPages} 页</span>
      <button class="btn btn-sm btn-secondary" onclick="goToPage(currentState.currentPage + 1)" ${currentState.currentPage === totalPages ? 'disabled' : ''}>
        <i class="fa-solid fa-angle-right"></i>
      </button>
      <button class="btn btn-sm btn-secondary" onclick="goToPage(${totalPages})" ${currentState.currentPage === totalPages ? 'disabled' : ''}>
        <i class="fa-solid fa-angle-right"></i><i class="fa-solid fa-angle-right"></i>
      </button>
    </div>
  `;
}

// Go to specific page
function goToPage(page) {
  const models = getFilteredModels();
  const totalPages = Math.ceil(models.length / currentState.pageSize) || 1;
  if (page < 1 || page > totalPages) return;
  currentState.currentPage = page;
  renderModelTable();
}

// Get filtered models (for pagination)
function getFilteredModels() {
  let models = mockData.models;

  const searchInput = document.getElementById('modelSearch');
  if (searchInput && searchInput.value.trim()) {
    const query = searchInput.value.toLowerCase();
    models = models.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.provider.toLowerCase().includes(query) ||
      m.type.toLowerCase().includes(query)
    );
  }

  if (currentState.typeFilter !== 'all') {
    models = models.filter(m => m.type === currentState.typeFilter);
  }

  if (currentState.testFilter !== 'all') {
    if (currentState.testFilter === 'online') {
      models = models.filter(m => m.status === 'active');
    } else if (currentState.testFilter === 'offline') {
      models = models.filter(m => m.status === 'inactive');
    } else if (currentState.testFilter === 'default') {
      models = models.filter(m => m.isDefault);
    }
  }

  return models;
}

// Run connectivity test for a model row (mock, always passes after delay)
function runModelTest(modelId) {
  const model = mockData.models.find(m => m.id === modelId);
  if (!model || model.testStatus === 'testing') return;

  model.testStatus = 'testing';
  renderModelTable();
  showToast(`正在对「${model.name}」执行连通性测试…`, 'info');

  setTimeout(() => {
    // Mock result: always passes
    model.testStatus = 'ok';
    model.status = 'active';
    model.lastTestAt = formatDateTime(new Date());
    model.updatedAt = model.updatedAt || new Date().toISOString().split('T')[0];
    renderModelTable();
    showToast(`「${model.name}」连通性测试通过，连接正常`, 'success');
  }, 900);
}

// Format a Date into 'YYYY-MM-DD HH:mm'
function formatDateTime(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Select Model from Table
function selectModel(modelId) {
  currentState.selectedModel = currentState.selectedModel === modelId ? null : modelId;
  renderModelTable();
}

// Open Model Detail Drawer
function openModelDetail(modelId) {
  const model = mockData.models.find(m => m.id === modelId);
  if (!model) return;

  const drawer = document.getElementById('modelDetailDrawer');
  const overlay = document.getElementById('drawerOverlay');

  // Render drawer content
  const content = document.getElementById('modelDetailContent');
  content.innerHTML = renderModelDetailContent(model);

  // Show drawer
  drawer.classList.add('show');
  overlay.classList.add('show');

  // Store current model
  currentState.selectedModel = modelId;
  renderModelTable();
}

// Close Model Detail Drawer
function closeModelDetail() {
  const drawer = document.getElementById('modelDetailDrawer');
  const overlay = document.getElementById('drawerOverlay');

  drawer.classList.remove('show');
  overlay.classList.remove('show');
}

// Render Model Detail Content
function renderModelDetailContent(model) {
  const provider = mockData.providers.find(p => p.id === model.providerId);
  const relation = mockData.relations.find(r => r.modelId === model.id);

  const capabilityLabels = {
    'vision': '视觉理解',
    'function_calling': 'Function Calling',
    'json_mode': 'JSON Mode',
    'streaming': '流式输出',
    'mcp': 'MCP支持',
    'embedding': '向量嵌入'
  };

  // Mask endpoint for display
  const displayEndpoint = model.endpoint ?
    model.endpoint.replace(/^(https?:\/\/)/, '').split('/')[0].replace(/.[a-z0-9-]/i, '***') : '未配置';

  return `
    <div class="model-detail-header">
      <div class="model-detail-icon">${provider ? provider.logo : '🤖'}</div>
      <div class="model-detail-info">
        <div class="model-detail-name">${model.name}</div>
        <div class="model-detail-desc">${model.description || '暂无描述'}</div>
        <div class="model-detail-badges">
          <span class="tag tag-primary">${model.type}</span>
          <span class="tag ${model.status === 'active' ? 'tag-success' : 'tag-gray'}">
            ${model.status === 'active' ? '在线' : '离线'}
          </span>
          ${model.isDefault ? '<span class="tag tag-info"><i class="fa-solid fa-star"></i> 默认模型</span>' : ''}
        </div>
      </div>
    </div>

    <div class="model-detail-actions">
      <button class="btn btn-sm btn-secondary" onclick="testModel('${model.id}'); closeModelDetail();">
        <i class="fa-solid fa-play"></i> 在线测试
      </button>
      <button class="btn btn-sm btn-secondary" onclick="closeModelDetail(); editModel('${model.id}');">
        <i class="fa-solid fa-pen"></i> 编辑
      </button>
    </div>

    <div class="model-detail-section">
      <div class="model-detail-section-title">
        <i class="fa-solid fa-chart-bar"></i> 使用统计
      </div>
      <div class="model-detail-stats">
        <div class="model-detail-stat">
          <div class="model-detail-stat-value">${formatNumber(model.calls)}</div>
          <div class="model-detail-stat-label">累计调用</div>
        </div>
        <div class="model-detail-stat">
          <div class="model-detail-stat-value">${model.avgLatency}ms</div>
          <div class="model-detail-stat-label">平均延迟</div>
        </div>
      </div>
    </div>

    <div class="model-detail-section">
      <div class="model-detail-section-title">
        <i class="fa-solid fa-key"></i> API配置
      </div>
      <div class="model-params-grid">
        <div class="model-param-item">
          <div class="model-param-label">API Endpoint</div>
          <div class="model-param-value endpoint-value">
            ${displayEndpoint}
            ${model.endpoint ? `<button class="btn-copy" onclick="copyToClipboard('${model.endpoint}')" title="复制完整地址"><i class="fa-solid fa-copy"></i></button>` : ''}
          </div>
        </div>
        <div class="model-param-item">
          <div class="model-param-label">供应商</div>
          <div class="model-param-value">${model.provider || '未分配'}</div>
        </div>
        <div class="model-param-item">
          <div class="model-param-label">模型类型</div>
          <div class="model-param-value">${model.type}</div>
        </div>
        <div class="model-param-item">
          <div class="model-param-label">更新时间</div>
          <div class="model-param-value">${model.updatedAt}</div>
        </div>
      </div>
    </div>

    <div class="model-detail-section">
      <div class="model-detail-section-title">
        <i class="fa-solid fa-star"></i> 支持能力
      </div>
      <div class="model-capabilities">
        ${['vision', 'function_calling', 'json_mode', 'streaming', 'mcp', 'embedding'].map(cap => `
          <span class="model-capability-tag ${model.capabilities && model.capabilities.includes(cap) ? 'supported' : ''}">
            ${model.capabilities && model.capabilities.includes(cap) ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-minus"></i>'}
            ${capabilityLabels[cap]}
          </span>
        `).join('')}
      </div>
    </div>
  `;
}

// Copy to clipboard helper
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('已复制到剪贴板', 'success');
  }).catch(() => {
    showToast('复制失败', 'error');
  });
}

// Test Model (Switch to Playground)
function testModel(modelId) {
  switchTab('playground');
  currentState.playgroundModel = modelId;
  const select = document.getElementById('playgroundModelSelect');
  if (select) {
    select.value = modelId;
  }
}

// Switch Tabs
function switchTab(tabName) {
  currentState.currentTab = tabName;

  // Update tab buttons
  document.querySelectorAll('.model-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update tab content
  document.querySelectorAll('.model-tabs-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tabName}`);
  });
}

// Initialize Playground
function initPlayground() {
  const systemPromptTextarea = document.getElementById('playgroundSystemPrompt');
  const userPromptTextarea = document.getElementById('playgroundUserPrompt');
  const modelSelect = document.getElementById('playgroundModelSelect');
  const runBtn = document.getElementById('playgroundRunBtn');

  // Set system prompt
  if (systemPromptTextarea) {
    systemPromptTextarea.value = mockData.playground.systemPrompt;
    currentState.playgroundSystemPrompt = mockData.playground.systemPrompt;
  }

  // Pre-fill user prompt with last user message (for demo purposes)
  if (userPromptTextarea) {
    const messages = mockData.playground.messages || [];
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      userPromptTextarea.value = lastUserMsg.content;
    }
  }

  if (modelSelect) {
    const activeModels = mockData.models.filter(m => m.status === 'active');
    modelSelect.innerHTML = activeModels
      .map(m => `<option value="${m.id}">${m.provider} - ${m.name}</option>`)
      .join('');
    // Default-select the model marked as default (fallback to first active)
    const defaultModel = activeModels.find(m => m.isDefault) || activeModels[0];
    currentState.playgroundModel = defaultModel ? defaultModel.id : currentState.playgroundModel;
    modelSelect.value = currentState.playgroundModel;
    modelSelect.addEventListener('change', () => {
      currentState.playgroundModel = modelSelect.value;
    });
  }

  // Initialize parameters
  currentState.playgroundParams = { ...mockData.parameters };

  if (runBtn) {
    runBtn.addEventListener('click', runPlayground);
  }

  // Initial render
  renderPlaygroundResponse();
  renderPlaygroundParams();
}

// Run Playground Test
function runPlayground() {
  const runBtn = document.getElementById('playgroundRunBtn');
  const userPrompt = document.getElementById('playgroundUserPrompt')?.value.trim();
  const modelSelect = document.getElementById('playgroundModelSelect');

  if (!userPrompt) {
    showToast('请输入Prompt内容', 'warning');
    return;
  }

  // Show loading state
  runBtn.classList.add('btn-loading');
  runBtn.disabled = true;

  // Mock API call delay
  setTimeout(() => {
    runBtn.classList.remove('btn-loading');
    runBtn.disabled = false;

    // Generate mock response
    const model = mockData.models.find(m => m.id === currentState.playgroundModel);
    const mockResponse = generateMockResponse(userPrompt, model);

    // Append to messages history
    if (!mockData.playground.messages) {
      mockData.playground.messages = [];
    }
    mockData.playground.messages.push({ role: 'user', content: userPrompt });
    mockData.playground.messages.push({ role: 'assistant', content: mockResponse.text });

    // Clear input
    document.getElementById('playgroundUserPrompt').value = '';

    renderPlaygroundResponse();
    showToast('测试完成（Mock数据）', 'success');
  }, 1500);
}

// Generate Mock Response
function generateMockResponse(prompt, model) {
  const responses = [
    `这是一个基于 ${model?.name || 'GPT-4o'} 的Mock响应。您输入的Prompt是："${prompt.substring(0, 50)}..."\n\nModel Hub Playground支持在线测试模型能力。所有调用均为Mock数据，仅供演示目的。`,
    `根据您的输入 "${prompt.substring(0, 30)}..." }，这是来自 ${model?.name || 'GPT-4o'} 的响应。\n\n模型配置：\n- Temperature: ${currentState.playgroundParams.temperature?.value || 0.7}\n- Max Tokens: ${currentState.playgroundParams.max_tokens?.value || 2048}\n\n这是一段模拟的AI响应内容，用于展示Playground功能。`,
    `您正在测试 ${model?.name || 'GPT-4o'} 模型。\n\n收到输入: ${prompt}\n\n支持的特性: ${model?.capabilities?.join(', ') || 'function_calling, json_mode, streaming'}\n\nMock响应内容...`
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  const tokens = {
    prompt: Math.floor(prompt.length / 4),
    completion: Math.floor(randomResponse.length / 4),
    total: 0
  };
  tokens.total = tokens.prompt + tokens.completion;

  const cost = (tokens.prompt * (model?.pricing?.input || 0.001) + tokens.completion * (model?.pricing?.output || 0.002)) / 1000;

  return {
    text: randomResponse,
    time: Math.floor(Math.random() * 2000) + 500,
    tokens,
    cost
  };
}

// Render Playground Response
function renderPlaygroundResponse() {
  const container = document.getElementById('playgroundMessages');
  if (!container) return;

  const messages = mockData.playground.messages || [];
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');

  // Calculate stats from last response
  const tokens = lastAssistant ? {
    prompt: Math.floor(lastAssistant.content.length / 4 * 0.4),
    completion: Math.floor(lastAssistant.content.length / 4 * 0.6),
    total: 0
  } : { prompt: 0, completion: 0, total: 0 };
  tokens.total = tokens.prompt + tokens.completion;

  const responseTime = Math.floor(800 + Math.random() * 1200);
  const model = mockData.models.find(m => m.id === currentState.playgroundModel);
  const cost = (tokens.total * (model?.pricing?.input || 0.001)) / 1000;

  // Render all messages
  container.innerHTML = messages.map(msg => {
    if (msg.role === 'user') {
      return `
        <div class="playground-message user">
          <div class="playground-message-avatar">
            <i class="fa-solid fa-user"></i>
          </div>
          <div class="playground-message-content">${msg.content.replace(/\n/g, '<br>')}</div>
        </div>
      `;
    } else {
      return `
        <div class="playground-message assistant">
          <div class="playground-message-avatar">
            <i class="fa-solid fa-robot"></i>
          </div>
          <div class="playground-message-content">${msg.content.replace(/\n/g, '<br>')}</div>
        </div>
      `;
    }
  }).join('');

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;

  // Update stats
  const statsContainer = document.getElementById('playgroundResponseStats');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="response-stat">
        <div class="response-stat-icon time">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div class="response-stat-info">
          <div class="response-stat-value">${responseTime}ms</div>
          <div class="response-stat-label">耗时</div>
        </div>
      </div>
      <div class="response-stat">
        <div class="response-stat-icon tokens">
          <i class="fa-solid fa-font"></i>
        </div>
        <div class="response-stat-info">
          <div class="response-stat-value">${tokens.total}</div>
          <div class="response-stat-label">Tokens</div>
        </div>
      </div>
      <div class="response-stat">
        <div class="response-stat-icon cost">
          <i class="fa-solid fa-dollar-sign"></i>
        </div>
        <div class="response-stat-info">
          <div class="response-stat-value">¥${cost.toFixed(4)}</div>
          <div class="response-stat-label">预估成本</div>
        </div>
      </div>
      <div class="response-stat">
        <div class="response-stat-icon speed">
          <i class="fa-solid fa-gauge-high"></i>
        </div>
        <div class="response-stat-info">
          <div class="response-stat-value">${tokens.total > 0 ? Math.round(tokens.total / (responseTime / 1000)) : 0}/s</div>
          <div class="response-stat-label">生成速度</div>
        </div>
      </div>
    `;
  }
}

// Render Playground Parameters
function renderPlaygroundParams() {
  const container = document.getElementById('playgroundParamsList');
  if (!container) return;

  const params = mockData.parameters;

  // Numeric/range parameters (preserve display order)
  const rangeParams = ['temperature', 'top_p', 'top_k', 'max_tokens', 'presence_penalty', 'frequency_penalty'];
  // Boolean toggle parameters
  const toggleParams = ['json_mode', 'streaming'];

  const infoIcon = (desc) => desc
    ? `<i class="fa-solid fa-circle-info param-info" title="${desc}"></i>`
    : '';

  const rangeHtml = rangeParams.map(key => {
    const p = params[key];
    if (!p) return '';
    return `
      <div class="param-group">
        <div class="param-label-row">
          <span class="param-label">${p.label} ${infoIcon(p.description)}</span>
          <span class="param-value">${p.value}</span>
        </div>
        <input type="range" class="param-slider"
               id="param-${key}"
               min="${p.min}"
               max="${p.max}"
               step="${p.step}"
               value="${p.value}"
               onchange="updateParam('${key}', this.value)">
      </div>
    `;
  }).join('');

  const toggleHtml = toggleParams.map(key => {
    const p = params[key];
    if (!p) return '';
    return `
      <div class="param-toggle">
        <span class="param-toggle-label">${p.label} ${infoIcon(p.description)}</span>
        <input type="checkbox" class="form-switch"
               id="param-${key}"
               ${p.value ? 'checked' : ''}
               onchange="updateParam('${key}', this.checked)">
      </div>
    `;
  }).join('');

  container.innerHTML = rangeHtml + toggleHtml;
}

// Update Parameter
function updateParam(paramName, value) {
  const param = mockData.parameters[paramName];
  if (!param) return;

  if (typeof param.value === 'boolean') {
    param.value = Boolean(value);
  } else if (typeof param.value === 'number') {
    param.value = parseFloat(value);
  } else {
    param.value = value;
  }

  // Update display
  const label = document.querySelector(`.param-group:has(#param-${paramName}) .param-value`);
  if (label) {
    label.textContent = param.value;
  }

  currentState.playgroundParams[paramName] = param;
}

// Filter dropdown handlers
function handleTypeFilterChange(value) {
  currentState.typeFilter = value;
  currentState.currentPage = 1;
  renderModelTable();
}

function handleTestFilterChange(value) {
  currentState.testFilter = value;
  currentState.currentPage = 1;
  renderModelTable();
}

// Legacy filter click (kept for compatibility)
function handleFilterClick(filterType) {
  if (filterType === 'online') {
    document.getElementById('testFilterSelect').value = 'online';
    currentState.testFilter = 'online';
  } else if (filterType === 'offline') {
    document.getElementById('testFilterSelect').value = 'offline';
    currentState.testFilter = 'offline';
  } else if (filterType === 'default') {
    document.getElementById('testFilterSelect').value = 'default';
    currentState.testFilter = 'default';
  } else {
    document.getElementById('typeFilterSelect').value = filterType === 'all' ? 'all' : filterType;
    currentState.typeFilter = filterType;
  }
  currentState.currentPage = 1;
  renderModelTable();
}

// Search handler
function handleSearch() {
  currentState.currentPage = 1;
  renderModelTable();
}

// Sort dropdown toggle
function toggleSortDropdown() {
  const menu = document.getElementById('sortDropdownMenu');
  menu.classList.toggle('show');
  closeOtherDropdowns('sortDropdownMenu');
}

// Handle sort
function handleSort(field, direction) {
  currentState.sortField = field;
  currentState.sortDirection = direction;
  currentState.currentPage = 1;

  // Update sort indicator icons
  document.querySelectorAll('.model-table th.sortable').forEach(th => {
    const thField = th.dataset.sort;
    const icon = th.querySelector('i');
    if (thField === field) {
      icon.className = direction === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down';
    } else {
      icon.className = 'fa-solid fa-sort';
    }
  });

  // Close dropdown
  document.getElementById('sortDropdownMenu').classList.remove('show');
  renderModelTable();
}

// Close dropdowns when clicking outside
function closeOtherDropdowns(exceptId) {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    if (menu.id !== exceptId) {
      menu.classList.remove('show');
    }
  });
}

// Click outside to close dropdowns
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
  }
});

// Helper function
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Toast notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer') || createToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initModelHub);

// Switch Playground Tab (user/system prompt)
function switchPlaygroundTab(tab) {
  document.querySelectorAll('.playground-prompt-tabs .playground-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  document.getElementById('userPromptWrapper').style.display = tab === 'user' ? 'flex' : 'none';
  document.getElementById('systemPromptWrapper').style.display = tab === 'system' ? 'flex' : 'none';
}

// Switch Playground Sidebar Tab (prompt/params/response)
function switchPlaygroundSidebarTab(tab) {
  document.querySelectorAll('.playground-sidebar-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  document.getElementById('playgroundPanelPrompt').style.display = tab === 'prompt' ? 'block' : 'none';
  document.getElementById('playgroundPanelParams').style.display = tab === 'params' ? 'block' : 'none';
  document.getElementById('playgroundPanelResponse').style.display = tab === 'response' ? 'block' : 'none';
}

// Clear Playground Input
function clearPlaygroundInput() {
  const activeTab = document.querySelector('.playground-tab.active');
  if (activeTab && activeTab.dataset.tab === 'user') {
    document.getElementById('playgroundUserPrompt').value = '';
  }
}

// Export functions for global access
window.selectModel = selectModel;
window.openModelDetail = openModelDetail;
window.closeModelDetail = closeModelDetail;
window.testModel = testModel;
window.switchTab = switchTab;
window.handleFilterClick = handleFilterClick;
window.handleSearch = handleSearch;
window.updateParam = updateParam;
window.runModelTest = runModelTest;
window.runModelConnTest = runModelConnTest;
window.resetModelConnTest = resetModelConnTest;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.openAddModel = openAddModel;
window.editModel = editModel;
window.closeModelModal = closeModelModal;
window.saveModel = saveModel;
window.deleteModel = deleteModel;
window.copyToClipboard = copyToClipboard;
window.handleSort = handleSort;
window.toggleSortDropdown = toggleSortDropdown;
window.toggleApiKeyVisibility = toggleApiKeyVisibility;
window.switchPlaygroundTab = switchPlaygroundTab;
window.switchPlaygroundSidebarTab = switchPlaygroundSidebarTab;
window.clearPlaygroundInput = clearPlaygroundInput;
window.goToPage = goToPage;
window.currentState = currentState;
