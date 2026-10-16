// Pausa por gesto (swipe con el dedo, arrastre con ratón): el autoplay se detiene mientras dura y
// se reanuda `delayMs` después de soltar, para no arrebatar el slider a quien lo está mirando.

import type { AutoplayController } from '@/shared/lib/motion';

export interface InteractionPause {
  /** Empieza un gesto: pausa (motivo 'interaction') y anula una reanudación pendiente. */
  begin(): void;
  /** Termina el gesto: programa la reanudación. */
  end(): void;
  dispose(): void;
}

export function createInteractionPause(controller: Pick<AutoplayController, 'pause' | 'resume' | 'has'>, delayMs: number): InteractionPause {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return {
    begin() {
      clearTimeout(timer);
      controller.pause('interaction');
    },
    end() {
      if (!controller.has('interaction')) return;
      clearTimeout(timer);
      timer = setTimeout(() => controller.resume('interaction'), delayMs);
    },
    dispose() {
      clearTimeout(timer);
    },
  };
}
