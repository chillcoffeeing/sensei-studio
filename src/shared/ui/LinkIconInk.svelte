<script lang="ts">
  import type { UiIcon } from './types';

  // Enlace externo representado solo por un logo: WhatsApp de la barra flotante y perfiles de
  // TeamCard. Siempre abre otra pestaña (target="_blank" + rel="noopener noreferrer").
  // Sin estado: Svelte porque también lo usa una isla; desde Astro se renderiza estático.
  interface Props {
    href: string;
    /** Nombre accesible completo (incluye el aviso de pestaña nueva): el logo es decorativo. */
    label: string;
    /** Logo monocromo (SVG): se pinta como máscara sobre bg-current, en paper. */
    icon: UiIcon;
  }

  let { href, label, icon }: Props = $props();
</script>

<!-- El anillo paper del foco se ve sobre fondos claros y oscuros (barra glass, foto del equipo). -->
<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={label}
  draggable="false"
  class="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink focus-visible:ring-4 focus-visible:ring-paper motion-safe:transition-transform motion-safe:duration-(--duration-fast) motion-safe:ease-standard can-hover:hover:-translate-y-0.5"
>
  <span
    class="block size-5 bg-current mask-contain mask-center mask-no-repeat"
    style={`-webkit-mask-image: url(${icon.src}); mask-image: url(${icon.src})`}
    aria-hidden="true"
  ></span>
</a>
