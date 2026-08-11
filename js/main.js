(function () {
  const currentPage = document.body.dataset.page || '';
  const isDesignMode = new URLSearchParams(window.location.search).has('design');

  function stripHtmlExtension(path) {
    const match = path.match(/^([^?#]+)\.html([?#].*)?$/);
    if (!match) return path;
    return `${match[1]}${match[2] || ''}`;
  }

  function shouldNormalizeHref(href) {
    return href && !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href);
  }

  function resolveStaticHref(path) {
    const hashIdx = path.indexOf('#');
    const queryIdx = path.indexOf('?');
    let cut = path.length;
    if (hashIdx >= 0) cut = Math.min(cut, hashIdx);
    if (queryIdx >= 0) cut = Math.min(cut, queryIdx);
    const base = path.slice(0, cut);
    const rest = path.slice(cut);
    const map = {
      '/': 'index.html',
      '/properties': 'properties.html',
      '/property': 'property.html',
      '/leasing': 'leasing.html',
      '/events': 'events.html',
      '/event': 'event.html',
      '/classroom': 'classroom.html',
      '/about': 'about.html',
      '/group': 'group.html',
      '/privacy': 'privacy.html',
      '/search': 'search.html',
      '/sitemap': 'sitemap.html',
    };
    if (map[base]) return map[base] + rest;
    return path;
  }

  function pageHref(path) {
    path = resolveStaticHref(path);
    if (!isDesignMode) return path;
    const [base, hash] = path.split('#');
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}design=1${hash ? `#${hash}` : ''}`;
  }

  function normalizePageLinks(root = document) {
    if (isDesignMode) return;
    root.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!shouldNormalizeHref(href)) return;
      const normalized = stripHtmlExtension(href);
      if (normalized !== href) link.setAttribute('href', normalized);
    });
  }

  const navItems = [
    {
      href: '/',
      label: '首頁',
      id: 'home',
      children: [
        { href: '/#home-overview', label: '網站首頁', id: 'home' },
        { href: '/#company-foundation', label: '公司背書', id: 'home-company' },
        { href: '/#company-history', label: '發展歷程', id: 'home-history' },
        { href: '/#company-foundation', label: '一站式服務', id: 'home-onestop' },
        { href: '/#why-choose-us', label: '為什麼選擇我們', id: 'home-why' },
        { href: '/#service-process', label: '服務流程', id: 'home-process' },
        { href: '/#service-system', label: '服務類型', id: 'home-services' },
        { href: '/#office-network', label: '全球據點', id: 'home-network' },
      ],
    },
    {
      href: '/properties',
      label: '精選建案',
      id: 'properties',
      children: [
        { href: '/properties#new-build', label: '澳洲新建案', id: 'properties-new' },
        { href: '/properties#established-property', label: '中古屋交易', id: 'properties-established' },
      ],
    },
    {
      href: '/leasing',
      label: '租賃管理',
      id: 'leasing',
      children: [
        { href: '/leasing#owner-process', label: '委託流程', id: 'leasing-process' },
        { href: '/leasing#gr-leasing', label: 'GR Leasing 長租', id: 'gr-leasing' },
        { href: '/leasing#homio', label: 'Homio 短租', id: 'homio' },
        { href: '/leasing#leasing-scope', label: '服務內容', id: 'leasing-scope' },
        { href: '/leasing#leasing-benefits', label: '管理優勢', id: 'leasing-benefits' },
      ],
    },
    {
      href: '/events',
      label: '活動預告',
      id: 'events',
      children: [
        { href: '/events#upcoming-events', label: '最新活動', id: 'events-upcoming' },
        { href: '/events#gallery', label: '活動展示', id: 'events-gallery' },
        { href: '/events#past-events', label: '過往活動', id: 'events-past' },
        { href: '/events#consult', label: '預約諮詢', id: 'events-consult' },
      ],
    },
    {
      href: '/classroom',
      label: '澳洲不動產小課堂',
      id: 'classroom',
      children: [
        { href: '/classroom#classroom-top', label: '全部主題', id: 'classroom-all' },
        { href: '/classroom?category=property#classroom-top', label: '澳洲房產', id: 'classroom-property' },
        { href: '/classroom?category=overseas#classroom-top', label: '海外買房', id: 'classroom-overseas' },
        { href: '/classroom?category=tax#classroom-top', label: '稅務法規', id: 'classroom-tax' },
        { href: '/classroom?category=travel#classroom-top', label: '旅遊生活', id: 'classroom-travel' },
        { href: '/classroom?category=management#classroom-top', label: '物業管理', id: 'classroom-management' },
      ],
    },
    {
      href: '/about',
      label: '關於我們',
      id: 'about',
      children: [
        { href: '/about#team-intro', label: '團隊介紹', id: 'about' },
        { href: '/about#team', label: '專業團隊', id: 'about-team' },
        { href: '/about#team-support', label: '後勤團隊', id: 'about-support' },
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
        <a href="${pageHref(item.href)}" class="site-nav__parent${parentActive}" aria-haspopup="true">${item.label}</a>
        <div class="site-nav__sub" role="group" aria-label="${item.label}">
          ${subLinks}
        </div>
      </div>`;
  }

  function searchFormHtml() {
    return `
      <form class="site-search" role="search" action="${pageHref('/search')}" method="get">
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
    if (window.AGBrand) {
      return window.AGBrand.brandLockupHtml({ href: pageHref('/'), footer: true });
    }
    return `<a href="index.html" class="brand-lockup"><span class="brand-lockup__primary">環球置業 Global Realty</span></a>`;
  }

  function brandHeader() {
    if (window.AGBrand?.brandHeaderHtml) {
      return window.AGBrand.brandHeaderHtml({ href: pageHref('/') });
    }
    return `${brandLockup()}${brandFrom()}`;
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
      <div class="site-header-shell">
        <header class="site-header site-header--nord" role="banner">
          <div class="site-header__inner">
            <div class="site-header__brand">
              ${brandHeader()}
            </div>
            <button type="button" class="nav-toggle" aria-label="開啟選單" aria-expanded="false">☰</button>
          </div>
        </header>
        <nav class="site-nav site-nav--nord" aria-label="主要導覽">
          ${navLinks}
          ${searchFormHtml()}
        </nav>
      </div>
    `;

    const header = headerEl.querySelector('.site-header');
    const shell = headerEl.querySelector('.site-header-shell');
    const toggle = headerEl.querySelector('.nav-toggle');
    const nav = headerEl.querySelector('.site-nav');

    function placeNavForViewport() {
      if (!nav || !shell) return;
      const mobile = window.matchMedia('(max-width: 1024px)').matches;
      if (mobile) {
        if (nav.parentElement !== document.body) document.body.appendChild(nav);
      } else if (nav.parentElement !== shell) {
        shell.appendChild(nav);
      }
    }

    placeNavForViewport();
    window.addEventListener('resize', placeNavForViewport, { passive: true });

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
      document.body.appendChild(backdrop);

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
          <a href="${pageHref('/')}">Global Realty</a>&nbsp;|&nbsp;
          All Rights Reserved&nbsp;|&nbsp;
          <a href="${pageHref('/privacy')}">隱私權政策</a>
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
            <div class="site-footer--nord__office">
              <h4>大巨蛋辦公室 Taipei Dome Office</h4>
              <p>台北市信義區忠孝東路四段 525 號 14–15 樓<br>THE COLLECTIVE 巨蛋國際中心</p>
            </div>
            <div class="site-footer--nord__office">
              <h4>台北 101 亞太總部 Taipei 101 APAC HQ</h4>
              <p>台北市信義區信義路五段 7 號<br>台北 101 45 樓 A-1 室</p>
            </div>
            <div class="site-footer--nord__office">
              <h4>澳洲總部 Sydney Office</h4>
              <p>Level 3, 370 Pitt Street<br>Sydney NSW 2000, Australia</p>
            </div>
            <div class="site-footer--nord__office">
              <h4>墨爾本 Melbourne Office</h4>
              <p>Level 3, 171 La Trobe Street<br>Melbourne VIC 3000, Australia</p>
            </div>
            <div class="site-footer--nord__office">
              <h4>布里斯本 Brisbane Office</h4>
              <p>7B/50-56 Sanders Street<br>Upper Mount Gravatt, QLD 4122</p>
            </div>
            <p class="site-footer--nord__email">
              <a href="mailto:taiwanmkt@globalrealty.com.au">taiwanmkt@globalrealty.com.au</a>
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
          <p>© ${new Date().getFullYear()} 環球置業 Global Realty · Your Global Property Partner · from 澳華國際集團 Award Global。以上資訊僅供參考，所有資訊與數據均以最新官方公告及專案最終版本為準。</p>
          <p class="site-footer--nord__sitemap"><a href="${pageHref('/sitemap')}">網站地圖</a></p>
        </div>
        ${copyrightBarHtml()}
      </footer>
    `;
  }

  function renderAboutSubnav() {
    if (currentPage !== 'about') return;
    const main = document.querySelector('main');
    if (!main) return;

    const subnav = document.createElement('nav');
    subnav.className = 'about-subnav';
    subnav.setAttribute('aria-label', '關於我們');
    subnav.innerHTML = `
      <div class="about-subnav__inner">
        <span class="about-subnav__label">關於我們</span>
        <div class="about-subnav__tabs">
          <a href="${pageHref('/about#team-intro')}" class="is-active">團隊介紹</a>
          <a href="${pageHref('/about#team')}">專業團隊</a>
          <a href="${pageHref('/about#team-support')}">後勤團隊</a>
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
    normalizePageLinks();
    loadDesignToolbar();
    loadFloatingDock();
  });

  document.addEventListener('click', (event) => {
    if (isDesignMode) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!shouldNormalizeHref(href)) return;
    const normalized = stripHtmlExtension(href);
    if (normalized === href) return;
    event.preventDefault();
    window.location.href = normalized;
  });

  function loadFloatingDock() {
    const script = document.createElement('script');
    script.src = 'js/floating-dock.js';
    script.onload = () => {
      window.AGFloatingDock?.renderFloatingDock();
      normalizePageLinks();
    };
    document.body.appendChild(script);
  }
})();
