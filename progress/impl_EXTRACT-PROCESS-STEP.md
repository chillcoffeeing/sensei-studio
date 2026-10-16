# impl EXTRACT-PROCESS-STEP — Paso del proceso en componente propio

Refactorización sin cambio visual ni de comportamiento (regla 5 de `docs/conventions.md` › Librería de componentes).

## Archivos
- `src/modules/process/ProcessStep.astro` (nuevo): el `<li>` del paso (barra de progreso, número/%, h3, texto), prop única `step: ProcessStep`. Conserva `data-reveal-item` + `reveal-up`.
- `src/modules/process/Section.astro`: importa el componente; el `<ol>` solo hace `steps.map((step) => <ProcessStep step={step} />)`. Comentario de cabecera ajustado.
- `docs/components.md` › Fuera de la librería: la fila del paso apunta al archivo nuevo y justifica por qué queda en el módulo.
- `docs/architecture.md`: mapa regenerado por `check:arch` (process: 4 archivos).
- `feature_list.json` (→ in_progress), `progress/current.md` (plan).

## Dónde vive y por qué
En el módulo, no en `shared/ui`: un solo uso, tipado con el dominio (`ProcessStep` de `schema.ts`) y ya catalogado como "Fuera de la librería". Por eso no entra en `/componentes` ni en `ui-catalog.ts`. El `revealAll()` de la sección sigue encontrando los `[data-reveal-item]` (mismo DOM).

## Tokens
Ninguno agregado ni quitado. Sin responsive nuevo (mismas clases).

## Prueba de no-cambio
`astro build` antes y después; `diff -rq` de `dist/client` completo (incluidos `index.html`, `componentes/index.html`, CSS y JS): **idéntico byte a byte**. Mismo HTML ⇒ mismo resultado a 375/768/1024/1440, motion y reduced-motion.

## init.ps1
VERDE: toolchain, estado (1 in_progress), check:ds 0 errores, check:arch 0 errores (122 archivos, 11 módulos), astro check 0 errores, astro build OK.
