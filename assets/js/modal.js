/* =====================================================
   AI Capability Open Platform - Modal Component
   Modal & Drawer Dialog Utilities
   ===================================================== */

const Modal = {
  // Active modal instance
  activeModal: null,

  /**
   * Open modal by ID
   */
  open(modalId) {
    const overlay = document.getElementById(modalId);
    if (!overlay) {
      console.warn(`Modal with id "${modalId}" not found`);
      return;
    }

    overlay.classList.add('show');
    this.activeModal = overlay;

    // Lock body scroll
    Utils.lockScroll();

    // Focus first focusable element
    setTimeout(() => {
      const focusable = overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }, 100);

    // Trigger custom event
    overlay.dispatchEvent(new CustomEvent('modalopen'));
  },

  /**
   * Close modal by ID
   */
  close(modalId) {
    const overlay = modalId
      ? document.getElementById(modalId)
      : this.activeModal;

    if (!overlay) return;

    overlay.classList.remove('show');
    this.activeModal = null;

    // Unlock body scroll
    Utils.unlockScroll();

    // Trigger custom event
    overlay.dispatchEvent(new CustomEvent('modalclose'));
  },

  /**
   * Close all modals
   */
  closeAll() {
    document.querySelectorAll('.modal-overlay.show, .drawer-overlay.show').forEach(el => {
      el.classList.remove('show');
    });
    this.activeModal = null;
    Utils.unlockScroll();
  },

  /**
   * Create confirm dialog
   */
  confirm(options = {}) {
    const {
      title = '确认操作',
      message = '确定要执行此操作吗？',
      type = 'warning', // warning, danger, success
      confirmText = '确定',
      cancelText = '取消',
      onConfirm = () => {},
      onCancel = () => {}
    } = options;

    const icons = {
      warning: '⚠️',
      danger: '⛔',
      success: '✅',
      info: 'ℹ️'
    };

    const id = Utils.generateId('confirm-dialog');
    const html = `
      <div class="modal-overlay" id="${id}">
        <div class="modal modal-sm">
          <div class="modal-body">
            <div class="confirm-dialog confirm-dialog-${type}">
              <div class="confirm-dialog-icon">${icons[type]}</div>
              <div class="confirm-dialog-title">${title}</div>
              <div class="confirm-dialog-message">${message}</div>
              <div class="confirm-dialog-actions">
                <button class="btn btn-secondary btn-lg" data-action="cancel">${cancelText}</button>
                <button class="btn btn-${type === 'danger' ? 'danger' : 'primary'} btn-lg" data-action="confirm">${confirmText}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Append to body
    const container = document.createElement('div');
    container.innerHTML = html;
    const overlay = container.firstElementChild;
    document.body.appendChild(overlay);

    // Add event listeners
    const cleanup = () => {
      overlay.remove();
    };

    overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
      onConfirm();
      cleanup();
      this.close(id);
    });

    overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      onCancel();
      cleanup();
      this.close(id);
    });

    // Close on overlay click
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        onCancel();
        cleanup();
        this.close(id);
      }
    });

    // Close on escape
    const onEscape = e => {
      if (e.key === 'Escape') {
        onCancel();
        cleanup();
        this.close(id);
        document.removeEventListener('keydown', onEscape);
      }
    };
    document.addEventListener('keydown', onEscape);

    // Open modal
    this.open(id);

    return id;
  },

  /**
   * Create alert dialog
   */
  alert(options = {}) {
    const {
      title = '提示',
      message = '',
      type = 'info', // info, success, warning, danger
      confirmText = '确定',
      onClose = () => {}
    } = options;

    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      danger: '⛔'
    };

    const id = Utils.generateId('alert-dialog');
    const html = `
      <div class="modal-overlay" id="${id}">
        <div class="modal modal-sm">
          <div class="modal-body">
            <div class="confirm-dialog">
              <div class="confirm-dialog-icon" style="background: var(--color-${type}-light); color: var(--color-${type});">${icons[type]}</div>
              <div class="confirm-dialog-title">${title}</div>
              ${message ? `<div class="confirm-dialog-message">${message}</div>` : ''}
              <div class="confirm-dialog-actions">
                <button class="btn btn-primary btn-lg" data-action="confirm">${confirmText}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    const overlay = container.firstElementChild;
    document.body.appendChild(overlay);

    const cleanup = () => {
      overlay.remove();
    };

    overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
      onClose();
      cleanup();
      this.close(id);
    });

    this.open(id);

    return id;
  },

  /**
   * Create custom modal from template
   */
  create(options = {}) {
    const {
      id = Utils.generateId('modal'),
      title = '',
      content = '',
      footer = '',
      size = '', // '', 'sm', 'lg', 'xl', 'full'
      closeOnOverlay = true,
      showClose = true
    } = options;

    const html = `
      <div class="modal-overlay" id="${id}">
        <div class="modal ${size ? 'modal-' + size : ''}">
          ${title || showClose ? `
          <div class="modal-header">
            <div class="modal-title">${title}</div>
            ${showClose ? '<button class="modal-close" data-action="close">×</button>' : ''}
          </div>
          ` : ''}
          <div class="modal-body">${content}</div>
          ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    const overlay = container.firstElementChild;
    document.body.appendChild(overlay);

    // Event listeners
    const closeBtn = overlay.querySelector('[data-action="close"]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close(id));
    }

    if (closeOnOverlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          this.close(id);
        }
      });
    }

    // Handle escape key
    const onEscape = e => {
      if (e.key === 'Escape') {
        this.close(id);
        document.removeEventListener('keydown', onEscape);
      }
    };
    overlay.addEventListener('modalopen', () => {
      document.addEventListener('keydown', onEscape);
    });

    return {
      id,
      open: () => this.open(id),
      close: () => this.close(id),
      element: overlay
    };
  }
};

/**
 * Drawer Component
 */
const Drawer = {
  activeDrawer: null,

  open(drawerId) {
    const overlay = document.getElementById(drawerId);
    if (!overlay) {
      console.warn(`Drawer with id "${drawerId}" not found`);
      return;
    }

    overlay.classList.add('show');
    this.activeDrawer = overlay;
    Utils.lockScroll();

    setTimeout(() => {
      const focusable = overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }, 100);

    overlay.dispatchEvent(new CustomEvent('draweropen'));
  },

  close(drawerId) {
    const overlay = drawerId
      ? document.getElementById(drawerId)
      : this.activeDrawer;

    if (!overlay) return;

    overlay.classList.remove('show');
    this.activeDrawer = null;
    Utils.unlockScroll();

    overlay.dispatchEvent(new CustomEvent('drawerclose'));
  },

  closeAll() {
    document.querySelectorAll('.drawer-overlay.show').forEach(el => {
      el.classList.remove('show');
    });
    this.activeDrawer = null;
    Utils.unlockScroll();
  },

  create(options = {}) {
    const {
      id = Utils.generateId('drawer'),
      title = '',
      content = '',
      footer = '',
      placement = 'right', // right, left
      size = '', // '', 'sm', 'lg', 'xl'
      closeOnOverlay = true
    } = options;

    const html = `
      <div class="drawer-overlay" id="${id}">
        <div class="drawer drawer-${placement} ${size ? 'drawer-' + size : ''}">
          <div class="drawer-header">
            <div class="drawer-title">${title}</div>
            <button class="drawer-close" data-action="close">×</button>
          </div>
          <div class="drawer-body">${content}</div>
          ${footer ? `<div class="drawer-footer">${footer}</div>` : ''}
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    const overlay = container.firstElementChild;
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('[data-action="close"]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close(id));
    }

    if (closeOnOverlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          this.close(id);
        }
      });
    }

    const onEscape = e => {
      if (e.key === 'Escape') {
        this.close(id);
        document.removeEventListener('keydown', onEscape);
      }
    };
    overlay.addEventListener('draweropen', () => {
      document.addEventListener('keydown', onEscape);
    });

    return {
      id,
      open: () => this.open(id),
      close: () => this.close(id),
      element: overlay
    };
  }
};

// Auto-initialize modal close buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        Modal.close(modal.id);
      }
    });
  });

  document.querySelectorAll('.drawer-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const drawer = btn.closest('.drawer-overlay');
      if (drawer) {
        Drawer.close(drawer.id);
      }
    });
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Modal, Drawer };
}