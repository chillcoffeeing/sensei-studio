// Lógica pura del modal de asesoría (validación y envío), sin DOM. `submitAdvice` es el ÚNICO punto
// de envío: destino site.advice.endpoint, PENDIENTE mientras no haya backend (sin endpoint responde
// 'unavailable' sin tocar la red); POST multipart con `stage`, `message`, `name` y `email`.
// `?asesoria-simulada=sent|error|unavailable` revisa los estados sin enviar.
import type { SiteAdvice } from '@/core/site';
import { isEmail, simulatedResult, submitFormData, type SubmitResult } from '../dialog/dialog-form';

export interface AdviceValues {
  /** Situación de partida ('' = sin elegir; no es obligatoria). */
  stage: string;
  message: string;
  name: string;
  email: string;
}

/** Campos que pueden tener error, en orden del DOM (para mover el foco al primero). */
export const ADVICE_FIELDS = ['name', 'email'] as const;
export type AdviceFieldName = (typeof ADVICE_FIELDS)[number];
export type AdviceErrors = Partial<Record<AdviceFieldName, string>>;

export function emptyAdvice(): AdviceValues {
  return { stage: '', message: '', name: '', email: '' };
}

/** Errores por campo; objeto vacío si todo es válido. */
export function validateAdvice(values: AdviceValues, messages: SiteAdvice['validation']): AdviceErrors {
  const errors: AdviceErrors = {};
  if (values.name.trim() === '') errors.name = messages.name;
  const email = values.email.trim();
  if (email === '') errors.email = messages.email;
  else if (!isEmail(email)) errors.email = messages.emailInvalid;
  return errors;
}

export function firstInvalidAdvice(errors: AdviceErrors): AdviceFieldName | undefined {
  return ADVICE_FIELDS.find((name) => errors[name] !== undefined);
}

/** `?asesoria-simulada=sent|error|unavailable`: revisa los estados sin backend (no envía nada). */
export function simulatedAdviceResult(search: string): SubmitResult | undefined {
  return simulatedResult(search, 'asesoria-simulada');
}

/** Cuerpo del envío (multipart, como la cotización). */
export function adviceFormData(values: AdviceValues): FormData {
  const data = new FormData();
  if (values.stage) data.append('stage', values.stage);
  if (values.message.trim()) data.append('message', values.message.trim());
  data.append('name', values.name.trim());
  data.append('email', values.email.trim());
  return data;
}

/**
 * ÚNICO punto de envío de la asesoría. Destino PENDIENTE (no hay backend): sin `endpoint`
 * responde 'unavailable' sin tocar la red; con él, POST multipart (`adviceFormData`).
 */
export function submitAdvice(values: AdviceValues, endpoint: string | undefined, simulate?: SubmitResult): Promise<SubmitResult> {
  return submitFormData(() => adviceFormData(values), endpoint, simulate);
}

/** ids de un campo y de sus textos asociados (aria-describedby). */
export function adviceIds(name: string): { input: string; hint: string; error: string } {
  return { input: `advice-${name}`, hint: `advice-${name}-hint`, error: `advice-${name}-error` };
}
