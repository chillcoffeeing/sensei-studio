# Verify HOME-REAL — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [SEO] og:image de Las Doñas sale a 996×630 (proporción 1,58:1), no a 1200×630 (1,91:1), porque `getImage` no amplía el original de 996 px (`src/layout/DocumentHead.astro:22`). Pesa 99 KB y es válida, pero Facebook y LinkedIn la recortarán por los lados. Está justificado en el informe. Si se quiere 1,91:1 exacto, se puede pedir `width: 996, height: 521`, o bien esperar a la portada propia (hueco P2).
- [SEO] En los proyectos, `og:image` no lleva `og:image:width`, `og:image:height` ni `og:image:alt`. Solo se emiten para la imagen de sitio (`DocumentHead.astro:46-52`). El `getImage` ya devuelve las dimensiones y el `alt` está en el `MediaRef` de la conclusión. Es opcional: los scrapers miden la imagen ellos mismos.
- [V4] Diapositiva de Remittven en Destacados (`screens-beneficiaries-profile.png`): el PNG tiene las esquinas y el hueco entre pantallas transparentes, así que sobre la diapositiva oscura asoma una franja negra entre los dos móviles. Se lee bien y no estorba. Un fondo propio en el recorte lo pulirían.
- [V2] A 375 px, en la tarjeta de Yupa (650:447 sobre un mockup apaisado) la "Y" de YUPA queda pegada al borde. Ya estaba así antes, el implementer lo declara y figura como P3 en content-gaps. Se resuelve con una portada propia.

## Verificado sin hallazgos
- **V1**: `./init.ps1` termina con código 0 (check:ds, check:arch, astro check y build en verde, 1 sola feature `in_progress`).
- **Galería derivada**: `home.json` solo tiene `projects: ["yupa","remittven","las-donas"]`, `cardCta` y `cta`, sin `cards` escritas. `withProjectCards` (`src/content/pages.ts:52`) deriva imagen, nombre, categoría, métricas (`project-results`, máx. 4) y href con `projectCard(slug)`. Un slug inexistente o un caso sin métricas rompen el build. Las métricas mostradas coinciden 1:1 con los JSON de los proyectos: Yupa +29 / −20 / −85, Remittven −43 / −45 / −35 y Las Doñas −30 / −50 / +18. No queda rastro de "Dass design anthopoly" ni de los `metric-*.svg` en `src/`, `docs/` ni `design/`.
- **Enlaces**: los 3 "Ver proyecto" del build apuntan a `/proyectos/yupa/`, `/proyectos/remittven/` y `/proyectos/las-donas/`. "Ver todos los proyectos" lleva a `/proyectos/yupa/`, un destino válido. La decisión está documentada como P3 en content-gaps.
- **Rejilla (Chrome headless, reduced-motion, build servido)**: a 375 hay una columna de 343×245; a 768, una de 704×484. A 1024, la destacada mide 944×472 y debajo van 2 de 462×318; a 1440, 1320×660 y 2 de 650×447. `scrollWidth == clientWidth` en los 4 anchos y todas las imágenes cargan. En el hover a 1024 y 1440, título, categoría, las 3 métricas en una fila y el botón caben sin desbordar. La categoría se parte solo entre segmentos. La composición queda mejor que una tarjeta huérfana y respeta la estructura (cabecera + CTA + rejilla).
- **Estructura de la home**: siguen las 11 secciones en el orden de la plantilla de `docs/content-model.md` (hero, logo-marquee, project-gallery, stats, process, services, showcase, testimonials, team, faq, contact). No se eliminó ni se reordenó ninguna, y las que no tienen datos reales se mantienen tal cual.
- **Piezas reales**: en Destacados, 4 de 7 diapositivas son reales (0, 2, 4 y 6) y las otras 3 llevan `placeholder: true`. En Servicios es real la 1.ª imagen de Branding (florista), UX/UI (confirmación de Remittven) y Desarrollo (catálogo de Yupa), con `alt` propio. Las proporciones encajan con sus huecos: los recortes de servicios miden 396×673 y 398×677 (0,588, igual que 187:318) y los de Destacados 836×893 y 840×897 (0,936, igual que 616:658).
- **Créditos**: hay 18 fotos de Unsplash en `home.json` y 6 en el pie, 24 en total. `unsplash-photos.json` tiene 24 entradas, `/creditos/` acredita 24 fotos y `design/placeholders.md` también dice 24 (9 + 3 + 4 + 1 + 1 + 6). Las cuentas cuadran.
- **og:image**: Yupa sale a 1200×630 (93 KB), Remittven a 1200×630 (126 KB) y Las Doñas a 996×630 (99 KB), todas en JPG. Antes, el PNG de Yupa pesaba 1,6 MB. La home usa `og-image.jpg` del sitio (1200×630, 49 KB) con width, height y alt.
- **conclusion-florist.jpg**: mide 996×664 (3:2) y ya no tiene texto horneado; revisada a ojo. Al mockup de Yupa se le quitó el marco.
- **content-gaps.md**: completo (home por sección, chrome/SEO, créditos y los 3 casos), priorizado P1–P3, con quién aporta cada cosa y un resumen arriba. Lo contrasté con los datos y estas entradas son exactas:
  - stats: +250, +9, 97 % y "1 punto";
  - FAQ: 5 preguntas en inglés, entre ellas la de "monthly subscription";
  - contacto: "Let's talk.", términos en `example.com` y sin `endpoint`;
  - testimonios: las 4 erratas citadas existen, el sello en inglés lleva `lang="en"` y "56+";
  - equipo: los placeholders en `members[1]` y `[3]` y la foto de Unsplash en `[2]`;
  - logos de la plantilla: los 9 nombres coinciden;
  - `whatsappHref = 'https://wa.me/'`;
  - título del servicio de Desarrollo de Figma;
  - Las Doñas: semanas "…Semana 6, Semana 8", el año 2025 en la lámina y el título incompleto;
  - Remittven: el claim "Seguro y rápido" sin punto y la línea "Flujo de recompensas".
- **V5**: en los archivos tocados no hay clases arbitrarias `[..]`, hex en `.astro`, `client:load`, `any` ni `ds-allow`. Tampoco hay imports entre módulos ni `initial` en `tokens.css`. `--project-aspect-wide` se usa (utilidad `project-card-wide`) y "Ver proyecto" sale del JSON (`cardCta`).
- **V6**: cada tarjeta tiene su `h3` (`sr-only` en táctil), la pill va con `aria-hidden` y las imágenes reales tienen `alt` descriptivo. Los enlaces cumplen `min-h-11` y `focus-visible`.
- **V7**: los cambios se ciñen al `acceptance` (galería, piezas reales, créditos, og:image, recortes y documentación).
