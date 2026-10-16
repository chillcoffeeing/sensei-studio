# Verify MOT-SLIDERS-SHOWCASE — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V5/copy] `src/content/ui-catalog.ts:97-98`: el catálogo de `/componentes` sigue diciendo que ShowcaseCarousel y TeamSlider tienen "pausa con hover/foco". Ya no es cierto. Texto esperado: "pausa con foco de teclado, swipe" o similar.
- [V5/doc] `src/modules/showcase/schema.ts:14`: el JSDoc dice "se detiene con hover, foco y swipe". Hay que quitar "hover" y decir que solo pausa el foco de teclado.
- [V7] `src/modules/stats/Section.astro:61-63` y `src/modules/process/Section.astro:77`: limitar `revealAll`/`countUpAll` a su sección queda fuera de la acceptance. Es el menor V5 de verify_MOT-STATS, está anotado en el plan (`progress/current.md`), es pequeño y tiene tests. No bloquea.
- [V3] El panel de showcase deja de tener `2xl:min-h-844` (Figma 844). Es coherente con las cards ×0.6, pero el alto del panel en 1440 ahora se aparta del nodo 35:130. Se aceptó a propósito en el informe del implementer. Conviene confirmarlo con el cliente.
- [Motion] `--duration-showcase-slide` sigue en 12s por card. Como cada paso es más corto, la velocidad visual baja de unos 53px/s a unos 32px/s. Está documentado en el informe del implementer (unos 7.35s si se quiere mantener la velocidad en px/s). Queda a criterio del cliente.

## Verificado sin hallazgos
- **V1**: `./init.ps1` → "VERDE: todo en orden" (check:ds, check:arch, astro check, vitest y build en OK). Lo ejecutó el verifier.
- **V2**: `get_design_context` de 33:98 y 33:118 devuelve el límite de llamadas del plan Starter de Figma MCP, así que no hubo comparación en vivo. Comparé contra las anotaciones `@figma` de `tokens.css`:
  - `--text-display`: `clamp(24.5333px, 16.9746px + 2.01565vw, 46px)`. Comprobado: 375 → 24.53, 1440 → 46.00. Es 60 × 46/60 en desktop y 32 × 46/60 en mobile. Solo se usa en el h2 de showcase (`src/modules/showcase/Section.astro:30`). Weight 600 y leading 1 no cambian.
  - `--showcase-card-w`: `clamp(168px, 97.0141px + 18.9296vw, 369.6px)`. Es exactamente el clamp anterior (280 → 616) × 0.6. Comprobado: 375 → 168.0, 1440 → 369.6.
  - El alto sale de `aspect-(--showcase-card-aspect)` 616/658, que no cambia, así que el alto también es ×0.6 (394.8 en 1440) y se mantiene la proporción. Radio 5 (`rounded-media`) y gap 20 sin cambios.
  - `sizes`/`widths`/fallback de `Picture` van acordes con el nuevo ancho (370 a 1x, 740 a 2x).
- **Acceptance 1 (hover)**:
  - `bindAutoplay` ya no escucha `pointerenter`/`mouseenter`, y el motivo `'hover'` desaparece de `PauseReason`.
  - Logos y masonry pierden `group-hover:play-paused` y conservan `group-focus-within`.
  - En `src/` no queda ningún `hover:play-paused` ni listener de puntero que pause sliders. `team/hover.ts` solo controla el detalle de la card, no el autoplay.
  - FooterWheel conserva el botón de pausa `toggleUser` (WCAG 2.2.2).
  - Mejora razonable: el foco solo pausa con `:focus-visible`, y hay tests de las dos ramas.
- **Acceptance 4 (reduced motion)**: el motivo `reduced-motion` de `bindAutoplay` se mantiene y los CSS siguen con `motion-safe:`.
- **Acceptance 5 (Tailwind v4)**: no hay CSS propio nuevo. Solo cambian tokens en `@theme` y se quitan utilidades.
- **V3**: revisión estática, sin navegador headless. En 375 la card mide 168 × 179.5 dentro de un carril `overflow-x-auto`, sin scroll horizontal de página. El título baja a 24.5px con padding de gutter. La verificación visual en navegador queda pendiente.
- **V4**: no hay assets nuevos. Las imágenes del carrusel siguen recortadas al aspecto 616/658 con `fit="cover"`.
- **V5**: en los archivos tocados no hay clases arbitrarias `[0-9#]`, hex, `client:load`, `any`, `ds-allow` ni imports entre módulos.
- **V6**: el h2 de sección, `aria-labelledby`, la región con `tabindex=0`, `aria-roledescription` y el foco visible siguen sin cambios.
