(function () {
  function renderPropertyCard(property) {
    const contactUrl = `property.html?slug=${encodeURIComponent(property.slug)}`;
    const badges = [
      property.featured ? '<span class="property-badge property-badge--hot">熱門</span>' : '',
      property.statusLabel
        ? `<span class="property-badge property-badge--status">${property.statusLabel}</span>`
        : '',
    ]
      .filter(Boolean)
      .join('');

    return `
      <article class="property-card property-card--nord">
        <a href="${contactUrl}" class="property-card__media" aria-label="查看 ${property.name}">
          <img
            class="property-card__image"
            src="${property.image}"
            alt="${property.imageAlt}"
            width="400"
            height="500"
            loading="lazy"
          />
          ${badges ? `<div class="property-card__badges">${badges}</div>` : ''}
        </a>
        <div class="property-card__info">
          <h3 class="property-card__title">
            <a href="${contactUrl}">${property.name}</a>
          </h3>
          <p class="property-card__location">${property.districtLabel || property.cityLabel}</p>
          <p class="property-card__price">${property.priceLabel}</p>
        </div>
      </article>
    `;
  }

  window.GRPropertyCards = { renderPropertyCard };
})();
