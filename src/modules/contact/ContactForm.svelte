<script lang="ts">
  import { onMount, tick } from 'svelte';
  import ButtonInk from '@/shared/ui/ButtonInk.svelte';
  import FormStatus from '@/shared/ui/FormStatus.svelte';
  import FormStatusError from '@/shared/ui/FormStatusError.svelte';
  import ContactInputField from './ContactInputField.svelte';
  import ContactMessageField from './ContactMessageField.svelte';
  import {
    EMPTY_VALUES,
    firstInvalid,
    submitContact,
    validateContact,
  } from './form';
  import type { ContactErrors, ContactValues, SubmitResult } from './form';
  import type { ContactField, ContactFieldName, ContactStatusMessages, ContactValidationMessages } from './schema';

  interface Props {
    /** Prefijo de los ids de campos y mensajes. */
    baseId: string;
    fields: Record<ContactFieldName, ContactField>;
    submitLabel: string;
    validation: ContactValidationMessages;
    status: ContactStatusMessages;
    /** Sin endpoint, el envío responde 'unavailable' (ver form.ts). */
    endpoint?: string;
  }

  let { baseId, fields, submitLabel, validation, status, endpoint }: Props = $props();

  let values: ContactValues = $state({ ...EMPTY_VALUES });
  // Los errores aparecen tras el primer intento de envío; desde ahí se recalculan al escribir.
  let attempted = $state(false);
  let sending = $state(false);
  let result: SubmitResult | undefined = $state();
  type InputFieldName = Exclude<ContactFieldName, 'message'>;
  const inputs: Partial<Record<InputFieldName, HTMLInputElement>> = $state({});
  let messageRef: HTMLTextAreaElement | undefined = $state();

  const errors: ContactErrors = $derived(attempted ? validateContact(values, fields, validation) : {});
  const statusText = $derived(sending ? status.sending : result ? status[result] : '');

  // Sin JS no hay a dónde enviar: el botón se habilita al hidratar (validación y envío viven aquí).
  let hydrated = $state(false);
  onMount(() => {
    hydrated = true;
  });

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (sending) return;
    attempted = true;
    result = undefined;
    const invalid = firstInvalid(validateContact(values, fields, validation));
    if (invalid) {
      await tick();
      (invalid === 'message' ? messageRef : inputs[invalid])?.focus();
      return;
    }
    sending = true;
    result = await submitContact(values, endpoint);
    sending = false;
    if (result === 'sent') {
      values = { ...EMPTY_VALUES };
      attempted = false;
    }
  }
</script>

<!-- novalidate solo con JS: sin él, el navegador valida required y type=email por su cuenta. -->
<form
  method="post"
  action={endpoint}
  novalidate={hydrated}
  aria-busy={sending}
  class="flex flex-col gap-6"
  onsubmit={onSubmit}
>
  <div class="flex flex-col gap-3">
    <div class="flex items-start gap-3">
      <ContactInputField
        {baseId}
        name="name"
        field={fields.name}
        type="text"
        autocomplete="name"
        error={errors.name}
        bind:value={values.name}
        bind:ref={inputs.name}
      />
      <ContactInputField
        {baseId}
        name="company"
        field={fields.company}
        type="text"
        autocomplete="organization"
        error={errors.company}
        bind:value={values.company}
        bind:ref={inputs.company}
      />
    </div>
    <ContactInputField
      {baseId}
      name="email"
      field={fields.email}
      type="email"
      autocomplete="email"
      error={errors.email}
      bind:value={values.email}
      bind:ref={inputs.email}
    />
    <ContactMessageField
      {baseId}
      field={fields.message}
      error={errors.message}
      bind:value={values.message}
      bind:ref={messageRef}
    />
  </div>

  <div class="flex flex-col">
    <ButtonInk type="submit" label={submitLabel} disabled={!hydrated} aria-disabled={sending ? 'true' : undefined} />
    <div role="status" aria-live="polite" aria-atomic="true">
      {#if result === 'error' && !sending}
        <FormStatusError message={statusText} data-contact-status="error" />
      {:else if statusText}
        <FormStatus message={statusText} data-contact-status={sending ? 'sending' : result} />
      {/if}
    </div>
  </div>
</form>
