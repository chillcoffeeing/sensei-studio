# impl SEO-OG-FAVICON — Imagen Open Graph (41:464) y favicon (224:316)

Figma `flzA0qnj6JdalFCgyB2PdI`: `get_design_context` + screenshot de 41:464 y 224:316,
`get_metadata` de ambos y `download_assets` (export de 41:464 a 2× = 2198×1238; fuentes crudas de 224:316).

## Archivos

- `public/og-image.jpg` — reemplazada: export de 41:464 (1099×619 @2×) a 1200×630 *cover* centrado, JPG q86 mozjpeg 4:4:4, **18 KB**.
- `public/favicon.svg` — reemplazado (era el de Astro): SVG 128×128 que envuelve un PNG de 128 px del icono.
- `public/favicon.ico` — reemplazado: ICO 32×32 (PNG embebido).
- `public/apple-touch-icon.png` — nuevo, 180×180 (8 KB).
- `public/icon-192.png`, `public/icon-512.png` — nuevos, iconos del manifest (9 KB / 53 KB).
- `public/site.webmanifest` — nuevo: nombre, `short_name`, `lang`, `start_url`, `display: browser`, `theme_color`/`background_color` #090909, iconos 192 y 512.
- `src/assets/brand/logo-square.png` — nuevo, 512×512 sobre negro sólido: logo de `Organization` (JSON-LD).
- `src/content/site.ts` — `meta.logo` = `logoSquare`; `meta.themeColor`; comentario y alt de `shareImage` actualizados a la pieza 41:464.
- `src/core/site.ts` — `SiteMeta.themeColor` y doc del `logo`.
- `src/layout/DocumentHead.astro` — `favicon.ico sizes="32x32"` + `favicon.svg`, `apple-touch-icon`, `manifest` y `<meta name="theme-color">`.

## Cómo se generaron

Script con `sharp` (dependencia ya instalada), ejecutado desde el scratchpad, no versionado:
- Icono: 224:316 es un **bitmap** (rectángulo con relleno de imagen, sin vector). Se tomó la fuente
  cruda de 1024 px y se recortó con la misma geometría del nodo (imagen al 180.58 %, desplazada
  -40.49 % / -40.44 %) → 567×567, aplanado sobre #090909, y de ahí 32/128/180/192/512 (lanczos3, PNG paleta 64 colores).
- OG: export a 2× aplanado sobre #090909 y `resize(1200, 630, cover)`; solo recorta ~23 px de fondo
  vacío arriba y abajo (el bloque de logo + claim está centrado en vertical en el frame).

## Desviaciones y motivos

- **favicon.svg no es vectorial**: el nodo 224:316 solo tiene un bitmap y la regla de assets prohíbe
  redibujar/trazar. Se envuelve un PNG de 128 px (12 KB). Sin variante de modo oscuro: el icono es
  un cuadrado negro con glifo blanco y se lee bien en ambos temas. Si Diseño entrega el "S" en vector,
  basta sustituir el archivo.
- **Recorte cuadrado a sangre** (como el nodo de Figma), no la versión de esquinas redondeadas de la
  fuente cruda: los sistemas (iOS, Android, pestañas) aplican su propia máscara.
- Manifest sin `purpose: maskable`: el círculo del glifo queda fuera de la zona segura del 40 %.
- `theme-color` = `--color-ink` (#090909). Va como literal en `site.ts` con `ds-allow` (el `<meta>` y el
  manifest necesitan el color, no un token CSS).
- Alt de la imagen por defecto: describe la pieza nueva ("Logotipo de Sensei Studio sobre fondo negro: agencia para marcas que convierten").

## Para el orquestador

- `design/content-gaps.md` (no lo edito): se pueden cerrar las filas P3 de `meta.logo` (línea ~132) y de
  `public/og-image.jpg` (línea ~141).
- Tokens: ninguno agregado ni quitado.

## Responsive inferido

No aplica (assets estáticos del `<head>`).

## Comprobación en el build (`dist/client/index.html`)

- `og:image` = `https://bysensei.com/og-image.jpg`, `og:image:width/height` 1200/630, `og:image:alt` presente.
- `<link rel="icon" href="/favicon.ico" sizes="32x32">`, `favicon.svg`, `apple-touch-icon`, `manifest`, `<meta name="theme-color" content="#090909">`.
- JSON-LD `Organization.logo` = `https://bysensei.com/_astro/logo-square.CxGcqQ8d.png`.

## init.ps1

VERDE: toolchain, pnpm install, estado (1 in_progress), check:ds (1 ds-allow · 0 errores),
check:arch (291 archivos · 21 módulos · 0 errores), astro check (0 errors), astro build OK.
