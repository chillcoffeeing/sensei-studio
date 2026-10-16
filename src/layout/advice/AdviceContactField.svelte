<script lang="ts">
  import DialogFieldError from '../dialog/DialogFieldError.svelte';
  import DialogInput from '../dialog/DialogInput.svelte';
  import { describedBy } from '../dialog/dialog-form';
  import type { AdviceData } from './advice-data';
  import { adviceIds, type AdviceFieldName } from './advice-form';

  interface Props {
    name: AdviceFieldName;
    field: AdviceData['contact']['fields']['name'];
    requiredLabel: string;
    value: string;
    error?: string;
    ref?: HTMLInputElement;
  }

  let { name, field, requiredLabel, value = $bindable(), error, ref = $bindable() }: Props = $props();

  const ids = $derived(adviceIds(name));
  const native = {
    name: { type: 'text', autocomplete: 'name' },
    email: { type: 'email', autocomplete: 'email', inputmode: 'email', spellcheck: false },
  } as const;
</script>

<!-- 272:8159: etiqueta visible encima + campo. -->
<div class="flex min-w-0 flex-1 flex-col gap-1.5">
  <label for={ids.input} class="font-body text-meta text-ink">
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
