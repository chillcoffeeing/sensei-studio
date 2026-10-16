<script lang="ts">
  import type { UiIcon } from '@/shared/ui/types';
  import DialogIcon from '../dialog/DialogIcon.svelte';
  import type { QuoteData } from './quote-data';

  interface Props {
    service: QuoteData['services']['options'][number];
    checkIcon: UiIcon;
    /** Valores marcados del grupo (bind:group). */
    group: string[];
    /** Elemento <input> (bind:ref) para llevar el foco al grupo si falta elegir. */
    ref?: HTMLInputElement;
  }

  let { service, checkIcon, group = $bindable(), ref = $bindable() }: Props = $props();

  // bind:group solo ve los checkboxes del mismo componente, y aquí cada opción es un componente.
  function toggle(checked: boolean) {
    group = checked ? [...group, service.value] : group.filter((item) => item !== service.value);
  }
</script>

<!--
  220:893: checkbox nativo (oculto a la vista, no al teclado) dentro de una tarjeta. El estado lo
  pinta CSS con has-checked / has-focus-visible, así se ve bien también antes de hidratar.
-->
<label
  class="group flex h-full min-h-16 cursor-pointer items-center gap-2.5 rounded-xl border border-stone-300 bg-stone-100 px-3.5 py-3 transition-colors duration-(--duration-fast) ease-standard hover:border-stone-400 has-checked:border-ink has-checked:bg-brand-tint has-checked:ring-1 has-checked:ring-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
>
  <input
    bind:this={ref}
    type="checkbox"
    checked={group.includes(service.value)}
    onchange={(event) => toggle(event.currentTarget.checked)}
    name="services"
    value={service.value}
    class="sr-only"
  />
  <DialogIcon icon={service.icon} />
  <span class="min-w-0 flex-1 font-heading text-label-sm text-ink">{service.label}</span>
  <span
    class="flex size-5 shrink-0 items-center justify-center rounded-md border border-stone-400 bg-paper group-has-checked:border-ink group-has-checked:bg-brand"
    aria-hidden="true"
  >
    <span class="hidden group-has-checked:block"><DialogIcon icon={checkIcon} /></span>
  </span>
</label>
