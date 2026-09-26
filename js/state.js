/**
 * Central Application State Manager (Pub/Sub Pattern).
 */

import { storageService } from './services/storageService.js';

const listeners = new Map();

let appState = {
  userName: 'Samia',
  medicines: [],
  family: [],
  doctors: [],
  healthNotes: [],
  routine: [],
  specialCare: [],
  checkin: { checked: false, timestamp: null, statusText: "I'm okay" },
  location: { sharing: false, lastShared: null, coords: null },
  settings: {
    fontSize: 'normal',
    contrast: 'normal',
    reducedMotion: false,
    soundEnabled: true
  },
  notifications: []
};

export const state = {
  init() {
    storageService.migrate();

    let savedName = storageService.get('userName', 'Samia');
    if (savedName === 'Sufian') {
      savedName = 'Samia';
      storageService.set('userName', 'Samia');
    }

    appState.userName = savedName;
    appState.medicines = storageService.get('medicines', []);
    appState.family = storageService.get('family', []);
    appState.doctors = storageService.get('doctors', []);
    appState.healthNotes = storageService.get('healthNotes', []);
    appState.routine = storageService.get('routine', []);
    appState.specialCare = storageService.get('specialCare', []);
    appState.checkin = storageService.get('checkin', { checked: false, timestamp: null, statusText: "I'm okay" });
    appState.location = storageService.get('location', { sharing: false, lastShared: null, coords: null });
    appState.settings = storageService.get('settings', {
      fontSize: 'normal',
      contrast: 'normal',
      reducedMotion: false,
      soundEnabled: true
    });
    appState.notifications = storageService.get('notifications', []);
  },

  get(key) {
    return appState[key];
  },

  set(key, value) {
    appState[key] = value;
    storageService.set(key, value);
    this.notify(key, value);
  },

  subscribe(key, fn) {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    listeners.get(key).add(fn);
    return () => listeners.get(key).delete(fn);
  },

  notify(key, value) {
    if (listeners.has(key)) {
      listeners.get(key).forEach(fn => fn(value));
    }
  }
};
