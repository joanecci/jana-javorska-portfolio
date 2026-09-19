document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scenes = document.querySelectorAll('[data-scene]');

// Name splash: once per browser session, not on every reload within a visit.
const splash = document.getElementById('intro-splash');
if (splash) {
  if (reducedMotion || sessionStorage.getItem('splashShown')) {
    splash.remove();
  } else {
    sessionStorage.setItem('splashShown', '1');
    document.body.classList.add('has-splash');
    requestAnimationFrame(() => splash.classList.add('is-visible'));
    setTimeout(() => {
      splash.classList.add('is-leaving');
      document.body.classList.remove('has-splash');
      setTimeout(() => splash.remove(), 650);
    }, 1100);
  }
}

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
