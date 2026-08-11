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

  function galleryFor(property) {
    const bySlug = {
      '623-collins': [
        [property.image, property.imageAlt],
        ['assets/images/optimized/623-collins.jpg', '623 Collins 項目建築與城市介面'],
        ['assets/images/optimized/cls-melbourne.jpg', '墨爾本城市生活圈'],
        ['assets/images/home-landscape.jpg', '墨爾本核心區住宅與城市景觀'],
      ],
      'aura-melbourne-square': [
        [property.image, property.imageAlt],
        ['assets/images/optimized/aura.jpg', 'AURA Melbourne Square 住宅塔樓'],
        ['assets/images/optimized/cls-melbourne.jpg', '墨爾本南岸與城市資源'],
        ['assets/images/home-landscape.jpg', '墨爾本城市生活氛圍'],
      ],
      'tallawong-green': [
        [property.image, property.imageAlt],
        ['assets/images/optimized/tallawong-green-living.jpg', 'Tallawong Green 室內客廳與生活空間'],
        ['assets/images/optimized/tallawong-green-park.jpg', 'Tallawong Green 社區公園與戶外綠化'],
        ['assets/images/optimized/tallawong-green-garden.jpg', 'Tallawong Green 花園住宅與社區景觀'],
      ],
      'sydney-harbour-collection': [
        [property.image, property.imageAlt],
        ['assets/images/optimized/footprint/sydney-harbour-bg.jpg', '雪梨港灣與北岸生活圈'],
        ['assets/images/optimized/cls-sydney-cbd.jpg', '雪梨核心商務區'],
        ['assets/images/optimized/about-city.jpg', '雪梨水岸住宅與城市天際線'],
      ],
      'sydney-cbd-residences': [
        [property.image, property.imageAlt],
        ['assets/images/optimized/cls-sydney-cbd.jpg', '雪梨 CBD 城市生活圈'],
        ['assets/images/optimized/footprint/sydney-harbour-bg.jpg', '雪梨港灣與商務資源'],
        ['assets/images/optimized/about-city.jpg', '雪梨城市住宅環境'],
      ],
    };
    return bySlug[property.slug] || [[property.image, property.imageAlt]];
  }

  function galleryHtml(property) {
    const images = galleryFor(property);
    return `
      <section class="pd-section pd-gallery-section">
        <div class="container">
          <div class="pd-section-head">
            <p class="pd-kicker">Project Gallery</p>
            <h2 class="section-heading">項目圖片與城市場景</h2>
          </div>
          <div class="pd-gallery">
            ${images
              .map(
                ([src, alt], index) => `
                <figure class="pd-gallery__item${index === 0 ? ' pd-gallery__item--primary' : ''}">
                  <img src="${src}" alt="${alt}" loading="lazy" decoding="async">
                </figure>`
              )
              .join('')}
          </div>
        </div>
      </section>`;
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
          <div class="pd-section-head">
            <p class="pd-kicker">Residence Mix</p>
            <h2 class="section-heading">${series.heading}</h2>
          </div>
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
          <div class="pd-section-head">
            <p class="pd-kicker">Amenities</p>
            <h2 class="section-heading">${am.heading}</h2>
          </div>
          <div class="pd-amenities">${groups}</div>
        </div>
      </section>`;
  }

  function valueCards(property, detail) {
    const cityText =
      property.city === 'melbourne'
        ? '墨爾本核心區以教育、金融、餐飲、文化與公共交通構成穩定需求，適合長期持有與出租配置。'
        : '雪梨核心區與北岸市場兼具商務、教育與高品質居住需求，租客來源穩定，供應相對有限。';
    const statusText =
      property.status === 'established'
        ? '現房可縮短等待時間，便於快速交割、出租與銜接租賃管理。'
        : '預售項目適合提前鎖定樓層、戶型與價格，並在交房前完成貸款、出租與配置規劃。';
    const cards = [
      ['區位邏輯', detail.location.lead],
      ['產品定位', `${property.typeLabel}產品，${property.statusLabel}狀態，適合依自住、出租或長期持有目標做配置。`],
      ['市場需求', cityText],
      ['配置節奏', statusText],
    ];
    return `
      <section class="pd-section pd-section--muted">
        <div class="container">
          <div class="pd-section-head">
            <p class="pd-kicker">Why This Project</p>
            <h2 class="section-heading">為什麼值得放進候選清單</h2>
          </div>
          <div class="pd-value-grid">
            ${cards.map(([title, body]) => `<article><h3>${title}</h3><p>${body}</p></article>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function overviewParagraphs(property, detail) {
    const cityContext =
      property.city === 'melbourne'
        ? '墨爾本核心區具備教育、金融、餐飲、藝文與公共交通等多重需求來源，適合以「城市核心資產」的角度評估長期持有價值。'
        : '雪梨核心區與北岸生活圈兼具商務、教育、醫療與高品質居住需求，適合以「穩定租賃需求＋稀缺區位」的角度評估配置價值。';
    const management =
      property.status === 'established'
        ? '現房類項目可更快進入出租與持有階段，環球置業可協助銜接後續租賃管理、租客篩選與日常維護。'
        : '預售類項目可提前規劃貸款、交房驗收、家具配置與出租方案，讓交房後更順利銜接租賃管理。';
    return [...detail.overview, cityContext, management];
  }

  function overviewCards(property, detail) {
    const cards = [
      ['區域定位', `${property.cityLabel} · ${property.districtLabel}，聚焦成熟生活圈與核心需求來源。`],
      ['生活配套', detail.location.items[0] || detail.location.lead],
      ['出租承接', property.yieldRange || '可依戶型與市場狀況評估出租策略。'],
    ];
    return `
      <div class="pd-overview-cards">
        ${cards.map(([title, body]) => `<article><span>${title}</span><p>${body}</p></article>`).join('')}
      </div>`;
  }

  function locationSection(detail) {
    return `
      <section class="pd-section">
        <div class="container pd-location-layout">
          <div>
            <p class="pd-kicker">Location</p>
            <h2 class="section-heading">地理位置與周邊配套</h2>
            <p class="section-lead">${detail.location.lead}</p>
          </div>
          <ul class="pd-location-list">
            ${detail.location.items.map((i) => `<li>${i}</li>`).join('')}
          </ul>
        </div>
      </section>`;
  }

  function audienceSection(property) {
    const isEstablished = property.status === 'established';
    const items = isEstablished
      ? ['希望縮短交割與出租等待時間的買家', '重視成熟生活圈、交通便利與租客需求的投資者', '希望由 GR Leasing 快速銜接長租管理的海外業主']
      : ['希望提前鎖定核心區新房供應的買家', '重視設計、配套、樓層與長期資產質感的配置型客戶', '希望交房前完成貸款、出租與資產管理規劃的海外業主'];
    return `
      <section class="pd-section pd-section--muted">
        <div class="container pd-audience">
          <div>
            <p class="pd-kicker">Suitable For</p>
            <h2 class="section-heading">適合哪些買家</h2>
            <p class="section-lead">${property.name} 更適合把城市基本面、出租承接與後續管理一起考量的買家。</p>
          </div>
          <div class="pd-audience__cards">
            ${items.map((item, index) => `<article><span>0${index + 1}</span><p>${item}</p></article>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function leasingPlan(property) {
    const noShortRent = property.slug === '623-collins';
    const sectionLead = noShortRent
      ? '623 Collins 交割後可銜接 GR Leasing 長租管理，協助業主處理租客篩選、租金管理、日常維護與合規支持，降低空置與跨境管理成本。'
      : '環球置業不只協助選房與交易，也可在交割後銜接 GR Leasing 長租管理或 Homio 短租營運，降低空置與跨境管理成本。';
    const services = [
      {
        title: 'GR Leasing 長租',
        body: noShortRent
          ? '適合希望穩定出租、減少日常溝通，並按月掌握租金與維護狀態的 623 Collins 業主。'
          : '適合希望穩定出租、減少日常溝通、按月掌握租金與維護狀態的業主。',
      },
    ];

    if (!noShortRent) {
      services.push({
        title: 'Homio 短租',
        body: '適合地段佳、裝修完整、希望提升使用彈性與營運表現的公寓型物業。',
      });
    }

    return `
      <section class="pd-section">
        <div class="container pd-leasing-plan">
          <div>
            <p class="pd-kicker">After Settlement</p>
            <h2 class="section-heading">交割後可銜接租賃管理</h2>
            <p class="section-lead">${sectionLead}</p>
          </div>
          <div class="pd-leasing-plan__grid${noShortRent ? ' pd-leasing-plan__grid--single' : ''}">
            ${services.map((service) => `
              <article>
                <h3>${service.title}</h3>
                <p>${service.body}</p>
              </article>
            `).join('')}
          </div>
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
    const consultUrl = `/?property=${encodeURIComponent(property.slug)}&cta=${encodeURIComponent(property.ctaType)}#consult`;

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
              <span class="property-badge">${property.typeLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="pd-section">
        <div class="container pd-summary">
          <div class="pd-summary__main">
            <p class="pd-kicker">Project Overview</p>
            <h2 class="section-heading">項目概況</h2>
            ${overviewParagraphs(property, detail).map((p) => `<p>${p}</p>`).join('')}
            ${overviewCards(property, detail)}
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

      ${galleryHtml(property)}
      ${valueCards(property, detail)}
      ${locationSection(detail)}
      ${seriesTable(detail.series)}
      ${amenities(detail.amenities)}
      ${audienceSection(property)}
      ${leasingPlan(property)}

      <section class="pd-section pd-final-cta">
        <div class="container">
          <h2 class="section-heading">想了解 ${property.name} 更多資訊？</h2>
          <p class="section-lead">環球置業專屬顧問可提供最新樓書、價目表、戶型建議與出租管理銜接方案。</p>
          <div class="pd-final-cta__actions">
            <a href="${consultUrl}" class="btn btn-nord">立即諮詢</a>
            <a href="properties.html" class="btn btn-secondary">返回精選建案</a>
          </div>
          <p class="disclaimer properties-disclaimer">
            本頁面內容整理自開發商公開宣傳資料與環球置業內部項目介紹，僅供參考。所有設計、平面圖、面積、景觀、配套、價格與完工時間等資訊，可能因審批、市場及規劃變更而調整，實際以買賣合約為準。本頁所述租金回報參考區間不構成任何回報保證，亦不構成投資、財務或法律建議，請諮詢持牌專業顧問。
          </p>
        </div>
      </section>
    `;
  }

  document.addEventListener('DOMContentLoaded', render);
})();
