/**
 * Storage Service — Handles LocalStorage operations and migration from prototype keys.
 */

const STORAGE_PREFIX = 'carex_';

export const storageService = {
  /**
   * Migrate old prototype keys if present.
   */
  migrate() {
    try {
      // Migrate Medicines (cxm)
      const oldMeds = localStorage.getItem('cxm');
      if (oldMeds && !localStorage.getItem(STORAGE_PREFIX + 'medicines')) {
        const parsed = JSON.parse(oldMeds);
        const migrated = parsed.map(m => ({
          id: 'cx_' + Math.random().toString(36).substring(2, 9),
          name: m.name || '',
          dose: m.dose || 'Dose not set',
          time: m.time || '08:00',
          freq: m.freq || 'Daily',
          taken: !!m.taken,
          createdAt: new Date().toISOString()
        }));
        this.set('medicines', migrated);
      }

      // Migrate Family (cxf)
      const oldFams = localStorage.getItem('cxf');
      if (oldFams && !localStorage.getItem(STORAGE_PREFIX + 'family')) {
        const parsed = JSON.parse(oldFams);
        const migrated = parsed.map((f, idx) => ({
          id: 'cx_' + Math.random().toString(36).substring(2, 9),
          name: f.name || '',
          rel: f.rel || 'Family',
          phone: f.phone || '',
          isEmergency: idx === 0,
          createdAt: new Date().toISOString()
        }));
        this.set('family', migrated);
      }

      // Migrate Doctor Appointments (cxd)
      const oldDocs = localStorage.getItem('cxd');
      if (oldDocs && !localStorage.getItem(STORAGE_PREFIX + 'doctors')) {
        const parsed = JSON.parse(oldDocs);
        const migrated = parsed.map(d => ({
          id: 'cx_' + Math.random().toString(36).substring(2, 9),
          name: d.name || '',
          hospital: d.hospital || '',
          date: d.date || new Date().toISOString().split('T')[0],
          time: d.time || '10:30',
          reason: d.reason || '',
          createdAt: new Date().toISOString()
        }));
        this.set('doctors', migrated);
      }

      // Migrate Health Notes (cxnotes)
      const oldNotes = localStorage.getItem('cxnotes');
      if (oldNotes && !localStorage.getItem(STORAGE_PREFIX + 'healthNotes')) {
        const parsed = JSON.parse(oldNotes);
        const migrated = parsed.map(n => ({
          id: 'cx_' + Math.random().toString(36).substring(2, 9),
          title: n.title || '',
          body: n.body || '',
          createdAt: new Date().toISOString()
        }));
        this.set('healthNotes', migrated);
      }

      // Migrate Daily Routine (cxroutine)
      const oldRoutine = localStorage.getItem('cxroutine');
      if (oldRoutine && !localStorage.getItem(STORAGE_PREFIX + 'routine')) {
        const parsed = JSON.parse(oldRoutine);
        const migrated = parsed.map(r => ({
          id: 'cx_' + Math.random().toString(36).substring(2, 9),
          name: r.name || '',
          time: r.time || '08:00',
          completed: false,
          createdAt: new Date().toISOString()
        }));
        this.set('routine', migrated);
      }

      // Migrate Special Care (cxspecial)
      const oldSpecial = localStorage.getItem('cxspecial');
      if (oldSpecial && !localStorage.getItem(STORAGE_PREFIX + 'specialCare')) {
        const parsed = JSON.parse(oldSpecial);
        const migrated = parsed.map(s => ({
          id: 'cx_' + Math.random().toString(36).substring(2, 9),
          name: s.name || '',
          body: s.body || '',
          createdAt: new Date().toISOString()
        }));
        this.set('specialCare', migrated);
      }

      // Migrate Check-in (cxo)
      const oldO = localStorage.getItem('cxo');
      if (oldO !== null && !localStorage.getItem(STORAGE_PREFIX + 'checkin')) {
        this.set('checkin', {
          checked: oldO === '1',
          timestamp: oldO === '1' ? new Date().toISOString() : null,
          statusText: "I'm okay"
        });
      }

      // Migrate Location Sharing (cxloc)
      const oldLoc = localStorage.getItem('cxloc');
      if (oldLoc !== null && !localStorage.getItem(STORAGE_PREFIX + 'location')) {
        this.set('location', {
          sharing: oldLoc === '1',
          lastShared: oldLoc === '1' ? new Date().toISOString() : null
        });
      }
    } catch (e) {
      console.error('Storage migration error:', e);
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading key ${key} from storage:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing key ${key} to storage:`, e);
    }
  },

  clearAll() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX) || key.startsWith('cx')) {
        localStorage.removeItem(key);
      }
    });
  }
};
