# impl PRJ-REMITTVEN — Caso real: Remittven

Figma `flzA0qnj6JdalFCgyB2PdI` frame `254:604`. `get_design_context` pedido de 254:605, 254:650, 254:678,
254:726, 254:775, 254:836 y 254:906. 254:748 ("Compra móvil") está vacío en Figma (metadata: el frame 254:750 no tiene hijos).

## Archivos

- `src/content/data/projects/remittven.json` — nuevo: PageDoc case-study completo (9 secciones), con el copy textual de Figma.
- `src/assets/projects/remittven/logo.png` — logo del hero (254:952, raw de Figma, 191×38).
- `src/assets/projects/remittven/solution-screens.png` — pantallas 254:986 (raw de Figma, 1708×1141, fondo transparente).
- `src/assets/projects/remittven/conclusion-laptop.png` — imagen de conclusión 254:908 (raw de Figma, 1704×1165).
- `src/assets/projects/tools/maze.png` — logo de Maze (267:1743): el raw es un cuadrado de 500×500 sobre blanco; se recortó a la ventana visible en Figma (500×117, mismo encuadre que el nodo 137×32) y el blanco pasó a transparente (luminancia → alfa, logo negro). Sin redibujar.
- `src/modules/project-process/schema.ts` + `ProcessStage.astro` — `stages[].deliverable` pasa a opcional (Remittven no trae entregables por etapa); sin él no se pinta el párrafo.
- `src/core/content.ts` — `MediaRef.fit?: 'cover' | 'contain'` (opcional y genérico, regla 7).
- `src/shared/lib/media.ts` — `UiMedia.fit?` (contrato estructural con core).
- `src/shared/ui/Photo.astro` — con `fit: 'contain'`: `fit="inside"` en astro:assets (no recorta al generar) y respaldo PNG (conserva la transparencia).
- `src/modules/project-solution/Section.astro` — los medios con `fit: 'contain'` se pintan con `object-contain p-4 sm:p-8` sobre el `bg-neutral-100` del hueco; el resto sigue en `object-cover`.
- `src/modules/project-solution/SolutionIdentity.astro` — la lámina es `@container` y el logotipo tipográfico tiene un tope por longitud (`min(token, N cqi)`, ~0,56em por carácter). "Remittven®" ya no se parte en "Remittve / n®"; "Yupa®" queda igual (el tope supera al token).
- `docs/content-model.md` — `MediaRef.fit?` y `deliverable?` documentados.
- `design/content-gaps.md` — bloque de Remittven; borrada la línea de Yupa · project-next (ya hay siguiente proyecto real).
- `feature_list.json` (estado `in_progress`), `progress/current.md` (plan).

## Tokens

Ninguno agregado ni eliminado.

## Decisiones y desviaciones de Figma

- **Pantallas de la solución (254:986)**: en Figma van sobre un panel gris con aire alrededor. Con `object-cover` la plantilla las recortaba (sobre todo a 1024, donde el hueco es casi cuadrado). Se añadió `fit: 'contain'` como campo opcional genérico: el medio se ve entero y con aire en todos los anchos.
- **Logotipo de la lámina**: Figma usa 110px en una tarjeta de 612; el token llega a 121px y partía la palabra. El tope por longitud lo hace caber en cualquier ancho.
- **Next project**: no se fija `projectSlug`; el orden alfabético cíclico da remittven → yupa → remittven.
- **Copy**: textual de Figma, con estas correcciones (anotadas en content-gaps): "SEMANAS 1" → "Semana 1"; "tiempo rea" → "tiempo real"; se quitan espacios iniciales; se omite la 3.ª línea oculta del título de resultados; la cabecera de la lámina usa "Remittven / Sistema de marca" en lugar de "ORIGEN / …" (como en Yupa). Los textos de plantilla dudosos ("Flujo de recompensas", "juguetón", descripción de Maze = "Maze", etapa "Construir") se mantienen textuales y quedan como PUNTO A CONFIRMAR.
- **Portada**: el slot 254:621 está vacío: sin `cover`, el hero se pinta en tinta (como en Figma).
- Métricas: "7 → 4 pasos" se separa en `before: "7"` y `after: "4 pasos"` (lo mismo para las otras dos).

## Responsive (revisado con capturas headless, reduced motion)

- 375 (dentro de un iframe de 375, porque Chrome headless impone un ancho mínimo de ventana): todo apilado, sin overflow horizontal; el logotipo de la lámina cabe en una línea; las pantallas se ven enteras con `p-4`.
- 768: la lámina y las pantallas apiladas a todo el ancho; la paleta y el concepto en una fila.
- 1024 y 1440: lámina y pantallas en dos columnas de 440px de alto; las pantallas, enteras y centradas.
- Siguiente proyecto: la tarjeta de Yupa se deriva bien en todos los anchos.

## init.ps1

```
[OK] Toolchain · Dependencias · Estado (1 in_progress) · check:ds (0 errores) ·
check:arch (276 archivos, 22 módulos, 0 errores) · astro check (0 errores) · astro build
VERDE: todo en orden.
```
