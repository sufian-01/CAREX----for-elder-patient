/**
 * Daily Routine Page Module with Multi-Language Support.
 */

import { state } from '../state.js';
import { generateId, escapeHtml } from '../utils/helpers.js';
import { isNotEmpty } from '../utils/validation.js';
import { formatTime12h } from '../utils/dateUtils.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';
import { router } from '../router.js';
import { t } from '../services/languageService.js';

export function render() {
  const routine = state.get('routine') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">📅 ${t('routine.title')}</h1>
          <p class="page-subtitle">${t('routine.subtitle')}</p>
        </div>
      </div>

      <!-- Add Routine Form -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">${t('routine.form_title')}</h2>
        <form id="routine-form">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md);">
            <div class="form-group">
              <label for="routine-name">${t('routine.name_label')}</label>
              <input type="text" id="routine-name" class="form-control" placeholder="${t('routine.name_placeholder')}" required>
            </div>

            <div class="form-group">
              <label for="routine-time">${t('routine.time_label')}</label>
              <input type="time" id="routine-time" class="form-control" value="08:00">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-md);">
            <i data-lucide="plus"></i> ${t('routine.btn_add')}
          </button>
        </form>
      </div>

      <!-- Routine List -->
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800;">${t('routine.list_title')}</h2>

        ${routine.length > 0 ? routine.map(r => `
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <div style="display: flex; align-items: center; gap: var(--space-xs);">
                <h3 style="font-size: var(--font-size-lg); font-weight: 700;">⏰ ${formatTime12h(r.time)}</h3>
                <span class="badge badge-info">${t('routine.badge')}</span>
              </div>
              <p style="font-size: var(--font-size-base); margin-top: 4px;">
                ${escapeHtml(r.name)}
              </p>
            </div>

            <button class="btn btn-danger btn-sm delete-routine-btn" data-id="${r.id}" aria-label="${t('common.delete')}">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        `).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="calendar"></i></div>
            <div class="empty-state-title">${t('routine.empty_title')}</div>
            <p>${t('routine.empty_desc')}</p>
          </div>
        `}
      </div>
    </div>
  `;
}

export function init() {
  const form = document.getElementById('routine-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('routine-name').value;
      const time = document.getElementById('routine-time').value || '08:00';

      if (!isNotEmpty(name)) {
        toast.show(t('common.error'), 'warning');
        return;
      }

      const routine = state.get('routine') || [];
      const newRoutine = {
        id: generateId(),
        name,
        time,
        completed: false,
        createdAt: new Date().toISOString()
      };

      state.set('routine', [newRoutine, ...routine]);
      toast.show(t('routine.toast_added'), 'success');
      router.handleRoute();
    });
  }

  document.querySelectorAll('.delete-routine-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      modal.show({
        title: t('routine.modal_delete_title'),
        body: `<p>${t('routine.modal_delete_body')}</p>`,
        confirmText: t('common.delete'),
        cancelText: t('common.cancel'),
        danger: true,
        onConfirm: () => {
          const routine = state.get('routine') || [];
          const updated = routine.filter(r => r.id !== id);
          state.set('routine', updated);
          toast.show(t('routine.toast_deleted'), 'info');
          router.handleRoute();
        }
      });
    };
  });
}
