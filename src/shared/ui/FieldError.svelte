<script lang="ts">
  // Mensaje de error de un campo. Svelte porque lo usa una isla (el formulario de contacto).
  interface Props {
    /** id al que apunta el aria-describedby del campo. */
    id: string;
    message: string;
  }

  let { id, message }: Props = $props();
</script>

<!-- Figma no diseña errores: 12px en danger, a 5px del campo (--field-error-gap). -->
<p {id} class="pt-(--field-error-gap) font-body text-caption text-danger">{message}</p>
