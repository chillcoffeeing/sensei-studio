import { z } from 'astro/zod';
import { headingSchema, mediaRefSchema, sectionSchema, toneTextSchema } from '@/core/content';

/** title = aprendizaje del caso (h2), description = desarrollo. */
export const projectConclusionHeadingSchema = headingSchema.extend({ eyebrow: z.string().min(1), title: toneTextSchema });

export const projectConclusionContentSchema = z.strictObject({
  /** Imagen que acompaña al aprendizaje (3:2). */
  image: mediaRefSchema,
});

export const projectConclusionSectionSchema = sectionSchema(
  'project-conclusion',
  projectConclusionHeadingSchema,
  projectConclusionContentSchema,
);

export type ProjectConclusionContent = z.infer<typeof projectConclusionContentSchema>;
export type ProjectConclusionSection = z.infer<typeof projectConclusionSectionSchema>;
