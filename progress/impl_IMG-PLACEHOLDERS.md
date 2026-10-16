# Implementación IMG-PLACEHOLDERS

## Informe de corrección — vuelta 2 (2026-10-09)

Se resolvieron los bloqueantes V2/V3 y el mayor V7 del informe de verificación. La feature queda
`in_progress`; no se cambió su estado.

### Correcciones

- **V2 — `services-branding-sketchbook`:** imagen re-curada de Unsplash, ID `_CGxNOLM1gQ`,
  fotografía de Max Saeling. Se eligió por su cuaderno abierto de páginas claras y lápiz de madera
  sobre una mesa color terracota, con plantas y luz cálida; el color medio registrado es `#c0a68c`.
  Es notablemente más clara que la anterior y armoniza con las tarjetas claras y la bolsa crema del
  trío Branding. La selección ejecutó `download_location`; se mantienen hotlink a Unsplash,
  atribución y referido UTM. El alt, ID, foto y autor están actualizados en el manifiesto y en la
  tabla generada de créditos.
- **V3 — `/creditos/`:** los enlaces de autor y Unsplash ahora son `inline-flex` con `min-h-11`
  (44px), alineados al centro. Se conserva el subrayado, la atribución, los estilos
  `focus-visible` y la jerarquía; no se modifica el layout de la página.
- **V7 — excepción autorizada:** texto exacto registrado en `feature_list.json`:
  > Excepción autorizada expresamente por el usuario (2026-10-09), solo para sustituir los assets IA ausentes por Unsplash: project-laptop-table, project-stationery, project-phone-hand, project-skincare, project-cafe, project-tablet-interior, services-branding-cards, services-branding-sketchbook, services-branding-tote y services-email-phone-linen; no se extiende a otros slots. Los demás 27 slots mantienen la decisión Unsplash ya autorizada.

  Los 10 slots son exactamente: `project-laptop-table`, `project-stationery`, `project-phone-hand`,
  `project-skincare`, `project-cafe`, `project-tablet-interior`, `services-branding-cards`,
  `services-branding-sketchbook`, `services-branding-tote`, `services-email-phone-linen`.
  `design/placeholders.md` registra la autorización expresa del usuario con fecha 2026-10-09, que
  reemplaza los assets IA ausentes, limita la excepción a esos 10 y deja los otros 27 bajo la
  decisión/criterios Unsplash ya autorizados. No se extiende el alcance a ningún otro slot.

### Desviación visual

La única diferencia visual autorizada es sustituir la foto oscura de `services-branding-sketchbook`
por la imagen clara y cálida descrita arriba para cumplir la dirección de arte y cohesionar el trío.
No se alteraron dimensiones, composición, orden de secciones ni layout. El área activa de los
enlaces de créditos crece verticalmente a 44px por accesibilidad táctil; no se cambió otro detalle
visual.

### Archivos tocados en esta corrección

- `src/content/unsplash-photos.json` — foto, ID, alt y atribución actualizados para `services-branding-sketchbook`.
- `design/placeholders.md` — excepción expresa documentada y fila de crédito regenerada para Max Saeling.
- `src/modules/credits/Section.astro` — área de enlace de autor/Unsplash con alto mínimo de 44px.
- `feature_list.json` — excepción de fuente/asset acotada; `status` permanece `in_progress`.
- `progress/current.md` — autorización y plan actualizados, sin nota de excepción pendiente/no autorizada.
- `progress/impl_IMG-PLACEHOLDERS.md` — informe de corrección.

**Tokens:** ninguno agregado, modificado ni eliminado. La medida usa la utilidad nativa Tailwind
`min-h-11`; no requiere cambio de `docs/design-system.md`.

### Verificación de corrección

- JSON: `feature_list.json` y `src/content/unsplash-photos.json` válidos; 37 entradas Unsplash.
- Crédito de `services-branding-sketchbook`: Max Saeling, ID `_CGxNOLM1gQ`, enlace a la foto y URL
  de autor; el generador conserva enlaces de referido `utm_source=sensei_studio&utm_medium=referral`.
- `./init.ps1`: **VERDE: todo en orden**. `check:ds` y `check:arch` pasan sin errores; `astro check`
  registra 0 errores, 0 warnings y 1 hint preexistente en `DocumentHead.astro`; build correcto,
  con prerender de `/`, `/links/`, `/proyectos/origen/`, `/creditos/` y `/componentes/` (además de
  robots/sitemap).

## Resultado

La vuelta inicial de implementación tuvo `./init.ps1` **VERDE**. Se reparó la discrepancia entre
los slots usados por `home.ts` y el manifiesto Unsplash, se completaron los créditos y las rutas
prerenderizan sin clave de API. En esta vuelta la feature permanece `in_progress`.

## Inventario de huecos

| Área | Huecos | Estado anterior | Resultado |
|---|---:|---|---|
| Home · galería de proyectos | 6 | Dos capturas de proyectos alternadas, repetidas y saturadas frente al tono Origen | Seis fotos Unsplash distintas y acreditadas |
| Home · servicios | 12 (3 por disciplina) | El mismo placeholder DAS repetido en Branding, Email, UX/UI y Desarrollo | 12 fotos distintas, seleccionadas por disciplina |
| Home · destacados | 7 | Capturas heterogéneas y repetidas con la galería del footer | Siete fotos independientes |
| Home · equipo | 1 placeholder | Foto genérica de stock, ajena a la dirección de arte | Retrato con alt descriptivo; la foto real de Natalia no se toca |
| Home · testimonios | 4 avatares | Stock pequeño y borroso en retina | Cuatro retratos diferentes; recorte imgix `crop=faces`, decorativos |
| Home · contacto | 1 fondo | Foto de monitores con marcas y UI legible | Escritorio cálido sin cambios de composición |
| Footer · galería | 6 (4 tarjetas + 2 entrantes) | Imágenes de estilos distintos y reutilizadas desde la galería | Seis fotos únicas, atribuidas |
| `/proyectos/origen/` | Imágenes del caso y siguiente caso | Ya coherentes con la referencia Origen | Sin cambio; se conservan sus assets locales |
| `/links` | Tarjeta Origen + cabecera | La tarjeta reutiliza la portada del caso; la cabecera es una textura, no una foto | Sin cambio; reutilización intencional y textura conservada |

Total de placeholders fotográficos del sitio: **37** (6 proyectos + 12 servicios + 7 destacados +
6 footer + 1 equipo + 4 testimonios + 1 contacto). Las 37 entradas tienen ID único y crédito.

## Dirección de arte y desviaciones

Dirección única documentada en `design/placeholders.md`: la familia de Origen/Atlas, con luz
natural cálida de tarde, sombras largas, travertino, yeso, lino, kraft, cerámica y madera clara;
paleta arena/hueso/arcilla/oliva, contraste bajo, grano fino y encuadres editoriales. Se evita
texto legible, logos y marcas. Los retratos son personas anónimas y se sirven centrados en la cara.
El acento lima corresponde al token `--color-brand` y no se fuerza en cada fotografía.

**Desviación de fuente autorizada:** al revisar el workspace no estaban los 10 assets IA ni había
copias en `design/placeholders/` o `src/assets/`. El usuario autorizó expresamente el 2026-10-09
sustituir esos assets ausentes por Unsplash solo en los 10 slots enumerados en `design/placeholders.md`;
los otros 27 slots siguen bajo la decisión/criterios Unsplash ya autorizados. No se cambió el orden
ni la estructura de las secciones, ni la composición de los slots.

## Unsplash, créditos y responsive

- `scripts/unsplash-curate.mjs` guarda en `src/content/unsplash-photos.json` IDs, `urls.raw`,
  dimensiones, alt español y autor/enlaces. Se completaron 12 slots ausentes y el manifiesto
  final tiene 37 fotos únicas.
- Las 12 selecciones nuevas ejecutaron `download_location` según API Guidelines. El registro de
  curación local confirmó 23 peticiones en la última hora (11 búsquedas y 12 registros de
  descarga); no se descargaron archivos de imagen.
- El build solo lee JSON: no consulta Unsplash ni necesita `UNSPLASH_ACCESS_KEY`. `Photo.astro`
  conserva hotlink a `images.unsplash.com`, `width`/`height`, `loading`, `sizes` y srcset de cada
  slot; la URL imgix usa `w`, `h`, `fit=crop`, `auto=format`, `q=70` y `dpr=1`. El navegador elige
  densidad mediante los descriptores de ancho del `srcset`; fijar `dpr=1` evita multiplicar el
  ancho elegido por segunda vez.
- `/creditos/` lista dinámicamente fotos de la home y footer con miniatura, alt y atribución
  «Foto de <autor> en Unsplash». Los enlaces de autor, foto y Unsplash llevan
  `utm_source=sensei_studio&utm_medium=referral`. `design/placeholders.md` incluye la tabla
  completa generada (37 filas).
- Sin cambios de layout: en móvil se mantiene el apilado existente; cada `Photo` hereda `sizes` y
  proporción del slot. Anchos de srcset y dimensiones explícitas preservan la nitidez y evitan CLS.

## Archivos creados o modificados

- `scripts/unsplash-curate.mjs` — búsqueda, registro de descarga, manifiesto y créditos.
- `src/content/unsplash-photos.json` — metadatos de los 37 slots remotos.
- `src/content/unsplash.ts` — resolución tipada de slots a imagen y crédito.
- `src/content/pages/home.ts` — fotos de proyecto, servicios, destacados, testimonios, equipo y contacto.
- `src/content/site.ts` — fotos placeholders del footer y enlace de créditos.
- `src/content/pages/creditos.ts` — datos dinámicos de la página de atribución.
- `src/core/page.ts` — contrato local/remoto de imagen y crédito.
- `src/core/site.ts` — `PhotoRef` en la galería del footer.
- `src/shared/lib/remote-image.ts` — URL imgix responsive, referido y `dpr=1`.
- `src/shared/ui/Photo.astro` — render local con `Picture` o remoto con `img/srcset`.
- `src/shared/ui/types.ts` — tipo de foto que consume la librería UI.
- `src/shared/ui/ShowcaseCarousel.astro` — consumo de `Photo`.
- `src/shared/ui/AvatarStack.astro` — avatares remotos con recorte de cara.
- `src/shared/ui/TrustBadge.astro` — consumo de fotos remotas.
- `src/shared/ui/TeamCardPlaceholder.astro` — placeholder del equipo con `Photo`.
- `src/layout/Footer.astro` — presentación de imágenes del pie.
- `src/layout/FooterGalleryCard.astro` — tarjeta de foto del pie.
- `src/modules/contact/ContactBackdrop.astro` — fondo remoto del contacto.
- `src/modules/contact/schema.ts` — tipo de foto de contacto.
- `src/modules/services/Section.astro` — fotos remotas de servicios.
- `src/modules/services/schema.ts` — tipo de fotos de servicio.
- `src/modules/showcase/schema.ts` — tipo de foto de destacados.
- `src/modules/team/schema.ts` — tipo de foto de equipo.
- `src/modules/testimonials/schema.ts` — tipo de foto de avatar.
- `src/modules/credits/schema.ts` — contrato de contenido de créditos.
- `src/modules/credits/Section.astro` — sección responsive y atribuciones.
- `src/modules/credits/index.ts` — API pública del módulo de créditos.
- `src/app/sections.ts` — unión de secciones con créditos.
- `src/app/registry.ts` — registro de la sección.
- `src/content/ui-catalog.ts` — muestra local/remota de `Photo`.
- `src/pages/componentes.astro` — render de la muestra `Photo`.
- `docs/components.md` — API y consumidores de `Photo`.
- `docs/conventions.md` — regla de hotlink y créditos Unsplash.
- `docs/architecture.md` — contratos y dependencias del módulo de créditos.
- `design/placeholders.md` — inventario, dirección de arte, criterio y 37 créditos.
- `progress/current.md` — plan actualizado con el hallazgo de assets IA ausentes.
- `progress/impl_IMG-PLACEHOLDERS.md` — este informe.

**Tokens:** ninguno agregado, modificado ni eliminado; `docs/design-system.md` no requiere cambio.

## Verificación

- `check:ds`: 0 errores.
- `check:arch`: 273 archivos, 14 módulos, 0 errores.
- `astro check`: 0 errores; queda 1 hint preexistente en `DocumentHead.astro` (`media` en `onload`).
- `astro build`: correcto; prerenderizó `/`, `/links/`, `/proyectos/origen/`, `/creditos/` y
  `/componentes/`, además de robots/sitemap.
- Resumen de `./init.ps1`: **VERDE: todo en orden.**
