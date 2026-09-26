/**
 * Emergency SOS Page Module with Web Audio API Siren Alarm & Direct Emergency Calling.
 * Features a clear, dedicated Stop Alarm button directly under the SOS button when active.
 */

import { state } from '../state.js';
import { alarmService } from '../services/alarmService.js';
import { modal } from '../components/modal.js';
import { toast } from '../components/toast.js';
import { escapeHtml } from '../utils/helpers.js';

export function render() {
  const family = state.get('family') || [];
  const emergencyContact = family.find(f => f.isEmergency) || family[0] || null;
  const isAlarmPlaying = alarmService.isActive();
  const cleanPhone = emergencyContact ? (emergencyContact.phone || '').replace(/[^0-9+]/g, '') : '';

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title" style="color: var(--color-danger);">🚨 Emergency Assistance (SOS)</h1>
          <p class="page-subtitle">Press the button below when immediate assistance is needed.</p>
        </div>
      </div>

      <!-- Main SOS Box Area -->
      <div class="sos-box" style="${isAlarmPlaying ? 'background-color: var(--color-danger-bg); border-color: var(--color-danger); box-shadow: 0 0 25px rgba(217, 67, 67, 0.4);' : ''}">
        
        ${isAlarmPlaying ? `
          <div style="font-size: var(--font-size-2xl); font-weight: 900; color: var(--color-danger); margin-bottom: var(--space-xs);" class="animate-pulse">
            🔊 EMERGENCY SIREN ACTIVE!
          </div>
          <p style="color: var(--color-danger); font-weight: 700; margin-bottom: var(--space-md);">
            Loud alarm is playing on your device. Tap below to turn off.
          </p>
        ` : ''}

        <button id="sos-btn-trigger" class="sos-button-large ${isAlarmPlaying ? 'animate-pulse' : 'animate-pulse'}" style="${isAlarmPlaying ? 'background-color: #B71C1C; border-color: #FF8A80;' : ''}">
          ${isAlarmPlaying ? 'OFF' : 'SOS'}
        </button>

        <!-- Dedicated Turn Off / Stop Button Directly Underneath SOS Button -->
        ${isAlarmPlaying ? `
          <div style="margin-top: var(--space-lg); width: 100%; max-width: 320px;">
            <button id="stop-alarm-btn-main" class="btn btn-danger btn-lg btn-full" style="font-size: var(--font-size-xl); padding: var(--space-md) var(--space-xl); font-weight: 900; box-shadow: var(--shadow-md);">
              🔕 TURN OFF SIREN ALARM
            </button>
          </div>
        ` : `
          <p style="font-weight: 700; font-size: var(--font-size-lg); margin-top: var(--space-md);">
            Tap to Activate Emergency Protocol
          </p>
        `}

        <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-top: var(--space-md);">
          Note: This local alarm plays a loud siren on your device. Tap below to call your emergency contact directly.
        </p>
      </div>

      <!-- Emergency Contact Details & Direct Call -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title"><i data-lucide="phone"></i> Configured Emergency Contact</h2>
          <a href="#/family" class="btn btn-secondary btn-sm">Manage Contacts</a>
        </div>

        ${emergencyContact ? `
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <div style="font-size: var(--font-size-lg); font-weight: 800; color: var(--color-text);">
                👤 ${escapeHtml(emergencyContact.name)} (${escapeHtml(emergencyContact.rel)})
              </div>
              <div style="font-size: var(--font-size-base); color: var(--color-text-secondary); margin-top: 4px;">
                📱 Phone: ${escapeHtml(emergencyContact.phone || 'No phone set')}
              </div>
            </div>

            ${cleanPhone ? `
              <a href="tel:${cleanPhone}" class="btn btn-danger btn-lg" style="min-height: 52px; font-weight: 800;">
                <i data-lucide="phone-call"></i> Call Emergency Contact
              </a>
            ` : `
              <button class="btn btn-secondary" onclick="alert('Please add a phone number for your emergency contact in Family Contacts.')">
                No Phone Number Set
              </button>
            `}
          </div>
          
          <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-sm);">
            Notice: Tapping 'Call Emergency Contact' opens your device's phone dialer. Tap Call in your phone app to place the call.
          </p>
        ` : `
          <div class="empty-state" style="padding: var(--space-lg);">
            <p style="margin-bottom: var(--space-sm);">No primary emergency contact configured yet.</p>
            <a href="#/family" class="btn btn-primary btn-sm">➕ Add Emergency Contact</a>
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
        toast.show('🔕 Emergency Alarm Stopped.', 'info');
        location.hash = '#/sos';
        return;
      }

      modal.show({
        title: '🚨 Confirm Emergency SOS',
        body: `
          <p style="font-size: var(--font-size-base); margin-bottom: var(--space-md);">
            Are you sure you want to activate the Emergency SOS Alarm?
          </p>
          <div style="padding: var(--space-md); background: var(--color-danger-bg); border-radius: var(--radius-md); color: var(--color-danger); font-size: var(--font-size-sm);">
            <strong>Notice:</strong> A loud siren alarm will sound on your device. Tap 'Turn Off Siren Alarm' directly underneath the SOS button to stop it anytime.
          </div>
        `,
        confirmText: 'Sound SOS Siren Alarm',
        danger: true,
        onConfirm: () => {
          alarmService.start();
          toast.show('🚨 LOCAL SOS ALARM ACTIVATED!', 'danger', 6000);
          location.hash = '#/sos';
        }
      });
    };
  }

  if (stopBtn) {
    stopBtn.onclick = () => {
      alarmService.stop();
      toast.show('🔕 SOS Alarm Stopped.', 'info');
      location.hash = '#/sos';
    };
  }

  return () => {
    alarmService.stop();
  };
}
