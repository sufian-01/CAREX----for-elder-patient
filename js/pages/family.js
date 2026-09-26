/**
 * Family Contact Management Page Module.
 */

import { state } from '../state.js';
import { generateId, escapeHtml } from '../utils/helpers.js';
import { isNotEmpty, isValidPhone } from '../utils/validation.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function render() {
  const family = state.get('family') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">📞 Family & Caregiver Contacts</h1>
          <p class="page-subtitle">Keep in touch with family members and caregivers.</p>
        </div>
      </div>

      <!-- Add Contact Form -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">Add Family Contact</h2>
        <form id="fam-form">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md);">
            <div class="form-group">
              <label for="fam-name">Contact Name *</label>
              <input type="text" id="fam-name" class="form-control" placeholder="e.g. Sarah Jahan" required>
            </div>

            <div class="form-group">
              <label for="fam-rel">Relationship</label>
              <input type="text" id="fam-rel" class="form-control" placeholder="e.g. Daughter / Caregiver">
            </div>

            <div class="form-group">
              <label for="fam-phone">Phone Number</label>
              <input type="tel" id="fam-phone" class="form-control" placeholder="e.g. +1 555-0192">
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: var(--space-xs); margin-top: var(--space-sm);">
            <input type="checkbox" id="fam-emergency" style="width: auto;">
            <label for="fam-emergency" style="margin: 0;">Set as Primary Emergency Contact</label>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-md);">
            <i data-lucide="user-plus"></i> Add Contact
          </button>
        </form>
      </div>

      <!-- Contacts List -->
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800;">Saved Contacts</h2>

        ${family.length > 0 ? family.map(f => {
          const cleanPhone = (f.phone || '').replace(/[^0-9+]/g, '');
          const hasValidPhone = cleanPhone.length >= 3;

          return `
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
              <div>
                <div style="display: flex; align-items: center; gap: var(--space-xs);">
                  <h3 style="font-size: var(--font-size-lg); font-weight: 700;">👤 ${escapeHtml(f.name)}</h3>
                  ${f.isEmergency ? `<span class="badge badge-danger">🚨 Primary Emergency</span>` : ''}
                </div>
                <p style="color: var(--color-text-secondary); margin-top: 4px;">
                  ${escapeHtml(f.rel)} · 📱 ${escapeHtml(f.phone || 'No phone set')}
                </p>
              </div>

              <div style="display: flex; gap: var(--space-xs); align-items: center;">
                ${hasValidPhone ? `
                  <a href="tel:${cleanPhone}" class="btn btn-primary btn-sm" style="min-height: 44px; padding: 0 var(--space-md);">
                    <i data-lucide="phone-call"></i> Call ${escapeHtml(f.name)}
                  </a>
                ` : `
                  <button class="btn btn-secondary btn-sm" onclick="alert('Please add a valid phone number to call this contact.')" style="min-height: 44px;">
                    <i data-lucide="phone-off"></i> No Phone Number
                  </button>
                `}
                <button class="btn btn-danger btn-sm delete-fam-btn" data-id="${f.id}" style="min-height: 44px; min-width: 44px; padding: 0 12px;" aria-label="Delete Contact">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </div>
          `;
        }).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="users"></i></div>
            <div class="empty-state-title">No family contacts added yet</div>
            <p>Add family members above to call them quickly.</p>
          </div>
        `}
      </div>
    </div>
  `;
}

export function init() {
  const form = document.getElementById('fam-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fam-name').value;
      const rel = document.getElementById('fam-rel').value || 'Family';
      const phone = document.getElementById('fam-phone').value || '';
      const isEmergency = document.getElementById('fam-emergency').checked;

      if (!isNotEmpty(name)) {
        toast.show('Please enter contact name', 'warning');
        return;
      }

      if (phone && !isValidPhone(phone)) {
        toast.show('Please enter a valid phone number', 'warning');
        return;
      }

      let family = state.get('family') || [];
      if (isEmergency) {
        family = family.map(f => ({ ...f, isEmergency: false }));
      }

      const newContact = {
        id: generateId(),
        name,
        rel,
        phone,
        isEmergency,
        createdAt: new Date().toISOString()
      };

      state.set('family', [newContact, ...family]);
      toast.show('Family contact added successfully!', 'success');
      location.reload();
    });
  }

  document.querySelectorAll('.delete-fam-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      modal.show({
        title: 'Delete Contact',
        body: '<p>Are you sure you want to remove this family contact?</p>',
        confirmText: 'Delete',
        danger: true,
        onConfirm: () => {
          const family = state.get('family') || [];
          const updated = family.filter(f => f.id !== id);
          state.set('family', updated);
          toast.show('Contact deleted.', 'info');
          location.hash = '#/family';
        }
      });
    };
  });
}
