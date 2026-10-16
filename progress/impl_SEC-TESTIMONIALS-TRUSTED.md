# impl SEC-TESTIMONIALS-TRUSTED · vuelta 1

"Trusted by clients worldwide" (Figma 38:319) pasa de raster a HTML con Tailwind: componente
`TrustBadge` en `shared/ui`, datos en `content/pages/home.ts`.

## Fuente de medidas

- El MCP de Figma devolvió **límite de cuota (plan Starter)** en `get_design_context` 38:319, así que
  no pude volver a pedirlo. En el volcado guardado (`design/figma/homepage.0.txt` l.469), 38:319
  es solo un `<img>` 426 × 91 de `imgImage27` (recorte superior): **en Figma no hay capas**, el
  nodo es un raster.
- Así que todas las medidas salen del píxel de `design/figma/assets/imgImage27.png` (que
  coincide con `design/references/trusted-by.png`), medidas con script (bounding boxes,
  centroides):
  - pila de avatares: x 18 → 187, y 27 → 76 ⇒ 5 cajas de 50 con paso 30 (solape 20); aro de 3px
    #F5F5F5; radio exterior 12 (perfil de esquina: inset 9/7/4 en las filas 0/1/3); interior 44.
    Contador ink #090909 con "56+" blanco (glifos de 10px de alto ⇒ 14px bold = `text-initials`).
  - estrellas: 5, centroides en x 209.99 / 223.74 / … ⇒ paso exacto 13.75; glifo ≈ 11.5 × 10.9;
    color #FB9826; centro vertical en y 39.
  - texto: empieza en x 203 (aire de 15 tras la pila), mayúscula de y 56 a 66 ⇒ 16px; "Trusted
    by" ink medium, "clients worldwide" ink-muted regular.
- **Discrepancia con el acceptance**: dice "avatares circulares"; la referencia (y el raster)
  muestra **cuadrados redondeados** (radio 12). Seguí la referencia visual.

## Archivos

- `src/shared/ui/TrustBadge.astro` — nuevo: pila de avatares + contador, estrellas (role="img") y texto en dos tonos.
- `src/shared/ui/types.ts` — tipos `UiCount`, `UiRating` y `UiCaption`.
- `src/assets/ui/star.svg` — nuevo: estrella (fill #FB9826, viewBox 24, en el asset como `eyebrow-dot.svg`). No había vector en Figma (el nodo es un raster).
- `src/assets/testimonials/avatar-placeholder-{1..4}.png` — nuevos: PLACEHOLDER, 44 × 44 recortados de imgImage27 (la parte visible de cada foto; la tapada se rellena con el borde difuminado).
- `src/assets/testimonials/social-proof.png` — **eliminado** (raster ya sin uso).
- `src/modules/testimonials/schema.ts` — `socialProof: ImageRef` pasa a `trust: TestimonialsTrust`.
- `src/modules/testimonials/index.ts` — exporta `TestimonialsTrust`.
- `src/modules/testimonials/Section.astro` — usa `TrustBadge`; desde lg lo envuelve en la caja de Figma (`lg:h-91 lg:w-426 lg:pt-27 lg:pl-18`); quitado `astro:assets`.
- `src/content/pages/home.ts` — datos `trust` (avatares PLACEHOLDER, "56+", 5 estrellas, caption con `lang: 'en'`).
- `src/content/ui-catalog.ts`, `src/pages/componentes.astro` — TrustBadge en el catálogo `/componentes`.
- `src/styles/tokens.css` — tokens nuevos (abajo).
- `docs/components.md` — ficha `TrustBadge` y tabla de consumidores; `docs/design-system.md` regenerado (`pnpm docs:ds`).
- `tests/testimonials.test.ts` — contrato de `trust` (4 avatares con alt vacío, "56+" + label, 5 estrellas "5 de 5", caption de Figma en inglés, raster borrado, la sección usa TrustBadge).
- `tests/ui-consumption.test.ts` — testimonials consume `TrustBadge`.
- `progress/screens/SEC-TESTIMONIALS-TRUSTED-compare.png` (referencia / 1440 / 1024) y `…-375.png`.

## Tokens agregados

| Token | Valor | Origen |
|---|---|---|
| `--color-avatar-ring` | #F5F5F5 | @figma 38:319 aro (medido en imgImage27) |
| `--radius-avatar-stack` | 12px | @figma 38:319 radio exterior (medido) |
| `--avatar-stack-size` | clamp(40px … 50px) | @figma 38:319 50 · @derived 40 a 375 |
| `--avatar-stack-overlap` | clamp(16px … 20px) | @figma 38:319 50 − paso 30 · @derived 16 a 375 (proporcional) |
| `--trust-badge-gap` | clamp(12px … 15px) | @figma 38:319 x 188 → 203 · @derived 12 a 375 |
| `--rating-star-size` | 13.75px | @figma 38:319 paso entre centroides de estrellas |
| `--trust-badge-rating-gap` | 7px | @figma 38:319 estrellas (y 39) sobre texto (y 56), ajustado a la métrica de Google Sans Flex |

El resto reutiliza tokens: `border-3`, `bg-ink`, `text-paper`, `text-initials`, `text-body`, `text-ink`, `text-ink-muted`, `font-medium`, `spacing-18/27/91/426`.

## Tailwind v4 first

Todo con utilidades y tokens (`size-(--…)`, `not-first:-ml-(--…)`, `rounded-avatar-stack`,
`border-avatar-ring`). **Sin CSS propio**.

## Accesibilidad

- Fotos `alt=""` dentro de un contenedor `aria-hidden`. El "56+" visible va `aria-hidden` y al lado hay un `sr-only` con "Más de 56 clientes".
- Estrellas: `<span role="img" aria-label="Valoración: 5 de 5">` con 5 `<img alt="">`.
- Caption con `lang="en"`. **Copy**: va en inglés porque así está en Figma y en el acceptance. Si se quiere en español, basta con cambiar `trust.caption` en `home.ts`.

## Responsive inferido

- Desde lg, el marco 426 × 91 con el contenido en x 18 / y 27 reproduce la posición del raster en la columna alineada a la derecha (38:323). Por debajo de lg no hay marco: el contenido queda alineado al gutter.
- El avatar escala de 40 a 50 y el solape de 16 a 20 (la misma proporción, así la parte visible de cada foto no cambia); el gap pasa de 12 a 15.
- `flex-wrap`: a 375 el texto (208px en Google Sans Flex) no cabe junto a la pila (136 + 12) y baja de línea, alineado a la izquierda. Desde unos 390px de ancho cabe en una fila.

## Fidelidad medida (Chrome headless, 1440, CDP)

- Marco 426 × 91. Pila en x 18 / y 27, 170 × 50, igual que el raster. Primera estrella en x 203.06 (raster 203.1).
- Píxeles en vertical: estrellas y 33–42 (raster 34–44); texto y 55–70 (raster 56–69).
- El ancho del texto es de 208 (raster 188): el raster usa otra familia, y aquí va la fuente del proyecto (Google Sans Flex, `font-heading`).

## init.ps1

```
[OK] toolchain, pnpm install, estado (1 in_progress)
check:ds → 424 tokens · 0 ds-allow · 0 error(es)
check:arch → 117 archivos · 11 módulos · 0 error(es)
astro check → 0 errors
Tests 505 passed (505)
[OK] astro build
VERDE: todo en orden.
```
