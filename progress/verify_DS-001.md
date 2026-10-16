# Verify DS-001 — vuelta 1
Resultado: ROJO

Fuentes de V2: `design/figma/homepage.0.txt` (extracción completa de las 160 clases arbitrarias con
script), `design/figma/assets/*.svg`, `design/INVENTORY.md`, `design/figma-tokens.json` y
`design/copy/services.md`. No se llamó a Figma MCP porque hoy ya se alcanzó el límite de cuota.
Los nodos `33:*` de la fila abierta de servicios no están en `homepage.0.txt` y quedan sin verificar
(ver menores).

## Bloqueantes

- **[V2] Falta el color de los separadores. Además, `--color-line` declara un uso que no tiene en Figma.**
  - En Figma, todas las líneas separadoras sobre paper son `stroke="black" stroke-opacity="0.24"`. Se comprobó en `design/figma/assets/imgLine1.svg` e `imgLine2.svg` (líneas de métrica `29:254`, 300px), en `imgLine3.svg` e `imgServicesLine1.svg` (filas de servicios `31:54`–`31:57`, 1322px) y en `design/copy/services.md:12` ("separador de 1px negro al 24%").
  - En el código, `src/styles/tokens.css:23-24` asigna `--color-line: #B8B8B8` con `@usage líneas y separadores sobre paper`.
  - Esperado: `rgba(0,0,0,0.24)`, que sobre paper da ≈ #C2C2C2 (1.78:1). Actual: #B8B8B8 (1.98:1), que es otro gris y no se adapta a la superficie.
  - En Figma, `var:gris` (#B8B8B8) solo se usa como texto sobre glass: `174:77`, `174:82`, `174:84`, `174:86` y `174:89`.
  - Arreglo:
    - Añadir `--color-divider: rgba(0, 0, 0, 0.24)` con `@figma imgLine1/imgLine3 stroke black 24% (29:254, 31:54-31:57)`, su `@usage` y la nota de contraste "decorativo".
    - Quitar "líneas y separadores sobre paper" del `@usage` de `--color-line` (tokens.css:23).

## Mayores

- **[V2/exactitud] `--text-lead` cita un nodo con otro interlineado.**
  - `src/styles/tokens.css:171-173` declara `@figma 11:25, 35:132 … 20px leading normal`.
  - En Figma, `35:132` ("NUESTRO PROCESO 4 PASOS", homepage.0.txt:441) es `leading-none`, es decir 20px. `text-lead` da `normal`, unos 25px. Si SEC-PROCESS usa el rol tal como está documentado, la línea sale unos 5px más alta.
  - Arreglo: sacar `35:132` del `@figma` y del `@usage` del rol, o anotar "35:132 requiere `leading-none`". Se comprobó que `text-lead leading-none` funciona: `--tw-leading` tiene prioridad.
  - Los otros 31 roles se cruzaron nodo a nodo (familia, peso, tamaño, leading y tracking) y coinciden. Ver la tabla de abajo.

- **[V5 / conventions.md:45-46] Hay tokens de espaciado que son coordenadas absolutas, no distancias de flujo.**
  - `--spacing-262` (tokens.css:389-390, "top 262 desde el borde superior") y `--spacing-669` (tokens.css:393-394, "top 669 desde el borde superior") son la `top` absoluta de `11:41` y de `11:25` dentro del frame.
  - En un layout flex o grid esos valores no corresponden a ningún gap ni padding. La lista arranca 93px (262 − 169) por debajo del wordmark, y el lead se ancla al fondo del hero de 851. Mantenerlos invita a usar `absolute top-669`, que es justo lo que prohíbe `docs/conventions.md` ("Nada de posiciones absolutas de Figma: se traducen a flex o grid").
  - `--spacing-169` (tokens.css:383-384) solo vale como `pt` del hero si el header queda superpuesto. Si el header está en flujo (top 12 + alto 40 = 52), la distancia real es 117.
  - Los demás tokens de bloque (41, 45, 55, 65, 68, 70, 78, 98, 140, 167, 180, 191, 268) sí son distancias entre bordes o paddings de contenedor. Se verificaron (ver abajo) y son correctos.
  - Arreglo: quitar 262 y 669, y dejar que SEC-HERO añada las distancias de flujo con su cálculo `@figma` (por ejemplo, 93 = 262 − 169). Anotar en 169 la suposición de que el header va superpuesto.

- **[Acceptance "docs/design-system.md legible"] La tabla de roles no se deja leer y hay utilidades mal indicadas.**
  - `docs/design-system.md`, sección "Tipografía · roles": cada rol ocupa 3 o 4 filas (tamaño, `--line-height`, `--font-weight`, `--letter-spacing`) que repiten el mismo origen y el mismo uso. Son unas 100 filas para 32 roles, y no hay ninguna columna con el tamaño a 375, el de 1440 ni la familia (`font-heading`/`font-body`). Esos datos tampoco se pueden leer en el `clamp()` crudo. La tabla buena (rol · 375 · 1440 · peso · leading · tracking · familia · nodos) solo está en `progress/impl_DS-001.md`.
  - Sección "Contenedores": `--container-content` aparece con la utilidad `@content:` (que es la variante de container query), cuando la utilidad que se usa es `max-w-content`. Lo mismo pasa con `--container-page`, que aparece como `@page:`.
  - Sección "Color": todos los colores muestran `bg-* text-* border-*` aunque su `@usage` diga otra cosa (por ejemplo `text-scrim`, `text-glass` o `bg-avatar-1-fg`). Es menor, pero confunde.
  - Arreglo, en `scripts/gen-design-docs.mjs`:
    - Agrupar los modificadores `--text-x--*` en una sola fila por rol, con columnas para 375, 1440, peso, leading, tracking y familia (sacada de `@usage`).
    - Para el namespace `container`, mostrar `max-w-<key>`.

## Menores

- **[V6 · contraste] Pares que no cumplen AA.**
  - Se recalcularon los 15 pares y todos los `@contrast` anotados son correctos (17.71, 19.91, 10.04, 1.98, 5.57, 3.57, 5.07, 9.08, 4.90, 6.84, 5.44, 4.52, 5.25).
  - El único par de texto que falla AA es `ink-muted` sobre `ink` (3.57:1). Lo usan los títulos de columna de 12px (`174:29`, `174:36`, `174:43`, `174:49`) y también el meta de 13px del footer (`174:53`, `174:54`, `174:56`, `174:58`).
  - La anotación de tokens.css:26 solo menciona `174:29`. Hay que completarla con los 8 nodos para que SEC-FOOTER lo decida con toda la información. La alternativa compatible es `line`, con 10.04:1.
  - `avatar-3-fg` sobre `avatar-3-bg` da 4.52:1 y pasa AA por muy poco. Si alguien cambia el tono, deja de cumplir.
  - `brand` sobre paper (1.12:1) y `line` sobre paper (1.98:1) solo se aceptan como decorativos. Ya está anotado.

- **[Calidad] Escala de espaciado de 79 valores.**
  - Cumple el acceptance ("exactamente el conjunto de Figma, sin redondeo"), pero tiene costes:
    - Hay casi duplicados que generan dudas al implementar: 14/15/16/17, 19–24, 50/51, 60/61, 300/308/310/311, 401/410, 616/622 y 793/794.
    - Mezcla dimensiones fijas con espaciado, así que `p-851`, `gap-844` o `m-793` son utilidades válidas. El cierre del namespace ya no filtra los usos absurdos.
  - Recomendación, para valorar en una feature futura: sacar las dimensiones (grupo "dimensiones", tokens.css:396-466) a `--container-*` (`max-w-650`, `w-650`) o a variables `--size-*` usadas con `w-(--size-card)`, como sugiere `conventions.md:30`. En `spacing` quedarían solo gaps, paddings y distancias.
  - No bloquea porque el acceptance lo pide así.

- **[Normalizaciones] Confirmadas en homepage.0.txt.**
  - 1320 (`31:46`, `32:82` y `33:98` usan 1320; `w-1322` ×10, `1319` en `16:48` y `1321` en `174:190`), 59→60 (`left-59` ×14, `left-60` ×10) e INVENTORY §1 Layout lo autoriza.
  - 450→447: `29:206` mide 450 con `pb-15`, y las otras 5 cards miden 447 con `pb-19`.
  - 617→616: `33:108` mide 617 y `33:99`/`33:122` miden 616.
  - 142/143→140: `40:388` termina en 7655 + 423 = 8078 y FAQ empieza en 8220, es decir 142. 140 aparece exacto dos veces.
  - Las cuatro son deriva razonable a 1440, por debajo de 3px. Pero 142/143 y 450/617 no aparecen en INVENTORY y el acceptance dice "sin redondeo". Conviene registrar la decisión en `progress/current.md` o `history.md` para que no se discuta en cada sección.

- **[Normalizaciones] `radius-panel = 10` es correcto.**
  - En homepage.0.txt:356 (`31:18`) y :427 (`33:17`) se ve `rounded-[10px]`. El único `rounded-[20px]` son los 12 `Avatar_Circle` de 40px. El "20" del acceptance era un ejemplo equivocado.
  - Corrección de texto en tokens.css:475: el `@usage` dice "bloques oscuros a ancho de contenido (process, showcase)", pero `33:17` (showcase) va a sangre (`left-[-1px] w-[1439px]`). Solo process (`31:18`, 1322) es "a ancho de contenido".

- **[Trazabilidad] Valores de Figma que quedan fuera de la escala sin documentar en el impl.**
  - `h-112` (`16:82`, `31:29`, `40:372`, `38:336`: caja de h2 de 2 líneas) y `h-160` (`29:246`).
  - `w-263` ×6 (envoltorio del eyebrow) y `w-546` (`11:27`).
  - `h-660` (`33:98`), `h-629`/`683`/`659` (columnas del masonry, dependen del contenido) y `h-103` (`41:415`).
  - `h-26` (`16:47`), los anchos de logos (99–168), `w-1329` (`33:118`) y `w-1439` (`33:17`).
  - Todos dependen del contenido o de un asset, así que está bien dejarlos fuera. Falta una línea en la lista de "no van a la escala" del impl.

- **[No verificable offline] Nodos `33:*` (fila abierta de servicios, sacados por MCP de `33:78`).**
  - Tokens afectados: `--leading-service-open` 3.54, `--text-list` 1.29385, `--spacing-17`, `-18`, `-187`, `-318` y `--text-body` (`33:65`).
  - Hay una contradicción: `design/copy/services.md:11-12` asigna el interlineado 3.54 a las "filas cerradas" en estado abierto, pero tokens.css:110 lo asigna al "título de la fila abierta". SEC-SERVICES tiene que resolverlo con `get_design_context` de `33:78` cuando vuelva la cuota.

- **[V5 futuro] Namespaces sin cerrar fuera del acceptance.**
  - Se generó el CSS con `@tailwindcss/node` sobre `global.css`. `duration-150`, `z-10` y `opacity-50` producen CSS, y `check:ds` no los marca.
  - No hay tokens de z-index (V5 "z-index mágico"). Conviene añadir `--z-*` y una regla en `check:ds` antes de que haya secciones con capas (header, masonry, contacto).

- **[V4] Ruido.** El token y el asset (`src/assets/textures/noise.svg`, menos de 0,5 KB y servido como data URI) están bien justificados, porque Figma no exporta el efecto NOISE. Falta calibrar la densidad y la opacidad contra la captura del hero en SEC-HERO. Ya está anotado en el impl.

- **[V2] `--blur-masonry: 2px`.** Viene de `blur-[2px]` sobre `174:190`. SEC-TESTIMONIALS tiene que confirmar si es intencional, como dice el propio token.

## Verificado sin hallazgos

- **V1**: `powershell -NoProfile -ExecutionPolicy Bypass -File ./init.ps1` termina con EXIT 0 (VERDE).
  - check:ds da 252 tokens y 0 errores (193 avisos de tokens sin usar, esperables).
  - check:arch, astro check (0 errores), vitest (4 archivos, 15 tests) y build: todo OK.

- **V2 · más de 25 valores contrastados con homepage.0.txt:**

  | # | Propiedad | Figma (nodo) | Token |
  |---|---|---|---|
  | 1 | tamaño, peso, leading | 160 / 800 / normal (`11:27`) | `text-wordmark` |
  | 2 | tamaño | 40 / 800 (`11:27`) | `text-wordmark-sub` |
  | 3 | tamaño, peso, leading | 60 / 600 / none (`33:118`) | `text-display` |
  | 4 | tamaño, peso | 45 / 500 / normal (`16:82`, `29:246`) | `text-h2` |
  | 5 | tamaño, peso | 45 / 600 (`29:253`, `29:291`) | `text-stat` |
  | 6 | tamaño, peso, tracking | 44 / 700 / -1px (`174:78`) | `text-title-xl` |
  | 7 | tamaño, peso, leading | 40 / 400 / 4.28 (`31:51`) | `text-title-lg` + `leading-service-row` |
  | 8 | tamaño, peso | 28 / 500 (`174:30`, `174:37`) | `text-title` |
  | 9 | tamaño, tracking | 19 / 500 / -0.19px = -0.01em (`174:160`, `174:167`) | `text-title-sm` |
  | 10 | leading | 18 / 600 / 2.23 (`11:41`) | `text-hero-list` |
  | 11 | leading | 18 / 400 / 1.5 (`174:51`) | `text-body-lg` |
  | 12 | leading | 16 DM / 400 / 26px (`174:164`) | `text-answer` |
  | 13 | leading | 11 DM / 400 / 16px (`174:89`) | `text-legal` |
  | 14 | leading | 13 / 400 / 1.5 (`174:199`, `174:216`) | `text-quote` |
  | 15 | peso | 14 DM Light 300 (`41:402`) | `text-role` |
  | 16 | gaps | 2, 5, 10, 12, 15, 16, 20, 21, 24, 26, 30, 38, 40, 50, 51, 61, 80, 120 | todos en la escala |
  | 17 | paddings | p 15/24/36, px 16/20/22/24/40/100, py 12/14/32, pt 9/20/40/60/100, pb 10/15/19/30/80, pl 24, mt 23 | todos en la escala |
  | 18 | radios | 5 ×18, 10 ×5, 16 ×23, 20 ×12, 24 ×1, 90/100/999 | `media`, `field`/`panel`, `card`, `avatar`, `glass`, `pill` |
  | 19 | sombras | 0 6px 8px .04 ×12 y 0 4px 6px .03 ×3 | `shadow-card` y `shadow-card-sm` |
  | 20 | blur | backdrop 20 (`174:75`) y layer 2 (`174:190`) | `blur-glass` y `blur-masonry` |
  | 21 | colores | los 17 hex/rgba de la extracción, incluidos los 4 pares de avatar (bg y fg emparejados por número de usos 5/3/2/2) | todos tokenizados (el separador al 24% es el bloqueante) |
  | 22 | dimensiones | 48, 52, 91, 193, 251, 300, 308, 310, 311, 344, 360, 401, 410, 423, 426, 446, 447, 522, 536, 608, 616, 622, 638, 650, 658, 720 (min-h), 764, 793, 794, 844, 851 | todas aparecen en homepage.0 |

  Distancias de bloque recalculadas:

  | Token | Cálculo |
  |---|---|
  | 45 | 896 − 851 |
  | 140 | 1084 − 944 y 4219 − 4079 |
  | 70 | 4436 − 4366 |
  | 191 | 2912 − 2721 |
  | 65 | 7443 − 7378 y 7655 − 7590 |
  | 68 | 3509 − 3441 |
  | 55 | 114 − 59 |
  | 180 | 5285 − 5105 |
  | 98 | 5383 − 5285 |
  | 78 | 5521 − 5443 |
  | 268 | 6397 − 6129 |
  | 41 | 6585 − 6544 |
  | 167 | 9176 − 9009 |

  Comprobación inversa: todos los tokens `@figma` de espaciado y dimensión tienen su valor en homepage.0 o se obtienen de una resta documentada, salvo los `33:*` de MCP (ver menores).

- **Clamp**: se recalcularon los 13 roles fluidos. Los 13 dan exactamente el mínimo a 375 y el valor de Figma a 1440 (con un error menor de 0,002px).
  - Los mínimos son razonables: wordmark 88 ("Sensei" ExtraBold mide unos 317px y cabe en 343), display 32, h2 30, stat 36, title-xl 32, title-lg 26 y los de 18 → 16.
  - Los roles de 16px o menos son fijos.

- **`container-page`**: compilado con `@tailwindcss/node`, emite `max-width: calc(1320 + 2·gutter)`, `padding-inline: gutter` y media queries a 768, 1024 y 1440.
  - El gutter es 16, 32, 40 o 60 según el breakpoint, así que a 375 quedan 343 de contenido.
  - Entre 1400 y 1439 el contenido mide 1320 con gutter de 40. A 1440 el contenido mide exactamente 1320 con gutter de 60, que coincide con `16:48 left 60`. Por encima de 1440 queda centrado a 1320.
  - `max-w-content` y `max-w-page` existen.

- **Namespaces cerrados** (los 14 del acceptance, más inset-shadow, drop-shadow y text-shadow).
  - `p-13` y `gap-4` no generan CSS. `rounded-lg` tampoco.
  - `p-0`, `inset-0`, `h-px`, `-mt-16`, `w-1/2` y `size-full` sí funcionan.

- **Motion**: duraciones y easings tokenizados. Los 3 keyframes (`marquee`, `badge-spin`, `masonry-down`) están declarados y tienen test.

- **Arrastres de FND-001**:
  - ToneText usa `text-(color:--tone-muted)` y `--tone-strong`, y `tone-on-ink` los cambia a paper-muted y paper.
  - `registry.ts` tiene un único `satisfies`, y `componentFor` lanza un Error descriptivo que cubre `tests/registry.test.ts`.

- **V3**: todavía no hay secciones que renderizar, así que la revisión es estática (no hay capturas con navegador headless). No hay valores que provoquen overflow a 375: el gutter es 16 y los roles grandes son fluidos.

- **V5**: `grep` en `src/` (excluido tokens.css) no encuentra `[...]` arbitrarios, hex, `rgba()`, `client:load`, `any`, `ds-allow` ni `style=` px. El único hex está en el asset `src/assets/brand/sensei-logo.svg`, que es legítimo.

- **V7**: los cambios se limitan a tokens.css, global.css, ToneText, registry, tests, noise.svg, docs/design-system.md, el impl y el estado de la feature, y coinciden con el acceptance.

# Verify DS-001 — vuelta 2
Resultado: VERDE

Fuentes: `design/figma/homepage.0.txt` y assets ya contrastados en la vuelta 1 (Figma MCP sin cuota; no se cuenta como hallazgo).
Revisado contra la sección "## Vuelta 2" de `progress/impl_DS-001.md`.

## Bloqueantes

Ninguno.

- **[V2] Separadores — RESUELTO.**
  - `src/styles/tokens.css:26-27`: `--color-divider: rgba(0, 0, 0, 0.24)` con `@figma imgLine1/imgLine3 stroke black 24% (29:254, 31:54-31:57)`, `@usage` y `@contrast` ≈ #C2C2C2 1.78:1 decorativo. Coincide con el stroke de los SVG de Figma.
  - `tokens.css:23`: el `@usage` de `--color-line` ya no habla de separadores; remite a `divider` y lista los nodos de texto sobre glass. `@figma var:gris` intacto (check:ds sigue validándolo contra `figma-tokens.json`).
  - Compilado con `@tailwindcss/node` sobre `global.css`: `border-divider` y `bg-divider` generan CSS.

## Mayores

Ninguno.

- **`--text-lead` / 35:132 — RESUELTO.** `tokens.css:174`: `@figma 11:25` solamente; el `@usage` indica que 35:132 usa el rol + `leading-none` (20px). `leading-none` compila.
- **Coordenadas absolutas en spacing — RESUELTO.**
  - `--spacing-262` y `--spacing-669` eliminados; `p-262` y `p-669` ya no generan CSS. Sin referencias en `src/` ni `tests/`.
  - `--spacing-169` (`tokens.css:386-387`) documenta que solo vale con header superpuesto y que con header en flujo la distancia es 117 (12 + 40 = 52; 169 − 52 = 117, correcto).
- **`docs/design-system.md` legible — RESUELTO.**
  - "Tipografía · roles" tiene ahora 32 filas, una por rol, con 375 · 1440 · Peso · Leading · Tracking · Familia · Origen · Uso. Contrastadas con la tabla del impl: los 32 valores coinciden (p. ej. title-sm 17/19/500/normal/-0.01em/heading; legal 11/11/400/16px/body).
  - Contenedores: `max-w-content` y `max-w-page` (antes `@content:`/`@page:`).
  - `pnpm docs:ds` es idempotente: dos ejecuciones dan el mismo archivo (md5 `47a4bd04…`), 251 tokens y 18 grupos.

### Revisión de `scripts/gen-design-docs.mjs` y `scripts/lib/tokens.mjs`

- `scripts/` no está versionado (`?? scripts/`), así que no hay diff contra la vuelta 1; se revisó el contenido completo.
- `lib/tokens.mjs:94`: el único cambio es la utilidad mostrada para `container`. `utilityFor` solo lo consume `gen-design-docs.mjs`; `check-design-system.mjs` (mtime 16:11, anterior a la vuelta 2) solo importa `parseTokens`. `parseTokens` y `pick()` se comportan como describe la vuelta 1 del impl.
- `gen-design-docs.mjs:42-66`: solo cambia la presentación (agrupa `--text-x--*` en columnas). No toca ninguna verificación.
- Conclusión: **ninguna verificación queda debilitada**. check:ds sigue exigiendo `@figma`/`@derived` por token, validando `var:` contra Figma y rechazando valores sueltos.

## Menores

- **[Docs] Modificadores huérfanos invisibles.** `gen-design-docs.mjs:54` solo itera los roles base; un `--text-x--line-height` sin su `--text-x` desaparecería del documento sin aviso. Hoy no ocurre (32 roles, todos con base). Sugerencia: listar al final los modificadores sin rol o hacer que check:ds los marque.
- **[V7] El implementer editó `scripts/`**, que CLAUDE.md asigna al orquestador. Lo pidió el verify de la vuelta 1 y el cambio es correcto y acotado; el orquestador debería darlo por bueno de forma explícita.
- **Arrastrados de la vuelta 1, diferidos y sin cambio** (no bloquean):
  - `radius-panel` `@usage` sigue diciendo "process, showcase" (`tokens.css:474-475`); `33:17` va a sangre.
  - Registrar las normalizaciones 142/143→140, 450→447 y 617→616 en `progress/history.md` (orquestador).
  - Escala de 79 valores con dimensiones mezcladas en `spacing`.
  - `--z-*` y cierre de `duration`/`z`/`opacity` antes de SEC-HEADER.
  - Nodos `33:*` y contradicción del leading 3.54 → SEC-SERVICES con MCP.
  - Calibrar ruido (SEC-HERO) y confirmar `blur-masonry` (SEC-TESTIMONIALS).
  - Utilidades de color genéricas `bg-* text-* border-*` en la tabla de Color.
  - `avatar-3` 4.52:1 (AA justo).
- **Aplicado de los menores**: `--color-ink-muted` (`tokens.css:29`) ya lista los 8 nodos del footer (174:29, :36, :43, :49, :53, :54, :56, :58) con la alternativa `line` 10.04:1.

## Verificado sin hallazgos

- **V1**: `powershell -NoProfile -ExecutionPolicy Bypass -File ./init.ps1` → EXIT 0, "VERDE: todo en orden". check:ds 251 tokens · 0 errores; vitest 4 archivos · 15 tests; astro check y build OK.
- **Regresiones**: ninguna. El conteo pasa de 252 a 251 (−262, −669, +divider). Los tests de contrato de tokens siguen en verde. Utilidades clave compiladas (`p-169`, `max-w-content`, `leading-none`).
- **V3**: sin secciones todavía; revisión estática, sin cambios respecto a la vuelta 1.
- **V5**: grep en `src/` (sin tokens.css) de `[0-9#]` arbitrarios, hex, `rgba(`, `client:load`, `any` y `ds-allow`: 0 coincidencias.
- **V7**: los cambios se limitan a `tokens.css`, los dos scripts, `docs/design-system.md` regenerado y el impl.
