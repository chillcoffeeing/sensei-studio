<script lang="ts">
  import type { QuoteCurrencyCode } from '@/core/site';
  import DialogIcon from '../dialog/DialogIcon.svelte';
  import type { QuoteData } from './quote-data';

  interface Props {
    currency: QuoteData['budget']['currency'];
    value: QuoteCurrencyCode;
  }

  let { currency, value = $bindable() }: Props = $props();

  const id = 'quote-currency';
</script>

<!--
  220:926: <select> nativo (teclado y lector de pantalla gratis) con chevron decorativo. Va en el
  mismo pozo stone-100 con p-1 que el segmentado de modo y la caja interior copia su pastilla
  activa, así la fila mide lo mismo y se leen como un solo grupo de controles.
-->
<div class="relative flex shrink-0 rounded-lg bg-stone-100 p-1">
  <label for={id} class="sr-only">{currency.label}</label>
  <select
    {id}
    bind:value
    name="currency"
    class="h-11 cursor-pointer appearance-none rounded-md border border-stone-300 bg-paper pr-8 pl-3 font-body text-body text-ink transition-colors duration-(--duration-fast) ease-standard hover:border-stone-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink sm:text-body-sm lg:pointer-fine:h-9"
  >
    {#each currency.options as option (option.value)}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  <span class="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2" aria-hidden="true">
    <DialogIcon icon={currency.icon} />
  </span>
</div>
