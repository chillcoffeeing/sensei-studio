// Qué declara cada documento para su JSON-LD (docs/seo.md §5). Se deriva de las secciones, nunca se
// escribe a mano; DocumentHead lo convierte en el grafo con core/seo.ts.
import type { Page, SectionOf } from '@/app/sections';
import type { Crumb, PageSchema } from '@/core/seo';
import { HOME_SLUG, routeParam } from './pages';
import { projectCard, projectPath } from './projects';

/** Nombres de las migas de pan (BreadcrumbList). */
const crumbLabels = { home: 'Inicio', projects: 'Proyectos' };

const homeCrumb: Crumb = { name: crumbLabels.home, path: '/' };
const projectsCrumb: Crumb = { name: crumbLabels.projects, path: '/proyectos/' };

function sectionOf<T extends Page['sections'][number]['sectionType']>(page: Page, type: T): SectionOf<T> | undefined {
  return page.sections.find((section): section is SectionOf<T> => section.sectionType === type);
}

/** Esquema de una página de content/pages: home, índice de proyectos o página simple. */
export function pageSchemaOf(page: Page): PageSchema {
  if (page.slug === HOME_SLUG) {
    return {
      type: 'home',
      services: sectionOf(page, 'services')?.content.services.map((service) => service.title) ?? [],
      faq: sectionOf(page, 'faq')?.content.items ?? [],
    };
  }
  if (sectionOf(page, 'project-index')) {
    const slug = routeParam(page);
    const self = slug === 'proyectos' ? projectsCrumb : { name: page.seo.title, path: `/${slug}/` };
    return { type: 'collection', breadcrumb: [homeCrumb, self] };
  }
  return { type: 'page' };
}

/** Esquema de un caso de estudio: CreativeWork + Inicio › Proyectos › Caso. */
export function caseSchemaOf(project: Page): PageSchema {
  const { name } = projectCard(project.slug);
  return { type: 'case', name, breadcrumb: [homeCrumb, projectsCrumb, { name, path: projectPath(project.slug) }] };
}
