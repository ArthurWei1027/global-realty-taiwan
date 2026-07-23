(function () {
  let allVideos = [];
  let category = '';
  let searchQuery = '';

  async function loadVideos() {
    try {
      const response = await fetch('data/classroom.json?v=20260723d');
      if (!response.ok) throw new Error('Failed to load classroom');
      const data = await response.json();
      return data.videos || [];
    } catch (error) {
      console.warn('Classroom fetch failed:', error);
      return [];
    }
  }

  function cardHtml(video, { embed = false } = {}) {
    const tag = video.categoryLabel
      ? `<span class="classroom-card__tag">${video.categoryLabel}</span>`
      : '';

    if (embed && video.videoSrc) {
      return `
      <article class="classroom-card classroom-card--video" id="${video.slug}">
        <div class="classroom-card__media">
          <video
            class="classroom-card__video"
            controls
            playsinline
            preload="none"
            poster="${video.thumbnail}"
            aria-label="${video.title}"
          >
            <source src="${video.videoSrc}" type="video/mp4">
            您的瀏覽器不支援影片播放。
          </video>
        </div>
        <h3 class="classroom-card__title">${video.title}</h3>
      </article>
    `;
    }

    return `
      <a href="classroom.html#${video.slug}" class="classroom-card" id="${video.slug}">
        <span class="classroom-card__thumb">
          <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" width="320" height="480">
          <span class="classroom-card__play" aria-hidden="true">▶</span>
        </span>
        ${tag}
        <span class="classroom-card__title">${video.title}</span>
      </a>
    `;
  }

  function filteredVideos() {
    return allVideos.filter((v) => {
      if (category && v.category !== category) return false;
      if (searchQuery) {
        const hay = `${v.title} ${v.summary || ''} ${v.categoryLabel || ''}`.toLowerCase();
        if (!hay.includes(searchQuery)) return false;
      }
      return true;
    });
  }

  function renderPreview(videos, limit) {
    const container = document.querySelector('.classroom-preview-grid');
    if (!container) return;
    container.innerHTML = videos.slice(0, limit).map((v) => cardHtml(v)).join('');
  }

  function renderFull() {
    const container = document.querySelector('.classroom-grid');
    const summary = document.querySelector('.classroom-toolbar__summary');
    if (!container) return;

    const items = filteredVideos();
    if (summary) {
      const label = category
        ? document.querySelector(`.news-sidebar__filter[data-category="${category}"]`)?.textContent || '主題'
        : '全部主題';
      summary.textContent = items.length
        ? `目前顯示「${label}」共 ${items.length} 支`
        : `「${label}」目前尚無內容，歡迎稍後再來。`;
    }

    container.innerHTML = items.length
      ? items.map((v) => cardHtml(v, { embed: true })).join('')
      : '<p class="classroom-grid__empty">此分類暫時沒有內容，請改選其他主題或清除搜尋條件。</p>';
  }

  function initSearch() {
    const input = document.getElementById('classroom-search');
    if (!input) return;
    input.addEventListener('input', () => {
      searchQuery = input.value.trim().toLowerCase();
      renderFull();
    });
  }

  function initFilters() {
    const filterNav = document.querySelector('.classroom-sidebar .news-sidebar__filters');
    if (!filterNav) return;

    filterNav.querySelectorAll('[data-category]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        category = btn.dataset.category || '';
        filterNav.querySelectorAll('[data-category]').forEach((el) => el.classList.remove('is-active'));
        btn.classList.add('is-active');
        renderFull();
      });
    });
  }

  function scrollToHash() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    allVideos = await loadVideos();
    if (document.body.dataset.page === 'classroom') {
      renderFull();
      initSearch();
      initFilters();
      scrollToHash();
    }
    if (document.body.dataset.page === 'home') {
      renderPreview(allVideos, 3);
    }
  });
})();
