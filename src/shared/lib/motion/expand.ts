// Expansión de paneles (acordeones) y entrada lateral de sus elementos.
// El alto lo anima la utilidad CSS `collapsible` (grid-template-rows 0fr → 1fr) y la
// entrada lateral `enter-from-left` / `enter-from-right`; aquí solo se ponen atributos.

import { assignStaggerIndexes } from './stagger';

export const OPEN_ATTR = 'data-open';
export type Side = 'left' | 'right';

/** Abre o cierra un panel `collapsible` (el botón sigue llevando aria-expanded). */
export function setOpen(panel: Element, open: boolean): void {
  panel.toggleAttribute(OPEN_ATTR, open);
}

interface Box {
  left: number;
  width: number;
}

/** Lado desde el que entra un elemento según dónde cae su centro dentro del contenedor. */
export function entrySide(item: Box, container: Box): Side {
  return item.left + item.width / 2 > container.left + container.width / 2 ? 'right' : 'left';
}

/**
 * Para rejillas que cambian por breakpoint: mide (todas las lecturas antes de escribir) y
 * marca cada elemento con data-side="left|right" y su --motion-index; la utilidad
 * `enter-from-side` elige el sentido según data-side. Llamar justo antes de abrir.
 * Si el lado es fijo en todos los breakpoints, basta con enter-from-left / enter-from-right.
 */
export function markEntrySides(container: HTMLElement, itemSelector: string): Side[] {
  const items = [...container.querySelectorAll<HTMLElement>(itemSelector)];
  const box = container.getBoundingClientRect();
  const sides = items.map((el) => entrySide(el.getBoundingClientRect(), box));
  items.forEach((el, i) => (el.dataset.side = sides[i]));
  assignStaggerIndexes(items);
  return sides;
}
