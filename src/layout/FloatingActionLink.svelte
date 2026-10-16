<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  interface Props extends HTMLAnchorAttributes {
    href: string;
    label: string;
    /** Texto visible por debajo de sm; el nombre accesible sigue siendo `label` (contiene lo visible). */
    shortLabel: string;
    /** brand = lima (acción primaria, Figma 272:7924) · paper = sin color (secundaria, 218:22). */
    tone: 'brand' | 'paper';
  }

  let { href, label, shortLabel, tone, ...rest }: Props = $props();

  const surface = { brand: 'bg-brand', paper: 'bg-paper' }[tone];
</script>

<!--
  Píldora de la barra flotante. Los atributos extra (`data-quote-open`, `data-advice-open`) son el
  enganche con los modales globales; sin JS, `href` lleva al formulario de contacto.
-->
<a
  {href}
  {...rest}
  class="flex h-11 flex-1 items-center justify-center rounded-pill px-4 font-heading text-button whitespace-nowrap text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink focus-visible:ring-4 focus-visible:ring-paper motion-safe:transition-transform motion-safe:duration-(--duration-fast) motion-safe:ease-standard can-hover:hover:-translate-y-0.5 sm:px-5 {surface}"
>
  <span aria-hidden="true" class="sm:hidden">{shortLabel}</span>
  <span class="max-sm:sr-only">{label}</span>
</a>
