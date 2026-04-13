// ── Theme Engine ──
// Handles AI theme generation, CSS variable application, font loading,
// particle system integration, and theme transitions.

const WORKER_URL = 'https://sangati-theme-proxy.workers.dev/api/theme';

const CSS_VAR_MAP = {
  bg:        '--ghibli-bg',
  text:      '--ghibli-text',
  sub:       '--ghibli-sub',
  accent:    '--ghibli-accent',
  btnBg:     '--ghibli-btn-bg',
  btnBorder: '--ghibli-btn-border',
  btnText:   '--ghibli-btn-text',
  linkColor: '--ghibli-link',
  linkHover: '--ghibli-link-hover',
};

const GHIBLI_DEFAULTS = {
  colors: {
    bg: '#f7f2e7',
    text: '#3a5743',
    sub: '#9bb5a0',
    accent: '#c25b56',
    btnBg: 'rgba(255,252,245,0.7)',
    btnBorder: '#c2b8a3',
    btnText: '#3a5743',
    linkColor: '#c25b56',
    linkHover: '#3a5743',
  },
  fonts: {
    heading: 'Quicksand',
    body: 'Nunito',
  },
  particles: { ...DEFAULT_PARTICLE_CONFIG },
};

class ThemeEngine {
  constructor(particleSystem) {
    this.ps = particleSystem;
    this.isCustomTheme = false;
  }

  async generateTheme(model, prompt) {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt }),
    });

    if (!res.ok) {
      let msg = `Server error (${res.status})`;
      try {
        const errBody = await res.json();
        if (errBody.error) msg = errBody.error;
      } catch {
        // fallback to generic message
      }
      throw new Error(msg);
    }

    const theme = await res.json();
    this.applyTheme(theme);
    return theme;
  }

  applyTheme(theme) {
    if (theme.colors) this._applyColors(theme.colors);
    if (theme.fonts) this._applyFonts(theme.fonts);
    if (theme.particles) this._applyParticles(theme.particles);
    this.isCustomTheme = true;

    // show reset button
    const resetBtn = document.getElementById('reset-theme');
    if (resetBtn) resetBtn.hidden = false;
  }

  _applyColors(colors) {
    const root = document.documentElement;
    for (const [key, varName] of Object.entries(CSS_VAR_MAP)) {
      if (colors[key]) {
        root.style.setProperty(varName, colors[key]);
      }
    }
    // also update body::before watercolor wash opacity to 0 when custom theme
    // (the canvas backgroundGradient takes over)
  }

  async _applyFonts(fonts) {
    const families = [fonts.heading, fonts.body].filter(Boolean);
    const unique = [...new Set(families)];
    if (unique.length === 0) return;

    const params = unique.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700`).join('&');
    const url = `https://fonts.googleapis.com/css2?${params}&display=swap`;

    // skip if already loaded
    if (document.querySelector(`link[href="${url}"]`)) {
      this._setFontVars(fonts);
      return;
    }

    // load with 2s timeout
    try {
      await new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
        setTimeout(reject, 2000);
      });
      this._setFontVars(fonts);
    } catch {
      // font failed to load -- keep current fonts
      console.warn('Failed to load theme fonts, keeping current fonts');
    }
  }

  _setFontVars(fonts) {
    const root = document.documentElement;
    if (fonts.heading) {
      root.style.setProperty('--heading-font', `'${fonts.heading}', sans-serif`);
    }
    if (fonts.body) {
      root.style.setProperty('--body-font', `'${fonts.body}', sans-serif`);
    }
  }

  _applyParticles(particleConfig) {
    if (!this.ps) return;
    this.ps.transitionTo(particleConfig, 600);
  }

  resetToDefault() {
    // restore CSS variables
    const root = document.documentElement;
    for (const [key, varName] of Object.entries(CSS_VAR_MAP)) {
      root.style.removeProperty(varName);
    }
    root.style.removeProperty('--heading-font');
    root.style.removeProperty('--body-font');

    // restore particles
    if (this.ps) {
      this.ps.transitionTo({ ...DEFAULT_PARTICLE_CONFIG }, 600);
    }

    this.isCustomTheme = false;
    const resetBtn = document.getElementById('reset-theme');
    if (resetBtn) resetBtn.hidden = true;
  }
}

window.ThemeEngine = ThemeEngine;
