/**
 * AI能力开放平台 - 统一菜单配置
 * 所有页面共享此配置
 *
 * 信息架构：
 * - AI能力管理：能力市场、能力管理、能力发布、开放服务
 * - AI能力组件：Skill管理、MCP管理、知识库管理、组件管理
 * - AI能力监控：能力监控
 * - 系统管理
 */
window.MENU_CONFIG = {
  // 平台基础信息
  platform: {
    name: 'AI能力开放平台',
    logo: 'fa-brain'
  },

  // 菜单分组（固定结构，分组标题不可点击）
  groups: [
    {
      // AI能力管理
      title: 'AI能力管理',
      items: [
        {
          name: '能力市场',
          icon: 'fa-store',
          url: 'pages/ai-open/market.html',
          target: 'content-frame'
        },
        {
          name: '能力管理',
          icon: 'fa-robot',
          url: 'pages/ai-build/agent.html',
          target: 'content-frame'
        },
        {
          name: '能力发布',
          icon: 'fa-rocket',
          url: 'pages/ai-open/publish.html',
          target: 'content-frame'
        },
        {
          name: '开放服务',
          icon: 'fa-globe',
          url: 'pages/ai-open/open.html',
          target: 'content-frame'
        }
      ]
    },
    {
      // AI能力组件
      title: 'AI能力组件',
      items: [
        {
          name: 'Skill管理',
          icon: 'fa-certificate',
          url: 'pages/ai-build/skill.html',
          target: 'content-frame'
        },
        {
          name: 'MCP管理',
          icon: 'fa-plug',
          url: 'pages/ai-build/mcp.html',
          target: 'content-frame'
        },
        {
          name: '知识库管理',
          icon: 'fa-book',
          url: 'pages/ai-build/knowledge.html',
          target: 'content-frame'
        },
        {
          name: '组件管理',
          icon: 'fa-toolbox',
          url: 'pages/ai-build/component.html',
          target: 'content-frame'
        }
      ]
    },
    {
      // AI能力监控
      title: 'AI能力监控',
      items: [
        {
          name: '能力监控',
          icon: 'fa-desktop',
          url: 'pages/ai-operate/monitor.html',
          target: 'content-frame'
        }
      ]
    },
    {
      // 系统管理
      title: '系统管理',
      items: [
        {
          name: '系统管理',
          icon: 'fa-gear',
          url: 'pages/system/admin.html',
          target: 'content-frame'
        }
      ]
    }
  ]
};

// 导出配置（支持模块化和直接使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.MENU_CONFIG;
}
