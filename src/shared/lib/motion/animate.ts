// Animaciones imperativas con Motion (motion.dev, API vanilla). Se usa el `animate` de
// "motion/mini" (WAAPI, ~2,5 kB): suficiente para transform/opacity/filter, corre fuera
// del hilo principal y no arrastra el motor de springs ni el runtime de React.
// Para imágenes (blur/escala de team, cambios de estado de projects), bucles (rueda del
// footer) y secuencias orquestadas. Los estados simples (hover, reveal, expansión) son CSS.

import { animate, animateSequence } from 'motion/mini';
import { prefersReducedMotion } from './reduced-motion';
import { durationMs, ease, type DurationName, type EaseName } from './tokens';

export type Keyframes = Parameters<typeof animate>[1];
export type Controls = ReturnType<typeof animate>;
export type Target = Parameters<typeof animate>[0];
export type Sequence = Parameters<typeof animateSequence>[0];
export type SequenceControls = ReturnType<typeof animateSequence>;

export interface AnimateToOptions {
  /** Token de duración (por defecto "image"). */
  duration?: DurationName;
  /** Token de curva (por defecto "enter"). */
  ease?: EaseName;
  /** Retraso en ms (p. ej. staggerDelay(i, durationMs('stagger'))). */
  delayMs?: number;
}

/**
 * Lleva `target` al estado final de `keyframes` con duración y curva de tokens.
 * Con prefers-reduced-motion el cambio es directo (duración 0): estado final visible.
 */
export function animateTo(target: Target, keyframes: Keyframes, options: AnimateToOptions = {}): Controls {
  const reduced = prefersReducedMotion();
  return animate(target, keyframes, {
    duration: reduced ? 0 : durationMs(options.duration ?? 'image') / 1000,
    delay: reduced ? 0 : (options.delayMs ?? 0) / 1000,
    ease: [...ease(options.ease ?? 'enter')],
  });
}

export interface LoopOptions {
  /** Duración de una vuelta en ms (la define cada sección como token). */
  durationMs: number;
}

/**
 * Bucle lineal infinito (rueda, carrusel continuo). Con prefers-reduced-motion devuelve
 * null y no anima: la composición estática es el estado final. Pásalo a createAutoplay().
 */
export function loop(target: Target, keyframes: Keyframes, options: LoopOptions): Controls | null {
  if (prefersReducedMotion()) return null;
  return animate(target, keyframes, {
    duration: options.durationMs / 1000,
    ease: 'linear',
    repeat: Infinity,
  });
}

/**
 * Secuencia orquestada (p. ej. hover de projects: título al centro → fundido → detalles).
 * Con prefers-reduced-motion salta al estado final.
 */
export function sequence(definition: Sequence): SequenceControls {
  const controls = animateSequence(definition);
  if (prefersReducedMotion()) controls.complete();
  return controls;
}
