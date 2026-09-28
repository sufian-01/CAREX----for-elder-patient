/**
 * Global Voice Assistant Service — Web Speech API (Recognition & Synthesis).
 * Multi-Language Support (English and Hindi).
 * Accessible globally across all pages.
 */

import { router } from '../router.js';
import { toast } from '../components/toast.js';
import { getLanguage, t } from './languageService.js';

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
    }

    // Update recognition language according to current app language
    const currentLang = getLanguage();
    recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';

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
      const isHi = getLanguage() === 'hi';
      if (event.error === 'not-allowed') {
        currentState = 'denied';
        toast.show(isHi ? 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया अनुमति दें।' : 'Microphone access denied. Please allow mic permission.', 'warning');
      } else {
        currentState = 'error';
        toast.show(isHi ? `वॉइस त्रुटि: ${event.error}` : `Voice error: ${event.error}`, 'warning');
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
  },

  start() {
    if (currentState === 'unsupported') {
      const isHi = getLanguage() === 'hi';
      toast.show(isHi ? 'आपका ब्राउज़र वॉइस कमांड सपोर्ट नहीं करता।' : 'Voice control is not supported by your browser.', 'warning');
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
    const isHi = getLanguage() === 'hi';
    this.speak(isHi ? 'वॉइस असिस्टेंट बंद हुआ।' : 'Voice assistant stopped.');
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
        const currentLang = getLanguage();
        utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
  },

  processCommand(cmd) {
    const isHi = getLanguage() === 'hi';
    toast.show(isHi ? `वॉइस कमांड: "${cmd}"` : `Voice command: "${cmd}"`, 'info');

    // Navigation and actions supporting English and Hindi keywords
    if (cmd.includes('home') || cmd.includes('होम') || cmd.includes('घर')) {
      router.navigate('home');
      this.speak(isHi ? 'होम खोला जा रहा है' : 'Opening Home');
    } else if (cmd.includes('medicine') || cmd.includes('दवा') || cmd.includes('दवाई') || cmd.includes('meds')) {
      router.navigate('medicine');
      this.speak(isHi ? 'दवाइयाँ खोली जा रही हैं' : 'Opening Medicine Reminders');
    } else if (cmd.includes('family') || cmd.includes('परिवार') || cmd.includes('घरवाले')) {
      router.navigate('family');
      this.speak(isHi ? 'परिवार के संपर्क खोले जा रहे हैं' : 'Opening Family Contacts');
    } else if (cmd.includes('doctor') || cmd.includes('डॉक्टर') || cmd.includes('अस्पताल') || cmd.includes('hospital')) {
      router.navigate('doctor');
      this.speak(isHi ? 'डॉक्टर अपॉइंटमेंट खोले जा रहे हैं' : 'Opening Doctor Appointments');
    } else if (cmd.includes('emergency') || cmd.includes('sos') || cmd.includes('एसओएस') || cmd.includes('मदद') || cmd.includes('इमरजेंसी')) {
      router.navigate('sos');
      this.speak(isHi ? 'आपातकालीन एसओएस खोला जा रहा है' : 'Opening Emergency SOS');
    } else if (cmd.includes('checkin') || cmd.includes('check in') || cmd.includes('check-in') || cmd.includes('चेक इन') || cmd.includes('चेकइन') || cmd.includes('ठीक')) {
      router.navigate('checkin');
      this.speak(isHi ? 'दैनिक चेक-इन खोला जा रहा है' : 'Opening Daily Check-in');
    } else if (cmd.includes('routine') || cmd.includes('दिनचर्या') || cmd.includes('रूटीन')) {
      router.navigate('routine');
      this.speak(isHi ? 'दिनचर्या खोली जा रही है' : 'Opening Daily Routine');
    } else if (cmd.includes('note') || cmd.includes('health notes') || cmd.includes('नोट्स') || cmd.includes('स्वास्थ्य')) {
      router.navigate('health-notes');
      this.speak(isHi ? 'स्वास्थ्य नोट्स खोले जा रहे हैं' : 'Opening Health Notes');
    } else if (cmd.includes('special') || cmd.includes('special care') || cmd.includes('विशेष')) {
      router.navigate('special-care');
      this.speak(isHi ? 'विशेष देखभाल खोली जा रही है' : 'Opening Special Care');
    } else if (cmd.includes('location') || cmd.includes('लोकेशन') || cmd.includes('जगह') || cmd.includes('नक्शा')) {
      router.navigate('location');
      this.speak(isHi ? 'लोकेशन शेयरिंग खोली जा रही है' : 'Opening Location Sharing');
    } else if (cmd.includes('music') || cmd.includes('relax') || cmd.includes('nasheed') || cmd.includes('नशीद') || cmd.includes('गाना') || cmd.includes('संगीत') || cmd.includes('आराम')) {
      router.navigate('music');
      this.speak(isHi ? 'नशीद और विश्राम खोला जा रहा है' : 'Opening Nasheed and Relaxation');
    } else if (cmd.includes('game') || cmd.includes('games') || cmd.includes('गेम') || cmd.includes('खेल') || cmd.includes('टिक टैक')) {
      router.navigate('games');
      this.speak(isHi ? 'मिनी गेम्स खोले जा रहे हैं' : 'Opening Mini Games');
    } else if (cmd.includes('about') || cmd.includes('परिचय') || cmd.includes('के बारे में') || cmd.includes('carex ke bare')) {
      router.navigate('about');
      this.speak(isHi ? 'CAREX के बारे में खोला जा रहा है' : 'Opening About CAREX');
    } else if (cmd.includes('setting') || cmd.includes('settings') || cmd.includes('सेटिंग')) {
      router.navigate('settings');
      this.speak(isHi ? 'सेटिंग्स खोली जा रही हैं' : 'Opening Settings');
    } else if (cmd.includes('notification') || cmd.includes('सूचना')) {
      router.navigate('notifications');
      this.speak(isHi ? 'सूचनाएँ खोली जा रही हैं' : 'Opening Notifications');
    } else if (cmd.includes('go back') || cmd.includes('back') || cmd.includes('पीछे')) {
      window.history.back();
      this.speak(isHi ? 'पीछे जा रहे हैं' : 'Going back');
    } else if (cmd.includes('stop listening') || cmd.includes('stop') || cmd.includes('रुको') || cmd.includes('बंद करो')) {
      this.stop();
    } else if (cmd.includes('what can you do') || cmd.includes('help') || cmd.includes('मदद करो')) {
      this.speak(isHi 
        ? 'आप कह सकते हैं: दवा खोलो, परिवार खोलो, डॉक्टर खोलो, एसओएस खोलो, नशीद खोलो, या गेम खोलो।' 
        : 'You can say open medicine, open family, open doctor, open emergency, open music, open games, and more.');
    } else {
      toast.show(isHi ? `कमांड समझ नहीं आई: "${cmd}"` : `Command not recognized: "${cmd}"`, 'warning');
      this.speak(isHi ? 'क्षमा करें, मुझे यह कमांड समझ नहीं आई।' : 'Sorry, I did not recognize that command.');
    }

    currentState = 'completed';
    this._notifyState();
    setTimeout(() => {
      currentState = 'ready';
      this._notifyState();
    }, 2000);
  }
};
