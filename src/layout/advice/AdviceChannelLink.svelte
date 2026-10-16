<script lang="ts">
  import type { UiIcon } from '@/shared/ui/types';
  import DialogIcon from '../dialog/DialogIcon.svelte';
  import type { AdviceData } from './advice-data';

  interface Props {
    channel: AdviceData['channels']['items'][number];
    arrowIcon: UiIcon;
  }

  let { channel, arrowIcon }: Props = $props();
</script>

<!-- 272:8176: icono del canal, nombre y flecha. Con `newTab` (WhatsApp) se abre en una pestaña nueva. -->
<a
  href={channel.href}
  target={channel.newTab ? '_blank' : undefined}
  rel={channel.newTab ? 'noopener noreferrer' : undefined}
  class="group flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-stone-300 bg-paper px-3.5 font-heading text-meta font-semibold text-ink transition-colors duration-(--duration-fast) ease-standard can-hover:hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
>
  <DialogIcon icon={channel.icon} />
  <span class="min-w-0 flex-1">{channel.label}</span>
  {#if channel.newTab}<span class="sr-only">{channel.newTab}</span>{/if}
  <span class="motion-safe:transition-transform motion-safe:duration-(--duration-fast) motion-safe:ease-standard motion-safe:can-hover:group-hover:translate-x-0.5 motion-safe:can-hover:group-hover:-translate-y-0.5">
    <DialogIcon icon={arrowIcon} />
  </span>
</a>
