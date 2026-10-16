# Verify EXTRACT-SERVICE-ROW — vuelta 1
Resultado: VERDE

Revisión acotada (refactorización sin cambio visual ni de comportamiento).

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
(ninguno)

## Verificado sin hallazgos
- **V1 init.ps1**: VERDE, ejecutado por el verifier (toolchain, dependencias, estado con 1 in_progress, check:ds, check:arch, astro check, astro build).
- **HTML renderizado equivalente**: se extrajo `progress/build-before_EXTRACT-SERVICE-ROW.tar.gz` y se comparó con el `dist/client` actual.
  - `index.html`: idéntico tras normalizar el hash `ServicesAccordion.*.js`.
  - `componentes/index.html`: idéntico byte a byte.
  - Manifiesto md5 (260 archivos): solo cambian `_astro/ServicesAccordion.*.js` (DOKN4wbX → DCfPJJsG) e `index.html` (por la referencia al chunk). CSS, `accordion-controller.svelte.*.js` y el resto de archivos son idénticos.
- **Comportamiento con navegador (Chrome headless + CDP, con su propio user-data-dir y su PID cerrado)**: se ejecutó el mismo guion sobre los dos builds, servidos estáticamente. Los dos JSON de resultados son **idénticos**:
  - Al cargar, la fila 0 está abierta (`aria-expanded` true,false,false,false; `data-open` igual; punto lima y `font-semibold` solo en la 0). `aria-controls` apunta a un panel existente en las 4 filas. No hay `enter-from-side` antes de interactuar.
  - Al hacer clic en la fila 1, esa fila se abre y la 0 se cierra. Aparecen `enter-from-side` y `data-side` left/right. El alto del panel pasa a 358 y los demás quedan en 0. Un segundo clic cierra todas las filas y `leading` vuelve a `md:leading-service-row`.
  - Teclado (teclas reales): ArrowDown 0→1→2, End→3, ArrowDown hace wrap a 0, Home→0, ArrowUp hace wrap a 3. Enter abre la fila 3 y Space la cierra. El foco se mantiene en el trigger.
  - `collapsible`: con motion la transición es `grid-template-rows 0.45s …, visibility 0s linear 0.45s`. Con `prefers-reduced-motion: reduce` la transición queda anulada, igual en los dos builds.
  - Sin errores ni warnings en la consola.
- **V3 Responsive 375/768/1024/1440**: la geometría de la sección y de las filas es idéntica antes y después. Las capturas PNG de los dos builds coinciden byte a byte en los 4 anchos.
- **`{#each}` sin marcado inline**: `src/modules/services/ServicesAccordion.svelte:32-34` solo contiene `<ServiceRow {acc} {index} … />`.
- **Ubicación**: `src/modules/services/ServiceRow.svelte`, en el módulo y no en `shared/ui`. Se justifica porque tiene un solo uso y está tipada con `AccordionService`. Está documentada en `docs/components.md:591` (Fuera de la librería). Como no va a `shared/ui`, no corresponde entrada en `ui-catalog.ts`. `docs/architecture.md:122` está regenerado.
- **Alcance**: los archivos modificados después de la feature anterior son solo `src/modules/services/{ServiceRow.svelte, ServicesAccordion.svelte, accordion.ts}`, `docs/components.md` y `docs/architecture.md`. `AccordionIcon` solo se usa dentro del módulo y `index.ts` no se tocó.
- **V5–V7**: en los dos componentes no hay valores arbitrarios `[…]`, hex, `client:load`, `any` ni `ds-allow`. No se agregaron ni quitaron tokens.
