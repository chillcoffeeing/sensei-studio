<script lang="ts">
  import DialogSectionTitle from '../dialog/DialogSectionTitle.svelte';
  import AdviceStageOption from './AdviceStageOption.svelte';
  import type { AdviceData } from './advice-data';

  interface Props {
    stage: AdviceData['stage'];
    /** Valor elegido ('' = ninguno). */
    value: string;
  }

  let { stage, value = $bindable() }: Props = $props();

  const titleId = 'advice-stage-title';
  const hintId = 'advice-stage-hint';
</script>

<!-- 272:8129: dos tarjetas-radio; una al lado de la otra desde sm, apiladas en mobile. -->
<div role="radiogroup" aria-labelledby={titleId} aria-describedby={hintId} class="flex flex-col gap-2.5">
  <DialogSectionTitle id={titleId} title={stage.title} aside={stage.hint} asideId={hintId} />
  <div class="grid gap-2.5 sm:grid-cols-2">
    {#each stage.options as option (option.value)}
      <AdviceStageOption
        {option}
        checkedIcon={stage.checkedIcon}
        checked={value === option.value}
        onselect={(selected) => (value = selected)}
      />
    {/each}
  </div>
</div>
