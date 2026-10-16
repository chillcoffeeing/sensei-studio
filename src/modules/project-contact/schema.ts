import { z } from 'astro/zod';
import { headingSchema, linkSchema, mediaRefSchema, sectionSchema, toneTextSchema } from '@/core/content';

export const projectContactHeadingSchema = headingSchema.extend({ eyebrow: z.string().min(1), title: toneTextSchema });

/** Microcopy común a todos los casos (content/case-study.ts); el loader lo inyecta antes de validar. */
const uiSchema = z.strictObject({
  /** Flechas decorativas de cada acción (tinta sobre lima, blanca sobre tinta). */
  meetingIcon: mediaRefSchema,
  quoteIcon: mediaRefSchema,
});

export const projectContactContentSchema = z.strictObject({
  /** "Agenda una reunión" (píldora lima). Lleva `data-advice-open`: con JS abre el modal de asesoría. */
  meeting: linkSchema,
  /**
   * "Solicita una cotización". Lleva `data-quote-open`: el modal de cotización intercepta el clic;
   * sin JS, `href` lleva al formulario de contacto.
   */
  quote: linkSchema,
  /** Nota bajo las acciones: una entrada por línea. */
  note: z.array(z.string().min(1)).min(1),
  ui: uiSchema,
});

export const projectContactSectionSchema = sectionSchema('project-contact', projectContactHeadingSchema, projectContactContentSchema);

export type ProjectContactContent = z.infer<typeof projectContactContentSchema>;
export type ProjectContactUi = z.infer<typeof uiSchema>;
export type ProjectContactSection = z.infer<typeof projectContactSectionSchema>;
