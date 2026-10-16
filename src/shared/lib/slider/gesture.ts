// Lógica pura del gesto de arrastre/swipe de los sliders (ratón, dedo y lápiz). La conexión al
// DOM está en swipe.ts; aquí solo hay números, para poder probarla sin navegador.

/** Desplazamiento mínimo (px de puntero) para considerar que hubo arrastre y no un clic/toque. */
export const DRAG_THRESHOLD = 5;

/**
 * Recorrido mínimo (px) de un swipe para pasar a la card siguiente aunque no se haya llegado a
 * la mitad: con cards de 260–616px, exigir la mitad haría que un gesto corto "no hiciera nada".
 */
export const SWIPE_THRESHOLD = 40;

/** scrollLeft mientras se arrastra: el contenido sigue al puntero (arrastrar a la izquierda avanza). */
export function dragScrollLeft(startScroll: number, startX: number, currentX: number): number {
  return startScroll - (currentX - startX);
}

/** ¿El puntero se movió lo bastante en horizontal como para tratarlo como arrastre? */
export function isDrag(startX: number, currentX: number, threshold: number = DRAG_THRESHOLD): boolean {
  return Math.abs(currentX - startX) >= threshold;
}

/**
 * ¿El gesto es horizontal? Si domina el eje vertical, es scroll de página y el slider lo suelta
 * (con `touch-action: pan-y` el navegador ya se encarga de ese desplazamiento).
 */
export function isHorizontal(dx: number, dy: number): boolean {
  return Math.abs(dx) > Math.abs(dy);
}

const clampTo = (max: number) => (value: number) => Math.min(Math.max(value, 0), Math.max(max, 0));

/**
 * Posición de encaje más cercana a `scrollLeft`. `positions` son los scrollLeft de cada card; se
 * recortan a [0, max]. Sin posiciones devuelve `scrollLeft` recortado.
 */
export function nearestSnap(positions: readonly number[], scrollLeft: number, max: number): number {
  const clamp = clampTo(max);
  if (positions.length === 0) return clamp(scrollLeft);
  let best = clamp(positions[0]!);
  for (const position of positions) {
    const candidate = clamp(position);
    if (Math.abs(candidate - scrollLeft) < Math.abs(best - scrollLeft)) best = candidate;
  }
  return best;
}

/**
 * Destino al soltar un swipe: la card más cercana; pero si el gesto superó `threshold` y aun así
 * la más cercana es la de partida, avanza (o retrocede) una card en la dirección del gesto.
 */
export function swipeTarget(
  positions: readonly number[],
  startScroll: number,
  endScroll: number,
  max: number,
  threshold: number = SWIPE_THRESHOLD,
): number {
  const nearest = nearestSnap(positions, endScroll, max);
  const delta = endScroll - startScroll;
  if (Math.abs(delta) < threshold) return nearest;
  const origin = nearestSnap(positions, startScroll, max);
  if (nearest !== origin) return nearest;
  const clamp = clampTo(max);
  const sorted = [...new Set(positions.map(clamp))].sort((a, b) => a - b);
  const next = delta > 0 ? sorted.find((p) => p > origin) : sorted.reverse().find((p) => p < origin);
  return next ?? nearest;
}

/** Índice de la posición más cercana a `scrollLeft` (0 sin posiciones): la diapositiva visible. */
export function nearestIndex(positions: readonly number[], scrollLeft: number): number {
  let best = 0;
  positions.forEach((position, index) => {
    if (Math.abs(position - scrollLeft) < Math.abs(positions[best]! - scrollLeft)) best = index;
  });
  return best;
}
