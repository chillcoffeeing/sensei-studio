<script lang="ts">
  import DialogIcon from '../dialog/DialogIcon.svelte';
  import type { QuoteData } from './quote-data';

  interface Props {
    whatsapp: QuoteData['footer']['whatsapp'];
  }

  let { whatsapp }: Props = $props();
</script>

<!-- 220:990: enlace externo (mismo destino que la barra flotante: content/site.ts). -->
<a
  href={whatsapp.href}
  target="_blank"
  rel="noopener noreferrer"
  class="group flex min-h-11 w-fit items-center gap-2 rounded-md font-heading text-button text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
>
  <DialogIcon icon={whatsapp.icon} />
  <span class="underline-offset-4 can-hover:group-hover:underline">{whatsapp.label}</span>
  <span class="motion-safe:transition-transform motion-safe:duration-(--duration-fast) motion-safe:ease-standard motion-safe:can-hover:group-hover:translate-x-0.5 motion-safe:can-hover:group-hover:-translate-y-0.5">
    <DialogIcon icon={whatsapp.arrowIcon} />
  </span>
  <span class="sr-only">{whatsapp.newTab}</span>
</a>
