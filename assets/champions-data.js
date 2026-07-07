/* Fuente de datos de campeones para el widget "Últimos Campeones" (index.html)
   y su modal-wiki.

   Cada campeón:
     id        -> id numérico de CommunityDragon (para el retrato y los íconos).
     alias     -> alias de CommunityDragon (para resolver los íconos reales).
     name      -> nombre visible.
     role      -> rol (se le asigna un ícono automáticamente en el widget).
     releaseDate -> 'AAAA-MM-DD'. Se usa SOLO para ordenar (más nuevo primero).
     videoUrl  -> link de YouTube (watch?v=... o youtu.be/...). Si queda vacío,
                  el modal muestra "Video no disponible" sin romper nada.
     skills    -> las 5 habilidades EN ORDEN: Pasiva, Primera, Segunda, Tercera,
                  Ultimate. Cada una: { key, name, desc }. El ícono de cada
                  habilidad NO se pone acá: lo resuelve solo el sistema WRIcons
                  (assets/ability-icons.js) a partir de id+alias+key. Es el mismo
                  método que usa la página de Campeones, el que sí carga bien.

   Roles disponibles (para el ícono): 'Top', 'Jungla', 'Mid', 'ADC', 'Soporte'.
*/
const CHAMPIONS = [
  {
    id: 800, alias: 'mel', name: 'Mel', role: 'Mid',
    releaseDate: '2025-01-21',
    videoUrl: '',
    skills: [
      { key: 'p', name: 'Superávit de poder', desc: 'Sus hechizos dejan una marca en los enemigos; al acumular varias, el próximo golpe detona un estallido de daño extra. Ojo, porque en peleas largas suma un montón.' },
      { key: 'q', name: 'Andanada radiante', desc: 'Dispara una ráfaga de proyectiles que se abre en abanico. De cerca pegan todos juntos y hace un daño bárbaro.' },
      { key: 'w', name: 'Solsticio envolvente', desc: 'Se cubre con un escudo y gana movimiento. Buena para entrar, tradear y salir sin comerte todo.' },
      { key: 'e', name: 'Refracción soberana', desc: 'Refleja el próximo ataque o hechizo que le tiren y lo devuelve. Contra picks de un solo combo, la rompe.' },
      { key: 'r', name: 'Ejecución radiante', desc: 'Ultimate a larga distancia que castiga a los enemigos con poca vida. Ideal para cerrar peleas desde atrás.' }
    ]
  },
  {
    id: 799, alias: 'ambessa', name: 'Ambessa', role: 'Top',
    releaseDate: '2024-11-06',
    videoUrl: '',
    skills: [
      { key: 'p', name: 'Frenesí de guerra', desc: 'Cada tanto su próxima habilidad se potencia y pega dos veces. Manejar bien esta pasiva es la mitad del personaje.' },
      { key: 'q', name: 'Tajo veloz', desc: 'Un corte rápido en área que se puede reactivar para un segundo golpe más largo. Buena para farmear y para tradear.' },
      { key: 'w', name: 'Repudio', desc: 'Se prepara y absorbe daño; si la aguantás, devuelve con un golpe fuerte. Va a pegar menos si te la ven venir.' },
      { key: 'e', name: 'Laceración', desc: 'Dash corto que la reposiciona en peleas. La clave para pegar-y-salir sin quedar expuesta.' },
      { key: 'r', name: 'Ejecución pública', desc: 'Se lanza sobre un enemigo y lo arrastra, encadenando su combo. Con el frenesí bien usado, borra al carry.' }
    ]
  },
  {
    id: 893, alias: 'aurora', name: 'Aurora', role: 'Mid',
    releaseDate: '2024-07-17',
    videoUrl: '',
    skills: [
      { key: 'p', name: 'Espíritus a la deriva', desc: 'Al golpear enemigos libera espíritus que recoge para curarse y pegar un poco más. Sostiene muy bien en línea.' },
      { key: 'q', name: 'Llamarada espiritual', desc: 'Proyectil que explota dos veces: pega al ir y al volver. Si pescás las dos, el daño es alto.' },
      { key: 'w', name: 'Vuelo del más allá', desc: 'Dash que la mete al plano espiritual un ratito, esquivando cosas. Su herramienta de escape y reposición.' },
      { key: 'e', name: 'Entre mundos', desc: 'Aturde en área y deja una zona de terreno. Es su enganche principal para combear.' },
      { key: 'r', name: 'Del otro lado', desc: 'Levanta muros que encierran a los enemigos en una jaula. Cambia peleas enteras si atrapás a varios.' }
    ]
  },
  {
    id: 233, alias: 'briar', name: 'Briar', role: 'Jungla',
    releaseDate: '2023-09-14',
    videoUrl: '',
    skills: [
      { key: 'p', name: 'Hambre voraz', desc: 'Al pegar se cura según la vida que le falte. Cuanto más al límite juega, más chupa vida.' },
      { key: 'q', name: 'Mordida sangrienta', desc: 'Se lanza sobre un enemigo, lo aturde y empieza a sangrar. Su entrada a las peleas.' },
      { key: 'w', name: 'Frenesí', desc: 'Entra en frenesí, pierde el control pero pega y se cura como loca. Alto riesgo, alta recompensa.' },
      { key: 'e', name: 'Chillido', desc: 'Grito en cono que ralentiza y, si carga, aturde. Buena para pelear y para cortar escapes.' },
      { key: 'r', name: 'Carnicería certera', desc: 'Se catapulta por todo el mapa hacia un enemigo y explota al caer. Engancha desde lejísimos.' }
    ]
  },
  {
    id: 901, alias: 'smolder', name: 'Smolder', role: 'ADC',
    releaseDate: '2024-01-31',
    videoUrl: '',
    skills: [
      { key: 'p', name: 'Draconármico', desc: 'Acumula pilas con cada básica potenciada; al llegar alto, su Q ejecuta a los enemigos con poca vida. Es un ADC que escala infinito.' },
      { key: 'q', name: 'Aliento flamígero', desc: 'Escupe fuego que suma pilas de la pasiva. La habilidad que vas a spamear toda la partida.' },
      { key: 'w', name: 'Achicharrar', desc: 'Zona de fuego que pega en área y ralentiza. Buena para limpiar olas y zonear.' },
      { key: 'e', name: 'A volar', desc: 'Vuela un ratito, esquiva y pega a los enemigos más cercanos. Su escape y su kiteo.' },
      { key: 'r', name: 'Llamada de mamá', desc: 'Mamá dragón hace una pasada gigante que pega en área y da escudo a los aliados abajo. Team-fight y salvada, todo junto.' }
    ]
  },
  {
    id: 910, alias: 'hwei', name: 'Hwei', role: 'Mid',
    releaseDate: '2023-12-06',
    videoUrl: '',
    skills: [
      { key: 'p', name: 'Genio pictórico', desc: 'Sus hechizos marcan a los enemigos y su próxima básica detona la marca. Suma daño sostenido en línea.' },
      { key: 'q', name: 'Materia del disparate', desc: 'Un menú de tres hechizos de daño: proyectil que explota, zona que cae del cielo, o rayo que persigue. Elegís según la situación.' },
      { key: 'w', name: 'Paletas del temperamento', desc: 'Tres hechizos de utilidad: velocidad y cura para los tuyos, o herramientas de movilidad. Su caja de soporte.' },
      { key: 'e', name: 'Espectro de la fatalidad', desc: 'Tres hechizos de control: miedo, raíz o zona que ralentiza. Es el CC que arma sus combos.' },
      { key: 'r', name: 'La grieta abismal', desc: 'Enorme zona que succiona y explota. Con diez hechizos posibles, Hwei es puro combo: la ulti es el remate.' }
    ]
  }
];

/* Compatibilidad: disponible como global. */
if (typeof window !== 'undefined') window.CHAMPIONS = CHAMPIONS;
