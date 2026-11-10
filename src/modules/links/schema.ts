// Vista fija /links: la bio de Instagram. No es una Page de secciones: un campo por bloque, en el
// orden de la página (cabecera, dos caminos, un proyecto reciente y cierre). Referencia:
// design/links/linktree-sensei.html y Linktree-Diagnostico-gratis-Sensei.pdf.
import type { LocalImageRef, Link, MediaRef, Seo } from '@/core/content';

/** Enlace con icono decorativo (`alt` vacío). */
export interface LinksIconLink extends Link {
  icon: LocalImageRef;
}

/** Enlace externo a WhatsApp (pestaña nueva): mismo destino que la barra flotante y el modal. */
export interface LinksWhatsApp extends LinksIconLink {
  /** Aviso para lectores de pantalla: el enlace abre una pestaña nueva. */
  newTab: string;
}

/** Cabecera: logo, h1 y descripción, sin botones (los caminos están en la tarjeta). */
export interface LinksHeader {
  logo: LocalImageRef;
  /** Fondo decorativo bajo el velo. */
  atmosphere: LocalImageRef;
  /** Líneas del h1 (cada una en su renglón). */
  title: string[];
  description: string;
}

/** Tile de un camino: icono arriba a la izquierda, título y "para quién es". */
export interface LinksPathTile {
  title: string;
  text: string;
  /** Icono decorativo (`alt` vacío). */
  icon: LocalImageRef;
}

/**
 * Tarjeta "Tu proyecto empieza aquí": dos tiles que son botones. El del diagnóstico abre la hoja
 * del diagnóstico (`data-diagnostic-open`); el de cotización, el modal global (`data-quote-open`).
 */
export interface LinksPaths {
  /** Rótulo con marcador lima. */
  label: string;
  /** h2 de la tarjeta. */
  title: string;
  text: string;
  /** Tile destacado (borde tinta) con la etiqueta lima `badge` ("Gratis · 2 min"). */
  diagnostic: LinksPathTile & { badge: string };
  quote: LinksPathTile;
  footer: string;
}

/** Área del diagnóstico. El orden de `LinksDiagnostic.areas` es también el desempate. */
export type DiagnosticAreaKey = 'branding' | 'ux' | 'dev' | 'email';

/** Título con un tramo final realzado (tinta sobre marcador lima: el lima nunca es color de texto). */
export interface DiagnosticHeading {
  text: string;
  /** Tramo realzado tras `text` (separado por un espacio). Admite `{name}`. */
  mark?: string;
}

/** Resultado que se muestra en el paso 2 y sus 3 primeros pasos (paso 4b). */
export interface DiagnosticOutcome {
  title: string;
  text: string;
  /** "Tus primeros 3 pasos" de la pantalla 4b, en orden. */
  steps: string[];
}

export interface DiagnosticArea extends DiagnosticOutcome {
  key: DiagnosticAreaKey;
  /** Nombre completo: barra de preguntas, resultado y gráfico. */
  name: string;
  /** Nombre corto del campo `puntajes` del lead ("Branding 1/4 · UX/UI 3/4 …"). */
  short: string;
}

export interface DiagnosticQuestion {
  area: DiagnosticAreaKey;
  text: string;
}

/** Opción de un grupo de chips. El lead y las notas de Cal.com llevan `label`. */
export interface DiagnosticChoiceOption {
  value: string;
  label: string;
}

/** Opción de inversión: `min` (USD) decide si la persona califica (`min >= minBudget`). */
export interface DiagnosticBudgetOption extends DiagnosticChoiceOption {
  min: number;
}

/** Pregunta de selección única del paso 3 (radios con aspecto de chip). */
export interface DiagnosticChoiceGroup<Option extends DiagnosticChoiceOption = DiagnosticChoiceOption> {
  legend: string;
  /** Aclaración tras la pregunta, en tono secundario ("(USD)"). */
  hint?: string;
  options: Option[];
}

/**
 * Diagnóstico gratis de /links: copy, preguntas, resultados y reglas. Se abre en el modal común (hoja
 * en móvil, tarjeta centrada desde sm) desde el tile "Diagnóstico gratuito". Todo es serializable salvo `icons`, que
 * el Astro convierte a UiIcon antes de pasarlo a la isla.
 * Plantillas: `{n}`, `{total}`, `{area}`, `{score}`, `{max}`, `{name}`, `{stage}`, `{start}`, `{budget}`.
 */
export interface LinksDiagnostic {
  /** Rótulo fijo del diálogo (LabelMarker): su nombre accesible en todos los pasos. */
  label: string;
  /** Botón de cierre (redondo, solo icono, igual que el de los otros modales): `label` es su nombre accesible. */
  close: { label: string };
  /** Pie de todos los pasos: `text` + `strong` en tinta. */
  footer: { text: string; strong: string };
  intro: { title: DiagnosticHeading; text: string; start: string; meta: string };
  quiz: {
    /** "{n} / {total}". */
    counter: string;
    /** Nombre accesible de la barra de progreso. */
    progress: string;
    yes: string;
    no: string;
    back: string;
  };
  /** En el orden en que se preguntan. */
  questions: DiagnosticQuestion[];
  areas: DiagnosticArea[];
  /** Cero "sí": `tag` sustituye a "Tu prioridad: …"; la invitación se mantiene. */
  none: DiagnosticOutcome & { tag: string };
  result: {
    /** "Tu prioridad: {area}". */
    priority: string;
    scores: { title: string; value: string };
    invite: { title: DiagnosticHeading; text: string; cta: string };
  };
  qualify: {
    title: DiagnosticHeading;
    text: string;
    stage: DiagnosticChoiceGroup;
    start: DiagnosticChoiceGroup;
    budget: DiagnosticChoiceGroup<DiagnosticBudgetOption>;
    fields: { name: string; email: string };
    error: string;
    submit: string;
    sending: string;
  };
  /** Inversión mínima (USD) para ver la agenda. Única regla de calificación. */
  minBudget: number;
  booking: {
    title: DiagnosticHeading;
    /** "{name}, reserva tus 20 minutos…" (`{name}` = nombre de pila). */
    text: string;
    /** Evento de Cal.com, sin parámetros. */
    calLink: string;
    /** `notes` precargadas en Cal.com. */
    notes: string;
    frameTitle: string;
    open: string;
    newTab: string;
  };
  /** Paso 4b (no califica): gracias, los 3 pasos de su resultado y cotizar por WhatsApp. */
  later: {
    /** Admite `{name}` (nombre de pila) en `text` y en `mark`. */
    title: DiagnosticHeading;
    /** Introducción de la lista de pasos. */
    text: string;
    invite: { title: string; text: string };
    /** Mismo número que el cierre de la página; `message` ({area}) va prellenado en el chat. */
    whatsapp: { label: string; href: string; newTab: string; message: string };
  };
  icons: {
    /** Flecha del círculo de los CTA lima. */
    cta: LocalImageRef;
    /** Enlace a la agenda en otra pestaña. */
    open: LocalImageRef;
    /** Logo del botón "Cotizar por WhatsApp" (4b). */
    whatsapp: LocalImageRef;
    /** X del cierre del diálogo (el círculo lo dibuja ModalDialogBar). */
    close: LocalImageRef;
  };
}

/** Tarjeta del proyecto destacado + "Ver todos los proyectos". Datos derivados del caso (content/projects.ts). */
export interface LinksProject {
  href: string;
  /** Decorativa dentro del enlace (el nombre ya lo dice). */
  image: MediaRef;
  title: string;
  claim: string[];
  category: string;
  all: LinksIconLink;
}

/** "Un proyecto reciente": una sola pieza del portafolio. */
export interface LinksExplore {
  label: string;
  project: LinksProject;
}

/** Enlace secundario del pie. Sin `href` se pinta como texto (destino aún sin definir). */
export interface LinksFooterLink {
  label: string;
  href?: string;
  /** Signo decorativo tras el texto (`aria-hidden`), p. ej. "↗". */
  marker?: string;
}

/** Cierre: "¿Prefieres escribirnos?", el único WhatsApp de la página, el sitio y el pie mínimo. */
export interface LinksClosing {
  title: string;
  /** `icon` = logo de WhatsApp (máscara sobre el color del texto). */
  whatsapp: LinksWhatsApp;
  /** "Visitar bysensei.com". */
  site: Link;
  /** "Sin promesas vacías." + `strong` en tono fuerte. */
  claim: { text: string; strong: string };
  wordmark: LocalImageRef;
  /** Nombre accesible del `<nav>` del pie. */
  navLabel: string;
  links: LinksFooterLink[];
}

export interface Links {
  seo: Seo;
  header: LinksHeader;
  paths: LinksPaths;
  diagnostic: LinksDiagnostic;
  explore: LinksExplore;
  closing: LinksClosing;
}
