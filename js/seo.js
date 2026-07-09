(function () {
  function cfg() {
    return window.GR_SEO_CONFIG || {};
  }

  function baseUrl() {
    const c = cfg();
    const base = (c.usePreviewBase ? c.previewBase : c.productionBase) || '';
    return base.replace(/\/$/, '');
  }

  function absUrl(path) {
    if (!path) return baseUrl();
    if (/^https?:\/\//i.test(path)) return path;
    const clean = path.replace(/^\//, '');
    return `${baseUrl()}/${clean}`;
  }

  function upsertMeta(attr, key, content) {
    if (!content) return;
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function injectJsonLd(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function pagePath() {
    const page = document.body.dataset.page || 'home';
    const map = {
      home: 'index.html',
      properties: 'properties.html',
      'property-detail': 'property.html',
      leasing: 'leasing.html',
      events: 'events.html',
      'event-detail': 'event.html',
      classroom: 'classroom.html',
      about: 'about.html',
      group: 'group.html',
      privacy: 'privacy.html',
      sitemap: 'sitemap.html',
      search: 'search.html',
    };
    let path = map[page] || 'index.html';
    if (page === 'property-detail') {
      const slug = new URLSearchParams(window.location.search).get('slug');
      if (slug) path += `?slug=${encodeURIComponent(slug)}`;
    }
    if (page === 'event-detail') {
      const slug = new URLSearchParams(window.location.search).get('slug');
      if (slug) path += `?slug=${encodeURIComponent(slug)}`;
    }
    return path;
  }

  function injectOpenGraph() {
    const title = document.title;
    const description =
      document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const url = absUrl(pagePath());
    const image = absUrl(cfg().defaultOgImage);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', cfg().siteName || '環球置業 Global Realty');
    upsertMeta('property', 'og:locale', 'zh_TW');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
  }

  function injectSiteSchema() {
    const c = cfg();
    const org = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: c.siteName,
      alternateName: c.alternateName,
      url: baseUrl(),
      email: c.email,
      parentOrganization: c.parentOrganization,
      sameAs: c.sameAs,
      areaServed: ['台灣', '澳洲'],
      knowsAbout: ['澳洲置產', '跨境置產', '租賃管理', '海外不動產'],
    };

    injectJsonLd(org);

    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: c.siteName,
      url: baseUrl(),
      inLanguage: 'zh-Hant',
      publisher: { '@type': 'Organization', name: c.siteName, url: baseUrl() },
    });

    (c.localBusinesses || []).forEach((office) => {
      injectJsonLd({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: office.name,
        email: c.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: office.streetAddress,
          addressLocality: office.addressLocality,
          addressRegion: office.addressRegion,
          addressCountry: office.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: office.geo.latitude,
          longitude: office.geo.longitude,
        },
        parentOrganization: { '@type': 'Organization', name: c.siteName },
      });
    });
  }

  function injectEventSchema(event) {
    if (!event) return;
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.title,
      description: event.summary,
      startDate: event.date,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus:
        event.status === 'past'
          ? 'https://schema.org/EventScheduled'
          : 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: event.location,
        address: event.location,
      },
      image: absUrl(event.heroImage || event.image),
      organizer: {
        '@type': 'Organization',
        name: cfg().siteName,
        url: baseUrl(),
      },
      url: absUrl(`event.html?slug=${encodeURIComponent(event.slug)}`),
    });
  }

  function injectPropertySchema(property) {
    if (!property) return;
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: property.name,
      description: property.summary,
      url: absUrl(`property.html?slug=${encodeURIComponent(property.slug)}`),
      image: absUrl(property.image),
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.cityLabel,
        addressRegion: property.districtLabel,
        addressCountry: 'AU',
      },
    });
  }

  function injectArticleSchema(article) {
    if (!article) return;
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.summary || article.description,
      datePublished: article.date,
      author: {
        '@type': 'Organization',
        name: cfg().siteName,
      },
      publisher: {
        '@type': 'Organization',
        name: cfg().siteName,
        url: baseUrl(),
      },
      url: article.url ? absUrl(article.url) : undefined,
      image: article.image ? absUrl(article.image) : undefined,
    });
  }

  function injectCanonical() {
    const href = absUrl(pagePath());
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement('link');
      el.rel = 'canonical';
      document.head.appendChild(el);
    }
    el.href = href;
  }

  function init() {
    injectOpenGraph();
    injectCanonical();
    injectSiteSchema();
  }

  function refreshPageMeta() {
    injectOpenGraph();
    injectCanonical();
  }

  window.GRSeo = {
    init,
    refreshPageMeta,
    injectEventSchema,
    injectPropertySchema,
    injectArticleSchema,
    absUrl,
    baseUrl,
  };

  document.addEventListener('DOMContentLoaded', init);
})();
