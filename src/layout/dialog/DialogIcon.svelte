<script lang="ts">
  import type { UiIcon } from '@/shared/ui/types';

  // Icono decorativo de los modales (tamaño intrínseco del SVG).
  interface Props {
    icon: UiIcon;
  }

  let { icon }: Props = $props();
</script>

<img src={icon.src} width={icon.width} height={icon.height} alt="" class="block shrink-0" />
