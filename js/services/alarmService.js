/**
 * Emergency Alarm Service — Web Audio API Siren Generator.
 * Plays a loud, repeating local siren alarm when SOS is activated.
 */

let audioCtx = null;
let isAlarmActive = false;
let sirenInterval = null;
let activeOscillator = null;
let activeGainNode = null;

export const alarmService = {
  /**
   * Start the emergency siren.
   */
  start() {
    if (isAlarmActive) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API is not supported in this browser.');
        return;
      }

      if (!audioCtx || audioCtx.state === 'closed') {
        audioCtx = new AudioContextClass();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      isAlarmActive = true;

      // Master Gain Node
      activeGainNode = audioCtx.createGain();
      activeGainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      activeGainNode.connect(audioCtx.destination);

      // Create Siren Oscillator
      activeOscillator = audioCtx.createOscillator();
      activeOscillator.type = 'sawtooth';
      activeOscillator.frequency.setValueAtTime(750, audioCtx.currentTime);
      activeOscillator.connect(activeGainNode);
      activeOscillator.start();

      // Alternating frequency (Dual-tone European/US siren pattern: 750Hz <-> 950Hz)
      let highTone = false;
      sirenInterval = setInterval(() => {
        if (!isAlarmActive || !activeOscillator || !audioCtx) return;
        const targetFreq = highTone ? 750 : 950;
        activeOscillator.frequency.setValueAtTime(targetFreq, audioCtx.currentTime);
        highTone = !highTone;
      }, 400);

    } catch (e) {
      console.error('Failed to start alarm sound:', e);
      isAlarmActive = false;
    }
  },

  /**
   * Stop the emergency siren.
   */
  stop() {
    isAlarmActive = false;

    if (sirenInterval) {
      clearInterval(sirenInterval);
      sirenInterval = null;
    }

    if (activeOscillator) {
      try {
        activeOscillator.stop();
        activeOscillator.disconnect();
      } catch (e) {}
      activeOscillator = null;
    }

    if (activeGainNode) {
      try {
        activeGainNode.disconnect();
      } catch (e) {}
      activeGainNode = null;
    }

    if (audioCtx && audioCtx.state !== 'closed') {
      try {
        audioCtx.suspend();
      } catch (e) {}
    }
  },

  isActive() {
    return isAlarmActive;
  }
};
