// ── Shared datenight theme system ──
// Sets CSS custom properties on :root so all styles can reference them.
// Cycling triggers an ink-blot expansion from the click point + particle burst.

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
let dnTransitioning = false;

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
  document.body.style.background = t.bg;
  // Update room-gate bg if it exists
  const gate = document.querySelector('.room-gate');
  if (gate) gate.style.background = t.bg;
}

// ── Ink blot transition ──
// A circle of the new theme's color explodes outward from wherever you clicked,
// swallowing the old theme whole. Particles scatter like confetti from the point
// of impact, shaped to match the new theme's personality.

function dnCycleTheme(e) {
  if (dnTransitioning) return;
  dnTransitioning = true;

  const nextIndex = (dnThemeIndex + 1) % DN_THEMES.length;
  const next = DN_THEMES[nextIndex];
  const x = e.clientX;
  const y = e.clientY;

  // Calculate the max radius needed to cover the entire viewport from click point
  const maxX = Math.max(x, window.innerWidth - x);
  const maxY = Math.max(y, window.innerHeight - y);
  const maxRadius = Math.sqrt(maxX * maxX + maxY * maxY);

  // Create the ink blot overlay
  const blot = document.createElement('div');
  blot.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: 99998; pointer-events: none;
    background: ${next.bg};
    clip-path: circle(0px at ${x}px ${y}px);
    will-change: clip-path;
  `;

  // For the neon theme, add a glow halo around the expanding edge
  if (next.name === 'neon') {
    blot.style.boxShadow = `inset 0 0 80px ${next.accent}44, inset 0 0 200px ${next.accent}22`;
  }

  document.body.appendChild(blot);

  // Burst particles from the click point
  dnSpawnParticles(x, y, next);

  // Bounce the title
  const titleEl = e.currentTarget;
  titleEl.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  titleEl.style.transform = 'scale(1.12) rotate(-2deg)';
  setTimeout(() => {
    titleEl.style.transform = 'scale(1.05) rotate(1deg)';
    setTimeout(() => {
      titleEl.style.transform = '';
    }, 200);
  }, 250);

  // Animate the blot expansion
  requestAnimationFrame(() => {
    blot.style.transition = 'clip-path 0.7s cubic-bezier(0.4, 0, 0.15, 1)';
    blot.style.clipPath = `circle(${maxRadius}px at ${x}px ${y}px)`;
  });

  // Apply the real theme vars midway through (under the blot)
  setTimeout(() => {
    dnThemeIndex = nextIndex;
    sessionStorage.setItem('datenight-theme', dnThemeIndex);
    dnApplyTheme(dnThemeIndex);
  }, 350);

  // Dissolve the blot away
  setTimeout(() => {
    blot.style.transition = 'opacity 0.5s ease';
    blot.style.opacity = '0';
    setTimeout(() => {
      blot.remove();
      dnTransitioning = false;
    }, 500);
  }, 700);
}

// ── Particle burst ──
// Each theme gets its own particle personality:
// bloom → soft petals that flutter
// poster → chunky confetti squares that tumble
// neon → glowing sparks that streak
// earth → organic spores that drift
// sunset → warm embers that float up

function dnSpawnParticles(x, y, theme) {
  const count = 16;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
    const distance = 70 + Math.random() * 120;
    const duration = 600 + Math.random() * 500;
    const size = 5 + Math.random() * 8;

    // Base styles
    let css = `
      position: fixed; left: ${x}px; top: ${y}px;
      pointer-events: none; z-index: 99999;
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
      will-change: transform, opacity, left, top;
    `;

    // Theme-specific particle shapes
    switch (theme.name) {
      case 'bloom':
        // Soft petal circles with a blush glow
        css += `
          width: ${size}px; height: ${size * 1.3}px;
          background: ${theme.accent};
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          box-shadow: 0 0 ${size}px ${theme.accent}66;
        `;
        break;
      case 'poster':
        // Chunky confetti rectangles that rotate
        const w = size * 0.7;
        const h = size * 1.4;
        css += `
          width: ${w}px; height: ${h}px;
          background: ${Math.random() > 0.5 ? theme.accent : theme.text};
          border-radius: 1px;
        `;
        break;
      case 'neon':
        // Glowing sparks — tiny but bright with long trails
        const sparkSize = 3 + Math.random() * 4;
        css += `
          width: ${sparkSize}px; height: ${sparkSize}px;
          background: ${theme.accent};
          border-radius: 50%;
          box-shadow: 0 0 ${sparkSize * 2}px ${theme.accent},
                      0 0 ${sparkSize * 4}px ${theme.accent}88,
                      0 0 ${sparkSize * 6}px ${theme.accent}44;
        `;
        break;
      case 'earth':
        // Organic spores — irregular soft blobs
        const r1 = 40 + Math.random() * 20;
        const r2 = 40 + Math.random() * 20;
        const r3 = 40 + Math.random() * 20;
        const r4 = 40 + Math.random() * 20;
        css += `
          width: ${size}px; height: ${size}px;
          background: ${Math.random() > 0.4 ? theme.accent : theme.sub};
          border-radius: ${r1}% ${r2}% ${r3}% ${r4}%;
          opacity: 0.8;
        `;
        break;
      case 'sunset':
        // Warm embers — circles with gradient glow, drift upward
        css += `
          width: ${size}px; height: ${size}px;
          background: radial-gradient(circle, ${theme.text}, ${theme.accent});
          border-radius: 50%;
          box-shadow: 0 0 ${size}px ${theme.accent}55;
        `;
        break;
    }

    p.style.cssText = css;
    document.body.appendChild(p);

    // Animate outward
    const destX = x + Math.cos(angle) * distance;
    // Sunset embers float up, others scatter normally
    const yBias = theme.name === 'sunset' ? -Math.abs(Math.sin(angle)) * distance * 0.7 : Math.sin(angle) * distance;
    const destY = y + yBias;

    // Poster confetti tumbles with extra rotation
    const rotation = theme.name === 'poster' ? `rotate(${180 + Math.random() * 360}deg)` : '';

    requestAnimationFrame(() => {
      p.style.transition = `left ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                            top ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                            opacity ${duration}ms ease-out,
                            transform ${duration}ms ease-out`;
      p.style.left = destX + 'px';
      p.style.top = destY + 'px';
      p.style.opacity = '0';
      p.style.transform = `translate(-50%, -50%) scale(0.2) ${rotation}`;
    });

    setTimeout(() => p.remove(), duration + 50);
  }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  dnApplyTheme(dnThemeIndex);

  // Inject smooth transition styles for themed elements
  // (only kicks in AFTER first paint so the initial load doesn't animate)
  requestAnimationFrame(() => {
    const style = document.createElement('style');
    style.textContent = `
      .room-title, .home-title, .games-title, .art-title,
      .room-hint, .home-sub, .games-sub, .art-sub,
      .room-btn, .home-btn, .game-tab, .reset-btn, .art-btn,
      .room-code-input, .guess-input, .back-btn, .btn-label,
      .room-share-code, .room-status, .room-info, .partner-label,
      .jar-prompt, .guess-label, .reveal-label, .room-share-text,
      .room-copied, .loading, .game-status, .ttt-cell, .c4-cell {
        transition: color 0.5s ease, background 0.5s ease,
                    border-color 0.5s ease, border-radius 0.5s ease,
                    box-shadow 0.5s ease;
      }
    `;
    document.head.appendChild(style);
  });

  document.querySelectorAll('[data-dn-cycle]').forEach(el => {
    el.addEventListener('click', dnCycleTheme);
  });
});
