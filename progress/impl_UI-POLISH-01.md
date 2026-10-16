# impl UI-POLISH-01: modal sin "≈ 2 min", CTA de envío en 2 piezas con hover líquido, logo de WhatsApp

Figma (fileKey `flzA0qnj6JdalFCgyB2PdI`): pedí `get_design_context` con screenshot de 220:879 (tiempo de llenado), 220:994 (envío) y 218:24 (WhatsApp). Las tres respuestas llegaron completas. El CTA del header (11:31 del archivo global) ya estaba construido en `LinkCtaBrand` y lo tomé como referencia de anatomía.

## Archivos

- `src/shared/ui/CtaBrandShape.svelte`: nuevo. Es el interior común del CTA: una capa de fondo con filtro gooey (píldora, círculo y puente) y una capa nítida encima con el texto y la flecha. El filtro SVG es propio de cada instancia (`$props.id()`).
- `src/shared/ui/ButtonCtaBrand.svelte`: nuevo. Versión `<button>` del CTA sobre superficie clara. Recibe `label` e `icon` y pasa los atributos nativos con `...rest`; con `aria-disabled` muestra `cursor-progress` y `opacity-70`.
- `src/shared/ui/LinkCtaBrand.svelte`: ahora usa `CtaBrandShape` y lleva `group/cta`. Header y menú mobile reciben el hover líquido.
- `src/layout/quote/QuoteSubmitButton.svelte`: ahora es `<ButtonCtaBrand type="submit" aria-disabled={sending…}>`. El estado de envío no cambia.
- `src/layout/quote/QuoteHeader.svelte`: quité la píldora "≈ 2 min". La cabecera queda en una sola columna (h2 + entradilla, `gap-2.5`), sin el `sm:flex-row` que dejaba el hueco.
- `src/core/site.ts`: quité `QuoteHeader.duration` y `QuoteHeader.clockIcon`.
- `src/content/site.ts`: quité el copy de duración, el reloj y su import. El icono de WhatsApp ahora es `whatsapp.svg`, con un comentario de la fuente.
- `src/assets/quote/clock.svg`: borrado, se quedó sin uso.
- `src/assets/floating-bar/circle-x.svg`: borrado, sustituido.
- `src/assets/floating-bar/whatsapp.svg`: nuevo. Es el logo de Simple Icons `simple-icons@13.21.0`, licencia CC0-1.0. Le añadí `width`/`height` de 24 y un comentario de licencia dentro del `<svg>`.
- `src/layout/FloatingWhatsAppLink.svelte`: el `<img>` pasa a ser un `<span>` de `size-4` con `bg-current` y una máscara del SVG (`mask-image` y `-webkit-mask-image`). Así toma el color del texto (paper) y el tamaño de un texto de 15px.
- `src/styles/tokens.css`: `--duration-cta-liquid` y `--ease-cta-liquid`.
- `src/content/ui-catalog.ts` y `src/pages/componentes.astro`: entradas `CtaBrandShape` (en reposo) y `ButtonCtaBrand`, más el ejemplo `quoteSubmit`.
- `docs/components.md`: fichas de `LinkCtaBrand` (actualizada), `ButtonCtaBrand` y `CtaBrandShape`; tabla de consumidores (header y modal); fila de la barra flotante.
- `docs/design-system.md`: los tokens de motion nuevos.
- `feature_list.json` (`in_progress`) y `progress/current.md` (plan).

## Cómo funciona el hover líquido

- Un elemento interactivo con `group/cta` envuelve a `CtaBrandShape`.
- **Capa de fondo**, `absolute inset-0`, `aria-hidden`, con `filter: url(#<id>-cta-goo)`:
  - una píldora (`left-0 right-11.25`) y un círculo (`right-0 size-10`), ambos `bg-brand`;
  - un puente de 32 × 28, centrado en el hueco de 5px. En reposo está a `scale-x-25 scale-y-0` y en `can-hover:group-hover/cta` o `group-focus-visible/cta` pasa a `scale-100`.
- **Filtro**:
  - `feGaussianBlur` con σ 3 y después `feColorMatrix` con alfa `10a − 4.5` (umbral 0.45, rampa de unos 0.75px, así se conserva el antialias);
  - con σ 3 el hueco de 5px sigue abierto en reposo: el alfa máximo en su centro es ≈ 0.40;
  - cuando crece el puente, el desenfoque redondea las uniones y se ve un cuello de metaball;
  - lleva `color-interpolation-filters="sRGB"` y una región de -10 %/-50 %.
- **Texto y flecha**: van en una capa hermana sin filtro, así que siempre están nítidos. La flecha se mueve `translate-x-0.5` en hover.
- **Motion**: solo cambian `scale` y `translate`, sin layout shift. La duración es `--duration-cta-liquid` (450ms) y la curva `--ease-cta-liquid`, un cubic-bezier con rebote que se pasa un poco y se asienta. Al salir, el puente se retrae con la misma curva. Las transiciones son `motion-safe:`: con reduced-motion el cambio es instantáneo (medido: `scale 1`, `transitionDuration 0s`).
- **Táctil**: sin hover (`can-hover`). Con teclado, el `focus-visible` también los funde.

## Tokens agregados

- `--duration-cta-liquid: 450ms`: duración del puente. Ninguna duración existente encajaba: `fast` y `base` son demasiado cortas para leerse como "líquido".
- `--ease-cta-liquid: cubic-bezier(0.34, 1.56, 0.64, 1)`: rebote orgánico (utilidad nativa `ease-cta-liquid`). Tailwind no trae ninguna curva con overshoot.

No quedaron tokens sin uso.

## Desviaciones de Figma (y motivo)

- **Envío del modal (220:994)**: en Figma es una píldora única de 16/600 con la flecha dentro. Ahora usa la anatomía del header (píldora de 40 a 15/500 + círculo de 40), como pide la feature. Mantengo la flecha `arrow-up-right` propia del nodo dentro del círculo.
- **Ancho en mobile**: el envío ya no ocupa todo el ancho (`w-fit`, 238px) para ser idéntico al del header. Queda alineado a la izquierda, bajo "Hablemos por WhatsApp". El área táctil es de 44px.
- **Foco**: `ButtonCtaBrand` usa `outline-ink`, porque sobre el pie claro el anillo brand no se veía. `LinkCtaBrand` sigue con `outline-brand` sobre ink.
- **Icono de WhatsApp**: Figma pone "circle-x" (218:28), que era un placeholder. Ahora es el logo real, con fuente y licencia anotadas.

## Responsive inferido

- **375**: cabecera del modal en una columna sin hueco; pie apilado (alternativa por WhatsApp, luego el CTA de 238px); barra flotante con el logo de 16px.
- **768, 1024 y 1440**: el pie es una fila con WhatsApp a la izquierda y el CTA a la derecha, sticky como antes. La cabecera es h2 + entradilla.
- Sin desborde horizontal (`scrollWidth` igual al viewport en 768, 1024 y 1440).

## Comprobación en navegadores

Usé Playwright 1.55 instalado en el scratchpad (no es dependencia del proyecto), con Chromium, Firefox y WebKit (equivalente a Safari), a DPR 2. Capturé el CTA del header y `ButtonCtaBrand` en `/componentes` en reposo, a 120ms y en hover completo, y el modal y la barra a 375:
- en los tres motores el hueco se ve abierto en reposo y se funde en hover con el cuello orgánico; texto y flecha salen nítidos y los bordes limpios, sin halo;
- logo de WhatsApp blanco y de 16px en los tres.

Nota fuera de alcance: en WebKit la fuente del título se ve más fina en todo el sitio (eje de peso de la variable). Es previo a esta feature y no lo toqué.

## Pendientes que siguen

- El endpoint del formulario y el número de WhatsApp siguen **PENDIENTES** (`https://wa.me/` en `src/content/site.ts`).

## init.ps1

VERDE:
- toolchain e install OK;
- 1 feature in_progress;
- check:ds: 0 errores;
- check:arch: 243 archivos, 0 errores;
- astro check: 0 errores y 1 hint previo (`BaseLayout.astro:87`, `media`, ajeno);
- astro build OK.
