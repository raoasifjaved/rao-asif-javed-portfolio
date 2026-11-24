(() => {
  'use strict';

  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const scrollProgress = document.getElementById('scrollProgress');
  const currentYear = document.getElementById('currentYear');
  root.classList.add('js');

  // Theme preference: saved locally in the visitor's browser.
  try {
    const savedTheme = localStorage.getItem('raj-portfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  } catch (_) { /* Private browsing can disable storage; the default theme still works. */ }

  function updateThemeButton() {
    const isLight = root.dataset.theme === 'light';
    themeToggle?.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle?.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  }
  updateThemeButton();
  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('raj-portfolio-theme', root.dataset.theme); } catch (_) {}
    updateThemeButton();
  });

  // Mobile navigation.
  function closeMenu() {
    mainNav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  }
  menuToggle?.addEventListener('click', () => {
    const open = mainNav?.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (!mainNav?.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
  });

  // Reading progress indicator.
  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Scroll-in animations with a safe fallback for older browsers.
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Rotating hero focus labels.
  const typedRole = document.getElementById('typedRole');
  const roles = ['Artificial Intelligence', 'Natural Language Processing', 'Cybersecurity', 'Data Analytics'];
  let roleIndex = 0;
  if (typedRole && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      typedRole.animate([{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 420, easing: 'ease-out' });
      typedRole.textContent = roles[roleIndex];
    }, 2600);
  }

  // Project category filter.
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  const projectCount = document.getElementById('projectCount');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      let shown = 0;
      projectCards.forEach(card => {
        const visible = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !visible);
        if (visible) shown += 1;
      });
      if (projectCount) projectCount.textContent = `SHOWING ${String(shown).padStart(2, '0')} PROJECT${shown === 1 ? '' : 'S'}`;
    });
  });

  // Contact form creates a draft in the visitor's configured email application.
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const subject = `Portfolio enquiry from ${name}`;
    const body = `Hello Rao,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`;
    const mailto = `mailto:raoasifjaved171@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (formNote) formNote.textContent = 'Your email application should open with the message drafted. Review it and press Send there.';
    window.location.href = mailto;
  });

  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  // Mark the navigation item for the section currently in view.
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }
})();
