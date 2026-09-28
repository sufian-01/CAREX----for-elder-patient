/**
 * Settings & Accessibility Page Module with Multi-Language Support.
 */

import { state } from '../state.js';
import { storageService } from '../services/storageService.js';
import { notificationService } from '../services/notificationService.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';
import { getLanguage, setLanguage, t } from '../services/languageService.js';
import { router } from '../router.js';

export function render() {
  const userName = state.get('userName') || 'Samia';
  const settings = state.get('settings') || {};
  const currentLang = getLanguage();

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">⚙️ ${t('settings.title')}</h1>
          <p class="page-subtitle">${t('settings.subtitle')}</p>
        </div>
      </div>

      <!-- User Profile Config -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">${t('settings.profile_title')}</h2>
        <form id="profile-form">
          <div class="form-group">
            <label for="user-name-input">${t('settings.display_name')}</label>
            <input type="text" id="user-name-input" class="form-control" value="${userName}" required>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-xs);">
            ${t('settings.save_profile')}
          </button>
        </form>
      </div>

      <!-- Language Selector in Settings -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">${t('settings.language_title')}</h2>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-sm);">
          <div>
            <div style="font-weight: 700;">${t('common.select_language')}</div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${t('settings.language_desc')}</div>
          </div>
          <select id="settings-lang-select" class="form-control" style="width: auto;">
            <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
            <option value="hi" ${currentLang === 'hi' ? 'selected' : ''}>🇮🇳 हिंदी (Hindi)</option>
          </select>
        </div>
      </div>

      <!-- Accessibility Options -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">${t('settings.accessibility_title')}</h2>
        
        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-sm);">
            <div>
              <div style="font-weight: 700;">${t('settings.font_scaling')}</div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${t('settings.font_scaling_desc')}</div>
            </div>
            <select id="font-scale-select" class="form-control" style="width: auto;">
              <option value="normal" ${settings.fontSize === 'normal' ? 'selected' : ''}>${t('settings.font_normal')}</option>
              <option value="large" ${settings.fontSize === 'large' ? 'selected' : ''}>${t('settings.font_large')}</option>
              <option value="xlarge" ${settings.fontSize === 'xlarge' ? 'selected' : ''}>${t('settings.font_xlarge')}</option>
            </select>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-sm);">
            <div>
              <div style="font-weight: 700;">${t('settings.contrast')}</div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${t('settings.contrast_desc')}</div>
            </div>
            <select id="contrast-select" class="form-control" style="width: auto;">
              <option value="normal" ${settings.contrast === 'normal' ? 'selected' : ''}>${t('settings.contrast_standard')}</option>
              <option value="high" ${settings.contrast === 'high' ? 'selected' : ''}>${t('settings.contrast_high')}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">${t('settings.notifications_title')}</h2>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
          <div>
            <div style="font-weight: 700;">${t('settings.push_notifications')}</div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${t('settings.status_prefix')} ${notificationService.permission}</div>
          </div>
          <button id="req-notif-btn" class="btn btn-secondary">
            ${t('settings.req_permission')}
          </button>
        </div>
      </div>

      <!-- Data Management -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md); color: var(--color-danger);">
          ${t('settings.data_title')}
        </h2>
        <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
          <button id="export-data-btn" class="btn btn-secondary">
            <i data-lucide="download"></i> ${t('settings.export_json')}
          </button>
          <button id="clear-data-btn" class="btn btn-danger">
            <i data-lucide="trash-2"></i> ${t('settings.reset_data')}
          </button>
        </div>
      </div>

      <!-- App Credits / About CAREX -->
      <div class="card" style="background-color: var(--color-primary-light); border-color: var(--color-secondary);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; color: var(--color-primary); margin-bottom: var(--space-xs);">
          ${t('settings.about_title')}
        </h2>
        <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-md);">
          ${t('settings.about_desc')}
        </p>

        <div style="font-weight: 800; font-size: var(--font-size-base); color: var(--color-text); margin-bottom: var(--space-xs);">
          ${t('settings.creators_title')}
        </div>
        <ol style="padding-left: var(--space-lg); font-size: var(--font-size-base); font-weight: 700; color: var(--color-primary); display: flex; flex-direction: column; gap: 4px;">
          <li>Samia Naaz</li>
          <li>SHAULAT JAHAN</li>
          <li>Riva Naaz</li>
        </ol>
      </div>
    </div>
  `;
}

export function init() {
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.onsubmit = (e) => {
      e.preventDefault();
      const val = document.getElementById('user-name-input').value;
      state.set('userName', val);
      toast.show(t('settings.toast_profile_saved'), 'success');
      router.handleRoute();
    };
  }

  const langSelect = document.getElementById('settings-lang-select');
  if (langSelect) {
    langSelect.onchange = (e) => {
      setLanguage(e.target.value);
    };
  }

  const fontSelect = document.getElementById('font-scale-select');
  if (fontSelect) {
    fontSelect.onchange = () => {
      const val = fontSelect.value;
      const s = state.get('settings') || {};
      state.set('settings', { ...s, fontSize: val });
      document.documentElement.setAttribute('data-font-scale', val);
      toast.show(t('settings.toast_font_saved'), 'info');
    };
  }

  const contrastSelect = document.getElementById('contrast-select');
  if (contrastSelect) {
    contrastSelect.onchange = () => {
      const val = contrastSelect.value;
      const s = state.get('settings') || {};
      state.set('settings', { ...s, contrast: val });
      document.documentElement.setAttribute('data-contrast', val);
      toast.show(t('settings.toast_contrast_saved'), 'info');
    };
  }

  const notifBtn = document.getElementById('req-notif-btn');
  if (notifBtn) {
    notifBtn.onclick = () => {
      notificationService.requestPermission();
    };
  }

  const exportBtn = document.getElementById('export-data-btn');
  if (exportBtn) {
    exportBtn.onclick = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `carex_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.show(t('settings.toast_export_success'), 'success');
    };
  }

  const clearBtn = document.getElementById('clear-data-btn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      modal.show({
        title: t('settings.modal_reset_title'),
        body: `<p>${t('settings.modal_reset_body')}</p>`,
        confirmText: t('common.reset'),
        cancelText: t('common.cancel'),
        danger: true,
        onConfirm: () => {
          storageService.clearAll();
          toast.show(t('settings.toast_data_cleared'), 'info');
          setTimeout(() => window.location.reload(), 800);
        }
      });
    };
  }
}
