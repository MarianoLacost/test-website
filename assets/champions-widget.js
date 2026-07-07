/* Widget "Últimos Campeones" + modal-wiki para index.html.
   - Ordena CHAMPIONS por releaseDate descendente y muestra los últimos 4.
   - Al hacer clic abre un modal con: cabecera (nombre + rol), video de YouTube
     (o "Video no disponible"), y 5 botones de habilidad (Pasiva/Q/W/E/R) que
     actualizan el texto de abajo al instante.
   - Los íconos (retrato y habilidades) los resuelve WRIcons (ability-icons.js),
     el mismo método fiable de la página de Campeones. */
(function () {
  var FB = 'assets/icon-fallback.svg';
  var PORTRAIT = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/';

  var SLOT_LABEL = { p: 'Pasiva', q: 'Primera Habilidad', w: 'Segunda Habilidad', e: 'Tercera Habilidad', r: 'Ultimate' };

  // Íconos de rol (SVG inline, sin dependencias externas).
  var ROLE_ICON = {
    'Top':     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V4h16"/><path d="M4 4l7 7"/></svg>',
    'Jungla':  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22V8"/><path d="M12 8C12 4 8 2 5 3c0 4 3 6 7 5z"/><path d="M12 12c0-3 3-5 6-4 0 3-3 5-6 4z"/></svg>',
    'Mid':     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20L20 4"/><path d="M9 4h11v11"/></svg>',
    'ADC':     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
    'Soporte': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21C7 17 3 13 3 8.5 3 6 5 4 7.5 4 9.5 4 11 5.5 12 7c1-1.5 2.5-3 4.5-3C19 4 21 6 21 8.5 21 13 17 17 12 21z"/></svg>'
  };
  function roleGlyph(role) { return ROLE_ICON[role] || ROLE_ICON['Mid']; }

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }

  // watch?v=ID | youtu.be/ID | /embed/ID  ->  URL de embed. Null si no hay.
  function embedUrl(url) {
    if (!url) return null;
    var m = String(url).match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
    return m ? 'https://www.youtube-nocookie.com/embed/' + m[1] : null;
  }

  // El array ya viene ordenado del más nuevo al más viejo (calendario Wild Rift):
  // respetamos esa posición y mostramos los primeros n.
  function latest(n) { return CHAMPIONS.slice(0, n); }

  /* -------------------- Widget -------------------- */
  function cardHtml(c, i) {
    return '<button class="lc-card" data-i="' + i + '" type="button">' +
      '<img class="lc-portrait" loading="lazy" src="' + PORTRAIT + c.id + '.png" alt="' + esc(c.name) + '" ' +
        'onerror="this.onerror=null;this.src=\'' + FB + '\';this.classList.add(\'img-fallback\')">' +
      '<span class="lc-name">' + esc(c.name) + '</span>' +
      '<span class="lc-role">' + roleGlyph(c.role) + esc(c.role) + '</span>' +
    '</button>';
  }

  function buildWidget() {
    var mount = document.getElementById('latestChampions');
    if (!mount || typeof CHAMPIONS === 'undefined') return;
    var list = latest(4);
    // guardamos el orden mostrado para que el modal use el índice correcto
    mount._list = list;
    mount.innerHTML =
      '<div class="lc-head">' +
        '<h2>Últimos campeones</h2>' +
        '<a class="lc-more" href="wild-rift/campeones.html">Ver todos ›</a>' +
      '</div>' +
      '<div class="lc-row">' + list.map(cardHtml).join('') + '</div>';
    mount.querySelectorAll('.lc-card').forEach(function (btn) {
      btn.addEventListener('click', function () { openModal(list[+btn.dataset.i]); });
    });
  }

  /* -------------------- Modal -------------------- */
  var modal;
  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'champ-modal';
    modal.setAttribute('hidden', '');
    modal.innerHTML =
      '<div class="cm-backdrop" data-close></div>' +
      '<div class="cm-dialog" role="dialog" aria-modal="true" aria-labelledby="cmName">' +
        '<button class="cm-x" type="button" data-close aria-label="Cerrar">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '<div class="cm-header">' +
          '<img class="cm-avatar" alt="" onerror="this.onerror=null;this.src=\'' + FB + '\';this.classList.add(\'img-fallback\')">' +
          '<div><h3 id="cmName"></h3><span class="cm-role"></span></div>' +
        '</div>' +
        '<div class="cm-video"></div>' +
        '<div class="cm-skills" role="tablist"></div>' +
        '<div class="cm-skill-info"><h4 class="cm-skill-name"></h4><p class="cm-skill-desc"></p></div>' +
      '</div>';
    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
    });
    document.body.appendChild(modal);
    return modal;
  }

  function selectSkill(champ, key) {
    var sk = champ.skills.filter(function (s) { return s.key === key; })[0];
    if (!sk) return;
    modal.querySelector('.cm-skill-name').textContent = SLOT_LABEL[key] + ' · ' + sk.name;
    modal.querySelector('.cm-skill-desc').textContent = sk.desc;
    modal.querySelectorAll('.cm-skill').forEach(function (b) {
      b.classList.toggle('active', b.dataset.key === key);
      b.setAttribute('aria-selected', b.dataset.key === key ? 'true' : 'false');
    });
  }

  function openModal(champ) {
    ensureModal();
    modal.querySelector('#cmName').textContent = champ.name;
    var role = modal.querySelector('.cm-role');
    role.innerHTML = roleGlyph(champ.role) + '<span>' + esc(champ.role) + '</span>';

    var avatar = modal.querySelector('.cm-avatar');
    avatar.src = PORTRAIT + champ.id + '.png';
    avatar.alt = champ.name;
    avatar.classList.remove('img-fallback');

    // Video (o respaldo)
    var emb = embedUrl(champ.videoUrl);
    modal.querySelector('.cm-video').innerHTML = emb
      ? '<iframe src="' + emb + '" title="' + esc(champ.name) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>'
      : '<div class="cm-video-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/></svg><span>Video no disponible</span></div>';

    // Botones de habilidad (Pasiva/Q/W/E/R) con íconos vía WRIcons
    var skillsWrap = modal.querySelector('.cm-skills');
    skillsWrap.innerHTML = champ.skills.map(function (s) {
      return '<button class="cm-skill" type="button" role="tab" data-key="' + s.key + '" title="' + esc(SLOT_LABEL[s.key]) + '" aria-label="' + esc(SLOT_LABEL[s.key] + ': ' + s.name) + '">' +
        '<img class="cm-skill-ico" loading="lazy" alt="" src="' + FB + '" ' +
          'data-champ-id="' + champ.id + '" data-type="' + s.key + '" data-alias="' + esc(champ.alias) + '" ' +
          'onerror="this.onerror=null;this.src=\'' + FB + '\';this.classList.add(\'img-fallback\')">' +
        '<span class="cm-skill-key">' + s.key.toUpperCase() + '</span>' +
      '</button>';
    }).join('');
    skillsWrap.querySelectorAll('.cm-skill').forEach(function (btn) {
      btn.addEventListener('click', function () { selectSkill(champ, btn.dataset.key); });
    });

    // Resolver los íconos reales (mismo método fiable de Campeones).
    if (window.WRIcons) {
      skillsWrap.querySelectorAll('img[data-champ-id][data-type]').forEach(function (img) {
        window.WRIcons.apply(img, +img.getAttribute('data-champ-id'), img.getAttribute('data-type'), img.getAttribute('data-alias'));
      });
    }

    selectSkill(champ, 'p');            // arranca en la pasiva
    modal.removeAttribute('hidden');
    document.body.classList.add('modal-open');
    modal.querySelector('.cm-x').focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    modal.querySelector('.cm-video').innerHTML = '';   // corta el video al cerrar
    document.body.classList.remove('modal-open');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildWidget);
  else buildWidget();
})();
