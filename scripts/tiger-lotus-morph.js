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

  let ticking = false;
  function update() {
    ticking = false;
    const stage = wrapper.parentElement;
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();
    const wrapperH = wrapper.getBoundingClientRect().height;
    const stickRange = stageRect.height - wrapperH;
    if (stickRange <= 0) return;
    // While the sticky wrapper is pinned, -stageRect.top advances from 0 to stickRange.
    const stuckProgress = Math.max(0, Math.min(stickRange, -stageRect.top)) / stickRange;
    // Phase the animation: tiger visible for the first 25%, morph through
    // 25%-85%, lotus visible for the last 15%.
    let p = (stuckProgress - 0.25) / 0.6;
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
