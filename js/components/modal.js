/**
 * Accessible Modal Component.
 */

import { refreshLucideIcons } from '../utils/helpers.js';

export const modal = {
  show({ title, body, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, danger = false }) {
    const container = document.getElementById('modal-container');
    if (!container) return;

    container.innerHTML = `
      <div class="modal-overlay animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-content animate-slide-up">
          <div class="modal-header">
            <h3 id="modal-title" class="modal-title">${title}</h3>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            ${body}
          </div>
          <div class="modal-footer">
            ${cancelText ? `<button class="btn btn-secondary" id="modal-cancel-btn">${cancelText}</button>` : ''}
            <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="modal-confirm-btn">${confirmText}</button>
          </div>
        </div>
      </div>
    `;

    refreshLucideIcons();

    const overlay = container.querySelector('.modal-overlay');
    const closeBtn = document.getElementById('modal-close-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');

    const close = () => {
      container.innerHTML = '';
    };

    if (closeBtn) closeBtn.onclick = close;
    if (cancelBtn) cancelBtn.onclick = close;
    if (overlay) {
      overlay.onclick = (e) => {
        if (e.target === overlay) close();
      };
    }

    if (confirmBtn) {
      confirmBtn.onclick = () => {
        if (typeof onConfirm === 'function') onConfirm();
        close();
      };
    }
  }
};
