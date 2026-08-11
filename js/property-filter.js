class PropertyFilter {
  constructor() {
    this.filterForm = document.querySelector('.filter-component');
    this.gridContainer = document.querySelector('.property-grid');
    this.cityListContainer = document.querySelector('.property-city-list');
    this.districtSelect = document.getElementById('filter-district');
    this.allProperties = [];
    if (this.cityListContainer) {
      this.initCityList();
    } else if (this.filterForm && this.gridContainer) {
      this.init();
    }
  }

  async loadProperties() {
    if (window.AG_PROPERTIES?.properties?.length) {
      return window.AG_PROPERTIES.properties;
    }
    try {
      const response = await fetch('data/properties.json');
      if (!response.ok) throw new Error('Failed to load properties');
      const data = await response.json();
      return data.properties || [];
    } catch (error) {
      console.warn('Property fetch failed, using embedded fallback:', error);
      return window.AG_PROPERTIES?.properties || [];
    }
  }

  contactUrl(property) {
    return `property.html?slug=${encodeURIComponent(property.slug)}`;
  }

  async initCityList() {
    this.allProperties = await this.loadProperties();
    if (!this.allProperties.length) {
      this.cityListContainer.innerHTML =
        '<p class="property-grid__empty">建案資料暫時無法載入，請稍後再試。</p>';
      return;
    }
    this.renderCityList(this.allProperties);
  }

  cityLabel(city) {
    const labels = { sydney: '雪梨 SYDNEY', melbourne: '墨爾本 MELBOURNE' };
    return labels[city] || city.toUpperCase();
  }

  cityCardHtml(property) {
    const href = this.contactUrl(property);
    return `
      <a href="${href}" class="property-city-card">
        <img src="${property.image}" alt="${property.imageAlt}" loading="lazy" width="600" height="400">
        <span class="property-city-card__label">${property.name}</span>
      </a>
    `;
  }

  renderCityList(properties) {
    const groups = new Map();
    properties.forEach((p) => {
      if (!groups.has(p.city)) groups.set(p.city, []);
      groups.get(p.city).push(p);
    });

    const order = ['sydney', 'melbourne'];
    const sections = order
      .filter((city) => groups.has(city))
      .map(
        (city) => `
        <section class="property-city-section">
          <h2 class="property-city-section__title">${this.cityLabel(city)}</h2>
          <div class="property-city-grid">
            ${groups.get(city).map((p) => this.cityCardHtml(p)).join('')}
          </div>
        </section>
      `
      )
      .join('');

    this.cityListContainer.innerHTML = sections;
  }

  async init() {
    this.allProperties = await this.loadProperties();
    if (!this.allProperties.length) {
      this.gridContainer.innerHTML =
        '<p class="property-grid__empty">建案資料暫時無法載入，請稍後再試。</p>';
      return;
    }
    this.populateDistrictOptions();
    this.restoreFromUrl();
    this.initEvents();
    this.render();
  }

  populateDistrictOptions() {
    if (!this.districtSelect) return;
    const districts = new Map();
    this.allProperties.forEach((property) => {
      if (property.district && property.districtLabel) {
        districts.set(property.district, property.districtLabel);
      }
    });
    const currentValue = this.districtSelect.value;
    this.districtSelect.innerHTML =
      '<option value="">選擇地區...</option>' +
      [...districts.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], 'zh-Hant'))
        .map(([value, label]) => `<option value="${value}">${label}</option>`)
        .join('');
    if (currentValue && districts.has(currentValue)) {
      this.districtSelect.value = currentValue;
    }
  }

  initEvents() {
    this.filterForm.querySelectorAll('select').forEach((select) => {
      select.addEventListener('change', () => {
        this.updateUrl();
        this.render();
      });
    });
  }

  getFilters() {
    const formData = new FormData(this.filterForm);
    return {
      city: formData.get('city') || '',
      type: formData.get('type') || '',
      district: formData.get('district') || '',
      status: new URLSearchParams(window.location.search).get('status') || '',
    };
  }

  restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    ['city', 'type', 'district'].forEach((key) => {
      const value = params.get(key);
      const select = this.filterForm.querySelector(`[name="${key}"]`);
      if (select && value) select.value = value;
    });
  }

  updateUrl() {
    const { city, type, district } = this.getFilters();
    const params = new URLSearchParams(window.location.search);
    ['city', 'type', 'district'].forEach((key) => params.delete(key));
    if (city) params.set('city', city);
    if (type) params.set('type', type);
    if (district) params.set('district', district);
    const query = params.toString();
    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;
    history.replaceState(null, '', newUrl);
  }

  filterProperties() {
    const { city, type, district, status } = this.getFilters();
    return this.allProperties.filter((property) => {
      if (city && property.city !== city) return false;
      if (type && property.type !== type) return false;
      if (district && property.district !== district) return false;
      if (status && property.status !== status) return false;
      return true;
    });
  }

  render() {
    const filtered = this.filterProperties();
    this.gridContainer.style.opacity = '0.5';
    requestAnimationFrame(() => {
      if (filtered.length === 0) {
        this.gridContainer.innerHTML =
          '<p class="property-grid__empty">目前篩選條件下暫無符合建案，請調整篩選條件。</p>';
      } else {
        this.gridContainer.innerHTML = filtered
          .map((property) => this.cardHtml(property))
          .join('');
      }
      this.gridContainer.style.opacity = '1';
    });
  }

  cardHtml(property) {
    if (window.GRPropertyCards?.renderPropertyCard) {
      return window.GRPropertyCards.renderPropertyCard(property);
    }
    const contactUrl = this.contactUrl(property);
    return `
      <article class="property-card property-card--nord">
        <a href="${contactUrl}" class="property-card__media" aria-label="查看 ${property.name}">
          <img class="property-card__image" src="${property.image}" alt="${property.imageAlt}" width="400" height="500" loading="lazy">
        </a>
        <div class="property-card__info">
          <h3 class="property-card__title"><a href="${contactUrl}">${property.name}</a></h3>
          <p class="property-card__location">${property.districtLabel || property.cityLabel}</p>
          <p class="property-card__price">${property.priceLabel}</p>
        </div>
      </article>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => new PropertyFilter());
