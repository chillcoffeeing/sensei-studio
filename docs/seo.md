# SEO y metadatos

Regla: **los datos declaran y `DocumentHead` emite.** Un dato que falta se hereda de la capa superior
(de la página al sitio) y nunca se duplica a mano. Código: `core/seo.ts` (títulos, JSON-LD, sitemap y
robots), `content/seo.ts` (qué declara cada documento) y `layout/DocumentHead.astro`.

## 1. Capas

| Capa | Dónde | Decide |
|---|---|---|
| Sitio | `content/site.ts` › `meta` | nombre, dominio, locale, correo, redes, logo, imagen y plantilla de título |
| Página | `seo` del `PageDoc` | título, descripción, keywords, `ogImage`, `noindex`, `jsonLd` extra |
| Caso | derivado de `project-hero` | título, descripción, `ogImage` = portada, `ogType: article` |
| Render | `DocumentHead.astro` | única pieza que escribe `<meta>` |

## 2. Dominio

`https://bysensei.com` es el `site` por defecto de `astro.config.mjs`; `SITE_URL` lo sobrescribe en
otros entornos. `canonical`, `og:*`, el sitemap y robots son absolutos y sin query ni hash.

## 3. Títulos

- Plantilla: `<página> · Sensei Studio`. La home usa su título completo.
- En los casos: `<Proyecto> · Caso de estudio · Sensei Studio`.
- Límites: título ≤ 60 caracteres y descripción entre 120 y 160. Los valida zod.

## 4. Preview al compartir

- Imagen de 1200 × 630 en JPG, con alt.
- Por defecto se usa `public/og-image.jpg` (Figma `flzA0qnj6JdalFCgyB2PdI` 41:464).
- En los casos se usa la portada, recortada por `getImage`.
- Además: `twitter:card = summary_large_image` y `og:locale = es_ES`.

## 5. JSON-LD (derivado, nunca a mano)

- Todas las páginas: `Organization` + `WebSite`.
- Home: `ProfessionalService` + `FAQPage` (sale de la sección FAQ).
- Casos: `CreativeWork` + `BreadcrumbList`.
- `/proyectos/`: `CollectionPage` + `BreadcrumbList`.
- `seo.jsonLd` solo **agrega** nodos.

## 6. Indexación

- `robots.txt` permite todo y apunta al sitemap.
- `noindex` en `/componentes` y en las páginas con `seo.noindex`, que además salen del sitemap.
- Antes del lanzamiento, el despliegue puede publicar sin indexar (`NOINDEX_FOR_DEPLOY`, `docs/deploy.md`).

## 7. Iconos

Figma 224:316. Archivos: `favicon.svg`, `favicon.ico` (32), `apple-touch-icon.png` (180),
`site.webmanifest` (iconos de 192 y 512, `theme_color`) y `<meta name="theme-color">`.

## Checklist de una página nueva

1. `seo.title` y `seo.description` propios, dentro de los límites.
2. Si no tiene imagen propia, hereda la del sitio.
3. El JSON-LD extra se deriva de sus secciones.
4. Si no debe indexarse, `noindex`.
5. En el HTML generado: un solo `<title>`, canonical y `og:image` absolutos y JSON-LD válido.
