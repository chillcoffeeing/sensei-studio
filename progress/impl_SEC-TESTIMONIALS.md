# impl SEC-TESTIMONIALS — Testimonios: masonry con desplazamiento continuo hacia abajo (vuelta 1)

Fuente: el Figma MCP no está disponible en esta sesión (sin herramienta `get_design_context`), así que se usó
`design/figma/homepage.0.txt` (nodos `35:150` → 35:151–35:158, 40:372, 38:323/38:319/38:321; `174:190` →
174:191, 174:208, 174:225, 174:242 y las cards 174:192…), `design/figma/homepage-full.png` (fade) y
`design/figma/assets/imgImage27.png`. Copy: `design/copy/testimonials.md`, que manda sobre Figma.

## Archivos

- `src/modules/testimonials/schema.ts`: nuevo. `Testimonial`, `TestimonialsCta`, `TestimonialsContent`, `TestimonialsSection` (cabecera obligatoria).
- `src/modules/testimonials/masonry.ts`: nuevo, lógica pura. `MASONRY_LAYOUTS` (1/2/4), `COLUMN_WIDTHS`, `estimateCardHeight`, `distributeColumns`, `initials` y `avatarTone`.
- `src/modules/testimonials/Section.astro`: nuevo. Cabecera común con aside (prueba social + CTA) y masonry solo con CSS (sin isla).
- `src/modules/testimonials/index.ts`: nuevo, API pública.
- `src/assets/testimonials/social-proof.png`: nuevo. Recorte superior de 426 × 91 de `imgImage27.png`, que es exactamente lo que muestra 38:319 (`h 250.55%`, `top 0`). No está redibujado.
- `src/app/sections.ts`, `src/app/registry.ts`: registran `testimonials`.
- `src/content/pages/home.ts`: sección `testimonios` después de `destacados`, con las 20 reseñas textuales (const `reviews`).
- `src/styles/tokens.css`: nuevo grupo "Testimonios" (7 tokens). Se redefine `--duration-masonry` y se actualiza el `@usage` de `--blur-masonry`.
- `src/styles/global.css`: utilidades `mask-fade-y`, `mask-fade-from-top` y `mask-fade-from-bottom`, solo con tokens.
- `tests/testimonials.test.ts`: nuevo, 19 tests. Cubre el contenido frente al .md, el reparto, la estimación de alto, las iniciales, los tonos y el contrato del marcado.
- `docs/design-system.md` y `docs/architecture.md` (mapa): regenerados.
- `feature_list.json` (in_progress) y `progress/current.md` (plan).

## Tokens

| Token | Valor | Origen |
|---|---|---|
| `--testimonials-pad-top` | clamp(80 → 268) | @figma 33:17 fin 6129 → 35:150 top 6397 · @derived 80 a 375 |
| `--testimonials-head-gap` | clamp(24 → 41) | @figma 35:150 fin 6544 → 174:190 top 6585 · @derived 24 |
| `--testimonials-title-max` | 9em | @figma 40:372 (dos párrafos) · @derived: corte "Lo que dicen" / "nuestros clientes" (líneas de 266 y 356 px a 45px, 405 de máximo) |
| `--masonry-h` | clamp(560 → 793) | @figma 174:190 alto · @derived 560 a 375 |
| `--masonry-gap` | clamp(20 → 51) | @figma 174:190 gap · @derived 20 |
| `--masonry-fade` | clamp(64 → 120) | @derived, medido en homepage-full.png (Figma no exporta el fade) |
| `--masonry-cols` | 251fr 310fr 311fr 300fr | @figma anchos de 174:191/208/225/242 (proporción en xl) |
| `--masonry-cols-2xl` | var(--spacing-251…300) | @figma anchos exactos |
| `--duration-masonry` (cambia) | 60s → **12s por card** | @derived: la pista multiplica por sus cards (5 → 60s en 4 columnas, 20 → 240s en 1). Así la velocidad es parecida en las tres maquetaciones |

Se reutilizan: `avatar-{1..4}-bg/fg`, `ink-soft`, `ink-muted`, `text-card-title` (15/500), `text-caption` (12/400),
`text-quote` (13/1.5), `text-initials` (DM Sans 14/700), `text-link`, `rounded-card` (16), `rounded-avatar` (20),
`shadow-card`, `blur-masonry`, `animate-masonry` (`masonry-down`, de −50% a 0) y los espaciados 2/5/12/16/20/24/40/60/426.

## Decisiones

- **Blur 2px (arrastre DS-001)**: en Figma el layer blur se aplica a todo 174:190. Se interpreta como intención
  de "fondo" y **no** se aplica a todo el viewport, porque desenfoca citas de 13px que hay que poder leer (accesibilidad).
  Se aplica solo en las bandas del fade (`backdrop-blur-masonry` con máscara degradada, decorativas y `pointer-events-none`).
  Esto queda **por confirmar con diseño**.
- **Animación solo con CSS, sin isla**: cada columna es una pista con su lista dos veces. La copia lleva `aria-hidden`
  y cada lista tiene `pb-20` (igual al gap), así las dos mitades son idénticas (medido: 1357/1357, 1148/1148…).
  `masonry-down` va de −50% a 0, de modo que el contenido baja y el bucle no salta. Hay pausa con hover y con foco
  (la región es `role="region"` con `aria-label`, `tabindex="0"` y foco visible).
- **prefers-reduced-motion**: sin animación, la copia se oculta (`motion-reduce:hidden`) y la región pasa a
  `overflow-y-auto`, desplazable con rueda, táctil o teclado. Verificado: `animation-name: none`, copia `display:none` y `overflow-y: auto`.
- **4 → 2 → 1**: se renderizan tres maquetaciones (1, 2 y 4 columnas) y CSS muestra una por breakpoint
  (`md:hidden` / `md:grid xl:hidden` / `xl:grid`). Las ocultas usan `display:none`, así que salen del árbol de accesibilidad.
  El reparto (`distributeColumns`) es voraz: va a la columna más baja según un alto estimado que depende del ancho
  de la columna. Conserva el orden de lectura dentro de cada columna. A 1440 las pistas miden 1357/1148/1313/1118 (diferencia menor que una card).
- **Desfases de Figma** (pt 40 / 0 / 60 / 20) en las columnas, también en 2 columnas (40 / 0). Con la animación solo cambian la fase.
- **2xl exacto**: la grilla usa los anchos 251/310/311/300 y gap 51, centrada. Igual que en Figma, sobresale 2.5px por lado.
  Columnas en x 57.5 / 359.5 / 720.5 / 1082.5 (Figma: 58 / 360 / 721 / 1083).
- **Cards**: se usa `figure`, con `figcaption` (avatar `aria-hidden`, nombre y rol) seguido de `blockquote`.
  **Nombre y rol hacen salto de línea** en vez del `text-ellipsis` de Figma: los títulos de proyecto reales son largos
  (p. ej. "Diseño Integral de Imagen: App, Web y Logo para Potenciar mi Marca") y truncarlos ocultaría información.
  Las iniciales se forman con la primera y la última palabra ("Toni Fernández Leal" → TL, como en 174:212; "Elliot" → E).
  El tono del avatar es `(columna + fila) % 4`: dos cards contiguas nunca comparten tono, tampoco en la unión del bucle.
- **Prueba social**: es la imagen rasterizada de Figma (38:319), con alt en español ("Más de 56 clientes satisfechos,
  valoración de cinco estrellas"). **A confirmar**: el texto "Trusted by clients worldwide" está en inglés dentro de la imagen,
  y la imagen fuente es de 1x (426px), así que en pantallas retina se ve algo blanda.
- **CTA**: "DEJANOS" se corrige a "Déjanos un comentario" (las mayúsculas las pone `uppercase`) y se mantienen los 3 espacios
  antes del "+" (`aria-hidden`), como en 38:321. No existe un destino para reseñas, así que apunta a `/#contacto`, igual que el CTA del header. **A confirmar.**
- **Copy**: son las 20 reseñas textuales del .md, en orden (el test compara con la tabla). Las erratas de la sección
  "Para confirmar con el cliente" (#14, #18, #20 y los nombres "La agencia" / "El estudio Sensei") **no se corrigen**, porque el .md dice que no se corrige solo.
  Flavio Mayorga no aparece.

## Responsive inferido (medido en Chrome headless sobre el build)

| Ancho | Cabecera | Masonry | Columnas | Card | Scroll horizontal |
|---|---|---|---|---|---|
| 375 | apilada; prueba social a 343 × 73; CTA de 44 de alto | 560 de alto | 1 (343), 20 cards, 240s | 343 | no |
| 768 | apilada; prueba social a 426 × 91 | 646 | 2 × 336, 120s | 336 | no |
| 1024 | fila (aside a la derecha) | 702 | 2 × 452 | 452 | no |
| 1280 | fila | 758 | 4 en proporción (227 / 281 / 282 / 272), gap 46 | 227–282 | no |
| 1440 | **eyebrow a 268 del panel del showcase; h2 405 × 112 (2 líneas); prueba social 426 × 91 a 31 del eyebrow; gap 5; CTA alineado abajo con el h2** | **gap 41 y alto 793** | **251 / 310 / 311 / 300, gap 51** | p24 r16 shadow-card | no |
| 1920 | igual a 1440, centrado | 793 | igual | — | no |

Estilos a 1440: nombre en Google Sans Flex 15/500 `rgb(9,9,9)`, rol 12/400 `rgb(110,110,115)` y cita 13/19.5 `rgb(104,104,104)`.
Avatar de 40, DM Sans 14/700 y tonos 1–4. Fade con máscara de 120px.

## init.ps1

```
[OK] toolchain · pnpm install · estado (1 in_progress) · estados válidos · dependsOn
check:ds → 313 tokens · 0 ds-allow · 0 error(es)   [OK]
check:arch → 48 archivos · 8 módulos · 0 error(es) [OK]
astro check → 0 errors                             [OK]
vitest → 108 passed (14 files)                     [OK]
astro build                                        [OK]
VERDE: todo en orden.
```
