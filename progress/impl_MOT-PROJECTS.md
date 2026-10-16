# impl MOT-PROJECTS — Proyectos: hover con detalle del proyecto

Vuelta 1. Figma MCP **no disponible** (el servidor de Figma pide autenticación y la sesión no es
interactiva): no se pudo pedir `get_design_context` de 32:82 / 31:59. Fuente visual del estado
final = `design/references/projects-hover-final.png`; el estado de reposo es el de SEC-PROJECTS
(ya verificado contra Figma). Las medidas del detalle son `@derived` de la referencia, escaladas
de su card (≈390px) a la card de 650px.

## Archivos

- `src/modules/project-gallery/schema.ts` — `ProjectMetric`, `ProjectDetails` (industria + tupla de 4 métricas) y `ProjectCard.details`.
- `src/modules/project-gallery/index.ts` — exporta además `ProjectDetails` y `ProjectMetric`.
- `src/modules/project-gallery/Section.astro` — card enfocable (`data-card`, `tabindex="0"`, `@container`, `stack-layers`) con capa de pill animada y capa de detalles (pill de industria + `<dl>` 2×2).
- `src/content/pages/home.ts` — `PLACEHOLDER_PROJECT_METRICS` y `industry` con `/* PLACEHOLDER */`; tipo `ProjectCard` derivado de `Page` (content solo importa tipos de `app`).
- `src/styles/global.css` — variantes `hover-motion` y `card-active`.
- `src/styles/tokens.css` — tokens nuevos (abajo).
- `tests/project-gallery.test.ts` — contrato de `details`, marcado PLACEHOLDER, variantes, pasos 1-3 y orden de tiempos.
- `docs/design-system.md` — regenerado (`pnpm docs:ds`).
- `progress/current.md` — plan.

## Tokens agregados (todos `@derived`)

| Token | Valor | Origen |
|---|---|---|
| `--font-mono` | pila monoespaciada del sistema | referencia PNG (valores en mono); sin fuente nueva que descargar |
| `--text-metric` | clamp(16px → 22px) | referencia ≈13px en card de 390 → 22 en 650 |
| `--text-metric-label` | clamp(12px → 14px) | referencia ≈8.5px en card de 390 → 14 en 650 |
| `--radius-metric` | 10px | referencia ≈6px en 390 → 10 en 650 |
| `--project-pill-shift` | calc(100cqw / aspect / 2 − pill-bottom − 52/2) | centro de la card; 171.5px en 2xl |
| `--duration-project-shift` | 400ms | paso 1 |
| `--duration-project-fade` | 250ms | pasos 2 y 3 |
| `--delay-project-title-out` | 400ms | = shift (test lo asegura) |
| `--delay-project-details-in` | 650ms | = shift + fade (test lo asegura) |
| `--delay-project-return` | 250ms | salida en orden inverso |

## Comportamiento

- **Desktop con hover y sin reduced-motion** (`hover-motion`): en hover o `focus-visible` de la card
  (`card-active`): 1) la capa de la pill sube al centro (`translate`, 400ms); 2) la pill se
  desvanece (250ms, delay 400); 3) aparecen pill de industria + métricas (250ms, delay 650).
  Al salir: detalles fuera (0ms delay), pill reaparece y baja (delay 250). Solo `translate` y `opacity`.
- **`(hover: none)` y `prefers-reduced-motion: reduce`**: el estado base es el estado final estático
  (detalles visibles, pill de título con opacity 0). Interpreto "estado final visible (cambio directo)"
  como en la regla 3 de conventions (reduce = estado final visible, sin ocultar); si se prefiere
  que en reduced-motion el hover siga alternando sin transición, basta con sacar
  `prefers-reduced-motion` de `hover-motion` y añadir `motion-reduce:transition-none`.
- Sin JS no cambia nada: es CSS puro (sin isla, sin `<script>`).
- A11y: el `h3` del título sigue en el DOM (opacity, no `display:none`), así que el lector lee título,
  categoría, industria y métricas siempre. La card es enfocable (`tabindex="0"`) porque la
  acceptance pide el estado con `focus-visible`; outline `ink` de 2px con offset.

## Responsive inferido

- Mobile (1 columna, 343×236 a 375): pill de industria arriba con el inset de la pill
  (`--project-pill-inset`, 12px), métricas 2×2 abajo a sangre con gap 3 sobre fondo paper (como la
  referencia); texto 16/12px. Cabe con ≈40px de imagen libre entre pill y rejilla.
- `--project-pill-shift` usa `cqw` del `<li>` (`@container`, sin padding) y el aspecto de la card,
  así el centro es correcto a cualquier ancho; asume la pill de 52px (si el título envolviese a dos
  líneas en un desktop estrecho, el centro se desvía unos px).

## CSS propio (justificación)

- Solo dos `@custom-variant` en `global.css` (no hay utilidades nuevas): Tailwind no trae
  `@media (hover: hover) and (prefers-reduced-motion: no-preference)` combinado ni un estado
  "ancestro en hover **o** focus-visible". `card-active` usa `:is()` para que el estado activo
  gane por especificidad al de reposo sin depender del orden de emisión.
- Fundido y translate en elementos distintos (capa / pill) para dar a cada propiedad su propio
  `transition-delay` sin `transition` arbitrario.

## Pendiente / a revisar

- Validar en navegador (no hay headless en este entorno): centro de la pill y proporción de la rejilla.
- Datos reales de industria y métricas por proyecto (hoy PLACEHOLDER, iguales en todos).
- Confirmar con Figma (cuando el MCP esté autenticado) tamaños de la rejilla de métricas y la familia mono.

## ./init.ps1

```
[OK] node / pnpm / install / estado (1 in_progress)
check:ds → 393 tokens · 0 ds-allow · 0 error(es)   [warn previo: tokens sin uso]
check:arch → 76 archivos · 11 módulos · 0 error(es)
astro check: 0 errors, 0 warnings
vitest OK · astro build OK
VERDE: todo en orden.
```
