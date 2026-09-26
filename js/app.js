/**
 * Main ES6 Application Entry Point.
 */

import { state } from './state.js';
import { router } from './router.js';
import { sidebarComponent } from './components/sidebar.js';
import { bottomNavComponent } from './components/bottomNav.js';
import { headerComponent } from './components/header.js';
import { reminderService } from './services/reminderService.js';
import { notificationService } from './services/notificationService.js';

// Register All Application Routes
router.register({
  'home':          () => import('./pages/home.js'),
  'medicine':      () => import('./pages/medicine.js'),
  'sos':           () => import('./pages/sos.js'),
  'family':        () => import('./pages/family.js'),
  'doctor':        () => import('./pages/doctor.js'),
  'checkin':       () => import('./pages/checkin.js'),
  'location':      () => import('./pages/location.js'),
  'health-notes':  () => import('./pages/healthNotes.js'),
  'special-care':  () => import('./pages/specialCare.js'),
  'routine':       () => import('./pages/routine.js'),
  'music':         () => import('./pages/music.js'),
  'games':         () => import('./pages/games.js'),
  'voice':         () => import('./pages/voiceAssistant.js'),
  'settings':      () => import('./pages/settings.js'),
  'notifications': () => import('./pages/notifications.js')
});

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize State & Data Migration
  state.init();

  // 2. Render Application Shell Components
  sidebarComponent.init();
  bottomNavComponent.init();
  headerComponent.init();

  // 3. Initialize Services
  reminderService.start();
  notificationService.init();

  // 4. Start SPA Router
  router.init();

  // Apply saved accessibility preferences
  const settings = state.get('settings') || {};
  if (settings.fontSize) {
    document.documentElement.setAttribute('data-font-scale', settings.fontSize);
  }
  if (settings.contrast) {
    document.documentElement.setAttribute('data-contrast', settings.contrast);
  }
});
