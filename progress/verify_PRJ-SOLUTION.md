# Verify PRJ-SOLUTION — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V6] Slider de packaging: los puntos tienen un foco `outline-ink` con offset 2 que se dibuja sobre la foto (src/modules/project/SolutionPackagingSlider.astro:72). Sobre las zonas oscuras de la imagen el anillo negro se pierde. Sugerencia: anillo doble (por ejemplo `outline-paper` más `ring-ink`) o dibujarlo dentro de la píldora de glass. No bloquea porque el glass `bg-paper/40` da algo de fondo.
- [V6] Slider: la diapositiva que no se ve sigue en el árbol de accesibilidad y su `<img>` se lee al recorrer en modo lectura (src/modules/project/SolutionPackagingSlider.astro:33). El patrón APG lo permite porque cada diapositiva lleva `role="group"` con "n de total". Mejora opcional: `aria-hidden` o `inert` en las diapositivas que no están activas.
- [V6] Al pulsar un punto, `setActive(index)` se llama antes del scroll suave y después `sync` vuelve a calcular el estado en cada frame (src/modules/project/SolutionPackagingSlider.astro:118-131). Mientras dura la animación, `aria-current` puede volver un momento al punto anterior. Comprobado en headless: al terminar queda bien (`[null,"true"]`). Es cosmético.
- [V3] A 768px el panel arena del mock móvil ocupa todo el ancho y deja mucho vacío a los lados del teléfono, y las decisiones quedan debajo (src/modules/project/ProjectSolution.astro:58-62). Es coherente con mobile first. Si se quiere, la fila puede empezar en `md`.

## Verificado sin hallazgos
- **V1**: `./init.ps1` en VERDE, ejecutado por el verifier (toolchain, install, estado, check:ds, check:arch, astro check, astro build).
- **V2 Estructura**: comparado con `get_screenshot` de 216:2957. El orden es el mismo: intro (etiqueta, h2 de 2 líneas, descripción a la derecha en xl), universo de marca (lámina de identidad con paleta + slider con 2 puntos), pie, mock de escritorio en el panel bone, pie, y en fila el mock móvil sobre arena y las decisiones (etiqueta, h3, 3 ítems numerados). No se construyó 224:199. Las desviaciones del informe (padding superior, h3 a 36px, `text-xl`, `text-legal`, `neutral-300`, `shadow-xl`, `min-h-114`) están justificadas y no empeoran el resultado.
- **V3 Responsive**: Chrome headless por CDP (perfil temporal propio, PID cerrado), reduced motion activo, a 375, 768, 1024 y 1440. `scrollWidth === innerWidth` en los cuatro anchos y ningún elemento fuera del viewport. Los puntos miden 24x24 (WCAG 2.5.8). El teléfono de 282px cabe en 375. Los titulares se parten bien, no se corta nada.
- **V4 Assets**: los 7 assets nuevos están en `src/assets/project/` y se usan donde corresponde, con `object-cover` en sus contenedores de proporción fija. La segunda diapositiva reutiliza `origen-tee.jpg`, justificado porque Figma tiene 2 puntos y una sola foto, y no se inventa ningún asset.
- **V5 Antipatrones**: no hay clases arbitrarias `[..]`, hex en `.astro`, `client:*`, `any`, `ds-allow`, z-index mágico ni imports a otros módulos. El copy está en `src/content/projects/origen.ts`. En `tokens.css` no hay `--*: initial` ni se redefinen nombres de Tailwind. Los tokens nuevos se usan todos: bone 4, sand 3, olive 1, wordmark 1 y mock-title 1. Los scripts son `<script>` acotados sin isla Svelte, lo que tiene sentido para una interacción tan pequeña.
- **Componentes aislados**: hay uno por bloque (Intro, Identity, Swatch, PackagingSlider, Caption, StoreDesktop, StoreCampaign, StoreMobile, SizeOption, Decisions, Decision), cada uno con 1 a 4 props tipados. Ninguno tiene variantes de aspecto. Los repetidos (Swatch, SizeOption, Decision, Caption x2) son componentes pequeños que se iteran con datos. `ProjectSolution` solo coloca los bloques.
- **V6 Slider**: es `role="region"` con `aria-roledescription` y `aria-label`, y es enfocable con `tabindex="0"`. Las flechas del teclado desplazan el carril (comprobado: ArrowLeft vuelve a 0 y `aria-current` se sincroniza). Los puntos son `<button>` con `aria-label` "Mostrar imagen n de 2" y `aria-current`, y llevan el carril a la diapositiva (scrollLeft 648). No hay autoplay. `scrollToPosition` usa `auto` con reduced motion. Sin JS los puntos se ocultan (`scripting:flex`) y queda el scroll nativo.
- **V6 Mocks**: son `role="img"` con `aria-label` descriptivo y el interior `aria-hidden`. Dentro de los dos `role="img"` hay 0 elementos enfocables. En toda la sección solo se enfocan el carril y los 2 puntos. El CTA, las tallas y "Añadir a la bolsa" son `<span>`.
- **V6 General**: 1 h1 en la página, 1 h2 en la sección (con `aria-labelledby`) y un h3 en las decisiones. `<figure>` y `<figcaption>` en los dos bloques. El slider tiene `alt` descriptivo y las fotos de los mocks `alt=""`. Los números de las decisiones son `aria-hidden` dentro del `<ol>`. Con reduced motion, `reveal-up` deja opacity 1.
- **V7 Alcance**: los cambios se limitan a `src/modules/project/` (schema, index, Section y los componentes Solution*), `content/projects/origen.ts`, `assets/project/`, `tokens.css` y la documentación.
