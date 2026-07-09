(function () {
  if (document.body.dataset.page !== 'property-detail') return;

  function getSlug() {
    return new URLSearchParams(window.location.search).get('slug') || '';
  }

  function factRows(facts) {
    return facts
      .map(
        (f) => `
        <div class="pd-fact">
          <dt>${f.label}</dt>
          <dd>${f.value}</dd>
        </div>`
      )
      .join('');
  }

  function seriesTable(series) {
    if (!series) return '';
    const rows = series.rows
      .map(
        (r) => `
        <tr>
          <th scope="row">${r[0]}</th>
          <td>${r[1]}</td>
          <td>${r[2]}</td>
        </tr>`
      )
      .join('');
    return `
      <section class="pd-section">
        <div class="container">
          <h2 class="section-heading">${series.heading}</h2>
          <div class="pd-table-wrap">
            <table class="pd-table">
              <thead><tr><th>系列</th><th>戶型</th><th>備註</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </section>`;
  }

  function amenities(am) {
    if (!am) return '';
    const groups = am.groups
      .map(
        (g) => `
        <article class="pd-amenity">
          <h3>${g.title}</h3>
          <p>${g.desc}</p>
        </article>`
      )
      .join('');
    return `
      <section class="pd-section pd-section--muted">
        <div class="container">
          <h2 class="section-heading">${am.heading}</h2>
          <div class="pd-amenities">${groups}</div>
        </div>
      </section>`;
  }

  function render() {
    const root = document.querySelector('[data-property-detail]');
    const slug = getSlug();
    const property = (window.AG_PROPERTIES?.properties || []).find((p) => p.slug === slug);
    const detail = window.AG_PROPERTY_DETAILS?.[slug];

    if (!property || !detail) {
      root.innerHTML = `
        <div class="container" style="padding:var(--space-16) var(--space-4);text-align:center;">
          <h1>找不到此建案</h1>
          <p class="text-muted" style="margin:var(--space-4) 0 var(--space-6);">建案可能已下架或連結有誤，歡迎瀏覽其他精選建案。</p>
          <a href="properties.html" class="btn btn-nord">返回精選建案</a>
        </div>`;
      return;
    }

    document.title = `${property.name}｜精選建案｜環球置業 Global Realty`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', property.summary);
    window.GRSeo?.injectPropertySchema(property);
    window.GRSeo?.refreshPageMeta?.();
    const consultUrl = `index.html?property=${encodeURIComponent(property.slug)}&cta=${encodeURIComponent(property.ctaType)}#consult`;

    root.innerHTML = `
      <section class="pd-hero">
        <img class="pd-hero__img" src="${property.image}" alt="${property.imageAlt}">
        <div class="pd-hero__overlay">
          <div class="container">
            <p class="pd-hero__eyebrow">${detail.heroTagline}</p>
            <h1>${property.name}</h1>
            <p class="pd-hero__address">${detail.address}</p>
            <div class="pd-hero__badges">
              <span class="property-badge property-badge--status">${property.statusLabel}</span>
              <span class="property-badge">${property.cityLabel} · ${property.districtLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="pd-section">
        <div class="container pd-summary">
          <div class="pd-summary__main">
            <h2 class="section-heading">項目概況</h2>
            ${detail.overview.map((p) => `<p>${p}</p>`).join('')}
            <h3 class="pd-subheading">項目亮點</h3>
            <ul class="pd-highlights">
              ${detail.highlights.map((h) => `<li>${h}</li>`).join('')}
            </ul>
          </div>
          <aside class="pd-summary__aside">
            <p class="pd-price__label">價格</p>
            <p class="pd-price">${property.priceLabel}</p>
            <p class="pd-yield text-muted">${property.yieldRange}</p>
            <dl class="pd-facts">${factRows(detail.facts)}</dl>
            <a href="${consultUrl}" class="btn btn-nord pd-cta">${property.ctaLabel}</a>
            <a href="index.html#consult" class="btn btn-secondary pd-cta">預約專屬顧問</a>
          </aside>
        </div>
      </section>

      <section class="pd-section pd-section--muted">
        <div class="container">
          <h2 class="section-heading">地理位置與周邊配套</h2>
          <p class="section-lead">${detail.location.lead}</p>
          <ul class="pd-location-list">
            ${detail.location.items.map((i) => `<li>${i}</li>`).join('')}
          </ul>
        </div>
      </section>

      ${seriesTable(detail.series)}
      ${amenities(detail.amenities)}

      <section class="pd-section">
        <div class="container" style="text-align:center;">
          <h2 class="section-heading">想了解 ${property.name} 更多資訊？</h2>
          <p class="section-lead">環球置業專屬顧問將為您提供最新樓書、價目表與戶型建議。</p>
          <a href="${consultUrl}" class="btn btn-nord" style="margin-top:var(--space-4);">立即諮詢</a>
        </div>
        <div class="container">
          <p class="disclaimer properties-disclaimer" style="margin-top:var(--space-10);">
            本頁面內容整理自開發商公開宣傳資料，僅供參考。所有設計、平面圖、面積、景觀、配套、價格與完工時間等資訊，可能因審批、市場及規劃變更而調整，實際以買賣合約為準。本頁所述租金回報參考區間不構成任何回報保證，亦不構成投資、財務或法律建議，請諮詢持牌專業顧問。
          </p>
        </div>
      </section>
    `;
  }

  document.addEventListener('DOMContentLoaded', render);
})();
