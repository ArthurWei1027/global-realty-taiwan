(function () {
  const GR_MARK = 'assets/images/brands/global-realty-mark-teal.png?v=20260812-teal-mark';
  const AG_LOCKUP = 'assets/images/brands/award-global-lockup.png?v=20260812-ag-lockup';
  const BRAND_BANNER = 'assets/images/brands/global-realty-lockup.png?v=20260806-logo';
  const BANNER_ALT = '\u6fb3\u83ef\u570b\u969b Award Global \u00b7 \u74b0\u7403\u7f6e\u696d Global Realty';

  const BANNER_SIZES = {
    header: { width: 396, height: 48 },
    footer: { width: 340, height: 41 },
    hero: { width: 480, height: 58 },
    inline: { width: 396, height: 48 },
  };

  function brandBannerHtml(options = {}) {
    const { href = '/', variant = 'inline', decorative = false } = options;
    const size = BANNER_SIZES[variant] || BANNER_SIZES.inline;
    const className = `brand-banner brand-banner--${variant}`;

    if (decorative) {
      return `
        <div class="${className}" role="img" aria-label="${BANNER_ALT}">
          <img src="${BRAND_BANNER}" alt="" width="${size.width}" height="${size.height}" decoding="async">
        </div>`;
    }

    return `
      <a href="${href}" class="${className}" aria-label="${BANNER_ALT}">
        <img src="${BRAND_BANNER}" alt="${BANNER_ALT}" width="${size.width}" height="${size.height}" decoding="async">
      </a>`;
  }

  function brandHeaderHtml(options = {}) {
    const { href = '/' } = options;
    return `
      <a href="${href}" class="brand-header-logo brand-header-logo--dual" aria-label="${BANNER_ALT}">
        <span class="brand-header-logo__unit brand-header-logo__unit--ag">
          <img class="brand-header-logo__award-lockup" src="${AG_LOCKUP}" alt="" width="166" height="50" decoding="async">
        </span>
        <span class="brand-header-logo__divider" aria-hidden="true"></span>
        <span class="brand-header-logo__unit brand-header-logo__unit--gr">
          <img class="brand-header-logo__gr-mark" src="${GR_MARK}" alt="" width="45" height="48" decoding="async">
          <span class="brand-header-logo__text">
            <strong>GLOBAL REALTY</strong>
            <small>&#29872;&#29699;&#32622;&#26989;</small>
          </span>
        </span>
      </a>`;
  }

  function brandLockupHtml(options = {}) {
    const { href = '/', footer = false } = options;
    return brandBannerHtml({ href, variant: footer ? 'footer' : 'inline' });
  }

  function brandFromHtml() {
    return '';
  }

  window.AGBrand = {
    brandBannerHtml,
    brandHeaderHtml,
    brandLockupHtml,
    brandFromHtml,
    GR_MARK,
    AG_LOCKUP,
    BRAND_BANNER,
    HEADER_LOCKUP: BRAND_BANNER,
  };
})();
