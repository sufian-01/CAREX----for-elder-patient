/**
 * Daily Check-in Page Module.
 */

import { state } from '../state.js';
import { formatDateFriendly } from '../utils/dateUtils.js';
import { toast } from '../components/toast.js';

export function render() {
  const checkin = state.get('checkin') || { checked: false };
  const family = state.get('family') || [];
  const primaryContact = family.find(f => f.isEmergency) || family[0] || null;

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">❤️ Daily Check-in</h1>
          <p class="page-subtitle">Confirm your wellness status for peace of mind.</p>
        </div>
      </div>

      <div class="card" style="text-align: center; padding: var(--space-2xl) var(--space-lg);">
        <h2 style="font-size: var(--font-size-2xl); font-weight: 800; color: var(--color-text);">
          How are you feeling today?
        </h2>
        <p style="color: var(--color-text-secondary); margin-top: 4px;">
          Select your status to let family members know you are safe.
        </p>

        <div class="checkin-options">
          <button class="checkin-option-btn ${checkin.statusText === "I'm doing well" ? 'selected' : ''}" data-status="I'm doing well">
            <span style="font-size: 2.5rem;">🌟</span>
            <span style="font-weight: 800; font-size: var(--font-size-lg);">I'm doing well</span>
          </button>

          <button class="checkin-option-btn ${checkin.statusText === "I'm okay" ? 'selected' : ''}" data-status="I'm okay">
            <span style="font-size: 2.5rem;">😊</span>
            <span style="font-weight: 800; font-size: var(--font-size-lg);">I'm okay</span>
          </button>

          <button class="checkin-option-btn ${checkin.statusText === 'I need some help' ? 'selected' : ''}" data-status="I need some help">
            <span style="font-size: 2.5rem;">🤝</span>
            <span style="font-weight: 800; font-size: var(--font-size-lg);">I need help</span>
          </button>
        </div>

        <div style="margin-top: var(--space-xl);">
          <button id="do-checkin-btn" class="btn btn-primary btn-lg" style="font-size: var(--font-size-xl); padding: var(--space-md) var(--space-2xl);">
            ✅ Confirm Check-in
          </button>
        </div>

        <div style="margin-top: var(--space-lg);">
          <span class="badge ${checkin.checked ? 'badge-success' : 'badge-warning'}">
            ${checkin.checked ? '✅ Checked In Today' : 'Pending Today'}
          </span>
          ${checkin.timestamp ? `
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: 8px;">
              Last Check-in: ${formatDateFriendly(checkin.timestamp)}
            </p>
          ` : ''}
        </div>
      </div>

      ${checkin.statusText === 'I need some help' && primaryContact ? `
        <div class="card" style="background-color: var(--color-warning-bg); border-color: var(--color-warning);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <h3 style="font-size: var(--font-size-lg); font-weight: 800; color: var(--color-warning);">
                🤝 Need Assistance?
              </h3>
              <p style="color: var(--color-text-secondary); margin-top: 2px;">
                Contact your family or caregiver directly:
              </p>
            </div>
            ${primaryContact.phone ? `
              <a href="tel:${primaryContact.phone}" class="btn btn-primary">
                📞 Call ${primaryContact.name}
              </a>
            ` : ''}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export function init() {
  let selectedStatus = "I'm okay";

  document.querySelectorAll('.checkin-option-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.checkin-option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedStatus = btn.dataset.status;
    };
  });

  const checkBtn = document.getElementById('do-checkin-btn');
  if (checkBtn) {
    checkBtn.onclick = () => {
      state.set('checkin', {
        checked: true,
        timestamp: new Date().toISOString(),
        statusText: selectedStatus
      });
      toast.show('Check-in completed successfully! ❤️', 'success');
      location.reload();
    };
  }
}
