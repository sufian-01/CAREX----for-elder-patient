/**
 * Doctor Appointments Page Module with Multi-Language Support.
 */

import { state } from '../state.js';
import { generateId, escapeHtml } from '../utils/helpers.js';
import { isNotEmpty } from '../utils/validation.js';
import { formatTime12h, formatDateFriendly } from '../utils/dateUtils.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';
import { router } from '../router.js';
import { t } from '../services/languageService.js';

export function render() {
  const doctors = state.get('doctors') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">🩺 ${t('doctor.title')}</h1>
          <p class="page-subtitle">${t('doctor.subtitle')}</p>
        </div>
      </div>

      <!-- Add Appointment Form -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">${t('doctor.form_title')}</h2>
        <form id="doc-form">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md);">
            <div class="form-group">
              <label for="doc-name">${t('doctor.name_label')}</label>
              <input type="text" id="doc-name" class="form-control" placeholder="${t('doctor.name_placeholder')}" required>
            </div>

            <div class="form-group">
              <label for="doc-hosp">${t('doctor.hospital_label')}</label>
              <input type="text" id="doc-hosp" class="form-control" placeholder="${t('doctor.hospital_placeholder')}">
            </div>

            <div class="form-group">
              <label for="doc-date">${t('doctor.date_label')}</label>
              <input type="date" id="doc-date" class="form-control">
            </div>

            <div class="form-group">
              <label for="doc-time">${t('doctor.time_label')}</label>
              <input type="time" id="doc-time" class="form-control" value="10:30">
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label for="doc-reason">${t('doctor.reason_label')}</label>
              <input type="text" id="doc-reason" class="form-control" placeholder="${t('doctor.reason_placeholder')}">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-md);">
            <i data-lucide="calendar-plus"></i> ${t('doctor.btn_save')}
          </button>
        </form>
      </div>

      <!-- Appointments List -->
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800;">${t('doctor.list_title')}</h2>

        ${doctors.length > 0 ? doctors.map(d => `
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <h3 style="font-size: var(--font-size-lg); font-weight: 700;">🩺 ${escapeHtml(d.name)}</h3>
              <p style="color: var(--color-text-secondary); margin-top: 4px;">
                📅 ${formatDateFriendly(d.date)} · ${formatTime12h(d.time)}
              </p>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: 2px;">
                📍 ${escapeHtml(d.hospital || '—')} · ${escapeHtml(d.reason || '—')}
              </p>
            </div>

            <button class="btn btn-danger btn-sm delete-doc-btn" data-id="${d.id}">
              <i data-lucide="trash-2"></i> ${t('common.delete')}
            </button>
          </div>
        `).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="stethoscope"></i></div>
            <div class="empty-state-title">${t('doctor.empty_title')}</div>
            <p>${t('doctor.empty_desc')}</p>
          </div>
        `}
      </div>
    </div>
  `;
}

export function init() {
  const form = document.getElementById('doc-form');
  if (form) {
    const dateInput = document.getElementById('doc-date');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('doc-name').value;
      const hospital = document.getElementById('doc-hosp').value || 'Clinic';
      const date = document.getElementById('doc-date').value || new Date().toISOString().split('T')[0];
      const time = document.getElementById('doc-time').value || '10:30';
      const reason = document.getElementById('doc-reason').value || 'Regular visit';

      if (!isNotEmpty(name)) {
        toast.show(t('common.error'), 'warning');
        return;
      }

      const doctors = state.get('doctors') || [];
      const newDoc = {
        id: generateId(),
        name,
        hospital,
        date,
        time,
        reason,
        createdAt: new Date().toISOString()
      };

      state.set('doctors', [newDoc, ...doctors]);
      toast.show(t('doctor.toast_added'), 'success');
      router.handleRoute();
    });
  }

  document.querySelectorAll('.delete-doc-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      modal.show({
        title: t('doctor.modal_delete_title'),
        body: `<p>${t('doctor.modal_delete_body')}</p>`,
        confirmText: t('common.delete'),
        cancelText: t('common.cancel'),
        danger: true,
        onConfirm: () => {
          const doctors = state.get('doctors') || [];
          const updated = doctors.filter(d => d.id !== id);
          state.set('doctors', updated);
          toast.show(t('doctor.toast_deleted'), 'info');
          router.handleRoute();
        }
      });
    };
  });
}
