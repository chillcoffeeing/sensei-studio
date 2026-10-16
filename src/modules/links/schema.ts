// Vista fija /links (LINKS-PAGE, Figma 230:977 del archivo flzA0qnj6JdalFCgyB2PdI): la bio de
// Instagram. No es una Page de secciones: un campo por bloque, en el orden del frame.
import type { LocalImageRef, Link, MediaRef, Seo } from '@/core/content';
import type { QuoteServices } from '@/core/site';

/** Enlace con icono decorativo (`alt` vacío). */
export interface LinksIconLink extends Link {
  icon: LocalImageRef;
}

/** Enlace externo a WhatsApp (pestaña nueva): mismo destino que la barra flotante y el modal. */
export interface LinksWhatsApp extends LinksIconLink {
  /** Aviso para lectores de pantalla: el enlace abre una pestaña nueva. */
  newTab: string;
}

/** Cabecera (230:978): logo, h1, descripción y los dos atajos de contacto. */
export interface LinksHeader {
  logo: LocalImageRef;
  /** Fondo decorativo bajo el velo (230:979). */
  atmosphere: LocalImageRef;
  /** Líneas del h1 (cada una en su renglón). */
  title: string[];
  description: string;
  /** "Cotizar proyecto": `href` es el destino sin JS; con JS abre el modal (`data-quote-open`). */
  quote: LinksIconLink;
  whatsapp: LinksWhatsApp;
}

/** Mini cotización (230:1006): servicios del modal + "Continuar cotización". */
export interface LinksQuote {
  label: string;
  title: string;
  description: string;
  /** Los mismos datos que el modal (`site.quote.services`): una sola fuente. */
  services: QuoteServices;
  /** `href`: destino sin JS (el formulario se envía ahí). Con JS abre el modal con lo elegido. */
  cta: LinksIconLink;
  note: string;
}

/** Portada de la guía (230:1053): ilustración tipográfica, decorativa. */
export interface LinksGuideCover {
  kicker: string;
  figure: string;
  tagline: string[];
}

/** Guía gratuita (230:1047). */
export interface LinksGuide {
  label: string;
  cover: LinksGuideCover;
  kicker: string;
  title: string;
  description: string;
  /** PENDIENTE: el PDF aún no existe (decisión del usuario 2026-10-09). */
  download: LinksIconLink;
}

/** Tarjeta del proyecto destacado (230:1069) + "Ver todos los proyectos". Datos derivados del caso (content/projects.ts). */
export interface LinksProject {
  href: string;
  /** Decorativa dentro del enlace (el nombre ya lo dice). */
  image: MediaRef;
  title: string;
  claim: string[];
  category: string;
  all: LinksIconLink;
}

/** Acceso a los servicios (230:1080). */
export interface LinksServicesAccess extends LinksIconLink {
  items: string[];
}

/** Explora el studio (230:1065). */
export interface LinksExplore {
  label: string;
  project: LinksProject;
  services: LinksServicesAccess;
}

/** Enlace secundario del pie. Sin `href` se pinta como texto (destino aún sin definir). */
export interface LinksFooterLink {
  label: string;
  href?: string;
  /** Signo decorativo tras el texto (`aria-hidden`), p. ej. "↗". */
  marker?: string;
}

/** Cierre (230:1085): invitación a WhatsApp + pie mínimo. */
export interface LinksClosing {
  title: string;
  whatsapp: LinksWhatsApp;
  wordmark: LocalImageRef;
  /** Nombre accesible del `<nav>` del pie. */
  navLabel: string;
  links: LinksFooterLink[];
}

export interface Links {
  seo: Seo;
  header: LinksHeader;
  quote: LinksQuote;
  guide: LinksGuide;
  explore: LinksExplore;
  closing: LinksClosing;
}
