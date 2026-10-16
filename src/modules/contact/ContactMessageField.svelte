<script lang="ts">
  import FieldError from '@/shared/ui/FieldError.svelte';
  import LabelHidden from '@/shared/ui/LabelHidden.svelte';
  import TextareaGlass from '@/shared/ui/TextareaGlass.svelte';
  import { fieldIds } from './form';
  import type { ContactField } from './schema';

  interface Props {
    /** Prefijo de los ids del formulario. */
    baseId: string;
    field: ContactField;
    /** Mensaje de validación; sin él, el campo no está en error. */
    error?: string;
    value: string;
    /** El formulario mueve el foco al primer campo inválido. */
    ref?: HTMLTextAreaElement;
  }

  let { baseId, field, error, value = $bindable(), ref = $bindable() }: Props = $props();

  const ids = $derived(fieldIds(baseId, 'message'));
</script>

<!-- SEC-CONTACT-MESSAGE (sin Figma): área de texto con el aspecto de InputGlass, bajo Email. -->
<div class="flex min-w-0 flex-col">
  <LabelHidden for={ids.input} text={field.label} />
  <TextareaGlass
    bind:ref
    bind:value
    id={ids.input}
    name="message"
    rows={4}
    minlength={field.minLength}
    placeholder={field.label}
    required={field.required}
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={error ? ids.error : undefined}
  />
  {#if error}
    <FieldError id={ids.error} message={error} />
  {/if}
</div>
