import { z } from 'astro/zod';
import { headingSchema, mediaRefSchema, sectionSchema, toneTextSchema } from '@/core/content';

/** title = nombre del proyecto (h1), eyebrow = estado del caso, description = categoría. */
export const projectHeroHeadingSchema = headingSchema.extend({
  eyebrow: z.string().min(1),
  title: toneTextSchema,
  description: toneTextSchema,
});

const factSchema = z.strictObject({ label: z.string().min(1), value: z.string().min(1) });

/** Microcopy común a todos los casos (content/case-study.ts); el loader lo inyecta antes de validar. */
export const projectHeroUiSchema = z.strictObject({
  /** "Todos los proyectos" con su flecha inicial decorativa. */
  back: z.strictObject({ label: z.string().min(1), href: z.string().min(1), marker: z.string() }),
  /** "Explorar resultados": `href` es el ancla de la sección project-results del documento; sin ella no se pinta. */
  explore: z.strictObject({ label: z.string().min(1), href: z.string().startsWith('#').optional(), icon: mediaRefSchema }),
  /** Nombre accesible de la ficha breve. */
  factsLabel: z.string().min(1),
});

export const projectHeroContentSchema = z.strictObject({
  /**
   * Portada del proyecto (src/assets/images/portadas-de-proyectos/<slug>): SOLO para sus tarjetas
   * (galería de la home, /proyectos/, "Siguiente proyecto", /links). El hero no la pinta: va en tinta.
   */
  cardImage: mediaRefSchema.optional(),
  /** Logotipo del cliente sobre el nombre (Remittven, Las Doñas). */
  logo: mediaRefSchema.optional(),
  /** Promesa del caso: una entrada por línea. */
  claim: z.array(z.string().min(1)).min(1),
  summary: z.string().min(1),
  /** Ficha breve (cliente, duración, rol). */
  facts: z.array(factSchema).min(1),
  ui: projectHeroUiSchema,
});

export const projectHeroSectionSchema = sectionSchema('project-hero', projectHeroHeadingSchema, projectHeroContentSchema);

export type ProjectHeroContent = z.infer<typeof projectHeroContentSchema>;
export type ProjectHeroUi = z.infer<typeof projectHeroUiSchema>;
export type ProjectHeroFact = z.infer<typeof factSchema>;
export type ProjectHeroSection = z.infer<typeof projectHeroSectionSchema>;
