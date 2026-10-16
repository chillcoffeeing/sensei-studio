import { z } from 'astro/zod';
import { headingSchema, sectionSchema, toneTextSchema } from '@/core/content';

/** Cabecera común obligatoria (Figma 29:251); `description` a la derecha, primera frase strong (29:247). */
export const statsHeadingSchema = headingSchema.extend({
  eyebrow: z.string().min(1),
  title: toneTextSchema,
  description: toneTextSchema,
});

const statItemSchema = z.strictObject({
  /** Cifra destacada ("+250", "97%", "1 punto"). */
  value: z.string().min(1),
  /** Etiqueta bajo el separador. */
  label: z.string().min(1),
  /** Etiqueta en columna estrecha (Figma 29:299: 209px en vez de 308), para que corte en dos líneas. */
  narrowLabel: z.boolean().optional(),
});

export const statsContentSchema = z.strictObject({
  /** Métricas en orden de lectura (Figma 29:307). */
  items: z.array(statItemSchema).min(1),
});

export const statsSectionSchema = sectionSchema('stats', statsHeadingSchema, statsContentSchema);

export type StatItem = z.infer<typeof statItemSchema>;
export type StatsContent = z.infer<typeof statsContentSchema>;
export type StatsSection = z.infer<typeof statsSectionSchema>;
