import { z } from 'astro/zod';
import { headingSchema, sectionSchema, toneTextSchema } from '@/core/content';

export const projectContextHeadingSchema = headingSchema.extend({ eyebrow: z.string().min(1), title: toneTextSchema });

const fieldSchema = z.strictObject({ label: z.string().min(1), value: z.string().min(1) });

/** Microcopy común a todos los casos (content/case-study.ts); el loader lo inyecta antes de validar. */
const uiSchema = z.strictObject({
  /** Nombre accesible de la ficha del proyecto. */
  fieldsLabel: z.string().min(1),
});

export const projectContextContentSchema = z.strictObject({
  /** Descripción principal. */
  lead: z.string().min(1),
  /** Descripción secundaria, en gris. */
  description: z.string().min(1).optional(),
  /** Ficha del proyecto (cliente, industria, servicios, fecha, equipo). */
  fields: z.array(fieldSchema).min(1),
  /** "El reto", en el bloque oscuro. */
  challenge: z.strictObject({ label: z.string().min(1), title: z.string().min(1), description: z.string().min(1) }),
  /** Lista numerada de objetivos (01, 02… salen del orden). */
  goals: z.strictObject({ label: z.string().min(1), items: z.array(z.string().min(1)).min(1) }),
  ui: uiSchema,
});

export const projectContextSectionSchema = sectionSchema('project-context', projectContextHeadingSchema, projectContextContentSchema);

export type ProjectContextContent = z.infer<typeof projectContextContentSchema>;
export type ProjectContextField = z.infer<typeof fieldSchema>;
export type ProjectContextUi = z.infer<typeof uiSchema>;
export type ProjectContextSection = z.infer<typeof projectContextSectionSchema>;
