<script lang="ts">
  import { onMount, tick } from 'svelte';
  import ModalDialog from '../dialog/ModalDialog.svelte';
  import QuoteAttachment from './QuoteAttachment.svelte';
  import QuoteBudget from './QuoteBudget.svelte';
  import QuoteContact from './QuoteContact.svelte';
  import QuoteFooter from './QuoteFooter.svelte';
  import QuoteHeader from './QuoteHeader.svelte';
  import QuoteProject from './QuoteProject.svelte';
  import QuoteServices from './QuoteServices.svelte';
  import type { QuoteData } from './quote-data';
  import { emptyValues, firstInvalid, presetServices, simulatedQuoteResult, submitQuote, validateQuote } from './quote-form';
  import type { QuoteErrors, QuoteFieldName, QuoteSubmitResult, QuoteValues } from './quote-form';

  interface Props {
    quote: QuoteData;
  }

  let { quote }: Props = $props();

  const titleId = 'quote-title';

  let values: QuoteValues = $state(emptyValues(quote.budget.currency.defaultCode));
  let file: File | undefined = $state();
  // Los errores aparecen tras el primer intento de envío; desde ahí se recalculan al escribir.
  let attempted = $state(false);
  let sending = $state(false);
  let result: QuoteSubmitResult | undefined = $state();
  let simulate: QuoteSubmitResult | undefined;

  let servicesRef: HTMLInputElement | undefined = $state();
  let maxRef: HTMLInputElement | undefined = $state();
  let ideaRef: HTMLTextAreaElement | undefined = $state();
  let attachmentRef: HTMLInputElement | undefined = $state();
  let contactRefs: Partial<Record<'name' | 'email' | 'whatsapp', HTMLInputElement>> = $state({});

  const limits = $derived({ ideaMinLength: quote.project.idea.minLength, maxSizeMb: quote.attachment.maxSizeMb });
  const errors: QuoteErrors = $derived(attempted ? validateQuote(values, file, quote.validation, limits) : {});
  const invalid = $derived(firstInvalid(errors) !== undefined);
  const status = $derived.by(() => {
    if (sending) return { message: quote.status.sending, tone: 'sending' as const };
    if (result) return { message: quote.status[result], tone: result };
    if (invalid) return { message: quote.validation.summary, tone: 'invalid' as const };
    return { message: '', tone: undefined };
  });

  // Preselección (LINKS-PAGE): si el disparador trae data-quote-services, el modal abre con
  // exactamente esos servicios marcados. Sin el atributo, la selección no se toca.
  function onopen(trigger: HTMLElement) {
    const preset = trigger.dataset.quoteServices;
    if (preset !== undefined) values.services = presetServices(preset, quote.services.options);
  }

  function onclosed() {
    if (result === 'sent') result = undefined;
  }

  function focusField(name: QuoteFieldName) {
    const target: Record<QuoteFieldName, HTMLElement | undefined> = {
      services: servicesRef,
      max: maxRef,
      idea: ideaRef,
      attachment: attachmentRef,
      name: contactRefs.name,
      email: contactRefs.email,
      whatsapp: contactRefs.whatsapp,
    };
    target[name]?.focus();
  }

  async function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    if (sending) return;
    attempted = true;
    result = undefined;
    const first = firstInvalid(validateQuote(values, file, quote.validation, limits));
    if (first) {
      await tick();
      focusField(first);
      return;
    }
    sending = true;
    result = await submitQuote(values, file, quote.endpoint, simulate);
    sending = false;
    if (result === 'sent') {
      values = emptyValues(quote.budget.currency.defaultCode);
      file = undefined;
      if (attachmentRef) attachmentRef.value = '';
      attempted = false;
    }
  }

  // Sin JS el formulario no tiene a dónde ir: el botón de envío solo existe en el diálogo, que
  // únicamente se abre con JS. Sin JS, los disparadores son enlaces al formulario de contacto.
  let hydrated = $state(false);

  onMount(() => {
    hydrated = true;
    simulate = simulatedQuoteResult(window.location.search);
  });
</script>

<!-- Figma 220:867. Diálogo, foco, cierre y disparadores: dialog/ModalDialog.svelte. -->
<ModalDialog trigger="data-quote-open" labelledby={titleId} width="lg" mobile="card" {onopen} {onclosed}>
  {#snippet children(close)}
      <form method="post" action={quote.endpoint} novalidate={hydrated} aria-busy={sending} class="flex flex-col" {onsubmit}>
        <QuoteHeader header={quote.header} {titleId} onclose={close} />

        <div class="grid gap-8 px-5 pt-6 pb-7 sm:px-8 lg:grid-cols-2">
          <div class="flex min-w-0 flex-col gap-6">
            <QuoteServices
              services={quote.services}
              requiredLabel={quote.requiredLabel}
              bind:selected={values.services}
              error={errors.services}
              bind:firstRef={servicesRef}
            />
            <QuoteBudget
              budget={quote.budget}
              bind:mode={values.budgetMode}
              bind:currency={values.currency}
              bind:range={values.range}
              bind:max={values.max}
              maxError={errors.max}
              bind:maxRef
            />
          </div>

          <div class="flex min-w-0 flex-col gap-6">
            <QuoteProject
              project={quote.project}
              requiredLabel={quote.requiredLabel}
              bind:idea={values.idea}
              bind:goals={values.goals}
              ideaError={errors.idea}
              bind:ideaRef
            />
            <QuoteAttachment attachment={quote.attachment} bind:file error={errors.attachment} bind:ref={attachmentRef} />
            <QuoteContact
              contact={quote.contact}
              requiredLabel={quote.requiredLabel}
              bind:name={values.name}
              bind:email={values.email}
              bind:whatsapp={values.whatsapp}
              errors={{ name: errors.name, email: errors.email, whatsapp: errors.whatsapp }}
              bind:refs={contactRefs}
            />
          </div>
        </div>

        <QuoteFooter footer={quote.footer} {sending} {status} />
      </form>
  {/snippet}
</ModalDialog>
