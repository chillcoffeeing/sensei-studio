# impl ARCH-LOGOS-BADGE — Archivar carrusel de logos y retirar process-badge

## Archivos
- `src/modules/logo-marquee/` → `_archive/logo-marquee/module/` (movido; Section, Track, track.ts, schema, index).
- `src/assets/logo-marquee/*.svg` (9) → `_archive/logo-marquee/assets/` (movidos).
- `_archive/logo-marquee/home-section.json`: bloque `clientes` retirado de home.json (para restaurar).
- `_archive/logo-marquee/tokens.css`: tokens y keyframes retirados del marquee.
- `_archive/logo-marquee/README.md`, `_archive/process-badge/README.md`: cómo restaurar.
- `src/assets/process/process-badge.svg` → `_archive/process-badge/process-badge.svg` (carpeta `src/assets/process/` queda vacía y se borra).
- `src/content/data/pages/home.json`: quitada la sección `logo-marquee` (hero → project-gallery; resto del orden igual).
- `src/app/sections.ts`: fuera `'logo-marquee'` del enum, su import y su schema de la unión.
- `src/app/registry.ts`: fuera import y entrada `'logo-marquee'`.
- `src/app/templates.ts`: fuera `'logo-marquee'` de la plantilla home.
- `src/modules/process/Section.astro`: sin import ni `<img>` del badge; panel con `py-(--process-pad-y)` en todos los anchos (antes `pb-(--process-pad-bottom)` reservaba el badge bajo xl). Comentario actualizado.
- `src/styles/tokens.css`: tokens retirados (ver abajo).
- `src/styles/global.css`: comentario de `play-paused` ya no menciona el marquee (la utilidad sigue en uso por el masonry).
- `src/core/content.ts`: ejemplo de clave local en comentario → `case-study/tools/figma.svg`.
- `docs/components.md`, `docs/content-model.md`, `docs/architecture.md` (texto + mapa regenerado por check:arch), `docs/design-system.md`: referencias al marquee y al badge eliminadas.

## Tokens
Ninguno agregado. Eliminados (quedaron sin uso):
- Logos: `--logos-pad-top`, `--logos-gap`, `--duration-marquee`, `--animate-marquee`, `@keyframes marquee` (y el rótulo vacío "=== Logos ===").
- Badge: `--process-badge-size`, `--process-badge-right`, `--process-badge-bottom`, `--process-pad-bottom`, `--duration-badge`, `--animate-badge-spin`, `@keyframes badge-spin`.

## Responsive / composición
- Proceso: sin badge, el relleno inferior del panel es simétrico al superior (`--process-pad-y`) en mobile/tablet; en xl sigue `min-h-159.5`. Título, stepper/rejilla y orden intactos.
- Home: project-gallery queda directamente bajo el hero; conserva su `--projects-pad-top` y el hero su `--hero-pad-bottom`, así que no hace falta ajustar espaciado.

## Pendiente para el orquestador
- `design/content-gaps.md` (sección "Clientes (`clientes`, logo-marquee)" y fila 4 de la tabla resumen) sigue describiendo los logos: ahora están archivados. No lo edité (es de `design/`).

## init.ps1
VERDE: node, pnpm, install, una feature in_progress, estados, dependsOn, check:ds (sin valores sueltos), check:arch (fronteras), astro check, astro build. En `dist/` no queda referencia a `logo-marquee` ni a `process-badge`.
