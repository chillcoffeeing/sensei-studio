# Verify EXTRACT-PROCESS-STEP — vuelta 1
Resultado: VERDE

Revisión acotada (refactorización sin cambio visual): init.ps1, equivalencia del render, sección sin marcado inline, ubicación/documentación del componente y alcance.

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
(ninguno)

## Verificado sin hallazgos
- [V1] `./init.ps1` VERDE: toolchain, 1 feature in_progress, check:ds, check:arch, astro check y astro build OK.
- [V2/V3 equivalencia] Prueba independiente: copia del repo en el scratchpad con el `<li>` reinsertado inline en `Section.astro` (sin `ProcessStep.astro`), `astro build` y comparación con el build actual. `dist/client` completo (CSS, JS, assets) idéntico; `index.html` y `componentes/index.html` solo difieren en los `uid` aleatorios de `astro-island`, y al normalizarlos el contenido coincide. Mismo DOM y mismas clases, así que el resultado a 375/768/1024/1440 es el mismo, también para motion (`data-reveal-item` + `reveal-up`, `revealAll()` acotado a `[data-process-section]`) y reduced-motion.
- Sección: `src/modules/process/Section.astro:46` solo hace `steps.map((step) => <ProcessStep step={step} />)`. No queda marcado de paso inline.
- Ubicación: `src/modules/process/ProcessStep.astro`, en el módulo y no en `shared/ui`. La justificación es correcta: un solo uso, tipado con el dominio (`ProcessStep` de `schema.ts`). Está documentado en `docs/components.md:590` (Fuera de la librería). Al no estar en `shared/ui`, no corresponde añadirlo a `ui-catalog.ts` y no se añadió. `index.ts` no lo exporta (es interno al módulo). `docs/architecture.md:120` está regenerado (process: 4 archivos).
- [V5–V7] En `src/modules/process/*.astro` no hay valores arbitrarios `[..]`, hex, `client:load` ni `ds-allow`. El `style` de ancho dinámico ya existía antes. Tokens sin cambios.
- Alcance: después de cerrarse COPY-PROJECT-BUTTON solo cambiaron `ProcessStep.astro`, `Section.astro`, `docs/components.md` y `docs/architecture.md` (generado). Los demás archivos recientes son anteriores y pertenecen a COPY-PROJECT-BUTTON.
