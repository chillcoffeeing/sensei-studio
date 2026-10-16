// Lógica pura del formulario de contacto (validación y envío): sin DOM.
import type { ContactField, ContactFieldName, ContactValidationMessages } from './schema';

export type ContactValues = Record<ContactFieldName, string>;
export type ContactErrors = Partial<Record<ContactFieldName, string>>;

/** Orden de los campos en el DOM (Figma 174:80 Nombre + Empresa, 174:85 Email; luego el mensaje). */
export const FIELD_ORDER: readonly ContactFieldName[] = ['name', 'company', 'email', 'message'];

export const EMPTY_VALUES: ContactValues = { name: '', company: '', email: '', message: '' };

// Comprobación deliberadamente laxa (algo@algo.algo, sin espacios): el formato real lo
// confirma el servidor; aquí solo se evitan erratas evidentes.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Errores por campo; objeto vacío si todo es válido. */
export function validateContact(
  values: ContactValues,
  fields: Record<ContactFieldName, ContactField>,
  messages: ContactValidationMessages,
): ContactErrors {
  const errors: ContactErrors = {};
  for (const name of FIELD_ORDER) {
    const value = values[name].trim();
    const { required, minLength } = fields[name];
    if (required && value === '') errors[name] = messages.required[name];
    else if (value !== '' && minLength !== undefined && value.length < minLength) {
      errors[name] = tooShortMessage(messages, minLength);
    }
  }
  if (!errors.email && values.email.trim() !== '' && !isValidEmail(values.email)) errors.email = messages.emailInvalid;
  return errors;
}

/** Mensaje de longitud mínima con `{min}` sustituido. */
export function tooShortMessage(messages: ContactValidationMessages, min: number): string {
  return messages.tooShort.replaceAll('{min}', String(min));
}

/** Primer campo con error en orden del DOM (para mover el foco ahí). */
export function firstInvalid(errors: ContactErrors): ContactFieldName | undefined {
  return FIELD_ORDER.find((name) => errors[name] !== undefined);
}

export function hasErrors(errors: ContactErrors): boolean {
  return firstInvalid(errors) !== undefined;
}

/** ids de un campo y de su mensaje de error (aria-describedby). */
export function fieldIds(baseId: string, name: ContactFieldName): { input: string; error: string } {
  return { input: `${baseId}-${name}`, error: `${baseId}-${name}-error` };
}

export type SubmitResult = 'sent' | 'error' | 'unavailable';

type FetchLike = (input: string, init: RequestInit) => Promise<{ ok: boolean }>;

/**
 * Handler de envío. PUNTO A CONFIRMAR: el proyecto no tiene backend de contacto.
 * - Sin `endpoint`: devuelve 'unavailable' sin tocar la red (no se finge un envío).
 * - Con `endpoint`: POST JSON con los valores recortados; 'sent' si responde 2xx.
 */
export async function submitContact(
  values: ContactValues,
  endpoint: string | undefined,
  fetchImpl: FetchLike = fetch,
): Promise<SubmitResult> {
  if (!endpoint) return 'unavailable';
  const body = JSON.stringify({
    name: values.name.trim(),
    company: values.company.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
  });
  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body,
    });
    return response.ok ? 'sent' : 'error';
  } catch {
    return 'error';
  }
}
