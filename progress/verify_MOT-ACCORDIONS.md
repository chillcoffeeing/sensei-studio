# Verify MOT-ACCORDIONS — vuelta 2
Resultado: VERDE

## Bloqueantes
(ninguno)

El bloqueante de la vuelta 1 ("Nota del orquestador": timeout de 5000 ms en
`tests/services.test.ts > assets de Figma sin modificar`) quedó resuelto.

## Mayores
(ninguno)

## Menores (vienen de la vuelta 1 y no bloquean)
- [V5] `@custom-variant scripting` (src/styles/global.css:9) ya no lo usa ninguna clase en `src/`. Deja una regla muerta en el CSS compilado porque Tailwind detecta el texto en `progress/*.md`. Se puede resolver con `@source not "../../progress";` o eliminando el variant.
- [V5] `setOpen()` (src/shared/lib/motion/expand.ts:11) se exporta, pero nadie lo usa en `src/`, y docs/conventions.md:76 lo recomienda. Hay que alinear la documentación con el patrón real (`data-open` declarativo).
- [V3] No hay navegador headless, así que la revisión responsive fue estática y la comprobación visual de la animación a 375/768/1024/1440 sigue pendiente.

## Verificación de la corrección (vuelta 2)
- **La aserción no se debilita**: tests/services.test.ts:151-163. Antes comparaba con `expect(buffer).toEqual(buffer)` y ahora usa `actual.equals(expected) === true` (memcmp nativo de Node) más una comprobación previa de `length`. Las dos formas exigen que los bytes de los 3 assets sean idénticos (open-dot.svg, list-bullet.svg y service-placeholder.png contra design/figma/assets). Además, el mensaje de error ahora indica qué archivo difiere. No se agregó un timeout explícito ni `skip`.
- **Determinismo**: hice 3 corridas aisladas de `vitest run tests/services.test.ts`, en las que el test tardó 2 ms, 2 ms y 3 ms (antes eran unos 5,7 s), y las 3 pasaron 17/17. Ambos PNG miden 1.229.500 bytes.
- **Alcance**: la vuelta 2 solo modifica `tests/services.test.ts`. `tests/faq.test.ts` sigue usando `toEqual` sobre un SVG pequeño, sin riesgo.

## Verificado sin hallazgos
- **V1**: `./init.ps1` dio VERDE con salida 0. Pasaron toolchain, dependencias, estado (1 in_progress), check:ds (0 errores), check:arch (0 errores), astro check (0 errores y 0 warnings), vitest (21 archivos, 199/199 en 4,2 s) y astro build. Detalle: `tests/content.test.ts` aparece eliminado en git, pero es un cambio anterior a esta feature (probaba `src/data/content`, que ya no existe) y no es una regresión de MOT-ACCORDIONS.
- **V2, V4, V5, V6 y V7**: sin cambios en `src/` respecto de la vuelta 1, así que siguen valiendo sus conclusiones (expansión `collapsible`, entrada lateral `enter-from-side`, `AccordionController` compartido, reduced motion, sin valores arbitrarios, hex, `any`, `ds-allow` ni `client:load`, ARIA y teclado APG intactos, y marcas PLACEHOLDER presentes). El MCP de Figma sigue sin estar disponible porque pide autenticación, igual que en la vuelta 1.
