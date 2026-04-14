/* ================================================================
   JB Strategic Proposal — Presentation Site
   All JavaScript consolidated for file:// compatibility
   ================================================================ */

(function() {
  'use strict';

  // ── Utilities ──────────────────────────────────────────────────
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function formatNumber(value, prefix, suffix) {
    prefix = prefix || '';
    suffix = suffix || '';
    var formatted = Math.round(value).toLocaleString('en-US');
    return prefix + formatted + suffix;
  }

  // ── Animated Counters ─────────────────────────────────────────
  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    if (prefersReducedMotion()) {
      counters.forEach(showFinalValue);
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          animateCounter(entry.target);
          entry.target.dataset.animated = 'true';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function(el) { observer.observe(el); });
  }

  function showFinalValue(el) {
    var target = parseFloat(el.dataset.counter);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var decimals = parseInt(el.dataset.decimals || '0');
    if (decimals > 0) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
    } else {
      el.textContent = formatNumber(target, prefix, suffix);
    }
  }

  function animateCounter(el) {
    var target = parseFloat(el.dataset.counter);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var duration = parseInt(el.dataset.duration || '2500');
    var decimals = parseInt(el.dataset.decimals || '0');
    var startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutExpo(progress);
      var current = target * easedProgress;

      if (decimals > 0) {
        el.textContent = prefix + current.toFixed(decimals) + suffix;
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

  // ── Scroll Reveals ────────────────────────────────────────────
  function initReveals() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (prefersReducedMotion()) {
      reveals.forEach(function(el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function(el) { observer.observe(el); });
  }

  // ── Navigation ────────────────────────────────────────────────
  function initProgressBar() {
    var bar = document.getElementById('progress-bar-fill');
    if (!bar) return;

    window.addEventListener('scroll', function() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  function initDotNav() {
    var nav = document.getElementById('dot-nav');
    if (!nav) return;

    var dots = nav.querySelectorAll('.dot-nav__dot');
    var sections = document.querySelectorAll('section[id]');

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        var targetId = dot.dataset.target;
        var target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          dots.forEach(function(d) { d.classList.remove('is-active'); });
          var activeDot = nav.querySelector('[data-target="' + id + '"]');
          if (activeDot) activeDot.classList.add('is-active');
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(function(section) { observer.observe(section); });
  }

  function initScrollToTop() {
    var btn = document.getElementById('scroll-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > window.innerHeight * 2) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── GSAP Scroll Engine ────────────────────────────────────────
  function initScrollEngine() {
    if (prefersReducedMotion()) {
      showAllContent();
      return;
    }

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP not loaded — showing static content');
      showAllContent();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

    // Smooth defaults
    gsap.defaults({ ease: 'power3.out' });

    // Entrance is CSS-animated on load — no GSAP needed
    initHero();
    initGSAPReveals();
  }

  function showAllContent() {
    document.querySelectorAll('.reveal').forEach(function(el) {
      el.classList.add('is-visible');
    });
    var logo = document.querySelector('.entrance-logo');
    var subtitle = document.querySelector('.entrance-subtitle');
    var rule = document.querySelector('.entrance-rule');
    if (logo) logo.style.opacity = '1';
    if (subtitle) subtitle.style.opacity = '1';
    if (rule) rule.style.width = '200px';

    // Show data wall items
    document.querySelectorAll('.data-wall__item').forEach(function(el) {
      el.style.opacity = '1';
    });
  }

  function initEntrance() {
    var section = document.getElementById('entrance');
    if (!section) return;

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 0.8,
      }
    });

    tl.to('.entrance-logo', { opacity: 1, duration: 0.4 })
      .to('.entrance-rule', { width: '200px', duration: 0.3 }, '+=0.05')
      .to('.entrance-subtitle', { opacity: 1, duration: 0.3 }, '+=0.05')
      .to({}, { duration: 0.3 })
      .to(section, { opacity: 0, duration: 0.2 });
  }

  function initHero() {
    var section = document.getElementById('hero');
    if (!section) return;

    // Animate hero content on entry
    gsap.from('.hero__headline', {
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
      },
      opacity: 0, y: 50, duration: 1.2, ease: 'expo.out'
    });

    gsap.from('.hero__body', {
      scrollTrigger: {
        trigger: section,
        start: 'top 50%',
      },
      opacity: 0, y: 30, duration: 1, delay: 0.3, ease: 'expo.out'
    });

    gsap.from('.hero__rule', {
      scrollTrigger: {
        trigger: section,
        start: 'top 50%',
      },
      width: 0, duration: 0.8, delay: 0.5, ease: 'expo.out'
    });
  }

  function initGSAPReveals() {
    // Step badges
    document.querySelectorAll('.step-badge').forEach(function(badge) {
      gsap.from(badge, {
        scrollTrigger: { trigger: badge, start: 'top 88%' },
        opacity: 0, x: -30, duration: 0.6
      });
    });

    // Data wall items — staggered reveal
    var dataItems = document.querySelectorAll('.data-wall__item');
    dataItems.forEach(function(item, i) {
      gsap.to(item, {
        scrollTrigger: { trigger: item, start: 'top 80%' },
        opacity: 1, duration: 0.8, delay: i * 0.2
      });

      var barFill = item.querySelector('.data-wall__bar-fill');
      if (barFill) {
        gsap.to(barFill, {
          scrollTrigger: { trigger: item, start: 'top 75%' },
          width: '100%', duration: 1.5, delay: i * 0.2 + 0.3, ease: 'expo.out'
        });
      }
    });

    // Platform layers
    document.querySelectorAll('.platform-layer').forEach(function(layer, i) {
      gsap.from(layer, {
        scrollTrigger: { trigger: layer, start: 'top 85%' },
        opacity: 0, y: 40, rotateX: 8, duration: 0.8, delay: i * 0.15
      });
    });

    // Cards — subtle entrance
    document.querySelectorAll('.card').forEach(function(card) {
      if (!card.classList.contains('reveal')) {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%' },
          opacity: 0, y: 20, duration: 0.6
        });
      }
    });
  }

  // ── Row-by-Row Table Reveal ────────────────────────────────────
  function initRowReveal() {
    document.querySelectorAll('.reveal-row-btn').forEach(function(btn) {
      var currentGroup = 0;
      btn.addEventListener('click', function() {
        var table = btn.closest('.section__inner').querySelector('.cost-table');
        if (!table) return;

        // Find the next group number to reveal
        currentGroup++;
        var rows = table.querySelectorAll('[data-rgroup="' + currentGroup + '"]');

        if (rows.length === 0) {
          // No more groups — done
          btn.style.display = 'none';
          var nextBtn = btn.closest('.reveal-content').querySelector('.next-btn');
          if (nextBtn) nextBtn.classList.add('is-visible');
          return;
        }

        // Reveal all rows in this group with stagger
        rows.forEach(function(row, i) {
          row.classList.remove('cost-row-hidden');
          row.classList.add('cost-row-visible');
          row.style.animationDelay = (i * 0.08) + 's';
          // Trigger counters
          row.querySelectorAll('[data-counter]').forEach(function(el) {
            if (!el.dataset.animated) {
              animateCounter(el);
              el.dataset.animated = 'true';
            }
          });
        });

        // If no more groups after this, hide button and show Next
        var nextGroup = table.querySelector('[data-rgroup="' + (currentGroup + 1) + '"]');
        if (!nextGroup) {
          setTimeout(function() {
            btn.style.display = 'none';
            var nextBtn = btn.closest('.reveal-content').querySelector('.next-btn');
            if (nextBtn) nextBtn.classList.add('is-visible');
          }, 600);
        }
      });
    });
  }

  // ── Hidden button moved into init ──

  // ── Smooth Scroll — uses GSAP if available for buttery smoothness ──
  function smoothScrollTo(section, dur) {
    var target = section.querySelector('.section-label, .solution-label');
    if (!target) target = section.querySelector('.headline');
    if (!target) target = section;
    var duration = dur || 3;

    if (typeof gsap !== 'undefined') {
      // GSAP handles scroll much smoother — no layout jank
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 40 },
        duration: duration,
        ease: 'expo.out'
      });
    } else {
      // Fallback: manual rAF scroll
      var targetY = target.getBoundingClientRect().top + window.scrollY - 40;
      var startY = window.scrollY;
      var diff = targetY - startY;
      if (Math.abs(diff) < 5) return;
      var ms = duration * 1000;
      var start = performance.now();
      function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
      (function step(now) {
        var p = Math.min((now - start) / ms, 1);
        window.scrollTo(0, startY + diff * easeOutExpo(p));
        if (p < 1) requestAnimationFrame(step);
      })(start);
    }
  }

  // ── Section Lock — progressive reveal ──────────────────────────
  function initSectionLock() {
    // Hide everything with data-order > 0
    document.querySelectorAll('[data-order]').forEach(function(el) {
      var order = parseInt(el.dataset.order);
      if (order > 0) {
        el.style.display = 'none';
      }
    });

    function showOrder_fn(orderNum) {
      document.querySelectorAll('[data-order="' + orderNum + '"]').forEach(function(el) {
        el.style.display = '';
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px) scale(0.99)';
        el.style.transition = 'opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
        setTimeout(function() {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
        }, 80);
      });
      // Scroll to the first element of this order
      var target = document.querySelector('[data-order="' + orderNum + '"]');
      if (target) {
        setTimeout(function() {
          if (target.tagName === 'SECTION') {
            smoothScrollTo(target, 2);
          } else if (typeof gsap !== 'undefined') {
            gsap.to(window, { scrollTo: { y: target, offsetY: 40 }, duration: 2, ease: 'expo.out' });
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }

    // "Next" buttons reveal the next section in order
    document.querySelectorAll('.next-btn[data-shows]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var showOrder = parseInt(btn.dataset.shows);
        // Show all elements with this data-order
        showOrder_fn(showOrder);
      });
    });
  }

  // ── Click-to-Reveal ────────────────────────────────────────────
  function initClickReveals() {
    var triggers = document.querySelectorAll('.reveal-trigger');
    triggers.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var section = btn.closest('section') || btn.closest('.section');
        var content = section.querySelector('.reveal-content');
        var nextBtn = section.querySelector('.next-btn');

        if (content) {
          content.classList.add('is-revealed');
          // Re-trigger counters inside revealed content
          content.querySelectorAll('[data-counter]').forEach(function(el) {
            if (!el.dataset.animated) {
              animateCounter(el);
              el.dataset.animated = 'true';
            }
          });
          // Re-trigger ring charts
          content.querySelectorAll('.ring-fill[data-ring-percent]').forEach(function(ring) {
            if (!ring.dataset.animated) {
              var pct = parseFloat(ring.dataset.ringPercent) / 100;
              var circ = parseFloat(ring.getAttribute('stroke-dasharray'));
              ring.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
              ring.style.strokeDashoffset = circ * (1 - pct);
              ring.dataset.animated = 'true';
            }
          });
        }

        // Hide the trigger button
        btn.classList.add('is-hidden');

        // Show next button immediately — UNLESS section has row-reveal table (then table controls it)
        var hasRowReveal = section.querySelector('.reveal-row-btn');
        if (nextBtn && !hasRowReveal) {
          nextBtn.classList.add('is-visible');
        }

        // Smooth 1.5s ease-in-out scroll to section label — starts immediately
        smoothScrollTo(section);
      });
    });

    // Next buttons — scroll to next section (only for buttons WITHOUT data-shows)
    document.querySelectorAll('.next-btn:not([data-shows])').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var currentSection = btn.closest('section');
        var nextSection = currentSection.nextElementSibling;
        // Skip dividers
        while (nextSection && !nextSection.tagName.match(/SECTION/i)) {
          nextSection = nextSection.nextElementSibling;
        }
        if (nextSection && nextSection.style.display !== 'none') {
          nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Make animateCounter accessible for reveal triggers
  function animateCounter(el) {
    var target = parseFloat(el.dataset.counter);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var duration = parseInt(el.dataset.duration || '2500');
    var decimals = parseInt(el.dataset.decimals || '0');
    var startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutExpo(progress);
      var current = target * easedProgress;

      if (decimals > 0) {
        el.textContent = prefix + current.toFixed(decimals) + suffix;
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

  // ── Ring Charts ────────────────────────────────────────────────
  function initRingCharts() {
    var rings = document.querySelectorAll('.ring-fill[data-ring-percent]');
    if (!rings.length) return;

    if (prefersReducedMotion()) {
      rings.forEach(function(ring) {
        var pct = parseFloat(ring.dataset.ringPercent) / 100;
        var circ = parseFloat(ring.getAttribute('stroke-dasharray'));
        ring.style.strokeDashoffset = circ * (1 - pct);
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          var ring = entry.target;
          var pct = parseFloat(ring.dataset.ringPercent) / 100;
          var circ = parseFloat(ring.getAttribute('stroke-dasharray'));
          ring.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
          ring.style.strokeDashoffset = circ * (1 - pct);
          ring.dataset.animated = 'true';
          observer.unobserve(ring);
        }
      });
    }, { threshold: 0.3 });

    rings.forEach(function(ring) { observer.observe(ring); });
  }

  // ── Initialize Everything ─────────────────────────────────────
  function init() {
    initProgressBar();
    initDotNav();
    initScrollToTop();
    initReveals();
    initSectionLock();
    initCounters();
    initRowReveal();
    initRingCharts();
    initClickReveals();
    initScrollEngine();

    // Hidden button: top-right, opens all BJB HUB demos
    var sb = document.createElement('div');
    sb.style.cssText = 'position:fixed;top:12px;right:12px;width:36px;height:36px;border-radius:50%;z-index:10000;cursor:pointer;opacity:0;transition:opacity 0.3s;';
    sb.onmouseenter = function() { sb.style.opacity='0.4'; sb.style.background='rgba(201,168,76,0.3)'; sb.style.border='1px solid rgba(201,168,76,0.5)'; };
    sb.onmouseleave = function() { sb.style.opacity='0'; sb.style.background='none'; sb.style.border='none'; };
    sb.onclick = function() {
      // Unlock entire presentation — show all sections, reveal all content
      document.querySelectorAll('[data-order]').forEach(function(el) { el.style.display=''; el.style.opacity='1'; el.style.transform='none'; });
      document.querySelectorAll('.reveal-content').forEach(function(el) { el.classList.add('is-revealed'); });
      document.querySelectorAll('.reveal-trigger').forEach(function(el) { el.classList.add('is-hidden'); });
      document.querySelectorAll('.next-btn').forEach(function(el) { el.classList.add('is-visible'); });
      document.querySelectorAll('.cost-row-hidden').forEach(function(el) { el.classList.remove('cost-row-hidden'); el.classList.add('cost-row-visible'); });
      document.querySelectorAll('.reveal-row-btn').forEach(function(el) { el.style.display='none'; });
      document.querySelectorAll('[data-counter]').forEach(function(el) { if(!el.dataset.animated) { showFinalValue(el); el.dataset.animated='true'; } });
      sb.style.display='none';
    };
    document.body.appendChild(sb);
  }

  // Wait for DOM and GSAP
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Give GSAP a moment to load from CDN
      setTimeout(init, 100);
    });
  } else {
    setTimeout(init, 100);
  }

})();
