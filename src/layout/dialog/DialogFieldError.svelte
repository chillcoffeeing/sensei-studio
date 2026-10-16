<script lang="ts">
  // Error de un campo sobre la superficie clara de los modales (FieldError de la librería es para fondo oscuro).
  interface Props {
    id: string;
    message: string;
  }

  let { id, message }: Props = $props();
</script>

<p {id} class="font-body text-caption text-red-700">{message}</p>
