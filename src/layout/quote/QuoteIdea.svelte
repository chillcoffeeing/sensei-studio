<script lang="ts">
  import DialogFieldError from '../dialog/DialogFieldError.svelte';
  import type { QuoteData } from './quote-data';
  import { describedBy, quoteIds } from './quote-form';

  interface Props {
    hint: string;
    field: QuoteData['project']['idea'];
    value: string;
    error?: string;
    /** El diálogo enfoca este textarea si es el primer campo con error. */
    ref?: HTMLTextAreaElement;
  }

  let { hint, field, value = $bindable(), error, ref = $bindable() }: Props = $props();

  const ids = quoteIds('idea');
  const helperId = 'quote-idea-helper';
</script>

<!-- Sin envoltorio: pista, caja y error son hijos directos del bloque (su gap los separa). La ayuda va dentro de la caja. -->
<p id={ids.hint} class="font-body text-caption text-ink-muted">{hint}</p>

<div
  class="flex flex-col gap-1 rounded-xl border border-stone-400 bg-stone-100 p-3.5 has-aria-invalid:border-red-700 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
>
  <label for={ids.input} class="sr-only">{field.label}</label>
  <textarea
    bind:this={ref}
    bind:value
    id={ids.input}
    name="idea"
    rows="3"
    required
    minlength={field.minLength}
    placeholder={field.placeholder}
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={describedBy(ids.hint, helperId, error && ids.error)}
    class="min-h-18 w-full resize-y bg-transparent font-body text-body leading-normal text-ink placeholder:text-ink-muted focus:outline-none sm:text-body-sm"
  ></textarea>
  <p id={helperId} class="text-right font-body text-legal text-ink-muted">{field.helper}</p>
</div>
{#if error}
  <DialogFieldError id={ids.error} message={error} />
{/if}
