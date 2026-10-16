<script lang="ts">
  // Etiqueta solo para lectores de pantalla: Figma muestra el nombre del campo como placeholder
  // (174:82), pero el placeholder no sustituye a una etiqueta. Svelte porque lo usa una isla.
  interface Props {
    /** id del campo que etiqueta. */
    for: string;
    text: string;
  }

  let { for: htmlFor, text }: Props = $props();
</script>

<label for={htmlFor} class="sr-only">{text}</label>
