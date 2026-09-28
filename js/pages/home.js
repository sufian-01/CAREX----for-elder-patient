/**
 * Home Dashboard Page with Multi-Language Support.
 */

import { state } from '../state.js';
import { formatTime12h } from '../utils/dateUtils.js';
import { t } from '../services/languageService.js';

export function render() {
  const userName = state.get('userName') || 'Samia';
  const medicines = state.get('medicines') || [];
  const doctors = state.get('doctors') || [];
  const checkin = state.get('checkin') || { checked: false };
  const locationState = state.get('location') || { sharing: false };
  const routines = state.get('routine') || [];

  const medsTakenCount = medicines.filter(m => m.taken).length;
  const medsTotalCount = medicines.length;

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">${t('home.hero_title', { name: userName })}</h1>
          <p class="page-subtitle">${t('home.hero_subtitle')}</p>
        </div>
      </div>

      <!-- Today Summary Cards -->
      <div class="summary-grid">
        <div class="card summary-card">
          <div class="summary-icon"><i data-lucide="pill"></i></div>
          <div>
            <div class="summary-val">${medsTakenCount}/${medsTotalCount}</div>
            <div class="summary-label">${t('home.meds_taken_today')}</div>
          </div>
        </div>

        <div class="card summary-card">
          <div class="summary-icon" style="background-color: var(--color-success-bg); color: var(--color-success);">
            <i data-lucide="heart"></i>
          </div>
          <div>
            <div class="summary-val">${checkin.checked ? t('home.checkin_done') : t('home.checkin_pending')}</div>
            <div class="summary-label">${t('home.checkin_title')}</div>
          </div>
        </div>

        <div class="card summary-card">
          <div class="summary-icon">
            <i data-lucide="stethoscope"></i>
          </div>
          <div>
            <div class="summary-val">${doctors.length}</div>
            <div class="summary-label">${t('home.doctor_title')}</div>
          </div>
        </div>

        <div class="card summary-card">
          <div class="summary-icon">
            <i data-lucide="map-pin"></i>
          </div>
          <div>
            <div class="summary-val">${locationState.sharing ? t('common.active') : t('common.disabled')}</div>
            <div class="summary-label">${t('home.location_title')}</div>
          </div>
        </div>
      </div>

      <!-- Features Grid (All Core + New Features) -->
      <div>
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md); color: var(--color-text);">
          ${t('home.quick_actions')}
        </h2>
        <div class="home-grid">
          <div class="feature-card" onclick="location.hash='#/medicine'">
            <div class="feature-card-icon"><i data-lucide="pill"></i></div>
            <div class="feature-card-title">${t('nav.medicine')}</div>
            <div class="feature-card-desc">${t('medicine.subtitle')}</div>
          </div>

          <div class="feature-card feature-card-sos" onclick="location.hash='#/sos'">
            <div class="feature-card-icon"><i data-lucide="alert-triangle"></i></div>
            <div class="feature-card-title">${t('nav.sos')}</div>
            <div class="feature-card-desc">${t('sos.subtitle')}</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/family'">
            <div class="feature-card-icon"><i data-lucide="phone-call"></i></div>
            <div class="feature-card-title">${t('family.title')}</div>
            <div class="feature-card-desc">${t('family.subtitle')}</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/doctor'">
            <div class="feature-card-icon"><i data-lucide="stethoscope"></i></div>
            <div class="feature-card-title">${t('doctor.title')}</div>
            <div class="feature-card-desc">${t('doctor.subtitle')}</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/checkin'">
            <div class="feature-card-icon"><i data-lucide="heart"></i></div>
            <div class="feature-card-title">${t('checkin.title')}</div>
            <div class="feature-card-desc">${t('checkin.subtitle')}</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/routine'">
            <div class="feature-card-icon"><i data-lucide="calendar"></i></div>
            <div class="feature-card-title">${t('routine.title')}</div>
            <div class="feature-card-desc">${t('routine.subtitle')}</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/health-notes'">
            <div class="feature-card-icon"><i data-lucide="file-text"></i></div>
            <div class="feature-card-title">${t('notes.title')}</div>
            <div class="feature-card-desc">${t('notes.subtitle')}</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/special-care'">
            <div class="feature-card-icon"><i data-lucide="shield-alert"></i></div>
            <div class="feature-card-title">${t('special_care.title')}</div>
            <div class="feature-card-desc">${t('special_care.subtitle')}</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/location'">
            <div class="feature-card-icon"><i data-lucide="map-pin"></i></div>
            <div class="feature-card-title">${t('location.title')}</div>
            <div class="feature-card-desc">${t('location.subtitle')}</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/music'">
            <div class="feature-card-icon"><i data-lucide="music"></i></div>
            <div class="feature-card-title">${t('music.title')}</div>
            <div class="feature-card-desc">${t('music.subtitle')}</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/games'">
            <div class="feature-card-icon"><i data-lucide="gamepad-2"></i></div>
            <div class="feature-card-title">${t('games.title')}</div>
            <div class="feature-card-desc">${t('games.subtitle')}</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/voice'">
            <div class="feature-card-icon"><i data-lucide="mic"></i></div>
            <div class="feature-card-title">${t('voice.title')}</div>
            <div class="feature-card-desc">${t('voice.subtitle')}</div>
          </div>
        </div>
      </div>

      <!-- Today's Schedule Timeline -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title"><i data-lucide="clock"></i> ${t('home.schedule_title')}</h2>
        </div>
        ${routines.length > 0 || medicines.length > 0 ? `
          <div class="timeline">
            ${medicines.map(m => `
              <div class="timeline-item">
                <div style="font-weight: 700; color: var(--color-primary);">💊 ${formatTime12h(m.time)} - ${t('nav.medicine')}</div>
                <div style="font-size: var(--font-size-base); margin-top: 4px;">${m.name} (${m.dose})</div>
                <span class="badge ${m.taken ? 'badge-success' : 'badge-warning'}" style="margin-top: 6px;">
                  ${m.taken ? t('medicine.status_taken') : t('medicine.status_pending')}
                </span>
              </div>
            `).join('')}
            ${routines.map(r => `
              <div class="timeline-item">
                <div style="font-weight: 700; color: var(--color-text-secondary);">📅 ${formatTime12h(r.time)} - ${t('nav.routine')}</div>
                <div style="font-size: var(--font-size-base); margin-top: 4px;">${r.name}</div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="calendar-x"></i></div>
            <div class="empty-state-title">${t('home.no_schedule')}</div>
            <p style="margin-bottom: var(--space-md);">${t('home.add_items_desc')}</p>
            <a href="#/medicine" class="btn btn-primary btn-sm">${t('medicine.btn_add')}</a>
          </div>
        `}
      </div>

      <!-- About Carex Section -->
      <div class="card" style="background-color: var(--color-primary-light); border-color: var(--color-secondary);">
        <h3 style="font-size: var(--font-size-lg); font-weight: 800; color: var(--color-primary); margin-bottom: var(--space-xs);">
          ${t('home.about_title')}
        </h3>
        <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
          ${t('home.about_desc')}
        </p>
        <div style="margin-top: var(--space-sm); font-size: var(--font-size-xs); font-weight: 700; color: var(--color-primary);">
          ${t('home.team')}
        </div>
        <div style="margin-top: var(--space-md);">
          <a href="#/about" class="btn btn-primary btn-sm">${t('about.btn_home') !== 'Return to Home' ? t('about.btn_home') : (t('nav.about'))}</a>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  // Page initialization logic
}
