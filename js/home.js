(function () {
  async function loadProperties() {
    if (window.AG_PROPERTIES?.properties?.length) {
      return window.AG_PROPERTIES.properties;
    }
    try {
      const response = await fetch('data/properties.json');
      if (!response.ok) throw new Error('Failed to load properties');
      const data = await response.json();
      return data.properties || [];
    } catch (error) {
      console.warn('Property fetch failed:', error);
      return window.AG_PROPERTIES?.properties || [];
    }
  }

  function renderFeaturedProperties(properties) {
    const container = document.querySelector('.property-preview-grid');
    if (!container || !window.GRPropertyCards) return;

    const featured = properties.filter((p) => p.featured).slice(0, 2);
    if (!featured.length) {
      container.innerHTML = '<p class="property-grid__empty">建案資料暫時無法載入。</p>';
      return;
    }

    container.innerHTML = featured
      .map((property) => window.GRPropertyCards.renderPropertyCard(property))
      .join('');
  }

  document.addEventListener('DOMContentLoaded', async () => {
    if (document.body.dataset.page !== 'home') return;
    const properties = await loadProperties();
    renderFeaturedProperties(properties);
  });
})();
