import { z } from 'astro/zod';
import { headingSchema, mediaRefSchema, sectionSchema, toneTextSchema } from '@/core/content';

/** `title` es el h1 de la página (lo leen lectores de pantalla y buscadores); el wordmark es su forma visual. */
export const heroHeadingSchema = headingSchema.extend({ title: toneTextSchema });

export const heroContentSchema = z.strictObject({
  /** Wordmark tipográfico (Figma 11:27): nombre grande y sufijo alineado a la derecha debajo. */
  wordmark: z.strictObject({ name: z.string().min(1), suffix: z.string() }),
  /** Nombre accesible de la lista de servicios. */
  servicesLabel: z.string().min(1),
  services: z.array(z.string().min(1)).min(1),
  /** Lead en dos tonos (11:25): frase destacada + resto atenuado. */
  lead: toneTextSchema,
  /** Video decorativo de fondo (FIX-HERO-VIDEO): `kind: 'video'`, mp4 o webm. Sin él, fondo ink + ruido. */
  background: mediaRefSchema.optional(),
});

export const heroSectionSchema = sectionSchema('hero', heroHeadingSchema, heroContentSchema);

export type HeroContent = z.infer<typeof heroContentSchema>;
export type HeroWordmark = HeroContent['wordmark'];
export type HeroSection = z.infer<typeof heroSectionSchema>;
