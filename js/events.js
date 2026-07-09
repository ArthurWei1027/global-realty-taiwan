(function () {
  const PAGE_SIZE = 6;

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

  function eventUrl(slug) {
    return `event.html?slug=${encodeURIComponent(slug)}`;
  }

  function monthKey(dateStr) {
    if (!dateStr || dateStr.length < 7) return '';
    return dateStr.slice(0, 7);
  }

  function monthLabel(key) {
    const [year, month] = key.split('-');
    return `${year} 年 ${parseInt(month, 10)} 月`;
  }

  function feedItemHtml(event, index) {
    const reverse = index % 2 === 1 ? ' event-feed-item--reverse' : '';
    const imageSrc = event.image || 'assets/images/news-placeholder.svg';
    const statusBadge =
      event.status === 'past'
        ? '<span class="event-feed-item__status event-feed-item__status--past">已結束</span>'
        : '';
    return `
      <article class="event-feed-item${reverse}">
        <a href="${eventUrl(event.slug)}" class="event-feed-item__media" tabindex="-1" aria-hidden="true">
          <img src="${imageSrc}" alt="${event.imageAlt || event.title}" loading="lazy">
        </a>
        <div class="event-feed-item__body">
          <div class="event-feed-item__meta-row">
            <p class="event-feed-item__category">${event.categoryLabel}</p>
            ${statusBadge}
          </div>
          <time class="event-feed-item__date" datetime="${event.date}">${event.dateLabel}</time>
          <h3 class="event-feed-item__title">
            <a href="${eventUrl(event.slug)}">${event.title}</a>
          </h3>
          <p class="event-feed-item__summary">${event.summary}</p>
        </div>
      </article>
    `;
  }

  function groupByMonth(events, status) {
    const groups = new Map();
    events.forEach((event) => {
      const key = monthKey(event.date);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(event);
    });
    const entries = Array.from(groups.entries());
    entries.sort((a, b) => (status === 'past' ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0])));
    return entries;
  }

  function renderGroupedFeed(events, status, startIndex = 0) {
    let index = startIndex;
    return groupByMonth(events, status)
      .map(([key, monthEvents]) => {
        const itemsHtml = monthEvents.map((event) => feedItemHtml(event, index++)).join('');
        return `
          <section class="event-feed-month" aria-labelledby="event-month-${key}">
            <h3 class="event-feed-month__heading" id="event-month-${key}">${monthLabel(key)}</h3>
            <div class="event-feed-month__items">${itemsHtml}</div>
          </section>
        `;
      })
      .join('');
  }

  function filterEvents(events, { status, category, query, month }) {
    let items = [...events];
    if (status) items = items.filter((e) => e.status === status);
    if (category) items = items.filter((e) => e.category === category);
    if (month) items = items.filter((e) => monthKey(e.date) === month);
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.categoryLabel.toLowerCase().includes(q) ||
          monthLabel(monthKey(e.date)).includes(q)
      );
    }
    const sortDir = status === 'past' ? -1 : 1;
    return items.sort((a, b) => (a.date < b.date ? sortDir : -sortDir));
  }

  function uniqueMonths(events, status) {
    const keys = new Set(
      events.filter((e) => !status || e.status === status).map((e) => monthKey(e.date)).filter(Boolean)
    );
    return Array.from(keys).sort((a, b) => b.localeCompare(a));
  }

  class EventsPage {
    constructor() {
      this.root = document.querySelector('[data-events-feed]');
      this.loadMoreBtn = document.querySelector('[data-events-load-more]');
      this.monthSelect = document.getElementById('events-upcoming-month');
      this.countEl = document.querySelector('[data-events-count]');
      if (!this.root) return;

      this.allEvents = [];
      this.status = 'upcoming';
      this.category = '';
      this.month = '';
      this.query = '';
      this.visibleLimit = PAGE_SIZE;
      this.init();
    }

    async init() {
      this.allEvents = await loadEvents();
      this.bindFilters();
      this.render();
    }

    bindFilters() {
      const search = document.getElementById('events-upcoming-search');
      if (search) {
        search.addEventListener('input', () => {
          this.query = search.value.trim().toLowerCase();
          this.visibleLimit = PAGE_SIZE;
          this.render();
        });
      }

      const filters = document.querySelector('.events-upcoming__filters');
      if (filters) {
        filters.querySelectorAll('[data-event-category]').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.category = btn.dataset.eventCategory || '';
            filters.querySelectorAll('[data-event-category]').forEach((el) => el.classList.remove('is-active'));
            btn.classList.add('is-active');
            this.visibleLimit = PAGE_SIZE;
            this.render();
          });
        });
      }

      document.querySelectorAll('[data-event-status]').forEach((tab) => {
        tab.addEventListener('click', () => {
          this.status = tab.dataset.eventStatus || 'upcoming';
          this.month = '';
          this.visibleLimit = PAGE_SIZE;
          document.querySelectorAll('[data-event-status]').forEach((el) => {
            const active = el === tab;
            el.classList.toggle('is-active', active);
            el.setAttribute('aria-selected', active ? 'true' : 'false');
          });
          this.render();
        });
      });

      if (this.monthSelect) {
        this.monthSelect.addEventListener('change', () => {
          this.month = this.monthSelect.value;
          this.visibleLimit = PAGE_SIZE;
          this.render();
        });
      }

      if (this.loadMoreBtn) {
        this.loadMoreBtn.addEventListener('click', () => {
          this.visibleLimit += PAGE_SIZE;
          this.render();
        });
      }
    }

    updateMonthOptions(filteredForStatus) {
      if (!this.monthSelect) return;
      const months = uniqueMonths(this.allEvents, this.status);
      const current = this.month;
      this.monthSelect.innerHTML =
        '<option value="">全部月份</option>' +
        months
          .map((key) => `<option value="${key}">${monthLabel(key)}</option>`)
          .join('');
      if (months.includes(current)) {
        this.monthSelect.value = current;
      } else {
        this.month = '';
        this.monthSelect.value = '';
      }

      const availableInFilter = new Set(filteredForStatus.map((e) => monthKey(e.date)));
      Array.from(this.monthSelect.options).forEach((opt) => {
        if (!opt.value) return;
        opt.disabled = !availableInFilter.has(opt.value) && !!this.category;
      });
    }

    render() {
      const filtered = filterEvents(this.allEvents, {
        status: this.status,
        category: this.category,
        query: this.query,
        month: this.month,
      });

      this.updateMonthOptions(
        filterEvents(this.allEvents, { status: this.status, category: this.category, query: '', month: '' })
      );

      const visible = filtered.slice(0, this.visibleLimit);
      const hasMore = filtered.length > this.visibleLimit;

      if (this.countEl) {
        const statusLabel = this.status === 'past' ? '已結束' : '即將舉行';
        this.countEl.textContent =
          filtered.length > 0
            ? `共 ${filtered.length} 場${statusLabel}活動${filtered.length > visible.length ? `，目前顯示 ${visible.length} 場` : ''}`
            : '';
      }

      this.root.innerHTML = visible.length
        ? renderGroupedFeed(visible, this.status)
        : '<p class="event-feed__empty">目前沒有符合條件的活動，歡迎透過下方表單留下聯絡方式。</p>';

      if (this.loadMoreBtn) {
        this.loadMoreBtn.hidden = !hasMore;
        if (hasMore) {
          this.loadMoreBtn.textContent = `載入更多（尚有 ${filtered.length - visible.length} 場）`;
        }
      }
    }
  }

  window.GREvents = { loadEvents, eventUrl, filterEvents, monthKey, monthLabel };

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'events') {
      new EventsPage();
    }
  });
})();
