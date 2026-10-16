# impl MOT-SLIDERS-SHOWCASE — Sliders sin pausa al hover + showcase 40% más pequeño

Primera vuelta.

## Figma

`get_design_context` de 33:118 devolvió el límite de llamadas del plan Starter de Figma MCP. La feature
se aparta de Figma a propósito: cards ×0.6 y título a 46px, en lugar de 60px. Por eso se partió de las
medidas de Figma ya trazadas en `tokens.css` (33:98, 33:99, 33:118) y se escalaron. No hizo falta ningún asset nuevo.

## Archivos

- `src/shared/lib/motion/autoplay.ts`: se eliminan la opción `hover` y el motivo `'hover'` de `bindAutoplay`/`PauseReason`. La pausa por foco solo se activa con foco de teclado (`isKeyboardFocus`, que comprueba `:focus-visible`).
- `src/shared/lib/background-video.ts`: ya no pasa `hover: false` y se ajusta el comentario.
- `src/shared/ui/ShowcaseCarousel.astro`: `sizes` `(min-width: 1440px) 370px, calc(18.9296vw + 97.0141px)`, `widths` `[168, 252, 370, 555, 740]` y respaldo de 740 (2× la card). Comentarios sin hover.
- `src/shared/ui/TeamSlider.astro`: solo comentarios; ya no menciona el hover.
- `src/layout/FooterWheel.svelte`: solo comentarios. El botón de pausa (WCAG 2.2.2) no cambia.
- `src/modules/logo-marquee/Section.astro`: se quita `motion-safe:group-hover:play-paused` y se mantiene la pausa por `group-focus-within`.
- `src/modules/testimonials/Section.astro`: igual que en logos, para el masonry.
- `src/modules/showcase/Section.astro`: se quita `2xl:min-h-844` del panel y se actualiza el comentario de medidas.
- `src/modules/stats/Section.astro`: `data-stats-section`, más `revealAll(section)` y `countUpAll(section)` acotados a la sección (menor V5 de verify_MOT-STATS).
- `src/modules/process/Section.astro`: `data-process-section` y `revealAll(section)` acotado.
- `src/styles/tokens.css`: `--text-display` y `--showcase-card-w`, más la anotación de `--showcase-card-aspect`.
- `src/styles/global.css`: solo el comentario de `play-paused`.
- `docs/components.md` y `docs/conventions.md`: el hover deja de pausar, la pausa por foco solo cuenta con teclado y se anotan las nuevas medidas del showcase.
- `docs/design-system.md`: regenerado con `pnpm docs:ds`.
- `tests/motion.test.ts`: el autoplay ya no usa `'hover'`. Nuevo test de que `pointerenter`, `pointerover` y `mouseenter` no pausan. Nuevo test de que el foco sin `:focus-visible` no pausa y el de teclado sí.
- `tests/showcase.test.ts`: nuevo bloque que evalúa los clamps a 375/900/1440 (card ×0.6, proporción, título 46 y 24.53), además de `sizes`/`widths` y el panel sin `min-h-844`.
- `tests/design-tokens.test.ts`: `--text-display` termina en 46px y el regex admite un mínimo decimal.
- `tests/logo-marquee.test.ts` y `tests/testimonials.test.ts`: ahora exigen que no exista `hover:play-paused`.
- `tests/slider.test.ts`: solo los títulos.
- `tests/stats.test.ts` y `tests/process.test.ts`: script acotado a `[data-*-section]` y sin `revealAll()` ni `countUpAll()` globales.
- `progress/current.md`: plan.

## Tokens

- `--text-display: clamp(24.5333px, 16.9746px + 2.01565vw, 46px)`. Base `@figma 33:118` (60px) y `@derived` de la acceptance (46px en desktop). En mobile se aplica la misma proporción: 32 × 46/60 = 24.5333px a 375, con clamp lineal entre 375 y 1440.
- `--showcase-card-w: clamp(168px, 97.0141px + 18.9296vw, 369.6px)`. Base `@figma 33:99` (616) y `@derived` de la acceptance: es el clamp anterior (280 → 616) multiplicado por 0.6 en todos sus términos, así que mide exactamente ×0.6 en cualquier ancho.
- `--showcase-card-aspect: 616 / 658` se mantiene, de modo que el alto también queda ×0.6 (394.8 en 1440).
- No hay tokens nuevos. `--spacing-616`, `--spacing-658` y `--spacing-844` siguen en la escala aunque ya no tengan uso; check:ds solo avisa.

## Responsive y decisiones

- **Card**: el ×0.6 se aplica a todo el clamp, así que se cumple en todos los breakpoints. En 375 mide 168 de ancho, cabe una card y media y asoma la siguiente. El gap de 20 y los insets no cambian, porque la acceptance habla de las cards.
- **Panel**: con `min-h-844` (alto de Figma, calculado para la card de 658) quedarían unos 265px de panel vacío bajo las cards y estas ya no colgarían 52px. Se quita el mínimo: el panel se ajusta al contenido y conserva el `-mb-(--showcase-overhang)`.
- **Velocidad**: `--duration-showcase-slide` (12s por card) no cambia. Como cada paso es más corto (389.6 en lugar de 636 en 1440), el desplazamiento visual es más lento: unos 32px/s frente a unos 53. Si el cliente quiere la velocidad anterior en px/s, el valor sería unos 7.35s. No lo cambié porque no está en la acceptance.
- **Foco**: sin la pausa por hover, el foco que deja un clic o arrastre con ratón en una región `tabindex=0` paraba el slider hasta hacer clic fuera, que de cara al usuario se ve igual que "se detiene". Ahora solo pausa el foco `:focus-visible` (teclado). En los CSS (logos, masonry) se mantiene `group-focus-within`. No contienen controles: un clic en la franja de logos o en el masonry sí la pausa mientras conserva el foco. Lo dejé así por ser comportamiento previo y no hover.
- **WCAG 2.2.2**: el botón de pausa de FooterWheel sigue funcionando, pero solo es visible con foco de teclado. Showcase y Team no tienen botón (decisión previa del cliente). Con ratón ya no hay ninguna forma de pausar: el riesgo residual queda documentado en `docs/components.md`.
- **prefers-reduced-motion**: sin cambios. `bindAutoplay` pausa (sin clones, carril estático con scroll), los CSS usan `motion-safe:` y el estado final es visible.
- **Tailwind v4**: no hay CSS propio nuevo. Solo cambian tokens en `@theme`, se quitan utilidades y se toca un comentario en `global.css`.

## No verificado

- No lo probé en un navegador real. La lógica está cubierta por tests y el build genera las variantes de 168 a 740.

## init.ps1

```
check:ds → 417 tokens · 0 ds-allow · 0 error(es)      [OK]  (warn: tokens sin uso, preexistente)
check:arch → 116 archivos · 11 módulos · 0 error(es)  [OK]
astro check 0 errors                                   [OK]
vitest 27 files · 494 passed                           [OK]
astro build                                            [OK]
VERDE: todo en orden.
```
