const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const siteHeader = document.querySelector('.site-header');

const updateHeader = () => siteHeader?.classList.toggle('scrolled', window.scrollY > 18);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuButton?.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
  });
});

document.addEventListener('click', (event) => {
  if (menu?.classList.contains('open') && !event.target.closest('.nav-wrap')) {
    menu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.classList.contains('open')) {
    menu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
    menuButton?.focus();
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const sections = document.querySelectorAll('main section[id]');
const navigationLinks = document.querySelectorAll('.main-nav a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));

const serviceCards = [...document.querySelectorAll('.service-card')];

serviceCards.forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;

    const wasSelected = card.classList.contains('featured') || card.classList.contains('is-selected');
    serviceCards.forEach((item) => item.classList.remove('featured', 'is-selected'));
    if (!wasSelected) card.classList.add('is-selected');
  });
});

document.getElementById('lead-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const text = [
    'Olá, 1NK Digital! Vim pelo site e gostaria de solicitar um orçamento.',
    '',
    `*Nome:* ${data.get('nome')}`,
    `*WhatsApp:* ${data.get('telefone')}`,
    `*Serviço:* ${data.get('servico')}`,
    `*Sobre o projeto:* ${data.get('mensagem') || 'Prefiro explicar durante o contato.'}`
  ].join('\n');
  window.open(`https://wa.me/5518981790178?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
});

document.getElementById('year').textContent = new Date().getFullYear();

const carouselTrack = document.getElementById('project-track');

if (carouselTrack) {
  const slides = [...carouselTrack.querySelectorAll('.project-card')];
  const carousel = carouselTrack.closest('.project-carousel');
  const previousButton = carousel.querySelector('.carousel-side-prev');
  const nextButton = carousel.querySelector('.carousel-side-next');
  const carouselStatus = document.getElementById('carousel-status');
  let autoplayTimer;
  let scrollEndTimer;
  const autoplayDelay = 4500;

  slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-label', `${index + 1} de ${slides.length}`);
  });

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  [firstClone, lastClone].forEach((clone) => {
    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('role');
    clone.removeAttribute('aria-label');
    clone.querySelectorAll('a, button, input, select, textarea').forEach((element) => {
      element.setAttribute('tabindex', '-1');
    });
  });

  carouselTrack.prepend(lastClone);
  carouselTrack.append(firstClone);

  const getPhysicalIndex = () => Math.round(carouselTrack.scrollLeft / carouselTrack.clientWidth);

  const jumpTo = (physicalIndex) => {
    carouselTrack.classList.add('is-resetting');
    carouselTrack.scrollLeft = physicalIndex * carouselTrack.clientWidth;
    requestAnimationFrame(() => carouselTrack.classList.remove('is-resetting'));
  };

  const normalizeInfiniteLoop = () => {
    const physicalIndex = getPhysicalIndex();
    if (physicalIndex === 0) jumpTo(slides.length);
    if (physicalIndex === slides.length + 1) jumpTo(1);
  };

  const announceSlide = () => {
    const physicalIndex = getPhysicalIndex();
    const logicalIndex = physicalIndex === 0 ? slides.length : physicalIndex > slides.length ? 1 : physicalIndex;
    if (carouselStatus) carouselStatus.textContent = `Projeto ${logicalIndex} de ${slides.length}`;
  };

  const moveCarousel = (direction) => {
    const targetIndex = getPhysicalIndex() + direction;
    carouselTrack.scrollTo({
      left: targetIndex * carouselTrack.clientWidth,
      behavior: 'smooth'
    });
  };

  const stopAutoplay = () => window.clearInterval(autoplayTimer);
  const startAutoplay = () => {
    stopAutoplay();
    if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    autoplayTimer = window.setInterval(() => moveCarousel(1), autoplayDelay);
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  previousButton.addEventListener('click', () => {
    moveCarousel(-1);
    restartAutoplay();
  });
  nextButton.addEventListener('click', () => {
    moveCarousel(1);
    restartAutoplay();
  });

  carouselTrack.addEventListener('scroll', () => {
    window.clearTimeout(scrollEndTimer);
    scrollEndTimer = window.setTimeout(() => {
      normalizeInfiniteLoop();
      announceSlide();
    }, 140);
  }, { passive: true });
  carouselTrack.addEventListener('scrollend', normalizeInfiniteLoop);
  window.addEventListener('resize', () => jumpTo(Math.max(1, Math.min(slides.length, getPhysicalIndex()))));
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);
  carouselTrack.addEventListener('pointerdown', stopAutoplay, { passive: true });
  carouselTrack.addEventListener('pointerup', startAutoplay, { passive: true });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveCarousel(-1);
      restartAutoplay();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveCarousel(1);
      restartAutoplay();
    }
  });
  document.addEventListener('visibilitychange', () => document.hidden ? stopAutoplay() : startAutoplay());
  requestAnimationFrame(() => {
    jumpTo(1);
    startAutoplay();
  });
}
