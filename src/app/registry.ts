import { Section as Contact } from '@/modules/contact';
import { Section as Faq } from '@/modules/faq';
import { Section as Hero } from '@/modules/hero';
import { Section as Process } from '@/modules/process';
import { Section as ProjectGallery } from '@/modules/project-gallery';
import { Section as ProjectHero } from '@/modules/project-hero';
import { Section as ProjectIndex } from '@/modules/project-index';
import { Section as ProjectResults } from '@/modules/project-results';
import { Section as ProjectContext } from '@/modules/project-context';
import { Section as ProjectSolution } from '@/modules/project-solution';
import { Section as ProjectProcess } from '@/modules/project-process';
import { Section as ProjectScope } from '@/modules/project-scope';
import { Section as ProjectConclusion } from '@/modules/project-conclusion';
import { Section as ProjectNext } from '@/modules/project-next';
import { Section as ProjectContact } from '@/modules/project-contact';
import { Section as Services } from '@/modules/services';
import { Section as Showcase } from '@/modules/showcase';
import { Section as Stats } from '@/modules/stats';
import { Section as Team } from '@/modules/team';
import { Section as Testimonials } from '@/modules/testimonials';
import type { Section, SectionOf, SectionType } from './sections';

/** Componente Astro de una sección: recibe la sección completa como prop `section`. */
export type SectionComponent<S extends Section = Section> = (props: { section: S }) => unknown;

/**
 * Un componente por cada `sectionType` del enum, con la prop tipada a su propia sección.
 * Si falta un tipo (o sobra uno), falla en compilación.
 */
export type SectionRegistry = { [T in SectionType]: SectionComponent<SectionOf<T>> };

export const registry = {
  hero: Hero,
  'project-gallery': ProjectGallery,
  stats: Stats,
  process: Process,
  services: Services,
  showcase: Showcase,
  testimonials: Testimonials,
  team: Team,
  faq: Faq,
  contact: Contact,
  'project-index': ProjectIndex,
  'project-hero': ProjectHero,
  'project-results': ProjectResults,
  'project-context': ProjectContext,
  'project-solution': ProjectSolution,
  'project-process': ProjectProcess,
  'project-scope': ProjectScope,
  'project-conclusion': ProjectConclusion,
  'project-next': ProjectNext,
  'project-contact': ProjectContact,
} satisfies SectionRegistry;

/**
 * Componente que renderiza `section`. Se lee a través de un Record<string, …> porque el registry
 * tipa cada clave con su propia sección. Si el tipo no está registrado lanza un Error descriptivo:
 * el build falla con un mensaje claro en vez de intentar renderizar `undefined`.
 */
export function componentFor(section: Section): SectionComponent {
  const { sectionType, id } = section;
  const component: SectionComponent | undefined = (registry as Readonly<Record<string, SectionComponent>>)[sectionType];
  if (!component) {
    throw new Error(
      `Sección sin registrar: sectionType "${sectionType}" (id "${id ?? '—'}"). Agrega su módulo a app/sections.ts y a app/registry.ts.`,
    );
  }
  return component;
}
