import { z } from 'astro/zod';
import { mediaRefSchema, sectionSchema } from '@/core/content';

export const logoMarqueeContentSchema = z.strictObject({
  /** Nombre accesible de la franja (Figma 17:553 no tiene título visible). */
  label: z.string().min(1),
  /** Logos (SVG por clave) en el orden de Figma 17:553; `alt` = nombre de la marca. */
  logos: z.array(mediaRefSchema).min(1),
});

/** Sin cabecera: la franja no tiene título visible. */
export const logoMarqueeSectionSchema = sectionSchema('logo-marquee', z.never().optional(), logoMarqueeContentSchema);

export type LogoMarqueeContent = z.infer<typeof logoMarqueeContentSchema>;
export type LogoMarqueeSection = z.infer<typeof logoMarqueeSectionSchema>;
