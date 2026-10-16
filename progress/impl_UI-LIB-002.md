# impl UI-LIB-002: Librería, sliders (un componente por slider) + swipe táctil

Figma MCP: no disponible en esta sesión (requiere autorización). La feature no cambia ninguna
medida: los sliders reutilizan los tokens ya verificados de SEC-SHOWCASE (33:98) y SEC-TEAM
(40:388). Solo se agregan tokens de tiempo `@derived`.

## Pedido del cliente → decisión

| Pedido | Implementación |
|---|---|
| Showcase: autoplay, sin botón pause/resume, se detiene con hover | `ShowcaseCarousel`: bucle continuo como antes; se quitó el botón. Pausa con hover, foco, pestaña oculta, fuera de viewport, swipe y reduced-motion |
| Equipo: autoplay por pasos | `TeamSlider`: espera `--duration-team-step-interval` (4s), desplaza UNA card en `--duration-team-step` (900ms, `ease-standard`), en bucle con clones |
| Mobile: todos los sliders se deslizan con el dedo | `bindSwipe` (pointer events) + `touch-action: pan-y pinch-zoom` en los dos; al soltar, encaje (`swipeTarget`) |
| Quitar `ButtonPauseGlass` si queda sin uso | **Se conserva**: la rueda del footer necesita su botón de pausa (WCAG 2.2.2) y tenía el mismo marcado duplicado. `FooterWheel.svelte` ahora consume `ButtonPauseGlass`, así que tiene uso real. El showcase ya no lo usa y se actualizó su ficha en docs |

## Archivos

Creados:
- `src/shared/lib/slider/gesture.ts`: lógica pura del gesto (umbrales, card más cercana, `swipeTarget`).
- `src/shared/lib/slider/loop.ts`: bucle continuo (`advanceLoop`) y por pasos (`nextStep`), clones (`appendLoopClones`).
- `src/shared/lib/slider/tween.ts`: `cubicBezier` + `tweenScroll` (duración y curva de token).
- `src/shared/lib/slider/swipe.ts`: `bindSwipe` (pointer events, data-drag/data-dragging, encaje, evita el clic tras arrastrar).
- `src/shared/lib/slider/interaction.ts`: `createInteractionPause` (pausa 'interaction' y reanudación diferida).
- `src/shared/lib/slider/timing.ts`: `SLIDER_TIMING` (tokens + respaldos), `readTimingMs`.
- `src/shared/lib/slider/labels.ts`: `slideLabel` ("{index} de {total}").
- `src/shared/lib/slider/index.ts`: API pública.
- `src/shared/ui/ShowcaseCarousel.astro`: carrusel continuo del showcase (props `labels`, `slides`).
- `src/shared/ui/TeamSlider.astro`: slider por pasos del equipo (prop `labels` + slot de cards).
- `tests/slider.test.ts`: primitivas (paso/bucle, umbral de swipe, motivos de pausa, tiempos vs tokens) y contrato de los dos sliders.

Modificados:
- `src/modules/showcase/Section.astro`: h2 encima + `ShowcaseCarousel`; sin isla ni botón.
- `src/modules/showcase/schema.ts`: `carouselLabel` + `pauseLabel` → `carousel: UiSliderLabels`.
- `src/modules/team/Section.astro`: carril → `TeamSlider`; cards `<div role="group">` con "n de total"; imágenes `draggable="false"`.
- `src/modules/team/schema.ts`: `membersLabel` → `slider: UiSliderLabels`.
- `src/content/pages/home.ts`: textos accesibles de los dos sliders (sin mención al botón de pausa).
- `src/shared/ui/types.ts`: `UiSliderLabels`.
- `src/shared/lib/motion/tokens.ts`: `EASE_TOKENS.standard` (`--ease-standard`) para el paso del equipo.
- `src/layout/FooterWheel.svelte`: consume `ButtonPauseGlass` (mismo aspecto y comportamiento: solo visible con foco).
- `src/content/ui-catalog.ts`: grupo "Sliders"; la muestra de `ButtonPauseGlass` usa los textos e iconos de la rueda.
- `src/pages/componentes.astro`: renderiza `ShowcaseCarousel` y `TeamSlider`.
- `src/styles/tokens.css`: tokens de abajo.
- `tests/showcase.test.ts`, `tests/team.test.ts`: contratos nuevos (la lógica movida se prueba en `slider.test.ts`).
- `docs/components.md`: sección *Sliders* (primitivas, a11y, decisión WCAG, fichas), `ButtonPauseGlass` y tabla "Fuera de la librería" al día.
- `docs/conventions.md` (tabla de Motion), `docs/architecture.md` (`shared/lib/slider/`), `docs/design-system.md` (`pnpm docs:ds`).

Borrados:
- `src/modules/showcase/ShowcaseScroller.svelte`, `autoplay.ts` y `drag.ts`: su lógica pasó a `shared/lib/slider`.
- `src/assets/showcase/pause.svg` y `play.svg`: quedaron sin uso (la rueda usa `src/assets/footer/wheel-pause.svg` / `wheel-play.svg`).

## Tokens

- `--duration-team-step-interval: 4s`, `@derived`: pausa entre pasos de TeamSlider.
- `--duration-team-step: 900ms`, `@derived`: desplazamiento de una card (con `--ease-standard`).
- `--delay-slider-resume: 3s`, `@derived`: es el antiguo `--delay-showcase-resume`, renombrado porque ahora lo usan los dos sliders.
- `--duration-showcase-slide: 12s`: sin cambios (solo se actualizó su `@usage`).

## Comportamiento y responsive

- **Sin JS**: los dos carriles son `overflow-x` con scroll-snap nativo (con el dedo, la rueda o el teclado).
- **Con JS**: `data-drag` activa `touch-pan-y touch-pinch-zoom` y el cursor de arrastre. El gesto horizontal lo maneja `bindSwipe` y el vertical sigue siendo scroll de página: si domina el eje vertical, el slider suelta el gesto. Al soltar, si se recorrieron 40px o más (`SWIPE_THRESHOLD`), pasa a la card siguiente o anterior; si no, encaja en la más cercana.
- **Pausa** (todos los motivos se suman en `createAutoplay`): hover con ratón o lápiz, foco dentro (región y cards enfocables), pestaña oculta, fuera de viewport, reduced-motion (sin autoplay ni clones; el swipe sigue y el encaje es instantáneo) e `interaction`, que dura mientras se toca y se reanuda 3s después de soltar.
- **TeamSlider**: si se pausa a mitad de un paso, cancela el tween y encaja en la card más cercana. Mientras reproduce no hay snap (`data-playing:snap-none`) para que el tween no pelee con el encaje.
- **Accesibilidad (APG)**: la región tiene `aria-roledescription="carrusel"` y `aria-label`. Cada diapositiva es `role="group"` con `aria-roledescription="diapositiva"` y "n de total". Las pistas pasan de `<ul>/<li>` a `<div>`, porque un `li` con `role="group"` rompe la semántica de lista. Los clones llevan `aria-hidden` + `inert`. Los textos están en `src/content/`.
- **Showcase sin botón (WCAG 2.2.2)**: es un pedido explícito del cliente. La mitigación es la pausa por hover, foco de teclado, toque o swipe, pestaña oculta y fuera de viewport, y no hay autoplay con reduced-motion. Riesgo residual: en táctil no hay pausa permanente; la vía es "reducir movimiento". Está documentado en `docs/components.md` › Sliders.
- **Cambio visual menor en mobile**: la fila del h2 del showcase ya no reserva los 44px del botón. En 2xl no cambia nada (el h2 mide 60 > 44). En mobile el carrusel queda hasta 12px más cerca del título, que es lo que pide Figma (el diseño no tiene botón).
- **Por qué `.astro` + `<script>` y no isla Svelte**: las diapositivas son `<Picture>` de `astro:assets`, que una isla no puede renderizar. Un slot dentro de un `<ul>` de la isla mete `<astro-slot>` entre `ul` y `li`. El comportamiento es DOM puro sobre primitivas, igual que `revealAll()` o el hover del equipo.
- **Tailwind v4**: no se agregó CSS a mano. Todo son utilidades (`data-*:` variants, `*:` para los hijos del slot, `touch-pan-y`, `touch-pinch-zoom`) y tokens.
- **Limitación conocida**: los clones del equipo son `inert`, así que el hover de perfil no se activa sobre un clon. Solo aparecen a la derecha durante el bucle, y el hover sobre la región pausa igual. Las cards originales mantienen el hover y el typewriter de MOT-TEAM.

## Verificación

- `pnpm vitest run`: 26 archivos, 418 tests en verde.
- `./init.ps1`: **VERDE** (toolchain, dependencias, estado con 1 feature in_progress, sistema de diseño, arquitectura, `astro check`, vitest y build OK).
- En el CSS generado están `data-drag:touch-pan-y`, `data-drag:touch-pinch-zoom`, `data-dragging:snap-none`, `data-playing:snap-none`, `*:shrink-0` y `*:snap-start`.
- No se pudo probar en navegador: el sandbox bloquea las conexiones a `astro preview` (se arrancó y se detuvo con `astro preview stop`, por su PID; no se mató ningún proceso por nombre). Al verifier le toca probar a 375, 768 y 1440: el swipe con el dedo (emulación táctil), que no bloquee el scroll vertical, las pausas por hover y foco, y el paso de 4s/900ms del equipo.
