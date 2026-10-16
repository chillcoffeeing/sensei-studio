// Contador: lleva la cifra de un texto ("+250", "97%", "1 punto") de 0 a su valor la primera
// vez que el contenedor entra en viewport. El HTML del servidor trae el valor final (SEO, sin
// JS); solo con JS y sin reduced-motion se pone a 0 y cuenta. Prefijo y sufijo se conservan.
// Es texto, no una propiedad CSS: se interpola en rAF con duración y curva de tokens.

import { inView } from 'motion';
import { cubicBezier } from './easing';
import { prefersReducedMotion } from './reduced-motion';
import { revealOptionsFromDataset, DEFAULT_REVEAL_AMOUNT, type RevealMargin } from './reveal';
import { staggerDelay } from './stagger';
import { durationMs, ease } from './tokens';
import type { Attachment, Cleanup } from './types';

/** Texto de un contador separado en prefijo, cifra y sufijo. */
export interface CountParts {
  prefix: string;
  value: number;
  /** Decimales de la cifra original (se mantienen durante la cuenta). */
  decimals: number;
  /** Separador decimal original ("." o ","). */
  separator: string;
  suffix: string;
}

/** "+250" → { prefix: '+', value: 250, suffix: '' }. `null` si el texto no tiene cifra. */
export function parseCount(text: string): CountParts | null {
  const m = text.match(/^(\D*?)(\d+)(?:([.,])(\d+))?(.*)$/s);
  if (!m) return null;
  const [, prefix = '', int = '0', separator = '.', frac = '', suffix = ''] = m;
  return {
    prefix,
    value: Number(frac ? `${int}.${frac}` : int),
    decimals: frac.length,
    separator,
    suffix,
  };
}

/** Texto del contador con la cifra `n` (redondeada a los decimales del original). */
export function formatCount(parts: CountParts, n: number): string {
  const digits = Math.max(0, n).toFixed(parts.decimals).replace('.', parts.separator);
  return `${parts.prefix}${digits}${parts.suffix}`;
}

/** Valor del contador en el progreso `progress` (0–1, ya con la curva aplicada). */
export function countAt(parts: CountParts, progress: number): number {
  const p = Math.min(1, Math.max(0, progress));
  const raw = parts.value * p;
  const factor = 10 ** parts.decimals;
  return Math.round(raw * factor) / factor;
}

export interface CountUpOptions {
  /** Selector (relativo al contenedor) de los elementos con la cifra. Por defecto "[data-count]". */
  items?: string;
  /** Fracción visible del contenedor para disparar (0–1). */
  amount?: number;
  /** rootMargin del observador. */
  margin?: RevealMargin;
}

const noop: Cleanup = () => {};

/**
 * Attachment/función para un <script> de Astro: cuenta de 0 al valor final los elementos
 * `items` del contenedor, una sola vez, escalonados (--duration-stagger) cuando entra en
 * viewport. Con prefers-reduced-motion, sin IntersectionObserver o sin rAF no toca el DOM:
 * se ve el valor final del servidor.
 */
export function countUp(options: CountUpOptions = {}): Attachment {
  return (node) => {
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined' || typeof requestAnimationFrame !== 'function') {
      return noop;
    }
    const targets = [...node.querySelectorAll<HTMLElement>(options.items ?? '[data-count]')]
      .map((el) => ({ el, final: el.textContent ?? '', parts: parseCount(el.textContent ?? '') }))
      .filter((t): t is { el: HTMLElement; final: string; parts: CountParts } => t.parts !== null);
    if (targets.length === 0) return noop;

    for (const t of targets) t.el.textContent = formatCount(t.parts, 0);

    const total = durationMs('count', node);
    const step = durationMs('stagger', node);
    const curve = cubicBezier(ease('enter', node));
    let raf = 0;

    const run = () => {
      let start = 0;
      raf = requestAnimationFrame(function frame(now) {
        start ||= now;
        let running = false;
        targets.forEach((t, i) => {
          const elapsed = now - start - staggerDelay(i, step);
          const progress = elapsed <= 0 ? 0 : Math.min(elapsed / total, 1);
          if (progress < 1) running = true;
          t.el.textContent = progress >= 1 ? t.final : formatCount(t.parts, countAt(t.parts, curve(progress)));
        });
        raf = running ? requestAnimationFrame(frame) : 0;
      });
    };

    // Sin función de salida, inView deja de observar tras la primera entrada (una sola vez).
    const stopObserving = inView(node, () => run(), {
      amount: options.amount ?? DEFAULT_REVEAL_AMOUNT,
      ...(options.margin ? { margin: options.margin } : {}),
    });

    return () => {
      stopObserving();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      for (const t of targets) t.el.textContent = t.final;
    };
  };
}

/**
 * Inicializa todos los contenedores [data-count-up] de `root` (para <script> de Astro).
 * Mismos data-* que revealAll(): data-count-up="<selector>" (items), data-reveal-amount,
 * data-reveal-margin.
 */
export function countUpAll(root: ParentNode = document, selector = '[data-count-up]'): Cleanup {
  const cleanups = [...root.querySelectorAll<HTMLElement>(selector)].map((el) => {
    const { amount, margin } = revealOptionsFromDataset(el.dataset);
    const items = el.dataset.countUp?.trim();
    return countUp({ ...(items ? { items } : {}), ...(amount !== undefined ? { amount } : {}), ...(margin ? { margin } : {}) })(el);
  });
  return () => cleanups.forEach((c) => c());
}
