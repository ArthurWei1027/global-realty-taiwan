(function () {
  function animateValue(el, target, duration) {
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function initStatsCount() {
    const roots = document.querySelectorAll('[data-stats-count]');
    if (!roots.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const run = (root) => {
      root.querySelectorAll('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count || 0);
        if (reduceMotion) {
          el.textContent = `${el.dataset.prefix || ''}${target}${el.dataset.suffix || ''}`;
          return;
        }
        animateValue(el, target, 1400);
      });
    };

    if (!('IntersectionObserver' in window)) {
      roots.forEach(run);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          run(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    roots.forEach((root) => observer.observe(root));
  }

  document.addEventListener('DOMContentLoaded', initStatsCount);
})();
