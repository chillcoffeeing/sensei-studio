import type { APIRoute } from 'astro';
import { absoluteUrl, buildSitemap } from '@/core/seo';
import { pages, routeParam } from '@/content/pages';
import links from '@/content/links';
import { projectPath, projects } from '@/content/projects';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('sitemap.xml necesita `site` en astro.config.mjs');
  const pageUrls = pages
    .filter((page) => !page.seo.noindex)
    .map((page) => {
      const slug = routeParam(page);
      return absoluteUrl(slug ? `/${slug}/` : '/', site);
    });
  const projectUrls = projects.filter((project) => !project.seo.noindex).map((project) => absoluteUrl(projectPath(project.slug), site));
  // LINKS-PAGE: ruta estática propia (no es una Page de secciones).
  const linksUrls = links.seo.noindex ? [] : [absoluteUrl('/links/', site)];
  const urls = [...pageUrls, ...projectUrls, ...linksUrls];
  return new Response(buildSitemap(urls), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
