/**
 * Health Notes Page Module.
 */

import { state } from '../state.js';
import { generateId, escapeHtml } from '../utils/helpers.js';
import { isNotEmpty } from '../utils/validation.js';
import { formatDateFriendly } from '../utils/dateUtils.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function render() {
  const notes = state.get('healthNotes') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">📝 Health Notes</h1>
          <p class="page-subtitle">Record vitals, symptoms, and health observations.</p>
        </div>
      </div>

      <!-- Add Note Form -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">Save Health Note</h2>
        <form id="note-form">
          <div class="form-group">
            <label for="note-title">Note Title *</label>
            <input type="text" id="note-title" class="form-control" placeholder="e.g. Blood pressure reading (120/80)" required>
          </div>

          <div class="form-group">
            <label for="note-body">Health Note / Details *</label>
            <textarea id="note-body" class="form-control" placeholder="Write health details or symptoms..." required></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-xs);">
            <i data-lucide="save"></i> Save Health Note
          </button>
        </form>
      </div>

      <!-- Notes List -->
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800;">Saved Health Notes</h2>

        ${notes.length > 0 ? notes.map(n => `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-md);">
              <div>
                <h3 style="font-size: var(--font-size-lg); font-weight: 700;">📝 ${escapeHtml(n.title)}</h3>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: 2px;">
                  📅 ${formatDateFriendly(n.createdAt)}
                </p>
                <p style="font-size: var(--font-size-base); margin-top: var(--space-sm); white-space: pre-wrap;">
                  ${escapeHtml(n.body)}
                </p>
              </div>

              <button class="btn btn-danger btn-sm delete-note-btn" data-id="${n.id}">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
        `).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="file-text"></i></div>
            <div class="empty-state-title">No health notes recorded yet</div>
            <p>Save notes about vitals, symptoms, or caregiver observations above.</p>
          </div>
        `}
      </div>
    </div>
  `;
}

export function init() {
  const form = document.getElementById('note-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('note-title').value;
      const body = document.getElementById('note-body').value;

      if (!isNotEmpty(title) || !isNotEmpty(body)) {
        toast.show('Please fill in both title and note body', 'warning');
        return;
      }

      const notes = state.get('healthNotes') || [];
      const newNote = {
        id: generateId(),
        title,
        body,
        createdAt: new Date().toISOString()
      };

      state.set('healthNotes', [newNote, ...notes]);
      toast.show('Health note saved!', 'success');
      location.reload();
    });
  }

  document.querySelectorAll('.delete-note-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      modal.show({
        title: 'Delete Note',
        body: '<p>Are you sure you want to delete this health note?</p>',
        confirmText: 'Delete',
        danger: true,
        onConfirm: () => {
          const notes = state.get('healthNotes') || [];
          const updated = notes.filter(n => n.id !== id);
          state.set('healthNotes', updated);
          toast.show('Note deleted.', 'info');
          location.hash = '#/health-notes';
        }
      });
    };
  });
}
