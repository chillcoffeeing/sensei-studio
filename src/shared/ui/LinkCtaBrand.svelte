<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import CtaBrandShape from './CtaBrandShape.svelte';
  import type { UiIcon } from './types';

  // CTA principal del sitio: píldora brand + círculo con la flecha (header y menú mobile); en hover
  // y foco se funden (CtaBrandShape). Sin estado: Svelte porque también lo usa una isla; desde Astro
  // se renderiza estático. Atributos nativos del enlace (onclick, aria-*, data-*) pasan con ...rest.
  interface Props extends Omit<HTMLAnchorAttributes, 'class' | 'href' | 'children'> {
    href: string;
    label: string;
    /** Flecha del círculo (decorativa: alt vacío). */
    icon: UiIcon;
  }

  let { href, label, icon, ...rest }: Props = $props();
</script>

<!-- Área táctil de 44px alrededor de la fila de 40: en el header sobresale sin mover el nav. -->
<a
  {href}
  {...rest}
  class="group/cta flex min-h-11 w-fit items-center rounded-pill focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
>
  <CtaBrandShape {label} {icon} />
</a>
