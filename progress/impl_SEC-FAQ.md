# impl SEC-FAQ — FAQ: acordeón (vuelta 1)

Fuente: el MCP de Figma no está disponible en esta sesión. No hay herramienta `get_design_context` y el conector
`plugin:product-management:figma` pide OAuth. Por eso se usó la exportación `design/figma/homepage.0.txt`:
nodo `41:406` (41:411 eyebrow, 41:414, 41:415 h2) y `174:157` (cards 174:158, 174:165 y 174:171).
**La exportación está truncada después de la 3.ª card.** Las preguntas 4 y 5 se leyeron de un recorte de
`design/figma/homepage-full.png` (570px de ancho, a baja resolución). Se da por hecho que las cards 4 y 5 tienen
la misma estructura que 174:165. El asset es `design/figma/assets/imgPlus.svg`. No existe `design/copy/faq.md`,
así que el copy es el de Figma.

## Archivos

- `src/shared/lib/accordion.ts`: nuevo. Contiene la lógica genérica del acordeón (`OpenIndex`, `toggleIndex`, `focusTarget` y `accordionIds`), que antes estaba en `modules/services/accordion.ts`. Se mueve a shared porque la usan dos módulos y un módulo no puede importar otro.
- `src/modules/services/accordion.ts`: modificado. Solo conserva lo propio de services (`rowLeading`, `AccordionImage` y `AccordionService`).
- `src/modules/services/ServicesAccordion.svelte`: modificado. Ahora importa la lógica genérica de `@/shared/lib/accordion`. Su comportamiento no cambia.
- `tests/services.test.ts`: modificado. Importa la lógica genérica desde shared; los tests son los mismos.
- `src/modules/faq/schema.ts`: nuevo. Define `FaqItem`, `FaqContent` (con `lang?` e `items`) y `FaqSection` (con cabecera obligatoria).
- `src/modules/faq/Section.astro`: nuevo. Cabecera común (`SectionHeader`) más la isla. Usa grid de 2 columnas en xl+ y apila por debajo.
- `src/modules/faq/FaqAccordion.svelte`: nuevo. Isla Svelte 5 con las cards, el botón + que rota a × y la navegación por teclado.
- `src/modules/faq/index.ts`: nuevo, API pública.
- `src/assets/faq/plus.svg`: nuevo. Es una copia byte a byte de `design/figma/assets/imgPlus.svg` (174:162).
- `src/app/sections.ts`, `src/app/registry.ts`: registran `faq`.
- `src/content/pages/home.ts`: añade la sección `faq` después de `equipo`.
- `src/styles/tokens.css`: añade el grupo "FAQ" con 8 tokens.
- `tests/faq.test.ts`: nuevo, 13 tests. Cubren el contenido (orden, copy, tonos, typo corregido, `lang`) y el contrato del marcado (isla, ARIA, progressive enhancement, tokens de la card, rotación con motion-safe, uso de shared y asset sin modificar).
- `docs/design-system.md` y `docs/architecture.md` (mapa): regenerados.
- `feature_list.json` (`in_progress`) y `progress/current.md` (plan).

## Tokens

| Token | Valor | Origen |
|---|---|---|
| `--faq-pad-top` | clamp(64 → 140) | @figma 40:388 fin 8078 → 174:157 top 8220 = 142, normalizado a 140 (spacing-140) · @derived 64 a 375 |
| `--faq-head-offset` | 29px | @figma 41:406 top 8249 − 174:157 top 8220 (solo xl+) |
| `--faq-cols` | minmax(0, 1fr) min(794px, 60.1515%) | @figma 174:157 x 586 = 40% + 10, ancho 794 (spacing-794) · @derived proporción 794/1320 entre xl y 2xl |
| `--faq-title-max` | 11.6em | @figma 41:415 ancho 522 a 45px · @derived medido en Chrome: "Tenemos respuestas." = 9.758em, "¿Tienes preguntas? Tenemos" = 13.281em |
| `--faq-card-pad-x` | clamp(20 → 40) | @figma 174:158 px 40 · @derived 20 a 375 |
| `--faq-card-pad-y` | clamp(20 → 32) | @figma 174:158 py 32 · @derived 20 a 375 |
| `--faq-answer-gap` | var(--spacing-24) | @figma 174:158 gap 24 |
| `--faq-icon-gap` | var(--spacing-16) | @derived separación mínima entre la pregunta y el botón (174:159 es justify-between sin gap) |

Se reutilizan tokens que ya existían, anotados para estos nodos: `text-title-sm` (174:160, 19/500, tracking −1%),
`text-answer` (174:164, DM Sans 16/26), `color-ink-muted`, `color-ink`, `color-paper`, `radius-card` (16),
`shadow-card-sm` (0 4 6 / 3%), `radius-pill`, `spacing-32` (botón), `spacing-12` (icono), `spacing-16` (gap entre cards),
`spacing-794`, `section-head-gap`, `animate-panel-in`, `duration-base` y `ease-standard`.

## Decisiones

- **Lógica en shared.** `toggleIndex`, `focusTarget` y `accordionIds` pasan a `src/shared/lib/accordion.ts`, sin
  dominio. Services y FAQ la importan desde ahí. Lo específico de services (`rowLeading` y los tipos de imagen) se
  queda en su módulo. `check:arch` pasa en verde.
- **Layout.** Figma posiciona en absoluto la cabecera (x 59) y el acordeón (x 586, ancho 794). Se traduce a un grid de
  xl+ con `1fr` y `min(794px, 60.1515%)`: en 1440 da 526 y 794 exactos, y el borde derecho queda en 1380. La cabecera lleva
  `xl:mt-29` (token) porque en Figma empieza 29px por debajo del acordeón. Por debajo de xl se apila: cabecera,
  `section-head-gap` y la lista a todo el ancho. En lg (1024) la columna de la cabecera quedaría de unos 376px, demasiado
  estrecha para el h2, por eso las dos columnas empiezan en xl.
- **Card y botón.** Toda la cabecera de la card es el `<button>` (área táctil grande): pregunta más círculo ink de 32 con
  el + de 12 de Figma (`<img>` del asset, sin redibujar). Al abrir, el + rota 45° (`rotate-45`) y queda como ×. La
  transición solo corre con `motion-safe:`. La respuesta usa `pt-24` (gap 174:158) y entra con
  `motion-safe:animate-panel-in`, igual que services.
- **Accesibilidad.** Cada pregunta es `h3 > button[aria-expanded][aria-controls]` y la respuesta es
  `div[role=region][aria-labelledby]`. Se navega con flechas (con vuelta), Home y End. El foco es visible con
  `outline-ink` y offset 4. El icono es decorativo (`aria-hidden`, `alt=""`). La lista lleva `lang="en"` porque el copy
  de Figma está en inglés y la página en español.
- **Estado inicial.** La primera pregunta aparece abierta, como en 174:158, y solo puede haber una abierta a la vez.
  El patrón de progressive enhancement es el de services: sin JS se ven todas las respuestas, y con JS las cerradas
  se ocultan con `scripting:data-collapsed:hidden` hasta que la isla hidrata (`client:visible`).
- **Copy.** Viene de Figma. "averageю" se cambia por "average." (criterio de aceptación). La pregunta 3 conserva
  el apóstrofo recto de Figma ("What's").

## Responsive medido (Chrome 154 headless sobre `dist/client`)

| Ancho | Cabecera | Acordeón | Cards |
|---|---|---|---|
| 1440 | eyebrow en x 60 y top = lista + 29; h2 de 45px en 2 líneas ("¿Tienes preguntas?" / "Tenemos respuestas.") | x 586, ancho 794, pt de sección 140 | abierta 198 (32 + 32 + 24 + 3 × 26 + 32), cerradas 96, gap 16; padding 32/40; círculo de 32 en x 1308 (40 del borde derecho) |
| 1280 | x 40, ancho 427, h2 de 42.7px en 2 líneas | x 518, ancho 722 | abierta 194, cerradas 92 |
| 1024 | apilada, h2 de 39px en 2 líneas | x 40, ancho 944 | abierta 163, cerradas 87 |
| 768 | apilada, h2 de 35.5px en 2 líneas | x 32, ancho 704 | abierta 183, cerradas 81 |
| 375 | apilada, h2 de 30px en 2 líneas (mismo corte) | x 16, ancho 343 | abierta 262 (pregunta en 2 líneas), cerradas 82; padding 20 |

No hay scroll horizontal en ningún ancho (docW = ancho del viewport). Interacción comprobada en el navegador: al pulsar
la 3.ª pregunta se cierra la 1.ª (aria-expanded, `hidden` y rotación del icono se actualizan) y al volver a pulsar se
cierra; con End se enfoca la última pregunta y con ArrowDown se vuelve a la primera.

## Puntos a confirmar

1. **Respuestas 2–5 provisionales.** Figma solo tiene la respuesta de la 1.ª pregunta (INVENTORY §3.7). Las otras
   cuatro son textos redactados por mí en el mismo tono, marcados como PROVISIONALES en `home.ts`, y hay que
   reemplazarlos por el copy real. La de la suscripción mensual no promete condiciones (remite a la consulta inicial).
2. **"On average."** Con la corrección pedida, la frase queda "On average. We’ll provide…". Parece un texto cortado
   (falta un plazo, del tipo "On average, X weeks"); hay que confirmarlo con copy.
3. **Idioma.** El FAQ está en inglés y la página en español (INVENTORY §3.1). Se declaró `lang="en"`. Si se traduce,
   basta con quitar `lang` del contenido.
4. **Cards 4 y 5.** Se leyeron del PNG porque la exportación está truncada. Conviene validar los nodos con el MCP
   cuando esté disponible.

## init.ps1

```
[OK] toolchain · pnpm install · estado (1 in_progress)
check:ds → 328 tokens · 0 ds-allow · 0 error(es)
check:arch → 56 archivos · 10 módulos · 0 error(es)
astro check → 0 errors
vitest → 16 files, 132 tests passed
astro build → OK
VERDE: todo en orden.
```
