# impl CM-PROJECT: proyectos como documentos de secciones genéricas + Yupa

Los proyectos ahora son `PageDoc` (`src/content/data/projects/<slug>.json`, plantilla `case-study`). Se pintan con el mismo `SectionRenderer` que la home, en `/proyectos/[slug]/`. Cada sección es un módulo genérico `project-*` con su esquema zod. Origen y Atlas ya no existen. Yupa es el primer caso real: el copy es el textual de Figma 243:21 (fileKey flzA0qnj6JdalFCgyB2PdI), sacado con `get_design_context` de 243:37, 243:67, 243:98, 243:146, 243:370, 243:435 y 243:505.

## Archivos

Creados
- `src/modules/project-{hero,results,context,solution,process,scope,conclusion,next,contact}/`: cada uno con `schema.ts` (zod de `headingContent` + `content`, tipos con `z.infer`), `Section.astro` (recibe `section`) e `index.ts`. Los subcomponentes del antiguo `modules/project` se movieron a su módulo y se adaptaron (`Hero*`, `Results*`, `Context*`, `SolutionCaption/Identity/Intro/Swatch`, `Process*`, `Scope*`, `ConclusionLesson`, `NextProjectCard`, `Contact*`). Nuevo: `project-hero/HeroLogo.astro` (logo opcional del cliente).
- `src/shared/ui/TextLines.astro`: venía de `modules/project`. Lo usan ahora varios módulos y los módulos no pueden importarse entre sí.
- `src/content/case-study.ts`: el microcopy común de los casos en un único sitio (volver, explorar, antes/después, separadores, "Entregable:", "Nota:", "Explorar caso", flechas y etiquetas aria).
- `src/content/parse.ts`: `parsePageDoc` y `warnOutsideTemplate`, que comparten páginas y proyectos (salen de `pages.ts`).
- `src/content/data/projects/yupa.json`: el caso Yupa.
- `src/pages/proyectos/[slug].astro`: la ruta, renderizada con `SectionRenderer`.
- `src/assets/projects/yupa/conclusion-app-mockup.png`: la imagen de conclusión de 243:507, descargada del nodo.
- `src/assets/projects/tools/{figma,notion,github}.svg` y `src/assets/case-study/{arrow-down,arrow-up-right-ink,arrow-up-right-paper,arrow-up-right-lg,flow-arrow}.svg`: los assets que ya había, movidos y renombrados. Comparé con lo que exporta el nodo y la geometría es la misma (solo cambia el redondeo o el orden de los atributos).

Borrados
- `src/modules/project/` completo: `schema.ts` con el grafo `Project`, `Section.astro`, `Project*.astro`, `ScopeValidation`, `SolutionDecision(s)`, `SolutionPackagingSlider/Dots`, `SolutionSizeOption` y todos los `SolutionStore*`.
- `src/app/project.ts`, `src/content/projects/origen.ts` (con su carpeta) y `src/pages/proyectos/[projectId].astro`.
- `src/assets/project/` completo: `origen-*`, `atlas-cover.jpg`, `browser-control.svg` y `slider-dot-*`.

Modificados
- `src/app/sections.ts`, `src/app/registry.ts` y `src/app/templates.ts`: los 9 tipos nuevos y la plantilla `case-study`.
- `src/content/projects.ts`: loader nuevo. Inyecta `ui`, valida, ordena por slug, deriva la tarjeta de `project-next` y expone `projectCard(slug)` y `projectPath(slug)`.
- `src/content/pages.ts`: usa `content/parse.ts`.
- `src/content/links.ts`, `src/modules/links/schema.ts` y `src/modules/links/LinksProjectCard.astro`: la tarjeta de /links apunta a Yupa con datos derivados (`projectCard('yupa')`). La imagen es un `MediaRef` y se pinta con `Photo`.
- `src/pages/sitemap.xml.ts`: `projectPath(project.slug)`.
- `src/core/content.ts`: comentario de `LocalImageRef`.
- `src/styles/tokens.css`: fuera `--color-origen-{bone,sand,olive}` y `--text-project-mock-title*`.
- Docs: `docs/content-model.md` (tabla ajustada a lo implementado; ver "Decisiones"), `docs/architecture.md` (sección "Casos de estudio" en lugar de la de la vista `project`; el mapa lo regenera check:arch), `docs/components.md` (filas de `project-*` y ficha de `TextLines`), `docs/design-system.md` (sin los tokens de Origen) y `design/content-gaps.md` (huecos de Yupa).
- `feature_list.json` (CM-PROJECT pasa a `in_progress`) y `progress/current.md` (plan).

## Tokens
No se añadió ninguno. Se quitaron `--color-origen-bone/sand/olive` y `--text-project-mock-title` (+ `--line-height` y `--font-weight`) porque ya no los usa nada. La paleta de identidad es ahora un dato (`identity.palette: hex[]`) y se pinta con `style="background-color: …"`. No es un token del sitio.

## Decisiones
- **Microcopy (`content.ui`)**: los componentes solo reciben `section`, así que el loader inyecta `ui` en cada sección **antes** de validar, tomándolo de `content/case-study.ts`. Así el esquema lo exige y los componentes lo leen sin `!`. El JSON no lo escribe y, si lo trae, se sustituye. El `href` de "Explorar resultados" es el ancla de la sección `project-results` del documento; si no la hay, el control no se pinta.
- **Siguiente proyecto**: la tarjeta (`card`) se deriva después de validar, a partir del hero del destino. Toma `title` como nombre, `description` como categoría y `claim` como resumen. La imagen es `cover`, o la de conclusión si no hay `cover`, o `media[0]` de la solución. El destino es `projectSlug` o, si falta, el siguiente por slug alfabético, de forma cíclica; un slug inexistente rompe el build. **Con solo Yupa la sección no se pinta**: el siguiente cíclico sería ella misma, y la "Atlas" de Figma es un caso ilustrativo que ya no existe. Lo probé con un segundo JSON temporal (`zz-prueba`, borrado después): cada caso enlaza al otro con la tarjeta derivada.
- **Campos opcionales genéricos**, pensados para Remittven y Las Doñas: `hero.logo?`, que también probé en el JSON temporal; `hero.cover?` (Yupa, Remittven y Las Doñas tienen la portada vacía en Figma y el hero queda en tinta); `solution.media[]` (puede ir vacío) y `captions?` por bloque; `results.note?`; `scope.exclusions?`, `tools.description?` y `stack.description?`; `process.route?`; `context.description?`. Todos se omiten sin dejar hueco.
- **Solución**: lámina + `media[0]` en dos columnas desde lg; el resto de `media[]` va a todo el ancho, un bloque por imagen. Sin `media[0]`, la lámina ocupa la fila: un panel gris vacío en producción parecería roto. Ya no hay slider: la "galería" es `media[]` sin interacción, así que no hace falta isla. La lámina pasa a tinta con texto blanco, como en el nuevo Figma 243:155. Desaparecen las decisiones de experiencia y los mocks de tienda, que no están en el nuevo diseño.
- **Alcance**: desaparece el bloque "Validación y continuidad", que no está en 243:435. La descripción principal pasa a `headingContent.description`.
- **Títulos**: son `ToneText` con `\n` para los saltos forzados y se pintan con `whitespace-pre-line`. Las listas `string[]` (`claim`, `concept`, `note`, `summary`) usan `TextLines`.
- **Copy**: es el textual de Figma, con estas excepciones, todas anotadas en `design/content-gaps.md`. La cabecera de la lámina dice "ORIGEN / SISTEMA DE MARCA" en los tres frames (resto de la plantilla); uso "Yupa / Sistema de marca" (PUNTO A CONFIRMAR). Corregí "SEMANAS 1" a "Semana 1" y el guion de "-85%" a "−85%". El h2 de resultados lleva una tercera línea oculta en Figma, que omito. Las descripciones de etapa se partían en Figma con " — "; el entregable va en su campo y se pinta en su línea, como antes. Las mayúsculas (estado, categoría, rótulos) son CSS y en el dato van en tipo oración. "Nota:" va en negrita delante de la nota del flujo, como en Figma.
- **Desviaciones visuales de Figma**: se mantienen los fondos de antes (`bg-neutral-100` en resultados, contexto, alcance y conclusión). "Siguiente proyecto" pasa de hueso/arena (tokens de Origen, ya borrados) a `bg-paper` con la tarjeta en `bg-neutral-100`. Las métricas van en 3 columnas desde md (antes desde lg), porque en tablet apiladas dejaban mucho vacío.
- **SEO de Yupa**: `ogType: article` y `ogImage` = la clave de la imagen de conclusión (se emite como URL absoluta). Canonical y sitemap incluyen `/proyectos/yupa/`.

## Responsive inferido
- 375: todo apilado. Ficha breve del hero bajo el resumen, estado en píldora bajo "Todos los proyectos", lámina con la paleta debajo del concepto, flujo de pasos en columna con flechas giradas y herramientas en 3 columnas.
- 768: la ficha del contexto pasa a 2 columnas, las métricas a 3, las etapas a 2 columnas y el flujo sigue en columna.
- 1024 y 1440: composición de Figma (fila hero/resumen + ficha; lámina a sangre de la fila sin `media[0]`; etapas en 4 columnas; flujo en fila).
- Lo revisé con Chrome headless a 375, 768, 1024 y 1440 (375 y 768 dentro de un iframe, porque headless no baja de unos 500px de ancho de ventana). No hay scroll horizontal. Las capturas están en el scratchpad, no en el repo. Arreglado durante la revisión: faltaba el espacio entre "Nota:" y el texto.

## init.ps1
```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[OK] check:ds   → 0 ds-allow · 0 error(es)
[OK] check:arch → 276 archivos · 22 módulos · 0 error(es)
[OK] astro check → 0 errors
[OK] astro build (rutas: /, /creditos/, /links/, /componentes/, /proyectos/yupa/, sitemap, robots)
VERDE: todo en orden.
```
