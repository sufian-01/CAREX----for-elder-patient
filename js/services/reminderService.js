/**
 * Reminder Service — Periodically checks for scheduled medicine and appointment reminders.
 */

import { state } from '../state.js';
import { notificationService } from './notificationService.js';
import { formatTime12h } from '../utils/dateUtils.js';

let reminderInterval = null;

export const reminderService = {
  start() {
    if (reminderInterval) clearInterval(reminderInterval);
    
    // Check every 30 seconds
    reminderInterval = setInterval(() => {
      this.checkReminders();
    }, 30000);

    // Initial check
    this.checkReminders();
  },

  checkReminders() {
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime24 = `${currentHours}:${currentMinutes}`;

    // Check Medicines
    const medicines = state.get('medicines') || [];
    medicines.forEach(med => {
      if (!med.taken && med.time === currentTime24) {
        notificationService.notify(`💊 Medicine Reminder`, {
          body: `Time to take ${med.name} (${med.dose})`,
          type: 'info'
        });
      }
    });
  },

  stop() {
    if (reminderInterval) clearInterval(reminderInterval);
  }
};
