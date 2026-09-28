/**
 * Medicine Management Page Module with Multi-Language Support.
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
  const medicines = state.get('medicines') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">💊 ${t('medicine.title')}</h1>
          <p class="page-subtitle">${t('medicine.subtitle')}</p>
        </div>
      </div>

      <!-- Add / Edit Medicine Form -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">
          ${t('medicine.form_title')}
        </h2>
        <form id="med-form">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md);">
            <div class="form-group">
              <label for="med-name">${t('medicine.name_label')}</label>
              <input type="text" id="med-name" class="form-control" placeholder="${t('medicine.name_placeholder')}" required>
            </div>

            <div class="form-group">
              <label for="med-dose">${t('medicine.dose_label')}</label>
              <input type="text" id="med-dose" class="form-control" placeholder="${t('medicine.dose_placeholder')}">
            </div>

            <div class="form-group">
              <label for="med-time">${t('medicine.time_label')}</label>
              <input type="time" id="med-time" class="form-control" value="08:00">
            </div>

            <div class="form-group">
              <label for="med-freq">${t('medicine.freq_label')}</label>
              <select id="med-freq" class="form-control">
                <option value="Daily">${t('medicine.freq_daily')}</option>
                <option value="Twice a day">${t('medicine.freq_twice')}</option>
                <option value="Weekly">${t('medicine.freq_weekly')}</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-md);">
            <i data-lucide="plus"></i> ${t('medicine.btn_add')}
          </button>
        </form>
      </div>

      <!-- Medicine List -->
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; color: var(--color-text);">
          ${t('medicine.list_title')}
        </h2>

        ${medicines.length > 0 ? medicines.map(m => `
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <div style="display: flex; align-items: center; gap: var(--space-xs);">
                <h3 style="font-size: var(--font-size-lg); font-weight: 700;">💊 ${escapeHtml(m.name)}</h3>
                <span class="badge ${m.taken ? 'badge-success' : 'badge-warning'}">
                  ${m.taken ? `✅ ${t('medicine.status_taken')}` : `🔔 ${t('medicine.status_pending')}`}
                </span>
              </div>
              <p style="color: var(--color-text-secondary); margin-top: 4px;">
                🕐 ${formatTime12h(m.time)} · ${escapeHtml(m.dose)} · ${escapeHtml(m.freq)}
              </p>
            </div>

            <div style="display: flex; gap: var(--space-xs); align-items: center;">
              ${!m.taken ? `
                <button class="btn btn-primary btn-sm mark-taken-btn" data-id="${m.id}">
                  ✅ ${t('medicine.btn_taken')}
                </button>
              ` : `
                <button class="btn btn-secondary btn-sm reset-taken-btn" data-id="${m.id}">
                  ${t('medicine.btn_reset')}
                </button>
              `}
              <button class="btn btn-secondary btn-sm snooze-btn" data-name="${escapeHtml(m.name)}">
                ⏰ ${t('medicine.btn_later')}
              </button>
              <button class="btn btn-danger btn-sm delete-med-btn" data-id="${m.id}" aria-label="${t('common.delete')}">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
        `).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="pill"></i></div>
            <div class="empty-state-title">${t('medicine.empty_title')}</div>
            <p>${t('medicine.empty_desc')}</p>
          </div>
        `}
      </div>
    </div>
  `;
}

export function init() {
  const form = document.getElementById('med-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('med-name').value;
      const dose = document.getElementById('med-dose').value || '1 dose';
      const time = document.getElementById('med-time').value || '08:00';
      const freq = document.getElementById('med-freq').value || 'Daily';

      if (!isNotEmpty(name)) {
        toast.show(t('common.error'), 'warning');
        return;
      }

      const medicines = state.get('medicines') || [];
      const newMed = {
        id: generateId(),
        name,
        dose,
        time,
        freq,
        taken: false,
        createdAt: new Date().toISOString()
      };

      state.set('medicines', [newMed, ...medicines]);
      toast.show(t('medicine.toast_added'), 'success');
      router.handleRoute();
    });
  }

  // Event Listeners for actions
  document.querySelectorAll('.mark-taken-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const medicines = state.get('medicines') || [];
      const updated = medicines.map(m => m.id === id ? { ...m, taken: true } : m);
      state.set('medicines', updated);
      toast.show(t('medicine.toast_taken'), 'success');
      router.handleRoute();
    };
  });

  document.querySelectorAll('.reset-taken-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const medicines = state.get('medicines') || [];
      const updated = medicines.map(m => m.id === id ? { ...m, taken: false } : m);
      state.set('medicines', updated);
      toast.show(t('medicine.toast_reset'), 'info');
      router.handleRoute();
    };
  });

  document.querySelectorAll('.snooze-btn').forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.name;
      toast.show(t('medicine.toast_snooze', { name }), 'info');
    };
  });

  document.querySelectorAll('.delete-med-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      modal.show({
        title: t('medicine.modal_delete_title'),
        body: `<p>${t('medicine.modal_delete_body')}</p>`,
        confirmText: t('common.delete'),
        cancelText: t('common.cancel'),
        danger: true,
        onConfirm: () => {
          const medicines = state.get('medicines') || [];
          const updated = medicines.filter(m => m.id !== id);
          state.set('medicines', updated);
          toast.show(t('medicine.toast_deleted'), 'info');
          router.handleRoute();
        }
      });
    };
  });
}
