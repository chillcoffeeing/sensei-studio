# impl PROJECTS-INDEX-GRID — /proyectos/ en rejilla de 2 columnas

Sin nodos de Figma. Solo se reutilizan piezas de shared/ui.

## Archivos

- `src/modules/project-index/Section.astro`: el `ul` pasa de flex-col a la rejilla de la galería de la home (`grid gap-x-5 gap-y-(--projects-row-gap)`), con 2 columnas desde md (`md:grid-cols-2`). Si el número de proyectos es impar, la primera tarjeta ocupa las 2 columnas desde md con `project-card-wide`. Se ajustan los `sizes`. Ya no se aplica `lg:project-card-wide` a todas las tarjetas.
- `src/shared/ui/ProjectCard.astro`: la raíz pasa a ser `@container`. Cuando la tarjeta mide menos de 448 px (`@max-md`), el detalle de hover se compacta: título encima de la categoría y alineado a la izquierda, glass `p-2.5 gap-2` y solo las 2 primeras métricas.
- `src/shared/ui/ProjectCardMetric.astro`: prop `class?` nueva. Con `@max-md`, el relleno baja a `px-2 py-1.5`.
- `src/shared/ui/LinkButtonPaper.astro`: con `@max-md`, `py-2.5`. `min-h-11` mantiene el objetivo de 44 px. El botón solo se usa dentro de ProjectCard (y en /componentes).
- `docs/components.md`: se documentan la card estrecha y la prop `class` de ProjectCardMetric.
- `docs/architecture.md`: la nota del índice ahora describe la rejilla.

## Tokens

No se añade ni se borra ninguno. Se reutilizan `--projects-row-gap`, `--section-head-gap`, `--project-aspect(-wide)` y `project-card-wide`. Las variantes de contenedor (`@container`, `@max-md`) son nativas de Tailwind v4.

## Responsive y decisiones

- **Mobile (<768)**: 1 columna, proporción 650:447. En táctil solo se ve el estado inicial (imagen y "Ver proyecto").
- **md (768–1023)**: 2 columnas. La tarjeta mide unos 335–460 px de ancho y conserva 650:447. Es la primera vez que una ProjectCard queda tan estrecha con puntero hover.
- **lg+**: 2 columnas, igual que la home. En 2xl cada tarjeta mide 650 px.
- **Gap**: es el mismo que en la galería de la home (20 px entre columnas, `--projects-row-gap` entre filas).
- **Número impar**: la primera tarjeta va a todo el ancho y en panorámico 2:1 desde md, con el mismo criterio que la home. Así no queda una tarjeta huérfana al final y la panorámica abre la página como destacada. Con los 4 proyectos actuales la rejilla queda en 2×2 sin huecos.
- **Problema detectado al medir**: a media columna en md, el detalle de hover medía hasta 291 px dentro de una tarjeta de 230 px. La tarjeta se estiraba (alturas desiguales en la misma fila: 256, 273, 291 y 308 px). En mobile con puntero también se estiraba la 4.ª (277 px en lugar de 226).
- **Solución**: el container query de la tarjeta (`@max-md`, <448 px) compacta el detalle y deja 2 métricas. Desviación consciente: en la tarjeta estrecha se omite la 3.ª métrica. La tarjeta es un avance y el caso completo está en la página del proyecto. No afecta a las tarjetas de ≥448 px: ni a la home en md (1 columna, 689 px) ni a lg+.
- **Mediciones con CDP** (Chrome headless, puntero hover). Todas las tarjetas conservan la proporción y el detalle cabe:
  - /proyectos/ a 375: 328×226, detalle ≤205.
  - A 768: 335×230, detalle ≤210 más un margen inferior de 17.
  - A 820: 361×248.
  - A 900: 401×275.
  - A 1023: 462×318.
  - A 1024: 455×313.
  - A 1440: 643×442.
  - En la home, a 375, 768, 1024 y 1440, sin cambios de alto (la proporción se mantiene).
  - Sin scroll horizontal en ningún ancho.
- **Capturas a 768**: con hover, el detalle de Cappi se ve legible (título y categoría en una línea cada uno, 2 métricas y el botón). En táctil solo se ve "Ver proyecto".
- **Motion**: no cambia. Las transiciones siguen con `motion-safe:`.

## init.ps1

VERDE: toolchain, install, estado, check:ds, check:arch, astro check y astro build en OK ("VERDE: todo en orden").
