# Verify PRJ-RESULTS — vuelta 1
Resultado: VERDE

## Bloqueantes

(ninguno)

## Mayores

(ninguno)

## Menores

- [V3] A 768px las 3 métricas siguen en una columna (`grid gap-12 lg:grid-cols-3`,
  src/modules/project/ProjectResults.astro:42) y queda media sección vacía a la derecha
  (descripciones `max-w-90`). No rompe nada; si se quiere aprovechar tablet, una opción es
  `md:grid-cols-2` o `md:grid-cols-3` con cifras más pequeñas. Solo es una sugerencia.
- [V5] `ResultsMetric` recibe `comparisonLabels` solo para pasarlo a `ResultsComparison`
  (src/modules/project/ResultsMetric.astro:7,20). Es un prop de paso, mínimo y tipado. Aceptable;
  queda anotado por si en el futuro se prefiere que `ProjectMetric` traiga sus rótulos.

## Verificado sin hallazgos

- **V1**: `./init.ps1` VERDE (exit 0). Pasan check:ds (0 ds-allow, 0 errores), check:arch
  (142 archivos, 12 módulos, 0 errores), astro check (0 errores, 0 warnings) y build
  (`/proyectos/origen/` prerenderizada).
- **Div provisional de PRJ-ROUTE eliminado**: `Section.astro` solo monta `<ProjectHero>` +
  `<ProjectResults>`. En `dist/client/proyectos/origen/index.html` hay un único
  `id="resultados"`, que es la `<section ... aria-labelledby="resultados-titulo">` real.
  No queda ningún otro elemento con ese id ni un div placeholder.
- **"Explorar resultados" → sección real**: `HeroExplore` usa `href="#resultados"` (sale del
  mismo `project.anchors.results` que el `id` de `ProjectResults`, así que no hay strings
  duplicados). Con JS hace scroll suave (instantáneo si hay reduced motion) y pasa el foco a la
  sección. Lo comprobé en navegador: al cargar `/proyectos/origen/#resultados` la vista cae en
  la sección. El header no es sticky, así que no hace falta scroll-margin.
- **V2 Estructura** (comparada con get_screenshot de 216:2878, fileKey flzA0qnj6JdalFCgyB2PdI):
  coinciden el orden y los bloques. Etiqueta "01 / Resultados" con marcador lima → h2 de 2
  líneas → descripción a la derecha, abajo (xl) → separador → 3 métricas (cifra, indicador,
  píldora antes→después, descripción) → nota con barra lima. Las desviaciones están justificadas
  en el informe y no empeoran: píldora y nota en blanco en vez de #F4F4F0 (más visibles),
  separador neutral-300, descripción a 16px, y a 1024 la intro apilada para que no se rompa
  "conectado.". La calidad visual a 1440 es igual o mejor que Figma.
- **V3 Responsive** (Chrome headless con perfil temporal propio, reduced motion forzado,
  build estático servido en local; servidor detenido por su PID): 375 (en iframe, porque
  headless tiene un ancho mínimo de ventana), 768, 1024 y 1440. Sin scroll horizontal ni
  texto cortado. A 375 el h2 ocupa 3 líneas y es legible, las cifras de 56px caben y la nota se
  envuelve con la barra lima estirada. A 1024 hay 3 columnas sin choques.
- **V4 Assets**: la sección no tiene assets de imagen. Marcador, barra y separador son
  elementos CSS con tokens. Correcto según el nodo, que solo tiene texto y rectángulos.
- **V5 Antipatrones**: sin `[..]` arbitrarios, hex, `style=`, `client:load`, `any`, `ds-allow`
  ni z-index en los archivos nuevos. Ningún import entre módulos (solo imports relativos dentro
  de `modules/project` y `@/shared/lib/motion`). Todo el copy está en
  `src/content/projects/origen.ts`, también "→", "Antes:" y "Después:". `tokens.css` solo
  agrega 3 roles `--text-project-*` (todos usados; sin `initial` ni redefinir nombres de
  Tailwind). Están documentados en design-system.md y components.md. Reutiliza `text-overline`,
  `text-meta`, `text-body`, `container-page`, `reveal-up`, `revealAll` y `countUpAll`.
- **Petición del usuario: componentes aislados, props mínimos, sin mega componentes**: se
  cumple. Hay un componente por bloque del diseño, cada uno con su comentario de nodo y su
  propio contexto:
  `ProjectResults` (orquesta la sección; props `id`, `results`),
  `ProjectSectionLabel` (`text`), `ResultsMetric` (`metric`, `comparisonLabels`, iterado con
  `.map`), `ResultsComparison` (`comparison`, `labels`) y `ResultsNote` (`text`). Ninguno tiene
  variantes, flags booleanos ni props de clase. La métrica repetida es un componente pequeño
  iterado con datos, como pide `acceptance`.
- **V6 Accesibilidad**: un solo h1 (hero) y un h2 (la sección, con `aria-labelledby`). Los
  indicadores son h3. Marcadores, barra y separador llevan `aria-hidden`. En la comparación la
  flecha es `aria-hidden` y los rótulos sr-only se leen como "Antes: 1,9% Después: 2,5%"
  (comprobado en el HTML generado). El HTML trae los valores finales y countUp/reveal no hacen
  nada con reduced motion o sin JS: `reveal-*` solo anima con `scripting: enabled` y
  `no-preference`. `parseCount` admite "−41%" (U+2212 como prefijo) y "8 h". Contraste:
  ink-muted #686868 sobre #f5f5f5 ≈ 5:1 y sobre blanco ≈ 5.6:1, ambos AA.
- **V7 Alcance**: solo se tocó lo que pide la feature: el módulo project (schema, index,
  Section y 5 componentes), el contenido de origen, 3 tokens y la documentación.
