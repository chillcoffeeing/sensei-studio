# Modelo de contenido — contrato página ↔ secciones ↔ CMS

Desde 2026-10-13. Sustituye al modelo `Page { content: { h1, sections } }` con
`headingEyebrow/h2/headingDescriptions` sueltos, y al grafo fijo `Project { hero, results, … }`.

## Principio

Home y proyectos son **la misma cosa**: un documento con SEO y una lista ordenada de secciones.
Cada sección declara su `sectionType` (enum cerrado); el tipo decide la forma de
`headingContent` y de `content`, y el componente que la pinta. Un proyecto nuevo **no crea
componentes**: rellena las mismas secciones con otros datos. Una plantilla es solo una lista
ordenada de `sectionType`.

```ts
// Forma del documento (lo que devolvería un CMS, tal cual)
interface PageDoc {
  slug: string;                 // 'home' → '/', proyectos → '/proyectos/<slug>/'
  seo: Seo;
  sections: SectionDoc[];
}

interface SectionDoc<T extends SectionType = SectionType> {
  sectionType: T;               // discriminante
  id?: string;                  // ancla (#proyectos). Si falta, no hay ancla
  headingContent?: HeadingOf<T>; // por defecto: Heading
  content: ContentOf<T>;
}

interface Seo {
  title: string;                // ≤ 60
  description: string;          // ≤ 160
  keywords?: string[];
  canonical?: string;           // absoluta; si falta se deriva de `site`
  ogImage?: string;             // URL o clave de asset (ver MediaRef.src); clave local → 1200 × 630
  ogImageAlt?: string;          // alt de ogImage; si falta, el título
  ogType?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[]; // nodos extra: se AGREGAN al grafo derivado (docs/seo.md §5)
}

// Cabecera estándar. Un tipo puede ampliarla o no usarla.
interface Heading {
  eyebrow?: string;             // etiqueta de sección ("01 / Resultados", "Proyectos")
  title?: ToneText;             // h1 (solo hero) o h2
  description?: ToneText;
}

// Medio: siempre una cadena. Es lo que un CMS puede entregar.
interface MediaRef {
  src: string;                  // URL absoluta (CMS) o clave local "images/yupa-images/solution-product-phone.png"
  alt: string;                  // '' = decorativa
  width?: number; height?: number;
  kind?: 'image' | 'video';     // por defecto image
  fit?: 'cover' | 'contain';    // encaje en su hueco; por defecto cover (recorta). contain = entera (capturas)
  position?: CropPosition;      // encuadre del recorte con cover: 'top' | 'left' | 'right top'… (por defecto, centro)
}
```

`ToneText` se mantiene (`string | { text, tone: 'strong' | 'muted' }[]`): es JSON puro.

## Reglas del contrato

1. **Serializable**: el documento es JSON puro. Nada de `import` de imágenes, funciones,
   `ImageMetadata` ni clases dentro de los datos. Los datos viven en
   `src/content/data/**/*.json` con la forma exacta de `PageDoc`.
2. **Un esquema por tipo**: cada `modules/<type>/schema.ts` exporta su esquema zod
   (`astro/zod`) de `headingContent` y `content`, y los tipos se infieren con `z.infer`.
   Esquema y tipo no pueden divergir. `app/sections.ts` arma la unión discriminada por
   `sectionType` y el esquema de `PageDoc`.
3. **Validación en build**: `content/` carga los JSON y los valida con el esquema. Un dato
   inválido rompe el build con ruta y campo. Cambiar a un CMS = cambiar el loader; los
   componentes no se enteran.
4. **Resolución de medios fuera de los datos**: `shared/lib/media.ts` convierte un `MediaRef`
   en lo que pinta `Photo.astro`: clave local → `ImageMetadata` vía `import.meta.glob` sobre
   `src/assets/**` (optimizado por astro:assets, recortado en el servidor con su `position`);
   otra URL → `<img>` simple. Clave local inexistente = error de build.
9. **Sin stock ni relleno** (HOME-NO-STOCK, 2026-10-14): toda imagen es trabajo del estudio (los
   piezas de los casos o los collages de portafolio, ordenados en `src/assets/images/`, regla 10). Una persona
   sin foto real se pinta con la silueta neutra de `shared/ui/UserPlaceholder`, nunca con un retrato
   de banco de imágenes. **Excepción** (CONTACT-EMAIL-IMAGE, 2026-10-15, pedida por el usuario): el
   fondo de contacto (`contacto-homepage/escritorio-dos-monitores.jpg`) es la imagen original del
   diseño (Figma 174:73), no trabajo del estudio.
10. **Carpetas de imágenes** (ASSETS-FOLDERS, 2026-10-14): toda foto o captura vive en
   `src/assets/images/<carpeta>/` y la carpeta dice **dónde se usa**:
   - `portadas-de-proyectos/<slug>.jpg`: portada del caso (portátil). Solo tarjetas (galería de
     la home, `/proyectos/`, "Siguiente proyecto", `/links`) y la og:image del caso (derivada, ver
     abajo); el hero del caso no lleva imagen.
   - `<slug>-images/` (`yupa-images`, `remittven-images`, `las-donas-images`,
     `cappi-xtremo-images`): piezas del detalle del caso (logo, solución, cierre).
   - `slider-<sección>-homepage/`: sliders de la home (`slider-destacados-homepage` = showcase,
     sección `#destacados`); `slider-footer/`: rueda del footer.
   - `<sección>-homepage/`: resto de imágenes de la home por `id` de sección
     (`servicios-homepage`, `equipo-homepage`, `contacto-homepage`); otras páginas siguen
     `<bloque>-<página>` (`cabecera-links`).
   Si una pieza se usa en dos sitios, hay **una copia por carpeta** (cada sección se cambia sin
   tocar a las demás). Nombres en kebab-case descriptivos, con el proyecto delante fuera de su
   carpeta (`remittven-app-screens.jpg`). Los SVG de interfaz (iconos, flechas, logos de marcas y de
   herramientas) **no** van aquí: siguen en `src/assets/<módulo>/` (p. ej. `case-study/tools/`).
5. **Referencias planas**: la única relación entre documentos es un `slug` (p. ej. la
   galería lista slugs de proyectos; "siguiente proyecto" apunta a un slug). Los datos de
   tarjeta (portada, nombre, categoría, métricas) **se derivan** del proyecto referenciado
   (`project-hero` + `project-results`); nunca se duplican.
6. **Microcopy de interfaz fuera del documento**: textos repetidos en toda página del mismo
   tipo ("Volver a proyectos", "Explorar resultados", "Antes:", "Entregable:", separadores
   "→", etiquetas aria) viven en `content/site` (o su equivalente global), no en cada proyecto.
7. **Sin campos exclusivos de un proyecto**: si un proyecto necesita algo que otro no, se
   modela como campo **opcional genérico** (p. ej. `logo?` en el hero, `media[]` en la
   solución), nunca como un componente o tipo con su nombre.
8. **Huecos**: un dato que falta se omite (campo opcional) o queda marcado en
   `design/content-gaps.md`. No se inventan cifras ni textos en el JSON.

## Tipos de sección

Home (`template: 'home'`):
`hero` · `project-gallery` · `stats` · `process` · `services` · `showcase` ·
`testimonials` · `team` · `faq` · `contact`. Más `project-index` para `/proyectos/`.

`project-gallery` (home): `content = { cta{label,href,marker}, projects: slug[], cardCta }`. El JSON
solo lista slugs; `content/pages.ts` deriva `cards[]` con `projectCard(slug)` de `content/projects.ts`
(imagen = `cardImage` del hero, la portada de `images/portadas-de-proyectos/`, o, si falta, la imagen de `project-conclusion`; nombre y categoría del
hero; métricas = `value` + `label` de `project-results`, máx. 4; enlace `/proyectos/<slug>/`). Slug
inexistente o caso sin métricas = error de build. Con un número impar de proyectos, la primera
tarjeta ocupa las dos columnas desde lg.

`project-index` (`/proyectos/`, `template: 'project-index'`, única sección del documento `proyectos`):
`headingContent = { eyebrow, title (h1), description? }`, `content = { projects: slug[] }`. Hoy lista los
cuatro casos en el mismo orden que la galería de la home (Yupa, Remittven, Las Doñas, Cappi Xtremo). Lista
vacía = todos los proyectos en el orden del ciclo "Siguiente proyecto" (`projectCycle()`, empezando por el
primero alfabético). `cards[]` lo deriva `content/pages.ts` con la misma función que la galería; el texto del botón
("Ver proyecto") es microcopy (`projectCardCta` en `content/projects.ts`), no va en el JSON. Se pinta en
una columna (sin rejilla): `SectionHeader` con `level="h1"` + una `ProjectCard` por proyecto. El esquema
de tarjeta (`projectCardSchema`) vive en `core/content.ts` porque lo comparten ambos tipos.

Caso de estudio (`template: 'case-study'`, orden por defecto):

| sectionType | headingContent | content (resumen) |
|---|---|---|
| `project-hero` | `title` = nombre (h1), `eyebrow` = estado, `description` = categoría | `cardImage?` (portada SOLO para las tarjetas y og:image; el hero va siempre en tinta, sin foto), `logo?`, `claim: string[]`, `summary`, `facts[{label,value}]` |
| `project-results` | Heading | `metrics[{value,label,before,after,description}]`, `note?` |
| `project-context` | Heading | `lead`, `description?`, `fields[{label,value}]`, `challenge{label,title,description}`, `goals{label,items[]}` |
| `project-solution` | Heading | `identity{overline,year,wordmark,concept[],palette:hex[]}`, `media: MediaRef[]` (el 1.º acompaña a la lámina; el resto, a todo el ancho; vacío = la lámina ocupa la fila), `captions?: ({text,tags?} \| null)[]` (por bloque) |
| `project-process` | Heading + `route?: string[]` | `stages[{name,weeks,description,deliverable?}]`, `flow{title,overline,steps[{title,detail}],note}` |
| `project-scope` | Heading (`description` = descripción principal) | `exclusions?`, `deliverables[{title,description}]`, `tools{title,description?,items[{logo:MediaRef,description}]}`, `stack{title,description?,items[]}` |
| `project-conclusion` | Heading (`title` = aprendizaje, `description` = desarrollo) | `image: MediaRef` |
| `project-next` | Heading (`eyebrow`) | `projectSlug?` (si falta: el siguiente por orden alfabético de slug, cíclico). `card` lo deriva el loader del hero destino; si el destino es el propio proyecto (solo hay uno), no hay tarjeta y la sección no se pinta |
| `project-contact` | Heading | `meeting{label,href}`, `quote{label,href}`, `note[]` |

Títulos de case-study: los saltos de línea forzados son `
` dentro del `ToneText` (se pintan con
`whitespace-pre-line`). Las listas `string[]` (`claim`, `concept`, `summary`, `note`) son una línea por entrada.

**Microcopy (`content.ui`)**: las secciones de case-study que pintan microcopy común (volver,
explorar, antes/después, separadores, "Entregable:", "Nota:", "Explorar caso", flechas, etiquetas
aria) declaran `ui` en su esquema, pero **no se escribe en el JSON**: `content/projects.ts` lo
inyecta desde `content/case-study.ts` antes de validar (si el JSON trae uno, se sustituye). El
`href` de "Explorar resultados" es el ancla de la sección `project-results` del documento.

Ciclo actual de "Siguiente proyecto" (con `projectSlug` explícito en cada caso): Yupa → Remittven → Las Doñas → Cappi Xtremo → Yupa.

`app/templates.ts` exporta el orden de cada plantilla (`as const`). Sirve para crear un
proyecto nuevo y para avisar en build si un documento usa un tipo fuera de su plantilla.

## Dónde vive cada cosa

```
core/content.ts          PageDoc, SectionDoc, Seo, Heading, MediaRef (+ esquemas zod base)
modules/<type>/schema.ts esquema zod de headingContent/content + tipos inferidos
app/sections.ts          unión discriminada + esquema PageDoc; SECTION_TYPES (enum)
app/templates.ts         plantillas = listas de sectionType
app/registry.ts          sectionType → componente (satisfies, exhaustivo)
shared/lib/media.ts      MediaRef → props de Photo
content/data/pages/*.json      home, proyectos
content/data/projects/*.json   un caso por archivo
content/*.ts             loaders: leen, validan, derivan tarjetas
content/seo.ts           qué JSON-LD declara cada documento (derivado de sus secciones)
core/seo.ts              plantilla de título, grafo JSON-LD, sitemap y robots
```

**SEO de un caso** (SEO-META, docs/seo.md): `content/projects.ts` deriva del hero lo que el
`seo` del JSON no trae: `title` = `<Proyecto> · Caso de estudio · Sensei Studio`, `description` =
`summary` del hero (recortado a 160), `ogImage` = `cardImage` con `ogImageAlt` = nombre y
`ogType: article`. El JSON solo escribe lo que quiera fijar (hoy, `description` y `keywords`).
