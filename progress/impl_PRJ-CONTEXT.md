# impl PRJ-CONTEXT — Detalle de proyecto: Contexto y desafío

Figma: fileKey `flzA0qnj6JdalFCgyB2PdI`, `get_design_context` de 216:2909 con screenshot (respuesta
completa con hijos; sin assets: solo texto, rectángulos y separadores).

## Archivos

- `src/modules/project/schema.ts`: `ProjectContext`, `ProjectContextField`, `ProjectChallenge`, `ProjectGoals`; `Project.context`; `ProjectAnchors.context`.
- `src/modules/project/index.ts`: exporta los tipos nuevos.
- `src/modules/project/Section.astro`: monta `<ProjectContext>` tras Resultados (orden de 216:2836).
- `src/modules/project/ProjectContext.astro`: nuevo. La sección 216:2909 solo coloca: contexto + ficha (fila desde lg) y bloque oscuro reto + objetivos; reveal escalonado acotado a la sección.
- `src/modules/project/ContextIntro.astro`: nuevo. Contexto 216:2911 (etiqueta, h2, descripción principal y secundaria).
- `src/modules/project/ContextFields.astro` / `ContextField.astro`: nuevos. Ficha 216:2918 como `<dl>` y cada campo 216:2919, iterado.
- `src/modules/project/ContextChallenge.astro`: nuevo. Reto 216:2940 (etiqueta, h3, descripción).
- `src/modules/project/ContextGoals.astro` / `ContextGoal.astro`: nuevos. Objetivos 216:2946 como `<ol>` con rótulo, y cada objetivo 216:2948 (número derivado de la posición).
- `src/modules/project/ProjectSectionLabel.astro`: reutilizado; se quitó `text-ink`, así que ahora hereda el color del contenedor (tinta en claro, `line` en el bloque oscuro). En Resultados no cambia nada (hereda la tinta del body). Así no hace falta una variante.
- `src/content/projects/origen.ts`: copy real de Figma para `context` + ancla `el-proyecto`.
- `src/styles/tokens.css`: 2 roles de texto nuevos.
- `docs/design-system.md` (roles), `docs/components.md` (Fuera de la librería: bloques Context*).
- `feature_list.json` (in_progress), `progress/current.md` (plan).

## Tokens agregados

- `--text-project-subtitle`: clamp 26→36px, lh 1.08, 500 (titular del reto 216:2944, 36px Medium).
- `--text-project-lead`: clamp 18→20px, lh 1.5, 400 (descripción principal 216:2916, 20px Regular).

Reutilizados: `text-project-title`, `text-overline`, `text-caption`, `text-body`, `text-body-lg`, `brand`, `ink`,
`ink-muted`, `paper`, `line`, `rounded-panel` (10px), `container-page`, `reveal-up` + `revealAll`.
Colores nativos: fondo `bg-neutral-100` (continúa Resultados) y separador `border-neutral-300` (mismo criterio que PRJ-RESULTS).

## Desviaciones de Figma (y motivo)

- Rótulos de ficha a 12px (`text-caption`) en vez de 11px: legibilidad en gris y sin crear un rol de 11px.
- Separador `neutral-300` en vez de #DEDED9: Tailwind nativo, coherente con Resultados.
- Descripción del reto y objetivos con `text-body-lg` (16→18px) en vez de 17/18px fijos: un solo rol fluido.
- Ancho de lectura: descripción principal `max-w-170` y secundaria `max-w-150` (Figma ocupa toda la columna); ~65 caracteres por línea.
- Números de objetivos `aria-hidden` (el `<ol>` ya numera) y la lista se nombra con `aria-labelledby` apuntando al rótulo. El titular del reto es `h3` (bajo el h2 de la sección).
- Espaciado superior pequeño (16→30px): la sección sigue el fondo gris de Resultados, cuyo `pb` ya separa los dos bloques.
- Motion añadido: contexto, ficha y bloque oscuro entran con `reveal-up` escalonado. Con reduced motion o sin JS se ven en su estado final.

## Responsive inferido

- 375: todo apilado (contexto → ficha → bloque oscuro con reto → objetivos); h2 30px en 3 líneas; card con p-6.
- md (768): la ficha pasa a 2 columnas (5 campos: el último queda solo), porque a ese ancho una columna se veía demasiado larga. Card con p-8 y todavía apilada.
- lg (1024): contexto y ficha en fila (ficha de 288px, gap 64); el bloque oscuro en 2 columnas (gap 50, p-10).
- xl+ (1440): ficha de 350px y gap de 100px, como en Figma.
- Revisado con Chrome headless (perfil temporal propio en el scratchpad, reduced motion forzado) a 375 (iframe), 768, 1024 y 1440: sin desbordes. El preview se paró con `astro preview stop`.

## init.ps1

VERDE: toolchain, install, estado (1 in_progress), check:ds, check:arch, astro check y astro build OK.
