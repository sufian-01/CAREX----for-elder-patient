/**
 * Voice Assistant Page Module — Connected to Global Voice Service.
 * Multi-Language Support (English / Hindi).
 */

import { voiceService } from '../services/voiceService.js';
import { toast } from '../components/toast.js';
import { refreshLucideIcons } from '../utils/helpers.js';
import { t } from '../services/languageService.js';

export function render() {
  const currentState = voiceService.getState();
  const isListening = currentState === 'listening';
  const isSupported = currentState !== 'unsupported';
  const lastTranscript = voiceService.getLastTranscript();

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">🎤 ${t('voice.title')}</h1>
          <p class="page-subtitle">${t('voice.subtitle')}</p>
        </div>
      </div>

      <div class="card" style="text-align: center; padding: var(--space-2xl) var(--space-lg);">
        <div class="voice-visualizer ${isListening ? 'listening' : ''}" id="voice-vis">
          <i data-lucide="${isListening ? 'mic' : 'mic-off'}" style="width: 48px; height: 48px;"></i>
        </div>

        <h2 style="font-size: var(--font-size-2xl); font-weight: 800; color: var(--color-text);" id="voice-status">
          ${isListening ? t('voice.listening_state') : t('voice.tap_to_start')}
        </h2>

        <p style="color: var(--color-text-secondary); margin-top: 8px;" id="voice-transcript">
          ${lastTranscript ? t('voice.last_heard', { text: lastTranscript }) : (isSupported ? t('voice.say_examples') : t('voice.unsupported_msg'))}
        </p>

        <div style="margin-top: var(--space-xl);">
          <button id="toggle-voice-page-btn" class="btn ${isListening ? 'btn-danger' : 'btn-primary'} btn-lg">
            <i data-lucide="mic"></i> <span>${isListening ? t('voice.stop_listening') : t('voice.start_listening')}</span>
          </button>
        </div>
      </div>

      <!-- Supported Voice Commands List -->
      <div class="card">
        <h3 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">${t('voice.commands_title')}</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-sm);">
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/home'">${t('voice.cmd_home')}</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/medicine'">${t('voice.cmd_medicine')}</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/family'">${t('voice.cmd_family')}</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/doctor'">${t('voice.cmd_doctor')}</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/sos'">${t('voice.cmd_sos')}</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/checkin'">${t('voice.cmd_checkin')}</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/routine'">${t('voice.cmd_routine')}</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/health-notes'">${t('voice.cmd_notes')}</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/special-care'">${t('voice.cmd_special')}</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/location'">${t('voice.cmd_location')}</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/music'">${t('voice.cmd_music')}</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/settings'">${t('voice.cmd_settings')}</button>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  const toggleBtn = document.getElementById('toggle-voice-page-btn');

  if (toggleBtn) {
    toggleBtn.onclick = () => {
      voiceService.toggle();
    };
  }

  // Subscribe to voice state updates
  const unsubscribe = voiceService.subscribe((vState, transcript) => {
    const statusEl = document.getElementById('voice-status');
    const transcriptEl = document.getElementById('voice-transcript');
    const visEl = document.getElementById('voice-vis');
    const btnEl = document.getElementById('toggle-voice-page-btn');

    if (!statusEl || !btnEl) return;

    if (vState === 'listening') {
      statusEl.textContent = t('voice.listening_state');
      if (visEl) visEl.classList.add('listening');
      btnEl.className = 'btn btn-danger btn-lg';
      btnEl.innerHTML = `<i data-lucide="mic-off"></i> <span>${t('voice.stop_listening')}</span>`;
    } else if (vState === 'processing') {
      statusEl.textContent = t('header.voice_processing');
      if (visEl) visEl.classList.remove('listening');
    } else {
      statusEl.textContent = t('voice.tap_to_start');
      if (visEl) visEl.classList.remove('listening');
      btnEl.className = 'btn btn-primary btn-lg';
      btnEl.innerHTML = `<i data-lucide="mic"></i> <span>${t('voice.start_listening')}</span>`;
    }

    if (transcriptEl && transcript) {
      transcriptEl.textContent = t('voice.last_heard', { text: transcript });
    }

    refreshLucideIcons();
  });

  return () => {
    unsubscribe();
  };
}
