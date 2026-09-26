/**
 * Medicine Management Page Module.
 */

import { state } from '../state.js';
import { generateId, escapeHtml } from '../utils/helpers.js';
import { isNotEmpty } from '../utils/validation.js';
import { formatTime12h } from '../utils/dateUtils.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function render() {
  const medicines = state.get('medicines') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">💊 Medicine Reminders</h1>
          <p class="page-subtitle">Schedule and track your daily dosages.</p>
        </div>
      </div>

      <!-- Add / Edit Medicine Form -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">
          Add New Medicine
        </h2>
        <form id="med-form">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md);">
            <div class="form-group">
              <label for="med-name">Medicine Name *</label>
              <input type="text" id="med-name" class="form-control" placeholder="e.g. Paracetamol" required>
            </div>

            <div class="form-group">
              <label for="med-dose">Dosage</label>
              <input type="text" id="med-dose" class="form-control" placeholder="e.g. 1 tablet (500mg)">
            </div>

            <div class="form-group">
              <label for="med-time">Time</label>
              <input type="time" id="med-time" class="form-control" value="08:00">
            </div>

            <div class="form-group">
              <label for="med-freq">Frequency</label>
              <select id="med-freq" class="form-control">
                <option value="Daily">Daily</option>
                <option value="Twice a day">Twice a day</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-md);">
            <i data-lucide="plus"></i> Set Medicine Reminder
          </button>
        </form>
      </div>

      <!-- Medicine List -->
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; color: var(--color-text);">Your Medicines</h2>

        ${medicines.length > 0 ? medicines.map(m => `
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <div style="display: flex; align-items: center; gap: var(--space-xs);">
                <h3 style="font-size: var(--font-size-lg); font-weight: 700;">💊 ${escapeHtml(m.name)}</h3>
                <span class="badge ${m.taken ? 'badge-success' : 'badge-warning'}">
                  ${m.taken ? '✅ Taken' : '🔔 Reminder Set'}
                </span>
              </div>
              <p style="color: var(--color-text-secondary); margin-top: 4px;">
                🕐 ${formatTime12h(m.time)} · ${escapeHtml(m.dose)} · ${escapeHtml(m.freq)}
              </p>
            </div>

            <div style="display: flex; gap: var(--space-xs); align-items: center;">
              ${!m.taken ? `
                <button class="btn btn-primary btn-sm mark-taken-btn" data-id="${m.id}">
                  ✅ Mark Taken
                </button>
              ` : `
                <button class="btn btn-secondary btn-sm reset-taken-btn" data-id="${m.id}">
                  Reset Status
                </button>
              `}
              <button class="btn btn-secondary btn-sm snooze-btn" data-name="${escapeHtml(m.name)}">
                ⏰ Later
              </button>
              <button class="btn btn-danger btn-sm delete-med-btn" data-id="${m.id}">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
        `).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="pill"></i></div>
            <div class="empty-state-title">No medicines added yet</div>
            <p>Add your first medicine above to start receiving reminders.</p>
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
        toast.show('Please enter a medicine name', 'warning');
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
      toast.show('Medicine reminder set successfully!', 'success');
      location.reload();
    });
  }

  // Event Listeners for actions
  document.querySelectorAll('.mark-taken-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const medicines = state.get('medicines') || [];
      const updated = medicines.map(m => m.id === id ? { ...m, taken: true } : m);
      state.set('medicines', updated);
      toast.show('Medicine marked as taken! Great job ❤️', 'success');
      location.hash = '#/medicine';
    };
  });

  document.querySelectorAll('.reset-taken-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const medicines = state.get('medicines') || [];
      const updated = medicines.map(m => m.id === id ? { ...m, taken: false } : m);
      state.set('medicines', updated);
      toast.show('Medicine status reset.', 'info');
      location.hash = '#/medicine';
    };
  });

  document.querySelectorAll('.snooze-btn').forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.name;
      toast.show(`Reminder for ${name} postponed by 15 minutes.`, 'info');
    };
  });

  document.querySelectorAll('.delete-med-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      modal.show({
        title: 'Delete Medicine',
        body: '<p>Are you sure you want to delete this medicine reminder?</p>',
        confirmText: 'Delete',
        danger: true,
        onConfirm: () => {
          const medicines = state.get('medicines') || [];
          const updated = medicines.filter(m => m.id !== id);
          state.set('medicines', updated);
          toast.show('Medicine deleted.', 'info');
          location.hash = '#/medicine';
        }
      });
    };
  });
}
