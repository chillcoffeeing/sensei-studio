# impl SEC-SERVICES — Servicios: acordeón de 4 disciplinas (vuelta 1)

Implementer · 2026-10-02. **Figma MCP sin cuota** (`get_design_context` y `get_screenshot` de `33:78`
devuelven "tool call limit on the Starter plan"). Fuentes usadas: `design/figma/homepage.0.txt`
(nodo `31:60` y sus hijos), `design/figma/homepage-full.png`, la especificación medida de
`design/copy/services.md` y los tokens `33:*` que ya existían (DS-001). Las posiciones internas
de `33:78` (separaciones entre punto, título, descripción, lista e imágenes) **no se pudieron medir**:
se infieren y van como tokens `@derived` (ver abajo). Conviene medirlas cuando vuelva la cuota.

## Archivos

- `src/modules/services/schema.ts` — nuevo: `ServiceItem`, `ServicesContent`, `ServicesSection` (cabecera obligatoria).
- `src/modules/services/accordion.ts` — nuevo: lógica pura de la isla (`toggleIndex`, `rowLeading`, `focusTarget`, `accordionIds`) y tipos serializables (`AccordionService`, `AccordionImage`).
- `src/modules/services/ServicesAccordion.svelte` — nuevo: isla Svelte 5 (runes) del acordeón.
- `src/modules/services/Section.astro` — nuevo: cabecera común + isla `client:visible`; imágenes con `getImage` (avif/webp/jpg) y `<noscript>` para el caso sin JS.
- `src/modules/services/index.ts` — nuevo: API pública.
- `src/app/sections.ts`, `src/app/registry.ts` — se registra `services`.
- `src/content/pages/home.ts` — sección `servicios` después de `proceso` (copy de `design/copy/services.md`, cabecera de Figma 31:20).
- `src/assets/services/open-dot.svg` — copia de `imgServicesEllipse3.svg` (punto lima 18, 33:61).
- `src/assets/services/list-bullet.svg` — copia de `imgServicesEllipse4.svg` (viñeta 5, 33:69).
- `src/assets/services/service-placeholder.png` — copia de `imgServicesFrame14.png` (placeholder 33:52; mismos bytes que `imgFrame14.png` y que `project-gallery/das-anthropology-laptop.png`, así que Vite comparte los derivados con la galería).
- `src/styles/tokens.css` — tokens nuevos y anotaciones de los dos leading (abajo).
- `docs/design-system.md` — regenerado (`pnpm docs:ds`).
- `tests/services.test.ts` — nuevo: 13 tests (contenido contra `design/copy/services.md`, lógica del acordeón, render/a11y, assets idénticos a Figma).
- `feature_list.json` (`in_progress`), `progress/current.md` (plan).

Sin dependencias nuevas. El mapa de módulos de `docs/architecture.md` lo actualiza `check:arch`.

## Tokens

| Token | Valor | Origen |
|---|---|---|
| `--spacing-361` | 361px | `@figma 33:65` ancho de la descripción (services.md) |
| `--service-image-aspect` | 187 / 318 | `@figma 33:52` |
| `--services-pad-top` | clamp(64 → 140) | `@figma` 31:18 fin 4079 → 31:20 top 4219 = 140; mínimo `@derived` |
| `--services-row-pad-y` | `var(--spacing-24)` | `@derived` padding de fila < md |
| `--services-dot-gap` | `var(--spacing-15)` | `@derived` punto → título (33:78 sin medir) |
| `--services-copy-gap` | `var(--spacing-24)` | `@derived` descripción → lista |
| `--services-bullet-gap` | `var(--spacing-10)` | `@derived` viñeta → texto |
| `--services-panel-gap` | `var(--spacing-32)` | `@derived` texto → imágenes apilados (< xl) |
| `--services-panel-pad-bottom` | `var(--spacing-40)` | `@derived` aire bajo el panel abierto |
| `--animate-panel-in` + `@keyframes panel-in` | fundido 250ms ease-out | `@derived`, con `motion-safe:` |

Reutilizados: `text-title-lg` (+ `font-semibold` en la abierta), `leading-service-row`, `leading-service-open`,
`text-body`, `text-list`, `spacing-17/18/187`, `radius-media`, `color-divider`, `section-head-gap`, `max-w-410`.

## Arrastre DS-001: leading 3.54 frente a 4.28

No hay contradicción: son **dos estados** de Figma.
- `31:60` (frame de la home, `31:51`): las 4 filas **cerradas**, leading 4.28 (171.2px por fila).
- `33:78` (estado abierto): el título abierto (`33:31`) y las filas cerradas (`33:24`, según
  `design/copy/services.md`) van a 3.54 (141.6px por fila).

La isla aplica `md:leading-service-open` mientras haya una fila abierta (el estado inicial, la
primera) y `md:leading-service-row` si el usuario cierra todas (`rowLeading()` en `accordion.ts`,
con test). Se actualizaron los `@usage` de ambos tokens. Sin medición MCP de `33:78`, el
"3.54 en las filas cerradas" se apoya solo en `services.md`.

## Isla y progressive enhancement

- `button[aria-expanded]` + `aria-controls` dentro de un `h3`; panel `role="region"` + `aria-labelledby`, oculto con `hidden`.
- Una abierta a la vez; pulsar la abierta la cierra. Flechas arriba/abajo (con vuelta), Home y End mueven el foco entre cabeceras.
- `client:visible`. Las imágenes se resuelven en el `.astro` con `getImage` (recorte cover 187×318 a 120/187/240/374/561w, avif + webp + jpg 374w de respaldo) y la isla recibe datos serializables (`sources`, `src`, `srcset`, `sizes`, dimensiones, alt). Punto y viñeta llegan como `{src,width,height}`.
- Sin JS: el SSR deja la primera abierta y `<noscript><style is:inline>[data-service-panel][hidden]{display:block!important}</style></noscript>` muestra los demás paneles. Comprobado en `dist/client/index.html`: 4 paneles en el HTML, 3 con `hidden`, y la regla noscript presente. Con JS no hay salto de layout al hidratar.
- `motion-safe:animate-panel-in`: con `prefers-reduced-motion` no hay animación.

## Responsive inferido

- < md: título a `leading-normal` con padding 24 (el leading de Figma a 26px daría filas de 92–111px y "Desarrollo Web & Automatización IA" parte en dos líneas). Desde md, leading de Figma (4.28/3.54).
- Panel: texto (max 361) e imágenes apilados hasta xl; en xl+ fila `justify-between` con las imágenes arriba a la derecha (3×187 + 2×17 = 595).
- Imágenes: < md, grid de 3 columnas fluidas con aspecto 187/318; desde md, 187px fijos (`sizes`: `(min-width: 768px) 187px, calc((100vw - 66px) / 3)`).
- Cabecera: `SectionHeader` común (apilada en mobile, descripción a la derecha en lg+).

## Inferencias de 33:78 (para medir cuando haya cuota)

- Punto lima a la izquierda del título, gap 15; aparece solo en la fila abierta.
- Descripción y lista debajo del título, alineadas al borde izquierdo (no a la sangría del punto); descripción → lista 24; lista color ink.
- Imágenes con el borde superior alineado al de la descripción; 40px bajo el panel antes del separador.
- Separador = `border-b border-divider` (el token documenta este uso para las filas de servicios) en lugar de `<img>` de `imgLine3`.

## Comprobación visual (Chrome headless, build estático)

- 1440: filas cerradas de 142px (141.6 + 1 de separador) con la primera abierta; panel con 3 imágenes de 187×318 a la derecha. Las capturas están en el scratchpad de la sesión, no en el repo.
- 375 (vía iframe): todo apilado, imágenes en 3 columnas y sin scroll horizontal.
- Diferencia que queda: el h2 corta "…Cuatro disciplinas. Cero / fricción." con el ancho de columna 764. Figma (`31:29`, w 522) corta "Un equipo. Cuatro / disciplinas. Cero fricción.". Se probó `max-w-522` y con las métricas del navegador sale en 3 líneas ("disciplinas. Cero fricción." mide unos 540px). Se revirtió y queda la cabecera común como en stats. Lo decide el verifier.

## init.ps1

```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
check:ds → 297 tokens · 0 ds-allow · 0 error(es)   (warn: tokens sin uso, preexistente)
check:arch → 39 archivos · 6 módulos · 0 error(es)
[OK] astro check (0 warnings)
Test Files 12 passed · Tests 78 passed
[OK] astro build
VERDE: todo en orden.
```

## Vuelta 2

Corrige los 2 bloqueantes de `progress/verify_SEC-SERVICES.md`. Los menores no se tocan.

### Archivos

- `src/modules/services/ServicesAccordion.svelte`: estado `hydrated` (`onMount`). El panel usa `hidden={hydrated && !open}`, `data-collapsed` en los cerrados y `scripting:data-collapsed:hidden`.
- `src/modules/services/Section.astro`: se quita el `<noscript>` y se pasa `titleClass="max-w-(--services-title-max)"` al `SectionHeader`.
- `src/shared/ui/SectionHeader.astro`: prop opcional `titleClass` para el h2 (sin efecto en stats ni en project-gallery).
- `src/styles/global.css`: `@custom-variant scripting (@media (scripting: enabled));`.
- `src/styles/tokens.css`: `--services-title-max`.
- `docs/design-system.md`: regenerado.
- `tests/services.test.ts`: el test del fallback por cadena de noscript se sustituye por estos tests:
  - sin `<noscript>`;
  - `hidden` solo tras hidratar;
  - `data-collapsed` + variante `scripting`;
  - token del h2.

### 1. Sin JS: progressive enhancement sin `<noscript>`

- El SSR **no** emite `hidden` en ningún panel. Los cerrados llevan `data-collapsed=""`. Comprobado en `dist/client/index.html`: el panel 1 va sin el atributo y los paneles 2–4 lo llevan, sin `hidden`.
- **Sin JS**: `@media (scripting: enabled)` no aplica, así que se ven los 4 paneles. Ya no hay ninguna regla que compita con el `[hidden]{display:none!important}` del preflight.
- **Con JS, antes de hidratar** (`client:visible`): `.scripting:data-collapsed:hidden[data-collapsed]{display:none}` oculta los cerrados, así que no hay salto de layout al hidratar. CSS generado: `@media (scripting:enabled){.scripting\:data-collapsed\:hidden[data-collapsed]{display:none}}`.
- **Tras hidratar**: la isla aplica `hidden` (semántica para AT) y mantiene `data-collapsed` sincronizado.
- **Navegador sin soporte de `scripting`**: degrada a "todos visibles hasta hidratar". Nunca oculta contenido sin JS.

### 2. Corte del h2 (31:29)

- Token `--services-title-max: 12.67em`.
  - `@figma 31:29`: w 522, corte "Un equipo. Cuatro / disciplinas. Cero fricción.".
  - `@derived`: el corte de Figma se da con cualquier ancho entre 11.64em ("disciplinas. Cero fricción." = 523.6px a 45px, medido por el verifier) y 13.71em ("Un equipo. Cuatro disciplinas." = 616.9px). Se toma el punto medio, 12.67em ≈ 570px a 45px, como margen ante diferencias de métricas entre motores.
- Va en `em` para que el corte siga la escala fluida del h2.
- Se aplica solo al h2 de servicios, vía `titleClass`.

### init.ps1

`powershell -NoProfile -ExecutionPolicy Bypass -File ./init.ps1` → **VERDE: todo en orden.** (ds, arch, astro check, tests y build).
