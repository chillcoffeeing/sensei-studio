# impl MOT-001: infraestructura de motion compartida

Feature sin `figmaNodes` (es infraestructura). No implementa ninguna sección: solo primitivas,
tokens, utilidades, reglas de arquitectura, documentación y tests.

## Archivos

Creados
- `src/shared/lib/motion/index.ts`: API pública y única vía de acceso al paquete `motion`.
- `src/shared/lib/motion/types.ts`: `Attachment` (`(node) => Cleanup`) y `Cleanup`.
- `src/shared/lib/motion/tokens.ts`: lee desde CSS los tokens de duración y curva (`durationMs`, `ease`, `parseDuration`, `parseCubicBezier`).
- `src/shared/lib/motion/reduced-motion.ts`: `prefersReducedMotion`, `onReducedMotionChange`.
- `src/shared/lib/motion/stagger.ts`: `staggerDelay`, `staggerStyle`, `assignStaggerIndexes`, `MOTION_INDEX`.
- `src/shared/lib/motion/reveal.ts`: `reveal()` / `revealAll()` (IntersectionObserver a través de `inView` de Motion; se dispara una sola vez).
- `src/shared/lib/motion/expand.ts`: `setOpen`, `entrySide`, `markEntrySides` (acordeón y entrada lateral).
- `src/shared/lib/motion/typewriter.ts`: `createTypewriter`, `typewriter`, `splitGraphemes`, `typedCount`.
- `src/shared/lib/motion/autoplay.ts`: `createAutoplay`, `bindAutoplay` (motivos de pausa).
- `src/shared/lib/motion/animate.ts`: `animateTo`, `loop`, `sequence` (`motion/mini`, WAAPI).
- `tests/motion.test.ts`: 20 tests de las primitivas (lógica pura y dobles mínimos de DOM).
- `tests/check-architecture.test.ts`: 3 tests de la regla que restringe dónde se importa `motion` en `check:arch`.

Modificados
- `package.json`, `pnpm-lock.yaml`: dependencia `motion@^13.5.0`.
- `src/styles/tokens.css`: tokens de motion (ver abajo) y keyframes `reveal-up/-left/-right`.
- `src/styles/global.css`: `@custom-variant inview`, `@utility reveal-*`, `enter-from-*`, `enter-from-side`, `collapsible`, `stack-layers`.
- `scripts/check-architecture.mjs`: añade `PACKAGE_GATES` (motion, motion-dom y motion-utils solo en `src/shared/lib/motion/`) y `FORBIDDEN_PACKAGES` (react, react-dom, framer-motion, motion/react). Además, ahora analiza los `<script>` del cuerpo de los `.astro`.
- `docs/conventions.md`: sección **Motion** (qué herramienta usar, reglas y patrones).
- `docs/architecture.md`: añade `shared/lib/motion` y la regla de dependencias restringidas.
- `docs/design-system.md`: regenerado con `pnpm docs:ds`.
- `feature_list.json` (MOT-001 pasa a in_progress) y `progress/current.md` (plan).

## Dependencia nueva: `motion` (justificación)

La añade una decisión del usuario. Solo se usa la API vanilla: `inView` de `motion`, y `animate` /
`animateSequence` de `motion/mini` (WAAPI, sin motor de springs). Por dentro, `motion` reexporta
`framer-motion/dom`, que es código DOM sin React; `react` no se instala. `check:arch` impide
importar `motion` fuera de `src/shared/lib/motion/` y prohíbe `framer-motion`, `motion/react` y
`react` en todo `src/`.

## API de las primitivas (`@/shared/lib/motion`)

Todas tienen la misma forma, la de un attachment de Svelte 5: `(node) => cleanup`. En una isla
se usan como `{@attach x(opts)}` y en un `<script>` de Astro como `x(opts)(el)`.

| Primitiva | Firma | Uso |
|---|---|---|
| `reveal` | `reveal({ items?, amount = 0.2, margin? }): Attachment` | Marca `data-inview` al entrar en viewport (una vez) y numera los `items` con `--motion-index`. |
| `revealAll` | `revealAll(root = document, selector = '[data-reveal]'): Cleanup` | Secciones sin isla; `data-reveal="<selector de items>"`. |
| `staggerStyle` | `staggerStyle(i): string`, devuelve `"--motion-index: i"` | Fijar el índice en el marcado. |
| `staggerDelay` | `staggerDelay(i, stepMs, startMs = 0): number` | Calcular retrasos en secuencias hechas en JS. |
| `setOpen` | `setOpen(panel, open)` | Pone o quita `data-open` en un `collapsible`. |
| `markEntrySides` | `markEntrySides(container, itemSelector): Side[]` | Asigna `data-side` y el índice según la posición real de cada elemento (rejillas responsive). |
| `entrySide` | `entrySide(itemBox, containerBox): 'left' \| 'right'` | Lógica pura que usa `markEntrySides`. |
| `createTypewriter` | `createTypewriter(node, { charMs?, delayMs? })`, devuelve `{ play(): Promise, reset, finish, destroy }` | Hover de team (`play` al entrar, `reset` al salir). |
| `typewriter` | `typewriter(opts): Attachment` | Escribir el texto al montar el nodo. |
| `createAutoplay` | `createAutoplay(Playable \| (playing) => void, initial?)`, devuelve `{ playing, userPaused, has, pause(r), resume(r), toggleUser(), subscribe }` | Carrusel y rueda. |
| `bindAutoplay` | `bindAutoplay(node, ctrl, { hover, focus, visibility, offscreen, reducedMotion })`, todas activas por defecto; devuelve `Cleanup` | Conecta las pausas a los eventos del DOM. |
| `animateTo` | `animateTo(target, keyframes, { duration = 'image', ease = 'enter', delayMs }): Controls` | Imágenes (blur, escala). |
| `loop` | `loop(target, keyframes, { durationMs }): Controls \| null` | Bucles lineales infinitos. |
| `sequence` | `sequence(definition): SequenceControls` | Secuencias orquestadas (projects). |
| `durationMs` / `ease` | `durationMs('reveal')`, `ease('enter')` | Tiempos y curvas de los tokens, leídos desde JS. |
| `prefersReducedMotion` / `onReducedMotionChange` | | Consultar la preferencia y seguir sus cambios. |

Utilidades CSS (`global.css`):
- `reveal-up | reveal-left | reveal-right`: la animación se queda en pausa en su primer fotograma
  hasta que aparece `[data-inview]`. Retraso: `--motion-index × --duration-stagger`.
- `enter-from-left | enter-from-right | enter-from-side`: se activan cuando el ancestro pasa a
  `[data-open]`. Retraso: `--motion-index × --duration-stagger-tight`.
- `collapsible`, `stack-layers` y la variante `inview:`.

Con prefers-reduced-motion activo, cada primitiva hace lo siguiente:
- las utilidades no animan ni ocultan nada;
- `reveal` marca `data-inview` al instante;
- `typewriter` no toca el DOM;
- `animateTo` usa duración 0;
- `loop` devuelve `null`;
- `sequence` llama a `complete()` y salta al estado final;
- `bindAutoplay` añade la pausa `reduced-motion` y sigue los cambios de la preferencia.

## Tokens agregados (todos `@derived`)

| Token | Valor | Origen |
|---|---|---|
| `--duration-reveal` | `1s` | Decisión del usuario (MOT-PROCESS). |
| `--duration-stagger` | `200ms` | Decisión del usuario (MOT-PROCESS). |
| `--duration-expand` | `450ms` | Expansión de acordeón (MOT-ACCORDIONS). |
| `--duration-enter` | `600ms` | Entrada lateral dentro de un panel abierto. |
| `--duration-stagger-tight` | `70ms` | "Escalonado ligero" que pide MOT-ACCORDIONS. |
| `--duration-typewriter-char` | `35ms` | Ritmo del typewriter (≈28 caracteres/s). |
| `--duration-image` | `600ms` | Transiciones de imagen (team, projects). |
| `--ease-enter` | `cubic-bezier(0.19, 1, 0.22, 1)` | Entradas (expo-out). |
| `--ease-expand` | `cubic-bezier(0.65, 0, 0.35, 1)` | Expansión (in-out simétrico). |
| `--motion-distance-reveal` | `48px` | Recorrido vertical de reveal-up. |
| `--motion-distance-slide` | `40px` | Recorrido de las entradas laterales. |
| `--animate-reveal-up/-left/-right` | `reveal-* var(--duration-reveal) var(--ease-enter) both` | Utilidades reveal-*. |
| `--animate-enter-from-left/-right` | `reveal-* var(--duration-enter) var(--ease-enter) both` | Utilidades enter-from-*. |

`tokens.ts` guarda valores de respaldo para SSR y tests; un test comprueba que coinciden con
`tokens.css`.

## Decisiones

- **CSS y Tailwind primero.** Reveal, expansión y entrada lateral son utilidades. El JS solo pone
  atributos (`data-inview`, `data-open`, `data-side`) y `--motion-index`. Motion queda para
  imágenes, bucles y secuencias.
- **Por qué hay CSS propio.** Las utilidades de `global.css` son `@utility` de Tailwind v4.
  Tailwind no trae utilidades nativas para tres cosas que hacen falta:
  - pausar `animation-play-state` según un atributo del ancestro;
  - animar `grid-template-rows` 0fr↔1fr con `visibility` diferida;
  - apilar capas en la misma celda.

  `reveal-*` y `enter-from-*` son utilidades funcionales (`--value(--animate-…-*)`), así no se
  repiten bloques.
- **Progressive enhancement.** El estado oculto inicial solo existe bajo
  `@media (scripting: enabled)`. Sin JS, todo el contenido se ve y `collapsible` queda abierto. Un
  navegador que no conoce la media query `scripting` no anima, pero muestra el contenido.
- **Sin CLS.** Las entradas usan `transform`. El typewriter deja debajo el texto completo en
  transparente: reserva el espacio y es lo que leen los lectores de pantalla; la capa que se
  escribe encima es `aria-hidden`.
- **Excepciones a "solo transform/opacity".** `collapsible` anima `grid-template-rows` porque lo
  exige MOT-ACCORDIONS y el cambio de alto lo inicia el usuario. `animateTo` admite `filter` para
  el blur de team. Ambas están documentadas en `docs/conventions.md`.
- **Autoplay basado en motivos de pausa** (un Set): la pausa que pide el usuario se mantiene
  aunque entre y salga el hover o el foco. El hover ignora `pointerType: touch`. También se pausa
  fuera del viewport y con la pestaña oculta.
- **`motion/mini` en lugar del `animate` híbrido.** WAAPI basta para transform, opacity y filter,
  y pesa menos.
- **Responsive.** No aplica de forma directa porque esta feature no tiene layout.
  `markEntrySides` mide en el momento de abrir, así el lado de entrada sigue a la rejilla en cada
  breakpoint.
- **PLACEHOLDER.** No aplica: esta feature no tiene contenido.
- **`check:arch` lee también los `<script>` de los `.astro`** (antes solo leía el frontmatter).
  Así la restricción de `motion` no se puede saltar desde un script de cliente.

## Peso JS

Build antes y después (`dist/client/_astro/*.js`):

| | min | gzip | brotli |
|---|---|---|---|
| Antes | 55 909 B | 23 339 B | 20 786 B |
| Después | 55 909 B | 23 339 B | 20 786 B |
| **Delta** | **0 B** | **0 B** | **0 B** |

El delta es 0 porque ninguna sección usa todavía las primitivas y todo el código se elimina por
tree-shaking (los mismos 9 chunks con los mismos hashes). Coste previsto cuando se usen, medido
con esbuild minificado por punto de entrada:

| Uso | min | gzip |
|---|---|---|
| `revealAll` (MOT-PROCESS) | 1 379 B | 734 B |
| `setOpen` + `markEntrySides` (MOT-ACCORDIONS) | 427 B | 294 B |
| `createTypewriter` (MOT-TEAM) | 2 036 B | 1 001 B |
| `createAutoplay` + `bindAutoplay` + `loop` (MOT-SHOWCASE/FOOTER) | 10 579 B | 4 199 B |
| `animateTo` + `sequence` (MOT-PROJECTS/TEAM) | 14 069 B | 5 783 B |
| Todas las primitivas | 18 951 B | 7 751 B |

Si varias islas usan `motion/mini`, el bundler lo agrupa en un chunk común. Los usos que solo
necesitan CSS (expansión, entrada lateral con lado fijo) no envían JS de motion.

## init.ps1

```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
check:ds → 380 tokens · 0 ds-allow · 0 error(es)            [OK]
check:arch → 75 archivos · 11 módulos · 0 error(es)         [OK]
astro check → 0 errors                                       [OK]
vitest → 20 archivos, 190 tests passed                       [OK]
astro build                                                  [OK]
VERDE: todo en orden.
```
