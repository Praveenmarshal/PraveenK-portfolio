/* ═══════════════════════════════════════════════════════════════
   PRAVEEN K — DATA ANALYST PORTFOLIO
   Main JavaScript — Dark Cinematic Theme
   ═══════════════════════════════════════════════════════════════ */

/* ── THEME INIT (single dark theme) ─────────────────────── */
document.documentElement.setAttribute('data-theme', 'dark');

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

  const gifs = [
    'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
    'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
    'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
    'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
    'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
    'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
    'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
    'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
    'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
    'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
    'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
    'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
    'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
    'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
    'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
    'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
    'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
    'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
    'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
    'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
    'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif'
  ];

  const tiles1 = gifs.slice(0, 11);
  const tiles2 = gifs.slice(11);

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
  var isTicking = false;

  function update() {
    var vh = window.innerHeight;
    var baseTop = window.innerWidth >= 768 ? 100 : (window.innerWidth >= 640 ? 90 : 70);

    cards.forEach(function(card, i) {
      var container = card.closest('.project-card-container');
      if (!container) return;

      var rect = container.getBoundingClientRect();
      var stickyOffset = baseTop + i * 8;
      card.style.top = stickyOffset + 'px';

      // When the card container has reached stickyOffset, calculate progress towards next
      var scrollPast = stickyOffset - rect.top;
      var scrollRange = Math.max(1, rect.height - vh * 0.4);
      var progress = Math.max(0, Math.min(1, scrollPast / scrollRange));

      var targetScale = 1 - (total - 1 - i) * 0.02;
      var currentScale = 1 - (1 - targetScale) * progress;
      var clampedScale = Math.max(targetScale, Math.min(1, currentScale));

      card.style.transform = 'scale(' + clampedScale + ')';
    });
    isTicking = false;
  }

  function onScroll() {
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
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
