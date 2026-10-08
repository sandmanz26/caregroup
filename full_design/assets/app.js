// Shared interaction layer for the Shema hi-fi mockups — tabs, bottom sheets,
// scroll reveals, hero parallax, spotlight-border tracking, count-up numerals,
// and button ripple feedback. No framework, no build step.

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  // ---- Tabs ----
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const buttons = group.querySelectorAll('[data-tab-btn]');
    const panels = document.querySelectorAll(`[data-tab-panel][data-tabs-for="${group.dataset.tabs}"]`);
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.querySelector(
          `[data-tab-panel="${btn.dataset.tabBtn}"][data-tabs-for="${group.dataset.tabs}"]`
        );
        if (target) {
          target.classList.add('active');
          target.querySelectorAll('[data-reveal]').forEach((el, i) => {
            el.classList.remove('is-visible');
            setTimeout(() => el.classList.add('is-visible'), 40 + i * 60);
          });
        }
      });
    });
  });

  // ---- Bottom sheets ----
  document.querySelectorAll('[data-open-sheet]').forEach((el) => {
    el.addEventListener('click', () => {
      const sheet = document.getElementById(el.dataset.openSheet);
      if (sheet) sheet.style.display = 'flex';
    });
  });
  document.querySelectorAll('[data-close-sheet]').forEach((el) => {
    el.addEventListener('click', () => { el.closest('.sheet-overlay').style.display = 'none'; });
  });
  document.querySelectorAll('.sheet-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.style.display = 'none'; });
  });

  // ---- Scroll reveal, staggered by document order ----
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && revealEls.length) {
    let order = 0;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = Math.min(order * 55, 380);
          order++;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---- Hero parallax (rAF-throttled to avoid scroll-linked jank) ----
  const parallaxHeroes = Array.from(document.querySelectorAll('.hero-cover .hero-img'));
  if (parallaxHeroes.length) {
    let ticking = false;
    const update = () => {
      parallaxHeroes.forEach((img) => {
        const rect = img.closest('.hero-cover').getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        img.style.transform = `translateY(${(progress - 0.5) * 36}px) scale(1.06)`;
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  // ---- Spotlight border tracking ----
  document.querySelectorAll('.spotlight').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--sx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--sy', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });

  // ---- Count-up numerals ----
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isInt = Number.isInteger(target);
        const start = performance.now();
        const dur = 900;
        function tick(now) {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = (isInt ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => cio.observe(el));
  }

  // ---- Button ripple ----
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(r.width, r.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
});
