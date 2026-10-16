<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { UiIcon } from './types';

  // Botón de pausa de lo que se mueve solo (WCAG 2.2.2). Sin estado propio: `pressed` lo decide
  // el controlador de autoplay de la isla. Atributos nativos (onclick, data-*) pasan con ...rest.
  interface Props extends Omit<HTMLButtonAttributes, 'class' | 'children' | 'aria-pressed' | 'aria-label'> {
    /** Nombre accesible fijo; el estado va en aria-pressed. */
    label: string;
    /** El usuario lo pausó (aria-pressed): muestra el icono de reanudar. */
    pressed: boolean;
    pauseIcon: UiIcon;
    playIcon: UiIcon;
  }

  let { label, pressed, pauseIcon, playIcon, ...rest }: Props = $props();

  const icon = $derived(pressed ? playIcon : pauseIcon);
</script>

<!--
  Figma no dibuja controles: círculo glass de 44 (como la card de contacto 174:75:
  fondo y borde glass) con el icono de 16 en paper. Para fondos oscuros (showcase, footer).
  La visibilidad (p. ej. solo con foco) la decide el contenedor.
-->
<button
  type="button"
  aria-label={label}
  aria-pressed={pressed}
  {...rest}
  class="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-pill border border-glass-line bg-glass text-paper transition-colors duration-(--duration-fast) ease-standard hover:bg-glass-field focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
>
  <img src={icon.src} width={icon.width} height={icon.height} alt="" class="block size-4" />
</button>
