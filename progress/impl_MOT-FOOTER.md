# impl MOT-FOOTER — Footer: carrusel curvo de imágenes en rueda

Vuelta 1. El Figma MCP no está disponible: se partió del layout de SEC-FOOTER, cuyos tokens
`--footer-card-*` ya se habían verificado contra 174:67-174:70, y de `design/figma/homepage.0.txt`
(líneas 963-990). `design/references/` no tiene referencia del footer. Hay que confirmarlo en Figma
cuando haya acceso, aunque la composición estática no cambia.

## Cómo funciona

- Un círculo de mínimos cuadrados (método de Kåsa) se ajusta a los centros de las 4 tarjetas de
  Figma. El pivote queda en (661.8, 1069.2) con r ≈ 987.6, en px de Figma relativos a la galería.
  Las tarjetas quedan en los ángulos −26.9°, −4.3°, 16.7° y 36.7° (pasos de ≈ 21°), con radios
  entre 976 y 997.
- Cada tarjeta se describe con una pose polar: ángulo, radio, inclinación propia (giro de Figma
  menos el ángulo) y tamaño. El anillo tiene 7 poses: 2 extrapoladas a la izquierda, las 4 de Figma
  y 1 a la derecha. Las poses ocultas quedan enteras por debajo del borde inferior del footer.
- Cada tarjeta recibe keyframes de `transform` con la misma lista de funciones,
  `rotate() translate(%) rotate() translateY(%) rotate() scale()`, y el navegador interpola ángulo y
  radio por separado. El recorrido es un arco, no una línea quebrada. Las medidas van en % de la
  caja propia, así que valen a cualquier escala de `--footer-gallery-unit` sin volver a medir ni
  recalcular el layout.
- Se crea un bucle `loop()` (Motion, WAAPI) por tarjeta, desfasado con `controls.time`. En t=0 cada
  tarjeta está exactamente en su pose de Figma (transform = identidad, comprobado con un test de
  matrices). Además, cada 7 s la composición vuelve a ser exactamente la de Figma con las imágenes
  desplazadas una posición.
- 6 tarjetas: las 4 de Figma más 2 PLACEHOLDER (`incoming`). Estas solo se pintan mientras la rueda
  existe (`hidden group-data-wheel:block`) y comparten la caja de la tarjeta 1.
- `ENTRY_LEAD = 1.25`: la tarjeta que espera está a 1.25 pasos de la primera. Con 1 paso asomaba
  una esquina amarilla en la composición inicial, que se vio en el navegador. Ese tramo es ≈ 17 % más
  rápido que el siguiente y pasa casi todo oculto. El salto de fin de vuelta (última pose → primera)
  ocurre entero por debajo del footer.
- Autoplay: `createAutoplay` + `bindAutoplay` con hover (ratón), pestaña oculta
  (`visibilitychange`), fuera de viewport y reduced motion. El foco no pausa porque las tarjetas no
  son enfocables.
- WCAG 2.2.2: hay un botón de pausa (`aria-pressed`, iconos pausa/play) que solo se ve con foco de
  teclado (`opacity-0 focus-visible:opacity-100`, `pointer-events-none` mientras no tiene foco). Así
  no altera el Figma. Con ratón, el hover ya pausa.
- Sin JS o con `prefers-reduced-motion`: no hay animaciones ni botón, y las tarjetas extra están
  ocultas. Queda la composición estática de Figma. Si reduced motion se activa en caliente, las
  animaciones se cancelan (`cancel()`) y vuelve la composición de Figma, no una pose congelada.
- Las imágenes siguen decorativas: el escenario lleva `aria-hidden="true"` y `alt=""`.

## Archivos

- `src/layout/footer-wheel.ts` (nuevo): lógica pura (fitCircle, toPolar, buildRing, wheelTransform, toCss, ringKeyframes, phaseMs, readStepMs, parseRotate).
- `src/layout/FooterWheel.svelte` (nuevo): isla que mide las cajas, crea los bucles, conecta el autoplay y el botón de pausa.
- `src/layout/Footer.astro`: la galería pasa a la isla (`client:visible`); 6 tarjetas con `data-wheel-slot`; `<Picture>` recortado a 606×496 (`fit="cover"`) por las placeholder apaisadas.
- `src/core/site.ts`: `FooterGalleryCard` y `FooterGallery` (cards, incoming, pauseLabel, pauseIcon, playIcon).
- `src/content/site.ts`: galería con 4 tarjetas de Figma + 2 `incoming` marcadas `// PLACEHOLDER` y `placeholder: true`; copy del botón.
- `src/assets/footer/wheel-pause.svg`, `wheel-play.svg` (nuevos): copia de los iconos de pausa/play del showcase.
- `src/styles/tokens.css`: token `--duration-footer-wheel-step`.
- `docs/design-system.md`: regenerado (`pnpm docs:ds`).
- `tests/footer-wheel.test.ts` (nuevo): 11 tests de geometría y bucle.
- `tests/site.test.ts`: contrato nuevo de la galería y de las placeholder.

## Tokens

- `--duration-footer-wheel-step: 7s` `@derived`: un paso de ≈ 21° (≈ 360px a 1440 → ≈ 51px/s, al
  ritmo del showcase). La vuelta completa son 6 pasos (42 s). Un test lo compara con
  `WHEEL_STEP_FALLBACK_MS`.
- No hay medidas nuevas de Figma: posiciones, tamaños y giros salen en tiempo de ejecución de los
  tokens `--footer-card-*` existentes (se leen con `getComputedStyle`). Los tests evalúan esos mismos
  tokens.

## Responsive inferido

- Se mantiene la escala de SEC-FOOTER: la galería se escala entera con `--footer-gallery-unit`
  (0.5 a 375, 1 a 1440). Como los keyframes van en % de la caja propia y en grados, la rueda es la
  misma a cualquier ancho.
- No hay recorte horizontal en el escenario. Por encima de 1440, las tarjetas entran y salen por
  los márgenes (comprobado a 1920). Las poses ocultas están por debajo del footer, que tiene
  `overflow-clip`.

## Comprobación en navegador

Chrome headless propio, con `--user-data-dir` temporal y cerrado solo por su PID, sobre `dist/client`
servido por un servidor estático propio (también cerrado).

- 1440: a los 50 ms, composición idéntica a Figma y sin esquinas extra; a los 3.5 s, girando en arco.
- 375 y 1920: giran correctamente.
- Reduced motion: 0 animaciones, extras con `display:none`, sin botón y composición de Figma.

## Pendiente / a confirmar

- PLACEHOLDER: las 2 imágenes `incoming` son capturas de proyectos (`project-gallery/*-laptop.png`); hay que sustituirlas por piezas reales de la galería.
- Mientras gira, el radio de 16px se escala con la tarjeta: ≈ 14.3px en las tarjetas pequeñas y exacto en reposo en cada pose propia. Las inclinaciones se interpolan entre las de Figma (bamboleo leve).
- Validar en Figma (MCP) cuando haya acceso.

## init.ps1

VERDE: toolchain, install, estado, check:ds (408 tokens, 0 errores), check:arch (80 archivos,
0 errores), astro check (0 errores), vitest 23 archivos / 242 tests (tests 631 ms en total; el
archivo nuevo, 25 ms; ningún test se acerca al timeout de 5 s) y build.
