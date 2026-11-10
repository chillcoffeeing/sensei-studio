<script lang="ts">
  // Campo trampa contra bots: fuera de la vista (sr-only), del orden de tabulación y del árbol
  // accesible (aria-hidden), así que no necesita etiqueta. Una persona nunca lo rellena; si llega
  // con valor, el servidor descarta el envío. Svelte porque lo usan las islas de formulario (el
  // valor viaja con `bind:value`). Sin `display:none`: algunos bots se saltan esos campos.
  interface Props {
    /** Nombre del campo (lo fija core/forms: HONEYPOT_FIELD). */
    name: string;
    value?: string;
  }

  let { name, value = $bindable('') }: Props = $props();
</script>

<div aria-hidden="true" class="sr-only">
  <input type="text" {name} tabindex="-1" autocomplete="off" bind:value />
</div>
