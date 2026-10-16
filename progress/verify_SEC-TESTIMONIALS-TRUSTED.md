# Verify SEC-TESTIMONIALS-TRUSTED — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V2 · proceso] `get_design_context` de 38:319 no se pudo pedir: el MCP de Figma devuelve el límite de llamadas del plan Starter (confirmado por el verifier). Se usó el volcado guardado `design/figma/homepage.0.txt` (l. 468-472). En él, 38:319 es un único `<img>` 426 × 91 de `imgImage27`, sin capas. La fidelidad se comprobó contra `design/references/trusted-by.png` y la captura comparativa del implementer. Las medidas salen del raster, porque Figma no tiene medidas de capa.
- [V2] Ancho del texto: 208px en el código y unos 188px en el raster. Se debe a la fuente (Google Sans Flex, la del proyecto, frente a otra familia en el raster). Aun así cabe dentro del marco de 426 (18 + 170 + 15 + 208 = 411). Es aceptable.
- [Acceptance] El acceptance dice "avatares circulares", pero la referencia visual muestra cuadrados redondeados (radio 12). El implementer siguió la referencia, que es lo correcto. Conviene corregir la redacción en `feature_list.json` (tarea del orquestador).
- [Fuera de alcance, preexistente] `src/content/pages/home.ts:467`: `masonryLabel` dice "se detienen al pasar el cursor o al enfocar", pero desde MOT-SLIDERS-SHOWCASE el hover no pausa. No lo introdujo esta feature. Conviene arreglarlo en otra.

## Verificado sin hallazgos
- **V1**: el verifier ejecutó `./init.ps1` y terminó en código 0, "VERDE: todo en orden" (ds, arch, types, tests, build).
- **V2**:
  - Marco lg `h-91 w-426`, contenido en `pt-27 pl-18`, igual que el raster.
  - Pila de 4 avatares y "56+" en una caja de 50, aro de 3 `avatar-ring` (#F5F5F5), radio 12, solape 20.
  - Gap de 15 hasta el bloque de estrellas y texto.
  - 5 estrellas #FB9826 con paso 13.75.
  - Caption de 16px: "Trusted by" en ink medium y "clients worldwide" en ink-muted.
  - Columna aside 38:323 con gap 5 y alineada a la derecha en lg.
  - La captura de 1440 coincide con la referencia.
  - Tokens nuevos anotados con su origen en `src/styles/tokens.css` (l. 87, 546, 630-638).
- **V3**: revisión estática más las capturas del implementer (`progress/screens/SEC-TESTIMONIALS-TRUSTED-375.png`, `-compare.png`). No se lanzó un navegador propio.
  - A 375 la pila escala a 40 y el texto baja de línea con `flex-wrap`, sin desbordar (`max-w-full` en el marco).
  - A 768 cabe en una fila.
  - A 1024 y 1440 está dentro del marco de 426.
  - No hay elementos interactivos nuevos, así que no aplica el área táctil.
- **V4**:
  - `src/assets/testimonials/avatar-placeholder-1..4.png` existen, son PLACEHOLDER marcados en `home.ts:451` y se usan con `object-cover` en una caja cuadrada.
  - `src/assets/ui/star.svg` existe.
  - `social-proof.png` está eliminado, sin referencias en `src/` y con un test que lo verifica.
- **V5**:
  - Sin `client:load`, `any`, `ds-allow` ni valores arbitrarios `[...]`, ni hex en `.astro`.
  - Copy en `content/pages/home.ts`, no en componentes.
  - Sin imports entre módulos.
  - `TrustBadge` está en `shared/ui`, documentado en `docs/components.md:365`.
  - Sin CSS propio, solo utilidades y tokens.
- **V6**:
  - Avatares `alt=""` dentro de `aria-hidden`.
  - "56+" `aria-hidden` con `sr-only` "Más de 56 clientes".
  - Estrellas `role="img"` con `aria-label="Valoración: 5 de 5"`.
  - Caption con `lang="en"`.
  - No añade encabezados.
- **V7**: los cambios se limitan a TrustBadge, sus tipos, el schema, la sección y los datos de testimonials, tokens, catálogo, docs y tests. Todo cae dentro del acceptance.
