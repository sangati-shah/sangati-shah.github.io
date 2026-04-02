// ── Shared HUD: character sprites + points in top corners ──
// Include this script + hud.css on any datenight page.

(function () {
  const DEFAULT_ME = { name: 'you', hair: '#1a1a1a', skin: '#c68642', shirt: '#e85d75', pants: '#3a3a5c' };
  const DEFAULT_PARTNER = { name: 'them', hair: '#4a3728', skin: '#f5cba7', shirt: '#4a7c9b', pants: '#1a1a2e' };

  let myChar = DEFAULT_ME;
  let partnerChar = DEFAULT_PARTNER;
  try { const s = JSON.parse(sessionStorage.getItem('my-character')); if (s) myChar = { ...DEFAULT_ME, ...s }; } catch {}
  try { const s = JSON.parse(sessionStorage.getItem('partner-character')); if (s) partnerChar = { ...DEFAULT_PARTNER, ...s }; } catch {}

  const pts = parseInt(sessionStorage.getItem('puzzle-points') || '0');

  function miniSprite(c) {
    return `
      <div class="hud-sprite">
        <div class="hud-hair" style="background:${c.hair}"></div>
        <div class="hud-face" style="background:${c.skin}"></div>
        <div class="hud-body" style="background:${c.shirt}"></div>
        <div class="hud-legs"><div class="hud-leg" style="background:${c.pants || '#3a3a5c'}"></div><div class="hud-leg" style="background:${c.pants || '#3a3a5c'}"></div></div>
      </div>`;
  }

  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = `
    <div class="hud-player hud-left">
      ${miniSprite(myChar)}
      <div class="hud-info">
        <div class="hud-name">${myChar.name || 'you'}</div>
        <div class="hud-pts" id="hud-pts-left">${pts} pts</div>
      </div>
    </div>
    <div class="hud-player hud-right" id="hud-partner-slot">
      ${miniSprite(partnerChar)}
      <div class="hud-info">
        <div class="hud-name">${partnerChar.name || 'them'}</div>
        <div class="hud-pts" id="hud-pts-right">${pts} pts</div>
      </div>
    </div>`;

  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(hud));

  // Expose updater so pages can refresh points
  window.hudUpdatePoints = function () {
    const p = parseInt(sessionStorage.getItem('puzzle-points') || '0');
    const l = document.getElementById('hud-pts-left');
    const r = document.getElementById('hud-pts-right');
    if (l) l.textContent = p + ' pts';
    if (r) r.textContent = p + ' pts';
  };

  // Expose partner updater (called when PeerJS receives partner character)
  window.hudUpdatePartner = function (charData) {
    sessionStorage.setItem('partner-character', JSON.stringify(charData));
    const slot = document.getElementById('hud-partner-slot');
    if (!slot) return;
    partnerChar = { ...DEFAULT_PARTNER, ...charData };
    slot.querySelector('.hud-sprite').outerHTML = miniSprite(partnerChar).trim();
    slot.querySelector('.hud-name').textContent = partnerChar.name || 'them';
  };
})();
