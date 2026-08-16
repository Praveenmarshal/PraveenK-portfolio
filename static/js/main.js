/* ═══════════════════════════════════════════════════════════════
   PRAVEEN K — DATA ANALYST PORTFOLIO
   Main JavaScript — Dark Cinematic Theme
   ═══════════════════════════════════════════════════════════════ */

/* ── THEME INIT (single dark theme) ─────────────────────── */
document.documentElement.setAttribute('data-theme', 'dark');

/* ── SCROLL SEQUENCE BACKGROUND ─────────────────────────── */
(function initScrollSequence() {
  const canvas = document.getElementById('bgSequenceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const TOTAL_FRAMES = 270;
  const images = new Array(TOTAL_FRAMES).fill(null);
  let currentFrame = 0;
  let targetFrame = 0;
  let isTicking = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    renderFrame(Math.round(currentFrame));
  }
  window.addEventListener('resize', resize);
  resize();

  function framePath(i) {
    return '/static/images/sequence/' + String(i + 1).padStart(5, '0') + '.jpg';
  }

  // Preload first frame immediately
  const first = new Image();
  first.src = framePath(0);
  first.onload = function () {
    images[0] = first;
    renderFrame(0);
  };

  // Progressive preload: every 5th frame first, then fill gaps
  let tier = 0;
  function preloadTier() {
    const step = tier === 0 ? 5 : 1;
    let loaded = 0, total = 0;
    for (let i = 0; i < TOTAL_FRAMES; i += step) {
      if (images[i]) continue;
      total++;
      const img = new Image();
      img.src = framePath(i);
      img.onload = function () {
        images[i] = img;
        loaded++;
        if (loaded === total && tier === 0) { tier = 1; preloadTier(); }
      };
    }
    if (total === 0 && tier === 0) { tier = 1; preloadTier(); }
  }
  preloadTier();

  function renderFrame(idx) {
    idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, idx));
    let img = images[idx];
    if (!img) {
      for (let d = 1; d < TOTAL_FRAMES; d++) {
        if (images[idx - d]) { img = images[idx - d]; break; }
        if (images[idx + d]) { img = images[idx + d]; break; }
      }
    }
    if (!img) return;

    const cw = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
    const ch = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw, dh, dx, dy;
    if (cr > ir) { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
    else { dh = ch; dw = ch * ir; dy = 0; dx = (cw - dw) / 2; }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function updateScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollFrac = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    targetFrame = scrollFrac * (TOTAL_FRAMES - 1);
    if (!isTicking) { isTicking = true; requestAnimationFrame(animStep); }
  }

  function animStep() {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) < 0.05) {
      currentFrame = targetFrame;
      renderFrame(Math.round(currentFrame));
      isTicking = false;
    } else {
      currentFrame += diff * 0.16;
      renderFrame(Math.round(currentFrame));
      requestAnimationFrame(animStep);
    }
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  setTimeout(updateScroll, 50);
})();

/* ── LOADER ─────────────────────────────────────────────── */
const loaderMessages = [
  'INITIALISING SYSTEMS...', 'LOADING DATA MODULES...', 'COMPILING PORTFOLIO...',
  'CONNECTING TO ANALYTICS ENGINE...', 'READY.'
];
let msgIdx = 0;
const loaderText = document.getElementById('loaderText');
const loaderFill = document.querySelector('.loader-fill');
const loader = document.getElementById('loader');

function advanceLoader() {
  if (!loaderText) return;
  msgIdx++;
  if (loaderFill) loaderFill.style.width = (msgIdx / loaderMessages.length * 100) + '%';
  if (msgIdx < loaderMessages.length) {
    loaderText.textContent = loaderMessages[msgIdx];
    setTimeout(advanceLoader, 400 + Math.random() * 300);
  } else {
    setTimeout(function() {
      if (loader) loader.classList.add('hidden');
    }, 400);
  }
}
setTimeout(advanceLoader, 600);

/* ── PAGE PROGRESS BAR ────────────────────────────────────── */
const pageProgress = document.getElementById('pageProgress');
window.addEventListener('scroll', function() {
  if (!pageProgress) return;
  const pct = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight) * 100;
  pageProgress.style.width = pct + '%';
}, { passive: true });

/* ── CUSTOM CURSOR ────────────────────────────────────────── */
(function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || !window.matchMedia('(pointer:fine)').matches) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function followRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(followRing);
  }
  followRing();

  document.querySelectorAll('a,button,[data-magnet],.contact-btn,.live-project-btn').forEach(function(el) {
    el.addEventListener('mouseenter', function() { ring.classList.add('hover'); });
    el.addEventListener('mouseleave', function() { ring.classList.remove('hover'); });
  });
})();

/* ── FADE-IN ON SCROLL ────────────────────────────────────── */
(function initFadeIn() {
  const els = document.querySelectorAll('[data-fade]');
  els.forEach(function(el) {
    const y = parseFloat(el.dataset.fadeY) || 30;
    const x = parseFloat(el.dataset.fadeX) || 0;
    el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  });

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.fadeDelay) || 0;
        setTimeout(function() {
          el.classList.add('visible');
        }, delay * 1000);
        observer.unobserve(el);
      }
    });
  }, { rootMargin: '50px', threshold: 0 });

  els.forEach(function(el) { observer.observe(el); });
})();

/* ── MAGNETIC HOVER EFFECT ────────────────────────────────── */
(function initMagnet() {
  document.querySelectorAll('[data-magnet]').forEach(function(el) {
    const padding = parseInt(el.dataset.magnetPadding) || 100;
    const strength = parseInt(el.dataset.magnetStrength) || 3;
    let active = false;

    el.style.willChange = 'transform';

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.max(rect.width, rect.height) / 2 + padding;

      if (dist < maxDist) {
        if (!active) {
          active = true;
          el.style.transition = 'transform 0.3s ease-out';
        }
        el.style.transform = 'translate3d(' + (dx / strength) + 'px, ' + (dy / strength) + 'px, 0)';
      } else if (active) {
        active = false;
        el.style.transition = 'transform 0.6s ease-in-out';
        el.style.transform = 'translate3d(0, 0, 0)';
      }
    }

    document.addEventListener('mousemove', onMove);
  });
})();

/* ── MARQUEE SCROLL ─────────────────────────────────────── */
(function initMarquee() {
  const section = document.getElementById('marqueeSection');
  const row1 = document.querySelector('.marquee-row-1');
  const row2 = document.querySelector('.marquee-row-2');
  if (!section || !row1 || !row2) return;

  // Use background sequence frames as tiles
  var tiles1 = [], tiles2 = [];
  for (var i = 1; i <= 11; i++) {
    tiles1.push('/static/images/sequence/' + String(i * 5).padStart(5, '0') + '.jpg');
  }
  for (var i = 12; i <= 21; i++) {
    tiles2.push('/static/images/sequence/' + String(i * 5).padStart(5, '0') + '.jpg');
  }

  // Triple for seamless loop
  function buildRow(row, srcs) {
    var tripled = srcs.concat(srcs).concat(srcs);
    tripled.forEach(function(src) {
      var img = document.createElement('img');
      img.src = src;
      img.className = 'marquee-tile';
      img.loading = 'lazy';
      img.alt = '';
      row.appendChild(img);
    });
  }
  buildRow(row1, tiles1);
  buildRow(row2, tiles2);

  function onScroll() {
    var rect = section.getBoundingClientRect();
    var sectionTop = window.scrollY + rect.top;
    var offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
    row1.style.transform = 'translateX(' + (offset - 200) + 'px)';
    row2.style.transform = 'translateX(' + (-(offset - 200)) + 'px)';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── CHARACTER-BY-CHARACTER SCROLL REVEAL ────────────────── */
(function initAnimatedText() {
  var els = document.querySelectorAll('.animated-text[data-scroll-reveal]');
  els.forEach(function(el) {
    var text = el.textContent;
    el.textContent = '';
    el.style.position = 'relative';

    var chars = [];
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'char';
      // Invisible placeholder for layout
      var placeholder = document.createElement('span');
      placeholder.style.visibility = 'hidden';
      placeholder.textContent = text[i] === ' ' ? '\u00A0' : text[i];
      span.appendChild(placeholder);
      // Animated character
      var inner = document.createElement('span');
      inner.className = 'char-inner';
      inner.style.position = 'absolute';
      inner.style.left = '0';
      inner.style.top = '0';
      inner.textContent = text[i] === ' ' ? '\u00A0' : text[i];
      span.appendChild(inner);
      el.appendChild(span);
      chars.push(inner);
    }

    function onScroll() {
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight;
      // Start when element enters at 80% of viewport, end when at 20%
      var start = vh * 0.8;
      var end = vh * 0.2;
      var progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));

      for (var i = 0; i < chars.length; i++) {
        var charProgress = i / chars.length;
        var opacity = 0.2 + 0.8 * Math.max(0, Math.min(1, (progress - charProgress * 0.7) / 0.3));
        chars[i].style.opacity = opacity;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });
})();

/* ── STICKY CARD SCALING ────────────────────────────────── */
(function initStickyCards() {
  var cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;
  var total = cards.length;

  function onScroll() {
    cards.forEach(function(card, i) {
      var container = card.closest('.project-card-container');
      if (!container) return;
      var rect = container.getBoundingClientRect();
      var scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      var targetScale = 1 - (total - 1 - i) * 0.03;
      var scale = 1 - (1 - targetScale) * scrollProgress;
      scale = Math.max(targetScale, Math.min(1, scale));
      card.style.transform = 'scale(' + scale + ')';
      card.style.top = (96 + i * 28) + 'px';
    });
  }

  // Only enable sticky on desktop
  if (window.innerWidth >= 640) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();

/* ── SMOOTH ANCHOR SCROLL ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   PRESERVED FUNCTIONALITY — CHATBOT, CONTACT, RESUME
   ═══════════════════════════════════════════════════════════ */

/* ── CHATBOT ──────────────────────────────────────────────── */
function toggleChatbot() {
  var w = document.getElementById('chatbotWindow');
  if (w) w.classList.toggle('open');
}

function sendMessage() {
  var input = document.getElementById('chatInput');
  var msg = input ? input.value.trim() : '';
  if (!msg) return;

  appendMsg(msg, 'user');
  input.value = '';

  // Hide quick replies after first message
  var qr = document.getElementById('quickReplies');
  if (qr) qr.style.display = 'none';

  // Call backend
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: msg })
  })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      appendMsg(data.reply || data.response || 'Sorry, I couldn\'t process that.', 'bot');
    })
    .catch(function() {
      appendMsg('Hmm, something went wrong. Please try again.', 'bot');
    });
}

function sendQuickReply(text) {
  var input = document.getElementById('chatInput');
  if (input) input.value = text;
  sendMessage();
}

function appendMsg(text, type) {
  var box = document.getElementById('chatMessages');
  if (!box) return;
  var div = document.createElement('div');
  div.className = 'chat-msg ' + type;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// Enter key sends message
(function() {
  var input = document.getElementById('chatInput');
  if (input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
    });
  }
})();

function exportChatHistory() {
  var msgs = document.querySelectorAll('#chatMessages .chat-msg');
  var text = '';
  msgs.forEach(function(m) {
    var role = m.classList.contains('bot') ? 'AI' : 'You';
    text += role + ': ' + m.textContent + '\n\n';
  });
  var blob = new Blob([text], { type: 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'chat-history.txt';
  a.click();
}

/* ── CONTACT FORM ─────────────────────────────────────────── */
(function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var name = document.getElementById('formName');
    var email = document.getElementById('formEmail');
    var msg = document.getElementById('formMsg');
    var valid = true;

    // Clear errors
    form.querySelectorAll('.form-group').forEach(function(g) { g.classList.remove('error'); });

    if (!name || name.value.trim().length < 2) {
      name.closest('.form-group').classList.add('error');
      valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.closest('.form-group').classList.add('error');
      valid = false;
    }
    if (!msg || msg.value.trim().length < 10) {
      msg.closest('.form-group').classList.add('error');
      valid = false;
    }

    if (!valid) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        message: msg.value.trim()
      })
    })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (submitBtn) { submitBtn.textContent = '✓ Sent!'; }
        form.reset();
        setTimeout(function() {
          if (submitBtn) { submitBtn.textContent = 'Send Message →'; submitBtn.disabled = false; }
        }, 3000);
      })
      .catch(function() {
        if (submitBtn) { submitBtn.textContent = 'Error — Try Again'; submitBtn.disabled = false; }
      });
  });
})();

/* ── RESUME DOWNLOAD ──────────────────────────────────────── */
function downloadResumePDF() {
  fetch('/api/resume')
    .then(function(r) {
      if (!r.ok) throw new Error('No resume');
      return r.blob();
    })
    .then(function(blob) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Praveen_K_Resume.pdf';
      a.click();
    })
    .catch(function() {
      alert('Resume not available at the moment. Please contact me directly.');
    });
}
