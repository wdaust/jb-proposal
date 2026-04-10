import { prefersReducedMotion } from './utils.js';

export function initScrollEngine() {
  if (prefersReducedMotion()) {
    showAllContent();
    return;
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP not loaded, falling back to static display');
    showAllContent();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  initEntrance();
  initHero();
  initOverview();
  initStepReveals();
  initShockStat();
  initDataWall();
  initPlatformLayers();
  initTimeline();
  initConclusion();
}

function showAllContent() {
  document.querySelectorAll('.reveal, [data-gsap]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.querySelectorAll('.entrance-logo, .entrance-subtitle').forEach(el => {
    el.style.opacity = '1';
  });
  const rule = document.querySelector('.entrance-rule');
  if (rule) rule.style.width = '200px';
}

function initEntrance() {
  const section = document.getElementById('entrance');
  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 1,
    }
  });

  tl.to('.entrance-logo', { opacity: 1, duration: 0.3 })
    .to('.entrance-rule', { width: '200px', duration: 0.3 }, '+=0.1')
    .to('.entrance-subtitle', { opacity: 1, duration: 0.3 }, '+=0.1')
    .to(section, { opacity: 0, duration: 0.3 }, '+=0.2');
}

function initHero() {
  const section = document.getElementById('hero');
  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=150%',
      pin: true,
      scrub: 1,
    }
  });

  tl.from('.hero__headline', { opacity: 0, y: 40, duration: 0.4 })
    .from('.hero__body', { opacity: 0, y: 30, duration: 0.4 }, '-=0.1')
    .from('.hero__rule', { width: 0, duration: 0.3 }, '-=0.1')
    .from('.scroll-indicator', { opacity: 0, duration: 0.2 }, '-=0.1')
    .to({}, { duration: 0.3 }) // pause to breathe
    .to(section, { opacity: 0, duration: 0.3 });
}

function initOverview() {
  const section = document.getElementById('overview');
  if (!section) return;

  const nodes = section.querySelectorAll('.overview-node');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${300 * nodes.length}%`,
      pin: true,
      scrub: 1,
    }
  });

  tl.from('.overview__title', { opacity: 0, y: 30, duration: 0.3 });

  nodes.forEach((node, i) => {
    const direction = i % 2 === 0 ? -40 : 40;
    tl.from(node, { opacity: 0, x: direction, duration: 0.3 }, `+=${i === 0 ? 0.1 : 0.05}`);
  });

  tl.to({}, { duration: 0.2 }); // pause at end
}

function initStepReveals() {
  document.querySelectorAll('.section--step').forEach(section => {
    const badge = section.querySelector('.step-badge');
    const heading = section.querySelector('.heading-1, .heading-2');
    const body = section.querySelector('.step-header .body-text');

    if (badge) {
      gsap.from(badge, {
        scrollTrigger: { trigger: badge, start: 'top 85%' },
        opacity: 0, x: -30, duration: 0.6, ease: 'power3.out'
      });
    }
    if (heading) {
      gsap.from(heading, {
        scrollTrigger: { trigger: heading, start: 'top 85%' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
      });
    }
    if (body) {
      gsap.from(body, {
        scrollTrigger: { trigger: body, start: 'top 85%' },
        opacity: 0, y: 20, duration: 0.8, delay: 0.1, ease: 'power3.out'
      });
    }
  });
}

function initShockStat() {
  const section = document.getElementById('step-3');
  const shock = section?.querySelector('.shock-stat');
  if (!shock) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: shock,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 1,
    }
  });

  tl.from('.shock-stat__number', { opacity: 0, scale: 0.8, duration: 0.5, ease: 'back.out(1.7)' })
    .from('.shock-stat__label', { opacity: 0, y: 20, duration: 0.3 })
    .from('.shock-stat__sublabel', { opacity: 0, y: 10, scale: 1.1, duration: 0.3 })
    .to({}, { duration: 0.4 }); // breathe
}

function initDataWall() {
  const wall = document.querySelector('.data-wall');
  if (!wall) return;

  const items = wall.querySelectorAll('.data-wall__item');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wall,
      start: 'top center',
      end: '+=200%',
      pin: true,
      scrub: 1,
    }
  });

  items.forEach((item, i) => {
    tl.to(item, { opacity: 1, duration: 0.3 }, i * 0.2);
    const bar = item.querySelector('.data-wall__bar-fill');
    if (bar) {
      tl.to(bar, { width: '100%', duration: 0.4 }, i * 0.2 + 0.15);
    }
  });

  tl.to({}, { duration: 0.3 }); // breathe
}

function initPlatformLayers() {
  const section = document.getElementById('platform');
  if (!section) return;

  const layers = section.querySelectorAll('.platform-layer');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=400%`,
      pin: true,
      scrub: 1,
    }
  });

  tl.from('.platform__title', { opacity: 0, y: 30, duration: 0.3 });

  layers.forEach((layer, i) => {
    tl.to(layer, {
      opacity: 1,
      rotateX: 0,
      duration: 0.4,
      ease: 'power3.out'
    }, 0.2 + i * 0.3);
  });

  tl.from('.platform__tagline', { opacity: 0, y: 20, duration: 0.3 }, '+=0.1')
    .to({}, { duration: 0.3 }); // breathe
}

function initTimeline() {
  const section = document.getElementById('timeline');
  if (!section) return;

  const track = section.querySelector('.timeline-track');
  const milestones = section.querySelectorAll('.timeline-milestone');
  if (!track || !milestones.length) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
    }
  });

  tl.from('.timeline__title', { opacity: 0, y: 30, duration: 0.3 });
  tl.to('.timeline-line__fill', { width: '100%', duration: 1, ease: 'none' });

  milestones.forEach((ms, i) => {
    tl.from(ms, {
      opacity: 0,
      y: i % 2 === 0 ? -30 : 30,
      duration: 0.3,
    }, 0.15 + i * 0.15);
  });

  tl.to({}, { duration: 0.2 });
}

function initConclusion() {
  const section = document.getElementById('conclusion');
  if (!section) return;

  gsap.from('.conclusion__headline', {
    scrollTrigger: { trigger: '.conclusion__headline', start: 'top 80%' },
    opacity: 0, y: 40, duration: 1.4, ease: 'expo.out'
  });

  gsap.from('.conclusion__body', {
    scrollTrigger: { trigger: '.conclusion__body', start: 'top 80%' },
    opacity: 0, y: 20, duration: 1, delay: 0.3, ease: 'expo.out'
  });

  gsap.from('.conclusion__signature', {
    scrollTrigger: { trigger: '.conclusion__signature', start: 'top 85%' },
    opacity: 0, duration: 0.8, delay: 0.5, ease: 'expo.out'
  });
}
