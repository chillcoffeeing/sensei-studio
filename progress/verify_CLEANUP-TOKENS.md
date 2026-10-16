# Verify CLEANUP-TOKENS — vuelta 1
Resultado: ROJO

## Bloqueantes

(ninguno)

## Mayores

- [V7 / acceptance "tokens.css solo conserva tokens usados"] `--animate-reveal-left` y `--animate-reveal-right`
  no se usan (src/styles/tokens.css:430-431). Solo los consume la utilidad `reveal-*` (global.css:162,
  `--value(--animate-reveal-*)`), y ningún elemento usa `reveal-left` ni `reveal-right`: en `src/` solo aparecen
  dentro de comentarios (src/shared/lib/motion/reveal.ts:3, src/styles/global.css:155). Como Tailwind escanea los
  comentarios, el build genera `.reveal-left{…}` y `.reveal-right{…}` (dist/client/_astro/BaseLayout.*.css), que es CSS muerto.
  Esperado: borrar los dos tokens y dejar los comentarios de reveal.ts:3 y global.css:155 con solo `reveal-up`,
  para que no se generen las clases; en docs/design-system.md, fila Motion, cambiar `--animate-reveal-*` por `--animate-reveal-up`.
  OJO: los `@keyframes reveal-left` y `reveal-right` (tokens.css:450-458) y `--motion-distance-slide` **sí se usan**,
  a través de `--animate-enter-from-left/right` (global.css:198/203, utilidad `enter-from-side`): no hay que borrarlos.

## Menores

- [V7] `scripts/check-design-system.mjs:9` lo editó el implementer, aunque `scripts/` es del orquestador. El arreglo
  (`replaceAll(path.sep, '/')`) es correcto y hacía falta para que `check:ds` arrancara. El orquestador decide si lo acepta.
- `feature_list.json` (líneas 30, 56, 527 y 734) mantiene criterios de features ya cerradas que citan `tests/` y `pnpm docs:ds`.
  Son históricos y los edita el orquestador. No afecta al código.
- El informe de impl dice que solo `blur`/`backdrop-blur` pasan a generar CSS por aparecer en comentarios. En realidad
  `reveal-left` y `reveal-right` también se generan por la misma causa (ver Mayores; ya ocurría en el baseline).

## Verificado sin hallazgos

- **V1** `./init.ps1` (ejecutado por mí): VERDE, exit 0 (check:ds, check:arch, astro check y astro build en OK).
- **tokens.css sin `initial`**: la única coincidencia es el nombre `--text-initials` (rol de texto). No queda ningún `--<ns>-*: initial`.
- **Sin defaults redefinidos**: comparé los 318 nombres de tokens.css con los 419 de `node_modules/tailwindcss/theme.css` (4.3.3).
  La única colisión es `--breakpoint-2xl: 1440px`, que es la excepción permitida.
- **Sin `--spacing-N`**: no aparece `spacing-<n>` en src/, docs/ ni scripts/. En `src/` solo queda `--spacing: 0.25rem` (el nativo).
- **Tokens usados**: revisé cada token por namespace (clase de utilidad o `var(--x)` en src/ fuera de tokens.css, o uso
  interno en keyframes o en otros tokens que sí se usan). Todos tienen uso salvo los dos de Mayores. Los tokens que JS lee
  con `getComputedStyle` (`token: '--…'`) existen todos. `--motion-index` lo pone JS en línea y no es un token.
- **Defaults disponibles**: compilé el CSS del proyecto con `@tailwindcss/node` y una sonda en el scratchpad, sin tocar src/.
  `bg-black` (#000), `bg-white`, `text-neutral-500`, `text-red-500`, `p-4` (`calc(var(--spacing) * 4)`, `--spacing: 0.25rem`),
  `rounded-lg` (0.5rem), `shadow-md`, `ease-in-out`, `leading-normal` (1.5), `tracking-tight` (-0.025em) y `font-mono` generan CSS.
- **Migración de spacing, verificación exhaustiva y no por muestreo**: alineé uno a uno los atributos `class` del baseline
  (scratchpad `vis/base-dist`, con `--spacing-N: Npx` para los 86 tokens) y del build actual: 1692/1692 en `/` y 435/435
  en `/componentes`. Apliqué a cada utilidad de spacing del baseline la regla N → N/4, incluidas variantes y negativos,
  y comparé con el build nuevo. Resultado: **1500 utilidades de spacing, 0 elementos con diferencias**.
- **Spacing en CSS**: comparé los 379 custom properties comunes al CSS del baseline y al actual, después de resolver
  `var(--spacing-N)` a N px y `calc(var(--spacing) * N)` a 4N px. Hay 0 diferencias de valor salvo `--font-mono`
  (ahora la pila de Tailwind; está documentado y la fuente resuelta es la misma). Revisé a mano los 5 calc reescritos
  y son equivalentes: `--field-pad-x` 16-1, `--field-pad-y` 12-1, `--field-textarea-min-h` 4lh+24, `--hero-offset-top` 52+…
  y `--process-pad-bottom` …+24.
- **Sin tests**: no existen `tests/` ni `vitest.config.ts`. `package.json` ya no tiene `vitest`, `test` ni `docs:ds`, y
  `pnpm-lock.yaml` no menciona vitest. En docs/, scripts/, .claude/, init.ps1 y src/ no quedan referencias a vitest,
  `pnpm test`, `docs:ds` ni `gen-design-docs`. Solo aparecen los avisos "No hay tests" de docs/verification.md y CLAUDE.md.
- **Anotaciones**: no queda ningún `@figma/@derived/@usage/@contrast` en src/.
- **docs/design-system.md**: está escrito a mano, es breve y no lista el default de Tailwind. Las clases citadas en
  docs/components.md y docs/conventions.md ya usan la escala nativa.
- **V2/V3 (sin cambio visual)**: no repetí las capturas. La equivalencia de clases elemento a elemento y la de custom
  properties prueban que ningún valor de layout cambia a 375, 768, 1024 ni 1440. Esto coincide con la comparación de
  estilos computados del informe de impl.
- **V5**: no hay arbitrarios `[..]`, hex sueltos, `any` ni `ds-allow`. El `client:load` de src/layout/Header.astro:63 ya existía y queda fuera del alcance.
- `global.css` con `source("../")`: escanea solo src/. Ninguna clase usada pierde CSS, como confirma la equivalencia anterior.

---

# Verify CLEANUP-TOKENS — vuelta 2
Resultado: VERDE

## Bloqueantes

(ninguno)

## Mayores

(ninguno). El hallazgo Mayor de la vuelta 1 quedó resuelto:
- `src/styles/tokens.css`: ya no existen `--animate-reveal-left` ni `--animate-reveal-right`. Solo queda `--animate-reveal-up` (tokens.css:429).
- Los comentarios de `src/shared/lib/motion/reveal.ts` y `src/styles/global.css:155` solo citan `reveal-up`.
- `docs/design-system.md:23` (fila Motion) ahora dice `--animate-reveal-up`. `docs/conventions.md:65` también.
- Build: en `dist/client/_astro/*.css` hay 0 apariciones de `.reveal-left`, `.reveal-right` y `--animate-reveal-left`. `.reveal-up` sí se genera.
- En `src/` y `docs/` no quedan menciones de `reveal-left`/`reveal-right` salvo los keyframes y su uso en `--animate-enter-from-*`.

## Menores

- `.enter-from-left` y `.enter-from-right` se generan en el CSS aunque ningún `.astro`/`.svelte` los usa. Se generan porque aparecen
  en los comentarios de src/shared/lib/motion/expand.ts:3 y :29. Esto ya pasaba antes y está fuera del alcance de esta vuelta.
  Son utilidades documentadas para lado fijo (docs/conventions.md:75), y sus tokens sí se usan a través de `enter-from-side`,
  así que no infringe "solo tokens usados". Se anota por si el orquestador quiere tratarlo igual que reveal-left/right.
- El cambio a `scripts/check-design-system.mjs` lo aceptó el orquestador. El menor de la vuelta 1 queda cerrado.

## Verificado sin hallazgos

- **V1** `./init.ps1` (ejecutado por mí): VERDE, exit 0 (check:ds 0 errores, check:arch 0 errores, astro check 0 errores/0 warnings, astro build OK).
- **No se rompió la entrada lateral**: `@keyframes reveal-left`/`reveal-right` (tokens.css:448-456) y `--motion-distance-slide` (tokens.css:423)
  siguen definidos y en uso por `--animate-enter-from-left/right` (tokens.css:430-431). Estos los consume la utilidad `enter-from-side`
  (global.css:198/203), que se aplica con `ENTER_CLASS` (src/shared/lib/accordion-controller.svelte.ts:20,45).
  En el CSS compilado están presentes `@keyframes reveal-left` (1), `@keyframes reveal-right` (1), `--motion-distance-slide` (3),
  `--animate-enter-from-left` (3) y `.enter-from-side` (2).
