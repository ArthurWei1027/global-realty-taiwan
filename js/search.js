(function () {
  if (document.body.dataset.page !== 'search') return;

  function getQuery() {
    return new URLSearchParams(window.location.search).get('q')?.trim() || '';
  }

  async function fetchJson(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed to load ${path}`);
      return await res.json();
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  function matches(query, ...fields) {
    const haystack = fields.filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  }

  function highlight(text, query) {
    if (!text) return '';
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const hit = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);
    return `${before}<mark>${hit}</mark>${after}`;
  }

  function resultCard({ href, tag, title, desc }, query) {
    return `
      <a class="search-result" href="${href}">
        <span class="search-result__tag">${tag}</span>
        <span class="search-result__title">${highlight(title, query)}</span>
        ${desc ? `<span class="search-result__desc">${highlight(desc, query)}</span>` : ''}
      </a>`;
  }

  function group(title, cards) {
    if (!cards.length) return '';
    return `
      <section class="search-group">
        <h2 class="search-group__heading">${title}<span class="search-group__count">${cards.length}</span></h2>
        <div class="search-group__list">${cards.join('')}</div>
      </section>`;
  }

  async function run() {
    const query = getQuery();
    const input = document.getElementById('search-page-input');
    const summary = document.querySelector('.search-page__summary');
    const results = document.querySelector('.search-results');
    if (input) input.value = query;

    if (!query) {
      if (summary) summary.textContent = '請在上方輸入關鍵字，即可搜尋建案、活動與小課堂內容。';
      return;
    }

    const [propsData, newsData, classData] = await Promise.all([
      fetchJson('data/properties.json'),
      fetchJson('data/news.json'),
      fetchJson('data/classroom.json'),
    ]);

    const propertyCards = (propsData?.properties || [])
      .filter((p) => matches(query, p.name, p.cityLabel, p.districtLabel, p.typeLabel, p.statusLabel, p.summary))
      .map((p) =>
        resultCard(
          {
            href: `property.html?slug=${encodeURIComponent(p.slug)}`,
            tag: `精選建案 · ${p.cityLabel || ''}`,
            title: p.name,
            desc: p.summary,
          },
          query
        )
      );

    const newsCards = (newsData?.news || [])
      .filter((n) => matches(query, n.title, n.summary, n.categoryLabel))
      .map((n) =>
        resultCard(
          {
            href: `events.html#${n.slug}`,
            tag: `活動預告 · ${n.categoryLabel || ''}`,
            title: n.title,
            desc: n.summary,
          },
          query
        )
      );

    const classCards = (classData?.videos || [])
      .filter((v) => matches(query, v.title))
      .map((v) =>
        resultCard(
          {
            href: `classroom.html#${v.slug}`,
            tag: '澳洲不動產小課堂',
            title: v.title,
          },
          query
        )
      );

    const total = propertyCards.length + newsCards.length + classCards.length;

    if (summary) {
      summary.innerHTML = total
        ? `關於「<strong>${query}</strong>」共找到 <strong>${total}</strong> 筆結果。`
        : `找不到與「<strong>${query}</strong>」相關的內容，請嘗試其他關鍵字。`;
    }

    results.innerHTML = total
      ? [
          group('精選建案', propertyCards),
          group('活動預告', newsCards),
          group('澳洲不動產小課堂', classCards),
        ].join('')
      : `
        <div class="search-empty">
          <p>建議您嘗試：城市名稱（如「雪梨」「墨爾本」）、物業類型（如「公寓」）、或主題（如「稅」「貸款」「租賃」）。</p>
          <a href="index.html" class="btn btn-nord">返回首頁</a>
        </div>`;
  }

  document.addEventListener('DOMContentLoaded', run);
})();
