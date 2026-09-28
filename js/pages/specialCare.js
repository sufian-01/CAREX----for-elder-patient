/**
 * Special Care Instructions Page Module with Multi-Language Support.
 */

import { state } from '../state.js';
import { generateId, escapeHtml } from '../utils/helpers.js';
import { isNotEmpty } from '../utils/validation.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';
import { router } from '../router.js';
import { t } from '../services/languageService.js';

export function render() {
  const specialCare = state.get('specialCare') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">🧡 ${t('special_care.title')}</h1>
          <p class="page-subtitle">${t('special_care.subtitle')}</p>
        </div>
      </div>

      <!-- Add Special Care Form -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">${t('special_care.form_title')}</h2>
        <form id="special-form">
          <div class="form-group">
            <label for="special-name">${t('special_care.name_label')}</label>
            <input type="text" id="special-name" class="form-control" placeholder="${t('special_care.name_placeholder')}" required>
          </div>

          <div class="form-group">
            <label for="special-body">${t('special_care.body_label')}</label>
            <textarea id="special-body" class="form-control" placeholder="${t('special_care.body_placeholder')}"></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-xs);">
            <i data-lucide="plus"></i> ${t('special_care.btn_save')}
          </button>
        </form>
      </div>

      <!-- Special Care List -->
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800;">${t('special_care.list_title')}</h2>

        ${specialCare.length > 0 ? specialCare.map(s => `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-md);">
              <div>
                <h3 style="font-size: var(--font-size-lg); font-weight: 700;">🧡 ${escapeHtml(s.name)}</h3>
                <p style="font-size: var(--font-size-base); margin-top: var(--space-xs); white-space: pre-wrap;">
                  ${escapeHtml(s.body || '—')}
                </p>
              </div>

              <button class="btn btn-danger btn-sm delete-special-btn" data-id="${s.id}" aria-label="${t('common.delete')}">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
        `).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="shield-alert"></i></div>
            <div class="empty-state-title">${t('special_care.empty_title')}</div>
            <p>${t('special_care.empty_desc')}</p>
          </div>
        `}
      </div>
    </div>
  `;
}

export function init() {
  const form = document.getElementById('special-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('special-name').value;
      const body = document.getElementById('special-body').value || '';

      if (!isNotEmpty(name)) {
        toast.show(t('common.error'), 'warning');
        return;
      }

      const specialCare = state.get('specialCare') || [];
      const newSpecial = {
        id: generateId(),
        name,
        body,
        createdAt: new Date().toISOString()
      };

      state.set('specialCare', [newSpecial, ...specialCare]);
      toast.show(t('special_care.toast_added'), 'success');
      router.handleRoute();
    });
  }

  document.querySelectorAll('.delete-special-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      modal.show({
        title: t('special_care.modal_delete_title'),
        body: `<p>${t('special_care.modal_delete_body')}</p>`,
        confirmText: t('common.delete'),
        cancelText: t('common.cancel'),
        danger: true,
        onConfirm: () => {
          const specialCare = state.get('specialCare') || [];
          const updated = specialCare.filter(s => s.id !== id);
          state.set('specialCare', updated);
          toast.show(t('special_care.toast_deleted'), 'info');
          router.handleRoute();
        }
      });
    };
  });
}
