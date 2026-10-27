/**
 * API pública de motion (sin dominio). Única puerta al paquete "motion" (`motion/mini`, WAAPI):
 * check:arch prohíbe importarlo fuera de src/shared/lib/motion/, y `framer-motion`,
 * `motion/react` y `react` están prohibidos en src/.
 *
 * Las primitivas son attachments de Svelte 5, `(node) => cleanup`: en una isla
 * `{@attach reveal({ items: 'li' })}`; en un `.astro` sin isla, un `<script>` con `revealAll(section)`
 * acotado a la sección (nunca sobre todo el documento). La lógica solo escribe atributos
 * (`data-inview`, `data-open`, `data-side`) y `--motion-index`; el aspecto lo deciden las utilidades
 * de global.css (`reveal-up`, `collapsible`, `enter-from-*`). Sin estilos inline salvo los de Motion.
 *
 * Reglas:
 * 1. Solo `transform` y `opacity` (y `filter` en imágenes). Excepción: `collapsible` anima
 *    `grid-template-rows`. Sin CLS: el typewriter reserva el sitio con el texto completo transparente.
 * 2. `prefers-reduced-motion: reduce` = estado final visible: `reveal()` marca `data-inview` al
 *    instante, `typewriter` no toca el DOM, `animateTo()` dura 0, `loop()` devuelve null,
 *    `sequence()` salta al final y `bindAutoplay()` pausa.
 * 3. El estado oculto inicial solo existe con `@media (scripting: enabled)`: sin JS, todo visible.
 * 4. Las entradas al viewport ocurren una sola vez (no se vuelven a ocultar al salir).
 * 5. Lo que se mueve solo se puede pausar (WCAG 2.2.2): `createAutoplay()` combina motivos (foco de
 *    teclado, pestaña oculta, fuera de viewport, reduced motion, gestos y el botón del usuario, que
 *    no se reanuda al perder el foco). El hover no pausa ningún bucle.
 * 6. Tiempos y curvas desde tokens: en CSS `var(--duration-*)` / `--ease-*`; en JS `durationMs()` /
 *    `ease()`. Un tiempo propio de una sección se declara como token.
 *
 * Reveal declarativo (lo lee `revealAll(root)` en cada `[data-reveal]`):
 * - `data-reveal="<selector>"`: items que entran escalonados (+`--duration-stagger` cada uno), con
 *   la utilidad `reveal-up`. El índice también se fija en el marcado con `staggerStyle(i)`.
 * - `data-reveal-amount="0.3"`: fracción visible para disparar (0–1, por defecto 0.2).
 * - `data-reveal-margin="0px 0px -20% 0px"`: rootMargin. Para disparar más tarde se prefiere un
 *   margen inferior negativo: con `amount` alto, una lista más alta que el viewport no dispararía.
 * - `reveal-delay-<nombre>` en el contenedor (token `--delay-reveal-<nombre>`): retardo inicial que
 *   se suma al escalonado.
 * - `head-parts:reveal-up` en el contenedor + `[data-head-part]` en el selector: anima las partes
 *   de `SectionHeader` en orden de documento sin props nuevas.
 * No anidar `reveal-*`: transform y opacidad se componen.
 */

export type { Attachment, Cleanup } from './types';
export { prefersReducedMotion, onReducedMotionChange } from './reduced-motion';
export { DURATION_TOKENS, EASE_TOKENS, durationMs, ease, parseDuration, parseCubicBezier } from './tokens';
export type { DurationName, EaseName, CubicBezier } from './tokens';
export { MOTION_INDEX, staggerDelay, staggerStyle, assignStaggerIndexes } from './stagger';
export { INVIEW_ATTR, DEFAULT_REVEAL_AMOUNT, reveal, revealAll, parseRevealAmount, revealOptionsFromDataset } from './reveal';
export type { RevealOptions, RevealMargin } from './reveal';
export { OPEN_ATTR, setOpen, entrySide, markEntrySides } from './expand';
export type { Side } from './expand';
export { splitGraphemes, typedCount, createTypewriter, typewriter } from './typewriter';
export type { TypewriterOptions, TypewriterControls } from './typewriter';
export { createAutoplay, bindAutoplay } from './autoplay';
export type { PauseReason, Playable, AutoplayController, BindAutoplayOptions } from './autoplay';
export { cubicBezier } from './easing';
export { parseCount, formatCount, countAt, countUp, countUpAll } from './count-up';
export type { CountParts, CountUpOptions } from './count-up';
export { animateTo, loop, sequence } from './animate';
export type { AnimateToOptions, LoopOptions, Keyframes, Controls, Target, Sequence, SequenceControls } from './animate';
