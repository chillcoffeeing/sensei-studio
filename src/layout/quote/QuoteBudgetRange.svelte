<script lang="ts">
  import type { UiIcon } from '@/shared/ui/types';
  import DialogIcon from '../dialog/DialogIcon.svelte';
  import type { QuoteData } from './quote-data';

  interface Props {
    range: QuoteData['budget']['ranges']['options'][number];
    checkIcon: UiIcon;
    group: string;
  }

  let { range, checkIcon, group = $bindable() }: Props = $props();

  // Un radio no se puede desmarcar: un segundo clic (o Space) sobre el rango elegido lo quita (es opcional).
  // Sin preventDefault: cancelar el clic hace que el navegador restaure `checked` tras el handler.
  function onclick(event: MouseEvent & { currentTarget: HTMLInputElement }) {
    if (group !== range.value) return;
    event.currentTarget.checked = false;
    group = '';
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key !== ' ' || group !== range.value) return;
    event.preventDefault();
    group = '';
  }
</script>

<!-- 220:931: radio nativo en una pastilla; el elegido pasa a ink con el check lima. -->
<label
  class="group flex min-h-11 flex-1 basis-28 cursor-pointer items-center justify-between gap-2 rounded-lg border border-stone-300 bg-paper px-3 transition-colors duration-(--duration-fast) ease-standard hover:border-stone-400 has-checked:border-ink has-checked:bg-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink lg:pointer-fine:min-h-10"
>
  <input bind:group type="radio" name="range" value={range.value} class="sr-only" {onclick} {onkeydown} />
  <span class="font-heading text-meta font-medium whitespace-nowrap text-ink group-has-checked:text-paper">{range.label}</span>
  <span class="hidden group-has-checked:block" aria-hidden="true"><DialogIcon icon={checkIcon} /></span>
</label>
