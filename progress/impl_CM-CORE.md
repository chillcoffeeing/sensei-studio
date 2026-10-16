# impl CM-CORE — Modelo de contenido PageDoc (zod + JSON + medios por URL)

Refactor sin cambio visual. **Paridad comprobada byte a byte**: el HTML de `dist/client` de `/`,
`/creditos/`, `/proyectos/origen/`, `/links/` y `/componentes/` es idéntico (`cmp`) antes y después
(build previo guardado en el scratchpad antes de tocar `src/`). Mismos ids de ancla, islas, motion,
SEO y sitemap.

## Archivos

Creados
- `src/core/content.ts`: esquemas zod base (`toneTextSchema`, `linkSchema`, `mediaRefSchema`, `creditedMediaRefSchema`, `sliderLabelsSchema`, `headingSchema`, `seoSchema`), `sectionSchema()`, `pageDocSchema()`, tipos `PageDoc`, `SectionDoc`, `Seo`, `Heading`, `MediaRef`, `Link`; helpers `sectionKey` / `headingIdOf`; `LocalImageRef` / `ImageRef` (= `LocalImageRef | MediaRef`) quedan para chrome, proyecto y /links hasta CM-PROJECT.
- `src/shared/lib/media.ts`: `resolveMedia` / `resolvePhoto` / `mediaIcon` / `localAsset` / `videoType`, `isMediaUrl`, `isUnsplashUrl`, `hasLocalAsset` (glob perezoso sobre `src/assets/**`).
- `src/app/templates.ts`: `TEMPLATES` (`home`, `credits`) `as const` + `typesOutsideTemplate()`.
- `src/content/data/pages/home.json`, `src/content/data/pages/creditos.json`: documentos PageDoc en JSON puro (home generado con un script de conversión desde el `.ts` anterior: sin errores de transcripción).
- `design/content-gaps.md`: los PLACEHOLDER / PUNTO A CONFIRMAR que vivían como comentarios en `home.ts` (19 líneas) + el título del grupo "proyectos" de créditos.

Borrados
- `src/core/page.ts` (SectionBase, PageOf, AnySection, RemoteImageRef, Seo anterior): sin alias.
- `src/content/pages/home.ts`, `src/content/pages/creditos.ts`.

Modificados
- `src/app/sections.ts`: `SECTION_TYPES` as const, `sectionDocSchema` (discriminatedUnion por `sectionType`), `pageSchema`, `Page = PageDoc<Section>`, `SectionOf<T>`; comprobación en compilación de que enum y unión coinciden.
- `src/app/registry.ts`: claves por `sectionType`; fuera `registeredTypes` / `isRegisteredType` (sin uso).
- `src/content/pages.ts`: loader (glob de `data/pages/*.json`) → `safeParse`; error con archivo y ruta (`sections[3](stats).content.items[0].value: …`); aviso si un tipo queda fuera de su plantilla; deriva `groups` de créditos; `pageBySlug()`.
- `src/content/unsplash.ts`: devuelve un `MediaRef` con `credit` (lo usa el pie, `site.ts`); fuera la opción `crop` (sin uso: ahora va en la URL).
- `src/content/ui-catalog.ts`: lee la home del loader y la cabecera desde `headingContent`.
- `src/content/projects/origen.ts`: `og: { type }` → `ogType` (Seo nuevo).
- `src/modules/{hero,logo-marquee,project-gallery,stats,process,services,showcase,testimonials,team,faq,contact,credits}/schema.ts`: esquemas zod de `headingContent` y `content` + `<type>SectionSchema`; tipos con `z.infer`; `index.ts` exporta el esquema.
- `src/modules/*/Section.astro` (los 12): `headingContent.eyebrow/title/description`, `headingIdOf(section)` / `sectionKey(section)`.
- `src/modules/hero/HeroBackgroundVideo.astro`: recibe `MediaRef` (`kind: 'video'`); el MIME sale de la extensión.
- `src/modules/logo-marquee/Section.astro`, `src/modules/services/Section.astro` (+ `accordion.ts`: `srcset?`), `src/modules/contact/ContactBackdrop.astro`: medios vía `shared/lib/media`.
- `src/shared/ui/Photo.astro`: acepta `MediaRef` (o imagen importada) y lo resuelve: clave local → `<Picture>`, Unsplash → srcset imgix, otra URL → `<img>`.
- `src/shared/ui/ProjectCardMetric.astro` (icono por clave con `mediaIcon`), `src/shared/ui/TeamCard.astro` (foto por clave; exige local por hover.ts), `src/shared/ui/types.ts` (`UiPhoto = UiImage | UiMedia`).
- `src/shared/lib/remote-image.ts`: fuera `UiRemoteImage` / `isRemoteImage` (sin uso).
- `src/layout/DocumentHead.astro`: `seo.ogImage` (URL o clave), `seo.ogType`, `keywords` opcional, emite `seo.jsonLd` (`<script type="application/ld+json">`, `<` escapado).
- `src/pages/[...slug].astro`: `page.sections` y `sectionType`.
- Import `@/core/page` → `@/core/content` en `core/site.ts`, `layout/*` y los módulos `project` / `links` (adaptación mínima: siguen con su modelo propio).
- `docs/architecture.md` (capas, anatomía, "Modelo de contenido" apunta a `docs/content-model.md`, pasos para agregar un tipo), `docs/components.md` (Photo, ejemplos con `headingContent`), `docs/conventions.md` (imágenes = MediaRef).
- `feature_list.json` (CM-CORE → `in_progress`), `progress/current.md` (plan).

## Decisiones

- **Dónde va cada texto**: el h1 vive en `headingContent.title` del hero (ToneText; el wordmark usa su texto plano) y de credits. Las descripciones de cabecera de stats, services y team pasan de `content.description` a `headingContent.description`. El `lead` del hero sigue en `content`.
- **Zod estricto** (`z.strictObject`): una clave mal escrita en el JSON rompe el build (si no, zod la descartaría en silencio). Una clave de `src/assets` inexistente se detecta en la validación (ruta + campo) y otra vez al resolver.
- **Unsplash**: `src` = `urls.raw`; el recorte `crop=faces` viaja en la URL y `media.ts` lo saca para que `imgixUrl` genere exactamente las mismas URLs. `credit` (autor, perfil, foto) va en el MediaRef; los UTM se añaden al pintar como antes. No existía `download_location` en los datos: nada que conservar.
- **Créditos**: `groups` no se escribe en el JSON; el loader lo deriva de los `MediaRef` con `credit` de la home (por sección, en orden) y de la galería del pie. Los títulos visibles vienen de `content.groupTitles` (por id de sección; sin entrada se ve el id, como antes: "proyectos" queda en `design/content-gaps.md`).
- **Plantillas**: el documento no lleva campo `template` (no está en el contrato); `content/pages.ts` asocia slug → plantilla y avisa por consola en build si sobra un tipo.
- **Glob de assets perezoso**: cada página importa solo los metadatos que usa (`resolveMedia` es async; Astro lo admite en el frontmatter). Astro emite igualmente todo lo que casa con el patrón: `src/assets/brand/sensei-logo.svg`, que nadie usa, aparece en `dist/_astro`. Sugerencia fuera de alcance: borrar ese asset muerto.
- **check-architecture.mjs sin cambios**: los `.json` no son código y `astro/zod` es un paquete sin puerta; las capas existentes ya cubren `content/data`.
- Sin dependencias nuevas (`astro/zod` = zod 4 que ya trae Astro). Sin tokens nuevos ni borrados (no se toca `docs/design-system.md`).
- Validación probada a mano: con `logos[0].src` inexistente, un `value` numérico y una clave `typo`, el build falla con:
  `sections[1](logo-marquee).content.logos[0].src: clave local inexistente…`, `sections[3](stats).content.items[0].value: Invalid input: expected string, received number`, `sections[3](stats).content.items[0]: Unrecognized key: "typo"`.

## Responsive inferido

No aplica: no cambia marcado ni clases (HTML idéntico).

## init.ps1

```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[OK] check:ds   → 0 ds-allow · 0 error(es)
[OK] check:arch → 273 archivos · 14 módulos · 0 error(es)
[OK] astro check → 0 errors · 0 warnings · 1 hint (onload de la hoja de fuentes, previo)
[OK] astro build
VERDE: todo en orden.
```
