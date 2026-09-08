# AI能力开放平台 Demo

> 面向政企数据要素流通的 AI能力开放平台(创新创业大赛预研项目)

## 项目说明

纯前端演示系统。**Agent 即 AI能力**:平台管理 Agent(岗位执行体),Agent 经发布中心审核上架后进入能力市场,业务应用申请授权后调用,并由能力监控统一观测。

- 技术栈:HTML5 + CSS3 + Vanilla JS(ES6)
- 无需:Node.js / 数据库 / 后端 / 登录认证
- 数据:AgentStore(localStorage)为能力唯一数据源 + 内联 MockData + 少量 mock/*.json

## 快速启动

```bash
cd ai-capability-open-platform-demo
python3 -m http.server 8642
```

浏览器打开 `http://localhost:8642/index.html`。

## 项目结构

```text
ai-capability-open-platform-demo/
├── index.html                      # 系统入口(壳,默认进入能力市场)
├── pages/
│   ├── ai-build/
│   │   ├── agent.html              # Agent 管理(= 能力管理)
│   │   ├── agent-workbench.html    # 配置/测试/提交发布
│   │   ├── skill.html / knowledge.html / mcp.html
│   │   └── component.html          # 组件管理(Prompt/模型)
│   ├── ai-open/
│   │   ├── market.html             # 能力市场(已上架 Agent)
│   │   ├── publish.html            # 能力发布中心
│   │   └── open.html               # 开放服务(MCP/API/SDK)
│   ├── ai-operate/monitor.html     # 能力监控
│   └── system/                     # 系统管理(用户/角色/应用/日志/配置)
├── assets/js/
│   ├── agent.js                    # AgentStore
│   ├── application-store.js        # 应用与授权申请
│   └── mock-loader.js / menu.js / sidebar.js ...
├── mock/                           # 少量 fetch 用 JSON
└── archive/                        # 归档历史演示页
```

## 功能模块

| 模块 | 说明 |
|---|---|
| Agent 管理(能力管理) | 新建 Agent、工作台配置(岗位/模型/Skill/MCP/知识库)、测试、提交发布 |
| 能力发布中心 | 待审核 Agent 审核通过即上架市场,含发布历史 |
| 能力市场 | 浏览/搜索/收藏/申请使用/在线体验(读已上架 Agent) |
| 开放服务 | MCP/API/SDK 开放方式与在线调试 |
| Skill/MCP/知识库/组件 | 能力组件配置 |
| 能力监控 | 已上架 Agent 运行状态/调用趋势/异常 |
| 系统管理 | 用户/角色/应用/日志/配置;应用凭证、Agent 授权与申请审批 |

## 业务闭环

Agent(能力)状态:`draft → submitted(待审核)→ published(已上架)⇄ stopped(停用/下架)`。

市场「申请使用」→ 应用管理审批 → 自动创建应用并授权该 Agent;授权记录为 `authorizedAgents[].agentId`,与 AgentStore 关联。

## 设计规范

- 企业级 AI Studio;现代、专业、简洁、卡片化、数据化;禁止霓虹风/大面积渐变。
- 默认进入能力市场,无独立首页/运营总览。
