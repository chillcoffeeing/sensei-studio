# Modelo de contenido: contrato página ↔ secciones ↔ CMS

Home, `/proyectos/` y los casos son **lo mismo**: un `PageDoc { slug, seo, sections[] }` en JSON puro.
Cada sección declara su `sectionType` (enum cerrado), y ese tipo fija la forma de `headingContent`
(eyebrow, title, description) y de `content`, y el componente que la pinta. Un proyecto nuevo **no
crea componentes**: rellena las mismas secciones con otros datos.

El detalle de cada campo está en el código: las piezas comunes (`PageDoc`, `Seo`, `Heading`,
`MediaRef`, `ToneText`) en `core/content.ts`, y cada tipo en `modules/<type>/schema.ts` (zod, con los
tipos inferidos con `z.infer`).

## Reglas del contrato

1. **Serializable**: los datos son JSON en `src/content/data/**`. No llevan imports, funciones ni
   `ImageMetadata`.
2. **Un esquema por tipo** (`modules/<type>/schema.ts`). `app/sections.ts` arma la unión
   discriminada y el esquema de la página.
3. **Validación en build**: un dato inválido rompe el build con archivo, ruta y campo. Pasar a un
   CMS significa cambiar el loader (`content/*.ts`), no los componentes.
4. **Medios = cadenas** (`MediaRef.src`):
   - una clave de `src/assets/` se pinta como `<Picture>` recortado según su `position`;
   - una URL se pinta como `<img>`.

   Una clave inexistente es un error de build. Lo resuelve `shared/lib/media.ts`.
5. **Referencias planas**: un documento solo apunta a otro por `slug`. Las tarjetas de proyecto
   (portada, nombre, categoría y hasta 4 métricas) **se derivan** de `project-hero` +
   `project-results` del caso destino (`projectCard()` en `content/projects.ts`) y nunca se copian.
6. **Microcopy fuera del documento**: los textos repetidos en todos los casos ("Volver a
   proyectos", "Antes:", flechas, etiquetas aria) viven en `content/case-study.ts`, y el loader los
   inyecta en `content.ui`.
7. **Sin campos exclusivos de un proyecto**: lo que solo necesita uno se modela como opcional
   genérico (`logo?`, `media[]`).
8. **Huecos**: un dato que falta se omite o se anota en `design/content-gaps.md`. No se inventan
   cifras ni textos.
9. **Sin stock ni relleno**: toda imagen es trabajo del estudio. Una persona sin foto se pinta con
   `UserPlaceholder`. Excepción: el fondo de contacto, que es la imagen original del diseño.
10. **Carpetas de imágenes** (`src/assets/images/<carpeta>/`), nombradas por **dónde se usan**:

    | Carpeta | Contenido |
    |---|---|
    | `portadas-de-proyectos/<slug>.jpg` | tarjetas y og:image del caso |
    | `<slug>-images/` | piezas del detalle del caso |
    | `slider-<sección>-homepage/`, `slider-footer/` | sliders |
    | `<sección>-homepage/`, `<bloque>-<página>/` | resto de imágenes |

    Si una pieza se usa en dos sitios, hay una copia en cada carpeta. Los SVG de interfaz van en
    `src/assets/<módulo>/`.

## Tipos de sección y plantillas

`app/templates.ts` define cada plantilla como una lista ordenada de tipos. El build avisa si un
documento usa un tipo que no está en su plantilla.

| Plantilla | Tipos |
|---|---|
| `home` | `hero` · `project-gallery` · `stats` · `process` · `services` · `showcase` · `testimonials` · `team` · `faq` · `contact` |
| `project-index` (`/proyectos/`) | `project-index`. Si la lista está vacía, muestra todos en el orden del ciclo |
| `case-study` | `project-hero` · `project-results` · `project-context` · `project-solution` · `project-process` · `project-scope` · `project-conclusion` · `project-next` · `project-contact` |

- **`project-next`:** usa `projectSlug` o, si falta, el siguiente slug en orden alfabético. Ciclo
  actual: Yupa → Remittven → Las Doñas → Cappi Xtremo.
- **Texto:** los saltos de línea de los títulos son `\n` dentro del `ToneText`.

## Dónde vive cada cosa

```
core/content.ts                 PageDoc, Seo, Heading, MediaRef (+ zod base)
modules/<type>/schema.ts        headingContent/content de cada tipo
app/sections.ts                 SECTION_TYPES, unión y esquema de PageDoc
app/templates.ts · registry.ts  plantillas · sectionType → componente (exhaustivo)
content/data/pages/*.json       home, proyectos
content/data/projects/*.json    un caso por archivo
content/pages.ts · projects.ts  loaders: validan y derivan tarjetas y SEO de los casos
content/seo.ts · core/seo.ts    JSON-LD, títulos, sitemap y robots (docs/seo.md)
```
