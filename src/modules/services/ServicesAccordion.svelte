<script lang="ts">
  import type { OpenIndex } from '@/shared/lib/accordion';
  import { AccordionController } from '@/shared/lib/accordion-controller.svelte';
  import ServiceRow from './ServiceRow.svelte';
  import type { AccordionIcon, AccordionService } from './accordion';

  interface Props {
    /** Prefijo de los ids de cabeceras y paneles. */
    baseId: string;
    services: AccordionService[];
    /** `sizes` de las imágenes del panel. */
    sizes: string;
    /** Punto lima de la fila abierta (Figma 33:61). */
    dot: AccordionIcon;
    /** Viñeta lima de la lista (Figma 33:69). */
    bullet: AccordionIcon;
    /** Fila abierta al cargar (la primera, según 33:78). */
    initialOpen?: OpenIndex;
  }

  let { baseId, services, sizes, dot, bullet, initialOpen = 0 }: Props = $props();

  // initialOpen solo fija el estado inicial; después manda el usuario. Estado, teclado y
  // entrada lateral viven en el controlador compartido (también lo usa el FAQ); cada fila
  // (ServiceRow) lo recibe y pinta su cabecera y su panel.
  // svelte-ignore state_referenced_locally
  const acc = new AccordionController(initialOpen);
</script>

<div class="flex flex-col">
  {#each services as service, index (service.title)}
    <ServiceRow {acc} {index} {baseId} {service} {sizes} {dot} {bullet} />
  {/each}
</div>
