# Verify MOT-REVEAL — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V7] `src/content/pages/home.ts:467`: se cambia `masonryLabel` ("…se detienen al enfocar con el teclado").
  La acceptance no lo pide. Corrige un menor anterior (MOT-SLIDERS-SHOWCASE: el hover ya no pausa),
  el copy está en la capa de contenido y es solo un aria-label. Se acepta. Queda anotado para el historial.
- [V2] No se pidió `get_design_context` de `11:12` (homepage entera; límite del plan Starter del MCP).
  La feature es solo de motion y no cambia layout, medidas ni copy visible: SectionHeader solo gana el
  atributo `data-head-part`, sin clases nuevas. Sin impacto en la fidelidad.

## Verificado sin hallazgos
- **V1**: `./init.ps1` ejecutado por el verifier → VERDE (toolchain, install, estado, ds, arquitectura, astro check, vitest, build).
- **Primitiva compartida (MOT-001)**: las tres secciones usan `reveal-up` + `revealAll(section)` de
  `@/shared/lib/motion`, con un script acotado por sección (`[data-testimonials-section]`, `[data-faq-section]`,
  `[data-contact-section]`). Sin CSS a mano: la variante `head-parts:` (`@custom-variant`, global.css:135)
  compila a `.head-parts\:reveal-up :where([data-head-part])` dentro de la guarda
  `(scripting: enabled) and (prefers-reduced-motion: no-preference)` (comprobado en `dist/client/_astro/BaseLayout.*.css`).
- **Escalonado** (DOM real, Chrome headless): testimonios con cabecera `--motion-index:0`, aside `1` y masonry `2`;
  FAQ con cabecera `0` y acordeón `1`; contacto con cabecera `0`, formulario `1` y legal `2`.
- **Disparo una sola vez, solo opacity/transform** (CDP a 375/768/1024/1440): antes de hacer scroll, `data-inview`
  está ausente y cada item tiene `opacity 0 · translateY(48px)`. Tras `scrollIntoView` + 2,5 s, `data-inview` está
  presente y todos los items tienen `opacity 1 · matrix(…,0,0)`. El keyframe `reveal-up` solo usa opacity y
  translate3d, así que no hay CLS. `inView` sin callback de salida, así que se dispara una sola vez.
- **V3**: `scrollWidth − innerWidth ≤ 0` en los 4 anchos (sin scroll horizontal). El desplazamiento es solo vertical.
- **prefers-reduced-motion**: captura a 375 con `--force-prefers-reduced-motion`. FAQ (acordeón con la primera
  abierta) y contacto (card, campos, botón y legal) se ven completos y en su estado final.
- **Sin JS**: `reveal-*` solo oculta bajo `(scripting: enabled)`, así que el contenido queda visible.
- **Interacciones**: `--motion-index` heredado no lo leen AccordionCards, ContactForm, ReviewCard, TrustBadge ni
  LinkMore (grep). No hay `position: fixed/sticky` dentro de los wrappers transformados. La card glass (backdrop-blur)
  no se anima. Los otros usos de SectionHeader no cambian (el atributo `data-head-part` no tiene efecto sin la variante).
- **V4**: no se añadieron ni quitaron assets.
- **V5**: grep en los 4 archivos tocados: sin `[0-9#]` arbitrarios, hex, `client:load`, `any`, `ds-allow`, z-index
  mágico ni imports entre módulos. Las islas siguen con `client:visible`.
- **V6**: se mantienen un h2 por sección, `aria-labelledby` y el foco visible del masonry. Reduced-motion verificado.
- **Docs**: patrón documentado en `docs/conventions.md:147` y `docs/components.md:100`. Tests nuevos en `tests/reveal-sections.test.ts`.
