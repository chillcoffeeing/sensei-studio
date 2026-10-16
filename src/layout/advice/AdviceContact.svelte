<script lang="ts">
  import AdviceContactField from './AdviceContactField.svelte';
  import type { AdviceData } from './advice-data';
  import type { AdviceErrors, AdviceFieldName } from './advice-form';

  interface Props {
    contact: AdviceData['contact'];
    requiredLabel: string;
    name: string;
    email: string;
    errors: AdviceErrors;
    refs: Partial<Record<AdviceFieldName, HTMLInputElement>>;
  }

  let { contact, requiredLabel, name = $bindable(), email = $bindable(), errors, refs = $bindable() }: Props = $props();
</script>

<!-- 272:8157: nombre + correo (en una fila desde sm) y la nota de obligatorios. -->
<div class="flex flex-col gap-2.5">
  <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
    <AdviceContactField name="name" field={contact.fields.name} {requiredLabel} bind:value={name} error={errors.name} bind:ref={refs.name} />
    <AdviceContactField name="email" field={contact.fields.email} {requiredLabel} bind:value={email} error={errors.email} bind:ref={refs.email} />
  </div>
  <p class="font-body text-legal text-ink-muted">{contact.note}</p>
</div>
