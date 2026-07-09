(function () {
  const pages = window.DESIGN_PAGES || [];

  function liveUrl(page) {
    return `${page.live}?design=1`;
  }

  function renderGrid(container) {
    if (!container) return;

    container.innerHTML = pages
      .map(
        (page) => `
      <article class="portal-card" data-page="${page.id}">
        <div class="portal-card__thumb">
          <span class="portal-card__num">${page.num}</span>
          <img src="${page.png}" alt="${page.title} 設計稿" loading="lazy"
            onerror="this.style.display='none';this.parentElement.classList.add('portal-card__thumb--missing');this.parentElement.insertAdjacentHTML('beforeend','<span>設計稿載入中<br><small>請執行 export-design-screenshots.py</small></span>')">
        </div>
        <div class="portal-card__body">
          <h2>${page.title}</h2>
          ${page.subtitle ? `<p class="portal-card__subtitle">${page.subtitle}</p>` : ''}
          <p class="portal-card__path">${page.live.replace('../', '/')}</p>
          <div class="portal-card__actions">
            <a class="portal-btn portal-btn--primary" href="${liveUrl(page)}">Live 預覽（可 Design Mode 編輯）</a>
            <a class="portal-btn portal-btn--secondary" href="viewer.html?page=${page.id}">檢視 PNG 設計稿</a>
          </div>
        </div>
      </article>`
      )
      .join('');
  }

  function renderGallery(container) {
    if (!container) return;

    container.innerHTML = pages
      .map(
        (page) => `
      <section class="page-block" id="${page.id}">
        <div class="page-block__header">
          <h2>${page.num} · ${page.title}${page.subtitle ? ` <small>（${page.subtitle}）</small>` : ''}</h2>
          <div class="portal-card__actions">
            <a class="portal-btn portal-btn--primary" href="${liveUrl(page)}">Live 預覽 ↗</a>
            <a class="portal-btn portal-btn--ghost" href="viewer.html?page=${page.id}">全螢幕</a>
          </div>
        </div>
        <img src="${page.png}" alt="${page.title}" loading="lazy">
      </section>`
      )
      .join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderGrid(document.getElementById('portal-grid'));
    renderGallery(document.getElementById('portal-gallery'));
  });
})();
