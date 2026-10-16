<script lang="ts">
  import QuoteContactField from './QuoteContactField.svelte';
  import DialogSectionTitle from '../dialog/DialogSectionTitle.svelte';
  import type { QuoteData } from './quote-data';
  import type { QuoteErrors } from './quote-form';

  type ContactName = 'name' | 'email' | 'whatsapp';

  interface Props {
    contact: QuoteData['contact'];
    requiredLabel: string;
    name: string;
    email: string;
    whatsapp: string;
    errors: Pick<QuoteErrors, ContactName>;
    refs: Partial<Record<ContactName, HTMLInputElement>>;
  }

  let {
    contact,
    requiredLabel,
    name = $bindable(),
    email = $bindable(),
    whatsapp = $bindable(),
    errors,
    refs = $bindable(),
  }: Props = $props();

  const titleId = 'quote-contact-title';
  const noteId = 'quote-contact-note';
</script>

<!-- 220:975: nombre + email en una fila desde sm, WhatsApp debajo y la nota. -->
<div role="group" aria-labelledby={titleId} aria-describedby={noteId} class="flex flex-col gap-2.5">
  <DialogSectionTitle id={titleId} title={contact.title} />
  <div class="flex flex-col gap-2.5 sm:flex-row sm:items-start">
    <QuoteContactField
      name="name"
      field={contact.fields.name}
      {requiredLabel}
      bind:value={name}
      error={errors.name}
      bind:ref={refs.name}
    />
    <QuoteContactField
      name="email"
      field={contact.fields.email}
      {requiredLabel}
      bind:value={email}
      error={errors.email}
      bind:ref={refs.email}
    />
  </div>
  <QuoteContactField
    name="whatsapp"
    field={contact.fields.whatsapp}
    {requiredLabel}
    bind:value={whatsapp}
    error={errors.whatsapp}
    bind:ref={refs.whatsapp}
  />
  <p id={noteId} class="font-body text-legal text-ink-muted">{contact.note}</p>
</div>
