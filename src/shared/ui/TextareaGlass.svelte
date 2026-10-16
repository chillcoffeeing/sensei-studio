<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  // Hermano multilínea de InputGlass (mismo aspecto). Sin estado propio: Svelte porque lo usa
  // una isla (el formulario de contacto). Atributos nativos (id, name, rows, minlength,
  // placeholder, required, aria-invalid, aria-describedby…) pasan con ...rest.
  interface Props extends Omit<HTMLTextareaAttributes, 'class' | 'value' | 'children'> {
    /** Valor (bind:value). */
    value?: string;
    /** Elemento <textarea> (bind:ref) para mover el foco al primer campo inválido. */
    ref?: HTMLTextAreaElement;
  }

  let { value = $bindable(''), ref = $bindable(), ...rest }: Props = $props();
</script>

<!--
  Figma no diseña un área de texto: mismos tokens que InputGlass (174:81: radio 10,
  borde glass-field, padding 16 / 12, texto 14 paper, placeholder line, error danger).
  Alto mínimo --field-textarea-min-h (4 líneas); redimensionable solo en vertical para no
  romper el ancho de la card glass.
-->
<textarea
  bind:this={ref}
  bind:value
  {...rest}
  class="block min-h-(--field-textarea-min-h) w-full min-w-0 resize-y rounded-field border border-glass-field bg-transparent px-(--field-pad-x) py-(--field-pad-y) font-body text-body-sm text-paper placeholder:text-line aria-invalid:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
></textarea>
