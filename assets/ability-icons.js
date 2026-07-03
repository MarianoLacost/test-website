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

  // Mapa alias→id incrustado (champion-summary.json oficial). Evita una llamada de
  // red y garantiza la resolución de cada campeón; solo los PNG se bajan de CommunityDragon.
  var CHAMP_IDS = {"aatrox":266,"ahri":103,"akali":84,"akshan":166,"alistar":12,"ambessa":799,"amumu":32,"anivia":34,"annie":1,"aphelios":523,"ashe":22,"aurelionsol":136,"aurora":893,"azir":268,"bard":432,"belveth":200,"blitzcrank":53,"brand":63,"braum":201,"briar":233,"caitlyn":51,"camille":164,"cassiopeia":69,"chogath":31,"corki":42,"darius":122,"diana":131,"draven":119,"drmundo":36,"ekko":245,"elise":60,"evelynn":28,"ezreal":81,"fiddlesticks":9,"fiora":114,"fizz":105,"galio":3,"gangplank":41,"garen":86,"gnar":150,"gragas":79,"graves":104,"gwen":887,"hecarim":120,"heimerdinger":74,"hwei":910,"illaoi":420,"irelia":39,"ivern":427,"janna":40,"jarvaniv":59,"jax":24,"jayce":126,"jhin":202,"jinx":222,"kaisa":145,"kalista":429,"karma":43,"karthus":30,"kassadin":38,"katarina":55,"kayle":10,"kayn":141,"kennen":85,"khazix":121,"kindred":203,"kled":240,"kogmaw":96,"ksante":897,"leblanc":7,"leesin":64,"leona":89,"lillia":876,"lissandra":127,"locke":805,"lucian":236,"lulu":117,"lux":99,"malphite":54,"malzahar":90,"maokai":57,"masteryi":11,"mel":800,"milio":902,"missfortune":21,"monkeyking":62,"mordekaiser":82,"morgana":25,"naafiri":950,"nami":267,"nasus":75,"nautilus":111,"neeko":518,"nidalee":76,"nilah":895,"nocturne":56,"nunu":20,"olaf":2,"orianna":61,"ornn":516,"pantheon":80,"poppy":78,"pyke":555,"qiyana":246,"quinn":133,"rakan":497,"rammus":33,"reksai":421,"rell":526,"renata":888,"renekton":58,"rengar":107,"riven":92,"rumble":68,"ryze":13,"samira":360,"sejuani":113,"senna":235,"seraphine":147,"sett":875,"shaco":35,"shen":98,"shyvana":102,"singed":27,"sion":14,"sivir":15,"skarner":72,"smolder":901,"sona":37,"soraka":16,"swain":50,"sylas":517,"syndra":134,"tahmkench":223,"taliyah":163,"talon":91,"taric":44,"teemo":17,"thresh":412,"tristana":18,"trundle":48,"tryndamere":23,"twistedfate":4,"twitch":29,"udyr":77,"urgot":6,"varus":110,"vayne":67,"veigar":45,"velkoz":161,"vex":711,"vi":254,"viego":234,"viktor":112,"vladimir":8,"volibear":106,"warwick":19,"xayah":498,"xerath":101,"xinzhao":5,"yasuo":157,"yone":777,"yorick":83,"yumi":350,"yunara":804,"yuumi":350,"zaahen":904,"zac":154,"zed":238,"zeri":221,"ziggs":115,"zilean":26,"zoe":142,"zyra":143};

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

  // El id de cada campeón sale del mapa incrustado (sin red).

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

        // candidatos = pasiva + Q/W/E/R, en orden
        var cand = [];
        if (d.passive) cand.push({ name: norm(d.passive.name), url: d.passive.url });
        ['q', 'w', 'e', 'r'].forEach(function (k) {
          if (d.spells[k]) cand.push({ name: norm(d.spells[k].name), url: d.spells[k].url });
        });

        // 1) match por nombre exacto (es_mx)
        for (var i = 0; i < cand.length && !url; i++) {
          if (cand[i].name && cand[i].name === nm) url = cand[i].url;
        }

        // 2) match por slot explícito (BASE no tiene ícono y queda genérico)
        if (!url) {
          if ((slot === 'PASIVA' || nm === 'pasiva') && d.passive) {
            url = d.passive.url;
          } else if (['Q', 'W', 'E', 'R'].indexOf(slot) !== -1 && d.spells[slot.toLowerCase()]) {
            url = d.spells[slot.toLowerCase()].url;
          } else if (nm === 'definitiva' && d.spells.r) {
            url = d.spells.r.url;
          }
        }

        // 3) match por "contiene", solo si es inequívoco (un único candidato)
        //    y el nombre es suficientemente largo para no dar falsos positivos.
        if (!url && nm.length >= 5) {
          var hits = cand.filter(function (c) {
            return c.name && (c.name.indexOf(nm) !== -1 || nm.indexOf(c.name) !== -1);
          });
          if (hits.length === 1) url = hits[0].url;
        }

        swapIfLoads(img, url);
      });
    });
  }

  function run() {
    var widgets = document.querySelectorAll('.widget');
    if (!widgets.length) return;
    widgets.forEach(function (w) { processWidget(CHAMP_IDS, w); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
