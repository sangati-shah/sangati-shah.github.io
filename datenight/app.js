// ── Themed Question Decks ──
const decks = {
  deep: [
    "What's something you've never told anyone but want to tell me?",
    "If you could relive one day we've spent together, which would it be?",
    "What does love feel like to you — not the definition, but the actual feeling?",
    "What part of yourself do you feel like I understand the best?",
    "When did you first realize this was more than just a crush?",
    "What's a belief you held strongly that has changed because of us?",
    "What do you think we teach each other without even trying?",
    "If you could read my mind for one hour, when would you choose?",
    "What's a small moment between us that meant more than I probably realize?",
    "What's the hardest thing about loving someone deeply?",
  ],
  dreams: [
    "If money and time weren't factors, what would our life look like in five years?",
    "What's a dream you've been too shy to say out loud?",
    "Where in the world do you want us to wake up together someday?",
    "What kind of old couple do you think we'll be?",
    "If we could build a house anywhere, what would the view from the window be?",
    "What's something you want us to try together before the year ends?",
    "What does your ideal lazy Sunday with me look like, ten years from now?",
    "If you could master any skill overnight, what would you pick and why?",
    "What's a tradition you want us to start?",
    "What does 'home' mean to you — is it a place or a feeling?",
  ],
  memories: [
    "What's your happiest childhood memory?",
    "What did you dream of becoming when you were little?",
    "What's a smell that instantly takes you back to being a kid?",
    "Who was the first person outside your family who made you feel truly seen?",
    "What's a song that reminds you of growing up?",
    "What's a lesson your younger self learned the hard way?",
    "What's something from your childhood you wish you could experience again?",
    "What was your favorite hiding spot as a kid?",
    "What's a family tradition from your childhood you want to keep alive?",
    "If you could write a letter to your ten-year-old self, what would it say?",
  ],
  vulnerable: [
    "What's a fear you don't talk about often?",
    "When do you feel most insecure in our relationship?",
    "What's something you wish you could forgive yourself for?",
    "What's the loneliest you've ever felt, and what pulled you out of it?",
    "What's a part of yourself you're still learning to accept?",
    "When was the last time you cried and what was it about?",
    "What do you need from me that you find hard to ask for?",
    "What scares you most about the future?",
    "What's an old wound that still aches sometimes?",
    "If I could take away one burden you carry, what would it be?",
  ],
  gratitude: [
    "What's something I do that makes you feel safe?",
    "What moment made you think 'I'm so glad I found this person'?",
    "What's a quality of mine you hope rubs off on you?",
    "When do you feel most loved by me?",
    "What's a small thing I do that you never want me to stop doing?",
    "What's something about us that you think other people admire?",
    "What have I helped you believe about yourself?",
    "What's your favorite way we spend time together?",
    "How have I surprised you in a good way since we've been together?",
    "What would you miss most about me if I was gone for a month?",
  ],
  spicy: [
    "What's a fantasy you've never told me about?",
    "When do you find me most attractive — and I probably have no idea?",
    "What's something I could whisper to you that would drive you crazy?",
    "What's the most electric moment we've had together?",
    "If we had a whole weekend alone with no plans, what would you want to do?",
    "What outfit of mine do you secretly love the most?",
    "Where's the most adventurous place you'd want to kiss me?",
    "What's a date you've imagined for us that's a little outside our comfort zone?",
    "What song makes you think of me in that way?",
    "What's something new you'd want to explore together?",
  ],
  silly: [
    "If we were both animals, what animals would we be and why?",
    "What's the most embarrassing thing you've done in front of me?",
    "If we had a couples reality show, what would it be called?",
    "What's the weirdest food combo you secretly love?",
    "If I were a superhero, what would my power be and what would yours be?",
    "What's a conspiracy theory you'd actually kind of believe?",
    "If we had to survive a zombie apocalypse together, what's our game plan?",
    "What would your entrance song be if you walked into every room to music?",
    "If you could swap lives with me for a day, what would you do first?",
    "What's the most ridiculous argument we've ever had?",
  ],
};

// Shuffle helper (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let currentDeck = "deep";
let questionPool = shuffle(decks[currentDeck]);
let poolIndex = 0;

function selectDeck(deckName) {
  if (!decks[deckName]) return;
  currentDeck = deckName;
  questionPool = shuffle(decks[currentDeck]);
  poolIndex = 0;

  // Update active jar in the UI
  document.querySelectorAll('.deck-jar').forEach((jar) => {
    jar.classList.toggle('active', jar.dataset.deck === deckName);
  });
}

function selectDeckAndDraw(deckName) {
  selectDeck(deckName);
  drawQuestion();
}

function getNextQuestion() {
  if (poolIndex >= questionPool.length) {
    questionPool = shuffle(decks[currentDeck]);
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
