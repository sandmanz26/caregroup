// Shema hi-fi v3 — interaction layer. No framework, no build step.
// Tabs, bottom sheets, scroll reveal, count-up, chips, ripple,
// and the font-size setting (persisted in localStorage, applied on every page).

(function applyFontScale() {
  try {
    const v = localStorage.getItem('shema-v3-font-scale');
    if (v) document.documentElement.style.setProperty('--font-scale', v);
  } catch (e) {}
})();

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
  const closeAll = () => document.querySelectorAll('.sheet-overlay').forEach((o) => (o.style.display = 'none'));
  document.querySelectorAll('[data-open-sheet]').forEach((el) => {
    el.addEventListener('click', () => {
      closeAll();
      const sheet = document.getElementById(el.dataset.openSheet);
      if (sheet) {
        sheet.style.display = 'flex';
        const inner = sheet.querySelector('.sheet');
        if (inner) inner.scrollTop = 0;
      }
    });
  });
  document.querySelectorAll('[data-close-sheet]').forEach((el) => {
    el.addEventListener('click', () => { el.closest('.sheet-overlay').style.display = 'none'; });
  });
  document.querySelectorAll('.sheet-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.style.display = 'none'; });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

  // ---- Scroll reveal ----
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
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---- Count-up ----
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / 900);
          const val = target * (1 - Math.pow(1 - p, 3));
          el.textContent = Math.round(val) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => cio.observe(el));
  }

  // ---- Chips (single select) ----
  document.querySelectorAll('[data-chips]').forEach((group) => {
    group.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      document.querySelectorAll(`[data-chips="${group.dataset.chips}"] .chip`).forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const out = document.querySelector(`[data-chip-output="${group.dataset.chips}"]`);
      if (out) out.textContent = chip.textContent.trim();
    });
  });

  // ---- Font size setting ----
  document.querySelectorAll('[data-font-scale]').forEach((btn) => {
    const current = (() => { try { return localStorage.getItem('shema-v3-font-scale') || '1'; } catch (e) { return '1'; } })();
    if (btn.dataset.fontScale === current) btn.classList.add('active');
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-font-scale]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.style.setProperty('--font-scale', btn.dataset.fontScale);
      try { localStorage.setItem('shema-v3-font-scale', btn.dataset.fontScale); } catch (e) {}
    });
  });

  // ---- Button ripple ----
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
});
