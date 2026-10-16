<script lang="ts">
  import type { UiIcon } from '@/shared/ui/types';
  import DialogIcon from '../dialog/DialogIcon.svelte';
  import type { AdviceData } from './advice-data';

  interface Props {
    option: AdviceData['stage']['options'][number];
    checkedIcon: UiIcon;
    checked: boolean;
    onselect: (value: string) => void;
  }

  let { option, checkedIcon, checked, onselect }: Props = $props();

  const descriptionId = $derived(`advice-stage-${option.value}-description`);
</script>

<!--
  272:8134: radio nativo (oculto a la vista, no al teclado) dentro de una tarjeta; las flechas
  recorren el grupo (mismo `name`). El estado lo pinta CSS con has-checked / has-focus-visible.
  Mobile: icono, texto y marca en una fila. Desde sm, como Figma: icono y marca arriba, texto debajo.
-->
<label
  class="group flex h-full cursor-pointer flex-wrap items-center gap-x-3 gap-y-2.5 rounded-xl border border-stone-300 bg-stone-100 p-3.5 transition-colors duration-(--duration-fast) ease-standard can-hover:hover:border-stone-400 has-checked:border-ink has-checked:bg-brand-tint has-checked:ring-1 has-checked:ring-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
>
  <input
    type="radio"
    name="stage"
    value={option.value}
    {checked}
    onchange={() => onselect(option.value)}
    aria-describedby={descriptionId}
    class="sr-only"
  />
  <span class="order-1"><DialogIcon icon={option.icon} /></span>
  <span class="order-2 flex min-w-0 flex-1 flex-col gap-0.5 sm:order-3 sm:basis-full">
    <span class="font-heading text-label-sm font-semibold text-ink">{option.label}</span>
    <span id={descriptionId} class="font-body text-caption text-ink-muted">{option.description}</span>
  </span>
  <span class="order-3 flex size-4.5 shrink-0 items-center justify-center sm:order-2 sm:ms-auto" aria-hidden="true">
    <span class="block size-full rounded-full border border-stone-400 bg-paper group-has-checked:hidden"></span>
    <span class="hidden group-has-checked:block"><DialogIcon icon={checkedIcon} /></span>
  </span>
</label>
