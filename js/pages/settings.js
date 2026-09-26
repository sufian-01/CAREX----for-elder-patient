/**
 * Settings & Accessibility Page Module.
 */

import { state } from '../state.js';
import { storageService } from '../services/storageService.js';
import { notificationService } from '../services/notificationService.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export function render() {
  const userName = state.get('userName') || 'Samia';
  const settings = state.get('settings') || {};

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">⚙️ Settings & Preferences</h1>
          <p class="page-subtitle">Personalize display, notifications, and manage app data.</p>
        </div>
      </div>

      <!-- User Profile Config -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">User Profile</h2>
        <form id="profile-form">
          <div class="form-group">
            <label for="user-name-input">Display Name</label>
            <input type="text" id="user-name-input" class="form-control" value="${userName}" required>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-xs);">
            Save Profile Name
          </button>
        </form>
      </div>

      <!-- Accessibility Options -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">Accessibility Options</h2>
        
        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-sm);">
            <div>
              <div style="font-weight: 700;">Font Size Scaling</div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Increase text size for easier reading</div>
            </div>
            <select id="font-scale-select" class="form-control" style="width: auto;">
              <option value="normal" ${settings.fontSize === 'normal' ? 'selected' : ''}>Normal (16px)</option>
              <option value="large" ${settings.fontSize === 'large' ? 'selected' : ''}>Large (18px)</option>
              <option value="xlarge" ${settings.fontSize === 'xlarge' ? 'selected' : ''}>Extra Large (20px)</option>
            </select>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-sm);">
            <div>
              <div style="font-weight: 700;">High Contrast Mode</div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Enhance color contrast for low-vision users</div>
            </div>
            <select id="contrast-select" class="form-control" style="width: auto;">
              <option value="normal" ${settings.contrast === 'normal' ? 'selected' : ''}>Standard</option>
              <option value="high" ${settings.contrast === 'high' ? 'selected' : ''}>High Contrast</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">Notifications</h2>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
          <div>
            <div style="font-weight: 700;">Browser Push Notifications</div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Status: ${notificationService.permission}</div>
          </div>
          <button id="req-notif-btn" class="btn btn-secondary">
            Request Notification Permission
          </button>
        </div>
      </div>

      <!-- Data Management -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md); color: var(--color-danger);">
          Data & Reset Options
        </h2>
        <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
          <button id="export-data-btn" class="btn btn-secondary">
            <i data-lucide="download"></i> Export Data (JSON)
          </button>
          <button id="clear-data-btn" class="btn btn-danger">
            <i data-lucide="trash-2"></i> Reset Demo Data
          </button>
        </div>
      </div>

      <!-- App Credits / About CAREX -->
      <div class="card" style="background-color: var(--color-primary-light); border-color: var(--color-secondary);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; color: var(--color-primary); margin-bottom: var(--space-xs);">
          About CAREX & App Credits
        </h2>
        <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-md);">
          Simple care, safety, and connection for senior citizens.
        </p>

        <div style="font-weight: 800; font-size: var(--font-size-base); color: var(--color-text); margin-bottom: var(--space-xs);">
          Application Creators:
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
      toast.show('Profile name updated!', 'success');
      location.reload();
    };
  }

  const fontSelect = document.getElementById('font-scale-select');
  if (fontSelect) {
    fontSelect.onchange = () => {
      const val = fontSelect.value;
      const s = state.get('settings') || {};
      state.set('settings', { ...s, fontSize: val });
      document.documentElement.setAttribute('data-font-scale', val);
      toast.show('Font size updated!', 'info');
    };
  }

  const contrastSelect = document.getElementById('contrast-select');
  if (contrastSelect) {
    contrastSelect.onchange = () => {
      const val = contrastSelect.value;
      const s = state.get('settings') || {};
      state.set('settings', { ...s, contrast: val });
      document.documentElement.setAttribute('data-contrast', val);
      toast.show('Contrast updated!', 'info');
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
      toast.show('CAREX data exported successfully!', 'success');
    };
  }

  const clearBtn = document.getElementById('clear-data-btn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      modal.show({
        title: 'Reset All Data',
        body: '<p>Are you sure you want to clear all stored CAREX data and reset back to initial defaults?</p>',
        confirmText: 'Reset Data',
        danger: true,
        onConfirm: () => {
          storageService.clearAll();
          toast.show('All data cleared!', 'info');
          setTimeout(() => window.location.reload(), 800);
        }
      });
    };
  }
}
