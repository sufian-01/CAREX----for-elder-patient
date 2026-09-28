/**
 * Location Sharing Page Module with Multi-Language Support.
 */

import { state } from '../state.js';
import { locationService } from '../services/locationService.js';
import { toast } from '../components/toast.js';
import { escapeHtml } from '../utils/helpers.js';
import { router } from '../router.js';
import { t } from '../services/languageService.js';

export function render() {
  const locationState = state.get('location') || { sharing: false };
  const family = state.get('family') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">📍 ${t('location.title')}</h1>
          <p class="page-subtitle">${t('location.subtitle')}</p>
        </div>
      </div>

      <!-- Main Location Status -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title"><i data-lucide="map-pin"></i> ${t('location.status_card')}</h2>
          <span class="badge ${locationState.sharing ? 'badge-success' : 'badge-danger'}">
            ${locationState.sharing ? `🟢 ${t('location.ready_status')}` : `🔴 ${t('location.idle_status')}`}
          </span>
        </div>

        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-md);">
          ${t('location.info_text')}
        </p>

        <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
          <button id="get-coords-btn" class="btn btn-primary">
            <i data-lucide="crosshair"></i> ${t('location.btn_get_gps')}
          </button>
        </div>

        ${locationState.coords ? `
          <div style="margin-top: var(--space-lg); padding: var(--space-md); background: var(--color-primary-light); border-radius: var(--radius-md);">
            <div style="font-weight: 800; color: var(--color-primary); font-size: var(--font-size-base);">
              📍 ${t('location.coords_title')}
            </div>
            <div style="font-family: monospace; font-size: var(--font-size-md); margin-top: 4px;">
              Lat: ${locationState.coords.lat.toFixed(5)}, Lng: ${locationState.coords.lng.toFixed(5)}
            </div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: 4px;">
              ${t('location.accuracy', { meters: Math.round(locationState.coords.accuracy) })}
            </div>
            
            <div style="margin-top: var(--space-sm);">
              <a href="https://www.google.com/maps?q=${locationState.coords.lat},${locationState.coords.lng}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                <i data-lucide="external-link"></i> ${t('location.open_maps')}
              </a>
            </div>
          </div>
        ` : ''}

        <!-- Interactive Map Placeholder -->
        <div class="mapbox">
          <div>
            <span style="font-size: 2.5rem;">🗺️</span>
            <div style="font-weight: 800; font-size: var(--font-size-lg); margin-top: 8px;">
              ${locationState.coords ? t('location.ready_status') : t('location.title')}
            </div>
            <span class="badge badge-info" style="margin-top: 6px;">Google Maps Ready</span>
          </div>
        </div>
      </div>

      <!-- Share Location With Saved Contact Section -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-sm);">
          📲 ${t('location.share_section_title')}
        </h2>
        <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-md);">
          ${t('location.share_section_desc')}
        </p>

        ${family.length > 0 ? `
          <div class="form-group">
            <label for="contact-select">${t('location.select_contact')}</label>
            <select id="contact-select" class="form-control">
              ${family.map((f, idx) => `
                <option value="${idx}">👤 ${escapeHtml(f.name)} (${escapeHtml(f.rel)}) — ${escapeHtml(f.phone || t('family.no_phone'))}</option>
              `).join('')}
            </select>
          </div>

          <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap; margin-top: var(--space-md);">
            <button id="share-web-btn" class="btn btn-primary">
              <i data-lucide="share-2"></i> ${t('location.btn_share_web')}
            </button>
            <button id="share-wa-btn" class="btn btn-secondary" style="color: #25D366; border-color: #25D366;">
              <i data-lucide="message-circle"></i> ${t('location.btn_share_wa')}
            </button>
            <button id="share-sms-btn" class="btn btn-secondary">
              <i data-lucide="message-square"></i> ${t('location.btn_share_sms')}
            </button>
          </div>

          <div style="margin-top: var(--space-md); padding: var(--space-sm); background: var(--color-bg); border-radius: var(--radius-sm); font-size: var(--font-size-xs); color: var(--color-text-secondary);">
            🔒 <strong>Note:</strong> ${t('location.privacy_note')}
          </div>
        ` : `
          <div class="empty-state" style="padding: var(--space-lg);">
            <p style="margin-bottom: var(--space-sm);">${t('location.no_contacts')}</p>
            <a href="#/family" class="btn btn-primary btn-sm">➕ ${t('location.add_contact_btn')}</a>
          </div>
        `}
      </div>
    </div>
  `;
}

export function init() {
  const coordsBtn = document.getElementById('get-coords-btn');
  const contactSelect = document.getElementById('contact-select');
  const webShareBtn = document.getElementById('share-web-btn');
  const waShareBtn = document.getElementById('share-wa-btn');
  const smsShareBtn = document.getElementById('share-sms-btn');

  const family = state.get('family') || [];

  async function ensureLocation() {
    let locationState = state.get('location') || {};
    if (!locationState.coords) {
      toast.show(t('common.loading'), 'info');
      const coords = await locationService.getCurrentPosition();
      locationState = {
        sharing: true,
        lastShared: new Date().toISOString(),
        coords
      };
      state.set('location', locationState);
    }
    return locationState.coords;
  }

  function getSelectedContact() {
    if (!contactSelect) return null;
    const idx = parseInt(contactSelect.value, 10);
    return family[idx] || null;
  }

  if (coordsBtn) {
    coordsBtn.onclick = async () => {
      try {
        const coords = await locationService.getCurrentPosition();
        state.set('location', {
          sharing: true,
          lastShared: new Date().toISOString(),
          coords
        });
        toast.show(t('location.toast_updated'), 'success');
        router.handleRoute();
      } catch (e) {
        toast.show(e.message || t('common.error'), 'danger');
      }
    };
  }

  if (webShareBtn) {
    webShareBtn.onclick = async () => {
      const contact = getSelectedContact();
      if (!contact) return toast.show('Please select a contact.', 'warning');

      try {
        const coords = await ensureLocation();
        const mapsUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
        const msg = t('location.share_msg', { name: contact.name, url: mapsUrl });

        if (navigator.share) {
          await navigator.share({
            title: 'CAREX Location Share',
            text: msg,
            url: mapsUrl
          });
          toast.show('Share dialog opened!', 'info');
        } else {
          toast.show('Web Share API not supported on this browser. Try WhatsApp or SMS buttons.', 'warning');
        }
      } catch (e) {
        toast.show(e.message || 'Location share failed.', 'danger');
      }
    };
  }

  if (waShareBtn) {
    waShareBtn.onclick = async () => {
      const contact = getSelectedContact();
      if (!contact) return toast.show('Please select a contact.', 'warning');

      try {
        const coords = await ensureLocation();
        const mapsUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
        const msg = t('location.share_msg', { name: contact.name, url: mapsUrl });
        
        let cleanPhone = (contact.phone || '').replace(/[^0-9+]/g, '');
        if (cleanPhone.startsWith('+')) cleanPhone = cleanPhone.substring(1);
        
        const waUrl = cleanPhone 
          ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
          : `https://wa.me/?text=${encodeURIComponent(msg)}`;

        window.open(waUrl, '_blank');
        toast.show('WhatsApp opened!', 'info');
      } catch (e) {
        toast.show(e.message || 'Location share failed.', 'danger');
      }
    };
  }

  if (smsShareBtn) {
    smsShareBtn.onclick = async () => {
      const contact = getSelectedContact();
      if (!contact) return toast.show('Please select a contact.', 'warning');

      try {
        const coords = await ensureLocation();
        const mapsUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
        const msg = t('location.share_msg', { name: contact.name, url: mapsUrl });
        
        const cleanPhone = (contact.phone || '').replace(/[^0-9+]/g, '');
        const smsUrl = cleanPhone ? `sms:${cleanPhone}?body=${encodeURIComponent(msg)}` : `sms:?body=${encodeURIComponent(msg)}`;

        window.location.href = smsUrl;
        toast.show('Messaging app opened!', 'info');
      } catch (e) {
        toast.show(e.message || 'Location share failed.', 'danger');
      }
    };
  }
}
