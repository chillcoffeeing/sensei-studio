<script lang="ts">
  import QuoteBudgetMax from './QuoteBudgetMax.svelte';
  import QuoteBudgetMode from './QuoteBudgetMode.svelte';
  import QuoteBudgetRange from './QuoteBudgetRange.svelte';
  import QuoteCurrency from './QuoteCurrency.svelte';
  import DialogSectionTitle from '../dialog/DialogSectionTitle.svelte';
  import type { QuoteData } from './quote-data';
  import type { BudgetMode } from './quote-form';
  import type { QuoteCurrencyCode } from '@/core/site';

  interface Props {
    budget: QuoteData['budget'];
    mode: BudgetMode;
    currency: QuoteCurrencyCode;
    range: string;
    max: string;
    maxError?: string;
    maxRef?: HTMLInputElement;
  }

  let {
    budget,
    mode = $bindable(),
    currency = $bindable(),
    range = $bindable(),
    max = $bindable(),
    maxError,
    maxRef = $bindable(),
  }: Props = $props();

  const titleId = 'quote-budget-title';
  const noteId = 'quote-budget-note';
  // Etiqueta visible de la moneda elegida ("Cripto" en vez del código CRYPTO).
  const currencyLabel = $derived(budget.currency.options.find((option) => option.value === currency)?.label ?? currency);
</script>

<!-- 220:916: modo (rango / monto máximo) + moneda (select), y debajo los rangos o el monto. Todo opcional. -->
<div role="group" aria-labelledby={titleId} aria-describedby={noteId} class="flex flex-col gap-2.5">
  <DialogSectionTitle id={titleId} title={budget.title} aside={budget.optional} />
  <div class="flex items-center gap-2.5">
    <QuoteBudgetMode labels={budget.modes} bind:mode />
    <QuoteCurrency currency={budget.currency} bind:value={currency} />
  </div>

  {#if mode === 'range'}
    <div role="radiogroup" aria-label="{budget.ranges.label} ({currencyLabel})" class="flex flex-wrap gap-1.5">
      {#each budget.ranges.options as option (option.value)}
        <QuoteBudgetRange range={option} checkIcon={budget.ranges.checkIcon} bind:group={range} />
      {/each}
    </div>
  {:else}
    <QuoteBudgetMax field={budget.max} currency={currencyLabel} bind:value={max} error={maxError} bind:ref={maxRef} />
  {/if}

  <p id={noteId} class="font-body text-legal text-ink-muted">{budget.note}</p>
</div>
