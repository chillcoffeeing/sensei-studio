# impl QTE-USD-ONLY: cotización solo en USD

Figma `flzA0qnj6JdalFCgyB2PdI` 220:926 (get_design_context + screenshot): caja con borde
#DDDED6, "USD" 12px y chevron-down de 13px. Es el selector de moneda.

## Archivos

- `src/core/site.ts`: nuevo tipo `QuoteCurrencyCode = 'USD'`; `QuoteBudget.currency` pasa a `{ label; code: QuoteCurrencyCode }` (sin `options` ni `icon`).
- `src/content/site.ts`: `currency: { label: 'Moneda', code: 'USD' }`; fuera EUR/MXN y el comentario PENDIENTE; fuera el import del chevron. La nota "Moneda editable · …" pasa a "Montos en dólares (USD) · Tu estimación, no una tarifa del estudio." (ya no es editable).
- `src/layout/quote/QuoteCurrency.svelte`: ya no es `<select>`: `<p>` fijo con "USD" (label "Moneda:" en sr-only) + `<input type="hidden" name="currency" value="USD">`.
- `src/layout/quote/QuoteBudget.svelte`: `currency` ya no es `$bindable` (tipo `QuoteCurrencyCode`); pasa `label`/`code` a QuoteCurrency; el radiogroup de rangos se anuncia como "Rangos sugeridos (USD)". La etiqueta "Monto máximo (USD)" no cambia.
- `src/layout/quote/quote-form.ts`: `QuoteValues.currency` y `emptyValues()` tipados como `QuoteCurrencyCode`. `quoteFormData` sigue enviando `currency=USD`.
- `src/layout/quote/QuoteDialog.svelte`: sin `defaultCurrency()`; `emptyValues(quote.budget.currency.code)`; `currency={values.currency}` (sin bind). `FOCUSABLE` excluye `input[type=hidden]`, para que el input oculto nunca cuente en el ciclo del Tab.
- `src/assets/quote/chevron-down.svg`: borrado. Ya no se usaba (el original sigue en `design/figma/assets/`).
- `feature_list.json` (in_progress) y `progress/current.md` (plan).

Endpoint (`site.quote.endpoint`) y número de WhatsApp (`whatsappHref`): sin tocar, siguen PENDIENTES.

## Decisión: dato fijo, no control (y por qué)

- Un `<select>` con una sola opción es un control que no hace nada. Sería una parada de Tab inútil y el lector de pantalla lo anunciaría como "desplegable": es engañoso.
- Si quito el control, el usuario deja de ver en qué moneda se expresan los rangos. Esos rangos van sin símbolo ("1.000 – 3.000"), así que hace falta indicarla.
- Por eso se queda el mismo hueco de la composición de Figma (a la derecha del segmentado), pero como dato:
  - sin chevron;
  - `bg-stone-100` + `border-stone-300`, el aspecto apagado de un dato de solo lectura;
  - no se enfoca;
  - `h-11`, alineado con el segmentado.
- El valor se envía igual: `quoteFormData` lo añade, y el `input hidden name="currency"` lo deja en el DOM del form.

## Desviaciones de Figma

- **Chevron eliminado**: indicaría un menú que no existe.
- **Fondo `stone-100`**: Figma es blanco con borde. Así el chip se distingue de los campos editables, que llevan borde `stone-400` y fondo `paper`.
- **Texto 16px en mobile / 14px desde sm**: igual que el resto de campos del modal, no 12px.
- **Nota del bloque reescrita**: "Moneda editable" ya no es cierto.

## Responsive

Sin cambios de layout. El chip es `shrink-0` y ocupa menos que el antiguo select (le sobraba el `pr-8` del chevron), así que a 320/375 el segmentado gana unos 20px.

## Accesibilidad / regresiones

- Ni el foco ni la validación cambian: el chip no es interactivo y el hidden queda fuera del trap.
- Áreas táctiles: no hay controles nuevos. Las alturas de 44px de QTE-MODAL v2 siguen igual.

## Tokens

Ninguno agregado ni quitado (`stone-100` y `stone-300` son nativos).

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check y astro build OK. En `dist/client/index.html` aparece `name="currency"` y la nota nueva, y no quedan EUR ni MXN.
