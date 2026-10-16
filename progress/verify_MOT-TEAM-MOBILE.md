# Verify MOT-TEAM-MOBILE — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V6] Contraste de la bio sobre la foto nítida. `src/styles/tokens.css:41` (`--color-paper-soft`) dice "@contrast ... sobre la foto con velo team-card-veil se mantiene por encima de 4.5:1". He medido la zona de la bio de `natalia-reina.jpg` (recorte 688×846, x 48–496, y 526–786, velo 0.3 y texto paper al 72%). Sin blur, la mediana queda en 7.1:1, pero el 30% de los píxeles está por debajo de 4.5:1 (mínimo 2.6:1). Con el blur anterior, el 26% ya estaba por debajo (mínimo 2.8:1). La regresión es pequeña y el problema ya existía. La acceptance pide expresamente "solo oscurecer ligeramente", así que no bloquea. Propuesta: corregir la anotación @contrast para que refleje la medida real. Si se quiere garantizar AA, se puede añadir en mobile un scrim inferior (41:399, `--team-card-scrim`) bajo el bloque nombre+bio, o subir `--team-card-veil`.
- [V3] No hay prueba visual en navegador ni en dispositivo táctil (revisión estática). Queda pendiente comprobarlo en un dispositivo real.

## Verificado sin hallazgos
- **V1**: `./init.ps1` da VERDE y código 0 (lo ejecuté yo): check:ds, check:arch, astro check, vitest y build.
- **V2**: la feature no cambia la maqueta ni los tokens de valor de 40:388. Solo quita las utilidades `blur-(--team-photo-blur) scale-(--team-photo-scale) hover-motion:*` de la foto (`src/modules/team/Section.astro:84-97`). La card (344×423, gap 21, inset) sigue con los mismos tokens. No pedí `get_design_context` otra vez porque no hay medidas nuevas que comparar (el implementer chocó con el límite del plan de Figma MCP).
- **Mobile sin blur**: la foto no tiene ninguna clase de filtro ni de escala. El blur y la escala solo los aplica `hover.ts` con Motion dentro de `TEAM_HOVER_MEDIA` (`(hover: hover) and (prefers-reduced-motion: no-preference)`), y el `pointerenter` táctil se ignora. Fuera de esa consulta, el estado base es la capa de detalle con `bg-(--team-card-veil)` (rgba(0,0,0,.3)), que es el "oscurecido ligero" que pide la acceptance. Al dejar de cumplirse la consulta, la limpieza cancela las animaciones y quita `filter` y `transform` en línea.
- **Autoplay en todos los breakpoints**: `src/shared/ui/TeamSlider.astro` no tiene `matchMedia` ni condiciones de breakpoint. `bindAutoplay` (`src/shared/lib/motion/autoplay.ts:120`) solo pausa por foco de teclado, pestaña oculta, fuera de viewport y reduced-motion. No hay pausa por hover y un tap no la provoca.
- **Swipe táctil**: `bindSwipe` con `touch-pan-y`, `touch-pinch-zoom` y pausa `interaction` con reanudación, todo sin cambios. Lo cubren `tests/slider.test.ts:249-259` y el nuevo test sin hover.
- **prefers-reduced-motion**: el autoplay se pausa con `reduced-motion`, no se crean clones, el carril queda estático con snap nativo y la card muestra el estado final, con el velo y sin animación.
- **V4**: no hay assets nuevos y los existentes (`natalia-reina.jpg`, `member-photo-placeholder.jpg`, `plus.svg`) siguen en su sitio.
- **V5**: no hay hex, valores arbitrarios `[..]`, `client:load`, `any`, `ds-allow` ni imports entre módulos en los archivos tocados. Tailwind v4 sin CSS propio, porque solo se quitan utilidades.
- **V6**: se mantienen la estructura ARIA (region, group, roledescription, slideLabel), el foco visible y aria-hidden en los duplicados y los huecos decorativos.
- **V7**: el alcance es correcto. Los cambios están en Section.astro de team, en las anotaciones de tokens.css (sin cambiar valores), en docs/components.md, en design-system.md regenerado y en los tests team y slider.
