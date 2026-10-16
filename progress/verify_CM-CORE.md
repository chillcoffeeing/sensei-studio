# Verify CM-CORE — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V5] `src/shared/lib/media.ts:60`: una URL de Unsplash sin `width`/`height` produce un `RemoteImage` con `width: 0, height: 0` (atributos 0 en el `<img>`). Hoy todos los datos los traen, así que no se nota; sugerencia: exigirlos en `checkMedia` (`src/core/content.ts:40`) cuando `isUnsplashUrl(src)`, igual que ya se exige `credit`.
- [V5] `src/content/pages.ts:371`: la validación se detiene en el primer archivo inválido (`map` + `throw`). Con dos JSON rotos solo se informa del primero (probado: con `creditos.json` y `home.json` inválidos a la vez, solo sale `creditos.json`). Aceptable; se podría acumular los errores de todos los archivos antes de lanzar.
- [V4] `src/assets/brand/sensei-logo.svg` sin uso y emitido a `dist/_astro` por el glob de `media.ts` (ya lo anota el implementer como fuera de alcance).

## Verificado sin hallazgos
- **V1**: `./init.ps1` ejecutado por mí → `VERDE: todo en orden` (check:ds, check:arch, astro check, build).
- **Paridad (V2/V3)**: build previo del implementer (`scratchpad/before`, fechado 15:37, anterior a cualquier cambio en `src/` de hoy) frente a `dist/client` reconstruido por mí: `cmp` idéntico byte a byte en `/`, `/creditos/`, `/links/`, `/componentes/`, `/proyectos/origen/`. Como el HTML incluye los nombres con hash de CSS/JS, también coinciden estilos e islas, y por tanto los cuatro anchos (375/768/1024/1440), los ids de ancla, las islas y el motion. No hice capturas porque, con el HTML idéntico, no aportan nada.
- **SEO**: `/creditos/` emite title, description, canonical, og:type/title/description/url/image(+width/height/alt) y twitter:*; es idéntico al de antes porque el HTML no cambia. `DocumentHead.astro:58-63` emite `seo.jsonLd` con `<` escapado; `ogImage` admite URL o clave.
- **Anclas de la home**: inicio, clientes, proyectos, por-que-elegirnos, proceso, servicios, destacados, testimonios, equipo, faq, contacto (+ `*-title`).
- **JSON puro validado en build**: `src/content/data/pages/{home,creditos}.json`. Probé a romper los datos y luego restauré los dos archivos desde una copia; el SHA-1 coincide con el original (`home` 2d2c80ed…, `creditos` ecf5f9c8…) y después reconstruí. Con datos inválidos `pnpm build` termina con código 1 e indica archivo, ruta y campo:
  - `creditos.json: seo.description: Too small: expected string to have >=1 characters`
  - `home.json: sections[3](stats).content.items[0]: Unrecognized key: "extra"`
  - `home.json: sections[8](team).content.members[0].photo.src: clave local inexistente en src/assets: "team/no-existe.jpg"`
  - `home.json: sections[9](faq).headingContent.title: Invalid input: expected array, received number`
- **Esquemas zod por módulo**: los 12 `modules/*/schema.ts` (hero … contact, credits) usan `astro/zod` y exportan `<type>SectionSchema` desde `index.ts`. Los tipos salen todos de `z.infer`, sin `interface` escritas a mano. `app/sections.ts` define `SECTION_TYPES as const`, `z.discriminatedUnion('sectionType')`, `pageSchema` y una comprobación en compilación de que el enum y la unión coinciden. `app/templates.ts` tiene `home` y `credits`. Todos los objetos son `strictObject`.
- **core/content.ts**: PageDoc, SectionDoc, Seo (con `jsonLd` y `ogImage: string`), Heading y MediaRef siguen `docs/content-model.md`. `core → shared` está permitido por `docs/architecture.md:28` y `check-architecture.mjs:16`.
- **MediaRef por cadena**: `shared/lib/media.ts` resuelve tres casos. Una clave local pasa por un glob sobre `src/assets` y una clave inexistente da error tanto en la validación como al resolver. Unsplash va por imgix con `crop` recuperado de la URL; créditos y UTM no cambian (HTML idéntico) y en los datos no había `download_location`. Cualquier otra URL se pinta con un `<img>`. Los logos e iconos SVG se referencian por clave (`logo-marquee/adobe.svg`, …).
- **Sin restos del modelo anterior**: `grep` sin resultados para `headingEyebrow|headingDescriptions|PageOf|SectionBase|AnySection|RemoteImageRef|core/page|content.h1|registeredTypes|UiRemoteImage` en `src/`, `scripts/` y `docs/`. Solo aparecen en `docs/content-model.md`, que describe el modelo sustituido, y en `docs/prompt.txt`, que es histórico. Ya no existen `core/page.ts` ni `content/pages/*.ts`.
- **content-gaps**: existe `design/content-gaps.md` con las marcas PLACEHOLDER / PUNTO A CONFIRMAR, una por línea.
- **V5**: ningún `any`, `ds-allow` ni import entre módulos. Los dos `client:load` (FloatingBar y Header) ya existían y están justificados.
- **V7**: el alcance se ajusta a `acceptance`. `scripts/check-architecture.mjs` no cambió y `docs/architecture.md:74` apunta a `docs/content-model.md`.
