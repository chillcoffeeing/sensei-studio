# Verify PROCESS-STEPPER — vuelta 1
Resultado: VERDE

Comprobado en navegador: Chrome headless por CDP, con `user-data-dir` temporal y cerrado por su PID, contra
`astro preview` del build de `init.ps1`. Páginas: home y los 4 casos (`yupa`, `las-donas`, `remittven`,
`cappi-xtremo`), a 375, 768, 1024 y 1440. También a 320 y en reduced-motion.

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V3] Durante la entrada `reveal-up` (unos 1s, solo la primera vez), el `overflow-y-hidden` del carril
  (`src/shared/ui/StepperSlider.astro:35`) recorta por abajo la última línea mientras el paso sube desde
  `translateY`. En Yupa a 375 se vio "Hallazgos UX + mapa…" con los descendentes cortados en una captura tomada en
  mitad de la animación. Una vez terminada, el texto queda entero (medido: `textBottom` = `liBottom` = `scrollerBottom`,
  `scrollHeight` = `clientHeight`). Es transitorio. Si se quiere evitar, se puede dar un `pb` mínimo al carril o
  quitar el desplazamiento vertical del reveal mientras es slider.
- [V2] El relleno del segmento activo arranca cuando el paso cambia, a mitad del tween de 700ms, pero el temporizador de 6s
  empieza al acabar el tween. Por eso el segmento se llena unos 350ms antes de que avance el paso. No se nota al usar el
  componente.
- [V2] Después del paso 4, el autoplay vuelve al 1 recorriendo hacia atrás los 3 anchos en 700ms. Funciona bien.
  Se anota por si se prefiere otro efecto de vuelta.

## Verificado sin hallazgos
- **V1**: `./init.ps1` termina en VERDE (`check:ds`, `check:arch`, tipos y build), con código de salida 0.
- **375, un paso por vista con autoplay**: tanto en la home ("Pasos del proceso", paso de 303px) como en los 4 casos
  ("Etapas del proceso", 343px), `grid-auto-flow: column`, 4 columnas del ancho del carril y el indicador con
  `display: flex`. Con `t0` en `scrollLeft` 0 y `current` 0, a los 7.2s está en `scrollLeft` 333/375 y `current` 1 en las 5 páginas.
  Página sin scroll horizontal (`pageOverflow` 0), también a 320.
- **Stepper**: los números 01–04 van con segmentos. Los recorridos quedan llenos en lima y el activo se llena (capturas
  tap04/btnfocus). `aria-current="step"` va solo en el activo.
- **Tap en el stepper**: un toque en "04" lleva a `scrollLeft` 999 y `current` 3, y el autoplay se pausa (`data-playing` desaparece,
  `aria-live` pasa a `polite`). Se reanuda unos 3s después (`createInteractionPause`).
- **Swipe táctil**: un swipe hacia la derecha sobre el paso 4 lleva al paso 3 (666 / idx 2). El arrastre con ratón hacia la izquierda lleva al paso 4
  (999 / idx 3). El autoplay se pausa durante el gesto y vuelve a correr después.
- **Foco de teclado**: con Tab, el carril (`:focus-visible`, anillo visible) pausa el autoplay y sigue quieto 7s después.
  Con Tab hasta "02" y Enter, va al paso 2 y sigue en pausa mientras el foco está dentro. El clic con ratón no deja el
  autoplay parado (`isKeyboardFocus`).
- **Reduced-motion**: sin autoplay (`playing` false, `scrollLeft` 0 después de 7.5s) en la home y en Yupa. El tap en "03" sigue
  funcionando (salto instantáneo, `behavior: 'auto'`) y no vuelve a arrancar el autoplay.
  El relleno solo se anima con `motion-safe:`.
- **Accesibilidad**: el carril lleva `role="region"`, `aria-roledescription="carrusel"`, `aria-label`, `tabindex=0` y `aria-live`
  `off`/`polite` según el estado. Cada paso lleva `role="group"`, `aria-roledescription` "paso"/"etapa" y `aria-label`
  "Paso n de N" / "Etapa n de N". Los botones tienen nombre ("01 Paso 1 de 4", que incluye el texto visible) y 44px de alto.
- **Desde md (768, 1024, 1440), en las 5 páginas**: `grid-auto-flow: row`, columnas iguales a las de antes (2 en 768, 2 en
  1024 en la home y 4 en los casos, 4 en 1440), `scrollWidth === clientWidth`, indicador `display: none`, sin `role`,
  `tabindex` ni `aria-live` en el carril ni en los pasos, y el autoplay detenido (`layout`). Al cambiar de tamaño
  375→1024→375, los atributos se quitan y se vuelven a poner bien.
- **Sin JS**: la lista apilada de siempre (`scripting:`), sin indicador.
- **Código**: hay un solo `src/shared/ui/StepperSlider.astro`, usado por `modules/process` y `modules/project-process`
  (y por la muestra de `componentes.astro`). Se apoya en las primitivas de `shared/lib/slider` y `createAutoplay`/`bindAutoplay`.
  La única primitiva nueva es `nearestIndex`. No hay lógica duplicada en los módulos.
- **V5**: no hay arbitrarios `[..]`, hex, `client:load`, `any` ni `ds-allow` en los archivos tocados, ni imports entre módulos. El copy
  ("Pasos del proceso", "Etapa {index} de {total}"…) está en `home.json` y `case-study.ts`.
- **Tokens**: `--stepper-slide`, `--duration-stepper-interval`, `--duration-stepper-step` y `--animate-stepper-fill`
  se usan todos. No hay `--*: initial` y no se redefine ningún nombre de Tailwind.
- **V7**: el alcance se ajusta a `acceptance`. Las listas que no son pasos secuenciales (flujo posterior, objetivos, entregables)
  se quedan como estaban, con justificación en el informe.
