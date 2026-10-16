# impl CLEANUP-TOKENS — tokens.css mínimo, Tailwind sin sobrescribir y sin tests

Vuelta 1. Estado: lista para verificar (`in_progress`).

## Archivos tocados

- `src/styles/tokens.css`: reescrito (985 → 464 líneas). Sin `initial`, sin anotaciones, solo tokens usados.
- `src/styles/global.css`: `@import "tailwindcss" source("../")` (escanea solo `src/`); comentario del parser de tokens actualizado.
- Migración de clases de spacing (176 usos) en:
  `src/layout/{Footer,Header}.astro`, `src/layout/MobileMenu.svelte`,
  `src/modules/{contact,hero,logo-marquee,process,project-gallery,services,showcase,stats,team,testimonials}/Section.astro`,
  `src/modules/contact/ContactForm.svelte`, `src/modules/services/ServicesAccordion.svelte`, `src/pages/componentes.astro`,
  `src/shared/ui/{AccordionCards,ButtonBrand,ButtonInk,ButtonPauseGlass,InputGlass,LinkCtaBrand,LinkLogo,LinkMenu,TextareaGlass}.svelte`,
  `src/shared/ui/{AvatarInitials,Eyebrow,LegalLinks,LinkButtonPaper,LinkMore,ProjectCard,ReviewCard,SectionHeader,ShowcaseCarousel,TeamSlider}.astro`.
- Comentarios: se quitan `@derived` en `ButtonPauseGlass`, `FieldError`, `FormStatus`, `FormStatusError`, `InputGlass`,
  `LinkMenu`, `TextareaGlass` (.svelte); se quitan las menciones a tests/vitest en `src/core/page.ts`,
  `src/modules/contact/form.ts`, `src/layout/footer-wheel.ts`, `src/shared/lib/motion/tokens.ts`, `src/shared/lib/slider/timing.ts`.
- `tests/` y `vitest.config.ts`: borrados.
- `package.json`: fuera `vitest`, `test` y `docs:ds`; `check:ds` = `node scripts/check-design-system.mjs` (llamaba a `gen-design-docs.mjs`, ya borrado).
- `pnpm-lock.yaml`: actualizado con `pnpm install` (sin vitest).
- `scripts/check-design-system.mjs`: arreglado un error de sintaxis en la línea 9 (`replaceAll('\', '/')`: string sin cerrar) → `replaceAll(path.sep, '/')`. Sin esto `check:ds` no arrancaba. El archivo es del orquestador: lo señalo para que lo revise.
- `docs/design-system.md`: reescrito a mano (≈ 35 líneas): qué agrega tokens.css sobre Tailwind.
- `docs/components.md`: las clases de spacing citadas se migran a la escala nativa (41 menciones), para que la doc no contradiga el código.
- `feature_list.json`: CLEANUP-TOKENS → `in_progress`. `progress/current.md`: plan.

## Migración de spacing (`N` px → `N/4` de la escala nativa)

Mecánica con script: solo se tocaron clases cuyo número tenía `--spacing-N` (las demás no generaban CSS), con
cualquier variante (`md:`, `2xl:`, `hover-motion:`…) y negativos. `0` y `px` no cambian (nativos).

| Antes → después (usos) |
|---|
| `gap-2→0.5` (2) · `gap-5→1.25` (5) · `gap-10→2.5` (2) · `gap-12→3` (12) · `gap-15→3.75` (2) · `gap-16→4` (8) · `gap-17→4.25` (1) · `gap-20→5` (3) · `gap-21→5.25` (2) · `gap-24→6` (8) · `gap-26→6.5` (1) · `gap-30→7.5` (1) · `gap-40→10` (5) · `gap-61→15.25` (2) · `gap-80→20` (1) |
| `gap-x-20→5` (2) · `gap-x-24→6` (1) · `gap-x-30→7.5` (1) · `gap-x-40→10` (1) · `gap-y-40→10` (3) |
| `p-15→3.75` (2) · `p-24→6` (2) · `px-12→3` (1) · `px-20→5` (2) · `px-24→6` (5) · `py-10→2.5` (1) · `py-14→3.5` (2) · `py-80→20` (1) |
| `pt-9→2.25` (2) · `pt-12→3` (2) · `pt-20→5` (1) · `pt-24→6` (2) · `pt-27→6.75` (1) · `pt-40→10` (2) · `pt-48→12` (1) · `pt-60→15` (1) |
| `pb-10→2.5` (2) · `pb-12→3` (1) · `pb-20→5` (1) · `pb-30→7.5` (3) · `pb-40→10` (1) · `pb-48→12` (1) · `pl-18→4.5` (1) · `pl-24→6` (1) |
| `mt-15→3.75` (1) · `mt-21→5.25` (1) · `mt-23→5.75` (2) · `mt-24→6` (1) · `mt-40→10` (1) · `mt-93→23.25` (1) · `-mt-24→-6` (1) · `-mt-48→-12` (2) · `-mb-30→-7.5` (1) · `-mb-48→-12` (2) · `-ml-3→-0.75` (2) · `-ml-27→-6.75` (1) · `-mx-24→-6` (2) · `-translate-x-3→-0.75` (1) |
| `h-9→2.25` (2) · `h-10→2.5` (1) · `h-40→10` (5) · `h-44→11` (2) · `h-91→22.75` (1) · `size-12→3` (2) · `size-16→4` (1) · `size-20→5` (1) · `size-24→6` (1) · `size-32→8` (1) · `size-40→10` (2) · `size-44→11` (1) |
| `w-187→46.75` · `w-193→48.25` · `w-249→62.25` · `w-426→106.5` · `w-516→129` (1 c/u) |
| `min-h-44→11` (4) · `min-h-52→13` · `min-h-622→155.5` · `min-h-638→159.5` · `min-h-720→180` · `min-h-844→211` · `min-h-851→212.75` (1 c/u) |
| `max-w-209→52.25` · `-300→75` · `-360→90` · `-361→90.25` · `-401→100.25` · `-410→102.5` (4) · `-446→111.5` (6) · `-536→134` · `-650→162.5` · `-764→191` (2) · `-794→198.5` |

`var(--spacing-N)` (solo existía dentro de tokens.css) → `calc(var(--spacing) * N/4)`; `var(--spacing-px)` → `1px`.
No había `@apply`, ni clases construidas con strings en TS, ni `--spacing-N` fuera de tokens.css.

## Colisiones con defaults y renombrados

No hizo falta renombrar nada: todos los nombres propios que colisionaban estaban **sin uso** y se borraron.

| Token | Propio | Default | Resolución |
|---|---|---|---|
| `--leading-normal` | `normal` | 1.5 | sin uso → borrado (los roles `text-*` llevan su `--line-height`) |
| `--leading-relaxed` | 1.5 | 1.625 | sin uso → borrado |
| `--tracking-tight` | -1px | -0.025em | sin uso → borrado (el -1px vive en `--text-title-xl--letter-spacing`) |
| `--ease-out` | (0.16,1,0.3,1) | (0,0,0.2,1) | sin uso → borrado |
| `--font-mono` | pila sin Monaco/"Courier New" | pila de Tailwind | borrado: `font-mono` usa el default (misma fuente resuelta, ver abajo) |

Sin colisión: `text-*` (roles), `radius-*`, `shadow-card*`, `blur-glass/-masonry`, `container-content/-page`, `animate-*`, `ease-standard/-enter/-expand`.

## Tokens borrados por categoría (109 + 18 resets)

| Categoría | Borrados | Detalle |
|---|---|---|
| Resets `--<ns>-*: initial` | 18 | color, font, font-weight, leading, tracking, text, spacing, radius, shadow, inset-shadow, drop-shadow, text-shadow, blur, breakpoint, container, z-index, ease, animate |
| Espaciado `--spacing-N` | 86 | todos (incluidos `--spacing-0` y `--spacing-px`) |
| Pesos | 6 | light…extrabold: idénticos al default |
| Interlineado | 7 | normal, relaxed (colisión), none (idéntico), list, hero-list, answer, legal (sin uso) |
| Tracking | 3 | tight (colisión), snug, normal: sin uso |
| Breakpoints | 4 | sm, md, lg, xl: idénticos al default (queda `--breakpoint-2xl: 1440px`) |
| Fuentes | 1 | `--font-mono` |
| Motion | 2 | `--duration-slow`, `--ease-out` (sin uso) |
| Color, roles de texto, radios, sombras, blur, contenedores, z, medidas de sección, componentes | 0 | todos usados |

Anotaciones `@figma/@derived/@usage/@contrast`: 335 → 0 en tokens.css; quedan 20 comentarios de una línea (más los títulos de grupo) donde el porqué no es obvio.

## Verificación de no-regresión visual

1. **Estilos computados** (Chrome headless, JS del sitio quitado y animaciones en pausa, para que sea determinista;
   dos capturas del baseline dan 0 diferencias): 77 propiedades + offset/tamaño de cada elemento y de `::before/::after`,
   en `/` y `/componentes` a 375, 768, 1024 y 1440, build anterior vs build final.
   Resultado: **0 diferencias de layout, color, tipografía, radios, sombras, motion…**; la única diferencia es el
   `font-family` de los elementos `font-mono` y sus hijos (valores de métricas de ProjectCard: 48 en home, 37 en /componentes por ancho), por la pila de Tailwind.
   La fuente resuelta es la misma: Windows → Consolas, macOS → `ui-monospace`, Linux → Liberation Mono.
2. **Estados no capturados** (hover, foco, `card-active`, `data-open`…): para cada candidato de clase de `src/`
   se comparó si genera CSS en el build nuevo frente a su nombre antiguo en el baseline. Ninguna clase usada
   pierde CSS. Las únicas que pasan a generar CSS son `blur` y `backdrop-blur`, que solo aparecen como palabra en
   comentarios/código TS (no se aplican a ningún elemento).
3. **Paleta reactivada**: ningún elemento cambia de color (punto 1); ningún candidato de `src/` coincide con un
   color por defecto.
4. **Defaults disponibles** (sonda temporal en `src/`, borrada después): `bg-black`, `bg-white`, `text-neutral-500`,
   `p-4` (`calc(var(--spacing) * 4)`, `--spacing: .25rem`), `rounded-lg`, `shadow-md`, `ease-in-out`, `leading-normal` (1.5)
   y `tracking-tight` (-0.025em) generan CSS.
5. CSS del build: 103 KB → 62 KB. Antes Tailwind escaneaba `docs/`, `progress/`, `design/`… y generaba utilidades
   con los nombres que aparecían allí; con `source("../")` en global.css solo escanea `src/`.

Nota: el spacing pasa de px a rem (`0.25rem` por paso). Con el tamaño de fuente raíz por defecto (16px) el valor es
idéntico; si el usuario agranda la fuente del navegador, los espaciados de utilidades escalan con ella (los tokens
de sección con `clamp()` en px no cambian).

## ./init.ps1

```
[OK]   node (v22.20.0) · pnpm (v11.1.3) · pnpm install
[OK]   maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
check:ds → 0 ds-allow · 0 error(es)       [OK] sin valores sueltos en src/
[OK]   fronteras de capas y modulos
Result (106 files): 0 errors              [OK] astro check
[OK]   astro build
VERDE: todo en orden.
```

## Vuelta 2

Corrige el hallazgo Mayor de `progress/verify_CLEANUP-TOKENS.md` (tokens `--animate-reveal-left/right` sin uso).

Archivos modificados:
- `src/styles/tokens.css`: borrados `--animate-reveal-left` y `--animate-reveal-right`. Se conservan los `@keyframes reveal-left/right` y `--motion-distance-slide`, que usan `--animate-enter-from-left/right`.
- `src/shared/lib/motion/reveal.ts:3`: el comentario solo cita `reveal-up`.
- `src/styles/global.css:155`: el comentario solo cita `reveal-up`.
- `docs/design-system.md`, fila Motion: `--animate-reveal-*` pasa a `--animate-reveal-up`.
- `docs/conventions.md:65` y `:73`: las mismas referencias (`--animate-reveal-*`, `reveal-left` / `reveal-right`) pasan a `reveal-up`, para que la documentación no cite utilidades que ya no existen.

Comprobación: el CSS de `dist/client/_astro/` ya no contiene `.reveal-left` ni `.reveal-right`; solo queda `.reveal-up`. En `src/` y `docs/` no queda ninguna mención de `reveal-left/right`, salvo los keyframes y su uso en `--animate-enter-from-*`.

`./init.ps1`: VERDE, exit 0 (check:ds, check:arch, astro check y astro build en OK).
