# Verify UI-POLISH-01 — vuelta 1
Resultado: VERDE

Lo comprobé en navegadores reales: Playwright 1.55 con Chromium, Firefox y WebKit, a DPR 2, contra el build (`dist/server/entry.mjs`, puerto 4391). Al terminar paré el servidor por su PID. Las capturas están en el scratchpad del verifier, en `uip-shots/`.

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- **[V2] La salida del puente se pasa de cero.**
  - Dónde: `src/shared/ui/CtaBrandShape.svelte:31` y `--ease-cta-liquid` en `src/styles/tokens.css:494`.
  - Qué pasa: al soltar el hover, la misma curva con rebote lleva `scale-y` a ≈ −0.086, alrededor del 45 % de la salida. Durante unos ~100ms queda un hilo de 2-3px en el hueco antes de asentarse en 0 (se ve en el frame `slow-header-out-200.png`).
  - No bloquea: el estado final es correcto y el hilo apenas se ve.
  - Sugerencia (opcional): usar una curva sin rebote solo para la salida, por ejemplo `ease-standard` cuando no hay hover.
- **[V3] Los frames de foco con teclado en WebKit no salieron por el arnés.**
  - En WebKit, el Tab de Playwright no enfoca los enlaces por defecto. Por eso el script falló después del frame `leave`, que sí se capturó.
  - Hover, reposo y salida sí quedaron comprobados en WebKit.
  - El focus-visible quedó comprobado en Chromium: se funden y el outline brand aparece alrededor de la caja.
  - No es un defecto del producto.

## Verificado sin hallazgos
- **V1 `./init.ps1`**: VERDE, código 0. check:ds y check:arch sin errores, astro check sin errores y build OK.
- **1. Modal sin "≈ 2 min"**
  - No queda "≈ 2"/"2 min" en el diálogo, ni `duration` o `clockIcon` en `src/`. `clock.svg` está borrado.
  - La cabecera es una sola columna (h2 + entradilla, `gap-2.5`), sin hueco a la derecha, a 375, 768, 1024 y 1440 (`modal-top-*.png`).
  - El rótulo y el cierre sticky no cambiaron.
- **2. Envío con 2 piezas**
  - Es `<button type="submit">` con el texto "Solicitar cotización": píldora brand + círculo brand de 40 con `arrow-up-right`, la misma anatomía que el CTA del header.
  - Mide 238 × 44 a todos los anchos (área táctil ≥ 44).
  - Durante el envío simulado (`?cotizacion-simulada=sent`): `aria-disabled="true"`, `aria-busy` en el form, opacidad 0.7 y `cursor: progress` (`send-during.png`). Al terminar se quita `aria-disabled`. Con el formulario vacío, el envío lleva el foco al primer campo inválido.
  - Un segundo envío durante `sending` lo ignora `if (sending) return` (`QuoteDialog.svelte:105`).
- **3. Hover y focus-visible líquido**
  - **Frames**: con la transición a 0.1× (CDP `Animation.setPlaybackRate`), en header y en modal. El puente crece desde el centro del hueco y forma un cuello cóncavo de metaball a los 40-80 (`slow-*-in-040/080.png`).
  - **Escala**: pasa por 1.07/1.10 y se asienta en 1, en unos 450ms (muestras: 0.25/0 → 0.67/0.56 → 0.93/0.90 → 1.05/1.06 → 1.07/1.10 → 1.01 → 1).
  - **Al salir**: se separa de nuevo (`header-leave.png` es idéntico al reposo).
  - **Motores**: Chromium, Firefox y WebKit dan el mismo resultado: bordes limpios y sin halo.
  - **Texto nítido**: ningún ancestro del texto ni de la flecha tiene `filter` (cadena de filtros vacía). El filtro solo está en la capa `aria-hidden`.
  - **Sin layout shift**: el `boundingBox` del CTA es idéntico antes y después del hover, en header y en modal. Solo se animan `scale` y `translate`.
  - **Reduced-motion**: `transitionDuration 0s`, y `scale` pasa de `0.25 0` a `1` a los 10ms (cambio instantáneo).
  - **Táctil**: el hover está tras `can-hover:`.
  - **IDs de filtro**: únicos por instancia (`s1-s1-cta-goo`, `s3-s1-cta-goo`).
- **4. WhatsApp**
  - Usa el logo de Simple Icons `simple-icons@13.21.0` (CC0-1.0). La licencia está anotada dentro de `src/assets/floating-bar/whatsapp.svg` y en `src/content/site.ts:73`.
  - Se pinta como máscara sobre `bg-current`: 16 × 16 y `rgb(255,255,255)`, igual que el texto (15px, paper), a los 4 anchos (`wa-*.png`).
  - `circle-x.svg` está borrado.
- **5. Sin regresiones**
  - Header a 1440 sin cambios.
  - El menú móvil abre a 375 y 768, muestra el CTA de 2 piezas y se cierra con Escape (`aria-expanded` vuelve a `false`).
  - El modal abre y cierra.
  - La barra flotante aparece al pasar el hero, con "Cotizar proyecto" + "WhatsApp".
  - Sin errores de consola en la página.
- **V3**: `scrollWidth` es igual al viewport a 375, 768, 1024 y 1440. A 375 el pie del modal va apilado (WhatsApp y luego el CTA); desde 768 va en fila.
- **V4**: los assets nuevos y los sustituidos existen y se usan en su sitio. Los borrados no tienen referencias. La sustitución de WhatsApp está justificada: el original era un placeholder de Figma.
- **V5**
  - Sin `any`, sin `ds-allow` y sin arbitrarios ni hex nuevos.
  - Los `client:load` que aparecen ya existían (BaseLayout y Header), no son de esta feature.
  - El copy está en `src/content/site.ts`. No hay imports entre módulos.
  - Los tokens nuevos se usan (`--duration-cta-liquid` y `--ease-cta-liquid`), no redefinen nombres de Tailwind y no usan `initial`.
- **Componentes aislados y props mínimos**
  - `CtaBrandShape` recibe `label` e `icon`.
  - `ButtonCtaBrand` y `LinkCtaBrand` reciben `label`, `icon` (y `href` en el enlace) más los atributos nativos.
  - `QuoteSubmitButton` recibe `submit` y `sending`.
  - Ninguno es un mega componente. Están documentados en `docs/components.md` y `/componentes`.
- **V6**
  - El círculo y la capa de filtro son `aria-hidden`.
  - El foco es visible: `outline-ink` sobre fondo claro y `outline-brand` sobre ink.
  - Se respeta reduced-motion.
- **V7**
  - El alcance se ciñe a `acceptance`.
  - El endpoint y el número de WhatsApp siguen PENDIENTES: `endpoint: undefined` y `https://wa.me/`.
