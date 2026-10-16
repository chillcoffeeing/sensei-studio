# Verify PRJ-SCOPE — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V4] `src/modules/project/ScopeTool.astro:20`: el `img` lleva `h-8 w-auto max-w-full`, y los SVG de Figma
  (`src/assets/project/tool-*.svg:1`) traen `preserveAspectRatio="none"`. Si una columna queda más estrecha que el
  logo (GitHub ≈ 90px a 32px de alto), `max-w-full` reduce el ancho pero mantiene el alto, y el logo se deforma.
  A 375px cada columna mide ≈ 101px, así que **no pasa en ningún ancho revisado** (solo por debajo de ≈ 345px).
  Propuesta: quitar `max-w-full` o añadir `object-contain` (o quitar `preserveAspectRatio="none"` del SVG). No bloquea.

## Verificado sin hallazgos
- **V1**: `./init.ps1` en VERDE (código 0): toolchain, install, estado, check:ds, check:arch, astro check y build.
- **V2 Estructura**: comparé con `get_screenshot` de 216:3127 (fileKey `flzA0qnj6JdalFCgyB2PdI`) y con una captura
  headless a 1440. Coinciden el orden, los bloques y la composición. Arriba: intro (etiqueta 05, h2 en 2 líneas,
  descripción, límites) a la izquierda y 4 entregables numerados a la derecha. Debajo: separador, Herramientas
  (3 logos con su uso) y Tecnologías (5 chips) en 2 columnas, y al final el panel de validación (titular en 2
  líneas + criterios). La sección va después de Proceso (`Section.astro:23`), como en 216:2836. Las desviaciones
  (panel blanco con radio, tamaños de texto, logos a 32px con su proporción) están justificadas en el informe y
  mejoran la legibilidad y el contraste del panel. Ninguna es un empeoramiento.
- **V3 Responsive**: capturas con Chrome headless (perfil temporal propio, reduced motion forzado) a 375 y 768
  (iframe al ancho exacto) y a 1024 y 1440. Nada se desborda ni se corta. A 375 todo va apilado, los 3 logos
  caben y los chips bajan de línea. A 768 la validación pasa a fila. Desde 1024 la intro y los entregables van en
  fila, igual que herramientas y tecnologías. No hay elementos interactivos nuevos, así que no aplica el área
  táctil.
- **V4 Assets**: `tool-figma.svg` (94×48), `tool-notion.svg` (129×48) y `tool-github.svg` (135×48) son exportaciones
  del MCP de Figma: wrapper `preserveAspectRatio="none"`, `<g id="Company logo">` y fills originales
  (`black`/`#24292E`). No están redibujados. Se importan en `src/content/projects/origen.ts:9-11` y en la captura se
  ven con su proporción.
- **Regresión ContextGoals/ProcessFlow**: los ids fijos pasan a ser props derivados (`el-proyecto-objetivos`,
  `el-proceso-flujo`). En el HTML construido no hay ids duplicados y todos los `aria-labelledby` (10) apuntan a ids
  que existen. Ya no queda ninguna referencia a `objetivos-titulo` ni a `flujo-postcompra-titulo` en `src/` ni en
  `docs/`. En la captura, el flujo de Proceso se ve igual a 375/768 (columna) y a 1440 (fila).
- **Componentes aislados / props mínimos**: `ProjectScope` (`id`, `scope`) solo coloca los bloques. Hay un
  componente por bloque (`ScopeIntro`, `ScopeTools`, `ScopeStack`, `ScopeValidation`) y uno pequeño iterado por
  cada repetido (`ScopeDeliverable` con `index` + `deliverable`, `ScopeTool` con `tool`, `ScopeTechnology` con
  `name`). Ninguno tiene variantes, props de modo/clase ni slots versátiles, y cada uno documenta su nodo de Figma.
- **V5**: en `Scope*.astro`/`ProjectScope.astro` no hay arbitrarios `[..]`, hex, `style=`, `client:load`, `any`
  ni `ds-allow`. Solo se importa del propio módulo y de `@/shared/lib/motion`. Todo el copy sale de `origen.ts`.
  No se agregaron tokens, así que no se tocó `tokens.css`.
- **V6**: hay un solo h1. La sección tiene h2 y `aria-labelledby`, y hay h3 por entregable, por columna y en
  validación. Los entregables van en `<ol>` con el número `aria-hidden`, y las listas usan `aria-labelledby`
  hacia su h3. Los logos tienen `alt` con el nombre. El separador va `aria-hidden`. `reveal-up` + `revealAll`
  respetan reduced motion (en la captura con reduced motion forzado todo se ve en su estado final).
- **V7 Alcance**: solo se tocó lo que pide `acceptance`, más los dos arreglos menores de ids (que venían de los
  verify de PRJ-CONTEXT y PRJ-PROCESS) y la fila en `docs/components.md:601`.
