// Loader de páginas: lee src/content/data/pages/*.json (JSON puro con la forma de PageDoc), lo
// valida con el esquema de app/sections.ts y deriva lo que no se escribe a mano. Un dato inválido
// rompe el build con archivo, ruta y campo. Cambiar a un CMS = cambiar este archivo.
import type { Page, Section } from '@/app/sections';
import type { TemplateName } from '@/app/templates';
import type { ProjectCard } from '@/core/content';
import { parsePageDoc, warnOutsideTemplate } from './parse';
import { projectCard, projectCardCta, projectCycle } from './projects';

const files = import.meta.glob<unknown>('./data/pages/*.json', { eager: true, import: 'default' });

/** Slug que sirve en `/`. */
export const HOME_SLUG = 'home';

/** Plantilla de cada documento: el build avisa si usa un tipo de sección fuera de ella. */
const TEMPLATE_OF: Record<string, TemplateName> = { home: 'home', proyectos: 'project-index' };

const authored: Page[] = Object.entries(files).map(([file, data]) => parsePageDoc(file, data));
for (const page of authored) {
  const template = TEMPLATE_OF[page.slug];
  if (template) warnOutsideTemplate(page, template);
}

// Tarjetas de proyecto (docs/content-model.md, regla 5): el JSON solo lista slugs; cada tarjeta
// (portada, nombre, categoría, métricas y enlace) se deriva del caso. La comparten la galería de la
// home y el índice /proyectos/. Slug inexistente o caso sin métricas = error de build.
const MAX_CARD_METRICS = 4;

function cardsOf(slugs: readonly string[], cta: string): ProjectCard[] {
  return slugs.map((slug) => {
    const card = projectCard(slug);
    const metrics = card.metrics.slice(0, MAX_CARD_METRICS);
    if (metrics.length === 0) throw new Error(`content: el proyecto "${slug}" no tiene métricas en project-results para su tarjeta`);
    return { image: card.image, title: card.name, category: card.category, details: { metrics, link: { label: cta, href: card.href } } };
  });
}

function withDerivedCards(section: Section): Section {
  if (section.sectionType === 'project-gallery') {
    return { ...section, content: { ...section.content, cards: cardsOf(section.content.projects, section.content.cardCta) } };
  }
  if (section.sectionType === 'project-index') {
    const { projects } = section.content;
    const slugs = projects.length > 0 ? projects : projectCycle();
    return { ...section, content: { ...section.content, cards: cardsOf(slugs, projectCardCta) } };
  }
  return section;
}

export const pages: Page[] = authored.map((page) => ({ ...page, sections: page.sections.map(withDerivedCards) }));

/** Página por slug (falla en build si no existe). */
export function pageBySlug(slug: string): Page {
  const page = pages.find((candidate) => candidate.slug === slug);
  if (!page) throw new Error(`content: no hay página "${slug}" en src/content/data/pages/`);
  return page;
}

/** Parámetro `slug` de pages/[...slug].astro: `undefined` para la home (ruta `/`). */
export function routeParam(page: Page): string | undefined {
  return page.slug === HOME_SLUG ? undefined : page.slug;
}
