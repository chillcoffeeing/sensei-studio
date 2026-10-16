# Verify EXTRACT-C — vuelta 1
Resultado: VERDE

Método: build de referencia `before/client` (scratchpad de la sesión, 01:17:55, tomado justo antes
del primer archivo de EXTRACT-C a las 01:18:03) contra el `dist/client` actual. Se compararon tres
cosas: (1) el HTML estático normalizado (hashes de `/_astro`, `uid`, `astro-xxxx`, `<!---->`);
(2) Chrome headless real con perfil temporal propio contra los dos builds servidos en estático, con
el DOM hidratado normalizado y pruebas de comportamiento a 1440 (puntero) y 375 (táctil);
(3) capturas byte a byte. Chrome se cerró por PID; los servidores también.

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [Informe] `progress/impl_EXTRACT-C.md` › "Comprobación del HTML generado" dice que el `<script>` del
  video "cambia de posición en el `<head>`". En realidad está en el `<body>`: antes iba como hermano
  justo después de `</section id="inicio">` y ahora va dentro de esa sección, después de
  `[data-background-layer]`. No tiene efecto: es `type="module"` (diferido), se queda en
  `display:none` y en el CSS generado no hay combinadores `+`/`~` ni `>*` que afecten al hero
  (solo `.collapsible>*`, `.stack-layers>*` y `*:`). Hay que corregir la frase del informe; el código no.
- [Nombres] `src/modules/hero/HeroBackgroundVideo.astro` y `HeroWordmark.astro` se llaman igual que
  los tipos públicos `HeroBackgroundVideo` y `HeroWordmark` de `hero/schema.ts`, exportados en
  `hero/index.ts:2`. El informe lo justifica y no hay colisión real porque `Section.astro` no importa
  esos tipos. Aun así, al leer cuesta saber si se habla del componente o del tipo. Es opcional. No bloquea.

## Verificado sin hallazgos
- **V1**: `./init.ps1` en VERDE (toolchain, install, estado con 1 in_progress, check:ds, check:arch, astro check, build).
- **HTML estático** (`index.html`, `proyectos/origen/index.html`, `componentes/index.html`): idéntico,
  salvo la posición del `<script>` del video (ver Menores) y los marcadores `<!---->` de Svelte en el SSR
  del modal. Las listas de `<script type="module">` de las dos páginas tienen los mismos hashes y el
  mismo orden. `BEgijcn4.js` es el mismo módulo con otro nombre de entrada. `QuoteDialog` cambia de
  hash porque se recompila con los nuevos límites de componente.
- **DOM hidratado** (sin comentarios ni atributos de isla), igual antes y después a 1440 y a 375:
  `header`, `#contacto`, la sección de equipo, el diálogo de cotización (al abrir y después de las
  interacciones) y todo el `<main>` de `/proyectos/origen/`. En el hero solo cambia la posición del `<script>`.
- **Video de fondo**: `[data-background-video]` dentro de `[data-background-layer]`, `muted`,
  reproduciéndose (`paused:false`, `currentTime>0`, `readyState 4`) a 1440 y a 375 en los dos builds.
- **Barra flotante anclada a `[data-page-hero]`** (home y origen, 375 y 1440): al inicio está
  `absolute` con su borde inferior 24 px (home 1440) o 16 px (resto) por encima del borde inferior
  del hero; al hacer scroll pasa a `fixed` (top 12); al volver arriba vuelve a `absolute`. Las
  coordenadas son iguales en los dos builds.
- **Explorar resultados** (origen 375/1440): `#resultados` queda a top 0, recibe el foco, el hash se
  actualiza y hay scroll. Igual en los dos builds.
- **TeamCard** (1440, puntero): en reposo, la capa de reposo tiene opacidad 1 y la de detalle 0; con
  hover se invierten. El typewriter avanza: los `data-team-type` pasan de longitudes parciales a
  completas (42,32,26,202) en los dos builds. La diferencia de ±1 carácter en el muestreo temprano es
  jitter de tiempo. A 375 (táctil) el DOM de equipo es idéntico.
- **Header**: el nav de escritorio muestra Studio, Proyectos y Cotización (con `data-quote-open`) y
  abre el modal. Menú móvil (375): el toggle pasa a `aria-expanded=true`, el panel es visible y el
  foco va a "Cerrar". Con Escape vuelve a `false` y el foco vuelve al toggle. Desde el menú, Cotización abre el modal.
- **Modal de cotización** (375 y 1440, igual en los dos builds):
  - Con el envío vacío, el foco va a `services`. Con un servicio elegido, el modo "Monto máximo
    fijo" y `abc`, el foco va a `#quote-max`, que queda con `aria-invalid="true"` y
    `aria-describedby="quote-max-error"`, con el error "Escribe el monto solo con números.". La
    etiqueta es "Monto máximo (USD)".
  - Al corregir el monto a 5000, el foco va a `#quote-idea`. Al escribir "corta" sale el mensaje de
    mínimo de 20 caracteres. Con un texto válido desaparece el error y queda
    `aria-describedby="quote-idea-hint quote-idea-helper"`.
  - Objetivos: es un `role=group` con `aria-labelledby="quote-goals-title"` y 5 opciones. Al
    hacer clic se marca la opción.
  - Si se cambia a rango y se vuelve a monto, el valor 5000 se conserva. Escape cierra el diálogo.
- **Capturas** (375; home: hero, contacto, menú, modal en monto y en objetivos; origen: mock de
  tienda): son idénticas byte a byte antes y después. Revisé el contenido de las capturas del modal y del mock.
- **V2/V3**: ninguna clase ni breakpoint cambia (el DOM es idéntico). No hay scroll horizontal (scrollWidth = viewport a 375 y 1440). A 768 y 1024 la equivalencia sale de que el marcado y las clases son idénticos.
- **V4**: los assets (video, portada, fondo de contacto, `browser-control.svg`, `plus.svg`, muestras
  de color) salen con las mismas URL y dimensiones.
- **V5**: en los 17 archivos nuevos no hay clases arbitrarias con valores, hex, `any`, `ds-allow`,
  `client:load` nuevos ni imports entre módulos. No quedan referencias a los nombres antiguos
  (`StoreBrowserBar`, `StoreMenu`, `StoreBenefits`, `StoreMobileProduct`). Cada componente nuevo tiene
  un solo consumidor y ninguno queda huérfano. No hay tokens nuevos (`tokens.css` no se tocó desde el 2026-10-08).
- **Props mínimos y ubicación**: ningún componente tiene flags ni variantes de estilo.
  - Cada pieza está en el módulo o carpeta de su único consumidor: hero, contacto y proyecto en su módulo; quote en `layout/quote/`; `HeaderNav` en `layout/`.
  - `TeamCardRest` y `TeamCardDetail` van en `shared/ui/` porque su padre vive ahí y `shared` no puede importar módulos. Está justificado y documentado como pieza interna en `docs/components.md:465`.
  - Los renombrados con prefijo `SolutionStore*` siguen la convención del módulo y están justificados.
- **Descartes**: no hay. Se justifica haber extraído `SolutionStoreBenefits` aunque es trivial. Lo acepto.
- **V6**: se conservan h1 e ids (`inicio-title`, `proyecto-titulo`), `aria-hidden` del wordmark y del
  mock, `sr-only` de pestaña nueva en los enlaces legales y `data-reveal-item` del legal (opacidad 1
  tras el reveal).
- **V7**: los archivos tocados desde la referencia coinciden con los del informe. Además está
  `docs/architecture.md`, pero solo cambia el bloque generado `arch:map` (lo regenera check:arch).
