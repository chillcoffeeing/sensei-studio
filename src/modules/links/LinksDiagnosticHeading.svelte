<script lang="ts">
  import { fill } from './diagnostic';
  import type { DiagnosticHeading } from './schema';

  // Título del diagnóstico con su tramo realzado: tinta sobre un marcador lima en el tercio inferior
  // (el lima nunca es color de texto sobre blanco). El h2 es el título del paso: lleva
  // `data-step-title` y tabindex -1 para que la isla le pase el foco al cambiar de paso.
  interface Props {
    heading: DiagnosticHeading;
    /** 2 = título del paso (recibe el foco); 3 = subtítulo dentro del paso. */
    level: 2 | 3;
    /** Valor de `{name}` en el texto y el tramo realzado ("Gracias, Ana."). */
    name?: string;
  }

  let { heading, level, name = '' }: Props = $props();

  const text = $derived(fill(heading.text, { name }));
  const mark = $derived(heading.mark ? fill(heading.mark, { name }) : '');
</script>

<svelte:element
  this={`h${level}`}
  tabindex={level === 2 ? -1 : undefined}
  data-step-title={level === 2 ? '' : undefined}
  class={`font-heading font-semibold text-balance text-ink outline-none ${level === 2 ? 'text-2xl/tight' : 'text-xl/tight'}`}
>
  {text}{#if mark}{' '}<mark
      class="bg-transparent bg-linear-to-t from-brand from-40% to-transparent to-40% box-decoration-clone px-0.5 text-ink">{mark}</mark
    >{/if}
</svelte:element>
