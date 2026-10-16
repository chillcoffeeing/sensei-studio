// Escalonado: cada elemento lleva --motion-index (0, 1, 2…) y el CSS calcula el retraso
// (índice × --duration-stagger o --duration-stagger-tight). Así el ritmo vive en tokens.css.

/** Nombre de la propiedad que leen las utilidades reveal-* y enter-from-*. */
export const MOTION_INDEX = '--motion-index';

/** Retraso del elemento `index` (ms) para secuencias en JS: start + index × step. */
export function staggerDelay(index: number, stepMs: number, startMs = 0): number {
  return startMs + Math.max(0, index) * stepMs;
}

/** Valor de `style` para fijar el índice desde el marcado: style={staggerStyle(i)}. */
export function staggerStyle(index: number): string {
  return `${MOTION_INDEX}: ${Math.max(0, Math.trunc(index))}`;
}

interface Styled {
  style: Pick<CSSStyleDeclaration, 'setProperty'>;
}

/** Numera en orden los elementos dados (desde `from`). Devuelve cuántos numeró. */
export function assignStaggerIndexes(items: Iterable<Styled>, from = 0): number {
  let i = from;
  for (const item of items) item.style.setProperty(MOTION_INDEX, String(i++));
  return i - from;
}
