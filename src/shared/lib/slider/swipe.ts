// Swipe y arrastre de un slider con pointer events (dedo, ratón y lápiz).
//
// El carril es un overflow-x con scroll-snap (sin JS se desplaza con el scroll nativo). Al
// enganchar el swipe se marca `data-drag`: el componente pone entonces `touch-action: pan-y`
// (+ pinch-zoom), así el navegador sigue haciendo el scroll vertical de la página y el gesto
// horizontal llega como pointermove. Mientras se arrastra se marca `data-dragging` (sin snap,
// sin selección) y al soltar se encaja en una card (swipeTarget).

import { prefersReducedMotion, type Cleanup } from '@/shared/lib/motion';
import { dragScrollLeft, isDrag, isHorizontal, swipeTarget } from './gesture';

export const DRAG_ATTR = 'data-drag';
export const DRAGGING_ATTR = 'data-dragging';

/** scrollLeft de cada card del carril (hijos de `track`), alineada al scroll-padding. */
export function snapPositions(scroller: HTMLElement, track: HTMLElement): number[] {
  const padding = Number.parseFloat(getComputedStyle(scroller).scrollPaddingLeft) || 0;
  return Array.from(track.children, (child) => (child as HTMLElement).offsetLeft - padding);
}

export function maxScroll(scroller: HTMLElement): number {
  return scroller.scrollWidth - scroller.clientWidth;
}

/** Lleva el carril a `left` (suave salvo con reduced motion). */
export function scrollToPosition(scroller: HTMLElement, left: number): void {
  scroller.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export interface SwipeOptions {
  /** Contenedor de las cards (sus hijos son las posiciones de encaje). */
  track: HTMLElement;
  /** El puntero se apoya en el carril (toque o botón pulsado): p. ej. pausar el autoplay. */
  onPress?(): void;
  /** El puntero se suelta o el navegador cancela el gesto. */
  onRelease?(): void;
}

export function bindSwipe(scroller: HTMLElement, { track, onPress, onRelease }: SwipeOptions): Cleanup {
  let pointerId: number | null = null;
  let startX = 0;
  let startY = 0;
  let startScroll = 0;
  let moved = false;
  let suppressClick = false;

  scroller.setAttribute(DRAG_ATTR, '');

  const onDown = (event: PointerEvent) => {
    if (pointerId !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startScroll = scroller.scrollLeft;
    moved = false;
    onPress?.();
  };

  const onMove = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) return;
    if (!moved) {
      if (!isDrag(startX, event.clientX)) return;
      if (!isHorizontal(event.clientX - startX, event.clientY - startY)) {
        // Gesto vertical: es scroll de la página, no del slider.
        finish(event, false);
        return;
      }
      moved = true;
      scroller.setAttribute(DRAGGING_ATTR, '');
      scroller.setPointerCapture(event.pointerId);
    }
    scroller.scrollLeft = dragScrollLeft(startScroll, startX, event.clientX);
  };

  function finish(event: PointerEvent, settle: boolean) {
    if (pointerId !== event.pointerId) return;
    pointerId = null;
    if (moved) {
      if (scroller.hasPointerCapture(event.pointerId)) scroller.releasePointerCapture(event.pointerId);
      // Se reactiva el snap después de fijar el destino para que no salte a otra card.
      scroller.removeAttribute(DRAGGING_ATTR);
      const positions = snapPositions(scroller, track);
      const target = settle
        ? swipeTarget(positions, startScroll, scroller.scrollLeft, maxScroll(scroller))
        : swipeTarget(positions, scroller.scrollLeft, scroller.scrollLeft, maxScroll(scroller));
      scrollToPosition(scroller, target);
      suppressClick = true;
    }
    moved = false;
    onRelease?.();
  }

  const onUp = (event: PointerEvent) => finish(event, true);
  const onCancel = (event: PointerEvent) => finish(event, false);
  // Un arrastre no es un clic: evita activar lo que haya bajo el puntero al soltar.
  const onClick = (event: MouseEvent) => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  };
  const onPointerDownReset = () => (suppressClick = false);

  scroller.addEventListener('pointerdown', onPointerDownReset, true);
  scroller.addEventListener('pointerdown', onDown);
  scroller.addEventListener('pointermove', onMove);
  scroller.addEventListener('pointerup', onUp);
  scroller.addEventListener('pointercancel', onCancel);
  scroller.addEventListener('click', onClick, true);

  return () => {
    scroller.removeEventListener('pointerdown', onPointerDownReset, true);
    scroller.removeEventListener('pointerdown', onDown);
    scroller.removeEventListener('pointermove', onMove);
    scroller.removeEventListener('pointerup', onUp);
    scroller.removeEventListener('pointercancel', onCancel);
    scroller.removeEventListener('click', onClick, true);
    scroller.removeAttribute(DRAG_ATTR);
    scroller.removeAttribute(DRAGGING_ATTR);
  };
}
