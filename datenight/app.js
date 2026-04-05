// ── Questions ──
const questions = [
  "What's the most \"that's my girl\" or \"that's my man\" thing I've ever done?",
  "What would you say is the most underrated part of our love story?",
  "What's the part of me you're still trying to figure out?",
  "If you had to write a \"user manual\" for loving me, what's rule #1?",
  "What's the last thing I did that made you really happy?",
  "What's your favorite day with me?",
  "When was the first time you felt really protective of me?",
  "Smash or pass a frying pan?",
  "If you had to find me in a crowd without using my name, what would you yell?",
  "What's one thing about me you'd never tell me but wish I knew?",
  "What's the most chaotic thing you've seen me do without thinking twice?",
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

  // Let the CSS :has(:checked) flap animation play, then fade out the prompt
  setTimeout(() => {
    prompt.classList.add('fade-out');
  }, 600);

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
  }, 1200);
}


// ── Fireflies ──
function spawnFireflies() {
  const container = document.getElementById('fireflies');
  container.innerHTML = '';

  // Remove previously injected firefly keyframes
  document.querySelectorAll('style[data-firefly]').forEach(s => s.remove());

  const count = window.innerWidth < 500 ? 12 : 20;

  // Build all keyframes in a single style element
  let keyframeCSS = '';
  for (let i = 0; i < count; i++) {
    const midX1 = (Math.random() - 0.5) * 150;
    const midY1 = (Math.random() - 0.5) * 150;
    const midX2 = (Math.random() - 0.5) * 180;
    const midY2 = (Math.random() - 0.5) * 180;
    keyframeCSS += `
      @keyframes firefly-${i} {
        0% { transform: translate(0, 0); }
        25% { transform: translate(${midX1}px, ${midY1}px); }
        50% { transform: translate(${midX2}px, ${midY2}px); }
        75% { transform: translate(${midX1 * -0.5}px, ${midY2 * 0.7}px); }
        100% { transform: translate(0, 0); }
      }`;
  }
  const styleEl = document.createElement('style');
  styleEl.dataset.firefly = 'true';
  styleEl.textContent = keyframeCSS;
  document.head.appendChild(styleEl);

  for (let i = 0; i < count; i++) {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';

    firefly.style.left = (Math.random() * 100) + '%';
    firefly.style.top = (Math.random() * 100) + '%';

    const duration = 6 + Math.random() * 10;
    const delay = Math.random() * 5;
    const glowDuration = 2 + Math.random() * 3;
    const size = 3 + Math.random() * 4;

    firefly.style.width = size + 'px';
    firefly.style.height = size + 'px';
    firefly.style.animationDuration = `${duration}s, ${glowDuration}s`;
    firefly.style.animationDelay = `${delay}s, ${delay * 0.5}s`;
    firefly.style.animationName = `firefly-${i}, firefly-glow`;
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
