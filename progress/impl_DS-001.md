# impl DS-001: sistema de diseño tokenizado completo

Implementer · vuelta 1 · 2026-10-01 · resultado: `./init.ps1` VERDE

## Archivos

- `src/styles/tokens.css`: reescrito. Tiene 252 tokens y cierra con `initial` los 14 namespaces del acceptance, y además `inset-shadow`, `drop-shadow` y `text-shadow` para no dejar sombras por defecto de Tailwind.
- `src/styles/global.css`: añade las variables `--tone-muted`/`--tone-strong` en `:root` y las utilidades `container-page`, `tone-on-ink`, `tone-on-paper` y `surface-noise`. Solo usa `var(--…)`.
- `src/assets/textures/noise.svg` (nuevo): textura de ruido hecha con feTurbulence.
- `src/shared/ui/ToneText.astro`: los tonos salen de `text-(color:--tone-muted)` y `text-(color:--tone-strong)`, así responden a la superficie (arrastre 1).
- `src/app/registry.ts`: queda un único `satisfies SectionRegistry`. `componentFor` lanza `Error("Sección sin registrar: type "…" (id "…")…")` (arrastre 2).
- `tests/registry.test.ts` (nuevo): comprueba que `componentFor` lanza el error con un type sin registrar.
- `tests/design-tokens.test.ts` (nuevo): contrato de `tokens.css`. Cubre namespaces cerrados, que la clave de espaciado sea igual a su valor en px, que cada rol tenga line-height y font-weight, que el máximo del clamp sea el valor de Figma, que 2xl sea 1440 y el contenido 1320, y que haya keyframes para cada animación.
- `docs/design-system.md`: regenerado con `pnpm docs:ds` (252 tokens, 18 grupos). Lo revisé y se lee bien: hay un grupo por sección y en cada token se ven valor, utilidad, origen y uso.
- `feature_list.json`: DS-001 pasa a `in_progress`. `progress/current.md`: plan.

## Fuentes consultadas

Usé `design/figma/homepage.0.txt` completo (lo condensé con un script, mirando nodo, clases y texto), `INVENTORY.md` §1 y `figma-tokens.json`. En Figma MCP hice `get_design_context` de `33:78` (fila abierta de servicios) y `1:17` (branding) y `get_metadata` de `32:82`, `174:157`, `35:150`, `31:17`, `31:60` y `41:406`, para medir los altos reales de los bloques de texto (cabecera de sección = 147 px, línea de h2 = 56 px, eyebrow = 20 px). Después **Figma cortó por límite de llamadas del plan Starter**, así que `174:26` (footer) no se pudo medir. No bloqueó nada, porque el footer tiene auto-layout explícito en homepage.0.

## Roles tipográficos (mobile 375 → 1440)

Los fluidos usan `clamp(min, a + b·vw, max)`, lineal entre 375 y 1440. El mínimo es `@derived` y el máximo viene de Figma. La familia no puede ir dentro de `--text-*` (v4 solo admite los modificadores line-height, letter-spacing y font-weight), así que cada rol indica en `@usage` qué clase acompaña: `font-heading` (Google Sans Flex) o `font-body` (DM Sans).

| Rol (`text-…`) | 375 | 1440 | Peso | Leading | Tracking | Familia | Nodos Figma |
|---|---|---|---|---|---|---|---|
| `wordmark` | 88 | 160 | 800 | normal | 0 | body | 11:27 |
| `wordmark-sub` | 24 | 40 | 800 | normal | 0 | body | 11:27 |
| `display` | 32 | 60 | 600 | 1 | 0 | heading | 33:118 |
| `h2` | 30 | 45 | 500 | normal | 0 | heading | 16:82, 29:246 |
| `stat` | 36 | 45 | 600 | normal | 0 | heading | 29:253, 29:291 |
| `title-xl` | 32 | 44 | 700 | normal | -1px | heading | 174:78 |
| `title-lg` | 26 | 40 | 400 (abierta: `font-semibold`) | normal (+ `leading-service-row` 4.28 / `-open` 3.54) | 0 | heading | 31:51, 33:24, 33:31 |
| `title` | 22 | 28 | 500 | normal | 0 | heading | 174:30, 174:37 |
| `lead` | 18 | 20 | 500 | normal | 0 | heading | 11:25, 35:132 |
| `title-sm` | 17 | 19 | 500 | normal | -0.01em (-1 %) | heading | 174:160, 174:167 |
| `hero-list` | 16 | 18 | 600 | 2.23 | 0 | heading | 11:41 |
| `stat-label` | 16 | 18 | 500 | normal | 0 | heading | 29:269, 29:299 |
| `body-lg` | 16 | 18 | 400 | 1.5 | 0 | heading | 174:51 |
| `name` | 18 | 18 | 600 | normal | 0 | body | 41:401 |
| `body` | 16 | 16 | 400 | normal | 0 | body | 29:247, 33:65 |
| `answer` | 16 | 16 | 400 | 26px | 0 | body | 174:164 |
| `eyebrow` (+`uppercase`) | 16 | 16 | 500 | normal | 0 | heading | 16:58, 35:158 |
| `label` | 16 | 16 | 500 | normal | 0 | heading | 11:39, 35:304 |
| `link` | 16 | 16 | 400 | normal | 0 | heading | 29:236, 38:321 |
| `button` | 15 | 15 | 600 | normal | 0 | heading | 174:88 |
| `card-title` | 15 | 15 | 500 | normal | 0 | heading | 174:197, 174:214 |
| `button-sm` | 14 | 14 | 500 | normal | 0 | heading | 11:31 |
| `label-sm` | 14 | 14 | 500 | normal | 0 | heading | 174:77 |
| `body-sm` | 14 | 14 | 400 | normal | 0 | body | 174:82, 174:86 |
| `list` | 14 | 14 | 400 | 1.29385 (129.385 %) | 0 | body | 33:67 |
| `role` | 14 | 14 | 300 | normal | 0 | body | 41:402 |
| `initials` | 14 | 14 | 700 | normal | 0 | body | 174:195, 174:281 |
| `quote` | 13 | 13 | 400 | 1.5 | 0 | heading | 174:199, 174:216 |
| `meta` | 13 | 13 | 400 | normal | 0 | heading | 174:53, 174:56 |
| `caption` | 12 | 12 | 400 | normal | 0 | heading | 174:198, 174:284 |
| `overline` (+`uppercase`) | 12 | 12 | 600 | normal | 0 | heading | 174:29, 174:49 |
| `legal` | 11 | 11 | 400 | 16px | 0 | body | 174:89 |

`leading normal` se deja como `normal`, igual que en Figma: el navegador aplica las métricas de la fuente igual que Figma. Las cajas medidas dan h2 45 → 56 px, eyebrow 16 → 20 px, stat-label 18 → 23 px y title-sm 19 → 24 px.

## Escala de espaciado completa (79 claves, en px, sin redondeo)

Es exactamente el conjunto de valores que usa Figma. Las claves coinciden con los px (`p-40`, `gap-51`, `w-650`, `h-447`).

| Grupo | Valores |
|---|---|
| Base | `0` (@derived), `px` = 1 (stroke de las líneas 29:254) |
| Componentes (gap y padding) | 2, 5, 9, 10, 12, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 26, 30, 32, 36, 38, 40, 50, 51, 60, 61, 80, 100, 120 |
| Bloques (distancias calculadas en 1440) | 41, 45, 55, 65, 68, 70, 78, 98, 140, 167, 169, 180, 191, 262, 268, 669 |
| Dimensiones fijas | 18, 48, 52, 91, 187, 193, 251, 300, 308, 310, 311, 318, 344, 360, 401, 410, 423, 426, 446, 447, 522, 536, 608, 616, 622, 638, 650, 658, 720, 764, 793, 794, 844, 851 |

Cada clave anota en `@figma` sus nodos y el cálculo que la produce. Las distancias de bloque más importantes son estas:
- **140**: ritmo entre secciones (logos → proyectos, process → servicios).
- **70**: de cabecera de sección a contenido (proyectos, servicios).
- **65**: métricas → process, masonry → equipo, cabecera → cards del equipo.
- **45**: hero → logos.
- **191**: grid de proyectos → métricas.
- **180**: servicios → showcase.
- **268**: showcase → testimonios.
- **98 y 78**: espaciado interno del showcase.
- **68 y 55**: posición del título dentro del bloque process.
- **167**: posición de la card glass.
- **169, 262 y 669**: posición del wordmark, de la lista y del lead del hero.

**Normalizaciones de deriva** (documentadas en cada token):
- 142 y 143 (antes de FAQ y de contacto) pasan a 140.
- La card de proyecto de 450 pasa a 447.
- La card del showcase de 617 pasa a 616.
- 1319, 1321 y 1322 pasan a 1320, y 59 pasa a 60 (INVENTORY).

**Valores de Figma que no van a la escala, a propósito:**
- `pt-369` y `pt-352`: empujan la pill o el texto al fondo de la card; se resuelven con `justify-end`.
- `pr-181`: es la caja del texto del equipo.
- `gap-297`: lo produce `justify-between`.
- `606`: sale de 650 − 2·22.
- Anchos de cajas de texto (239, 253, 259, 95, 209): artefactos de texto, no layout.
- Decimales de assets vectoriales o rotados (badge 157.5, galería del footer 291.944…, 208.866): los fija el propio asset o se calculan en SEC-FOOTER.
- Posiciones con % del hero: `left 60%` de la regla y `calc(80%-21px)` de la lista. Las decide SEC-HERO.

**Cerrar `--spacing-*` (comprobado en el CSS de `dist/`):**
- Desaparece el multiplicador `--spacing` (no se emite). Por eso `p-13`, `w-13`, `gap-4` y `mt-8` **no generan CSS**.
- `p-0`, `gap-0`, `inset-0`, `top-0`, `min-w-0` y `translate-x-0` dependen de `--spacing-0`, que se conserva como `@derived`.
- `h-px` y `gap-px` usan `--spacing-px`.
- Siguen funcionando: `w-full`, `h-full`, `w-screen`, `w-1/2`, `h-auto`, `m-auto`, `mx-auto`, `-mt-16` (`calc(var(--spacing-16) * -1)`), `rounded-full`, `rounded-none`, `bg-transparent`, `text-current` y `ease-linear` (son estáticas).
- `rounded-lg`, `shadow-lg`, `text-xl`, `bg-red-500`, `drop-shadow-lg` y `max-w-md` no se generan.

## Resto de tokens agregados y su origen

- **Color**:
  - Las 5 variables de Figma (`@figma var:` validado por check:ds).
  - `ink-soft` #6E6E73 (174:198), `paper-muted` #AFAFAF (11:25) y `paper-ghost` rgba(197,197,197,.62) (33:118). Este último es un color suelto que **no estaba en INVENTORY**: es el título del showcase.
  - Glass: `glass` .13, `glass-line` .1 y `glass-field` .15 (174:75 y 174:81). `scrim` rgba(0,0,0,.45) (174:74).
  - `avatar-{1..4}-bg/fg`: 1 lila, 2 verde, 3 amarillo, 4 rosa.
  - #0A0A0A y #1C1C1E se absorben en `ink` (anotado).
  - `@contrast` va en cada par texto/fondo. **Aviso**: `ink-muted` sobre `ink` da 3.57:1, y los títulos de columna del footer (12px, 174:29) no llegan a AA. Lo tiene que decidir SEC-FOOTER: subir a `line` (10.04:1) o aceptarlo como está en Figma.
- **Pesos**: 300, 400, 500, 600, 700 y 800.
- **Leading**: normal, none, relaxed 1.5, list, hero-list, service-row, service-open, answer 26px y legal 16px.
- **Tracking**: tight -1px, snug -0.01em y normal.
- **Radios semánticos**: `media` 5, `field` 10, `panel` 10, `card` 16, `avatar` 20, `glass` 24 y `pill` 999 (unifica 90, 100 y 999). Cada uno lleva `@usage` "SOLO …". **Me aparto del ejemplo del acceptance**, que decía "radius-panel 20". En Figma los paneles oscuros (31:18, 33:17) tienen **10px**. El único 20 son los avatares de 40px (círculo), así que `panel` = 10 y `avatar` = 20.
- **Sombras**: `card` 0 6px 8px .04 (174:192) y `card-sm` 0 4px 6px .03 (174:158). Figma usa drop-shadow (filter). Lo paso a box-shadow porque en una card rectangular y opaca el resultado es idéntico y cuesta menos.
- **Blur**: `glass` 20 (174:75) y `masonry` 2 (174:190). El segundo es un layer blur de 2px sobre todo el viewport del masonry; SEC-TESTIMONIALS tiene que confirmar si es intencional.
- **Ruido**: el efecto `ruido general` (NOISE radius 4) no se exporta.
  - Decisión: un SVG feTurbulence (fractalNoise, baseFrequency 0.8, 3 octavas, grano blanco con alfa 0.14, tile de 200px) en `src/assets/textures/noise.svg`.
  - El token `--noise-texture: url("../assets/textures/noise.svg")` lo inserta Vite como data URI (verificado en `dist/`). No hay petición extra y ocupa menos de 0,5 KB.
  - Uso: `bg-ink surface-noise`.
  - Pendiente: calibrar la densidad y la opacidad contra `get_screenshot` del hero en SEC-HERO. No pude hacerlo por el límite de MCP.
- **Layout**:
  - Breakpoints sm 640, md 768, lg 1024 y xl 1280 (@derived) y 2xl 1440 (@figma 11:12).
  - `--container-content` 1320 y `--container-page` 1440.
  - Gutters `--gutter-base` 16, `-md` 32, `-lg` 40 y `-2xl` 60, como alias de tokens de spacing.
  - `@utility container-page` (en `global.css`, porque el parser de tokens leería su `--page-gutter` interno como un token): `max-width: calc(content + 2·gutter)` y `padding-inline: gutter` con `@variant md/lg/2xl`. A 1440 deja exactamente 1320 de contenido.
- **Motion**:
  - Duraciones: `fast` 150ms, `base` 250ms, `slow` 400ms, `marquee` 40s, `badge` 20s y `masonry` 60s.
  - Easing: `standard` y `out`.
  - `animate-marquee` (translateX 0 → -50%, pista duplicada), `animate-badge-spin` (0 → 360°) y `animate-masonry` (translateY -50% → 0, es decir, hacia abajo, con columna duplicada).
  - Todo es @derived: Figma no tiene props de motion (31:42 es un `motion.div` sin parámetros).
  - Se usan con `motion-safe:`, que comprobé que genera `@media (prefers-reduced-motion:no-preference)`.

## Utilidades validadas en `dist/`

Usé una sonda temporal `src/shared/ui/DsProbe.astro` (ya borrada), hice el build e inspeccioné `dist/client/_astro/*.css`. Se generan:
- `text-h2`, que emite `font-size`, `line-height` y `font-weight` de los modificadores. `text-title-xl` y `text-title-sm` también emiten `letter-spacing`.
- `p-40`, `px-22`, `gap-51`, `w-650`, `h-447`, `max-w-764`, `max-w-content` y `min-h-720`.
- `rounded-card`, `rounded-pill`, `rounded-media`, `shadow-card` y `shadow-card-sm`.
- `2xl:p-60`, que sale como `@media (width>=1440px)`, además de `xl:` y `md:`.
- `motion-safe:animate-marquee`, `animate-badge-spin` y `animate-masonry`, con los 3 `@keyframes` emitidos.
- `backdrop-blur-glass` y `blur-masonry`.
- `bg-brand`, `bg-avatar-1-bg`, `text-paper-ghost`, `bg-glass` y `border-glass-line`.
- `font-medium`, `leading-service-row`, `tracking-snug`, `ease-out` y `duration-(--duration-base)`.
- `container-page` (con media queries de 768, 1024 y 1440), `tone-on-ink`, `surface-noise` y `text-(color:--tone-muted)`.

## Arrastres de verify_FND-001

1. **ToneText según la superficie**:
   - `:root` define `--tone-muted: ink-muted` y `--tone-strong: ink`.
   - Un contenedor con la clase `tone-on-ink` los cambia a `paper-muted` (#AFAFAF) y `paper`. `tone-on-paper` los restablece.
   - ToneText no necesita prop: hereda de la superficie.
2. **Registry**: queda un único `satisfies SectionRegistry`. `componentFor` lanza un Error descriptivo con type e id, y lo cubre un test.

## Responsive inferido

- Base 375px. Los roles grandes son fluidos con clamp: 160 → 88, 60 → 32, 45 → 30 (h2), etc. Los roles de 16px o menos se mantienen fijos.
- Gutter de 16, 32, 40 y 60 según el breakpoint.
- Las dimensiones fijas (cards 650×447, 344×423…) son exactas desde `2xl`. En mobile se usan como `max-w-*` o con aspect-ratio. Lo decide cada sección.

## Notas para el orquestador y bugs de scripts (no modificados)

- `scripts/lib/tokens.mjs`:
  - Solo admite una declaración por línea; por eso los clamp van en una línea.
  - `pick()` corta la anotación en `@` o `*`, y `@figma` termina al final de la línea (flag `m`). Escribí cada etiqueta en una sola línea y sin esos caracteres.
  - Las custom properties de un `@utility` en `tokens.css` contarían como tokens; por eso las utilidades viven en `global.css`.
  - `@keyframes` dentro de `@theme` no da problemas (sus líneas no empiezan por `--`).
- `check:ds` (tokens sin uso): los modificadores `--text-x--line-height` siempre cuentan como "sin uso", porque la utilidad es `text-x`. Es esperable y solo es un aviso (193 hoy).
- Figma MCP llegó al límite de llamadas del plan Starter durante esta feature, y las features siguientes lo necesitan (`get_design_context` y screenshot por nodo). Conviene revisar la cuota antes de SEC-HEADER.

## Salida de `./init.ps1` (resumida)

```
[OK] node v22.20.0 · pnpm v11.1.3 · pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[warn] 193 token(s) sin uso aparente (secciones aún no existen; esperado)
check:ds → 252 tokens · 0 ds-allow · 0 error(es)       [OK]
check:arch → 12 archivos · 0 módulos · 0 error(es)      [OK]
astro check → 0 errors · 0 warnings · 0 hints           [OK]
vitest → 4 files · 15 tests passed                       [OK]
astro build → /index.html prerenderizado                 [OK]
VERDE: todo en orden.
```

## Vuelta 2

Implementer · 2026-10-01 · corrige los hallazgos bloqueantes y mayores de `progress/verify_DS-001.md`. No se usó Figma MCP: los valores salen de `design/figma/homepage.0.txt` y de los assets que cita el verify.

### Bloqueante

- **Color de los separadores (`stroke black 24%`)**
  - `src/styles/tokens.css:26-27`: nuevo `--color-divider: rgba(0, 0, 0, 0.24)`.
    - `@figma imgLine1/imgLine3 stroke black 24% (29:254, 31:54-31:57)`.
    - `@usage`: separadores de 1px sobre paper, con `border-divider` o `bg-divider`.
    - `@contrast`: ≈ #C2C2C2, 1.78:1, solo decorativo.
  - `src/styles/tokens.css:23`: el `@usage` de `--color-line` ya no dice "líneas y separadores". Ahora indica que en Figma solo es texto sobre glass (174:77, 174:82, 174:84, 174:86 y 174:89) y que no sirve para separadores (para eso está `divider`).
  - La etiqueta `@figma var:gris` se queda tal cual: check:ds valida el nombre exacto contra `figma-tokens.json`.

### Mayores

- **`--text-lead` citaba `35:132`, que en Figma es `leading-none`**
  - `src/styles/tokens.css:174`: el `@figma` queda solo con `11:25`.
  - El `@usage` indica que el eyebrow del bloque process (35:132) usa este rol más `leading-none` (20px).
- **Espaciados que eran coordenadas absolutas**
  - `src/styles/tokens.css` (antes en :389-390 y :393-394): se eliminan `--spacing-262` y `--spacing-669`. Nada los usaba en `src/` ni en `tests/`.
  - `src/styles/tokens.css:386`: `--spacing-169` documenta que solo vale como `pt` del hero si el header va superpuesto. Con el header en flujo (12 + 40 = 52) la distancia sería 117, y la añadirá SEC-HERO con su cálculo.
- **`docs/design-system.md` no se podía leer bien**
  - `scripts/gen-design-docs.mjs:43-66`: el grupo "Tipografía · roles" se genera con una sola fila por rol (32 filas). Las columnas son Rol · 375 · 1440 · Peso · Leading · Tracking · Familia · Origen · Uso.
    - Los tamaños a 375 y a 1440 salen del `clamp()`.
    - La familia (`font-heading` o `font-body`) sale de `@usage`.
    - Los modificadores `--text-x--*` ya no tienen fila propia.
  - `scripts/lib/tokens.mjs:94`: el namespace `container` muestra `max-w-<key>` (`max-w-content`, `max-w-page`) en lugar de `@<key>:`.
  - Se ejecutó `pnpm docs:ds`: 251 tokens y 18 grupos.
  - Nota: `scripts/` es zona del orquestador según CLAUDE.md. Lo toqué solo porque el verify pedía este arreglo ahí.

### Menores

Uno se aplicó porque era solo texto de anotación. El resto queda diferido:

- **[V6] `ink-muted` sobre `ink`**: aplicado.
  - `src/styles/tokens.css:29` ahora lista los 8 nodos: 174:29, 174:36, 174:43, 174:49, 174:53, 174:54, 174:56 y 174:58.
  - La alternativa es `line`, con 10.04:1.
  - La decisión de cambiarlo o no queda para SEC-FOOTER.
- **[V6] `avatar-3` 4.52:1**: diferido. Pasa AA y el valor es el de Figma, así que no hay nada que corregir.
- **[Color] Utilidades de color genéricas (`bg-* text-* border-*`) en la documentación**: diferido. El verify lo marca como menor y queda fuera del arreglo pedido.
- **[Calidad] Escala de espaciado de 79 valores y dimensiones dentro de `spacing`**: diferido a una feature futura. El acceptance pide exactamente el conjunto de Figma.
- **[Normalizaciones] Registrar 142/143→140, 450→447 y 617→616 en `current.md` o `history.md`**: diferido al orquestador, que es el dueño de `progress/`. Ya está documentado en cada token y en la vuelta 1 de este impl.
- **[Normalizaciones] `@usage` de `radius-panel` ("process, showcase")**: diferido. Es un ajuste de texto y SEC-SHOWCASE lo puede precisar cuando use el token.
- **[Trazabilidad] Valores fuera de la escala**: diferido; se registran aquí. Ninguno va a la escala porque dependen del contenido o del asset:
  - `h-112` (16:82, 31:29, 40:372, 38:336) y `h-160` (29:246);
  - `w-263` ×6 y `w-546` (11:27);
  - `h-660` (33:98), `h-629`/`683`/`659` (masonry) y `h-103` (41:415);
  - `h-26` (16:47), los anchos de logos (99–168), `w-1329` (33:118) y `w-1439` (33:17).
- **[Offline] Nodos `33:*` y la contradicción del leading 3.54**: diferido a SEC-SERVICES. Necesita `get_design_context` de `33:78` y la cuota de MCP está agotada.
- **[V5 futuro] Tokens `--z-*` y cierre de `duration`, `z` y `opacity`**: diferido. Está fuera del acceptance y conviene hacerlo antes de SEC-HEADER.
- **[V4] Calibrar el ruido** y **[V2] `blur-masonry`**: diferidos a SEC-HERO y SEC-TESTIMONIALS, como ya estaba anotado.

### Salida de `./init.ps1` (vuelta 2, resumida)

```
[OK] node v22.20.0 · pnpm v11.1.3 · pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[warn] 190 token(s) sin uso aparente (esperado)
check:ds → 251 tokens · 0 ds-allow · 0 error(es)       [OK]
check:arch → 12 archivos · 0 módulos · 0 error(es)      [OK]
astro check → 0 errors · 0 warnings                     [OK]
vitest → 4 files · 15 tests passed                       [OK]
astro build → /index.html prerenderizado                 [OK]
VERDE: todo en orden.
```
