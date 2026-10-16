# impl FIX-OPEN-MINORS: contraste de la bio del equipo, textos de pausa sin hover y velocidad del showcase

Primera vuelta. La feature no tiene `figmaNodes`. Figma es referencia: la estructura no cambia.

## Archivos

- `src/styles/tokens.css`: nuevos `--team-detail-scrim-top` y `--team-detail-scrim-bottom`; `@contrast` de `--color-paper-soft` corregido; `--duration-showcase-slide` pasa de 12s a 7350ms, con su anotación.
- `src/modules/team/Section.astro`: los dos bloques de texto de la capa de detalle (rol + empresa arriba, nombre + bio abajo) llevan su banda oscura. Los márgenes negativos son iguales al padding de la capa, así que la maqueta no se mueve. Se añade el comentario de cabecera.
- `src/shared/lib/slider/timing.ts`: el respaldo `showcaseSlide` pasa a 7350.
- `src/content/ui-catalog.ts`: ShowcaseCarousel y TeamSlider dicen "pausa con foco de teclado, swipe, pestaña oculta o reduced-motion".
- `src/modules/showcase/schema.ts`: JSDoc con la pausa real; deja claro que el hover/cursor NO pausa.
- `src/content/pages/home.ts`: los `aria-label` de showcase y equipo ya no dicen "al pasar el cursor"; ahora dicen "se detienen al enfocarlos con el teclado o al deslizar". Comentarios corregidos.
- `docs/components.md`: banda AA en TeamSlider y velocidad 7.35s (≈ 53px/s) en ShowcaseCarousel.
- `docs/design-system.md`: regenerado (`pnpm docs:ds`, 427 tokens).
- `tests/open-minors.test.ts` (nuevo):
  - clases de banda y fundido de 48px;
  - contraste AA en el peor caso (píxel blanco), calculado desde los tokens, y prueba de que solo con el velo no llegaba;
  - anotación `@contrast` corregida;
  - labels, catálogo y JSDoc sin hover/cursor;
  - token y respaldo de 7350 ms, con velocidad ≈ 53px/s.
- `progress/current.md`: plan.

## Tokens

- `--team-detail-scrim-top: linear-gradient(to bottom, rgba(0,0,0,.55) calc(100% - 48px), rgba(0,0,0,0) 100%)` y `--team-detail-scrim-bottom` (igual, `to top`). `@derived`.
  - Con el velo 0.3 más la banda 0.55, un píxel blanco de la foto queda en ≈ 0.315 sRGB.
  - En ese peor caso, el texto `paper-soft` da ≈ 5.1:1 y `paper` ≈ 7.1:1. Se cumple AA con cualquier foto, no solo con el retrato actual.
  - El fundido de 48px coincide con el `pt-48`/`pb-48` del bloque, así que el texto siempre queda sobre la banda sólida.
- `--duration-showcase-slide: 7350ms`. `@derived`: paso de 389.6px (card 369.6 + gap 20) / 53px/s ≈ 7.35s. En 375 el paso es de 188px → ≈ 25.6px/s, igual que antes (25).
- `--color-paper-soft`: no cambia de valor; solo se corrige la anotación con la medida real del verifier (mediana 7.1:1, 30% de la zona bajo 4.5:1, mínimo 2.6:1) y la nueva garantía con la banda.

## Decisiones (responsive y desviaciones)

- **Banda acotada al texto, en vez de subir el velo**: subir `--team-card-veil` a ≈ 0.65 apagaría toda la foto. La banda solo oscurece donde hay texto y deja ver la cara en el centro de la card.
- **Banda en los bloques, no en porcentajes de la card**: no se ancla a porcentajes del alto de la card porque la bio ocupa una proporción distinta en 260×320 (mobile) que en 344×423. Así la banda sigue al alto real del texto en cualquier breakpoint y con bios largas.
- **Mismo tratamiento en táctil y desktop**: aplica al estado base táctil y reduced-motion, y al detalle de desktop (hover/foco), porque vive en la capa de detalle. No se reintroduce blur en mobile.
- **Desviación de la referencia** (`design/references/team-hover-final.png`, velo uniforme): el borde superior e inferior de la card queda más oscuro. La estructura no cambia (mismas capas, orden y posiciones).
- **Banda superior**: además de la bio, la acceptance pide rol y empresa, que también están sobre la foto.

## No verificado

- No se probó en un navegador real ni en un dispositivo. El contraste se garantiza de forma analítica con el peor caso.

## init.ps1

```
Toolchain / Dependencias / Estado (1 in_progress)     [OK]
Sistema de diseno (check:ds)                           [OK]
Arquitectura (check:arch)                              [OK]
Tipos (astro check)                                    [OK]
Tests (vitest, incluye tests/open-minors.test.ts)      [OK]
Build (astro build)                                    [OK]
VERDE: todo en orden.
```
