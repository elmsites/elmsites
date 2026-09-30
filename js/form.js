/* Signup form: validation + submit (Web3Forms).
   ==================================================================
   LIVE: submissions POST to Web3Forms.

   IMPORTANT - the destination inbox is NOT set here. Web3Forms delivers
   to whatever address the ACCESS_KEY was registered with on web3forms.com;
   there is no "to" field in their API, and CC is a paid feature. To change
   who receives submissions you must generate a new key for that address.

   ACCESS_KEY is a public, client-side key by design (Web3Forms states
   this) so it is safe in this file and in the repo.

   MAILTO below is used ONLY by the no-key mailto fallback.

   If ACCESS_KEY is ever blanked the form falls back to opening the
   visitor's mail client, and in that case it does NOT claim the message
   was received, because delivery cannot be confirmed on that path.
   ================================================================== */
(function () {
  var ACCESS_KEY = 'a97944f8-78d1-4c73-9f78-eac19bca6f4c';   /* public key, safe client-side */
  var ENDPOINT   = 'https://api.web3forms.com/submit';
  var MAILTO     = 'birznieks@elmsites.com';

  var form  = document.getElementById('signup-form');
  var done  = document.getElementById('signup-done');
  var mail  = document.getElementById('signup-mail');
  var errEl = document.getElementById('form-error');
  if (!form || !done) return;

  var MSG = {
    lv: { req: 'Šis lauks ir jāaizpilda.', email: 'Lūdzu, ievadiet derīgu e-pasta adresi.', phone: 'Lūdzu, ievadiet derīgu tālruņa numuru.', sending: 'Sūta…' },
    ru: { req: 'Это поле нужно заполнить.', email: 'Введите корректный адрес эл. почты.', phone: 'Введите корректный номер телефона.', sending: 'Отправка…' },
    en: { req: 'This field is required.', email: 'Please enter a valid email address.', phone: 'Please enter a valid phone number.', sending: 'Sending…' }
  };
  function t(k) { return (MSG[document.documentElement.lang] || MSG.en)[k]; }

  function fieldOf(el) { return el.closest('.field'); }

  function setError(el, msg) {
    var f = fieldOf(el);
    if (!f) return;
    var slot = f.querySelector('.f-err');
    if (msg) { f.classList.add('is-bad'); if (slot) slot.textContent = msg; el.setAttribute('aria-invalid', 'true'); }
    else { f.classList.remove('is-bad'); if (slot) slot.textContent = ''; el.removeAttribute('aria-invalid'); }
  }

  function validate(el) {
    var v = (el.value || '').trim();
    if (el.hasAttribute('required') && !v) { setError(el, t('req')); return false; }
    if (!v) { setError(el, ''); return true; }
    if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setError(el, t('email')); return false; }
    if (el.type === 'tel' && (v.replace(/\D/g, '').length < 8 || !/^[+\d][\d\s().-]*$/.test(v))) { setError(el, t('phone')); return false; }
    setError(el, '');
    return true;
  }

  var checkable = Array.prototype.slice.call(
    form.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], textarea')
  ).filter(function (el) { return !el.closest('.hp'); });   /* skip the honeypot */

  checkable.forEach(function (el) {
    el.addEventListener('blur', function () { validate(el); });
    el.addEventListener('input', function () {
      var f = fieldOf(el);
      if (f && f.classList.contains('is-bad')) validate(el);
    });
  });

  function collect() {
    var pkg = form.querySelector('input[name="package"]:checked');
    return {
      name:    form.name.value.trim(),
      phone:   form.phone.value.trim(),
      email:   form.email.value.trim(),
      company: form.company.value.trim(),
      package: pkg ? pkg.value : '',
      details: form.details.value.trim()
    };
  }

  function reveal(el) {
    form.hidden = true;
    if (errEl) errEl.hidden = true;
    el.hidden = false;
    el.setAttribute('tabindex', '-1');
    el.focus();
    el.scrollIntoView({ block: 'center' });
  }

  function showSendError() {
    if (!errEl) return;
    errEl.hidden = false;
    errEl.setAttribute('role', 'alert');
    errEl.scrollIntoView({ block: 'center' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (errEl) errEl.hidden = true;

    var ok = true, first = null;
    checkable.forEach(function (el) { if (!validate(el)) { ok = false; if (!first) first = el; } });
    if (!ok) { if (first) first.focus(); return; }

    /* honeypot: a real person never fills this, bots do */
    var hp = form.querySelector('.hp input');
    if (hp && hp.value) { reveal(done); return; }

    var data  = collect();
    var btn   = form.querySelector('.submit-btn');
    var label = btn.querySelector('span');
    var original = label.textContent;

    /* ---------- no key yet: hand off to the mail client ---------- */
    if (!ACCESS_KEY) {
      var subject = 'Pieteikums no ' + (data.name || 'mājaslapas');
      var body = [
        'Vārds: ' + data.name,
        'Tālrunis: ' + data.phone,
        'E-pasts: ' + data.email,
        'Uzņēmums: ' + (data.company || '-'),
        'Pakete: ' + (data.package || '-'),
        '',
        'Par uzņēmumu:',
        data.details || '-'
      ].join('\n');
      window.location.href = 'mailto:' + MAILTO +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      /* deliberately NOT the "we received it" card: we cannot confirm
         this was actually sent, so ask the visitor to press Send. */
      setTimeout(function () { reveal(mail || done); }, 600);
      return;
    }

    /* ---------- normal path: POST to Web3Forms ---------- */
    btn.disabled = true;
    label.textContent = t('sending');

    function fail() {
      btn.disabled = false;
      label.textContent = original;
      showSendError();
    }

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: 'Jauns pieteikums no elmsites.com — ' + (data.name || ''),
        from_name: 'Elmsites mājaslapa',
        replyto: data.email,
        name: data.name,
        phone: data.phone,
        email: data.email,
        company: data.company || '-',
        package: data.package || '-',
        details: data.details || '-'
      })
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        /* only claim success when the service confirms it */
        if (res.ok && res.j && res.j.success) reveal(done);
        else fail();
      })
      .catch(fail);
  });
})();
