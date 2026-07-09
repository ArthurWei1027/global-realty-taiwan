(function () {
  const GR_MARK = 'assets/images/brands/global-realty-mark.svg';
  const AG_MARK = 'assets/images/brands/award-global-mark.png';

  function brandLockupHtml(options = {}) {
    const { href = 'index.html', markSize = '', footer = false } = options;
    const markClass = markSize ? ` brand-lockup__mark--${markSize}` : '';
    return `
      <a href="${href}" class="brand-lockup site-logo--meta">
        <img class="brand-lockup__mark${markClass}" src="${GR_MARK}" alt="環球置業 Global Realty" width="40" height="42">
        <span class="brand-lockup__text">
          <span class="brand-lockup__primary">環球置業 <span class="brand-lockup__primary-en">Global Realty</span></span>
        </span>
      </a>`;
  }

  function brandFromHtml() {
    return `
      <a href="group.html" class="brand-from" aria-label="了解澳華國際集團">
        <span class="brand-from__label">from</span>
        <img class="brand-from__mark" src="${AG_MARK}" alt="澳華國際 Award Global" width="16" height="16">
        <span>澳華國際集團 Award Global</span>
      </a>`;
  }

  window.AGBrand = { brandLockupHtml, brandFromHtml, GR_MARK, AG_MARK };
})();
