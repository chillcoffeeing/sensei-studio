# impl QTE-MODAL: modal de solicitud de cotización

Figma: fileKey `flzA0qnj6JdalFCgyB2PdI`, nodo raíz 220:867. Pedí `get_design_context` con screenshot y llegó completo, con todos los hijos (cabecera 220:868, servicios y presupuesto 220:885, proyecto y contacto 220:942, pie 220:987), así que no hizo falta pedir subnodos. 220:845 no se construye. Descargué los 17 SVG del nodo y los uso sin tocar.

## Archivos

- `src/layout/quote/QuoteDialog.svelte`: nuevo. Isla única con el `<dialog>` nativo. Lleva el estado del formulario, la delegación de `[data-quote-open]`, el cierre (botón, Esc y backdrop), la vuelta del foco, el ciclo del Tab y el envío.
- `src/layout/quote/QuoteHeader.svelte`: nuevo. Cabecera 220:868: rótulo con cierre (fila sticky), h2, entradilla y tiempo de llenado.
- `src/layout/quote/QuoteServices.svelte` y `QuoteServiceOption.svelte`: nuevos. Grupo 220:886 con contador y la tarjeta-checkbox 220:893.
- `src/layout/quote/QuoteBudget.svelte`, `QuoteBudgetMode.svelte`, `QuoteCurrency.svelte` y `QuoteBudgetRange.svelte`: nuevos. Bloque 220:916: modo con radios segmentados, `<select>` de moneda y rangos con radio (un segundo clic desmarca), o el campo de monto máximo.
- `src/layout/quote/QuoteProject.svelte` y `QuoteGoalOption.svelte`: nuevos. Bloque 220:943: textarea con la ayuda dentro de la caja y objetivos como checkbox-píldora.
- `src/layout/quote/QuoteAttachment.svelte`: nuevo. Bloque 220:968: `input file` nativo que acepta arrastrar y soltar, muestra nombre y tamaño y tiene "Quitar archivo".
- `src/layout/quote/QuoteContact.svelte` y `QuoteContactField.svelte`: nuevos. Bloque 220:975: nombre, email y WhatsApp con etiqueta visible.
- `src/layout/quote/QuoteFooter.svelte`, `QuoteWhatsAppLink.svelte`, `QuoteSubmitButton.svelte` y `QuoteStatus.svelte`: nuevos. Pie 220:987 con la región `role="status"`.
- `src/layout/quote/QuoteSectionTitle.svelte`, `QuoteInput.svelte`, `QuoteFieldError.svelte` y `QuoteIcon.svelte`: nuevos. Piezas comunes del modal.
- `src/layout/quote/quote-form.ts`: nuevo. Lógica pura: valores, validación, contador, `submitQuote` (función única de envío), `quoteFormData` y la simulación.
- `src/layout/quote/quote-data.ts`: nuevo. Convierte `SiteQuote` en datos serializables (cada `ImageRef` pasa a `UiIcon`). Los `.svg` importados llegan como función.
- `src/layout/BaseLayout.astro`: monta `<QuoteDialog client:idle>` una sola vez, después del footer.
- `src/layout/Header.astro`: añade `data-quote-open` en el nav cuando el item tiene `opensQuote`.
- `src/layout/MobileMenu.svelte`: añade `opensQuote` al tipo. Ese enlace lleva `data-quote-open` y cierra el panel devolviendo el foco al botón del menú.
- `src/shared/ui/LinkNav.astro`: acepta atributos nativos con `...rest`, sin `class` (mismo criterio que `LinkMenu`).
- `src/core/site.ts`: tipos `SiteQuote` y sus bloques, `SiteNavItem.opensQuote` y `SiteChrome.quote`.
- `src/content/site.ts`: copy y datos de `quote`. El destino de WhatsApp queda en una sola constante (`whatsappHref`), que comparten la barra flotante y el pie del modal. El "Cotización" del nav lleva `opensQuote`.
- `src/assets/quote/*.svg` (17): assets de 220:867 con nombre semántico, sin modificar.
- `src/styles/tokens.css`: tokens nuevos (ver abajo).
- `src/styles/global.css`: `html:has(dialog:modal) { overflow: hidden }` para bloquear el scroll.
- `docs/architecture.md`: nueva sección "Modal de cotización (`data-quote-open`)".
- `docs/components.md`: ficha de `LinkNav` con `...rest`, fila en "Quién consume qué" y fila en "Fuera de la librería". También quité una fila duplicada de la barra flotante en "Quién consume qué".
- `docs/design-system.md`: fila "Modal de cotización".
- `feature_list.json` (in_progress) y `progress/current.md` (plan).

## Conexión

- **Disparadores**: un solo listener delegado en `document` intercepta los `[data-quote-open]`. Hoy son:
  - `FloatingQuoteLink`, "Cotizar proyecto" de la barra flotante;
  - "Cotización" del nav, en desktop y en el menú mobile;
  - `ContactQuoteLink`, "Solicita una cotización" del proyecto.

  Respeta los clics con modificadores (ctrl, meta, shift o alt), que abren la pestaña normal. Sin JS, los disparadores siguen siendo enlaces a `/#contacto`.
- **Otros CTA del home**: "Agenda una reunión" es de reunión y "Déjanos un comentario" es de testimonios, así que no abren el modal.
- **Capas**: `showModal()` usa la capa superior del navegador, por encima del header, la barra flotante y el menú. Por eso no hacen falta z-index ni tokens de z, y el resto de la página queda inerte.
  - Lo único que lleva z es la fila sticky del cierre, con `z-10` dentro del propio diálogo.
- **Foco**:
  - Al abrir, va al botón de cerrar (comportamiento nativo).
  - Tab y Shift+Tab se quedan dentro del diálogo, con `wrapFocusIndex` de `layout/focus-trap.ts`.
  - Al cerrar (botón, Esc o backdrop), vuelve al disparador.
  - Desde el menú mobile, el panel se cierra, devuelve el foco a "Menú" y el modal se abre en el frame siguiente. Al cerrar, el foco vuelve a "Menú".
- **Backdrop**: solo cierra si el gesto empieza y acaba fuera de la caja. Así no se cierra al soltar una selección de texto arrastrada hacia fuera.

## Envío: destino PENDIENTE

- El contacto del home tiene `endpoint: undefined`, así que no hay backend que reutilizar, y `layout` no puede importar `modules/contact`. Repliqué su contrato en `submitQuote` (`layout/quote/quote-form.ts`), que es el único punto de envío:
  - sin endpoint devuelve `'unavailable'`, no toca la red y avisa de que no se ha enviado;
  - con endpoint hace un POST multipart con `services[]`, `budgetMode`, `currency`, `range`/`max`, `idea`, `goals[]`, `name`, `email`, `whatsapp` y `attachment`, y devuelve `'sent'` con 2xx o `'error'` en otro caso.
- **PENDIENTE**: `site.quote.endpoint` en `src/content/site.ts`.
- **Simulación**: `?cotizacion-simulada=sent|error|unavailable` en la URL. Espera 900 ms y devuelve ese resultado sin red, para revisar los estados enviando, éxito y error.
- **Estados**:
  - mientras envía: "Enviando…", con `aria-busy` en el form y `aria-disabled` en el botón;
  - con éxito: se vacía el formulario y se queda abierto con el mensaje;
  - error y validación: el mensaje va en `red-700`.
- **Validación** (tras el primer intento de envío, recalculada al escribir):
  - obligatorios: servicios (≥1), idea (≥20 caracteres), nombre y email (formato);
  - opcionales con formato: WhatsApp (teléfono), monto máximo (números) y adjunto (≤10 MB).
  - Cada campo lleva `aria-invalid` y `aria-describedby` hacia su mensaje. El grupo de servicios enlaza la ayuda, el contador y el error.
  - Al fallar, el foco va al primer campo inválido y la región de estado anuncia el resumen.
- **WhatsApp**: el número sigue PENDIENTE (`whatsappHref = 'https://wa.me/'`), ahora en un solo sitio para la barra y el modal.

## Tokens agregados

- `--color-brand-tint: #F4F8DD` (`bg-brand-tint`): fondo de la tarjeta de servicio elegida (220:893) y del adjunto al arrastrar. Ningún color nativo ni `brand/xx` sobre blanco da ese tono.
- `--quote-dialog-w: min(100% - spacing×12, var(--container-5xl))` y `--quote-dialog-max-h: calc(100dvh - spacing×12)`: tamaño de la tarjeta centrada desde sm, con 24px de aire a cada lado y un máximo de 1024px.
- Todo lo demás es nativo de Tailwind o ya existía:
  - nativo: `stone-100` (#F5F5F1 de Figma ≈ #F5F5F4), `stone-300` (#DDDED6), `stone-400`, `red-700`, `rounded-xl/lg/md/3xl/full`, `shadow-2xl` (Figma 0 28 80 / 25 %);
  - ya existía: `backdrop:bg-scrim`, `brand`, `ink`, `paper`, `ink-muted`, los roles `text-display`, `text-title-sm`, `text-overline`, `text-label-sm`, `text-meta`, `text-body(-sm)`, `text-caption`, `text-legal`, `text-button`, y `--duration-fast/base` con `ease-standard/enter`.

## Desviaciones de Figma (y motivo)

- **Bordes de los campos** (inputs, select, textarea, checkbox sin marcar y adjunto): `stone-400`, no #DDDED6. Sobre blanco, #DDDED6 queda en 1.3:1, y el límite de un control necesita acercarse a 3:1 (1.4.11). Las tarjetas y píldoras, que ya tienen fondo, siguen en `stone-300`.
- **Selección**: la tarjeta elegida usa `border-ink` y `ring-1 ring-ink`. Equivale al 1.5px de Figma y no desplaza el layout.
- **Tamaño de texto de los campos**: 16px en mobile y 14px desde sm. Con menos de 16px, iOS hace zoom al enfocar.
- **Botón de cerrar**: 40px en vez de 32, por área táctil.
- **Alturas**: inputs de 44px (Figma 43), rangos de 40px (Figma 38) y tarjetas de servicio de 64px mínimo (Figma 72/58), para que entre más contenido a 1440×900.
- **Título**: `text-display` (24.5 → 46px) en lugar de 42px fijo, para no crear otro rol.
- **Copy**:
  - la idea de ejemplo de Figma (220:947) pasa a placeholder con "Ej.:";
  - el placeholder de WhatsApp es un teléfono (Figma repetía el email, 215:196);
  - textos nuevos: modo "Monto máximo", validación, estados, nombre accesible del cierre y del tiempo;
  - monedas EUR y MXN, PENDIENTES de confirmar.
- **Estructura**: el orden de bloques, la composición en 2 columnas, la cabecera y el pie siguen a Figma.

## Responsive inferido

- **375**: el diálogo ocupa toda la pantalla (`h-dvh`, sin radio).
  - Todo hace scroll en un solo contenedor, y la fila de rótulo y cierre queda sticky arriba.
  - Los bloques se apilan, con servicios a 1 columna y rangos en 2 + 2 + 1 (flex-wrap con `basis-28`).
  - En el pie, WhatsApp va encima y el botón a todo el ancho.
  - El pie no es sticky: si lo fuera, le quitaría 140px al formulario.
- **320**: sin desborde (`scrollWidth = clientWidth = 320`). El control segmentado parte el texto en 2 líneas.
- **768**: tarjeta centrada de 720px con scroll interno y pie sticky abajo. Servicios a 2 columnas con el quinto a fila completa (`sm:last:odd:col-span-2`), rangos en una fila de 5, nombre y email en una fila.
- **1024 y 1440**: 2 columnas como en Figma (servicios y presupuesto | proyecto y contacto). A 1440×900 mide unos 930px de contenido, así que hace un poco de scroll interno con el pie siempre visible.
- **Motion**: entrada con `@starting-style` (opacidad + 16px), solo con `motion-safe`. Con reduced motion aparece al instante. Sin JS el diálogo nunca se abre.
- **Cómo lo verifiqué**: Chrome headless por CDP con perfil temporal propio en el scratchpad (`chrome.kill()` solo sobre ese proceso). El build se sirvió con `http.server` en una tarea de fondo, detenida por su id. Comprobé:
  - apertura desde la barra flotante, el nav desktop, el menú mobile y el contacto del proyecto;
  - Esc, botón de cerrar, backdrop y clic dentro sin cierre;
  - la vuelta del foco en todos los casos;
  - el ciclo de Tab y Shift+Tab;
  - envío vacío (errores y foco al primer servicio), validación de formato y del adjunto de 11 MB;
  - estados enviando, éxito (formulario vaciado) y error simulados;
  - `html` con `overflow: hidden` mientras está abierto;
  - capturas a 320, 375, 768, 1024 y 1440.
- **Bug encontrado y corregido**: `bind:group` no funciona entre componentes. Cada checkbox es un componente, así que solo contaba el último marcado. Lo cambié por un `checked` + `toggle()` explícito.

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds (0 errores), check:arch (209 archivos, 0 errores), astro check (0 errores; queda el hint previo de `media` en BaseLayout) y astro build OK.

## Vuelta 2

Corrige el bloqueante V3 (áreas táctiles < 44px a 375) y dos menores baratos.

### Archivos

- `src/layout/quote/QuoteGoalOption.svelte`: píldora `min-h-11` (antes `min-h-8`); `lg:pointer-fine:min-h-8` recupera la densidad de Figma solo con ratón desde lg.
- `src/layout/quote/QuoteAttachment.svelte`: "Quitar archivo" pasa a `inline-flex min-h-11 items-center px-3` (antes `px-2 py-1`, 23px). Tamaño del archivo con `toLocaleString('es')` ("11,0 MB").
- `src/layout/quote/QuoteHeader.svelte`: cerrar `size-11` (44×44) en todos los anchos.
- `src/layout/quote/QuoteBudgetMode.svelte`: cada opción del segmentado `min-h-11` (antes `min-h-9`); `lg:pointer-fine:min-h-9`.
- `src/layout/quote/QuoteBudgetRange.svelte`: rango `min-h-11` (antes `min-h-10`); `lg:pointer-fine:min-h-10`. Nuevo `onkeydown`: Space sobre el rango marcado lo desmarca (con `preventDefault`, comprobado en Chrome que así no llega el `click` que lo volvería a marcar).

### Decisión

- Se sube la altura real (no pseudo-elemento) porque en las filas con `flex-wrap gap-1.5/2` un hit area ampliado se solaparía con el vecino.
- La densidad de Figma solo se recupera con `lg:` + `pointer-fine:` (desktop con ratón); en tablets táctiles a 1024 sigue a 44px. El cierre y "Quitar archivo" quedan a 44px siempre.

### Medido (Chrome headless, perfil temporal propio, kill solo de su PID, `dist/client` servido en local)

- 375×812: cerrar 44×44, objetivos 44, segmentado 44/44, rangos 44 ×5, sin scroll horizontal en el diálogo.
- 1440×900 (ratón): cerrar 44×44, objetivos 32, segmentado 36, rangos 40 (densidad de Figma).

### Menores no atacados

- Scrollbar nativa del `<dialog>` cortando la esquina desde sm: el arreglo limpio es mover el scroll a un contenedor interior, lo que toca el sticky de cabecera y pie; no es barato ni seguro en esta vuelta.
- Partido de líneas del segmentado a 375 y "Branding e identidad" a 1440: cosméticos, se leen bien.
- Duplicado `{#if index === 0}` en `QuoteServices.svelte`: Svelte no permite `bind:` condicional; se deja.

### init.ps1

VERDE: toolchain, install, estado, check:ds, check:arch, astro check y astro build OK.

## Vuelta 3

Bloqueante V6 (segundo clic sobre un rango: UI marcada y estado vacío).

**Decisión: se mantiene "segundo clic / Space desmarca".** El presupuesto es opcional y el
modo rango no tiene otra forma de volver a "sin definir" sin añadir una opción nueva (que
cambiaría el bloque de contenido). La UI ahora refleja la deselección.

- `src/layout/quote/QuoteBudgetRange.svelte`: `onclick` ya no hace `preventDefault()`
  (cancelar el clic hacía que el navegador restaurase `checked = true` después del handler);
  ahora pone `event.currentTarget.checked = false` y `group = ''`. Programar `checked` no
  dispara `change`, así que `bind:group` no lo pisa. `onkeydown` (Space) sin cambios.

Comprobación en Chrome headless (perfil temporal propio, solo se terminó su proceso), 375×812,
`dist/client`, clics y teclas reales por CDP. DOM de los 5 rangos tras cada paso; el ida/vuelta
de modo vuelve a renderizar los rangos desde el estado, así que prueba que estado = DOM
(`quoteFormData` envía `values.range`):

```
clic 1 en rango 0              X----
clic 2 en rango 0 (desmarca)   -----
clic 3 en rango 0 (marca)      X----
clic en rango 2 / 2º clic      --X-- / -----
clic en rango 1 → monto → rango   -X---   (estado conservado)
2º clic rango 1 → monto → rango   -----   (estado vacío)
Space rango 3: marca/desmarca/marca   ---X- / ----- / ---X-
ArrowRight → rango 4           ----X
Space rango 4 (desmarca) → monto → rango   -----
```

Menores: ninguno tocado (scrollbar del `<dialog>` y salto de línea de "Rango aproximado" son
cosméticos y no son baratos/seguros sin riesgo de regresión).

`./init.ps1`: VERDE (toolchain, install, estado, check:ds, check:arch, astro check, build).
