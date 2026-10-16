<script lang="ts">
  import { onMount } from 'svelte';
  import { countLabel, type CountLabels } from '@/shared/lib/count-label';
  import ButtonCtaBrand from '@/shared/ui/ButtonCtaBrand.svelte';
  import type { UiIcon } from '@/shared/ui/types';
  import LinksServiceOption from './LinksServiceOption.svelte';

  interface Props {
    /** Los servicios del modal de cotización (misma fuente: site.quote.services). */
    services: {
      title: string;
      count: CountLabels;
      options: { value: string; label: string; icon: UiIcon }[];
      checkIcon: UiIcon;
    };
    /** `href`: destino sin JS del formulario. */
    cta: { label: string; href: string; icon: UiIcon };
  }

  let { services, cta }: Props = $props();

  let selected: string[] = $state([]);
  // Sin JS el contador no se actualizaría: se reserva su hueco y se muestra al hidratar.
  let hydrated = $state(false);
  onMount(() => {
    hydrated = true;
  });
  const titleId = 'links-services-title';
  const countId = 'links-services-count';
</script>

<!--
  230:1015 + 230:1043. Con JS, "Continuar cotización" abre el modal global (data-quote-open) con
  estos servicios ya marcados (data-quote-services, valores separados por espacios: el modal lee
  el atributo al abrir). Sin JS es un formulario GET al destino de respaldo (el contacto de la home).
-->
<form method="get" action={cta.href} class="flex flex-col gap-4">
  <div role="group" aria-labelledby={titleId} aria-describedby={countId} class="flex flex-col gap-2">
    <div class="flex items-baseline justify-between gap-3">
      <p id={titleId} class="font-heading text-sm font-semibold">{services.title}</p>
      <p id={countId} class="font-body text-xs text-ink-muted" class:invisible={!hydrated}>{countLabel(selected.length, services.count)}</p>
    </div>
    <ul class="grid grid-cols-2 gap-2">
      {#each services.options as service (service.value)}
        <li class="last:odd:col-span-2">
          <LinksServiceOption {service} checkIcon={services.checkIcon} bind:group={selected} />
        </li>
      {/each}
    </ul>
  </div>
  <div class="flex justify-center">
    <ButtonCtaBrand type="submit" label={cta.label} icon={cta.icon} data-quote-open data-quote-services={selected.join(' ')} />
  </div>
</form>
