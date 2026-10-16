<script lang="ts">
  import DialogFieldError from '../dialog/DialogFieldError.svelte';
  import DialogSectionTitle from '../dialog/DialogSectionTitle.svelte';
  import QuoteServiceOption from './QuoteServiceOption.svelte';
  import type { QuoteData } from './quote-data';
  import { countLabel } from '@/shared/lib/count-label';
  import { describedBy, quoteIds } from './quote-form';

  interface Props {
    services: QuoteData['services'];
    requiredLabel: string;
    selected: string[];
    error?: string;
    /** Primer checkbox (bind:ref): destino del foco si falta elegir. */
    firstRef?: HTMLInputElement;
  }

  let { services, requiredLabel, selected = $bindable(), error, firstRef = $bindable() }: Props = $props();

  const ids = quoteIds('services');
  const titleId = 'quote-services-title';
  const countId = 'quote-services-count';
</script>

<!-- 220:886: grupo de checkboxes con contador. Rejilla de 2; el quinto servicio ocupa la fila entera. -->
<div
  role="group"
  aria-labelledby={titleId}
  aria-describedby={describedBy(ids.hint, countId, error && ids.error)}
  class="flex flex-col gap-2.5"
>
  <DialogSectionTitle
    id={titleId}
    title={services.title}
    required={requiredLabel}
    aside={countLabel(selected.length, services.count)}
    asideId={countId}
  />
  <p id={ids.hint} class="font-body text-caption text-ink-muted">{services.hint}</p>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
    {#each services.options as service, index (service.value)}
      <div class="sm:last:odd:col-span-2">
        {#if index === 0}
          <QuoteServiceOption {service} checkIcon={services.checkIcon} bind:group={selected} bind:ref={firstRef} />
        {:else}
          <QuoteServiceOption {service} checkIcon={services.checkIcon} bind:group={selected} />
        {/if}
      </div>
    {/each}
  </div>
  {#if error}
    <DialogFieldError id={ids.error} message={error} />
  {/if}
</div>
