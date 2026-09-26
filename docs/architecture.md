# CAREX — Application Architecture

## 1. Architecture Overview

The redesigned CAREX application follows a modular vanilla JavaScript architecture with clear separation of concerns. No frameworks are used — only HTML5, CSS3, ES6 Modules, and browser APIs.

```
┌─────────────────────────────────────────────────────────┐
│                     Browser                              │
├─────────────────────────────────────────────────────────┤
│  index.html (Application Shell)                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  CSS Layer (variables → reset → layout → components │ │
│  │  → pages → animations → responsive)                 │ │
│  └─────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  JavaScript Application (ES6 Modules)               │ │
│  │  ┌───────────┐  ┌──────────┐  ┌──────────────────┐  │ │
│  │  │  app.js   │  │ router.js│  │    state.js      │  │ │
│  │  │  (entry)  │  │ (SPA nav)│  │  (app state mgr) │  │ │
│  │  └───────────┘  └──────────┘  └──────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │  Services Layer                              │   │ │
│  │  │  storage · reminder · notification · location│   │ │
│  │  │  api (future)                                │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │  Components (reusable UI)                    │   │ │
│  │  │  sidebar · bottomNav · header · modal · toast│   │ │
│  │  │  card                                        │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │  Pages (feature modules)                     │   │ │
│  │  │  home · medicine · sos · family · doctor     │   │ │
│  │  │  checkin · location · healthNotes · special   │   │ │
│  │  │  routine · music · voiceAssistant · settings  │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │  Utilities                                   │   │ │
│  │  │  dateUtils · validation · helpers             │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  LocalStorage (persistence layer)                   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Core Modules

### 2.1 `app.js` — Application Entry Point

**Responsibilities**:
- Initialize the application
- Import and bootstrap all modules
- Run data migration from old LocalStorage keys
- Set up the router
- Initialize services (reminder, notification)
- Render the initial page
- Register service worker (future)

**Initialization flow**:
```
app.js loads
  → storageService.migrate()     // migrate old cxm/cxf/etc. keys
  → state.init()                 // load state from storage
  → router.init()                // set up hash-based routing
  → components.init()            // render sidebar, header, nav
  → reminderService.start()      // start reminder checks
  → notificationService.init()   // request notification permission
  → router.navigate('home')      // render home page
```

### 2.2 `router.js` — Client-Side Router

**Type**: Hash-based SPA router (`#/home`, `#/medicine`, `#/sos`, etc.)

**Responsibilities**:
- Parse URL hash to determine current page
- Map routes to page modules
- Render page content into the main content area
- Manage browser history (back/forward support)
- Handle 404/unknown routes
- Emit navigation events for components to react to

**Route table**:
```javascript
const routes = {
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
  'voice':         () => import('./pages/voiceAssistant.js'),
  'settings':      () => import('./pages/settings.js'),
};
```

**Why hash-based routing**: 
- Works with static file hosting (Vercel, GitHub Pages)
- No server-side routing configuration needed
- Supports browser back/forward buttons
- Direct page refresh works without 404
- Simple to implement without a framework

### 2.3 `state.js` — Application State Manager

**Responsibilities**:
- Centralized state management (single source of truth)
- Subscribe/notify pattern for state changes
- Interface between UI and storage
- State shape definition and defaults

**State shape**:
```javascript
const defaultState = {
  medicines: [],        // from cxm / carex_medicines
  familyContacts: [],   // from cxf / carex_family
  doctorAppts: [],      // from cxd / carex_doctors
  healthNotes: [],      // from cxnotes / carex_healthNotes
  routines: [],         // from cxroutine / carex_routine
  specialCare: [],      // from cxspecial / carex_specialCare
  checkin: {            // from cxo / carex_checkin
    checked: false,
    timestamp: null,
    mood: null
  },
  location: {           // from cxloc / carex_location
    sharing: false,
    lastShared: null
  },
  settings: {
    fontSize: 'normal',
    theme: 'light',
    notifications: true
  },
  music: {
    favorites: [],
    lastPlayed: null,
    volume: 0.7
  }
};
```

**API**:
```javascript
export const state = {
  get(key),              // get state value
  set(key, value),       // set state value, notify subscribers, persist
  subscribe(key, fn),    // subscribe to state changes
  unsubscribe(key, fn),  // unsubscribe from state changes
  getAll(),              // get complete state snapshot
  reset(),               // reset to defaults
};
```

---

## 3. Services Layer

### 3.1 `storageService.js`

**Responsibilities**:
- Abstract LocalStorage operations
- Handle JSON serialization/deserialization
- Data migration from old keys to new keys
- Data versioning
- Error handling for storage quota exceeded
- Export/import data functionality

**Key features**:
- `migrate()` — one-time migration from `cxm`, `cxf`, etc. to new keys
- `get(key)` / `set(key, value)` — typed storage access
- `export()` — generate JSON backup
- `import(data)` — restore from backup
- `clear()` — clear all CAREX data (with confirmation)

### 3.2 `reminderService.js`

**Responsibilities**:
- Check medicine schedules against current time
- Trigger notifications for upcoming medicines
- Handle snooze/postpone logic
- Check-in daily reset at midnight
- Appointment reminders

**Implementation plan**:
- Use `setInterval` to check every minute
- Compare medicine times with current time
- Trigger notification via `notificationService`
- Track which reminders have been shown today

### 3.3 `notificationService.js`

**Responsibilities**:
- Request browser notification permission
- Display browser notifications (Notification API)
- Fallback to in-app toast notifications
- Sound alerts (optional)
- Manage notification queue

**Fallback strategy**:
1. Try Notification API (requires permission)
2. If denied or unavailable, use in-app toast
3. Optional sound alert via Audio API

### 3.4 `locationService.js`

**Responsibilities**:
- Interface with Geolocation API
- Get current position
- Watch position changes
- Handle permission requests
- Provide fallback for denied/unavailable geolocation
- Format location data for display

**Privacy considerations**:
- Always require explicit user action
- Show clear disclaimer that this is a demo
- Never automatically share location
- Store location data only locally

### 3.5 `apiService.js`

**Responsibilities**:
- Prepare interface for future FastAPI backend
- Define API endpoint patterns
- Handle online/offline detection
- Queue operations when offline
- Sync when back online

**Current phase**: Stub module only. All methods return local data. When backend is ready, swap implementation without changing the interface.

```javascript
// Future API contract (not implemented yet)
export const api = {
  async getMedicines() { /* returns local data for now */ },
  async saveMedicine(med) { /* saves to localStorage for now */ },
  async syncAll() { /* no-op for now */ },
  isOnline() { return navigator.onLine; },
};
```

---

## 4. Components Layer

Reusable UI components that render into specific DOM containers.

### 4.1 `sidebar.js`
Desktop sidebar navigation with feature links, user info, and SOS button.
Shown only on desktop (≥1024px).

### 4.2 `bottomNav.js`
Mobile/tablet bottom navigation bar.
Shown only on mobile/tablet (<1024px).
5 primary navigation items + potential SOS quick access.

### 4.3 `header.js`
Responsive header with:
- App branding
- Current page title
- User greeting
- Compact on scroll (mobile)

### 4.4 `modal.js`
Reusable modal dialog replacing `alert()` and `confirm()`.
- Support for confirm/cancel actions
- Accessible (focus trap, escape to close)
- Custom content support
- SOS confirmation modal

### 4.5 `toast.js`
Toast notification system replacing `alert()` for feedback.
- Success, warning, error, info variants
- Auto-dismiss with configurable duration
- Accessible (aria-live region)
- Stack multiple toasts

### 4.6 `card.js`
Reusable card component for consistent data display.
- Header, body, footer slots
- Action buttons
- Badge/status display
- Expandable/collapsible

---

## 5. Pages Layer

Each page module exports a `render()` function that returns HTML and an `init()` function that sets up event listeners.

**Page module contract**:
```javascript
// Example: pages/medicine.js
export function render() {
  // Returns HTML string for the page
  return `<div class="page page--medicine">...</div>`;
}

export function init() {
  // Called after render, sets up event listeners
  document.getElementById('add-medicine-form')
    .addEventListener('submit', handleAddMedicine);
}

export function destroy() {
  // Called before navigating away, cleanup
}
```

### Page list:
| Page | Route | File | Original Function |
|------|-------|------|-------------------|
| Home | `#/home` | `home.js` | `home()` |
| Medicine | `#/medicine` | `medicine.js` | `medicine()` |
| Emergency SOS | `#/sos` | `sos.js` | `sos()` |
| Family | `#/family` | `family.js` | `family()` |
| Doctor | `#/doctor` | `doctor.js` | `doctor()` |
| Check-in | `#/checkin` | `checkin.js` | `checkin()` |
| Location | `#/location` | `location.js` | `locationPage()` |
| Health Notes | `#/health-notes` | `healthNotes.js` | `healthNote()` |
| Special Care | `#/special-care` | `specialCare.js` | `specialCare()` |
| Daily Routine | `#/routine` | `routine.js` | `dailyRoutine()` |
| Music | `#/music` | `music.js` | NEW |
| Voice Assistant | `#/voice` | `voiceAssistant.js` | NEW |
| Settings | `#/settings` | `settings.js` | NEW |

---

## 6. Utilities

### 6.1 `dateUtils.js`
- Date formatting for display
- Time comparison for reminders
- Relative time ("2 hours ago")
- Date validation
- Daily reset detection

### 6.2 `validation.js`
- Form input validation
- Phone number format checking
- Required field checking
- Sanitize HTML to prevent XSS
- Custom validation rules

### 6.3 `helpers.js`
- Generate unique IDs
- HTML escaping
- Debounce/throttle functions
- DOM utilities (createElement, querySelector wrappers)
- Event delegation helpers

---

## 7. CSS Architecture

CSS files are loaded in a specific order to ensure proper cascading:

```
variables.css    → CSS custom properties (colors, fonts, spacing, breakpoints)
   ↓
reset.css        → Normalize/reset browser defaults
   ↓
layout.css       → App shell layout (sidebar, main content, header, nav)
   ↓
components.css   → Reusable component styles (cards, buttons, forms, modals, toasts)
   ↓
pages.css        → Page-specific styles
   ↓
animations.css   → Transitions, keyframe animations
   ↓
responsive.css   → Media queries for tablet and desktop
```

### CSS Custom Properties (variables.css):
```css
:root {
  /* Colors */
  --color-primary: #176B64;        /* Deep Teal */
  --color-primary-light: #8FAFA4;  /* Muted Sage */
  --color-bg: #F7F8F5;            /* Warm Off-White */
  --color-surface: #FFFFFF;        /* White */
  --color-text: #172C35;           /* Deep Navy */
  --color-text-secondary: #697B80; /* Muted Slate */
  --color-success: #2E8B62;        /* Success Green */
  --color-warning: #E7A33E;        /* Warm Amber */
  --color-danger: #D94343;         /* Emergency Red */

  /* Typography */
  --font-family: 'Inter', 'Manrope', 'DM Sans', system-ui, sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --line-height: 1.6;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(23, 44, 53, 0.06);
  --shadow-md: 0 4px 12px rgba(23, 44, 53, 0.08);
  --shadow-lg: 0 8px 24px rgba(23, 44, 53, 0.1);

  /* Breakpoints (for documentation, used in media queries) */
  /* Mobile: < 768px */
  /* Tablet: 768px - 1023px */
  /* Desktop: ≥ 1024px */

  /* Layout */
  --sidebar-width: 280px;
  --header-height: 64px;
  --bottom-nav-height: 72px;
}
```

### Responsive layout strategy:

**Mobile (< 768px)**:
- Single column layout
- Compact header with branding
- Bottom navigation bar (5 items)
- Full-width content area
- 2-column grid for feature cards
- SOS accessible via home grid + bottom nav

**Tablet (768px - 1023px)**:
- Single column, wider content
- Header with more detail
- Bottom navigation bar
- 3-column grid for feature cards
- Larger touch targets

**Desktop (≥ 1024px)**:
- Fixed left sidebar (280px) with full navigation
- Header spans content area only
- No bottom navigation
- Main content area with max-width constraint
- 3-4 column grid for feature cards
- SOS always visible in sidebar

---

## 8. New Feature Architecture

### 8.1 Music & Relaxation (`pages/music.js`)

**Architecture**:
```
music.js (page)
  → audioService.js (new service)
  → state.js (favorites, volume, last played)
  → storageService.js (persist preferences)
```

**Technical approach**:
- HTML5 `<audio>` element for playback
- AudioContext API for visualizations (optional)
- Predefined playlist data structure (JSON)
- Categories: Relaxation, Nature, Sleep, Favorites
- Controls: Play/Pause, Previous, Next, Volume slider, Progress bar
- LocalStorage keys: `carex_music_favorites`, `carex_music_volume`

**Audio file handling**:
- Audio files placed in `assets/audio/`
- Playlist defined in a JSON data structure
- Supports both local files and URLs (for future streaming)
- Graceful handling of missing/failed audio files

### 8.2 Voice Assistant (`pages/voiceAssistant.js`)

**Architecture**:
```
voiceAssistant.js (page + service)
  → Web Speech API (SpeechRecognition)
  → router.js (navigate on voice command)
  → music.js (play/pause on voice command)
```

**Technical approach**:
- `SpeechRecognition` API (or `webkitSpeechRecognition`)
- Command matching with fuzzy tolerance
- Visual feedback during listening (pulsing indicator)
- Text display of recognized speech
- Fallback: Manual text input for unsupported browsers

**Supported commands**:
| Command | Action |
|---------|--------|
| "Open Medicine" | Navigate to #/medicine |
| "Open Family" | Navigate to #/family |
| "Open Doctor" | Navigate to #/doctor |
| "Open Emergency" / "Open SOS" | Navigate to #/sos |
| "Open Daily Routine" | Navigate to #/routine |
| "Play Music" | Start music playback |
| "Pause Music" / "Stop Music" | Pause music playback |
| "Go Home" | Navigate to #/home |

**Browser support**:
- Chrome: Full support
- Edge: Full support
- Firefox: Partial (may need flag)
- Safari: Limited
- Unsupported: Show text input fallback + browser compatibility notice

**Safety**:
- Voice commands CANNOT make calls
- Voice commands CANNOT share location
- Voice commands CANNOT activate SOS (requires manual confirmation)
- Voice commands CANNOT access or read personal data aloud

---

## 9. Data Flow

```
User Action
  → Page event handler
  → Validation (validation.js)
  → State update (state.js)
  → Storage persistence (storageService.js)
  → UI re-render (page re-render)
  → Toast feedback (toast.js)
```

**Example: Adding a medicine**
```
1. User fills form and clicks "Set Reminder"
2. medicine.js: handleAddMedicine()
3. validation.js: validateMedicine(data) → validates name, dose, time
4. helpers.js: generateId() → creates unique ID
5. state.js: state.set('medicines', [...current, newMedicine])
6. storageService.js: save('carex_medicines', medicines)
7. medicine.js: render() → re-renders the page with new data
8. toast.js: show('Medicine added successfully', 'success')
9. reminderService.js: scheduleReminder(newMedicine)
```

---

## 10. Vercel Deployment

### Configuration

A `vercel.json` file will handle SPA routing:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

However, since we use hash-based routing (`#/page`), this is technically optional — hash changes don't trigger server requests. The rewrite is a safety net for direct URL access.

### Deployment steps:
1. Connect GitHub repository to Vercel
2. Set root directory to project root
3. No build command needed (static site)
4. Output directory: `.` (root)
5. Deploy

### No build tools required:
- ES6 modules loaded natively via `<script type="module">`
- CSS loaded via `<link>` tags
- No bundler, no transpiler, no build step
- Modern browsers support all features used

---

## 11. Future Backend Integration

The architecture is designed for optional FastAPI backend integration:

```
┌──────────────┐     ┌──────────────┐
│   Frontend   │ ←→  │   FastAPI    │
│  (Vercel)    │     │  (Backend)   │
│              │     │              │
│  apiService  │────→│  /api/meds   │
│  .js         │     │  /api/family │
│              │     │  /api/docs   │
│              │     │  /api/sync   │
└──────────────┘     └──────────────┘
```

**Integration strategy**:
1. `apiService.js` currently returns local data
2. When backend is ready, update `apiService.js` to make fetch calls
3. Implement offline-first: try API, fallback to local
4. Sync queue for offline operations
5. No frontend code changes needed outside `apiService.js`

---

## 12. File Dependency Graph

```
index.html
  └── app.js (type="module")
        ├── router.js
        ├── state.js
        │     └── services/storageService.js
        ├── services/reminderService.js
        │     ├── state.js
        │     └── services/notificationService.js
        ├── services/notificationService.js
        ├── services/locationService.js
        ├── services/apiService.js
        │     └── services/storageService.js
        ├── components/sidebar.js
        │     └── router.js
        ├── components/bottomNav.js
        │     └── router.js
        ├── components/header.js
        ├── components/modal.js
        ├── components/toast.js
        ├── components/card.js
        ├── pages/*.js
        │     ├── state.js
        │     ├── components/*.js
        │     └── utils/*.js
        └── utils/*.js
```
