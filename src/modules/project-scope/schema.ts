import { z } from 'astro/zod';
import { headingSchema, mediaRefSchema, sectionSchema, toneTextSchema } from '@/core/content';

/** description = descripción principal del alcance. */
export const projectScopeHeadingSchema = headingSchema.extend({ eyebrow: z.string().min(1), title: toneTextSchema });

const deliverableSchema = z.strictObject({ title: z.string().min(1), description: z.string().min(1) });

/** Herramienta de trabajo: logotipo (alt = nombre) + uso. */
const toolSchema = z.strictObject({ logo: mediaRefSchema, description: z.string().min(1) });

export const projectScopeContentSchema = z.strictObject({
  /** Límites del trabajo, en pequeño bajo la descripción. */
  exclusions: z.string().min(1).optional(),
  /** Entregables numerados (01, 02… salen del orden). */
  deliverables: z.array(deliverableSchema).min(1),
  tools: z.strictObject({
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    items: z.array(toolSchema).min(1),
  }),
  stack: z.strictObject({
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    items: z.array(z.string().min(1)).min(1),
  }),
});

export const projectScopeSectionSchema = sectionSchema('project-scope', projectScopeHeadingSchema, projectScopeContentSchema);

export type ProjectScopeContent = z.infer<typeof projectScopeContentSchema>;
export type ProjectScopeDeliverable = z.infer<typeof deliverableSchema>;
export type ProjectScopeTool = z.infer<typeof toolSchema>;
export type ProjectScopeSection = z.infer<typeof projectScopeSectionSchema>;
