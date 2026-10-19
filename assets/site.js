(function () {
  var doc = document.documentElement;
  var header = document.querySelector('.site-header');

  // altura real do cabeçalho, usada pelo hero preso e pelas âncoras
  function setHeaderH() { doc.style.setProperty('--header-h', header.offsetHeight + 'px'); }
  if (header) {
    setHeaderH();
    if ('ResizeObserver' in window) new ResizeObserver(setHeaderH).observe(header);
    else window.addEventListener('resize', setHeaderH);
  }

  // cabeçalho transparente sobre o hero da home, branco depois de rolar
  if (header && document.body.classList.contains('home')) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  // formulário de contato -> WhatsApp
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = document.getElementById('name').value.trim();
      var msg = document.getElementById('message').value.trim();
      var texto = 'Olá, vim pelo site.' + (nome ? ' Meu nome é ' + nome + '.' : '') + ' ' + (msg || 'Gostaria de agendar uma consulta.');
      window.open('https://wa.me/5521964994664?text=' + encodeURIComponent(texto), '_blank');
    });
  }
})();

/* Hero: vídeo em loop (assets/hero-banner.mp4 / .webm), com assets/hero-banner-poster.jpg como imagem estática.
   Não toca com prefers-reduced-motion ou economia de dados, e pausa quando sai da tela. */
(function () {
  var video = document.querySelector('[data-hero-video]');
  if (!video) return;
  var conn = navigator.connection || {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || conn.saveData) return;
  video.muted = true;
  function play() { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) play(); else video.pause();
    }, { threshold: 0.05 }).observe(video);
  } else play();
})();
