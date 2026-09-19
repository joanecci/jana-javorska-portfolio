document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scenes = document.querySelectorAll('[data-scene]');

if (reducedMotion) {
  scenes.forEach((scene) => scene.classList.add('is-in'));
} else {
  const sceneObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

  scenes.forEach((scene) => sceneObserver.observe(scene));
}

// Smooth spring scroll with gentle section snapping — desktop pointer only.
// Touch devices (the browsers that already broke twice on this project) keep
// plain native scrolling, untouched. Degrades silently if the CDN fails.
const isDesktopPointer = window.matchMedia('(pointer: fine) and (min-width: 901px)').matches;

if (!reducedMotion && isDesktopPointer && typeof window.Lenis !== 'undefined') {
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const lenis = new Lenis({ duration: 1.1, easing: ease, wheelMultiplier: 1 });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  document.documentElement.style.scrollBehavior = 'auto';

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { duration: 1.1, easing: ease });
    });
  });

  const snapTargets = Array.from(document.querySelectorAll('.scene, .case-scene'));
  let isSnapping = false;
  let settleTimer = null;

  lenis.on('scroll', () => {
    if (isSnapping) return;
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      const current = window.scrollY;
      let nearest = null;
      let nearestDistance = Infinity;
      snapTargets.forEach((section) => {
        const distance = Math.abs(section.offsetTop - current);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = section;
        }
      });
      if (nearest && nearestDistance > 4 && nearestDistance < window.innerHeight * 0.6) {
        isSnapping = true;
        lenis.scrollTo(nearest, { duration: 0.9, easing: ease, onComplete: () => { isSnapping = false; } });
      }
    }, 160);
  });
}
