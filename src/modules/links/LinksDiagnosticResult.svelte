<script lang="ts">
  import ButtonCtaBrand from '@/shared/ui/ButtonCtaBrand.svelte';
  import type { UiIcon } from '@/shared/ui/types';
  import LinksDiagnosticHeading from './LinksDiagnosticHeading.svelte';
  import LinksDiagnosticScore from './LinksDiagnosticScore.svelte';
  import { areaMax, fill, type DiagnosticCopy, type DiagnosticScores } from './diagnostic';
  import type { DiagnosticArea } from './schema';

  // Paso 2 del diagnóstico: prioridad (o "Buen punto de partida" con cero "sí"), título y texto
  // del resultado, mini gráfico con las 4 áreas y la invitación "Definámoslo juntos", que se
  // mantiene también sin ganadora.
  interface Props {
    copy: Pick<DiagnosticCopy, 'result' | 'none' | 'areas' | 'questions'>;
    scores: DiagnosticScores;
    /** Área ganadora; sin ella se muestra `none`. */
    winner: DiagnosticArea | undefined;
    icon: UiIcon;
    onnext: () => void;
  }

  let { copy, scores, winner, icon, onnext }: Props = $props();

  const tag = $derived(winner ? fill(copy.result.priority, { area: winner.name }) : copy.none.tag);
  const outcome = $derived(winner ?? copy.none);
  const scoresId = $props.id();
</script>

<div class="flex flex-col gap-5">
  <div class="flex flex-col gap-3">
    <p class="w-fit rounded-pill bg-brand px-3 py-1 font-heading text-overline text-ink uppercase">{tag}</p>
    <LinksDiagnosticHeading heading={{ text: outcome.title }} level={2} />
    <p class="font-body text-body-sm/relaxed text-ink-muted">{outcome.text}</p>
  </div>

  <section aria-labelledby={scoresId} class="flex flex-col gap-2 rounded-2xl bg-stone-100 p-3">
    <h3 id={scoresId} class="px-3 pt-1 font-heading text-overline tracking-wide text-ink uppercase">{copy.result.scores.title}</h3>
    <ul class="flex flex-col gap-1">
      {#each copy.areas as area (area.key)}
        {@const max = areaMax(copy.questions, area.key)}
        <li>
          <LinksDiagnosticScore
            name={area.name}
            value={fill(copy.result.scores.value, { score: scores[area.key], max })}
            ratio={max ? scores[area.key] / max : 0}
            top={area.key === winner?.key}
          />
        </li>
      {/each}
    </ul>
  </section>

  <div class="flex flex-col gap-3 border-t border-stone-300 pt-5">
    <LinksDiagnosticHeading heading={copy.result.invite.title} level={3} />
    <p class="font-body text-body-sm/relaxed text-ink-muted">{copy.result.invite.text}</p>
    <div class="flex justify-center pt-1">
      <ButtonCtaBrand label={copy.result.invite.cta} {icon} onclick={onnext} />
    </div>
  </div>
</div>
