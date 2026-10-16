# Verify PRJ-CONTEXT — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V6] `src/modules/project/ContextGoals.astro:10`: `labelId = 'objetivos-titulo'` está fijo, no sale del id de la sección (el h2 sí usa `${id}-titulo`). Hoy hay una sola instancia por página, así que no falla. Si algún día la vista monta dos bloques de objetivos, el id se duplicaría. Se puede pasar un `labelId` derivado (p. ej. `${id}-objetivos`) desde `ProjectContext.astro`. No bloquea.

## Verificado sin hallazgos
- **V1**: `./init.ps1` termina VERDE (exit 0): toolchain, install, estado, check:ds, check:arch, astro check y astro build.
- **V2 Estructura**: comparé con `get_screenshot` de 216:2909 (fileKey `flzA0qnj6JdalFCgyB2PdI`) y está igual: etiqueta "02 / El proyecto", h2 en 2 líneas, descripción principal y secundaria en gris, ficha de 5 campos a la derecha con separadores, y bloque oscuro con reto (etiqueta, titular, descripción) a la izquierda y "Tres objetivos, un solo sistema" con 01–03 en lima a la derecha. Se monta después de Resultados en `Section.astro:17`, en el orden de 216:2836. Las desviaciones del informe (caption de 12px, `neutral-300`, `text-body-lg`, max-w de lectura, motion) están justificadas y no empeoran nada.
- **Pedido del usuario (componentes aislados, props mínimos)**: hay un componente por bloque del diseño: `ContextIntro` (216:2911), `ContextFields` y `ContextField` (216:2918/2919, iterado), `ContextChallenge` (216:2940), `ContextGoals` y `ContextGoal` (216:2946/2948, iterado). `ProjectContext.astro` solo coloca los bloques. Ninguno tiene variantes, flags ni props de estilo. Los repetidos reciben solo `label`/`value` o `index`/`text`. `ProjectSectionLabel` se reutilizó: se quitó `text-ink` y ahora hereda el color, así que no hizo falta una variante, y Resultados no cambia porque hereda la tinta de `html`.
- **Contenido**: todo el copy viene de `src/content/projects/origen.ts` (`context`) y está tipado en `schema.ts`. Ningún texto está escrito a mano en los componentes.
- **V3 Responsive**: capturas con Chrome headless (perfil temporal propio y reduced motion forzado), de la página completa a 768, 1024 y 1440, y de 375 dentro de un iframe. 375: todo apilado, sin cortes ni scroll horizontal. 768: ficha en 2 columnas y bloque oscuro apilado. 1024: contexto y ficha en fila, reto y objetivos en 2 columnas (el campo "Servicios" pasa a 2 líneas, correcto). 1440: casi idéntico a Figma. La sección no tiene elementos interactivos, así que no aplica el mínimo táctil de 44px.
- **V4 Assets**: el nodo no tiene imágenes, solo texto y rectángulos. No hay assets que revisar.
- **V5 Antipatrones**: grep sin resultados para `[0-9#]` arbitrarios, hex, `client:load`, `any`, `ds-allow` y z-index en los archivos `Context*`/`ProjectContext`. No hay imports desde otros módulos (solo `@/shared/lib/motion`). No hay islas: el reveal es un `<script>` acotado a `[data-project-context]`.
- **Tokens**: `--text-project-subtitle` y `--text-project-lead` solo se agregan, se usan una vez cada uno y están documentados en `docs/design-system.md`. No hay `initial` ni nombres de Tailwind redefinidos. El resto son tokens existentes o colores nativos (`neutral-100/300`).
- **V6 Accesibilidad**: la sección se nombra con `aria-labelledby` apuntando al h2. Debajo, el reto es un h3. La ficha es `<dl>` con `aria-label`. Los objetivos son `<ol>` con `aria-labelledby`, y tanto los números como el marcador lima tienen `aria-hidden`. Contraste: `line` (#B8B8B8) sobre `ink` ≈ 10:1, `ink-muted` sobre neutral-100 ≈ 5:1. El reveal respeta reduced motion: con la preferencia forzada todo se ve en su estado final.
- **V7 Alcance**: solo se tocó `modules/project` (componentes, schema, index), `origen.ts`, `tokens.css` y la documentación (`components.md`, `design-system.md`).
