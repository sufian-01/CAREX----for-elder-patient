# CAREX — Elderly Care & Patient Assistance Web Application

> Care. Connect. Protect. ❤️

CAREX is a modern, accessible, elderly-friendly healthcare web application designed to make daily care simple, safe, and connected for senior citizens and their caregivers.

---

## 🎯 Complete Project Overview & Key Features

### 1. Dual-Language Localization (English 🇬🇧 & Hindi 🇮🇳)
- **Top Header Language Selector**: Seamless toggle between English and natural, elderly-friendly Hindi (`🇬🇧 English` / `🇮🇳 हिंदी`).
- **Complete Application Translation**: All 15 pages, forms, placeholder inputs, badges, navigation items, modals, and toasts translate instantly without requiring full-page reload or losing unsaved user state.
- **Persistent Preference**: Stored in `localStorage` under `carex_language` so the user's preferred language is remembered on their next visit.
- **Typography Optimization**: Incorporates Google Fonts `Noto Sans Devanagari` alongside `Inter` and `Manrope` for crystal-clear readability.
- **Bilingual Voice Assistant**: Recognizes and responds to voice commands in both English and Hindi (`hi-IN`).

### 2. Nasheed & Relaxation Player
- **Authentic Islamic Recitations**: Locally bundled high-quality vocal recitations in `assets/audio/` (`tala_al_badru.mp3`, `asma_ul_husna.mp3`, `qamarun.mp3`, `ya_nabi.mp3`, `hasbi_rabbi.mp3`, `last_breath.mp3`).
- **Dynamic Track Display**: When tracks are switched, the main player title, artist, category, duration, and playlist highlight update in the DOM immediately.
- **Audio Controls**: HTML5 Audio API with Play/Pause, Next, Previous, seek progress bar, real-time time counters, volume slider, and external official channel links.

### 3. Emergency SOS & Real Local Siren Alarm
- **Web Audio API Dual-Tone Siren**: Oscillating alert sound generated directly in the browser with no external audio file dependencies.
- **Dedicated Stop Button**: A large, high-visibility "🔕 TURN OFF SIREN ALARM" button directly under the SOS button when active.
- **Emergency Calling**: Direct one-tap `tel:` phone dialing for configured emergency family contacts.

### 4. Interactive Mini Games (Tic-Tac-Toe ❌ vs ⭕)
- **Realistic Game Modes**: Play vs Computer (Smart AI) or 2-Player mode on the same device.
- **Scoreboard**: Tracks Player X wins, Player O wins, and Ties.
- **Elderly-Friendly UI**: High-contrast 3x3 grid with minimum 64px tap targets and animated win highlights.

### 5. Family & Caregiver Contacts
- Contact management with name, relationship, and phone numbers.
- Designation of primary emergency contact for SOS integration.
- Direct phone dialing (`tel:`) support.

### 6. Medicine Reminders & Daily Routine
- Set medicines with dosage, time, and frequency.
- Mark as taken, reset status, and postpone (snooze) reminders.
- Scheduled daily routines with time-based timeline visualization.

### 7. Location Sharing
- One-tap GPS coordinate retrieval via browser Geolocation API.
- Google Maps link generation.
- Quick share buttons for WhatsApp (`https://wa.me/`), SMS (`sms:`), and Web Share API.

### 8. Doctor Appointments & Health Notes
- Schedule medical visits with doctor name, clinic, date, time, and reason.
- Record vitals, symptoms, and observations with timestamps.

### 9. Daily Check-in & Special Care
- One-tap "I'm doing well", "I'm okay", and "I need help" wellness check-ins.
- Special care needs instructions for family members and caregivers.

### 10. Global Voice Assistant
- Top header microphone button accessible across every page.
- Web Speech API speech recognition and spoken feedback via `speechSynthesis`.

---

## 🛠️ Technology Stack Breakdown

| Category | Technology | Purpose & Details |
|---|---|---|
| **Core Architecture** | Vanilla JavaScript (ES6+ Modules) | No framework overhead; native browser ES modules (`type="module"`), clean separation of concerns |
| **Markup & Semantics** | HTML5, Semantic Elements | Accessible tags (`<aside>`, `<header>`, `<main>`, `<nav>`), ARIA live regions and attributes |
| **Design & Styling** | Modern CSS3 | CSS Custom Properties (Variables), Flexbox, CSS Grid, mobile-first responsive design (320px – 1440px) |
| **Routing** | Client-Side SPA Hash Router | Hash-based navigation (`#/home`, `#/medicine`, etc.) supporting back/forward browser history and zero-config static hosting |
| **State Management** | Pub/Sub State Service | Centralized state (`js/state.js`) with event subscription and automatic persistence |
| **Storage & Persistence** | LocalStorage API | Abstracted in `storageService.js` with auto-migration from legacy prototype keys (`cxm`, `cxf`, etc.) |
| **Internationalization (i18n)** | Custom Language Service (`js/services/languageService.js`) | Reactive event subscriptions, dot-notation resolution, interpolation, fallback chain, Devanagari font integration |
| **Audio Processing** | HTML5 Audio & Web Audio API | HTML5 `<audio>` for Nasheed player; custom dual-tone synthetic siren oscillator for Emergency SOS |
| **Speech Recognition & Synthesis** | Web Speech API | `SpeechRecognition` / `webkitSpeechRecognition` supporting `en-US` and `hi-IN`; `SpeechSynthesisUtterance` for voice response |
| **Geolocation & Sharing** | Geolocation API & Web Share API | Precise GPS coordinate acquisition and native device share intents (with WhatsApp / SMS deep-links) |
| **Typography & Icons** | Google Fonts & Lucide Icons | Fonts: `Inter`, `Noto Sans Devanagari`, `Manrope`, `DM Sans`; lightweight vector icons via Lucide |
| **Deployment** | Vercel Static Hosting | Zero build-step deployment with `vercel.json` rewrite configuration |

---

## 👥 Project Team & App Credits

1. **Samia Naaz**
2. **SHAULAT JAHAN**
3. **Riva Naaz**

Default App Profile User: **Samia**
