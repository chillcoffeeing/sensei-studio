# impl FOOTER-LINKS-REAL — Footer: enlaces reales del nodo 174:27

## Hallazgo clave (Figma)

`get_design_context` de 174:27 (archivo flzA0qnj6JdalFCgyB2PdI) da textos, no URLs. Se leyeron los
hiperenlaces con el Plugin API (`use_figma`, solo lectura: `hyperlink`, `getStyledTextSegments(['hyperlink'])`
y `reactions` de cada nodo): **ningún texto de 174:27 tiene hiperenlace**. Se buscaron URLs del estudio en
las dos páginas del archivo ("Web" y "Post Redes sociales"): solo hay perfiles del **equipo**
(Behance/LinkedIn/GitHub en 334:7408-341:7432, para TEAM-SOCIAL-LINKS) y `example.com` en 174:89.
Conclusión: los textos de 174:27 son reales y se aplican tal cual; las URLs de Instagram, LinkedIn y Behance
del estudio **no existen en Figma** y siguen pendientes (content-gaps P2). No se inventa ninguna.

## Textos aplicados (exactos de 174:27)

- Páginas: Inicio, Nosotros, Proyectos, Contacto (sin cambios; anclas de la home).
- Trabajos: Yupa, Cappi Xtremo, Remittven, Las Doñas (antes Horizon/Vertex Labs/Aurelius/Montegrapa)
  → `/proyectos/<slug>/` (las cuatro páginas de caso existen). Se quita el espacio final de "Yupa ".
- Redes sociales: Instagram, LinkedIn, Behance (antes "Twitter").
- By Sensei: "No vendemos horas." + "Construimos productos que convierten." (segundo tramo en gris, como
  174:51); créditos Copyright / Powered by "By Sensei Studio"; legales "Términos y condiciones" |
  "Políticas de Privacidad" (sin página: texto).

## Archivos

- `src/content/site.ts`: `studioSocials` (única fuente de redes: footer + `meta.sameAs`, que filtra las que
  tienen `url`); columnas Trabajos y Redes; studio en español sin `lang="en"`; legales nuevos;
  `whatsappNewTab` → `newTabNotice` (ya se usa también para redes).
- `src/core/site.ts`: `FooterLink.newTab?`; `FooterStudio.descriptionAside?`; se elimina `FooterStudio.lang` (sin uso).
- `src/shared/ui/LinkFooter.astro`: prop `newTab` → `target="_blank"`, `rel="noopener noreferrer"` y aviso sr-only.
- `src/layout/FooterNavColumn.astro`: pasa `newTab`.
- `src/layout/FooterStudio.astro`: descripción en dos tonos; sin `lang`.
- `design/content-gaps.md`: fila de `meta.sameAs` → `studioSocials` (URLs pendientes); fila de `footer.studio` → legales sin página, copy resuelto.
- `progress/current.md`: plan.

## Tokens

Ninguno agregado ni quitado. El gris del segundo tramo (#B8B8B8 en Figma) usa `text-paper-muted`
(#AFAFAF): desviación mínima para no usar `--color-line` (token de trazos) como color de texto.

## Responsive

Sin cambios de layout (grid 2 → 3 columnas + estudio, ya revisado en SEC-FOOTER). Los nombres nuevos
tienen longitud similar a los anteriores; "Cappi Xtremo" puede partir en dos líneas a 375 en la columna
de 2 (comportamiento existente con `min-w-0`). Los legales caben en una línea a 375 (~290 px de 343).

## Sobre la aceptación

- Textos: exactos de 174:27. URLs: 174:27 no tiene; enlaces internos reales para Trabajos; redes sin
  enlace hasta tener URLs (la vía externa `_blank` + `noopener` ya está implementada y se activa con `url`).
- `sameAs`: alimentado desde `studioSocials`; hoy vacío (el JSON-LD lo omite) por falta de URLs.

## init.ps1

VERDE: toolchain, dependencias, estado (1 in_progress), sistema de diseño, arquitectura, astro check y
astro build OK.
