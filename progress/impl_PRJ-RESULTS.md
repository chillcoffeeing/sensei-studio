# impl PRJ-RESULTS — Detalle de proyecto: Resultados primero

Figma: fileKey `flzA0qnj6JdalFCgyB2PdI`, `get_design_context` de 216:2878 con screenshot (respuesta
completa, sin assets: solo texto y rectángulos).

## Archivos

- `src/modules/project/schema.ts` — `ProjectResults`, `ProjectMetric`, `ProjectComparison`, `ProjectComparisonLabels`; `Project.results`.
- `src/modules/project/index.ts` — exporta los tipos nuevos.
- `src/modules/project/Section.astro` — sustituye el `<div id="resultados">` provisional por `<ProjectResults>` (la `<section id="resultados">` real); el div se eliminó.
- `src/modules/project/ProjectResults.astro` — nuevo. Sección 216:2878: introducción, separador, lista de métricas y nota; script de reveal + countUp acotado a la sección.
- `src/modules/project/ProjectSectionLabel.astro` — nuevo. Etiqueta con marcador (216:2881), pieza común para las secciones siguientes de la vista (props: `text`).
- `src/modules/project/ResultsMetric.astro` — nuevo. Métrica (216:2888), iterada con `.map` (props: `metric`, `comparisonLabels`).
- `src/modules/project/ResultsComparison.astro` — nuevo. Píldora antes → después (216:2891) (props: `comparison`, `labels`).
- `src/modules/project/ResultsNote.astro` — nuevo. Nota metodológica (216:2906) (props: `text`).
- `src/content/projects/origen.ts` — copy real de Figma para `results`.
- `src/styles/tokens.css` — 3 roles de texto nuevos.
- `docs/design-system.md` (roles nuevos), `docs/components.md` (Fuera de la librería: etiqueta de sección y bloques de resultados).
- `feature_list.json` (in_progress), `progress/current.md` (plan).

## Tokens agregados

- `--text-project-title` clamp 30→52px, lh 1.08, 500 (h2 216:2884, 52px Medium). Lo reutilizarán los h2 de las siguientes secciones.
- `--text-project-metric` clamp 56→82px, lh 1.1, 500 (cifra 216:2889).
- `--text-project-metric-label` clamp 19→23px, lh 1.25, 500 (indicador 216:2890).

Reutilizados: `brand`, `ink`, `ink-muted`, `paper`, `text-overline` (12px 600), `text-meta` (13px), `text-body`,
`container-page`, utilidades `reveal-up` + `revealAll`/`countUpAll` de `shared/lib/motion`.
Colores sin token nuevo: fondo `bg-neutral-100` (#f5f5f5, el del frame), separador `bg-neutral-300`.

## Desviaciones de Figma (y motivo)

- Comparación y nota en `bg-paper` (blanco) en lugar de #F4F4F0: sobre el fondo #F5F5F5 del frame el #F4F4F0 es prácticamente invisible; así la píldora y la nota se leen como superficie. Evita además 2 colores nuevos.
- Separador `neutral-300` (#d4d4d4) en vez de #DEDED9: Tailwind nativo y algo más visible sobre el gris.
- Descripción de métrica a 16px (`text-body/normal`, lh 1.5) en vez de 15px: legibilidad en gris y sin crear un rol de 15px. Nota a 13px con `text-meta/normal` (lh 1.5).
- Barra lima de la nota: mínimo 34px pero se estira con el texto (en mobile la nota ocupa 4–5 líneas).
- Indicador de métrica como `h3` (h1 nombre → h2 sección → h3 indicadores); comparación con flecha `aria-hidden` y rótulos sr-only "Antes:/Después:" (en contenido).
- Motion añadido: las métricas entran con `reveal-up` escalonado y las cifras cuentan desde 0 (countUp, misma pauta que la sección de métricas de la home). Sin JS o con reduced motion se ve el valor final.

## Responsive inferido

- Mobile (375–1023): todo apilado; h2 30px (3 líneas a 375), cifras 56–66px, métricas en columna con gap 48px; descripción de intro `max-w-120`.
- lg (1024+): métricas en 3 columnas (gap 40, pr 24). La introducción sigue apilada a 1024: en fila, el h2 partía "conectado." en una tercera línea.
- xl (1280+): introducción en fila (h2 `max-w-187.5` a la izquierda, descripción de 365px abajo a la derecha).
- py 64px mobile → 90px desde lg.
- Revisado con Chrome headless (perfil temporal propio, servidor detenido por PID) a 375 (iframe), 500, 768, 1024, 1280 y 1440 con reduced motion forzado: sin desbordes horizontales.

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check y astro build OK.
