/**
 * Mobile Bottom Navigation Component.
 */

export const bottomNavComponent = {
  render() {
    return `
      <a href="#/home" class="bottom-nav-item">
        <i data-lucide="home"></i>
        <span>Home</span>
      </a>
      <a href="#/medicine" class="bottom-nav-item">
        <i data-lucide="pill"></i>
        <span>Medicine</span>
      </a>
      <a href="#/sos" class="bottom-nav-item" style="color: var(--color-danger);">
        <i data-lucide="alert-triangle"></i>
        <span>SOS</span>
      </a>
      <a href="#/family" class="bottom-nav-item">
        <i data-lucide="phone-call"></i>
        <span>Family</span>
      </a>
      <a href="#/settings" class="bottom-nav-item">
        <i data-lucide="menu"></i>
        <span>More</span>
      </a>
    `;
  },

  init() {
    const container = document.getElementById('bottom-nav-container');
    if (container) {
      container.innerHTML = this.render();
    }
  }
};
