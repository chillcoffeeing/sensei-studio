# impl PRJ-SCOPE: Detalle de proyecto, Alcance y ficha técnica

Figma: fileKey `flzA0qnj6JdalFCgyB2PdI`. `get_design_context` de 216:3127 con screenshot: llegó completo, con todos
los hijos. Los 3 logos (instancias 216:3172 Figma, 216:3184 Notion, 216:3196 GitHub) se descargaron de los assets
reales que devuelve el nodo (SVG 94×48, 129×48, 135×48), sin modificarlos.

## Archivos

- `src/modules/project/schema.ts`: tipos nuevos `ProjectScope`, `ProjectDeliverable`, `ProjectScopeTools`, `ProjectTool`, `ProjectScopeStack`, `ProjectScopeValidation`; se añaden `Project.scope` y `ProjectAnchors.scope`.
- `src/modules/project/index.ts`: exporta los tipos nuevos.
- `src/modules/project/Section.astro`: monta `<ProjectScope>` después de Proceso, en el orden de 216:2836.
- `src/modules/project/ProjectScope.astro`: nuevo. Solo coloca los bloques (alcance, separador, herramientas + tecnologías, validación) y el reveal acotado a la sección (props: `id`, `scope`). Deriva `${id}-titulo`, `${id}-herramientas`, `${id}-tecnologias`.
- `src/modules/project/ScopeIntro.astro`: nuevo. 216:3129: etiqueta, h2, descripción y límites (props: `headingId`, `label`, `title`, `lead`, `exclusions`).
- `src/modules/project/ScopeDeliverable.astro`: nuevo. 216:3137, iterado; número derivado del orden (props: `index`, `deliverable`).
- `src/modules/project/ScopeTools.astro`: nuevo. 216:3167: h3, descripción y lista de logos (props: `titleId`, `tools`).
- `src/modules/project/ScopeTool.astro`: nuevo. 216:3171: logo + uso (props: `tool`).
- `src/modules/project/ScopeStack.astro`: nuevo. 216:3207: h3, descripción y etiquetas (props: `titleId`, `stack`).
- `src/modules/project/ScopeTechnology.astro`: nuevo. 216:3211: etiqueta de tecnología (props: `name`).
- `src/modules/project/ScopeValidation.astro`: nuevo. 216:3221: h3 en 2 líneas + criterios (props: `validation`).
- `src/modules/project/ContextGoals.astro` + `ProjectContext.astro`: de paso, el id del rótulo ya no es fijo (`objetivos-titulo`): llega como prop `labelId` = `${id}-objetivos` (menor del verify de PRJ-CONTEXT).
- `src/modules/project/ProcessFlow.astro` + `ProjectProcess.astro`: de paso, el id del h3 ya no es fijo (`flujo-postcompra-titulo`): llega como prop `titleId` = `${id}-flujo` (menor V5 de verify_PRJ-PROCESS).
- `src/assets/project/tool-figma.svg`, `tool-notion.svg`, `tool-github.svg`: logos de Figma, tal cual.
- `src/content/projects/origen.ts`: copy de Figma para `scope`, ancla `alcance`; importa los 3 logos (alt = nombre).
- `docs/components.md`: fila nueva en "Fuera de la librería".
- `feature_list.json` (in_progress), `progress/current.md` (plan).

## Tokens agregados

Ninguno. Se reutilizan `ink`, `ink-muted`, `paper`, `brand` (vía `ProjectSectionLabel`), `text-project-title`,
`text-title`, `text-body-lg`, `text-body`, `text-meta`, `text-overline`, `rounded-panel`, `rounded-pill`,
`container-page`, `reveal-up` + `revealAll`. Nativas: `bg-neutral-100`, `border-neutral-300`/`bg-neutral-300`, `text-2xl`.

## Reutilización y aislamiento

- `ProjectSectionLabel` para la etiqueta "05 / Alcance y entrega". En `shared/ui` no hay chip estático (las pills
  de la librería son botones/enlaces), así que la etiqueta de tecnología es un `li` pequeño del módulo.
- Un componente por bloque y por elemento repetido (entregable, herramienta, tecnología); ninguno con variantes ni
  props de modo o clase. `ProjectScope` solo coloca.

## Desviaciones de Figma (y motivo)

- Logos a 32px de alto **con su proporción** (≈63/86/90 px de ancho). En Figma la instancia se pinta a 32px de alto
  conservando el ancho de 48px de alto con `preserveAspectRatio="none"`, lo que aplasta el logotipo. Mismo alto óptico, sin deformar.
- Fondo `bg-neutral-100` (#F5F5F5) y separadores `neutral-300` (#D4D4D4) en vez de #F5F5F5/#DEDED9: los mismos que Resultados y Contexto.
- Bloque de validación en `bg-paper` con `rounded-panel` en vez de #F4F4F0 sin radio: #F4F4F0 sobre #F5F5F5 no se
  distingue; el blanco lo separa y el radio es el de los demás paneles de la vista.
- Títulos de entregables con `text-title` (22→28px, 500) en vez de 26px; titulares de herramientas/tecnologías el mismo rol en 400 (28px como Figma).
- Descripción principal `text-body-lg` (16→18) en vez de 17px; criterios de validación 16px en vez de 15px (legibilidad).
- Semántica: entregables en `<ol>` con número `aria-hidden`; h3 por entregable, por cada columna y en validación;
  listas de herramientas y tecnologías con `aria-labelledby` hacia su h3; logos con `alt` = nombre de la herramienta.
- Motion añadido: intro, cada entregable, ambas columnas y validación entran con `reveal-up` escalonado; con reduced
  motion o sin JS se ven en su estado final.

## Responsive inferido

- 375: todo apilado (intro → entregables → separador → herramientas → tecnologías → validación). Herramientas en 3
  columnas estrechas (los textos parten línea), etiquetas con wrap, validación apilada con p-6.
- md (768+): validación en fila (titular de 260px a la izquierda, `md:p-7`).
- lg (1024+): intro (384px; 430px desde xl) y entregables en fila; herramientas y tecnologías en 2 columnas (gap 80); py 100.
- xl (1280+): gap de 100px entre intro y entregables, como Figma.
- Revisado con Chrome headless (perfil temporal propio en el scratchpad, reduced motion forzado, iframe al ancho
  exacto, build servido con un http.server en tarea de fondo detenida por su id) a 375, 768, 1024 y 1440: sin
  desbordes. A 1440 coincide con la captura de Figma salvo las desviaciones anotadas.

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check y astro build OK.
