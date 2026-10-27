<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  // Error de un envío sobre fondo oscuro. Se ve distinto de FormStatus: por eso es otro componente y
  // no un `tone`.
  // Va dentro de la región role="status" que pone la isla. Atributos nativos (data-*) con ...rest.
  interface Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'class' | 'children'> {
    message: string;
  }

  let { message, ...rest }: Props = $props();
</script>

<p {...rest} class="pt-(--form-status-gap) font-body text-body-sm text-danger">{message}</p>
