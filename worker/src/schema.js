// ── System prompt + response validation for theme generation ──

export const SYSTEM_PROMPT = `You are a theme generator for a personal portfolio website. Given a user's description of a vibe or aesthetic, return a JSON theme object. Return ONLY valid JSON, no markdown, no explanation, no code fences.

The JSON must have exactly this structure:
{
  "name": "short theme name",
  "narration": "A short, evocative 1-sentence poetic description of the vibe (e.g. 'Neon rain on empty streets, bass humming through wet concrete.')",
  "colors": {
    "bg": "#hex page background",
    "text": "#hex primary text",
    "sub": "#hex secondary/muted text",
    "accent": "#hex accent color",
    "btnBg": "CSS color for button backgrounds (can be rgba)",
    "btnBorder": "#hex button borders",
    "btnText": "#hex button text",
    "linkColor": "#hex links",
    "linkHover": "#hex link hover"
  },
  "fonts": {
    "heading": "Google Fonts font name for headings",
    "body": "Google Fonts font name for body text"
  },
  "particles": {
    "count": 20-80,
    "color": "#hex or [\"#hex1\", \"#hex2\"]",
    "opacity": 0.1-0.8,
    "minSize": 1-5,
    "maxSize": 3-10,
    "shape": "circle|square|triangle|line|star",
    "behavior": "drift|orbit|bounce|rain|float|swirl|firefly",
    "speed": 0.2-2.0,
    "wind": { "x": -1 to 1, "y": -1 to 1 },
    "connections": true/false,
    "connectionDistance": 50-200,
    "connectionColor": "#hex",
    "connectionOpacity": 0.05-0.3,
    "mouseInteraction": "repel|attract|none|glow",
    "mouseRadius": 60-200,
    "backgroundGradient": [{"stop": 0, "color": "#hex"}, {"stop": 1, "color": "#hex"}] or null
  }
}

Rules:
- Choose real Google Fonts that exist (popular ones like Inter, Space Grotesk, Playfair Display, etc.)
- Ensure sufficient contrast between text and background colors
- Particle behavior should match the mood of the theme
- Make it creative and cohesive
- Return ONLY the JSON object, nothing else`;

const VALID_SHAPES = ['circle', 'square', 'triangle', 'line', 'star'];
const VALID_BEHAVIORS = ['drift', 'orbit', 'bounce', 'rain', 'float', 'swirl', 'firefly'];
const VALID_MOUSE = ['repel', 'attract', 'none', 'glow'];

function isHexColor(s) {
  return typeof s === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(s);
}

function isCSSColor(s) {
  return typeof s === 'string' && (isHexColor(s) || s.startsWith('rgba') || s.startsWith('rgb') || s.startsWith('hsl'));
}

function clamp(val, min, max) {
  if (typeof val !== 'number') return min;
  return Math.max(min, Math.min(max, val));
}

export function validateTheme(obj) {
  if (!obj || typeof obj !== 'object') return null;

  try {
    const theme = {};

    // name
    theme.name = typeof obj.name === 'string' ? obj.name.slice(0, 50) : 'custom';

    // narration
    theme.narration = typeof obj.narration === 'string' ? obj.narration.slice(0, 200) : '';

    // colors
    if (!obj.colors || typeof obj.colors !== 'object') return null;
    theme.colors = {};
    const colorKeys = ['bg', 'text', 'sub', 'accent', 'btnBorder', 'btnText', 'linkColor', 'linkHover'];
    for (const key of colorKeys) {
      if (!isHexColor(obj.colors[key])) return null;
      theme.colors[key] = obj.colors[key];
    }
    // btnBg can be rgba
    if (!isCSSColor(obj.colors.btnBg)) return null;
    theme.colors.btnBg = obj.colors.btnBg;

    // fonts
    if (!obj.fonts || typeof obj.fonts !== 'object') return null;
    theme.fonts = {
      heading: typeof obj.fonts.heading === 'string' ? obj.fonts.heading.slice(0, 60) : 'Inter',
      body: typeof obj.fonts.body === 'string' ? obj.fonts.body.slice(0, 60) : 'Inter',
    };

    // particles
    if (!obj.particles || typeof obj.particles !== 'object') return null;
    const p = obj.particles;
    theme.particles = {
      count: clamp(p.count, 10, 100),
      opacity: clamp(p.opacity, 0.05, 1),
      minSize: clamp(p.minSize, 0.5, 8),
      maxSize: clamp(p.maxSize, 1, 15),
      speed: clamp(p.speed, 0.1, 3),
      connectionDistance: clamp(p.connectionDistance, 30, 300),
      connectionOpacity: clamp(p.connectionOpacity, 0.01, 0.5),
      mouseRadius: clamp(p.mouseRadius, 30, 300),
      connections: !!p.connections,
      shape: VALID_SHAPES.includes(p.shape) ? p.shape : 'circle',
      behavior: VALID_BEHAVIORS.includes(p.behavior) ? p.behavior : 'drift',
      mouseInteraction: VALID_MOUSE.includes(p.mouseInteraction) ? p.mouseInteraction : 'repel',
    };

    // color - can be string or array
    if (Array.isArray(p.color)) {
      const validColors = p.color.filter(isHexColor).slice(0, 5);
      theme.particles.color = validColors.length > 0 ? validColors : ['#999999'];
    } else if (isHexColor(p.color)) {
      theme.particles.color = p.color;
    } else {
      theme.particles.color = '#999999';
    }

    // connectionColor
    theme.particles.connectionColor = isHexColor(p.connectionColor) ? p.connectionColor : '#999999';

    // wind
    if (p.wind && typeof p.wind === 'object') {
      theme.particles.wind = {
        x: clamp(p.wind.x, -2, 2),
        y: clamp(p.wind.y, -2, 2),
      };
    } else {
      theme.particles.wind = { x: 0, y: 0 };
    }

    // backgroundGradient
    if (Array.isArray(p.backgroundGradient) && p.backgroundGradient.length >= 2) {
      const validStops = p.backgroundGradient
        .filter(s => typeof s.stop === 'number' && isHexColor(s.color))
        .slice(0, 4);
      theme.particles.backgroundGradient = validStops.length >= 2 ? validStops : null;
    } else {
      theme.particles.backgroundGradient = null;
    }

    return theme;
  } catch {
    return null;
  }
}
