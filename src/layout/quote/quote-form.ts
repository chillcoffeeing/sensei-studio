// Lógica pura del modal de cotización (validación y envío): sin DOM salvo el `File` del adjunto.
import type { QuoteCurrencyCode, QuoteValidation } from '@/core/site';
import { isEmail, simulatedResult, submitFormData, type SubmitResult } from '../dialog/dialog-form';

export { describedBy } from '../dialog/dialog-form';

export type BudgetMode = 'range' | 'max';

export interface QuoteValues {
  services: string[];
  budgetMode: BudgetMode;
  currency: QuoteCurrencyCode;
  range: string;
  max: string;
  idea: string;
  goals: string[];
  name: string;
  email: string;
  whatsapp: string;
}

/** Campos que pueden tener error, en orden del DOM (para mover el foco al primero). */
export const QUOTE_FIELDS = ['services', 'max', 'idea', 'attachment', 'name', 'email', 'whatsapp'] as const;
export type QuoteFieldName = (typeof QUOTE_FIELDS)[number];
export type QuoteErrors = Partial<Record<QuoteFieldName, string>>;

export function emptyValues(currency: QuoteCurrencyCode): QuoteValues {
  return {
    services: [],
    budgetMode: 'range',
    currency,
    range: '',
    max: '',
    idea: '',
    goals: [],
    name: '',
    email: '',
    whatsapp: '',
  };
}

// Laxas a propósito: el formato real lo confirma quien recibe; aquí solo se evitan erratas.
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;
const AMOUNT_RE = /^\d{1,3}([.\s]?\d{3})*([,.]\d{1,2})?$/;

interface Limits {
  ideaMinLength: number;
  maxSizeMb: number;
}

const fill = (template: string, key: string, value: number) => template.replaceAll(`{${key}}`, String(value));

/** Errores por campo; objeto vacío si todo es válido. */
export function validateQuote(
  values: QuoteValues,
  file: File | undefined,
  messages: QuoteValidation,
  limits: Limits,
): QuoteErrors {
  const errors: QuoteErrors = {};
  if (values.services.length === 0) errors.services = messages.services;

  const max = values.max.trim();
  if (values.budgetMode === 'max' && max !== '' && !AMOUNT_RE.test(max)) errors.max = messages.maxInvalid;

  const idea = values.idea.trim();
  if (idea === '') errors.idea = messages.idea;
  else if (idea.length < limits.ideaMinLength) errors.idea = fill(messages.ideaShort, 'min', limits.ideaMinLength);

  if (file && file.size > limits.maxSizeMb * 1024 * 1024) errors.attachment = fill(messages.fileTooLarge, 'max', limits.maxSizeMb);

  if (values.name.trim() === '') errors.name = messages.name;

  const email = values.email.trim();
  if (email === '') errors.email = messages.email;
  else if (!isEmail(email)) errors.email = messages.emailInvalid;

  const whatsapp = values.whatsapp.trim();
  if (whatsapp !== '' && !PHONE_RE.test(whatsapp)) errors.whatsapp = messages.whatsappInvalid;

  return errors;
}

export function firstInvalid(errors: QuoteErrors): QuoteFieldName | undefined {
  return QUOTE_FIELDS.find((name) => errors[name] !== undefined);
}

/**
 * Servicios preseleccionados por un disparador (`data-quote-services="branding ux-ui"`, valores
 * separados por espacios). Solo se quedan los que existen en el modal, en su orden y sin repetir.
 */
export function presetServices(raw: string, options: readonly { value: string }[]): string[] {
  const wanted = new Set(raw.split(/\s+/).filter(Boolean));
  return options.map((option) => option.value).filter((value) => wanted.has(value));
}

export type QuoteSubmitResult = SubmitResult;

/** `?cotizacion-simulada=sent|error|unavailable`: revisa los estados sin backend (no envía nada). */
export function simulatedQuoteResult(search: string): QuoteSubmitResult | undefined {
  return simulatedResult(search, 'cotizacion-simulada');
}

/** Cuerpo del envío: multipart para poder llevar el adjunto. */
export function quoteFormData(values: QuoteValues, file: File | undefined): FormData {
  const data = new FormData();
  for (const service of values.services) data.append('services', service);
  data.append('budgetMode', values.budgetMode);
  data.append('currency', values.currency);
  if (values.budgetMode === 'range' && values.range) data.append('range', values.range);
  if (values.budgetMode === 'max' && values.max.trim()) data.append('max', values.max.trim());
  data.append('idea', values.idea.trim());
  for (const goal of values.goals) data.append('goals', goal);
  data.append('name', values.name.trim());
  data.append('email', values.email.trim());
  if (values.whatsapp.trim()) data.append('whatsapp', values.whatsapp.trim());
  if (file) data.append('attachment', file);
  return data;
}

/**
 * ÚNICO punto de envío de la cotización. Destino PENDIENTE (no hay backend): sin `endpoint`
 * responde 'unavailable' sin tocar la red; con él, POST multipart (`quoteFormData`).
 */
export function submitQuote(
  values: QuoteValues,
  file: File | undefined,
  endpoint: string | undefined,
  simulate?: QuoteSubmitResult,
): Promise<QuoteSubmitResult> {
  return submitFormData(() => quoteFormData(values, file), endpoint, simulate);
}

/** ids de un campo y de sus textos asociados (aria-describedby). */
export function quoteIds(name: string): { input: string; hint: string; error: string } {
  return { input: `quote-${name}`, hint: `quote-${name}-hint`, error: `quote-${name}-error` };
}
