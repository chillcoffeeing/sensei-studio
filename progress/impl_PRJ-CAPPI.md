# impl PRJ-CAPPI: caso real Cappi Xtremo

Figma `flzA0qnj6JdalFCgyB2PdI`, frame `267:2146` (Proyecto 5). `get_metadata` del frame y `get_design_context` de
267:2147 (hero), 267:2231 (resultados), 267:2259 (contexto), 267:2307 (solución), 267:2336 (proceso, vacío en metadata
pero con diseño), 267:2397 (alcance) y 267:2462 (cierre + siguiente + contacto). Imágenes de solución: nodos sueltos de
243:20 (posiciones verificadas con `get_metadata` de 243:20) exportados con `download_assets` (imagen original).

## Archivos

Creados:
- `src/content/data/projects/cappi-xtremo.json`: PageDoc case-study (9 secciones) con el copy de 267:2146; `project-next.projectSlug = "yupa"`.
- `src/assets/projects/cappi-xtremo/cover-laptop.jpg`: portada 320:576 (raw 2039×1402). Se recortaron 6 px por lado porque traía esquinas redondeadas grises horneadas. JPEG q88.
- `src/assets/projects/cappi-xtremo/logo.png`: logo del hero, 268:7394. El raw solo existe a 142×67.
- `src/assets/projects/cappi-xtremo/solution-website.jpg`: web de venta, 268:7397. Raw 1872×895, opaco, así que va en JPEG. Es media[0], junto a la lámina.
- `src/assets/projects/cappi-xtremo/solution-portal-home.png`: inicio del portal, 268:7400 (raw 1878×862). Es media[1].
- `src/assets/projects/cappi-xtremo/solution-portal-payments.png`: pagos del portal, 268:7402 (raw 1877×876). Es media[2].
- `src/assets/projects/cappi-xtremo/solution-backoffice.png`: escritorio del backoffice, 268:7403 (raw 1872×867). Es media[3].
- `src/assets/projects/cappi-xtremo/conclusion-website-hero.jpg`: recorte 3:2 (1177×785) del centro de 268:7397, con los niños y el titular de la web.
- `src/assets/projects/tools/claude.png`: logo de Claude (image 34, 277:8193). El raw es 800×600; se ajustó a su caja de alfa (548×118), sin redibujar.

Modificados:
- `src/content/data/projects/las-donas.json`: `project-next.projectSlug` pasa de "yupa" a "cappi-xtremo".
- `src/content/data/pages/home.json`: la galería suma `cappi-xtremo` (4 tarjetas). `/proyectos/` usa `projectCycle()` y lo recoge solo.
- `src/modules/project-hero/HeroCover.astro`: corrige los dos menores de verify_PRJ-MEDIA.
  - `sizes` cambia a `(min-width: 1024px) 100vw, 1700px` y `widths` suma 2000. Hasta lg, object-cover escala el recorte 1440:830 a unos 1700 px CSS, así que el navegador ya no elige la versión de 640 px.
  - La capa `--project-cover-shade` (con la sombra lateral) pasa de `lg:` a `md:`.
- `src/modules/project-scope/ScopeTools.astro`: con 4 herramientas, la rejilla va en una fila desde sm y en 2×2 en mobile (Figma 267:2439 tiene 4 en fila). Con `grid-cols-3`, GitHub quedaba solo en la segunda fila. Con 3 herramientas no cambia nada.
- `src/styles/tokens.css`: `--project-cover-shade-sm` más densa en el tramo del h1 (ver Tokens).
- `docs/content-model.md`: ciclo Yupa → Remittven → Las Doñas → Cappi Xtremo → Yupa.
- `docs/design-system.md`: la capa lateral empieza en md, no en lg.
- `design/content-gaps.md`: nuevo bloque Cappi Xtremo y textos de "tres casos" pasados a cuatro.
- `progress/current.md`: plan.

Sin componentes nuevos ni cambios de esquema.

## Decisiones y desviaciones

- **Solución**: la rejilla 2×2 de Figma (268:7400/7402/7403/7404) repite la pantalla de pagos, porque 268:7404 es idéntica a 268:7402 (mismo md5).
  - Se publican las tres piezas distintas, cada una como bloque `media[]` a todo el ancho.
  - Motivo: un collage 2×2 en un solo bloque sería ilegible a 375 (cada pantalla quedaría en unos 150 px). Su proporción (≈2,17) además llena bien el `aspect-44/21` de los bloques anchos.
  - El orden coincide con "Tres piezas": web, portal (inicio y pagos) y backoffice.
- **Conclusión**: en Figma (267:2463) es una copia de Remittven: "En fintech…", "Remittven confirmó…" y la foto del portátil de Remittven.
  - Publicar eso en Cappi sería un error, así que se escribió un aprendizaje provisional a partir del copy del propio caso.
  - La imagen es un recorte de la web de Cappi.
  - Ambas cosas quedan como PLACEHOLDER P2 en content-gaps.
- **Contexto**: el segundo párrafo de Figma (267:2267) repite el primero palabra por palabra. Como `description` es opcional, se omite (anotado).
- **Herramientas**: GitHub reutiliza `tools/github.svg`, el mismo logotipo que el PNG image 35 de Figma.
- **Normalizaciones**:
  - "SEMANAS 1" → "Semana 1".
  - Se quitaron los espacios iniciales de varias cadenas.
  - El h2 de contexto va en dos líneas (`\n`), como en los otros casos.
  - Categoría y estado van en tipo oración, como en Las Doñas.
  - La descripción SEO se recortó a 160 caracteres (límite del esquema).
- Se mantienen textuales y quedan como PUNTO A CONFIRMAR:
  - el overline "Flujo de recompensas", que viene de la plantilla de Yupa;
  - el año 2025 de la lámina;
  - las descripciones "Claude" y "GitHub", que solo repiten el nombre.

## Tokens

- Ninguno agregado ni eliminado.
- Modificado `--project-cover-shade-sm`: pasa de 0.45 / 0.25 (30 %) / 0.85 (70 %) a 0.6 / 0.5 (30 %) / 0.85 (70 %).
  - Motivo: las cuatro portadas son ahora pantallas claras de portátil. A 375, el h1 "Cappi Xtremo" caía sobre la interfaz rosa y blanca del portal con muy poco contraste.
  - Comprobado también en Yupa a 375: más oscuro, pero el portátil sigue reconocible.

## Responsive

- **Hero**:
  - A 375 y 768 ya no se ve blando: el srcset elige la de 2000 px.
  - A 768, la capa lateral (md) deja el h1 y la promesa sobre fondo oscuro.
  - A 1440 la composición es la de Figma, con el portátil a la derecha.
  - Logo a 56 px de alto en mobile y 80 px desde lg (topes existentes de HeroLogo).
- **Solución**: lámina más web en dos columnas desde lg y tres bloques anchos debajo. En mobile, todo apilado en `aspect-4/3` con `contain`: las pantallas se ven pequeñas pero enteras (mismo layout que el resto de casos).
- **Alcance**: 4 herramientas en fila a 1440 y 768, y en 2×2 a 375.
- **Home**: 4 tarjetas en 2×2 desde lg, sin destacada porque el número es par y no hay huecos. `/proyectos/` también muestra 4.
- **Revisión**: Chrome headless con reduced motion a 1440, 1024, 768 y 375. El de 375 se hizo con un iframe del ancho exacto, en una página temporal que después se borró de `dist/`.
- Siguiente proyecto: desde Las Doñas lleva a Cappi y desde Cappi a Yupa.

## init.ps1

```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[OK] check:ds → 0 ds-allow · 0 error(es)
[OK] check:arch → 280 archivos · 23 módulos · 0 error(es)
[OK] astro check → 0 errors
[OK] astro build
VERDE: todo en orden.
```
