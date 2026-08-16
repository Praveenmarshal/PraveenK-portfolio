/* ═══════════════════════════════════════════════════════════
   PRAVEEN K PORTFOLIO — MAIN.JS
   Three.js particles · Magnetic cursor · Typewriter · Reveal
═══════════════════════════════════════════════════════════ */

/* ── THEME SWITCHER ──────────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('pk-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.body.setAttribute('data-theme', saved);

  document.querySelectorAll('.theme-btn').forEach(btn => {
    if (btn.dataset.theme === saved) btn.classList.add('active');
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('pk-theme', theme);
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
})();

/* ── SCROLL-BASED IMAGE SEQUENCE BACKGROUND ──────────────── */
(function initScrollSequence() {
  const canvas = document.getElementById('bgSequenceCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  const TOTAL_FRAMES = 270;
  const frames = new Array(TOTAL_FRAMES);
  const loaded = new Array(TOTAL_FRAMES).fill(false);
  let currentFrame = 0;
  let targetFrame = 0;
  let isTicking = false;
  let lastDrawnIndex = -1;

  function pad(num) {
    return String(num).padStart(5, '0');
  }

  function getFrameUrl(idx) {
    return `/static/images/sequence/${pad(idx + 1)}.jpg`;
  }

  // Preload frame 0 immediately for instant display
  const firstImg = new Image();
  firstImg.src = getFrameUrl(0);
  firstImg.onload = () => {
    frames[0] = firstImg;
    loaded[0] = true;
    renderFrame(0);
    startProgressivePreload();
  };
  firstImg.onerror = () => {
    startProgressivePreload();
  };

  // Progressive preloading strategy (priority keyframes first, then fill gaps)
  function startProgressivePreload() {
    const priority = [];
    // Wave 1: Every 5th frame for instant scrub response across the whole page
    for (let i = 0; i < TOTAL_FRAMES; i += 5) {
      if (i !== 0) priority.push(i);
    }
    // Wave 2: All remaining frames for full 60fps cinematic fluidity
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (i % 5 !== 0) priority.push(i);
    }

    let ptr = 0;
    const CONCURRENCY = 8;

    function loadNext() {
      if (ptr >= priority.length) return;
      const idx = priority[ptr++];
      const img = new Image();
      img.src = getFrameUrl(idx);
      img.onload = () => {
        frames[idx] = img;
        loaded[idx] = true;
        // If current displayed frame is waiting for closer frames, trigger render
        if (Math.abs(Math.round(currentFrame) - idx) < 4) {
          renderFrame(Math.round(currentFrame));
        }
        loadNext();
      };
      img.onerror = () => {
        loadNext();
      };
    }

    for (let c = 0; c < CONCURRENCY; c++) {
      loadNext();
    }
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    lastDrawnIndex = -1;
    renderFrame(Math.round(currentFrame));
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  function findNearestLoadedIndex(targetIdx) {
    if (loaded[targetIdx] && frames[targetIdx]) return targetIdx;
    for (let d = 1; d < TOTAL_FRAMES; d++) {
      const prev = targetIdx - d;
      if (prev >= 0 && loaded[prev] && frames[prev]) return prev;
      const next = targetIdx + d;
      if (next < TOTAL_FRAMES && loaded[next] && frames[next]) return next;
    }
    return 0;
  }

  function renderFrame(frameIdx) {
    const bestIdx = findNearestLoadedIndex(frameIdx);
    const img = frames[bestIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    if (bestIdx === lastDrawnIndex && canvas.width > 0) return;
    lastDrawnIndex = bestIdx;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    // Object-fit: cover (centered crop)
    const cRatio = cw / ch;
    const iRatio = iw / ih;

    let dw, dh, dx, dy;
    if (cRatio > iRatio) {
      dw = cw;
      dh = cw / iRatio;
      dx = 0;
      dy = (ch - dh) / 2;
    } else {
      dh = ch;
      dw = ch * iRatio;
      dx = (cw - dw) / 2;
      dy = 0;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function updateScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollFrac = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    targetFrame = scrollFrac * (TOTAL_FRAMES - 1);

    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(animStep);
    }
  }

  function animStep() {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) < 0.05) {
      currentFrame = targetFrame;
      renderFrame(Math.round(currentFrame));
      isTicking = false;
    } else {
      currentFrame += diff * 0.16; // smooth spring lerp
      renderFrame(Math.round(currentFrame));
      requestAnimationFrame(animStep);
    }
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  // Initial frame compute
  setTimeout(updateScroll, 50);
})();

/* ── LOADER ──────────────────────────────────────────────── */
const loaderMessages = [
  'INITIALISING SYSTEMS...', 'LOADING DATA MODULES...', 'COMPILING PORTFOLIO...',
  'CONNECTING TO ANALYTICS ENGINE...', 'READY.'
];
let msgIdx = 0;
const loaderText = document.getElementById('loaderText');
const msgTimer = setInterval(() => {
  msgIdx++;
  if (loaderText && loaderMessages[msgIdx]) loaderText.textContent = loaderMessages[msgIdx];
  if (msgIdx >= loaderMessages.length - 1) clearInterval(msgTimer);
}, 450);

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    initReveal();
    initCounters();
    initHoloStats();
    initSectionWipes();
  }, 2400);
});

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animCursor() {
  requestAnimationFrame(animCursor);
  if (!dot || !ring) return;
  dot.style.transform  = `translate(${mx - 3}px, ${my - 3}px)`;
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
}
animCursor();

document.querySelectorAll('a,button,.project-card,.stat-card,.contact-card,.skill-chip,.badge').forEach(el => {
  el.addEventListener('mouseenter', () => ring && ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring && ring.classList.remove('hover'));
});
document.addEventListener('mousedown', () => ring && ring.classList.add('clicking'));
document.addEventListener('mouseup',   () => ring && ring.classList.remove('clicking'));

/* ── PAGE PROGRESS ───────────────────────────────────────── */
const progress = document.getElementById('pageProgress');
window.addEventListener('scroll', () => {
  if (!progress) return;
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progress.style.width = pct + '%';
});

/* ── NAVBAR SCROLL ───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── HAMBURGER ───────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger && hamburger.addEventListener('click', () => {
  mobileMenu && mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a =>
  a.addEventListener('click', () => mobileMenu && mobileMenu.classList.remove('open'))
);

/* ── TYPEWRITER ──────────────────────────────────────────── */
const phrases = [
  'Python & Pandas Expert',
  'Power BI Dashboard Builder',
  'SQL Data Engineer',
  'Machine Learning Enthusiast',
  'Data Story Teller',
  'Insight Generator'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const twEl = document.getElementById('typewriterText');

function typewrite() {
  if (!twEl) return;
  const current = phrases[phraseIdx];
  if (!deleting) {
    twEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; setTimeout(typewrite, 2000); return; }
    setTimeout(typewrite, 60);
  } else {
    twEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typewrite, 400);
      return;
    }
    setTimeout(typewrite, 35);
  }
}
setTimeout(typewrite, 2800);

/* ══════════════════════════════════════════════════════════
   3D CINEMATIC SCROLL ANIMATION SYSTEM
══════════════════════════════════════════════════════════ */

/* ── Section side label ─ */
const sectionLabel = document.createElement('div');
sectionLabel.className = 'scroll-section-label';
document.body.appendChild(sectionLabel);
const sectionNames = {
  hero:'HERO', about:'ABOUT', skills:'SKILLS',
  experience:'EXPERIENCE', projects:'PROJECTS',
  resume:'RESUME', contact:'CONTACT'
};

/* ── Scroll state ─ */
let lastScrollY = 0, ticking = false;

function onScroll() {
  lastScrollY = window.scrollY;
  if (!ticking) { requestAnimationFrame(processScroll); ticking = true; }
}
window.addEventListener('scroll', onScroll, { passive: true });

function processScroll() {
  ticking = false;
  const sy = window.scrollY;
  const wh = window.innerHeight;

  // Nav
  const nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', sy > 60);

  // Section label
  let cur = 'hero';
  document.querySelectorAll('section[id]').forEach(s => {
    if (sy >= s.offsetTop - wh * 0.4) cur = s.id;
  });
  if (sectionNames[cur]) {
    sectionLabel.textContent = '— ' + sectionNames[cur] + ' —';
    sectionLabel.classList.add('visible');
  }

  // Nav active link
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });

  // Hero parallax
  if (sy < wh * 1.2) {
    const p = sy * 0.4;
    const heroName = document.querySelector('.hero-name');
    const heroDesc = document.querySelector('.hero-desc');
    const heroArt  = document.querySelector('.hero-art-col');
    const gridBg   = document.querySelector('.hero-grid-bg');
    if (heroName) heroName.style.transform = `translateY(${p * 0.5}px)`;
    if (heroDesc) heroDesc.style.transform = `translateY(${p * 0.3}px)`;
    if (heroArt)  heroArt.style.transform  = `translateY(${p * 0.2}px)`;
    if (gridBg)   gridBg.style.transform   = `translateY(${p * 0.15}px)`;
  }

  // Float badges wave
  document.querySelectorAll('.float-badge').forEach((b, i) => {
    b.style.transform = `translateY(${Math.sin(sy * 0.004 + i * 1.2) * 10}px)`;
  });

  // Skills cube scroll rotation
  const skillSec = document.getElementById('skills');
  if (skillSec) {
    const rel = sy - skillSec.offsetTop;
    if (rel > -wh && rel < wh) {
      const cube = skillSec.querySelector('.cube');
      if (cube) cube.style.setProperty('--scroll-rot', rel * 0.05 + 'deg');
    }
  }

  revealOnScroll();
}

/* ── Reveal on scroll ─ */
function initReveal() {
  // Auto-tag timeline cards with stagger
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    const card = item.querySelector('.timeline-card');
    if (card && !card.classList.contains('reveal-left')) {
      card.classList.add('reveal-left');
      card.style.transitionDelay = (i * 0.15) + 's';
    }
  });
  // Auto-tag section tags
  document.querySelectorAll('.section-tag').forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });
  revealOnScroll();
}

function revealOnScroll() {
  const wh = window.innerHeight;
  document.querySelectorAll(
    '.reveal,.reveal-left,.reveal-right,.reveal-flip,.reveal-zoom,.reveal-rotate,.reveal-drop'
  ).forEach(el => {
    const rect = el.getBoundingClientRect();
    const inView = rect.top < wh * 0.88 && rect.bottom > 0;

    if (inView && !el.classList.contains('revealed')) {
      el.classList.add('revealed');
      spawnBurst(el);
    } else if (!inView && el.classList.contains('revealed')) {
      // Remove so it re-animates next time it enters
      el.classList.remove('revealed');
    }
  });
}

/* ── Particle burst on reveal ─ */
function spawnBurst(el) {
  if (Math.random() > 0.35) return;
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div');
    p.className = 'scroll-particle';
    p.style.cssText = `left:${cx}px;top:${cy}px;`;
    document.body.appendChild(p);
    const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.5;
    const dist  = 30 + Math.random() * 60;
    p.animate([
      { transform:'translate(0,0) scale(1)', opacity:1 },
      { transform:`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`, opacity:0 }
    ], { duration: 600 + Math.random() * 400, easing:'cubic-bezier(.22,1,.36,1)', fill:'forwards' })
    .onfinish = () => p.remove();
  }
}

/* ── Section wipe effects ─ */
function initSectionWipes() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;

      if (id === 'skills') {
        setTimeout(() => {
          e.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
            setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 80);
          });
        }, 300);
        const cc = e.target.querySelector('.cube-container');
        if (cc) {
          cc.style.transform  = 'scale(0) rotateY(180deg)';
          cc.style.transition = 'transform 1s cubic-bezier(.22,1,.36,1) .3s';
          setTimeout(() => { cc.style.transform = ''; }, 50);
        }
      }

      if (id === 'experience') {
        e.target.querySelectorAll('.timeline-dot').forEach((dot, i) => {
          setTimeout(() => dot.classList.add('visible'), i * 300 + 200);
        });
      }

      if (id === 'about') {
        e.target.querySelectorAll('.badge').forEach((b, i) => {
          b.style.cssText = `opacity:0;transform:translateY(20px) scale(.8);transition:all .5s cubic-bezier(.22,1,.36,1) ${.3+i*.06}s`;
          setTimeout(() => { b.style.opacity='1'; b.style.transform=''; }, 50);
        });
      }

      if (id === 'contact') {
        e.target.querySelectorAll('.contact-card').forEach((c, i) => {
          c.style.transitionDelay = (i * 0.1) + 's';
        });
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
}

/* ── Counters ─ */
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = +el.dataset.count;
      let   cur = 0;
      const step = Math.max(20, 1800 / end);
      const timer = setInterval(() => {
        cur++;
        el.textContent = cur;
        el.classList.toggle('counting', true);
        setTimeout(() => el.classList.remove('counting'), 150);
        if (cur >= end) clearInterval(timer);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

/* ── Holo card stats ─ */
function initHoloStats() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count;
      let cur = 0;
      const t = setInterval(() => { el.textContent = ++cur; if (cur >= end) clearInterval(t); }, 300);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.hs-val[data-count]').forEach(el => obs.observe(el));
}

/* ── Skill bars (triggered by section wipe, keep as fallback) ─ */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.skill-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
    skillObs.unobserve(e.target);
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-category').forEach(s => skillObs.observe(s));

/* ── Magnetic buttons ─ */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

/* ── Ripple ─ */
function createRipple(e) {
  const btn = e.currentTarget;
  const r   = btn.getBoundingClientRect();
  const rip = document.createElement('span');
  rip.className = 'ripple';
  rip.style.left = (e.clientX - r.left - 5) + 'px';
  rip.style.top  = (e.clientY - r.top  - 5) + 'px';
  btn.appendChild(rip);
  setTimeout(() => rip.remove(), 700);
}
window.createRipple = createRipple;

/* ── Holo card mouse tilt ─ */
const holoCard = document.getElementById('holoCard');
if (holoCard) {
  holoCard.addEventListener('mousemove', e => {
    const r = holoCard.getBoundingClientRect();
    holoCard.style.transform = `rotateY(${((e.clientX-r.left)/r.width-.5)*20}deg) rotateX(${-(((e.clientY-r.top)/r.height-.5))*20}deg) scale(1.04)`;
    holoCard.style.animation = 'none';
  });
  holoCard.addEventListener('mouseleave', () => { holoCard.style.transform=''; holoCard.style.animation=''; });
}

/* ── VanillaTilt ─ */
if (typeof VanillaTilt !== 'undefined') VanillaTilt.init(document.querySelectorAll('[data-tilt]'));

/* ── Glitch ─ */
function triggerGlitch() {
  document.querySelectorAll('.name-row').forEach(el => {
    el.style.textShadow = `${Math.random()*6-3}px 0 var(--accent),${Math.random()*-6+3}px 0 var(--accent-alt)`;
    setTimeout(() => el.style.textShadow = '', 80);
  });
}
setInterval(() => { if (Math.random() > 0.6) triggerGlitch(); }, 3000);

/* ── Init all on load ─ */

/* ── CONTACT FORM ────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const name  = document.getElementById('formName');
    const email = document.getElementById('formEmail');
    const msg   = document.getElementById('formMsg');

    [name, email, msg].forEach(f => f.closest('.form-group').classList.remove('error'));

    if (!name.value.trim() || name.value.trim().length < 2) {
      name.closest('.form-group').classList.add('error'); valid = false;
    }
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      email.closest('.form-group').classList.add('error'); valid = false;
    }
    if (!msg.value.trim() || msg.value.trim().length < 10) {
      msg.closest('.form-group').classList.add('error'); valid = false;
    }
    if (!valid) return;

    const btn = contactForm.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value, email: email.value, message: msg.value })
      });
      const data = await res.json();
      if (data.success) {
        btn.innerHTML = '<span>✓ Message Sent!</span>';
        btn.style.background = 'linear-gradient(135deg,#00e5ff,#00ff88)';
        contactForm.reset();
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 3000);
      } else throw new Error();
    } catch {
      btn.innerHTML = '<span>✗ Try Again</span>';
      btn.style.background = 'linear-gradient(135deg,#ff2d78,#ff6b6b)';
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 2500);
    }
  });
}

/* ── CHATBOT ─────────────────────────────────────────────── */
const chatWindow = document.getElementById('chatbotWindow');
function toggleChatbot() {
  chatWindow && chatWindow.classList.toggle('open');
}
window.toggleChatbot = toggleChatbot;

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const msgs  = document.getElementById('chatMessages');
  if (!input || !msgs) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.textContent = text;
  msgs.appendChild(userMsg);

  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.innerHTML = '<em style="color:var(--muted)">Thinking...</em>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;

  const qr = document.getElementById('quickReplies');
  if (qr) qr.style.display = 'none';

  try {
    const res  = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    typing.innerHTML = data.reply || data.response || 'Sorry, I could not get a response.';
  } catch {
    typing.innerHTML = '⚠️ Connection error. Please try again.';
  }
  msgs.scrollTop = msgs.scrollHeight;
}
window.sendMessage = sendMessage;

function sendQuickReply(text) {
  const input = document.getElementById('chatInput');
  if (input) { input.value = text; sendMessage(); }
}
window.sendQuickReply = sendQuickReply;

document.getElementById('chatInput') &&
  document.getElementById('chatInput').addEventListener('keydown', e => e.key === 'Enter' && sendMessage());

function exportChatHistory() {
  const msgs = document.querySelectorAll('.chat-msg');
  let text = 'Praveen K Portfolio — Chat Export\n' + new Date().toLocaleString() + '\n\n';
  msgs.forEach(m => {
    text += (m.classList.contains('user') ? 'You: ' : 'AI: ') + m.textContent + '\n';
  });
  const a = document.createElement('a');
  a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  a.download = 'chat-export.txt';
  a.click();
}
window.exportChatHistory = exportChatHistory;

/* ── RESUME DOWNLOAD ─────────────────────────────────────── */
function downloadResumePDF() {
  // Try direct static file first (most reliable)
  const link = document.createElement('a');
  link.href = '/static/resume/Praveen_K_resume.pdf';
  link.download = 'Praveen_K_Resume.pdf';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
window.downloadResumePDF = downloadResumePDF;

/* ── PROJECTS — DNA HELIX SCROLL ────────────────────────── */
(function initDNA() {

  const wrap  = document.getElementById('dnaScrollWrap');
  const track = document.getElementById('dnaTrack');
  const nodes = document.querySelectorAll('.dna-node');
  const dotsWrap = document.getElementById('dnaProgressDots');
  if (!wrap || !nodes.length) return;

  const CARD_W = 340;
  let activeIdx = 0;

  /* ── Build progress dots ── */
  nodes.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dna-progress-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => snapTo(i));
    dotsWrap && dotsWrap.appendChild(d);
  });

  /* ── Classify nodes by distance from active ── */
  function updateNodes(idx) {
    activeIdx = idx;
    nodes.forEach((node, i) => {
      const dist = Math.abs(i - idx);
      node.classList.remove('active','near','far');
      if (dist === 0) node.classList.add('active');
      else if (dist === 1) node.classList.add('near');
      else node.classList.add('far');
    });
    // Update dots
    document.querySelectorAll('.dna-progress-dot').forEach((d, i) =>
      d.classList.toggle('active', i === idx));
  }

  /* ── Snap scroll to a node ── */
  function snapTo(idx) {
    const target = nodes[idx];
    if (!target) return;
    const nodeCenter = target.offsetLeft + CARD_W / 2;
    const wrapCenter = wrap.offsetWidth / 2;
    wrap.scrollTo({ left: nodeCenter - wrapCenter, behavior: 'smooth' });
    updateNodes(idx);
  }

  /* ── On scroll: find closest node ── */
  let scrollTimer;
  wrap.addEventListener('scroll', () => {
    const wrapCenter = wrap.scrollLeft + wrap.offsetWidth / 2;
    let closest = 0, minDist = Infinity;
    nodes.forEach((node, i) => {
      const nodeCenter = node.offsetLeft + CARD_W / 2;
      const dist = Math.abs(nodeCenter - wrapCenter);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    updateNodes(closest);

    // Snap after scroll stops
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => snapTo(closest), 120);
  }, { passive: true });

  /* ── Drag to scroll ── */
  let isDown = false, startX = 0, scrollLeft = 0;
  wrap.addEventListener('mousedown', e => {
    isDown = true; startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft; wrap.style.cursor = 'grabbing';
  });
  wrap.addEventListener('mouseleave', () => { isDown = false; wrap.style.cursor = 'grab'; });
  wrap.addEventListener('mouseup',    () => { isDown = false; wrap.style.cursor = 'grab'; });
  wrap.addEventListener('mousemove',  e => {
    if (!isDown) return; e.preventDefault();
    wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX) * 1.4;
  });

  /* ── Touch swipe ── */
  let tx = 0;
  wrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive:true });
  wrap.addEventListener('touchend', e => {
    const dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 30) snapTo(Math.max(0, Math.min(nodes.length-1, activeIdx + (dx>0?1:-1))));
  });

  /* ── Keyboard ── */
  document.addEventListener('keydown', e => {
    const r = wrap.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      if (e.key === 'ArrowRight') snapTo(Math.min(nodes.length-1, activeIdx+1));
      if (e.key === 'ArrowLeft')  snapTo(Math.max(0, activeIdx-1));
    }
  });

  /* ── Live DNA canvas background ── */
  (function initDNACanvas() {
    const canvas = document.getElementById('dnaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Get accent color from CSS var (fallback cyan)
    function getAccent() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#00e5ff';
    }

    let frame = 0;
    const NODES = 60;   // base pairs along helix
    const AMP   = 90;   // vertical amplitude
    const FREQ  = 0.09; // wave frequency

    function draw() {
      requestAnimationFrame(draw);
      frame += 0.012;

      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const accent = getAccent();

      for (let i = 0; i < NODES; i++) {
        const t   = (i / NODES);
        const x   = t * W;
        const phase = t * Math.PI * 2 * 3.5 + frame; // 3.5 full twists

        // Two strands of the helix
        const y1 = H/2 + Math.sin(phase)         * AMP;
        const y2 = H/2 + Math.sin(phase + Math.PI) * AMP;

        // Depth: closer to center of helix = brighter
        const depth1 = (Math.sin(phase) + 1) / 2;         // 0..1
        const depth2 = (Math.sin(phase + Math.PI) + 1) / 2;

        // Strand 1 node (cyan/accent)
        const r1 = 4 + depth1 * 8;
        const a1 = 0.15 + depth1 * 0.7;
        ctx.beginPath();
        ctx.arc(x, y1, r1, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(accent, a1);
        ctx.shadowColor = accent;
        ctx.shadowBlur  = depth1 * 18;
        ctx.fill();

        // Strand 2 node (accent-alt / pink)
        const r2 = 4 + depth2 * 8;
        const a2 = 0.15 + depth2 * 0.7;
        ctx.beginPath();
        ctx.arc(x, y2, r2, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba('#ff2d78', a2 * 0.8);
        ctx.shadowColor = '#ff2d78';
        ctx.shadowBlur  = depth2 * 14;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Cross-bar (base pair)
        if (i % 3 === 0) {
          const midDepth = (depth1 + depth2) / 2;
          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.strokeStyle = hexToRgba(accent, 0.08 + midDepth * 0.18);
          ctx.lineWidth   = 1 + midDepth * 1.5;
          ctx.stroke();
        }

        // Connecting line between nodes on same strand
        if (i > 0) {
          const prevT  = (i-1) / NODES;
          const prevX  = prevT * W;
          const prevPh = prevT * Math.PI * 2 * 3.5 + frame;
          const pY1    = H/2 + Math.sin(prevPh)         * AMP;
          const pY2    = H/2 + Math.sin(prevPh + Math.PI) * AMP;

          ctx.beginPath();
          ctx.moveTo(prevX, pY1);
          ctx.lineTo(x, y1);
          ctx.strokeStyle = hexToRgba(accent, 0.12);
          ctx.lineWidth   = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(prevX, pY2);
          ctx.lineTo(x, y2);
          ctx.strokeStyle = hexToRgba('#ff2d78', 0.1);
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }
    }

    function hexToRgba(hex, alpha) {
      hex = hex.replace('#','');
      if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
      const r = parseInt(hex.slice(0,2),16);
      const g = parseInt(hex.slice(2,4),16);
      const b = parseInt(hex.slice(4,6),16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    draw();
  })();

  /* ── Init ── */
  updateNodes(0);
  // Centre first card after layout
  setTimeout(() => snapTo(0), 100);

})();

