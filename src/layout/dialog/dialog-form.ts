// Envío y ayudas de accesibilidad comunes a los formularios de los modales (cotización y asesoría).

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

/**
 * Envío de un formulario de modal. Destino PENDIENTE mientras no haya backend:
 * - `simulate`: espera un momento y devuelve ese resultado, sin red.
 * - Sin `endpoint`: 'unavailable' sin tocar la red (no se finge un envío).
 * - Con `endpoint`: POST del `body`; 'sent' si responde 2xx, si no 'error'.
 */
export async function submitFormData(
  body: () => FormData,
  endpoint: string | undefined,
  simulate?: SubmitResult,
): Promise<SubmitResult> {
  if (simulate) {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
    return simulate;
  }
  if (!endpoint) return 'unavailable';
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: body() });
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
