# impl PRJ-PROCESS: Detalle de proyecto, Proceso y automatización

Figma: fileKey `flzA0qnj6JdalFCgyB2PdI`. `get_design_context` de 216:3065 con screenshot: llegó completo,
con todos los hijos (a pesar de que get_metadata lo devuelva sin ellos). Un solo asset: la flecha `arrow-right`
(216:3302), descargada del nodo.

## Archivos

- `src/modules/project/schema.ts`: tipos nuevos `ProjectProcess`, `ProjectProcessStage`, `ProjectProcessFlow` y `ProjectFlowStep`. Se añaden `Project.process` y `ProjectAnchors.process`.
- `src/modules/project/index.ts`: exporta los tipos nuevos.
- `src/modules/project/Section.astro`: monta `<ProjectProcess>` después de Solución, en el orden de 216:2836.
- `src/modules/project/ProjectProcess.astro`: nuevo. Solo coloca los bloques de 216:3065 (encabezado, `<ol>` de etapas y flujo) y define el reveal escalonado acotado a la sección (props: `id`, `process`).
- `src/modules/project/ProcessIntro.astro`: nuevo. Encabezado 216:3066: etiqueta, h2 en 2 líneas y ruta estrategia → diseño → producto (props: `headingId`, `label`, `title`, `route`, `routeSeparator`).
- `src/modules/project/ProcessStage.astro`: nuevo. Etapa 216:3074, iterada con `.map`; número derivado del orden (props: `index`, `stage`, `deliverableLabel`).
- `src/modules/project/ProcessFlow.astro`: nuevo. Bloque 216:3102: titular h3, aviso, `<ol>` de pasos y nota (props: `flow`).
- `src/modules/project/ProcessFlowStep.astro`: nuevo. Paso 216:3107 + flecha opcional (el último no la lleva) (props: `step`, `arrow?`).
- `src/assets/project/flow-arrow.svg`: flecha lima de 18×18 de 216:3302, descargada del nodo.
- `src/content/projects/origen.ts`: copy real de Figma para `process`, ancla `el-proceso`.
- `docs/components.md`: fila nueva en "Fuera de la librería".
- `feature_list.json` (in_progress), `progress/current.md` (plan).

## Tokens agregados

Ninguno. Se reutilizan `ink`, `paper`, `line` (#B8B8B8), `brand`, `text-project-title`, `text-title`,
`text-overline` (vía `ProjectSectionLabel`), `text-caption`, `text-meta`, `text-body`, `text-body-sm`,
`rounded-panel`, `container-page`, `reveal-up` + `revealAll`. Utilidades nativas: `text-5xl`/`text-6xl`,
`text-xl`/`text-2xl`, `rounded-md`, `border-paper/15`, `bg-paper/10`, `tracking-wide`.

## Reutilización y aislamiento

- `ProjectSectionLabel` sobre negro: el color se hereda del contenedor (`text-line`), como en el reto.
- La sección `process` del home (`modules/process`) no se usa: es otro módulo (prohibido importarlo) y otro
  patrón (barras de progreso). En `shared/ui` no hay nada que encaje con etapa/paso de flujo.
- Componentes pequeños con su propio contexto: ninguno tiene variantes. `deliverableLabel` es el único prop de
  paso (rótulo sr-only, mismo patrón que `comparisonLabels` en Resultados).

## Desviaciones de Figma (y motivo)

- Separadores y borde del bloque `border-paper/15` (≈#2F2F2F) en vez de #333330, y tarjetas del flujo
  `bg-paper/10` (≈#222) en vez de #20211E: utilidades nativas, sin colores nuevos y diferencia imperceptible.
- Semanas a 12px (`text-caption`, tracking-wide) en vez de 11px: legibilidad en gris sobre negro.
- Número de etapa 48px en mobile → 60px desde lg (`text-5xl lg:text-6xl`, lh 1).
- Copy en mayúsculas (semanas, ruta, aviso) guardado en caja normal y pasado a mayúsculas con CSS, igual que la etiqueta de sección.
- Ruta como pasos con el separador `→` en `aria-hidden` (el lector lee "Estrategia Diseño Producto"); entregable con "Entregable:" sr-only; número de etapa `aria-hidden` porque el `<ol>` ya numera; flecha del flujo `alt=""` y pasos en `<ol aria-labelledby>` del h3.
- Entregable al pie de cada etapa (`mt-auto`): queda alineado entre columnas aunque las descripciones tengan distinto largo.
- Flujo: el texto de las tarjetas puede partir línea (Figma usa nowrap) para caber a 1024; las tarjetas estiran al mismo alto.
- Motion añadido: encabezado, cada etapa y el flujo entran con `reveal-up` escalonado; con reduced motion o sin JS se ven en su estado final.

## Responsive inferido

- 375: todo apilado. h2 de 30px (4 líneas), ruta con wrap, etapas en una columna (gap 40), bloque de flujo con p-5,
  titular de 20px, aviso debajo, pasos en columna con la flecha girada 90° (hacia abajo).
- sm (640+): bloque con p-8, titular de 24px y aviso a la derecha en la misma fila.
- md (768+): etapas en 2 columnas.
- lg (1024+): etapas en 4 columnas, flujo en fila con flechas a la derecha, py 90px, gap 60px.
- xl (1280+): ruta abajo a la derecha del h2, como en Figma.
- Revisado con Chrome headless (perfil temporal propio en el scratchpad, reduced motion forzado, iframe al ancho
  exacto, build servido con un http.server detenido por su PID) a 375, 768, 1024 y 1440: sin desbordes horizontales.
  A 1440 coincide con la captura de Figma.

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check y astro build OK.
