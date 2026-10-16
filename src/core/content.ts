// Modelo de contenido (docs/content-model.md): PageDoc { slug, seo, sections[] } y las piezas
// comunes de cada sección. Esquemas zod + tipos inferidos: esquema y tipo no pueden divergir.
// Los esquemas de headingContent/content de cada tipo viven en modules/<type>/schema.ts; la unión
// discriminada y el esquema de la página, en app/sections.ts.
import type { ImageMetadata } from 'astro';
import { z } from 'astro/zod';
import { CROP_POSITIONS, hasLocalAsset, isMediaUrl } from '@/shared/lib/media';

// --- Piezas -------------------------------------------------------------------------------

const tonePartSchema = z.strictObject({ text: z.string(), tone: z.enum(['muted', 'strong']) });
/** Texto en dos tonos: `['Frase normal ', { text: 'frase atenuada', tone: 'muted' }]`. */
export const toneTextSchema = z.array(z.union([z.string(), tonePartSchema])).min(1);

export const linkSchema = z.strictObject({ label: z.string().min(1), href: z.string().min(1) });
export type Link = z.infer<typeof linkSchema>;

const mediaRefBase = z.strictObject({
  src: z.string().min(1),
  /** '' = decorativa. */
  alt: z.string(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  kind: z.enum(['image', 'video']).optional(),
  /** Encaje en su hueco: `cover` (por defecto) recorta; `contain` la muestra entera (capturas, pantallas). */
  fit: z.enum(['cover', 'contain']).optional(),
  /** Encuadre del recorte con `cover` (= object-position): qué parte de la pieza se conserva. Por defecto, el centro. */
  position: z.enum(CROP_POSITIONS).optional(),
});

// Una clave local que no existe rompe el build aquí, con la ruta y el campo del dato.
const checkMedia = (ref: z.infer<typeof mediaRefBase>, ctx: z.RefinementCtx) => {
  if (!isMediaUrl(ref.src) && !hasLocalAsset(ref.src)) {
    ctx.addIssue({ code: 'custom', path: ['src'], message: `clave local inexistente en src/assets: "${ref.src}"` });
  }
};

/**
 * Medio: siempre una cadena, que es lo que un CMS puede entregar. `src` es una URL (absoluta o
 * desde la raíz, p. ej. un video de public/) o una clave local relativa a src/assets
 * ("case-study/tools/figma.svg"). La resuelve shared/lib/media.ts.
 */
export const mediaRefSchema = mediaRefBase.superRefine(checkMedia);
export type MediaRef = z.infer<typeof mediaRefSchema>;

/** Textos accesibles de un slider (= shared/ui UiSliderLabels): `slidePosition` lleva `{index}` y `{total}`. */
export const sliderLabelsSchema = z.strictObject({
  label: z.string().min(1),
  roleDescription: z.string().min(1),
  slideRoleDescription: z.string().min(1),
  slidePosition: z.string().includes('{index}').includes('{total}'),
});

/** Métrica de tarjeta de proyecto: valor (mono) + etiqueta. Sale de `project-results` del proyecto. */
export const projectMetricSchema = z.strictObject({ value: z.string().min(1), label: z.string().min(1) });
export type ProjectMetric = z.infer<typeof projectMetricSchema>;

/**
 * Tarjeta de proyecto derivada (docs/content-model.md, regla 5; = shared/ui ProjectCardData). No se
 * escribe en el JSON: la arma content/pages.ts a partir del slug. La usan project-gallery y project-index.
 */
export const projectCardSchema = z.strictObject({
  /** Portada del proyecto (o su imagen de cierre si no tiene portada). */
  image: mediaRefSchema,
  /** Nombre del proyecto (izquierda de la pill, en mayúsculas). */
  title: z.string().min(1),
  /** Categoría (derecha de la pill, en gris). */
  category: z.string().min(1),
  /** Detalle que aparece en hover/foco, todo abajo sobre glass (MOT-PROJECTS-V2). */
  details: z.strictObject({
    /** Métricas en orden de lectura (1–4), una fila. */
    metrics: z.array(projectMetricSchema).min(1).max(4),
    /** Botón a todo el ancho "Ver proyecto" → /proyectos/<slug>/. */
    link: linkSchema,
  }),
});
export type ProjectCard = z.infer<typeof projectCardSchema>;

/** Slug de un proyecto (src/content/data/projects/<slug>.json). */
export const projectSlugSchema = z.string().regex(/^[a-z0-9-]+$/);

/** Cabecera estándar de sección. Un tipo puede ampliarla (campos obligatorios) o no usarla. */
export const headingSchema = z.strictObject({
  /** Etiqueta de sección ("Proyectos"). */
  eyebrow: z.string().min(1).optional(),
  /** h1 (solo hero) o h2. */
  title: toneTextSchema.optional(),
  description: toneTextSchema.optional(),
});
export type Heading = z.infer<typeof headingSchema>;

export const seoSchema = z.strictObject({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
  keywords: z.array(z.string()).optional(),
  /** Absoluta; si falta se deriva de `site`. */
  canonical: z.url().optional(),
  /** URL o clave de asset (como MediaRef.src). Una clave local se emite recortada a 1200 × 630. */
  ogImage: z.string().min(1).optional(),
  /** og:image:alt de `ogImage`; si falta, el título de la página. */
  ogImageAlt: z.string().min(1).optional(),
  ogType: z.enum(['website', 'article']).optional(),
  noindex: z.boolean().optional(),
  /** Nodos JSON-LD extra: se AGREGAN al grafo derivado de los datos (docs/seo.md §5), no lo sustituyen. */
  jsonLd: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type Seo = z.infer<typeof seoSchema>;

// --- Secciones y página ---------------------------------------------------------------------

/**
 * Esquema de una sección de tipo `type`. `heading` decide la forma de `headingContent` (pasa
 * `.optional()` si la sección puede no tenerla) y `content`, la de `content`.
 */
export function sectionSchema<T extends string, H extends z.ZodType, C extends z.ZodType>(type: T, heading: H, content: C) {
  return z.strictObject({
    sectionType: z.literal(type),
    /** Ancla (#proyectos). Si falta, no hay ancla. */
    id: z.string().regex(/^[a-z0-9-]+$/).optional(),
    headingContent: heading,
    content,
  });
}

/** Forma común de cualquier sección, sin importar su tipo concreto. */
export interface SectionDoc<T extends string = string, H = Heading, C = unknown> {
  sectionType: T;
  id?: string;
  headingContent?: H;
  content: C;
}

export interface PageDoc<S extends SectionDoc = SectionDoc> {
  /** 'home' → '/', el resto → '/<slug>/'. */
  slug: string;
  seo: Seo;
  sections: S[];
}

/** Esquema de PageDoc para una unión de secciones dada. */
export function pageDocSchema<S extends z.ZodType>(section: S) {
  return z.strictObject({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    seo: seoSchema,
    sections: z.array(section).min(1),
  });
}

/** Prefijo de los ids internos de una sección (título, islas): su ancla o, si no tiene, su tipo. */
export const sectionKey = (section: Pick<SectionDoc, 'id' | 'sectionType'>) => section.id ?? section.sectionType;

/** id del título de la sección (aria-labelledby). */
export const headingIdOf = (section: Pick<SectionDoc, 'id' | 'sectionType'>) => `${sectionKey(section)}-title`;

// --- Imágenes importadas (chrome y /links) ------------------------------------------------

/**
 * Imagen local importada (ImageMetadata). Solo la usan el chrome (content/site.ts) y los iconos de
 * /links (vistas en TS, no documentos JSON). Las páginas y los proyectos usan MediaRef.
 */
export interface LocalImageRef {
  src: ImageMetadata;
  alt: string;
}

/** Imagen de un slot de foto: local importada o MediaRef (la pinta shared/ui/Photo.astro). */
export type ImageRef = LocalImageRef | MediaRef;
