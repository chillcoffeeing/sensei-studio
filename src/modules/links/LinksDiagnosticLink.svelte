<script lang="ts">
  import type { UiIcon } from '@/shared/ui/types';

  // Enlace secundario del diagnóstico (pestaña nueva): píldora de borde tinta a todo el ancho con
  // icono en máscara (toma el color del texto). "Abrir la agenda en otra pestaña" (4a).
  interface Props {
    href: string;
    label: string;
    /** Aviso para lectores de pantalla: abre una pestaña nueva. */
    newTab: string;
    /** Icono decorativo. */
    icon: UiIcon;
  }

  let { href, label, newTab, icon }: Props = $props();
</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  class="flex min-h-12 w-full items-center justify-center gap-2 rounded-pill border border-ink bg-paper px-5 py-2 text-center font-heading text-button-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-safe:transition-colors motion-safe:duration-(--duration-fast) motion-safe:ease-standard can-hover:hover:bg-stone-100"
>
  <span
    aria-hidden="true"
    class="block size-4 shrink-0 bg-current mask-contain mask-center mask-no-repeat"
    style={`-webkit-mask-image: url(${icon.src}); mask-image: url(${icon.src})`}
  ></span>
  {label}
  <span class="sr-only">{newTab}</span>
</a>
