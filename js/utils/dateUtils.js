/**
 * Date and time utilities with multi-language support (English / Hindi)
 */
import { getLanguage, t } from '../services/languageService.js';

/**
 * Formats a Date object or string to a friendly readable format.
 * @param {Date|string} dateInput 
 * @returns {string} e.g. "शनिवार, 26 सितंबर 2026" or "Saturday, 26 September 2026"
 */
export function formatDateFriendly(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) return t('checkin.status_today') || 'Today';
  const locale = getLanguage() === 'hi' ? 'hi-IN' : 'en-US';
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Returns greeting string based on current time of day.
 * @returns {string} e.g. "Good morning" or "शुभ प्रभात"
 */
export function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return t('header.greeting_morning');
  if (hour < 17) return t('header.greeting_afternoon');
  return t('header.greeting_evening');
}

/**
 * Formats 24h time string ("14:30") into 12h readable time ("2:30 PM").
 * @param {string} time24 
 * @returns {string}
 */
export function formatTime12h(time24) {
  if (!time24) return t('common.no_data') || 'Not set';
  if (time24.includes('AM') || time24.includes('PM')) return time24;
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return time24;
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * Checks if a given date string is today.
 * @param {string} dateStr 
 * @returns {boolean}
 */
export function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
}
