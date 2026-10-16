// Hover por puntero sobre los clones del bucle (TEAM-CARD-LOOP).
//
// Los clones son inert (ni foco ni árbol de accesibilidad) y un nodo inert no recibe el puntero:
// ni :hover ni pointerenter. Para que se comporten como las originales con ratón, se busca el
// clon bajo el puntero por geometría y se le marca `data-clone-hover` (lo lee la variante
// card-active de global.css) y se le envían pointerenter / pointerleave sintéticos (los oyentes
// de hover de la card funcionan igual que con una original). Un clic sobre un enlace del clon se
// reenvía al enlace equivalente de su original. Nada de esto toca el foco ni la accesibilidad.

import type { Cleanup } from '@/shared/lib/motion';
import { CLONE_ATTR } from './loop';

export const CLONE_HOVER_ATTR = 'data-clone-hover';

interface Point {
  x: number;
  y: number;
}

function contains(rect: DOMRect, { x, y }: Point): boolean {
  return x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;
}

export interface CloneHoverOptions {
  /** Contenedor de las diapositivas (originales seguidas de sus clones). */
  track: HTMLElement;
  /** Diapositivas originales, en orden: el clon i corresponde a originals[i % n]. */
  originals: readonly HTMLElement[];
  /** El clon bajo el puntero cambia (null al salir de todos). */
  onChange?(clone: HTMLElement | null): void;
}

export function bindCloneHover(scroller: HTMLElement, { track, originals, onChange }: CloneHoverOptions): Cleanup {
  let point: Point | null = null;
  let current: HTMLElement | null = null;
  let frame = 0;

  const clones = () => track.querySelectorAll<HTMLElement>(`:scope > [${CLONE_ATTR}]`);
  const cloneAt = (p: Point) => [...clones()].find((c) => contains(c.getBoundingClientRect(), p)) ?? null;

  const set = (next: HTMLElement | null) => {
    if (next === current) return;
    if (current) {
      current.removeAttribute(CLONE_HOVER_ATTR);
      current.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
    }
    current = next;
    if (current) {
      current.setAttribute(CLONE_HOVER_ATTR, '');
      current.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    }
    onChange?.(current);
  };

  const update = () => {
    frame = 0;
    set(point ? cloneAt(point) : null);
  };
  const schedule = () => {
    frame ||= requestAnimationFrame(update);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    point = { x: e.clientX, y: e.clientY };
    schedule();
  };
  const onLeave = () => {
    point = null;
    cancelAnimationFrame(frame);
    frame = 0;
    set(null);
  };
  // El carril se mueve bajo un puntero quieto (autoplay, rueda): la card bajo él cambia.
  const onScroll = () => {
    if (point) schedule();
  };
  const onClick = (e: MouseEvent) => {
    if (!current || e.defaultPrevented) return;
    const p = { x: e.clientX, y: e.clientY };
    const links = [...current.querySelectorAll<HTMLAnchorElement>('a[href]')];
    const index = links.findIndex((a) => contains(a.getBoundingClientRect(), p));
    if (index < 0) return;
    const position = [...track.children].indexOf(current);
    const original = originals[position % originals.length];
    const target = original?.querySelectorAll<HTMLAnchorElement>('a[href]')[index];
    if (!target) return;
    e.preventDefault();
    target.click();
  };

  scroller.addEventListener('pointermove', onMove);
  scroller.addEventListener('pointerleave', onLeave);
  scroller.addEventListener('scroll', onScroll, { passive: true });
  scroller.addEventListener('click', onClick);

  return () => {
    scroller.removeEventListener('pointermove', onMove);
    scroller.removeEventListener('pointerleave', onLeave);
    scroller.removeEventListener('scroll', onScroll);
    scroller.removeEventListener('click', onClick);
    cancelAnimationFrame(frame);
    set(null);
  };
}
