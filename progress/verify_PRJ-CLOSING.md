# Verify PRJ-CLOSING — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V7/acceptance] La tarjeta del siguiente proyecto no apunta todavía a `/proyectos/<siguiente>`: en el build `href="/#proyectos"`, porque `content/projects/atlas.ts` no existe y `/proyectos/atlas/` no se genera. Es un respaldo documentado: `src/content/projects.ts:15-22` cambia el destino a `/proyectos/atlas/` en cuanto exista ese contenido, y el destino actual existe (`id="proyectos"` en `dist/client/index.html`). No es un enlace roto. El orquestador debe decidir si crear el caso Atlas es una feature aparte.
- [V5] Los props de `NextProjectCard` no son del todo mínimos: recibe el `ProjectNext` entero (`src/modules/project/NextProjectCard.astro:5-10`), con `label` y `projectId`, que no usa. Si se quiere apurar la regla de props mínimos, se pueden pasar solo `href`, `image`, `category`, `name`, `summary`, `cta` e `icon`, o un `Omit<ProjectNext, 'label' | 'projectId'>`. No bloquea.

## Verificado sin hallazgos
- **V1**: `./init.ps1` VERDE (exit 0): toolchain, install, estado (solo PRJ-CLOSING `in_progress`), check:ds, check:arch, astro check y build.
- **V2 estructura**: comparé `get_screenshot` de 216:3224 (fileKey `flzA0qnj6JdalFCgyB2PdI`, que cubre 216:3225, 216:3233 y 216:3249) con una captura del build a 1440. Coinciden en todo:
  - el orden: conclusión (foto a la izquierda, aprendizaje a la derecha), luego siguiente proyecto (etiqueta y tarjeta foto | info sobre arena) y luego contacto sobre tinta (invitación a la izquierda; dos píldoras y la nota a la derecha);
  - los bloques y la jerarquía.

  `Section.astro:27-29` las monta después de Alcance. Las desviaciones están justificadas en el informe y no empeoran el resultado: h2 con `text-project-title` y `text-balance`, píldoras del mismo ancho, hover y foco.
- **Enlace del siguiente proyecto**: `dist/client/proyectos/origen/index.html` lleva `<a href="/#proyectos" ...>` y el ancla existe en el index del build.
- **Enganche QTE-MODAL**: `<a href="/#contacto" data-quote-open>` está en el HTML del build (`ContactQuoteLink.astro:17-19`). Está documentado en:
  - `ContactQuoteLink.astro:12-16`;
  - `schema.ts:406-410`;
  - `docs/components.md:602`.

  Funciona sin JS, porque `#contacto` existe en el index. El contrato (delegar los clics en `[data-quote-open]`, `preventDefault`, abrir y devolver el foco) cuadra con la acceptance de QTE-MODAL ("Lo abren ... 'Solicita una cotización' del contacto del proyecto").
- **Componentes aislados y props mínimos** (pedido del usuario): hay un componente por bloque del diseño y ninguno tiene variantes ni modos:
  - `ProjectConclusion`/`ConclusionLesson`;
  - `ProjectNext`/`NextProjectCard`;
  - `ProjectContact`/`ContactInvitation`/`ContactOptions`/`ContactMeetingLink`/`ContactQuoteLink`.

  Reunión y cotización son dos componentes separados en lugar de uno con `variant`, que es lo correcto según la regla. Las líneas del resumen, el título y la nota se iteran con datos. El copy viene de `content/projects/origen.ts`: no hay strings en los componentes salvo comentarios.
- **V3 responsive**: Chrome headless (perfil temporal propio, PID 28492 terminado por PID; servidor `http.server`, PID 23660 terminado por PID), build servido y reduced motion emulado.
  - Medido a 375, 768, 1024 y 1440: `scrollWidth == innerWidth` en todos, sin elementos que desborden.
  - Las píldoras miden 343x48 a 375 y 252x48 desde 768, así que el área táctil es ≥44px.
  - Tamaño del h2 de contacto: 36px a 375, 48.5px a 768, 56.7px a 1024 y 70px a 1440.
  - Las capturas a 375 y 1440 se ven legibles, apiladas en mobile y en fila a 1440.
- **V4 assets**: los 5 assets existen en `src/assets/project/` y se importan en `origen.ts`.
  - La foto de detalle se renderiza a 3:2 y la de Atlas con `object-cover` en 16:9 / columna de 7/12.
  - Las flechas son 30x30 y conservan la proporción.
- **V5**:
  - sin `[0-9#]` arbitrarios (solo `widths={[...]}` de `<Image>`, que es un prop y no una clase);
  - sin hex, `client:load`, `any` ni `ds-allow`;
  - sin z-index mágico;
  - los imports son solo `./`, `astro:assets`, `@/shared` y `@/core`.

  En tokens, `--text-project-next` y `--text-project-contact` son nuevos, se usan una vez cada uno y no redefinen nombres de Tailwind ni usan `initial`. Los scripts de reveal están acotados a la sección y no hay islas.
- **V6**:
  - hay un solo `<h1>` en la página y cada sección tiene su h2 (conclusión y contacto con `aria-labelledby`; la región del siguiente proyecto con `aria-label`);
  - alt descriptivo en la foto de detalle y alt vacío en la de Atlas y en las flechas, que son decorativas dentro del enlace;
  - `focus-visible` con outline en la tarjeta y en las dos píldoras;
  - motion con `motion-safe:` y `reveal-up` + `revealAll`, que respeta reduced motion.
- **V7**: los cambios se limitan al módulo `project`, al contenido de origen, a `content/projects.ts`, a 2 tokens y a docs, como pide la acceptance.
