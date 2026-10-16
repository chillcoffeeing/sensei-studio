// Autoplay pausable (WCAG 2.2.2): carruseles, rueda del footer, cualquier bucle.
// El controlador suma "motivos de pausa"; solo reproduce si no queda ninguno. Así foco de
// teclado, pestaña oculta, fuera de viewport, reduced motion, gestos y el botón de pausa del
// usuario conviven sin pisarse (perder el foco no reanuda si el usuario pulsó pausa).
// El hover general NO pausa (MOT-SLIDERS-SHOWCASE): los sliders siguen moviéndose bajo el puntero.
// Excepción (`pointer`): sobre una diapositiva con enlaces, para que no se escapen del cursor.

import { inView } from 'motion';
import { onReducedMotionChange, prefersReducedMotion } from './reduced-motion';
import type { Cleanup } from './types';

/**
 * Motivos de pausa. `interaction` lo usan las islas para gestos que no son hover ni foco
 * (p. ej. desplazar un carrusel con el dedo) y lo retiran ellas mismas al terminar. `layout`: en
 * este breakpoint el componente no es un slider (StepperSlider desde md). `pointer`: el puntero
 * está sobre una diapositiva con enlaces (TeamSlider con perfiles).
 */
export type PauseReason =
  | 'focus'
  | 'hidden'
  | 'offscreen'
  | 'user'
  | 'reduced-motion'
  | 'interaction'
  | 'layout'
  | 'pointer';

/** Lo que se reproduce: controles de Motion (animate/loop), o cualquier objeto con play/pause. */
export interface Playable {
  play(): void;
  pause(): void;
}

export interface AutoplayController {
  readonly playing: boolean;
  /** true si la pausa la pidió el usuario (estado del botón de pausa: aria-pressed). */
  readonly userPaused: boolean;
  has(reason: PauseReason): boolean;
  pause(reason: PauseReason): void;
  resume(reason: PauseReason): void;
  /** Botón de pausa/reproducción. Devuelve si queda reproduciendo. */
  toggleUser(): boolean;
  /** Avisa en cada cambio de playing (y una vez al suscribirse). */
  subscribe(listener: (playing: boolean) => void): Cleanup;
}

/**
 * `target` es un Playable o un callback (playing) => void para bucles propios (rAF, scroll).
 * Arranca reproduciendo salvo `initial` (p. ej. ['offscreen'] hasta que se vea).
 */
export function createAutoplay(
  target: Playable | ((playing: boolean) => void),
  initial: readonly PauseReason[] = [],
): AutoplayController {
  const reasons = new Set<PauseReason>(initial);
  const listeners = new Set<(playing: boolean) => void>();
  let last: boolean | null = null;

  const apply = () => {
    const playing = reasons.size === 0;
    if (playing === last) return;
    last = playing;
    if (typeof target === 'function') target(playing);
    else if (playing) target.play();
    else target.pause();
    listeners.forEach((l) => l(playing));
  };

  const controller: AutoplayController = {
    get playing() {
      return reasons.size === 0;
    },
    get userPaused() {
      return reasons.has('user');
    },
    has: (reason) => reasons.has(reason),
    pause(reason) {
      reasons.add(reason);
      apply();
    },
    resume(reason) {
      reasons.delete(reason);
      apply();
    },
    toggleUser() {
      if (reasons.has('user')) reasons.delete('user');
      else reasons.add('user');
      apply();
      return reasons.size === 0;
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(reasons.size === 0);
      return () => listeners.delete(listener);
    },
  };
  apply();
  return controller;
}

export interface BindAutoplayOptions {
  /** Pausa mientras hay foco de teclado dentro (:focus-visible; el foco por clic o arrastre no pausa). */
  focus?: boolean;
  /** Pausa con la pestaña oculta (document.hidden). */
  visibility?: boolean;
  /** Pausa fuera del viewport (ahorra CPU). */
  offscreen?: boolean;
  /** Pausa con prefers-reduced-motion: reduce (y sigue los cambios). */
  reducedMotion?: boolean;
}

/**
 * Foco de teclado: el destino casa con :focus-visible. Un clic o un arrastre con ratón sobre un
 * contenedor enfocable (tabindex) lo enfoca sin :focus-visible; si pausara, el slider quedaría
 * parado hasta hacer clic fuera. Sin `matches` (entornos sin DOM) cuenta como teclado.
 */
function isKeyboardFocus(target: EventTarget | null): boolean {
  const el = target as Element | null;
  if (!el || typeof el.matches !== 'function') return true;
  try {
    return el.matches(':focus-visible');
  } catch {
    return true;
  }
}

/**
 * Conecta un controlador a su contenedor. Todo activado por defecto. El hover no pausa.
 * En Svelte: {@attach (node) => bindAutoplay(node, controller)}.
 */
export function bindAutoplay(node: HTMLElement, controller: AutoplayController, options: BindAutoplayOptions = {}): Cleanup {
  const { focus = true, visibility = true, offscreen = true, reducedMotion = true } = options;
  const cleanups: Cleanup[] = [];
  const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
    el.addEventListener(type, fn);
    cleanups.push(() => el.removeEventListener(type, fn));
  };

  if (focus) {
    on(node, 'focusin', (e) => isKeyboardFocus(e.target) && controller.pause('focus'));
    on(node, 'focusout', (e) => {
      // El foco se mueve dentro del contenedor: sigue en pausa.
      const next = e.relatedTarget as Node | null;
      if (!next || !node.contains(next)) controller.resume('focus');
    });
  }
  if (visibility && typeof document !== 'undefined') {
    const sync = () => (document.hidden ? controller.pause('hidden') : controller.resume('hidden'));
    sync();
    document.addEventListener('visibilitychange', sync);
    cleanups.push(() => document.removeEventListener('visibilitychange', sync));
  }
  if (reducedMotion) {
    const sync = (reduced: boolean) => (reduced ? controller.pause('reduced-motion') : controller.resume('reduced-motion'));
    sync(prefersReducedMotion());
    cleanups.push(onReducedMotionChange(sync));
  }
  if (offscreen && typeof IntersectionObserver !== 'undefined') {
    controller.pause('offscreen');
    cleanups.push(
      inView(node, () => {
        controller.resume('offscreen');
        return () => controller.pause('offscreen');
      }),
    );
  }

  return () => cleanups.forEach((c) => c());
}
