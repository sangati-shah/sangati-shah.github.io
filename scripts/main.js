// ── Date display ──
const dateDisplayElement = document.getElementById("currentDateDisplay");
const currentDate = new Date();
const options = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
dateDisplayElement.innerHTML = currentDate.toLocaleDateString("en-GB", options);

// ── Initialize particle system ──
const ps = new ParticleSystem('particle-canvas');

// ── Initialize theme engine ──
const engine = new ThemeEngine(ps);

// ── Theme generator UI ──
const modelSelect = document.getElementById('ai-model');
const promptInput = document.getElementById('theme-prompt');
const generateBtn = document.getElementById('generate-theme');
const resetBtn = document.getElementById('reset-theme');
const statusEl = document.getElementById('theme-status');

function setStatus(msg, isError) {
  statusEl.textContent = msg;
  statusEl.hidden = !msg;
  statusEl.classList.toggle('error', !!isError);
}

generateBtn.addEventListener('click', async () => {
  const model = modelSelect.value;
  const prompt = promptInput.value.trim();

  if (!prompt) {
    setStatus('Please describe a vibe or aesthetic.', true);
    return;
  }

  generateBtn.disabled = true;
  generateBtn.classList.add('loading');
  setStatus('Generating theme...');

  try {
    const theme = await engine.generateTheme(model, prompt);
    setStatus(`Applied: ${theme.name || 'custom theme'}`);
  } catch (err) {
    setStatus(err.message || 'Something went wrong. Try again.', true);
  } finally {
    generateBtn.disabled = false;
    generateBtn.classList.remove('loading');
  }
});

// allow Enter key to generate
promptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !generateBtn.disabled) {
    generateBtn.click();
  }
});

resetBtn.addEventListener('click', () => {
  engine.resetToDefault();
  setStatus('');
  promptInput.value = '';
});
