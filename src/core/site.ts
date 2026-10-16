// Chrome compartido por todas las páginas: header y footer.
// El tipo vive en core porque layout lo consume y no puede importar content;
// los datos están en content/site.ts.
import type { ImageMetadata } from 'astro';
import type { LocalImageRef, Link, ImageRef } from '@/core/content';

/** Enlace del nav principal. `opensQuote`: con JS abre el modal de cotización (`data-quote-open`). */
export interface SiteNavItem extends Link {
  opensQuote?: true;
}

export interface SiteHeader {
  /** Logo enlazado a la home. `alt` es el nombre accesible del enlace. */
  logo: LocalImageRef & { href: string };
  /** Nombre accesible del `<nav>` principal. */
  navLabel: string;
  nav: SiteNavItem[];
  /** CTA píldora + botón círculo con flecha (decorativa). `opensAdvice`: con JS abre el modal de asesoría (`data-advice-open`). */
  cta: Link & { icon: LocalImageRef; opensAdvice?: true };
  /** Textos del botón del menú mobile. */
  menu: { open: string; close: string };
}

/** Enlace del footer. Sin `href` se muestra como texto (destino aún sin definir). */
export interface FooterLink {
  label: string;
  href?: string;
  /** Texto oculto para lectores de pantalla: si existe, el enlace es externo y abre otra pestaña. */
  newTab?: string;
}

/** Columna de enlaces del footer (174:28, 174:35, 174:42): título en mayúsculas + pila de enlaces. */
export interface FooterLinkColumn {
  title: string;
  links: FooterLink[];
}

/** Línea de meta: texto en gris + nombre destacado en blanco (174:53, 174:54). */
export interface FooterCredit {
  prefix: string;
  name: string;
}

/** Columna del estudio (174:48). */
export interface FooterStudio {
  title: string;
  /** Frase principal (174:51, en blanco). */
  description: string;
  /** Continuación de la frase en gris (174:51, segundo tramo). */
  descriptionAside?: string;
  credits: FooterCredit[];
  /** Enlaces secundarios separados por una línea vertical (174:55). */
  legal: FooterLink[];
}

/** Tarjeta de la galería del footer: decorativa (se pinta con alt vacío). */
export interface FooterGalleryCard {
  image: ImageRef;
}

/** Galería decorativa del footer (174:72) que gira como una rueda (MOT-FOOTER). */
export interface FooterGallery {
  /** Las 4 tarjetas de Figma (174:67-174:70), en orden: es la composición estática. */
  cards: FooterGalleryCard[];
  /**
   * Tarjetas que esperan fuera de la vista y entran por la izquierda al girar. La primera es la
   * siguiente en entrar. Solo se pintan cuando la rueda gira (sin JS / reduced motion, no).
   */
  incoming: FooterGalleryCard[];
  /** Nombre accesible del botón de pausa de la rueda (estado en aria-pressed). */
  pauseLabel: string;
  pauseIcon: LocalImageRef;
  playIcon: LocalImageRef;
}

export interface SiteFooter {
  /** Nombre accesible del <nav> del footer. */
  navLabel: string;
  columns: FooterLinkColumn[];
  studio: FooterStudio;
  /** Galería de imágenes rotadas (174:72): decorativas, se pintan con alt vacío. */
  gallery: FooterGallery;
}

/** Imagen para compartir (Open Graph / Twitter). Vive en public/: se sirve tal cual, sin hash. */
export interface ShareImage {
  /** Ruta absoluta desde la raíz (`/og-image.png`); BaseLayout la resuelve contra `site`. */
  path: string;
  alt: string;
  width: number;
  height: number;
}

/** Metadatos comunes a todas las páginas (head y JSON-LD; docs/seo.md §1). */
export interface SiteMeta {
  /** og:site_name y nombre de la Organization. */
  name: string;
  /** og:locale (`es_ES`). */
  locale: string;
  /** Idioma BCP 47 del contenido (`inLanguage` del JSON-LD). */
  language: string;
  /** Plantilla de título de las páginas derivadas: `{title}` se sustituye (`{title} · Sensei Studio`). */
  titleTemplate: string;
  /** Correo público del estudio (Organization.email). */
  email: string;
  /** Logo de la Organization (se emite como URL absoluta): PNG cuadrado ≥ 112 px sobre fondo sólido. */
  logo: ImageMetadata;
  /** `<meta name="theme-color">`: el mismo que `theme_color` de public/site.webmanifest. */
  themeColor: string;
  /** Perfiles públicos (Organization.sameAs): URLs absolutas. Las mismas redes del footer (solo las que tienen URL). */
  sameAs: string[];
  /** Zonas a las que se presta servicio (ProfessionalService.areaServed). */
  areaServed: string[];
  /** og:image por defecto cuando la página no define `seo.ogImage`. */
  shareImage: ShareImage;
}

/**
 * Barra flotante global (Figma 218:21): cotizar + asesoría + WhatsApp, fija abajo y centrada
 * (layout/FloatingBar.svelte). Se oculta sobre las zonas `[data-floating-bar-avoid]`.
 */
export interface SiteFloatingBar {
  /** Nombre accesible del bloque (landmark `aside`). */
  label: string;
  /** "Cotizar proyecto": `href` es el destino sin JS; con JS lo abre QTE-MODAL (`data-quote-open`). */
  quote: FloatingBarAction;
  /** "Solicitar asesoría": `href` es el destino sin JS; con JS lo abre ADV-MODAL (`data-advice-open`). */
  advice: FloatingBarAction;
  /** Enlace externo a WhatsApp (pestaña nueva). */
  whatsapp: Link & {
    icon: LocalImageRef;
    /** Aviso para lectores de pantalla: el enlace abre una pestaña nueva. */
    newTab: string;
  };
}

/** Acción de la barra flotante. `shortLabel`: texto visible en mobile (el nombre accesible sigue siendo `label`). */
export interface FloatingBarAction extends Link {
  shortLabel: string;
}

export interface SiteChrome {
  meta: SiteMeta;
  header: SiteHeader;
  floatingBar: SiteFloatingBar;
  quote: SiteQuote;
  advice: SiteAdvice;
  footer: SiteFooter;
}

/** Opción de un grupo de selección del modal de cotización (valor enviado + texto visible). */
export interface QuoteOption {
  value: string;
  label: string;
}

/** Servicio seleccionable (220:893): icono decorativo + nombre. */
export interface QuoteService extends QuoteOption {
  icon: LocalImageRef;
}

/** Cabecera del modal (220:868): rótulo, cierre, título y entradilla. */
export interface QuoteHeader {
  eyebrow: string;
  title: string;
  lead: string;
  close: { label: string; icon: LocalImageRef };
}

/** Contador de seleccionados. `many` lleva `{n}`. */
export interface QuoteCount {
  none: string;
  one: string;
  many: string;
}

/** Selección de servicios (220:886). Obligatoria: al menos uno. */
export interface QuoteServices {
  title: string;
  hint: string;
  count: QuoteCount;
  options: QuoteService[];
  checkIcon: LocalImageRef;
}

/** Monedas de la cotización (decisión 2026-10-09). `CRYPTO` es una opción genérica, sin token. */
export type QuoteCurrencyCode = 'USD' | 'EUR' | 'MXN' | 'CRYPTO';

export interface QuoteCurrencyOption {
  value: QuoteCurrencyCode;
  label: string;
}

/** Presupuesto (220:916): modo rango / monto máximo, moneda y rangos. Opcional. */
export interface QuoteBudget {
  title: string;
  optional: string;
  modes: { label: string; range: string; max: string };
  /** `defaultCode` es la opción elegida al abrir; `options` va en el orden en que se muestran. */
  currency: { label: string; defaultCode: QuoteCurrencyCode; options: QuoteCurrencyOption[]; icon: LocalImageRef };
  ranges: { label: string; options: QuoteOption[]; checkIcon: LocalImageRef };
  max: { label: string; placeholder: string };
  note: string;
}

/** Contexto del proyecto (220:943): idea (obligatoria) + objetivos (opcionales). */
export interface QuoteProject {
  title: string;
  hint: string;
  idea: { label: string; placeholder: string; helper: string; minLength: number };
  goals: { title: string; optional: string; options: QuoteOption[]; checkIcon: LocalImageRef; addIcon: LocalImageRef };
}

/** Adjunto opcional (220:968). `maxSizeMb` limita el archivo; `accept` va al input. */
export interface QuoteAttachment {
  title: string;
  hint: string;
  accept: string;
  maxSizeMb: number;
  remove: string;
  icon: LocalImageRef;
  uploadIcon: LocalImageRef;
}

/** Campo de texto de contacto. */
export interface QuoteContactField {
  label: string;
  placeholder: string;
  required: boolean;
}

/** Datos para responder (220:975). */
export interface QuoteContact {
  title: string;
  fields: { name: QuoteContactField; email: QuoteContactField; whatsapp: QuoteContactField };
  note: string;
}

/** Pie (220:987): alternativa por WhatsApp + envío. */
export interface QuoteFooter {
  alternative: string;
  whatsapp: Link & { newTab: string; icon: LocalImageRef; arrowIcon: LocalImageRef };
  submit: { label: string; icon: LocalImageRef };
}

/** Mensajes de validación. `{min}` y `{max}` se sustituyen. */
export interface QuoteValidation {
  services: string;
  idea: string;
  ideaShort: string;
  name: string;
  email: string;
  emailInvalid: string;
  whatsappInvalid: string;
  maxInvalid: string;
  fileTooLarge: string;
  /** Resumen que se anuncia al fallar el envío por errores. */
  summary: string;
}

/** Estados del envío. */
export interface QuoteStatus {
  sending: string;
  sent: string;
  error: string;
  unavailable: string;
}

/**
 * Modal de solicitud de cotización (Figma 220:867, archivo flzA0qnj6JdalFCgyB2PdI). Una sola
 * instancia global (layout/quote/QuoteDialog.svelte); la abre cualquier `[data-quote-open]`.
 */
export interface SiteQuote {
  /** Nombre accesible del marcador de obligatorio ("*"). */
  requiredLabel: string;
  header: QuoteHeader;
  services: QuoteServices;
  budget: QuoteBudget;
  project: QuoteProject;
  attachment: QuoteAttachment;
  contact: QuoteContact;
  footer: QuoteFooter;
  validation: QuoteValidation;
  status: QuoteStatus;
  /** Destino del envío. Sin él, el envío responde 'unavailable' (no se finge). PENDIENTE. */
  endpoint?: string;
}

/** Situación de partida (272:8134): tarjeta-radio con icono, nombre y descripción. */
export interface AdviceStageOption extends QuoteOption {
  description: string;
  icon: LocalImageRef;
}

/** Canal directo del pie (272:8176). Con `newTab` se abre en una pestaña nueva (WhatsApp). */
export interface AdviceChannel extends Link {
  icon: LocalImageRef;
  /** Aviso para lectores de pantalla; si existe, el enlace lleva target="_blank". */
  newTab?: string;
}

/**
 * Modal de solicitud de asesoría (Figma 272:8117, archivo flzA0qnj6JdalFCgyB2PdI). Una sola
 * instancia global (layout/advice/AdviceDialog.svelte); la abre cualquier `[data-advice-open]`.
 */
export interface SiteAdvice {
  /** Nombre accesible del marcador de obligatorio ("*"). */
  requiredLabel: string;
  /** 272:8118: rótulo, cierre, título y entradilla. */
  header: QuoteHeader;
  /** 272:8129: "¿En qué punto estás?" (una opción, no obligatoria). */
  stage: { title: string; hint: string; options: AdviceStageOption[]; checkedIcon: LocalImageRef };
  /** 272:8150: qué quiere resolver (opcional). */
  message: { title: string; optional: string; label: string; placeholder: string; helper: string };
  /** 272:8157: nombre y correo (obligatorios) + nota. */
  contact: { fields: { name: QuoteContactField; email: QuoteContactField }; note: string };
  /** 272:8168: envío. */
  submit: { label: string; icon: LocalImageRef };
  /** 272:8171: alternativa sin formulario. */
  channels: { title: string; aside: string; arrowIcon: LocalImageRef; items: AdviceChannel[] };
  validation: { name: string; email: string; emailInvalid: string; summary: string };
  status: QuoteStatus;
  /** Destino del envío. Sin él, el envío responde 'unavailable' (no se finge). PENDIENTE. */
  endpoint?: string;
}
