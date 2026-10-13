(() => {
  const config = window.SITE_CONFIG || {};
  const get = (selector) => document.querySelector(selector);
  const all = (selector) => [...document.querySelectorAll(selector)];

  if (config.brand) {
    all('[data-brand], [data-brand-footer]').forEach((el) => { el.textContent = config.brand; });
  }

  const hero = config.hero || {};
  const contentMap = [
    ['[data-hero-eyebrow]', hero.eyebrow],
    ['[data-hero-title]', hero.title],
    ['[data-hero-description]', hero.description],
    ['[data-primary-cta]', hero.primaryCta],
    ['[data-secondary-cta]', hero.secondaryCta]
  ];
  contentMap.forEach(([selector, value]) => {
    const el = get(selector);
    if (el && value) el.textContent = value;
  });

  const contactLink = get('[data-contact-link]');
  if (contactLink && config.contactEmail) contactLink.href = `mailto:${config.contactEmail}`;

  const year = get('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const header = get('[data-header]');
  const menuButton = get('[data-menu-button]');
  const nav = get('[data-nav]');

  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 8);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(Boolean(open)));
  });

  all('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      nav?.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });
})();
