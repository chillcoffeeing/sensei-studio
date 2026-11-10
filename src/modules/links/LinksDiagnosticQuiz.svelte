<script lang="ts">
  import { fill, type DiagnosticCopy } from './diagnostic';

  // Paso 1 del diagnóstico: una pregunta por pantalla. Barra de progreso lima sobre pista ink,
  // contador "n / 16" y área; Sí/No avanzan solos. "← Pregunta anterior" se oculta (sin mover el
  // layout) en la primera. La pregunta es el h2 del paso; al avanzar el foco se queda en el botón
  // pulsado y una región viva anuncia la pregunta nueva.
  interface Props {
    copy: Pick<DiagnosticCopy, 'quiz' | 'questions' | 'areas'>;
    /** Pregunta actual (0…15). */
    index: number;
    onanswer: (yes: boolean) => void;
    onback: () => void;
  }

  let { copy, index, onanswer, onback }: Props = $props();

  const total = $derived(copy.questions.length);
  const question = $derived(copy.questions[index]);
  const areaName = $derived(copy.areas.find((area) => area.key === question?.area)?.name ?? '');
  const counter = $derived(fill(copy.quiz.counter, { n: index + 1, total }));

  let heading: HTMLHeadingElement | undefined = $state();
  let live = $state('');

  function announce() {
    live = `${counter}. ${areaName}. ${question?.text ?? ''}`;
  }

  function answer(yes: boolean) {
    onanswer(yes);
    announce();
  }

  function back() {
    onback();
    announce();
    // En la primera pregunta el enlace se oculta: el foco no puede quedarse en él.
    if (index === 0) heading?.focus();
  }
</script>

<div class="flex flex-col gap-5">
  <div class="flex flex-col gap-2">
    <div
      role="progressbar"
      aria-label={copy.quiz.progress}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={index + 1}
      aria-valuetext={counter}
      class="h-1.5 overflow-hidden rounded-pill bg-ink"
    >
      <div
        class="h-full origin-left bg-brand motion-safe:transition-transform motion-safe:duration-(--duration-step) motion-safe:ease-standard"
        style:transform={`scaleX(${(index + 1) / total})`}
      ></div>
    </div>
    <p class="flex items-baseline justify-between gap-3 font-body text-caption text-ink-muted">
      <span class="tabular-nums">{counter}</span>
      <span class="text-right">{areaName}</span>
    </p>
  </div>

  <!-- Altura mínima = la pregunta más larga a 375px (4 líneas): los botones no saltan entre preguntas. -->
  <h2 bind:this={heading} data-step-title tabindex="-1" class="min-h-28 font-heading text-xl/snug font-semibold text-balance outline-none">
    {question?.text}
  </h2>

  <div class="grid grid-cols-2 gap-3">
    <button
      type="button"
      onclick={() => answer(true)}
      class="min-h-12 cursor-pointer rounded-pill border border-ink bg-brand px-4 font-heading text-button text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-safe:transition-transform motion-safe:duration-(--duration-fast) motion-safe:ease-standard active:scale-95"
    >
      {copy.quiz.yes}
    </button>
    <button
      type="button"
      onclick={() => answer(false)}
      class="min-h-12 cursor-pointer rounded-pill border border-ink bg-paper px-4 font-heading text-button text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-safe:transition-transform motion-safe:duration-(--duration-fast) motion-safe:ease-standard can-hover:hover:bg-stone-100 active:scale-95"
    >
      {copy.quiz.no}
    </button>
  </div>

  <button
    type="button"
    onclick={back}
    class:invisible={index === 0}
    class="mx-auto min-h-11 cursor-pointer px-2 font-body text-body-sm text-ink-muted underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink can-hover:hover:text-ink"
  >
    {copy.quiz.back}
  </button>

  <p class="sr-only" aria-live="polite">{live}</p>
</div>
