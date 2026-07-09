(function () {
  const PAGES = [
    { label: '首頁', href: 'index.html', id: 'home' },
    { label: '精選建案', href: 'properties.html', id: 'properties' },
    { label: '租賃管理', href: 'leasing.html', id: 'leasing' },
    { label: '活動預告', href: 'events.html', id: 'events' },
    { label: '小課堂', href: 'classroom.html', id: 'classroom' },
    {
      label: '關於我們',
      href: 'about.html',
      id: 'about',
      children: [
        { label: '環球置業', href: 'about.html', id: 'about' },
        { label: '澳華國際集團', href: 'group.html', id: 'group' },
      ],
    },
  ];

  const currentPage = document.body.dataset.page || '';

  function pageHref(path) {
    return `${path}?design=1`;
  }

  function isGroupActive(page) {
    if (currentPage === page.id) return true;
    return page.children?.some((child) => child.id === currentPage) ?? false;
  }

  const style = document.createElement('style');
  style.textContent = `
    body.design-preview-mode { padding-bottom: 3.75rem; }
    .design-preview-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      flex-wrap: wrap;
      padding: 0.5rem 1rem;
      background: #0f172a;
      color: #f8fafc;
      font-family: "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif;
      font-size: 0.8125rem;
      box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.2);
    }
    .design-preview-bar a {
      color: #fde68a;
      text-decoration: none;
      white-space: nowrap;
    }
    .design-preview-bar a:hover { text-decoration: underline; }
    .design-preview-bar__label {
      font-weight: 600;
      color: #94a3b8;
      white-space: nowrap;
    }
    .design-preview-bar__nav {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
      flex: 1;
      justify-content: center;
      align-items: center;
    }
    .design-preview-bar__nav a,
    .design-preview-bar__nav span {
      padding: 0.25rem 0.55rem;
      border-radius: 6px;
      color: #e2e8f0;
      background: rgba(255,255,255,0.08);
      text-decoration: none;
      font-size: 0.75rem;
    }
    .design-preview-bar__nav a.is-active {
      background: #b45309;
      color: #fff;
    }
    .design-preview-bar__nav a:hover:not(.is-active) {
      background: rgba(255,255,255,0.15);
      text-decoration: none;
    }
    .design-preview-bar__group {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      padding: 0.15rem;
      border-radius: 8px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .design-preview-bar__group-label {
      padding: 0.2rem 0.45rem;
      color: #94a3b8 !important;
      background: transparent !important;
      font-size: 0.7rem;
    }
    .design-preview-bar__sub a {
      font-size: 0.68rem;
      padding: 0.2rem 0.45rem;
    }
    .design-preview-bar__sub a.is-active {
      background: #2d7a7a;
    }
  `;
  document.head.appendChild(style);

  function renderNavLinks() {
    return PAGES.map((page) => {
      if (!page.children) {
        const active = currentPage === page.id ? ' is-active' : '';
        return `<a href="${pageHref(page.href)}" class="${active.trim()}">${page.label}</a>`;
      }

      const parentActive = isGroupActive(page) ? ' is-active' : '';
      const subLinks = page.children
        .map((child) => {
          const active = currentPage === child.id ? ' is-active' : '';
          return `<a href="${pageHref(child.href)}" class="${active.trim()}">${child.label}</a>`;
        })
        .join('');

      return `
        <span class="design-preview-bar__group">
          <a href="${pageHref(page.href)}" class="${parentActive.trim()}">${page.label}</a>
          <span class="design-preview-bar__sub">${subLinks}</span>
        </span>`;
    }).join('');
  }

  const bar = document.createElement('div');
  bar.className = 'design-preview-bar';
  bar.setAttribute('role', 'navigation');
  bar.setAttribute('aria-label', '設計預覽導覽');
  bar.innerHTML = `
    <span class="design-preview-bar__label">Design Preview</span>
    <nav class="design-preview-bar__nav">${renderNavLinks()}</nav>
    <a href="design/index.html">返回預覽站</a>
  `;

  document.body.classList.add('design-preview-mode');
  document.body.appendChild(bar);
})();
