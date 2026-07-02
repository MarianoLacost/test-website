/* Nav global de Grieta: un solo componente para todas las páginas.
   Uso: <script src="{root}assets/nav.js" data-root="{root}" data-active="inicio|wild-rift|noticias"></script>
   colocado justo después de <body>. */
(function () {
  var s = document.currentScript;
  var root = s.getAttribute('data-root') || '';
  var active = s.getAttribute('data-active') || '';

  function cls(key) { return key === active ? 'tab active' : 'tab'; }

  var html =
    '<header class="topbar">' +
      '<div class="topbar-inner">' +
        '<a class="logo" href="' + root + 'index.html">' +
          '<div class="logo-mark" aria-hidden="true">' +
            '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">' +
              '<path d="M20 2 L20 14 L27 17 L18 22 L24 26 L14 32 L17 22 L11 20 L20 2Z" fill="#E8B24D"/>' +
              '<path d="M20 2 L20 14 L27 17 L18 22 L24 26 L14 32 L17 22 L11 20 L20 2Z" stroke="#0B1215" stroke-width="0.6" stroke-linejoin="round"/>' +
            '</svg>' +
          '</div>' +
          '<div class="wordmark">' +
            '<div class="mark">GRI<span>E</span>TA</div>' +
            '<div class="tagline">noticias de lol &amp; wild rift — sin choclo</div>' +
          '</div>' +
        '</a>' +
        '<div class="clock mono">parche actual<br><b>7.1h</b></div>' +
      '</div>' +
      '<nav class="tabs">' +
        '<a class="' + cls('inicio') + '" href="' + root + 'index.html">Inicio</a>' +
        '<a class="' + cls('wild-rift') + '" href="' + root + 'wild-rift/index.html">Wild Rift</a>' +
        '<a class="' + cls('noticias') + '" href="' + root + 'noticias.html">Noticias</a>' +
      '</nav>' +
    '</header>';

  document.body.insertAdjacentHTML('afterbegin', html);
})();
