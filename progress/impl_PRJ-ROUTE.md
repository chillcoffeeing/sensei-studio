# impl PRJ-ROUTE — Detalle de proyecto: módulo, tipo Project, ruta y hero

Figma: fileKey `flzA0qnj6JdalFCgyB2PdI`. `get_metadata` de 216:2836 (modelo de contenido de la
vista), `get_design_context` de 216:2837 (hero completo) y de 216:2849 (portada, con screenshot).

## Archivos

- `src/modules/project/schema.ts` — nuevo. `Project` (id, seo, anchors, hero) + `ProjectHero`, `ProjectFact`, `ProjectExplore`, `ProjectAnchors`. Cada sección posterior agrega su campo (`results`, `context`, `solution`, `process`, `scope`, `closing`).
- `src/modules/project/index.ts` — nuevo. API: `Section` + tipos.
- `src/modules/project/Section.astro` — nuevo. Vista de detalle: coloca los bloques en el orden de 216:2836 (hoy: hero + ancla provisional `#resultados`).
- `src/modules/project/ProjectHero.astro` — nuevo. Portada 216:2849 (foto + sombra, identificación, resumen) + acento 216:2877.
- `src/modules/project/HeroBackLink.astro` — nuevo. "← Todos los proyectos" (216:2854).
- `src/modules/project/HeroStatus.astro` — nuevo. Píldora de estado (216:2855).
- `src/modules/project/HeroExplore.astro` — nuevo. "Explorar resultados" (216:2863): ancla + script de scroll suave (reduced motion → salto instantáneo) que lleva el foco al destino.
- `src/modules/project/HeroFacts.astro` / `HeroFact.astro` — nuevos. Ficha breve como `<dl>` (216:2867) y cada dato (216:2868).
- `src/app/project.ts` — nuevo. Puerta para content/pages: `ProjectView`, `Project`.
- `src/content/projects/origen.ts` — nuevo. Contenido real del caso Origen (copy de Figma) + SEO.
- `src/content/projects.ts` — nuevo. Carga `projects/*.ts` (glob) y `projectPath()`.
- `src/pages/proyectos/[projectId].astro` — nuevo. Ruta estática desde el contenido; `BaseLayout` con el header del sitio en flujo (216:2838 = header existente, sin overlay).
- `src/pages/sitemap.xml.ts` — incluye `/proyectos/<id>/`.
- `src/assets/project/origen-cover.jpg` (foto de 216:2850, era JPEG con extensión .png) y `arrow-down.svg` (216:3299) — descargados del nodo.
- `src/styles/tokens.css` — tokens nuevos (abajo).
- `docs/architecture.md` (módulo de vista `project` + `app/project.ts`), `docs/design-system.md`, `docs/components.md` (Fuera de la librería) — actualizados.
- `feature_list.json` (in_progress), `progress/current.md` (plan).

## Tokens agregados

- `--text-project-name` clamp 72→146px, lh 1, 600 (216:2857, 146px SemiBold).
- `--text-project-claim` clamp 30→50px, lh 1.08, 500 (216:2861).
- `--project-cover-min-h` clamp 560→830px (alto de 216:2849).
- `--project-cover-gap` clamp 96→146px: separación mínima identificación/resumen (en desktop manda `justify-between`).
- `--project-cover-focus: 68% center`: encuadre mobile de la foto (sujeto a la derecha).
- `--project-cover-shade` / `--project-cover-shade-sm`: sombra editorial (216:2851) desktop y mobile.

Reutilizados: `brand`, `ink`, `paper`, `line`, `scrim`, `text-body`, `text-body-sm`, `text-body-lg`, `text-caption`, `text-link`, `rounded-pill`, `--duration-*`, `ease-standard`, `container-page`.

## Desviaciones de Figma (y motivo)

- Sombra editorial más densa abajo (0.8 al 85% vs 0.72 al 100%) y versión mobile más oscura: con la de Figma la etiqueta de la ficha (12px, `line`) quedaba ~3:1 sobre la arena; así llega a AA. En mobile el texto ocupa el centro de la foto.
- Header: se reutiliza el del sitio (52px) en lugar de los 82px del frame.
- Píldora de estado con `bg-scrim` + `backdrop-blur-sm` en vez de rgba(9,9,9,.31): token existente y mejor legibilidad.
- "Explorar resultados" a 16px (`text-link`) en vez de 15px; filete de la ficha con `border-paper/25` (utilidad nativa, mismo valor).
- Título del caso es `<p>` (no h2): no abre sección; el único heading es el h1 "Origen®".
- Microinteracciones: flecha del volver se desplaza y el círculo de explorar baja 2px en hover (solo `motion-safe`).
- Ancla `<div id="resultados">` vacía en `Section.astro` como destino provisional: PRJ-RESULTS la sustituye por la sección con ese id (así el control no apunta a un id inexistente).

## Responsive inferido

- Mobile (375): todo apilado; fila volver/estado con `flex-wrap`; h1 72px; promesa 30px; ficha a ancho completo; foto encuadrada al 68%.
- sm–md: ficha limitada a `max-w-80`.
- lg+: resumen en fila (`justify-between`, `items-end`), ficha de 230px; foto centrada; py 38px (`py-9.5`).
- 2xl (1440): 830px de portada, contenido a 60px (container-page).
- Revisado con Chrome headless a 375, 768, 1024 y 1440 (sin desbordes horizontales).

## SEO

title 48 caracteres, description 126, canonical derivada por `BaseLayout` (`/proyectos/origen/`), `og:type=article`, un único h1. Sitemap incluye la URL.

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check y astro build OK
(`dist/client/proyectos/origen/index.html` generado; portada optimizada a avif/webp/jpg 640/960/1376).
