// API pública de motion (sin dominio). Única puerta al paquete "motion": check:arch
// prohíbe importarlo fuera de src/shared/lib/motion/. Patrón: docs/conventions.md § Motion.

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
