<script lang="ts">
  import type { SubmitResult } from './dialog-form';

  interface Props {
    /** Texto a anunciar ('' = nada). */
    message: string;
    /** Estado que lo origina: el error y la validación van en rojo. */
    tone: SubmitResult | 'sending' | 'invalid' | undefined;
  }

  let { message, tone }: Props = $props();

  const alert = $derived(tone === 'error' || tone === 'invalid');
</script>

<!-- Región viva siempre presente: los lectores anuncian cada cambio de estado del envío. -->
<div role="status" aria-live="polite" aria-atomic="true" class="empty:hidden">
  {#if message}
    <p data-form-status={tone} class={['font-body text-body-sm', alert ? 'text-red-700' : 'text-ink']}>{message}</p>
  {/if}
</div>
