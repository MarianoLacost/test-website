/* Búsqueda inteligente de íconos de habilidades (Wild Rift).
   Los RETRATOS de campeón salen del JSON oficial / Data Dragon (ruta segura).
   Los ÍCONOS DE HABILIDAD no están en el JSON, así que acá se buscan por
   fuerza bruta contra CommunityDragon: probamos 3 rutas conocidas en orden de
   prioridad y nos quedamos con la primera que exista (que cargue sin 404).
   Si las 3 fallan, el <img> conserva su onerror y muestra el SVG de respaldo.
   Nunca se pinta un ícono equivocado ni queda una imagen rota. */
(function () {
  var CDG = 'https://raw.communitydragon.org/latest/game/assets/characters/';

  // getAbilityIconUrl(alias, skillType) -> array de rutas candidatas.
  // alias se normaliza a minúsculas (p. ej. "MasterYi" -> "masteryi").
  // skillType es uno de: p (pasiva), q, w, e, r.
  function getAbilityIconUrl(alias, skillType) {
    var a = String(alias || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    var t = String(skillType || '').toLowerCase();
    return [
      CDG + a + '/hud/icons/' + a + '_' + t + '.png',
      CDG + a + '/hud/' + a + '_' + t + '.png',
      CDG + a + '/icons/' + t + '.png'
    ];
  }
  // Exponer por si se reutiliza en otras secciones de la web.
  window.getAbilityIconUrl = getAbilityIconUrl;

  // El texto que ve el usuario ('Pasiva', 'Primera Habilidad', ...) se mapea al
  // tipo de archivo p/q/w/e/r. Aceptamos también códigos viejos por compatibilidad.
  var SLOT_TO_TYPE = {
    'PASIVA': 'p', 'PRIMERA HABILIDAD': 'q', 'SEGUNDA HABILIDAD': 'w',
    'TERCERA HABILIDAD': 'e', 'ULTIMATE': 'r',
    'Q': 'q', 'W': 'w', 'E': 'e', 'R': 'r'
  };

  // Prueba las rutas candidatas en orden. Usa un Image() descartable, así que
  // solo asigna el src real cuando la imagen carga de verdad (sin CORS, sin
  // dejar imágenes rotas). Si ninguna carga, no toca el <img> (queda el SVG).
  function probe(img, urls, i) {
    if (i >= urls.length) return;
    var test = new Image();
    test.onload = function () { img.src = urls[i]; };
    test.onerror = function () { probe(img, urls, i + 1); };
    test.src = urls[i];
  }

  function typeFor(chip, alias) {
    var slotEl = chip.querySelector('.ac-slot');
    var slot = slotEl ? slotEl.textContent.trim().toUpperCase() : '';
    if (SLOT_TO_TYPE[slot]) return SLOT_TO_TYPE[slot];
    var nameEl = chip.querySelector('.ac-name');
    var nm = nameEl ? nameEl.textContent.trim().toLowerCase() : '';
    if (nm === 'pasiva') return 'p';
    if (nm === 'definitiva') return 'r';
    return null; // "Habilidad" genérica o "Estadísticas base": sin tipo fiable.
  }

  function run() {
    document.querySelectorAll('.widget').forEach(function (widget) {
      // alias del campeón: del retrato en el <h3> (data-alias) o de la ruta /champion/Alias.png
      var champImg = widget.querySelector('h3 img');
      if (!champImg) return;
      var alias = champImg.getAttribute('data-alias');
      if (!alias) {
        var m = (champImg.getAttribute('src') || '').match(/\/champion\/([A-Za-z0-9]+)\.png/);
        alias = m ? m[1] : '';
      }
      if (!alias) return;

      widget.querySelectorAll('.ability-chip').forEach(function (chip) {
        var img = chip.querySelector('img');
        if (!img) return;
        // Preferimos el tipo que dejó el generador; si no, lo deducimos del rótulo.
        var type = img.getAttribute('data-type') || typeFor(chip, alias);
        if (!type) return;
        probe(img, getAbilityIconUrl(alias, type), 0);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
