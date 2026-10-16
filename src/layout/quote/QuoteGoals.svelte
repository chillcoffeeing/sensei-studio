<script lang="ts">
  import QuoteGoalOption from './QuoteGoalOption.svelte';
  import type { QuoteData } from './quote-data';

  interface Props {
    goals: QuoteData['project']['goals'];
    selected: string[];
  }

  let { goals, selected = $bindable() }: Props = $props();

  const titleId = 'quote-goals-title';
  const icons = $derived({ check: goals.checkIcon, add: goals.addIcon });
</script>

<div role="group" aria-labelledby={titleId} class="flex flex-col gap-2 pt-1">
  <p id={titleId} class="font-heading text-meta font-medium text-ink">
    {goals.title} · {goals.optional}
  </p>
  <div class="flex flex-wrap gap-2">
    {#each goals.options as goal (goal.value)}
      <QuoteGoalOption {goal} {icons} bind:group={selected} />
    {/each}
  </div>
</div>
