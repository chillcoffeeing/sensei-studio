// Reveal: marca data-inview en un contenedor la primera vez que entra en viewport
// (IntersectionObserver vía inView de Motion). La animación es CSS (utilidades
// reveal-up de global.css); aquí no se toca ningún estilo
// salvo --motion-index para el escalonado. El retardo inicial también es CSS
// (utilidad reveal-delay-* sobre tokens --delay-reveal-*), no un setTimeout.

import { inView } from 'motion';
import { prefersReducedMotion } from './reduced-motion';
import { assignStaggerIndexes } from './stagger';
import type { Attachment, Cleanup } from './types';

export const INVIEW_ATTR = 'data-inview';

/** rootMargin en el formato de Motion: de 1 a 4 valores en px o %. */
export type RevealMargin = NonNullable<NonNullable<Parameters<typeof inView>[2]>['margin']>;

export interface RevealOptions {
  /**
   * Selector (relativo al contenedor) de los elementos a escalonar: reciben
   * --motion-index en orden de documento. Omítelo si el marcado ya lo fija con staggerStyle().
   */
  items?: string;
  /** Fracción visible del contenedor para disparar (0–1). Por defecto 0.2. */
  amount?: number;
  /**
   * rootMargin del observador (p. ej. "0px 0px -20% 0px"). Un margen inferior negativo
   * retrasa el disparo hasta que el contenedor está más dentro del viewport, sin depender
   * de su alto (a diferencia de `amount`, que en listas más altas que el viewport puede no
   * alcanzarse nunca).
   */
  margin?: RevealMargin;
}

export const DEFAULT_REVEAL_AMOUNT = 0.2;

/** "0.35" → 0.35. `undefined` si falta o no es una fracción 0–1 (se usa el valor por defecto). */
export function parseRevealAmount(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= 1 ? n : undefined;
}

/** Opciones de reveal() desde los data-* de un contenedor [data-reveal]. */
export function revealOptionsFromDataset(dataset: DOMStringMap): RevealOptions {
  const options: RevealOptions = {};
  if (dataset.reveal) options.items = dataset.reveal;
  const amount = parseRevealAmount(dataset.revealAmount);
  if (amount !== undefined) options.amount = amount;
  const margin = dataset.revealMargin?.trim();
  if (margin) options.margin = margin as RevealMargin;
  return options;
}

const noop: Cleanup = () => {};

/**
 * Attachment/acción de Svelte o función para un <script> de Astro:
 *   {@attach reveal({ items: '[data-reveal-item]' })}
 *   reveal({ items: 'li' })(element)
 * Una sola vez: tras entrar no se vuelve a ocultar. Con prefers-reduced-motion o sin
 * IntersectionObserver marca data-inview al instante (el CSS ya no anima con "reduce").
 */
export function reveal(options: RevealOptions = {}): Attachment {
  return (node) => {
    if (options.items) assignStaggerIndexes(node.querySelectorAll<HTMLElement>(options.items));
    const show = () => node.setAttribute(INVIEW_ATTR, '');

    if (node.hasAttribute(INVIEW_ATTR)) return noop;
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      show();
      return noop;
    }
    // Sin función de salida, inView deja de observar el elemento tras la primera entrada.
    return inView(node, () => show(), {
      amount: options.amount ?? DEFAULT_REVEAL_AMOUNT,
      ...(options.margin ? { margin: options.margin } : {}),
    });
  };
}

/**
 * Inicializa todos los contenedores [data-reveal] de `root` (para <script> de Astro, sin isla).
 * Los data-* del contenedor son las opciones de reveal():
 *   data-reveal="<selector>"          → items
 *   data-reveal-amount="0.3"          → amount
 *   data-reveal-margin="0px 0px -20% 0px" → margin
 */
export function revealAll(root: ParentNode = document, selector = '[data-reveal]'): Cleanup {
  const cleanups = [...root.querySelectorAll<HTMLElement>(selector)].map((el) =>
    reveal(revealOptionsFromDataset(el.dataset))(el),
  );
  return () => cleanups.forEach((c) => c());
}
