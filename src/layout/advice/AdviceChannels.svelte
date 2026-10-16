<script lang="ts">
  import AdviceChannelLink from './AdviceChannelLink.svelte';
  import type { AdviceData } from './advice-data';

  interface Props {
    channels: AdviceData['channels'];
  }

  let { channels }: Props = $props();

  const titleId = 'advice-channels-title';
</script>

<!-- 272:8171: alternativa sin formulario. Mobile: canales apilados; desde sm, en una fila. -->
<section aria-labelledby={titleId} class="flex flex-col gap-3 border-t border-stone-300 bg-stone-100 px-5 pt-5 pb-6 sm:px-8 sm:pb-5">
  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <h3 id={titleId} class="font-heading text-label-sm font-semibold text-ink">{channels.title}</h3>
    <p class="font-body text-legal text-ink-muted">{channels.aside}</p>
  </div>
  <div class="flex flex-col gap-2.5 sm:flex-row">
    {#each channels.items as channel (channel.label)}
      <AdviceChannelLink {channel} arrowIcon={channels.arrowIcon} />
    {/each}
  </div>
</section>
