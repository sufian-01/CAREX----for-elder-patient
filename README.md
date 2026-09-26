# CAREX — Elderly Care & Patient Assistance Web Application

> Care. Connect. Protect. ❤️

CAREX is a modern, accessible, elderly-friendly healthcare web application designed to make daily care simple, safe, and connected for senior citizens and their caregivers.

---

## 🎯 Project Status & Features Overview

**Phase 1, Phase 2, and Phase 3 Final Feature Implementations are 100% COMPLETE.**

### Key System Highlights

- **Nasheed & Relaxation Player**: Authentic Islamic Nasheed listening experience with locally bundled high-quality audio files stored in `assets/audio/` (`tala_al_badru.mp3`, `asma_ul_husna.wav`, `qamarun.mp3`, `ya_nabi.wav`, `hasbi_rabbi.mp3`, `last_breath.wav`). Includes HTML5 Audio player, progress seek bar, time display, volume control, and official channel links for copyrighted tracks.
- **Location Sharing with Saved Contacts**: GPS location retrieval via Geolocation API, Google Maps link generation, contact selection, Web Share API support, and direct **WhatsApp** (`https://wa.me/`) & **SMS** (`sms:`) sharing fallbacks.
- **Direct Calling**: Contact phone number validation, prominent 44–48px `tel:` links in Family Contacts and SOS emergency pages.
- **Mini Games (Memory Match)**: Elderly-friendly card matching puzzle with familiar symbols (🌸, 🍎, 🐦, ☕, 📖, 🌟, 🍀, 🎨), move counter, restart/new game controls, and touch accessibility.
- **Global Voice Assistant**: Accessible from **every page** in the header. Web Speech API recognition & speech synthesis feedback.
- **Real Local Emergency Siren Alarm**: Web Audio API dual-tone repeating siren alarm with dedicated **"Stop Alarm"** button.
- **User Name**: **Samia**
- **Creator Credits**: Listed in exact order (1. Samia Naaz, 2. SHAULAT JAHAN, 3. Riva Naaz).
- **Responsive Layout**: Mobile-first design (320px–1440px), touch targets (min 44–48px), fixed desktop left sidebar (280px), compact mobile bottom navigation bar.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Structure | HTML5, Semantic Elements, ARIA Accessibility Attributes |
| Styling | CSS Custom Properties (Variables), Mobile-First Flexbox & CSS Grid |
| Logic | Vanilla JavaScript (ES6+), ES Modules, Pub/Sub State Management |
| Routing | Custom Hash-based SPA Router with async route loading |
| Web APIs | Web Audio API (Siren Alarm), Web Speech API (Global Voice), Geolocation API, Web Share API, LocalStorage API |
| Assets | Local Audio Files (`assets/audio/`), Lucide Icons, Google Fonts (Inter, DM Sans, Manrope) |
| Hosting | Ready for Vercel static deployment |

---

## 📁 Project Structure

```
CAREX/
├── index.html                  # Main application shell
├── CAREX_original.html         # Original prototype reference (preserved)
├── README.md                   # Complete documentation
├── CREDITS.md                  # Audio track source attributions & licenses
├── implementation_plan.md      # Completed implementation plan & status
│
├── docs/
│   ├── audit-report.md         # Full audit report of original application
│   ├── feature-preservation.md # Feature preservation checklist & migration strategy
│   └── architecture.md         # Application architecture document
│
├── assets/
│   └── audio/                  # Bundled MP3/WAV audio files for Nasheed player
│
├── public/
│   └── favicon.svg             # CAREX brand icon
│
├── css/
│   ├── variables.css           # Design tokens (colors, typography, spacing)
│   ├── reset.css               # Normalize & focus outline styles
│   ├── layout.css              # Desktop sidebar, header & content container
│   ├── components.css          # Cards, buttons, forms, modals, toasts, global mic button
│   ├── pages.css               # Page-specific grids, timeline, SOS box, game grid, player layout
│   ├── animations.css          # Transitions, keyframes, reduced motion overrides
│   └── responsive.css          # Mobile bottom nav & viewport breakpoint rules (320px - 1440px)
│
├── js/
│   ├── app.js                  # Application entry point & bootstrap
│   ├── router.js               # SPA Hash router with active nav link updates
│   ├── state.js                # Pub/Sub central state manager
│   │
│   ├── services/
│   │   ├── voiceService.js     # Global Voice Assistant (Web Speech API)
│   │   ├── alarmService.js     # Real Local Emergency Siren (Web Audio API)
│   │   ├── storageService.js   # LocalStorage abstraction & automatic data migration
│   │   ├── reminderService.js  # Interval check for medicine & appointment reminders
│   │   ├── notificationService.js # Notification API & Toast notifications
│   │   ├── locationService.js  # Geolocation API wrapper
│   │   └── apiService.js       # Abstract API layer for future FastAPI integration
│   │
│   ├── components/
│   │   ├── sidebar.js          # Desktop sidebar navigation
│   │   ├── bottomNav.js        # Mobile bottom navigation bar
│   │   ├── header.js           # Header with greeting, date & global mic button
│   │   ├── modal.js            # Accessible modal dialog system
│   │   ├── toast.js            # Toast notification feedback system
│   │   └── card.js             # Reusable card builder
│   │
│   ├── pages/ (15 feature page modules)
│   │   ├── home.js · medicine.js · sos.js · family.js · doctor.js
│   │   ├── checkin.js · location.js · healthNotes.js · specialCare.js · routine.js
│   │   └── music.js · games.js · voiceAssistant.js · settings.js · notifications.js
│   │
│   └── utils/
│       ├── dateUtils.js        # Date formatting & 12h time conversion
│       ├── validation.js       # Input validation
│       └── helpers.js          # Unique ID generator, HTML escaping & Lucide renderer
```

---

## 👥 Application Creators (App Credits)

Listed in exact order as displayed in Settings & About CAREX:

1. **Samia Naaz**
2. **SHAULAT JAHAN**
3. **Riva Naaz**

---

## 🚀 How to Run Locally

Serve over HTTP/HTTPS:

```bash
cd D:\CAREX
python -m http.server 8000
```

Open `http://localhost:8000` in your browser.

---

## 🌐 Vercel Deployment Instructions

1. Push repository to GitHub.
2. Import repository into [Vercel](https://vercel.com).
3. Select **Static Site** / **Other**.
4. Output Directory: `.` (Root).
5. Click **Deploy**.
