# impl SEC-STATS — Por qué elegirnos (métricas) · vuelta 1

## Fuente de diseño

- `get_design_context` de 31:19 **falló por límite de llamadas del plan Starter de Figma MCP**.
- Fuente usada: `design/figma/homepage.0.txt` (nodos 31:19, 31:17, 29:251, 29:238–29:247, 29:307, 29:271/29:295/29:289/29:301 y sus hijos)
  + recorte de `design/figma/homepage-full.png` (y 2880–3400 a escala 1440) como objetivo visual.
- Asset del separador: `design/figma/assets/imgLine1.svg` (imgLine2 de 29:304 es idéntico byte a byte en contenido: 300×1, negro 24%).

## Archivos

- `src/modules/stats/schema.ts` — nuevo: `StatItem`, `StatsContent`, `StatsSection` (eyebrow y h2 obligatorios).
- `src/modules/stats/Section.astro` — nuevo: reutiliza `shared/ui/SectionHeader` (descripción en el slot `aside`) + `<dl>` de 4 métricas.
- `src/modules/stats/index.ts` — nuevo: API pública.
- `src/assets/stats/stat-divider.svg` — copia de `imgLine1.svg` (sin modificar).
- `src/app/sections.ts` — `StatsSection` en la unión.
- `src/app/registry.ts` — `stats: Stats`.
- `src/content/pages/home.ts` — sección `por-que-elegirnos` con copy de Figma.
- `src/styles/tokens.css` — 3 tokens nuevos (abajo).
- `tests/stats.test.ts` — nuevo: contrato de contenido (copy, tonos, orden de métricas) y render (sin isla, SectionHeader, asset del separador, dl/dt/dd).
- `docs/design-system.md` — regenerado (`pnpm docs:ds`).
- `feature_list.json` (SEC-STATS → in_progress), `progress/current.md` (plan).

## Tokens agregados

| Token | Valor | Origen |
|---|---|---|
| `--spacing-209` | 209px | `@figma 29:299` ancho de la etiqueta "Años de experiencia senior combinada" (corta en 2 líneas) |
| `--stats-pad-top` | clamp(72px … 191px) | `@figma 31:46 fin 2721 → 31:17 top 2912 = 191`; mínimo 72 `@derived` |
| `--stats-head-gap` | clamp(48px … 120px) | `@figma 31:17 gap 120`; mínimo 48 `@derived` |

Reutilizados (ya existían con su `@figma`): `text-stat` (29:253), `text-stat-label` (29:269), `text-body` (29:247),
`spacing-21` (29:271 gap), `spacing-26` (29:267 gap), `spacing-30` (29:307 gap), `spacing-300` (línea), `spacing-410` (descripción), `spacing-px`.

## Medidas de 1440 aplicadas

- Cabecera 29:251: `SectionHeader` (fila justify-between + items-end, columna 764, gap 15); descripción `max-w-410`, DM Sans 16, muted con lead strong (ink), alineada a la derecha en lg+.
- 31:17 gap 120 cabecera → métricas (`--stats-head-gap`).
- 29:307: 4 columnas, gap 30. Cada métrica: cifra 45/600 ink → gap 26 → línea 300×1 → gap 21 → etiqueta 18/500 ink-muted centrada.
- Línea: en Figma la caja es de alto 0 y el trazo se dibuja 1px por encima (`inset -1px 0 0 0`); se reproduce con `h-px -mt-px`, así el alto total coincide (26 + 21 entre cifra y etiqueta).
- Copy: trailing spaces de Figma ("funcionalidad. ") recortados.
- Deriva: Figma mide la fila 1322 (4×308 + 90); el contenedor es 1320 (`--container-content`, deriva normalizada en DS-001), así que cada columna mide 307.5px. La línea (300) y el texto centrado no cambian.

## Responsive inferido

- < lg: 2 columnas (gap-x 20, gap-y 40, valores de la escala existente), cabecera apilada (comportamiento de `SectionHeader`), descripción alineada a la izquierda.
- lg+: 4 columnas con gap 30.
- La línea es `w-full max-w-300`: en columnas estrechas se adapta al ancho (el SVG tiene `preserveAspectRatio="none"`); desde ~308px mide 300 exactos.
- Cifras con `whitespace-nowrap` (en 375, "1 punto" a 36px cabe en la columna de ~161px).
- Tamaños fluidos de cifra/etiqueta: los roles `text-stat` y `text-stat-label` ya tenían clamp.

## Accesibilidad

- `section[aria-labelledby]` → h2 de la cabecera común.
- Métricas como `<dl>`: `dt` (etiqueta) antes que `dd` (cifra) en el DOM; el orden visual (cifra arriba) se logra con `order`. Separador decorativo `alt=""` dentro del `dd`.
- Sin isla, sin animación.

## Ancla

- id `por-que-elegirnos`. El nav "Studio" (`/#studio`) sigue sin destino: no se asignó a esta sección porque no está claro que corresponda (queda para el orquestador/SEC-TEAM).

## init.ps1

```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
check:ds → 278 tokens · 0 ds-allow · 0 error(es)   [OK]
check:arch → 31 archivos · 4 módulos · 0 error(es) [OK]
astro check → 0 errors                             [OK]
vitest                                             [OK]
astro build                                        [OK]
VERDE: todo en orden.
```
