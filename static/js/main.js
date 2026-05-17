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

/* ── THREE.JS PARTICLE FIELD ─────────────────────────────── */
(function initThree() {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  // Particles
  const particleCount = 1800;
  const positions = new Float32Array(particleCount * 3);
  const colors    = new Float32Array(particleCount * 3);
  const sizes     = new Float32Array(particleCount);

  const palette = [
    new THREE.Color('#00e5ff'),
    new THREE.Color('#ff2d78'),
    new THREE.Color('#b400ff'),
    new THREE.Color('#ffd166'),
    new THREE.Color('#ffffff'),
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    sizes[i] = Math.random() * 2 + 0.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

  const mat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Connecting lines (sparse)
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00e5ff, transparent: true, opacity: 0.04,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const lineGeo = new THREE.BufferGeometry();
  const lineVerts = [];
  for (let i = 0; i < 120; i++) {
    lineVerts.push(
      (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8
    );
  }
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame += 0.003;

    particles.rotation.y = frame * 0.08 + mouseX * 0.3;
    particles.rotation.x = frame * 0.04 - mouseY * 0.2;

    // Subtle size pulse
    const s = mat.size;
    mat.size = 0.025 + Math.sin(frame * 2) * 0.003;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
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

/* ── SCROLL REVEAL ───────────────────────────────────────── */
function initReveal() {
  const targets = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  targets.forEach(t => obs.observe(t));
}

/* ── COUNTERS ────────────────────────────────────────────── */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = +el.dataset.count;
      let start = 0;
      const dur = 1800;
      const step = dur / end;
      const timer = setInterval(() => {
        start++;
        el.textContent = start;
        if (start >= end) clearInterval(timer);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

/* ── HOLO CARD STATS (hero section) ─────────────────────── */
function initHoloStats() {
  const els = document.querySelectorAll('.hs-val[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = +el.dataset.count;
      let cur = 0;
      const t = setInterval(() => { el.textContent = ++cur; if (cur >= end) clearInterval(t); }, 300);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });
  els.forEach(el => obs.observe(el));
}

/* ── SKILL BARS ──────────────────────────────────────────── */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
    skillObs.unobserve(e.target);
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-category').forEach(s => skillObs.observe(s));

/* ── MAGNETIC BUTTONS ────────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width  / 2;
    const y = e.clientY - r.top  - r.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

/* ── RIPPLE ──────────────────────────────────────────────── */
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

/* ── HOLO CARD MOUSE TILT ────────────────────────────────── */
const holoCard = document.getElementById('holoCard');
if (holoCard) {
  holoCard.addEventListener('mousemove', e => {
    const r  = holoCard.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    holoCard.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.04)`;
    holoCard.style.animation = 'none';
  });
  holoCard.addEventListener('mouseleave', () => {
    holoCard.style.transform = '';
    holoCard.style.animation = '';
  });
}

/* ── VANILLA TILT (data-tilt elements) ───────────────────── */
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'));
}

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

/* ── PROJECTS HORIZONTAL SCROLL ──────────────────────────── */
(function initProjectsScroll() {
  const track   = document.getElementById('projectsTrack');
  const bar     = document.getElementById('projectsScrollBar');
  const count   = document.getElementById('projCount');
  const cards   = document.querySelectorAll('.project-card');
  if (!track || !cards.length) return;

  const CARD_W  = 340 + 28; // card width + gap
  let current   = 0;

  // Update scroll progress bar + counter
  function updateUI() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const pct = maxScroll > 0 ? (track.scrollLeft / maxScroll) * 100 : 0;
    if (bar) bar.style.width = Math.max(8, pct) + '%';

    // Active card
    const idx = Math.round(track.scrollLeft / CARD_W);
    current = Math.max(0, Math.min(idx, cards.length - 1));
    if (count) count.textContent = (current + 1) + ' / ' + cards.length;

    cards.forEach((c, i) => c.classList.toggle('active-card', i === current));
  }

  track.addEventListener('scroll', updateUI, { passive: true });

  // Arrow nav
  window.scrollProjects = function(dir) {
    const next = Math.max(0, Math.min(current + dir, cards.length - 1));
    track.scrollTo({ left: next * CARD_W, behavior: 'smooth' });
  };

  // Drag to scroll
  let isDown = false, startX = 0, scrollLeft = 0;
  track.addEventListener('mousedown', e => {
    isDown = true; startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft; track.style.cursor = 'grabbing';
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup',    () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove',  e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  // Touch support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchmove',  e => {
    const diff = touchStartX - e.touches[0].clientX;
    track.scrollLeft += diff * 0.8;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  // Keyboard arrow keys when hovering
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') scrollProjects(1);
    if (e.key === 'ArrowLeft')  scrollProjects(-1);
  });

  // Init
  updateUI();
  setTimeout(updateUI, 100);
})();
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}, { passive: true });

/* ── GLITCH EFFECT ON HERO NAME (random) ─────────────────── */
const nameRows = document.querySelectorAll('.name-row');
function triggerGlitch() {
  nameRows.forEach(el => {
    el.style.textShadow = `
      ${Math.random() * 6 - 3}px 0 #00e5ff,
      ${Math.random() * -6 + 3}px 0 #ff2d78
    `;
    setTimeout(() => el.style.textShadow = '', 80);
  });
}
setInterval(() => { if (Math.random() > 0.6) triggerGlitch(); }, 3000);
