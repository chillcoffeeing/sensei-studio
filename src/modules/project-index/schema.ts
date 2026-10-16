import { z } from 'astro/zod';
import { headingSchema, projectCardSchema, projectSlugSchema, sectionSchema, toneTextSchema } from '@/core/content';

/** `title` es el h1 de la página (esta vista no tiene hero); `description`, una línea opcional. */
export const projectIndexHeadingSchema = headingSchema.extend({ eyebrow: z.string().min(1), title: toneTextSchema });

export const projectIndexContentSchema = z.strictObject({
  /** Slugs en orden de lectura. Vacío (o ausente) = todos los proyectos, en el orden del ciclo "Siguiente proyecto". */
  projects: z.array(projectSlugSchema).default([]),
  /** No se escribe en el JSON: content/pages.ts las deriva de cada proyecto, como en project-gallery. */
  cards: z.array(projectCardSchema).optional(),
});

export const projectIndexSectionSchema = sectionSchema('project-index', projectIndexHeadingSchema, projectIndexContentSchema);

export type ProjectIndexContent = z.infer<typeof projectIndexContentSchema>;
export type ProjectIndexSection = z.infer<typeof projectIndexSectionSchema>;
