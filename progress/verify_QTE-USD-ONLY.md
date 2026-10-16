# Verify QTE-USD-ONLY — vuelta 1
Resultado: VERDE

Cómo se verificó: el verifier ejecutó `./init.ps1` y probó la feature en Chrome headless real
por CDP, con un perfil temporal propio en el scratchpad. Al terminar se cerró solo ese
proceso (`chrome.kill()` sobre su PID, el 20000).

- **Sitio**: `dist/client`, servido por un servidor local propio.
- **Valor enviado**: el servidor reescribía al vuelo el `endpoint` del island en el HTML
  servido (`[0]` → `[0,"/__capture"]`) y capturaba el POST multipart real. Es el mismo método
  de `verify_QTE-MODAL`. No se tocó `src/` ni `dist/`.
- **Eventos**: clics, teclas (Tab, Shift+Tab, Enter, Esc, Ctrl+A) e inserción de texto reales.
- **Anchos**: 375×812, 768×1024, 1024×768 y 1440×900.

## Bloqueantes

(ninguno)

## Mayores

(ninguno)

## Menores

- [V2] El chip de moneda (`src/layout/quote/QuoteCurrency.svelte:17`) usa
  `bg-stone-100` + `border-stone-300` + `rounded-lg`. Las tarjetas de servicio, que sí se
  pueden pulsar (`QuoteServiceOption.svelte:28`), usan el mismo fondo y el mismo borde, así
  que a 375 el chip puede parecer un botón. No llega a engañar: no tiene chevron, el cursor es
  `auto`, no tiene hover, no se enfoca y no tiene rol. Opcional: quitarle el borde o el fondo
  para que se lea más claramente como texto.
- [V3] A 768 el segmentado mide 52px (44 + `p-1`) y el chip 44px. Con `items-center` quedan
  centrados y se ve bien. Solo se anota.

## Verificado sin hallazgos

- **V1**: `./init.ps1` VERDE. Pasaron toolchain, install, estado, check:ds, check:arch,
  astro check y astro build.
- **Solo USD, sin controles engañosos (375)**: en el `<dialog>` hay:
  - 0 `<select>`;
  - 0 elementos con `role=combobox`, `role=listbox` o `aria-haspopup`;
  - 0 imágenes de chevron;
  - ningún texto con EUR, MXN ni €.

  El chip es un `<p>` sin `tabindex` y sin `role`, con texto visible "USD" a 16px (14px
  desde sm) y 44px de alto. El lector de pantalla lo anuncia como "Moneda: USD" (el label va
  en sr-only). No queda ningún EUR, MXN ni `chevron-down` en `src/`, y el asset
  `src/assets/quote/chevron-down.svg` está borrado y sin referencias.
- **currency=USD enviado**: hay un único campo `name="currency"`, un `input type=hidden`
  con valor `USD`. Se capturaron 2 envíos reales y los dos llevan `currency=USD`:
  - modo máximo: `budgetMode=max`, `max=2.500`;
  - modo rango: `budgetMode=range`, `range=1000-3000`.

  Tras el envío correcto aparece el estado "¡Gracias! Recibimos tu solicitud…".
- **Monto máximo y rangos en USD**:
  - la etiqueta del campo es "Monto máximo (USD)";
  - el radiogroup de rangos se anuncia como "Rangos sugeridos (USD)";
  - la nota dice "Montos en dólares (USD) · Tu estimación, no una tarifa del estudio.";
  - el chip "USD" se ve junto a los rangos en todos los anchos (capturas a 375, 768 y 1440).
- **Foco**:
  - Tab da 45 pasos y cicla dentro del diálogo: servicios → modo → rango → idea →
    objetivos → adjunto → nombre → email → WhatsApp → enlace WhatsApp → enviar → cerrar → servicios;
  - ni el chip ni el input hidden reciben foco;
  - Shift+Tab envuelve de servicios a cerrar;
  - al abrir con Enter el foco va a "Cerrar"; con Esc el diálogo se cierra y el foco vuelve
    al disparador ("Cotizar proyecto").

  El cambio en `FOCUSABLE` (`QuoteDialog.svelte:23`, `:not([type="hidden"])`) es correcto.
- **Validación**:
  - si se envía vacío, no sale ningún POST, aparece el resumen "Revisa los campos marcados…"
    y el foco va al primer servicio;
  - con un máximo "abc" no sale ningún POST, `aria-invalid` queda en `max`, el foco va a
    `max` y se muestra "Escribe el monto solo con números.".
- **Áreas táctiles (375)**: todos los controles interactivos miden 44px o más. Los únicos
  elementos por debajo de 44 son etiquetas de texto (`Tu nombre`, `Email`, `WhatsApp`) e
  inputs `sr-only` cuyo objetivo real es la tarjeta o el label que los contiene. Nada de esto
  cambia en esta feature. Chip, segmentado e input de máximo miden 44px.
- **V3**: sin scroll horizontal en el diálogo ni en el documento a 375, 768, 1024 y 1440.
  A 1024 y 1440 el chip y el segmentado miden 44px y quedan alineados arriba.
- **V2**: la estructura de 220:926 se mantiene: mismo hueco a la derecha del segmentado. Las
  desviaciones están justificadas en el informe (sin chevron, fondo apagado, tamaño de texto
  como el resto de campos) y no empeoran la legibilidad.
- **V4**: el único asset que se quitó (chevron) ya no se usa. El resto sigue igual.
- **V5**: en los archivos tocados no hay `[..]` arbitrarios, hex, `any`, `ds-allow` ni
  `client:load`. El copy vive en `src/content/site.ts` y el tipo `QuoteCurrencyCode` en
  `core/site.ts`. No se agregaron tokens.
- **V6**: el chip no es interactivo y no lleva `aria-*` falsos. Para el lector de pantalla el
  radiogroup y el label del máximo incluyen la moneda.
- **V7 / endpoint y WhatsApp**: `site.quote.endpoint` sigue en `undefined` con su comentario
  PENDIENTE (`src/content/site.ts:196-198`). `whatsappHref` sigue en `'https://wa.me/'`
  (`src/content/site.ts:32`). Los dos coinciden con lo que dejó QTE-MODAL. El alcance se
  limita a la moneda.
