<script lang="ts">
  // Sin estado: Svelte porque también lo usa una isla (cabecera del modal de cotización). Desde
  // Astro se renderiza estático (sin client:*).
  interface Props {
    /** Texto de la etiqueta (se pinta en mayúsculas con CSS). */
    text: string;
  }

  let { text }: Props = $props();
</script>

<!--
  216:2881 / 220:868 / 230:1009: marcador lima cuadrado de 6px + texto 12px SemiBold en mayúsculas.
  No es el Eyebrow de la landing (punto de 14px y 16px de texto). El color se hereda del
  contenedor. Es un <span> en bloque: quien lo usa decide el elemento (suelto o dentro de un h2).
-->
<span class="flex items-center gap-2 font-heading text-overline uppercase">
  <span aria-hidden="true" class="block size-1.5 shrink-0 bg-brand"></span>
  {text}
</span>
