/**
 * Client-Side SPA Hash Router with Multi-Language Reactive Re-render.
 */

import { refreshLucideIcons } from './utils/helpers.js';
import { subscribe } from './services/languageService.js';

let routes = {};
let currentCleanup = null;
let currentActiveRoute = 'home';

export const router = {
  register(routeMap) {
    routes = routeMap;
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.router = this;

    // When language changes, re-render the current route in new language
    subscribe(() => {
      this.handleRoute();
    });

    this.handleRoute();
  },

  navigate(path) {
    window.location.hash = `#/${path}`;
  },

  async handleRoute() {
    const hash = window.location.hash.slice(2) || 'home';
    const cleanRoute = hash.split('?')[0];
    currentActiveRoute = cleanRoute;

    const routeLoader = routes[cleanRoute] || routes['home'];
    if (!routeLoader) return;

    if (typeof currentCleanup === 'function') {
      try { currentCleanup(); } catch (e) { console.error(e); }
      currentCleanup = null;
    }

    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = `
        <div class="loading-spinner-container">
          <div class="loading-spinner"></div>
        </div>
      `;
    }

    try {
      const module = await routeLoader();
      if (main && module.render) {
        main.innerHTML = module.render();
        main.focus();
        window.scrollTo(0, 0);

        if (typeof module.init === 'function') {
          currentCleanup = module.init();
        }

        refreshLucideIcons();
        this.updateActiveNavLinks(cleanRoute);
      }
    } catch (e) {
      console.error(`Failed to load route: ${cleanRoute}`, e);
      if (main) {
        main.innerHTML = `
          <div class="card error-card">
            <h2>Error Loading Page</h2>
            <p>${e.message || 'Page could not be loaded.'}</p>
            <button class="btn btn-primary" onclick="location.hash='#/home'">Return Home</button>
          </div>
        `;
      }
    }
  },

  updateActiveNavLinks(activeRoute = currentActiveRoute) {
    document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
      const href = link.getAttribute('href') || '';
      const target = href.replace('#/', '');
      if (target === activeRoute) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
};
