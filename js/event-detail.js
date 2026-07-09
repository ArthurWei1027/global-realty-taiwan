(function () {
  if (document.body.dataset.page !== 'event-detail') return;

  function getSlug() {
    return new URLSearchParams(window.location.search).get('slug') || '';
  }

  async function loadEvents() {
    try {
      const response = await fetch('data/events.json');
      if (!response.ok) throw new Error('Failed to load events');
      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.warn('Events fetch failed:', error);
      return window.GR_EVENTS?.events || [];
    }
  }

  function moreEventCard(event) {
    const href = `event.html?slug=${encodeURIComponent(event.slug)}`;
    const imageSrc = event.image || 'assets/images/news-placeholder.svg';
    return `
      <a href="${href}" class="event-more-card">
        <img class="event-more-card__img" src="${imageSrc}" alt="" loading="lazy">
        <div class="event-more-card__body">
          <time datetime="${event.date}">${event.dateLabel}</time>
          <h3>${event.title}</h3>
        </div>
      </a>
    `;
  }

  function detailList(items) {
    if (!items?.length) return '';
    return `
      <ul class="event-detail__details">
        ${items.map((item) => `<li><strong>${item.label}：</strong>${item.value}</li>`).join('')}
      </ul>
    `;
  }

  async function render() {
    const root = document.querySelector('[data-event-detail]');
    const slug = getSlug();
    const events = await loadEvents();
    const event = events.find((e) => e.slug === slug);

    if (!event) {
      root.innerHTML = `
        <div class="container" style="padding:var(--space-16) var(--space-4);text-align:center;">
          <h1>找不到此活動</h1>
          <p class="text-muted" style="margin:var(--space-4) 0 var(--space-6);">活動可能已下架或連結有誤，歡迎返回活動列表瀏覽其他場次。</p>
          <a href="events.html" class="btn btn-nord">返回活動預告</a>
        </div>`;
      return;
    }

    document.title = `${event.title}｜活動預告｜環球置業 Global Realty`;

    const heroSrc = event.heroImage || event.image || 'assets/images/news-placeholder.svg';
    const posterSrc = event.posterImage || event.heroImage || event.image;
    const moreEvents = events.filter((e) => e.slug !== slug).slice(0, 2);

    root.innerHTML = `
      <section class="event-detail-hero">
        <img class="event-detail-hero__img" src="${heroSrc}" alt="${event.imageAlt || event.title}">
      </section>

      <section class="event-detail-head">
        <div class="container event-detail-head__inner">
          <div class="event-detail-head__main">
            <p class="event-detail-head__category">${event.categoryLabel}</p>
            <h1>${event.title}</h1>
            <div class="event-detail-head__meta">
              <div class="event-detail-meta">
                <h2 class="event-detail-meta__label">活動時間</h2>
                <p>${event.dateDisplay || event.dateLabel}</p>
              </div>
              <div class="event-detail-meta">
                <h2 class="event-detail-meta__label">活動地點</h2>
                <p>${event.location}</p>
              </div>
              <div class="event-detail-meta">
                <h2 class="event-detail-meta__label">活動類型</h2>
                <p>${event.typeLabel}</p>
              </div>
            </div>
          </div>
          <div class="event-detail-head__actions">
            <a href="${posterSrc}" class="btn btn-nord" download>下載海報</a>
            <a href="${event.ctaUrl || 'index.html#consult'}" class="btn btn-secondary">${event.ctaLabel || '預約諮詢'}</a>
          </div>
        </div>
      </section>

      <section class="event-detail-body">
        <div class="container event-detail-body__inner">
          <h2 class="section-heading">活動簡介</h2>
          ${event.introLead ? `<p class="event-detail-body__lead">${event.introLead}</p>` : ''}
          ${event.body.map((p) => `<p>${p}</p>`).join('')}
          ${detailList(event.details)}
        </div>
      </section>

      ${
        moreEvents.length
          ? `
      <section class="event-detail-more">
        <div class="container">
          <h2 class="section-heading">更多活動</h2>
          <div class="event-more-grid">
            ${moreEvents.map(moreEventCard).join('')}
          </div>
        </div>
      </section>`
          : ''
      }
    `;
  }

  document.addEventListener('DOMContentLoaded', render);
})();
