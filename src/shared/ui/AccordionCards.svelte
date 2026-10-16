<script lang="ts">
  import { accordionIds } from '@/shared/lib/accordion';
  import { AccordionController } from '@/shared/lib/accordion-controller.svelte';
  import type { AccordionCardItem, UiIcon } from './types';

  // Acordeón de cards (preguntas y respuestas). Con estado: es una isla (client:visible).
  // Estado, teclado APG y entrada lateral: AccordionController (shared/lib), como services.
  // La primera card empieza abierta (Figma 174:158). El idioma (lang) lo pone el contenedor.
  interface Props {
    /** Prefijo de los ids de cabeceras y paneles (único en la página). */
    baseId: string;
    items: AccordionCardItem[];
    /** "+" de 12px (Figma 174:162) que rota 45° (×) al abrir. */
    icon: UiIcon;
  }

  let { baseId, items, icon }: Props = $props();

  const acc = new AccordionController(0);
</script>

<!--
  Figma 174:157 / 174:158: pila con gap 16 de cards blancas (radio 16, sombra card-sm,
  padding 32/40 fluido). Título 19/500 y botón ink de 32 con el "+"; cuerpo 16/26 ink-muted a 24
  del título. Cuerpo `collapsible` con data-open (sin JS, todo abierto).
-->
<ul class="flex flex-col gap-4">
  {#each items as item, index (item.title)}
    {@const open = acc.isOpen(index)}
    {@const ids = accordionIds(baseId, index)}
    <li class="rounded-card bg-paper px-(--accordion-card-pad-x) py-(--accordion-card-pad-y) shadow-card-sm">
      <h3 class="font-heading text-title-sm text-ink">
        <button
          bind:this={acc.triggers[index]}
          id={ids.trigger}
          type="button"
          aria-expanded={open}
          aria-controls={ids.panel}
          class="flex w-full cursor-pointer items-center justify-between gap-(--accordion-card-icon-gap) text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          onclick={() => acc.toggle(index)}
          onkeydown={(event) => acc.keydown(event, index)}
        >
          <span>{item.title}</span>
          <span aria-hidden="true" class="flex size-8 shrink-0 items-center justify-center rounded-pill bg-ink">
            <img
              src={icon.src}
              width={icon.width}
              height={icon.height}
              alt=""
              class="block size-3 motion-safe:transition-transform motion-safe:duration-(--duration-base) motion-safe:ease-standard"
              class:rotate-45={open}
            />
          </span>
        </button>
      </h3>

      <div
        bind:this={acc.panels[index]}
        id={ids.panel}
        role="region"
        aria-labelledby={ids.trigger}
        data-open={open || undefined}
        class="collapsible"
      >
        <div>
          <p data-enter class="pt-(--accordion-card-answer-gap) font-body text-answer text-ink-muted {acc.enterClass}">
            {item.body}
          </p>
        </div>
      </div>
    </li>
  {/each}
</ul>
