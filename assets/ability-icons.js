/* Íconos de habilidades vía CommunityDragon (datos oficiales del cliente de LoL).
   Corre en el navegador del visitante: resuelve el id numérico de cada campeón
   presente en la página, baja sus datos es_mx y reemplaza el ícono genérico de
   cada habilidad por el real. El iconPath que entrega la API (formato
   "/lol-game-data/assets/ASSETS/Characters/.../Icons2D/X.png") se convierte a la
   URL raw de CommunityDragon en minúsculas, que es exactamente como sirve los archivos.
   Matchea por nombre exacto (es_mx) o por slot (Q/W/E/R/PASIVA); si nada matchea
   o la red falla, queda el ícono genérico — nunca uno equivocado. */
(function () {
  var CD = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global';
  var SUMMARY_URL = CD + '/default/v1/champion-summary.json';

  function norm(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function iconUrl(iconPath) {
    if (!iconPath) return null;
    // "/lol-game-data/assets/ASSETS/Characters/Corki/HUD/Icons2D/Corki_R.png"
    //   -> CD + "/default/assets/characters/corki/hud/icons2d/corki_r.png"
    var rel = iconPath.replace(/^\/lol-game-data\/assets/i, '').toLowerCase();
    return CD + '/default' + rel;
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

  function championIds() {
    var hit = cacheGet('cd-ids');
    if (hit) return Promise.resolve(hit);
    return getJSON(SUMMARY_URL).then(function (list) {
      if (!list) return null;
      var map = {};
      list.forEach(function (c) {
        if (c.id > 0 && c.alias) map[c.alias.toLowerCase()] = c.id;
      });
      cacheSet('cd-ids', map);
      return map;
    });
  }

  function champData(numId) {
    var key = 'cd-champ-' + numId;
    var hit = cacheGet(key);
    if (hit) return Promise.resolve(hit);
    return getJSON(CD + '/es_mx/v1/champions/' + numId + '.json').then(function (d) {
      if (!d || !d.spells) return null;
      var out = {
        passive: d.passive ? { name: d.passive.name, url: iconUrl(d.passive.abilityIconPath) } : null,
        spells: {}
      };
      d.spells.forEach(function (sp) {
        out.spells[(sp.spellKey || '').toLowerCase()] = { name: sp.name, url: iconUrl(sp.abilityIconPath) };
      });
      cacheSet(key, out);
      return out;
    });
  }

  function swapIfLoads(img, url) {
    if (!url) return;
    var probe = new Image();
    probe.onload = function () { img.src = url; };
    probe.src = url;
  }

  function processWidget(ids, widget) {
    var champImg = widget.querySelector('h3 img[src*="/champion/"]');
    if (!champImg) return;
    var m = (champImg.getAttribute('src') || '').match(/\/champion\/([A-Za-z0-9]+)\.png/);
    if (!m) return;
    var numId = ids[m[1].toLowerCase()];
    if (!numId) return;
    champData(numId).then(function (d) {
      if (!d) return;
      widget.querySelectorAll('.ability-chip').forEach(function (chip) {
        var img = chip.querySelector('img');
        var nameEl = chip.querySelector('.ac-name');
        var slotEl = chip.querySelector('.ac-slot');
        if (!img || !nameEl) return;
        var nm = norm(nameEl.textContent);
        var slot = slotEl ? slotEl.textContent.trim().toUpperCase() : '';
        var url = null;

        // 1) match por nombre exacto de habilidad (es_mx)
        ['q', 'w', 'e', 'r'].forEach(function (k) {
          if (!url && d.spells[k] && norm(d.spells[k].name) === nm) url = d.spells[k].url;
        });
        if (!url && d.passive && norm(d.passive.name) === nm) url = d.passive.url;

        // 2) match por slot explícito
        if (!url) {
          if ((slot === 'PASIVA' || nm === 'pasiva') && d.passive) {
            url = d.passive.url;
          } else if (['Q', 'W', 'E', 'R'].indexOf(slot) !== -1 && d.spells[slot.toLowerCase()]) {
            url = d.spells[slot.toLowerCase()].url;
          } else if (nm === 'definitiva' && d.spells.r) {
            url = d.spells.r.url;
          }
        }
        swapIfLoads(img, url);
      });
    });
  }

  function run() {
    var widgets = document.querySelectorAll('.widget');
    if (!widgets.length) return;
    championIds().then(function (ids) {
      if (!ids) return;
      widgets.forEach(function (w) { processWidget(ids, w); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
