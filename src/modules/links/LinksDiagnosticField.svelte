<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  // Campo de texto del paso 3 (nombre o correo) con etiqueta visible. Sobre la tarjeta paper, así
  // que no usa los campos glass de la librería. Atributos nativos (type, autocomplete,
  // aria-invalid…) pasan con ...rest; el error es aria-invalid. 16px: con menos, iOS hace zoom.
  interface Props extends Omit<HTMLInputAttributes, 'class' | 'value' | 'children'> {
    label: string;
    value?: string;
  }

  let { label, value = $bindable(''), id, ...rest }: Props = $props();
</script>

<div class="flex min-w-0 flex-col gap-1.5">
  <label for={id} class="font-heading text-label-sm font-semibold text-ink">{label}</label>
  <input
    bind:value
    {id}
    {...rest}
    class="h-12 w-full min-w-0 rounded-xl border border-stone-500 bg-paper px-3.5 font-body text-body text-ink aria-invalid:border-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
  />
</div>
