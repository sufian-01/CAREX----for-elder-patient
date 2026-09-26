/**
 * Doctor Appointments Page Module.
 */

import { state } from '../state.js';
import { generateId, escapeHtml } from '../utils/helpers.js';
import { isNotEmpty } from '../utils/validation.js';
import { formatTime12h, formatDateFriendly } from '../utils/dateUtils.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function render() {
  const doctors = state.get('doctors') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">🩺 Doctor Appointments</h1>
          <p class="page-subtitle">Schedule and view medical visits.</p>
        </div>
      </div>

      <!-- Add Appointment Form -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">Schedule Appointment</h2>
        <form id="doc-form">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md);">
            <div class="form-group">
              <label for="doc-name">Doctor's Name *</label>
              <input type="text" id="doc-name" class="form-control" placeholder="e.g. Dr. Sharma" required>
            </div>

            <div class="form-group">
              <label for="doc-hosp">Hospital / Clinic</label>
              <input type="text" id="doc-hosp" class="form-control" placeholder="e.g. City Care Hospital">
            </div>

            <div class="form-group">
              <label for="doc-date">Date</label>
              <input type="date" id="doc-date" class="form-control">
            </div>

            <div class="form-group">
              <label for="doc-time">Time</label>
              <input type="time" id="doc-time" class="form-control" value="10:30">
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label for="doc-reason">Reason for Visit</label>
              <input type="text" id="doc-reason" class="form-control" placeholder="e.g. Regular Checkup / Blood Pressure">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-md);">
            <i data-lucide="calendar-plus"></i> Save Appointment
          </button>
        </form>
      </div>

      <!-- Appointments List -->
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800;">Upcoming Visits</h2>

        ${doctors.length > 0 ? doctors.map(d => `
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <h3 style="font-size: var(--font-size-lg); font-weight: 700;">🩺 ${escapeHtml(d.name)}</h3>
              <p style="color: var(--color-text-secondary); margin-top: 4px;">
                📅 ${formatDateFriendly(d.date)} at ${formatTime12h(d.time)}
              </p>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: 2px;">
                📍 ${escapeHtml(d.hospital || 'Clinic not set')} · Reason: ${escapeHtml(d.reason || 'General checkup')}
              </p>
            </div>

            <button class="btn btn-danger btn-sm delete-doc-btn" data-id="${d.id}">
              <i data-lucide="trash-2"></i> Delete
            </button>
          </div>
        `).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="stethoscope"></i></div>
            <div class="empty-state-title">No doctor appointments scheduled</div>
            <p>Save your upcoming medical visits above.</p>
          </div>
        `}
      </div>
    </div>
  `;
}

export function init() {
  const form = document.getElementById('doc-form');
  if (form) {
    // Set default date picker to today
    const dateInput = document.getElementById('doc-date');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('doc-name').value;
      const hospital = document.getElementById('doc-hosp').value || 'Clinic not set';
      const date = document.getElementById('doc-date').value || new Date().toISOString().split('T')[0];
      const time = document.getElementById('doc-time').value || '10:30';
      const reason = document.getElementById('doc-reason').value || 'General appointment';

      if (!isNotEmpty(name)) {
        toast.show('Please enter doctor name', 'warning');
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
      toast.show('Doctor appointment saved!', 'success');
      location.reload();
    });
  }

  document.querySelectorAll('.delete-doc-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      modal.show({
        title: 'Delete Appointment',
        body: '<p>Are you sure you want to delete this doctor appointment?</p>',
        confirmText: 'Delete',
        danger: true,
        onConfirm: () => {
          const doctors = state.get('doctors') || [];
          const updated = doctors.filter(d => d.id !== id);
          state.set('doctors', updated);
          toast.show('Appointment deleted.', 'info');
          location.hash = '#/doctor';
        }
      });
    };
  });
}
