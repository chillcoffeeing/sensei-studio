# impl LINKS-TWO-PATHS: /links con dos caminos y el diagnóstico en una hoja

Referencias: `design/links/linktree-sensei.html` y `Linktree-Diagnostico-gratis-Sensei.txt`. Sin Figma.

## Archivos

**Creados**
- `src/core/analytics.ts`: `track()` tipado sobre `window.dataLayer`, sin GTM, más `trackClicks()`, un listener delegado de `[data-track]`.
- `src/modules/links/LinksPathsCard.astro`: tarjeta "Tu proyecto empieza aquí" con los 2 tiles y la isla del diagnóstico.
- `src/modules/links/LinksPathTile.astro`: tile como `<button>` con el atributo que lo abre (`data-diagnostic-open` / `data-quote-open`), `data-track`, badge y `featured`.
- `src/modules/links/LinksDiagnosticDialog.svelte`: isla (`client:load`). `ModalDialog` en hoja, con cabecera fija (rótulo y "✕ Cerrar") y pie en todos los pasos.
- `src/assets/links/path-compass.svg`, `path-document.svg`: iconos de los tiles, del SVG del prototipo y con trazo ink.

**Movidos**
- `src/layout/dialog/ModalDialog.svelte` → `src/shared/lib/dialog/ModalDialog.svelte`. Un módulo no puede importar `layout/`, y así cotización, asesoría y diagnóstico comparten la misma base. Se le suman `mobile="sheet"` (hoja inferior que entra con `translate-y-full`) y `width="sm"`.
- `src/layout/focus-trap.ts` → `src/shared/lib/dialog/focus-trap.ts`. Se actualizaron los imports de `MobileMenu`, `QuoteDialog` y `AdviceDialog`.

**Modificados**
- `src/modules/links/schema.ts`, `index.ts`:
  - nuevos `LinksPaths` y `LinksPathTile`;
  - `LinksHeader` sin `quote` ni `whatsapp`;
  - `DiagnosticOutcome.steps`;
  - `LinksDiagnostic.close`;
  - `later` con `invite` y `whatsapp.message`;
  - `LinksExplore` sin servicios;
  - `LinksClosing` con `site` y `claim`.
- `src/content/links.ts`:
  - copy palabra por palabra del PDF: cabecera, tarjeta, tiles, 3 pasos por área y para "ninguno", 4b y cierre;
  - `MIN_BUDGET = 400` sigue siendo la única constante.
- `src/modules/links/Section.astro`: cabecera, tarjeta, Yupa y cierre; `<script>` con `trackClicks()`.
- `src/modules/links/LinksHeader.astro`: sin botones.
- `src/modules/links/LinksDiagnostic.svelte`:
  - al cambiar de paso, `scrollTo(0)` del `<dialog>` y foco en el título;
  - eventos `diagnostico_iniciado`, `diagnostico_completado {resultado}` y `lead_enviado {califica}`;
  - 4b recibe el área y los pasos.
- `src/modules/links/LinksDiagnosticLater.svelte`: 4b nuevo, con pasos en tarjetas grises y número en círculo lima, invitación y botón lima "Cotizar por WhatsApp" (wa.me con `?text=` y el área), medido con `clic_whatsapp_cotizar`.
- `src/modules/links/LinksDiagnosticHeading.svelte`: `{name}` también en `text`.
- `src/modules/links/diagnostic.ts`: `whatsappUrl()`.
- `src/modules/links/LinksDiagnosticLink.svelte`: solo cambia el comentario (ahora lo usa únicamente 4a).
- `src/modules/links/LinksExplore.astro`: "Un proyecto reciente" con solo la tarjeta Yupa.
- `src/modules/links/LinksProjectCard.astro`: `data-track="clic_proyectos"`.
- `src/modules/links/LinksClosing.astro`, `LinksContactReminder.astro`, `LinksWhatsAppLink.astro`: "¿Prefieres escribirnos?", el WhatsApp de la página (píldora paper, `clic_whatsapp`), "Visitar bysensei.com" (`/`), "Sin promesas vacías. Solo resultados." y el pie mínimo.
- `src/modules/links/LinksFooterNav.astro`: solo el comentario.
- `src/layout/quote/QuoteDialog.svelte`: `track('cotizacion_continuar')` en el envío válido. Sin más cambios; también se actualizó la cabecera.
- `src/layout/StandaloneLayout.astro`, `src/pages/links.astro`: comentarios con el motivo de no mostrar la barra flotante.
- `src/styles/tokens.css`: tokens nuevos (abajo).
- `docs/design-system.md`, `docs/architecture.md`, `docs/components.md`: nueva ruta de `ModalDialog` y tokens nuevos.
- `design/content-gaps.md`: ID de GTM/GA4 pendiente (P1) y WhatsApp de `/links` ya sin la cabecera.

**Borrados**
- `src/modules/links/LinksDiagnosticCard.astro`: lo sustituye `LinksPathsCard`.
- `src/modules/links/LinksServicesLink.astro`: "Conoce nuestros servicios".
- `src/assets/links/arrow-up-right-md.svg`, `arrow-up-right-paper.svg`: quedaron sin uso.

## Tokens

- `--dialog-w-sm: min(100% - spacing*12, 32rem)`: diagnóstico desde sm. Columna de lectura de 512px; el prototipo usa 480.
- `--dialog-max-h-sheet: 94dvh`: tope de la hoja, del PDF ("hasta el 94 % del alto").
- `--dialog-sheet-pad-b: spacing*5 + env(safe-area-inset-bottom)`: la hoja toca el borde inferior en iOS.

## Decisiones y desviaciones (con motivo)

- **ModalDialog en `shared/lib/dialog/`.** El criterio pedía reutilizar el patrón de los modales, y las fronteras impiden que un módulo importe `layout/`. Va en `lib` y no en `ui` porque es infraestructura de comportamiento (disparadores, foco, cierre), como las primitivas de slider; los controles visuales de los modales siguen en `layout/dialog/`.
- **Rótulo "Diagnóstico gratis" en la cabecera fija del diálogo, en todos los pasos.** En el prototipo solo aparece en el paso 0. Así el diálogo tiene un nombre accesible estable y "✕ Cerrar" siempre está a mano.
- **Cerrar no reinicia el diagnóstico.** El prototipo vuelve a la entrada al reabrir. Un toque fuera por error no hace perder el progreso.
- **Tiles como `<button>`, el de cotización también.** Lo pide el criterio, y es la semántica correcta para abrir un diálogo. Antes de que se hidrate la isla de cotización (`client:idle`), el tile no hace nada.
- **Títulos de los tiles alineados arriba y badge al pie** (en el prototipo el título baja con `margin-bottom:auto`). Así los dos títulos quedan a la misma altura aunque uno tenga badge.
- **4b con un tramo realzado.** El título es "Gracias, Ana. Tu proyecto tiene **por dónde empezar.**", con marcador lima detrás de texto tinta, como el resto de títulos del diagnóstico.
- **Botón "Cotizar por WhatsApp" a todo el ancho**, lima con borde tinta, logo y flecha. No usa `LinkCtaBrand` porque su foco es lima, ilegible sobre blanco.
- **Pie "Sin promesas vacías. Solo resultados.":**
  - en el diálogo, en todos los pasos (PDF);
  - también en el cierre de la página, como en el prototipo. Nunca se ven a la vez.
- **"Visitar bysensei.com" a `/` en la misma pestaña**, porque es el mismo sitio. Se quita "Studio ↗" del pie, que lo duplicaba; el pie mínimo queda en wordmark + "Privacidad".
- **Barra flotante.** `/links` usa `StandaloneLayout`, que no la monta: duplicaría "Cotizar proyecto" (tile) y WhatsApp (cierre). Solo queda un WhatsApp en la página, más el del paso 4b.
- **`cotizacion_continuar`.** El modal no tiene un botón "Continuar cotización". Se mide el envío válido de "Solicitar cotización", en todas las páginas: el modal es el mismo en todo el sitio y GA4 separa `/links` por la URL. Sin cambios visuales ni funcionales en el modal.
- **Progreso.** Barra lima sobre pista tinta, como estaba. Lima sobre gris claro (prototipo) no llega al contraste 3:1 de elemento gráfico.

## Responsive inferido

- Móvil a 390/375:
  - columna completa;
  - 2 tiles a 2 columnas (~145px cada uno) con títulos en 2 líneas y `min-h-44`;
  - hoja inferior con `rounded-t-3xl` y scroll propio;
  - Cal.com con `h-170` (680px).
- Desde sm:
  - página en columna de 448px sobre stone-100, como antes;
  - diálogo centrado de 512px con su alto natural y tope `--dialog-max-h`.
- Sin scroll horizontal (`scrollWidth`): 375, 390, 768, 1024 y 1440.

## Comprobado en Chrome headless (CDP, build de producción)

- Tile → hoja abierta con el foco en "✕ Cerrar".
- Esc → se cierra y el foco vuelve al tile.
- Con el diálogo abierto, `html` tiene `overflow: hidden`.
- Quiz: empate Branding/Email → gana Branding. Cero "sí" → "Buen punto de partida" y se mantiene la invitación.
- Preclasificación vacía → muestra el error y lleva el foco al primer grupo.
- < $400 → 4b con los 3 pasos y wa.me con `?text=` "…Mi prioridad es Branding e identidad…".
- ≥ $400 → iframe de Cal.com `?embed=true&name&email&notes` de 680px. El diálogo vuelve arriba (`scrollTop 0`) y el foco va al título.
- `dataLayer`: `clic_diagnostico`, `diagnostico_iniciado`, `diagnostico_completado {resultado}`, `lead_enviado {califica}`.
- El tile "Cotizar proyecto" abre `quote-title`.

## `./init.ps1`

Verde.
- Toolchain: node v22.20.0 y pnpm 11.1.3, con el nvm de v22.20.0 antepuesto al PATH.
- `check:ds`: 0 errores (1 ds-allow previo).
- `check:arch`: 307 archivos, 21 módulos, 0 errores.
- `astro check`: 0 errores.
- `astro build`: OK.
