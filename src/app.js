(() => {
  document.documentElement.classList.add('js');
  const nav = document.querySelector('.site-nav');
  const menu = document.querySelector('.menu-button');
  const groups = [...document.querySelectorAll('.nav-group')];
  const closeNavigation = () => {
    nav?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    groups.forEach(group => { group.open = false; });
  };
  menu?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    closeNavigation();
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });
  // Opening one product menu closes other menus. Native details remains usable without JS.
  groups.forEach(group => {
    group.addEventListener('toggle', () => {
      if (group.open) groups.filter(other => other !== group).forEach(other => { other.open = false; });
    });
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) groups.forEach(group => { group.open = false; });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const activeGroup = groups.find(group => group.open);
      const mobileOpen = nav?.classList.contains('open');
      closeNavigation();
      if (mobileOpen) menu?.focus();
      else activeGroup?.querySelector('summary').focus();
    }
  });
  matchMedia('(min-width: 1021px)').addEventListener('change', closeNavigation);
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const stage = document.querySelector('.energy-stage');
  if (stage) {
    const selections = {
      'portable-power': { image: 'station-mb', alt: 'BPI MB Series portable power station', family: 'Portable Power Stations', name: 'MB Series', heading: 'Energy, made portable.' },
      'lithium-polymer': { image: 'lipo-photo', alt: 'BPI lithium polymer batteries', family: 'Lithium Polymer Batteries', name: 'Pouch-cell solutions', heading: 'Power for compact products.' },
      lifepo4: { image: 'lifepo4-photo', alt: 'BPI LiFePO4 battery', family: 'LiFePO4 Batteries', name: 'Lithium iron phosphate', heading: 'Energy for your system.' }
    };
    const selectors = [...document.querySelectorAll('[data-hero]')];
    selectors.forEach(selector => selector.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const selected = selections[selector.dataset.hero];
      const img = stage.querySelector('img');
      img.src = `./assets/photos/${selected.image}.webp`;
      img.alt = selected.alt;
      stage.querySelector('[data-stage-link]').href = selector.getAttribute('href');
      stage.querySelector('[data-stage-link]').setAttribute('aria-label', 'Explore ' + selected.family);
      stage.querySelector('[data-stage-label]').textContent = selected.family;
      stage.querySelector('[data-stage-name]').textContent = selected.name;
      stage.querySelector('.stage-label strong').textContent = selected.heading;
      selectors.forEach(item => {
        if (item === selector) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
      });
    }));
  }

  const searchDialog = document.querySelector('.search-dialog');
  if (searchDialog) {
    const input = searchDialog.querySelector('input');
    const results = searchDialog.querySelector('.search-results');
    const searchStatus = searchDialog.querySelector('.search-status');
    let opener;
    const renderResults = () => {
      const query = input.value.trim().toLowerCase();
      results.replaceChildren();
      if (!query) { searchStatus.textContent = 'Type to find a product or page.'; return; }
      const matches = (window.SITE_SEARCH || []).filter(page =>
        `${page.title} ${page.description} ${page.section}`.toLowerCase().includes(query)
      ).slice(0, 12);
      searchStatus.textContent = matches.length ? `${matches.length} results. Select a page to explore.` : 'No matching pages. Try a product family or application.';
      matches.forEach(page => {
        const anchor = document.createElement('a');
        anchor.href = page.url;
        anchor.append(document.createTextNode(page.title));
        const description = document.createElement('span');
        description.textContent = page.description;
        anchor.append(description);
        results.append(anchor);
      });
    };
    document.querySelectorAll('[data-open-search]').forEach(link => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !searchDialog.showModal) return;
      event.preventDefault();
      opener = link;
      closeNavigation();
      searchDialog.showModal();
      input.focus();
      renderResults();
    }));
    input.addEventListener('input', renderResults);
    searchDialog.querySelector('.search-close').addEventListener('click', () => searchDialog.close());
    searchDialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        searchDialog.close();
      }
    });
    searchDialog.addEventListener('close', () => {
      if (opener && getComputedStyle(nav).display !== 'none') opener.focus();
      else menu?.focus();
    });
    searchDialog.addEventListener('click', event => {
      const bounds = searchDialog.getBoundingClientRect();
      if (event.target === searchDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) searchDialog.close();
    });
  }

  const catalog = document.querySelector('[data-catalog]');
  if (catalog) {
    const search = document.querySelector('#product-search');
    const filters = [...document.querySelectorAll('[data-filter]')];
    const cards = [...catalog.querySelectorAll('[data-category]')];
    let current = 'all';
    const applyFilter = () => {
      const term = search.value.trim().toLowerCase();
      let count = 0;
      cards.forEach(card => {
        const matches = (current === 'all' || card.dataset.category === current) && card.dataset.search.includes(term);
        card.hidden = !matches;
        if (matches) count++;
      });
      document.querySelector('[data-result-count]').textContent = `${count} product ${count === 1 ? 'family' : 'families'}`;
      document.querySelector('.no-results').hidden = count !== 0;
    };
    filters.forEach(button => button.addEventListener('click', () => {
      current = button.dataset.filter;
      filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      applyFilter();
    }));
    search.addEventListener('input', applyFilter);
  }

  const form = document.querySelector('#enquiry-form');
  if (form) {
    const params = new URLSearchParams(location.search);
    const product = params.get('product');
    if ([...form.elements.product.options].some(option => option.value === product)) form.elements.product.value = product;
    const context = ['interest', 'application', 'service'].map(key => params.get(key)).filter(Boolean);
    const contextNotice = document.querySelector('[data-enquiry-context]');
    if (context.length && contextNotice) { contextNotice.hidden = false; contextNotice.textContent = 'Your enquiry: ' + context.map(value => value.slice(0, 200)).join(' · '); }
    if (context.length) form.elements.requirements.value = 'Interested in: ' + context.map(value => value.slice(0, 200)).join('; ') + '\n\nProject requirements: ';
    let enquiry = '';
    const status = form.querySelector('.form-status');
    const result = form.querySelector('.enquiry-result');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const value = key => String(data.get(key) || '').trim();
      enquiry = `Hello BPI team,\n\nI would like to discuss a battery project.\n\nName: ${value('name')}\nCompany: ${value('company')}\nEmail: ${value('email')}\nPhone / WhatsApp: ${value('phone') || 'Not provided'}\nProduct family: ${value('product')}\nDestination market: ${value('market') || 'To be discussed'}\n\nRequirements:\n${value('requirements')}\n\nPlease contact me to discuss the next steps.\n`;
      form.querySelector('.form-preview').textContent = enquiry;
      form.querySelector('[data-email-draft]').href = `mailto:${window.SITE_CONFIG.contactEmail}?subject=${encodeURIComponent('BPI project enquiry — ' + value('product'))}&body=${encodeURIComponent(enquiry)}`;
      result.hidden = false;
      status.textContent = 'Your enquiry is prepared for review. No message has been sent.';
      result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    });
    // Avoid sending a stale draft after the customer changes their requirements.
    form.addEventListener('input', () => {
      if (!result.hidden) {
        result.hidden = true;
        enquiry = '';
        status.textContent = 'Your details changed. Prepare the enquiry again to update the draft.';
      }
    });
    form.querySelector('[data-copy-enquiry]').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(enquiry);
        status.textContent = 'Enquiry copied. Paste it into an email to ' + window.SITE_CONFIG.contactEmail + '.';
      } catch {
        status.textContent = 'Automatic copying is unavailable. Select and copy the enquiry text below.';
        const range = document.createRange();
        range.selectNodeContents(form.querySelector('.form-preview'));
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  }
})();
