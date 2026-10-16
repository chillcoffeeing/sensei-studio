# Verify SEO-META — vuelta 1
Resultado: VERDE

## Bloqueantes

Ninguno.

## Mayores

Ninguno.

## Menores

- [SEO] El logo de `Organization` es `https://bysensei.com/_astro/logo.BvIrqjnK.svg`, un SVG claro pensado para fondo oscuro (`src/content/site.ts:52`). Google prefiere un PNG/JPG cuadrado de al menos 112 px sobre fondo sólido. El implementer ya lo anotó en `design/content-gaps.md` para SEO-OG-FAVICON. No bloquea esta feature.
- [SEO] `sameAs: []` (`src/content/site.ts:54`): es lo que pide el acceptance hasta tener las URLs reales. `buildJsonLd` omite el campo cuando está vacío, que es lo correcto.

## Verificado sin hallazgos

- **V1** `./init.ps1`: VERDE (toolchain, install, estado con 1 feature in_progress, check:ds, check:arch, astro check y build).
- **Dominio**: `astro.config.mjs:10-14` usa `PRODUCTION_SITE = 'https://bysensei.com'` y `SITE_URL` sigue sobrescribiendo. No quedan restos de `.example` en config, src, docs ni design.
- **Un solo `<title>`** en las 8 páginas generadas. No hay `<meta>` ni `<title>` en el body, y en `src/` ninguna página o componente fuera de `DocumentHead.astro` escribe `<meta>` o `<title>`.
- **Canonical, og:url, og:image y twitter:image absolutos** con `https://bysensei.com` en `/`, `/proyectos/`, los 4 casos, `/links/` y `/componentes/`.
- **og:image**:
  - Home, `/proyectos/`, `/links/` y `/componentes/` usan `/og-image.jpg`, que en disco mide 1200×630.
  - Los casos usan su portada recortada a JPG. Las 4 miden 1200×630 leídas de la cabecera del JPEG (cappi-xtremo 82 KB, las-donas 64 KB, remittven 56 KB, yupa 67 KB), todas por debajo de 300 KB.
  - En todas las páginas: `og:image:width/height/alt` y `twitter:image:alt` presentes, `twitter:card=summary_large_image`, `og:locale=es_ES` y `og:site_name=Sensei Studio`.
- **Títulos**:
  - La home usa su título completo.
  - El resto sigue la plantilla `{title} · Sensei Studio`.
  - Los casos usan `<Proyecto> · Caso de estudio · Sensei Studio` con `og:type=article`.
  - Todos tienen 60 caracteres o menos.
- **Descripciones**: entre 120 y 160 caracteres en las páginas públicas (134, 138, 156, 141, 148, 138 y 159). `/componentes` tiene 86, pero es interna y `noindex`.
- **JSON-LD**: un único `<script type="application/ld+json">` por página. Parsea con `JSON.parse`, tiene `@context` `https://schema.org` y un `@graph` cuyos nodos se enlazan por `@id`.
  - Todas las páginas: `Organization` (nombre, url, logo, `email: hola@bysensei.com`) y `WebSite` (con `publisher`).
  - Home: además `ProfessionalService` con `areaServed` (2) y `knowsAbout` (los 4 servicios de la sección) y `FAQPage` con 18 preguntas derivadas de la sección FAQ. Las respuestas son texto plano, sin markup.
  - `/proyectos/`: además `CollectionPage` y `BreadcrumbList` (Inicio › Proyectos).
  - Casos (los 4): además `CreativeWork` (con name, description, image = portada absoluta, `creator` que apunta a la Organization) y `BreadcrumbList` (Inicio › Proyectos › Caso).
  - `/links/` y `/componentes/`: solo los nodos comunes.
  - `seo.jsonLd` solo agrega nodos (`buildJsonLd(..., extra)`).
  - `<` está escapado dentro del script.
- **Indexación**:
  - `/componentes/` lleva `noindex, nofollow` y no está en el sitemap. `robots.txt` no lo bloquea, así que el `noindex` se puede leer.
  - `/links/` es indexable, tiene canonical propio y no lleva keywords.
  - `robots.txt` contiene `Allow: /` y `Sitemap: https://bysensei.com/sitemap.xml`.
  - `sitemap.xml` incluye `/`, `/proyectos/`, los 4 casos y `/links/`, todos absolutos y con barra final igual al canonical. `src/pages/sitemap.xml.ts` filtra `seo.noindex` en pages, casos y links.
- **Arquitectura**:
  - Los datos viven en `content/site.ts` y `content/seo.ts`.
  - Las funciones puras viven en `core/seo.ts`.
  - `DocumentHead` es el único que emite etiquetas.
  - check:arch está en verde.
  - En los archivos tocados no hay `any`, `ds-allow` ni `client:load`.
- **V2–V4**: no aplican. No hay cambios visuales, tokens ni assets nuevos en esta feature (la imagen OG y el favicon van en SEO-OG-FAVICON).
