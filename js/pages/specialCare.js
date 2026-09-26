/**
 * Special Care Instructions Page Module.
 */

import { state } from '../state.js';
import { generateId, escapeHtml } from '../utils/helpers.js';
import { isNotEmpty } from '../utils/validation.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function render() {
  const specialCare = state.get('specialCare') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">🧡 Special Care Instructions</h1>
          <p class="page-subtitle">Document personal care needs and caregiver instructions.</p>
        </div>
      </div>

      <!-- Add Special Care Form -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">Add Special Care Need</h2>
        <form id="special-form">
          <div class="form-group">
            <label for="special-name">Care Need / Category *</label>
            <input type="text" id="special-name" class="form-control" placeholder="e.g. Walking assistance / Mobility" required>
          </div>

          <div class="form-group">
            <label for="special-body">Detailed Instructions</label>
            <textarea id="special-body" class="form-control" placeholder="Write specific instructions for family or caregivers..."></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-xs);">
            <i data-lucide="plus"></i> Save Instructions
          </button>
        </form>
      </div>

      <!-- Special Care List -->
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800;">Saved Instructions</h2>

        ${specialCare.length > 0 ? specialCare.map(s => `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-md);">
              <div>
                <h3 style="font-size: var(--font-size-lg); font-weight: 700;">🧡 ${escapeHtml(s.name)}</h3>
                <p style="font-size: var(--font-size-base); margin-top: var(--space-xs); white-space: pre-wrap;">
                  ${escapeHtml(s.body || 'No detailed instructions provided.')}
                </p>
              </div>

              <button class="btn btn-danger btn-sm delete-special-btn" data-id="${s.id}">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
        `).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="shield-alert"></i></div>
            <div class="empty-state-title">No special care instructions saved</div>
            <p>Add care instructions above for family and caregivers.</p>
          </div>
        `}
      </div>
    </div>
  `;
}

export function init() {
  const form = document.getElementById('special-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('special-name').value;
      const body = document.getElementById('special-body').value || 'No details provided.';

      if (!isNotEmpty(name)) {
        toast.show('Please enter a care need title', 'warning');
        return;
      }

      const specialCare = state.get('specialCare') || [];
      const newSpecial = {
        id: generateId(),
        name,
        body,
        createdAt: new Date().toISOString()
      };

      state.set('specialCare', [newSpecial, ...specialCare]);
      toast.show('Special care instructions saved!', 'success');
      location.reload();
    });
  }

  document.querySelectorAll('.delete-special-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      modal.show({
        title: 'Delete Instruction',
        body: '<p>Are you sure you want to delete these care instructions?</p>',
        confirmText: 'Delete',
        danger: true,
        onConfirm: () => {
          const specialCare = state.get('specialCare') || [];
          const updated = specialCare.filter(s => s.id !== id);
          state.set('specialCare', updated);
          toast.show('Special care item deleted.', 'info');
          location.hash = '#/special-care';
        }
      });
    };
  });
}
