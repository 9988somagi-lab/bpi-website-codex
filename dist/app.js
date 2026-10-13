(() => {
  document.documentElement.classList.add('js');
  const button = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const closeMenu = () => {
    nav?.classList.remove('open');
    button?.setAttribute('aria-expanded', 'false');
  };
  button?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    button.setAttribute('aria-expanded', String(Boolean(open)));
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) {
      closeMenu();
      button?.focus();
    }
  });
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
