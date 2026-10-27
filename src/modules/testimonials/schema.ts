import { z } from 'astro/zod';
import { headingSchema, linkSchema, mediaRefSchema, sectionSchema, toneTextSchema } from '@/core/content';

/** Cabecera común obligatoria (Figma 35:150). */
export const testimonialsHeadingSchema = headingSchema.extend({ eyebrow: z.string().min(1), title: toneTextSchema });

const testimonialSchema = z.strictObject({
  /** Nombre del cliente tal como lo firma (las iniciales del avatar se derivan de aquí). */
  name: z.string().min(1),
  /** Rol bajo el nombre: en esta web es el título del proyecto. */
  role: z.string().min(1),
  /** Cita textual (los "..." son del original). */
  quote: z.string().min(1),
});

/** Prueba social de la cabecera (Figma 38:319), pintada con TrustBadge (mismo contrato que sus props). */
const testimonialsTrustSchema = z.strictObject({
  /** Avatares de la pila (decorativos). Sin `photo` (no hay fotos de clientes), silueta neutra. */
  avatars: z.array(z.strictObject({ photo: mediaRefSchema.optional() })).min(1),
  /** Contador que cierra la pila: visible ("56+") y lectura accesible. */
  count: z.strictObject({ value: z.string().min(1), label: z.string().min(1) }),
  /** Estrellas y su texto alternativo ("5 de 5"). */
  rating: z.strictObject({ stars: z.number().int().min(0).max(5), label: z.string().min(1) }),
  /** Texto en dos tonos bajo las estrellas; `lang` si no está en español. */
  caption: z.strictObject({ text: toneTextSchema, lang: z.string().optional() }),
});

export const testimonialsContentSchema = z.strictObject({
  trust: testimonialsTrustSchema,
  /** Enlace de texto de la cabecera ("DÉJANOS UN COMENTARIO   +", Figma 38:321); `marker` es decorativo. */
  cta: linkSchema.extend({ marker: z.string() }),
  /** Nombre accesible de la región del masonry (se desplaza sola y es enfocable). */
  masonryLabel: z.string().min(1),
  /** Reseñas en orden de lectura; el masonry las reparte en columnas. */
  reviews: z.array(testimonialSchema).min(1),
});

export const testimonialsSectionSchema = sectionSchema('testimonials', testimonialsHeadingSchema, testimonialsContentSchema);

export type Testimonial = z.infer<typeof testimonialSchema>;
export type TestimonialsTrust = z.infer<typeof testimonialsTrustSchema>;
export type TestimonialsContent = z.infer<typeof testimonialsContentSchema>;
export type TestimonialsSection = z.infer<typeof testimonialsSectionSchema>;
