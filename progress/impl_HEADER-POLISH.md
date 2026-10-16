# Implementación — HEADER-POLISH

## Archivos creados o modificados

- `feature_list.json`: cambia `HEADER-POLISH` de `pending` a `in_progress`, sin marcarla como terminada.
- `progress/current.md`: registra la feature en curso y el plan de implementación.
- `src/layout/Header.astro`: cambia el padding superior aislado por `py-3` para igualar el espacio superior e inferior.
- `src/shared/ui/CtaBrandShape.svelte`: hace que el puente del CTA ocupe toda la altura de la píldora al fundirse.
- `progress/impl_HEADER-POLISH.md`: documenta el cambio y su verificación.

## Decisiones de implementación

El header usa 12px de padding vertical de Tailwind (`py-3`) alrededor de su fila fija de 40px: la barra resultante mide 64px, con el mismo espacio arriba y abajo. La fila sigue centrando el contenido; el CTA y el control móvil conservan su área táctil de 44px. El header overlay permanece fuera del flujo, sin cambios de composición ni desplazamientos por hidratación.

El puente del efecto compartido ocupa ahora la altura completa del fondo de 40px, al igual que la píldora y el círculo, eliminando el escalón vertical al alcanzar el estado final. Se mantienen la transición de transformación de 450ms y la curva/token existentes; `motion-safe:` hace instantáneo el cambio con `prefers-reduced-motion: reduce`.

El componente se comparte entre el CTA desktop del header, el menú móvil, los CTA de `/links` y los botones de cotización (`QuoteSubmitButton` y `LinksQuoteSelector`), por lo que el ajuste de forma se aplica de manera consistente en todos esos usos.

## Responsive revisado

Medí la geometría en navegador a 375, 768, 1024 y 1440px CSS (el navegador reserva una pequeña franja para su scrollbar):

- En los cuatro anchos el header mide 64px y la fila central mide 40px, situada a 12px del borde superior.
- A 375 y 768px se usa el control móvil: 44px de alto, centrado en la fila.
- A 1024 y 1440px se muestran nav y CTA desktop; sus centros verticales coinciden con el centro de la fila.
- El puente ampliado mantiene 40px de alto, igual que la píldora y el círculo. La duración de transición computada bajo `prefers-reduced-motion` es `0s`.
- No se modificaron breakpoints ni se alteró el apilado mobile-first. El navegador de revisión no expuso un puntero con capacidad hover; la transición hover/foco conserva las variantes existentes y el foco comparte el mismo estado final.

## Tokens y diseño

- Tokens agregados o eliminados: ninguno. Se reutilizan `py-3` de Tailwind y los tokens existentes `--duration-cta-liquid`, `--ease-standard` y `--ease-cta-liquid`.
- Figma: la feature no tiene `figmaNodes`; no se consultó Figma y no hay desviaciones que documentar.

## Verificación

- `./init.ps1`: **VERDE**, exit code 0.
- `check:ds`: 0 errores; `check:arch`: 0 errores.
- `astro check`: 0 errores, 0 warnings y 1 hint.
- `astro build`: OK.

## Vuelta 2

Corrige el bloqueante (cintura de ~3px en hover/foco) y el menor (sobrepaso de ~1px).

- `src/shared/ui/CtaBrandShape.svelte`: el puente deja de ser una cápsula `w-8 rounded-pill`
  centrada y pasa a ser un **rectángulo sin redondeo** a alto completo (`inset-y-0`), anclado en el
  centro del círculo (`right-5` = 20px) con `w-12` (48px): llega a right 68px, más allá de la tapa
  derecha de la píldora (que va de right 45 a right 65, radio 20). Con eso rellena las dos
  concavidades (píldora/puente y puente/círculo) y el estado final es una sola píldora de 40px de
  punta a punta. Se aplica igual en todos los usos (header, menú, /componentes, /links, envío de
  cotización) porque viven en el componente compartido; el foco de teclado usa la misma clase.
- Animación: solo `scale-x` (de `scale-x-0` a `scale-x-100`) con `origin-right`, es decir, el
  puente crece desde el círculo hacia la píldora. El eje Y queda siempre en 1, así que el rebote de
  `ease-cta-liquid` ya no puede sobresalir por arriba ni por abajo (menor corregido). El rebote en
  X (~10%) solo alarga el puente hacia el cuerpo recto de la píldora, que ya está pintado.
- Reduced motion: sin cambios; las transiciones siguen bajo `motion-safe:`, así que el estado final
  es instantáneo.
- Tokens: ninguno agregado ni eliminado (`right-5`, `w-12`, `origin-right`, `scale-x-*` son
  utilidades por defecto de Tailwind).
- `./init.ps1`: **VERDE** (toolchain, estado, check:ds, check:arch, astro check y build OK).
