<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  // Error de un envío sobre fondo oscuro (el resto de estados es FormStatus).
  // Va dentro de la región role="status" que pone la isla. Atributos nativos (data-*) con ...rest.
  interface Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'class' | 'children'> {
    message: string;
  }

  let { message, ...rest }: Props = $props();
</script>

<!-- Figma no diseña errores: 14px en danger a 12px del botón (--form-status-gap). -->
<p {...rest} class="pt-(--form-status-gap) font-body text-body-sm text-danger">{message}</p>
