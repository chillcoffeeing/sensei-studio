/**
 * Índice del siguiente elemento enfocable al pulsar Tab dentro de una trampa de foco.
 * Devuelve `null` si el navegador puede seguir con su orden natural (no hay que envolver).
 * `current = -1` significa que el foco está fuera de la trampa: se lleva al primero (o al último con Shift).
 */
export function wrapFocusIndex(current: number, total: number, backwards: boolean): number | null {
  if (total <= 0) return null;
  if (current < 0) return backwards ? total - 1 : 0;
  if (backwards && current === 0) return total - 1;
  if (!backwards && current === total - 1) return 0;
  return null;
}

/** Selector de elementos enfocables del panel del menú. */
export const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
