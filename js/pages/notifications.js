/**
 * Notifications Center Page Module.
 */

import { state } from '../state.js';
import { toast } from '../components/toast.js';

export function render() {
  const medicines = state.get('medicines') || [];
  const doctors = state.get('doctors') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">🔔 Notifications Center</h1>
          <p class="page-subtitle">Recent reminders and app notifications.</p>
        </div>
      </div>

      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">Recent Alerts</h2>
        
        <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
          ${medicines.map(m => `
            <div style="padding: var(--space-sm) var(--space-md); background: var(--color-surface); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--color-primary);">💊 Medicine Alert:</strong> Take ${m.name} (${m.dose}) at ${m.time}
              </div>
              <span class="badge ${m.taken ? 'badge-success' : 'badge-warning'}">
                ${m.taken ? 'Taken' : 'Pending'}
              </span>
            </div>
          `).join('')}

          ${doctors.map(d => `
            <div style="padding: var(--space-sm) var(--space-md); background: var(--color-surface); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--color-primary);">🩺 Doctor Visit:</strong> ${d.name} on ${d.date} at ${d.time}
              </div>
              <span class="badge badge-info">Upcoming</span>
            </div>
          `).join('')}

          ${medicines.length === 0 && doctors.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon"><i data-lucide="bell-off"></i></div>
              <div class="empty-state-title">No notifications right now</div>
              <p>Your reminders will appear here when scheduled.</p>
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
