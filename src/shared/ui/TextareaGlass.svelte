<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  // Área de texto sobre la card glass (mensaje del formulario de contacto): hermana multilínea de
  // InputGlass, mismo aspecto y error con aria-invalid="true". Sin estado propio: Svelte porque lo
  // usa una isla. Atributos nativos (id, name, rows, minlength,
  // placeholder, required, aria-invalid, aria-describedby…) pasan con ...rest.
  interface Props extends Omit<HTMLTextareaAttributes, 'class' | 'value' | 'children'> {
    /** Valor (bind:value). */
    value?: string;
    /** Elemento <textarea> (bind:ref) para mover el foco al primer campo inválido. */
    ref?: HTMLTextAreaElement;
  }

  let { value = $bindable(''), ref = $bindable(), ...rest }: Props = $props();
</script>

<!-- Alto mínimo de 4 líneas; solo se redimensiona en vertical: el ancho lo fija la card glass. -->
<textarea
  bind:this={ref}
  bind:value
  {...rest}
  class="block min-h-(--field-textarea-min-h) w-full min-w-0 resize-y rounded-field border border-glass-field bg-transparent px-(--field-pad-x) py-(--field-pad-y) font-body text-body-sm text-paper placeholder:text-line aria-invalid:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
></textarea>
