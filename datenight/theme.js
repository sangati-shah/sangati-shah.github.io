// ── Shared datenight theme system ──
// Sets CSS custom properties on :root so all styles can reference them.

const DN_THEMES = [
  {
    name: 'bloom',
    bg: '#fef0f5',
    text: '#2d6a4f',
    sub: '#c27a8e',
    accent: '#e85d75',
    headingFont: "'Dancing Script', cursive",
    btnBg: 'rgba(255,255,255,0.65)',
    btnBorder: '#e0a0b0',
    btnRadius: '50px',
    btnText: '#2d6a4f',
    inputBg: 'rgba(255,255,255,0.5)',
    inputBorder: '#e0a0b0',
    inputText: '#2d6a4f',
    homeBtnBg: 'rgba(255,255,255,0.65)',
    homeBtnBorder: '#e0a0b0',
  },
  {
    name: 'poster',
    bg: '#fffbe6',
    text: '#e65100',
    sub: '#c49000',
    accent: '#ff6d00',
    headingFont: "'Abril Fatface', serif",
    btnBg: '#ff6d00',
    btnBorder: '#e65100',
    btnRadius: '4px',
    btnText: '#fff',
    inputBg: 'rgba(255,255,255,0.6)',
    inputBorder: '#e65100',
    inputText: '#e65100',
    homeBtnBg: '#ff6d00',
    homeBtnBorder: '#e65100',
  },
  {
    name: 'neon',
    bg: '#111111',
    text: '#ffd600',
    sub: '#999',
    accent: '#ffd600',
    headingFont: "'Space Grotesk', sans-serif",
    btnBg: 'transparent',
    btnBorder: '#ffd600',
    btnRadius: '6px',
    btnText: '#ffd600',
    inputBg: 'rgba(255,255,255,0.05)',
    inputBorder: '#ffd600',
    inputText: '#ffd600',
    homeBtnBg: 'rgba(255,214,0,0.08)',
    homeBtnBorder: '#ffd600',
  },
  {
    name: 'earth',
    bg: '#f5f0e8',
    text: '#3e2723',
    sub: '#6d9b6e',
    accent: '#2e7d32',
    headingFont: "'Lora', serif",
    btnBg: 'rgba(255,255,255,0.55)',
    btnBorder: '#a1887f',
    btnRadius: '10px',
    btnText: '#3e2723',
    inputBg: 'rgba(255,255,255,0.4)',
    inputBorder: '#a1887f',
    inputText: '#3e2723',
    homeBtnBg: 'rgba(255,255,255,0.55)',
    homeBtnBorder: '#a1887f',
  },
  {
    name: 'sunset',
    bg: '#fff3e0',
    text: '#d84280',
    sub: '#ff8a65',
    accent: '#ff6d00',
    headingFont: "'Comfortaa', sans-serif",
    btnBg: 'rgba(255,255,255,0.5)',
    btnBorder: '#ffab91',
    btnRadius: '22px',
    btnText: '#d84280',
    inputBg: 'rgba(255,255,255,0.4)',
    inputBorder: '#ffab91',
    inputText: '#d84280',
    homeBtnBg: 'rgba(255,255,255,0.5)',
    homeBtnBorder: '#ffab91',
  },
];

let dnThemeIndex = parseInt(sessionStorage.getItem('datenight-theme') || '0');
if (dnThemeIndex >= DN_THEMES.length) dnThemeIndex = 0;

function dnApplyTheme(i) {
  const t = DN_THEMES[i];
  const r = document.documentElement;
  r.style.setProperty('--dn-bg', t.bg);
  r.style.setProperty('--dn-text', t.text);
  r.style.setProperty('--dn-sub', t.sub);
  r.style.setProperty('--dn-accent', t.accent);
  r.style.setProperty('--dn-heading-font', t.headingFont);
  r.style.setProperty('--dn-btn-bg', t.btnBg);
  r.style.setProperty('--dn-btn-border', t.btnBorder);
  r.style.setProperty('--dn-btn-radius', t.btnRadius);
  r.style.setProperty('--dn-btn-text', t.btnText);
  r.style.setProperty('--dn-input-bg', t.inputBg);
  r.style.setProperty('--dn-input-border', t.inputBorder);
  r.style.setProperty('--dn-input-text', t.inputText);
  r.style.setProperty('--dn-home-btn-bg', t.homeBtnBg);
  r.style.setProperty('--dn-home-btn-border', t.homeBtnBorder);
  // Also set body background directly for smooth transition
  document.body.style.background = t.bg;
}

function dnCycleTheme() {
  dnThemeIndex = (dnThemeIndex + 1) % DN_THEMES.length;
  sessionStorage.setItem('datenight-theme', dnThemeIndex);
  dnApplyTheme(dnThemeIndex);
}

// Apply theme and bind click handlers once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  dnApplyTheme(dnThemeIndex);
  document.querySelectorAll('[data-dn-cycle]').forEach(el => {
    el.addEventListener('click', dnCycleTheme);
  });
});
