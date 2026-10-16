// Tiempos de los sliders de la librería. La fuente de verdad es tokens.css: los respaldos solo
// se usan sin DOM o si el navegador no resuelve la variable.

import { parseDuration } from '@/shared/lib/motion';

export interface TimingToken {
  token: string;
  fallbackMs: number;
}

export const SLIDER_TIMING = {
  /** ShowcaseCarousel: lo que tarda el bucle continuo en avanzar UNA card. */
  showcaseSlide: { token: '--duration-showcase-slide', fallbackMs: 7350 },
  /** TeamSlider: pausa entre dos pasos del autoplay. */
  teamInterval: { token: '--duration-team-step-interval', fallbackMs: 4000 },
  /** TeamSlider: duración del desplazamiento de un paso. */
  teamStep: { token: '--duration-team-step', fallbackMs: 900 },
  /** StepperSlider: tiempo de lectura de cada paso antes de pasar al siguiente. */
  stepperInterval: { token: '--duration-stepper-interval', fallbackMs: 6000 },
  /** StepperSlider: duración del desplazamiento entre pasos. */
  stepperStep: { token: '--duration-stepper-step', fallbackMs: 700 },
  /** Todos: espera tras un swipe antes de reanudar el autoplay. */
  resume: { token: '--delay-slider-resume', fallbackMs: 3000 },
} as const satisfies Record<string, TimingToken>;

/** Duración CSS ("12s", "3000ms") → ms; respaldo si no es válida o no es positiva. */
export function readDurationMs(value: string, fallbackMs: number): number {
  const ms = parseDuration(value);
  return ms !== null && ms > 0 ? ms : fallbackMs;
}

/** Lee un token de tiempo en el elemento (hereda de :root). */
export function readTimingMs(el: Element, { token, fallbackMs }: TimingToken): number {
  if (typeof getComputedStyle !== 'function') return fallbackMs;
  return readDurationMs(getComputedStyle(el).getPropertyValue(token), fallbackMs);
}
