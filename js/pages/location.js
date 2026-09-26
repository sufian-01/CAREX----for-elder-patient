/**
 * Location Sharing Page Module — Integrated Contact Sharing & Google Maps.
 */

import { state } from '../state.js';
import { locationService } from '../services/locationService.js';
import { toast } from '../components/toast.js';
import { escapeHtml } from '../utils/helpers.js';

export function render() {
  const locationState = state.get('location') || { sharing: false };
  const family = state.get('family') || [];

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">📍 Location Sharing</h1>
          <p class="page-subtitle">Share safety location with family members.</p>
        </div>
      </div>

      <!-- Main Location Status -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title"><i data-lucide="map-pin"></i> Safety Location Status</h2>
          <span class="badge ${locationState.sharing ? 'badge-success' : 'badge-danger'}">
            ${locationState.sharing ? '🟢 Location Ready' : '🔴 Location Idle'}
          </span>
        </div>

        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-md);">
          Request your current GPS coordinates to generate a shareable Google Maps location link for family members.
        </p>

        <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
          <button id="get-coords-btn" class="btn btn-primary">
            <i data-lucide="crosshair"></i> Get Current GPS Location
          </button>
        </div>

        ${locationState.coords ? `
          <div style="margin-top: var(--space-lg); padding: var(--space-md); background: var(--color-primary-light); border-radius: var(--radius-md);">
            <div style="font-weight: 800; color: var(--color-primary); font-size: var(--font-size-base);">
              📍 Current Location Coordinates:
            </div>
            <div style="font-family: monospace; font-size: var(--font-size-md); margin-top: 4px;">
              Latitude: ${locationState.coords.lat.toFixed(5)}, Longitude: ${locationState.coords.lng.toFixed(5)}
            </div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: 4px;">
              GPS Accuracy: ~${Math.round(locationState.coords.accuracy)} meters
            </div>
            
            <div style="margin-top: var(--space-sm);">
              <a href="https://www.google.com/maps?q=${locationState.coords.lat},${locationState.coords.lng}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                <i data-lucide="external-link"></i> Open in Google Maps
              </a>
            </div>
          </div>
        ` : ''}

        <!-- Interactive OpenStreetMap / Mapbox Embed Placeholder -->
        <div class="mapbox">
          <div>
            <span style="font-size: 2.5rem;">🗺️</span>
            <div style="font-weight: 800; font-size: var(--font-size-lg); margin-top: 8px;">
              ${locationState.coords ? 'GPS Location Ready' : 'Location Map Demo'}
            </div>
            <span class="badge badge-info" style="margin-top: 6px;">Google Maps Integration Active</span>
          </div>
        </div>
      </div>

      <!-- Share Location With Saved Contact Section -->
      <div class="card">
        <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: var(--space-sm);">
          📲 Share Location with a Family Contact
        </h2>
        <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-md);">
          Select a family contact to send them your location via WhatsApp or SMS.
        </p>

        ${family.length > 0 ? `
          <div class="form-group">
            <label for="contact-select">Select Contact *</label>
            <select id="contact-select" class="form-control">
              ${family.map((f, idx) => `
                <option value="${idx}">👤 ${escapeHtml(f.name)} (${escapeHtml(f.rel)}) — ${escapeHtml(f.phone || 'No phone')}</option>
              `).join('')}
            </select>
          </div>

          <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap; margin-top: var(--space-md);">
            <button id="share-web-btn" class="btn btn-primary">
              <i data-lucide="share-2"></i> Share via App / Device
            </button>
            <button id="share-wa-btn" class="btn btn-secondary" style="color: #25D366; border-color: #25D366;">
              <i data-lucide="message-circle"></i> Share on WhatsApp
            </button>
            <button id="share-sms-btn" class="btn btn-secondary">
              <i data-lucide="message-square"></i> Send SMS
            </button>
          </div>

          <div style="margin-top: var(--space-md); padding: var(--space-sm); background: var(--color-bg); border-radius: var(--radius-sm); font-size: var(--font-size-xs); color: var(--color-text-secondary);">
            🔒 <strong>Privacy Note:</strong> Tapping Share opens WhatsApp or SMS on your phone with the contact pre-selected. You must confirm and tap 'Send' inside your messaging app to complete sending.
          </div>
        ` : `
          <div class="empty-state" style="padding: var(--space-lg);">
            <p style="margin-bottom: var(--space-sm);">No family contacts available for sharing.</p>
            <a href="#/family" class="btn btn-primary btn-sm">➕ Add Family Contact</a>
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
      toast.show('Requesting current GPS coordinates...', 'info');
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
        toast.show('📍 GPS Location updated!', 'success');
        location.reload();
      } catch (e) {
        toast.show(e.message || 'Location permission denied.', 'danger');
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
        const msg = `Hello ${contact.name}, I am sharing my current location with you. Please check where I am: ${mapsUrl}`;

        if (navigator.share) {
          await navigator.share({
            title: 'CAREX Location Share',
            text: msg,
            url: mapsUrl
          });
          toast.show('Share dialog opened! Tap Send to deliver.', 'info');
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
        const msg = `Hello ${contact.name}, I am sharing my current location with you. Please check where I am: ${mapsUrl}`;
        
        let cleanPhone = (contact.phone || '').replace(/[^0-9+]/g, '');
        if (cleanPhone.startsWith('+')) cleanPhone = cleanPhone.substring(1);
        
        const waUrl = cleanPhone 
          ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
          : `https://wa.me/?text=${encodeURIComponent(msg)}`;

        window.open(waUrl, '_blank');
        toast.show('WhatsApp opened! Tap Send in WhatsApp to deliver message.', 'info');
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
        const msg = `Hello ${contact.name}, I am sharing my current location with you. Please check where I am: ${mapsUrl}`;
        
        const cleanPhone = (contact.phone || '').replace(/[^0-9+]/g, '');
        const smsUrl = cleanPhone ? `sms:${cleanPhone}?body=${encodeURIComponent(msg)}` : `sms:?body=${encodeURIComponent(msg)}`;

        window.location.href = smsUrl;
        toast.show('Messaging app opened! Tap Send to deliver SMS.', 'info');
      } catch (e) {
        toast.show(e.message || 'Location share failed.', 'danger');
      }
    };
  }
}
