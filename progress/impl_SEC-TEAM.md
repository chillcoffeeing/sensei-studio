# impl SEC-TEAM — Equipo (vuelta 1)

Fuente: el Figma MCP no está disponible en esta sesión (no hay herramienta `get_design_context`; el conector
`plugin:product-management:figma` pide OAuth). Por eso se usó la exportación `design/figma/homepage.0.txt`
(nodo `41:404` → 38:327 cabecera, 38:335, 38:336, 41:389; 40:387/40:388 fila → 41:399, 40:384, 40:385, 40:386;
41:400–41:402 nombre y rol), `design/figma/homepage-full.png` (recorte de la sección) y los assets
`design/figma/assets/imgFrame36.png` e `imgRectangle21.png`. No hay `design/copy/team.md`: el copy es el de Figma.

## Archivos

- `src/modules/team/schema.ts`: nuevo. `TeamPerson` (`kind: 'person'`, nombre, rol y foto), `TeamPlaceholder` (`kind: 'placeholder'`, foto opcional), `TeamMember`, `TeamContent` y `TeamSection` (cabecera obligatoria).
- `src/modules/team/Section.astro`: nuevo. Cabecera común (`SectionHeader` + descripción en el aside) y carril horizontal de cards con scroll-snap, solo CSS (sin isla).
- `src/modules/team/index.ts`: nuevo, API pública.
- `src/assets/team/natalia-reina.jpg`: nuevo. Es `imgFrame36.png` (4096 × 2731, 6.3 MB) reescalado a 2048 × 1366 en JPG q90 (300 KB). La imagen es la misma, sin recortar ni retocar.
- `src/assets/team/member-photo-placeholder.jpg`: nuevo. Es `imgRectangle21.png` (4096 × 2833, 6.7 MB) reescalado a 2048 × 1416 en JPG q90 (424 KB).
- `src/app/sections.ts`, `src/app/registry.ts`: registran `team`.
- `src/content/pages/home.ts`: sección `equipo` después de `testimonios`.
- `src/styles/tokens.css`: grupo nuevo "Equipo" con 7 tokens.
- `tests/team.test.ts`: nuevo, 11 tests. Cubren el contenido (orden, copy, tonos, forma de las 4 cards, alt) y el contrato del marcado (sin isla, región enfocable, placeholders `aria-hidden`, token del degradado, `astro:assets`).
- `docs/design-system.md` y `docs/architecture.md` (mapa): regenerados.
- `feature_list.json` (`in_progress`) y `progress/current.md` (plan).

## Tokens

| Token | Valor | Origen |
|---|---|---|
| `--team-pad-top` | clamp(40 → 65) | @figma 174:190 fin 7378 → 38:327 top 7443 = 65 · @derived 40 a 375 |
| `--team-head-gap` | clamp(32 → 65) | @figma 38:327 fin 7590 → 40:388 top 7655 = 65 · @derived 32 a 375 |
| `--team-title-max` | 10em | @figma 38:336, h2 en párrafos separados · @derived medido en Chrome (Google Sans Flex 500, 45px): "Las personas detrás" = 418.1px (9.29em) y "Las personas detrás de" = 481.6px (10.70em) |
| `--team-card-w` | clamp(260 → 344) | @figma 41:399 ancho 344 · @derived 260 a 375 |
| `--team-card-aspect` | 344 / 423 | @figma 41:399 |
| `--team-inset` | max(gutter-2xl, (100% − 1320) / 2) | @figma 40:388 left 59 (≈ 60) · @derived: el mismo borde que `container-page` en 2xl |
| `--team-card-scrim` | linear-gradient(-1.8183deg, rgba(0,0,0,.4) 27.887%, rgba(0,0,0,0) 49.687%) | @figma relleno de 41:399 |

Se reutilizan tokens que ya existían y estaban anotados para este nodo: `text-name` (41:401, DM Sans 18/600),
`text-role` (41:402, 14/300), `spacing-21` (gap 40:388), `spacing-23` (mt del rol), `spacing-24` (pl de 41:399),
`spacing-30` (pb de 41:399), `spacing-401` (ancho de 41:389), y además `text-body`, `text-h2`, `text-eyebrow`,
`color-ink` y `color-paper`.

## Decisiones

- **La fila sale a sangre, como en Figma.** 40:388 empieza en x 59 y mide 4 × 344 + 3 × 21 = 1439, así que en el
  canvas de 1440 la 4.ª card queda cortada (se ven 285 de 344). Se traduce a un carril horizontal (`overflow-x-auto`,
  `snap-x snap-mandatory`, `scroll-px`) que arranca en el gutter de la página y llega hasta el borde derecho del
  viewport. Es el mismo lenguaje que el carrusel del showcase.
- **Sin isla.** El desplazamiento es nativo: táctil, trackpad, rueda horizontal y teclado. La región es `role="region"`
  con `aria-label` (desde el contenido), `tabindex="0"` y foco visible (`outline-ink`). La barra de scroll se oculta
  (`scrollbar-none`, como en el showcase) porque Figma no la dibuja.
- **Placeholders decorativos.** 40:384 y 40:386 son bloques `bg-ink` vacíos; 40:385 es una foto sin nombre ni rol.
  No dan información, así que van como `<li aria-hidden="true">` y la foto lleva `alt=""`. Solo Natalia es una
  card con contenido accesible: `h3` con el nombre, `p` con el rol y alt "Retrato de Natalia Reina".
- **Nombre y rol.** Igual que en 41:400, comparten la celda de un grid (`col-start-1 row-start-1`) y el rol lleva
  `mt-23`. Así se reproduce exactamente la posición de Figma: el rol empieza 23px por debajo del nombre, que mide 23.4px de alto.
  La caja va anclada abajo con `pb-30 pl-24`.
- **Degradado** 41:399 como token (`bg-(image:--team-card-scrim)`), en una capa `aria-hidden` entre la foto y el texto.
  40:385 no lo lleva, igual que en Figma.
- **Imágenes.** Se usa `<Picture>` (avif/webp con respaldo JPG). El recorte se hace en el servidor al aspecto
  344:423 (`fit="cover"`, centrado). Los anchos son 260/344/520/688 y `sizes` coincide con el clamp de la card. Las imágenes cargan con `loading="lazy"`.
  Se reescalaron los PNG de 4096px a 2048px de ancho antes de copiarlos. Con una card de 423px de alto a 2×
  (846px) el alto de origen (1366/1416) sobra, y así el repositorio no carga con 13 MB.
- **h2.** El corte "Las personas detrás" / "de cada proyecto" se fija con `max-w-(--team-title-max)` en em. Se mantiene igual con el h2 fluido.
- **Sin padding inferior.** El espacio hasta el FAQ (cards fin 8078 → 41:406 top 8249 = 171) corresponde al
  `pt` de SEC-FAQ, como en el resto de secciones.

## Responsive inferido (medido en Chrome headless sobre el build, en un iframe de ancho exacto)

| Ancho del documento | Cabecera | Aside | Cards (x · ancho × alto) |
|---|---|---|---|
| 1440 | eyebrow y h2 en x 60, h2 de 450 × 112 (2 líneas), pt 65 | 401 × 84 (4 líneas), borde derecho 1380, base alineada con el h2 | 60 / 425 / 790 / 1155 · 344 × 423 (Figma 59 / 424 / 789 / 1154, deriva de 1px normalizada). Cabecera → cards = 65. Rol a 30 del borde inferior y nombre a 24 del izquierdo |
| 1425 (1440 con barra de scroll clásica) | x 60 | borde derecho 1365 | primera card en x 60 (`max()` del inset) |
| 1009 (lg) | x 40, h2 de 98 de alto | a la derecha | 40 / 372 / 704 / 1037 · 311 × 383 |
| 753 (sm) | x 32, apilado | apilado bajo el h2 | 32 / 344 / 656 / 968 · 291 × 358 |
| 375 | x 16, h2 de 302 × 76 (2 líneas, mismo corte) | apilado, 343 × 105 | 16 / 297 / 578 / 859 · 260–261 × 320. Asoma la 2.ª card, sin scroll horizontal de página (docW = 375) |

En ningún ancho hay scroll horizontal de la página: el desborde queda dentro del carril.

## Puntos a confirmar

1. **Equipo incompleto** (INVENTORY §3.6): faltan nombres, roles y fotos de 3 integrantes. La foto de 40:385 no tiene
   nombre: se muestra como placeholder decorativo. Cuando lleguen los datos, basta con cambiar los `placeholder` por `person` en `home.ts`.
2. **Ratón sin rueda horizontal.** Al ocultar la barra, a un usuario con ratón y sin trackpad le cuesta ver la parte cortada
   (en 1440 solo es la mitad derecha del 4.º bloque ink; en tablet, también parte de la 3.ª foto). Si se quiere
   arrastrar con el ratón como en el showcase, la isla `ShowcaseScroller` debería pasar a `shared/ui`, porque un módulo no puede importar otro.
   Esa refactorización queda fuera de esta feature.
3. Alt de la foto de Natalia ("Retrato de Natalia Reina") y etiqueta del carril ("Integrantes del equipo (desplázate en
   horizontal)"): son textos propios, no vienen de Figma.

## init.ps1

```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
check:ds → 320 tokens · 0 ds-allow · 0 error(es)        [OK]
check:arch → 51 archivos · 9 módulos · 0 error(es)      [OK]
astro check → 0 errors, 0 warnings                       [OK]
vitest → 15 archivos, 119 tests                          [OK]
astro build                                              [OK]
VERDE: todo en orden.
```
