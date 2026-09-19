document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scenes = document.querySelectorAll('[data-scene]');

// Name splash: once per browser session, dismissed by a click that fills the name red.
const splash = document.getElementById('intro-splash');
if (splash) {
  if (reducedMotion || sessionStorage.getItem('splashShown')) {
    splash.remove();
  } else {
    document.body.classList.add('has-splash');
    requestAnimationFrame(() => splash.classList.add('is-visible'));
    splash.addEventListener('click', () => {
      if (splash.classList.contains('is-filling')) return;
      sessionStorage.setItem('splashShown', '1');
      splash.classList.add('is-filling');
      setTimeout(() => {
        splash.classList.add('is-leaving');
        document.body.classList.remove('has-splash');
        setTimeout(() => splash.remove(), 650);
      }, 550);
    });
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
