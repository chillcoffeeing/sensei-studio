import { z } from 'astro/zod';
import { headingSchema, sectionSchema, sliderLabelsSchema, toneTextSchema } from '@/core/content';

/** El título del bloque (Figma 35:132) es el h2 de la sección. */
export const processHeadingSchema = headingSchema.extend({ title: toneTextSchema });

const processStepSchema = z.strictObject({
  /** Número visible con dos dígitos ("01"). */
  number: z.string().min(1),
  title: z.string().min(1),
  /** Avance acumulado del proyecto al cerrar el paso, de 0 a 100 (se muestra como "25%"). */
  progress: z.number().min(0).max(100),
  description: z.string().min(1),
});

export const processContentSchema = z.strictObject({
  /** Pasos en orden; el progreso es creciente y el último llega a 100. */
  steps: z.array(processStepSchema).min(1),
  /** Textos accesibles del stepper de mobile (StepperSlider): región y "Paso n de N". */
  stepper: sliderLabelsSchema,
});

export const processSectionSchema = sectionSchema('process', processHeadingSchema, processContentSchema);

export type ProcessStep = z.infer<typeof processStepSchema>;
export type ProcessContent = z.infer<typeof processContentSchema>;
export type ProcessSection = z.infer<typeof processSectionSchema>;
