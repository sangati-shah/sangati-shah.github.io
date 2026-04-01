// ── Questions ──
const questions = [
  // Deep & introspective
  "What's something you've never told anyone but want to tell me?",
  "What moment in your life made you who you are today?",
  "If you could relive one day we've spent together, which would it be?",
  "What are you most afraid of losing?",
  "What does love feel like to you — not the definition, but the actual feeling?",
  "What's a belief you held strongly that you've changed your mind about?",
  "When do you feel most like yourself?",
  "What's something you want me to understand about you that I might not yet?",
  "If we could live anywhere for a year, where would you choose and why?",
  "What's a small moment between us that meant more to you than I probably realized?",
  "What's one thing you've been overthinking lately?",
  "How do you want to be remembered?",
  "What does home mean to you?",
  "What's the hardest thing about being apart?",
  "What's the best thing about being apart — if anything?",
  "What part of your childhood do you wish you could give to your future kids?",
  "When was the last time you cried, and what was it about?",
  "What's something you admire about me that you haven't said out loud?",
  "What's a question you've been wanting to ask me but haven't?",
  "If you could change one thing about how we communicate, what would it be?",

  // Relationship check-ins
  "On a scale of 1–10, how connected have you felt to me this week?",
  "What's one thing I did recently that made you feel loved?",
  "Is there anything sitting between us that we haven't addressed?",
  "What do you need more of from me right now?",
  "What's one thing we could do this week to feel closer?",
  "Do you feel heard by me? Truly?",
  "What's our biggest strength as a couple right now?",
  "What's one thing we should work on together?",
  "How has your idea of us changed since we first got together?",
  "What's something I do that makes you feel safe?",

  // Dreams & future
  "What's a dream you've been too scared to say out loud?",
  "Where do you see us in five years — honestly?",
  "What kind of home do you want us to build together?",
  "If money wasn't a factor, what would your days look like?",
  "What's an adventure you want us to go on?",
  "What traditions do you want us to create?",
  "What's a skill you want to learn together?",

  // Playful but deep
  "What song makes you think of me and why?",
  "If our relationship was a movie, what genre would it be?",
  "What's the most random thing you find attractive about me?",
  "What's a weird habit of mine that you secretly love?",
  "If you could read my mind for one hour, when would you choose?",
  "What would your younger self think about us?",
  "If we could only eat one meal together for the rest of our lives, what are we eating?",
  "What's a compliment you want to receive more often?",
  "When did you first realize you loved me?",
  "What's your favorite way to be comforted?",
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

// ── Navigation ──
function navigateTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');

  // Reset lights state when going to question jar
  if (screenId === 'question-jar') {
    resetLightsState();
  }
}

function resetLightsState() {
  document.body.classList.remove('lights-off');
  document.getElementById('lights-toggle').checked = false;
  document.getElementById('lights-on').style.opacity = '1';
  document.getElementById('lights-on').style.pointerEvents = 'all';
  document.getElementById('lights-off').style.opacity = '0';
  document.getElementById('lights-off').style.pointerEvents = 'none';
  clearFireflies();
  closeQuestion();

  // Reset fade-out classes
  const prompt = document.querySelector('.jar-prompt');
  const switchEl = document.querySelector('.switch');
  if (prompt) prompt.classList.remove('fade-out');
  if (switchEl) switchEl.classList.remove('fade-out');
}

function goBackFromCampfire() {
  // Reverse the transition — turn lights back on
  resetLightsState();
  navigateTo('home');
}

// ── Lights Toggle ──
document.getElementById('lights-toggle').addEventListener('change', function () {
  if (this.checked) {
    turnLightsOff();
  }
});

function turnLightsOff() {
  const prompt = document.querySelector('.jar-prompt');
  const switchEl = document.querySelector('.switch');

  // Fade out text and switch
  prompt.classList.add('fade-out');
  setTimeout(() => switchEl.classList.add('fade-out'), 200);

  // After fade, transition to dark
  setTimeout(() => {
    document.body.classList.add('lights-off');

    document.getElementById('lights-on').style.opacity = '0';
    document.getElementById('lights-on').style.pointerEvents = 'none';
    document.getElementById('lights-off').style.opacity = '1';
    document.getElementById('lights-off').style.pointerEvents = 'all';

    spawnFireflies();
  }, 800);
}

// ── Fireflies ──
function spawnFireflies() {
  const container = document.getElementById('fireflies');
  container.innerHTML = '';

  const count = window.innerWidth < 500 ? 12 : 20;

  for (let i = 0; i < count; i++) {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';

    // Random position along the edges and scattered
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    firefly.style.left = x + '%';
    firefly.style.top = y + '%';

    // Random animation
    const duration = 6 + Math.random() * 10;
    const delay = Math.random() * 5;
    const glowDuration = 2 + Math.random() * 3;
    const size = 3 + Math.random() * 4;

    firefly.style.width = size + 'px';
    firefly.style.height = size + 'px';
    firefly.style.animationDuration = `${duration}s, ${glowDuration}s`;
    firefly.style.animationDelay = `${delay}s, ${delay * 0.5}s`;

    // Unique float path for each firefly
    const driftX = (Math.random() - 0.5) * 200;
    const driftY = (Math.random() - 0.5) * 200;
    firefly.style.setProperty('--drift-x', driftX + 'px');
    firefly.style.setProperty('--drift-y', driftY + 'px');

    // Create unique keyframes for each firefly
    const keyframeName = `firefly-${i}`;
    const midX1 = (Math.random() - 0.5) * 150;
    const midY1 = (Math.random() - 0.5) * 150;
    const midX2 = (Math.random() - 0.5) * 180;
    const midY2 = (Math.random() - 0.5) * 180;

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

function clearFireflies() {
  document.getElementById('fireflies').innerHTML = '';
}

// ── Question Drawing ──
function drawQuestion() {
  const display = document.getElementById('question-display');
  const textEl = document.getElementById('question-text');

  // If already visible, animate out first then back in with new question
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
  display.classList.remove('visible');
}

// Close question on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeQuestion();
  }
});
