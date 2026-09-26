/**
 * Notification Service — Handles Browser Notification API & Toast fallback.
 */

import { toast } from '../components/toast.js';

export const notificationService = {
  permission: 'default',

  async init() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  },

  async requestPermission() {
    if (!('Notification' in window)) {
      toast.show('Browser notifications are not supported in this browser.', 'warning');
      return false;
    }
    try {
      const res = await Notification.requestPermission();
      this.permission = res;
      if (res === 'granted') {
        toast.show('Browser notifications enabled!', 'success');
        return true;
      } else {
        toast.show('Notification permission denied.', 'warning');
        return false;
      }
    } catch (e) {
      console.error('Permission request error:', e);
      return false;
    }
  },

  notify(title, options = {}) {
    // Show in-app toast notification
    toast.show(`${title}: ${options.body || ''}`, options.type || 'info');

    // Also trigger native browser notification if granted
    if (this.permission === 'granted' && 'Notification' in window) {
      try {
        new Notification(title, {
          icon: './public/favicon.svg',
          body: options.body || '',
          ...options
        });
      } catch (e) {
        console.warn('Native notification failed:', e);
      }
    }
  }
};
