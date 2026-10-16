# impl HOME-NO-STOCK: sin Unsplash ni imágenes de relleno

Figma `flzA0qnj6JdalFCgyB2PdI`. `get_design_context` de 291:1384 (con captura: es un collage de 8 pantallas
enmascaradas, no un layout) y `download_assets` (export a escala 1) de cada collage. `get_metadata` de la
página 0:1 para comprobar los nodos de PRJ-MEDIA.

## Hallazgos de Figma

- **Ya no existen en el archivo**: las portadas de Econergía (291:1689), Truma (291:2103), Lavy (291:2686),
  la portada alternativa de Yupa (291:1847) y 291:2800 ("not found" en `get_screenshot` y export vacío). No se usan.
- **Collages nuevos** en la misma fila (y 2047) que no listaba PRJ-MEDIA: 291:5154 (Soldee, agrupado),
  291:7282 (Just Make It Fun, tienda online) y 291:7283 (Yupa: pedido, pago y confirmación).
- Qfud, Pictdare, Referi, Soldee y Just Make It Fun son trabajo del estudio (collages de su portafolio), pero no
  casos publicados: se usan como piezas de galería sin enlace. Documentado en `design/placeholders.md`.

## Archivos

Creados:
- `src/assets/portfolio/qfud-app-screens.jpg`: 291:1384.
- `src/assets/portfolio/pictdare-app-screens.jpg`: 291:1412.
- `src/assets/portfolio/referi-app-screens.jpg`: 291:1439.
- `src/assets/portfolio/soldee-app-screens.jpg`: 291:5154.
- `src/assets/portfolio/just-make-it-fun-web-screens.jpg`: 291:7282.
- `src/assets/projects/remittven/portfolio-app-screens.jpg`: 291:1451.
- `src/assets/projects/yupa/portfolio-checkout-screens.jpg`: 291:7283.
  (Todos: export ×1, sin los 20 px del borde redondeado (las esquinas transparentes salían en el recorte), JPEG q85 a 1600 px.)
- `src/assets/ui/user-placeholder.svg`: silueta neutra (cabeza + hombros, gris #A3A3A3 = neutral-400). No existía asset.
- `src/shared/ui/UserPlaceholder.astro`: persona sin foto; sin props, llena la caja de quien la coloca (bg-neutral-200, silueta abajo a 3/4 del ancho con tope `max-w-48`). La reutilizará TEAM-REAL.

Modificados:
- `src/core/content.ts`: `MediaRef` pierde `credit` (y `creditedMediaRefSchema`) y gana `position?` (enum `CROP_POSITIONS`).
- `src/shared/lib/media.ts`: fuera la rama Unsplash/imgix y `isUnsplashUrl`; `CROP_POSITIONS`, `CropPosition`, `objectPositionClass`.
- `src/shared/ui/Photo.astro`: solo local (Picture con `position` en el recorte del servidor + clase `object-*`) o URL simple.
- `src/shared/ui/AvatarStack.astro`, `TrustBadge.astro`, `types.ts` (`UiAvatar { photo? }`): sin foto → `UserPlaceholder`.
- `src/shared/ui/TeamCardPlaceholder.astro`: sin foto → `UserPlaceholder` (antes bloque ink).
- `src/modules/testimonials/schema.ts`: `trust.avatars: { photo?: MediaRef }[]` (min 1).
- `src/modules/team/schema.ts`: comentarios del hueco (sin cambio de forma).
- `src/modules/showcase/schema.ts`: fuera `placeholder` (ya no hay slides provisionales).
- `src/modules/services/Section.astro`, `accordion.ts`: fuera la rama remota; `getImage` recibe `position`.
- `src/modules/project-solution/Section.astro`: capturas `contain` más apaisadas que 4:3 → en mobile con su propia proporción (menor de verify_PRJ-CAPPI).
- `src/modules/project-scope/ScopeTool.astro`: logos en caja de 32 px con tope `max-w-24` + `object-contain object-left` (altura óptica: el PNG de Claude ya no pesa más que los SVG).
- `src/layout/FooterGalleryCard.astro`, `src/shared/ui/ShowcaseCarousel.astro`: comentarios (sin imgix).
- `src/core/site.ts`: fuera `FooterGalleryCard.placeholder`.
- `src/content/site.ts`: rueda del pie con piezas de proyectos; fuera "Photo Credits" (y su enlace a /creditos/).
- `src/content/data/pages/home.json`: 12 imágenes de servicios, 3 slides del showcase, 4 avatares (`{}`), hueco 3 del equipo (sin foto) y fondo de contacto.
- `src/content/data/pages/proyectos.json`: `projects` explícito (Yupa, Remittven, Las Doñas, Cappi Xtremo), mismo orden que la home (menor de verify_PRJ-CAPPI).
- `src/content/pages.ts`: fuera la derivación de grupos de créditos.
- `src/app/registry.ts`, `sections.ts`, `templates.ts`: fuera el tipo `credits`.
- `src/content/ui-catalog.ts`, `src/pages/componentes.astro`: entrada y muestra de `UserPlaceholder`; textos de Photo/TeamCardPlaceholder.
- `docs/content-model.md` (regla 9 "sin stock", `position`, sin `credits`, orden de /proyectos/), `docs/conventions.md`, `docs/architecture.md`, `docs/components.md` (`UserPlaceholder`, `TrustBadge`, `TeamCardPlaceholder`, `Photo`, `ShowcaseCarousel`).
- `design/placeholders.md`: reescrito como "origen de cada pieza" (nodos, reparto por slot y encuadres).
- `design/content-gaps.md`: fuera las filas de Unsplash y de créditos; quedan Email Marketing (sin piezas de email), Branding (sin manual/papelería), avatares y huecos del equipo.
- `progress/current.md`: plan.

Borrados:
- `src/content/unsplash.ts`, `src/content/unsplash-photos.json`, `src/shared/lib/remote-image.ts`,
  `src/modules/credits/` (schema, Section, index), `src/content/data/pages/creditos.json` (ruta /creditos/ y su entrada del sitemap),
  `scripts/unsplash-curate.mjs`. `astro.config.mjs` no tenía dominios remotos: sin cambios.
- No tocado: `.env` (puede contener la clave de Unsplash del script borrado; ya no la usa nada: el usuario puede quitarla).

## Reparto (detalle en design/placeholders.md)

- Servicios (187:318): Branding = florista de Las Doñas, Qfud (`left`), Pictdare (`left`); Email = Just Make It Fun (`left`),
  Yupa pedido (`right`), Las Doñas en portátil; UX/UI = confirmación de Remittven, Referi (`left`), Soldee (`left`);
  Desarrollo = catálogo de Yupa, backoffice de Cappi (`left`), portal de Cappi en portátil.
- Showcase (616:658): los 3 huecos de Unsplash → Qfud, Referi, Pictdare (el collage casi cuadrado entra entero).
- Contacto: conclusión de Remittven (portátil con su web). Pie: mockup de Yupa (`left`), Las Doñas y Remittven en portátil,
  web de Cappi, Soldee y collage de Remittven (`top`).
- Testimonios: 4 `UserPlaceholder`. Equipo: los 3 huecos con `UserPlaceholder`.

## Tokens

Ninguno agregado ni borrado (las utilidades `object-*`, `bg-neutral-200`, `max-w-24/48` son de Tailwind). Revisado que el
módulo `credits` no dejara tokens huérfanos. `docs/design-system.md` sin cambios.

## Desviaciones de Figma (con motivo)

- Huecos del equipo 40:384/40:386 (bloque ink) → silueta neutra, igual que el 40:385: un solo lenguaje para "integrante sin foto"; TEAM-REAL lo retoma.
- "Photo Credits" (174:57) se quita del pie: no queda nada que acreditar.
- Logos de herramientas: tope de ancho de 96 px (los raster anchos bajan de alto) para igualar la altura óptica con los SVG.

## Responsive inferido

- Slots de servicios, showcase y pie: recorte en el servidor a la proporción del slot con `position` (sharp) y la misma
  `object-*` en el `<img>` por si la caja es fluida. Collages: encuadre `left` para conservar el logotipo de la app o la primera pantalla.
- Solución de los casos: en mobile (< sm) las capturas `contain` con proporción > 4:3 (p. ej. 2.17) usan la suya (`h-auto`
  y `height` del respaldo según el asset); desde sm, `aspect-44/21` (anchas) o `aspect-4/3` (acompañante) como antes; lg igual.
- `UserPlaceholder`: `size-full` del contenedor; silueta a 3/4 del ancho (avatar de 40–50 px) con tope de 192 px (card de 260–344 px).
- Revisado en Chrome headless con reduced motion (sirviendo `dist/client` por file://, el sandbox bloquea el preview local):
  home a 1440 y a 500 (ancho mínimo de la ventana headless; 375 exacto queda para el verifier), Las Doñas a 500 y Cappi Xtremo a 1440.
  768 y 1024 no se capturaron. Sin animaciones nuevas.

## init.ps1

```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[OK] check:ds → 0 ds-allow · 0 error(es)
[OK] check:arch → 276 archivos · 22 módulos · 0 error(es)
[OK] astro check → 0 errors
[OK] astro build
VERDE: todo en orden.
```
Build: 0 apariciones de "unsplash" en `dist/client`; `sitemap.xml` sin `/creditos/`.
