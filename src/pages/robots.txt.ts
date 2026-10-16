import type { APIRoute } from 'astro';
import { absoluteUrl, buildRobots } from '@/core/seo';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('robots.txt necesita `site` en astro.config.mjs');
  return new Response(buildRobots(absoluteUrl('/sitemap.xml', site)), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
