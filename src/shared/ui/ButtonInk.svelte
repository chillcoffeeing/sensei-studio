<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  // Botón píldora ink a todo el ancho sobre la card glass: enviar el formulario de contacto. Sin
  // estado propio: Svelte porque lo usa una isla. Atributos nativos (type, disabled,
  // aria-disabled, onclick…) pasan con ...rest.
  interface Props extends Omit<HTMLButtonAttributes, 'class' | 'children'> {
    label: string;
  }

  let { label, type = 'button', ...rest }: Props = $props();
</script>

<!-- Vive sobre la card glass (fondo oscuro): el foco es paper. -->
<button
  {type}
  {...rest}
  class="flex w-full cursor-pointer items-center justify-center rounded-pill bg-ink px-6 py-3.5 text-center font-heading text-button text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
>
  {label}
</button>
