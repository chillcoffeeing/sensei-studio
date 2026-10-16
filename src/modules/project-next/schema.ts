import { z } from 'astro/zod';
import { headingSchema, mediaRefSchema, sectionSchema } from '@/core/content';

/** eyebrow = etiqueta de la sección; también nombra la región. */
export const projectNextHeadingSchema = headingSchema.extend({ eyebrow: z.string().min(1) });

/** Tarjeta del proyecto destino. No se escribe en el JSON: content/projects.ts la deriva de su hero. */
const cardSchema = z.strictObject({
  href: z.string().min(1),
  image: mediaRefSchema,
  category: z.string().min(1),
  name: z.string().min(1),
  summary: z.array(z.string().min(1)).min(1),
});

/** Microcopy común a todos los casos (content/case-study.ts); el loader lo inyecta antes de validar. */
const uiSchema = z.strictObject({
  /** "Explorar caso". */
  cta: z.string().min(1),
  /** Flecha de la tarjeta (decorativa). */
  icon: mediaRefSchema,
});

export const projectNextContentSchema = z.strictObject({
  /** Slug del proyecto siguiente. Si falta: el siguiente en orden, cíclico. */
  projectSlug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  /** Derivada; sin ella (no hay otro proyecto) la sección no se pinta. */
  card: cardSchema.optional(),
  ui: uiSchema,
});

export const projectNextSectionSchema = sectionSchema('project-next', projectNextHeadingSchema, projectNextContentSchema);

export type ProjectNextCard = z.infer<typeof cardSchema>;
export type ProjectNextContent = z.infer<typeof projectNextContentSchema>;
export type ProjectNextUi = z.infer<typeof uiSchema>;
export type ProjectNextSection = z.infer<typeof projectNextSectionSchema>;
