(function () {
  const pages = window.DESIGN_PAGES || [];
  const params = new URLSearchParams(window.location.search);
  const pageId = params.get('page') || pages[0]?.id;
  const current = pages.find((p) => p.id === pageId) || pages[0];
  const index = pages.findIndex((p) => p.id === current.id);
  const prev = pages[index - 1];
  const next = pages[index + 1];

  function liveUrl(page) {
    return `${page.live}?design=1`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.title = `${current.title}｜設計稿預覽`;

    const titleEl = document.getElementById('viewer-title');
    const imgEl = document.getElementById('viewer-image');
    const prevLink = document.getElementById('viewer-prev');
    const nextLink = document.getElementById('viewer-next');
    const liveLink = document.getElementById('viewer-live');

    if (titleEl) titleEl.textContent = `${current.num} · ${current.title}`;
    if (imgEl) {
      imgEl.src = current.png;
      imgEl.alt = `${current.title} 設計稿`;
      imgEl.onerror = () => {
        imgEl.style.display = 'none';
        const missing = document.getElementById('viewer-missing');
        if (missing) missing.hidden = false;
      };
    }
    if (prevLink) {
      prevLink.href = prev ? `viewer.html?page=${prev.id}` : '#';
      prevLink.style.visibility = prev ? 'visible' : 'hidden';
    }
    if (nextLink) {
      nextLink.href = next ? `viewer.html?page=${next.id}` : '#';
      nextLink.style.visibility = next ? 'visible' : 'hidden';
    }
    if (liveLink) liveLink.href = liveUrl(current);
  });
})();
