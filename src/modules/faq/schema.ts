import { z } from 'astro/zod';
import { headingSchema, sectionSchema, toneTextSchema } from '@/core/content';

/** Cabecera común obligatoria (Figma 41:406). */
export const faqHeadingSchema = headingSchema.extend({ eyebrow: z.string().min(1), title: toneTextSchema });

const faqItemSchema = z.strictObject({
  /** Pregunta (Figma 174:160…). */
  question: z.string().min(1),
  /** Respuesta del panel abierto (Figma 174:164). */
  answer: z.string().min(1),
});

export const faqContentSchema = z.strictObject({
  /** Idioma de preguntas y respuestas si no es el de la página (se declara con `lang`). */
  lang: z.string().optional(),
  /** Preguntas en el orden de Figma 174:157; la primera aparece abierta. */
  items: z.array(faqItemSchema).min(1),
});

export const faqSectionSchema = sectionSchema('faq', faqHeadingSchema, faqContentSchema);

export type FaqItem = z.infer<typeof faqItemSchema>;
export type FaqContent = z.infer<typeof faqContentSchema>;
export type FaqSection = z.infer<typeof faqSectionSchema>;
