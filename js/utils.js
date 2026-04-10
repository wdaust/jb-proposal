export function debounce(fn, delay = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function throttle(fn, limit = 16) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function formatNumber(value, prefix = '', suffix = '') {
  const formatted = new Intl.NumberFormat('en-US').format(Math.round(value));
  return `${prefix}${formatted}${suffix}`;
}
