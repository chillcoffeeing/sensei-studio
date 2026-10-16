<script lang="ts">
  import ButtonCtaBrand from '@/shared/ui/ButtonCtaBrand.svelte';
  import type { QuoteData } from './quote-data';

  interface Props {
    submit: QuoteData['footer']['submit'];
    /** Mientras se envía: aria-disabled (sigue enfocable y el lector anuncia el estado). */
    sending: boolean;
  }

  let { submit, sending }: Props = $props();
</script>

<!-- 220:994 con la anatomía del CTA del header (píldora + círculo, hover líquido). -->
<ButtonCtaBrand type="submit" label={submit.label} icon={submit.icon} aria-disabled={sending ? 'true' : undefined} />
