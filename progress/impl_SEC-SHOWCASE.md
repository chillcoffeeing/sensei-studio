# impl SEC-SHOWCASE — Showcase: carrusel horizontal (vuelta 1)

Fuente: Figma MCP sin cuota (plan Starter) → `design/figma/homepage.0.txt` (nodo `35:130`:
`33:17`, `33:98`, `33:99`, `33:108`, `33:122`, `33:118`) + `design/figma/homepage-full.png`.

## Archivos

- `src/modules/showcase/schema.ts` — nuevo: `ShowcaseSlide`, `ShowcaseContent` (`carouselLabel`, `slides`), `ShowcaseSection` (h2 obligatorio).
- `src/modules/showcase/Section.astro` — nuevo: panel ink + h2 + `<Picture>` por card (recorte 616 × 658 en servidor, lazy) dentro de la isla.
- `src/modules/showcase/ShowcaseScroller.svelte` — nuevo: isla mínima; región enfocable con scroll-snap nativo y arrastre con ratón (solo tras hidratar, `data-drag`).
- `src/modules/showcase/drag.ts` — nuevo: lógica pura del arrastre (`dragScrollLeft`, `isDrag`, `nearestSnap`).
- `src/modules/showcase/index.ts` — nuevo: API pública.
- `src/assets/showcase/das-anthropology-laptop.png`, `vietnam-exposition-laptop.png` — copias de `imgFrame14` / `imgFrame15` (Vite las deduplica en el build).
- `src/app/sections.ts`, `src/app/registry.ts` — registro de `showcase`.
- `src/content/pages/home.ts` — sección `destacados` (h2, label del carrusel, 3 slides en el orden de 33:98).
- `src/styles/tokens.css` — grupo "Showcase" (7 tokens).
- `src/styles/global.css` — utilidad `scrollbar-none`.
- `tests/showcase.test.ts` — nuevo: contenido, lógica del arrastre y progressive enhancement (10 tests).
- `docs/design-system.md`, `docs/architecture.md` (mapa) — regenerados.
- `feature_list.json` (in_progress), `progress/current.md` (plan).

## Tokens agregados

| Token | Valor | Origen |
|---|---|---|
| `--showcase-pad-top` | clamp(64 → 180) | @figma 31:57 → 33:17 = 180 · @derived 64 a 375 |
| `--showcase-pad-y` | clamp(48 → 98) | @figma 33:17 → 33:118 = 98 · @derived 48 a 375 |
| `--showcase-inset` | calc(50% − 662px) | @figma 33:118 / 33:98 `left calc(50%-662px)` = 58 a 1440 (solo 2xl) |
| `--showcase-head-gap` | clamp(32 → 78) | @figma 33:118 fin → 33:98 = 78 · @derived 32 |
| `--showcase-overhang` | clamp(24 → 52) | @figma 33:98 fin 6181 − 33:17 fin 6129 = 52 · @derived 24 |
| `--showcase-card-w` | clamp(280 → 616) | @figma 33:99 ancho 616 · @derived 280 (asoma la siguiente) |
| `--showcase-card-aspect` | 616 / 658 | @figma 33:99 |

Reutilizados: `paper-ghost`, `text-display` (60/600/leading 1), `rounded-panel` (10), `rounded-media` (5),
`spacing-20` (gap), `spacing-844` (`2xl:min-h-844`), gutters de página.

## Decisiones

- **Sin `surface-noise`**: el panel 33:17 del screenshot es #090909 plano (desviación estándar 0, frente a 2.09 del panel process con ruido).
- **Las cards sobresalen del panel** 51px (52 el contenedor), como en Figma: `-mb-(--showcase-overhang)` en el carrusel; el panel es `flow-root` para que ese margen no colapse.
- **Carrusel a sangre derecha**: la pista empieza en el inset y la tercera card se corta en el borde del viewport (33:98 en Figma: 58 / 694 / 1331 → render 58 / 694 / 1330; la card 33:108 de 617 se normaliza a 616, como ya anotaba `--spacing-616`).
- **Inset**: en 2xl `calc(50% − 662px)` (58 en 1440, sigue centrado a más ancho); por debajo usa los gutters de página 16/32/40 para alinear con las demás secciones.
- **Panel a ancho completo** (Figma: left −1, ancho 1439 → deriva de 1px a cada lado).
- **Isla Svelte solo para el arrastre con ratón** (las cards se salen del viewport y no hay barra visible). Sin JS: scroll-snap nativo, táctil, rueda y teclado. El cursor `grab` y el arrastre dependen de `data-drag` (que pone la isla al montar). Al soltar encaja en la card más cercana; `scrollTo` es instantáneo con `prefers-reduced-motion: reduce`.
- **Accesibilidad**: `section[aria-labelledby]` → h2; región `role="region"` con `aria-label` y `tabindex="0"` (flechas del teclado), foco visible (outline paper de 2px hacia dentro); `alt` en las 3 imágenes; `draggable="false"` en las imágenes para que no compita el drag nativo.
- **Copy**: Figma dice "ESTRATEGÍA" (falta de ortografía); se escribe "estrategia" y las mayúsculas las pone `uppercase`. **A confirmar con diseño/cliente.**
- **Imágenes**: `<Picture>` avif/webp + jpg de respaldo, recortadas en servidor al aspecto 616 × 658 (`fit="cover"`), anchos 280–1232, `sizes` igual al clamp de la card; lazy.
- **Responsive inferido**: 375 → card 280 × 299, título en 3 líneas a 32px; 768 → 404 × 432; 1024 → 485 × 518; 1280 → 566 × 604; 1440 → 616 × 658 exacto.

## Autoverificación (Chrome headless vía CDP sobre el build)

| Ancho | Panel | Título (top) | Cards x | Tamaño card | Sobresale | Scroll horizontal de la página |
|---|---|---|---|---|---|---|
| 375 | 453 | 48 | 16 / 316 / 616 | 280 × 299 | 23 | no |
| 768 | 599 | 66 | 32 / 456 / 880 | 404 × 432 | 33 | no |
| 1440 | **844** | **98** | **58 / 694 / 1330** | **616 × 658** | **51** | no |
| 1920 | 844 | 98 | 298 / 934 / 1570 | 616 × 658 | 51 | no |

- 1440: separación servicios → panel 180, título → carrusel 78, título 60px/600/lh 60, color rgba(197,197,197,0.62).
- Arrastre: pulsar, mover 400px y soltar → `data-dragging` + `snap-none` durante el gesto; al soltar encaja en 564 (máximo) y vuelve `x mandatory`.
- Teclado: foco en la región, ArrowRight avanza al siguiente punto de encaje; outline blanco visible.
- Fuera de alcance: la sección de testimonios (35:150) empieza 268 bajo el panel, y le toca a SEC-TESTIMONIALS (`--spacing-268`).

## init.ps1

```
[OK] toolchain · pnpm install · estado (1 in_progress)
check:ds → 305 tokens · 0 ds-allow · 0 error(es)   [OK]
check:arch → 44 archivos · 7 módulos · 0 error(es) [OK]
astro check → 0 errors, 0 warnings                 [OK]
vitest → 89 passed (13 files)                      [OK]
astro build                                        [OK]
VERDE: todo en orden.
```
