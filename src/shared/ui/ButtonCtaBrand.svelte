<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import CtaBrandShape from './CtaBrandShape.svelte';
  import type { UiIcon } from './types';

  // El CTA principal (LinkCtaBrand) como <button> sobre superficie clara: envío del modal de
  // cotización. Atributos nativos (type, aria-disabled, onclick…) pasan con ...rest; `type` por
  // defecto `button`. Mientras se envía, `aria-disabled` lo marca con cursor-progress y opacidad.
  interface Props extends Omit<HTMLButtonAttributes, 'class' | 'children'> {
    label: string;
    /** Flecha del círculo (decorativa: alt vacío). */
    icon: UiIcon;
  }

  let { label, icon, type = 'button', ...rest }: Props = $props();
</script>

<!-- Mismo dibujo y mismo hover líquido que LinkCtaBrand; foco ink porque va sobre fondo claro. -->
<button
  {type}
  {...rest}
  class="group/cta flex min-h-11 w-fit cursor-pointer items-center rounded-pill aria-disabled:cursor-progress aria-disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-safe:transition-opacity motion-safe:duration-(--duration-fast) motion-safe:ease-standard"
>
  <CtaBrandShape {label} {icon} />
</button>
