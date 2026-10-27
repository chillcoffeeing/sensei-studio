// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';

// Dominio de producción (docs/seo.md §2; confirmado por el usuario el 2026-10-15).
// SITE_URL lo sobrescribe en otros entornos (p. ej. SITE_URL=https://preview.ejemplo pnpm build).
// De `site` salen canonical, og:url, og:image absoluta, JSON-LD, sitemap.xml y robots.txt.
const PRODUCTION_SITE = 'https://bysensei.com';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || PRODUCTION_SITE,
  vite: {
    plugins: [tailwindcss()],
  },
  // Sitio 100 % estático (DEPLOY-STATIC): `astro build` deja en dist/ archivos planos que Apache
  // (cPanel) sirve tal cual; sin adapter ni rutas server-rendered. Reglas del servidor: public/.htaccess.
  output: 'static',
  integrations: [svelte()],
});
