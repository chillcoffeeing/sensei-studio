<script lang="ts">
  import { tick } from 'svelte';
  import { track } from '@/core/analytics';
  import type { UiIcon } from '@/shared/ui/types';
  import LinksDiagnosticBooking from './LinksDiagnosticBooking.svelte';
  import LinksDiagnosticIntro from './LinksDiagnosticIntro.svelte';
  import LinksDiagnosticLater from './LinksDiagnosticLater.svelte';
  import LinksDiagnosticQualify from './LinksDiagnosticQualify.svelte';
  import LinksDiagnosticQuiz from './LinksDiagnosticQuiz.svelte';
  import LinksDiagnosticResult from './LinksDiagnosticResult.svelte';
  import {
    bookingNotes,
    buildLead,
    qualifies,
    scoreAreas,
    sendLead,
    winningArea,
    type DiagnosticAnswers,
    type DiagnosticCopy,
    type DiagnosticPicks,
  } from './diagnostic';

  // Pasos del diagnóstico gratis de /links: entrada → 16 preguntas → resultado → preclasificación →
  // agenda (4a, califica) o 3 pasos + WhatsApp (4b). Vive dentro de LinksDiagnosticDialog y todo
  // ocurre ahí, sin recargar. Al cambiar de paso: fundido (motion-safe, --duration-step), el diálogo
  // (ancestro <dialog>, su contenedor de scroll) vuelve arriba y el foco va al título del paso
  // (`[data-step-title]`). El lead se envía siempre al pulsar "Continuar"; si falla, el flujo sigue
  // sin error. Medición (core/analytics.ts): diagnostico_iniciado, diagnostico_completado
  // {resultado} y lead_enviado {califica}.
  interface Props {
    copy: DiagnosticCopy;
    icons: { cta: UiIcon; open: UiIcon; whatsapp: UiIcon };
    /** FORM_ENDPOINT (public/api/send.php). */
    endpoint: string;
  }

  let { copy, icons, endpoint }: Props = $props();

  type Step = 'intro' | 'quiz' | 'result' | 'qualify' | 'booking' | 'later';

  let step: Step = $state('intro');
  // El primer paso llega con la página: solo los siguientes hacen el fundido.
  let changed = $state(false);
  let index = $state(0);
  let answers: DiagnosticAnswers = $state([]);
  let contact = $state({ name: '', email: '', notes: '' });
  let root: HTMLDivElement | undefined = $state();

  const scores = $derived(scoreAreas(copy.questions, answers));
  const winner = $derived(winningArea(copy.areas, scores));

  async function go(next: Step) {
    step = next;
    changed = true;
    await tick();
    root?.closest('dialog')?.scrollTo({ top: 0 });
    root?.querySelector<HTMLElement>('[data-step-title]')?.focus({ preventScroll: true });
  }

  function start() {
    index = 0;
    answers = [];
    track('diagnostico_iniciado');
    go('quiz');
  }

  function answer(yes: boolean) {
    // Volver atrás y responder de nuevo reemplaza la respuesta anterior.
    answers[index] = yes;
    if (index < copy.questions.length - 1) index += 1;
    else {
      go('result');
      track('diagnostico_completado', { resultado: winner?.name ?? copy.none.tag });
    }
  }

  function back() {
    if (index > 0) index -= 1;
  }

  async function submit({ picks, name, email, honeypot }: { picks: DiagnosticPicks; name: string; email: string; honeypot: string }) {
    const lead = buildLead({ copy, answers, scores, winner, picks, name, email });
    await sendLead(endpoint, lead, honeypot);
    contact = { name, email, notes: bookingNotes(copy, lead) };
    track('lead_enviado', { califica: lead.califica });
    go(qualifies(copy, picks.budget) ? 'booking' : 'later');
  }
</script>

<div bind:this={root}>
  {#key step}
    <div class={changed ? 'motion-safe:animate-step-in' : ''}>
      {#if step === 'intro'}
        <LinksDiagnosticIntro intro={copy.intro} icon={icons.cta} onstart={start} />
      {:else if step === 'quiz'}
        <LinksDiagnosticQuiz {copy} {index} onanswer={answer} onback={back} />
      {:else if step === 'result'}
        <LinksDiagnosticResult {copy} {scores} {winner} icon={icons.cta} onnext={() => go('qualify')} />
      {:else if step === 'qualify'}
        <LinksDiagnosticQualify qualify={copy.qualify} icon={icons.cta} onsubmit={submit} />
      {:else if step === 'booking'}
        <LinksDiagnosticBooking booking={copy.booking} name={contact.name} email={contact.email} notes={contact.notes} icon={icons.open} />
      {:else}
        <LinksDiagnosticLater later={copy.later} name={contact.name} area={winner?.name ?? copy.none.tag} steps={(winner ?? copy.none).steps} icon={icons.whatsapp} arrow={icons.cta} />
      {/if}
    </div>
  {/key}
</div>
