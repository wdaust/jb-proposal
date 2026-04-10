export function initNav() {
  initProgressBar();
  initDotNav();
  initScrollToTop();
}

function initProgressBar() {
  const bar = document.getElementById('progress-bar-fill');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

function initDotNav() {
  const nav = document.getElementById('dot-nav');
  if (!nav) return;

  const dots = nav.querySelectorAll('.dot-nav__dot');
  const sections = document.querySelectorAll('section[id]');

  // Click to scroll
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.dataset.target;
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Highlight active dot on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach(d => d.classList.remove('is-active'));
        const activeDot = nav.querySelector(`[data-target="${id}"]`);
        if (activeDot) activeDot.classList.add('is-active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 2) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
