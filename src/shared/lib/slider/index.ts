// API pública de las primitivas de slider (sin dominio). Las usan ShowcaseCarousel, TeamSlider y StepperSlider
// de shared/ui; cada slider es su propio componente y solo comparte estas piezas
// (docs/conventions.md › Librería de componentes, regla 3).

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
