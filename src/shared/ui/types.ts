// Tipos de datos que reciben los componentes de la librería (docs/components.md).
// shared no puede importar core: estos tipos son estructuralmente iguales a los de core/content
// (LocalImageRef, MediaRef, Link), así content y los módulos pasan sus datos sin conversión.
import type { ImageMetadata } from 'astro';
import type { UiMedia } from '@/shared/lib/media';
import type { ToneText } from '@/shared/lib/tone-text';
import type { TeamProfileNetwork } from './team-profiles';

/** Icono decorativo ya resuelto (URL + dimensiones del import): serializable para islas. */
export interface UiIcon {
  src: string;
  width: number;
  height: number;
}

/** Imagen de contenido procesada por astro:assets (= core LocalImageRef). */
export interface UiImage {
  src: ImageMetadata;
  alt: string;
}

/** Foto de un slot: importada o MediaRef (= core ImageRef). La pinta Photo.astro (shared/lib/media). */
export type UiPhoto = UiImage | UiMedia;

/** Enlace que puede no tener destino todavía: sin `href` se pinta como texto. */
export interface UiOptionalLink {
  label: string;
  href?: string;
}

/**
 * Tono de un avatar de iniciales (tokens --color-avatar-{1..4}-bg/fg). Es un DATO (lo calcula
 * quien reparte las cards para que dos contiguas no coincidan), no una variante de aspecto.
 */
export type AvatarTone = 1 | 2 | 3 | 4;

/** Métrica del detalle de proyecto: valor (mono) + etiqueta. */
export interface ProjectMetricData {
  value: string;
  label: string;
}

/** Datos de una ProjectCard (mismo contrato que projectCardSchema de core/content). */
export interface ProjectCardData {
  image: UiPhoto;
  title: string;
  category: string;
  details: {
    /** 1–4 métricas: se reparten en una fila de columnas iguales. */
    metrics: ProjectMetricData[];
    link: { label: string; href: string };
  };
}

/** Datos de una TeamCard (mismo contrato que TeamMember de modules/team). */
export interface TeamCardData {
  name: string;
  role: string;
  /** Línea bajo el rol en el detalle (p. ej. "en Sensei Studio"). */
  company: string;
  /** Párrafo corto del detalle (texto plano: hover.ts lo escribe con typewriter). */
  bio: string;
  /** Foto local (clave de src/assets): se recorta en el servidor al aspecto de la card. Sin foto, silueta neutra. */
  photo?: UiPhoto;
}

/** Perfil profesional de un integrante, ya resuelto: solo existe si hay URL. */
export interface TeamProfileLink {
  network: TeamProfileNetwork;
  href: string;
  /** aria-label completo ("Perfil de Natalia Reina en Behance (se abre en una pestaña nueva)"). */
  label: string;
}

/** Elemento de AccordionCards: título (botón) y cuerpo (panel). */
export interface AccordionCardItem {
  title: string;
  body: string;
}

/**
 * Textos accesibles de un slider (patrón de carrusel de la APG). Copy: llega desde src/content/.
 * `slidePosition` es una plantilla con `{index}` y `{total}` ("{index} de {total}").
 */
export interface UiSliderLabels {
  /** Nombre accesible de la región del carrusel. */
  label: string;
  /** aria-roledescription de la región ("carrusel"). */
  roleDescription: string;
  /** aria-roledescription de cada diapositiva ("diapositiva"). */
  slideRoleDescription: string;
  /** Etiqueta de posición de cada diapositiva. */
  slidePosition: string;
}

/** Avatar de una pila: con foto o, sin ella, la silueta neutra de UserPlaceholder. */
export interface UiAvatar {
  photo?: UiPhoto;
}

/** Contador al final de una pila de avatares: lo que se ve ("56+") y lo que se lee ("Más de 56 clientes"). */
export interface UiCount {
  value: string;
  label: string;
}

/** Valoración en estrellas: cuántas se pintan y su texto alternativo ("5 de 5"). */
export interface UiRating {
  stars: number;
  label: string;
}

/** Texto en dos tonos con idioma propio opcional (`lang` si no es el de la página). */
export interface UiCaption {
  text: ToneText;
  lang?: string;
}
