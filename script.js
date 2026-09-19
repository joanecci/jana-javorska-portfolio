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
  }, { threshold: 0.16, rootMargin: '0px 0px -10% 0px' });

  scenes.forEach((scene) => sceneObserver.observe(scene));
}
