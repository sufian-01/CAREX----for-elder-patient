/**
 * Notifications Center Page Module with Multi-Language Support.
 */

import { state } from '../state.js';
import { formatTime12h, formatDateFriendly } from '../utils/dateUtils.js';
import { escapeHtml } from '../utils/helpers.js';
import { t } from '../services/languageService.js';

export function render() {
  const medicines = state.get('medicines') || [];
  const doctors = state.get('doctors') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">🔔 ${t('notifications.title')}</h1>
          <p class="page-subtitle">${t('notifications.subtitle')}</p>
        </div>
      </div>

      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">${t('notifications.recent_alerts')}</h2>
        
        <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
          ${medicines.map(m => `
            <div style="padding: var(--space-sm) var(--space-md); background: var(--color-surface); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-xs);">
              <div>
                <strong style="color: var(--color-primary);">💊 ${t('notifications.med_alert')}</strong> ${t('notifications.take_med', { name: escapeHtml(m.name), dose: escapeHtml(m.dose), time: formatTime12h(m.time) })}
              </div>
              <span class="badge ${m.taken ? 'badge-success' : 'badge-warning'}">
                ${m.taken ? t('medicine.status_taken') : t('medicine.status_pending')}
              </span>
            </div>
          `).join('')}

          ${doctors.map(d => `
            <div style="padding: var(--space-sm) var(--space-md); background: var(--color-surface); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-xs);">
              <div>
                <strong style="color: var(--color-primary);">🩺 ${t('notifications.doctor_visit')}</strong> ${t('notifications.visit_desc', { name: escapeHtml(d.name), date: formatDateFriendly(d.date), time: formatTime12h(d.time) })}
              </div>
              <span class="badge badge-info">${t('common.upcoming')}</span>
            </div>
          `).join('')}

          ${medicines.length === 0 && doctors.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon"><i data-lucide="bell-off"></i></div>
              <div class="empty-state-title">${t('notifications.empty_title')}</div>
              <p>${t('notifications.empty_desc')}</p>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

export function init() {
  // Page init
}
