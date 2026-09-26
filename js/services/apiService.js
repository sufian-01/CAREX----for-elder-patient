/**
 * API Service — Abstraction layer for future FastAPI integration.
 * Currently delegates directly to local storage / memory state.
 */

import { state } from '../state.js';

export const apiService = {
  async fetchMedicines() {
    return state.get('medicines');
  },

  async fetchFamily() {
    return state.get('family');
  },

  async fetchDoctors() {
    return state.get('doctors');
  },

  async isBackendConnected() {
    return false; // Standalone frontend demo
  }
};
