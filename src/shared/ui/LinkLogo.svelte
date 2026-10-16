<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import type { UiIcon } from './types';

  // Sin estado: Svelte porque también lo usa una isla (el panel del menú mobile). Desde Astro se
  // renderiza estático (header). Atributos nativos (onclick para cerrar el panel…) con ...rest.
  interface Props extends Omit<HTMLAnchorAttributes, 'class' | 'href' | 'children'> {
    href: string;
    /** Logo (SVG vectorial: URL + dimensiones del import). */
    logo: UiIcon;
    /** Nombre accesible del enlace (alt del logo). */
    label: string;
  }

  let { href, logo, label, ...rest }: Props = $props();
</script>

<!--
  Figma 16:49: wordmark del header sobre ink, desplazado 3px a la izquierda (-ml-0.75). Área táctil
  de 44px de alto (el logo queda centrado en la fila de 40 del header: el aspecto no cambia).
-->
<a
  {href}
  {...rest}
  class="-ml-0.75 flex h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
>
  <img src={logo.src} width={logo.width} height={logo.height} alt={label} class="block" />
</a>
