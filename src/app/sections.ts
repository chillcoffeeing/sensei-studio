// Unión discriminada de las secciones (por `sectionType`) y esquema de PageDoc. Cada esquema
// viene de modules/<type>/schema.ts a través de su index.ts. Contrato: docs/content-model.md.
import { z } from 'astro/zod';
import { pageDocSchema, type PageDoc } from '@/core/content';
import { contactSectionSchema } from '@/modules/contact';
import { faqSectionSchema } from '@/modules/faq';
import { heroSectionSchema } from '@/modules/hero';
import { processSectionSchema } from '@/modules/process';
import { projectGallerySectionSchema } from '@/modules/project-gallery';
import { projectHeroSectionSchema } from '@/modules/project-hero';
import { projectIndexSectionSchema } from '@/modules/project-index';
import { projectResultsSectionSchema } from '@/modules/project-results';
import { projectContextSectionSchema } from '@/modules/project-context';
import { projectSolutionSectionSchema } from '@/modules/project-solution';
import { projectProcessSectionSchema } from '@/modules/project-process';
import { projectScopeSectionSchema } from '@/modules/project-scope';
import { projectConclusionSectionSchema } from '@/modules/project-conclusion';
import { projectNextSectionSchema } from '@/modules/project-next';
import { projectContactSectionSchema } from '@/modules/project-contact';
import { servicesSectionSchema } from '@/modules/services';
import { showcaseSectionSchema } from '@/modules/showcase';
import { statsSectionSchema } from '@/modules/stats';
import { teamSectionSchema } from '@/modules/team';
import { testimonialsSectionSchema } from '@/modules/testimonials';

/** Enum cerrado de tipos de sección. */
export const SECTION_TYPES = [
  'hero',
  'project-gallery',
  'stats',
  'process',
  'services',
  'showcase',
  'testimonials',
  'team',
  'faq',
  'contact',
  'project-index',
  'project-hero',
  'project-results',
  'project-context',
  'project-solution',
  'project-process',
  'project-scope',
  'project-conclusion',
  'project-next',
  'project-contact',
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const sectionDocSchema = z.discriminatedUnion('sectionType', [
  heroSectionSchema,
  projectGallerySectionSchema,
  statsSectionSchema,
  processSectionSchema,
  servicesSectionSchema,
  showcaseSectionSchema,
  testimonialsSectionSchema,
  teamSectionSchema,
  faqSectionSchema,
  contactSectionSchema,
  projectIndexSectionSchema,
  projectHeroSectionSchema,
  projectResultsSectionSchema,
  projectContextSectionSchema,
  projectSolutionSectionSchema,
  projectProcessSectionSchema,
  projectScopeSectionSchema,
  projectConclusionSectionSchema,
  projectNextSectionSchema,
  projectContactSectionSchema,
]);

export type Section = z.infer<typeof sectionDocSchema>;

// El enum y la unión no pueden divergir: si falta o sobra un tipo, esto no compila.
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const sameTypes: Same<SectionType, Section['sectionType']> = true;
void sameTypes;

export const pageSchema = pageDocSchema(sectionDocSchema);

export type Page = PageDoc<Section>;

export type SectionOf<T extends SectionType> = Extract<Section, { sectionType: T }>;
