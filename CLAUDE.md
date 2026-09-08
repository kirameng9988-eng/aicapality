# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

AI能力开放平台 Demo — 面向政企数据要素流通的 AI 能力开放平台演示系统,用于创新创业大赛项目展示。

## 核心产品逻辑(重要)

**Agent 即能力,不设独立 AI能力实体层。**

菜单「能力管理」直接指向 Agent 管理(`pages/ai-build/agent.html`)。Agent(岗位执行体)就是平台对外开放的能力:创建/配置/测试 → 工作台提交发布 → 能力发布中心审核 → 市场上架 → 业务应用申请授权 → 开放调用 → 能力监控,全链路共用 AgentStore 一份数据。

菜单信息架构(见 `assets/js/menu.js`):

- AI能力管理:能力市场、能力管理(agent.html)、能力发布、开放服务
- AI能力组件:Skill管理、MCP管理、知识库管理、组件管理(Prompt/模型)
- AI能力监控:能力监控
- 系统管理:用户/角色/应用/日志/配置(Tab 聚合)

## 快速启动

双击 `index.html` 即可运行;推荐本地 http 服务(localStorage 跨页面一致):

```bash
python3 -m http.server 8642
```

## 技术栈与数据

- HTML5 + CSS3 + Vanilla JavaScript (ES6),无 Node.js/后端/数据库/登录认证。
- 数据分三层:
  1. 内联 `MockData`(`assets/js/mock-loader.js`);
  2. `mock/*.json`(模型/MCP/开放等少量 fetch 用);
  3. localStorage Store:`AgentStore`(Agent=能力,单一数据源)、`ApplicationStore`/`ApplyStore`(应用与授权申请)。
- Store 变更通过 `window` 上 `acp-store-change` 事件联动市场、发布中心、监控等页面刷新。

## 架构

壳页面 (`index.html`) + iframe 内容页:

- `index.html` — 主壳(顶部导航 + 侧边栏 + 面包屑),默认加载能力市场;
- 页面间通过 `postMessage`(navigate / menuHighlight)通信;侧边栏由 `sidebar.js` 按 `menu.js` 渲染。

### 目录结构

```text
ai-capability-open-platform-demo/
├── index.html                      # 系统入口(壳,默认进入能力市场)
├── pages/
│   ├── ai-build/
│   │   ├── agent.html              # Agent 管理(= 能力管理,核心)
│   │   ├── agent-create.html / agent-workbench.html / agent-test.html
│   │   ├── skill.html / knowledge.html / mcp.html
│   │   └── component.html          # 组件管理(Prompt/模型)
│   ├── ai-open/
│   │   ├── market.html             # 能力市场(读 AgentStore 已上架 Agent)
│   │   ├── publish.html            # 能力发布中心(draft→submitted→published)
│   │   └── open.html               # 开放服务(MCP/API/SDK)
│   ├── ai-operate/monitor.html     # 能力监控(运行列表=已上架 Agent)
│   └── system/                     # admin.html Tab + app*.html(凭证/授权/审批)
├── assets/js/
│   ├── agent.js                    # AgentStore(Agent=能力 唯一数据源)
│   ├── application-store.js        # ApplicationStore / ApplyStore
│   ├── mock-loader.js / menu.js / sidebar.js / main.js ...
│   └── [page].js
├── mock/                           # 少量 fetch 用 JSON
└── archive/                        # 归档历史演示页
```

## Agent 状态机(即能力状态机)

```text
draft(草稿) ──工作台发布──> submitted(待审核)
    ▲                            │ 发布中心:审核通过
    └──── 驳回(回草稿)      published(已上架, 市场可见)
                                 │ 停用 / 发布新版本(直发)
                                 ▼
                              stopped(已停用, 市场下架)
```

Agent 关键字段:`id/name/roleName/category/description/model/version/status/publishInfo/versions/calls/rating/reviews/protocols/applyMode`。

## 业务闭环

- Agent 工作台「发布」:首次/驳回后 → `AgentStore.submitForReview`;已上架 → `publishNewVersion` 直发。
- 发布中心:待审核列表 = `AgentStore` submitted;通过 → `approveReview` 上架;驳回 → `rejectReview`。
- 市场:`AgentStore` published 派生卡片/详情/在线体验,申请写入 `ApplyStore`(agentId)。
- 应用管理:授权 = `ApplicationStore.authorizedAgents`(agentId);申请审批通过自动建应用并授权。

## 常用操作

### 添加新页面

1. `pages/` 下创建 HTML,引入对应 CSS/JS;
2. `menu.js` 加菜单节点;
3. 能力/Agent 相关数据统一读写 `AgentStore`,不要另建“能力”数据源。

### 样式

- `assets/css/variables.css` 主题变量;页面样式独立 `[page].css` 并显式引入。

## 设计规范

- 企业级 AI Studio;参考 Azure AI Studio / Coze Studio / Dify / DataWorks。
- 关键词:现代、专业、简洁、卡片化、数据化;禁止霓虹/大面积渐变;主色 `#4F46E5`。
- 默认进入能力市场,无独立首页/运营总览。

## Git 版本管理

- 版本管理在内层 demo 仓库(外层 `96.ACP` 已 ignore 本目录);流程见 `.claude/skills/git-versioning/SKILL.md`。
