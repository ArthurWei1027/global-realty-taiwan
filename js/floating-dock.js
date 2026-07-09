(function () {
  const LINE_QR = 'https://qr-official.line.me/gs/M_407ccszn_GW.png?oat_content=qr';
  const LINE_URL = 'https://lin.ee/o34bnAe';

  const ICONS = {
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M4 7l8 6 8-6"/></svg>`,
    line: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.13 2 11.2c0 2.86 1.4 5.4 3.58 7.08L4.7 21.5l3.9-2.05c1.05.3 2.18.45 3.4.45 5.52 0 10-4.13 10-9.2S17.52 2 12 2zm-2.9 11.7H7.4V8.9h1.7v4.8zm2.85 0h-1.7V8.9h1.7v4.8zm2.85 0h-1.7V8.9H14.8v4.8zm2.9 0h-1.7V8.9h1.7v4.8z"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.1H13.5V9.1c0-.9.25-1.5 1.5-1.5h1.6V4.7c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9V10.9H8v3.1h2.5v8h3z"/></svg>`,
  };

  const DOCK_ITEMS = [
    { id: 'calendar', label: '預約諮詢', href: '#consult', icon: ICONS.calendar },
    { id: 'phone', label: '電話聯絡', href: 'tel:+61292648388', icon: ICONS.phone },
    { id: 'mail', label: 'Email 諮詢', href: 'mailto:arthurwei@globalrealty.com.au', icon: ICONS.mail },
    {
      id: 'line',
      label: 'LINE 官方帳號',
      href: LINE_URL,
      icon: ICONS.line,
      external: true,
      qr: LINE_QR,
    },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61574517341875', icon: ICONS.facebook, external: true },
  ];

  function renderFloatingDock() {
    if (document.getElementById('floating-dock')) return;

    const dock = document.createElement('aside');
    dock.id = 'floating-dock';
    dock.className = 'floating-dock';
    dock.setAttribute('aria-label', '快速聯絡');

    dock.innerHTML = DOCK_ITEMS.map((item) => {
      const attrs = item.external ? 'target="_blank" rel="noopener noreferrer"' : '';
      const qrPanel = item.qr
        ? `
          <span class="floating-dock__qr" role="tooltip">
            <img src="${item.qr}" alt="LINE 官方帳號 @awardglobal QR Code" width="140" height="140" loading="lazy">
            <span class="floating-dock__qr-text">掃碼加入 LINE<br>@awardglobal</span>
          </span>`
        : '';

      return `
        <a href="${item.href}" class="floating-dock__link${item.qr ? ' floating-dock__link--line' : ''}" aria-label="${item.label}" ${attrs}>
          ${item.icon}
          ${qrPanel}
        </a>`;
    }).join('');

    document.body.appendChild(dock);

    const lineLink = dock.querySelector('.floating-dock__link--line');
    const mobileMq = window.matchMedia('(max-width: 900px)');

    if (lineLink && mobileMq.matches) {
      const backdrop = document.createElement('button');
      backdrop.type = 'button';
      backdrop.className = 'floating-dock-backdrop';
      backdrop.setAttribute('aria-label', '關閉 LINE QR');
      document.body.appendChild(backdrop);

      function closeQr() {
        lineLink.classList.remove('is-qr-open');
        backdrop.classList.remove('is-visible');
      }

      lineLink.addEventListener('click', (e) => {
        if (!lineLink.classList.contains('is-qr-open')) {
          e.preventDefault();
          lineLink.classList.add('is-qr-open');
          backdrop.classList.add('is-visible');
        }
      });

      backdrop.addEventListener('click', closeQr);
    }
  }

  window.AGFloatingDock = { renderFloatingDock };
})();
