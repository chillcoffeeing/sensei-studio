# impl EXTRACT-SERVICE-ROW — Fila del acordeón de servicios en componente propio

Refactorización sin cambio visual ni de comportamiento (regla 5 de `docs/conventions.md` › Librería de componentes). Mismo patrón que EXTRACT-PROCESS-STEP y EXTRACT-STAT-ITEM.

## Archivos
- `src/modules/services/ServiceRow.svelte` (nuevo): la fila completa (h3 + botón con punto lima, panel `collapsible` con descripción, lista con viñetas e imágenes). Props: `acc` (el `AccordionController`), `index`, `baseId`, `service`, `sizes`, `dot`, `bullet`. Deriva `open`, `ids` y `leading` del controlador; mismo marcado y clases que antes.
- `src/modules/services/ServicesAccordion.svelte`: crea el controlador (estado único) y el `{#each}` solo coloca `<ServiceRow>`. Se quitan los imports y derivados que pasaron a la fila.
- `src/modules/services/accordion.ts`: tipo `AccordionIcon` exportado (antes `Icon` local) para compartirlo entre isla y fila.
- `docs/components.md` › Fuera de la librería: la fila apunta al archivo nuevo y justifica por qué queda en el módulo.
- `docs/architecture.md`: mapa regenerado por `check:arch` (services: 6 archivos).
- `feature_list.json` (→ in_progress), `progress/current.md` (plan).

## Dónde vive y por qué
En el módulo, no en `shared/ui`: un solo uso, tipada con el dominio (`AccordionService`) y ya catalogada como "Fuera de la librería". Por eso no entra en `/componentes` ni en `ui-catalog.ts`. El comportamiento sigue en `AccordionController` (compartido con FAQ), que vive en `ServicesAccordion`: una sola instancia, así que la fila abierta, el teclado (flechas/Home/End sobre `acc.triggers`), `aria-expanded`/`aria-controls`, `data-open` + `collapsible` y `enter-from-side` (vía `acc.enterClass`) no cambian. `bind:this={acc.triggers[index]}` / `acc.panels[index]` desde la fila: el validador de ownership de Svelte (dev) no avisa porque `acc` es una instancia de clase, no un proxy de estado (comprobado compilando en modo dev: 0 warnings).

## Tokens
Ninguno agregado ni quitado. Sin responsive nuevo (mismas clases).

## Prueba de no-cambio
Build anterior (HTML/JS/CSS de `dist/client` + `MANIFEST.md5` con el md5 de todos los archivos): **`progress/build-before_EXTRACT-SERVICE-ROW.tar.gz`** (comprimido para que `astro check` no analice sus .js). Para repetir: extraer y
`diff <(sed -E 's/ServicesAccordion\.[A-Za-z0-9_-]+\.js/X.js/g' <antes>/index.html) <(sed -E '…' dist/client/index.html)`.
- `index.html`: **idéntico** salvo el hash del chunk `ServicesAccordion.*.js` en `component-url` de la isla (incluidos marcadores de hidratación `<!--[-->` etc. y props serializadas).
- `componentes/index.html`, CSS y el resto de assets: idénticos byte a byte (manifiesto md5).
- Único archivo distinto: el chunk `ServicesAccordion.*.js` (ahora incluye la fila compilada); `accordion-controller.svelte.*.js` sin cambios.
Mismo HTML y misma lógica de estado ⇒ mismo resultado a 375/768/1024/1440, motion y reduced-motion. Sin prueba en navegador (no hay Playwright/Puppeteer en el proyecto).

## init.ps1
VERDE: toolchain, dependencias, estado (1 in_progress), check:ds 0 errores, check:arch 0 errores (124 archivos, 11 módulos), astro check 0 errores (111 archivos), astro build OK.
