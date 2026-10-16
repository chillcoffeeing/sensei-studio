# impl PROJECTS-INDEX — página /proyectos/

Sin nodos de Figma: no hubo diseño que pedir. Solo se usan componentes que ya existían en shared/ui.

## Archivos

- `src/content/data/pages/proyectos.json` (nuevo): slug `proyectos`, seo propio, una sola sección `project-index` (eyebrow "Proyectos" + h1 "Todos los proyectos"), `projects: []` = todos.
- `src/modules/project-index/{schema.ts,Section.astro,index.ts}` (nuevo): módulo mínimo. `SectionHeader level="h1"` (+ `SectionDescription` en el aside solo si el JSON trae `description`) y un `ul` flex-col con una `ProjectCard` por proyecto. Sin grid, sin tarjeta destacada.
- `src/core/content.ts`: `projectCardSchema`, `projectMetricSchema` y `projectSlugSchema` se mueven aquí desde project-gallery, porque los comparten dos módulos y un módulo no puede importar de otro.
- `src/modules/project-gallery/schema.ts`, `index.ts`: usan el esquema de core. Se quitan los re-exports de tipos que nadie usaba.
- `src/app/sections.ts`, `registry.ts`, `templates.ts`: tipo `project-index` añadido (enum, unión, registry, plantilla `project-index`).
- `src/content/pages.ts`: un único `cardsOf(slugs, cta)` deriva las tarjetas de la galería y del índice (regla 5, sin duplicar datos). Plantilla `proyectos → project-index`.
- `src/content/projects.ts`: `projectCycle()` devuelve los slugs en el orden del ciclo "Siguiente proyecto", empezando por el primero alfabético (hoy Las Doñas → Yupa → Remittven). `projectCardCta = 'Ver proyecto'` es microcopy (regla 6).
- `src/shared/ui/SectionHeader.astro`: prop `level?: 'h1' | 'h2'` (por defecto h2), sin cambio de aspecto.
- `src/shared/ui/ProjectCard.astro`: prop `headingLevel?: 'h2' | 'h3'` (por defecto h3), sin cambio de aspecto. Así no se salta del h1 al h3 en /proyectos/.
- `src/shared/ui/types.ts`: comentario del contrato ahora apunta a core.
- Enlaces a `/proyectos/`: `content/data/pages/home.json` (cta de la galería), `content/case-study.ts` ("Todos los proyectos") y `content/links.ts` ("Ver todos los proyectos"). Además, el comentario de `modules/links/LinksProjectCard.astro`. El nav (`/#proyectos`) no se toca.
- Docs: `docs/content-model.md` (tipo `project-index`), `docs/components.md` (props `level` y `headingLevel`, fila del módulo), `docs/architecture.md` (nota del índice) y `design/content-gaps.md` (se quita el P3 "Ver todos los proyectos" y se anota que ahora va a /proyectos/).

## Tokens

Ninguno nuevo. Se reutilizan `--section-head-gap`, `--projects-row-gap` y la utilidad `project-card-wide`.

## Responsive y desviaciones

- La lista va siempre en una columna a todo el ancho del contenedor.
- Por debajo de lg, la tarjeta usa la proporción normal (650:447).
- Desde lg, todas las tarjetas pasan a panorámica 2:1 (`project-card-wide`). A todo el ancho con la proporción normal, cada tarjeta mediría unos 908 px de alto en 1440. No es una tarjeta destacada, porque las tres son iguales.
- `sizes`: `(min-width:1440px) 1320px, (min-width:1024px) calc(100vw - 80px), (min-width:768px) calc(100vw - 64px), calc(100vw - 32px)`. Medido con CDP: 343 / 704 / 944 / 1320 px en 375 / 768 / 1024 / 1440. Coincide, y no hay scroll horizontal en ningún ancho.
- Padding de sección `pt-16 pb-24 md:pt-24 md:pb-32`, igual que /creditos/ (la otra página sin hero). El header va en flujo y la barra flotante queda fija abajo, como en el resto del sitio.
- El JSON no lleva descripción: el esquema la admite (una línea), pero no hay copy real y no se inventa.

## Comprobaciones

- Build: /proyectos/ tiene un solo h1. Canonical `…/proyectos/`. Está en el sitemap y convive con `/proyectos/<slug>/`.

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check y astro build en OK.
