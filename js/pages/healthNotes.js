/**
 * Health Notes Page Module with Multi-Language Support.
 */

import { state } from '../state.js';
import { generateId, escapeHtml } from '../utils/helpers.js';
import { isNotEmpty } from '../utils/validation.js';
import { formatDateFriendly } from '../utils/dateUtils.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';
import { router } from '../router.js';
import { t } from '../services/languageService.js';

export function render() {
  const notes = state.get('healthNotes') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">📝 ${t('notes.title')}</h1>
          <p class="page-subtitle">${t('notes.subtitle')}</p>
        </div>
      </div>

      <!-- Add Note Form -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">${t('notes.form_title')}</h2>
        <form id="note-form">
          <div class="form-group">
            <label for="note-title">${t('notes.title_label')}</label>
            <input type="text" id="note-title" class="form-control" placeholder="${t('notes.title_placeholder')}" required>
          </div>

          <div class="form-group">
            <label for="note-body">${t('notes.body_label')}</label>
            <textarea id="note-body" class="form-control" placeholder="${t('notes.body_placeholder')}" required></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-xs);">
            <i data-lucide="save"></i> ${t('notes.btn_save')}
          </button>
        </form>
      </div>

      <!-- Notes List -->
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800;">${t('notes.list_title')}</h2>

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

              <button class="btn btn-danger btn-sm delete-note-btn" data-id="${n.id}" aria-label="${t('common.delete')}">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
        `).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="file-text"></i></div>
            <div class="empty-state-title">${t('notes.empty_title')}</div>
            <p>${t('notes.empty_desc')}</p>
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
        toast.show(t('common.error'), 'warning');
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
      toast.show(t('notes.toast_added'), 'success');
      router.handleRoute();
    });
  }

  document.querySelectorAll('.delete-note-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      modal.show({
        title: t('notes.modal_delete_title'),
        body: `<p>${t('notes.modal_delete_body')}</p>`,
        confirmText: t('common.delete'),
        cancelText: t('common.cancel'),
        danger: true,
        onConfirm: () => {
          const notes = state.get('healthNotes') || [];
          const updated = notes.filter(n => n.id !== id);
          state.set('healthNotes', updated);
          toast.show(t('notes.toast_deleted'), 'info');
          router.handleRoute();
        }
      });
    };
  });
}
