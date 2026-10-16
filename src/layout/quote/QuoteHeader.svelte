<script lang="ts">
  import LabelMarker from '@/shared/ui/LabelMarker.svelte';
  import DialogIcon from '../dialog/DialogIcon.svelte';
  import type { QuoteData } from './quote-data';

  interface Props {
    header: QuoteData['header'];
    /** id del título: nombre accesible del diálogo (aria-labelledby). */
    titleId: string;
    onclose: () => void;
  }

  let { header, titleId, onclose }: Props = $props();
</script>

<!--
  220:868. Dos piezas hermanas dentro del contenedor con scroll del diálogo: la fila de rótulo
  + cierre queda pegada arriba (en mobile el diálogo ocupa la pantalla y el cierre debe seguir a
  mano); título y entradilla se van con el scroll.
-->
<div class="sticky top-0 z-10 flex items-center justify-between gap-4 bg-paper px-5 pt-4 pb-2 sm:px-8 sm:pt-6">
  <p class="text-ink"><LabelMarker text={header.eyebrow} /></p>
  <button
    type="button"
    aria-label={header.close.label}
    onclick={onclose}
    class="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-stone-100 transition-colors duration-(--duration-fast) ease-standard hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
  >
    <DialogIcon icon={header.close.icon} />
  </button>
</div>

<div class="flex flex-col gap-2.5 border-b border-stone-300 px-5 pt-2 pb-6 sm:px-8">
  <h2 id={titleId} class="font-heading text-display text-ink">{header.title}</h2>
  <p class="font-body text-body-sm text-ink-muted">{header.lead}</p>
</div>
