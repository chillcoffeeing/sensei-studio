import { z } from 'astro/zod';
import { headingSchema, linkSchema, projectCardSchema, projectSlugSchema, sectionSchema, toneTextSchema } from '@/core/content';

/** Cabecera común obligatoria (Figma 32:82). */
export const projectGalleryHeadingSchema = headingSchema.extend({ eyebrow: z.string().min(1), title: toneTextSchema });

export const projectGalleryContentSchema = z.strictObject({
  /** Enlace de texto de la cabecera ("VER TODOS LOS PROYECTOS    +", Figma 29:236); `marker` es decorativo. */
  cta: linkSchema.extend({ marker: z.string() }),
  /** Slugs de los proyectos (src/content/data/projects/<slug>.json), en orden de lectura. */
  projects: z.array(projectSlugSchema).min(1),
  /** Texto del botón de cada tarjeta ("Ver proyecto"). */
  cardCta: z.string().min(1),
  /** Derivadas de cada proyecto por el loader (core projectCardSchema), en el orden de `projects`. */
  cards: z.array(projectCardSchema).optional(),
});

export const projectGallerySectionSchema = sectionSchema('project-gallery', projectGalleryHeadingSchema, projectGalleryContentSchema);

export type ProjectGalleryContent = z.infer<typeof projectGalleryContentSchema>;
export type ProjectGallerySection = z.infer<typeof projectGallerySectionSchema>;
