# impl DEPLOY-STATIC — Build estático para cPanel (Apache)

Sin servidor ni despliegue: solo build local. No se ha leído ni tocado `.env`.

## Archivos
- `astro.config.mjs` — quitado `@astrojs/node` y `adapter`; `output: 'static'` con comentario.
- `package.json` / `pnpm-lock.yaml` — `pnpm remove @astrojs/node` (nadie más lo usaba; 0 apariciones en el lockfile).
- `src/content/not-found.ts` — nuevo: copy + SEO (`noindex: true`) de la 404, tipo `NotFound`, icono del CTA del header (`assets/header/arrow-right.svg`).
- `src/pages/404.astro` — nuevo: `BaseLayout` (header, barra flotante, footer, modales) + `Eyebrow` + h1 `text-h2` + descripción `text-body-lg` ink-muted + `LinkCtaBrand` "Volver al inicio" → `/`. `prerender = true`.
- `public/.htaccess` — nuevo: DirectoryIndex, `Options -Indexes`, `ErrorDocument 404 /404.html`, 301 www→`https://bysensei.com` y http→https (un salto, solo en el dominio de producción, contempla `X-Forwarded-Proto`), MIME (webmanifest, avif, webp, svg/svgz, mp4, woff2, charset utf-8), `mod_deflate` para texto, caché: `/_astro/*` 1 año immutable, HTML/xml/txt/webmanifest `no-cache, must-revalidate`, resto de public/ 1 día; `nosniff` y `Referrer-Policy`; respaldo `mod_expires` si falta `mod_headers`. Todo opcional dentro de `<IfModule>`, cada bloque comentado.
- `docs/architecture.md` — párrafo inicial: deploy 100 % estático, sin adapter, `.htaccess`, 404, formularios con `endpoint` externo.
- `progress/current.md` — plan de la feature.

## Comprobaciones
- Todas las rutas ya tenían `prerender = true`; con `output: 'static'` no queda ninguna server-rendered. `dist/server/` ya no se genera.
- Formularios: `endpoint` en `content/site.ts` es externo/undefined; no dependen de una ruta propia (sin cambios).
- `dist/` de primer nivel: `.htaccess`, `404.html`, `_astro/` (804 archivos con hash), `apple-touch-icon.png`, `componentes/index.html`, `favicon.ico`, `favicon.svg`, `icon-192.png`, `icon-512.png`, `index.html`, `links/index.html`, `og-image.jpg`, `proyectos/` (`index.html`, `cappi-xtremo/`, `las-donas/`, `remittven/`, `yupa/`, cada uno con `index.html`), `robots.txt`, `site.webmanifest`, `sitemap.xml`, `videos/hero-background.mp4`.
- `robots.txt` y `sitemap.xml` son archivos estáticos con `https://bysensei.com` (Sitemap: https://bysensei.com/sitemap.xml; 7 URLs, sin 404 ni /componentes).
- `dist/404.html` lleva `<meta name="robots" content="noindex, nofollow">`.

## Tokens
Ninguno agregado ni quitado (utilidades de Tailwind y tokens existentes: `text-h2`, `text-body-lg`, `text-ink-muted`, `container-page`).

## Responsive / decisiones
- 404 sin diseño en Figma: columna única alineada a la izquierda dentro de `container-page`, `max-w-2xl`, `py-24` → `md:py-40` para que el footer no se pegue; tipografía fluida de los tokens existentes; `text-balance`/`text-pretty`.
- Header normal (no overlay) porque la primera sección no es hero.
- `<If>` en `.htaccess` requiere Apache 2.4 (el de cPanel/Namecheap lo es).

## init.ps1
VERDE: toolchain, pnpm install, estado (1 in_progress), check:ds (0 errores), check:arch (293 archivos · 21 módulos · 0 errores), astro check (0 errores), astro build OK.
