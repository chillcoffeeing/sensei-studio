<script lang="ts">
  // Modal de asesoría (Figma 272:8117): una sola isla global, montada en BaseLayout (client:idle);
  // /links (StandaloneLayout) no lo monta porque no tiene disparadores. Lo abre cualquier enlace con
  // el atributo neutro `data-advice-open` ("Solicitar asesoría" de la barra flotante, "Agenda una
  // reunión" del header y del menú mobile y del cierre de cada caso); su `href` es el destino sin
  // JS, /#contacto. Ningún módulo importa el modal: solo escriben el atributo.
  // Envío: submitAdvice (advice-form.ts) a site.advice.endpoint, PENDIENTE; estados simulables con
  // `?asesoria-simulada=sent|error|unavailable`.
  import { onMount, tick } from 'svelte';
  import DialogStatus from '../dialog/DialogStatus.svelte';
  import ModalDialog from '../dialog/ModalDialog.svelte';
  import type { SubmitResult } from '../dialog/dialog-form';
  import AdviceChannels from './AdviceChannels.svelte';
  import AdviceContact from './AdviceContact.svelte';
  import AdviceHeader from './AdviceHeader.svelte';
  import AdviceMessage from './AdviceMessage.svelte';
  import AdviceStage from './AdviceStage.svelte';
  import AdviceSubmitButton from './AdviceSubmitButton.svelte';
  import type { AdviceData } from './advice-data';
  import { emptyAdvice, firstInvalidAdvice, simulatedAdviceResult, submitAdvice, validateAdvice } from './advice-form';
  import type { AdviceErrors, AdviceFieldName, AdviceValues } from './advice-form';

  interface Props {
    advice: AdviceData;
  }

  let { advice }: Props = $props();

  const titleId = 'advice-title';

  let values: AdviceValues = $state(emptyAdvice());
  // Los errores aparecen tras el primer intento de envío; desde ahí se recalculan al escribir.
  let attempted = $state(false);
  let sending = $state(false);
  let result: SubmitResult | undefined = $state();
  let simulate: SubmitResult | undefined;
  let refs: Partial<Record<AdviceFieldName, HTMLInputElement>> = $state({});

  const errors: AdviceErrors = $derived(attempted ? validateAdvice(values, advice.validation) : {});
  const status = $derived.by(() => {
    if (sending) return { message: advice.status.sending, tone: 'sending' as const };
    if (result) return { message: advice.status[result], tone: result };
    if (firstInvalidAdvice(errors)) return { message: advice.validation.summary, tone: 'invalid' as const };
    return { message: '', tone: undefined };
  });

  function onclosed() {
    if (result === 'sent') result = undefined;
  }

  async function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    if (sending) return;
    attempted = true;
    result = undefined;
    const first = firstInvalidAdvice(validateAdvice(values, advice.validation));
    if (first) {
      await tick();
      refs[first]?.focus();
      return;
    }
    sending = true;
    result = await submitAdvice(values, advice.endpoint, simulate);
    sending = false;
    if (result === 'sent') {
      values = emptyAdvice();
      attempted = false;
    }
  }

  // Sin JS el diálogo nunca se abre: los disparadores son enlaces al formulario de contacto.
  let hydrated = $state(false);

  onMount(() => {
    hydrated = true;
    simulate = simulatedAdviceResult(window.location.search);
  });
</script>

<!-- Figma 272:8117. Diálogo, foco, cierre y disparadores: dialog/ModalDialog.svelte. -->
<ModalDialog trigger="data-advice-open" labelledby={titleId} width="md" {onclosed}>
  {#snippet children(close)}
    <div class="flex min-h-full flex-col sm:min-h-0">
      <AdviceHeader header={advice.header} {titleId} onclose={close} />

      <form
        method="post"
        action={advice.endpoint}
        novalidate={hydrated}
        aria-busy={sending}
        class="flex flex-1 flex-col gap-6 px-5 pt-6 pb-7 sm:flex-none sm:px-8"
        {onsubmit}
      >
        <AdviceStage stage={advice.stage} bind:value={values.stage} />
        <AdviceMessage message={advice.message} bind:value={values.message} />
        <AdviceContact
          contact={advice.contact}
          requiredLabel={advice.requiredLabel}
          bind:name={values.name}
          bind:email={values.email}
          {errors}
          bind:refs
        />
        <div class="flex flex-col gap-3">
          <AdviceSubmitButton submit={advice.submit} {sending} />
          <DialogStatus message={status.message} tone={status.tone} />
        </div>
      </form>

      <AdviceChannels channels={advice.channels} />
    </div>
  {/snippet}
</ModalDialog>
