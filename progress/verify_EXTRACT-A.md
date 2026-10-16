# Verify EXTRACT-A — vuelta 1
Resultado: VERDE

## Bloqueantes

Ninguno.

## Mayores

Ninguno.

## Menores

- [doc] `docs/architecture.md:153`: el mapa generado por `check:arch` pone `ContactInputField.svelte` y
  `ContactMessageField.svelte` en la columna "Islas Svelte", pero no son islas: solo se hidratan como
  hijos de `ContactForm`. Es una limitación del generador (`scripts/`), no de esta feature. Si se quiere
  arreglar, que el generador cuente solo los `.svelte` que se hidratan con `client:*`. No bloquea.
- [informe] `progress/impl_EXTRACT-A.md` no nombra el cambio en `docs/architecture.md`. Lo regeneró
  `check:arch` (bloque `arch:map`) y es correcto. No bloquea.

## Verificado sin hallazgos

- **V1**: `./init.ps1` da VERDE (exit 0): toolchain, dependencias, estado, check:ds, check:arch,
  astro check y build.
- **Prueba de no-cambio (antes/después)**: la línea base es `scratchpad/dist_before/`, compilada a las 00:57:49,
  antes de crear `TextLines.astro` (00:57:54) y los campos de contacto (00:58:33). La comparé con el `dist/` que
  generó `init.ps1`:
  - `proyectos/origen/index.html` y `componentes/index.html`: idénticos byte a byte.
  - `index.html`: solo cambian los hashes de los chunks JS. Con los hashes normalizados, el diff sale vacío.
  - Todos los `.css` son idénticos (md5). El conjunto de chunks JS es el mismo y solo cambia `ContactForm.*.js`.
- **Formulario de contacto (A2)**: comparé los dos `ContactForm.*.js` compilados:
  - Las plantillas DOM son idénticas (`div.flex.min-w-0.flex-1.flex-col`, `div.flex.min-w-0.flex-col` y el `form`).
  - Llegan las mismas props a `InputGlass` y `TextareaGlass`: `id`, `name`, `type`, `autocomplete`, `inputmode`,
    `spellcheck`, `placeholder`, `required`, `rows=4` y `minlength`.
  - Los ids salen de `fieldIds(baseId, name)` igual que antes.
  - `aria-invalid="true"` y `aria-describedby=<id>-error` solo se ponen cuando hay error. `FieldError` lleva el mismo id.
  - Validación: el mismo `validateContact`/`firstInvalid`. Los errores solo aparecen tras el primer envío.
  - Foco: tras `tick()`, va a `messageRef` o a `inputs[invalid]`. Los dos refs siguen llenándose por `bind:ref`
    (setter `x.name=e` / `T(S,e,!0)`).
  - Se mantienen `novalidate` al hidratar, `aria-busy`, el botón deshabilitado sin JS, `role=status` con
    `aria-live=polite` y el reset tras `sent`.
  - Los campos no tienen estado propio: todo el estado sigue en `ContactForm.svelte`.
- **Props mínimos y sin variantes**:
  - `TextLines.astro`: solo `lines`.
  - `ContactInputField`: `baseId`, `name`, `field`, `type`, `autocomplete`, `error`, `value` y `ref`. `type` y
    `autocomplete` son atributos nativos que ya cambiaban entre las llamadas al snippet; no hay flags de estilo.
  - `ContactMessageField`: `baseId`, `field`, `error`, `value` y `ref`. El textarea es un componente aparte
    (no un flag).
- **Ubicación**: `TextLines` en `src/modules/project/` y los dos campos en `src/modules/contact/`. Cada uno lo usa
  un solo módulo, así que lo correcto es dejarlo en su módulo. Ninguno se exporta en el `index.ts` del módulo,
  y no se tocaron `shared/ui`, `docs/components.md` ni `/componentes`.
- **Sin repeticiones sin migrar**:
  - `grep '.map((line'` y `grep '<span class="block">'` en `src/` solo encuentran `TextLines.astro`.
  - `<TextLines` aparece 13 veces, en los 13 archivos que lista A1.
  - No quedan `{#snippet` en `modules/contact`.
  - Los `.map(... <span>)` de `SolutionStoreDesktop`/`SolutionStoreMobile` son otro patrón (spans sin
    `block`, mocks de tienda; entran en EXTRACT-C), así que no son un resto de A1.
- **V2/V3/V4**: el HTML y el CSS generados son idénticos, así que no puede haber cambio de estructura, de
  responsive (375/768/1024/1440), de motion ni de assets. No hice capturas: el byte a byte basta.
- **V5**:
  - Sin `client:load`, `any` ni `ds-allow` en los archivos nuevos.
  - Sin valores arbitrarios ni hex.
  - Sin imports entre módulos.
  - No hay copy escrito a mano: las etiquetas vienen de `field.label`.
- **V6**: aria, labels ocultos y foco equivalentes, como se detalla arriba.
- **V7**: los archivos cambiados durante la feature (mtime posterior a `verify_QTE-USD-ONLY.md`) son los 13 de
  `modules/project`, `TextLines.astro`, los 3 de `modules/contact` y `docs/architecture.md`, este último
  regenerado por el script. Nada fuera del alcance.
