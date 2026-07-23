class NewsRenderer {
  constructor(options = {}) {
    this.listContainer = document.querySelector(options.listSelector || '.news-list');
    this.sidebarContainer = document.querySelector(options.sidebarSelector || '.news-sidebar__list');
    this.limit = options.limit || 0;
    this.category = options.category || '';
    this.withImage = options.withImage || false;
    this.imageOnly = options.imageOnly || false;
    this.searchQuery = '';
    if (this.listContainer || this.sidebarContainer) {
      this.init();
    }
  }

  async init() {
    try {
      const response = await fetch('data/news.json');
      if (!response.ok) throw new Error('Failed to load news');
      const data = await response.json();
      this.allNews = data.news || [];
      this.render();
      this.initFilters();
      this.initEventSearch();
    } catch (error) {
      console.error('News load failed:', error);
      if (this.listContainer) {
        this.listContainer.innerHTML = '<p class="news-list__empty">消息暫時無法載入，請稍後再試。</p>';
      }
    }
  }

  filterNews() {
    let items = [...this.allNews];
    if (this.category) {
      items = items.filter((n) => n.category === this.category);
    }
    if (this.searchQuery) {
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(this.searchQuery) ||
          n.summary.toLowerCase().includes(this.searchQuery)
      );
    }
    if (this.limit > 0) {
      items = items.slice(0, this.limit);
    }
    return items;
  }

  eventHref(item) {
    if (item.category === 'event') {
      return `event.html?slug=${encodeURIComponent(item.slug)}`;
    }
    return `events.html#${item.slug}`;
  }

  cardHtml(item, compact = false, withImage = false) {
    const href = this.eventHref(item);
    const imageSrc = item.image || 'assets/images/news-placeholder.svg';

    if (compact) {
      return `
        <a href="${href}" class="news-sidebar__item">
          <time class="news-card__date">${item.dateLabel}</time>
          <span class="news-sidebar__title">${item.title}</span>
        </a>
      `;
    }

    if (withImage) {
      if (this.imageOnly) {
        return `
          <a href="${href}" class="home-event-cover">
            <img src="${imageSrc}" alt="${item.title}" loading="lazy">
          </a>
        `;
      }
      return `
        <a href="${href}" class="event-card">
          <img class="event-card__image" src="${imageSrc}" alt="" loading="lazy">
          <div class="event-card__body">
            <time class="event-card__date" datetime="${item.date}">${item.dateLabel}</time>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
          </div>
        </a>
      `;
    }

    if (document.body.dataset.page === 'events') {
      return `
        <a href="${href}" class="event-card" id="${item.slug}">
          <img class="event-card__image" src="${imageSrc}" alt="" loading="lazy">
          <div class="event-card__body">
            <time class="event-card__date" datetime="${item.date}">${item.dateLabel}</time>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
          </div>
        </a>
      `;
    }

    return `
      <article class="news-card" id="${item.slug}">
        <div class="news-card__meta">
          <time datetime="${item.date}">${item.dateLabel}</time>
          <span class="tag">${item.categoryLabel}</span>
        </div>
        <h3>${item.title}</h3>
        <p class="text-muted">${item.summary}</p>
      </article>
    `;
  }

  render() {
    const items = this.filterNews();
    if (this.listContainer) {
      this.listContainer.innerHTML = items.length
        ? items.map((item) => this.cardHtml(item, false, this.withImage)).join('')
        : '<p class="news-list__empty">目前分類下暫無消息。</p>';
    }
    if (this.sidebarContainer) {
      const sidebarItems = this.allNews.slice(0, 5);
      this.sidebarContainer.innerHTML = sidebarItems
        .map((item) => this.cardHtml(item, true))
        .join('');
    }
  }

  initFilters() {
    const filterNav = document.querySelector('.news-sidebar__filters');
    if (!filterNav) return;

    filterNav.querySelectorAll('[data-category]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.category = btn.dataset.category || '';
        filterNav.querySelectorAll('[data-category]').forEach((el) => el.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.render();
      });
    });

    const hash = window.location.hash.replace('#', '');
    if (hash && this.allNews.some((n) => n.slug === hash)) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  initEventSearch() {
    const input = document.getElementById('event-search');
    if (!input || document.body.dataset.page !== 'events') return;
    input.addEventListener('input', () => {
      this.searchQuery = input.value.trim().toLowerCase();
      this.render();
    });
  }
}

async function initHomeEventCarousel() {
  const root = document.querySelector('[data-event-carousel]');
  if (!root) return;

  let items = [];
  try {
    const response = await fetch('data/news.json');
    if (!response.ok) throw new Error('Failed to load news');
    const data = await response.json();
    items = (data.news || []).filter((n) => n.featured);
    if (items.length < 3) items = data.news || [];
    items = items.slice(0, 5);
  } catch (error) {
    console.warn('Event carousel load failed:', error);
    return;
  }
  if (!items.length) return;

  const slidesHtml = items
    .map(
      (item) => `
      <a class="event-slide" href="${window.GREvents?.eventUrl ? window.GREvents.eventUrl(item.slug) : (item.category === 'event' ? `event.html?slug=${encodeURIComponent(item.slug)}` : `events.html#${item.slug}`)}">
        <img class="event-slide__img" src="${item.image || 'assets/images/news-placeholder.svg'}" alt="${item.title}" loading="lazy">
        <span class="event-slide__caption">
          <time class="event-slide__date">${item.dateLabel}</time>
          <span class="event-slide__title">${item.title}</span>
        </span>
      </a>
    `
    )
    .join('');

  const dotsHtml = items
    .map(
      (_, i) =>
        `<button type="button" class="event-carousel__dot${i === 0 ? ' is-active' : ''}" aria-label="第 ${i + 1} 張" data-index="${i}"></button>`
    )
    .join('');

  root.innerHTML = `
    <div class="event-carousel__track" tabindex="0">${slidesHtml}</div>
    <button type="button" class="event-carousel__arrow event-carousel__arrow--prev" aria-label="上一張">‹</button>
    <button type="button" class="event-carousel__arrow event-carousel__arrow--next" aria-label="下一張">›</button>
    <div class="event-carousel__dots">${dotsHtml}</div>
  `;

  const track = root.querySelector('.event-carousel__track');
  const dots = Array.from(root.querySelectorAll('.event-carousel__dot'));
  const slides = Array.from(root.querySelectorAll('.event-slide'));

  function currentIndex() {
    return Math.round(track.scrollLeft / track.clientWidth);
  }

  function goTo(index) {
    const clamped = Math.max(0, Math.min(index, slides.length - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
  }

  function syncDots() {
    const idx = currentIndex();
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }

  root.querySelector('.event-carousel__arrow--prev').addEventListener('click', () => goTo(currentIndex() - 1));
  root.querySelector('.event-carousel__arrow--next').addEventListener('click', () => goTo(currentIndex() + 1));
  dots.forEach((dot) => dot.addEventListener('click', () => goTo(Number(dot.dataset.index))));

  let scrollTimer;
  track.addEventListener('scroll', () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(syncDots, 80);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'events') {
    new NewsRenderer({ withImage: true, category: 'event' });
  }
  if (document.body.dataset.page === 'home') {
    initHomeEventCarousel();
  }
});
