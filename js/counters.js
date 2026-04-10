import { prefersReducedMotion, formatNumber } from './utils.js';

export function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  if (prefersReducedMotion()) {
    counters.forEach(el => showFinalValue(el));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        animateCounter(entry.target);
        entry.target.dataset.animated = 'true';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

function showFinalValue(el) {
  const target = parseFloat(el.dataset.counter);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimals || '0');

  if (decimals > 0) {
    el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
  } else {
    el.textContent = formatNumber(target, prefix, suffix);
  }
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.counter);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = parseInt(el.dataset.duration || '2500');
  const decimals = parseInt(el.dataset.decimals || '0');
  const startTime = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const current = target * easedProgress;

    if (decimals > 0) {
      el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
    } else {
      el.textContent = formatNumber(current, prefix, suffix);
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      showFinalValue(el);
    }
  }

  requestAnimationFrame(update);
}
