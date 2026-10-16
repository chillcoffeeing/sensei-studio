# impl PRJ-SOLUTION: Detalle de proyecto, Solución y experiencia

Figma: fileKey `flzA0qnj6JdalFCgyB2PdI`. `get_design_context` de 216:2957 con screenshot; la respuesta
llegó completa, con todos los hijos y assets. `get_metadata` de 226:22 (slider: 1 imagen activa + 2
puntos). Para descartar una segunda foto de packaging se miró 224:219, que es la copia antigua y no se
construye: es la misma imagen (mismo md5).

## Archivos

- `src/modules/project/schema.ts`: tipos nuevos `ProjectSolution`, `ProjectIdentity`, `ProjectSwatch`(+`Tone`), `ProjectPackagingSlider`, `ProjectCaption`, `ProjectStoreDesktop`, `ProjectStoreCampaign`, `ProjectStoreMobile`, `ProjectStoreProduct`, `ProjectDecisions` y `ProjectDecision`. Se añaden `Project.solution` y `ProjectAnchors.solution`.
- `src/modules/project/index.ts`: exporta los tipos nuevos.
- `src/modules/project/Section.astro`: monta `<ProjectSolution>` después de Contexto, en el orden de 216:2836.
- `src/modules/project/ProjectSolution.astro`: nuevo. Solo coloca los bloques de la sección 216:2957 y define el reveal escalonado de la sección.
- `src/modules/project/SolutionIntro.astro`: nuevo. Encabezado 216:2958 (etiqueta, h2, descripción).
- `src/modules/project/SolutionIdentity.astro` / `SolutionSwatch.astro`: nuevos. Lámina de identidad 216:2966 y cada muestra de color 216:2974 (`<ul>` con nombre sr-only).
- `src/modules/project/SolutionPackagingSlider.astro`: nuevo. Slider 226:22 (`.astro` + `<script>` acotado, ver abajo).
- `src/modules/project/SolutionCaption.astro`: nuevo. Pie de imagen 216:2978 / 216:3010, como `<figcaption>` de su `<figure>`.
- `src/modules/project/SolutionStoreDesktop.astro` / `SolutionStoreCampaign.astro`: nuevos. Mock de navegador 216:2982 y su portada de colección 216:2995.
- `src/modules/project/SolutionStoreMobile.astro` / `SolutionSizeOption.astro`: nuevos. Mock de la ficha en móvil 216:3015 y cada talla 216:3029.
- `src/modules/project/SolutionDecisions.astro` / `SolutionDecision.astro`: nuevos. Decisiones de experiencia 216:3042 como `<ol>`, y cada decisión 216:3047 con el número derivado del orden.
- `src/content/projects/origen.ts`: copy real de Figma para `solution`, textos alternativos, etiquetas del slider y ancla `la-solucion`.
- `src/assets/project/`: `origen-packaging.jpg` (226:22), `origen-tee.jpg` (216:3019), `origen-campaign.jpg` (216:3005), `origen-tee-colors.svg` (216:3024), `browser-control.svg` (216:2984), `slider-dot-active.svg` (226:25) y `slider-dot-inactive.svg` (226:27). Todos descargados del nodo; los PNG de Figma eran JPEG, así que se guardan con extensión .jpg.
- `src/styles/tokens.css`: tokens nuevos (abajo).
- `docs/design-system.md` (grupo "Caso Origen" y roles nuevos), `docs/components.md` (fila nueva en "Fuera de la librería").
- `feature_list.json` (in_progress), `progress/current.md` (plan).

## Tokens agregados

- `--color-origen-bone` #F4F4F0: panel de la tienda, barra del navegador, mensaje de campaña y muestra "Crudo" (216:2981, 216:2974).
- `--color-origen-sand` #D9D2C6: lámina de identidad y fondo del mock móvil (216:2966, 216:3014).
- `--color-origen-olive` #51564A: muestra de paleta (216:2975).
- `--text-project-wordmark`: clamp de 64 a 121px, lh 1, peso 600 (logotipo de la lámina, 216:2970).
- `--text-project-mock-title`: clamp de 36 a 65px, lh 1.02, peso 500 (titular del mock de escritorio, 216:2999).

Se reutilizan `text-project-title`, `text-project-subtitle`, `text-overline`, `text-meta`, `text-caption`, `text-legal`, `text-body`, `text-body-sm`, `ink`, `ink-muted`, `paper`, `rounded-panel`, `container-page`, `reveal-up` + `revealAll` y las primitivas `bindSwipe`, `snapPositions`, `scrollToPosition`, `maxScroll` y `slideLabel`. También utilidades nativas: `shadow-xl`, `rounded-md`, `rounded-2xl`, `rounded-4xl`, `border-7`, `border-neutral-300`, `aspect-4/3`, `text-xl` y `text-2xl/3xl`.

## Slider de packaging

- En `shared/ui` no hay ningún slider con puntos (`ShowcaseCarousel` y `TeamSlider` son bucles con autoplay). Siguiendo la regla de un componente por slider, se crea uno propio en el módulo porque solo se usa aquí. Usa las primitivas de `shared/lib/slider` y no crea ninguna primitiva nueva.
- **Sin autoplay**: Figma no lo pide, y así no hay nada que se mueva solo ni botón de pausa que añadir (WCAG 2.2.2). Las diapositivas se pasan con swipe del dedo o arrastre del ratón (`bindSwipe`), con scroll-snap nativo y con los puntos.
- **Puntos**: son `<button>` de 24×24 (el mínimo de WCAG 2.5.8) con `aria-label` "Mostrar imagen n de total" y `aria-current="true"` en el activo. El estado visual lo da `data-active` (`group-data-active:`), que alterna las dos SVG de Figma. El scroll los mantiene sincronizados (rAF). Al pulsar uno, `scrollToPosition` desplaza en suave, o al instante con reduced motion. Sin JS los puntos están ocultos (`hidden scripting:flex`) y el carril se desplaza con el scroll nativo.
- **APG**: región con `aria-roledescription` y `aria-label`, enfocable (`tabindex="0"`, flechas del teclado). Cada diapositiva es `role="group"` con "n de total".
- **Segunda diapositiva**: Figma tiene 2 puntos pero solo una imagen. Para la segunda se usa la foto de la camiseta doblada con la etiqueta de la marca (216:3019, la del mock móvil). Es la única otra aplicación de marca del caso y no se inventa ningún asset. Si llega otra foto, basta con cambiarla en `content/projects/origen.ts`.

## Accesibilidad de los mocks

- Los mocks de escritorio y de móvil son `role="img"` con `aria-label` (alternativa textual en contenido) y el interior `aria-hidden="true"`. El botón "Explorar colección", las tallas y "Añadir a la bolsa" son `<span>`: no hay controles falsos ni nada enfocable.
- Las fotos dentro de los mocks llevan `alt=""` porque las cubre la alternativa del mock. Las fotos del slider sí son contenido y tienen `alt` descriptivo.
- Jerarquía: h2 para la sección y h3 para "Menos dudas. Más confianza al comprar.". El universo de marca y la tienda son `<figure>` con su `<figcaption>`. Los números de las decisiones son `aria-hidden` porque el `<ol>` ya numera.

## Desviaciones de Figma (y motivo)

- **Padding superior** de 64 a 100px (`pt-16 lg:pt-25`). En Figma es 0, y como la sección (fondo blanco) viene después del gris de Contexto, sin padding el h2 quedaría pegado al cambio de fondo.
- **Titular de decisiones** con `text-project-subtitle` (36px) en vez de 44px: es un h3 bajo un h2 de 52px y queda alineado con el titular del reto. Así no hace falta otro rol.
- **Título de cada decisión** a 20px (`text-xl`) en vez de 22px, y **textos de 10px** del mock (URL, envío) a 11px (`text-legal`): son utilidades nativas o roles que ya existen, y ganan legibilidad.
- **Separadores y bordes** de las tallas en `neutral-300` en vez de #DEDED9, con el mismo criterio que en PRJ-RESULTS y PRJ-CONTEXT. Sombra del mock con `shadow-xl` en lugar de la sombra propia, sin token nuevo.
- **Portada del mock**: alto mínimo de 456px (`lg:min-h-114`) en lugar de fijo. Con 65px, "Todos los días." se parte en tres líneas (también en Figma) y con alto fijo la nota inferior se salía.
- **Puntos del slider** sobre glass `bg-paper/40` + `border-paper/10` + `backdrop-blur-sm`, que equivale a rgba(255,255,255,.4) / .1 / 6px de Figma con utilidades nativas.
- **Motion añadido**: intro, universo, tienda y compra móvil entran con `reveal-up` escalonado. Con reduced motion o sin JS se ven en su estado final.

## Responsive inferido

- **375**: todo apilado. Lámina de identidad con `min-h-90` y p-6, logotipo de 64px, muestras de 36px. Slider en 4/3. Pies en columna. Mock de escritorio recompuesto: categorías ocultas, foto 4/3 arriba y mensaje debajo (`flex-col-reverse`), titular de 36px y beneficios en columna. Teléfono a tamaño real (282px) centrado en el panel arena. Las decisiones van debajo.
- **sm/md (640–1023)**: pies en fila; foto del mock en 16/9; categorías visibles desde md; beneficios en fila; panel de la tienda con p-8.
- **lg (1024+)**: universo en 2 columnas con alto de 440px; portada del mock en fila (mensaje de 468px y foto) y panel con p-15. La compra móvil pasa a fila: panel al 50% con alto de 630px y gap de 48px.
- **xl (1280+)**: intro en fila (descripción de 365px abajo a la derecha), panel móvil de 640px y gap de 80px, como en Figma.
- Revisado con Chrome headless (perfil temporal propio en el scratchpad, reduced motion forzado y iframe al ancho exacto) a 375, 768, 1024 y 1440: sin desbordes horizontales. El preview se paró con `astro preview stop`.

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check y astro build OK.
