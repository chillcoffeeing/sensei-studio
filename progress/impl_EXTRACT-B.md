# impl EXTRACT-B — Extracción B: ítems repetidos inline

Refactor sin cambio visual ni de comportamiento: el marcado, las clases, los atributos `data-*`,
`aria-*` y el orden del DOM se mueven tal cual a archivos propios. Sin tokens nuevos, sin Figma
(la feature no trae `figmaNodes`), sin dependencias nuevas.

## Archivos

Creados:
- `src/layout/FooterNavColumn.astro` — B1: overline + lista de `LinkFooter` (prop `column`).
- `src/layout/FooterStudio.astro` — B2: descripción, créditos y `LegalLinks` (prop `studio`).
- `src/layout/FooterGalleryCard.astro` — B3: tarjeta de la rueda con `<Picture>` (props `src`, `wheelSlot`, `class`).
- `src/modules/testimonials/MasonryColumn.astro` — B4: pista animada con la lista y su copia `aria-hidden` (prop `cards`).
- `src/modules/logo-marquee/LogoMarqueeTrack.astro` — B5: pista animada con sus dos mitades y logos (prop `logos`).
- `src/shared/ui/ProjectCardPill.astro` — B6: pill de reposo (props `title`, `category`).
- `src/shared/ui/ProjectCardMetric.astro` — B6: métrica glass `dt`/`dd` + icono (prop `metric`).
- `src/shared/ui/AvatarStack.astro` — B7: pila de avatares + contador (props `avatars`, `count`).
- `src/shared/ui/RatingStars.astro` — B7: estrellas con `role="img"` (prop `rating`).
- `src/modules/services/ServiceBullets.svelte` — B8: lista con viñetas `data-enter` (props `items`, `bullet`, `enterClass`).
- `src/modules/services/ServiceImage.svelte` — B8: `<picture>` con sources (props `image`, `sizes`).
- `src/modules/project/SolutionPackagingDots.astro` — B9: puntos del slider (props `total`, `dotLabel`).

Modificados:
- `src/layout/Footer.astro` — usa los tres componentes; sigue decidiendo la posición de cada tarjeta y su `data-wheel-slot`.
- `src/modules/testimonials/Section.astro` — usa `MasonryColumn`; el desfase de columna (`pt-*`) sigue en la sección.
- `src/modules/testimonials/masonry.ts` — tipo `MasonryCard` (sustituye al `Card` local de la sección).
- `src/modules/logo-marquee/Section.astro` — usa `LogoMarqueeTrack`.
- `src/shared/ui/ProjectCard.astro` — usa `ProjectCardPill` y `ProjectCardMetric`; las capas y su motion siguen aquí.
- `src/shared/ui/TrustBadge.astro` — usa `AvatarStack` y `RatingStars`; el caption en dos tonos sigue aquí.
- `src/modules/services/ServiceRow.svelte` — usa `ServiceBullets` y `ServiceImage`.
- `src/modules/project/SolutionPackagingSlider.astro` — usa `SolutionPackagingDots`; el script no cambia.
- `docs/components.md` — piezas internas de `TrustBadge` y `ProjectCard`; consumidores del footer; filas de marquee, masonry y ServiceRow.
- `feature_list.json` (in_progress), `progress/current.md` (plan).

## Decisiones

- **Ubicación**. Footer → `layout/` (lo usa solo el footer). Masonry, marquee, servicios y puntos
  del slider → su módulo dueño (un solo uso). Las piezas de `ProjectCard` y `TrustBadge` van a
  `shared/ui/` porque su padre vive ahí (shared no puede importar módulos). Ninguna se usa en
  2+ módulos por sí misma, así que **no tienen entrada propia en `/componentes`**: se documentan
  como piezas internas en la ficha del padre de `docs/components.md` y se ven en su ejemplo.
- **Ganchos conservados**:
  - `data-wheel-slot`: lo pone `FooterGalleryCard` con el mismo valor. El prop se llama
    `wheelSlot` porque Astro reserva `slot`. La tarjeta sigue siendo hija directa del
    `<astro-slot>` de `FooterWheel`, y `group-data-wheel:block` sigue llegando por la clase de posición.
  - `data-enter` + `acc.enterClass`: el `<li>` de cada viñeta lo pone `ServiceBullets`, que recibe
    `enterClass` como prop reactivo. El `<li data-enter>` de cada imagen se queda en `ServiceRow`,
    así `ServiceImage` no necesita `enterClass`. `markEntrySides` ve el mismo DOM.
  - `data-slider-dot`, `data-active` y `aria-current` (estado inicial): los pone `SolutionPackagingDots`.
    El script del slider los busca dentro de `[data-packaging-slider]` y no cambia.
  - Masonry y marquee: `group-focus-within:play-paused` sigue con el `group` en el contenedor
    enfocable de la sección. La duración inline de la masonry y las clases `motion-reduce:` se mueven
    tal cual.
  - `data-card` y las capas con `can-hover:`/`card-active:` siguen en `ProjectCard`. Las piezas solo
    traen marcado estático.
- **Props mínimos y sin flags**: la copia `aria-hidden` de la masonry y la mitad decorativa del
  marquee se resuelven dentro de su componente. No hay ningún booleano `copy` ni `decorative`
  como prop. El único `class` (de `FooterGalleryCard`) es la colocación que decide el padre, no
  una variante de aspecto.
- **Nombre que cambia**: B9 se llama `SolutionPackagingDots` y no `PackagingSliderDots`, para seguir
  el prefijo `Solution*` de los bloques de solución en `modules/project`. B5 (`LogoMarqueeTrack`)
  es la pista completa, que incluye las mitades y los logos: un logo es un solo `<img>` y no
  justifica un archivo propio.
- **Descartes**: ninguno. Los 9 puntos se implementaron.
- **Responsive inferido**: no aplica. No cambia ninguna clase ni ningún breakpoint.
- **Comprobación del HTML generado** (`dist/client/index.html`): hay 6 `data-wheel-slot` (dentro de `<astro-slot>`),
  7 `animate-masonry`, 1 `animate-marquee`, 24 `rounded-metric`, 7 `data-card` y 56 `data-enter`.
  `proyectos/origen` tiene `data-slider-dot` 0 y 1. Ningún `data-astro-cid`: los componentes no tienen `<style>`.

## Tokens

Ni agregados ni quitados.

## init.ps1

```
[OK] node / pnpm / pnpm install / estado (1 in_progress)
check:ds   → 0 ds-allow · 0 error(es)            [OK]
check:arch → 224 archivos · 12 módulos · 0 error(es) [OK]
astro check → 0 errors · 0 warnings · 1 hint (preexistente, BaseLayout.astro:87 'media')  [OK]
astro build [OK]
VERDE: todo en orden.
```
