# Verify QTE-MODAL — vuelta 3
Resultado: VERDE

Cómo se verificó: `./init.ps1` ejecutado por el verifier y Chrome headless real por CDP.
Usé perfiles temporales propios en el scratchpad y al terminar cerré solo esos procesos
(`chrome.kill()` sobre su PID; luego comprobé que ese PID ya no existía).

- **Sitio**: `dist/client`, servido por un servidor local propio.
- **Valor enviado**: para leer lo que se envía de verdad, el servidor reescribía al vuelo el
  `endpoint` del island en el HTML servido, con el valor `/__capture`. No se tocó `src/` ni
  `dist/`. Así, el envío real (`submitQuote` → `quoteFormData`) hacía un POST multipart que yo
  capturaba y parseaba.
- **Qué se comparó**: el valor enviado con lo que se ve en pantalla (`:checked` del DOM y
  fondo calculado de cada pastilla).
- **Eventos**: clics, doble clic, toques y teclas reales (`Input.dispatchMouseEvent`,
  `dispatchTouchEvent` y `dispatchKeyEvent`).

## Bloqueantes

(ninguno)

## Mayores

(ninguno)

## Menores

- [V2] Sigue igual que en la vuelta 2 y está anotado por el implementer
  (`QuoteDialog.svelte:166`): la barra de scroll nativa del `<dialog>` corta la esquina
  redondeada desde sm. Se ve en la captura a 1440.
- [V2] A 375, "Rango aproximado" se parte en 2 líneas. Se lee bien.

## Verificado sin hallazgos

- **V1**: `./init.ps1` VERDE (código 0). Pasaron toolchain, install, estado, check:ds,
  check:arch, astro check y build.
- **Bloqueante de la vuelta 2, RESUELTO.** Lo visible y lo enviado coinciden en todos los
  caminos (`src/layout/quote/QuoteBudgetRange.svelte:16-20`). La prueba se hizo a 375×812,
  con 20 envíos reales capturados y 0 fallos. En cada caso coinciden el DOM, el fondo de la
  pastilla y el `range` del POST:

  | Camino | Resultado |
  |---|---|
  | Clic 1 | marca, envía `100-400` |
  | Clic 2 | desmarca, no envía `range` |
  | 3 clics | marca y envía |
  | Clic en r1 y luego en r3 | envía r3 |
  | Desmarcar r3 y marcar r2 | envía r2 |
  | Doble clic desde vacío | vacío en DOM y en el envío |
  | r1 marcado + doble clic en r4 | vacío en los dos |
  | r1 marcado + doble clic en r1 | r1 marcado, envía `0-1000` |
  | Tocar r0, volver a tocarlo, tocar r4 (`touch` emulado) | `X----`, `-----` y luego `----X`, envía `5000+` |
  | Teclado: Tab desde la moneda entra en el primer rango; Space marca, desmarca y vuelve a marcar | correcto en los tres |
  | Teclado: ArrowRight y luego Space | desmarca y no envía `range` |
  | Teclado: flechas desde vacío | marca y envía r2 |
  | Mixto: Space marca y el clic desmarca | vacío |
  | Mixto: clic, Space desmarca y clic | vuelve a marcar y envía |
  | Modo "Monto máximo" | sin rangos en el DOM; envía `budgetMode=max`, `max=2500` y no envía `range` |
  | Rango elegido y cambio a monto | envía solo `max` |
  | r2, monto y vuelta a rango | conserva r2 y lo envía |
  | Desmarcar, monto y vuelta a rango | vacío en los dos |
  | Cambio de modo con flechas | correcto |
  | Moneda EUR (por teclado) + rango | envía `currency=EUR` y el rango |
  | Moneda MXN + desmarcar | envía `MXN` sin `range` |

  Tras cada envío correcto, el formulario se vacía: no queda ningún rango marcado, el modo
  vuelve a rango y la moneda vuelve a USD.
- **Regresión de áreas táctiles a 375** (táctil, con un archivo adjunto): se midieron
  26 elementos y ninguno baja de 44px.
  - Cerrar: 44×44.
  - Tarjetas de servicio: 64.
  - Segmentado: 116×44.
  - Select: 81×44.
  - Rangos: ×44.
  - Objetivos: ×44.
  - "Quitar archivo": 103.5×44.
  - Inputs: 44.
  - WhatsApp: 44.
  - Enviar: 52.

  No hay scroll horizontal ni en el diálogo ni en la página.
- **Disparadores `[data-quote-open]`**:
  - en `/` (375), la barra flotante abre el modal;
  - en `/` (375), el menú mobile cierra su panel y abre el modal; con Esc el foco vuelve a
    "Menú";
  - en `/proyectos/origen/` (1440), los 3 disparadores ("Cotización", "Cotizar proyecto" y
    "Solicita una cotización") abren el modal;
  - Ctrl+clic no abre el modal.
- **Foco**: al abrir va a "Cerrar la solicitud de cotización". Con 45 Tab y 6 Shift+Tab nunca
  sale del diálogo. Al cerrar vuelve al disparador, también en los 3 casos a 1440.
- **Esc y backdrop**: Esc cierra el modal. Un clic dentro no lo cierra y un clic en el
  backdrop (1440) sí.
- **Scroll bloqueado**: con el modal abierto, `html` queda con `overflow: hidden`. Al cerrar
  vuelve a `visible` y `scrollY` no cambia.
- **Validación**: con un envío vacío, el foco va al primer servicio y el estado anuncia
  "Revisa los campos marcados…". Idea, nombre y email quedan con `aria-invalid`, y los errores
  desaparecen al rellenar.
- **Estados de envío**:
  - Sin endpoint: avisa "…aún no está disponible…" y conserva los datos.
  - `=error`: mientras envía, `aria-busy=true`, `aria-disabled=true` y "Enviando…". Después
    muestra el mensaje de error en rojo (`red-700`) y conserva los datos.
  - `=sent`: muestra el mensaje de gracias, vacía el formulario y el modal sigue abierto.
- **V2**: capturas a 375 (rango marcado: fondo `ink` con check lima) y a 1440. Mantienen la
  cabecera, las dos columnas, el orden de los bloques y el pie sticky.
- **V5**: en `src/layout/quote/` no hay hex, arbitrarios, `any`, `ds-allow` ni `client:load`.
  Las coincidencias de `[0]` son índices de arrays.
- **V7**: la vuelta 3 solo toca `QuoteBudgetRange.svelte` (el handler `onclick`), y se ciñe
  al bloqueante.
