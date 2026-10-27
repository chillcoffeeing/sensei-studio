# Verify DOCS-INTO-CODE — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V7] `src/shared/ui/LinkNav.astro:15`: queda el comentario de plantilla `{/* Figma 11:28-11:30: enlace del nav principal sobre ink, 18px paper → brand en hover. */}`, con una medida de Figma ("18px"). La cabecera nueva (líneas 2-3) ya dice lo mismo. Esperado: quitar esa línea o dejarla sin la medida.
- [V7] Fuera del alcance literal de la acceptance (que nombra .astro/.svelte de shared/ui y los index de lib), quedan ids de features en comentarios: `src/shared/lib/motion/autoplay.ts:5` (MOT-SLIDERS-SHOWCASE), `src/shared/lib/slider/clone-hover.ts:1` (TEAM-CARD-LOOP) y `src/shared/ui/team-profiles.ts:1` (TEAM-V2). Se pueden limpiar en una pasada posterior.

## Verificado sin hallazgos
- **V1**: `./init.ps1` → VERDE (toolchain, dependencias, estado, check:ds, check:arch, astro check y build de 9 páginas).
- **Solo comentarios**: un script compara los 58 archivos de `git diff --name-only -- src` con HEAD después de quitar comentarios (`//`, `/* */`, `{/* */}`, `<!-- -->`) y espacios. Los 58 son idénticos, así que no cambia el marcado, las clases, los tipos ni la lógica. Los únicos archivos sin seguimiento en src/ (`src/content/not-found.ts`, `src/pages/404.astro`) son de la feature de despliegue anterior (history.md:755) y no de esta.
- **Cabeceras**: los 46 .astro/.svelte de `src/shared/ui/` tienen un comentario de cabecera. Están el JSDoc de las excepciones de API (`titleClass` en SectionHeader), los contratos (`data-head-part`/`head-parts:`, `data-quote-open` en LinkNav) y las reglas del hover de CtaBrandShape.
- **Sliders**: ShowcaseCarousel (continuo), TeamSlider (por pasos, motivo `pointer`) y StepperSlider (pasos solo con JS por debajo de md), además de `shared/lib/slider/index.ts`. Documentan el bucle o los pasos, el swipe, el autoplay, los motivos de pausa, que el hover no pausa, APG y el comportamiento sin JS.
- **Motion**: `shared/lib/motion/index.ts` recoge las 6 reglas (solo transform/opacity con la excepción de collapsible, reduced-motion = estado final, `scripting: enabled`, una sola vez, lo que se mueve se pausa, tiempos desde tokens). También documenta la API declarativa de reveal: `data-reveal`, `-amount`, `-margin`, `reveal-delay-*`, `head-parts:` y no anidar.
- **Barra flotante y modales**: FloatingBar, ModalDialog, QuoteDialog, quote-form, AdviceDialog y advice-form documentan `data-floating-bar-avoid` (25 % inferior, inert), `data-quote-open`, `data-advice-open`, `data-quote-services`, el destino sin JS `/#contacto`, el endpoint PENDIENTE y `?cotizacion-simulada` / `?asesoria-simulada`.
- **Referencias borradas**: `grep -rnE "_archive|INVENTORY|design/figma|design/copy|design/placeholders" src` no da resultados.
- **Estilo**: los comentarios están en español y son concisos. No hay historial de features en los archivos tocados. Los "44px" que quedan explican el área táctil y los px de CtaBrandShape explican la geometría del hover; no son medidas copiadas de Figma.
- **V3–V6**: no aplican porque no hay cambios de comportamiento ni de estilos. No se tomaron capturas.
