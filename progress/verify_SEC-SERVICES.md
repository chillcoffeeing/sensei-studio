# Verify SEC-SERVICES — vuelta 1
Resultado: ROJO

Fuentes: Figma MCP sin cuota (`get_design_context` de `33:78` devolvió "tool call limit on the Starter plan").
Por eso se usaron `design/figma/homepage.0.txt` (31:60), la especificación de 33:78 en `design/copy/services.md`
y un recorte de `design/figma/homepage-full.png` (y 4079–5290). Prueba real en Chrome 154 headless por CDP
sobre `dist/client` (servidor estático en 127.0.0.1). `astro preview` no aceptaba conexiones desde el sandbox:
la escucha en `::1` daba EACCES. Medidas a 1440 con barra de scroll, así que el contenido mide 1305 y no 1322.

## Bloqueantes

- **[V6/acceptance "Sin JS"] El fallback `<noscript>` no funciona: sin JS, los paneles 2–4 siguen ocultos.**
  `src/modules/services/Section.astro:74` añade `[data-service-panel][hidden]{display:block!important}` sin capa.
  El preflight de Tailwind v4 declara `[hidden]:where(:not([hidden="until-found"])){display:none!important}` en
  `@layer base`. En la cascada, un `!important` dentro de una capa gana a un `!important` sin capa, así que la regla
  del noscript pierde siempre.
  - Prueba: cargué el HTML de `dist/client/index.html` sin `<script>` y con `<noscript>` desenvuelto, que es lo que
    renderiza un navegador sin JS. Resultado: `display` de los 4 paneles = `block:358 | none:0 | none:0 | none:0`.
    Con la misma regla dentro de `@layer base{…}` (mismo nivel de capa y especificidad 0,2,0 > 0,1,0), queda
    `block:358` × 4.
  - Esperado: los 4 paneles visibles sin JS. Actual: solo el primero.
  - Arreglo sugerido: `<style is:inline>@layer base{[data-service-panel][hidden]{display:block!important}}</style>`.
    También vale no usar el atributo `hidden` y ocultar con una clase o un `data-state` que la isla aplique al hidratar.
  - El test `tests/services.test.ts:100` solo comprueba que la cadena existe; no comprueba que la regla gane en la
    cascada. Conviene que el test compruebe que la regla está dentro de `@layer base`.

- **[V2] 31:29 · corte de línea del h2.** En Figma (w 522) se lee "Un equipo. Cuatro / disciplinas. Cero fricción.".
  El código muestra "Un equipo. Cuatro disciplinas. Cero / fricción." (`src/modules/services/Section.astro:66`, la
  columna usa el `max-w-764` de `SectionHeader`). La altura coincide (112 = 2 × 56), pero el texto se reparte distinto
  en las dos líneas.
  - Medida en el navegador (Google Sans Flex 500 45px, fuente cargada): "disciplinas. Cero fricción." = **523.6px**,
    "Un equipo. Cuatro disciplinas." = 616.9px y "Un equipo. Cuatro" = 376.6px. Con `max-w-522` salían 3 líneas por
    1.6px de diferencia de métricas, como dice el impl.
  - Cualquier ancho entre 524 y 616 da el corte de Figma. Arreglo: añadir un token, por ejemplo
    `--spacing-524` o `--services-title-max`, con `@figma 31:29 w 522` y `@derived +2px por las métricas de la
    fuente en el navegador`, y aplicarlo solo al h2 de servicios. Se puede pasar como prop o clase opcional de
    `SectionHeader` sin afectar a stats ni a project-gallery.

## Mayores

(ninguno)

## Menores

- [V6] `src/content/pages/home.ts:32-35`: las 12 imágenes de los paneles llevan el mismo alt,
  "Proyecto de ejemplo: sitio web de DAS – Design Anthropology School en una laptop". Describe un proyecto ajeno al
  servicio y se repite 3 veces por panel, así que un lector de pantalla lo lee 3 veces seguidas. Mientras sean
  placeholders, es mejor `alt=""` (decorativas) o un alt por servicio.
- [V6] Sin JS, cuando se arregle el bloqueante, los botones 2–4 seguirán con `aria-expanded="false"` aunque su panel
  se vea. Es aceptable en progressive enhancement, pero se puede revisar.
- [rendimiento] El atributo `props` de la `astro-island` ocupa unos 19 KB del HTML (92 KB en total), porque
  serializa los srcset avif/webp/jpg de las 12 imágenes, que son idénticas. No bloquea; cuando haya imágenes reales
  conviene revisarlo.
- [Svelte] `ServicesAccordion.svelte:30`: `triggers` no necesita `$state` porque solo guarda referencias DOM para
  `focus()`. Basta con un array plano. Es cosmético.
- [motion] El panel abierto por defecto se anima (`panel-in`, 250ms) también en la carga inicial. Está bajo el pliegue
  y respeta `motion-safe`, así que el efecto es imperceptible.
- [V2 pendiente MCP] Las separaciones internas de 33:78 (punto → título 15, descripción → lista 24,
  viñeta → texto 10, pb del panel 40, imágenes alineadas arriba con la descripción) son `@derived` sin medir.
  Hay que medirlas cuando vuelva la cuota de Figma. No cuentan como hallazgo.

## Verificado sin hallazgos

- **V1**: `./init.ps1` → `VERDE: todo en orden.` (exit 0: ds, arch, astro check, tests y build).
- **V2, medido a 1440 contra 31:60 y la especificación de 33:78**:
  - pt de la sección 140 (31:18 fin 4079 → 31:20 4219) ✓
  - cabecera → filas 70 (h2 termina en 287 y la primera fila empieza en 357) ✓
  - descripción de cabecera alineada abajo y a la derecha, 4 líneas como en Figma ✓
  - filas cerradas: Google Sans Flex 40/400, `rgb(9,9,9)`, separador `1px rgba(0,0,0,.24)` ✓
  - con una fila abierta, todas las filas a 141.6 (3.54); con todas cerradas, 171.2 (4.28) y fila de 172.2 con
    separador. El arrastre DS-001 queda resuelto con los dos estados y documentado en los tokens ✓
  - fila abierta: punto lima 18×18, título 600, descripción DM Sans 16 `#686868` de 361 de ancho, lista 14/18.11
    (1.29385) ink, viñetas 5×5 ✓
  - imágenes 187×318, radio 5, gap 17 (x 770 / 974 / 1178) y alineadas al borde derecho del contenedor ✓
  - orden de los servicios igual que en 31:51 ✓
- **Copy**: los 4 títulos, las descripciones y todas las listas coinciden literalmente con `design/copy/services.md`.
  El título 4 es el de Figma, como indica el copy. La cabecera coincide con 31:28, 31:29 y 31:30 ✓
- **V3**:
  - 375: sin scroll horizontal y sin elementos desbordados. Filas de 80px (112 en "Desarrollo Web & / Automatización
    IA", que parte en 2 líneas). Imágenes 3 × 103×175 con `sizes` exacto ✓
  - 768: filas de 110, imágenes 187×318 y el panel apilado ✓
  - 1024: filas de 122, sin desbordes ✓
  - Áreas táctiles ≥ 80px ✓
- **V4**: `open-dot.svg`, `list-bullet.svg` y `service-placeholder.png` son copias exactas de los assets de Figma
  (lo cubre un test). El placeholder `imgFrame14` es el único que hay en Figma, según `services.md`. Proporción
  187/318 con `object-cover` ✓
- **Isla Svelte 5**: runes (`$props`, `$state`, `$derived`) y `interface Props` tipada. La lógica pura está en
  `accordion.ts` con tests. La isla recibe solo datos serializables (strings, números, arrays). Las imágenes se
  optimizan en el servidor con `getImage` (avif, webp y jpg de 374w; widths 120–561) y llevan `loading="lazy"` ✓
- **Hidratación**: `client:visible` está justificado (sección bajo el pliegue y con interacción real). La isla hidrata
  al hacer scroll (sin el atributo `ssr` tras hidratar). Hay 0 `client:load` en el módulo ✓
- **Interacción probada en el navegador**:
  - estado inicial `[true,false,false,false]`
  - clic en la fila 2 → `[false,true,false,false]` con `hidden` coherente
  - segundo clic la cierra → todas cerradas
  - ArrowDown 0→1, End →3, ArrowDown da la vuelta a 0, ArrowUp →3, Home →0
  - Enter abre y Space cierra
  - foco visible: outline 2px sólido `rgb(9,9,9)` con offset 2 (`:focus-visible`)
  - Tab pasa al botón siguiente ✓
- **A11y del patrón**: `h3 > button[aria-expanded][aria-controls]`. El panel tiene `role="region"` y
  `aria-labelledby` apunta a su botón. Los ids existen y son únicos ✓
- **prefers-reduced-motion**: con `reduce` emulado, `animation-name: none`; sin emular, `panel-in` ✓
- **V5**: sin `[...]` arbitrarios, hex, `rgb()`, `any` ni `ds-allow` en `src/modules/services/`. Sin imports entre
  módulos y sin copy en componentes. `style="height: 1lh"` no usa px, así que está permitido ✓
- **V7**: el alcance se limita al módulo services, el registro, el contenido de la home, los tokens y la
  documentación generada ✓

# Vuelta 2
Resultado: VERDE

Método: el mismo de la vuelta 1. Chrome 154 headless por CDP sobre `dist/client`, servido en estático en
127.0.0.1, después de `init.ps1`. Para el caso sin JS esta vez se usó un Chrome real con
`--blink-settings=scriptEnabled=false`, en el que `matchMedia('(scripting: none)')` da true. Así se comprueba la
media query de la que depende el arreglo y no un HTML sin scripts, que seguiría con `scripting: enabled`.

## Bloqueantes

(ninguno; los 2 de la vuelta 1 quedan resueltos)

## Mayores

(ninguno)

## Menores

- Siguen abiertos los menores de la vuelta 1 que no se tocaron: alt repetido de los placeholders, `aria-expanded="false"`
  sin JS, peso de `props` de la isla, `triggers` con `$state`, animación en la carga y medidas de 33:78 sin MCP.
  No bloquean.

## Verificado sin hallazgos

- **V1**: `powershell -NoProfile -ExecutionPolicy Bypass -File ./init.ps1` → `VERDE: todo en orden.`
- **Bloqueante 1 (sin JS) resuelto.** El SSR no emite `hidden`. Los paneles 2–4 llevan `data-collapsed=""`.
  - Sin JS real (`scripting: none`), `display:offsetHeight` de los 4 paneles:
    - 1440: `block:358` × 4.
    - 375: `block:512 | 458 | 479 | 515`.
  - Con JS y antes de hidratar (`astro-island[ssr]` presente): `block:358 | none:0 | none:0 | none:0`. El CSS
    generado es `@media (scripting:enabled){.scripting\:data-collapsed\:hidden[data-collapsed]{display:none}}`.
    El tamaño antes y después de hidratar es el mismo, así que no hay salto de layout.
  - Tras hidratar (sin `ssr`): los paneles 2–4 quedan `none:0` con `hidden` y `data-collapsed`, coherente.
  - Ya no hay `<noscript>` ni reglas que compitan con el `[hidden]` del preflight.
- **Bloqueante 2 (corte del h2, 31:29) resuelto.** A 1440 (Google Sans Flex 500 45px, fuente cargada) las líneas son
  "Un equipo. Cuatro" / "disciplinas. Cero fricción.". `max-width` 570.15px (12.67em), h2 de 570×112 (2 × 56),
  igual que en Figma.
  - El corte se mantiene a 1024 (39.1px, 495×98) y a 768 (35.5px, 450×88).
  - A 375, el h2 tiene 3 líneas porque lo limita la columna de 343px, no el token.
  - El token lleva `@figma 31:29` y `@derived`.
  - `titleClass` solo aparece en el h2 de servicios. Los h2 de `proyectos` y `por-que-elegirnos` no cambian de clase.
- **Sin regresiones con JS** (mismo script de la vuelta 1):
  - estado inicial `[true,false,false,false]`;
  - clic en la fila 2 → `[false,true,false,false]` con `hidden` coherente, y el panel 2 se ve (captura);
  - segundo clic → todas cerradas, con leading 171.2 y filas de 172.2;
  - teclado: ArrowDown 0→1, End →3, vuelta →0, ArrowUp →3, Home →0, Enter abre, Space cierra;
  - foco visible: outline 2px sólido `rgb(9,9,9)` con offset 2;
  - Tab pasa al botón siguiente;
  - `reduce` → `animation-name: none`; sin emular → `panel-in`.
- **A11y**: `aria-controls` y `aria-labelledby` válidos y recíprocos en los 4. Siguen `role="region"` y `h3 > button`.
- **Medidas a 1440 sin cambios**:
  - pt 140, filas desde y 357;
  - filas cerradas de 142.6 con la primera abierta;
  - imágenes 187×318 en x 770 / 974 / 1178;
  - `scrollWidth` 1425 (viewport con barra de scroll).
- **V3**: sin scroll horizontal ni desbordes.
  - 375: botones 80/80/80/112.
  - 768: botones de 110.
  - 1024: botones de 122.
- **V5**: sin `[...]` arbitrarios, hex, `client:load`, `any`, `ds-allow` ni `noscript` en `src/modules/services` y
  `SectionHeader.astro`.
