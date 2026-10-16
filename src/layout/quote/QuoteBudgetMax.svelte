<script lang="ts">
  import DialogFieldError from '../dialog/DialogFieldError.svelte';
  import DialogInput from '../dialog/DialogInput.svelte';
  import type { QuoteData } from './quote-data';
  import { describedBy, quoteIds } from './quote-form';

  interface Props {
    field: QuoteData['budget']['max'];
    /** Etiqueta visible de la moneda elegida (USD, EUR, MXN o Cripto). */
    currency: string;
    value: string;
    error?: string;
    /** El diálogo enfoca este input si es el primer campo con error. */
    ref?: HTMLInputElement;
  }

  let { field, currency, value = $bindable(), error, ref = $bindable() }: Props = $props();

  const ids = quoteIds('max');
</script>

<div class="flex flex-col gap-1.5">
  <label for={ids.input} class="font-body text-caption text-ink-muted">{field.label} ({currency})</label>
  <DialogInput
    bind:ref
    bind:value
    id={ids.input}
    name="max"
    type="text"
    inputmode="decimal"
    autocomplete="off"
    placeholder={field.placeholder}
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={describedBy(error && ids.error)}
  />
  {#if error}
    <DialogFieldError id={ids.error} message={error} />
  {/if}
</div>
