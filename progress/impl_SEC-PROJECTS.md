# impl SEC-PROJECTS — Galería de proyectos (vuelta 1)

## Fuente de diseño

- `get_design_context` de `32:82` falló por **límite de llamadas del plan Starter** de Figma MCP.
- Fallback: `design/figma/homepage.0.txt` (nodos `32:82`, `16:84`, `16:70`, `16:82`, `29:236`, `31:59`, `31:46`, `29:235`, `28:101`, `29:166`, `35:302`–`35:306`) + `design/figma/homepage-full.png` (recorte 1060→2740 como objetivo visual).
- Verificación visual propia: capturas con Edge headless del build en 1440, 1024 y 375 (iframes). En 1440: eyebrow en y≈1085 (Figma 1084), grid en y=1301 (Figma 1301), cards 650×447, pill a 22/26 de los bordes.

## Archivos

- `src/shared/ui/SectionHeader.astro` — nuevo primitivo: eyebrow (punto lima + texto), h2 ToneText y slot `aside` (descripción o CTA), reutilizable por las 6 secciones con cabecera.
- `src/modules/project-gallery/schema.ts` — `ProjectCard`, `ProjectGalleryCta`, `ProjectGalleryContent`, `ProjectGallerySection` (eyebrow y h2 obligatorios).
- `src/modules/project-gallery/Section.astro` — render: cabecera + grid 1→2 columnas con `<Picture>` (avif/webp, widths 400/650/900/1300, `sizes` por breakpoint, lazy).
- `src/modules/project-gallery/index.ts` — API pública.
- `src/app/sections.ts`, `src/app/registry.ts` — registro del tipo `project-gallery`.
- `src/content/pages/home.ts` — sección `proyectos` (copy de Figma tal cual, 6 cards en orden 29:166 → 29:215).
- `src/assets/project-gallery/das-anthropology-laptop.png` — copia de `imgFrame14.png` (2400×1260).
- `src/assets/project-gallery/vietnam-exposition-laptop.png` — copia de `imgFrame15.png` (2400×1200).
- `src/assets/ui/eyebrow-dot.svg` — copia de `imgEllipse1.svg` (punto lima 14px, 16:60).
- `src/styles/tokens.css` — tokens nuevos (abajo); `--text-label` deja de citar 35:304.
- `tests/project-gallery.test.ts` — contrato de datos (orden, 6 cards, copy, ancla del nav, imágenes ≥1300px) y render (Picture, formatos, sizes, SectionHeader, sin isla).
- `docs/design-system.md` — regenerado (`pnpm docs:ds`).
- `package.json`, `pnpm-lock.yaml` — **dependencia nueva `sharp`**: la exige `astro:assets` para generar las variantes optimizadas en build (sin ella `astro build` falla con MissingSharp). `pnpm-workspace.yaml` ya la tenía en `allowBuilds`.
- `feature_list.json` (status `in_progress`), `progress/current.md` (plan).

## Tokens agregados

| Token | Valor | Origen |
|---|---|---|
| `--section-head-gap` | clamp(40 → 70) | @figma 32:82 fin 1231 → 31:46 top 1301; mínimo @derived |
| `--section-head-aside-gap` | var(--spacing-24) | @derived (apilado mobile; en lg+ manda justify-between = 297 en 1440) |
| `--projects-pad-top` | clamp(64 → 140) | @figma 17:553 fin 944 → 32:82 top 1084; mínimo @derived |
| `--projects-row-gap` | clamp(20 → 38) | @figma 29:235 gap 38; mínimo @derived |
| `--project-aspect` | 650 / 447 | @figma 29:166 |
| `--project-pill-inset` | clamp(12 → 22) | @figma 29:166 px 22; mínimo @derived |
| `--project-pill-bottom` | clamp(12 → 26) | @figma 29:166: 447 − (369 + 52) = 26; mínimo @derived |
| `--text-pill` | clamp(14 → 16), 500, normal | @figma 35:304/35:306; mínimo @derived |

Reutilizados: `spacing-10/15/20/52/764`, `radius-media`, `radius-pill`, `text-eyebrow`, `text-h2`, `text-link`, `color-ink-muted`.

## Decisiones

- **Ritmo vertical**: cada sección es dueña de su padding superior (como logos con 45). Los 140 logos→proyectos van en esta sección; los 191 grid→métricas (`spacing-191`) quedan para SEC-STATS como su `pt`.
- **Card**: la pill se ancla abajo (`justify-end` + pb 26) en lugar de pt 369 de Figma: mismo resultado en 1440 y robusto al escalar. Se ignora la deriva de la fila 3 (29:206: alto 450, pb 15), ya normalizada en `spacing-447`.
- **CTA**: el texto de Figma es `VER TODOS LOS PROYECTOS    +`; se modela como `label` + `marker` y el signo va `aria-hidden` con los 4 espacios de Figma (`whitespace-pre`), así el nombre accesible no incluye "+". Hover a `ink`, foco visible. `href` = `/#proyectos` (no existe aún página de proyectos; **pendiente de decisión de producto**).
- **Títulos de card** como `h3` (jerarquía bajo el h2 de sección); categoría en `p`.
- **Copy placeholder** tal cual de Figma ("Dass design anthopoly" / "Web Design"), como pide el criterio; el typo está documentado en INVENTORY §3.4. Alt de las imágenes describe el mockup real (DAS – Design Anthropology School / Vietnam Exposition Center).

## Responsive inferido

- < lg: cabecera apilada (eyebrow, h2, CTA a la izquierda con gap 24); grid de 1 columna con el mismo aspecto 650/447.
- lg+: cabecera en fila (h2 max 764, CTA abajo a la derecha); grid de 2 columnas (gap 20).
- Pill: inset 12→22 / 12→26 y texto 14→16 para que título y categoría quepan en una línea a 375 (categoría `nowrap`, título puede partir si el copy real es más largo).
- `sizes`: `(min-width:1440px) 650px, (min-width:1024px) calc(50vw - 50px), (min-width:768px) calc(100vw - 64px), calc(100vw - 32px)`. Variantes generadas: 5–75 KB (antes PNG de 1.2 y 2.5 MB).
- Sin animación nueva (solo transición de color del CTA), así que no aplica reduced-motion.

## init.ps1

```
[OK] toolchain, pnpm install, estado (1 in_progress)
check:ds → 275 tokens · 0 ds-allow · 0 error(es)   [OK]
check:arch → 28 archivos · 3 módulos · 0 error(es) [OK]
astro check 0 errors                                [OK]
vitest 50 passed                                    [OK]
astro build (genera avif/webp)                      [OK]
VERDE: todo en orden.
```

## Vuelta 2

Corrige los hallazgos de `progress/verify_SEC-PROJECTS.md` (vuelta 1): 1 bloqueante y 1 mayor.

### Archivos modificados
- `src/modules/project-gallery/Section.astro`: CTA con área táctil de 44px en < lg; fallback de `<Picture>` en JPG a 1300w.

### Correcciones
- **[Bloqueante V3] Área táctil del CTA**: el `<a>` pasa a `flex min-h-44 w-fit items-center … lg:min-h-0`. En < lg mide 44 de alto (token existente `spacing-44`, tokens.css:411). En lg+ vuelve a 20, el alto de la línea. Como ahora es de bloque, el `div` del aside ya no genera una caja de línea con el strut de 22px. Así el CTA queda alineado abajo con el h2, que es lo que pedía el hallazgo menor V2 (y 1211). Esto último está deducido del cambio, pero no se midió.
- **[Mayor] Imágenes optimizadas**: se añaden `fallbackFormat="jpg"` y `width={1300}`, el mayor ancho del srcset, a `<Picture>`. El `<img>` de respaldo sale como `…_ZFiWRJ.jpg`, 1300×683, con srcset JPG de 400 a 1300w. En `dist/client/_astro` ya no queda ningún PNG; el JPG de proyecto más pesado ocupa 117 KB (vietnam a 1300w), por debajo del límite de 150 KB. `dist/client` baja de 6.3 MB a 1.1 MB. AVIF y WebP no cambian.

### Diferidos (menores)
- **[Producto] `cta.href = '/#proyectos'`**: es una decisión de producto, no de implementación. Le toca al orquestador registrarla en `progress/current.md`.
- **[SectionHeader] `shrink-0` en el aside**: hoy no tiene efecto, porque el único consumidor es un CTA corto. Cambiar el primitivo compartido saldría del alcance de esta vuelta. Cuando una sección pase una descripción larga (29:247, w 410), el consumidor le fijará `max-w-410`. Queda para la feature que lo necesite primero (SEC-SERVICES/SEC-STATS).

### init.ps1
```
[OK] pnpm install · 1 in_progress · estados · dependsOn
check:ds → 275 tokens · 0 ds-allow · 0 error(es)   [OK]
check:arch → 28 archivos · 3 módulos · 0 error(es) [OK]
astro check 0 errors                                [OK]
vitest 50 passed                                    [OK]
astro build (avif/webp + fallback jpg)              [OK]
VERDE: todo en orden.
```
