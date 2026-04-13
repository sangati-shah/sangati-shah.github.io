// ── Canvas Particle System ──
// Configurable via JSON. Supports multiple behaviors, shapes, mouse interaction,
// and smooth transitions between configs (for AI theme changes).

const DEFAULT_PARTICLE_CONFIG = {
  count: 40,
  color: '#9bb5a0',
  opacity: 0.3,
  minSize: 2,
  maxSize: 6,
  shape: 'circle',
  behavior: 'drift',
  speed: 0.5,
  wind: { x: 0.1, y: -0.05 },
  connections: false,
  connectionDistance: 120,
  connectionColor: '#9bb5a0',
  connectionOpacity: 0.1,
  mouseInteraction: 'repel',
  mouseRadius: 100,
  backgroundGradient: null,
};

class ParticleSystem {
  constructor(canvasId, config) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.config = { ...DEFAULT_PARTICLE_CONFIG, ...config };
    this.particles = [];
    this.mouse = { x: -9999, y: -9999 };
    this.animId = null;
    this.lastTime = 0;
    this._transition = null;

    this._onResize = () => this.resize();
    this._onMouse = (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; };
    this._onMouseLeave = () => { this.mouse.x = -9999; this.mouse.y = -9999; };

    window.addEventListener('resize', this._onResize);
    window.addEventListener('mousemove', this._onMouse);
    document.addEventListener('mouseleave', this._onMouseLeave);

    this.resize();
    this.init();
    this.start();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const c = this.config;
    for (let i = 0; i < c.count; i++) {
      this.particles.push(this._createParticle());
    }
  }

  _createParticle(fadeIn) {
    const c = this.config;
    const colors = Array.isArray(c.color) ? c.color : [c.color];
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: c.minSize + Math.random() * (c.maxSize - c.minSize),
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: fadeIn ? 0 : c.opacity * (0.5 + Math.random() * 0.5),
      targetOpacity: c.opacity * (0.5 + Math.random() * 0.5),
      vx: (Math.random() - 0.5) * c.speed,
      vy: (Math.random() - 0.5) * c.speed,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.02,
      phase: Math.random() * Math.PI * 2,
      life: 1,
    };
  }

  start() {
    this.lastTime = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - this.lastTime) / 16.667, 3); // normalize to ~60fps, cap at 3x
      this.lastTime = now;
      if (this._transition) this._tickTransition(now);
      this.update(dt);
      this.draw();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.animId = null;
  }

  // ── Update ──
  update(dt) {
    const c = this.config;
    const w = this.canvas.width;
    const h = this.canvas.height;

    for (const p of this.particles) {
      // fade in new particles
      if (p.opacity < p.targetOpacity) {
        p.opacity = Math.min(p.opacity + 0.005 * dt, p.targetOpacity);
      }

      // fade out dying particles
      if (p.life < 1) {
        p.life -= 0.02 * dt;
        p.opacity = p.targetOpacity * Math.max(0, p.life);
      }

      // behavior
      const [bx, by] = this._behavior(p, dt);
      p.vx += bx * dt;
      p.vy += by * dt;

      // wind
      p.vx += (c.wind.x || 0) * 0.01 * dt;
      p.vy += (c.wind.y || 0) * 0.01 * dt;

      // damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      // mouse
      this._applyMouseForce(p, dt);

      // move
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.angle += p.angleSpeed * dt;
      p.phase += 0.01 * dt;

      // wrap
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;
    }

    // remove dead particles
    this.particles = this.particles.filter(p => p.life > 0);
  }

  _behavior(p, dt) {
    const c = this.config;
    switch (c.behavior) {
      case 'drift':
        return [0, -0.003 * c.speed];
      case 'float':
        return [Math.sin(p.phase) * 0.002, Math.cos(p.phase * 0.7) * 0.002];
      case 'orbit': {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        return [
          (-dy / dist) * 0.005 * c.speed,
          (dx / dist) * 0.005 * c.speed,
        ];
      }
      case 'bounce': {
        const w = this.canvas.width;
        const h = this.canvas.height;
        let bx = 0, by = 0;
        if (p.x <= p.size || p.x >= w - p.size) { p.vx *= -0.8; bx = p.x <= p.size ? 0.01 : -0.01; }
        if (p.y <= p.size || p.y >= h - p.size) { p.vy *= -0.8; by = p.y <= p.size ? 0.01 : -0.01; }
        return [bx, by];
      }
      case 'rain':
        return [0, 0.02 * c.speed];
      case 'swirl': {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const pull = 0.001 * c.speed;
        return [
          (-dy / dist) * 0.006 * c.speed - (dx / dist) * pull,
          (dx / dist) * 0.006 * c.speed - (dy / dist) * pull,
        ];
      }
      case 'firefly':
        return [
          Math.sin(p.phase * 2) * 0.004 * c.speed,
          Math.cos(p.phase * 1.3) * 0.004 * c.speed,
        ];
      default:
        return [0, 0];
    }
  }

  _applyMouseForce(p, dt) {
    const c = this.config;
    if (c.mouseInteraction === 'none') return;
    const dx = p.x - this.mouse.x;
    const dy = p.y - this.mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > c.mouseRadius || dist < 1) return;

    const force = (1 - dist / c.mouseRadius) * 0.03 * dt;
    const nx = dx / dist;
    const ny = dy / dist;

    switch (c.mouseInteraction) {
      case 'repel':
        p.vx += nx * force;
        p.vy += ny * force;
        break;
      case 'attract':
        p.vx -= nx * force;
        p.vy -= ny * force;
        break;
      case 'glow':
        p.opacity = Math.min(p.targetOpacity * 2, p.opacity + 0.02 * dt);
        break;
    }
  }

  // ── Draw ──
  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const c = this.config;

    ctx.clearRect(0, 0, w, h);

    // background gradient
    if (c.backgroundGradient && c.backgroundGradient.length >= 2) {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      for (const stop of c.backgroundGradient) {
        grad.addColorStop(stop.stop, stop.color);
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // connections
    if (c.connections) {
      ctx.lineWidth = 1;
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i];
          const b = this.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < c.connectionDistance) {
            const alpha = (1 - dist / c.connectionDistance) * c.connectionOpacity;
            ctx.strokeStyle = this._colorWithAlpha(c.connectionColor, alpha);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    // particles
    for (const p of this.particles) {
      if (p.opacity <= 0) continue;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      this._drawShape(ctx, p);
      ctx.restore();
    }
  }

  _drawShape(ctx, p) {
    const c = this.config;
    const s = p.size;
    switch (c.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, s, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(-s, -s, s * 2, s * 2);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(-s, s);
        ctx.lineTo(s, s);
        ctx.closePath();
        ctx.fill();
        break;
      case 'line':
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-s, 0);
        ctx.lineTo(s, 0);
        ctx.stroke();
        break;
      case 'star': {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const innerAngle = outerAngle + Math.PI / 5;
          const ox = Math.cos(outerAngle) * s;
          const oy = Math.sin(outerAngle) * s;
          const ix = Math.cos(innerAngle) * s * 0.4;
          const iy = Math.sin(innerAngle) * s * 0.4;
          if (i === 0) ctx.moveTo(ox, oy);
          else ctx.lineTo(ox, oy);
          ctx.lineTo(ix, iy);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }
      default:
        ctx.beginPath();
        ctx.arc(0, 0, s, 0, Math.PI * 2);
        ctx.fill();
    }
  }

  _colorWithAlpha(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // ── Config hot-swap with smooth transition ──
  transitionTo(newConfig, durationMs = 600) {
    const merged = { ...DEFAULT_PARTICLE_CONFIG, ...newConfig };
    const startConfig = { ...this.config };
    const startTime = performance.now();

    this._transition = {
      from: startConfig,
      to: merged,
      startTime,
      duration: durationMs,
    };

    // adjust particle count
    const diff = merged.count - this.particles.length;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        this.particles.push(this._createParticle(true));
      }
    } else if (diff < 0) {
      // mark excess for removal
      for (let i = 0; i < -diff && i < this.particles.length; i++) {
        this.particles[i].life = 0.99; // will fade out
      }
    }

    // update particle colors
    const colors = Array.isArray(merged.color) ? merged.color : [merged.color];
    for (const p of this.particles) {
      if (p.life >= 1) {
        p.color = colors[Math.floor(Math.random() * colors.length)];
        p.targetOpacity = merged.opacity * (0.5 + Math.random() * 0.5);
      }
    }
  }

  _tickTransition(now) {
    const t = this._transition;
    const progress = Math.min((now - t.startTime) / t.duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic

    // lerp numeric config values
    this.config.speed = this._lerp(t.from.speed, t.to.speed, ease);
    this.config.minSize = this._lerp(t.from.minSize, t.to.minSize, ease);
    this.config.maxSize = this._lerp(t.from.maxSize, t.to.maxSize, ease);
    this.config.opacity = this._lerp(t.from.opacity, t.to.opacity, ease);
    this.config.mouseRadius = this._lerp(t.from.mouseRadius, t.to.mouseRadius, ease);
    this.config.connectionDistance = this._lerp(t.from.connectionDistance, t.to.connectionDistance, ease);
    this.config.connectionOpacity = this._lerp(t.from.connectionOpacity, t.to.connectionOpacity, ease);

    if (t.to.wind) {
      this.config.wind = {
        x: this._lerp(t.from.wind?.x || 0, t.to.wind.x || 0, ease),
        y: this._lerp(t.from.wind?.y || 0, t.to.wind.y || 0, ease),
      };
    }

    // snap non-numeric values at halfway
    if (progress >= 0.5) {
      this.config.shape = t.to.shape;
      this.config.behavior = t.to.behavior;
      this.config.mouseInteraction = t.to.mouseInteraction;
      this.config.connections = t.to.connections;
      this.config.connectionColor = t.to.connectionColor;
      this.config.backgroundGradient = t.to.backgroundGradient;
    }

    if (progress >= 1) {
      this.config = { ...t.to };
      this._transition = null;
    }
  }

  _lerp(a, b, t) {
    return a + (b - a) * t;
  }

  applyConfig(newConfig) {
    this.transitionTo(newConfig);
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('mousemove', this._onMouse);
    document.removeEventListener('mouseleave', this._onMouseLeave);
  }
}

// expose globally
window.ParticleSystem = ParticleSystem;
window.DEFAULT_PARTICLE_CONFIG = DEFAULT_PARTICLE_CONFIG;
