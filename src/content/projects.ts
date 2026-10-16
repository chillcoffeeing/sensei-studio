// Loader de casos de estudio: lee src/content/data/projects/*.json (un PageDoc por proyecto, plantilla
// case-study), inyecta el microcopy común (content/case-study.ts) en el `ui` de cada sección, valida
// y deriva lo que no se escribe a mano: la tarjeta de "Siguiente proyecto" y la de /links salen del
// hero del proyecto destino (docs/content-model.md, regla 5). Cambiar a un CMS = cambiar este archivo.
import type { Page, SectionOf } from '@/app/sections';
import type { MediaRef } from '@/core/content';
import { clampText, formatTitle } from '@/core/seo';
import { caseStudyUi, type CaseStudyUi } from './case-study';
import { parsePageDoc, warnOutsideTemplate } from './parse';
import site from './site';

const files = import.meta.glob<unknown>('./data/projects/*.json', { eager: true, import: 'default' });

/** Ruta pública de un caso. */
export const projectPath = (slug: string) => `/proyectos/${slug}/`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasUi = (type: unknown): type is keyof CaseStudyUi => typeof type === 'string' && Object.hasOwn(caseStudyUi, type);

// El `ui` del JSON (si lo hubiera) se sustituye: el microcopy tiene una sola fuente.
function withUi(data: unknown): unknown {
  if (!isRecord(data) || !Array.isArray(data.sections)) return data;
  const sections: unknown[] = data.sections;
  const results = sections.find((section) => isRecord(section) && section.sectionType === 'project-results');
  const resultsId = isRecord(results) && typeof results.id === 'string' ? results.id : undefined;
  return {
    ...data,
    sections: sections.map((section) => {
      if (!isRecord(section) || !isRecord(section.content) || !hasUi(section.sectionType)) return section;
      const hero = caseStudyUi['project-hero'];
      const ui =
        section.sectionType === 'project-hero'
          ? { ...hero, explore: { ...hero.explore, href: resultsId ? `#${resultsId}` : undefined } }
          : caseStudyUi[section.sectionType];
      return { ...section, content: { ...section.content, ui } };
    }),
  };
}

const plainParts = (value: unknown) =>
  Array.isArray(value) ? value.map((part) => (typeof part === 'string' ? part : isRecord(part) ? String(part.text ?? '') : '')).join('') : '';

const DESCRIPTION_MAX = 160;

// SEO por defecto de un caso (docs/seo.md §3-4), derivado del hero: "<Proyecto> · Caso de estudio ·
// Sensei Studio", descripción = resumen del hero, og:image = portada (1200 × 630) con su nombre como
// alt y ogType article. Lo que el JSON traiga en `seo` manda; el esquema valida el resultado.
function withSeo(data: unknown): unknown {
  if (!isRecord(data) || !Array.isArray(data.sections)) return data;
  const sections: unknown[] = data.sections;
  const hero = sections.find((section) => isRecord(section) && section.sectionType === 'project-hero');
  if (!isRecord(hero)) return data;
  const heading = isRecord(hero.headingContent) ? hero.headingContent : {};
  const content = isRecord(hero.content) ? hero.content : {};
  const name = plainParts(heading.title);
  const cover = isRecord(content.cardImage) && typeof content.cardImage.src === 'string' ? content.cardImage.src : undefined;
  const derived = {
    title: formatTitle(site.meta.titleTemplate, `${name} · Caso de estudio`),
    ...(typeof content.summary === 'string' && { description: clampText(content.summary, DESCRIPTION_MAX) }),
    ...(cover && { ogImage: cover, ogImageAlt: name }),
    ogType: 'article',
  };
  return { ...data, seo: { ...derived, ...(isRecord(data.seo) ? data.seo : {}) } };
}

const authored: Page[] = Object.entries(files)
  .map(([file, data]) => parsePageDoc(file, withSeo(withUi(data))))
  // Orden de "siguiente proyecto" cuando no se indica: alfabético por slug, cíclico.
  .sort((a, b) => a.slug.localeCompare(b.slug));
for (const project of authored) warnOutsideTemplate(project, 'case-study');

function sectionOf<T extends Page['sections'][number]['sectionType']>(page: Page, type: T): SectionOf<T> | undefined {
  return page.sections.find((section): section is SectionOf<T> => section.sectionType === type);
}

const plain = (value: Array<string | { text: string }>) => value.map((part) => (typeof part === 'string' ? part : part.text)).join('');

/** Datos de tarjeta de un proyecto, derivados de su hero (portada `cardImage`; si no hay, la imagen de cierre) y de sus resultados. */
export interface ProjectCardData {
  href: string;
  image: MediaRef;
  name: string;
  category: string;
  claim: string[];
  /** Cifras de `project-results` (valor + etiqueta), en su orden; vacío si el caso no tiene. */
  metrics: { value: string; label: string }[];
}

function cardOf(project: Page): ProjectCardData {
  const hero = sectionOf(project, 'project-hero');
  if (!hero) throw new Error(`content: el proyecto "${project.slug}" no tiene sección project-hero`);
  const image =
    hero.content.cardImage ?? sectionOf(project, 'project-conclusion')?.content.image ?? sectionOf(project, 'project-solution')?.content.media[0];
  if (!image) throw new Error(`content: el proyecto "${project.slug}" no tiene imagen para su tarjeta (cardImage, conclusión o solución)`);
  return {
    href: projectPath(project.slug),
    image,
    name: plain(hero.headingContent.title),
    category: plain(hero.headingContent.description),
    claim: hero.content.claim,
    metrics: (sectionOf(project, 'project-results')?.content.metrics ?? []).map(({ value, label }) => ({ value, label })),
  };
}

function nextSlug(project: Page, index: number): string | undefined {
  const explicit = sectionOf(project, 'project-next')?.content.projectSlug;
  if (explicit) {
    if (!authored.some((candidate) => candidate.slug === explicit)) {
      throw new Error(`content: "${project.slug}" apunta a un proyecto siguiente inexistente: "${explicit}"`);
    }
    return explicit;
  }
  return authored[(index + 1) % authored.length]?.slug;
}

// Con un solo proyecto, el siguiente cíclico sería él mismo: sin tarjeta, la sección no se pinta.
function withNextCard(project: Page, index: number): Page {
  const target = nextSlug(project, index);
  const destination = target && target !== project.slug ? authored.find((candidate) => candidate.slug === target) : undefined;
  return {
    ...project,
    sections: project.sections.map((section) => {
      if (section.sectionType !== 'project-next') return section;
      const card = destination ? cardOf(destination) : undefined;
      return {
        ...section,
        content: {
          ...section.content,
          card: card && { href: card.href, image: card.image, category: card.category, name: card.name, summary: card.claim },
        },
      };
    }),
  };
}

export const projects: Page[] = authored.map(withNextCard);

/**
 * Todos los slugs en el orden del ciclo "Siguiente proyecto", empezando por el primero alfabético.
 * Si el ciclo no recorre todos (enlaces explícitos que se cierran antes), el resto va al final.
 */
export function projectCycle(): string[] {
  const order: string[] = [];
  let index = 0;
  while (index >= 0 && authored[index] && !order.includes(authored[index].slug)) {
    const project = authored[index];
    order.push(project.slug);
    const next = nextSlug(project, index);
    index = authored.findIndex((candidate) => candidate.slug === next);
  }
  return [...order, ...authored.map((project) => project.slug).filter((slug) => !order.includes(slug))];
}

/** Microcopy del botón de cada tarjeta del índice /proyectos/ (regla 6: fuera del documento). */
export const projectCardCta = 'Ver proyecto';

/** Tarjeta de un proyecto por slug (falla en build si no existe). */
export function projectCard(slug: string): ProjectCardData {
  const project = projects.find((candidate) => candidate.slug === slug);
  if (!project) throw new Error(`content: no hay proyecto "${slug}" en src/content/data/projects/`);
  return cardOf(project);
}
