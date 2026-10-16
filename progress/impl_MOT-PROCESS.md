# impl MOT-PROCESS: entrada escalonada de los 4 pasos

La feature solo añade motion a la sección `process`, que ya existe (SEC-PROCESS). Toda la
lógica viene de las primitivas de MOT-001: no hay lógica nueva, ni tokens nuevos, ni CSS propio.

## Archivos

- `src/modules/process/Section.astro`: cambios en el marcado:
  - `data-reveal="[data-reveal-item]"` en el `<ol>`;
  - `data-reveal-item` y la utilidad `reveal-up` en cada `<li>`;
  - un `<script>` de Astro que solo llama a `revealAll()` de `@/shared/lib/motion`;
  - un comentario que documenta la animación.
- `tests/process.test.ts`: tres cambios.
  - El test "sin isla" ya no prohíbe `<script>`; sigue prohibiendo `.svelte` y `client:`.
  - Test nuevo para el marcado del reveal: un solo `<script>`, que solo delega en la primitiva (sin `motion` directo, sin `IntersectionObserver` y sin `style.`).
  - Test nuevo para los tokens de tiempo: `--duration-reveal: 1s`, `--duration-stagger: 200ms` y `--animate-reveal-up`.
- `feature_list.json`: MOT-PROCESS pasa a `in_progress`.
- `progress/current.md`: plan.

## Tokens

No se agregó ninguno. Se reutilizan estos tokens de MOT-001, todos `@derived`:
- `--duration-reveal` (1s) y `--duration-stagger` (200ms);
- `--ease-enter` y `--motion-distance-reveal` (48px);
- `--animate-reveal-up`.

Como no se tocaron tokens, no hace falta ejecutar `pnpm docs:ds`.

## CSS propio

Ninguno. Se usan solo la utilidad `reveal-up` (`@utility` de MOT-001) y atributos de datos.

## Figma

Los nodos `35:132` (título) y `31:42` (badge) son de la sección que SEC-PROCESS ya implementó.
Figma no define ninguna animación. El MCP de Figma no está disponible en esta sesión (pide
autenticación). El layout no cambia y la especificación de motion sale de los criterios de
aceptación, así que no se tocó ninguna medida.

## Comportamiento

- El `<ol>` entra en viewport (umbral del 20 %). En ese momento `revealAll()` marca `data-inview`,
  y antes ya numeró los `<li>` con `--motion-index` del 0 al 3.
- `reveal-up` anima de `opacity:0; translateY(48px)` a `opacity:1; none`.
  - Duración: 1s. Retraso: `--motion-index × 200ms`. Curva: `--ease-enter`. Relleno: `both`.
  - La animación ocurre una sola vez: `inView` deja de observar tras la primera entrada.
- **Sin JS**: el estado oculto solo existe con `@media (scripting: enabled)`, así que todo se ve.
- **Reduced motion**: la utilidad no aplica ninguna animación y `reveal()` marca `data-inview` al
  instante. Se ve el estado final.

## Responsive

No hay decisiones nuevas. La rejilla sigue igual: 1 columna, 2 desde `md` y 4 desde `xl`. El
escalonado sigue el orden del documento (01 → 04) en todos los breakpoints. En mobile cada paso
entra en el mismo orden mientras se hace scroll, porque el disparo lo hace la lista completa. El
recorrido de 48px es `transform`, así que no afecta al layout.

## Comprobación en navegador

Chrome headless (CDP) sobre `dist/client` del build. El script está en el scratchpad de la sesión,
fuera del repo.

| Comprobación | Resultado |
|---|---|
| Antes de entrar en viewport | `opacity 0`, `translateY(48px)`, `playState paused`, `data-inview` ausente |
| Tiempos de cada animación (`getAnimations()`) | `reveal-up`, duración 1000ms, retrasos 0 / 200 / 400 / 600ms, 1 iteración |
| Secuencia real (rAF desde el scroll) | inicio 34 / 220 / 420 / 620ms · fin 1021 / 1221 / 1421 / 1621ms → 1s por item, +200ms |
| Una sola vez (salir y volver) | los 4 quedan en `1/finished`, sin repetir |
| Layout (`offsetTop`/`offsetHeight` antes y después) | idéntico → la animación no desplaza nada |
| CLS | 0 atribuible a process. La página da 0.0016: un desplazamiento a los 158ms en el header (`NAV`/`SPAN`, carga de fuentes), que ya existía y no tiene que ver con esta feature |
| `prefers-reduced-motion: reduce` | 4 items con `opacity 1`, `transform none`, 0 animaciones |
| Sin JS (`setScriptExecutionDisabled`) | `scripting: enabled` = false; 4 items con `opacity 1`, `transform none`, 0 animaciones |
| Mobile 375 | los 4 items visibles al final del scroll, `scrollWidth` 375 (sin scroll horizontal) |

## Delta de JS

Astro incrusta el script en `index.html` como `<script type="module">` porque es pequeño. Los
chunks de `_astro/` no cambian: siguen siendo 9, con los mismos hashes y 55 909 B.

| | min | gzip | brotli |
|---|---|---|---|
| Chunks `_astro/*.js` (antes = después) | 55 909 B | 23 498 B | 20 786 B |
| Script incrustado nuevo (`revealAll` + `inView` de Motion) | 1 373 B | 715 B | 622 B |
| **Delta** | **+1 373 B** | **+715 B** | **+622 B** |

Coincide con la previsión de MOT-001: `revealAll`, 1 379 B min y 734 B gzip.

## PLACEHOLDER

No aplica: la feature no añade contenido. El copy de los pasos ya viene de `design/copy/process.md`.

## init.ps1

```
[OK] node (v22.20.0) · pnpm (v11.1.3) · pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[OK] tokens anotados, sin valores sueltos, coherentes con Figma
[OK] fronteras de capas y modulos (check:arch, incluidos los <script> de .astro)
[OK] astro check
[OK] vitest
[OK] astro build
VERDE: todo en orden.
```
