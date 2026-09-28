/**
 * Family Contact Management Page Module with Multi-Language Support.
 */

import { state } from '../state.js';
import { generateId, escapeHtml } from '../utils/helpers.js';
import { isNotEmpty, isValidPhone } from '../utils/validation.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';
import { router } from '../router.js';
import { t } from '../services/languageService.js';

export function render() {
  const family = state.get('family') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">📞 ${t('family.title')}</h1>
          <p class="page-subtitle">${t('family.subtitle')}</p>
        </div>
      </div>

      <!-- Add Contact Form -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">${t('family.form_title')}</h2>
        <form id="fam-form">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md);">
            <div class="form-group">
              <label for="fam-name">${t('family.name_label')}</label>
              <input type="text" id="fam-name" class="form-control" placeholder="${t('family.name_placeholder')}" required>
            </div>

            <div class="form-group">
              <label for="fam-rel">${t('family.rel_label')}</label>
              <input type="text" id="fam-rel" class="form-control" placeholder="${t('family.rel_placeholder')}">
            </div>

            <div class="form-group">
              <label for="fam-phone">${t('family.phone_label')}</label>
              <input type="tel" id="fam-phone" class="form-control" placeholder="${t('family.phone_placeholder')}">
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: var(--space-xs); margin-top: var(--space-sm);">
            <input type="checkbox" id="fam-emergency" style="width: auto;">
            <label for="fam-emergency" style="margin: 0;">${t('family.emergency_checkbox')}</label>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-md);">
            <i data-lucide="user-plus"></i> ${t('family.btn_add')}
          </button>
        </form>
      </div>

      <!-- Contacts List -->
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800;">${t('family.list_title')}</h2>

        ${family.length > 0 ? family.map(f => {
          const cleanPhone = (f.phone || '').replace(/[^0-9+]/g, '');
          const hasValidPhone = cleanPhone.length >= 3;

          return `
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
              <div>
                <div style="display: flex; align-items: center; gap: var(--space-xs);">
                  <h3 style="font-size: var(--font-size-lg); font-weight: 700;">👤 ${escapeHtml(f.name)}</h3>
                  ${f.isEmergency ? `<span class="badge badge-danger">🚨 ${t('family.primary_badge')}</span>` : ''}
                </div>
                <p style="color: var(--color-text-secondary); margin-top: 4px;">
                  ${escapeHtml(f.rel)} · 📱 ${escapeHtml(f.phone || t('family.no_phone'))}
                </p>
              </div>

              <div style="display: flex; gap: var(--space-xs); align-items: center;">
                ${hasValidPhone ? `
                  <a href="tel:${cleanPhone}" class="btn btn-primary btn-sm" style="min-height: 44px; padding: 0 var(--space-md);">
                    <i data-lucide="phone-call"></i> ${t('family.call_btn', { name: escapeHtml(f.name) })}
                  </a>
                ` : `
                  <button class="btn btn-secondary btn-sm" onclick="alert('${t('family.no_phone')}')" style="min-height: 44px;">
                    <i data-lucide="phone-off"></i> ${t('family.no_phone')}
                  </button>
                `}
                <button class="btn btn-danger btn-sm delete-fam-btn" data-id="${f.id}" style="min-height: 44px; min-width: 44px; padding: 0 12px;" aria-label="${t('common.delete')}">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </div>
          `;
        }).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="users"></i></div>
            <div class="empty-state-title">${t('family.empty_title')}</div>
            <p>${t('family.empty_desc')}</p>
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
        toast.show(t('common.error'), 'warning');
        return;
      }

      if (phone && !isValidPhone(phone)) {
        toast.show(t('family.phone_placeholder'), 'warning');
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
      toast.show(t('family.toast_added'), 'success');
      router.handleRoute();
    });
  }

  document.querySelectorAll('.delete-fam-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      modal.show({
        title: t('family.modal_delete_title'),
        body: `<p>${t('family.modal_delete_body')}</p>`,
        confirmText: t('common.delete'),
        cancelText: t('common.cancel'),
        danger: true,
        onConfirm: () => {
          const family = state.get('family') || [];
          const updated = family.filter(f => f.id !== id);
          state.set('family', updated);
          toast.show(t('family.toast_deleted'), 'info');
          router.handleRoute();
        }
      });
    };
  });
}
