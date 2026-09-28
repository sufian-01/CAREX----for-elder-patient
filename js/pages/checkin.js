/**
 * Daily Check-in Page Module with Multi-Language Support.
 */

import { state } from '../state.js';
import { formatDateFriendly } from '../utils/dateUtils.js';
import { toast } from '../components/toast.js';
import { router } from '../router.js';
import { t } from '../services/languageService.js';

export function render() {
  const checkin = state.get('checkin') || { checked: false };
  const family = state.get('family') || [];
  const primaryContact = family.find(f => f.isEmergency) || family[0] || null;

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">❤️ ${t('checkin.title')}</h1>
          <p class="page-subtitle">${t('checkin.subtitle')}</p>
        </div>
      </div>

      <div class="card" style="text-align: center; padding: var(--space-2xl) var(--space-lg);">
        <h2 style="font-size: var(--font-size-2xl); font-weight: 800; color: var(--color-text);">
          ${t('checkin.question')}
        </h2>
        <p style="color: var(--color-text-secondary); margin-top: 4px;">
          ${t('checkin.desc')}
        </p>

        <div class="checkin-options">
          <button class="checkin-option-btn ${checkin.statusKey === 'great' || (!checkin.statusKey && checkin.statusText === "I'm doing well") ? 'selected' : ''}" data-key="great">
            <span style="font-size: 2.5rem;">🌟</span>
            <span style="font-weight: 800; font-size: var(--font-size-lg);">${t('checkin.feeling_great')}</span>
          </button>

          <button class="checkin-option-btn ${checkin.statusKey === 'ok' || (!checkin.statusKey && checkin.statusText === "I'm okay") ? 'selected' : ''}" data-key="ok">
            <span style="font-size: 2.5rem;">😊</span>
            <span style="font-weight: 800; font-size: var(--font-size-lg);">${t('checkin.feeling_ok')}</span>
          </button>

          <button class="checkin-option-btn ${checkin.statusKey === 'help' || (!checkin.statusKey && checkin.statusText === 'I need some help') ? 'selected' : ''}" data-key="help">
            <span style="font-size: 2.5rem;">🤝</span>
            <span style="font-weight: 800; font-size: var(--font-size-lg);">${t('checkin.feeling_help')}</span>
          </button>
        </div>

        <div style="margin-top: var(--space-xl);">
          <button id="do-checkin-btn" class="btn btn-primary btn-lg" style="font-size: var(--font-size-xl); padding: var(--space-md) var(--space-2xl);">
            ✅ ${t('checkin.btn_confirm')}
          </button>
        </div>

        <div style="margin-top: var(--space-lg);">
          <span class="badge ${checkin.checked ? 'badge-success' : 'badge-warning'}">
            ${checkin.checked ? `✅ ${t('checkin.status_done')}` : t('checkin.status_pending')}
          </span>
          ${checkin.timestamp ? `
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: 8px;">
              ${t('checkin.last_checkin')}: ${formatDateFriendly(checkin.timestamp)}
            </p>
          ` : ''}
        </div>
      </div>

      ${(checkin.statusKey === 'help' || checkin.statusText === 'I need some help') && primaryContact ? `
        <div class="card" style="background-color: var(--color-warning-bg); border-color: var(--color-warning);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <h3 style="font-size: var(--font-size-lg); font-weight: 800; color: var(--color-warning);">
                🤝 ${t('checkin.need_help_title')}
              </h3>
              <p style="color: var(--color-text-secondary); margin-top: 2px;">
                ${t('checkin.need_help_desc')}
              </p>
            </div>
            ${primaryContact.phone ? `
              <a href="tel:${primaryContact.phone}" class="btn btn-primary">
                📞 ${t('checkin.call_btn', { name: primaryContact.name })}
              </a>
            ` : ''}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export function init() {
  let selectedStatusKey = 'ok';

  document.querySelectorAll('.checkin-option-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.checkin-option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedStatusKey = btn.dataset.key;
    };
  });

  const checkBtn = document.getElementById('do-checkin-btn');
  if (checkBtn) {
    checkBtn.onclick = () => {
      state.set('checkin', {
        checked: true,
        timestamp: new Date().toISOString(),
        statusKey: selectedStatusKey,
        statusText: selectedStatusKey === 'great' ? "I'm doing well" : (selectedStatusKey === 'help' ? 'I need some help' : "I'm okay")
      });
      toast.show(t('checkin.toast_success'), 'success');
      router.handleRoute();
    };
  }
}
