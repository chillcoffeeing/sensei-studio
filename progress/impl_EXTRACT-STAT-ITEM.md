# impl EXTRACT-STAT-ITEM — Cifra de stats en componente propio

Refactorización sin cambio visual ni de comportamiento (regla 5 de `docs/conventions.md` › Librería de componentes). Mismo patrón que EXTRACT-PROCESS-STEP.

## Archivos
- `src/modules/stats/StatItem.astro` (nuevo): el `<div>` de la métrica (`dt` etiqueta con `narrowLabel` + `dd` con cifra `data-count` y divisor), prop única `item: StatItem`. Importa el asset `stat-divider.svg`.
- `src/modules/stats/Section.astro`: importa el componente; el `<dl data-count-up>` solo hace `items.map((item) => <StatItem item={item} />)`. Se quita el import del divisor; comentario de cabecera ajustado.
- `docs/components.md` › Fuera de la librería: la fila "Cifra + línea + etiqueta" apunta al archivo nuevo y justifica por qué queda en el módulo.
- `docs/architecture.md`: mapa regenerado por `check:arch` (stats: 4 archivos).
- `feature_list.json` (→ in_progress), `progress/current.md` (plan).

## Dónde vive y por qué
En el módulo, no en `shared/ui`: un solo uso, tipado con el dominio (`StatItem` de `schema.ts`) y ya catalogado como "Fuera de la librería". Por eso no entra en `/componentes` ni en `ui-catalog.ts`. El count-up no cambia: `countUpAll(section)` sigue encontrando `[data-count-up]` y sus `[data-count]` (mismo DOM).

## Tokens
Ninguno agregado ni quitado. Sin responsive nuevo (mismas clases).

## Prueba de no-cambio
`astro build` antes y después; `diff -rq` de `dist/client` completo (HTML, CSS, JS, assets): **idéntico byte a byte**. Solo cambia `dist/server/entry.mjs` (grafo de módulos SSR, no llega al navegador). Mismo HTML/JS ⇒ mismo resultado a 375/768/1024/1440, motion y reduced-motion.

## init.ps1
VERDE: toolchain, dependencias, estado (1 in_progress), sistema de diseño, arquitectura, astro check, astro build.
