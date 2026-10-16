# impl PROCESS-STEPPER — pasos en modo stepper con autoplay en mobile

Primera vuelta. La feature no tiene `figmaNodes`, así que no se consultó Figma: es un patrón de interacción nuevo sobre
secciones que ya existen.

## Qué se hizo

`shared/ui/StepperSlider.astro` es un componente nuevo y reutilizable. Envuelve **una** lista (`<ol>` en `grid`) del módulo:

- **Por debajo de md, solo con JS** (variante `scripting:`, así que no salta el layout al hidratar): la rejilla pasa a ser un carril
  de un paso por vista (`grid-flow-col` + `auto-cols-(--stepper-slide)` + scroll-snap). Debajo va un indicador con un botón por
  paso (número + segmento). Los segmentos ya recorridos van llenos, y el activo se llena mientras corre la espera
  (`animate-stepper-fill`). El autoplay avanza por pasos (lectura de 6s, desplazamiento de 700ms con `ease-standard`) y, después
  del último paso, vuelve al primero. Se puede deslizar con el dedo (`bindSwipe`) y tocar un número para saltar a ese paso.
- **Desde md** no hace nada: la rejilla del módulo queda exactamente igual, el indicador no existe (`hidden`) y el autoplay
  se pausa con el nuevo motivo `layout`. Lo comprobé a 768, 1024 y 1440 en la home y en Yupa: `scrollWidth === clientWidth`,
  sin `role` y el indicador con `display: none`.
- **Sin JS**: la lista apilada de siempre.
- **Pausa**: con el foco de teclado (en el carril o el indicador), al tocar o deslizar y al pulsar un paso (se reanuda 3s
  después, `createInteractionPause`, igual que en UI-LIB-002), con la pestaña oculta, fuera del viewport y con reduced motion (sin
  autoplay; el swipe y los botones siguen funcionando). El segmento solo se anima con `motion-safe` y mientras corre el autoplay.
- **Accesibilidad**: solo mientras es slider, el JS pone en el carril `role="region"`, `aria-roledescription` y `aria-label`, lo
  hace enfocable con `tabindex=0` y le pone `aria-live` en `off` mientras rota y en `polite` cuando está detenido. Cada paso
  lleva `role="group"`, `aria-roledescription` y "Paso n de N" (en los casos, "Etapa n de N"). Desde md se quitan todos esos
  atributos y vuelve a ser una lista. Los botones tienen nombre ("01 Paso 1 de 4": el texto visible está incluido, WCAG 2.5.3),
  el activo lleva `aria-current="step"` y miden al menos 44px de alto.
- **Sin duplicar lógica**: usa las primitivas de `shared/lib/slider` (`bindSwipe`, `createInteractionPause`, `tweenScroll`,
  `cubicBezier`, `snapPositions`, `scrollToPosition`, `readTimingMs`/`SLIDER_TIMING`, `slideLabel`) y
  `createAutoplay`/`bindAutoplay`. La única primitiva nueva es `nearestIndex`, una función pura en `gesture.ts`.

Dónde se usa:

- **Home, "El proceso"** (`modules/process`): los 4 pasos.
- **Casos, "El proceso"** (`modules/project-process`): las 4 etapas numeradas. En el pedido se llama "Proceso y automatización".

No se aplicó a:

- El **flujo posterior** de `project-process` (eventos con flechas, sin numerar). En mobile ya es una columna corta.
- Los objetivos de `project-context` ni los entregables de `project-scope`. Llevan número, pero son listas y no pasos
  secuenciales.

## Archivos

- `src/shared/ui/StepperSlider.astro` (nuevo): el componente y su `<script>`.
- `src/shared/lib/slider/gesture.ts`: añade `nearestIndex` (índice de la diapositiva más cercana).
- `src/shared/lib/slider/index.ts`: exporta `nearestIndex` y actualiza el comentario.
- `src/shared/lib/slider/timing.ts`: añade `SLIDER_TIMING.stepperInterval` y `stepperStep`.
- `src/shared/lib/motion/autoplay.ts`: añade el motivo de pausa `layout`.
- `src/styles/tokens.css`: tokens nuevos (ver abajo).
- `src/modules/process/schema.ts`: `content.stepper: sliderLabelsSchema`.
- `src/modules/process/Section.astro`: la lista va dentro de `StepperSlider`; el `mt` pasa a un contenedor.
- `src/modules/project-process/schema.ts`: `ui.stepper: sliderLabelsSchema`.
- `src/modules/project-process/Section.astro`: las etapas van dentro de `StepperSlider`, envuelto en `tone-on-ink`; los números se calculan una vez.
- `src/modules/project-process/ProcessStage.astro`: recibe `number` en vez de `index`, para no duplicar el `padStart`.
- `src/content/data/pages/home.json`: `stepper` del proceso (región "Pasos del proceso", diapositiva "paso", "Paso {index} de {total}").
- `src/content/case-study.ts`: `ui.stepper` común a los casos ("Etapas del proceso", "etapa", "Etapa {index} de {total}").
- `src/content/ui-catalog.ts` y `src/pages/componentes.astro`: ficha y muestra de `StepperSlider` sobre ink.
- `docs/components.md`: ficha de `StepperSlider`, fila de `nearestIndex` y quién lo consume.
- `docs/design-system.md`: `--stepper-slide` y `animate-stepper-fill` con sus tiempos.
- `progress/current.md`: plan.

## Tokens

- `--stepper-slide: 100%`: ancho de la columna implícita, un paso por vista. Tailwind no trae `auto-cols-full`.
- `--duration-stepper-interval: 6s`: tiempo de lectura de un paso. Las descripciones ocupan 2–4 líneas a 375; los 4s del
  equipo se quedaban cortos para leerlas.
- `--duration-stepper-step: 700ms`: desplazamiento entre pasos. Es un recorrido corto, de un ancho de pantalla.
- `--animate-stepper-fill` y `@keyframes stepper-fill`: anima `scale: 0 1 → 1 1`. Usa la propiedad `scale` para componerse
  con `scale-x-*` de Tailwind v4.

No se borra ningún token.

## Responsive inferido y desviaciones

- **375**: un paso por vista. Todas las diapositivas toman el alto de la más alta (misma fila del grid), así que el indicador
  no salta al cambiar de paso. El indicador va **debajo** del paso (`mt-8`), en una fila de 4 botones `flex-1`.
  Lo puse debajo porque cada paso ya trae su propia barra o número arriba, y un segundo indicador encima sería redundante.
  En la home queda por encima del hueco reservado para el badge.
- **768 / 1024 / 1440**: sin cambios respecto a antes (verificado con capturas).
- **Colores**: los tonos `--tone-strong` y `--tone-muted` los pone el consumidor; en el proceso de los casos los da un
  envoltorio `tone-on-ink`, para no tocar los tonos del h2. La pista es `bg-current/25` y el relleno, `bg-brand`, el mismo lima de
  las barras del proceso.
- **Excepción a "un componente por slider, sin genérico"**: `StepperSlider` es un slider con nombre propio y sin props de
  configuración, como pide la feature. Lo único que recibe son textos y marcadores.

## Comprobación en navegador (Chrome headless, `dist` servido en local)

- **375, home**: `role=region`, autoplay activo. A los 6.5s pasa al paso 2 (`scrollLeft` 333, `active` 1). Al tocar "04"
  va al paso 4 (`scrollLeft` 999), pausa (`data-playing` desaparece) y marca `aria-current="step"`.
- **375, Yupa**: el mismo comportamiento (`scrollLeft` 375 y después 1125).
- **Sin scroll horizontal de página** en los 8 casos (2 páginas × 4 anchos).

## init.ps1

`check:ds` y `check:arch` (0 errores), tipos y `astro build`: todo **VERDE**.
