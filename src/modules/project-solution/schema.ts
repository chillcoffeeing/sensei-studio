import { z } from 'astro/zod';
import { headingSchema, mediaRefSchema, sectionSchema, toneTextSchema } from '@/core/content';

export const projectSolutionHeadingSchema = headingSchema.extend({ eyebrow: z.string().min(1), title: toneTextSchema });

/** Lámina de marca: cabecera, logotipo tipográfico, concepto y paleta. */
const identitySchema = z.strictObject({
  /** Cabecera de la lámina ("… / Sistema de marca"). */
  overline: z.string().min(1),
  /** Año a la derecha de la cabecera. */
  year: z.string().min(1),
  /** Logotipo tipográfico. */
  wordmark: z.string().min(1),
  /** Concepto: una entrada por línea. */
  concept: z.array(z.string().min(1)).min(1),
  /** Colores de marca en hex (#RGB o #RRGGBB). */
  palette: z.array(z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/)).min(1),
});

/** Pie de un bloque de la solución: descripción a la izquierda y etiquetas en gris. */
const captionSchema = z.strictObject({ text: z.string().min(1), tags: z.string().min(1).optional() });

/** Microcopy común a todos los casos (content/case-study.ts); el loader lo inyecta antes de validar. */
const uiSchema = z.strictObject({
  /** Nombre accesible de la paleta. */
  paletteLabel: z.string().min(1),
});

export const projectSolutionContentSchema = z.strictObject({
  identity: identitySchema,
  /** El 1.º acompaña a la lámina; el resto va a todo el ancho, uno por bloque. Vacío: la lámina ocupa la fila. */
  media: z.array(mediaRefSchema),
  /** Pie de cada bloque, por posición: [0] = lámina + media[0], [n] = media[n]; `null` = sin pie. */
  captions: z.array(captionSchema.nullable()).optional(),
  ui: uiSchema,
});

export const projectSolutionSectionSchema = sectionSchema('project-solution', projectSolutionHeadingSchema, projectSolutionContentSchema);

export type ProjectSolutionContent = z.infer<typeof projectSolutionContentSchema>;
export type ProjectSolutionIdentity = z.infer<typeof identitySchema>;
export type ProjectSolutionCaption = z.infer<typeof captionSchema>;
export type ProjectSolutionSection = z.infer<typeof projectSolutionSectionSchema>;
