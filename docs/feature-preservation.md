# CAREX — Feature Preservation Checklist

This document ensures all existing functionality is preserved during the application redesign.

## LocalStorage Data Migration Strategy

The redesigned application MUST be able to read existing LocalStorage data created by the original application. The following keys must be supported:

| Original Key | Data Format | New Key (Proposed) | Migration |
|---|---|---|---|
| `cxm` | JSON array of medicine objects | `carex_medicines` | Auto-migrate on first load |
| `cxf` | JSON array of family contacts | `carex_family` | Auto-migrate on first load |
| `cxd` | JSON array of doctor appointments | `carex_doctors` | Auto-migrate on first load |
| `cxnotes` | JSON array of health notes | `carex_healthNotes` | Auto-migrate on first load |
| `cxroutine` | JSON array of routine items | `carex_routine` | Auto-migrate on first load |
| `cxspecial` | JSON array of special care items | `carex_specialCare` | Auto-migrate on first load |
| `cxo` | String ('1'/'0') | `carex_checkin` | Auto-migrate on first load |
| `cxloc` | String ('1'/'0') | `carex_location` | Auto-migrate on first load |

### Migration strategy:
1. On application first load, check if new keys exist
2. If new keys don't exist but old keys do, migrate data
3. Enhance data structure (add `id`, `createdAt`, `updatedAt` fields)
4. Keep old keys intact for rollback capability
5. Set `carex_version` key to track data version

---

## Feature Preservation Table

### 1. Home Dashboard

| Aspect | Existing Functionality | Must Preserve | Planned Improvements |
|---|---|---|---|
| Grid layout | 2-column grid with 9 feature buttons | ✅ Yes — all 9 features must be accessible from home | Responsive grid (2-col mobile, 3-col tablet, sidebar+grid desktop). Add 2 new features (Music, Voice). Reorder for priority. |
| Today's Status | 4-row status display (Medicine, Doctor, Check-in, Location) | ✅ Yes — all 4 status indicators | Add more status items, time-based intelligence, color-coded urgency |
| Feature descriptions | Static feature cards (Safety, Connected, Private) | ✅ Yes — informational content | Redesign as onboarding or contextual tips |
| About section | Group member names, project description | ✅ Yes — about information | Move to Settings/About page |
| Navigation | Grid buttons navigate to each feature | ✅ Yes — all navigation paths | Add breadcrumbs, sidebar nav for desktop |

### 2. Medicine Reminder

| Aspect | Existing Functionality | Must Preserve | Planned Improvements |
|---|---|---|---|
| Add medicine | Form: name, dosage, time, frequency | ✅ Yes — all form fields | Add medicine type, notes, start/end date, refill tracking |
| Medicine list | Cards showing all medicines | ✅ Yes — display all saved medicines | Sortable, filterable list with search |
| Mark as taken | "✅ Taken" button per medicine | ✅ Yes — taken status tracking | Add timestamp, daily reset, history tracking |
| Postpone | "⏰ Later" button (currently demo-only alert) | ✅ Preserve button | Implement actual snooze with configurable delay |
| Data structure | `{name, dose, time, freq, taken}` | ✅ Yes — all existing fields | Add: `id`, `createdAt`, `updatedAt`, `takenAt`, `notes` |
| Persistence | LocalStorage key `cxm` | ✅ Yes — data must persist | Migrate to new key with enhanced structure |
| Reminders | Not implemented (UI suggests reminders) | ⚠️ Feature was promised but not built | Implement using Notification API and setInterval |

### 3. Emergency SOS

| Aspect | Existing Functionality | Must Preserve | Planned Improvements |
|---|---|---|---|
| SOS button | Large red circular button (225x225px) | ✅ Yes — prominent emergency button | Maintain large size, add pulsing animation, improve contrast |
| Confirmation | `confirm()` dialog before activation | ✅ Yes — prevent accidental activation | Replace with custom modal, add countdown timer |
| Emergency contact display | Shows first family contact | ✅ Yes — show emergency contact | Allow designating specific emergency contacts, show multiple |
| Demo disclaimer | Text noting no real call is made | ✅ Yes — keep disclaimer | Style as a subtle notice |
| SOS activation | Alert message on activation | ✅ Yes — feedback on activation | Custom notification, sound, vibration (if available) |
| Navigation to Family | Button to add contacts | ✅ Yes — link to family page | Inline emergency contact management |

### 4. Family Contact Management

| Aspect | Existing Functionality | Must Preserve | Planned Improvements |
|---|---|---|---|
| Add contact | Form: name, relationship, phone | ✅ Yes — all form fields | Add email, photo, notes, emergency designation |
| Contact list | Cards with name, relationship, phone | ✅ Yes — display all contacts | Alphabetical sorting, search, groups |
| Call button | "📞 Call (Demo)" with confirm/alert | ✅ Yes — call action per contact | Use `tel:` links for real phone integration on mobile |
| Data structure | `{name, rel, phone}` | ✅ Yes — all existing fields | Add: `id`, `email`, `isEmergency`, `photo`, `createdAt` |
| Persistence | LocalStorage key `cxf` | ✅ Yes — data must persist | Migrate to new key |

### 5. Doctor Appointments

| Aspect | Existing Functionality | Must Preserve | Planned Improvements |
|---|---|---|---|
| Add appointment | Form: doctor name, hospital, date, time, reason | ✅ Yes — all form fields | Add specialty, address, phone, recurring appointments |
| Appointment list | Cards showing all appointments | ✅ Yes — display all appointments | Sort by date, separate past/upcoming, calendar view |
| Data structure | `{name, hospital, date, time, reason}` | ✅ Yes — all existing fields | Add: `id`, `specialty`, `phone`, `address`, `status`, `createdAt` |
| Persistence | LocalStorage key `cxd` | ✅ Yes — data must persist | Migrate to new key |
| Defaults | Date: '25 September', Time: '10:30 AM' | ⚠️ Behavior preserved but improved | Use current date as default, require fields |

### 6. Daily Check-in

| Aspect | Existing Functionality | Must Preserve | Planned Improvements |
|---|---|---|---|
| Check-in button | Large "✅ I'M OK" button | ✅ Yes — simple one-tap check-in | Keep prominent, add mood scale option |
| Status display | Shows completed/pending | ✅ Yes — check-in status | Add timestamp, streak counter |
| Alert feedback | `alert('Check-in completed!')` | ✅ Yes — user feedback | Replace with toast notification |
| Data structure | Boolean `ok`, stored as '1'/'0' | ✅ Yes — basic check-in state | Enhance: `{checked: bool, timestamp, mood, note}` |
| Persistence | LocalStorage key `cxo` | ✅ Yes — data must persist | Migrate to new structure with history |
| Daily reset | Not implemented | ⚠️ Missing feature | Implement automatic daily reset at midnight |

### 7. Location Sharing

| Aspect | Existing Functionality | Must Preserve | Planned Improvements |
|---|---|---|---|
| Toggle sharing | ON/OFF buttons | ✅ Yes — toggle mechanism | Single toggle switch UI |
| Status display | Shows ON/OFF state | ✅ Yes — visual status | More detailed status with last shared time |
| Map placeholder | Styled div with text | ✅ Yes — map area | Integrate real map (OpenStreetMap or similar) |
| Disclaimer | "No real location sent" text | ✅ Yes — keep disclaimer | Style appropriately |
| Data structure | Boolean `locationShared`, stored as '1'/'0' | ✅ Yes — toggle state | Enhance with Geolocation API data when available |
| Persistence | LocalStorage key `cxloc` | ✅ Yes — data must persist | Migrate to new key |

### 8. Health Notes

| Aspect | Existing Functionality | Must Preserve | Planned Improvements |
|---|---|---|---|
| Add note | Form: title, body | ✅ Yes — note creation | Add categories, tags, date, attachments |
| Note list | Cards showing all notes | ✅ Yes — display all notes | Search, filter, sort by date |
| "Saved locally" badge | Visual indicator | ✅ Yes — privacy indicator | Consistent badge styling |
| Data structure | `{title, body}` | ✅ Yes — all existing fields | Add: `id`, `createdAt`, `updatedAt`, `category`, `tags` |
| Persistence | LocalStorage key `cxnotes` | ✅ Yes — data must persist | Migrate to new key |

### 9. Special Care

| Aspect | Existing Functionality | Must Preserve | Planned Improvements |
|---|---|---|---|
| Add care need | Form: care need name, instructions | ✅ Yes — care need creation | Add priority, category, assigned caregiver |
| Care list | Cards showing all care instructions | ✅ Yes — display all items | Categorized view, priority indicators |
| Data structure | `{name, body}` | ✅ Yes — all existing fields | Add: `id`, `priority`, `category`, `createdAt` |
| Persistence | LocalStorage key `cxspecial` | ✅ Yes — data must persist | Migrate to new key |

### 10. Daily Routine

| Aspect | Existing Functionality | Must Preserve | Planned Improvements |
|---|---|---|---|
| Add routine | Form: activity name, time | ✅ Yes — routine creation | Add days of week, duration, category, notes |
| Routine list | Cards showing all routine items | ✅ Yes — display all routines | Timeline view, sorted by time, completion tracking |
| "Daily routine" badge | Visual indicator | ✅ Yes — routine badge | Enhanced with time-based status |
| Data structure | `{name, time}` | ✅ Yes — all existing fields | Add: `id`, `days`, `duration`, `completed`, `createdAt` |
| Persistence | LocalStorage key `cxroutine` | ✅ Yes — data must persist | Migrate to new key |

---

## Cross-Cutting Concerns

| Concern | Current State | Must Preserve | Improvement |
|---|---|---|---|
| Data persistence | All data in LocalStorage | ✅ Yes | Add data versioning, export/import |
| Navigation | Bottom nav (5 items) + back buttons | ✅ Yes — all navigation paths | Sidebar (desktop), bottom nav (mobile), breadcrumbs |
| Feedback | `alert()` and `confirm()` dialogs | ✅ User feedback mechanism | Replace with toast notifications and custom modals |
| SOS accessibility | Available on home grid + could be in nav | ✅ Always accessible | Persistent SOS button on all screens |
| Page rendering | innerHTML replacement | ✅ Content updates | Modular page rendering with transitions |
| Emoji icons | Used throughout for features | ✅ Visual identification | Replace with professional Lucide icons |
| Privacy | All data local, disclaimers shown | ✅ Yes — local-only data | Maintain local-first, add encryption option |

---

## New Features (Phase 2-3)

These features will be ADDED and must NOT replace or conflict with existing features:

| New Feature | Description | Dependencies |
|---|---|---|
| Music & Relaxation | Audio player with playlists, nature sounds, favorites | HTML5 Audio API, new LocalStorage keys |
| Voice Assistant | Browser-based voice commands for navigation | Web Speech API, fallback UI |
| Settings Page | App configuration, data management, about | New LocalStorage keys |

---

## Verification Checklist

Before Phase 2 is considered complete, verify:

- [ ] All 10 original features are accessible and functional
- [ ] Existing LocalStorage data is migrated correctly
- [ ] No existing data is lost during migration
- [ ] All CRUD operations work (add at minimum, delete/edit as improvements)
- [ ] Navigation to all features works from home page
- [ ] Bottom navigation provides access to key features
- [ ] SOS is accessible from all screens
- [ ] All demo disclaimers are preserved
- [ ] Today's Status section reflects real data
- [ ] About section content is preserved (can be relocated)
