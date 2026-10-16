# impl SEC-PROCESS: proceso en 4 pasos

Implementer · 2026-10-01/02 · vuelta 1.

Fuentes: el Figma MCP devolvió el límite del plan Starter en la primera llamada (`get_design_context 31:42`).
Los valores salen de `design/figma/homepage.0.txt` (nodos `31:18`, `35:132`, `31:42`), de
`design/figma/assets/imgGroup17.svg` y de `design/figma/homepage-full.png`. El copy sale de `design/copy/process.md`.

## Archivos

- `src/modules/process/schema.ts`: nuevo. `ProcessStep`, `ProcessContent` y `ProcessSection` (h2 obligatorio).
- `src/modules/process/Section.astro`: nuevo. Panel, cabecera, lista de pasos y badge. Sin isla.
- `src/modules/process/index.ts`: nuevo. API pública.
- `src/assets/process/process-badge.svg`: copia byte a byte de `design/figma/assets/imgGroup17.svg` (badge `31:42`).
- `src/app/sections.ts`: agrega `ProcessSection` a la unión.
- `src/app/registry.ts`: agrega `process: Process`.
- `src/content/pages/home.ts`: sección `proceso` después de `por-que-elegirnos`, con el copy de `design/copy/process.md`.
- `src/styles/tokens.css`: tokens nuevos (lista abajo), `@usage` de `radius-panel` corregido y anotación de `spacing-9` ampliada.
- `tests/process.test.ts`: nuevo. 7 tests: posición en la home, copy, pasos, contrato del progreso, sin isla y con animación CSS, badge igual al asset de Figma, tokens del panel.
- `docs/design-system.md`: regenerado (`pnpm docs:ds`).
- `docs/architecture.md`: el mapa de módulos se actualizó solo con `check:arch`.
- `feature_list.json`: SEC-PROCESS pasa a `in_progress`. `progress/current.md`: plan.

## Tokens

| Token | Valor | Origen |
|---|---|---|
| `--color-progress-track` | rgba(255,255,255,0.13) | @derived: mismo valor que glass `174:75`. Pista de la barra de progreso. Brand sobre la pista ≈ 12.9:1 |
| `--process-pad-top` | clamp(40 → 65) | @figma `31:17` fin 3376 → `31:18` top 3441 |
| `--process-pad-x` | clamp(20 → 55) | @figma `35:132` left 114 − `31:18` left 59 |
| `--process-pad-y` | clamp(40 → 68) | @figma `35:132` top 3509 − `31:18` top 3441. También es el pb en xl+ |
| `--process-head-gap` | clamp(40 → 120) | @derived: separación entre el título y los pasos |
| `--process-badge-size` | clamp(112 → 157.5) | @figma `31:42` 157.499 × 157.502 |
| `--process-badge-right` | clamp(16 → 33.5) | @figma 1381 − (1190 + 157.5) |
| `--process-badge-bottom` | clamp(16 → 29.5) | @figma 4079 − (3892 + 157.5) |
| `--process-pad-bottom` | calc(badge + bottom + 24) | @derived: espacio reservado para el badge por debajo de xl |

Tokens que ya existían y se reutilizan: `radius-panel` (10, `31:18`), `spacing-638` (alto del panel),
`spacing-9` (regla lima de `11:24`), `spacing-21/24/15/30/40/10/16`, roles `text-lead` + `leading-none`
(`35:132`), `text-eyebrow`, `text-title`, `text-body`, `surface-noise`, `tone-on-ink` y `animate-badge-spin`.

**Arrastre DS-001.** El `@usage` de `radius-panel` decía "a ancho de contenido (process, showcase)". Ahora dice:
"process (31:18, a ancho de contenido 1322) y showcase (33:17, a sangre: left −1, ancho 1439)".
El valor sigue en 10, que es el de Figma, aunque `design/copy/process.md` diga "radio 20".

## Lo que es exacto a Figma (2xl)

- Panel ink con ruido, radio 10 y alto 638 (`xl:min-h-638`). A 1440 se midió 638.
- Título a 55 del borde izquierdo y 68 del superior, en 20px leading-none, blanco y mayúsculas. Se midió +55/+68 y 20px.
- Badge = `imgGroup17.svg` sin cambios, en una caja de 157.5 a 33.5 de la derecha y 29.5 de abajo. Se midieron exactamente esos valores.
  El texto del SVG es "CREATIVIDAD · TECNOLOGÍA · INNOVACIÓN · ESTRATEGIA" (id del path). Es circular, así que coincide con el copy, que solo empieza en otra palabra.
  El badge lleva `motion-safe:animate-badge-spin` (20s lineal, solo CSS), `alt=""` y `aria-hidden`.

## Diseño inferido de los pasos

- **Cabecera**: el h2 (`PROCESO: 4 PASOS`, que sustituye al texto de `35:132`) va a la izquierda, una línea de puntos de 1px en `paper-muted` (`border-dotted`) ocupa el hueco y la duración va a la derecha en `text-eyebrow`, tono muted. Desde sm todo va en una fila. En mobile la duración baja a una segunda línea y la línea de puntos se oculta.
- **Paso** (`<ol>` → `<li>`):
  1. Barra de progreso: la regla lima de 9px del hero (`h-9 bg-brand`) sobre una pista `progress-track`, con un ancho igual al % acumulado (25/50/75/100). Es `aria-hidden`, porque el % se lee en texto.
  2. Fila con el número (`01`, muted) y el % (`text-brand`), ambos en `text-eyebrow`, a 21 de la barra (el mismo gap que la línea → etiqueta de las métricas).
  3. Título `h3` en `text-title` (28px), a 24.
  4. Descripción en `text-body`, tono muted (`paper-muted`, 9.08:1 sobre ink), a 15 (el gap eyebrow → h2 del sistema).
- **Columnas**: 1 en mobile, 2 desde md y 4 desde xl, con gap-x 30 (el de las métricas `29:307`) y gap-y 40.
- **Badge y texto**: el badge es `absolute` (decorativo). Por debajo de xl el panel reserva abajo `--process-pad-bottom`, así el badge nunca tapa la última descripción. Desde xl manda el alto 638: medido, la fila de pasos termina en 3618 y el badge empieza en 3637 (1280), y en 1440 terminan en 3880 y el badge empieza en 3894.

## Responsive medido (Chrome headless por CDP, reduced-motion)

| vw | panel (alto) | h2 | badge | columnas | overflow-x |
|---|---|---|---|---|---|
| 375 | 343 × 1179 | 18px | 112 | 1 | no |
| 768 | 689 × 781 | 18.7px | 128.8 | 2 | no |
| 1024 | 929 × 783 | 19.2px | 139.7 | 2 | no |
| 1280 | 1185 × 638 | 19.7px | 150.7 | 4 | no |
| 1440 | 638 de alto, +55/+68, badge 33.5/29.5 | 20px | 157.5 | 4 | no |

Con reduced-motion la animación del badge queda en `none`. La regla `@media (prefers-reduced-motion: no-preference)` está en el CSS del build.
El panel empieza en y=3444 en 1440, contra 3441 en Figma: son 3px de deriva que arrastran las secciones anteriores, no este módulo.

## init.ps1

```
[OK] toolchain, pnpm install, estado (1 in_progress)
check:ds → 287 tokens · 0 ds-allow · 0 error(es)   [OK]
check:arch → 34 archivos · 5 módulos · 0 error(es) [OK]
astro check → 0 errors                              [OK]
vitest → 11 files, 65 tests passed                  [OK]
astro build                                         [OK]
VERDE: todo en orden.
```

Sin dependencias nuevas.
