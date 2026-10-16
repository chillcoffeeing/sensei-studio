<script lang="ts">
  import type { BudgetMode } from './quote-form';

  interface Props {
    labels: { label: string; range: string; max: string };
    mode: BudgetMode;
  }

  let { labels, mode = $bindable() }: Props = $props();

  const options: BudgetMode[] = ['range', 'max'];
</script>

<!-- 220:921: control segmentado = dos radios nativos; el activo es la pastilla blanca con borde. -->
<div role="radiogroup" aria-label={labels.label} class="flex min-w-0 flex-1 gap-1 rounded-lg bg-stone-100 p-1">
  {#each options as option (option)}
    <label
      class="flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-md border border-transparent px-1.5 py-1 text-center leading-tight font-heading text-caption text-ink-muted transition-colors duration-(--duration-fast) ease-standard hover:text-ink has-checked:border-stone-300 has-checked:bg-paper has-checked:font-semibold has-checked:text-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-ink lg:pointer-fine:min-h-9"
    >
      <input bind:group={mode} type="radio" name="budgetMode" value={option} class="sr-only" />
      {labels[option]}
    </label>
  {/each}
</div>
