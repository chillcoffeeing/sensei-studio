# Verify MODAL-UNIFY — vuelta 1
Resultado: VERDE

Método: `./init.ps1` (con nvm v22.20.0 antepuesto al PATH) y un Chrome headless propio por CDP
(perfil temporal, PID propio; solo se cerró ese proceso) sobre `dist/`, servido localmente.
Los clics son reales (`Input.dispatchMouseEvent`) sobre los disparadores visibles. Script, capturas
y `report.json` en
`C:\Users\victo\AppData\Local\Temp\claude\83f3c8ffa0fae990\f45634bb-a1be-40b8-8e18-54918322fb49\scratchpad\verify\`
(`{375,390,768,1024,1440}-{quote-home,quote-bar,advice-home,advice-bar,diag-links,quote-links}-{top,bottom}.png`, más estados y flujo).

Casos (6 × 5 anchos = 30):
- cotización desde el header o menú de la home, y desde la barra flotante;
- asesoría desde el header o menú, y desde la barra flotante;
- diagnóstico desde /links;
- cotización desde /links.

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- `src/modules/links/LinksDiagnostic.svelte:31`: el tipo `icons` de Props sigue siendo `{ cta; open; whatsapp }`. `LinksDiagnosticDialog` le pasa también `close`. No rompe nada (astro check en verde), pero los tipos no coinciden. Opcional: tiparlo con `Omit<…, 'close'>` o pasar solo lo que usa.
- `src/shared/lib/dialog/ModalDialog.svelte:13-14`: la línea de la cabecera se corta a mitad de frase («scroll interno; el» / «último bloque…»). Es solo estético.
- Cotización en la hoja mobile: el pie (estado, WhatsApp y envío) deja de ser sticky y queda al final del scroll. Es alcanzable (el envío acaba a 792/812 px tras el scroll) y el informe lo justifica. Se anota como decisión de UX, no como fallo.

## Verificado sin hallazgos

**V1.** `./init.ps1` en VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check y build (9 páginas).

**Criterio 1: sin variantes móviles.**
- Desaparecen la prop `mobile` y el mapa `MOBILE`.
- Los tokens `--dialog-w-compact` y `--dialog-max-h-compact` están borrados y no quedan referencias en `src/`.
- Hay una sola lista de clases: hoja en la base y tarjeta con `sm:`, más `WIDTH[width]`.

**Criterio 2: en móvil (375/390) los tres modales son la misma hoja.** Es así en los 6 disparadores:
- `bottom = 812`, de borde a borde (L0 R0) y radio `24 24 0 0`;
- `shadow-2xl`, tope `763.28px` (94dvh) y backdrop `rgba(0,0,0,.45)`;
- transición de 0.25s con ease-enter;
- cierre de 44×44 px a 12/12 px del borde, fondo stone-100 y X de 16 px;
- último bloque con `pb-(--dialog-sheet-pad-b)`: 20 px más el safe-area.

El diagnóstico mide 394 px (alto natural, pegado abajo). Cotización y asesoría llegan al tope.

**Criterio 3: desde sm (768/1024/1440) es la misma tarjeta centrada.**
- Iguales en los tres: radio de 24 px en las cuatro esquinas, sombra, tope `100dvh - 48px` (976/976/852), backdrop, transición y cierre de 44 px a 20/16 px.
- Solo cambia el ancho:

  | Modal | 768 | 1024 | 1440 |
  |---|---|---|---|
  | Cotización | 720 | 976 | 1024 |
  | Asesoría | 640 | 640 | 640 |
  | Diagnóstico | 512 | 512 | 512 |

- Márgenes simétricos (centrada). `sm:m-auto` anula el `margin-bottom` de `dialog-sheet`.

**Criterio 4: nada tapado ni cortado.**
- **Scroll interno:** la página no tiene scroll horizontal en ningún caso, y el diálogo tampoco.
- **Envío visible tras el scroll en los 30 casos.**
- **Teclado simulado:**
  - Asesoría a 375 (`--dialog-keyboard: 320px`): la hoja ocupa de 49 a 492 px y el último input (email) queda a 249–293 px, encima del teclado.
  - Qualify del diagnóstico a 390: tope 443 px y `margin-bottom` de 320 px.
  - Con zoom se ignora. En headless el visualViewport real no cambia, así que solo se probó la parte CSS.

**Criterio 5: comportamiento.** Se cumple en los 30 casos:
- Cierre con el botón (clic real), con Escape y con clic en el backdrop.
- Un clic dentro del contenido no cierra.
- Tab atrapado: 60 Tab hacia delante y 7 con Shift+Tab, siempre dentro.
- Foco inicial en el botón de cierre.
- `html` con `overflow: hidden` mientras está abierto y `visible` al cerrar. La rueda sobre el backdrop no mueve la página.
- **Vuelta del foco:**
  - Al disparador, con barra flotante, /links y header de escritorio (1024/1440).
  - Al botón «Menú» si se abrió desde el menú mobile (375–768). Es el comportamiento documentado, porque el panel se cierra.

**Estados `?simulate` (390):**
- `asesoria-simulada` y `cotizacion-simulada`, con `sent`, `error` y `unavailable`: los tres mensajes correctos en los dos modales, que siguen abiertos.

**Flujo del diagnóstico (390):**
- Pasos recorridos: intro → «Empezar mi diagnóstico» → 16 respuestas → resultado → qualify → «Elige tu horario» (booking).
- En el resultado: scroll en 0 y foco en `[data-step-title]`.
- Cerrar y reabrir no reinicia el flujo.
- En el qualify, el botón «Continuar» queda visible tras el scroll.

**Reduced motion:** `transition-duration: 0s`, sin animación.

**Criterio 7: comentarios de cabecera.** Están actualizados en:
- ModalDialog y ModalDialogBar;
- QuoteDialog, QuoteHeader y QuoteFooter;
- AdviceDialog, AdviceHeader y AdviceChannels;
- LinksDiagnosticDialog;
- `schema.ts`.

**V2.** La estructura de cada modal se mantiene: orden de bloques, jerarquía y composición. El cambio del cierre del diagnóstico («✕ Cerrar» en texto → botón redondo con `aria-label` «Cerrar el diagnóstico») lo exige el criterio de forma común, y está justificado.

**V4.** Las tres copias de `close.svg` (quote, advice, links) son idénticas (mismo md5), una por carpeta, con la X de 16 px. El círculo lo dibuja el botón y la proporción es correcta.

**V5.** En los archivos tocados no hay:
- valores arbitrarios `[..]`;
- hex en componentes;
- `ds-allow`, `client:load` ni `any`;
- imports entre módulos (`ModalDialogBar` vive en `shared/lib`).

El `z-10` de la fila sticky es de Tailwind por defecto y ya existía. `tokens.css` solo agrega tokens: no hay `initial` ni nombres por defecto redefinidos. `--dialog-keyboard` es una variable que se fija en tiempo de ejecución y la consume la utilidad `dialog-sheet`. Está justificado que no sea un token.

**V6.** El nombre accesible viene de `aria-labelledby` (título, o rótulo en el diagnóstico). Los botones de cierre tienen `aria-label` y foco visible (`outline-ink`), el icono lleva `alt=""` y el hover va con `can-hover`.

**V7.** El alcance se ajusta a acceptance. El menú mobile no se toca.
