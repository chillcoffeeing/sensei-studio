# impl SERVICES-IMAGES — Servicios: imágenes propias por disciplina

Figma `flzA0qnj6JdalFCgyB2PdI`: `get_design_context` de 362:28 y 362:29 (con screenshot); export de cada
rectángulo con `download_assets` (escala 1). Los rótulos 352:37 y 352:39/352:40 no se exportan.

## Archivos

- `src/content/data/pages/home.json` — `images` de Branding, Email Marketing y Diseño UX/UI sustituidas; alt descriptivo en español; sin `position` (recorte central).
- `src/assets/images/servicios-homepage/branding-papitos-fast-food.jpg` — nuevo, 351:28 (1281 × 1913, JPEG q88 mozjpeg, 352 kB).
- `src/assets/images/servicios-homepage/branding-my-little-cat.jpg` — nuevo, 351:29 (q88, 340 kB).
- `src/assets/images/servicios-homepage/branding-tiffany-studios.jpg` — nuevo, 351:30 (q88, 156 kB).
- `src/assets/images/servicios-homepage/email-marketing-casa-tierra-cafe.jpg` — nuevo, 352:32 (q90 por el texto, 294 kB).
- `src/assets/images/servicios-homepage/email-marketing-odontosalud.jpg` — nuevo, 352:33 (q90, 235 kB).
- `src/assets/images/servicios-homepage/email-marketing-rutas-andinas.jpg` — nuevo, 352:34 (1282 × 1913, q90, 400 kB).
- `ux-ui-investigacion.png`, `ux-ui-wireframes-prototipo.png`, `ux-ui-diseno-validacion.png` — del usuario, sin tocar; ahora referenciadas en ese orden.
- `src/content/ui-catalog.ts` — comentario actualizado (la muestra `services[0].images[1]` ya no lleva `position`).
- `design/content-gaps.md` — Servicios: quitados los huecos de Branding/Email; nuevo P2 PENDIENTE del estudio para Desarrollo & IA (`services[3].images`).
- `design/placeholders.md` — nueva tabla de origen de servicios; quitada la mención a copias compartidas con `slider-destacados-homepage/`.
- `feature_list.json` — SERVICES-IMAGES a `in_progress`. `progress/current.md` — plan.

## Imágenes sin uso eliminadas

Comprobado con grep en `src/`, `design/`, `docs/`, `scripts/` y `public/`: ninguna ruta `servicios-homepage/<archivo>`
las referenciaba (las de `slider-destacados-homepage/` son copias aparte y siguen en uso). Borradas tras la
aprobación del usuario:

```
src/assets/images/servicios-homepage/las-donas-florist.jpg
src/assets/images/servicios-homepage/qfud-app-screens.jpg
src/assets/images/servicios-homepage/pictdare-app-screens.jpg
src/assets/images/servicios-homepage/just-make-it-fun-web-screens.jpg
src/assets/images/servicios-homepage/yupa-checkout-screens.jpg
src/assets/images/servicios-homepage/las-donas-laptop.jpg
src/assets/images/servicios-homepage/remittven-confirmation-screen.png
src/assets/images/servicios-homepage/referi-app-screens.jpg
src/assets/images/servicios-homepage/soldee-app-screens.jpg
```

## Tokens

Ninguno agregado ni quitado.

## Responsive / encuadre

- El acordeón recorta en el servidor al hueco fijo 187:318 (`--service-image-aspect`) en todos los anchos
  (mobile: 3 columnas de `(100vw - 66px) / 3`; md+: 187 px). Las nuevas son 1281 × 1913 (0,67), así que
  solo se pierde ~12 % del ancho, repartido a los lados.
- Recorte central (sin `position`) para las 9: las composiciones (flat lays, correos centrados, láminas
  UX con márgenes) tienen su contenido en el centro; los bordes que se pierden son fondo o margen. Las
  láminas de email/UX con texto pequeño se leen como pieza visual a 103 px en 375; a 187 px (768–1440)
  se distingue la estructura. La composición del acordeón no cambia.

## Desviaciones de Figma

- Formato JPEG en lugar del PNG del export (fotografía/mockups: 150–400 kB frente a 2,6–4 MB); el build
  genera además AVIF/WebP.
- Las láminas UX/UI se dejan en PNG tal como las entregó el usuario (Astro las sirve como AVIF/WebP/JPG).

## init.ps1

VERDE: toolchain, dependencias, estado (1 in_progress), sistema de diseño, arquitectura, `astro check` y
`astro build` en OK; el build procesa las 9 imágenes nuevas (variantes de 6–116 kB).
