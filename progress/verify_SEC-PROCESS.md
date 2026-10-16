# Verify SEC-PROCESS — vuelta 1
Resultado: VERDE

Fuentes: no se llamó al Figma MCP porque está limitado (plan Starter, lo confirma el implementer). Se usaron `design/figma/homepage.0.txt` (nodos `31:18`, `35:132` y `31:42`) y `design/figma/assets/imgGroup17.svg`.
V3 se revisó de forma estática. No se tomaron capturas nuevas; las medidas por CDP de `impl_SEC-PROCESS.md` cuadran con el CSS revisado.

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V6] src/modules/process/Section.astro:43-46: el % se lee como texto, así que es accesible. Pero un lector de pantalla anuncia "01 25%" sin contexto. Sugerencia: añadir un texto `sr-only` del tipo "Paso 01 · progreso acumulado 25%", o poner `aria-label` en el `<p>`. No bloquea, porque el valor no depende solo de la barra (que es `aria-hidden`).
- [copy] design/copy/process.md dice "radio 20" y Figma `31:18` dice `rounded-[10px]`. El código usa `radius-panel` = 10, que es lo correcto porque manda Figma. Conviene corregir la nota del copy (lo edita el orquestador).
- [copy] El texto del badge (SVG de Figma) empieza en "CREATIVIDAD" y el copy en "TECNOLOGÍA". El texto es circular y la secuencia es la misma, así que se acepta el asset sin cambios.

## Verificado sin hallazgos
- **V1**: `init.ps1` en VERDE, código 0. Pasaron toolchain, install, estado, check:ds, check:arch, astro check, vitest y build.
- **V2, lo que existe en Figma**:
  - `31:18` bg `#090909` → `bg-ink` (#090909) ✓
  - radio 10 → `rounded-panel` (10) ✓
  - alto 638 → `xl:min-h-638` ✓
  - ruido → `surface-noise` ✓
  - `35:132`: Google Sans Flex Medium 20px, `leading-none`, blanco. En el código: `font-heading text-lead` (máx 20px, 500), `leading-none` y `tone-strong` = paper #FFFFFF ✓
  - Posición de `35:132`: left 114 − 59 = 55 → `--process-pad-x` máx 55 ✓. Top 3509 − 3441 = 68 → `--process-pad-y` máx 68 ✓
  - `31:42`: 157.499 × 157.502 → `--process-badge-size` 157.5 ✓. Right 1381 − (1190 + 157.5) = 33.5 ✓. Bottom 4079 − (3892 + 157.5) = 29.5 ✓
  - Separación con la sección anterior: 3441 − 3376 = 65 → `--process-pad-top` ✓
- **V2, parte inferida**:
  - Usa solo tokens existentes: `h-9`, `bg-brand`, `mt-21/24/15`, `gap-x-30`, `gap-y-40`, `gap-10/16`, `text-eyebrow/title/body`, `paper-muted`.
  - Los tokens nuevos tienen `@derived` o `@figma` con su origen: `--color-progress-track`, `--process-head-gap`, `--process-pad-bottom` y los clamps.
  - No hay valores arbitrarios (`[...]`), hex, `z-` mágico ni `ds-allow` en `src/modules/process/`.
  - El `style="width: N%"` usa %, no px. Lo permite `docs/conventions.md`.
- **Copy**: coincide al pie de la letra con `design/copy/process.md`: eyebrow/h2, duración, los 4 números, títulos, % y descripciones con sus guiones largos (src/content/pages/home.ts:111-148). El componente no tiene copy escrito a mano.
- **Badge solo con motion-safe**: el elemento solo lleva `motion-safe:animate-badge-spin`. En el CSS del build la regla está dentro de `@media (prefers-reduced-motion:no-preference)`. Existe una clase `.animate-badge-spin` sin condición, generada por el escaneo de tokens/tests, pero ningún elemento la usa. No hay isla ni `<script>`.
- **V3, estática**:
  - Pasos en 1 columna en mobile, 2 desde md y 4 desde xl.
  - Cabecera en columna en mobile; desde sm pasa a fila con línea de puntos.
  - `--process-pad-bottom` reserva espacio para el badge por debajo de xl, así no tapa texto.
  - Todos los clamps tienen mínimos para mobile.
  - No hay anchos fijos que puedan provocar overflow.
- **V4**: `src/assets/process/process-badge.svg` es idéntico byte a byte a `design/figma/assets/imgGroup17.svg` (cmp). Se usa en su sitio, con caja cuadrada.
- **V5**: no hay `client:*`, `any` ni imports entre módulos. La API pública es `index.ts` y el registro está en `src/app/registry.ts` y `src/app/sections.ts`.
- **V6**:
  - `section` lleva `aria-labelledby` al h2 y los pasos usan h3. Jerarquía correcta.
  - Los pasos son una `<ol>`.
  - La barra de progreso y la línea de puntos son `aria-hidden`.
  - El badge lleva `alt=""` y `aria-hidden`.
  - Contraste: `paper-muted` sobre ink da 9.08:1 y `brand` sobre ink cumple AAA.
- **V7**: el alcance cubre los 4 criterios de `acceptance`, incluido el arrastre DS-001 (el `@usage` de `radius-panel` corregido en tokens.css:498).
