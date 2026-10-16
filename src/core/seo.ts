// SEO técnico (robots.txt, sitemap.xml, títulos y JSON-LD; docs/seo.md). Funciones puras: las rutas de
// pages/ y DocumentHead les pasan `site` y los datos ya resueltos.

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** URL absoluta de una ruta (`/`, `/otra/`) contra el dominio `site`. */
export function absoluteUrl(pathname: string, site: URL | string): string {
  return new URL(pathname, site).href;
}

/** sitemap.xml (protocolo 0.9) con las URLs absolutas indexables. */
export function buildSitemap(urls: string[]): string {
  const entries = urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

/** robots.txt: todo rastreable y referencia al sitemap absoluto. */
export function buildRobots(sitemapUrl: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
}

// --- Títulos -----------------------------------------------------------------------------

/** Aplica la plantilla de título del sitio (`{title} · Sensei Studio`). */
export const formatTitle = (template: string, title: string) => template.replace('{title}', title);

/** Recorta un texto a `max` caracteres por la última palabra completa (descripciones derivadas). */
export function clampText(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 0)) || cut}…`;
}

// --- Datos estructurados (docs/seo.md §5) ------------------------------------------------

/** Miga de pan: nombre visible + ruta (`/`, `/proyectos/`). */
export interface Crumb {
  name: string;
  path: string;
}

/**
 * Qué declara cada página para su JSON-LD, además de Organization + WebSite (comunes):
 * - `home`: ProfessionalService (servicios) + FAQPage (preguntas de la sección FAQ);
 * - `case`: CreativeWork + BreadcrumbList;
 * - `collection`: CollectionPage + BreadcrumbList;
 * - `page`: solo los comunes.
 */
export type PageSchema =
  | { type: 'home'; services: string[]; faq: { question: string; answer: string }[] }
  | { type: 'case'; name: string; breadcrumb: Crumb[] }
  | { type: 'collection'; breadcrumb: Crumb[] }
  | { type: 'page' };

/** Datos del sitio que entran en el grafo (subconjunto de SiteMeta, con URLs ya absolutas). */
export interface JsonLdSite {
  name: string;
  url: string;
  language: string;
  email: string;
  logo: string;
  sameAs: string[];
  areaServed: string[];
}

/** La página concreta: URL canónica, textos e imagen para compartir absolutos. */
export interface JsonLdPage {
  url: string;
  title: string;
  description: string;
  image?: string;
}

type Node = Record<string, unknown>;

const breadcrumbList = (id: string, crumbs: Crumb[], site: JsonLdSite): Node => ({
  '@type': 'BreadcrumbList',
  '@id': `${id}#breadcrumb`,
  itemListElement: crumbs.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path, site.url),
  })),
});

/** Grafo JSON-LD de una página: comunes + los de su tipo + `extra` (seo.jsonLd, solo agrega). */
export function buildJsonLd(site: JsonLdSite, page: JsonLdPage, schema: PageSchema, extra: Node[] = []): Node {
  const orgId = `${site.url}#organization`;
  const websiteId = `${site.url}#website`;
  const org = { '@id': orgId };
  const nodes: Node[] = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: site.name,
      url: site.url,
      logo: { '@type': 'ImageObject', url: site.logo },
      email: site.email,
      ...(site.sameAs.length > 0 && { sameAs: site.sameAs }),
    },
    { '@type': 'WebSite', '@id': websiteId, name: site.name, url: site.url, inLanguage: site.language, publisher: org },
  ];

  if (schema.type === 'home') {
    nodes.push({
      '@type': 'ProfessionalService',
      '@id': `${site.url}#service`,
      name: site.name,
      url: site.url,
      description: page.description,
      email: site.email,
      ...(page.image && { image: page.image }),
      logo: site.logo,
      areaServed: site.areaServed,
      knowsAbout: schema.services,
      parentOrganization: org,
    });
    if (schema.faq.length > 0) {
      nodes.push({
        '@type': 'FAQPage',
        '@id': `${page.url}#faq`,
        url: page.url,
        inLanguage: site.language,
        mainEntity: schema.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      });
    }
  }
  if (schema.type === 'case') {
    nodes.push(
      {
        '@type': 'CreativeWork',
        '@id': `${page.url}#work`,
        name: schema.name,
        headline: page.title,
        description: page.description,
        url: page.url,
        inLanguage: site.language,
        ...(page.image && { image: page.image }),
        creator: org,
        isPartOf: { '@id': websiteId },
      },
      breadcrumbList(page.url, schema.breadcrumb, site),
    );
  }
  if (schema.type === 'collection') {
    nodes.push(
      {
        '@type': 'CollectionPage',
        '@id': `${page.url}#page`,
        name: page.title,
        description: page.description,
        url: page.url,
        inLanguage: site.language,
        isPartOf: { '@id': websiteId },
        breadcrumb: { '@id': `${page.url}#breadcrumb` },
      },
      breadcrumbList(page.url, schema.breadcrumb, site),
    );
  }

  // Los nodos extra entran al mismo grafo: su @context sobra (lo da el grafo).
  const extras = extra.map(({ '@context': _context, ...node }) => node);
  return { '@context': 'https://schema.org', '@graph': [...nodes, ...extras] };
}
