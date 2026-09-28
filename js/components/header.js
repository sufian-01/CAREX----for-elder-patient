/**
 * Header Component with Global Voice Assistant Trigger and Language Selector (EN / HI).
 */

import { state } from '../state.js';
import { voiceService } from '../services/voiceService.js';
import { formatDateFriendly, getTimeGreeting } from '../utils/dateUtils.js';
import { getLanguage, setLanguage, subscribe, t } from '../services/languageService.js';

let isSubscribedToLanguage = false;

export const headerComponent = {
  render() {
    const userName = state.get('userName') || 'Samia';
    const greeting = getTimeGreeting();
    const dateFormatted = formatDateFriendly(new Date());
    const currentLang = getLanguage();

    return `
      <div style="display: flex; flex-direction: column; justify-content: center;">
        <h2 style="font-size: var(--font-size-lg); font-weight: 800; color: var(--color-text); margin: 0; line-height: 1.2;">
          ${greeting}, ${userName} 👋
        </h2>
        <span style="font-size: var(--font-size-xs); color: var(--color-text-secondary); font-weight: 600; margin-top: 2px;">
          ${dateFormatted}
        </span>
      </div>

      <div style="display: flex; align-items: center; gap: var(--space-xs); flex-wrap: wrap; justify-content: flex-end;">
        <!-- Language Selector -->
        <div class="lang-selector-wrapper">
          <select id="lang-select" class="lang-select-input" aria-label="${t('common.select_language')}" title="${t('common.select_language')}">
            <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
            <option value="hi" ${currentLang === 'hi' ? 'selected' : ''}>🇮🇳 हिंदी</option>
          </select>
        </div>

        <!-- Global Voice Assistant Trigger Button -->
        <button id="global-voice-btn" class="global-mic-btn" aria-label="${t('voice.title')}" title="${t('voice.title')}">
          <i data-lucide="mic" id="global-mic-icon"></i>
          <span class="global-mic-label" id="global-mic-label">${t('header.voice_btn')}</span>
        </button>

        <a href="#/notifications" class="btn btn-secondary btn-sm header-action-btn" aria-label="${t('nav.notifications')}" title="${t('nav.notifications')}">
          <i data-lucide="bell"></i>
        </a>

        <a href="#/settings" class="btn btn-secondary btn-sm header-action-btn" aria-label="${t('nav.settings')}" title="${t('nav.settings')}">
          <i data-lucide="user"></i>
        </a>
      </div>
    `;
  },

  init() {
    const container = document.getElementById('header-container');
    if (container) {
      container.innerHTML = this.render();
      if (window.lucide) {
        window.lucide.createIcons();
      }
      this.attachEvents();
    }

    if (!isSubscribedToLanguage) {
      isSubscribedToLanguage = true;
      subscribe(() => {
        const c = document.getElementById('header-container');
        if (c) {
          c.innerHTML = this.render();
          if (window.lucide) {
            window.lucide.createIcons();
          }
          this.attachEvents();
        }
      });
    }
  },

  attachEvents() {
    const micBtn = document.getElementById('global-voice-btn');
    if (micBtn) {
      micBtn.onclick = () => {
        voiceService.toggle();
      };
    }

    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
      langSelect.onchange = (e) => {
        const chosen = e.target.value;
        setLanguage(chosen);
      };
    }

    // Subscribe to global voice state changes
    voiceService.subscribe((voiceState) => {
      const btn = document.getElementById('global-voice-btn');
      const label = document.getElementById('global-mic-label');
      if (!btn) return;

      btn.classList.remove('mic-listening', 'mic-processing', 'mic-completed', 'mic-denied');

      if (voiceState === 'listening') {
        btn.classList.add('mic-listening');
        if (label) label.textContent = t('header.voice_listening');
      } else if (voiceState === 'processing') {
        btn.classList.add('mic-processing');
        if (label) label.textContent = t('header.voice_processing');
      } else if (voiceState === 'completed') {
        btn.classList.add('mic-completed');
        if (label) label.textContent = t('header.voice_done');
      } else if (voiceState === 'denied' || voiceState === 'unsupported') {
        btn.classList.add('mic-denied');
        if (label) label.textContent = t('common.disabled');
      } else {
        if (label) label.textContent = t('header.voice_btn');
      }
    });
  }
};
