/* Fuente de datos de campeones para el widget "Últimos Campeones" (index.html)
   y su modal-wiki.

   >>> ORDEN: la lista está ordenada del MÁS NUEVO al más viejo según el
   calendario de salida en WILD RIFT (no el de LoL PC). El widget respeta ese
   orden por POSICIÓN en el array (no depende de fechas), y muestra los 4
   primeros. Para reordenar, mové los objetos de lugar.

   Cada campeón:
     id        -> id de CommunityDragon (retrato + íconos). Norra es exclusiva
                  de Wild Rift y NO tiene íconos en CommunityDragon: hay que
                  cargárselos a mano (ver 'manualIcon' más abajo).
     alias     -> alias de CommunityDragon (para resolver los íconos reales).
     name, role
     videoUrl  -> link de YouTube. Si queda vacío, el modal muestra
                  "Video no disponible" sin romper nada.
     skills    -> las 5 EN ORDEN (Pasiva, Primera, Segunda, Tercera, Ultimate):
                  { key, name, desc }. El ícono lo resuelve solo WRIcons
                  (assets/ability-icons.js), igual que en la página de Campeones.

   NOTA: los textos de habilidades son un PUNTO DE PARTIDA. Revisalos/ajustalos.

   Roles válidos (para el ícono): 'Top', 'Jungla', 'Mid', 'ADC', 'Soporte'.
*/
const CHAMPIONS = [
  {
    id: 72, alias: 'Skarner', name: 'Skarner', role: 'Jungla',
    videoUrl: '',
    skills: [
      { key: 'p', name: 'Vibración cristalina', desc: 'Sus golpes y habilidades cargan vibraciones en los enemigos; al llenarse, estallan por daño extra y lo curan. Sostiene muy bien en la jungla.' },
      { key: 'q', name: 'Tierra destrozada', desc: 'Potencia sus ataques y puede arrancar una roca del suelo para tirarla y ralentizar. Su herramienta de farmeo y pelea.' },
      { key: 'w', name: 'Bastión sísmico', desc: 'Gana escudo y velocidad, y su siguiente golpe pega en área. Buena para entrar y aguantar.' },
      { key: 'e', name: 'Impacto de Ixtal', desc: 'Embiste hacia adelante; si arrastra a los enemigos contra una pared, los aturde. La clave para pescar picks.' },
      { key: 'r', name: 'Empalar', desc: 'Atrapa hasta dos campeones y los arrastra mientras los suprime. Su sello: robar al carry y llevárselo a tu equipo.' }
    ]
  },
  {
    id: 897, alias: 'KSante', name: "K'Sante", role: 'Top',
    videoUrl: '',
    skills: [
      { key: 'p', name: 'Instinto intrépido', desc: 'Sus habilidades marcan al enemigo y sus ataques detonan la marca por daño extra. Manejar esa marca es media pelea.' },
      { key: 'q', name: 'Golpes Ntofo', desc: 'Pega al frente y acumula; al tercer golpe aturde y lo acerca de un tirón. Su control principal.' },
      { key: 'w', name: 'Abrecaminos', desc: 'Carga bloqueando daño y después embiste empujando enemigos. Aguanta un montón si la cargás bien.' },
      { key: 'e', name: 'Juego de pies', desc: 'Dash hacia un aliado o enemigo con un poco de escudo. Su movilidad para reposicionar.' },
      { key: 'r', name: 'Sin reservas', desc: 'Expulsa a un enemigo de su fortaleza y entra en modo ágil, empujándolo lejos. Ideal para sacar al carry de posición.' }
    ]
  },
  {
    id: 163, alias: 'Taliyah', name: 'Taliyah', role: 'Mid',
    videoUrl: '',
    skills: [
      { key: 'p', name: 'Surf rocoso', desc: 'Gana velocidad al moverse pegada a las paredes fuera de combate. Roams larguísimos.' },
      { key: 'q', name: 'Descarga tejida', desc: 'Lanza una ráfaga de piedras y deja el suelo labrado. Su daño y limpieza de olas.' },
      { key: 'w', name: 'Empujón sísmico', desc: 'Levanta a un enemigo y lo empuja en la dirección que elijas. Enganche y cortavías.' },
      { key: 'e', name: 'Tierra fragmentada', desc: 'Siembra el piso de trampas; si empujás a un enemigo por encima, queda enredado. Combo clásico con la W.' },
      { key: 'r', name: 'Muro del tejedor', desc: 'Levanta una muralla gigante que parte el mapa. Sirve para viajar o para cortar la pelea al medio.' }
    ]
  },
  {
    id: 800, alias: 'mel', name: 'Mel', role: 'Mid',
    videoUrl: '',
    skills: [
      { key: 'p', name: 'Sobrecarga', desc: 'Sus hechizos apilan Sobrecarga; al golpear a un enemigo saturado, detona por daño mágico extra. En peleas largas suma un montón.' },
      { key: 'q', name: 'Andanada radiante', desc: 'Hace llover una ráfaga de proyectiles en un área. De cerca pegan más juntos.' },
      { key: 'w', name: 'Trampa solar', desc: 'Lanza un orbe que enraíza a los enemigos en la zona. Su enganche para combear.' },
      { key: 'e', name: 'Refutación', desc: 'Desvía por un instante el daño y los proyectiles que le tiran. Contra combos de un tiempo, la rompe.' },
      { key: 'r', name: 'Eclipse dorado', desc: 'Ultimate de largo alcance que castiga a los enemigos saturados con poca vida. Para cerrar peleas desde atrás.' }
    ]
  },
  {
    id: 0, alias: 'Norra', name: 'Norra', role: 'Mid', wrOnly: true,
    // Norra es exclusiva de Wild Rift: CommunityDragon no tiene sus íconos.
    // Cuando tengas las imágenes, pegá las URLs acá (retrato y por habilidad)
    // y agrego el soporte de 'manualIcon' en el widget.
    manualIcon: { portrait: '', p: '', q: '', w: '', e: '', r: '' },
    videoUrl: '',
    skills: [
      { key: 'p', name: 'Pasiva — por confirmar', desc: 'Completar con el kit oficial de Norra en Wild Rift.' },
      { key: 'q', name: 'Primera habilidad — por confirmar', desc: 'Completar con el kit oficial.' },
      { key: 'w', name: 'Segunda habilidad — por confirmar', desc: 'Completar con el kit oficial.' },
      { key: 'e', name: 'Tercera habilidad — por confirmar', desc: 'Completar con el kit oficial.' },
      { key: 'r', name: 'Ultimate — por confirmar', desc: 'Completar con el kit oficial.' }
    ]
  },
  {
    id: 901, alias: 'smolder', name: 'Smolder', role: 'ADC',
    videoUrl: '',
    skills: [
      { key: 'p', name: 'Práctica de dragón', desc: 'Acumula pilas con sus básicas potenciadas; al llegar alto, su Q ejecuta a los enemigos con poca vida. Escala infinito.' },
      { key: 'q', name: 'Aliento flamígero', desc: 'Escupe fuego que suma pilas de la pasiva. La habilidad que spameás toda la partida.' },
      { key: 'w', name: '¡Achís!', desc: 'Bola de fuego que pega en área y ralentiza. Buena para limpiar olas y zonear.' },
      { key: 'e', name: 'Aletea, aletea', desc: 'Vuela un ratito, esquiva y pega a los enemigos más cercanos. Su escape y kiteo.' },
      { key: 'r', name: '¡Mamáaaa!', desc: 'Mamá dragón hace una pasada gigante que pega en área y escuda a los aliados de abajo. Team-fight y salvada en una.' }
    ]
  }
];

/* Compatibilidad: disponible como global. */
if (typeof window !== 'undefined') window.CHAMPIONS = CHAMPIONS;
