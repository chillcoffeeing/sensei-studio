<script lang="ts">
  import DialogSectionTitle from '../dialog/DialogSectionTitle.svelte';
  import type { AdviceData } from './advice-data';
  import { adviceIds } from './advice-form';

  interface Props {
    message: AdviceData['message'];
    value: string;
  }

  let { message, value = $bindable() }: Props = $props();

  const ids = adviceIds('message');
  const titleId = 'advice-message-title';
</script>

<!-- 272:8150: textarea opcional con la ayuda dentro de la caja (abajo a la derecha). -->
<div class="flex flex-col gap-2.5">
  <DialogSectionTitle id={titleId} title={message.title} aside={message.optional} />
  <div
    class="flex flex-col gap-1 rounded-xl border border-stone-400 bg-stone-100 p-3 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
  >
    <label for={ids.input} class="sr-only">{message.label}</label>
    <textarea
      bind:value
      id={ids.input}
      name="message"
      rows="2"
      placeholder={message.placeholder}
      aria-describedby={ids.hint}
      class="min-h-12 w-full resize-y bg-transparent font-body text-body leading-snug text-ink placeholder:text-ink-muted focus:outline-none sm:text-body-sm"
    ></textarea>
    <p id={ids.hint} class="text-right font-body text-legal text-ink-muted">{message.helper}</p>
  </div>
</div>
