(function () {
  const GR_MARK = 'assets/images/brands/global-realty-mark.svg';
  const AG_MARK = 'assets/images/brands/award-global-mark.svg';
  const BRAND_BANNER = 'assets/images/brands/header-lockup-tw.png';
  const BANNER_ALT = '澳華國際集團 Award Global · 環球置業 Global Realty · 澳德亞太';

  const BANNER_SIZES = {
    header: { width: 396, height: 48 },
    footer: { width: 340, height: 41 },
    hero: { width: 480, height: 58 },
    inline: { width: 396, height: 48 },
  };

  function brandBannerHtml(options = {}) {
    const { href = 'index.html', variant = 'inline', decorative = false } = options;
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
    const { href = 'index.html' } = options;
    return brandBannerHtml({ href, variant: 'header' }).replace(
      'brand-banner brand-banner--header',
      'brand-header-logo brand-banner brand-banner--header'
    );
  }

  function brandLockupHtml(options = {}) {
    const { href = 'index.html', footer = false } = options;
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
    AG_MARK,
    BRAND_BANNER,
    HEADER_LOCKUP: BRAND_BANNER,
  };
})();
