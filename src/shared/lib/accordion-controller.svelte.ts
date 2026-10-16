// Controlador de acordeón (runes) compartido por las islas de services y faq.
// Une la lógica pura de ./accordion (estado, teclado APG) con las primitivas de motion
// (entrada lateral). Las islas solo pintan el marcado y conectan eventos y refs.
//
// Marcado esperado (ver docs/conventions.md § Motion, patrón acordeón):
//   <button bind:this={acc.triggers[i]} aria-expanded={acc.isOpen(i)} onclick={() => acc.toggle(i)}
//           onkeydown={(e) => acc.keydown(e, i)}>…</button>
//   <div bind:this={acc.panels[i]} class="collapsible" data-open={acc.isOpen(i) || undefined}>
//     <div> … <x data-enter class={acc.enterClass}>…</x> … </div>
//   </div>

import { markEntrySides } from '@/shared/lib/motion';
import { focusTarget, toggleIndex } from './accordion';
import type { OpenIndex } from './accordion';

/** Selector de los elementos del panel que entran lateralmente al abrir. */
export const ENTER_ITEM = '[data-enter]';

/** Utilidad de entrada lateral (global.css); el sentido lo decide data-side. */
export const ENTER_CLASS = 'enter-from-side';

export class AccordionController {
  /** Fila abierta (como mucho una); `null` = todas cerradas. */
  openIndex: OpenIndex = $state(null);
  /**
   * La entrada lateral solo se activa tras la primera interacción: el panel abierto en el
   * SSR no se anima al cargar (y no hay data-side medido todavía).
   */
  interacted = $state(false);
  /** Cabeceras (bind:this) para mover el foco con el teclado. */
  triggers: HTMLElement[] = $state([]);
  /** Paneles (bind:this) para medir el lado de entrada antes de abrir. */
  panels: HTMLElement[] = $state([]);

  constructor(initialOpen: OpenIndex = null) {
    this.openIndex = initialOpen;
  }

  isOpen(index: number): boolean {
    return this.openIndex === index;
  }

  /** Clase de los elementos `data-enter`: vacía hasta la primera interacción. */
  get enterClass(): string {
    return this.interacted ? ENTER_CLASS : '';
  }

  /**
   * Abre la fila (cerrando la anterior) o la cierra si ya estaba abierta. Antes de abrir
   * mide el lado de entrada de cada elemento: el panel está cerrado, así que no hay
   * transform de una animación en curso que falsee la medida.
   */
  toggle(index: number): void {
    const next = toggleIndex(this.openIndex, index);
    const panel = next === null ? undefined : this.panels[next];
    if (panel) markEntrySides(panel, ENTER_ITEM);
    this.interacted = true;
    this.openIndex = next;
  }

  /** Flechas, Home y End entre cabeceras (patrón APG). */
  keydown(event: KeyboardEvent, index: number): void {
    const next = focusTarget(index, event.key, this.triggers.length);
    if (next === null) return;
    event.preventDefault();
    this.triggers[next]?.focus();
  }
}
