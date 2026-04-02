// ── Shared datenight theme system ──
// Sets CSS custom properties on :root so all styles can reference them.
// Cycling triggers an ink-blot expansion from the click point + particle burst.

const DN_THEMES = [
  {
    name: 'ghibli',
    bg: '#f7f2e7',
    text: '#3a5743',
    sub: '#9bb5a0',
    accent: '#c25b56',
    headingFont: "'Quicksand', sans-serif",
    btnBg: 'rgba(255,252,245,0.7)',
    btnBorder: '#c2b8a3',
    btnRadius: '14px',
    btnText: '#3a5743',
    inputBg: 'rgba(255,252,245,0.5)',
    inputBorder: '#c2b8a3',
    inputText: '#3a5743',
    homeBtnBg: 'rgba(255,252,245,0.7)',
    homeBtnBorder: '#c2b8a3',
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

  // Bounce the title
  const titleEl = e.currentTarget;
  titleEl.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
  titleEl.style.transform = 'scale(1.15) rotate(-2deg)';
  setTimeout(() => {
    titleEl.style.transform = 'scale(1.04) rotate(1deg)';
    setTimeout(() => { titleEl.style.transform = ''; }, 120);
  }, 150);

  // Flash overlay — all themes get a fast flash, tinted per theme
  const flash = document.createElement('div');
  const flashBase = `position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99998;pointer-events:none;opacity:1;`;

  switch (next.name) {
    case 'ghibli':
      flash.style.cssText = flashBase + `background:${next.sub};`;
      break;
    case 'poster':
      flash.style.cssText = flashBase + `background:${next.accent};`;
      break;
    case 'neon':
      flash.style.cssText = flashBase + `background:#fff;`;
      break;
    case 'earth':
      flash.style.cssText = flashBase + `background:${next.sub};`;
      break;
    case 'sunset':
      flash.style.cssText = flashBase + `background:linear-gradient(135deg, ${next.text}, ${next.accent});`;
      break;
    default:
      flash.style.cssText = flashBase + `background:#fff;`;
  }

  document.body.appendChild(flash);

  // Apply theme immediately behind the flash
  dnThemeIndex = nextIndex;
  sessionStorage.setItem('datenight-theme', dnThemeIndex);
  dnApplyTheme(dnThemeIndex);

  // Fade the flash out fast
  requestAnimationFrame(() => {
    flash.style.transition = 'opacity 0.15s ease-out';
    flash.style.opacity = '0';
  });

  // Burst particles from click
  dnSpawnParticles(x, y, next);

  setTimeout(() => {
    flash.remove();
    dnTransitioning = false;
  }, 180);
}

// ── Particle burst ──
// Each theme gets a totally different burst effect:
// ghibli → floating soot sprites that drift upward and fade
// poster → text characters (!, *, #, ~) that scatter and spin
// neon → electric lines/bolts that crackle from click point
// earth → falling leaf shapes with gravity + wind drift
// sunset → radial sun rays that shoot outward and fade

function dnSpawnParticles(x, y, theme) {
  switch (theme.name) {
    case 'ghibli': return dnBurstSootSprites(x, y, theme);
    case 'poster': return dnBurstChars(x, y, theme);
    case 'neon': return dnBurstBolts(x, y, theme);
    case 'earth': return dnBurstLeaves(x, y, theme);
    case 'sunset': return dnBurstRays(x, y, theme);
    default: return dnBurstRing(x, y, theme);
  }
}

// ghibli — floating soot sprites that drift upward like kodama
function dnBurstSootSprites(x, y, theme) {
  const count = 16;
  for (let i = 0; i < count; i++) {
    const sprite = document.createElement('div');
    const size = 6 + Math.random() * 10;
    const isLarge = Math.random() > 0.6;
    const finalSize = isLarge ? size * 1.4 : size;
    // Soot sprites are dark fuzzy circles with tiny white eyes
    sprite.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      width:${finalSize}px; height:${finalSize}px;
      background:radial-gradient(circle, #2a2a2a 40%, #1a1a1a 70%, transparent 100%);
      border-radius:50%;
      pointer-events:none; z-index:99999; opacity:0.85;
      transform:translate(-50%,-50%) scale(0);
      will-change:transform,opacity,left,top;
    `;
    // Add tiny white eyes to some sprites
    if (isLarge) {
      const eyeSize = Math.max(2, finalSize * 0.15);
      const eyeGap = finalSize * 0.22;
      sprite.innerHTML = `<div style="position:absolute;top:35%;left:50%;transform:translateX(-50%);display:flex;gap:${eyeGap}px">
        <div style="width:${eyeSize}px;height:${eyeSize}px;background:#fff;border-radius:50%"></div>
        <div style="width:${eyeSize}px;height:${eyeSize}px;background:#fff;border-radius:50%"></div>
      </div>`;
    }
    document.body.appendChild(sprite);

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
    const spreadX = Math.cos(angle) * (40 + Math.random() * 60);
    const driftY = -(60 + Math.random() * 100); // float upward
    const wobble = (Math.random() - 0.5) * 40;
    const dur = 700 + Math.random() * 500;
    const delay = Math.random() * 120;

    setTimeout(() => {
      sprite.style.transition = `left ${dur}ms ease-out, top ${dur}ms ease-out, transform ${dur * 0.3}ms cubic-bezier(0.22,1,0.36,1), opacity ${dur}ms ease-in`;
      sprite.style.left = (x + spreadX + wobble) + 'px';
      sprite.style.top = (y + driftY) + 'px';
      sprite.style.transform = 'translate(-50%,-50%) scale(1)';
    }, delay);
    // Fade out in second half
    setTimeout(() => {
      sprite.style.opacity = '0';
    }, delay + dur * 0.5);
    setTimeout(() => sprite.remove(), delay + dur + 50);
  }
}

// bloom — expanding ring of soft dots (used as default fallback)
function dnBurstRing(x, y, theme) {
  const count = 20;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    const angle = (Math.PI * 2 * i) / count;
    const size = 4 + Math.random() * 6;
    dot.style.cssText = `
      position:fixed; left:${x}px; top:${y}px; width:${size}px; height:${size}px;
      background:${theme.accent}; border-radius:50%;
      box-shadow: 0 0 ${size * 2}px ${theme.accent}88;
      pointer-events:none; z-index:99999; opacity:1;
      transform:translate(-50%,-50%) scale(0);
      will-change:transform,opacity;
    `;
    document.body.appendChild(dot);
    const dist = 60 + Math.random() * 80;
    const dx = x + Math.cos(angle) * dist;
    const dy = y + Math.sin(angle) * dist;
    const dur = 300 + Math.random() * 200;
    // Stagger: ring expands in a wave
    const delay = (i / count) * 80;
    setTimeout(() => {
      dot.style.transition = `all ${dur}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      dot.style.left = dx + 'px';
      dot.style.top = dy + 'px';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
      dot.style.opacity = '0';
    }, delay);
    setTimeout(() => dot.remove(), delay + dur + 20);
  }
}

// poster — scattered text characters
function dnBurstChars(x, y, theme) {
  const chars = ['!', '*', '#', '~', '+', '&', '?', '%'];
  const count = 14;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const ch = chars[Math.floor(Math.random() * chars.length)];
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const dist = 50 + Math.random() * 100;
    const spin = -180 + Math.random() * 360;
    const size = 14 + Math.random() * 12;
    el.textContent = ch;
    el.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      font-family:'Abril Fatface',serif; font-size:${size}px; font-weight:700;
      color:${Math.random() > 0.5 ? theme.accent : theme.text};
      pointer-events:none; z-index:99999; opacity:1;
      transform:translate(-50%,-50%) rotate(0deg) scale(1);
      will-change:transform,opacity;
    `;
    document.body.appendChild(el);
    const dur = 350 + Math.random() * 250;
    requestAnimationFrame(() => {
      el.style.transition = `all ${dur}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      el.style.left = (x + Math.cos(angle) * dist) + 'px';
      el.style.top = (y + Math.sin(angle) * dist) + 'px';
      el.style.transform = `translate(-50%,-50%) rotate(${spin}deg) scale(0.3)`;
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), dur + 50);
  }
}

// neon — electric bolt lines that crackle outward
function dnBurstBolts(x, y, theme) {
  const count = 10;
  for (let i = 0; i < count; i++) {
    const bolt = document.createElement('div');
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const len = 30 + Math.random() * 50;
    const thick = 1.5 + Math.random() * 1.5;
    bolt.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      width:${len}px; height:${thick}px;
      background:${theme.accent};
      box-shadow: 0 0 8px ${theme.accent}, 0 0 20px ${theme.accent}88;
      pointer-events:none; z-index:99999; opacity:1;
      transform-origin:0 50%;
      transform:rotate(${angle * 180 / Math.PI}deg) scaleX(0);
      will-change:transform,opacity;
    `;
    document.body.appendChild(bolt);
    const dur = 150 + Math.random() * 100;
    requestAnimationFrame(() => {
      bolt.style.transition = `transform ${dur}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${dur + 100}ms ease-out`;
      bolt.style.transform = `rotate(${angle * 180 / Math.PI}deg) scaleX(1)`;
    });
    setTimeout(() => {
      bolt.style.opacity = '0';
    }, dur);
    setTimeout(() => bolt.remove(), dur + 150);

    // Add a zigzag fork on some bolts
    if (Math.random() > 0.5) {
      const fork = document.createElement('div');
      const forkAngle = angle + (Math.random() > 0.5 ? 0.4 : -0.4);
      const forkLen = 15 + Math.random() * 20;
      fork.style.cssText = `
        position:fixed; left:${x + Math.cos(angle) * len * 0.6}px; top:${y + Math.sin(angle) * len * 0.6}px;
        width:${forkLen}px; height:${thick * 0.8}px;
        background:${theme.accent};
        box-shadow: 0 0 6px ${theme.accent};
        pointer-events:none; z-index:99999; opacity:1;
        transform-origin:0 50%;
        transform:rotate(${forkAngle * 180 / Math.PI}deg) scaleX(0);
        will-change:transform,opacity;
      `;
      document.body.appendChild(fork);
      setTimeout(() => {
        fork.style.transition = `transform ${dur * 0.7}ms ease-out, opacity ${dur}ms ease-out`;
        fork.style.transform = `rotate(${forkAngle * 180 / Math.PI}deg) scaleX(1)`;
      }, dur * 0.3);
      setTimeout(() => { fork.style.opacity = '0'; }, dur + 50);
      setTimeout(() => fork.remove(), dur + 200);
    }
  }
}

// earth — leaf shapes that fall with gravity and drift
function dnBurstLeaves(x, y, theme) {
  const count = 12;
  for (let i = 0; i < count; i++) {
    const leaf = document.createElement('div');
    const size = 8 + Math.random() * 8;
    const colors = [theme.accent, theme.sub, '#8d6e3f', '#a0c060'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    leaf.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      width:${size}px; height:${size * 1.4}px;
      background:${color};
      border-radius: 2px 50% 50% 50%;
      pointer-events:none; z-index:99999; opacity:0.9;
      transform:translate(-50%,-50%) rotate(${Math.random() * 360}deg) scale(0.5);
      will-change:transform,opacity,left,top;
    `;
    document.body.appendChild(leaf);
    // Scatter upward first, then gravity pulls down
    const spreadX = (Math.random() - 0.5) * 160;
    const peakY = -40 - Math.random() * 60;
    const dur = 600 + Math.random() * 400;
    const spin = Math.random() * 720 - 360;
    // Phase 1: burst up and out
    requestAnimationFrame(() => {
      leaf.style.transition = `left ${dur * 0.4}ms ease-out, top ${dur * 0.4}ms ease-out, transform ${dur}ms ease-out, opacity ${dur}ms ease-out`;
      leaf.style.left = (x + spreadX * 0.6) + 'px';
      leaf.style.top = (y + peakY) + 'px';
      leaf.style.transform = `translate(-50%,-50%) rotate(${spin * 0.3}deg) scale(1)`;
    });
    // Phase 2: drift down with wind
    setTimeout(() => {
      leaf.style.transition = `left ${dur * 0.6}ms ease-in, top ${dur * 0.6}ms ease-in, transform ${dur * 0.6}ms linear, opacity ${dur * 0.6}ms ease-in`;
      leaf.style.left = (x + spreadX) + 'px';
      leaf.style.top = (y + 80 + Math.random() * 60) + 'px';
      leaf.style.transform = `translate(-50%,-50%) rotate(${spin}deg) scale(0.3)`;
      leaf.style.opacity = '0';
    }, dur * 0.4);
    setTimeout(() => leaf.remove(), dur + 50);
  }
}

// sunset — sun ray lines that shoot outward from click point
function dnBurstRays(x, y, theme) {
  const count = 14;
  for (let i = 0; i < count; i++) {
    const ray = document.createElement('div');
    const angle = (Math.PI * 2 * i) / count;
    const len = 50 + Math.random() * 80;
    const thick = 2 + Math.random() * 3;
    const colors = [theme.text, theme.accent, theme.sub];
    const color = colors[Math.floor(Math.random() * colors.length)];
    ray.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      width:0px; height:${thick}px;
      background:linear-gradient(to right, ${color}, transparent);
      border-radius:${thick}px;
      pointer-events:none; z-index:99999; opacity:0.8;
      transform-origin:0 50%;
      transform:rotate(${angle * 180 / Math.PI}deg);
      will-change:width,opacity;
    `;
    document.body.appendChild(ray);
    const dur = 250 + Math.random() * 200;
    const delay = (i / count) * 60;
    setTimeout(() => {
      ray.style.transition = `width ${dur}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${dur + 100}ms ease-out`;
      ray.style.width = len + 'px';
    }, delay);
    setTimeout(() => {
      ray.style.opacity = '0';
    }, delay + dur * 0.6);
    setTimeout(() => ray.remove(), delay + dur + 150);
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
