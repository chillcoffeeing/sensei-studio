<script lang="ts">
  import { accordionIds } from '@/shared/lib/accordion';
  import type { AccordionController } from '@/shared/lib/accordion-controller.svelte';
  import { rowLeading } from './accordion';
  import ServiceBullets from './ServiceBullets.svelte';
  import ServiceImage from './ServiceImage.svelte';
  import type { AccordionIcon, AccordionService } from './accordion';

  interface Props {
    /** Controlador del acordeón (estado, teclado, entrada lateral); lo crea ServicesAccordion. */
    acc: AccordionController;
    index: number;
    /** Prefijo de los ids de cabecera y panel. */
    baseId: string;
    service: AccordionService;
    /** `sizes` de las imágenes del panel. */
    sizes: string;
    /** Punto lima de la fila abierta (Figma 33:61). */
    dot: AccordionIcon;
    /** Viñeta lima de la lista (Figma 33:69). */
    bullet: AccordionIcon;
  }

  let { acc, index, baseId, service, sizes, dot, bullet }: Props = $props();

  const open = $derived(acc.isOpen(index));
  const ids = $derived(accordionIds(baseId, index));
  const leading = $derived(rowLeading(acc.openIndex) === 'open' ? 'md:leading-service-open' : 'md:leading-service-row');

  const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
</script>

<div class="border-b border-divider">
  <h3 class="font-heading text-title-lg text-ink">
    <button
      bind:this={acc.triggers[index]}
      id={ids.trigger}
      type="button"
      aria-expanded={open}
      aria-controls={ids.panel}
      class="flex w-full cursor-pointer items-center gap-(--services-dot-gap) py-(--services-row-pad-y) text-left md:py-0 {leading} {focusRing}"
      class:font-semibold={open}
      onclick={() => acc.toggle(index)}
      onkeydown={(event) => acc.keydown(event, index)}
    >
      {#if open}
        <img src={dot.src} width={dot.width} height={dot.height} alt="" class="block shrink-0" />
      {/if}
      <span>{service.title}</span>
    </button>
  </h3>

  <!--
    Panel `collapsible` (global.css): alto animado 0fr → 1fr con data-open; sin JS queda
    abierto y con reduced motion cambia sin transición. El hijo directo es la fila que
    se recorta; el padding va en el nieto para que colapse a 0 de verdad.
  -->
  <div
    bind:this={acc.panels[index]}
    id={ids.panel}
    role="region"
    aria-labelledby={ids.trigger}
    data-service-panel
    data-open={open || undefined}
    class="collapsible"
  >
    <div>
      <div
        class="flex flex-col gap-(--services-panel-gap) pb-(--services-panel-pad-bottom) xl:flex-row xl:items-start xl:justify-between"
      >
        <div class="flex max-w-90.25 flex-col gap-(--services-copy-gap)">
          <p data-enter class="font-body text-body text-ink-muted {acc.enterClass}">{service.description}</p>
          <ServiceBullets items={service.items} {bullet} enterClass={acc.enterClass} />
        </div>

        {#if service.images.length}
          <ul class="grid grid-cols-3 gap-4.25 md:flex md:shrink-0">
            {#each service.images as image, i (i)}
              <li data-enter class="aspect-(--service-image-aspect) overflow-hidden rounded-media md:w-46.75 {acc.enterClass}">
                <ServiceImage {image} {sizes} />
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
</div>
