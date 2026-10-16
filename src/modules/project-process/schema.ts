import { z } from 'astro/zod';
import { headingSchema, mediaRefSchema, sectionSchema, sliderLabelsSchema, toneTextSchema } from '@/core/content';

/** Cabecera + ruta del proceso ("Research → Diseño → Producto"), en mayúsculas con CSS. */
export const projectProcessHeadingSchema = headingSchema.extend({
  eyebrow: z.string().min(1),
  title: toneTextSchema,
  route: z.array(z.string().min(1)).min(1).optional(),
});

const stageSchema = z.strictObject({
  name: z.string().min(1),
  /** Duración ("Semana 1", "Semanas 2–5"); se pinta en mayúsculas con CSS. */
  weeks: z.string().min(1),
  description: z.string().min(1),
  /** Entregable de la etapa (opcional: sin él, la etapa termina en la descripción). */
  deliverable: z.string().min(1).optional(),
});

const flowStepSchema = z.strictObject({ title: z.string().min(1), detail: z.string().min(1) });

/** Flujo posterior a la entrega (automatización, recompensas, seguimiento). */
const flowSchema = z.strictObject({
  /** Titular del bloque (h3). */
  title: z.string().min(1),
  /** Aviso a la derecha; se pinta en mayúsculas con CSS. */
  overline: z.string().min(1),
  steps: z.array(flowStepSchema).min(1),
  /** Nota final (va tras el rótulo común "Nota:"). */
  note: z.string().min(1),
});

/** Microcopy común a todos los casos (content/case-study.ts); el loader lo inyecta antes de validar. */
const uiSchema = z.strictObject({
  /** Separador visible entre pasos de la ruta ("→"), aria-hidden. */
  routeSeparator: z.string().min(1),
  /** Solo lectores de pantalla, delante de cada entregable. */
  deliverableLabel: z.string().min(1),
  /** Flecha entre pasos del flujo (decorativa). */
  flowArrow: mediaRefSchema,
  /** Rótulo en negrita delante de la nota del flujo. */
  noteLabel: z.string().min(1),
  /** Textos accesibles del stepper de etapas en mobile (StepperSlider). */
  stepper: sliderLabelsSchema,
});

export const projectProcessContentSchema = z.strictObject({
  stages: z.array(stageSchema).min(1),
  flow: flowSchema,
  ui: uiSchema,
});

export const projectProcessSectionSchema = sectionSchema('project-process', projectProcessHeadingSchema, projectProcessContentSchema);

export type ProjectProcessContent = z.infer<typeof projectProcessContentSchema>;
export type ProjectProcessStage = z.infer<typeof stageSchema>;
export type ProjectProcessFlow = z.infer<typeof flowSchema>;
export type ProjectProcessFlowStep = z.infer<typeof flowStepSchema>;
export type ProjectProcessUi = z.infer<typeof uiSchema>;
export type ProjectProcessSection = z.infer<typeof projectProcessSectionSchema>;
