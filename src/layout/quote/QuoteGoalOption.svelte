<script lang="ts">
  import type { UiIcon } from '@/shared/ui/types';
  import DialogIcon from '../dialog/DialogIcon.svelte';
  import type { QuoteData } from './quote-data';

  interface Props {
    goal: QuoteData['project']['goals']['options'][number];
    icons: { check: UiIcon; add: UiIcon };
    group: string[];
  }

  let { goal, icons, group = $bindable() }: Props = $props();

  // bind:group solo ve los checkboxes del mismo componente, y aquí cada opción es un componente.
  function toggle(checked: boolean) {
    group = checked ? [...group, goal.value] : group.filter((item) => item !== goal.value);
  }
</script>

<!-- 220:952: checkbox nativo en píldora; "+" sin marcar, check y lima al marcar. -->
<label
  class="group flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-stone-300 bg-paper px-3 py-1.5 transition-colors duration-(--duration-fast) ease-standard hover:border-stone-400 has-checked:border-ink has-checked:bg-brand has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink lg:pointer-fine:min-h-8"
>
  <input
    type="checkbox"
    checked={group.includes(goal.value)}
    onchange={(event) => toggle(event.currentTarget.checked)}
    name="goals"
    value={goal.value}
    class="sr-only"
  />
  <span class="group-has-checked:hidden" aria-hidden="true"><DialogIcon icon={icons.add} /></span>
  <span class="hidden group-has-checked:block" aria-hidden="true"><DialogIcon icon={icons.check} /></span>
  <span class="font-heading text-caption font-medium whitespace-nowrap text-ink">{goal.label}</span>
</label>
