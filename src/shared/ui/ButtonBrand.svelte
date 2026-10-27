<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  // Botón píldora brand sin flecha: abrir y cerrar el menú mobile. Sin estado propio: Svelte porque
  // lo usa una isla. Atributos nativos (onclick, aria-expanded, aria-controls…) pasan con ...rest.
  interface Props extends Omit<HTMLButtonAttributes, 'class' | 'children'> {
    label: string;
    /** Elemento <button> (bind:ref) para mover el foco. */
    ref?: HTMLButtonElement;
  }

  let { label, ref = $bindable(), type = 'button', ...rest }: Props = $props();
</script>

<!-- Área táctil de 44px alrededor de la píldora: el aspecto no cambia. -->
<button
  bind:this={ref}
  {type}
  {...rest}
  class="flex h-11 cursor-pointer items-center rounded-pill focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
>
  <span
    class="flex h-10 items-center justify-center rounded-pill bg-brand px-5 pt-2.25 pb-2.5 font-heading text-button-sm whitespace-nowrap text-ink"
  >
    {label}
  </span>
</button>
