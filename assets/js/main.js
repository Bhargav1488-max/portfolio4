/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO JS: Chollangi Bhargav | AI Software Engineer
   ─────────────────────────────────────────────────────────────
   TABLE OF CONTENTS — search "§ N" to jump to any module:
   § 1  Config  — edit content here (phrases, stats, career date)
   § 2  Loader  — loading screen hide logic
   § 3  Cursor  — custom dot + ring cursor
   § 4  Theme   — dark / light mode toggle (persists in localStorage)
   § 5  Nav     — scroll behavior + hide/show + mobile hamburger
   § 6  Reveal  — IntersectionObserver scroll-triggered animations
   § 7  Typewriter — cycling role text effect
   § 8  Counters   — animated stat counters (years auto-calculated)
   § 9  SkillBars  — animated progress fills
   § 10 Filter     — project category tabs
   § 11 Modal      — project detail modal open/close
   § 12 Lightbox   — gallery full-screen image viewer
   § 13 Contact    — form submit handler
   § 14 Particles  — hero background canvas animation
   § 15 Init       — DOMContentLoaded bootstrap
   ═══════════════════════════════════════════════════════════════ */

/* ── § 1 CONFIG ─────────────────────────────────────────────── */
const CFG = {
  // ── Career start date → auto-calculates years of experience
  careerStart: new Date(2021, 4, 1),  // May 2021

  // ── Typewriter phrases (hero section)
  phrases: [
    'AI Software Engineer',
    'DevOps Specialist',
    'Cloud Architect',
    'RAG & LLM Builder',
    'Automation Expert',
  ],

  // ── Hero stats  (data-count="auto" uses careerStart calculation)
  stats: [
    { id: 'stat-years',    count: 'auto', suffix: '+', label: 'Years Experience' },
    { id: 'stat-companies',count: 4,      suffix: '',  label: 'Companies'        },
    { id: 'stat-projects', count: 10,     suffix: '+', label: 'Projects'         },
    { id: 'stat-certs',    count: 5,      suffix: '',  label: 'Certifications'   },
  ],
};

/* ── § 2 LOADER ─────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const hide = () => loader.classList.add('done');
  if (document.readyState === 'complete') {
    setTimeout(hide, 600);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 800));
  }
}

/* ── § 3 CURSOR ─────────────────────────────────────────────── */
function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  // Only show on pointer: fine devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animate() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  })();

  // Hover effect
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .card, .proj-card, .gallery-item, .flt-tab, .contact-item')) {
      ring.classList.add('hovered');
    } else {
      ring.classList.remove('hovered');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/* ── § 4 THEME TOGGLE ───────────────────────────────────────── */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  // Restore saved preference
  const saved = localStorage.getItem('cb-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  btn.textContent = saved === 'dark' ? '☀️' : '🌙';

  btn.addEventListener('click', () => {
    const cur  = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cb-theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

/* ── § 5 NAV ────────────────────────────────────────────────── */
function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!nav) return;

  // Scroll: transparent / solid + hide on scroll down / show on scroll up
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 20);
    nav.style.transform = (y > lastY && y > 240) ? 'translateY(-100%)' : 'translateY(0)';
    lastY = y;
  }, { passive: true });

  // Mobile hamburger
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
      if (open) {
        mobileNav.classList.add('open');
      } else {
        mobileNav.classList.remove('open');
      }
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
      });
    });
  }

  // Highlight active nav link based on current page
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && (href === page || (page === 'index.html' && href === './'))) {
      a.classList.add('active');
    }
  });
}

/* ── § 6 SCROLL REVEAL ──────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  els.forEach((el) => obs.observe(el));
}

/* ── § 7 TYPEWRITER ─────────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = CFG.phrases;
  let pi = 0, ci = 0, del = false, timer;

  function tick() {
    const phrase = phrases[pi];
    if (!del) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { del = true; timer = setTimeout(tick, 2400); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    timer = setTimeout(tick, del ? 46 : 88);
  }
  tick();
}

/* ── § 8 COUNTERS ───────────────────────────────────────────── */
function initCounters() {
  const years = Math.floor((Date.now() - CFG.careerStart) / (365.25 * 24 * 60 * 60 * 1000));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = el.dataset.count === 'auto' ? years : parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 45));
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + suffix;
        if (cur >= target) clearInterval(timer);
      }, 38);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach((el) => obs.observe(el));
}

/* ── § 9 SKILL BARS ─────────────────────────────────────────── */
function initSkillBars() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const bar = e.target;
      bar.style.width = bar.dataset.w || '80%';
      obs.unobserve(bar);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.skill-fill').forEach((b) => obs.observe(b));
}

/* ── § 10 PROJECT FILTER ────────────────────────────────────── */
function initFilter() {
  const tabs  = document.querySelectorAll('.flt-tab');
  const cards = document.querySelectorAll('.proj-card[data-cat]');
  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('on'));
      tab.classList.add('on');
      const f = tab.dataset.f;
      cards.forEach((card) => {
        const match = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('hidden', !match);
      });
    });
  });
}

/* ── § 11 MODAL ─────────────────────────────────────────────── */
function initModal() {
  const overlay = document.getElementById('projModal');
  if (!overlay) return;

  const body  = overlay.querySelector('.modal-body');
  const close = overlay.querySelector('.modal-close');

  // Open
  document.querySelectorAll('[data-modal]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const tpl = document.getElementById('tpl-' + trigger.dataset.modal);
      if (tpl && body) {
        body.innerHTML = tpl.innerHTML;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close helpers
  const closeModal = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };
  close?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

/* ── § 12 LIGHTBOX ──────────────────────────────────────────── */
function initLightbox() {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  if (!lb || !img) return;

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      if (src) {
        img.src = src;
        // Show caption if available
        const caption = document.getElementById('lbCaption');
        if (caption) caption.textContent = item.dataset.caption || '';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  // Support both .lightbox-close and #lbClose button used in gallery.html
  document.querySelector('.lightbox-close')?.addEventListener('click', close);
  document.getElementById('lbClose')?.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ── § 13 CONTACT FORM ──────────────────────────────────────── */
function initContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const data = new FormData(form);
    const subject = encodeURIComponent('Portfolio Contact: ' + (data.get('subject') || 'New Message'));
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
    );
    window.location.href = `mailto:chollangibhargav5@gmail.com?subject=${subject}&body=${body}`;
    // Show feedback
    if (btn) { btn.textContent = '✅ Opening email client…'; setTimeout(() => { btn.textContent = 'Send Message'; }, 3000); }
  });
}

/* ── § 14 PARTICLES ─────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = canvas.width  = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  function make() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.35,
      dy: -(Math.random() * 0.45 + 0.08),
      a: Math.random() * 0.45 + 0.08,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.a})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < 0 || p.x > W) p.dx *= -1;
    });
    requestAnimationFrame(draw);
  }

  resize();
  pts = Array.from({ length: 65 }, make);
  draw();
  window.addEventListener('resize', () => { resize(); pts = Array.from({ length: 65 }, make); });
}

/* ── § 15 INIT ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initTheme();
  initNav();
  initReveal();
  initTypewriter();
  initCounters();
  initSkillBars();
  initFilter();
  initModal();
  initLightbox();
  initContact();
  initParticles();
});
