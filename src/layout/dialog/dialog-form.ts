// Envío y ayudas de accesibilidad comunes a los formularios de los modales (cotización y asesoría).
import { FORM_KIND_FIELD, HONEYPOT_FIELD, type FormKind } from '@/core/forms';

/** 'unavailable' solo sale ya de `?…-simulada`: el destino siempre existe (core/forms FORM_ENDPOINT). */
export type SubmitResult = 'sent' | 'error' | 'unavailable';

const SIMULATED: readonly SubmitResult[] = ['sent', 'error', 'unavailable'];
const SIMULATED_DELAY_MS = 900;

/**
 * Resultado simulado pedido por la URL (`?<param>=sent|error|unavailable`), para revisar los
 * estados sin backend. No envía nada a ningún sitio.
 */
export function simulatedResult(search: string, param: string): SubmitResult | undefined {
  const value = new URLSearchParams(search).get(param);
  return SIMULATED.find((result) => result === value);
}

interface SubmitOptions {
  /** site.quote.endpoint / site.advice.endpoint (= FORM_ENDPOINT, public/api/send.php). */
  endpoint: string;
  /** Formulario que identifica send.php (asunto y campos del correo). */
  form: FormKind;
  /** Valor del campo trampa (InputHoneypot); vacío en un envío humano. */
  honeypot: string;
  /** `?…-simulada`: espera un momento y devuelve ese resultado, sin red. */
  simulate?: SubmitResult;
}

/**
 * Envío de un formulario de modal a `endpoint` (public/api/send.php): POST multipart del
 * `body` más `form` y el honeypot; 'sent' si responde 2xx, si no 'error'.
 */
export async function submitFormData(body: () => FormData, { endpoint, form, honeypot, simulate }: SubmitOptions): Promise<SubmitResult> {
  if (simulate) {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
    return simulate;
  }
  try {
    const data = body();
    data.append(FORM_KIND_FIELD, form);
    data.append(HONEYPOT_FIELD, honeypot);
    const response = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
    return response.ok ? 'sent' : 'error';
  } catch {
    return 'error';
  }
}

// Laxo a propósito: el formato real lo confirma quien recibe; aquí solo se evitan erratas.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

/** Une ids de aria-describedby ignorando los vacíos. */
export function describedBy(...ids: Array<string | false | undefined>): string | undefined {
  const list = ids.filter(Boolean).join(' ');
  return list || undefined;
}
