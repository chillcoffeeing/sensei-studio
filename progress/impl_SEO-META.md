# impl SEO-META: SEO y metadatos según docs/seo.md

Sin `figmaNodes` (la imagen OG y el favicon van en SEO-OG-FAVICON). No hay cambios visuales ni tokens.

## Archivos

- `astro.config.mjs`: `site` por defecto `https://bysensei.com` (`PRODUCTION_SITE`); `SITE_URL` sigue sobrescribiendo. Se quitan el placeholder `.example` y su comentario.
- `src/core/site.ts`: `SiteMeta` gana `language`, `titleTemplate`, `email`, `logo`, `sameAs` y `areaServed`.
- `src/core/content.ts`: `seoSchema` gana `ogImageAlt`; `jsonLd` queda documentado como nodos que se agregan.
- `src/core/seo.ts`: `formatTitle`, `clampText`, tipos `PageSchema`/`Crumb` y `buildJsonLd` (grafo único: Organization + WebSite + nodos del tipo de página + `seo.jsonLd`).
- `src/content/site.ts`: `meta` con correo (`studioEmail`), logo del header, `sameAs: []` (PENDIENTE), `areaServed` y plantilla `{title} · Sensei Studio`.
- `src/content/seo.ts` (nuevo): `pageSchemaOf(page)` (home: servicios + FAQ de sus secciones; índice: CollectionPage + migas) y `caseSchemaOf(project)`.
- `src/content/projects.ts`: `withSeo` deriva el SEO de cada caso a partir del hero (título con plantilla, descripción = `summary` recortado a 160, `ogImage` = `cardImage`, `ogImageAlt` = nombre, `ogType: article`). Lo que el JSON trae manda.
- `src/content/data/projects/*.json` (4): se quitan `title`, `ogImage` y `ogType` del `seo` (ahora derivados); se quedan `description` y `keywords`.
- `src/content/links.ts`: sin keywords (docs/seo.md §6); título `Links · Sensei Studio` (plantilla).
- `src/layout/DocumentHead.astro`: única pieza que emite. `site` obligatorio (falla el build si falta), canonical/og:url/og:image siempre absolutos, `og:image:width/height` también para la variante local 1200 × 630, `og:image:alt`/`twitter:image:alt` siempre, y un solo `<script type="application/ld+json">` con el grafo.
- `src/layout/BaseLayout.astro`, `src/layout/StandaloneLayout.astro`: prop `schema` hacia `DocumentHead`.
- `src/pages/[...slug].astro`, `src/pages/proyectos/[slug].astro`: pasan `pageSchemaOf` / `caseSchemaOf`.
- `docs/content-model.md`: `ogImageAlt`, `jsonLd` agrega, `content/seo.ts` y `core/seo.ts` en el mapa, y la regla del SEO derivado de un caso.
- `design/content-gaps.md`: dominio actualizado; huecos nuevos `meta.sameAs`, `meta.areaServed` y `meta.logo`.

## Tokens

Ninguno.

## Decisiones

- **Un grafo JSON-LD con `@id`** en vez de varios scripts: Organization (`/#organization`) es el `publisher`/`creator`/`parentOrganization` del resto. Los `seo.jsonLd` entran al mismo grafo sin su `@context`.
- **`areaServed`**: "Latinoamérica" y "Países de habla inglesa", sacado de la FAQ de la home (remoto con México, Chile y el resto de Latinoamérica, y con países de habla inglesa). Por confirmar.
- **Logo de la Organization**: el SVG del header. Es claro (pensado para fondo oscuro); Google prefiere un PNG cuadrado de 112 px o más sobre fondo sólido. Anotado en content-gaps para SEO-OG-FAVICON.
- **`/componentes`**: ya tenía `noindex` y no estaba en el sitemap (solo lista `content/pages`, casos y `/links`). Se mantiene. `robots.txt` no lo bloquea, para que el `noindex` se pueda leer.
- Casos: las descripciones curadas del JSON se quedan (120–160, mejores que el `summary`); el título pasa a la plantilla del sitio.

## Verificación en dist/client

Todas las páginas: un solo `<title>`, canonical y og:image absolutos en `https://bysensei.com`, 1 JSON-LD que parsea.

| Página | Título (long.) | Descr. | og:image | og:type | JSON-LD |
|---|---|---|---|---|---|
| `/` | Sensei Studio · Diseño, desarrollo y automatización con IA (58) | 134 | `/og-image.jpg` 1200×630 | website | Organization + WebSite + ProfessionalService + FAQPage (18 preguntas) |
| `/proyectos/` | Proyectos · Sensei Studio (25) | 138 | `/og-image.jpg` | website | + CollectionPage + BreadcrumbList |
| `/proyectos/cappi-xtremo/` | Cappi Xtremo · Caso de estudio · Sensei Studio (46) | 156 | portada 1200×630 JPG, alt "Cappi Xtremo" | article | + CreativeWork + BreadcrumbList |
| `/proyectos/las-donas/` | Las Doñas · Caso de estudio · Sensei Studio (43) | 141 | portada 1200×630, alt "Las Doñas" | article | + CreativeWork + BreadcrumbList |
| `/proyectos/remittven/` | Remittven · Caso de estudio · Sensei Studio (43) | 148 | portada 1200×630, alt "Remittven" | article | + CreativeWork + BreadcrumbList |
| `/proyectos/yupa/` | Yupa · Caso de estudio · Sensei Studio (38) | 138 | portada 1200×630 (67 KB), alt "Yupa" | article | + CreativeWork + BreadcrumbList |
| `/links/` | Links · Sensei Studio (21) | 159 | `/og-image.jpg` | website | Organization + WebSite |
| `/componentes/` | Librería de componentes · Sensei Studio (39) | 86 | `/og-image.jpg` | website | Organization + WebSite; `noindex, nofollow` |

- `robots.txt`: `Allow: /` + `Sitemap: https://bysensei.com/sitemap.xml`.
- `sitemap.xml`: `/`, `/proyectos/`, los 4 casos y `/links/` (sin `/componentes/`).

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check (0 errores, 0 warnings, 1 hint previo de `media` en DocumentHead) y build.
