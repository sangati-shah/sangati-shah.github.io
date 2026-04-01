// ── Questions ──
const questions = [
  "What's something you've never told anyone but want to tell me?",
  "If you could relive one day we've spent together, which would it be?",
  "What does love feel like to you — not the definition, but the actual feeling?",
];

// Shuffle helper (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let questionPool = shuffle(questions);
let poolIndex = 0;

function getNextQuestion() {
  if (poolIndex >= questionPool.length) {
    questionPool = shuffle(questions);
    poolIndex = 0;
  }
  return questionPool[poolIndex++];
}

// ── Lights Toggle (turn off) ──
const toggle = document.getElementById('lights-toggle');
if (toggle) {
  toggle.addEventListener('change', function () {
    if (this.checked) {
      turnLightsOff();
    }
  });
}

function turnLightsOff() {
  const prompt = document.querySelector('.jar-prompt');
  const tentSwitch = document.getElementById('tent-switch-container');

  // Fade out text and switch
  prompt.classList.add('fade-out');
  setTimeout(() => tentSwitch.classList.add('fade-out'), 200);

  // After fade, transition to dark
  setTimeout(() => {
    document.body.classList.add('lights-off');

    document.getElementById('lights-on').classList.remove('active');
    document.getElementById('lights-off').classList.add('active');

    spawnFireflies();

    // Show the scared corner after a moment
    setTimeout(() => {
      const scaredCorner = document.getElementById('scared-corner');
      if (scaredCorner) scaredCorner.classList.add('visible');
    }, 600);
  }, 800);
}

// ── Lights Back On (scared toggle) ──
const lightsBackOn = document.getElementById('lights-back-on');
if (lightsBackOn) {
  lightsBackOn.addEventListener('change', function () {
    if (this.checked) {
      // Navigate to home with scared param
      window.location.href = 'index.html?scared=1';
    }
  });
}

// ── Fireflies ──
function spawnFireflies() {
  const container = document.getElementById('fireflies');
  container.innerHTML = '';

  const count = window.innerWidth < 500 ? 12 : 20;

  for (let i = 0; i < count; i++) {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    firefly.style.left = x + '%';
    firefly.style.top = y + '%';

    const duration = 6 + Math.random() * 10;
    const delay = Math.random() * 5;
    const glowDuration = 2 + Math.random() * 3;
    const size = 3 + Math.random() * 4;

    firefly.style.width = size + 'px';
    firefly.style.height = size + 'px';
    firefly.style.animationDuration = `${duration}s, ${glowDuration}s`;
    firefly.style.animationDelay = `${delay}s, ${delay * 0.5}s`;

    // Unique float path for each firefly
    const midX1 = (Math.random() - 0.5) * 150;
    const midY1 = (Math.random() - 0.5) * 150;
    const midX2 = (Math.random() - 0.5) * 180;
    const midY2 = (Math.random() - 0.5) * 180;

    const keyframeName = `firefly-${i}`;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${keyframeName} {
        0% { transform: translate(0, 0); }
        25% { transform: translate(${midX1}px, ${midY1}px); }
        50% { transform: translate(${midX2}px, ${midY2}px); }
        75% { transform: translate(${midX1 * -0.5}px, ${midY2 * 0.7}px); }
        100% { transform: translate(0, 0); }
      }
    `;
    document.head.appendChild(style);

    firefly.style.animationName = `${keyframeName}, firefly-glow`;
    container.appendChild(firefly);
  }
}

// ── Question Drawing ──
function drawQuestion() {
  const display = document.getElementById('question-display');
  const textEl = document.getElementById('question-text');

  if (display.classList.contains('visible')) {
    const unfurl = display.querySelector('.paper-unfurl');
    unfurl.style.transform = 'scaleY(0)';

    setTimeout(() => {
      textEl.textContent = getNextQuestion();
      unfurl.style.transform = '';
    }, 350);
  } else {
    textEl.textContent = getNextQuestion();
    display.classList.add('visible');
  }
}

function closeQuestion() {
  const display = document.getElementById('question-display');
  if (display) display.classList.remove('visible');
}

// Close question on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeQuestion();
  }
});
