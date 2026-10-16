<script lang="ts">
  // Título de bloque de un formulario de modal (220:888, 272:8130…) con su nota a la derecha
  // (contador u "Opcional"). El título nombra el grupo (aria-labelledby).
  interface Props {
    id: string;
    title: string;
    /** "*" visible + nombre accesible del obligatorio. */
    required?: string;
    /** Texto pequeño a la derecha. */
    aside?: string;
    /** id del aside, para que el grupo lo lea (contador). */
    asideId?: string;
  }

  let { id, title, required, aside, asideId }: Props = $props();
</script>

<div class="flex items-baseline justify-between gap-4">
  <h3 {id} class="font-heading text-title-sm font-semibold text-ink">
    {title}{#if required}<span aria-hidden="true">{' *'}</span><span class="sr-only">{` (${required})`}</span>{/if}
  </h3>
  {#if aside}
    <p id={asideId} class="shrink-0 font-body text-legal text-ink-muted">{aside}</p>
  {/if}
</div>
