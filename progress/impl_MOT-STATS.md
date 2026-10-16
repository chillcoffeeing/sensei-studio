# impl MOT-STATS — Stats: animaciones de texto y contadores; quitar duración del proceso

Primera vuelta.

## Figma

`get_design_context` de 31:19 y 35:132 devolvió el límite de llamadas del plan Starter de
Figma MCP. La feature no cambia el layout: es motion sobre el marcado actual (ya trazado de
Figma en SEC-STATS / SEC-PROCESS) y una eliminación (la duración no está en Figma: venía de
`design/copy/process.md`). Se siguió sin nuevas medidas de Figma.

## Archivos

- `src/shared/lib/motion/count-up.ts` (nuevo): `parseCount`, `formatCount`, `countAt`, `countUp()` (attachment), `countUpAll()` (para `<script>` de Astro).
- `src/shared/lib/motion/easing.ts` (nuevo): `cubicBezier` (movido desde slider/tween).
- `src/shared/lib/motion/index.ts`: exporta `cubicBezier` y la API de count-up.
- `src/shared/lib/motion/tokens.ts`: `DURATION_TOKENS.count` (`--duration-count`, respaldo 1600).
- `src/shared/lib/slider/tween.ts`: reexporta `cubicBezier` desde motion (la API de slider no cambia; así motion no depende de slider).
- `src/modules/stats/Section.astro`: descripción del aside con `data-reveal` + `reveal-up`; `<dl data-count-up="[data-count]">` y `<span data-count>` en cada cifra; `<script>` con `revealAll()` + `countUpAll()`.
- `src/modules/process/Section.astro`: se quitan el `<p>` de duración y la línea de puntos; el h2 queda solo (su contenedor flex desaparece).
- `src/modules/process/schema.ts`: se elimina `ProcessContent.duration`.
- `src/content/pages/home.ts`: se elimina `duration: 'DURACIÓN: ~4 semanas'`.
- `src/styles/tokens.css`: `--duration-count`.
- `docs/conventions.md`: fila "Cifras que cuentan" en la tabla de motion.
- `docs/design-system.md`: regenerado (`pnpm docs:ds`).
- `tests/motion.test.ts`: tests de parseCount/formatCount/countAt, cubicBezier, reduced-motion, sin IO, cuenta completa con rAF simulado + limpieza, countUpAll con data-*.
- `tests/stats.test.ts`: el "sin isla" pasa a "un solo script que delega en shared/lib/motion"; tests de reveal-up en la descripción y data-count.
- `tests/process.test.ts`: sin `duration` en el contenido, el schema ni el render (ni `border-dotted`).
- `tests/ui-consumption.test.ts`: la aserción del aside admite `data-reveal` y utilidades extra.
- `progress/current.md`: plan.

## Tokens

- `--duration-count: 1600ms`: `@derived`. Más larga que `--duration-reveal` para que se lean las cifras intermedias. Usa `ease-enter` y un escalonado de `--duration-stagger` (200ms) entre métricas.

## Comportamiento

- **Texto**: `reveal-up` (utilidad existente: opacity + translateY, 1s, `ease-enter`) en el contenedor de la descripción. Marca `data-inview` una sola vez. Sin JS o con reduced-motion se ve sin animar (guardas `scripting` / `prefers-reduced-motion` de la utilidad).
- **Contadores**: el HTML del servidor trae `+250`, `+9`, `97%` y `1 punto` (comprobado en `dist/client/index.html`). Con JS y sin reduced-motion, `countUp` pone `+0`, `+0`, `0%` y `0 punto` y cuenta en rAF cuando el `<dl>` entra en viewport (`inView` de Motion, una vez, amount 0.2 por defecto). Al terminar escribe el texto original exacto. Prefijo, sufijo y decimales/separador se conservan. Con reduced-motion, sin IntersectionObserver o sin rAF no toca el DOM. La limpieza restaura los valores finales.
- **Por qué rAF y no `animate`**: lo que cambia es texto, no una propiedad CSS. El `animate` de `motion/mini` (WAAPI) no interpola números, y el `animate` completo de `motion` arrastraría el motor JS. Se reutiliza `cubicBezier` con la curva del token.
- **Responsive**: sin cambios de layout. Las cifras siguen con `whitespace-nowrap` y centradas: el cambio de ancho durante la cuenta no desplaza otros elementos (sin CLS).
- **Tailwind v4**: no hay CSS nuevo. Se usan la utilidad `reveal-up` existente, atributos data-* y el token en `@theme`.

## Pendiente fuera de mi alcance

- `design/copy/process.md:8` aún menciona `DURACIÓN: ~4 semanas` (zona del orquestador).
- No se probó en navegador real: la lógica está cubierta con rAF/inView simulados.

## init.ps1

```
check:ds → 417 tokens · 0 ds-allow · 0 error(es)      [OK]
check:arch → 116 archivos · 11 módulos · 0 error(es)  [OK]
astro check 0 errors                                   [OK]
vitest 489 passed                                      [OK]
astro build                                            [OK]
VERDE: todo en orden.
```
