<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  // Enlace grande del panel del menú mobile sobre ink. Sin estado: Svelte porque lo usa una isla.
  // Atributos nativos (onclick para cerrar el panel, aria-current…) pasan con ...rest.
  interface Props extends Omit<HTMLAnchorAttributes, 'class' | 'href' | 'children'> {
    href: string;
    label: string;
  }

  let { href, label, ...rest }: Props = $props();
</script>

<!-- Mismo rol tipográfico que los enlaces del footer (text-title) y área táctil de 44px. -->
<a
  {href}
  {...rest}
  class="flex min-h-11 w-fit items-center font-heading text-title text-paper transition-colors duration-(--duration-fast) hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
>
  {label}
</a>
