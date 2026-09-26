/**
 * Desktop Sidebar Navigation Component.
 */

export const sidebarComponent = {
  render() {
    return `
      <div class="brand">
        <div class="brand-icon"><i data-lucide="heart-pulse"></i></div>
        <span>CAREX</span>
      </div>

      <nav class="sidebar-nav">
        <a href="#/home" class="nav-link"><i data-lucide="home"></i> Home</a>
        <a href="#/medicine" class="nav-link"><i data-lucide="pill"></i> Medicine</a>
        <a href="#/sos" class="nav-link nav-link-sos"><i data-lucide="alert-triangle"></i> Emergency SOS</a>
        <a href="#/family" class="nav-link"><i data-lucide="phone-call"></i> Family Contacts</a>
        <a href="#/doctor" class="nav-link"><i data-lucide="stethoscope"></i> Doctor Appts</a>
        <a href="#/checkin" class="nav-link"><i data-lucide="heart"></i> Daily Check-in</a>
        <a href="#/routine" class="nav-link"><i data-lucide="calendar"></i> Daily Routine</a>
        <a href="#/health-notes" class="nav-link"><i data-lucide="file-text"></i> Health Notes</a>
        <a href="#/special-care" class="nav-link"><i data-lucide="shield-alert"></i> Special Care</a>
        <a href="#/location" class="nav-link"><i data-lucide="map-pin"></i> Location Sharing</a>
        <a href="#/music" class="nav-link"><i data-lucide="music"></i> Nasheed & Relax</a>
        <a href="#/games" class="nav-link"><i data-lucide="gamepad-2"></i> Mini Games</a>
        <a href="#/voice" class="nav-link"><i data-lucide="mic"></i> Voice Assistant</a>
        <a href="#/settings" class="nav-link"><i data-lucide="settings"></i> Settings</a>
      </nav>
    `;
  },

  init() {
    const container = document.getElementById('sidebar-container');
    if (container) {
      container.innerHTML = this.render();
    }
  }
};
