# Verify QTE-CURRENCIES — vuelta 1
Resultado: VERDE

Verificado en un navegador real: Chrome headless (perfil temporal propio, solo se terminó su PID)
por CDP contra `astro preview` (build de `init.ps1`). Anchos 375 y 768 con emulación táctil
(pointer coarse); 1024 y 1440 con pointer fine. Se abrió el modal con `[data-quote-open]`.

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V3] A 1024/1440 (`lg:pointer-fine`) el select mide 36px de alto (44 con el pozo), igual que los
  segmentos de modo, y otros controles del modal (rangos 40px, objetivos 32px) ya estaban por debajo
  de 44px. Es lo que había antes y solo aplica con puntero fino, así que no es regresión ni hallazgo
  de esta feature. Lo anoto como contexto.

## Verificado sin hallazgos
- **V1**: `./init.ps1` VERDE (exit 0): toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check, build.
- **Opciones**: `<select name="currency">` ofrece `USD:USD, EUR:EUR, MXN:MXN, CRYPTO:Cripto` en ese orden, con USD por defecto en los cuatro anchos. Coincide con `src/content/site.ts:107-117` y con `QuoteCurrencyCode` en `src/core/site.ts:167`.
- **Accesibilidad**: `<label for="quote-currency" class="sr-only">Moneda</label>`. Con Tab desde el modo, el foco cae en el select (`:focus-visible`, outline solid 2px ink). Con ArrowDown la secuencia es EUR → MXN → CRYPTO y se detiene en el final. El select está dentro del trap de foco. Escape cierra y devuelve el foco al disparador. El chevron lleva `aria-hidden` y `pointer-events:none`, mide 13×13 y no tapa el texto (`pr-8`).
- **Envío**: el FormData nativo del form lleva `currency=CRYPTO` tras elegir Cripto, así que sin JS también se envía. Con JS, `quote-form.ts:112` agrega `values.currency`, que queda enlazado con `bind:value` y `bind:currency` (lo confirma la etiqueta derivada, que se actualiza).
- **Etiqueta del máximo**: "Monto máximo (USD)", "(EUR)", "(MXN)" y "(Cripto)". El aria-label del radiogroup de rangos también se actualiza: "Rangos sugeridos (Cripto)". La justificación del informe es razonable.
- **Coherencia de estilos** (valores calculados):
  - El pozo del select y el del segmentado son iguales: bg stone-100 `oklch(0.97 0.001 106.424)`, radio 8px y padding 4px.
  - La caja del select es igual a la pastilla activa del segmento: bg blanco, borde 1px stone-300 `oklch(0.869 …)` y radio 6px.
  - Foco: el outline de 2px ink es el mismo que usan los segmentos.
  - Fuente: 16px a 375 y 14px desde sm, la misma que `QuoteInput`.
  - Alto: el pozo del select y el segmentado miden lo mismo (52px a 375/768, 44px a 1024/1440) y están alineados en la misma `y`.
- **Sin valores nuevos**: no hay arbitrarios, hex, `client:load`, `any`, `ds-allow` ni `initial` en los archivos tocados. `tokens.css` no cambió.
- **Responsive**: a 375, 768, 1024 y 1440 no hay scroll horizontal en el documento ni en el diálogo, y ningún elemento sale del diálogo. A 375 todos los controles interactivos miden 44px o más (lista de pequeños vacía; el select mide 93×44). El ancho del select se mantiene estable con "Cripto" (87px desde sm).
- **Validación**: con un envío inválido (sin servicios, max "abc", sin idea ni contacto) se marcan `aria-invalid` en max, idea, name y email, el foco va al primer inválido (services) y aparece el resumen "Revisa los campos marcados…". La moneda conserva el valor elegido.
- **V4**: `src/assets/quote/chevron-down.svg` existe (13×13, nodo 220:1025) y se renderiza a 13×13 sin deformarse.
- **V2 estructura**: la fila es modo (flex-1) + moneda, con los rangos o el monto debajo y la nota al final, sin cambio de composición. La desviación de Figma (select dentro del pozo, tipo 16/14px) está justificada y se ve mejor: ahora se lee como control.
- **V7 alcance / endpoint y WhatsApp**: `endpoint: undefined` (`src/content/site.ts:209`) y `whatsappHref = 'https://wa.me/'` (`src/content/site.ts:33`) sin tocar. Siguen PENDIENTES.

Capturas (scratchpad, no versionadas): budget-375/768/1024/1440.png, focus-select-1440.png, max-cripto-1440.png.
