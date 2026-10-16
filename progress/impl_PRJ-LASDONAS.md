# impl PRJ-LASDONAS — Caso real: Las Doñas

Figma `flzA0qnj6JdalFCgyB2PdI` frame `267:1745`. `get_metadata` del frame y `get_design_context` de
267:1761 (hero), 267:1793 (resultados), 267:1821 (contexto), 267:1869 (solución), 267:1898 (proceso),
267:1959 (alcance), 267:2025 (conclusión) y 267:2049 (contacto). Los bloques 267:1891, 267:1897 y
267:6146 están vacíos en Figma (metadata sin hijos; gris en el render).

## Archivos

- `src/content/data/projects/las-donas.json` — nuevo: PageDoc case-study (9 secciones), copy textual de Figma; `project-next.projectSlug = "yupa"`.
- `src/content/data/projects/yupa.json` — `project-next.content.projectSlug = "remittven"`.
- `src/content/data/projects/remittven.json` — `project-next.content.projectSlug = "las-donas"`.
- `src/assets/projects/las-donas/logo-seal.svg` — sello circular del hero (267:2107, SVG de Figma). Solo se quitaron los atributos de exportación de la raíz (`preserveAspectRatio="none"`, `overflow`, `style`): con `none` el `<img>` perdía la proporción y el sello salía aplastado. Trazos intactos.
- `src/assets/projects/las-donas/conclusion-florist.jpg` — imagen de conclusión (267:2026). El raw era PNG RGBA 1009×759 con esquinas redondeadas horneadas (sin transparencia útil): recortado al 3:2 del hueco (1009×673, centrado), los 20 px residuales de esquina aplanados sobre neutral-100 y guardado como JPG q85 (130 KB; el PNG pesaba 1,37 MB). También es el `ogImage`.
- `src/assets/projects/tools/hotjar.png` — logo de Hotjar (267:3732): el raw es 3840×2160; recortado a la ventana visible en Figma, ajustado a su caja de alfa y reducido a 600×156 (sin redibujar).
- `src/assets/projects/tools/google-analytics.png` — lockup de Analytics (267:3735): ajustado a su caja de alfa y reducido a 600×147.
- `src/modules/project-hero/HeroLogo.astro` — `object-contain object-left`: un logo cuadrado (el sello) quedaba centrado en la caja de `max-w-*` en lugar de alineado con el h1. Sin efecto en logos apaisados (Remittven).
- `docs/content-model.md` — línea con el ciclo de "Siguiente proyecto".
- `design/content-gaps.md` — bloque de Las Doñas (portada vacía, tres bloques de solución vacíos, textos de plantilla, correcciones).
- `feature_list.json` (`in_progress`), `progress/current.md` (plan).

## Tokens

Ninguno agregado ni eliminado.

## Decisiones y desviaciones

- **Ciclo de siguiente proyecto**: Yupa → Remittven → Las Doñas → Yupa, con `projectSlug` explícito en los tres (el orden alfabético habría dado las-donas → remittven → yupa). Verificado en el build.
- **Nombre**: Figma dice "Las doñas" en el h1; se usa "Las Doñas" (ficha, lámina y texto). Categoría normalizada a tipo oración como en Remittven.
- **Copy textual** con correcciones menores anotadas en content-gaps: semanas ("Semanas 1–2", "Semanas 3–5", "Semana 6"), punto final en dos etapas y "al instante.." → un punto. Se mantienen textuales y quedan como PUNTO A CONFIRMAR: el título de resultados incompleto ("Más regalos que llegan a"), las descripciones de las métricas 1 y 2 (copiadas de Remittven), el año 2025 de la lámina, "Semana 8" con 7 semanas de duración y las descripciones de Hotjar/Analytics que repiten el nombre.
- **Solución**: `media: []` (los tres bloques están vacíos en Figma) → la lámina ocupa la fila, como prevé el contrato.
- **Portada**: vacía en Figma → hero en tinta; la tarjeta derivada usa la imagen de conclusión.
- Sin componentes nuevos ni cambios de esquema.

## Responsive (capturas headless, reduced motion, 375 dentro de un iframe)

- 375: todo apilado, sin overflow horizontal; "Las Doñas" en dos líneas en el h1; el sello a 56 px, alineado a la izquierda; las tres herramientas caben en una fila; el flujo de fidelización pasa a vertical.
- 768: métricas en tres columnas; la ficha en dos columnas; la lámina a todo el ancho.
- 1024 y 1440: composición como en Figma; el sello a 80 px (Figma 136; tope ya existente del hero). En 1440 el título de la solución pasa a tres líneas porque su columna es más estrecha que en Figma (layout existente, sin cambios).
- Siguiente proyecto: la tarjeta de Yupa se deriva bien en todos los anchos.

## init.ps1

```
[OK] Toolchain · Dependencias · Estado (1 in_progress) · check:ds (0 errores) ·
check:arch (276 archivos, 22 módulos, 0 errores) · astro check (0 errores) · astro build
VERDE: todo en orden.
```
