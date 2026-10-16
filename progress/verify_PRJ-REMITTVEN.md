# Verify PRJ-REMITTVEN — vuelta 1
Resultado: VERDE

## Bloqueantes

(ninguno)

## Mayores

(ninguno)

## Menores

- [V4] og:image de Remittven = PNG original de 3 MB (1704×1165). `src/layout/DocumentHead.astro:19` publica
  `localAsset(seo.ogImage).src` sin transformar, y el original `src/assets/projects/remittven/conclusion-laptop.png` es una
  foto guardada como PNG RGBA (solo 4988 px transparentes, en las esquinas). Las vistas previas al compartir (WhatsApp corta
  hacia ~300 KB) pueden salir sin imagen. Viene del patrón de CM-PROJECT (Yupa publica 1,6 MB), no lo introduce esta feature.
  Propuesta: guardar el original como JPG, o que el og:image pase por `getImage` (jpg de 1200 de ancho). En la página
  el asset sí se optimiza: avif/webp/jpg de 9–185 KB.
- [V4] El logo del hero (`src/assets/projects/remittven/logo.png`, 191×38) se pinta a 1× (`width=191 height=38`) y en
  retina se ve suave. Ya está anotado en `design/content-gaps.md:48` (pedir SVG o @2x al cliente). No bloquea.
- [V5] `src/modules/project-solution/SolutionIdentity.astro:15`: el factor `0.56` (em por carácter) es un número mágico
  en el componente. Funciona: el logotipo cabe en una línea a 375/768/1024/1440, y en Yupa sigue en el token (121 px a
  1440). Como mucho, podría ir con nombre o como variable CSS. Opcional.

## Verificado sin hallazgos

- **V1** `./init.ps1` ejecutado por el verifier: VERDE (check:ds, check:arch, astro check y build en orden).
- **V2 Estructura**: el orden de secciones coincide con 254:604 (hero → 01 resultados → 02 proyecto + reto → 03 solución
  con lámina + pantallas → 04 proceso + flujo → 05 alcance + herramientas/tecnologías → 06 conclusión → siguiente
  proyecto → contacto). El bloque ancho vacío 254:748 se omite y queda documentado. El hero va en tinta porque la
  portada 254:621 está vacía. No hay componentes nuevos. Desde la última entrada de history solo cambiaron estos
  archivos de código:
  - `core/content.ts`: `MediaRef.fit?`.
  - `shared/lib/media.ts`: `UiMedia.fit?`.
  - `shared/ui/Photo.astro`: `fit="inside"` y respaldo png cuando el medio es contain.
  - `project-solution/Section.astro`: `object-contain` condicional.
  - `project-solution/SolutionIdentity.astro`: tope del logotipo por longitud.
  - `project-process/schema.ts` y `ProcessStage.astro`: `deliverable?`.

  Son campos opcionales y genéricos, documentados en `docs/content-model.md:53` y `:103`. La composición no cambia.
- **Copy textual**: comparado contra get_design_context de 254:605, 254:650, 254:678, 254:775, 254:836 y 254:906. Coincide
  palabra por palabra. Las desviaciones son las declaradas y están anotadas en content-gaps:
  - "Semana 1";
  - "tiempo real";
  - la 3.ª línea oculta de 254:656 ("Un negocio mejor conectado."), que se recorta por el alto del frame;
  - el overline "Remittven / Sistema de marca";
  - las métricas partidas en before/after.
- **V3 Responsive**: capturas headless (Chrome, playwright-core, reduced motion) de /proyectos/remittven/ y /proyectos/yupa/
  a 375, 768, 1024 y 1440. Todas responden 200, con 1 h1 y ninguna imagen rota. `scrollWidth` es igual a `clientWidth` en
  todos los anchos. Lo único que se sale del viewport es la galería del footer, que es absoluta y queda recortada; ya
  existía antes y es igual en Yupa. "Remittven®" ocupa una sola línea en todos los anchos: 52,7 / 85 / 69,3 / 102,9 px.
  Las pantallas 254:986 se ven enteras y centradas sobre el panel gris. A 1024 y 1440 la lámina y las pantallas
  comparten fila; a 375 y 768 se apilan. Yupa no tiene regresiones: logotipo en 64/85/98,7/121 px.
- **Ciclo del siguiente proyecto**: /proyectos/remittven/ enlaza a `/proyectos/yupa/` y /proyectos/yupa/ enlaza a
  `/proyectos/remittven/` (h2 "Yupa" / "Remittven"), en los 4 anchos.
- **V4 Assets**: logo 254:952, pantallas 254:986 (con transparencia, png de respaldo) y conclusión 254:908 son raws de
  Figma. Maze 267:1743 está recortado al encuadre visible (500×117) y el blanco pasó a alfa; sin redibujar. Las
  proporciones son correctas y la página sirve avif/webp.
- **V5**: no se encontró `[..]` arbitrario, hex, `any`, `ds-allow` ni `client:load` en los archivos tocados. La paleta en
  hex vive en el JSON (dato), no en el componente. No se importa entre módulos. El `style=` dinámico sigue el patrón
  existente (SolutionSwatch, ProcessStep).
- **V6**: hay un solo h1, un h2 por sección y alts descriptivos en las pantallas y la conclusión. Sin `deliverable`, la
  etapa no pinta el `sr-only` vacío.
- **V7 Alcance**: solo se tocó lo que pide `acceptance`. `design/content-gaps.md` incluye el bloque de Remittven
  (254:621 y 254:748 vacíos, deliverable ausente, textos de plantilla dudosos) y ya no tiene la línea de Yupa ·
  project-next.
