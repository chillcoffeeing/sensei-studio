# impl MOT-REVEAL — vuelta 1

Entrada a viewport de testimonios ("Lo que dicen nuestros clientes"), FAQ y contacto ("Let's talk.")
con la primitiva de MOT-001 (`reveal-up` + `revealAll()`), escalonada cabecera → aside/descripción → contenido.

## Figma

`11:12` es la homepage entera; la feature es solo de motion (sin cambios de layout, medidas ni copy).
No se pidió `get_design_context` del nodo raíz: Figma no aporta datos de motion aquí y el marcado
estático no cambia (el MCP ya devolvía el límite del plan Starter en MOT-TEAM-MOBILE).

## Archivos

- `src/styles/global.css` — variante `head-parts:` (`& :where([data-head-part])`), aplica una utilidad a las partes de SectionHeader desde un ancestro.
- `src/shared/ui/SectionHeader.astro` — marca neutra `data-head-part` en la columna eyebrow+h2 y en el wrapper del aside (sin props nuevas: MAX_PROPS=4 ya estaba lleno; sin efecto si la sección no opta).
- `src/modules/testimonials/Section.astro` — `data-testimonials-section`; contenedor `[data-reveal="[data-head-part], [data-reveal-item]"]` + `head-parts:reveal-up`; masonry como item `reveal-up`; `<script>` con `revealAll(section)` acotado.
- `src/modules/faq/Section.astro` — `data-faq-section`; mismo patrón (cabecera → acordeón); script acotado.
- `src/modules/contact/Section.astro` — `data-contact-section`; la card glass es el contenedor `[data-reveal]`; items: cabecera, wrapper del formulario, legal. La card y el fondo no se animan. Script acotado.
- `src/content/pages/home.ts` — `masonryLabel`: "Reseñas de clientes (se desplazan solas; se detienen al enfocar con el teclado)" (corrige el menor preexistente: el hover ya no pausa).
- `tests/reveal-sections.test.ts` — nuevo: script acotado por sección, contenedor único, amount/margin, todos los items con `reveal-up`, variante `head-parts`, SectionHeader sin animación propia, card glass sin animar, label sin "cursor".
- `tests/faq.test.ts` — regex del wrapper del acordeón actualizado (`data-reveal-item ... reveal-up`).
- `docs/conventions.md` — Motion: patrón "Sección completa con cabecera" (head-parts, script acotado, no anidar reveal-*).
- `docs/components.md` — SectionHeader: `data-head-part` y cómo optar a la entrada.
- `progress/current.md` — plan de la vuelta.

## Tokens

Ninguno nuevo. Se reutilizan `--animate-reveal-up` (1s, ease-enter), `--duration-stagger` (200ms),
`--motion-distance-reveal` (48px). `pnpm docs:ds` no necesario (tokens.css sin cambios).

## Decisiones

- Disparo: `data-reveal-amount="0"` + `data-reveal-margin="0px 0px -15% 0px"` (cuando el borde superior
  del contenedor cruza el 85% del viewport), independiente del alto (el FAQ y el masonry apilados en
  mobile son más altos que el viewport; con `amount` podían no dispararse).
- Responsive: el mismo escalonado en todos los breakpoints; en mobile el orden del documento coincide con
  el apilado (cabecera → aside → contenido), así que la secuencia se lee de arriba abajo.
- Sin JS: `reveal-*` solo oculta bajo `(scripting: enabled) and (prefers-reduced-motion: no-preference)`;
  con reduced-motion `reveal()` marca `data-inview` al instante. Solo opacity/transform: sin CLS.
- `--motion-index` heredado no afecta al acordeón (`markEntrySides()` fija el suyo antes de abrir) ni al
  masonry/form (no lo leen).
- Islas (`AccordionCards`, `ContactForm`, `client:visible`) siguen hidratando: la opacidad 0 no afecta al IntersectionObserver.

## init.ps1

```
[OK] node / pnpm / install / feature_list / tokens / fronteras
[warn] 104 tokens sin uso aparente (preexistente)
[OK] astro check
[OK] vitest (520 tests)
[OK] astro build
VERDE: todo en orden.
```
