/**
 * Global Voice Assistant Service — Web Speech API (Recognition & Synthesis).
 * Accessible globally across all pages.
 */

import { router } from '../router.js';
import { toast } from '../components/toast.js';

let recognition = null;
let currentState = 'ready'; // 'ready' | 'listening' | 'processing' | 'completed' | 'unsupported' | 'denied' | 'error'
let stateListeners = new Set();
let lastTranscript = '';

export const voiceService = {
  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      currentState = 'unsupported';
      this._notifyState();
      return;
    }

    if (!recognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        currentState = 'listening';
        this._notifyState();
      };

      recognition.onresult = (event) => {
        currentState = 'processing';
        this._notifyState();

        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        lastTranscript = transcript;
        this.processCommand(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          currentState = 'denied';
          toast.show('Microphone access denied. Please allow mic permission.', 'warning');
        } else {
          currentState = 'error';
          toast.show(`Voice error: ${event.error}`, 'warning');
        }
        this._notifyState();
        setTimeout(() => {
          if (currentState !== 'listening') {
            currentState = 'ready';
            this._notifyState();
          }
        }, 3000);
      };

      recognition.onend = () => {
        if (currentState === 'listening' || currentState === 'processing') {
          currentState = 'completed';
          this._notifyState();
          setTimeout(() => {
            currentState = 'ready';
            this._notifyState();
          }, 2000);
        }
      };
    }
  },

  start() {
    if (currentState === 'unsupported') {
      toast.show('Voice control is not supported by your browser.', 'warning');
      return;
    }

    if (currentState === 'listening') {
      this.stop();
      return;
    }

    this.init();

    try {
      recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
      currentState = 'ready';
      this._notifyState();
    }
  },

  stop() {
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {}
    }
    currentState = 'ready';
    this._notifyState();
    this.speak('Voice assistant stopped.');
  },

  toggle() {
    if (currentState === 'listening') {
      this.stop();
    } else {
      this.start();
    }
  },

  getState() {
    return currentState;
  },

  getLastTranscript() {
    return lastTranscript;
  },

  subscribe(listener) {
    stateListeners.add(listener);
    listener(currentState, lastTranscript);
    return () => stateListeners.delete(listener);
  },

  _notifyState() {
    stateListeners.forEach(fn => fn(currentState, lastTranscript));
  },

  speak(text) {
    if ('speechSynthesis' in window && text) {
      try {
        window.speechSynthesis.cancel(); // cancel previous speaking
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
  },

  processCommand(cmd) {
    toast.show(`Voice command: "${cmd}"`, 'info');

    if (cmd.includes('home')) {
      router.navigate('home');
      this.speak('Opening Home');
    } else if (cmd.includes('medicine')) {
      router.navigate('medicine');
      this.speak('Opening Medicine Reminders');
    } else if (cmd.includes('family')) {
      router.navigate('family');
      this.speak('Opening Family Contacts');
    } else if (cmd.includes('doctor')) {
      router.navigate('doctor');
      this.speak('Opening Doctor Appointments');
    } else if (cmd.includes('emergency') || cmd.includes('sos')) {
      router.navigate('sos');
      this.speak('Opening Emergency SOS');
    } else if (cmd.includes('checkin') || cmd.includes('check in') || cmd.includes('check-in')) {
      router.navigate('checkin');
      this.speak('Opening Daily Check-in');
    } else if (cmd.includes('routine')) {
      router.navigate('routine');
      this.speak('Opening Daily Routine');
    } else if (cmd.includes('note') || cmd.includes('health notes')) {
      router.navigate('health-notes');
      this.speak('Opening Health Notes');
    } else if (cmd.includes('special') || cmd.includes('special care')) {
      router.navigate('special-care');
      this.speak('Opening Special Care');
    } else if (cmd.includes('location')) {
      router.navigate('location');
      this.speak('Opening Location Sharing');
    } else if (cmd.includes('music') || cmd.includes('relax') || cmd.includes('nasheed')) {
      router.navigate('music');
      this.speak('Opening Nasheed and Relaxation');
    } else if (cmd.includes('game') || cmd.includes('games')) {
      router.navigate('games');
      this.speak('Opening Mini Games');
    } else if (cmd.includes('setting') || cmd.includes('settings')) {
      router.navigate('settings');
      this.speak('Opening Settings');
    } else if (cmd.includes('notification')) {
      router.navigate('notifications');
      this.speak('Opening Notifications');
    } else if (cmd.includes('go back') || cmd.includes('back')) {
      window.history.back();
      this.speak('Going back');
    } else if (cmd.includes('stop listening') || cmd.includes('stop')) {
      this.stop();
    } else if (cmd.includes('what can you do') || cmd.includes('help')) {
      this.speak('You can say open medicine, open family, open doctor, open emergency, open music, open games, and more.');
    } else {
      toast.show(`Command not recognized: "${cmd}"`, 'warning');
      this.speak('Sorry, I did not recognize that command.');
    }

    currentState = 'completed';
    this._notifyState();
    setTimeout(() => {
      currentState = 'ready';
      this._notifyState();
    }, 2000);
  }
};
