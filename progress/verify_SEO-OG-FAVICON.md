# Verify SEO-OG-FAVICON — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V4] `public/favicon.svg` es un PNG de 128 px envuelto en `<image>`, no un vector (12,7 KB frente a ~1 KB de un SVG real). Está justificado: el nodo 224:316 es un bitmap y la regla de assets prohíbe trazarlo. Cuando Diseño entregue la "S" en vector, se sustituye el archivo.
- [V4] `src/assets/brand/logo-square.png` y `public/icon-512.png` son el mismo archivo (53 228 B, 512×512). No es un problema: uno lo procesa Astro (JSON-LD) y el otro es estático (manifest). Queda anotado por si se quiere unificar.
- `design/content-gaps.md`: cerrar las filas P3 de `meta.logo` y `public/og-image.jpg`. Le toca al orquestador, como indica el informe del implementer.

## Verificado sin hallazgos
- **V1**: `./init.ps1` VERDE (código 0). check:ds da 1 ds-allow y 0 errores; check:arch, astro check y astro build en OK.
- **§4 Imagen OG**: `public/og-image.jpg` mide 1200×630, es JPEG 4:4:4 y pesa 18 491 B (límite: < 300 KB). Al compararla con la captura de Figma 41:464 (1099×619), la composición coincide: wordmark "Sensei" con ®, "Studio" en lima y el claim en mayúsculas, todo centrado sobre negro. El recorte *cover* solo quita fondo vacío. El alt está en `src/content/site.ts:74`.
- **§7 Iconos** (contra la captura de 224:316, cuadrado negro a sangre con una "S" blanca y un punto/ojo): `favicon.ico` contiene un PNG de 32×32. `apple-touch-icon.png` mide 180×180 (8 KB), `icon-192.png` 192×192 y `icon-512.png` 512×512. Todos son RGB opacos y coinciden con el diseño. `site.webmanifest` tiene name, short_name, lang, start_url, `theme_color` y `background_color` #090909, y los iconos 192 y 512. No lleva `purpose: maskable`, lo cual está justificado.
- **`<head>` en `dist/client/index.html`**: `og:image` = `https://bysensei.com/og-image.jpg`, con `og:image:width` 1200 y `og:image:height` 630, `og:image:alt` y `twitter:image(:alt)`. También están `<link rel="icon" href="/favicon.ico" sizes="32x32">`, `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`, `apple-touch-icon`, `manifest` y `<meta name="theme-color" content="#090909">`. `/proyectos/` y `/links/` tienen las mismas etiquetas, porque salen de `DocumentHead` y comparten el bloque. Todos los archivos están en `dist/client/`.
- **JSON-LD**: `Organization.logo` = `https://bysensei.com/_astro/logo-square.CxGcqQ8d.png`. El archivo existe en dist y es un PNG cuadrado de 512×512 sobre fondo sólido (≥ 112 px). Viene de `meta.logo` (`src/content/site.ts:65`), con su tipo en `src/core/site.ts:107`.
- **V5**: el único `ds-allow` (`src/content/site.ts:67`, theme-color literal para el meta y el manifest) está justificado. No hay copy en componentes, `any` ni imports entre módulos.
- **V2/V3/V6**: no aplican a la estructura de secciones, porque esta feature solo toca assets del `<head>`. Responsive tampoco aplica.
- **V7**: el alcance se ajusta a `acceptance`: assets en `public/`, `logo-square.png`, `site.ts` (meta), `core/site.ts` (tipo) y `DocumentHead.astro`.
