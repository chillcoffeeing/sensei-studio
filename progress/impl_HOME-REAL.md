# Impl HOME-REAL: vuelta 1

Home con datos reales: la galería se deriva de los proyectos, se purgan los placeholders donde hay
pieza real y `design/content-gaps.md` queda como informe final para el cliente. No se quitó ninguna sección.

## Archivos

Creados:
- `src/shared/ui/ProjectCardCategory.astro`: pinta la categoría por segmentos " × " con `whitespace-nowrap`, así nunca parte "E-commerce" por el guion.
- `src/assets/projects/yupa/app-catalog-phones.jpg`: recorte de la imagen de cierre de Yupa (las dos pantallas), usado en Destacados.
- `src/assets/projects/yupa/app-catalog-screen.jpg`: recorte vertical (pantalla del catálogo) para Servicios › Desarrollo.
- `src/assets/projects/remittven/screens-beneficiaries-profile.png`: recorte de `solution-screens.png` (pantallas 2 y 3) para Destacados.
- `src/assets/projects/remittven/screen-confirmation.png`: recorte (pantalla de confirmación) para Servicios › UX/UI.
- `progress/impl_HOME-REAL.md`.

Modificados:
- `src/modules/project-gallery/schema.ts`: `content = { cta, projects: slug[], cardCta, cards? }`. Las métricas son `{value,label}` (de 1 a 4, sin icono) y `cards` es derivado.
- `src/modules/project-gallery/Section.astro`: pinta `cards`. Con un número impar de proyectos, la 1.ª ocupa 2 columnas desde lg (`lg:col-span-2 lg:project-card-wide`) con sus propios `sizes`.
- `src/content/pages.ts`: `withProjectCards` deriva las tarjetas con `projectCard(slug)`. Un slug inexistente o un caso sin métricas rompe el build.
- `src/content/projects.ts`: `ProjectCardData.metrics` (valor y etiqueta de `project-results`).
- `src/content/data/pages/home.json`: la galería pasa a `["yupa","remittven","las-donas"]` y `cardCta`, y el CTA va a `/proyectos/yupa/`. En Destacados, 4 de 7 diapositivas son reales. En Servicios, la 1.ª imagen de Branding, UX/UI y Desarrollo es real.
- `src/content/ui-catalog.ts`: la muestra de `ProjectCard` sale de `cards[0]`.
- `src/content/unsplash-photos.json`: se quitaron (`drop`) los 13 slots que dejaron de usarse (quedan 24, todos en uso).
- `src/shared/ui/ProjectCard.astro`: métricas en una fila de columnas iguales (`auto-cols-fr grid-flow-col`). La categoría puede ir en dos líneas (`min-w-0 text-balance`). Ya no recorta la imagen en el servidor: el respaldo conserva la proporción del original y `object-cover` recorta en CSS, para que la versión panorámica no pierda los lados.
- `src/shared/ui/ProjectCardPill.astro`: la misma corrección de categoría (antes `whitespace-nowrap shrink-0` desbordaba con las categorías reales).
- `src/shared/ui/ProjectCardMetric.astro`: sin icono.
- `src/shared/ui/types.ts`: `ProjectMetricData {value,label}` y `metrics: ProjectMetricData[]`.
- `src/layout/DocumentHead.astro`: `seo.ogImage` local → `getImage` a 1200×630, JPG q80, `fit: cover`.
- `src/styles/tokens.css`: `--project-aspect-wide`.
- `src/styles/global.css`: utilidad `project-card-wide`.
- `src/assets/projects/las-donas/conclusion-florist.jpg`: recortada de 1009×673 a 996×664 (3:2) desde y=9, sin el texto horneado "EJEMPLOS TERRITOR…". Pesa 102 KB.
- `src/assets/projects/yupa/conclusion-app-mockup.png`: se quitó el marco redondeado horneado (línea a 15–18 px del borde). Queda en 1592×902, con más margen a la derecha que a la izquierda para que la "Y" de YUPA no se corte en el hueco 3:2 de la conclusión.
- Borrados: `src/assets/project-gallery/metric-{funds,growth,return,partners}.svg` (sin uso).
- Docs: `docs/content-model.md` (contrato de `project-gallery`), `docs/architecture.md` (derivación de tarjetas), `docs/components.md` (`ProjectCard`, piezas, variante destacada), `docs/design-system.md` (token nuevo), `design/placeholders.md` (estado HOME-REAL, tabla de huecos y créditos regenerados con `unsplash-curate.mjs credits`), `design/content-gaps.md` (reescrito como informe final).
- Estado: `feature_list.json` (HOME-REAL → `in_progress`) y `progress/current.md` (plan).

## Tokens

- `--project-aspect-wide: 2 / 1`: proporción de la tarjeta destacada a dos columnas. No sale de Figma, que solo tiene la rejilla 2 × 3. Se probó 1320/600 (≈ 2.2): recortaba la cabeza del personaje de Yupa. Con 2:1, a 1440 px la tarjeta mide 1320 × 660, casi el alto de una fila normal (650 × 447) más el hueco entre filas.
- Utilidad `project-card-wide` (`global.css`): redefine `--project-aspect` en el `<li>`. Es la única forma de cambiar la proporción por breakpoint sin valores arbitrarios ni una prop de variante en `ProjectCard`.
- Ningún token quedó sin uso. Los iconos `metric-*` se borraron.

## Decisiones

- **Rejilla con 3 proyectos**: desde lg, la 1.ª tarjeta ocupa las 2 columnas en formato panorámico y las otras 2 van debajo. Así no queda una tarjeta huérfana ni un hueco. La regla es genérica: se aplica cuando el número de proyectos es impar (con un número par es la rejilla 2 × n de siempre). Debajo de lg, todas van en una columna a 650:447, como antes. Se mantienen la estructura y la composición: misma cabecera, CTA y rejilla de tarjetas.
- **CTA "Ver todos los proyectos"**: no hay índice de proyectos y la galería ya los muestra todos. El enlace apunta al primer caso (`/proyectos/yupa/`), y desde ahí "Siguiente proyecto" recorre los tres (Yupa → Remittven → Las Doñas). Antes apuntaba a `/#proyectos`, la propia sección. Queda listado como decisión en content-gaps (P3).
- **Métricas del hover**: las 3 de `project-results` de cada caso (valor y etiqueta). Los iconos se quitaron porque representaban fondos, crecimiento, retorno y alianzas, que no corresponden a estas cifras; inventar una asignación sería falsear el dato.
- **"Ver proyecto"** vive en el JSON de la home (`cardCta`). Es copy de esa sección, no microcopy repetido entre páginas del mismo tipo (regla 6).
- **Piezas reales y repetición**: hay 4 piezas reales y se usan en la galería (imagen de cierre de cada caso), en Destacados y en Servicios (Branding, UX/UI y Desarrollo). Para no repetir la misma vista, en Destacados y Servicios van recortes distintos (pantallas, catálogo, confirmación). La florista se repite (galería, Destacados y Branding) porque es la única pieza de identidad aplicada. Excepción documentada en `design/placeholders.md`.
- **Unsplash restante (24)**: Email Marketing (las 3) y las 2.ª y 3.ª imágenes de los otros servicios, 3 diapositivas de Destacados, testimonios, equipo, contacto y pie. Todo listado en content-gaps.
- **og:image**: Yupa y Remittven salen a 1200×630. Las Doñas sale a 996×630 porque `getImage` no amplía un original de 996 px; la proporción es válida para compartir.

## Responsive inferido

- 375/768: una columna. La pill admite dos líneas y solo se parte entre segmentos de la categoría. Sin hover (táctil) solo se ven la imagen y el botón, como antes.
- 1024/1440: la destacada a 2 columnas (2:1) y 2 tarjetas debajo. En el detalle de hover, las 3 métricas caben en una fila (comprobado a 1024 en la tarjeta de Las Doñas y a 1440 en la de Remittven).
- Comprobado con Chrome headless (perfil temporal propio, procesos cerrados por su ruta), con movimiento reducido, sobre el build estático, a 375, 768, 1024 y 1440 en la home, a 1440 en `/proyectos/yupa/` y a 768 en `/proyectos/las-donas/`. En ningún caso hubo desbordamiento horizontal (`scrollWidth == clientWidth`) ni imágenes rotas.
- Pendiente conocido: a 375 la tarjeta de Yupa (650:447 sobre un mockup apaisado) deja la "Y" de YUPA en el borde. Pasa igual que antes y se resuelve con una portada propia (hueco P2 de content-gaps).

## init.ps1

```
[OK] toolchain · dependencias · estado (1 in_progress) · check:ds (0 errores, 0 ds-allow)
[OK] check:arch (277 archivos, 22 módulos, 0 errores) · astro check (0 errors) · astro build
VERDE: todo en orden.
```
