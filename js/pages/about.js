/**
 * About CAREX Page Module.
 * Modern, accessible, professional overview of CAREX mission, core values,
 * and the project team with full English & Hindi localization.
 */

import { t } from '../services/languageService.js';
import { refreshLucideIcons } from '../utils/helpers.js';

export function render() {
  return `
    <div class="page animate-fade-in">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">ℹ️ ${t('about.title')}</h1>
          <p class="page-subtitle">${t('about.subtitle')}</p>
        </div>
        <div style="display: flex; gap: var(--space-xs);">
          <a href="#/home" class="btn btn-secondary btn-sm">
            <i data-lucide="home"></i> ${t('about.btn_home')}
          </a>
          <a href="#/settings" class="btn btn-secondary btn-sm">
            <i data-lucide="settings"></i> ${t('about.btn_settings')}
          </a>
        </div>
      </div>

      <!-- Hero Purpose Card -->
      <div class="about-hero-card">
        <div class="about-badge-pill">
          <i data-lucide="heart-pulse"></i>
          <span>${t('about.badge')}</span>
        </div>

        <h2 class="about-hero-title">CAREX</h2>
        <div class="about-hero-subtitle">${t('about.purpose_title')}</div>
        <p class="about-hero-desc">
          ${t('about.purpose_desc')}
        </p>

        <!-- 3 Core Pillars -->
        <div class="about-pillars-grid">
          <div class="about-pillar-card">
            <div class="about-pillar-icon" style="background-color: var(--color-danger-bg); color: var(--color-danger);">
              <i data-lucide="shield-alert" style="width: 28px; height: 28px;"></i>
            </div>
            <div class="about-pillar-title">${t('about.pillar_safety_title')}</div>
            <div class="about-pillar-desc">${t('about.pillar_safety_desc')}</div>
          </div>

          <div class="about-pillar-card">
            <div class="about-pillar-icon" style="background-color: var(--color-primary-light); color: var(--color-primary);">
              <i data-lucide="users" style="width: 28px; height: 28px;"></i>
            </div>
            <div class="about-pillar-title">${t('about.pillar_connect_title')}</div>
            <div class="about-pillar-desc">${t('about.pillar_connect_desc')}</div>
          </div>

          <div class="about-pillar-card">
            <div class="about-pillar-icon" style="background-color: var(--color-success-bg); color: var(--color-success);">
              <i data-lucide="activity" style="width: 28px; height: 28px;"></i>
            </div>
            <div class="about-pillar-title">${t('about.pillar_health_title')}</div>
            <div class="about-pillar-desc">${t('about.pillar_health_desc')}</div>
          </div>
        </div>
      </div>

      <!-- Project Team Section -->
      <div class="about-team-section">
        <div class="about-team-header">
          <h2 class="about-team-title">${t('about.team_title')}</h2>
          <p class="about-team-subtitle">${t('about.team_subtitle')}</p>
        </div>

        <div class="about-team-grid">
          <!-- Team Member 1: SAMIA NAAZ -->
          <div class="team-card">
            <div class="team-avatar-icon-box">
              <i data-lucide="user" style="width: 36px; height: 36px;"></i>
            </div>
            <h3 class="team-member-name">SAMIA NAAZ</h3>
            <span class="team-member-badge">${t('about.team_role')}</span>
          </div>

          <!-- Team Member 2: SHAULAT JAHAN -->
          <div class="team-card">
            <div class="team-avatar-icon-box">
              <i data-lucide="user" style="width: 36px; height: 36px;"></i>
            </div>
            <h3 class="team-member-name">SHAULAT JAHAN</h3>
            <span class="team-member-badge">${t('about.team_role')}</span>
          </div>

          <!-- Team Member 3: RIVA NAAZ -->
          <div class="team-card">
            <div class="team-avatar-icon-box">
              <i data-lucide="user" style="width: 36px; height: 36px;"></i>
            </div>
            <h3 class="team-member-name">RIVA NAAZ</h3>
            <span class="team-member-badge">${t('about.team_role')}</span>
          </div>
        </div>
      </div>

      <!-- Values & Accessibility Commitment Card -->
      <div class="card" style="padding: var(--space-xl);">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; color: var(--color-text); margin-bottom: var(--space-md); text-align: center;">
          ${t('about.values_title')}
        </h2>

        <div class="about-values-grid">
          <div style="display: flex; gap: var(--space-md); align-items: flex-start; padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
            <div style="color: var(--color-primary); margin-top: 2px;">
              <i data-lucide="lock" style="width: 24px; height: 24px;"></i>
            </div>
            <div>
              <div style="font-weight: 800; font-size: var(--font-size-base); color: var(--color-text); margin-bottom: 4px;">
                ${t('about.val_privacy_title')}
              </div>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: var(--line-height-normal); margin: 0;">
                ${t('about.val_privacy_desc')}
              </p>
            </div>
          </div>

          <div style="display: flex; gap: var(--space-md); align-items: flex-start; padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
            <div style="color: var(--color-primary); margin-top: 2px;">
              <i data-lucide="eye" style="width: 24px; height: 24px;"></i>
            </div>
            <div>
              <div style="font-weight: 800; font-size: var(--font-size-base); color: var(--color-text); margin-bottom: 4px;">
                ${t('about.val_accessibility_title')}
              </div>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: var(--line-height-normal); margin: 0;">
                ${t('about.val_accessibility_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  refreshLucideIcons();
}
