# impl — TESTIMONIALS-BRAND

Primera vuelta. Sin Figma (no tiene `figmaNodes`). Cambio solo de contenido.

## Archivos modificados
- `src/content/data/pages/home.json` — citas de `testimonios.content.reviews`: menciones al estudio → "Sensei Studio".
- `design/copy/testimonials.md` — mismas sustituciones en la tabla; la duda "¿Se reemplazan por Sensei Studio?" pasa a "Resuelto el 2026-10-15".
- `astro.config.mjs` — comentario de `PRODUCTION_SITE`: "inferido de hola@bysensei.com, por confirmar" → "confirmado por el usuario el 2026-10-15".
- `progress/current.md` — plan de la feature.

## Revisión de las 20 citas (antes → después)
Solo cambia el nombre. El artículo ("La" o "El") formaba parte del nombre que se sustituye, así que las preposiciones quedan bien
("con", "de", "a") y no aparece ninguna contracción ("del", "al"). Nombres, roles y el resto del texto no cambian
(se mantienen también las erratas pendientes de #14, #18 y #20).

| # | Cliente | Antes | Después |
|---|---|---|---|
| 1 | Gabriela C. | — sin mención | sin cambio |
| 2 | Jonatan P. | "…muy buena con La agencia." | "…muy buena con Sensei Studio." |
| 3 | David M. | "…del trabajo de La agencia en este proyecto." | "…del trabajo de Sensei Studio en este proyecto." |
| 4 | Carina R. | "…trabajar con El estudio Sensei." | "…trabajar con Sensei Studio." |
| 5 | Rafael H. | — sin mención ("con ellos") | sin cambio |
| 6 | Elliot | — sin mención | sin cambio |
| 7 | Gerardo P. G. | "Trabajar con La agencia en el rediseño…" / "Recomiendo ampliamente a El estudio Sensei por…" | "Trabajar con Sensei Studio en el rediseño…" / "Recomiendo ampliamente a Sensei Studio por…" |
| 8 | Edgar | "¡Excelente La agencia!" | "¡Excelente Sensei Studio!" |
| 9 | Joaquin McClew | — sin mención | sin cambio |
| 10 | Maria Andrea Reina | "El estudio Sensei es organizado…" | "Sensei Studio es organizado…" |
| 11 | Pedro Avaria | — sin mención | sin cambio |
| 12 | David Trujillo Novoa | — sin mención | sin cambio |
| 13 | Luis Enrique Ramirez | — sin mención | sin cambio |
| 14 | Javier Oberto | — sin mención | sin cambio |
| 15 | Pablo Mondragón Valero | "…trabajar con La agencia en la creación…" | "…trabajar con Sensei Studio en la creación…" |
| 16 | Ismael Flores Aguilar | — sin mención | sin cambio |
| 17 | Valeria S. | "Trabajar con El estudio Sensei para definir…" | "Trabajar con Sensei Studio para definir…" |
| 18 | Mateo R. | "El estudio Sensei combinó una creatividad…" | "Sensei Studio combinó una creatividad…" |
| 19 | Andrea G. | "La agencia nos ayudó a estructurar…" | "Sensei Studio nos ayudó a estructurar…" |
| 20 | Sofía L. | "…el equipo de La agencia nos ayudo en todo." | "…el equipo de Sensei Studio nos ayudo en todo." |

Comprobación: `grep` de `La agencia|El estudio Sensei|[Ee]l Sensei Studio|[Ll]a Sensei Studio|del Sensei Studio|al Sensei Studio`
en `src/` y `design/copy/`: 0 resultados.

## Menciones genéricas fuera de las citas (sin cambiar)
Ninguna es "La agencia" o "El estudio Sensei" usada como nombre. Todas son usos genéricos:
- `home.json:7` keyword SEO "agencia de diseño web".
- `home.json:716` FAQ: "Sensei Studio es una agencia creativa…".
- `home.json:719` FAQ: "…de otras agencias de diseño web?".
- `home.json:784` FAQ: "…que ninguna agencia controla.".
- `site.ts:74` alt del og:image: "…agencia para marcas que convierten".
- `site.ts:160` nota de la calculadora: "…no una tarifa del estudio.".
- `links.ts:79` `navLabel: 'Enlaces del estudio'` (aria-label).
- Comentarios de código en `site.ts`/`links.ts` ("número del estudio", "Redes del estudio"): no son contenido visible.
- `src/content/data/projects/*.json`: solo "Sensei Studio" (créditos); no hay menciones genéricas.

## Tokens
Ninguno agregado ni eliminado.

## Responsive
No aplica (solo texto). "Sensei Studio" ocupa un largo parecido a "El estudio Sensei" y más que "La agencia", sin efecto en el masonry de altura libre.

## init.ps1
VERDE: check:ds, check:arch, tipos y `astro build` OK ("VERDE: todo en orden.").
