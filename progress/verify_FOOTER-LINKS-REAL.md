# Verify FOOTER-LINKS-REAL — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V2] El segundo tramo de la descripción usa `text-paper-muted` (#AFAFAF) frente a #B8B8B8 de Figma 174:51. Desviación mínima y justificada en el informe (no usar `--color-line` como color de texto). Sin acción.
- [Contenido] Las URLs de Instagram, LinkedIn y Behance del estudio y las páginas de los legales siguen pendientes (design/content-gaps.md, filas P2 en las líneas 129 y 137). Se comprobó que Figma no las tiene; cuando existan basta con añadir `url` en `studioSocials` (src/content/site.ts:47-51).

## Verificado sin hallazgos
- **V1**: `./init.ps1` en VERDE (exit 0) ejecutado por el verifier: toolchain, deps, estado, check:ds, check:arch, astro check, build.
- **Figma 174:27 (flzA0qnj6JdalFCgyB2PdI)**: leído con `use_figma` en solo lectura (`hyperlink`, `getStyledTextSegments(['hyperlink'])`, `reactions` de todos los nodos). Ningún texto tiene hiperenlace ni reacción, así que lo que dice el implementer es correcto. Todos los textos coinciden con los renderizados en dist/client/index.html: Inicio/Nosotros/Proyectos/Contacto; Yupa/Cappi Xtremo/Remittven/Las Doñas; Instagram/LinkedIn/Behance; "No vendemos horas." + "Construimos productos que convierten."; Copyright/Powered by "By Sensei Studio"; "Términos y condiciones" | "Políticas de Privacidad". El espacio final de "Yupa " se quitó con razón.
- **Enlaces internos**: /proyectos/yupa/, /cappi-xtremo/, /remittven/, /las-donas/ existen en el build (dist/client/proyectos/*).
- **Externos**: src/shared/ui/LinkFooter.astro:21-26 pone `target="_blank"`, `rel="noopener noreferrer"` y un aviso sr-only cuando llega `newTab`. Hoy no hay ninguno activo porque no hay URLs, y no se inventó ninguna.
- **sameAs**: src/content/site.ts:64 sale de `studioSocials` (única fuente). src/core/seo.ts:102 lo omite si está vacío. En el build no aparece `sameAs`, como se espera.
- **content-gaps.md**: filas 129 y 137 actualizadas.
- **V2 Estructura**: igual que antes (3 columnas de nav + bloque estudio + galería). Solo cambian los textos y aparece el segundo tono de la descripción, que sigue a Figma.
- **V3 Responsive** (revisión estática, sin navegador headless): no cambia el layout. Los textos nuevos tienen una longitud parecida a la de los anteriores y la columna tiene `min-w-0`. Los legales llevan `whitespace-nowrap` y caben en unos 343px a 375. Nada provoca scroll horizontal.
- **V4 Assets**: no se añaden ni se cambian assets.
- **V5**: en los archivos tocados no hay valores arbitrarios `[..]`, hex, `client:load`, `any` ni `ds-allow`. El copy vive en src/content/site.ts. Se eliminaron los símbolos que ya no se usaban (`FooterStudio.lang`, `whatsappNewTab`) y no queda ninguna referencia a ellos.
- **V6**: los enlaces mantienen el foco visible (`focus-visible:outline-brand`). Los elementos sin destino son `<span>`, no enlaces falsos. Se quitó `lang="en"` porque el texto ahora está en español.
- **V7 Alcance**: solo se tocaron footer, site.ts/core, LinkFooter y content-gaps, todo dentro de lo que pide `acceptance`.
