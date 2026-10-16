# impl CONTACT-EMAIL-IMAGE

Contacto: imagen original, correo real y limpieza de assets sin uso. Primera vuelta.

## Figma

El MCP de Figma no está autenticado: no se pidió `get_design_context` de 174:73. Se usó la exportación
local `design/figma/assets/imgContactSection.png` (4096 × 2731, dos monitores sobre escritorio de madera)
como imagen original. **Confirmar con el usuario o con Figma** que es la misma que 174:73.

## Archivos

- `src/assets/images/contacto-homepage/escritorio-dos-monitores.jpg`: nueva; original redimensionada a 2880 × 1920 (2× del ancho máximo que pide `ContactBackdrop`), JPEG q80 progresivo, 389 kB (origen PNG de 5,5 MB). Astro genera AVIF/WebP de 12–172 kB.
- `src/assets/images/contacto-homepage/remittven-laptop.png`: eliminada (quedaba sin uso).
- `src/content/data/pages/home.json`: `contact.content.background` apunta a la nueva imagen, alt en español ("Dos monitores sobre un escritorio de madera con maquetas de páginas web en pantalla."); aviso `status.unavailable` añade "Escríbenos a hola@bysensei.com.".
- `src/content/site.ts`: `studioEmail = 'hola@bysensei.com'` (único sitio donde vive); el `mailto:` del modal de asesoría ya lleva destinatario; avisos `unavailable` de cotización y asesoría añaden "Escríbenos a ${studioEmail}.".
- `docs/content-model.md`: regla 9 documenta la excepción (fondo de contacto = imagen original del diseño, pedida por el usuario).
- `design/content-gaps.md`: retirada la fila 3b y la fila P1 `studioEmail` pasa a RESUELTO.

El footer y `/links` no muestran ni enlazan correo del estudio en ningún punto (comprobado con búsqueda): no se añadieron bloques nuevos para no cambiar la estructura.

## Limpieza de assets (src/assets/ y public/)

Método: script que recorre cada archivo de `src/assets/` y `public/` y busca su ruta relativa
(`images/...` de los MediaRef en JSON, `@/assets/...` de los imports, `/favicon.ico`…) en todo `src/`
(ts, astro, svelte, json, css, md) y `astro.config.mjs`; los candidatos se comprobaron además por nombre
de archivo y por rutas construidas con plantillas (no hay ninguna fuera de `media.ts`). Eliminados:

- `src/assets/images/contacto-homepage/remittven-laptop.png`
- `src/assets/images/servicios-homepage/cappi-xtremo-backoffice.png`
- `src/assets/images/servicios-homepage/cappi-xtremo-laptop.jpg`
- `src/assets/images/servicios-homepage/yupa-app-catalog-screen.jpg`

`public/` (favicon.ico, favicon.svg, og-image.jpg, videos/hero-background.mp4): todo referenciado, nada borrado. `design/` intacto. Una segunda pasada del script tras borrar no encuentra más huérfanos.

## Tokens

Ninguno agregado ni eliminado.

## Responsive

Sin cambios de layout: el fondo sigue en `ContactBackdrop` (object-cover, 100vw, anchos 640–2880, opacidad 30 % + velo), y la nueva imagen es 3:2 como el recorte declarado, así que a 375, 768, 1024 y 1440 encuadra igual que antes (los monitores quedan centrados; en móvil se recorta a la zona central, sin pérdida relevante bajo el velo). Los avisos `unavailable` son una frase más largos y se ajustan dentro de la card (texto fluido, sin anchos fijos).

## init.ps1

VERDE: toolchain, pnpm install, estado (1 in_progress), sistema de diseño, arquitectura, astro check y astro build OK.
