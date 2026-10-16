// Plantillas = listas ordenadas de sectionType (docs/content-model.md). Sirven para crear una
// página nueva y para avisar en build si un documento usa un tipo fuera de su plantilla.
import type { SectionType } from './sections';

export const TEMPLATES = {
  home: [
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
  ],
  'project-index': ['project-index'],
  'case-study': [
    'project-hero',
    'project-results',
    'project-context',
    'project-solution',
    'project-process',
    'project-scope',
    'project-conclusion',
    'project-next',
    'project-contact',
  ],
} as const satisfies Record<string, readonly SectionType[]>;

export type TemplateName = keyof typeof TEMPLATES;

/** Tipos del documento que su plantilla no contempla (lista vacía = conforme). */
export function typesOutsideTemplate(template: TemplateName, types: readonly SectionType[]): SectionType[] {
  const allowed: readonly SectionType[] = TEMPLATES[template];
  return types.filter((type) => !allowed.includes(type));
}
