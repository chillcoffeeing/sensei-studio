/**
 * API pública de las primitivas de slider (sin dominio). Las usan ShowcaseCarousel, TeamSlider y
 * StepperSlider de shared/ui: un componente por slider, sin un `Slider` genérico con props de
 * configuración; cada uno decide su ritmo con sus tokens y su `<script>`.
 *
 * - Swipe (`bindSwipe`): dedo y arrastre con ratón/lápiz (pointer events). Marca `data-drag`
 *   (el carril lleva `touch-pan-y touch-pinch-zoom`: el scroll vertical sigue siendo del navegador)
 *   y `data-dragging` mientras arrastra. Al soltar encaja con `swipeTarget`: menos de
 *   `SWIPE_THRESHOLD` vuelve a la card de partida; más, pasa a la siguiente aunque no llegue a la mitad.
 * - Bucle infinito: `appendLoopClones` añade al primer play copias de la serie al final del carril
 *   (`aria-hidden` + `inert` + `data-slider-clone`). Continuo con `advanceLoop` (rAF sobre
 *   `scrollLeft`) o por pasos con `nextStep` + `tweenScroll` (duración y curva de token).
 * - Pausa: `createAutoplay()` + `bindAutoplay()` de shared/lib/motion (foco de teclado
 *   `:focus-visible`, pestaña oculta, fuera de viewport, reduced motion) y el motivo `interaction`
 *   de `createInteractionPause`, que reanuda `--delay-slider-resume` después de soltar.
 *   El hover no pausa. En reduced motion no hay autoplay; swipe y scroll manual siguen.
 * - `bindCloneHover`: las copias son inertes; reenvía el hover y el clic de perfil a la card original.
 * - Tiempos: `SLIDER_TIMING` / `readTimingMs` (respaldos comprobados contra tokens.css).
 *
 * Sin JS el carril es un `overflow-x` con scroll-snap nativo.
 */

export { DRAG_THRESHOLD, SWIPE_THRESHOLD, dragScrollLeft, isDrag, isHorizontal, nearestIndex, nearestSnap, swipeTarget } from './gesture';
export { CLONE_ATTR, MAX_FRAME_MS, advanceLoop, appendLoopClones, cloneCount, loopSpeed, nextStep, strideOf, wrapPosition } from './loop';
export type { Step } from './loop';
export { CLONE_HOVER_ATTR, bindCloneHover } from './clone-hover';
export type { CloneHoverOptions } from './clone-hover';
export { DRAG_ATTR, DRAGGING_ATTR, bindSwipe, maxScroll, scrollToPosition, snapPositions } from './swipe';
export type { SwipeOptions } from './swipe';
export { createInteractionPause } from './interaction';
export type { InteractionPause } from './interaction';
export { SLIDER_TIMING, readDurationMs, readTimingMs } from './timing';
export type { TimingToken } from './timing';
export { cubicBezier, tweenAt, tweenScroll } from './tween';
export { slideLabel } from './labels';
