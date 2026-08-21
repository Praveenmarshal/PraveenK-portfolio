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

/* ── BIDIRECTIONAL SCROLL REVEAL (UP & DOWN) ──────────────── */
(function initFadeIn() {
  const els = document.querySelectorAll('[data-fade]');
  if (!els.length) return;

  function setInitialTransform(el) {
    const y = parseFloat(el.dataset.fadeY) || 30;
    const x = parseFloat(el.dataset.fadeX) || 0;
    el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  }

  els.forEach(setInitialTransform);

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      const el = entry.target;
      const delay = parseFloat(el.dataset.fadeDelay) || 0;

      if (entry.isIntersecting) {
        if (el._revealTimer) clearTimeout(el._revealTimer);
        el._revealTimer = setTimeout(function() {
          el.classList.add('visible');
        }, delay * 1000);
      } else {
        const rect = entry.boundingClientRect;
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (rect.bottom < -40 || rect.top > vh + 40) {
          if (el._revealTimer) clearTimeout(el._revealTimer);
          el.classList.remove('visible');
          setInitialTransform(el);
        }
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: [0, 0.1] });

  els.forEach(function(el) { observer.observe(el); });
})();

/* ── SKILL BARS SCROLL ANIMATION ──────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      const fill = entry.target;
      if (entry.isIntersecting) {
        const styleAttr = fill.getAttribute('style') || '';
        const match = styleAttr.match(/--skill-pct:\s*([^;]+)/);
        const targetPct = match ? match[1].trim() : '85%';
        fill.style.width = targetPct;
      } else {
        const rect = entry.boundingClientRect;
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (rect.bottom < -40 || rect.top > vh + 40) {
          fill.style.width = '0%';
        }
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: [0, 0.15] });

  bars.forEach(function(bar) {
    bar.style.width = '0%';
    bar.style.transition = 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
    observer.observe(bar);
  });
})();



/* ── UNMASK SECTIONS ON SCROLL (FRAMER LAYERED CURTAIN EFFECT) ── */
(function initUnmaskSectionsOnScroll() {
  const stages = [
    document.getElementById('hero'),
    document.getElementById('about'),
    document.getElementById('skillsExpStage') || document.getElementById('skills'),
    document.getElementById('projectsStage') || document.getElementById('projects'),
    document.getElementById('contact')
  ].filter(Boolean);

  if (stages.length < 2) return;

  let ticking = false;

  function updateUnmaskParallax() {
    const vh = window.innerHeight || document.documentElement.clientHeight;

    for (let i = 0; i < stages.length - 1; i++) {
      const current = stages[i];
      const next = stages[i + 1];
      const nextRect = next.getBoundingClientRect();

      // When the next section is rolling up and unmasking over the current section
      if (nextRect.top < vh && nextRect.top > -vh) {
        const unmaskProgress = Math.max(0, Math.min(1, (vh - nextRect.top) / (vh * 0.95)));
        const scale = (1 - unmaskProgress * 0.04).toFixed(3);
        const translateY = (unmaskProgress * -20).toFixed(1);
        const brightness = (1 - unmaskProgress * 0.16).toFixed(2);

        current.style.transform = 'scale(' + scale + ') translateY(' + translateY + 'px)';
        current.style.filter = 'brightness(' + brightness + ')';
      } else if (nextRect.top >= vh) {
        current.style.transform = 'scale(1) translateY(0px)';
        current.style.filter = 'brightness(1)';
      }
    }

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateUnmaskParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
  requestTick();
})();

/* ── SCROLL STACK ANIMATION (React Bits Stacking Cards) ────── */
(function initScrollStack() {
  const stacks = [
    { container: document.querySelector('.skills-list'), cards: Array.from(document.querySelectorAll('.skills-list .skill-item')) },
    { container: document.querySelector('.experience-timeline'), cards: Array.from(document.querySelectorAll('.experience-timeline .exp-item')) }
  ].filter(function(s) { return s.container && s.cards.length > 1; });

  if (!stacks.length) return;

  let ticking = false;

  function updateStacks() {
    stacks.forEach(function(stack) {
      const cards = stack.cards;
      const n = cards.length;

      const stickyTops = cards.map(function(card, idx) {
        return 95 + idx * 20;
      });

      const currentTops = cards.map(function(card) {
        return card.getBoundingClientRect().top;
      });

      cards.forEach(function(card, i) {
        let totalDepthEffect = 0;

        for (let j = i + 1; j < n; j++) {
          const targetTop = stickyTops[j];
          const actualTop = currentTops[j];

          if (actualTop <= targetTop) {
            totalDepthEffect += 1.0;
          } else if (actualTop < targetTop + 180) {
            const progress = (targetTop + 180 - actualTop) / 180;
            totalDepthEffect += progress;
          }
        }

        const scale = Math.max(0.82, 1 - totalDepthEffect * 0.038).toFixed(3);
        const brightness = Math.max(0.55, 1 - totalDepthEffect * 0.08).toFixed(2);

        card.style.transform = 'scale(' + scale + ')';
        card.style.filter = 'brightness(' + brightness + ')';
      });
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateStacks);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateStacks();
})();

/* ── BLINDS TEXT REVEAL COMPONENT (Framer BlindsTextReveal) ── */
(function initBlindsTextReveal() {
  const elements = document.querySelectorAll('[data-blinds-reveal]');
  if (!elements.length) return;

  elements.forEach(function(el) {
    if (el._blindsInitialised) return;
    el._blindsInitialised = true;

    const originalText = el.textContent.trim();
    const blindsColor = el.dataset.blindsColor || '#7621B0';
    const direction = el.dataset.blindsDir || 'left-to-right';
    const stagger = parseFloat(el.dataset.blindsStagger) || 0.08;
    const baseDelay = parseFloat(el.dataset.blindsDelay) || 0;
    const trigger = el.dataset.blindsTrigger || 'scroll';

    const words = originalText.split(/\s+/).filter(Boolean);
    el.textContent = '';

    const overlays = [];
    const inners = [];

    words.forEach(function(word, idx) {
      const wrap = document.createElement('span');
      wrap.className = 'blinds-line-wrap';
      wrap.style.setProperty('--blinds-color', blindsColor);

      const inner = document.createElement('span');
      inner.className = 'blinds-text-inner';
      inner.textContent = word;

      const overlay = document.createElement('span');
      overlay.className = 'blinds-overlay dir-' + direction;

      wrap.appendChild(inner);
      wrap.appendChild(overlay);
      el.appendChild(wrap);

      if (idx < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }

      overlays.push(overlay);
      inners.push(inner);
    });

    let hasAnimated = false;

    function playAnimation() {
      if (hasAnimated) return;
      hasAnimated = true;

      overlays.forEach(function(overlay, i) {
        const textInner = inners[i];
        const delay = (baseDelay + i * stagger) * 1000;

        setTimeout(function() {
          overlay.style.transition = 'transform 0.42s cubic-bezier(0.77, 0, 0.175, 1)';
          overlay.style.transform = 'translate(0, 0)';

          setTimeout(function() {
            textInner.style.opacity = '1';
            overlay.style.transition = 'transform 0.42s cubic-bezier(0.25, 1, 0.5, 1)';
            if (direction === 'left-to-right') {
              overlay.style.transform = 'translateX(101%)';
            } else if (direction === 'right-to-left') {
              overlay.style.transform = 'translateX(-101%)';
            } else if (direction === 'top-to-bottom') {
              overlay.style.transform = 'translateY(101%)';
            } else {
              overlay.style.transform = 'translateY(-101%)';
            }
          }, 420);
        }, delay);
      });
    }

    if (trigger === 'appear') {
      setTimeout(playAnimation, 300);
    } else {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            playAnimation();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      observer.observe(el);
    }
  });
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

  const techImages = [
    // Cybersecurity
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', // Cyber Hardware Lock
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', // Digital Defense Shield
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', // Binary Security Code
    'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80', // Cyber Network Encryption
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80', // Security Threat Operations
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', // Server Cloud Infrastructure
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80', // Cyber Neon Defense
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80', // AI Code Intelligence

    // Data Analysis
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', // Executive Analytics Dashboard
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', // Business Metrics Charts
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80', // Financial Candlestick Trends
    'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80', // Predictive Risk Models
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80', // Multi-Channel BI Reporting
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=800&q=80', // Business Intelligence Monitor
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80', // Statistical Data Insights
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', // Strategic Analytics Planning

    // Fullstack Development
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', // Fullstack Web Coding
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80', // Dark Code Editor IDE
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', // Laptop Software Engineering
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80', // Python Script Execution
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80', // Fullstack UI/UX & Web Apps
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80', // Backend Cloud Architecture
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', // JavaScript Web Programming
    'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80'  // Modern Dev Tech Console
  ];

  const tiles1 = techImages.slice(0, 12);
  const tiles2 = techImages.slice(12);

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
  var a = document.createElement('a');
  a.href = '/static/resume/Praveen_K_resume.pdf';
  a.download = 'Praveen_K_Resume.pdf';
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
  }, 100);

  // Track event in analytics
  try {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'resume_download' })
    }).catch(function() {});
  } catch (e) {}
}
