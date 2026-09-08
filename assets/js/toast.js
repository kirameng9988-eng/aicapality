/* =====================================================
   AI Capability Open Platform - Toast Notification
   Toast Message System
   ===================================================== */

const Toast = {
  // Toast container element
  container: null,

  // Default options
  defaults: {
    duration: 4000,
    maxCount: 5,
    position: 'top-right' // top-right, top-center, top-left, bottom-right, bottom-center, bottom-left
  },

  /**
   * Initialize toast container
   */
  init() {
    if (this.container) return;

    // Use parent document if running in iframe, otherwise use current document
    const targetDoc = window.parent !== window ? window.parent.document : document;

    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    this.container.id = 'toast-container';
    targetDoc.body.appendChild(this.container);
  },

  /**
   * Show toast message
   */
  show(options = {}) {
    this.init();

    const {
      type = 'default', // default, success, warning, danger, info
      title = '',
      message = '',
      duration = this.defaults.duration,
      closable = true
    } = options;

    const icons = {
      default: '',
      success: '✓',
      warning: '⚠',
      danger: '✕',
      info: 'ℹ'
    };

    const id = Utils.generateId('toast');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = id;

    toast.innerHTML = `
      ${icons[type] ? `<div class="toast-icon">${icons[type]}</div>` : ''}
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      ${closable ? `<button class="toast-close">×</button>` : ''}
    `;

    // Add to container
    this.container.appendChild(toast);

    // Limit toast count
    const toasts = this.container.querySelectorAll('.toast');
    if (toasts.length > this.defaults.maxCount) {
      toasts[0].remove();
    }

    // Close button handler
    if (closable) {
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.hide(id));
    }

    // Auto hide after duration (0 = persistent)
    if (duration > 0) {
      setTimeout(() => this.hide(id), duration);
    }

    // Trigger custom event
    toast.dispatchEvent(new CustomEvent('toastshow'));

    return id;
  },

  /**
   * Hide toast by ID
   */
  hide(id) {
    const toast = document.getElementById(id);
    if (!toast) return;

    toast.classList.add('toast-out');
    toast.dispatchEvent(new CustomEvent('toasthide'));

    setTimeout(() => {
      toast.remove();
    }, 300);
  },

  /**
   * Hide all toasts
   */
  hideAll() {
    if (!this.container) return;

    const toasts = this.container.querySelectorAll('.toast');
    toasts.forEach(toast => {
      toast.classList.add('toast-out');
    });

    setTimeout(() => {
      toasts.forEach(toast => toast.remove());
    }, 300);
  },

  /**
   * Convenience methods
   */
  success(message, title = '') {
    return this.show({ type: 'success', message, title });
  },

  warning(message, title = '') {
    return this.show({ type: 'warning', message, title });
  },

  danger(message, title = '') {
    return this.show({ type: 'danger', message, title });
  },

  info(message, title = '') {
    return this.show({ type: 'info', message, title });
  },

  default(message, title = '') {
    return this.show({ type: 'default', message, title });
  },

  /**
   * Show loading toast (persistent until manually closed)
   */
  loading(message = '加载中...') {
    return this.show({
      type: 'default',
      message,
      closable: false,
      duration: 0
    });
  },

  /**
   * Update toast content
   */
  update(id, options = {}) {
    const toast = document.getElementById(id);
    if (!toast) return;

    const { title, message } = options;

    if (title) {
      const titleEl = toast.querySelector('.toast-title');
      if (titleEl) titleEl.textContent = title;
    }

    if (message) {
      const messageEl = toast.querySelector('.toast-message');
      if (messageEl) messageEl.textContent = message;
    }
  },

  /**
   * Promise-based toast for async operations
   */
  async promise(promise, options = {}) {
    const {
      loading = '加载中...',
      success = '操作成功',
      error = '操作失败'
    } = options;

    const id = this.loading(loading);

    try {
      await promise;
      this.update(id, { message: success, type: 'success' });
      setTimeout(() => this.hide(id), 2000);
      return { success: true };
    } catch (err) {
      this.update(id, { message: error, type: 'danger' });
      setTimeout(() => this.hide(id), 3000);
      return { success: false, error: err };
    }
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Toast;
}