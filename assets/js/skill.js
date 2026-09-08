/* =====================================================
   AI Capability Open Platform - Skill 管理
   Skill = 可复用的「专业任务能力」
   数据层 + 共享工具 + Skill管理列表页逻辑
   ===================================================== */

/* ---------- 基础常量 ---------- */
const SKILL_TYPES = ['数据处理', '内容生成', '数据分析', '数据治理', '知识问答', '其他'];

const SKILL_STATUS_META = {
  draft: { label: '草稿', cls: 'draft' },
  published: { label: '已发布', cls: 'published' },
  stopped: { label: '已停用', cls: 'stopped' }
};

const STORE_KEY = 'acp_skill_store';
const DRAFT_KEY = 'acp_skill_draft';

/* ---------- 引用资源目录 ----------
   Skill 复用平台既有素材：模型 / Prompt / 知识库 / MCP工具 / Agent。
   此处仅维护 Skill 模块引用所需的最小目录，避免重复建设。 */
const SkillCatalog = {
  models: [
    { id: 'm-deepseek-v3', name: 'DeepSeek Chat V3', vendor: '深度求索', version: 'V3', contextLength: '64K', capabilities: ['文本生成', '推理', '工具调用'], status: 'enabled' },
    { id: 'm-deepseek-r1', name: 'DeepSeek R1', vendor: '深度求索', version: 'V1', contextLength: '128K', capabilities: ['深度推理'], status: 'enabled' },
    { id: 'm-qwen-max', name: '通义千问 Qwen-Max', vendor: '阿里云', version: '2026-08', contextLength: '32K', capabilities: ['文本生成', '函数调用'], status: 'enabled' },
    { id: 'm-glm-plus', name: 'GLM-4-Plus', vendor: '智谱AI', version: 'V4', contextLength: '128K', capabilities: ['文本生成'], status: 'disabled' }
  ],
  prompts: [
    { id: 'p-cataloging', name: '数据资源编目生成Prompt', version: 'V2.0', category: '数据编目', status: 'published', updatedAt: '2026-08-28' },
    { id: 'p-summary', name: '数据资源摘要生成Prompt', version: 'V1.0', category: '数据编目', status: 'published', updatedAt: '2026-08-20' },
    { id: 'p-quality', name: '数据质量分析Prompt', version: 'V1.2', category: '数据分析', status: 'published', updatedAt: '2026-08-18' },
    { id: 'p-standard', name: '数据标准检查Prompt', version: 'V1.0', category: '数据治理', status: 'published', updatedAt: '2026-08-10' },
    { id: 'p-qa', name: '数据要素问答Prompt', version: 'V2.0', category: '知识问答', status: 'published', updatedAt: '2026-09-01' }
  ],
  knowledgeBases: [
    { id: 'kb-classify', name: '数据资源分类标准', type: '标准规范', docCount: 128, updatedAt: '2026-08-20' },
    { id: 'kb-catalog', name: '数据资源编目规范', type: '标准规范', docCount: 96, updatedAt: '2026-08-12' },
    { id: 'kb-element', name: '数据元标准', type: '标准规范', docCount: 210, updatedAt: '2026-07-30' },
    { id: 'kb-quality', name: '数据质量评估规范', type: '规则配置', docCount: 56, updatedAt: '2026-08-05' },
    { id: 'kb-standard', name: '数据标准检查指引', type: '技术文档', docCount: 42, updatedAt: '2026-07-18' },
    { id: 'kb-catalog-dir', name: '数据资产目录库', type: '资产目录', docCount: 8432, updatedAt: '2026-09-01' }
  ],
  toolServers: [
    { id: 'svc-resource', name: '数据资源查询服务' },
    { id: 'svc-quality', name: '数据质量分析服务' },
    { id: 'svc-catalog', name: '数据目录检索服务' },
    { id: 'svc-knowledge', name: '知识库检索服务' }
  ],
  tools: [
    { id: 't-res-list', serverId: 'svc-resource', serverName: '数据资源查询服务', name: 'get_resource_list', displayName: '查询数据资源列表', desc: '按条件查询数据资源，返回资源列表及基本信息', status: 'active' },
    { id: 't-res-detail', serverId: 'svc-resource', serverName: '数据资源查询服务', name: 'get_resource_detail', displayName: '查询数据资源详情', desc: '根据资源ID查询资源的字段与元数据详情', status: 'active' },
    { id: 't-res-update', serverId: 'svc-resource', serverName: '数据资源查询服务', name: 'update_resource_catalog', displayName: '更新数据资源目录', desc: '将编目结果回写至数据资源目录', status: 'active' },
    { id: 't-res-delete', serverId: 'svc-resource', serverName: '数据资源查询服务', name: 'delete_data_resource', displayName: '删除数据资源', desc: '删除数据资源及其目录记录', status: 'active' },
    { id: 't-q-run', serverId: 'svc-quality', serverName: '数据质量分析服务', name: 'run_quality_analysis', displayName: '执行数据质量分析', desc: '对指定数据集执行多维度质量分析', status: 'active' },
    { id: 't-q-report', serverId: 'svc-quality', serverName: '数据质量分析服务', name: 'get_quality_report', displayName: '获取质量分析报告', desc: '获取数据集质量评估报告', status: 'active' },
    { id: 't-dc-search', serverId: 'svc-catalog', serverName: '数据目录检索服务', name: 'search_data_catalog', displayName: '检索数据目录', desc: '按关键词检索数据资产目录', status: 'active' },
    { id: 't-dc-lineage', serverId: 'svc-catalog', serverName: '数据目录检索服务', name: 'get_data_lineage', displayName: '查询数据血缘', desc: '查询数据表或字段的血缘关系', status: 'active' },
    { id: 't-kb-search', serverId: 'svc-knowledge', serverName: '知识库检索服务', name: 'search_knowledge', displayName: '知识库语义检索', desc: '基于语义从知识库中检索相关内容', status: 'active' }
  ],
  agents: [
    { id: 'a-cataloger', name: '数据资源智能编目助手', role: '编目执行', desc: '承担数据资源编目、摘要生成等日常编目任务' },
    { id: 'a-governor', name: '数据治理助手', role: '治理协同', desc: '协同完成质量分析、标准检查等数据治理任务' },
    { id: 'a-qa', name: '数据要素问答助手', role: '咨询服务', desc: '面向数据要素场景提供知识与咨询服务' }
  ]
};

/* ---------- 目录查询辅助 ---------- */
const SkillLookup = {
  modelById: id => SkillCatalog.models.find(m => m.id === id),
  promptById: id => SkillCatalog.prompts.find(p => p.id === id),
  kbById: id => SkillCatalog.knowledgeBases.find(k => k.id === id),
  toolById: id => SkillCatalog.tools.find(t => t.id === id),
  agentById: id => SkillCatalog.agents.find(a => a.id === id),
  enabledModels: () => SkillCatalog.models.filter(m => m.status === 'enabled')
};

/* =====================================================
   Skill 默认配置片段（在线测试 / 新建 Skill 预填）
   ===================================================== */
const DEFAULT_CATALOGING_IO = {
  inputMode: 'form',
  inputs: [
    { key: 'resourceId', label: 'resourceId', type: 'String', required: true, desc: '待编目的数据资源ID', example: 'R20260001' },
    { key: 'resourceMetadata', label: 'resourceMetadata', type: 'Object', required: false, desc: '数据资源元数据', example: '' }
  ],
  inputJson: '{\n  "resourceId": "R20260001",\n  "resourceMetadata": {}\n}',
  outputMode: 'form',
  outputs: [
    { name: 'resourceId', type: 'String', desc: '数据资源ID' },
    { name: 'resourceName', type: 'String', desc: '数据资源名称' },
    { name: 'description', type: 'String', desc: '数据资源描述' },
    { name: 'categoryCode', type: 'String', desc: '分类编码' },
    { name: 'categoryName', type: 'String', desc: '分类名称' },
    { name: 'tags', type: 'Array', desc: '资源标签' },
    { name: 'updateFrequency', type: 'String', desc: '更新频率' },
    { name: 'confidence', type: 'Number', desc: '结果置信度' }
  ],
  outputJson: JSON.stringify({
    resourceId: 'R20260001',
    resourceName: '企业登记信息',
    description: '反映企业登记注册相关信息的数据资源',
    categoryCode: '01',
    categoryName: '法人数据',
    tags: ['企业', '登记'],
    updateFrequency: '每日',
    confidence: 0.94
  }, null, 2)
};

/* 编目 Skill 的标准成功样例（在线测试结果） */
const CATALOGING_TEST_RESULT = {
  resourceId: 'R20260001',
  resourceName: '企业登记信息',
  description: '反映企业登记注册相关信息的数据资源，包含企业基本信息、注册资本、经营范围与登记状态等字段。',
  categoryCode: '01',
  categoryName: '法人数据',
  tags: ['企业', '登记', '工商'],
  updateFrequency: '每日',
  confidence: 0.94
};

/* =====================================================
   Seed 数据：平台初始化 Skill
   ===================================================== */
function cloneSkillConfig(skill) {
  return {
    name: skill.name,
    code: skill.code,
    type: skill.type,
    description: skill.description,
    goal: skill.goal,
    modelId: skill.modelId,
    promptId: skill.promptId,
    knowledgeBaseIds: (skill.knowledgeBaseIds || []).slice(),
    toolIds: (skill.toolIds || []).slice(),
    declareNoTool: !!skill.declareNoTool,
    rules: {
      taskGoal: (skill.rules && skill.rules.taskGoal) || '',
      principles: ((skill.rules && skill.rules.principles) || []).slice(),
      constraints: ((skill.rules && skill.rules.constraints) || []).slice()
    },
    inputMode: skill.inputMode || 'form',
    inputs: (skill.inputs || []).map(i => ({ ...i })),
    inputJson: skill.inputJson || '',
    outputMode: skill.outputMode || 'form',
    outputs: (skill.outputs || []).map(o => ({ ...o })),
    outputJson: skill.outputJson || '',
    outputSample: skill.outputSample || ''
  };
}

function seedSkills() {
  const now = '2026-09-05 09:20';
  const snap = cfg => JSON.parse(JSON.stringify(cfg));

  const s1 = Object.assign(cloneSkillConfig({
    name: '数据资源智能编目',
    code: 'data-cataloging',
    type: '数据治理',
    description: '基于数据资源元数据和编目规范，自动生成数据资源描述、分类、标签和更新频率等标准化目录信息。',
    goal: '自动完成数据资源的标准化智能编目。',
    modelId: 'm-deepseek-v3',
    promptId: 'p-cataloging',
    knowledgeBaseIds: ['kb-classify', 'kb-catalog'],
    toolIds: ['t-res-list', 't-res-detail', 't-res-update'],
    rules: {
      taskGoal: '根据输入的数据资源元数据，生成符合数据资源目录规范的标准化编目信息。',
      principles: [
        '获取数据资源的基础元数据与字段信息。',
        '依据数据资源分类标准判断资源所属类别。',
        '结合资源字段与业务含义生成资源描述。',
        '根据资源内容提取合适的标签。',
        '依据元数据中的更新信息识别更新频率。',
        '按输出Schema生成结构化编目结果。',
        '写入前对编目结果进行完整性校验。'
      ],
      constraints: [
        '不得修改原始数据。',
        '分类必须遵循数据资源分类标准。',
        '无法确定的信息不得自行编造。',
        '生成结果必须符合输出Schema。',
        '更新目录前必须完成结果校验。'
      ]
    },
    inputMode: DEFAULT_CATALOGING_IO.inputMode,
    inputs: DEFAULT_CATALOGING_IO.inputs.map(i => ({ ...i })),
    inputJson: DEFAULT_CATALOGING_IO.inputJson,
    outputMode: DEFAULT_CATALOGING_IO.outputMode,
    outputs: DEFAULT_CATALOGING_IO.outputs.map(o => ({ ...o })),
    outputJson: DEFAULT_CATALOGING_IO.outputJson,
    outputSample: '编目结果示例：\n{ "resourceName": "企业登记信息", "categoryName": "法人数据", "tags": ["企业","登记"], "updateFrequency": "每日" }'
  }), {
    id: 'skl-001',
    status: 'published',
    version: 'V1.0',
    versions: [{ version: 'V1.0', state: 'current', publishedAt: '2026-08-20 09:30', publisher: '林砚舟', changeNote: '首次发布。', snapshot: null }],
    agentIds: ['a-cataloger', 'a-governor'],
    usageCount: 1286,
    recent7d: 312,
    publisher: '林砚舟',
    publishedAt: '2026-08-20 09:30',
    createdAt: '2026-08-15 10:20',
    updatedAt: now
  });
  s1.versions[0].snapshot = snap(cloneSkillConfig(s1));

  const s2 = Object.assign(cloneSkillConfig({
    name: '数据资源摘要生成',
    code: 'data-resource-summary',
    type: '内容生成',
    description: '基于数据资源元数据与字段样例，自动提炼资源内容摘要，输出面向业务理解的结构化概要。',
    goal: '自动生成准确、可读的数据资源内容摘要。',
    modelId: 'm-deepseek-v3',
    promptId: 'p-summary',
    knowledgeBaseIds: [],
    toolIds: ['t-res-detail'],
    rules: {
      taskGoal: '基于数据资源的元数据与字段样例，生成概括资源用途、内容与业务价值的摘要。',
      principles: [
        '获取数据资源基础信息与字段样例。',
        '识别资源的业务主题与使用场景。',
        '提炼关键字段含义并归纳内容要点。',
        '按统一结构输出资源摘要。'
      ],
      constraints: [
        '摘要须忠于资源实际内容。',
        '不得杜撰字段或业务信息。',
        '输出必须符合摘要Schema。'
      ]
    },
    inputs: [
      { key: 'resourceId', label: 'resourceId', type: 'String', required: true, desc: '数据资源ID', example: 'R20260001' },
      { key: 'maxLength', label: 'maxLength', type: 'Integer', required: false, desc: '摘要字数上限', example: '200' }
    ],
    inputJson: '',
    outputs: [
      { name: 'resourceName', type: 'String', desc: '数据资源名称' },
      { name: 'summary', type: 'String', desc: '资源内容摘要' },
      { name: 'keyFields', type: 'Array', desc: '关键字段说明' },
      { name: 'businessUsage', type: 'String', desc: '业务用途' }
    ],
    outputJson: '',
    outputSample: ''
  }), {
    id: 'skl-002',
    status: 'published',
    version: 'V1.1',
    versions: [
      { version: 'V1.1', state: 'current', publishedAt: '2026-09-03 14:20', publisher: '林砚舟', changeNote: '优化摘要结构，新增业务用途提炼。', snapshot: null },
      { version: 'V1.0', state: 'history', publishedAt: '2026-08-22 11:00', publisher: '林砚舟', changeNote: '首次发布。', snapshot: null }
    ],
    agentIds: ['a-cataloger'],
    usageCount: 684,
    recent7d: 126,
    publisher: '林砚舟',
    publishedAt: '2026-09-03 14:20',
    createdAt: '2026-08-18 16:40',
    updatedAt: '2026-09-03 14:20'
  });
  s2.versions[0].snapshot = snap(cloneSkillConfig(s2));
  s2.versions[1].snapshot = snap(Object.assign(cloneSkillConfig(s2), { description: '基于数据资源元数据与字段样例，自动生成资源内容摘要。' }));

  const s3 = Object.assign(cloneSkillConfig({
    name: '数据质量分析',
    code: 'data-quality-analysis',
    type: '数据分析',
    description: '对指定数据集开展完整性、准确性、一致性与时效性评估，输出质量评分与问题明细。',
    goal: '量化评估数据质量并定位质量风险点。',
    modelId: 'm-deepseek-v3',
    promptId: 'p-quality',
    knowledgeBaseIds: ['kb-quality'],
    toolIds: ['t-q-run', 't-q-report'],
    rules: {
      taskGoal: '依据数据质量评估规范，对输入数据集完成多维度质量分析并输出报告。',
      principles: [
        '获取数据集结构、规模与抽样数据。',
        '按评估维度逐一核验数据质量。',
        '对发现的问题归类并说明影响。',
        '输出质量评分与改进建议。'
      ],
      constraints: [
        '评估口径必须遵循数据质量评估规范。',
        '异常结论需给出依据，不得臆断。',
        '输出必须符合质量报告Schema。'
      ]
    },
    inputs: [
      { key: 'datasetId', label: 'datasetId', type: 'String', required: true, desc: '待分析的数据集ID', example: 'DS20260901001' },
      { key: 'dimensions', label: 'dimensions', type: 'Array', required: false, desc: '评估维度', example: '["完整性","准确性"]' }
    ],
    inputJson: '',
    outputs: [
      { name: 'datasetId', type: 'String', desc: '数据集ID' },
      { name: 'qualityScore', type: 'Number', desc: '综合质量评分' },
      { name: 'dimensionScores', type: 'Object', desc: '分维度评分' },
      { name: 'issues', type: 'Array', desc: '质量问题清单' },
      { name: 'suggestions', type: 'Array', desc: '改进建议' }
    ],
    outputJson: '',
    outputSample: ''
  }), {
    id: 'skl-003',
    status: 'draft',
    version: 'V0.1',
    versions: [],
    agentIds: [],
    usageCount: 0,
    recent7d: 0,
    createdAt: '2026-08-30 09:00',
    updatedAt: '2026-09-02 15:30'
  });

  const s4 = Object.assign(cloneSkillConfig({
    name: '数据标准检查',
    code: 'data-standard-check',
    type: '数据治理',
    description: '对照数据元标准与字段命名规范，自动核查字段命名、类型与取值是否符合数据标准。',
    goal: '自动完成字段级数据标准符合性检查。',
    modelId: 'm-deepseek-v3',
    promptId: 'p-standard',
    knowledgeBaseIds: ['kb-element', 'kb-standard'],
    toolIds: ['t-dc-search'],
    rules: {
      taskGoal: '根据数据元标准与命名规范，逐字段核验输入表结构并输出合规检查结果。',
      principles: [
        '读取目标表结构与字段字典。',
        '对照数据元标准核验字段命名与类型。',
        '识别不符合项并给出修正建议。',
        '输出字段级检查清单。'
      ],
      constraints: [
        '标准依据必须来自引用的知识库。',
        '不修改被检查表结构。',
        '输出必须符合检查报告Schema。'
      ]
    },
    inputs: [
      { key: 'tableId', label: 'tableId', type: 'String', required: true, desc: '目标数据表ID', example: 'T20260901001' }
    ],
    inputJson: '',
    outputs: [
      { name: 'tableId', type: 'String', desc: '数据表ID' },
      { name: 'passRate', type: 'Number', desc: '标准符合率' },
      { name: 'checkItems', type: 'Array', desc: '字段检查明细' },
      { name: 'violations', type: 'Array', desc: '违规项清单' }
    ],
    outputJson: '',
    outputSample: ''
  }), {
    id: 'skl-004',
    status: 'published',
    version: 'V1.0',
    versions: [{ version: 'V1.0', state: 'current', publishedAt: '2026-09-01 10:00', publisher: '林砚舟', changeNote: '首次发布。', snapshot: null }],
    agentIds: ['a-governor'],
    usageCount: 523,
    recent7d: 87,
    publisher: '林砚舟',
    publishedAt: '2026-09-01 10:00',
    createdAt: '2026-08-25 09:10',
    updatedAt: '2026-09-01 10:00'
  });
  s4.versions[0].snapshot = snap(cloneSkillConfig(s4));

  return [s1, s2, s3, s4];
}

/* =====================================================
   SkillStore - localStorage 持久化
   ===================================================== */
const SkillStore = {
  _state: null,

  load() {
    if (this._state) return this._state;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.skills)) {
          this._state = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Skill store 读取失败，使用初始化数据');
    }
    const fresh = { skills: seedSkills(), testRecords: [] };
    this._state = fresh;
    this.save();
    return fresh;
  },

  save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this._state));
    } catch (e) {
      console.warn('Skill store 保存失败', e);
    }
  },

  reset() {
    this._state = null;
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
    return this.load();
  },

  list() {
    return this.load().skills;
  },

  get(id) {
    return this.list().find(s => s.id === id);
  },

  upsert(skill) {
    const state = this.load();
    const idx = state.skills.findIndex(s => s.id === skill.id);
    if (idx >= 0) {
      state.skills[idx] = skill;
    } else {
      state.skills.unshift(skill);
    }
    this.save();
    return skill;
  },

  remove(id) {
    const state = this.load();
    state.skills = state.skills.filter(s => s.id !== id);
    this.save();
  },

  genId() {
    return 'skl-' + String(Date.now()).slice(-8) + Math.random().toString(36).slice(2, 6);
  },

  /**
   * 复制 Skill：复制配置（模型/Prompt/知识库/工具/规则/输入输出），
   * 关联 Agent 不复制，版本重置为 V1.0 草稿。
   */
  copy(sourceId) {
    const src = this.get(sourceId);
    if (!src) return null;
    const copy = Object.assign(cloneSkillConfig(src), {
      id: this.genId(),
      name: src.name + '-副本',
      code: (src.code + '-copy').replace(/-(copy)+$/i, '-copy') + (Math.random().toString(36).slice(2, 5)),
      status: 'draft',
      version: 'V1.0',
      versions: [],
      agentIds: [],
      usageCount: 0,
      recent7d: 0,
      publishNote: '',
      createdAt: fmtNow(),
      updatedAt: fmtNow()
    });
    this.upsert(copy);
    return copy;
  },

  /**
   * 计算下一个版本号：基于已发布版本取次版本递增。
   */
  nextVersion(row) {
    const vs = (row.versions || []).filter(v => v.version).map(v => v.version);
    let maxMinor = -1;
    vs.forEach(v => {
      const m = /^V(\d+)\.(\d+)$/.exec(String(v).trim());
      if (m) maxMinor = Math.max(maxMinor, parseInt(m[2], 10));
    });
    return maxMinor >= 0 ? 'V1.' + (maxMinor + 1) : 'V1.0';
  },

  /**
   * 发布 Skill：归档已发布版本为历史，生成新版本并形成版本快照。
   */
  publish(row, changeNote) {
    if (!row.id) row.id = this.genId();
    const now = fmtDateTime();
    const versions = (row.versions || []).slice();

    if (row.status === 'published' || row.publishedAt) {
      // 已发布过：若存在当前版本快照，先归档为历史
      const cur = versions.find(v => v.state === 'current');
      if (cur) cur.state = 'history';
    }

    const nextVer = this.nextVersion(row);
    const snapshot = JSON.parse(JSON.stringify(cloneSkillConfig(row)));
    versions.push({
      version: nextVer,
      state: 'current',
      publishedAt: now,
      publisher: '林砚舟',
      changeNote: (changeNote && changeNote.trim()) || (versions.length > 1 ? '发布新版本。' : '首次发布。'),
      snapshot
    });

    row.version = nextVer;
    row.versions = versions;
    row.status = 'published';
    row.publishedAt = now;
    row.publisher = '林砚舟';
    row.updatedAt = now;
    row.publishNote = '';
    this.upsert(row);
    return row;
  },

  /* ---------- 在线测试记录 ---------- */
  addTestRecord(rec) {
    const state = this.load();
    state.testRecords = state.testRecords || [];
    state.testRecords.unshift(Object.assign({ id: 'tr-' + Date.now().toString(36) }, rec));
    this.save();
  },

  testRecordsOf(skillId) {
    return (this.load().testRecords || []).filter(r => r.skillId === skillId);
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
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

function statusPill(status) {
  const meta = SKILL_STATUS_META[status] || { label: status, cls: 'draft' };
  return `<span class="sk-status-pill ${meta.cls}"><span class="dot"></span>${meta.label}</span>`;
}

function versionPill(skill) {
  const hasPublished = skill.publishedAt || (skill.versions && skill.versions.length);
  const label = skill.version || (hasPublished ? '' : '—');
  if (!hasPublished) return '<span class="sk-version-text muted">—</span>';
  return `<span class="sk-version-text">${escapeHtml(label)}</span>`;
}

/* Skill 展示元信息（列表/详情/摘要通用） */
function resolveSkillMeta(skill) {
  const model = SkillLookup.modelById(skill.modelId);
  const prompt = SkillLookup.promptById(skill.promptId);
  const kbs = (skill.knowledgeBaseIds || []).map(id => SkillLookup.kbById(id)).filter(Boolean);
  const tools = (skill.toolIds || []).map(id => SkillLookup.toolById(id)).filter(Boolean);
  const agents = (skill.agentIds || []).map(id => SkillLookup.agentById(id)).filter(Boolean);
  return {
    model,
    prompt,
    kbs,
    tools,
    agents,
    modelName: model ? model.name : '—',
    promptName: prompt ? `${prompt.name}` : '—',
    promptVersion: prompt ? prompt.version : '',
    kbCount: kbs.length,
    toolCount: tools.length,
    agentCount: agents.length
  };
}

/* =====================================================
   Skill管理 列表页逻辑
   ===================================================== */
const SkillListPage = {
  state: { keyword: '', type: '', status: '', page: 1, pageSize: 8 },
  rows: [],

  init() {
    this.rows = SkillStore.list();
    this.renderStats();
    this.renderTable();
    this.bindEvents();
  },

  filtered() {
    const { keyword, type, status } = this.state;
    const kw = keyword.trim().toLowerCase();
    return this.rows.filter(s => {
      if (type && s.type !== type) return false;
      if (status && s.status !== status) return false;
      if (kw && !(s.name.toLowerCase().includes(kw) || s.code.toLowerCase().includes(kw))) return false;
      return true;
    }).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  },

  renderStats() {
    const rows = this.rows;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('stat-total', rows.length);
    set('stat-published', rows.filter(s => s.status === 'published').length);
    set('stat-draft', rows.filter(s => s.status === 'draft').length);
    set('stat-stopped', rows.filter(s => s.status === 'stopped').length);
    set('stat-used', rows.filter(s => (s.agentIds || []).length > 0).length);
  },

  renderTable() {
    const list = this.filtered();
    const total = list.length;
    const pageSize = this.state.pageSize;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    if (this.state.page > pages) this.state.page = pages;
    const start = (this.state.page - 1) * pageSize;
    const pageRows = list.slice(start, start + pageSize);

    const tbody = document.getElementById('skill-table-body');
    const countInfo = document.getElementById('table-count');
    if (countInfo) countInfo.textContent = `共 ${total} 个 Skill`;

    if (!pageRows.length) {
      tbody.innerHTML = `
        <tr class="table-empty-row">
          <td colspan="10">
            <div class="empty-state" style="padding: 48px 16px;">
              <div class="empty-state-icon"><i class="fa-regular fa-folder-open"></i></div>
              <div class="empty-state-title">${total === 0 && this.rows.length === 0 ? '还没有 Skill' : '未找到匹配的 Skill'}</div>
              <div class="empty-state-desc">${total === 0 && this.rows.length === 0 ? '点击「新建 Skill」沉淀第一个可复用的专业任务能力' : '请调整搜索关键词或筛选条件后重试'}</div>
            </div>
          </td>
        </tr>`;
    } else {
      tbody.innerHTML = pageRows.map(s => this.rowHtml(s)).join('');
    }

    this.renderPagination(total, pages);
  },

  rowHtml(s) {
    const meta = resolveSkillMeta(s);
    const used = (s.agentIds || []).length > 0;
    const codeTxt = escapeHtml(s.code);
    const canDelete = !used; // 未被 Agent 使用即可删除（含已发布），被使用则仅可停用
    const actionBtn = [];

    actionBtn.push(`<button class="sk-op-btn" onclick="SkillListPage.view('${s.id}')" title="查看"><i class="fa-regular fa-eye"></i></button>`);
    actionBtn.push(`<button class="sk-op-btn" onclick="SkillListPage.edit('${s.id}')" title="编辑"><i class="fa-regular fa-pen-to-square"></i></button>`);
    actionBtn.push(`<button class="sk-op-btn" onclick="SkillListPage.copy('${s.id}')" title="复制"><i class="fa-regular fa-copy"></i></button>`);

    if (s.status === 'stopped') {
      actionBtn.push(`<button class="sk-op-btn success" onclick="SkillListPage.enable('${s.id}')" title="启用"><i class="fa-solid fa-play"></i></button>`);
    } else {
      actionBtn.push(`<button class="sk-op-btn danger" onclick="SkillListPage.stop('${s.id}')" title="停用"><i class="fa-solid fa-pause"></i></button>`);
    }
    if (canDelete) {
      actionBtn.push(`<button class="sk-op-btn danger" onclick="SkillListPage.del('${s.id}')" title="删除"><i class="fa-regular fa-trash-can"></i></button>`);
    }

    return `
      <tr>
        <td>
          <div class="sk-cell-name">
            <div class="sk-name">
              <a href="skill-detail.html?id=${s.id}">${escapeHtml(s.name)}</a>
              <span class="sk-code">${codeTxt}</span>
            </div>
            <div class="sk-desc">${escapeHtml(s.description || '—')}</div>
          </div>
        </td>
        <td>
          <div class="sk-code-cell"><span class="sk-code-mono">${codeTxt}</span></div>
        </td>
        <td><span class="sk-type-tag">${escapeHtml(s.type)}</span></td>
        <td>${escapeHtml(meta.modelName)}</td>
        <td>${meta.kbCount > 0 ? `<a class="sk-cell-link" href="skill-detail.html?id=${s.id}&tab=config">${meta.kbCount} 个知识库</a>` : '<span class="muted-text">—</span>'}</td>
        <td>${meta.toolCount > 0 ? `<a class="sk-cell-link" href="skill-detail.html?id=${s.id}&tab=config">${meta.toolCount} 个工具</a>` : (s.declareNoTool ? '<span class="sk-notool-tag">无需工具</span>' : '<span class="muted-text">—</span>')}</td>
        <td>${meta.agentCount > 0 ? `<a class="sk-cell-link" href="skill-detail.html?id=${s.id}&tab=usage">${meta.agentCount} 个Agent</a>` : '<span class="muted-text">—</span>'}</td>
        <td>${statusPill(s.status)}</td>
        <td>${fmtDate(s.updatedAt)}</td>
        <td>
          <div class="sk-op-group">${actionBtn.join('')}</div>
        </td>
      </tr>`;
  },

  renderPagination(total, pages) {
    const wrap = document.getElementById('skill-pagination');
    if (!wrap) return;
    if (pages <= 1) { wrap.innerHTML = ''; return; }
    const cur = this.state.page;
    let html = '<div class="pagination">';
    const btn = (label, page, cls, icon) =>
      `<button class="pagination-item ${cls || ''}" ${page === cur ? 'disabled' : ''} onclick="SkillListPage.go(${page})">${icon || escapeHtml(label)}</button>`;
    html += btn('', cur - 1, cur === 1 ? 'disabled' : '', '<i class="fa-solid fa-chevron-left"></i>');
    for (let i = 1; i <= pages; i++) html += btn(i, i, i === cur ? 'active' : '');
    html += btn('', cur + 1, cur === pages ? 'disabled' : '', '<i class="fa-solid fa-chevron-right"></i>');
    html += '</div>';
    wrap.innerHTML = html;
  },

  go(page) {
    this.state.page = page;
    this.renderTable();
  },

  bindEvents() {
    const keywordEl = document.getElementById('search-input');
    const typeEl = document.getElementById('type-filter');
    const statusEl = document.getElementById('status-filter');
    const newBtn = document.getElementById('new-skill-btn');

    if (keywordEl) {
      let t = null;
      keywordEl.addEventListener('input', e => {
        clearTimeout(t);
        t = setTimeout(() => { this.state.keyword = e.target.value; this.state.page = 1; this.renderTable(); }, 220);
      });
      keywordEl.addEventListener('keydown', e => {
        if (e.key === 'Enter') { this.state.keyword = e.target.value; this.state.page = 1; this.renderTable(); }
      });
    }
    if (typeEl) typeEl.addEventListener('change', e => { this.state.type = e.target.value; this.state.page = 1; this.renderTable(); });
    if (statusEl) statusEl.addEventListener('change', e => { this.state.status = e.target.value; this.state.page = 1; this.renderTable(); });
    if (newBtn) newBtn.addEventListener('click', () => { window.location.href = 'skill-create.html'; });
  },

  view(id) { window.location.href = `skill-detail.html?id=${id}`; },
  edit(id) { window.location.href = `skill-create.html?id=${id}`; },

  copy(id) {
    const copied = SkillStore.copy(id);
    if (!copied) { Toast.danger('复制失败'); return; }
    Toast.success(`已复制生成「${copied.name}」草稿`, '复制成功');
    setTimeout(() => { window.location.href = `skill-create.html?id=${copied.id}&justCopied=1`; }, 700);
  },

  stop(id) {
    const skill = SkillStore.get(id);
    if (!skill) return;
    const agents = (skill.agentIds || []).map(aid => SkillLookup.agentById(aid)).filter(Boolean);
    const usedText = agents.length
      ? `该 Skill 当前已被 ${agents.length} 个 Agent 使用（${agents.map(a => a.name).join('、')}），停用后相关 Agent 可能无法正常执行。是否继续？`
      : '停用后，该 Skill 将不再作为可调用能力对外提供。是否继续？';
    Modal.confirm({
      title: '停用 Skill',
      message: usedText,
      type: 'warning',
      confirmText: '确认停用',
      onConfirm: () => {
        skill.status = 'stopped';
        skill.updatedAt = fmtNow();
        SkillStore.upsert(skill);
        Toast.warning(`「${skill.name}」已停用`);
        this.refresh();
      }
    });
  },

  enable(id) {
    const skill = SkillStore.get(id);
    if (!skill) return;
    Modal.confirm({
      title: '启用 Skill',
      message: `启用后，「${skill.name}」将恢复为可调用能力。是否继续？`,
      type: 'success',
      confirmText: '确认启用',
      onConfirm: () => {
        skill.status = 'published';
        skill.updatedAt = fmtNow();
        SkillStore.upsert(skill);
        Toast.success(`「${skill.name}」已启用`);
        this.refresh();
      }
    });
  },

  del(id) {
    const skill = SkillStore.get(id);
    if (!skill) return;
    if ((skill.agentIds || []).length > 0) {
      Modal.alert({ title: '无法删除', message: '该 Skill 已被 Agent 使用，不能直接删除。可先停用，或解除关联后再删除。', type: 'danger' });
      return;
    }
    Modal.confirm({
      title: '删除 Skill',
      message: `确定删除「${skill.name}」吗？删除后不可恢复。`,
      type: 'danger',
      confirmText: '确认删除',
      onConfirm: () => {
        SkillStore.remove(skill.id);
        Toast.success('Skill 已删除');
        this.rows = SkillStore.list();
        this.renderStats();
        this.renderTable();
      }
    });
  },

  refresh() {
    this.rows = SkillStore.list();
    this.renderStats();
    this.renderTable();
  }
};
