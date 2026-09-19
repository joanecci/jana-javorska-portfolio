document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scenes = document.querySelectorAll('[data-scene]');
const hasGSAP = !reducedMotion && typeof window.gsap !== 'undefined';

if (reducedMotion) {
  scenes.forEach((scene) => scene.classList.add('is-in'));
} else {
  if (hasGSAP) document.documentElement.classList.add('gsap-driven');

  const sceneObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const scene = entry.target;
      scene.classList.add('is-in');

      if (hasGSAP) {
        const copy = scene.querySelectorAll(':scope > .scene-copy, :scope > .case-meta');
        const media = scene.querySelectorAll(':scope > .scene-media, :scope > .case-media');
        if (copy.length) gsap.to(copy, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' });
        if (media.length) gsap.to(media, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 0.12 });
      }

      observer.unobserve(scene);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -10% 0px' });

  scenes.forEach((scene) => sceneObserver.observe(scene));
}
