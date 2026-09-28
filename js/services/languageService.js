/**
 * Language Service for CAREX
 * Supports English (en) and Hindi (hi) with reactive event subscriptions
 */

import en from '../locales/en.js';
import hi from '../locales/hi.js';

const STORAGE_KEY = 'carex_language';
const locales = { en, hi };

let currentLanguage = localStorage.getItem(STORAGE_KEY) || 'en';
if (!locales[currentLanguage]) {
  currentLanguage = 'en';
}

const listeners = new Set();

/**
 * Get current active language code ('en' | 'hi')
 */
export function getLanguage() {
  return currentLanguage;
}

/**
 * Set active language, persist to localStorage, and notify all subscribers
 * @param {'en' | 'hi'} lang 
 */
export function setLanguage(lang) {
  if (!locales[lang]) {
    console.warn(`[languageService] Unsupported language: ${lang}`);
    return;
  }
  if (currentLanguage === lang) return;

  currentLanguage = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    console.error('[languageService] Failed to save language in localStorage', e);
  }

  // Update HTML lang attribute
  if (document.documentElement) {
    document.documentElement.lang = lang;
    if (lang === 'hi') {
      document.body.classList.add('lang-hi');
    } else {
      document.body.classList.remove('lang-hi');
    }
  }

  // Notify listeners
  listeners.forEach(fn => {
    try {
      fn(currentLanguage);
    } catch (err) {
      console.error('[languageService] Error in listener callback', err);
    }
  });

  // Dispatch custom window event
  window.dispatchEvent(new CustomEvent('carex:languageChange', { detail: { lang: currentLanguage } }));
}

/**
 * Subscribe to language changes
 * @param {(lang: string) => void} fn 
 * @returns {() => void} unsubscribe function
 */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Translate a dot-notation key (e.g. 'nav.home', 'header.greeting_morning')
 * with optional interpolation parameters: { name: 'Samia' }
 * Falls back gracefully to English, then to the key itself.
 */
export function t(key, params = {}) {
  if (!key) return '';

  const activeDict = locales[currentLanguage] || locales.en;
  let text = getNestedValue(activeDict, key);

  // Fallback to English if missing in current locale
  if (text === undefined && currentLanguage !== 'en') {
    text = getNestedValue(locales.en, key);
  }

  if (text === undefined) {
    return key;
  }

  if (typeof text !== 'string') {
    return text;
  }

  // Replace {param} placeholders
  return text.replace(/\{(\w+)\}/g, (match, paramName) => {
    return params[paramName] !== undefined ? params[paramName] : match;
  });
}

function getNestedValue(obj, keyPath) {
  if (!obj || !keyPath) return undefined;
  const parts = keyPath.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr === null || curr === undefined || typeof curr !== 'object') {
      return undefined;
    }
    curr = curr[part];
  }
  return curr;
}

// Initial setup on document
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = currentLanguage;
  if (currentLanguage === 'hi') {
    document.body.classList.add('lang-hi');
  }
}
