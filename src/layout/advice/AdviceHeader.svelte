<script lang="ts">
  // Cabecera del modal de asesoría (272:8118): fila común de rótulo + cierre (ModalDialogBar,
  // pegada arriba) y, debajo, título y entradilla, que se van con el scroll.
  import ModalDialogBar from '@/shared/lib/dialog/ModalDialogBar.svelte';
  import LabelMarker from '@/shared/ui/LabelMarker.svelte';
  import type { AdviceData } from './advice-data';

  interface Props {
    header: AdviceData['header'];
    /** id del título: nombre accesible del diálogo (aria-labelledby). */
    titleId: string;
    onclose: () => void;
  }

  let { header, titleId, onclose }: Props = $props();
</script>

<ModalDialogBar closeLabel={header.close.label} closeIcon={header.close.icon} {onclose}>
  <p class="text-ink"><LabelMarker text={header.eyebrow} /></p>
</ModalDialogBar>

<div class="flex flex-col gap-3 border-b border-stone-300 px-5 pt-2 pb-6 sm:px-8">
  <h2 id={titleId} class="font-heading text-title-lg leading-tight font-semibold tracking-tight text-balance text-ink">{header.title}</h2>
  <p class="font-body text-body-sm leading-normal text-ink-muted">{header.lead}</p>
</div>
