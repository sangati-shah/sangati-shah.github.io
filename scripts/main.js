// ── Date display ──
const dateDisplayElement = document.getElementById("currentDateDisplay");
const currentDate = new Date();
const options = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
dateDisplayElement.innerHTML = currentDate.toLocaleDateString("en-GB", options);

// ── Initialize particle system ──
const ps = new ParticleSystem('particle-canvas');

// ── Initialize theme engine ──
const engine = new ThemeEngine(ps);

// ── Chat UI ──
const chatMessages = document.getElementById('chat-messages');
const modelSelect = document.getElementById('ai-model');
const chatInput = document.getElementById('theme-prompt');
const sendBtn = document.getElementById('send-chat');
const resetBtn = document.getElementById('reset-theme');

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  const bubble = document.createElement('span');
  bubble.className = 'chat-bubble';
  bubble.textContent = text;
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msg;
}

function addTypingIndicator() {
  const msg = document.createElement('div');
  msg.className = 'chat-msg ai chat-typing';
  msg.id = 'typing-indicator';
  const bubble = document.createElement('span');
  bubble.className = 'chat-bubble';
  bubble.textContent = 'Transforming';
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msg;
}

function removeTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

sendBtn.addEventListener('click', async () => {
  const model = modelSelect.value;
  const prompt = chatInput.value.trim();
  if (!prompt) return;

  // show user message
  addMessage(prompt, 'user');
  chatInput.value = '';

  // show typing
  sendBtn.disabled = true;
  chatInput.disabled = true;
  addTypingIndicator();

  try {
    const theme = await engine.generateTheme(model, prompt);
    removeTypingIndicator();

    // AI response with narration or name
    const response = theme.narration || `Switched to ${theme.name || 'a new vibe'}.`;
    addMessage(response, 'ai');

    resetBtn.hidden = false;
  } catch (err) {
    removeTypingIndicator();
    const errMsg = document.createElement('div');
    errMsg.className = 'chat-msg ai';
    const errBubble = document.createElement('span');
    errBubble.className = 'chat-bubble error';
    errBubble.textContent = err.message || 'Something went wrong. Try again.';
    errMsg.appendChild(errBubble);
    chatMessages.appendChild(errMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } finally {
    sendBtn.disabled = false;
    chatInput.disabled = false;
    chatInput.focus();
  }
});

// Enter key sends
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !sendBtn.disabled) {
    sendBtn.click();
  }
});

// Reset
resetBtn.addEventListener('click', () => {
  engine.resetToDefault();
  resetBtn.hidden = true;
  addMessage('Back to the Ghibli defaults.', 'ai');
});

// ── Scroll-triggered spring animations ──
(function initScrollAnimations() {
  // Mark sections as scroll-reveal
  document.querySelectorAll('.building, .timeline, .projects, .theme-chat').forEach(el => {
    el.classList.add('scroll-reveal');
  });

  // Mark staggered children
  document.querySelectorAll('.timeline-node, .timeline-line').forEach(el => {
    el.classList.add('scroll-reveal-child');
  });
  document.querySelectorAll('.project-item').forEach(el => {
    el.classList.add('scroll-reveal-child');
  });

  // Section-level observer
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    sectionObserver.observe(el);
  });

  // Staggered children observer
  const childObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // find siblings and stagger them
        const parent = entry.target.parentElement;
        const children = parent.querySelectorAll('.scroll-reveal-child');
        children.forEach((child, i) => {
          setTimeout(() => {
            child.classList.add('visible');
          }, i * 80);
        });
        // unobserve all children in this parent
        children.forEach(child => childObserver.unobserve(child));
      }
    });
  }, { threshold: 0.1 });

  // Only observe the first child in each group to trigger the stagger
  const observed = new Set();
  document.querySelectorAll('.scroll-reveal-child').forEach(el => {
    const parent = el.parentElement;
    if (!observed.has(parent)) {
      observed.add(parent);
      childObserver.observe(el);
    }
  });
})();
