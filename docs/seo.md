# SEO y metadatos — estrategia

Fuente única de verdad para `<head>`, previews al compartir y datos estructurados. Complementa
`docs/content-model.md` (el `seo` de cada `PageDoc`).

## 1. Capas

| Capa | Dónde vive | Qué decide |
|---|---|---|
| **Sitio** | `src/content/site.ts` · `meta` | nombre, dominio, locale, correo, redes, logo, imagen de compartir por defecto, plantilla de título |
| **Página** | `seo` del `PageDoc` (home, `/links`, `/proyectos/`) | título, descripción, keywords, `ogImage`, `noindex`, `jsonLd` extra |
| **Caso** | derivado del proyecto (`project-hero` + portada) | título y descripción por defecto, `ogImage` = portada, `ogType: article` |
| **Render** | `src/layout/DocumentHead.astro` | única pieza que escribe etiquetas; las páginas nunca pintan `<meta>` a mano |

Regla: **los datos declaran, `DocumentHead` emite.** Un dato que falta se deriva de la capa
superior (página → sitio), nunca se duplica a mano.

## 2. Dominio y URLs

- Dominio de producción: **`https://bysensei.com`** (confirmado por el usuario
  el 2026-10-15). Va como `site` por defecto en `astro.config.mjs`; `SITE_URL` lo
  sobrescribe en otros entornos.
- `canonical`, `og:url`, `og:image`, sitemap y robots salen absolutos de `site`.
- Barra final consistente con la que genera Astro; canonical sin query ni hash.

## 3. Títulos y descripciones

- Plantilla: `<título de página> · Sensei Studio`; la home usa su título completo tal cual.
- Título ≤ 60 caracteres, descripción 120–160 (el esquema zod lo valida).
- Casos: `<Proyecto> · Caso de estudio · Sensei Studio` y descripción derivada del resumen del hero
  si el JSON del caso no trae `seo` propio.

## 4. Preview al compartir (Open Graph / X)

- Diseño de referencia: Figma `flzA0qnj6JdalFCgyB2PdI` nodo `41:464`.
- Imagen 1200 × 630 JPG (< 300 KB), con alt. Siempre `og:image:width/height/alt`.
- **Por defecto** (home y páginas sin imagen propia): `public/og-image.jpg`, exportada de `41:464`.
- **Casos**: portada del proyecto (`portadas-de-proyectos/<slug>.jpg`) recortada a 1200 × 630 por
  `getImage`; alt = nombre del proyecto.
- `twitter:card = summary_large_image`. `og:locale = es_ES`, `og:site_name = Sensei Studio`.
- Validación manual tras publicar: opengraph.xyz, Facebook Sharing Debugger, LinkedIn Post
  Inspector, vista previa de WhatsApp.

## 5. Datos estructurados (JSON-LD)

Se generan desde los datos, no se escriben a mano en cada página:

- **Todas las páginas**: `Organization` (nombre, url, logo, `email: hola@bysensei.com`, `sameAs`
  con las redes reales del footer) + `WebSite`.
- **Home**: además `ProfessionalService` con `areaServed` y `knowsAbout` (servicios) y
  `FAQPage` derivado de la sección FAQ.
- **Casos**: `CreativeWork` (nombre, descripción, imagen, `creator` = Organization) +
  `BreadcrumbList` (Inicio › Proyectos › Caso).
- `/proyectos/`: `CollectionPage` + `BreadcrumbList`.
- `seo.jsonLd` del documento solo **agrega** nodos extra.

## 6. Indexación

- `robots.txt` permite todo y apunta al sitemap; `noindex` en `/componentes` (catálogo interno) y
  en cualquier página marcada `seo.noindex`, que además queda fuera del sitemap.
- `/links` (linktree de Instagram): indexable pero con `canonical` propio y sin keywords.
- Sitemap con home, `/proyectos/` y cada caso.

## 7. Iconos

- Diseño de referencia: Figma `flzA0qnj6JdalFCgyB2PdI` nodo `224:316`.
- `favicon.svg` (con variante para modo oscuro si el diseño la tiene), `favicon.ico` 32 × 32,
  `apple-touch-icon.png` 180 × 180, `site.webmanifest` (nombre, `theme_color`,
  `background_color`, iconos 192 y 512) y `<meta name="theme-color">`.

## 8. Checklist por página nueva

1. `seo.title` y `seo.description` propios dentro de los límites.
2. ¿Tiene imagen propia? Si no, hereda la del sitio.
3. ¿Necesita JSON-LD extra (FAQ, artículo)? Se deriva de sus secciones.
4. ¿Debe indexarse? Si no, `noindex` (y sale del sitemap).
5. Verificar en el HTML generado: un solo `<title>`, canonical absoluto, `og:image` absoluto
   y JSON-LD válido (validator.schema.org).
