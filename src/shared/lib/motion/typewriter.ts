// Typewriter accesible. El texto completo queda SIEMPRE en el DOM y en el árbol de
// accesibilidad (capa "fantasma" transparente que además reserva el sitio → sin CLS);
// encima, una capa aria-hidden muestra los caracteres escritos.
//
//   <p>Texto</p>  →  <p><span class="stack-layers">
//                       <span class="text-transparent">Texto</span>   ← lectores de pantalla
//                       <span aria-hidden="true">Tex</span>           ← lo que se ve
//                     </span></p>
//
// Solo para texto plano (usa textContent). Con prefers-reduced-motion no se toca el DOM.

import { prefersReducedMotion } from './reduced-motion';
import { durationMs } from './tokens';
import type { Attachment, Cleanup } from './types';

/** Divide en caracteres visibles (grafemas: "é", emojis compuestos no se parten). */
export function splitGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)].map((s) => s.segment);
  }
  return Array.from(text);
}

/** Cuántos caracteres deben verse tras `elapsedMs` (tras `delayMs`), a `charMs` por carácter. */
export function typedCount(elapsedMs: number, total: number, charMs: number, delayMs = 0): number {
  const t = elapsedMs - delayMs;
  if (t <= 0) return 0;
  if (charMs <= 0) return total;
  return Math.min(total, Math.floor(t / charMs) + 1);
}

export interface TypewriterOptions {
  /** ms por carácter. Por defecto el token --duration-typewriter-char. */
  charMs?: number;
  /** Espera antes del primer carácter (ms), p. ej. staggerDelay(i, …). */
  delayMs?: number;
}

export interface TypewriterControls {
  /** Escribe desde el principio (o lo que falte si ya empezó). Resuelve al terminar. */
  play(): Promise<void>;
  /** Vacía lo escrito (el texto sigue en el DOM para lectores de pantalla). */
  reset(): void;
  /** Muestra todo de golpe. */
  finish(): void;
  /** Restaura el nodo tal como estaba. */
  destroy(): void;
}

const GHOST_CLASS = 'text-transparent';
const STACK_CLASS = 'stack-layers';

/** Controlador imperativo (hover: play al entrar, reset al salir). */
export function createTypewriter(node: HTMLElement, options: TypewriterOptions = {}): TypewriterControls {
  const original = node.textContent ?? '';

  if (prefersReducedMotion() || typeof requestAnimationFrame !== 'function') {
    const done = () => Promise.resolve();
    return { play: done, reset() {}, finish() {}, destroy() {} };
  }

  const chars = splitGraphemes(original);
  const charMs = options.charMs ?? durationMs('typewriterChar', node);
  const delayMs = options.delayMs ?? 0;

  const doc = node.ownerDocument;
  const stack = doc.createElement('span');
  stack.className = STACK_CLASS;
  const ghost = doc.createElement('span');
  ghost.className = GHOST_CLASS;
  ghost.textContent = original;
  const typed = doc.createElement('span');
  typed.setAttribute('aria-hidden', 'true');
  stack.append(ghost, typed);
  node.replaceChildren(stack);

  let shown = 0;
  let frame = 0;
  let resolveRun: (() => void) | null = null;

  const render = (n: number) => {
    if (n === shown) return;
    shown = n;
    typed.textContent = chars.slice(0, n).join('');
  };
  const settle = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    resolveRun?.();
    resolveRun = null;
  };

  return {
    play() {
      settle();
      if (shown >= chars.length) return Promise.resolve();
      const from = shown;
      const start = performance.now();
      return new Promise<void>((resolve) => {
        resolveRun = resolve;
        const tick = (now: number) => {
          render(from + typedCount(now - start, chars.length - from, charMs, from === 0 ? delayMs : 0));
          if (shown >= chars.length) settle();
          else frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      });
    },
    reset() {
      settle();
      render(0);
    },
    finish() {
      settle();
      render(chars.length);
    },
    destroy() {
      settle();
      node.textContent = original;
    },
  };
}

/** Attachment: escribe en cuanto se monta. `{@attach typewriter({ delayMs: 200 })}`. */
export function typewriter(options: TypewriterOptions = {}): Attachment {
  return (node): Cleanup => {
    const tw = createTypewriter(node, options);
    void tw.play();
    return () => tw.destroy();
  };
}
