<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  // Estado de un envío (enviando, enviado) sobre fondo oscuro. El error es FormStatusError.
  // Va dentro de la región role="status" que pone la isla. Atributos nativos (data-*) con ...rest.
  interface Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'class' | 'children'> {
    message: string;
  }

  let { message, ...rest }: Props = $props();
</script>

<!-- Figma no diseña el estado tras enviar: 14px paper a 12px del botón (--form-status-gap). -->
<p {...rest} class="pt-(--form-status-gap) font-body text-body-sm text-paper">{message}</p>
