/**
 * Home Dashboard Page.
 */

import { state } from '../state.js';
import { formatTime12h } from '../utils/dateUtils.js';

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
          <h1 class="page-title">How can we help today, ${userName}?</h1>
          <p class="page-subtitle">Your personal health overview and quick actions.</p>
        </div>
      </div>

      <!-- Today Summary Cards -->
      <div class="summary-grid">
        <div class="card summary-card">
          <div class="summary-icon"><i data-lucide="pill"></i></div>
          <div>
            <div class="summary-val">${medsTakenCount}/${medsTotalCount}</div>
            <div class="summary-label">Medicines Taken Today</div>
          </div>
        </div>

        <div class="card summary-card">
          <div class="summary-icon" style="background-color: var(--color-success-bg); color: var(--color-success);">
            <i data-lucide="heart"></i>
          </div>
          <div>
            <div class="summary-val">${checkin.checked ? 'Checked In' : 'Pending'}</div>
            <div class="summary-label">Daily Check-in</div>
          </div>
        </div>

        <div class="card summary-card">
          <div class="summary-icon">
            <i data-lucide="stethoscope"></i>
          </div>
          <div>
            <div class="summary-val">${doctors.length}</div>
            <div class="summary-label">Doctor Appointments</div>
          </div>
        </div>

        <div class="card summary-card">
          <div class="summary-icon">
            <i data-lucide="map-pin"></i>
          </div>
          <div>
            <div class="summary-val">${locationState.sharing ? 'ON' : 'OFF'}</div>
            <div class="summary-label">Location Sharing</div>
          </div>
        </div>
      </div>

      <!-- Features Grid (All 10 Core + New Features) -->
      <div>
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-md); color: var(--color-text);">
          Quick Actions & Features
        </h2>
        <div class="home-grid">
          <div class="feature-card" onclick="location.hash='#/medicine'">
            <div class="feature-card-icon"><i data-lucide="pill"></i></div>
            <div class="feature-card-title">Medicine</div>
            <div class="feature-card-desc">Track and take daily dosage</div>
          </div>

          <div class="feature-card feature-card-sos" onclick="location.hash='#/sos'">
            <div class="feature-card-icon"><i data-lucide="alert-triangle"></i></div>
            <div class="feature-card-title">Emergency SOS</div>
            <div class="feature-card-desc">One-tap emergency call</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/family'">
            <div class="feature-card-icon"><i data-lucide="phone-call"></i></div>
            <div class="feature-card-title">Family</div>
            <div class="feature-card-desc">Call loved ones easily</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/doctor'">
            <div class="feature-card-icon"><i data-lucide="stethoscope"></i></div>
            <div class="feature-card-title">Doctor</div>
            <div class="feature-card-desc">Manage appointments</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/checkin'">
            <div class="feature-card-icon"><i data-lucide="heart"></i></div>
            <div class="feature-card-title">Daily Check-in</div>
            <div class="feature-card-desc">Confirm wellness status</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/routine'">
            <div class="feature-card-icon"><i data-lucide="calendar"></i></div>
            <div class="feature-card-title">Daily Routine</div>
            <div class="feature-card-desc">Track daily tasks</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/health-notes'">
            <div class="feature-card-icon"><i data-lucide="file-text"></i></div>
            <div class="feature-card-title">Health Notes</div>
            <div class="feature-card-desc">Record notes & vitals</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/special-care'">
            <div class="feature-card-icon"><i data-lucide="shield-alert"></i></div>
            <div class="feature-card-title">Special Care</div>
            <div class="feature-card-desc">Personal instructions</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/location'">
            <div class="feature-card-icon"><i data-lucide="map-pin"></i></div>
            <div class="feature-card-title">Location</div>
            <div class="feature-card-desc">Share safety status</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/music'">
            <div class="feature-card-icon"><i data-lucide="music"></i></div>
            <div class="feature-card-title">Nasheed & Relax</div>
            <div class="feature-card-desc">Islamic Nasheeds & sounds</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/games'">
            <div class="feature-card-icon"><i data-lucide="gamepad-2"></i></div>
            <div class="feature-card-title">Mini Games</div>
            <div class="feature-card-desc">Memory match puzzle</div>
          </div>

          <div class="feature-card" onclick="location.hash='#/voice'">
            <div class="feature-card-icon"><i data-lucide="mic"></i></div>
            <div class="feature-card-title">Voice Assistant</div>
            <div class="feature-card-desc">Hands-free navigation</div>
          </div>
        </div>
      </div>

      <!-- Today's Schedule Timeline -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title"><i data-lucide="clock"></i> Today's Schedule Timeline</h2>
        </div>
        ${routines.length > 0 || medicines.length > 0 ? `
          <div class="timeline">
            ${medicines.map(m => `
              <div class="timeline-item">
                <div style="font-weight: 700; color: var(--color-primary);">💊 ${formatTime12h(m.time)} - Medicine</div>
                <div style="font-size: var(--font-size-base); margin-top: 4px;">Take ${m.name} (${m.dose})</div>
                <span class="badge ${m.taken ? 'badge-success' : 'badge-warning'}" style="margin-top: 6px;">
                  ${m.taken ? 'Taken' : 'Pending'}
                </span>
              </div>
            `).join('')}
            ${routines.map(r => `
              <div class="timeline-item">
                <div style="font-weight: 700; color: var(--color-text-secondary);">📅 ${formatTime12h(r.time)} - Routine</div>
                <div style="font-size: var(--font-size-base); margin-top: 4px;">${r.name}</div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="calendar-x"></i></div>
            <div class="empty-state-title">No schedule items added for today</div>
            <p style="margin-bottom: var(--space-md);">Add medicines or routines to see your daily timeline here.</p>
            <a href="#/medicine" class="btn btn-primary btn-sm">Add Medicine</a>
          </div>
        `}
      </div>

      <!-- About Carex Section -->
      <div class="card" style="background-color: var(--color-primary-light); border-color: var(--color-secondary);">
        <h3 style="font-size: var(--font-size-lg); font-weight: 800; color: var(--color-primary); margin-bottom: var(--space-xs);">
          About CAREX Project
        </h3>
        <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
          Designed to make elderly care simple, safe, and connected for senior citizens.
        </p>
        <div style="margin-top: var(--space-sm); font-size: var(--font-size-xs); font-weight: 700; color: var(--color-primary);">
          Project Team: 1. Samia Naaz · 2. SHAULAT JAHAN · 3. Riva Naaz
        </div>
      </div>
    </div>
  `;
}

export function init() {
  // Page initialization logic
}
