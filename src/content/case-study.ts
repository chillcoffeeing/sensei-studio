// Microcopy de interfaz común a todos los casos de estudio (docs/content-model.md, regla 6): lo que
// se repite igual en cada proyecto no vive en su JSON. content/projects.ts lo inyecta en el `ui` de
// cada sección antes de validar. Copy de Figma (archivo flzA0qnj6JdalFCgyB2PdI, Yupa 243:21);
// los rótulos solo para lectores de pantalla son propios.
import type { SectionOf, SectionType } from '@/app/sections';

type UiOf<T extends SectionType> = SectionOf<T>['content'] extends { ui: infer U } ? U : never;

/** Tipos de case-study que llevan microcopy común. */
export type CaseStudyUi = {
  'project-hero': UiOf<'project-hero'>;
  'project-results': UiOf<'project-results'>;
  'project-context': UiOf<'project-context'>;
  'project-solution': UiOf<'project-solution'>;
  'project-process': UiOf<'project-process'>;
  'project-next': UiOf<'project-next'>;
  'project-contact': UiOf<'project-contact'>;
};

export const caseStudyUi: CaseStudyUi = {
  'project-hero': {
    back: { label: 'Todos los proyectos', href: '/proyectos/', marker: '←' },
    // `href` lo pone el loader: el ancla de la sección project-results del documento.
    explore: { label: 'Explorar resultados', icon: { src: 'case-study/arrow-down.svg', alt: '' } },
    factsLabel: 'Ficha breve del proyecto',
  },
  'project-results': {
    comparison: { separator: '→', before: 'Antes:', after: 'Después:' },
  },
  'project-context': {
    fieldsLabel: 'Ficha del proyecto',
  },
  'project-solution': {
    paletteLabel: 'Paleta de color',
  },
  'project-process': {
    routeSeparator: '→',
    deliverableLabel: 'Entregable:',
    flowArrow: { src: 'case-study/flow-arrow.svg', alt: '' },
    noteLabel: 'Nota:',
    stepper: {
      label: 'Etapas del proceso',
      roleDescription: 'carrusel',
      slideRoleDescription: 'etapa',
      slidePosition: 'Etapa {index} de {total}',
    },
  },
  'project-next': {
    cta: 'Explorar caso',
    icon: { src: 'case-study/arrow-up-right-lg.svg', alt: '' },
  },
  'project-contact': {
    meetingIcon: { src: 'case-study/arrow-up-right-ink.svg', alt: '' },
    quoteIcon: { src: 'case-study/arrow-up-right-paper.svg', alt: '' },
  },
};
