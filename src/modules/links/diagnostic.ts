// Lógica pura del diagnóstico de /links: puntaje por área, área ganadora, calificación por
// presupuesto, URL de Cal.com, enlace de WhatsApp con mensaje y envío del lead a send.php (form 'diagnostic').
// Sin estado ni DOM: la isla LinksDiagnostic.svelte la llama y pinta el resultado.
import { FORM_KIND_FIELD, HONEYPOT_FIELD } from '@/core/forms';
import type { DiagnosticArea, DiagnosticAreaKey, DiagnosticQuestion, LinksDiagnostic } from './schema';

/** Copy y reglas que recibe la isla: todo menos los iconos (que llegan ya como UiIcon). */
export type DiagnosticCopy = Omit<LinksDiagnostic, 'icons'>;

/** Respuesta de cada pregunta por índice; `undefined` = aún sin responder. */
export type DiagnosticAnswers = (boolean | undefined)[];

export type DiagnosticScores = Record<DiagnosticAreaKey, number>;

/** Opciones elegidas en el paso 3 (`value` de cada grupo). */
export interface DiagnosticPicks {
  stage: string;
  start: string;
  budget: string;
}

/** Sustituye `{clave}` por su valor; las claves sin valor se dejan tal cual. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Primera palabra del nombre ("Ana Pérez" → "Ana"). */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? '';
}

/** Preguntas por área: el máximo de cada barra del gráfico (x/4). */
export function areaMax(questions: DiagnosticQuestion[], area: DiagnosticAreaKey): number {
  return questions.filter((question) => question.area === area).length;
}

/** Cada "sí" suma 1 punto al área de su pregunta. */
export function scoreAreas(questions: DiagnosticQuestion[], answers: DiagnosticAnswers): DiagnosticScores {
  const scores: DiagnosticScores = { branding: 0, ux: 0, dev: 0, email: 0 };
  questions.forEach((question, index) => {
    if (answers[index] === true) scores[question.area] += 1;
  });
  return scores;
}

/**
 * Área con más puntos. Empate: gana la primera en el orden de `areas` (Branding, UX/UI,
 * Desarrollo, Email). Sin ningún "sí" no hay ganadora (`undefined`: resultado "base sólida").
 */
export function winningArea(areas: DiagnosticArea[], scores: DiagnosticScores): DiagnosticArea | undefined {
  const max = Math.max(...areas.map((area) => scores[area.key]));
  if (max === 0) return undefined;
  return areas.find((area) => scores[area.key] === max);
}

/** Etiqueta de la opción elegida en un grupo (lo que leen el lead y las notas de Cal.com). */
export function optionLabel(options: { value: string; label: string }[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? '';
}

/** Califica solo por presupuesto: el mínimo de la opción elegida llega a `minBudget`. */
export function qualifies(copy: DiagnosticCopy, budget: string): boolean {
  const option = copy.qualify.budget.options.find((item) => item.value === budget);
  return option !== undefined && option.min >= copy.minBudget;
}

/** URL del evento de Cal.com con name, email y notes precargados; `embed` para el iframe. */
export function calUrl(link: string, params: { name: string; email: string; notes: string }, embed: boolean): string {
  const query = new URLSearchParams(params).toString();
  return `${link}?${embed ? 'embed=true&' : ''}${query}`;
}

/** Enlace wa.me con el mensaje prellenado (`?text=`). */
export function whatsappUrl(href: string, message: string): string {
  return `${href}?text=${encodeURIComponent(message)}`;
}

/** Datos del lead: los mismos nombres que FORMS['diagnostic'] de public/api/send.php. */
export interface DiagnosticLead {
  nombre: string;
  email: string;
  resultado: string;
  puntajes: string;
  etapa: string;
  inicio: string;
  inversion: string;
  califica: string;
  /** Una línea por pregunta: "Sí — ¿…?" (send.php pinta la lista una por línea). */
  respuestas: string[];
}

interface LeadInput {
  copy: DiagnosticCopy;
  answers: DiagnosticAnswers;
  scores: DiagnosticScores;
  winner: DiagnosticArea | undefined;
  picks: DiagnosticPicks;
  name: string;
  email: string;
}

export function buildLead({ copy, answers, scores, winner, picks, name, email }: LeadInput): DiagnosticLead {
  const { quiz, qualify, questions, areas, result } = copy;
  const yesNo = (value: boolean | undefined) => (value ? quiz.yes : quiz.no);
  return {
    nombre: name,
    email,
    resultado: winner ? winner.name : copy.none.tag,
    puntajes: areas
      .map((area) => `${area.short} ${fill(result.scores.value, { score: scores[area.key], max: areaMax(questions, area.key) })}`)
      .join(' · '),
    etapa: optionLabel(qualify.stage.options, picks.stage),
    inicio: optionLabel(qualify.start.options, picks.start),
    inversion: optionLabel(qualify.budget.options, picks.budget),
    califica: yesNo(qualifies(copy, picks.budget)),
    respuestas: questions.map((question, index) => `${yesNo(answers[index])} — ${question.text}`),
  };
}

/** `notes` de Cal.com: "Diagnóstico: [área] · [etapa] · Inicio: [cuándo] · Inversión: [rango]". */
export function bookingNotes(copy: DiagnosticCopy, lead: DiagnosticLead): string {
  return fill(copy.booking.notes, { area: lead.resultado, stage: lead.etapa, start: lead.inicio, budget: lead.inversion });
}

// Un servidor colgado no puede retener a la persona: pasado este tiempo, el flujo sigue.
const LEAD_TIMEOUT_MS = 8000;

/**
 * POST JSON del lead a `endpoint` (FORM_ENDPOINT). Nunca lanza: si falla, el flujo sigue igual y
 * la persona no ve ningún error (regla del PDF).
 */
export async function sendLead(endpoint: string, lead: DiagnosticLead, honeypot: string): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LEAD_TIMEOUT_MS);
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...lead, [FORM_KIND_FIELD]: 'diagnostic', [HONEYPOT_FIELD]: honeypot }),
      signal: controller.signal,
    });
  } catch {
    // Silencio a propósito: el lead se pierde, pero la persona llega a su pantalla.
  } finally {
    clearTimeout(timer);
  }
}

// Laxo a propósito (mismo criterio que los modales): solo evita erratas evidentes.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}
