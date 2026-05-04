/* Anestesia Descomplicada Presencial — vanilla JS, no React, no Babel */
(function () {
  'use strict';

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

  // Form submit
  var form = document.getElementById('enroll-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = form.querySelector('.form-fields');
      var thanks = form.querySelector('.form-thanks');
      if (fields) fields.style.display = 'none';
      if (thanks) thanks.style.display = 'block';
    });
  }

  // Open first curriculum item by default
  var first = document.querySelector('.curriculum-row');
  if (first) first.classList.add('open');
  var firstFaq = document.querySelector('.faq-item');
  if (firstFaq) firstFaq.classList.add('open');
})();
