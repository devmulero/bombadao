const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const progressBar = document.querySelector('.reading-progress span');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    navigation.classList.remove('is-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) closeMenu();
  });
}

let scrollFrame = 0;
const updateScrollChrome = () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    document.body.classList.toggle('is-scrolled', window.scrollY > 28);
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    scrollFrame = 0;
  });
};

window.addEventListener('scroll', updateScrollChrome, { passive: true });
window.addEventListener('resize', updateScrollChrome, { passive: true });
updateScrollChrome();

const revealSections = document.querySelectorAll('[data-reveal-section]');
if (revealSections.length && 'IntersectionObserver' in window) {
  document.body.classList.add('motion-ready');

  if (reduceMotion) {
    revealSections.forEach((section) => section.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    revealSections.forEach((section) => revealObserver.observe(section));
  }
}

const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const linkedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && navLinks.length && linkedSections.length) {
  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-22% 0px -65% 0px', threshold: 0 });

  linkedSections.forEach((section) => activeSectionObserver.observe(section));
}

if (finePointer && !reduceMotion) {
  const heroArt = document.querySelector('.hero-art');
  const sessionCard = heroArt?.querySelector('.session-card');

  if (heroArt && sessionCard) {
    heroArt.addEventListener('pointermove', (event) => {
      const bounds = heroArt.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      sessionCard.style.setProperty('--tilt-x', `${(x * 4).toFixed(2)}deg`);
      sessionCard.style.setProperty('--tilt-y', `${(-y * 4).toFixed(2)}deg`);
      heroArt.style.setProperty('--orbit-x', `${(x * 7).toFixed(1)}px`);
      heroArt.style.setProperty('--orbit-y', `${(y * 7).toFixed(1)}px`);
      heroArt.classList.add('is-pointing');
    });

    heroArt.addEventListener('pointerleave', () => {
      sessionCard.style.removeProperty('--tilt-x');
      sessionCard.style.removeProperty('--tilt-y');
      heroArt.style.removeProperty('--orbit-x');
      heroArt.style.removeProperty('--orbit-y');
      heroArt.classList.remove('is-pointing');
    });
  }

  document.querySelectorAll('[data-tilt-card]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty('--tilt-x', `${(x * 2.5).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(-y * 2.5).toFixed(2)}deg`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  });

  document.querySelectorAll('.button').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) * 0.045;
      const y = (event.clientY - bounds.top - bounds.height / 2) * 0.09;
      button.style.setProperty('--mag-x', `${Math.max(-3, Math.min(3, x)).toFixed(2)}px`);
      button.style.setProperty('--mag-y', `${Math.max(-2, Math.min(2, y)).toFixed(2)}px`);
    });

    button.addEventListener('pointerleave', () => {
      button.style.removeProperty('--mag-x');
      button.style.removeProperty('--mag-y');
    });
  });
}
