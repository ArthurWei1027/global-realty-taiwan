(function () {
  const currentPage = document.body.dataset.page || '';
  const isDesignMode = new URLSearchParams(window.location.search).has('design');

  function pageHref(path) {
    return isDesignMode ? `${path}?design=1` : path;
  }

  const navItems = [
    { href: 'index.html', label: '首頁', id: 'home' },
    { href: 'properties.html', label: '精選建案', id: 'properties' },
    { href: 'leasing.html', label: '租賃管理', id: 'leasing' },
    { href: 'events.html', label: '活動預告', id: 'events' },
    { href: 'classroom.html', label: '澳洲不動產小課堂', id: 'classroom' },
    {
      href: 'about.html',
      label: '關於我們',
      id: 'about',
      children: [
        { href: 'about.html', label: '關於環球置業', id: 'about' },
        { href: 'group.html', label: '澳華國際集團', id: 'group' },
      ],
    },
  ];

  function isNavItemActive(item) {
    if (currentPage === item.id) return true;
    return item.children?.some((child) => child.id === currentPage) ?? false;
  }

  function renderNavItem(item) {
    if (!item.children) {
      const active = currentPage === item.id ? ' is-active' : '';
      return `<a href="${pageHref(item.href)}" class="${active.trim()}">${item.label}</a>`;
    }

    const parentActive = isNavItemActive(item) ? ' is-active' : '';
    const subLinks = item.children
      .map((child) => {
        const active = currentPage === child.id ? ' is-active' : '';
        return `<a href="${pageHref(child.href)}" class="${active.trim()}">${child.label}</a>`;
      })
      .join('');

    return `
      <div class="site-nav__item site-nav__item--has-sub${parentActive}">
        <a href="${pageHref(item.href)}" class="site-nav__parent${parentActive}">${item.label}</a>
        <div class="site-nav__sub" role="group" aria-label="${item.label}">
          ${subLinks}
        </div>
      </div>`;
  }

  function searchFormHtml() {
    return `
      <form class="site-search" role="search" action="${pageHref('search.html')}" method="get">
        <input type="search" name="q" class="site-search__input" placeholder="搜尋建案、活動、資訊…" aria-label="搜尋網站內容" autocomplete="off">
        <button type="submit" class="site-search__btn" aria-label="搜尋">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="18" height="18">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M20 20l-3.2-3.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </form>`;
  }

  function brandLockup() {
    if (window.AGBrand) return window.AGBrand.brandLockupHtml();
    return `<a href="index.html" class="brand-lockup"><span class="brand-lockup__primary">環球置業 Global Realty</span></a>`;
  }

  function brandFrom() {
    if (window.AGBrand) return window.AGBrand.brandFromHtml();
    return `<a href="group.html" class="brand-from">from 澳華國際集團 Award Global</a>`;
  }

  function renderHeader() {
    const headerEl = document.getElementById('site-header');
    if (!headerEl) return;

    const navLinks = navItems.map(renderNavItem).join('');

    headerEl.innerHTML = `
      <header class="site-header site-header--nord" role="banner">
        <div class="site-header__inner">
          <div class="site-header__brand">
            ${brandLockup()}
            ${brandFrom()}
          </div>
          <button type="button" class="nav-toggle" aria-label="開啟選單" aria-expanded="false">☰</button>
          <nav class="site-nav site-nav--nord" aria-label="主要導覽">
            ${navLinks}
            ${searchFormHtml()}
          </nav>
        </div>
      </header>
    `;

    const header = headerEl.querySelector('.site-header');
    const toggle = headerEl.querySelector('.nav-toggle');
    const nav = headerEl.querySelector('.site-nav');

    if (header) {
      window.addEventListener(
        'scroll',
        () => {
          header.classList.toggle('is-scrolled', window.scrollY > 8);
        },
        { passive: true }
      );
    }

    if (toggle && nav) {
      const backdrop = document.createElement('button');
      backdrop.type = 'button';
      backdrop.className = 'nav-backdrop';
      backdrop.setAttribute('aria-label', '關閉選單');
      header.appendChild(backdrop);

      function closeNav() {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '開啟選單');
        document.body.classList.remove('nav-open');
        backdrop.classList.remove('is-visible');
      }

      function openNav() {
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', '關閉選單');
        document.body.classList.add('nav-open');
        backdrop.classList.add('is-visible');
      }

      toggle.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) closeNav();
        else openNav();
      });

      backdrop.addEventListener('click', closeNav);

      nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNav);
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
      });
    }
  }

  function copyrightBarHtml() {
    return `
      <div class="site-footer--nord__legal">
        <p class="site-footer--nord__copyright">
          Copyright 2026&nbsp;|&nbsp;
          <a href="${pageHref('index.html')}">Global Realty</a>&nbsp;|&nbsp;
          All Rights Reserved&nbsp;|&nbsp;
          <a href="https://globalrealty.com.au/privacy-policy/" target="_blank" rel="noopener noreferrer">隱私權政策</a>
        </p>
      </div>`;
  }

  function renderFooter() {
    const footerEl = document.getElementById('site-footer');
    if (!footerEl) return;

    footerEl.innerHTML = `
      <footer class="site-footer site-footer--nord" role="contentinfo" id="consult">
        <div class="site-footer--nord__main">
          <div class="site-footer--nord__info">
            ${brandLockup()}
            ${brandFrom()}
            <div class="site-footer--nord__office">
              <h4>大巨蛋辦公室 Taipei Dome Office</h4>
              <p>台北市信義區忠孝東路四段 525 號 14–15 樓<br>THE COLLECTIVE 巨蛋國際中心</p>
              <p><a href="mailto:arthurwei@globalrealty.com.au">arthurwei@globalrealty.com.au</a></p>
            </div>
            <div class="site-footer--nord__office">
              <h4>101 45 樓辦公室 Taipei 101 Office</h4>
              <p>台北市信義區信義路五段 7 號<br>台北 101 45 樓 A-1 室</p>
              <p><a href="mailto:arthurwei@globalrealty.com.au">arthurwei@globalrealty.com.au</a></p>
            </div>
            <div class="site-footer--nord__office">
              <h4>雪梨總部 Sydney Office</h4>
              <p>Level 3, 370 Pitt Street<br>Sydney NSW 2000, Australia</p>
            </div>
            <div class="site-footer--nord__office">
              <h4>墨爾本 Melbourne Office</h4>
              <p>Level 8, 356 Collins St<br>Melbourne VIC 3000, Australia</p>
            </div>
            <p class="site-footer--nord__social">
              <a href="mailto:arthurwei@globalrealty.com.au" aria-label="Email">✉</a>
            </p>
          </div>
          <div class="site-footer--nord__form">
            <h3>諮詢</h3>
            <form id="consultation-form" class="footer-form" aria-label="預約諮詢表單">
              <div class="footer-form__row">
                <div class="form-group">
                  <label for="footer-name">姓名</label>
                  <input type="text" id="footer-name" name="name" required autocomplete="name">
                </div>
                <div class="form-group">
                  <label for="footer-phone">手機</label>
                  <input type="tel" id="footer-phone" name="phone" required autocomplete="tel">
                </div>
              </div>
              <div class="form-group">
                <label for="footer-email">Email</label>
                <input type="email" id="footer-email" name="email" required autocomplete="email">
              </div>
              <div class="form-group">
                <label for="footer-notes">欲參加的活動場次與諮詢項目</label>
                <textarea id="footer-notes" name="notes" rows="4" placeholder="請描述您的置產目標或感興趣的建案"></textarea>
              </div>
              <button type="submit" class="btn btn-nord">送出表單</button>
            </form>
          </div>
        </div>
        <div class="site-footer--nord__bottom">
          <p>© ${new Date().getFullYear()} 環球置業 Global Realty · from 澳華國際集團 Award Global。以上資訊僅供參考，不構成財務或投資建議。</p>
          <p class="site-footer--nord__sitemap"><a href="${pageHref('sitemap.html')}">網站地圖</a></p>
        </div>
        ${copyrightBarHtml()}
      </footer>
    `;
  }

  function renderAboutSubnav() {
    if (currentPage !== 'about' && currentPage !== 'group') return;
    const main = document.querySelector('main');
    if (!main) return;

    const subnav = document.createElement('nav');
    subnav.className = 'about-subnav';
    subnav.setAttribute('aria-label', '關於我們');
    subnav.innerHTML = `
      <div class="about-subnav__inner">
        <span class="about-subnav__label">關於我們</span>
        <div class="about-subnav__tabs">
          <a href="${pageHref('about.html')}" class="${currentPage === 'about' ? 'is-active' : ''}">關於環球置業</a>
          <a href="${pageHref('group.html')}" class="${currentPage === 'group' ? 'is-active' : ''}">澳華國際集團</a>
        </div>
      </div>`;
    main.insertBefore(subnav, main.firstChild);
  }

  function loadDesignToolbar() {
    if (!new URLSearchParams(window.location.search).has('design')) return;
    const script = document.createElement('script');
    script.src = 'js/design-toolbar.js';
    document.body.appendChild(script);
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderAboutSubnav();
    renderFooter();
    loadDesignToolbar();
    loadFloatingDock();
  });

  function loadFloatingDock() {
    const script = document.createElement('script');
    script.src = 'js/floating-dock.js';
    script.onload = () => window.AGFloatingDock?.renderFloatingDock();
    document.body.appendChild(script);
  }
})();
