document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scenes = document.querySelectorAll('[data-scene]');

function typeInto(el, { duration = 1.1, onDone } = {}) {
  if (!el) return;
  const naturalWidth = el.scrollWidth;
  const steps = el.textContent.trim().length;
  el.style.width = '0px';
  requestAnimationFrame(() => {
    el.style.transition = `width ${duration}s steps(${steps}, end)`;
    el.style.width = naturalWidth + 'px';
  });
  if (onDone) {
    el.addEventListener('transitionend', function handler(e) {
      if (e.propertyName !== 'width') return;
      el.removeEventListener('transitionend', handler);
      onDone();
    });
  }
}

function typeKicker() {
  const kicker = document.querySelector('.hero .kicker');
  if (!kicker) return;
  kicker.classList.add('is-typing');
  typeInto(kicker, { duration: 1.1, onDone: () => kicker.classList.add('is-typed') });
}

// Name splash: once per browser session, dismissed by a click that fills the name red.
const splash = document.getElementById('intro-splash');
if (splash) {
  if (reducedMotion || sessionStorage.getItem('splashShown')) {
    splash.remove();
    typeKicker();
  } else {
    const splashText = splash.querySelector('.splash-text');
    document.body.classList.add('has-splash');
    requestAnimationFrame(() => splash.classList.add('is-visible'));
    setTimeout(() => {
      typeInto(splashText, { duration: 1.3, onDone: () => {
        splashText.classList.add('is-typed');
        splashText.classList.add('is-inviting');
      } });
    }, 300);
    splash.addEventListener('click', () => {
      if (splash.classList.contains('is-filling')) return;
      sessionStorage.setItem('splashShown', '1');
      splash.classList.add('is-filling');
      setTimeout(() => {
        splash.classList.add('is-leaving');
        document.body.classList.remove('has-splash');
        typeKicker();
        setTimeout(() => splash.remove(), 650);
      }, 550);
    });
  }
} else {
  typeKicker();
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
