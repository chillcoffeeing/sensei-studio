# Verify PRJ-PROCESS — vuelta 1
Resultado: VERDE

Referencia: `get_screenshot` de 216:3065 (fileKey `flzA0qnj6JdalFCgyB2PdI`, 1440×1000). Capturas propias de la
sección con Chrome headless (perfil temporal propio, reduced motion emulado, build servido con http.server;
ambos procesos terminados por su PID) a 375, 768, 1024 y 1440.

## Bloqueantes
Ninguno.

## Mayores
Ninguno.

## Menores
- [V5] `src/modules/project/ProcessFlow.astro:10`: el id del h3 está fijo (`'flujo-postcompra-titulo'`) en vez de
  derivarse del id de la sección, como hace `ProjectProcess` con `${id}-titulo`. Hoy hay una sola instancia por
  página y no rompe nada, pero el componente lleva el nombre de un flujo concreto y repetiría el id si se monta dos
  veces. Esperado: id derivado (p. ej. recibir `titleId` o usar `${sectionId}-flujo`). No bloquea.

## Verificado sin hallazgos
- V1: `./init.ps1` VERDE (exit 0): toolchain, install, estado, check:ds, check:arch, astro check y build.
- V2 estructura: el orden coincide con Figma: etiqueta "04 / El proceso" → h2 en 2 líneas → ruta
  Estrategia → Diseño → Producto (abajo a la derecha desde xl) → 4 etapas (separador, número lima, nombre, semanas,
  descripción, entregable) → bloque con borde: titular + aviso a la derecha, 4 pasos con 3 flechas y nota. Se monta
  después de Solución en `Section.astro:21`.
- V2 copy: todo el texto de `origen.ts:201-249` coincide con la captura de Figma (etiqueta, título, ruta, nombres,
  semanas, descripciones, entregables, titular, aviso, pasos, detalles y nota). Las mayúsculas se aplican con CSS.
- V2 calidad: a 1440 la sección es prácticamente igual a Figma. Las desviaciones están justificadas en el informe y no
  empeoran nada (bordes `paper/15`, tarjetas `paper/10`, semanas a 12px, entregable alineado al pie con `mt-auto`).
  La nota parte en 2 líneas a 1440 por `max-w-200` (en Figma va en una): mejora la medida de lectura y no se considera
  hallazgo.
- V3: sin scroll horizontal en ninguna anchura (ningún elemento sale del viewport; scrollWidth = ancho útil).
  375: todo apilado, h2 a 30px, flechas giradas hacia abajo. 768: etapas en 2 columnas, aviso a la derecha. 1024:
  4 columnas, el flujo en fila y el texto de las tarjetas parte línea sin cortarse. 1440: como en Figma. No hay
  elementos interactivos en la sección, así que no aplica el mínimo de 44px.
- V4: `src/assets/project/flow-arrow.svg` (18×18, trazo #E4FF40, sacado de 216:3302) se pinta a 18×18 entre cada
  par de pasos (3 flechas, el último paso sin flecha) y es decorativo (`alt=""`).
- V5: los 5 archivos nuevos no tienen arbitrarios `[..]`, hex, `style=`, `client:*`, `any`, `ds-allow`, z-index
  ni imports de otros módulos. Ningún token nuevo; las clases usadas existen en `tokens.css` (`text-project-title`,
  `text-title`, `text-caption`, `text-meta`, `text-body`, `text-body-sm`, `rounded-panel`, colores). No hay
  `--*: initial` ni redefiniciones del tema por defecto. El copy está en `content/projects/origen.ts`, no en los
  componentes.
- Componentes aislados (lo que pidió el usuario): un archivo por bloque: `ProcessIntro` (encabezado),
  `ProcessStage` (etapa, iterada), `ProcessFlow` (bloque de flujo), `ProcessFlowStep` (paso, iterado) y
  `ProjectProcess`, que solo los coloca. Ninguno tiene variantes ni props de modo o clase; los props son los
  mínimos (`index`, `stage` y `deliverableLabel`; `step` y `arrow?`; `flow`). Reutiliza `ProjectSectionLabel`.
  Registrado en `docs/components.md:600`.
- V6: 1 h1 en la página; la sección tiene `aria-labelledby` hacia su h2, h3 por etapa y para el flujo, listas
  `<ol>` (pasos con `aria-labelledby`), número de etapa y separadores de la ruta con `aria-hidden`, "Entregable:"
  sr-only. Motion: `reveal-up` solo anima con `scripting: enabled` y `prefers-reduced-motion: no-preference`; con
  reduced motion la opacidad de las 6 entradas es 1.
- V7: alcance acotado a schema/index, `Section.astro`, los 5 componentes nuevos, el asset, el contenido de
  `origen.ts` y la fila de `docs/components.md`.
