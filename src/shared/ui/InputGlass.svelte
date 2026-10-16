<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  // Sin estado propio: Svelte porque lo usa una isla (el formulario de contacto).
  // Atributos nativos (id, name, type, autocomplete, placeholder, required, aria-invalid,
  // aria-describedby…) pasan con ...rest. El estado de error se ve con aria-invalid="true".
  interface Props extends Omit<HTMLInputAttributes, 'class' | 'value' | 'children'> {
    /** Valor (bind:value). */
    value?: string;
    /** Elemento <input> (bind:ref) para mover el foco al primer campo inválido. */
    ref?: HTMLInputElement;
  }

  let { value = $bindable(''), ref = $bindable(), ...rest }: Props = $props();
</script>

<!--
  Figma 174:81: campo transparente sobre glass, radio 10, borde glass-field de 1px (interior en
  Figma: el padding descuenta 1px), padding 16 / 12, texto 14 paper y placeholder line.
  Error: borde danger con aria-invalid="true" (Figma no diseña errores).
-->
<input
  bind:this={ref}
  bind:value
  {...rest}
  class="w-full min-w-0 rounded-field border border-glass-field bg-transparent px-(--field-pad-x) py-(--field-pad-y) font-body text-body-sm text-paper placeholder:text-line aria-invalid:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
/>
