# impl MOT-TEAM-MOBILE: Equipo en mobile sin desenfoque y slider en autoplay

Primera vuelta.

## Figma

`get_design_context` de 40:388 devolvió el límite de llamadas del plan Starter de Figma MCP. La feature solo cambia el comportamiento, no la maqueta de desktop. Las medidas de 40:388 y 41:399 ya están en `tokens.css` y no cambian. No hacen falta assets nuevos.

## Estado previo comprobado (TeamSlider)

- `src/shared/ui/TeamSlider.astro` ya cumplía la parte del slider, así que no cambié su lógica:
  - Hace autoplay por pasos con `createAutoplay` y `bindAutoplay(el, controller)`, con las mismas opciones por defecto que ShowcaseCarousel.
  - No hay `matchMedia` ni ningún condicionante de breakpoint, así que corre también en mobile y táctil.
  - No hay pausa por hover. MOT-SLIDERS-SHOWCASE quitó la opción `hover`, y la pausa por foco solo salta con foco de teclado (`:focus-visible`), así que un tap no lo detiene.
  - El swipe táctil sigue funcionando: `bindSwipe` usa pointer events con `touch-pan-y`, pausa con `interaction` y reanuda tras `--delay-slider-resume`.
  - Con reduced-motion pausa (`reduced-motion`): no crea clones, el carril queda estático y se desplaza con scroll nativo y snap.

## Archivos

- `src/modules/team/Section.astro`: quité `blur-(--team-photo-blur) scale-(--team-photo-scale) hover-motion:filter-none hover-motion:scale-100` de la foto. Fuera de hover-motion la foto ya no se desenfoca ni escala, y solo la oscurece el velo `bg-(--team-card-veil)` de la capa de detalle. También actualicé el comentario.
- `src/styles/tokens.css`: actualicé las anotaciones `@usage` y `@derived` de `--team-photo-blur`, `--team-photo-scale` y `--team-card-veil`. Los valores no cambian.
- `docs/components.md`: TeamSlider corre en todos los breakpoints, no se pausa con hover, y la foto en táctil no se desenfoca.
- `docs/design-system.md`: regenerado con `pnpm docs:ds`.
- `tests/team.test.ts`: la foto ya no tiene ninguna clase de blur ni de escala por CSS.
- `tests/slider.test.ts`: test nuevo. El script de TeamSlider no tiene `matchMedia` ni condicionantes de breakpoint o hover, y llama a `bindAutoplay(el, controller)` igual que el showcase.
- `progress/current.md`: plan.

## Tokens

No hay tokens nuevos. Solo cambian las anotaciones de los tres tokens del equipo indicados arriba.

## Responsive y decisiones

- **Mobile y sin hover**: la capa de detalle es el estado base (como en MOT-TEAM). Ahora la foto se ve nítida, oscurecida por `--team-card-veil` (rgba(0,0,0,0.3)). Es el "oscurecido ligero" que pide la acceptance.
- **Desktop con hover-motion**: no cambia. `hover.ts` sigue animando el blur y la escala con Motion en hover y en foco visible. Al salir de hover-motion, por ejemplo si se activa reduced-motion, la limpieza quita los estilos en línea y la foto queda nítida.
- **prefers-reduced-motion**: sin animación. Se ve el estado final, que es la capa de detalle con el velo y sin blur, y el carril queda estático.
- **Tailwind v4**: no hay CSS propio. Solo se quitan utilidades.
- **Riesgo**: sin el blur, la bio (`text-paper-soft`) va sobre una foto nítida con un velo del 30%. En zonas claras del retrato el contraste puede bajar. La acceptance pide expresamente que la foto solo se oscurezca ligeramente, así que no subí el velo. Si el verificador lo marca, se puede ajustar `--team-card-veil` o añadir el scrim 41:399 en mobile.

## No verificado

- No lo probé en un navegador o dispositivo táctil real. La cobertura viene de los tests de contrato y del build.

## init.ps1

```
Toolchain, dependencias, estado de feature_list.json   [OK]
Sistema de diseño (check:ds)                            [OK]
Arquitectura (check:arch)                               [OK]
astro check                                             [OK]
vitest                                                  [OK]
astro build                                             [OK]
VERDE: todo en orden.
```
