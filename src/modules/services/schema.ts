import { z } from 'astro/zod';
import { headingSchema, mediaRefSchema, sectionSchema, toneTextSchema } from '@/core/content';

/** Cabecera común obligatoria (Figma 31:20); `description` alineada a la derecha (31:30). */
export const servicesHeadingSchema = headingSchema.extend({
  eyebrow: z.string().min(1),
  title: toneTextSchema,
  description: toneTextSchema,
});

const serviceItemSchema = z.strictObject({
  /** Título de la fila (Figma 31:51 / 33:31). */
  title: z.string().min(1),
  /** Descripción del panel abierto (Figma 33:65). */
  description: z.string().min(1),
  /** Lista con viñetas lima del panel abierto (Figma 33:67). */
  items: z.array(z.string().min(1)).min(1),
  /** Imágenes del panel abierto (Figma 33:52: 3 de 187 × 318, radio 5). */
  images: z.array(mediaRefSchema),
});

export const servicesContentSchema = z.strictObject({
  /** Servicios en el orden de Figma; el primero aparece abierto. */
  services: z.array(serviceItemSchema).min(1),
});

export const servicesSectionSchema = sectionSchema('services', servicesHeadingSchema, servicesContentSchema);

export type ServiceItem = z.infer<typeof serviceItemSchema>;
export type ServicesContent = z.infer<typeof servicesContentSchema>;
export type ServicesSection = z.infer<typeof servicesSectionSchema>;
