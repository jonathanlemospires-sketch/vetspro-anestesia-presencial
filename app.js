/* Anestesia Descomplicada Presencial — vanilla JS, no React, no Babel */
(function () {
  'use strict';

  // ====== CONFIG ======
  // URL do Apps Script Web App (preencha após deploy do Code.gs — instruções em SETUP.md)
  var WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzjq4BBMKmjKc-1UQ3HwSGzzpF2XY6B3RTHt6pAweyw2-2JJdqc32tS9Yt5M1P3gaYx/exec';
  // Para onde o lead é redirecionado após enviar o form
  var REDIRECT_URL = 'https://gruposvip.com/redirect/627/curso-presencial-vetspro-27-e-28-de-junho';

  // CTA scroll
  function scrollToForm() {
    var el = document.getElementById('inscricao');
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - 60;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cta]');
    if (t) { e.preventDefault(); scrollToForm(); }
  });

  // Nav scroll state
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    if (window.pageYOffset > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Curriculum accordion
  document.querySelectorAll('.curriculum-row').forEach(function (row) {
    row.addEventListener('click', function () {
      var wasOpen = row.classList.contains('open');
      document.querySelectorAll('.curriculum-row.open').forEach(function (r) { r.classList.remove('open'); });
      if (!wasOpen) row.classList.add('open');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ====== FORM SUBMIT — captura no Sheet + redireciona ======
  var form = document.getElementById('enroll-form');
  if (form) {
    var btn = document.getElementById('form-submit');
    var btnLabel = btn && btn.querySelector('.btn-label');

    function setLoading(loading) {
      if (!btn) return;
      btn.disabled = loading;
      if (btnLabel) btnLabel.textContent = loading ? 'Enviando…' : 'Quero garantir minha vaga';
      btn.style.opacity = loading ? '0.7' : '';
      btn.style.cursor = loading ? 'wait' : '';
    }

    function onlyDigits(v) { return (v || '').toString().replace(/\D/g, ''); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome = (form.elements['nome'].value || '').trim();
      var ddd = onlyDigits(form.elements['ddd'].value);
      var whatsapp = onlyDigits(form.elements['whatsapp'].value);

      if (!nome || nome.length < 2) {
        form.elements['nome'].focus();
        form.elements['nome'].setCustomValidity('Por favor, informe seu nome.');
        form.elements['nome'].reportValidity();
        return;
      }
      if (!ddd || ddd.length < 2) {
        form.elements['ddd'].focus();
        form.elements['ddd'].setCustomValidity('DDD inválido.');
        form.elements['ddd'].reportValidity();
        return;
      }
      if (!whatsapp || whatsapp.length < 8) {
        form.elements['whatsapp'].focus();
        form.elements['whatsapp'].setCustomValidity('Número inválido.');
        form.elements['whatsapp'].reportValidity();
        return;
      }
      // limpar mensagens
      ['nome','ddd','whatsapp'].forEach(function(n){ form.elements[n].setCustomValidity(''); });

      setLoading(true);

      // Facebook Pixel — InitiateCheckout antes do redirect
      try { if (typeof fbq === 'function') fbq('track', 'InitiateCheckout'); } catch (_) {}

      var params = new URLSearchParams();
      params.append('nome', nome);
      params.append('ddd', ddd);
      params.append('whatsapp', whatsapp);
      params.append('source', 'landing-vetspro-presencial');

      function redirect() { window.location.href = REDIRECT_URL; }

      // Fire-and-forget POST (Apps Script Web App ignora preflight com mode:no-cors)
      // Mesmo que o POST falhe silenciosamente, o lead é redirecionado.
      try {
        var promise = fetch(WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: params.toString()
        });
        // Garante redirect em até 1.5s mesmo se o request demorar
        var redirected = false;
        var fallback = setTimeout(function () { if (!redirected) { redirected = true; redirect(); } }, 1500);
        promise.finally(function () {
          if (!redirected) { redirected = true; clearTimeout(fallback); redirect(); }
        });
      } catch (err) {
        redirect();
      }
    });

    // Limpar mensagens de erro ao digitar
    ['nome','ddd','whatsapp'].forEach(function (n) {
      var el = form.elements[n];
      if (el) el.addEventListener('input', function () { el.setCustomValidity(''); });
    });
  }

  // Open first curriculum item by default
  var first = document.querySelector('.curriculum-row');
  if (first) first.classList.add('open');
  var firstFaq = document.querySelector('.faq-item');
  if (firstFaq) firstFaq.classList.add('open');
})();
