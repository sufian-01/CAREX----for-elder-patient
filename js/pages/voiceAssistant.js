/**
 * Voice Assistant Page Module — Connected to Global Voice Service.
 */

import { voiceService } from '../services/voiceService.js';
import { toast } from '../components/toast.js';

export function render() {
  const currentState = voiceService.getState();
  const isListening = currentState === 'listening';
  const isSupported = currentState !== 'unsupported';
  const lastTranscript = voiceService.getLastTranscript();

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">🎤 Voice Assistant</h1>
          <p class="page-subtitle">Navigate and operate CAREX hands-free with voice commands.</p>
        </div>
      </div>

      <div class="card" style="text-align: center; padding: var(--space-2xl) var(--space-lg);">
        <div class="voice-visualizer ${isListening ? 'listening' : ''}" id="voice-vis">
          <i data-lucide="${isListening ? 'mic' : 'mic-off'}" style="width: 48px; height: 48px;"></i>
        </div>

        <h2 style="font-size: var(--font-size-2xl); font-weight: 800; color: var(--color-text);" id="voice-status">
          ${isListening ? 'Listening for command...' : 'Tap Mic to Start Voice Assistant'}
        </h2>

        <p style="color: var(--color-text-secondary); margin-top: 8px;" id="voice-transcript">
          ${lastTranscript ? `Last heard: "${lastTranscript}"` : (isSupported ? 'Say "Open Medicine", "Open SOS", "Open Family", etc.' : 'Web Speech API is unsupported in this browser.')}
        </p>

        <div style="margin-top: var(--space-xl);">
          <button id="toggle-voice-page-btn" class="btn ${isListening ? 'btn-danger' : 'btn-primary'} btn-lg">
            <i data-lucide="mic"></i> ${isListening ? 'Stop Listening' : 'Start Voice Control'}
          </button>
        </div>
      </div>

      <!-- Supported Voice Commands List -->
      <div class="card">
        <h3 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md);">Supported Voice Commands</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-sm);">
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/home'">"Open Home"</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/medicine'">"Open Medicine"</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/family'">"Open Family"</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/doctor'">"Open Doctor"</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/sos'">"Open SOS"</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/checkin'">"Open Check-in"</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/routine'">"Open Routine"</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/health-notes'">"Open Health Notes"</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/special-care'">"Open Special Care"</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/location'">"Open Location"</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/music'">"Open Music"</button>
          <button class="btn btn-secondary btn-sm" onclick="location.hash='#/settings'">"Open Settings"</button>
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
      statusEl.textContent = 'Listening for command...';
      if (visEl) visEl.classList.add('listening');
      btnEl.className = 'btn btn-danger btn-lg';
      btnEl.innerHTML = '<i data-lucide="mic-off"></i> Stop Listening';
    } else if (vState === 'processing') {
      statusEl.textContent = 'Processing command...';
      if (visEl) visEl.classList.remove('listening');
    } else {
      statusEl.textContent = 'Tap Mic to Start Voice Assistant';
      if (visEl) visEl.classList.remove('listening');
      btnEl.className = 'btn btn-primary btn-lg';
      btnEl.innerHTML = '<i data-lucide="mic"></i> Start Voice Control';
    }

    if (transcriptEl && transcript) {
      transcriptEl.textContent = `Last heard: "${transcript}"`;
    }
  });

  return () => {
    unsubscribe();
  };
}
