<script lang="ts">
  import DialogStatus from '../dialog/DialogStatus.svelte';
  import QuoteSubmitButton from './QuoteSubmitButton.svelte';
  import QuoteWhatsAppLink from './QuoteWhatsAppLink.svelte';
  import type { QuoteData } from './quote-data';
  import type { QuoteSubmitResult } from './quote-form';

  interface Props {
    footer: QuoteData['footer'];
    sending: boolean;
    status: { message: string; tone: QuoteSubmitResult | 'sending' | 'invalid' | undefined };
  }

  let { footer, sending, status }: Props = $props();
</script>

<!--
  220:987: alternativa por WhatsApp a la izquierda y envío a la derecha; en mobile se apilan y el
  botón ocupa el ancho. Desde sm queda pegado abajo para que el envío esté siempre a mano.
-->
<div class="flex flex-col gap-3 border-t border-stone-300 bg-stone-100 px-5 py-5 sm:sticky sm:bottom-0 sm:px-8">
  <DialogStatus message={status.message} tone={status.tone} />
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex flex-col gap-0.5">
      <p class="font-body text-caption text-ink-muted">{footer.alternative}</p>
      <QuoteWhatsAppLink whatsapp={footer.whatsapp} />
    </div>
    <QuoteSubmitButton submit={footer.submit} {sending} />
  </div>
</div>
