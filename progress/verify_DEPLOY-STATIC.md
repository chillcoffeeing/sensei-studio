# Verify DEPLOY-STATIC — vuelta 1
Resultado: VERDE

No hubo conexión a ningún servidor ni se leyó `.env`. La revisión es local: build, `dist/` y una lectura estática de `.htaccess`.

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [SEO] `dist/404.html` lleva `<link rel="canonical" href="https://bysensei.com/404/">`. Esa URL no existe, porque el archivo es `/404.html` y Apache lo sirve en cualquier ruta inexistente. No hace daño, ya que la página tiene `noindex, nofollow`. Lo ideal es que BaseLayout/DocumentHead omita el canonical cuando `seo.noindex` es true, o que apunte a `/404.html`. (src/pages/404.astro:16, que pasa `seo` a BaseLayout)
- [Apache] La regla http→https da por buena la cabecera `X-Forwarded-Proto: https` que envía el cliente. Con una petición http que la falsifique, la redirección no se hace. Solo afecta a esa petición y no tiene impacto de seguridad real. Se anota para tenerlo presente si nunca va a haber proxy delante. (public/.htaccess:27)
- [Apache] `Options -Indexes` y `DirectoryIndex` requieren `AllowOverride Options/Indexes`. En Namecheap/cPanel están permitidos, pero en un hosting que no los permita darían un 500. Es una observación, no hay que cambiar nada. (public/.htaccess:6-8)

## Verificado sin hallazgos
- **V1**: `./init.ps1` termina VERDE (exit 0). toolchain, pnpm install, estado (1 in_progress), check:ds (0 errores, 1 ds-allow que ya existía), check:arch (293 archivos · 21 módulos · 0 errores), astro check (0 errores y 0 warnings; 1 hint previo en DocumentHead.astro:105) y build (`output: "static"`, `mode: "static"`, 9 páginas).
- **Build estático**: `astro.config.mjs` usa `output: 'static'`, sin adapter y con un comentario. `dist/server/` no existe. `@astrojs/node` no aparece en package.json, pnpm-lock.yaml, src/ ni astro.config.mjs. Todas las rutas de `src/pages/` tienen `prerender = true` (404, [...slug], componentes, links, robots.txt.ts, sitemap.xml.ts, proyectos/[slug]).
- **Árbol de `dist/`**: coincide con el informe. Contiene `.htaccess`, `404.html`, `_astro/` (804 archivos), `apple-touch-icon.png`, `componentes/index.html`, `favicon.ico`, `favicon.svg`, `icon-192.png`, `icon-512.png`, `index.html`, `links/index.html`, `og-image.jpg`, `proyectos/{index.html, cappi-xtremo, las-donas, remittven, yupa}`, `robots.txt`, `site.webmanifest`, `sitemap.xml` y `videos/hero-background.mp4`.
- **robots/sitemap**: son archivos estáticos. `robots.txt` lleva `Sitemap: https://bysensei.com/sitemap.xml`. `sitemap.xml` tiene 7 URLs absolutas `https://bysensei.com/...` y excluye la 404 y /componentes (que es noindex), porque el filtro se hace por `seo.noindex`.
- **Página 404**: `dist/404.html` usa BaseLayout (header, footer y modales), tiene `<meta name="robots" content="noindex, nofollow">`, un solo h1, la sección con `aria-labelledby` y un CTA `LinkCtaBrand` a `/`. Reutiliza `shared/ui` (Eyebrow, LinkCtaBrand) y los tokens que ya existen (`text-h2`, `text-body-lg`, `text-ink-muted`, `container-page`). El copy vive en `src/content/not-found.ts` y no en el componente. No usa `client:` porque la página no tiene interacción. Los assets se cargan con rutas absolutas `/_astro/`, así que la página funciona en cualquier ruta profunda.
- **public/.htaccess (Apache 2.4)**: la sintaxis es válida.
  - DirectoryIndex, `Options -Indexes` y `ErrorDocument 404 /404.html` son directivas core y no necesitan `<IfModule>`.
  - Las redirecciones van dentro de `<IfModule mod_rewrite.c>`. Son 301 de un solo salto: www→`https://bysensei.com` y http→https, ambas limitadas al dominio de producción.
  - Los tipos MIME (webmanifest, avif, webp, svg/svgz, mp4 y woff2) y el charset van dentro de `<IfModule mod_mime.c>`.
  - La compresión va dentro de `<IfModule mod_deflate.c>`: solo texto, json, xml, manifest y svg.
  - La caché va dentro de `<IfModule mod_headers.c>`: el default es de 1 día, `<FilesMatch>` pone HTML/xml/txt/webmanifest en `no-cache, must-revalidate` y `<If "%{REQUEST_URI} =~ m#^/_astro/#">` pone 1 año immutable. `<If>` se mezcla después de `<FilesMatch>`, así que /_astro/ gana. También añade nosniff y Referrer-Policy.
  - Si no hay mod_headers, entra el respaldo `<IfModule !mod_headers.c><IfModule mod_expires.c>`.
  - Cada bloque lleva su comentario.
- **docs/deploy.md §1**: lo que dice coincide con lo que se observó: no hay adaptador, cada ruta tiene su carpeta (`proyectos/yupa/index.html`), `ls dist` muestra index.html, proyectos/, links/, _astro/, robots.txt, sitemap.xml, 404.html y .htaccess, no se genera `dist/server/` y `.htaccess` hace lo que describe (HTTPS sin www, 404 propia, /_astro/ 1 año, HTML sin caché y compresión).
- **docs/architecture.md**: el párrafo inicial se actualizó a modo 100 % estático.
- **V2/V3**: la 404 no tiene diseño en Figma. Es una columna única dentro de `container-page` con `max-w-2xl` y `py-24 md:py-40`, sin anchos fijos. La revisión estática no encontró riesgo de scroll horizontal a 375, 768, 1024 ni 1440px. No hubo inspección visual con navegador headless.
- **V4**: el icono `assets/header/arrow-right.svg` existe y es el mismo que usa el CTA del header.
- **V5/V7**: no hay `any`, hex, clases arbitrarias, `ds-allow` nuevos ni imports entre módulos. Los cambios en `src/`/`public/` se limitan a lo que pide el acceptance. `docs/deploy.md`, `scripts/deploy.sh` y `CLAUDE.md` son del orquestador, según las notas de la feature.
