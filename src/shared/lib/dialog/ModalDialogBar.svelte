<script lang="ts">
  // Fila superior común de los modales (cotización, asesoría y diagnóstico de /links): rótulo a la
  // izquierda y cierre redondo a la derecha, pegada arriba del scroll del diálogo para que el cierre
  // siga a mano. Un solo componente para que los tres tengan la misma ubicación y forma de cierre.
  import type { Snippet } from 'svelte';
  import type { UiIcon } from '@/shared/ui/types';

  interface Props {
    /** Nombre accesible del botón (no tiene texto visible). */
    closeLabel: string;
    /** X decorativa (16px) del cierre; el círculo lo dibuja el botón. */
    closeIcon: UiIcon;
    onclose: () => void;
    /** Línea inferior: para cuando el contenido pasa por debajo sin título propio (diagnóstico). */
    divided?: boolean;
    /** Rótulo (normalmente un <p> con LabelMarker). */
    children: Snippet;
  }

  let { closeLabel, closeIcon, onclose, divided = false, children }: Props = $props();
</script>

<div
  class={[
    'sticky top-0 z-10 flex items-center justify-between gap-4 bg-paper ps-5 pe-3 pt-3 sm:ps-8 sm:pe-5 sm:pt-4',
    divided ? 'border-b border-stone-200 pb-3' : 'pb-2',
  ]}
>
  {@render children()}
  <button
    type="button"
    aria-label={closeLabel}
    onclick={onclose}
    class="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-safe:transition-colors motion-safe:duration-(--duration-fast) motion-safe:ease-standard can-hover:hover:bg-stone-200"
  >
    <img src={closeIcon.src} width={closeIcon.width} height={closeIcon.height} alt="" class="block shrink-0" />
  </button>
</div>
