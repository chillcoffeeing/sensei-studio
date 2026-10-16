<script lang="ts">
  import type { UiIcon } from '@/shared/ui/types';

  interface Props {
    service: { value: string; label: string; icon: UiIcon };
    checkIcon: UiIcon;
    /** Valores marcados del grupo (bind:group). */
    group: string[];
  }

  let { service, checkIcon, group = $bindable() }: Props = $props();

  // bind:group solo ve los checkboxes del mismo componente, y aquí cada opción es un componente.
  function toggle(checked: boolean) {
    group = checked ? [...group, service.value] : group.filter((item) => item !== service.value);
  }
</script>

<!--
  230:1020: tarjeta vertical (icono y casilla arriba, nombre abajo) con un checkbox nativo oculto a
  la vista, no al teclado. El estado lo pinta CSS (has-checked), así se ve bien antes de hidratar.
  Mismos colores que la tarjeta del modal (220:893).
-->
<label
  class="group flex h-full min-h-18.5 cursor-pointer flex-col justify-between gap-2.25 rounded-xl border border-stone-300 bg-stone-100 p-3 motion-safe:transition-colors motion-safe:duration-(--duration-fast) motion-safe:ease-standard can-hover:hover:border-stone-400 has-checked:border-ink has-checked:bg-brand-tint has-checked:ring-1 has-checked:ring-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
>
  <input
    type="checkbox"
    name="services"
    value={service.value}
    checked={group.includes(service.value)}
    onchange={(event) => toggle(event.currentTarget.checked)}
    class="sr-only"
  />
  <span class="flex items-center justify-between gap-2">
    <img src={service.icon.src} width={service.icon.width} height={service.icon.height} alt="" class="block shrink-0" />
    <span
      aria-hidden="true"
      class="flex size-5 shrink-0 items-center justify-center rounded-md border border-stone-400 bg-paper group-has-checked:border-ink group-has-checked:bg-brand"
    >
      <img src={checkIcon.src} width={checkIcon.width} height={checkIcon.height} alt="" class="hidden group-has-checked:block" />
    </span>
  </span>
  <span class="font-heading text-label-sm text-ink">{service.label}</span>
</label>
