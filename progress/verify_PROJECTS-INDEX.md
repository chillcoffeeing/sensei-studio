# Verify PROJECTS-INDEX — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V5] El comentario de la utilidad `project-card-wide` (src/styles/global.css:258) sigue diciendo "Tarjeta de proyecto destacada (a todo el ancho de la rejilla)". Ahora también la usa /proyectos/ para todas las tarjetas, así que el texto confunde. Conviene cambiarlo por algo como "proporción panorámica para ProjectCard a todo el ancho". No afecta al resultado.

## Verificado sin hallazgos
- **V1**: el verifier ejecutó `./init.ps1` y salió VERDE (código 0): check:ds, check:arch, astro check y build en OK.
- **Restricciones del usuario**:
  - Solo se usan componentes existentes: `SectionHeader`, `SectionDescription` (condicional, no se renderiza porque el JSON no trae descripción) y `ProjectCard`. No hay componentes de UI nuevos. A `SectionHeader` se le añadió la prop `level` y a `ProjectCard` la prop `headingLevel`. Las dos son mínimas, tienen valor por defecto y no cambian el aspecto.
  - Sin rejilla: `ul.flex.flex-col` con un solo ancho, sin grid ni columnas. Las tres tarjetas son idénticas, con `lg:project-card-wide` en todas, así que no hay ninguna destacada. Es una desviación justificada: a todo el ancho con la proporción normal, cada tarjeta mediría unos 908 px de alto.
  - La página solo tiene el listado: eyebrow + h1 + lista. No hay intro, filtros, contadores, CTA ni bloques extra. Header, footer y barra flotante son los globales.
- **Contenido**: `src/content/data/pages/proyectos.json` tiene SEO propio, una sola sección `project-index` y `projects: []` (= todos, en el orden del ciclo de `projectCycle()`). Las tarjetas se derivan con un único `cardsOf()` en src/content/pages.ts, compartido con la galería de la home, sin datos duplicados. El microcopy `projectCardCta = 'Ver proyecto'` vive en la capa content, igual que el `cardCta` de la home.
- **Arquitectura**: los esquemas compartidos se movieron a `core/content`. No hay imports entre módulos (check:arch OK).
- **V6, un solo h1**: el dist muestra un h1 "Todos los proyectos" y un h2 por tarjeta (Las Doñas, Yupa, Remittven). Debajo vienen los h2 del footer y del modal globales, igual que en el resto del sitio. `aria-labelledby` apunta al h1.
- **Enlaces**: `href="/proyectos/"` aparece en el CTA de la galería de la home (home.json:112), en el hero de caso ("Todos los proyectos", content/case-study.ts:22, presente en dist/proyectos/yupa) y en /links ("Ver todos los proyectos", content/links.ts:67). El nav sigue en `/#proyectos`, como pide la feature.
- **Sitemap y canonical**: `<loc>…/proyectos/</loc>` está en el sitemap. Canonical `https://dominio-por-confirmar.example/proyectos/`, título "Proyectos · Sensei Studio".
- **Convivencia de rutas**: el build genera `dist/client/proyectos/index.html` y `/proyectos/{las-donas,yupa,remittven}/index.html` sin conflicto. Cada tarjeta enlaza a su caso.
- **V3 Responsive**: revisado con Chrome headless por CDP (`Emulation.setDeviceMetricsOverride`). scrollWidth es igual a clientWidth en los 4 anchos. Medidas de la imagen de cada tarjeta:

  | Ancho | Imagen | Proporción |
  |---|---|---|
  | 375 | 343×245 | 650:447 |
  | 768 | 704×484 | 650:447 |
  | 1024 | 944×472 | 2:1 |
  | 1440 | 1320×660 | 2:1 |

  Coinciden con `sizes`. Las pills no se cortan: la categoría pasa a dos líneas a 375. El ritmo vertical está bien y la barra flotante no tapa contenido de forma permanente. Nota: una captura con `--window-size=375` sin emulación sale cortada, pero es por el ancho mínimo de ventana de Chrome headless, no un fallo de la página.
- **V4 Assets**: las portadas son las de cada proyecto, en avif con srcset y sin deformar (`object-cover` y aspecto vía token).
- **V5**: no aparecen `[..]` arbitrarios, hex, `client:load`, `any`, `ds-allow` ni z-index mágico en src/modules/project-index/.
- **V7 Alcance**: se tocó lo que pide `acceptance`. También se limpió `design/content-gaps.md`: el punto "Ver todos los proyectos" quedó resuelto, en la línea 49.
