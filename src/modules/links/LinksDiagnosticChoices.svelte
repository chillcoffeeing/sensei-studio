<script lang="ts">
  import LinksDiagnosticChip from './LinksDiagnosticChip.svelte';
  import type { DiagnosticChoiceGroup } from './schema';

  // Pregunta de selección única del paso 3: fieldset + legend con los chips en filas que saltan
  // de línea según el ancho.
  interface Props {
    /** `name` de los radios (lo usa la isla para llevar el foco al primer grupo sin respuesta). */
    name: string;
    group: DiagnosticChoiceGroup;
    value: string;
    invalid: boolean;
    /** id del mensaje de error del formulario (aria-describedby cuando falta la respuesta). */
    errorId: string;
  }

  let { name, group, value = $bindable(), invalid, errorId }: Props = $props();
</script>

<fieldset class="min-w-0" aria-describedby={invalid ? errorId : undefined}>
  <legend class="mb-2.5 font-heading text-label-sm font-semibold text-ink">
    {group.legend}{#if group.hint}{' '}<span class="font-body font-normal text-ink-muted">{group.hint}</span>{/if}
  </legend>
  <div class="flex flex-wrap gap-2">
    {#each group.options as option (option.value)}
      <LinksDiagnosticChip {name} value={option.value} label={option.label} bind:group={value} {invalid} />
    {/each}
  </div>
</fieldset>
