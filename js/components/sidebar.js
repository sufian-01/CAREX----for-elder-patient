/**
 * Desktop Sidebar Navigation Component with Multi-Language Support.
 */

import { t, subscribe } from '../services/languageService.js';

let isSubscribed = false;

export const sidebarComponent = {
  render() {
    return `
      <div class="brand">
        <div class="brand-icon"><i data-lucide="heart-pulse"></i></div>
        <span>CAREX</span>
      </div>

      <nav class="sidebar-nav">
        <a href="#/home" class="nav-link"><i data-lucide="home"></i> <span>${t('nav.home')}</span></a>
        <a href="#/medicine" class="nav-link"><i data-lucide="pill"></i> <span>${t('nav.medicine')}</span></a>
        <a href="#/sos" class="nav-link nav-link-sos"><i data-lucide="alert-triangle"></i> <span>${t('nav.sos')}</span></a>
        <a href="#/family" class="nav-link"><i data-lucide="phone-call"></i> <span>${t('nav.family')}</span></a>
        <a href="#/doctor" class="nav-link"><i data-lucide="stethoscope"></i> <span>${t('nav.doctor')}</span></a>
        <a href="#/checkin" class="nav-link"><i data-lucide="heart"></i> <span>${t('nav.checkin')}</span></a>
        <a href="#/routine" class="nav-link"><i data-lucide="calendar"></i> <span>${t('nav.routine')}</span></a>
        <a href="#/health-notes" class="nav-link"><i data-lucide="file-text"></i> <span>${t('nav.health_notes')}</span></a>
        <a href="#/special-care" class="nav-link"><i data-lucide="shield-alert"></i> <span>${t('nav.special_care')}</span></a>
        <a href="#/location" class="nav-link"><i data-lucide="map-pin"></i> <span>${t('nav.location')}</span></a>
        <a href="#/music" class="nav-link"><i data-lucide="music"></i> <span>${t('nav.music')}</span></a>
        <a href="#/games" class="nav-link"><i data-lucide="gamepad-2"></i> <span>${t('nav.games')}</span></a>
        <a href="#/voice" class="nav-link"><i data-lucide="mic"></i> <span>${t('nav.voice')}</span></a>
        <a href="#/settings" class="nav-link"><i data-lucide="settings"></i> <span>${t('nav.settings')}</span></a>
        <a href="#/about" class="nav-link"><i data-lucide="info"></i> <span>${t('nav.about')}</span></a>
      </nav>
    `;
  },

  init() {
    const container = document.getElementById('sidebar-container');
    if (container) {
      container.innerHTML = this.render();
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    if (!isSubscribed) {
      isSubscribed = true;
      subscribe(() => {
        const c = document.getElementById('sidebar-container');
        if (c) {
          c.innerHTML = this.render();
          if (window.lucide) {
            window.lucide.createIcons();
          }
          // Re-highlight active link
          if (window.router && window.router.updateActiveNav) {
            window.router.updateActiveNav();
          }
        }
      });
    }
  }
};
