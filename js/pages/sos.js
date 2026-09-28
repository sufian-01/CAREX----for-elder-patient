/**
 * Emergency SOS Page Module with Web Audio API Siren Alarm & Direct Emergency Calling.
 * Multi-Language Support (English / Hindi).
 * Features a dedicated Stop Alarm button directly under the SOS button when active.
 */

import { state } from '../state.js';
import { alarmService } from '../services/alarmService.js';
import { modal } from '../components/modal.js';
import { toast } from '../components/toast.js';
import { escapeHtml } from '../utils/helpers.js';
import { router } from '../router.js';
import { t } from '../services/languageService.js';

export function render() {
  const family = state.get('family') || [];
  const emergencyContact = family.find(f => f.isEmergency) || family[0] || null;
  const isAlarmPlaying = alarmService.isActive();
  const cleanPhone = emergencyContact ? (emergencyContact.phone || '').replace(/[^0-9+]/g, '') : '';

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title" style="color: var(--color-danger);">🚨 ${t('sos.title')}</h1>
          <p class="page-subtitle">${t('sos.subtitle')}</p>
        </div>
      </div>

      <!-- Main SOS Box Area -->
      <div class="sos-box" style="${isAlarmPlaying ? 'background-color: var(--color-danger-bg); border-color: var(--color-danger); box-shadow: 0 0 25px rgba(217, 67, 67, 0.4);' : ''}">
        
        ${isAlarmPlaying ? `
          <div style="font-size: var(--font-size-2xl); font-weight: 900; color: var(--color-danger); margin-bottom: var(--space-xs);" class="animate-pulse">
            🔊 ${t('sos.siren_active')}
          </div>
          <p style="color: var(--color-danger); font-weight: 700; margin-bottom: var(--space-md);">
            ${t('sos.siren_desc')}
          </p>
        ` : ''}

        <button id="sos-btn-trigger" class="sos-button-large ${isAlarmPlaying ? 'animate-pulse' : 'animate-pulse'}" style="${isAlarmPlaying ? 'background-color: #B71C1C; border-color: #FF8A80;' : ''}">
          ${isAlarmPlaying ? 'OFF' : 'SOS'}
        </button>

        <!-- Dedicated Turn Off / Stop Button Directly Underneath SOS Button -->
        ${isAlarmPlaying ? `
          <div style="margin-top: var(--space-lg); width: 100%; max-width: 320px;">
            <button id="stop-alarm-btn-main" class="btn btn-danger btn-lg btn-full" style="font-size: var(--font-size-xl); padding: var(--space-md) var(--space-xl); font-weight: 900; box-shadow: var(--shadow-md);">
              🔕 ${t('sos.turn_off_btn')}
            </button>
          </div>
        ` : `
          <p style="font-weight: 700; font-size: var(--font-size-lg); margin-top: var(--space-md);">
            ${t('sos.tap_to_activate')}
          </p>
        `}

        <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-top: var(--space-md);">
          ${t('sos.disclaimer')}
        </p>
      </div>

      <!-- Emergency Contact Details & Direct Call -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title"><i data-lucide="phone"></i> ${t('sos.configured_contact')}</h2>
          <a href="#/family" class="btn btn-secondary btn-sm">${t('sos.manage_contacts')}</a>
        </div>

        ${emergencyContact ? `
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <div style="font-size: var(--font-size-lg); font-weight: 800; color: var(--color-text);">
                👤 ${escapeHtml(emergencyContact.name)} (${escapeHtml(emergencyContact.rel)})
              </div>
              <div style="font-size: var(--font-size-base); color: var(--color-text-secondary); margin-top: 4px;">
                📱 ${t('family.phone_label')}: ${escapeHtml(emergencyContact.phone || '—')}
              </div>
            </div>

            ${cleanPhone ? `
              <a href="tel:${cleanPhone}" class="btn btn-danger btn-lg" style="min-height: 52px; font-weight: 800;">
                <i data-lucide="phone-call"></i> ${t('sos.call_btn')}
              </a>
            ` : `
              <button class="btn btn-secondary" onclick="alert('Please add a phone number in Family Contacts.')">
                ${t('common.no_data')}
              </button>
            `}
          </div>
        ` : `
          <div class="empty-state" style="padding: var(--space-lg);">
            <p style="margin-bottom: var(--space-sm);">${t('sos.no_contact')}</p>
            <a href="#/family" class="btn btn-primary btn-sm">➕ ${t('sos.add_contact_btn')}</a>
          </div>
        `}
      </div>
    </div>
  `;
}

export function init() {
  const sosBtn = document.getElementById('sos-btn-trigger');
  const stopBtn = document.getElementById('stop-alarm-btn-main');

  if (sosBtn) {
    sosBtn.onclick = () => {
      if (alarmService.isActive()) {
        alarmService.stop();
        toast.show(`🔕 ${t('sos.alarm_stopped_toast')}`, 'info');
        router.handleRoute();
        return;
      }

      modal.show({
        title: `🚨 ${t('sos.modal_title')}`,
        body: `
          <p style="font-size: var(--font-size-base); margin-bottom: var(--space-md);">
            ${t('sos.modal_body')}
          </p>
          <div style="padding: var(--space-md); background: var(--color-danger-bg); border-radius: var(--radius-md); color: var(--color-danger); font-size: var(--font-size-sm);">
            ${t('sos.disclaimer')}
          </div>
        `,
        confirmText: t('sos.modal_confirm'),
        cancelText: t('common.cancel'),
        danger: true,
        onConfirm: () => {
          alarmService.start();
          toast.show(`🚨 ${t('sos.alarm_active_toast')}`, 'danger', 6000);
          router.handleRoute();
        }
      });
    };
  }

  if (stopBtn) {
    stopBtn.onclick = () => {
      alarmService.stop();
      toast.show(`🔕 ${t('sos.alarm_stopped_toast')}`, 'info');
      router.handleRoute();
    };
  }

  return () => {
    alarmService.stop();
  };
}
