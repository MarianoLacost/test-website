/* Íconos de habilidades vía Data Dragon (API oficial de Riot).
   Corre en el navegador del visitante: busca los datos es_MX de cada campeón
   presente en la página y reemplaza el ícono genérico de cada habilidad por el
   real, matcheando por nombre (exacto, normalizado) o por slot (Q/W/E/R/PASIVA).
   Si algo no matchea o la red falla, queda el ícono genérico — nunca uno equivocado. */
(function () {
  var DD = 'https://ddragon.leagueoflegends.com';
  var FALLBACK_VER = '14.23.1';

  function norm(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function getJSON(url) {
    return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }

  function cacheGet(key) {
    try { var v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function cacheSet(key, val) {
    try { sessionStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function champData(ver, id) {
    var key = 'dd-' + ver + '-' + id;
    var hit = cacheGet(key);
    if (hit) return Promise.resolve(hit);
    return getJSON(DD + '/cdn/' + ver + '/data/es_MX/champion/' + id + '.json').then(function (j) {
      if (!j || !j.data || !j.data[id]) return null;
      var d = j.data[id];
      var out = {
        passive: d.passive ? { name: d.passive.name, img: d.passive.image.full } : null,
        spells: d.spells.map(function (sp) { return { name: sp.name, img: sp.image.full }; })
      };
      cacheSet(key, out);
      return out;
    });
  }

  function swapIfLoads(img, url) {
    var probe = new Image();
    probe.onload = function () { img.src = url; };
    probe.src = url;
  }

  function resolveVersion() {
    var hit = cacheGet('dd-ver');
    if (hit) return Promise.resolve(hit);
    return getJSON(DD + '/api/versions.json').then(function (v) {
      var ver = (v && v[0]) || FALLBACK_VER;
      cacheSet('dd-ver', ver);
      return ver;
    });
  }

  function processWidget(ver, widget) {
    var champImg = widget.querySelector('h3 img[src*="/champion/"]');
    if (!champImg) return;
    var m = (champImg.getAttribute('src') || '').match(/\/champion\/([A-Za-z0-9]+)\.png/);
    if (!m) return;
    champData(ver, m[1]).then(function (d) {
      if (!d) return;
      var slotIdx = { Q: 0, W: 1, E: 2, R: 3 };
      widget.querySelectorAll('.ability-chip').forEach(function (chip) {
        var img = chip.querySelector('img');
        var nameEl = chip.querySelector('.ac-name');
        var slotEl = chip.querySelector('.ac-slot');
        if (!img || !nameEl) return;
        var nm = norm(nameEl.textContent);
        var slot = slotEl ? slotEl.textContent.trim().toUpperCase() : '';
        var url = null;

        // 1) match por nombre exacto de habilidad (es_MX)
        for (var i = 0; i < d.spells.length; i++) {
          if (norm(d.spells[i].name) === nm) { url = DD + '/cdn/' + ver + '/img/spell/' + d.spells[i].img; break; }
        }
        if (!url && d.passive && norm(d.passive.name) === nm) {
          url = DD + '/cdn/' + ver + '/img/passive/' + d.passive.img;
        }
        // 2) match por slot explícito
        if (!url) {
          if ((slot === 'PASIVA' || nm === 'pasiva') && d.passive) {
            url = DD + '/cdn/' + ver + '/img/passive/' + d.passive.img;
          } else if (slotIdx[slot] !== undefined && d.spells[slotIdx[slot]]) {
            url = DD + '/cdn/' + ver + '/img/spell/' + d.spells[slotIdx[slot]].img;
          } else if ((slot === 'R' || nm === 'definitiva') && d.spells[3]) {
            url = DD + '/cdn/' + ver + '/img/spell/' + d.spells[3].img;
          }
        }
        if (url) swapIfLoads(img, url);
      });
    });
  }

  function run() {
    var widgets = document.querySelectorAll('.widget');
    if (!widgets.length) return;
    resolveVersion().then(function (ver) {
      widgets.forEach(function (w) { processWidget(ver, w); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
