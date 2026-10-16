# Verify PROJECTS-INDEX-GRID — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V7/nota] La compactación `@max-md` vive en `src/shared/ui/ProjectCard.astro:54-74`, así que afecta a cualquier ProjectCard de menos de 448 px, no solo a /proyectos/ (también `project-next`, `links/LinksExplore` y /componentes, cuando son estrechas). Es coherente con el objetivo de que la card no se estire y está documentado en `docs/components.md`. Solo se anota para tenerlo en cuenta en esas vistas.
- [V3/nota] A 768 con hover, el bloque glass de la 1.ª card (YUPA, categoría en 2 líneas) mide 210 px en una card de 235 px y queda a 8 px del borde superior. Cabe y se lee bien, pero va justo. Si en el futuro llega una categoría de 3 líneas, conviene volver a medir.

## Verificado sin hallazgos
- **V1**: `./init.ps1` → "VERDE: todo en orden" (check:ds, check:arch, astro check y build en OK).
- **Rejilla (Chrome headless + CDP, build actual servido con `astro preview`)**:
  - 375: 1 columna (`343px`), 4 cards de 343×236, scrollWidth = 375.
  - 768: `342px 342px`, 2×2 sin huecos (filas y=314 y y=576), gap 20 / 26.6.
  - 1024: `462px 462px`, 2×2, gap 20 / 31.0. **Idéntico a la home** (462×318, gap 20 / 31.0).
  - 1440: `650px 650px`, 2×2, gap 20 / 38.0. **Idéntico a la home** (650×447, gap 20 / 38.0).
  - Sin scroll horizontal en ningún ancho. Todas las cards mantienen 650:447 (1.454), también con hover.
- **Número impar** (simulado quitando un `li` y aplicando las clases que genera `featuredFirst`, `Section.astro:19,44`): la 1.ª card ocupa las 2 columnas en 2:1 (704×352 a 768, 944×472 a 1024, 1320×660 a 1440) y las otras 2 forman una fila completa. No queda ninguna card huérfana. La decisión es la misma que en la galería de la home y está justificada en el informe. Con 1 proyecto no se aplica (`cards.length > 1`), así que se ve 1 card a media columna. Es aceptable.
- **Hover a media columna** (puntero fino forzado): a 768 el detalle compacto (título sobre categoría, 2 métricas y botón de 44 px) cabe en las 4 cards sin estirarlas: glass de 192–210 px en cards de 235 px. Las capturas de YUPA, REMITTVEN y CAPPI XTREMO se leen bien. A 1024 (462 px, ≥448) se muestra el detalle completo con 3 métricas, legible y sin desbordar (206–223 px en 318). A 1440, 3 métricas dentro de 447 px.
- **Mobile/táctil** (hover:none, pointer:coarse a 375 y 768): solo el estado inicial (imagen y "Ver proyecto" de 44 px). Las métricas tienen `display:none`, la pill está oculta y el título queda sr-only. Captura `proyectos-375-touch` correcta.
- **V2**: estructura sin cambios (SectionHeader con h1 y luego la lista de cards). Sigue sin nodo de Figma; solo se reutilizan piezas de shared/ui.
- **V4**: las mismas imágenes de proyecto. `sizes` coherente con los anchos medidos (50vw−42 en md, 50vw−50 en lg y 650 en 2xl).
- **V5**: sin `[..]` arbitrarios, hex, `client:load`, `any` ni `ds-allow` en los archivos tocados. Sin imports entre módulos. `tokens.css` no cambia (no hay `initial` ni redefiniciones). Se reutilizan `--projects-row-gap`, `--section-head-gap` y `project-card-wide`. `@container` y `@max-md` son nativos de Tailwind v4.
- **V6**: un h1 en la página y un h2 por card. Las transiciones siguen con `motion-safe:`. El botón mide ≥44 px (`min-h-11`) también en modo compacto.
- **V7**: los cambios se limitan a project-index, ProjectCard, ProjectCardMetric, LinkButtonPaper y la documentación.
