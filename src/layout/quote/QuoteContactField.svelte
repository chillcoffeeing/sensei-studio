<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import DialogFieldError from '../dialog/DialogFieldError.svelte';
  import DialogInput from '../dialog/DialogInput.svelte';
  import type { QuoteData } from './quote-data';
  import { describedBy, quoteIds } from './quote-form';

  interface Props {
    name: 'name' | 'email' | 'whatsapp';
    field: QuoteData['contact']['fields']['name'];
    requiredLabel: string;
    value: string;
    error?: string;
    ref?: HTMLInputElement;
  }

  let { name, field, requiredLabel, value = $bindable(), error, ref = $bindable() }: Props = $props();

  const ids = $derived(quoteIds(name));
  // Tipo, autocompletado y teclado de cada dato de contacto.
  const native: Record<Props['name'], HTMLInputAttributes> = {
    name: { type: 'text', autocomplete: 'name' },
    email: { type: 'email', autocomplete: 'email', inputmode: 'email', spellcheck: false },
    whatsapp: { type: 'tel', autocomplete: 'tel', inputmode: 'tel' },
  };
</script>

<!-- 220:978: etiqueta visible encima + campo. -->
<div class="flex min-w-0 flex-1 flex-col gap-1.5">
  <label for={ids.input} class="font-body text-caption text-ink-muted">
    {field.label}{#if field.required}<span aria-hidden="true">{' *'}</span><span class="sr-only">{` (${requiredLabel})`}</span>{/if}
  </label>
  <DialogInput
    bind:ref
    bind:value
    {...native[name]}
    id={ids.input}
    {name}
    placeholder={field.placeholder}
    required={field.required}
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={describedBy(error && ids.error)}
  />
  {#if error}
    <DialogFieldError id={ids.error} message={error} />
  {/if}
</div>
