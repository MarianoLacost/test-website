# Panel de edición `/admin` — puesta en marcha (una sola vez)

El panel visual (Sveltia CMS) ya está listo en `admin/`. Para poder iniciar
sesión y que guarde en GitHub, hay que conectar el login **una vez**. Elegí UNA
de estas dos opciones según dónde esté publicada la web.

---

## Opción A — Estás en Netlify (la más simple)

1. En Netlify, entrá a tu sitio → **Integrations / Identity** y activá **Identity**.
2. En **Identity → Services**, activá **Git Gateway**.
3. En **Identity → Registration**, poné *Invite only* e invitáte a vos mismo con
   tu email.
4. Cambiá en `admin/config.yml` el backend por:

   ```yaml
   backend:
     name: git-gateway
     branch: main
   ```
5. Entrá a `https://TU-SITIO.netlify.app/admin/`, aceptás la invitación y listo.

Con esto no hace falta configurar nada de OAuth: Netlify se encarga.

---

## Opción B — Estás en GitHub Pages (login directo con GitHub)

GitHub Pages no da servidor para el login, así que hace falta un pequeño
"portero" OAuth (gratis). El más común es **Sveltia CMS Authenticator** o el
clásico de Decap:

1. En GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - **Homepage URL**: `https://marianolacost.github.io/test-website/`
   - **Authorization callback URL**: la que te indique el portero que uses.
2. Desplegá el portero OAuth (por ejemplo, el de Sveltia en Cloudflare Workers,
   guía oficial: https://github.com/sveltia/sveltia-cms#git-based-oauth) y pegá
   el Client ID / Secret de la OAuth App.
3. En `admin/config.yml`, dejá el backend como está (`name: github`) y agregá la
   línea `base_url` apuntando a tu portero:

   ```yaml
   backend:
     name: github
     repo: marianolacost/test-website
     branch: main
     base_url: https://TU-PORTERO   # URL del worker OAuth
   ```
4. Entrá a `https://marianolacost.github.io/test-website/admin/`, "Login with
   GitHub", y listo.

---

## Cómo se usa (cualquiera de las dos opciones)

1. Entrás a `/admin/`, iniciás sesión.
2. A la izquierda ves **Ajustes del sitio**, **Tema (colores)** y **Noticias**.
3. Editás con formularios, subís imágenes arrastrando, y tocás **Publish**.
4. En 1–2 minutos la web se actualiza sola.

> Nota: las notas de parche oficiales (`wild-rift/parche-*.html`) se generan por
> pipeline y **no** aparecen en el panel a propósito.
