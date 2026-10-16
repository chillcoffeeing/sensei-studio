# impl QTE-CURRENCIES: monedas USD, EUR, MXN y Cripto + selector coherente

Figma `flzA0qnj6JdalFCgyB2PdI` 220:926 (get_design_context + screenshot): caja con borde, "USD" y
chevron-down de 13px (220:1025). Revierte QTE-USD-ONLY.

## Archivos

- `src/core/site.ts`: `QuoteCurrencyCode = 'USD' | 'EUR' | 'MXN' | 'CRYPTO'`; nuevo `QuoteCurrencyOption { value; label }`; `QuoteBudget.currency` pasa a `{ label; defaultCode; options; icon }`.
- `src/content/site.ts`: opciones en orden USD (por defecto), EUR, MXN, Cripto (`CRYPTO`); `icon` = chevron; import `quoteChevronDown`. La nota vuelve al copy de Figma: "Moneda editable · Tu estimación, no una tarifa del estudio.".
- `src/assets/quote/chevron-down.svg`: recuperado, descargado del nodo 220:1025 sin modificar (13×13). No estaba en `design/figma/assets/` pese a lo que decía impl_QTE-USD-ONLY.
- `src/layout/quote/QuoteCurrency.svelte`: vuelve a `<select name="currency">` nativo con `<label for>` sr-only ("Moneda") y chevron decorativo (`aria-hidden`, `pointer-events-none`). `value` es `$bindable`.
- `src/layout/quote/QuoteBudget.svelte`: `currency` vuelve a ser `$bindable`; `currencyLabel` derivado (etiqueta visible de la opción) para el radiogroup ("Rangos sugeridos (Cripto)") y el label del máximo.
- `src/layout/quote/QuoteBudgetMax.svelte`: `currency` es ahora la etiqueta visible (`string`), no el código.
- `src/layout/quote/QuoteDialog.svelte`: `emptyValues(quote.budget.currency.defaultCode)` y `bind:currency`.
- `src/layout/quote/quote-form.ts`: sin cambios; `quoteFormData` ya envía `values.currency` (un solo campo, no se duplica con el `name` del select porque el FormData se arma desde `values`).
- `feature_list.json` (in_progress) y `progress/current.md` (plan).

Endpoint (`site.quote.endpoint = undefined`) y `whatsappHref = 'https://wa.me/'`: sin tocar, siguen PENDIENTES.

## Coherencia de estilos (menores V2 y V3 de verify_QTE-USD-ONLY)

El selector repite la anatomía del segmentado de modo, que es su vecino de fila:
- **Pozo**: `rounded-lg bg-stone-100 p-1`, igual que el radiogroup del modo.
- **Caja interior**: `rounded-md border-stone-300 bg-paper`, la misma pastilla que el segmento activo. Se lee como "lo elegido", que es lo que muestra un select.
- **Alto**: `h-11` dentro de `p-1` = 52px, igual que el segmentado (44 + p-1). En `lg:pointer-fine` ambos bajan juntos (segmento `min-h-9`, select `h-9`) a 44px. Fila alineada en todos los anchos.
- **Hover**: `border-stone-400`, el mismo que las tarjetas de servicio.
- **Foco**: `outline-2 outline-offset-1 outline-ink`, el mismo que los segmentos.
- **Tipo**: `font-body text-body sm:text-body-sm`, igual que `QuoteInput` (16px en mobile evita el zoom de iOS al enfocar).
- Transición `duration-(--duration-fast) ease-standard` como el resto. Ningún valor nuevo.

Con esto el V2 (chip que parecía botón) desaparece: ahora sí es un control, y uno que se ve como tal.

## Etiqueta con Cripto

Se usa la etiqueta visible de la opción entre paréntesis: "Monto máximo (USD)", "(EUR)", "(MXN)", "(Cripto)". Mismo patrón para las cuatro, se lee bien en español y no promete un token concreto (la feature dice que Cripto es genérica). Al servidor viaja el código (`CRYPTO`), no la etiqueta.

## Desviaciones de Figma

- Figma es una caja blanca con borde #DDDED6 sin pozo: aquí va dentro del pozo stone-100 para casar con el segmentado y medir lo mismo (petición explícita del orquestador).
- Texto 16px / 14px desde sm en vez de 12px, como los demás campos.
- `pr-8` para el chevron en `right-3.5`.

## Responsive

Sin cambios de layout: fila `flex items-center gap-2.5`, el segmentado `flex-1 min-w-0` y el selector `shrink-0`. El ancho del select es el de su opción más larga ("Cripto", ~105px con pozo), así que no salta al cambiar. A 320px el segmentado conserva ~165px; sus etiquetas ya admiten dos líneas (`leading-tight`, `min-h-11`).

## Accesibilidad / regresiones

- Select nativo: teclado (flechas, Alt+↓), etiqueta "Moneda" asociada por `for/id`. El trap de foco ya incluye `select:not([disabled])`.
- Validación sin cambios (la moneda no se valida).
- Área táctil del select 44px (52 con el pozo).

## Tokens

Ninguno agregado ni quitado.

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check, astro build. En `dist/client/index.html` aparecen las opciones MXN/CRYPTO/Cripto, el chevron y la nota "Moneda editable".
