/* Arma el feed de noticias dinámicamente desde ARTICLES (assets/articles-data.js)
   e inyecta las tarjetas en <main class="feed" id="feed">. Reutiliza el mismo
   patrón de imágenes que el resto del sitio: loading="lazy" + onerror que cae al
   SVG de respaldo y agrega la clase .img-fallback (respaldo suave, no error brusco). */
(function () {
  var FB = 'assets/icon-fallback.svg';
  var CHOCLO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20L20 4M4 4l16 16"/></svg>';
  var SVG_PLACEHOLDER = '<svg class="thumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 15l-5-5-4 4-3-3-4 4"/></svg>';

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }

  // Imagen con carga diferida y respaldo suave (misma convención en todo el sitio).
  function imgTag(src) {
    return '<img class="thumb-img" loading="lazy" src="' + esc(src) + '" alt="" ' +
      'onerror="this.onerror=null;this.src=\'' + FB + '\';this.classList.add(\'img-fallback\')">';
  }
  function tagsHtml(tags) {
    return (tags || []).map(function (t) { return '<span class="tag ' + t.cls + '">' + esc(t.txt) + '</span>'; }).join('');
  }

  function featuredHtml(a) {
    return '<a class="featured" href="' + a.href + '" data-cat="' + a.cat + '">' +
      '<div class="thumb">' + (a.img ? imgTag(a.img) : '') +
        (a.badge ? '<span class="thumb-tag mono">' + esc(a.badge) + '</span>' : '') + '</div>' +
      (a.eyebrow ? '<span class="eyebrow mono">' + esc(a.eyebrow) + '</span>' : '') +
      '<h1>' + esc(a.title) + '</h1>' +
      '<p class="dek">' + esc(a.dek) + '</p>' +
      '<div class="meta-row">' + tagsHtml(a.tags) +
        '<span class="timestamp">' + esc(a.time) + '</span>' +
        '<span class="choclo">' + CHOCLO + '<b>' + esc(a.read) + '</b> de lectura · sin choclo</span>' +
      '</div></a>';
  }

  function cardHtml(a) {
    return '<a class="card" href="' + a.href + '" data-cat="' + a.cat + '">' +
      '<div class="thumb">' + (a.img ? imgTag(a.img) : SVG_PLACEHOLDER) + '</div>' +
      '<div class="card-body">' +
        '<div class="tags">' + tagsHtml(a.tags) + '</div>' +
        '<h2>' + esc(a.title) + '</h2>' +
        '<p class="dek">' + esc(a.dek) + '</p>' +
        '<div class="meta-row">' +
          '<span class="timestamp mono">' + esc(a.time) + '</span>' +
          '<span class="choclo">' + CHOCLO + '<b>' + esc(a.read) + '</b> · sin choclo</span>' +
        '</div>' +
      '</div></a>';
  }

  function wireFilters() {
    var btns = document.querySelectorAll('.filter-btn');
    var items = document.querySelectorAll('#feed > .featured, #feed > .card');
    var empty = document.getElementById('emptyState');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.dataset.filter, vis = 0;
        items.forEach(function (item) {
          var cats = (item.dataset.cat || '').split(' ');
          if (filter === 'todo' || cats.indexOf(filter) !== -1) { item.classList.remove('hidden'); vis++; }
          else item.classList.add('hidden');
        });
        if (empty) empty.classList.toggle('hidden', vis > 0);
      });
    });
  }

  function paint(list) {
    var feed = document.getElementById('feed');
    if (!feed || !list || !list.length) return;
    var empty = document.getElementById('emptyState');
    var html = list.map(function (a) { return a.featured ? featuredHtml(a) : cardHtml(a); }).join('');
    if (empty) empty.insertAdjacentHTML('beforebegin', html);
    else feed.insertAdjacentHTML('beforeend', html);
    wireFilters();
  }

  // Fuente canónica: assets/content/articles.json (editable desde el panel).
  // Si no está disponible, cae al array de assets/articles-data.js.
  function render() {
    var feed = document.getElementById('feed');
    if (!feed) return;
    var base = feed.getAttribute('data-content-root') || '';
    fetch(base + 'assets/content/articles.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && d.notas && d.notas.length) paint(d.notas);
        else if (typeof ARTICLES !== 'undefined') paint(ARTICLES);
      })
      .catch(function () { if (typeof ARTICLES !== 'undefined') paint(ARTICLES); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
