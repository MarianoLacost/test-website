# Cómo editar la web sin tocar código

Esta web está armada para que puedas cambiar **casi todo** desde archivos de
datos simples, sin meterte en el HTML/CSS/JS. Y para lo del día a día, tenés un
**panel visual** en `/admin` (ver más abajo).

---

## 1. El panel visual (lo más fácil) — `/admin`

Entrás a `https://TU-SITIO/admin/`, iniciás sesión con tu cuenta de GitHub y
editás con formularios (como en WordPress). Cuando guardás, se sube solo al
repositorio y la web se actualiza sola en 1–2 minutos.

Desde el panel podés cambiar:

- **Ajustes del sitio** → nombre, bajada, parche vigente, redes.
- **Tema (colores)** → cada color con un selector, sin saber de código.
- **Noticias** → agregar/editar/borrar notas del feed, con **subida de imágenes**
  arrastrando el archivo.

> La primera vez hay que conectar el login de GitHub una sola vez. Está explicado
> en `admin/README-ADMIN.md`.

---

## 2. Editar los archivos de datos a mano (alternativa)

Todo el contenido editable vive en `assets/content/`. Son archivos `.json`:
abrís, cambiás el texto entre comillas, guardás. **No borres las comillas ni las
comas.**

| Qué querés cambiar | Archivo | Clave |
|---|---|---|
| Nombre del sitio, bajada | `assets/content/site.json` | `nombre`, `tagline` |
| Parche vigente (nav + widget) | `assets/content/site.json` | `parcheVigente`, `juegoParche` |
| Tus redes | `assets/content/site.json` | `redes` |
| Colores de toda la web | `assets/content/theme.json` | `colores` |
| Notas del feed de Noticias | `assets/content/articles.json` | `notas` |

### Colores (`theme.json`)
Cada color va en formato `#RRGGBB`. Cambiás el valor y se actualiza en **todas**
las páginas. Si dejás un color mal escrito, se usa el que estaba por defecto.

### Notas del feed (`articles.json`)
Cada nota es un bloque `{ ... }` dentro de `notas`. Campos:

- `href`: a dónde lleva al hacer clic.
- `cat`: categorías separadas por espacio para los filtros (`wr`, `pc`, `parche`, `debate`).
- `img`: imagen de portada (URL).
- `tags`: etiquetas de color arriba del título.
- `title` / `dek`: título y bajada.
- `time` / `read`: cuándo y cuánto se tarda en leer.
- La primera con `"featured": true` es la nota **destacada** (grande).

Para **agregar** una nota, copiás un bloque entero `{ ... }`, lo pegás y le
cambiás los textos. Ojo con la coma entre bloques.

---

## 3. Lo que sigue generándose por pipeline (no se edita a mano)

Las **107 notas de parche oficiales** (`wild-rift/parche-*.html`) se generan
automáticamente desde las notas oficiales con los scripts de `scratchpad/`. Eso
no se toca desde el panel: si hay un parche nuevo, se regenera y listo.

---

## 4. Dónde está cada cosa (mapa rápido)

- `assets/style.css` → estilos. Los **colores** salen de `theme.json`; el resto
  (tamaños, espaciados) está acá.
- `assets/nav.js` → la barra de navegación de arriba (aplica el tema y el parche).
- `assets/feed.js` + `assets/content/articles.json` → el feed de Noticias.
- `assets/ability-icons.js` → íconos de campeones/habilidades (automático).
- `index.html`, `noticias.html`, `wild-rift/…` → las páginas.
