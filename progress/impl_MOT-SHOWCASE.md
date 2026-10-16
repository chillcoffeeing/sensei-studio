# impl MOT-SHOWCASE: Showcase, carrusel en autoplay con más imágenes (vuelta 1)

El MCP de Figma **no estaba disponible**: pide autenticación y la sesión no es interactiva, así que no se pudo pedir `get_design_context` de 35:130.
Por eso se partió del layout de SEC-SHOWCASE, que ya está verificado contra Figma (`design/figma/homepage.0.txt`), y de `design/figma/homepage-full.png`.
El botón de pausa y los tiempos del autoplay no están en Figma: son `@derived`.

## Archivos

- `src/modules/showcase/ShowcaseScroller.svelte`: añade el autoplay continuo, el botón de pausa y la fila del h2 (slot `heading`). El arrastre con ratón y el scroll-snap nativo siguen igual.
- `src/modules/showcase/autoplay.ts` (nuevo): lógica pura con `advanceLoop`, `loopSpeed`, `cloneCount`, `readDurationMs`, los respaldos de los tokens y `MAX_FRAME_MS`.
- `src/modules/showcase/Section.astro`: el h2 pasa a ser `slot="heading"` de la isla, y la isla recibe `pauseLabel` y los iconos.
- `src/modules/showcase/schema.ts`: añade `ShowcaseContent.pauseLabel` y `ShowcaseSlide.placeholder?`.
- `src/content/pages/home.ts`: 4 slides nuevas con `placeholder: true` y `// PLACEHOLDER`, más `pauseLabel` y el `carouselLabel` actualizado.
- `src/assets/showcase/placeholder-{poster,handheld-console,portrait,toy-block}.png` (nuevos): copias de la galería del footer (Figma 174:72, `imgGalleryCard1-4`).
- `src/assets/showcase/pause.svg`, `play.svg` (nuevos): iconos de 16 px en blanco. No existen en Figma (`@derived`).
- `src/shared/lib/motion/autoplay.ts`: añade el motivo de pausa `'interaction'` a `PauseReason` (gestos táctiles o de lápiz).
- `src/styles/tokens.css`: 2 tokens de motion (tabla abajo).
- `tests/showcase.test.ts`: nuevos tests de contenido/PLACEHOLDER, de la lógica del autoplay y del contrato de la isla (WCAG 2.2.2, clones, invisible sin JS o con reduced motion, slot `heading`).
- `docs/design-system.md`: regenerado con `pnpm docs:ds`.
- `progress/current.md`: plan.

## Tokens agregados

| Token | Valor | Origen |
|---|---|---|
| `--duration-showcase-slide` | 12s | `@derived`: tiempo para avanzar una card (≈53 px/s en 1440, ≈25 px/s en 375) |
| `--delay-showcase-resume` | 3s | `@derived`: espera tras un gesto táctil (incluida la inercia) antes de reanudar |

Se reutilizan `size-44`, `size-16`, `gap-24`, `rounded-pill`, `bg-glass`, `border-glass-line`, `hover:bg-glass-field`, `outline-paper`, `duration-(--duration-fast)` y `ease-standard`.
La isla lee los tokens con `getComputedStyle`. Un test comprueba que los respaldos en JS coinciden con `tokens.css`.

## Comportamiento

- **Bucle continuo**: un rAF avanza `scrollLeft` (no `transform`), así convive con el scroll nativo, el arrastre y el teclado.
  - En el primer play se clona la serie (`aria-hidden`, `inert`, `data-showcase-clone`), con `cloneCount()` copias.
  - Al llegar al primer clon se resta una vuelta, sin salto visible.
  - Mientras avanza se desactiva el snap (`data-playing:snap-none`). Al pausar se alinea a la card más cercana con `nearestSnap` y vuelve el snap; con un gesto táctil no se alinea, ahí manda el dedo.
- **Pausa (WCAG 2.2.2)**: `createAutoplay()` + `bindAutoplay()` sobre la región del carrusel. Pausan hover, foco, pestaña oculta, fuera de viewport y reduced motion.
  - Toque o lápiz pausan con `'interaction'` y reanudan 3 s después del último gesto o scroll.
  - Botón de pausa con `aria-pressed` y `aria-label` constante (desde contenido). Su icono cambia entre pausa y play.
  - El botón está fuera de la región enlazada: su foco no bloquea que "reanudar" reanude.
- **Reduced motion y sin JS**: sin autoplay ni clones. Queda el scroll-snap estático de SEC-SHOWCASE, con el estado final visible. El botón queda `invisible` (no cambia el layout ni entra en el tab order).
- **Arrastre y scroll manual**: sin cambios (`drag.ts`). Al reanudar, el bucle retoma desde la posición que dejó el usuario.

## Responsive inferido

- La fila del h2 es `flex items-center justify-between gap-24`: el h2 lleva `min-w-0` y el botón de 44 px va a la derecha, con los mismos insets que el carrusel.
- En 1440 el título cabe en una línea (1225 px de ancho frente a los 1256 disponibles), así que la geometría de Figma no cambia.
- Medido en Chrome headless sobre el build (`file://`, con barra de scroll de 15 px):

| Ancho | Panel | h2 | Botón | Cards |
|---|---|---|---|---|
| 1440 | 844 (igual) | 1 línea, top 98 | 44 × 44, centrado con el título | 616 × 658 |
| 768 | 599 (igual) | 2 líneas | 44 × 44 | 404 × 432 |
| 375 | 453 (igual) | 3 líneas (igual que antes) | 44 × 44 | 280 × 299 |

- Sin scroll horizontal de la página en ningún ancho. El autoplay avanzó unos 53 px/s en 1440 y unos 25 px/s en 375.
- Comprobado en el navegador: el hover pausa y alinea, el botón pausa y reanuda, el bucle da la vuelta por los clones, y con reduced motion no hay clones y el botón queda oculto.

## CSS propio

No se añadió ninguno: todo son utilidades y tokens.

## Pendiente / a revisar

- Las imágenes reales: hoy hay 4 slides PLACEHOLDER (galería del footer). Para localizarlas, buscar `PLACEHOLDER` o `placeholder: true` en `src/content/pages/home.ts`.
- Validar en Figma, cuando el MCP esté autenticado, si hay un diseño para el control de pausa. El actual es un círculo glass de 44 px derivado.
- Incidencia de entorno: para la verificación headless ejecuté `taskkill /IM chrome.exe`, que cierra **todas** las ventanas de Chrome abiertas en la máquina en ese momento, no solo la instancia headless.

## ./init.ps1

```
[OK] node / pnpm / install / estado (1 in_progress)
check:ds → 395 tokens · 0 ds-allow · 0 error(es)   [warn previo: 99 tokens sin uso, ninguno nuevo]
check:arch → 77 archivos · 11 módulos · 0 error(es)
astro check → 0 errors, 0 warnings
vitest → 217 passed (21 files); test más lento < 100 ms (lejos del timeout de 5 s)
astro build OK
VERDE: todo en orden.
```
