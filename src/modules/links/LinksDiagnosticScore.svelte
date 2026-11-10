<script lang="ts">
  // Fila del mini gráfico "Tu diagnóstico": área, puntaje (x/4) y barra. La ganadora va sobre una
  // franja lima con la barra en tinta (el lima se ve como fondo, nunca como texto).
  interface Props {
    name: string;
    /** Texto del puntaje ya resuelto ("3/4"). */
    value: string;
    /** Proporción de la barra (0…1). */
    ratio: number;
    top: boolean;
  }

  let { name, value, ratio, top }: Props = $props();
</script>

<div class={`flex flex-col gap-1.5 rounded-lg px-3 py-2 ${top ? 'bg-brand' : ''}`}>
  <span class="flex items-baseline justify-between gap-3 font-body text-body-sm text-ink">
    <span class={top ? 'font-semibold' : ''}>{name}</span>
    <span class={`tabular-nums ${top ? 'font-semibold' : 'text-ink-muted'}`}>{value}</span>
  </span>
  <span aria-hidden="true" class="block h-1.5 overflow-hidden rounded-pill bg-ink/10">
    <span class={`block h-full origin-left rounded-pill ${top ? 'bg-ink' : 'bg-ink-muted'}`} style:transform={`scaleX(${ratio})`}></span>
  </span>
</div>
