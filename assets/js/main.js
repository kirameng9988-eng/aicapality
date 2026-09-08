/* =====================================================
   AI Capability Open Platform - Main JS
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 初始化侧边栏
  if (typeof initSidebar === 'function') {
    initSidebar();
  }

  // 用户下拉菜单
  const headerUser = document.getElementById('header-user');
  const userDropdown = document.getElementById('header-user-dropdown');

  if (headerUser && userDropdown) {
    headerUser.addEventListener('click', (e) => {
      e.stopPropagation();
      headerUser.classList.toggle('open');
    });

    // 点击其他区域关闭下拉
    document.addEventListener('click', () => {
      headerUser.classList.remove('open');
    });

    // 阻止下拉菜单内部点击冒泡
    userDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
});

// 工具函数

// Format number (e.g. 1234 -> 1,234)
function formatNumber(num) {
  if (num == null) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Format percentage
function formatPercent(value, decimals = 1) {
  if (value == null) return '0%';
  return value.toFixed(decimals) + '%';
}

// Relative time
function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  return `${days} 天前`;
}

// Get query param
function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

// Set page title
function setPageTitle(title) {
  document.title = `${title} - AI能力开放平台`;
}