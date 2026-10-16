# Verify PRJ-ROUTE — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V6] `src/modules/project/Section.astro:15`: el destino provisional `<div id="resultados">` está vacío; al pulsar "Explorar resultados" el foco cae en un div sin contenido (con `tabindex=-1`). Es aceptable como puente y está documentado; PRJ-RESULTS debe sustituirlo por la `<section id="resultados">` real y borrar el div.
- [V2] En la 375 la categoría "IDENTIDAD × E-COMMERCE × AUTOMATIZACIÓN" se parte en dos líneas y la promesa ocupa 4. Se lee bien y no se corta; solo es una nota de ritmo.

## Verificado sin hallazgos
- **V1**: `./init.ps1` en VERDE (toolchain, install, estado, check:ds, check:arch, astro check, build). Se genera `dist/client/proyectos/origen/index.html`.
- **V2 Estructura** (Figma `flzA0qnj6JdalFCgyB2PdI` 216:2837, get_screenshot a 1440 comparado con la captura headless a 1440): mismo orden y composición. Header del sitio arriba. Fila con volver y estado. h1 "Origen®", categoría, y abajo a la izquierda promesa en 2 líneas, descripción y "Explorar resultados". A la derecha la ficha de 3 datos con filetes. Debajo, el acento lima. Las desviaciones (sombra más densa por contraste AA, header de 52px reutilizado, píldora `bg-scrim` con blur, 16px en el control) están justificadas en el informe y no empeoran nada.
- **V3 Responsive**: capturas con Chrome headless servido desde `dist/client`, a 1440, 1024 y 768, más 375 dentro de un iframe porque Chrome no baja la ventana de ~500px. Sin scroll horizontal. A 375/768 todo queda apilado y la ficha va a ancho completo o con `max-w-80`. A 1024+ el resumen queda en fila. Volver y explorar tienen `min-h-11` (44px).
- **V4 Assets**: `src/assets/project/origen-cover.jpg` (JPEG real de 1376×768) se usa vía `<Picture>` con avif/webp/jpg, `object-cover` y encuadre mobile al 68%. `arrow-down.svg` (18×18) va en el círculo lima con width/height intrínsecos. Ambos salen de los nodos.
- **V5 Antipatrones**: sin `client:load`, `any`, `ds-allow` ni `style=` en los archivos nuevos. Sin hex/arbitrarios en `.astro` (check:ds verde). Todo el copy está en `src/content/projects/origen.ts`; los componentes solo reciben props. El módulo `project` importa solo de `@/core` y de sí mismo, y `content/` y `pages/` entran por `src/app/project.ts`, documentado en `docs/architecture.md`. Los tokens nuevos (`--text-project-name`, `--text-project-claim`, `--project-cover-min-h|gap|focus|shade|shade-sm`) se usan todos en `ProjectHero.astro`. No se redefine ningún nombre de Tailwind ni se usa `initial`.
- **Componentes aislados / props mínimos** (pedido del usuario): un componente por bloque del diseño. `HeroBackLink` (href, label, marker), `HeroStatus` (label), `HeroExplore` (targetId, explore), `HeroFacts` (label, facts) y `HeroFact` (label, value), que se repite con `.map`. `ProjectHero` recibe `hero` + `resultsId`. `Section.astro` solo ordena. No hay variantes, flags ni mega componentes.
- **V6 Accesibilidad**: un único h1 ("Origen®"). La `section` tiene `aria-labelledby` apuntando al h1. La ficha es un `<dl aria-label>` con pares dt/dd. Decorativos con `aria-hidden` / `alt=""`, la portada con `alt` descriptivo y foco visible (`outline-brand`). El scroll suave respeta `prefersReducedMotion()` y lleva el foco al destino. Las microinteracciones van con `motion-safe:`.
- **SEO**: title de 48 caracteres, description de 126, canonical `/proyectos/origen/`, `og:type=article`, y la URL está en `sitemap.xml`.
- **Navegación**: "Todos los proyectos" lleva a `/#proyectos`, y ese id existe en la home.
- **V7 Alcance**: los archivos tocados se corresponden con `acceptance` (módulo, contenido, ruta, sitemap, tokens, docs).
