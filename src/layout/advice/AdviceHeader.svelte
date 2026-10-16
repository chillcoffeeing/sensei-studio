<script lang="ts">
  import LabelMarker from '@/shared/ui/LabelMarker.svelte';
  import DialogIcon from '../dialog/DialogIcon.svelte';
  import type { AdviceData } from './advice-data';

  interface Props {
    header: AdviceData['header'];
    /** id del título: nombre accesible del diálogo (aria-labelledby). */
    titleId: string;
    onclose: () => void;
  }

  let { header, titleId, onclose }: Props = $props();
</script>

<!--
  272:8118. La fila de rótulo + cierre queda pegada arriba (en mobile el diálogo ocupa la pantalla
  y el cierre debe seguir a mano); título y entradilla se van con el scroll. El círculo de 32 del
  cierre viene en el SVG; el botón de 44 da el área táctil.
-->
<div class="sticky top-0 z-10 flex items-center justify-between gap-4 bg-paper ps-5 pe-3.5 pt-3 pb-1 sm:ps-8 sm:pe-6 sm:pt-4">
  <p class="text-ink"><LabelMarker text={header.eyebrow} /></p>
  <button
    type="button"
    aria-label={header.close.label}
    onclick={onclose}
    class="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-(--duration-fast) ease-standard can-hover:hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
  >
    <DialogIcon icon={header.close.icon} />
  </button>
</div>

<div class="flex flex-col gap-3 border-b border-stone-300 px-5 pt-2 pb-6 sm:px-8">
  <h2 id={titleId} class="font-heading text-title-lg leading-tight font-semibold tracking-tight text-balance text-ink">{header.title}</h2>
  <p class="font-body text-body-sm leading-normal text-ink-muted">{header.lead}</p>
</div>
