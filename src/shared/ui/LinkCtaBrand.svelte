<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import CtaBrandShape from './CtaBrandShape.svelte';
  import type { UiIcon } from './types';

  // Sin estado: Svelte porque también lo usa una isla (el menú mobile). Desde Astro se renderiza
  // estático (sin client:*). Atributos nativos del enlace (onclick, aria-*) pasan con ...rest.
  interface Props extends Omit<HTMLAnchorAttributes, 'class' | 'href' | 'children'> {
    href: string;
    label: string;
    /** Flecha del círculo (decorativa: alt vacío). */
    icon: UiIcon;
  }

  let { href, label, icon, ...rest }: Props = $props();
</script>

<!--
  Figma 11:31: píldora brand de 193 × 40 + gap 5 + círculo brand de 40 con la flecha; en hover y
  foco se funden (CtaBrandShape). Área táctil de 44px alrededor (el aspecto no cambia).
-->
<a
  {href}
  {...rest}
  class="group/cta flex min-h-11 w-fit items-center rounded-pill focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
>
  <CtaBrandShape {label} {icon} />
</a>
