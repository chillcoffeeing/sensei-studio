<script lang="ts">
  // Opción de selección única del paso 3: radio nativo oculto a la vista (no al teclado) con
  // aspecto de chip gris claro, como las tarjetas de servicio; la elegida pasa a lima con borde
  // tinta. El estado lo pinta CSS (has-checked).
  interface Props {
    /** `name` del grupo de radios. */
    name: string;
    value: string;
    label: string;
    /** Valor elegido en el grupo (bindable). */
    group: string;
    invalid: boolean;
  }

  let { name, value, label, group = $bindable(), invalid }: Props = $props();
</script>

<label
  class="flex min-h-11 cursor-pointer items-center rounded-xl border border-stone-300 bg-stone-100 px-3.5 py-2 font-heading text-label-sm text-ink motion-safe:transition-colors motion-safe:duration-(--duration-fast) motion-safe:ease-standard can-hover:hover:border-stone-500 has-checked:border-ink has-checked:bg-brand has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
>
  <input
    type="radio"
    {name}
    {value}
    checked={group === value}
    onchange={() => (group = value)}
    aria-invalid={invalid ? 'true' : undefined}
    class="sr-only"
  />
  {label}
</label>
