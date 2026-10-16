<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  // Sin estado: Svelte porque lo usa una isla (el panel del menú mobile).
  // Atributos nativos (onclick para cerrar el panel, aria-current…) pasan con ...rest.
  interface Props extends Omit<HTMLAnchorAttributes, 'class' | 'href' | 'children'> {
    href: string;
    label: string;
  }

  let { href, label, ...rest }: Props = $props();
</script>

<!--
  Figma no diseña el menú mobile: enlace grande sobre ink con el rol de los enlaces del
  footer (174:30, 28px) paper → brand en hover, y área táctil de 44px.
-->
<a
  {href}
  {...rest}
  class="flex min-h-11 w-fit items-center font-heading text-title text-paper transition-colors duration-(--duration-fast) hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
>
  {label}
</a>
