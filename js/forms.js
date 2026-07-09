(function () {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function pushEvent(name, payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...payload });
    console.log('[GTM placeholder]', name, payload);
  }

  function showError(group, message) {
    group.classList.add('has-error');
    let err = group.querySelector('.form-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error';
      err.setAttribute('role', 'alert');
      group.appendChild(err);
    }
    err.textContent = message;
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-group').forEach((g) => {
      g.classList.remove('has-error');
      const err = g.querySelector('.form-error');
      if (err) err.remove();
    });
  }

  function showSuccess(form, message) {
    const existing = form.querySelector('.form-success');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'form-success';
    el.setAttribute('role', 'status');
    el.textContent = message;
    form.appendChild(el);
    form.querySelectorAll('input, textarea, button[type="submit"]').forEach((input) => {
      if (input.type !== 'hidden') input.disabled = true;
    });
  }

  function validateConsultation(form) {
    clearErrors(form);
    let valid = true;
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');

    if (!name?.value.trim()) {
      showError(name.closest('.form-group'), '請填寫稱呼');
      valid = false;
    }
    if (!email?.value.trim() || !EMAIL_RE.test(email.value.trim())) {
      showError(email.closest('.form-group'), '請填寫有效的電子郵件');
      valid = false;
    }
    if (!phone?.value.trim()) {
      showError(phone.closest('.form-group'), '請填寫聯絡電話');
      valid = false;
    }
    return valid;
  }

  function validateRecruit(form) {
    clearErrors(form);
    let valid = true;
    const name = form.querySelector('[name="recruit_name"]');
    const email = form.querySelector('[name="recruit_email"]');
    const experience = form.querySelector('[name="experience"]');

    if (!name?.value.trim()) {
      showError(name.closest('.form-group'), '請填寫姓名');
      valid = false;
    }
    if (!email?.value.trim() || !EMAIL_RE.test(email.value.trim())) {
      showError(email.closest('.form-group'), '請填寫有效的電子郵件');
      valid = false;
    }
    if (!experience?.value.trim()) {
      showError(experience.closest('.form-group'), '請簡述您的相關經歷');
      valid = false;
    }
    return valid;
  }

  function prefillFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const property = params.get('property');
    const cta = params.get('cta');
    const noteField = document.querySelector('[name="notes"]');
    if (noteField && property) {
      const ctaLabel = cta === 'financial' ? '財務算表' : '平面圖';
      noteField.value = `感興趣建案：${property}（索取${ctaLabel}）`;
    }
    if (params.get('property') || window.location.hash === '#consult') {
      document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function bindForms() {
    const consultForm = document.getElementById('consultation-form');
    if (consultForm) {
      consultForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateConsultation(consultForm)) return;
        const data = Object.fromEntries(new FormData(consultForm));
        pushEvent('consultation_submit', data);
        showSuccess(consultForm, '感謝您的預約！專屬顧問將於 24 小時內與您聯繫。');
      });
    }

    const recruitForm = document.getElementById('recruit-form');
    if (recruitForm) {
      recruitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateRecruit(recruitForm)) return;
        const data = Object.fromEntries(new FormData(recruitForm));
        pushEvent('recruit_submit', { ...data, resume: 'placeholder' });
        showSuccess(recruitForm, '履歷已收到！我們的招募團隊將盡快與您聯繫。');
      });
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('[name="newsletter_email"]');
        if (!email?.value.trim() || !EMAIL_RE.test(email.value.trim())) {
          alert('請填寫有效的電子郵件');
          return;
        }
        pushEvent('newsletter_submit', { email: email.value });
        email.value = '';
        alert('感謝訂閱！電子報功能即將上線。');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      prefillFromUrl();
      bindForms();
    }, 0);
  });
})();
