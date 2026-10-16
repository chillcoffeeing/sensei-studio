// Bucle infinito de un slider desplazando scrollLeft (no transform): así convive con el scroll
// nativo, el swipe y el teclado; al pausar, el usuario sigue exactamente donde lo dejó el bucle.
// Se añaden copias (clones) de la serie al final; al llegar al primer clon se resta una vuelta y,
// como los clones son idénticos, el salto no se ve.

/**
 * Tope del tiempo de un fotograma: tras un parón (pestaña en segundo plano, hilo ocupado) el
 * bucle continuo no da un salto de golpe, solo avanza como mucho este tiempo.
 */
export const MAX_FRAME_MS = 100;

/** Atributo que marca los clones del bucle (aria-hidden e inert). */
export const CLONE_ATTR = 'data-slider-clone';

/** Posición dentro de la primera vuelta [0, loopWidth). Sin vuelta medida, la deja igual. */
export function wrapPosition(position: number, loopWidth: number): number {
  if (!(loopWidth > 0)) return position;
  return ((position % loopWidth) + loopWidth) % loopWidth;
}

/** Velocidad del bucle continuo en px/ms: el paso de una card (ancho + gap) cada `msPerSlide`. */
export function loopSpeed(stridePx: number, msPerSlide: number): number {
  return stridePx > 0 && msPerSlide > 0 ? stridePx / msPerSlide : 0;
}

/**
 * Siguiente posición del bucle continuo. `loopWidth` es la distancia de la primera card a su
 * primer clon. También normaliza una posición que el usuario dejó dentro de los clones.
 */
export function advanceLoop(position: number, elapsedMs: number, speed: number, loopWidth: number): number {
  if (!(loopWidth > 0)) return position;
  const dt = Math.min(Math.max(elapsedMs, 0), MAX_FRAME_MS);
  return wrapPosition(position + dt * Math.max(speed, 0), loopWidth);
}

export interface Step {
  /** Posición de partida, ya dentro de la primera vuelta (se fija sin animación: es idéntica). */
  from: number;
  /** Destino del desplazamiento animado: la card siguiente. */
  to: number;
  /** Posición equivalente a `to` dentro de la primera vuelta (se fija al terminar). */
  end: number;
}

/**
 * Paso del bucle por pasos: de la card más cercana a la posición actual a la siguiente. Al
 * llegar al primer clon (`to === loopWidth`) se vuelve a la card 0 sin que se note.
 */
export function nextStep(position: number, stride: number, loopWidth: number): Step {
  if (!(loopWidth > 0) || !(stride > 0)) return { from: position, to: position, end: position };
  const from = wrapPosition(position, loopWidth);
  const to = (Math.round(from / stride) + 1) * stride;
  return { from, to, end: wrapPosition(to, loopWidth) };
}

/**
 * Copias de la serie necesarias para que el bucle nunca muestre hueco: hay que poder desplazar
 * una vuelta entera más el ancho visible.
 */
export function cloneCount(setWidth: number, viewportWidth: number): number {
  if (!(setWidth > 0)) return 0;
  return Math.max(1, Math.ceil(viewportWidth / setWidth));
}

/** Distancia entre dos cards consecutivas (ancho + gap). */
export function strideOf(slides: readonly HTMLElement[]): number {
  return slides.length > 1 ? slides[1]!.offsetLeft - slides[0]!.offsetLeft : 0;
}

/**
 * Añade los clones de `originals` al final de `track` (fuera del árbol de accesibilidad y del
 * foco: aria-hidden + inert) y devuelve el primero, o null si no hace falta ninguno.
 */
export function appendLoopClones(track: HTMLElement, originals: readonly HTMLElement[], viewportWidth: number): HTMLElement | null {
  const copies = cloneCount(strideOf(originals) * originals.length, viewportWidth);
  let first: HTMLElement | null = null;
  for (let copy = 0; copy < copies; copy++) {
    for (const slide of originals) {
      const clone = slide.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute(CLONE_ATTR, '');
      clone.removeAttribute('id');
      clone.inert = true;
      track.append(clone);
      first ??= clone;
    }
  }
  return first;
}
