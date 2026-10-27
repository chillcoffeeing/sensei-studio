<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  // Campo de texto sobre la card glass (formulario de contacto). Sin estado propio: Svelte porque
  // lo usa una isla. Atributos nativos (id, name, type, autocomplete, placeholder, required,
  // aria-invalid, aria-describedby…) pasan con ...rest. Error = aria-invalid="true" (borde danger),
  // no una prop. Para superficies claras (modales) está DialogInput en layout/dialog/.
  interface Props extends Omit<HTMLInputAttributes, 'class' | 'value' | 'children'> {
    /** Valor (bind:value). */
    value?: string;
    /** Elemento <input> (bind:ref) para mover el foco al primer campo inválido. */
    ref?: HTMLInputElement;
  }

  let { value = $bindable(''), ref = $bindable(), ...rest }: Props = $props();
</script>

<input
  bind:this={ref}
  bind:value
  {...rest}
  class="w-full min-w-0 rounded-field border border-glass-field bg-transparent px-(--field-pad-x) py-(--field-pad-y) font-body text-body-sm text-paper placeholder:text-line aria-invalid:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
/>
