/**
 * Mobile Bottom Navigation Component with Multi-Language Support.
 */

import { t, subscribe } from '../services/languageService.js';

let isSubscribed = false;

export const bottomNavComponent = {
  render() {
    return `
      <a href="#/home" class="bottom-nav-item">
        <i data-lucide="home"></i>
        <span>${t('nav.home')}</span>
      </a>
      <a href="#/medicine" class="bottom-nav-item">
        <i data-lucide="pill"></i>
        <span>${t('nav.medicine')}</span>
      </a>
      <a href="#/sos" class="bottom-nav-item" style="color: var(--color-danger);">
        <i data-lucide="alert-triangle"></i>
        <span>SOS</span>
      </a>
      <a href="#/family" class="bottom-nav-item">
        <i data-lucide="phone-call"></i>
        <span>${t('family.title')}</span>
      </a>
      <a href="#/settings" class="bottom-nav-item">
        <i data-lucide="menu"></i>
        <span>${t('nav.more')}</span>
      </a>
    `;
  },

  init() {
    const container = document.getElementById('bottom-nav-container');
    if (container) {
      container.innerHTML = this.render();
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    if (!isSubscribed) {
      isSubscribed = true;
      subscribe(() => {
        const c = document.getElementById('bottom-nav-container');
        if (c) {
          c.innerHTML = this.render();
          if (window.lucide) {
            window.lucide.createIcons();
          }
          if (window.router && window.router.updateActiveNav) {
            window.router.updateActiveNav();
          }
        }
      });
    }
  }
};
