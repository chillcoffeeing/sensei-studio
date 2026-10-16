# Verify HEADER-POLISH — vuelta 2
Resultado: VERDE

Método: `./init.ps1` + Chromium headless (playwright-core en el scratchpad, sin tocar el proyecto)
contra `astro preview` del build recién generado, con DPR 2. Geometría medida con
`getBoundingClientRect`. La forma del CTA se mide por píxel: en cada columna de la captura se toman
el primer y el último píxel brand (224,248,64) y se calcula el alto pintado. La zona interior va
del 12% al 90% del ancho, para dejar fuera las tapas.
Para medir la transición se pausan las animaciones (`document.getAnimations()`) y se fija
`currentTime` cada 30ms entre 0 y 450ms.
Servidor de preview detenido al terminar (`astro preview stop`, solo su PID).

## Bloqueantes

(ninguno)

## Mayores

(ninguno)

## Menores

(ninguno)

## Verificado sin hallazgos

- [V1] `./init.ps1` VERDE (exit 0): toolchain, estado, check:ds, check:arch, astro check y build OK.
- [Acceptance 2] **Bloqueante de la vuelta 1 corregido.** El estado final de hover y foco es una
  sola píldora de alto parejo: en la zona interior el alto va de 39 a 40px (el 39 es antialias
  medio píxel arriba/abajo, top 8–8.5). Antes la cintura llegaba a 34px.
  El puente es un rectángulo de 48px, a right 20 y alto 40, con `scale: 1` en el estado final.
  Captura: scratchpad `pw/shots2/cta-1440-hover-final.png`.
  - Header a 1440 y 1024, hover final: 39/40.
  - Header a 1440 y 1024, foco de teclado (Tab, `:focus-visible` = true) con el outline oculto
    solo para medir: 39/40. El outline real es brand 2px con offset 2 y queda intacto.
  - /componentes, LinkCtaBrand "Agenda una reunión": hover y foco 39/40. ButtonCtaBrand
    "Solicitar cotización": hover y foco 40/40.
  - /links a 375: "Cotizar proyecto" (Link) con foco da 39/40. "Continuar cotización" (Button,
    LinksQuoteSelector) con foco da 40/40.
  - Modal de cotización, botón de envío (QuoteSubmitButton) a 375: hover y foco 40/40.
  - CTA del menú móvil a 375 con foco: 39/40.
- [Acceptance 2, transición] **Menor de la vuelta 1 corregido**: no hay sobrepaso vertical.
  En todos los fotogramas entre 0 y 450ms (1440 y 1024) el alto máximo es 40, el top mínimo es 8 y
  el bottom máximo es 47.5, igual que en reposo. El `scale` del puente va de `0 1` a `1.0966 1`
  (pico a unos 270ms) y vuelve a `1`. El rebote queda solo en X: el borde izquierdo del puente
  llega a ≈right 73px, dentro del cuerpo recto de la píldora, y no se ve.
  Hacia los 60ms se ve una cintura transitoria de 23px mientras el puente cruza el hueco. Es el
  efecto líquido buscado, y a los 120ms el alto ya está en 39/40.
- [Acceptance 2, reduced motion] Con `reducedMotion: 'reduce'`, la transición computada dura `0s`
  en las 4 capas (píldora, círculo, puente y flecha). A los 30ms del hover ya está el estado final,
  con 39/40.
- [Acceptance 1] Padding del header sin regresión en los 4 anchos: `padding-top` = `padding-bottom`
  = 12px, header de 64px y fila de 40px (top 12, bottom 52, centro 32).
  - 375 y 768: el logo (44px) y el toggle (44px) tienen el centro en 32.
  - 1024 y 1440: el logo, la nav (24px) y el CTA (44px de área táctil) tienen el centro en 32.
  - Sin scroll horizontal (scrollWidth = clientWidth en los 4 anchos y en /links a 375).
  - CLS de carga entre 0.002 y 0.010. No viene del header, que es overlay y mide 64px desde el
    primer frame.
- [Acceptance 3] El arreglo vive en el componente compartido `src/shared/ui/CtaBrandShape.svelte`
  (líneas 35-37). Se revisaron todos sus usos: header, menú móvil, /componentes, /links y el modal
  de cotización.
- [V2] Estructura sin cambios: el texto va a la izquierda y la flecha en el círculo a la derecha.
  En reposo siguen siendo dos piezas separadas por 5px.
- [V4] Sin assets nuevos ni cambiados. La flecha conserva su proporción.
- [V5/Acceptance 4] Solo usa utilidades por defecto de Tailwind (`right-5`, `w-12`, `origin-right`,
  `scale-x-0/100`, `inset-y-0`) y tokens que ya existían (`--duration-cta-liquid`,
  `--ease-cta-liquid`, `ease-standard`). Sin valores arbitrarios, sin hex y sin `ds-allow`.
  `tokens.css` no cambia.
- [V6] El foco se ve: outline brand (Link) o ink (Button) de 2px con offset 2. Área táctil
  ≥ 44px. El fondo y la flecha mantienen `aria-hidden`.
- [V7] Alcance acotado a `src/layout/Header.astro` y `src/shared/ui/CtaBrandShape.svelte`.
