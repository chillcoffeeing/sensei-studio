import { z } from 'astro/zod';
import { headingSchema, mediaRefSchema, sectionSchema, sliderLabelsSchema, toneTextSchema } from '@/core/content';

/** El título grande del bloque (Figma 33:118) es el h2 de la sección. */
export const showcaseHeadingSchema = headingSchema.extend({ title: toneTextSchema });

const showcaseSlideSchema = z.strictObject({
  /** Imagen de la card (Figma 33:99: cubre 616 × 658 con object-cover, radio 5). */
  image: mediaRefSchema,
});

export const showcaseContentSchema = z.strictObject({
  /**
   * Textos accesibles del carrusel. Sin botón de pausa (UI-LIB-002): se detiene con foco de
   * teclado, al deslizar, con la pestaña oculta y con reduced-motion. El hover NO pausa.
   */
  carousel: sliderLabelsSchema,
  /** Cards en orden de lectura (izquierda → derecha). */
  slides: z.array(showcaseSlideSchema).min(1),
});

export const showcaseSectionSchema = sectionSchema('showcase', showcaseHeadingSchema, showcaseContentSchema);

export type ShowcaseSlide = z.infer<typeof showcaseSlideSchema>;
export type ShowcaseContent = z.infer<typeof showcaseContentSchema>;
export type ShowcaseSection = z.infer<typeof showcaseSectionSchema>;
