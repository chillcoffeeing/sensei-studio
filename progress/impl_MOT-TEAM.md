# impl MOT-TEAM: Equipo, hover de perfil con texto en escritura

Vuelta 1. **El Figma MCP no estaba disponible**: el servidor pide OAuth y la sesión no es interactiva, así que
no se pudo pedir `get_design_context` de 41:404. Fuentes usadas:
- estado de reposo: el de SEC-TEAM, ya verificado contra Figma;
- estado final del hover: `design/references/team-hover-final.png`.

Todas las medidas del hover son `@derived` de esa referencia, escaladas de su card (≈360px) a la card de 344px.

## Archivos

- `src/modules/team/schema.ts`: `TeamPerson` añade `company` (línea bajo el cargo, ya redactada) y `bio` (texto plano).
- `src/content/pages/home.ts`: Natalia lleva `company: 'en Sensei Studio' /* PLACEHOLDER */` y `bio: '…' /* PLACEHOLDER */`. Es la adaptación al español del texto de la referencia.
- `src/modules/team/Section.astro`: la card con nombre pasa a `data-card data-team-card tabindex="0"` con `stack-layers`. Tiene dos capas, reposo y detalle (ver abajo). Añade un `<script>` que llama a `bindTeamCards()`.
- `src/modules/team/hover.ts`: nuevo. Hace el blur y la escala de la foto con Motion (`animateTo`) y el typewriter escalonado (`createTypewriter` + `staggerDelay`). Estado activo = hover o foco visible. Solo se engancha con `TEAM_HOVER_MEDIA`, sigue los cambios de esa media query y su limpieza restaura el DOM y los estilos.
- `src/assets/team/plus.svg`: copia de `design/figma/assets/imgPlus.svg`. Es el mismo "+" blanco de 12px del FAQ.
- `src/styles/tokens.css`: tokens nuevos (ver tabla).
- `tests/team.test.ts`: se actualiza el contrato "sin isla" (ahora: sin Svelte, con `<script>` del módulo). Tests nuevos: `company` y `bio` presentes y marcados PLACEHOLDER, ganchos `data-*`, variantes de estado estático y animado, `aria-hidden` de los duplicados, icono.
- `tests/team-hover.test.ts`: nuevo, 7 tests. Cubre `createActiveState`, `photoKeyframes`, que los respaldos coincidan con `tokens.css`, el respaldo en SSR, que la media query sea idéntica a la variante `hover-motion` de `global.css`, y que no se enganche nada si la query no se cumple.
- `docs/design-system.md`: regenerado (`pnpm docs:ds`, también lo hace `check:ds`).
- `progress/current.md`: plan.

## Tokens agregados (todos `@derived` de `team-hover-final.png`)

| Token | Valor | Origen |
|---|---|---|
| `--color-paper-soft` | rgba(255,255,255,0.72) | Texto secundario (empresa, bio): jerarquía de opacidad |
| `--text-team-name` | clamp(24 → 30px) / 1.1 / 600 | Nombre ≈32px en una card de ≈360, que equivale a 30px en una de 344 |
| `--text-team-bio` | clamp(14 → 16px) / 1.4 / 400 | Bio ≈17px con interlineado ≈1.45 |
| `--team-photo-blur` | 16px | Desenfoque fuerte de la foto |
| `--team-photo-scale` | 1.08 | Escala ligera; además oculta el borde translúcido que deja el blur |
| `--team-card-veil` | rgba(0,0,0,0.3) | Velo uniforme sobre la foto |
| `--team-bio-max` | 14em | La bio corta a ≈240px de 360 |
| `--duration-team-typewriter-char` | 15ms | Con el ritmo general (35ms), una bio de ~120 caracteres tardaría más de 4s. A este ritmo tarda menos de 2s |

Se reutilizan:
- tipografía: `text-name` (18/600) para el cargo y `text-role` (14/300) para la empresa;
- espaciado: `spacing-24`, `spacing-30`, `spacing-16`, `spacing-12` y `size-24` para el círculo del icono (`rounded-pill bg-ink`, el mismo patrón que el FAQ);
- motion: `duration-base`, `ease-standard`, `duration-image`, `ease-enter` y `duration-stagger`.

## Comportamiento

- **Capas** (todas en la misma celda, sobre la foto `absolute`):
  1. Reposo (SEC-TEAM): degradado 41:399 como fondo de la capa, nombre y rol.
  2. Detalle: velo, "+" en un círculo arriba a la izquierda, cargo (paper) y empresa (paper-soft) arriba a la derecha, nombre grande (paper) y bio (paper-soft) abajo a la izquierda.
- **Desktop con hover y sin reduced-motion** (`hover-motion`):
  - CSS cruza las capas en hover o `focus-visible` (`card-active`, 250ms).
  - `hover.ts` anima la foto a `blur(16px) scale(1.08)` (Motion, 600ms, ease-enter) y escribe los cuatro textos, escalonados 200ms.
  - Al salir, la foto vuelve con Motion (WAAPI interrumpible) y el typewriter hace `reset`.
- **Táctil (`hover: none`) y `prefers-reduced-motion`**: el estado base es el detalle, estático. La foto se desenfoca por CSS, la capa de reposo tiene opacity 0 y no se engancha JS (el typewriter no toca el DOM).
- **Sin JS**: el hover sigue cruzando las capas por CSS (sin blur ni escritura); en táctil se ve el estado final.
- **A11y**:
  - El texto completo está siempre en el DOM: `createTypewriter` deja la copia transparente legible y la capa escrita es `aria-hidden`.
  - El cargo y el nombre del detalle son `aria-hidden` porque duplican el `h3` y el `p` del reposo, que siguen en el DOM con opacity 0. Así el lector anuncia una vez: nombre, rol, empresa y bio.
  - La card es enfocable (`tabindex="0"`) con un outline `paper` interior (`-outline-offset-2`) para que se vea sobre la foto y no lo recorte el carril.
- **CSS propio**: ninguno nuevo. Se reutilizan las variantes `hover-motion` y `card-active` de MOT-PROJECTS y la utilidad `stack-layers`. No se usa una isla Svelte porque la card usa `<Picture>` de astro:assets y la interacción es un enganche de eventos. Es un `<script>` del módulo, el patrón que `conventions.md § Motion` da para secciones sin isla (como process).

## Responsive inferido

- Medido en Chrome headless sobre el build:
  - 1440: card de 344 × 423.
  - 375 con emulación táctil: card de 260 × 320, estado final estático y sin scroll horizontal (docW = 375).
- Mobile: el cargo envuelve a dos líneas ("Senior UX/UI / designer"). Fuera de `hover-motion` el texto va alineado a la derecha (`text-right`), como en la referencia. Con `hover-motion` va alineado a la izquierda dentro de una caja `w-fit` pegada a la derecha, para que el typewriter escriba de izquierda a derecha sin que el texto se desplace.
- Nombre y bio con tamaños fluidos (`clamp`). La bio limitada a 14em cabe en 4 líneas en ambos anchos.

## Diferencias con la referencia / a confirmar

- La referencia tiene esquinas redondeadas y una card más alta (≈0.68). Se mantienen la card sin radio y el aspecto 344:423 de Figma (SEC-TEAM).
- Tipografía: la referencia usa una grotesca tipo Inter. Se usa `font-body` (DM Sans), la del nombre y el rol en Figma.
- Empresa y bio de Natalia son PLACEHOLDER. Los huecos 40:384, 40:385 y 40:386 siguen siendo decorativos, sin hover, porque no tienen datos.
- Confirmar las medidas con Figma cuando el MCP esté autenticado.

## Verificación visual (Chrome headless propio)

- Lancé Chrome con `--user-data-dir` temporal y lo cerré por su PID; el servidor `node dist/server/entry.mjs` también se cerró por su PID.
- 1440 en reposo: igual que SEC-TEAM.
- A los 250ms del hover: el cargo ya está escrito, la empresa va a medias y la foto se está desenfocando.
- Estado final: coincide con la composición de la referencia. Tras salir: `filter: blur(0px)`.
- Con reduced-motion y en 375 táctil: estado final estático.

## ./init.ps1

```
[OK] node / pnpm / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
check:ds → 407 tokens · 0 ds-allow · 0 error(es)      [OK]
check:arch → 78 archivos · 11 módulos · 0 error(es)   [OK]
astro check → 0 errors (1 hint previo en BaseLayout)  [OK]
vitest → 22 archivos, 230 tests, 4.74s (tests 689ms en total; ninguno cerca de 5s)   [OK]
astro build                                           [OK]
VERDE: todo en orden.
```
