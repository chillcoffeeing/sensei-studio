<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import type { UiIcon } from './types';

  // Logo enlazado a la home sobre ink: header y cabecera del panel del menú mobile. Sin estado:
  // Svelte porque también lo usa una isla; desde Astro se renderiza estático. Atributos nativos
  // (onclick para cerrar el panel…) con ...rest.
  interface Props extends Omit<HTMLAnchorAttributes, 'class' | 'href' | 'children'> {
    href: string;
    /** Logo (SVG vectorial: URL + dimensiones del import). */
    logo: UiIcon;
    /** Nombre accesible del enlace (alt del logo). */
    label: string;
  }

  let { href, logo, label, ...rest }: Props = $props();
</script>

<!-- Área táctil de 44px de alto: el logo queda centrado en la fila de 40 del header. -->
<a
  {href}
  {...rest}
  class="-ml-0.75 flex h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
>
  <img src={logo.src} width={logo.width} height={logo.height} alt={label} class="block" />
</a>
