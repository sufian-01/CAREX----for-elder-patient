/**
 * Daily Routine Page Module.
 */

import { state } from '../state.js';
import { generateId, escapeHtml } from '../utils/helpers.js';
import { isNotEmpty } from '../utils/validation.js';
import { formatTime12h } from '../utils/dateUtils.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function render() {
  const routine = state.get('routine') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">📅 Daily Routine</h1>
          <p class="page-subtitle">Schedule and track daily wellness activities.</p>
        </div>
      </div>

      <!-- Add Routine Form -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">Add Activity</h2>
        <form id="routine-form">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md);">
            <div class="form-group">
              <label for="routine-name">Activity Name *</label>
              <input type="text" id="routine-name" class="form-control" placeholder="e.g. Morning Walk / Hydration" required>
            </div>

            <div class="form-group">
              <label for="routine-time">Time</label>
              <input type="time" id="routine-time" class="form-control" value="08:00">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-md);">
            <i data-lucide="plus"></i> Add Routine Activity
          </button>
        </form>
      </div>

      <!-- Routine List -->
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800;">Daily Schedule</h2>

        ${routine.length > 0 ? routine.map(r => `
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <div style="display: flex; align-items: center; gap: var(--space-xs);">
                <h3 style="font-size: var(--font-size-lg); font-weight: 700;">⏰ ${formatTime12h(r.time)}</h3>
                <span class="badge badge-info">Daily Activity</span>
              </div>
              <p style="font-size: var(--font-size-base); margin-top: 4px;">
                ${escapeHtml(r.name)}
              </p>
            </div>

            <button class="btn btn-danger btn-sm delete-routine-btn" data-id="${r.id}">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        `).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="calendar"></i></div>
            <div class="empty-state-title">No daily routines scheduled</div>
            <p>Add daily walks, meal times, or exercises above.</p>
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
        toast.show('Please enter activity name', 'warning');
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
      toast.show('Daily routine activity added!', 'success');
      location.reload();
    });
  }

  document.querySelectorAll('.delete-routine-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      modal.show({
        title: 'Delete Activity',
        body: '<p>Are you sure you want to delete this routine activity?</p>',
        confirmText: 'Delete',
        danger: true,
        onConfirm: () => {
          const routine = state.get('routine') || [];
          const updated = routine.filter(r => r.id !== id);
          state.set('routine', updated);
          toast.show('Routine activity deleted.', 'info');
          location.hash = '#/routine';
        }
      });
    };
  });
}
