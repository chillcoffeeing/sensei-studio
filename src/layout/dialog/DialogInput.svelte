<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  // Campo de texto de los modales (220:980). Atributos nativos con ...rest; el error es aria-invalid.
  interface Props extends Omit<HTMLInputAttributes, 'class' | 'value' | 'children'> {
    value?: string;
    ref?: HTMLInputElement;
  }

  let { value = $bindable(''), ref = $bindable(), ...rest }: Props = $props();
</script>

<!-- 16px en mobile: con menos, iOS hace zoom al enfocar. -->
<input
  bind:this={ref}
  bind:value
  {...rest}
  class="h-11 w-full min-w-0 rounded-lg border border-stone-400 bg-paper px-3 font-body text-body text-ink placeholder:text-ink-muted aria-invalid:border-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:text-body-sm"
/>
