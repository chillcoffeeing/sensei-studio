import { z } from 'astro/zod';
import { headingSchema, sectionSchema, toneTextSchema } from '@/core/content';

export const projectResultsHeadingSchema = headingSchema.extend({ eyebrow: z.string().min(1), title: toneTextSchema });

const metricSchema = z.strictObject({
  /** Cifra destacada ("+29%", "−20%"); cuenta desde 0 al entrar en viewport. */
  value: z.string().min(1),
  /** Indicador medido (h3). */
  label: z.string().min(1),
  /** Comparación "antes → después". */
  before: z.string().min(1),
  after: z.string().min(1),
  description: z.string().min(1),
});

/** Microcopy común a todos los casos (content/case-study.ts); el loader lo inyecta antes de validar. */
const uiSchema = z.strictObject({
  /** Flecha visible entre valores ("→", aria-hidden) y rótulos solo para lectores de pantalla. */
  comparison: z.strictObject({ separator: z.string().min(1), before: z.string().min(1), after: z.string().min(1) }),
});

export const projectResultsContentSchema = z.strictObject({
  metrics: z.array(metricSchema).min(1),
  /** Nota metodológica bajo las métricas. */
  note: z.string().min(1).optional(),
  ui: uiSchema,
});

export const projectResultsSectionSchema = sectionSchema('project-results', projectResultsHeadingSchema, projectResultsContentSchema);

export type ProjectResultsContent = z.infer<typeof projectResultsContentSchema>;
export type ProjectResultsMetric = z.infer<typeof metricSchema>;
export type ProjectResultsUi = z.infer<typeof uiSchema>;
export type ProjectResultsSection = z.infer<typeof projectResultsSectionSchema>;
