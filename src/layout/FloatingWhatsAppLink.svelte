<script lang="ts">
  import LinkIconInk from '@/shared/ui/LinkIconInk.svelte';
  import type { UiIcon } from '@/shared/ui/types';

  interface Props {
    href: string;
    label: string;
    /** Aviso para lectores de pantalla: abre una pestaña nueva (va dentro del aria-label). */
    newTab: string;
    icon: UiIcon;
  }

  let { href, label, newTab, icon }: Props = $props();
</script>

<!-- Figma 218:24: círculo ink con el logo de WhatsApp (LinkIconInk de shared/ui). -->
<LinkIconInk {href} label={`${label} ${newTab}`} {icon} />
