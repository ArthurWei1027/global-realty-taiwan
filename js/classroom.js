(function () {
  let allVideos = [];
  let category = '';
  let searchQuery = '';

  async function loadVideos() {
    try {
      const response = await fetch('data/classroom.json?v=20260811-video-library');
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
    const summary = video.summary
      ? `<p class="classroom-card__summary">${video.summary}</p>`
      : '';

    if (embed && video.embedUrl) {
      return `
      <article class="classroom-card classroom-card--video classroom-card--embed" id="${video.slug}">
        <div class="classroom-card__media classroom-card__media--embed">
          <button
            class="classroom-card__video-launch"
            type="button"
            data-embed-url="${video.embedUrl}"
            data-video-title="${video.title}"
            aria-label="播放：${video.title}">
            <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" width="640" height="360">
            <span class="classroom-card__play" aria-hidden="true">▶</span>
          </button>
        </div>
        ${tag}
        <h3 class="classroom-card__title">${video.title}</h3>
        ${summary}
      </article>
    `;
    }

    if (embed && video.videoSrc) {
      const isWide = video.videoLayout === 'wide';
      const cardClass = isWide ? ' classroom-card--wide' : '';
      const mediaClass = isWide ? ' classroom-card__media--wide' : '';
      const videoClass = isWide ? ' classroom-card__video--wide' : '';
      return `
      <article class="classroom-card classroom-card--video${cardClass}" id="${video.slug}">
        <div class="classroom-card__media${mediaClass}">
          <video
            class="classroom-card__video${videoClass}"
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
        ${tag}
        <h3 class="classroom-card__title">${video.title}</h3>
        ${summary}
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
        ${summary}
      </a>
    `;
  }

  function initVideoLaunch() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('.classroom-card__video-launch');
      if (!button) return;
      const embedUrl = button.dataset.embedUrl;
      if (!embedUrl) return;
      const title = button.dataset.videoTitle || '教學影片';
      const iframe = document.createElement('iframe');
      iframe.className = 'classroom-card__iframe';
      iframe.src = `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`;
      iframe.title = title;
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      button.replaceWith(iframe);
    });
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

  function restoreCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    category = params.get('category') || '';
  }

  function updateCategoryUrl() {
    const params = new URLSearchParams(window.location.search);
    if (category) params.set('category', category);
    else params.delete('category');
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ''}#classroom-top`;
    history.replaceState(null, '', url);
  }

  function syncActiveFilter(filterNav) {
    filterNav.querySelectorAll('[data-category]').forEach((el) => {
      el.classList.toggle('is-active', (el.dataset.category || '') === category);
    });
  }

  function initFilters() {
    const filterNav = document.querySelector('.classroom-sidebar .news-sidebar__filters');
    if (!filterNav) return;
    syncActiveFilter(filterNav);

    filterNav.querySelectorAll('[data-category]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        category = btn.dataset.category || '';
        syncActiveFilter(filterNav);
        updateCategoryUrl();
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
    initVideoLaunch();
    if (document.body.dataset.page === 'classroom') {
      restoreCategoryFromUrl();
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
