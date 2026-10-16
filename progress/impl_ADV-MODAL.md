# impl ADV-MODAL: modal de solicitud de asesoría

Figma: fileKey `flzA0qnj6JdalFCgyB2PdI`, nodo 272:7938. Pedí `get_design_context` con screenshot y llegó completo: el fondo del home atenuado (272:7939, no se construye) y el popup 272:8117 con todos sus hijos (cabecera 272:8118, formulario 272:8128, conversación directa 272:8171). Descargué los 8 SVG del popup y los uso sin tocar. Ninguno coincide byte a byte con los de `assets/quote/`.

## Archivos

### Infraestructura común (extraída de QTE-MODAL)

- `src/layout/dialog/ModalDialog.svelte`: nuevo. Es el `<dialog>` nativo que antes vivía en `QuoteDialog`, sin cambios de comportamiento:
  - delegación por atributo (`trigger="data-…"`), que respeta los clics con modificadores;
  - ciclo del Tab, cierre con botón, Esc o backdrop (el gesto tiene que empezar y acabar fuera);
  - vuelta del foco al disparador, o al botón del menú si el disparador desaparece;
  - `width: 'lg' | 'md'`, los callbacks `onopen(trigger)` y `onclosed`, y el contenido por snippet `children(close)`.
- `src/layout/dialog/DialogIcon.svelte`, `DialogInput.svelte`, `DialogFieldError.svelte`, `DialogStatus.svelte` y `DialogSectionTitle.svelte`: movidos desde `layout/quote/` (antes `Quote*`). Solo cambian el nombre y el comentario. `DialogStatus` usa `data-form-status` en lugar de `data-quote-status`, que nadie más leía.
- `src/layout/dialog/dialog-form.ts`: nuevo. Reúne `SubmitResult`, `simulatedResult(search, param)`, `submitFormData(body, endpoint, simulate)` (sin endpoint devuelve `'unavailable'` sin tocar la red), `isEmail` y `describedBy`.
- `src/layout/dialog/dialog-data.ts`: nuevo. `Serial<T>` y `toSerial()`, sacados de `quote-data.ts`.

### Cotización (refactor, sin cambio funcional)

- `src/layout/quote/QuoteDialog.svelte`: ahora usa `ModalDialog` (`trigger="data-quote-open"`, `width="lg"`). La preselección de `data-quote-services` pasa a `onopen`.
- `src/layout/quote/quote-form.ts`: delega en `dialog-form.ts`. `simulatedResult` pasa a llamarse `simulatedQuoteResult` (el parámetro sigue siendo `cotizacion-simulada`) y reexporta `describedBy`.
- `src/layout/quote/quote-data.ts`: es un envoltorio de `toSerial`.
- `src/layout/quote/*.svelte` (16): solo cambian los imports a `../dialog/Dialog*`.

### Asesoría

- `src/layout/advice/AdviceDialog.svelte`: nuevo. Isla única con el estado, la validación, el envío y los estados.
- `src/layout/advice/AdviceHeader.svelte`: nuevo. Bloque 272:8118: fila sticky con el rótulo (`LabelMarker`) y el cierre, más el h2 y la entradilla.
- `src/layout/advice/AdviceStage.svelte` y `AdviceStageOption.svelte`: nuevos. Bloque 272:8129: `role="radiogroup"` con 2 tarjetas-radio nativas (`name="stage"`, las flechas recorren el grupo).
- `src/layout/advice/AdviceMessage.svelte`: nuevo. Bloque 272:8150: textarea opcional con la ayuda dentro de la caja.
- `src/layout/advice/AdviceContact.svelte` y `AdviceContactField.svelte`: nuevos. Bloque 272:8157: nombre y correo obligatorios, más la nota.
- `src/layout/advice/AdviceSubmitButton.svelte`: nuevo. Bloque 272:8168: píldora lima a todo el ancho.
- `src/layout/advice/AdviceChannels.svelte` y `AdviceChannelLink.svelte`: nuevos. Bloque 272:8171: WhatsApp y "Escribir por correo".
- `src/layout/advice/advice-form.ts`: nuevo. Valores, validación, `submitAdvice` (punto único de envío), `adviceFormData` y la simulación `?asesoria-simulada=`.
- `src/layout/advice/advice-data.ts`: nuevo. `AdviceData` y `toAdviceData`.
- `src/assets/advice/*.svg` (8): `close`, `stage-scratch` (sprout), `stage-project`, `radio-checked`, `arrow-up-right` (envío), `arrow-up-right-sm` (canales), `channel-whatsapp` y `channel-email`.

### Conexión, datos y docs

- `src/layout/BaseLayout.astro`: monta `<AdviceDialog client:idle>` una sola vez, después de `QuoteDialog`.
- `src/layout/Header.astro`: pone `data-advice-open` en el CTA cuando lleva `opensAdvice` y lo pasa al menú mobile.
- `src/layout/MobileMenu.svelte`: añade `cta.opensAdvice`. El CTA lleva `data-advice-open` y cierra el panel devolviendo el foco a "Menú".
- `src/modules/project-contact/ContactMeetingLink.astro`: `data-advice-open`. `schema.ts` solo cambia en el comentario.
- `src/core/site.ts`: tipos `SiteAdvice`, `AdviceStageOption`, `AdviceChannel`, `SiteChrome.advice` y `SiteHeader.cta.opensAdvice`.
- `src/content/site.ts`: copy y datos de `advice`; constantes `studioEmail` (vacía, PENDIENTE) y `adviceMailHref`. El CTA del header lleva `opensAdvice`.
- `src/styles/tokens.css`: tokens (ver abajo).
- `docs/architecture.md`: secciones nuevas "Modales (`layout/dialog/`)" y "Modal de asesoría (`data-advice-open`)". También se corrige la nota de la barra flotante.
- `docs/components.md`: filas de asesoría y de la infraestructura común. La fila de cotización se actualiza.
- `docs/design-system.md`: fila "Modales" con los tokens nuevos.
- `design/content-gaps.md`: correo del estudio (resumen 3b y P1), `advice.endpoint` (P1), y los modales en los huecos 2 y 3.
- `progress/current.md`: el plan.

## Qué abre el modal

- "Solicitar asesoría" de la barra flotante (el enganche de NAV-FLOATING-V2).
- "Agenda una reunión" del header, en desktop y en el menú mobile.
- "Agenda una reunión" del cierre de cada caso (`project-contact`).

No existe agenda ni calendario, así que pedir una reunión equivale a pedir una asesoría. Sin JS, los tres siguen enlazando a `/#contacto`.

`/links` (`StandaloneLayout`) no monta el modal porque no tiene disparadores de asesoría.

## Enlaces del pie

- **WhatsApp**: usa la misma constante `whatsappHref` que la barra y la cotización (sigue PENDIENTE: `https://wa.me/`). Lleva `target="_blank"`, `rel="noopener noreferrer"` y el aviso sr-only.
- **Correo**: `site.ts` no tiene el correo del estudio. El enlace es `mailto:?subject=Asesoría con Sensei Studio`: abre el cliente con el asunto y sin destinatario. Para completarlo basta con rellenar `studioEmail`, y queda documentado como hueco P1.

## Envío y validación

- **Sin endpoint**: `submitAdvice` devuelve `'unavailable'`, con el mismo aviso honesto que la cotización: "…aún no está disponible: tu solicitud no se ha enviado."
- **Con endpoint**: POST multipart con `stage`, `message`, `name` y `email`. Devuelve `'sent'` con 2xx y `'error'` en otro caso.
- **Obligatorios**: nombre y correo (con formato). La situación y el mensaje son opcionales: solo nombre y correo llevan `*`, y la nota de Figma dice "Sin elegir servicios ni presupuesto".
- **Errores**: aparecen tras el primer intento y se recalculan al escribir. Cada campo lleva `aria-invalid` y `aria-describedby` hacia su mensaje. El foco va al primer campo inválido y la región `role="status"` anuncia el resumen.
- **Estados**:
  - mientras envía: "Enviando…", con `aria-busy` en el form y `aria-disabled` en el botón;
  - éxito: el formulario se vacía;
  - error: el mensaje va en `red-700`.

## Tokens

- **Renombrados**: `--quote-dialog-w` pasa a `--dialog-w-lg` y `--quote-dialog-max-h` a `--dialog-max-h`, porque ahora los usan los dos modales desde `ModalDialog`. El valor no cambia.
- **Agregado**: `--dialog-w-md: min(100% - spacing×12, 40rem)`, el ancho de 640px del popup 272:8117.
- **Lo demás es nativo o ya existía**:
  - `brand-tint`, `bg-scrim`, `stone-100/200/300/400`, `red-700`;
  - `rounded-xl`, `rounded-lg`, `rounded-pill`, `size-4.5`, `min-h-12.5`;
  - los roles `text-title-lg`, `text-title-sm`, `text-label-sm`, `text-meta`, `text-caption`, `text-legal`, `text-body(-sm)`.
- No queda ningún token sin uso.

## Desviaciones de Figma (y motivo)

- **Título**: `text-title-lg` semibold con `tracking-tight` (26 → 40px) en lugar de 38px fijo. En mobile hace 2 líneas legibles.
  - Menor conocido: a 1440, cuando aparece la scrollbar del diálogo (tras errores o estado), el título cabe 15px más justo y salta a 2 líneas.
- **Cierre**: botón de 44 con el SVG de 32 (el círculo #F5F5F1 viene en el asset), por área táctil.
- **Bordes**:
  - campos y textarea en `stone-400` en lugar de #DDDED6, por contraste de control (1.4.11), igual que en la cotización;
  - tarjetas y canales en `stone-300`;
  - la tarjeta elegida en `border-ink` + `ring-1` (equivale a 1.5px sin desplazar el layout).
- **Campos**: 16px de texto en mobile para evitar el zoom de iOS, y 14px desde sm.
- **Etiquetas**: "Tu nombre *" y "Correo electrónico *" llevan el `*` `aria-hidden` y el sr-only "(obligatorio)".
- **Botón de envío**:
  - texto `text-title-sm` (17 → 19px; Figma 16) y alto mínimo 50px;
  - hover ink/paper con la flecha invertida, solo con hover real;
  - en `motion-safe`, la flecha se desplaza.
- **Canales**: alto 44 (como en Figma) y borde ink en hover.
- **Copy nuevo** (no está en Figma): nombre accesible del cierre y del textarea, mensajes de validación y de estado, y el asunto del correo.
- **Estructura**: orden de bloques, composición en una columna y jerarquía, igual que Figma. La región de estado va bajo el botón de envío.

## Responsive inferido

- **< sm (375, 320)**: el diálogo ocupa toda la pantalla (`h-dvh`) con scroll en un solo contenedor y la fila del rótulo y el cierre sticky.
  - Tarjetas de situación apiladas, en fila (icono, texto y marca; 66px de alto).
  - Nombre y correo apilados, y canales apilados.
  - Sin desborde: `scrollWidth = clientWidth` a 320 y 375.
- **sm en adelante (768, 1024, 1440)**: tarjeta centrada de 640px con `rounded-3xl` y `shadow-2xl`.
  - Tarjetas en 2 columnas con la composición de Figma: icono y radio arriba, texto debajo.
  - Nombre y correo en fila, y canales en fila.
  - A 1440×900 mide 852px y no necesita scroll. A 1024×768 hace scroll interno.
- **Motion**: la misma entrada `@starting-style` de `ModalDialog`, solo con `motion-safe`. Con reduced motion, `transition-duration: 0s` (medido).

## Comprobado

Chrome headless por CDP, con perfil temporal propio en `mkdtemp`. Solo se terminó ese proceso (`proc.kill()`). El build se sirvió desde `dist/client` con un servidor node en una tarea de fondo, detenida por su id.

- **Aperturas**: desde la barra flotante, el CTA del header en desktop, el CTA del menú mobile y "Agenda una reunión" de `/proyectos/yupa/`. El foco inicial va a "Cerrar la solicitud de asesoría".
- **Vuelta del foco**: con Esc vuelve al disparador; desde el menú vuelve a "Menú". El backdrop cierra.
- **Tab**: Shift+Tab desde el primero va a "Escribir por correo" y Tab vuelve a dar la vuelta al cierre.
- **Scroll**: `html` queda con `overflow: hidden` mientras el modal está abierto.
- **Envío**:
  - vacío: `aria-invalid` en nombre y correo, foco en el nombre y resumen anunciado;
  - correo inválido: aparece su error;
  - radio: un clic en la tarjeta la marca;
  - válido sin endpoint: aviso "no disponible";
  - simulado `sent`: "Enviando…" con `aria-busy` y `aria-disabled`, luego éxito con el formulario vacío;
  - simulado `error`: el mensaje de error.
- **Cotización (regresión)**:
  - abre desde la barra y el nav, y el foco vuelve bien;
  - en `/links` la preselección (`branding`, `email-marketing`) sigue funcionando;
  - el envío vacío lleva el foco al primer campo inválido.
- **Áreas táctiles**: ningún control mide menos de 44px de alto (radios ocultos y textarea aparte).
- **Capturas** en el scratchpad (`advshots/`): `adv-1440`, `adv-1440-errors`, `adv-1440-filled`, `adv-1024-sent`, `adv-768`, `adv-375`, `adv-375-bottom` y `adv-320`.

## init.ps1

VERDE:
- toolchain, install y estado (1 in_progress);
- check:ds (0 errores, 0 ds-allow);
- check:arch (290 archivos, 0 errores);
- astro check (0 errores; queda el hint previo de `media` en DocumentHead);
- astro build OK.
