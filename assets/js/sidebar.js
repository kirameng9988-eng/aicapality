/* =====================================================
   AI Capability Open Platform - Sidebar Controller
   左侧菜单渲染 + iframe联动
   （固定分组结构，不支持折叠/展开）
   ===================================================== */

// 缓存当前活动项（避免 iframe load 切换瞬态时丢失高亮）
let currentActiveKey = null;

/**
 * 规范化 URL 标识（取文件名作为匹配键）
 */
function getUrlKey(url) {
  if (!url) return '';
  return url.split('?')[0].split('#')[0].split('/').pop();
}

/**
 * 获取当前 iframe 加载的文件名
 */
function getCurrentIframeKey() {
  const iframe = document.getElementById('content-frame');
  if (iframe) {
    try {
      const loc = iframe.contentWindow && iframe.contentWindow.location;
      if (loc && loc.pathname) {
        return getUrlKey(loc.pathname);
      }
    } catch (e) {
    }
    if (iframe.src) {
      return getUrlKey(iframe.src);
    }
  }
  // 默认进入能力市场
  return 'market.html';
}

/**
 * 根据 URL 在菜单配置中查找活动项
 */
function findEntryByUrl(url) {
  if (!window.MENU_CONFIG || !url) return null;
  const urlKey = getUrlKey(url);
  for (let g = 0; g < window.MENU_CONFIG.groups.length; g++) {
    const group = window.MENU_CONFIG.groups[g];
    for (let i = 0; i < group.items.length; i++) {
      const item = group.items[i];
      if (getUrlKey(item.url) === urlKey) {
        return { group, item, groupIndex: g, itemIndex: i };
      }
    }
  }
  return null;
}

/**
 * 在菜单配置中查找当前活动项（基于 iframe URL）
 */
function findActiveEntry() {
  return findEntryByUrl(getCurrentIframeKey());
}

/**
 * 渲染侧边栏菜单
 * 分组标题始终显示且不可折叠，二级菜单始终展开
 */
function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav || !window.MENU_CONFIG) return;

  const active = findActiveEntry();
  currentActiveKey = active ? getUrlKey(active.item.url) : null;

  let html = '<div class="sidebar-groups-wrap">';

  // 前3个分组（AI能力管理、AI能力组件、AI能力监控）
  const mainGroups = window.MENU_CONFIG.groups.slice(0, -1);
  mainGroups.forEach((group, groupIndex) => {
    const isGroupActive = active && active.groupIndex === groupIndex;

    html += `
      <div class="sidebar-group" data-group-index="${groupIndex}">
        <div class="sidebar-group-title ${isGroupActive ? 'active' : ''}">
          ${escapeHtml(group.title || '')}
        </div>
        <div class="sidebar-group-items">
          ${group.items.map((item, itemIndex) => {
            const isActive = active && active.groupIndex === groupIndex && active.itemIndex === itemIndex;
            return `
              <a href="${escapeHtml(item.url)}"
                 target="${item.target || 'content-frame'}"
                 class="sidebar-item ${isActive ? 'active' : ''}"
                 data-group-index="${groupIndex}"
                 data-item-index="${itemIndex}">
                <span class="sidebar-item-icon">
                  <i class="fa-solid ${item.icon || 'fa-folder'}"></i>
                </span>
                <span class="sidebar-item-name">${escapeHtml(item.name)}</span>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  html += '</div>';

  // 最后一个分组（系统管理）- 吸底
  const systemGroup = window.MENU_CONFIG.groups[window.MENU_CONFIG.groups.length - 1];
  if (systemGroup) {
    const isGroupActive = active && active.groupIndex === window.MENU_CONFIG.groups.length - 1;
    html += `
      <div class="sidebar-system-group">
        <div class="sidebar-group-title ${isGroupActive ? 'active' : ''}">
          ${escapeHtml(systemGroup.title || '')}
        </div>
        <div class="sidebar-group-items">
          ${systemGroup.items.map((item, itemIndex) => {
            const realIndex = window.MENU_CONFIG.groups.length - 1;
            const isActive = active && active.groupIndex === realIndex && active.itemIndex === itemIndex;
            return `
              <a href="${escapeHtml(item.url)}"
                 target="${item.target || 'content-frame'}"
                 class="sidebar-item ${isActive ? 'active' : ''}"
                 data-group-index="${realIndex}"
                 data-item-index="${itemIndex}">
                <span class="sidebar-item-icon">
                  <i class="fa-solid ${item.icon || 'fa-folder'}"></i>
                </span>
                <span class="sidebar-item-name">${escapeHtml(item.name)}</span>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  nav.innerHTML = html;

  // 绑定事件
  bindSidebarEvents();
  updateBreadcrumb();
}

/**
 * 绑定侧边栏事件
 */
function bindSidebarEvents() {
  const nav = document.getElementById('sidebar-nav');

  nav.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', handleItemClick);
  });
}

/**
 * 处理菜单项点击 - 立即更新高亮与面包屑，并导航 iframe
 */
function handleItemClick(e) {
  const link = e.currentTarget;
  const url = link.getAttribute('href');
  if (url) {
    currentActiveKey = getUrlKey(url);
  }
  const activeEntry = findEntryByUrl(url);
  updateActiveState(link, activeEntry);

  const iframe = document.getElementById('content-frame');
  if (iframe && url) {
    window.dispatchEvent(new CustomEvent('iframe-navigating', { detail: { url } }));
    iframe.src = url;
  }
}

/**
 * 更新当前高亮状态
 */
function updateActiveState(activeItem, activeEntry) {
  const nav = document.getElementById('sidebar-nav');

  nav.querySelectorAll('.active').forEach(item => {
    item.classList.remove('active');
  });

  activeItem.classList.add('active');

  // 高亮分组标题
  const group = activeItem.closest('.sidebar-group');
  if (group) {
    const title = group.querySelector('.sidebar-group-title');
    if (title) {
      title.classList.add('active');
    }
  }

  updateBreadcrumb(activeEntry);
}

/**
 * 更新面包屑
 */
function updateBreadcrumb(activeEntry) {
  const breadcrumb = document.getElementById('content-breadcrumb');
  if (!breadcrumb || !window.MENU_CONFIG) return;

  if (!activeEntry) {
    activeEntry = findActiveEntry();
  }

  let html = '';

  if (activeEntry) {
    const { group, item } = activeEntry;
    if (group.title && group.title !== item.name) {
      html += `<span>${escapeHtml(group.title)}</span>`;
      html += '<span class="separator">/</span>';
    }
    html += `<span class="current">${escapeHtml(item.name)}</span>`;
  } else {
    // 默认进入能力市场
    html += '<span class="current">能力市场</span>';
  }

  breadcrumb.innerHTML = html;
}

/**
 * HTML转义
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 设置iframe监听
 */
function setupIframeListener() {
  const iframe = document.getElementById('content-frame');
  if (!iframe) return;

  let isLoading = false;

  window.addEventListener('iframe-navigating', () => {
    isLoading = true;
  });

  iframe.addEventListener('load', () => {
    isLoading = false;
    renderSidebar();
  });

  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'menuHighlight') {
      if (!isLoading) {
        renderSidebar();
      }
    }
    if (e.data && e.data.type === 'navigate') {
      const contentFrame = document.getElementById('content-frame');
      if (contentFrame && e.data.url) {
        contentFrame.src = e.data.url;
      }
    }
  });
}

/**
 * 初始化侧边栏
 */
function initSidebar() {
  renderSidebar();
  setupIframeListener();
}

// 导出到window
window.initSidebar = initSidebar;
window.renderSidebar = renderSidebar;
window.findActiveEntry = findActiveEntry;
