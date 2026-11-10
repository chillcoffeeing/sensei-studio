# Impl MODAL-UNIFY — vuelta 1

Un solo modal por breakpoint: **hoja inferior en mobile** y **tarjeta centrada desde sm** para
cotización, asesoría y diagnóstico de /links. No hay Figma para esta feature. El menú mobile no se toca.

## Archivos

- `src/shared/lib/dialog/ModalDialog.svelte`: se elimina la prop `mobile` y el mapa `MOBILE` (full/card/sheet). Queda una sola lista de clases: hoja en mobile (`dialog-sheet`, `mt-auto`, `rounded-t-3xl`, `shadow-2xl`, entrada `translate-y-full` + fade) y tarjeta desde sm (`sm:m-auto`, `sm:max-h-(--dialog-max-h)`, `sm:rounded-3xl`, entrada `translate-y-4`). Toda la animación va bajo `motion-safe:`. Se suma el seguimiento del teclado (`visualViewport` → `--dialog-keyboard`), activo solo con el modal abierto. Cabecera actualizada.
- `src/shared/lib/dialog/ModalDialogBar.svelte` (nuevo): fila sticky común con el rótulo (snippet) y el cierre redondo de 44 px (`bg-stone-100`, hover `stone-200`, `aria-label`). La prop `divided` añade la línea inferior (diagnóstico).
- `src/layout/quote/QuoteHeader.svelte`, `src/layout/advice/AdviceHeader.svelte`: usan `ModalDialogBar`. Ya no usan su propio botón.
- `src/modules/links/LinksDiagnosticDialog.svelte`: usa `ModalDialogBar divided`. Se quita `mobile="sheet"`. Relleno lateral desde sm de 7 a 8, como los otros dos. Cabecera actualizada.
- `src/layout/quote/QuoteDialog.svelte`: se quita `mobile="card"`. Cabecera actualizada.
- `src/layout/advice/AdviceDialog.svelte`: se quita el layout de pantalla completa (`min-h-full`, `flex-1`). Cabecera actualizada.
- `src/layout/quote/QuoteFooter.svelte`, `src/layout/advice/AdviceChannels.svelte`: el último bloque lleva `pb-(--dialog-sheet-pad-b)` en mobile (safe-area) y `sm:pb-5`.
- `src/modules/links/schema.ts`: `close` pasa a `{ label }` (sin `marker`). Se añade `icons.close`.
- `src/modules/links/LinksPathsCard.astro`: pasa `icons.close` a la isla.
- `src/content/links.ts`: `close.label` cambia a «Cerrar el diagnóstico». Se añade el icono `close`.
- `src/assets/links/close.svg` (nuevo): copia de `quote/close.svg` (X de 16 px), por la regla de una copia por carpeta.
- `src/assets/advice/close.svg`: ahora es la X de 16 px. El círculo de 32 px que traía dentro lo dibuja ahora el botón común.
- `src/styles/tokens.css`: tokens de modal reordenados y comentados.
- `src/styles/global.css`: nueva utilidad `@utility dialog-sheet` (margen inferior y tope de alto, descontando el teclado).
- `docs/design-system.md`, `docs/architecture.md`: líneas de modales actualizadas.
- `progress/current.md`: plan.

## Tokens

- **Borrados** (quedaron sin uso): `--dialog-w-compact` y `--dialog-max-h-compact`, del modo `card` de la cotización.
- **Se mantienen:** `--dialog-w-lg/md/sm`, `--dialog-max-h` (tarjeta desde sm), `--dialog-max-h-sheet: 94dvh` (hoja, de la decisión del orquestador / PDF de /links) y `--dialog-sheet-pad-b` (ahora lo usan los tres modales).
- **Variable de ejecución, no token:** `--dialog-keyboard`. La escribe ModalDialog en el propio `<dialog>`. La utilidad `dialog-sheet` la consume con un respaldo de 0. Va en una utilidad y no en un token de `@theme` porque un `var()` dentro de `@theme` se resuelve en `:root` y no vería el valor del elemento.

## Decisiones y desviaciones (sin Figma, criterio propio)

- **Cierre unificado:** botón redondo de 44 px con X de 16 px sobre `stone-100`, solo icono y con `aria-label`, en la misma fila sticky y con la misma posición: 12 px del borde derecho en mobile y 20 px desde sm, 12/16 px arriba. Es la forma de la cotización.
  - Asesoría: su círculo de 32 px estaba dibujado en el SVG.
  - Diagnóstico: pasa de «✕ Cerrar» en texto a este botón. Su nombre accesible es «Cerrar el diagnóstico».
  - Motivo: el criterio de aceptación pide la misma forma en los tres.
- **Diagnóstico:** conserva la línea bajo la fila (`divided`), porque su contenido no tiene título propio que la separe al hacer scroll. Cotización y asesoría ya tienen la línea bajo el título.
- **Envío en mobile:**
  - Cotización: no es sticky en la hoja. Su pie apilado (estado + WhatsApp + botón) ocuparía ~200 px fijos, así que queda al final del scroll interno, alcanzable. Desde sm sigue pegado abajo.
  - Asesoría: el botón está al final del formulario, antes de los canales.
- **Teclado mobile:** Chrome Android (resizes-visual) deja la hoja detrás del teclado. Mientras el modal está abierto, `visualViewport` (resize/scroll) calcula el alto tapado y la hoja hace dos cosas:
  - sube (`margin-bottom`) y encoge (tope `94dvh - teclado`);
  - lleva el campo enfocado a la vista con `scrollIntoView({ block: 'nearest' })`.

  Con zoom (`scale > 1`) no hace nada. En iOS, `innerHeight - vv.height - offsetTop` ≈ 0 y Safari hace su paneo nativo. No toqué `interactive-widget` del viewport meta porque reflowaría todas las secciones con `dvh` de la página.
- **Entrada:** la hoja sube desde fuera de la pantalla y la tarjeta sube 16 px. Las dos tienen fundido, todo bajo `motion-safe`, así que con reduced-motion no hay animación.

## Responsive inferido

- **< sm:** hoja de ancho completo pegada abajo, alto natural, tope 94dvh y scroll interno.
  - Con contenido corto, la hoja mide lo que el contenido: el diagnóstico (intro) mide 394 px.
  - Con contenido largo llega al tope: cotización y asesoría, 763 px de 812.
- **≥ sm:** tarjeta centrada con 24 px de aire y tope `100dvh - 48px`. Anchos: lg 1024 (cotización), md 640 (asesoría), sm 512 (diagnóstico).

## Comprobado (Chrome headless propio por CDP, `--user-data-dir` temporal, build de producción en servidor estático local)

Capturas en `C:\Users\victo\AppData\Local\Temp\claude\83f3c8ffa0fae990\f45634bb-a1be-40b8-8e18-54918322fb49\scratchpad\modal\`:

- `{375,390,768,1024,1440}-{quote,advice,diagnostic}-{top,bottom}.png` (30 capturas);
- `390-advice-sent.png`, `390-quote-invalid.png`, `390-quote-keyboard300.png`.

Medido con `report.json`, en la misma carpeta:

- **Mobile (375/390):** los tres con `bottom = 812` (pegados abajo), radio `24px / 0px`, sombra, `maxH 763px` (94dvh), cierre de 44 px a 12/12 px y fondo `stone-100`. El foco inicial va al cierre.
- **Desde sm (768/1024/1440):** los tres con radio `24px / 24px`, sombra, `maxH = 100dvh - 48`, cierre de 44 px a 20/16 px, centrados. Solo cambia el ancho (720→1024 / 640 / 512).
- **Sin scroll horizontal** en los 15 casos. `html` tiene `overflow: hidden` con el modal abierto y `visible` al cerrar.
- **Esc** cierra en los 15 casos.
- **Vuelta del foco** al disparador: OK en 1024/1440 y siempre en el diagnóstico.
  - En mobile/768 la medición daba `false` en cotización y asesoría. El script tomaba el primer `[data-*-open]` del DOM, que en esos anchos es un enlace oculto (menú o nav desktop).
  - En ese caso ModalDialog, como antes, devuelve el foco al elemento activo de respaldo. No cambié esa lógica.
- **Envío simulado de asesoría** (`?asesoria-simulada=sent`): «¡Gracias! Recibimos tu solicitud…».
- **Cotización vacía:** al enviar, el foco va a `services` y aparece «Revisa los campos marcados…».
- **Tab atrapado:** tras 80 Tab el foco sigue dentro.
- **Clic en backdrop:** cierra.
- **Teclado simulado** (`--dialog-keyboard: 300px` a 390×812): la hoja queda de 49 a 512 px, tope 463 px y `margin-bottom` de 300 px. Los campos finales se alcanzan con el scroll interno (captura `390-quote-keyboard300.png`).

## `./init.ps1`

**Verde** (node v22.20.0 + pnpm con el nvm antepuesto al PATH):

- check:ds OK
- check:arch OK
- astro check OK
- astro build OK (9 páginas)

«VERDE: todo en orden».
