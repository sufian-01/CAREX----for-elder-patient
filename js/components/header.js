/**
 * Header Component with Global Voice Assistant Trigger.
 */

import { state } from '../state.js';
import { voiceService } from '../services/voiceService.js';
import { formatDateFriendly, getTimeGreeting } from '../utils/dateUtils.js';

export const headerComponent = {
  render() {
    const userName = state.get('userName') || 'Samia';
    const greeting = getTimeGreeting();
    const dateFormatted = formatDateFriendly(new Date());

    return `
      <div style="display: flex; flex-direction: column; justify-content: center;">
        <h2 style="font-size: var(--font-size-lg); font-weight: 800; color: var(--color-text); margin: 0; line-height: 1.2;">
          ${greeting}, ${userName} 👋
        </h2>
        <span style="font-size: var(--font-size-xs); color: var(--color-text-secondary); font-weight: 600; margin-top: 2px;">
          ${dateFormatted}
        </span>
      </div>

      <div style="display: flex; align-items: center; gap: var(--space-xs);">
        <!-- Global Voice Assistant Trigger Button -->
        <button id="global-voice-btn" class="global-mic-btn" aria-label="Toggle Voice Assistant" title="Voice Assistant">
          <i data-lucide="mic" id="global-mic-icon"></i>
          <span class="global-mic-label" id="global-mic-label">Voice</span>
        </button>

        <a href="#/notifications" class="btn btn-secondary btn-sm header-action-btn" aria-label="Notifications" title="Notifications">
          <i data-lucide="bell"></i>
        </a>

        <a href="#/settings" class="btn btn-secondary btn-sm header-action-btn" aria-label="Settings" title="Settings">
          <i data-lucide="user"></i>
        </a>
      </div>
    `;
  },

  init() {
    const container = document.getElementById('header-container');
    if (container) {
      container.innerHTML = this.render();
      this.attachEvents();
    }
  },

  attachEvents() {
    const micBtn = document.getElementById('global-voice-btn');
    const micLabel = document.getElementById('global-mic-label');

    if (micBtn) {
      micBtn.onclick = () => {
        voiceService.toggle();
      };
    }

    // Subscribe to global voice state changes
    voiceService.subscribe((voiceState, transcript) => {
      const btn = document.getElementById('global-voice-btn');
      const label = document.getElementById('global-mic-label');
      if (!btn) return;

      btn.classList.remove('mic-listening', 'mic-processing', 'mic-completed', 'mic-denied');

      if (voiceState === 'listening') {
        btn.classList.add('mic-listening');
        if (label) label.textContent = 'Listening...';
      } else if (voiceState === 'processing') {
        btn.classList.add('mic-processing');
        if (label) label.textContent = 'Processing...';
      } else if (voiceState === 'completed') {
        btn.classList.add('mic-completed');
        if (label) label.textContent = 'Done!';
      } else if (voiceState === 'denied' || voiceState === 'unsupported') {
        btn.classList.add('mic-denied');
        if (label) label.textContent = 'Disabled';
      } else {
        if (label) label.textContent = 'Voice';
      }
    });
  }
};
