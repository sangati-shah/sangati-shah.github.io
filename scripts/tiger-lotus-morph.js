(async function () {
  const wrapper = document.querySelector('.hero-morph');
  if (!wrapper) return;

  const VIEWBOX = '146 184 733 583';

  async function loadSvg(url, className) {
    const res = await fetch(url);
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    const svg = doc.documentElement;
    svg.setAttribute('viewBox', VIEWBOX);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.classList.add(className);

    svg.querySelectorAll('path').forEach((p) => {
      const fill = p.getAttribute('fill') || 'currentColor';
      p.setAttribute('pathLength', '1');
      p.setAttribute('stroke', fill);
      p.setAttribute('stroke-width', '1');
      p.setAttribute('stroke-linejoin', 'round');
      p.setAttribute('stroke-linecap', 'round');
    });

    return svg;
  }

  const [tiger, lotus] = await Promise.all([
    loadSvg('assets/tiger.svg', 'morph-tiger'),
    loadSvg('assets/lotus.svg', 'morph-lotus'),
  ]);

  wrapper.appendChild(tiger);
  wrapper.appendChild(lotus);

  const stage = wrapper.closest('.hero-morph-stage');
  const pin = wrapper.closest('.hero-pin');

  let ticking = false;
  function update() {
    ticking = false;
    if (!stage || !pin) return;
    const stageRect = stage.getBoundingClientRect();
    const pinH = pin.getBoundingClientRect().height;
    const stickRange = stageRect.height - pinH;
    if (stickRange <= 0) return;
    const stuckProgress = Math.max(0, Math.min(stickRange, -stageRect.top)) / stickRange;
    // Tiger holds for the first ~15%, morph plays across the next ~70%,
    // lotus holds for the final ~15%.
    let p = (stuckProgress - 0.15) / 0.7;
    if (!isFinite(p)) p = 0;
    p = Math.max(0, Math.min(1, p));
    wrapper.style.setProperty('--morph', p.toFixed(4));
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
