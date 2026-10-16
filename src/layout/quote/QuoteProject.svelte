<script lang="ts">
  import QuoteGoals from './QuoteGoals.svelte';
  import QuoteIdea from './QuoteIdea.svelte';
  import DialogSectionTitle from '../dialog/DialogSectionTitle.svelte';
  import type { QuoteData } from './quote-data';

  interface Props {
    project: QuoteData['project'];
    requiredLabel: string;
    idea: string;
    goals: string[];
    ideaError?: string;
    ideaRef?: HTMLTextAreaElement;
  }

  let { project, requiredLabel, idea = $bindable(), goals = $bindable(), ideaError, ideaRef = $bindable() }: Props = $props();

  const titleId = 'quote-idea-title';
</script>

<!-- 220:943: idea (textarea obligatorio, con la ayuda dentro de la caja) y objetivos opcionales. -->
<div class="flex flex-col gap-2.5">
  <DialogSectionTitle id={titleId} title={project.title} required={requiredLabel} />
  <QuoteIdea hint={project.hint} field={project.idea} bind:value={idea} error={ideaError} bind:ref={ideaRef} />
  <QuoteGoals goals={project.goals} bind:selected={goals} />
</div>
