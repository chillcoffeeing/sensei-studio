<script lang="ts">
  import type { AccordionIcon } from './accordion';

  interface Props {
    items: string[];
    /** Viñeta lima de la lista (Figma 33:69). */
    bullet: AccordionIcon;
    /** Clase de entrada lateral del acordeón (`acc.enterClass`): cada ítem es un `data-enter`. */
    enterClass: string;
  }

  let { items, bullet, enterClass }: Props = $props();
</script>

<ul class="flex flex-col font-body text-list text-ink">
  {#each items as item (item)}
    <li data-enter class="flex gap-(--services-bullet-gap) {enterClass}">
      <!-- La caja de la viñeta mide una línea (1lh) para centrarla en la primera línea del ítem. -->
      <span aria-hidden="true" class="flex shrink-0 items-center" style="height: 1lh">
        <img src={bullet.src} width={bullet.width} height={bullet.height} alt="" class="block" />
      </span>
      <span>{item}</span>
    </li>
  {/each}
</ul>
