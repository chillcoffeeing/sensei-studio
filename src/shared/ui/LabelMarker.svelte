<script lang="ts">
  // Rótulo con marcador lima cuadrado + mayúsculas: secciones del caso de estudio, modal de
  // cotización y /links. No es Eyebrow (punto y texto mayores). El color se hereda del contenedor.
  // Sin estado: Svelte porque también lo usa una isla; desde Astro se renderiza estático.
  interface Props {
    /** Texto de la etiqueta (se pinta en mayúsculas con CSS). */
    text: string;
  }

  let { text }: Props = $props();
</script>

<!-- <span> en bloque: quien lo usa decide el elemento (suelto, dentro de un <p> o de un <h2>). -->
<span class="flex items-center gap-2 font-heading text-overline uppercase">
  <span aria-hidden="true" class="block size-1.5 shrink-0 bg-brand"></span>
  {text}
</span>
