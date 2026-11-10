// Medición sin dependencias: cada evento es un `window.dataLayer.push({ event, ...datos })`, el
// contrato de Google Tag Manager / GA4. No carga GTM: si el contenedor no está instalado (ID
// pendiente, design/content-gaps.md), los eventos se acumulan en el array y nadie los lee.
// Clics: el atributo `data-track="<evento>"` en cualquier elemento + `trackClicks()` una vez por
// página (un solo listener delegado en `document`).

/** Eventos y sus datos (`undefined` = sin datos). Nombres del PDF del linktree de Natalia. */
export interface AnalyticsEvents {
  clic_diagnostico: undefined;
  clic_cotizar: undefined;
  diagnostico_iniciado: undefined;
  /** `resultado`: nombre del área ganadora o "Buen punto de partida". */
  diagnostico_completado: { resultado: string };
  /** `califica`: "Sí" / "No" (el mismo valor que lleva el lead). */
  lead_enviado: { califica: string };
  clic_whatsapp: undefined;
  clic_proyectos: undefined;
  clic_whatsapp_cotizar: undefined;
  /** Envío válido del modal de cotización ("Solicitar cotización"), en cualquier página. */
  cotizacion_continuar: undefined;
}

export type AnalyticsEvent = keyof AnalyticsEvents;

/** Eventos sin datos: los únicos que se pueden declarar con `data-track`. */
export type ClickEvent = { [K in AnalyticsEvent]: AnalyticsEvents[K] extends undefined ? K : never }[AnalyticsEvent];

const CLICK_EVENTS: readonly ClickEvent[] = [
  'clic_diagnostico',
  'clic_cotizar',
  'diagnostico_iniciado',
  'clic_whatsapp',
  'clic_proyectos',
  'clic_whatsapp_cotizar',
  'cotizacion_continuar',
];

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Empuja un evento a `window.dataLayer` (lo crea si no existe). No hace nada en el servidor. */
export function track<K extends AnalyticsEvent>(
  event: K,
  ...[data]: AnalyticsEvents[K] extends undefined ? [] : [AnalyticsEvents[K]]
): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...data });
}

const isClickEvent = (value: string | undefined): value is ClickEvent =>
  value !== undefined && (CLICK_EVENTS as readonly string[]).includes(value);

let listening = false;

/** Registra (una sola vez) el listener delegado de `[data-track]`. Un valor desconocido se ignora. */
export function trackClicks(): void {
  if (listening || typeof document === 'undefined') return;
  listening = true;
  document.addEventListener('click', (event) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>('[data-track]');
    const name = target?.dataset.track;
    if (isClickEvent(name)) track(name);
  });
}
