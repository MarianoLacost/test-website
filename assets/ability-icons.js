/* Íconos de habilidad vía CommunityDragon — método fiable (el que funcionaba).
   El champion-summary.json SOLO trae el retrato (squarePortraitPath), NO las
   habilidades. Así que para cada campeón pedimos su JSON por-id a CommunityDragon
   (.../v1/champions/{id}.json), que trae la RUTA REAL de cada ícono (passive +
   Q/W/E/R), y la aplicamos. Si el fetch falla, se prueba la ruta deducida como
   respaldo, y si todo falla queda el SVG (onerror). */
(function () {
  var CD = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global';
  var GAME = 'https://raw.communitydragon.org/latest/game/assets/characters/';
  var FALLBACK = '../assets/icon-fallback.svg';

  // alias(minúsculas) -> id numérico (de tu champion-summary.json)
  var CHAMP_IDS = {"annie":1,"olaf":2,"galio":3,"twistedfate":4,"xinzhao":5,"urgot":6,"leblanc":7,"vladimir":8,"fiddlesticks":9,"kayle":10,"masteryi":11,"alistar":12,"ryze":13,"sion":14,"sivir":15,"soraka":16,"teemo":17,"tristana":18,"warwick":19,"nunu":20,"missfortune":21,"ashe":22,"tryndamere":23,"jax":24,"morgana":25,"zilean":26,"singed":27,"evelynn":28,"twitch":29,"karthus":30,"chogath":31,"amumu":32,"rammus":33,"anivia":34,"shaco":35,"drmundo":36,"sona":37,"kassadin":38,"irelia":39,"janna":40,"gangplank":41,"corki":42,"karma":43,"taric":44,"veigar":45,"trundle":48,"swain":50,"caitlyn":51,"blitzcrank":53,"malphite":54,"katarina":55,"nocturne":56,"maokai":57,"renekton":58,"jarvaniv":59,"elise":60,"orianna":61,"monkeyking":62,"brand":63,"leesin":64,"vayne":67,"rumble":68,"cassiopeia":69,"skarner":72,"heimerdinger":74,"nasus":75,"nidalee":76,"udyr":77,"poppy":78,"gragas":79,"pantheon":80,"ezreal":81,"mordekaiser":82,"yorick":83,"akali":84,"kennen":85,"garen":86,"leona":89,"malzahar":90,"talon":91,"riven":92,"kogmaw":96,"shen":98,"lux":99,"xerath":101,"shyvana":102,"ahri":103,"graves":104,"fizz":105,"volibear":106,"rengar":107,"varus":110,"nautilus":111,"viktor":112,"sejuani":113,"fiora":114,"ziggs":115,"lulu":117,"draven":119,"hecarim":120,"khazix":121,"darius":122,"jayce":126,"lissandra":127,"diana":131,"quinn":133,"syndra":134,"aurelionsol":136,"kayn":141,"zoe":142,"zyra":143,"kaisa":145,"seraphine":147,"gnar":150,"zac":154,"yasuo":157,"velkoz":161,"taliyah":163,"camille":164,"akshan":166,"belveth":200,"braum":201,"jhin":202,"kindred":203,"zeri":221,"jinx":222,"tahmkench":223,"briar":233,"viego":234,"senna":235,"lucian":236,"zed":238,"kled":240,"ekko":245,"qiyana":246,"vi":254,"aatrox":266,"nami":267,"azir":268,"yuumi":350,"samira":360,"thresh":412,"illaoi":420,"reksai":421,"ivern":427,"kalista":429,"bard":432,"rakan":497,"xayah":498,"ornn":516,"sylas":517,"neeko":518,"aphelios":523,"rell":526,"pyke":555,"vex":711,"yone":777,"ambessa":799,"mel":800,"yunara":804,"locke":805,"sett":875,"lillia":876,"gwen":887,"renata":888,"aurora":893,"nilah":895,"ksante":897,"smolder":901,"milio":902,"zaahen":904,"hwei":910,"naafiri":950};

  // abilityIconPath ("/lol-game-data/assets/ASSETS/Characters/Ahri/HUD/Icons2D/Ahri_Q.png")
  // -> URL cruda de CommunityDragon en minúsculas.
  function iconUrl(p) {
    if (!p) return null;
    return CD + '/default' + p.replace(/^\/lol-game-data\/assets/i, '').toLowerCase();
  }

  // Respaldo por ruta deducida (por si el JSON no trae ese ícono). p/q/w/e/r.
  function getAbilityIconUrl(alias, t) {
    var a = String(alias).toLowerCase().replace(/[^a-z0-9]/g, '');
    return [
      GAME + a + '/hud/icons2d/' + a + '_' + t + '.png',
      GAME + a + '/hud/icons/' + a + '_' + t + '.png',
      GAME + a + '/hud/' + a + '_' + t + '.png'
    ];
  }
  window.getAbilityIconUrl = getAbilityIconUrl;

  function getJSON(url) {
    return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }
  var cache = {};
  function champData(id) {
    if (cache[id]) return cache[id];
    var key = 'wr-champ-' + id;
    try { var hit = sessionStorage.getItem(key); if (hit) { cache[id] = Promise.resolve(JSON.parse(hit)); return cache[id]; } } catch (e) {}
    cache[id] = getJSON(CD + '/default/v1/champions/' + id + '.json').then(function (d) {
      if (!d) return null;
      var out = { p: d.passive ? iconUrl(d.passive.abilityIconPath) : null, spells: {} };
      (d.spells || []).forEach(function (sp) { out.spells[(sp.spellKey || '').toLowerCase()] = iconUrl(sp.abilityIconPath); });
      try { sessionStorage.setItem(key, JSON.stringify(out)); } catch (e) {}
      return out;
    });
    return cache[id];
  }

  // Prueba una lista de URLs en orden y asigna la primera que cargue.
  function probe(img, urls, i) {
    if (i >= urls.length) return;
    var t = new Image();
    t.onload = function () { set(img, urls[i]); };
    t.onerror = function () { probe(img, urls, i + 1); };
    t.src = urls[i];
  }

  // Aplica el ícono real (del JSON) a un <img>; si no está, usa la ruta deducida.
  function set(img, url) { img.src = url; img.classList.remove('img-fallback'); }
  function apply(img, id, type, alias) {
    champData(id).then(function (d) {
      var url = d ? (type === 'p' ? d.p : d.spells[type]) : null;
      if (url) { var t = new Image(); t.onload = function () { set(img, url); }; t.onerror = function () { probe(img, getAbilityIconUrl(alias, type), 0); }; t.src = url; }
      else { probe(img, getAbilityIconUrl(alias, type), 0); }
    });
  }
  window.WRIcons = { idFor: function (a) { return CHAMP_IDS[String(a).toLowerCase()]; }, apply: apply };

  // Rótulo visible -> tipo p/q/w/e/r (nomenclatura Wild Rift; acepta códigos viejos).
  var LABEL_TO_TYPE = {
    'PASIVA': 'p', 'PRIMERA HABILIDAD': 'q', 'SEGUNDA HABILIDAD': 'w',
    'TERCERA HABILIDAD': 'e', 'ULTIMATE': 'r', 'Q': 'q', 'W': 'w', 'E': 'e', 'R': 'r'
  };
  function typeFromLabel(txt) { return LABEL_TO_TYPE[(txt || '').trim().toUpperCase()] || null; }

  // id del campeón desde el retrato: por data-alias, o por champion-icons/{id}.png.
  function champIdFrom(imgEl, alias) {
    if (alias && CHAMP_IDS[alias.toLowerCase()]) return CHAMP_IDS[alias.toLowerCase()];
    var m = (imgEl && imgEl.getAttribute('src') || '').match(/champion-icons\/(\d+)\.png/);
    return m ? parseInt(m[1], 10) : null;
  }

  function run() {
    // Notas de parche: .widget (generadas) y .champ-section (7.1h hecha a mano).
    // El retrato puede estar en <h3> o en .champ-icon; los chips son .ability-chip > .ac-slot.
    document.querySelectorAll('.widget, .champ-section').forEach(function (w) {
      var champImg = w.querySelector('.champ-icon') || w.querySelector('h3 img') ||
                     w.querySelector('img[data-alias]') || w.querySelector('img[src*="champion-icons"]');
      if (!champImg) return;
      var alias = champImg.getAttribute('data-alias') || '';
      var id = champIdFrom(champImg, alias);
      if (!id) return;
      w.querySelectorAll('.ability-chip').forEach(function (chip) {
        var img = chip.querySelector('img'), slot = chip.querySelector('.ac-slot');
        if (!img || !slot) return;
        var t = typeFromLabel(slot.textContent);
        if (t) apply(img, id, t, alias);
      });
    });
    // Campeones: .champ-box[data-champ-id] con celdas .ab-cell > .ab-slot
    document.querySelectorAll('.champ-box[data-champ-id]').forEach(function (box) {
      var id = parseInt(box.getAttribute('data-champ-id'), 10);
      var alias = box.getAttribute('data-alias') || '';
      box.querySelectorAll('.ab-cell').forEach(function (cell) {
        var img = cell.querySelector('img'), slot = cell.querySelector('.ab-slot');
        if (!img || !slot) return;
        var t = typeFromLabel(slot.textContent);
        if (t && id) apply(img, id, t, alias);
      });
    });
    // Cualquier <img data-champ-id data-type> explícito.
    document.querySelectorAll('img[data-champ-id][data-type]').forEach(function (img) {
      var id = parseInt(img.getAttribute('data-champ-id'), 10);
      if (id) apply(img, id, img.getAttribute('data-type'), img.getAttribute('data-alias') || '');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
