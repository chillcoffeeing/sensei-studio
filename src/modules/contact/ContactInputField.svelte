<script lang="ts">
  import FieldError from '@/shared/ui/FieldError.svelte';
  import InputGlass from '@/shared/ui/InputGlass.svelte';
  import LabelHidden from '@/shared/ui/LabelHidden.svelte';
  import { fieldIds } from './form';
  import type { ContactField, ContactFieldName } from './schema';

  interface Props {
    /** Prefijo de los ids del formulario. */
    baseId: string;
    name: Exclude<ContactFieldName, 'message'>;
    field: ContactField;
    type: 'text' | 'email';
    autocomplete: 'name' | 'organization' | 'email';
    /** Mensaje de validación; sin él, el campo no está en error. */
    error?: string;
    value: string;
    /** El formulario mueve el foco al primer campo inválido. */
    ref?: HTMLInputElement;
  }

  let { baseId, name, field, type, autocomplete, error, value = $bindable(), ref = $bindable() }: Props = $props();

  const ids = $derived(fieldIds(baseId, name));
</script>

<div class="flex min-w-0 flex-1 flex-col">
  <LabelHidden for={ids.input} text={field.label} />
  <InputGlass
    bind:ref
    bind:value
    id={ids.input}
    {name}
    {type}
    {autocomplete}
    inputmode={type === 'email' ? 'email' : undefined}
    spellcheck={type === 'email' ? false : undefined}
    placeholder={field.label}
    required={field.required}
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={error ? ids.error : undefined}
  />
  {#if error}
    <FieldError id={ids.error} message={error} />
  {/if}
</div>
