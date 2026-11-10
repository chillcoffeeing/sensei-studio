// Envío de formularios (MAIL-ENDPOINT): un único destino para todos, `public/api/send.php` en el
// propio hosting (Apache + PHP). El correo destino vive SOLO en ese script, nunca aquí.
// `astro dev` no ejecuta PHP: en local el envío responde error (los modales tienen `?…-simulada`).

/** Ruta del script que recibe todos los formularios (relativa: mismo origen). */
export const FORM_ENDPOINT = '/api/send.php';

/** Campo que identifica el formulario; send.php elige con él los campos y el asunto. */
export const FORM_KIND_FIELD = 'form';

/** Formularios que acepta send.php. */
export type FormKind = 'contact' | 'quote' | 'advice' | 'diagnostic';

/** Campo trampa oculto (shared/ui/InputHoneypot): si llega con valor, send.php lo descarta. */
export const HONEYPOT_FIELD = 'website';

/**
 * Longitud máxima por campo, igual que `FORMS` en send.php (que responde 422 si se pasa). Se
 * aplica como `maxlength` nativo para que el límite no llegue como error genérico del servidor.
 */
export const FIELD_MAX_LENGTH = {
  name: 120,
  company: 160,
  email: 254,
  whatsapp: 40,
  max: 40,
  /** Textos largos: mensaje de contacto y asesoría, idea de cotización. */
  text: 5000,
} as const;
