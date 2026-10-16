# Verify PRJ-CAPPI — vuelta 1
Resultado: VERDE

Método:
- `./init.ps1` ejecutado por el verifier.
- Build servido con `dist/server/entry.mjs` en el puerto 4391.
- Chrome headless por CDP, con `--user-data-dir` temporal propio y `prefers-reduced-motion: reduce`. Al terminar se cerró solo ese PID.
- Capturas a 375, 768, 1024 y 1440 de `/proyectos/cappi-xtremo/`, y a 1440 de `/` y `/proyectos/`. También a 375 de `/`.
- Figma `flzA0qnj6JdalFCgyB2PdI`: `get_design_context` y `get_screenshot` de 267:2146.

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V2] `/proyectos/` arranca ahora con Cappi Xtremo y sigue con Yupa → Remittven → Las Doñas.
  - Causa: `projectCycle()` (`src/content/projects.ts:116`) empieza por el slug alfabético más bajo, y ahora es `cappi-xtremo`.
  - La home empieza por Yupa. No está mal, pero los dos órdenes difieren.
  - Si se quiere el mismo orden, `proyectos.json` puede fijar `projects` explícitos. Esto no entra en esta feature.
- [V2/V3] Solución a 375: las tres pantallas anchas (relación ≈2,17) van en `aspect-4/3` con `contain`. Quedan pequeñas, con mucho aire arriba y abajo.
  - Es el mismo layout que en los otros casos y el informe lo documenta.
  - Sugerencia para otra feature: usar la proporción del asset en mobile.
- [V2] Herramientas: el PNG de Claude (548×118, muy apaisado) se ve con más peso que Figma, Notion y GitHub. Pasa en la fila de 1440 y en el 2×2 de 375.
  - Es un ajuste fino de tamaño por logo y no bloquea.
- [V4] El logo del hero solo existe a 142×67, así que se ve algo suave a 80 px de alto (lg) y en retina.
  - Está anotado como P3 en `design/content-gaps.md`.
- [V2] Solución: la rejilla 2×2 de Figma (sobre 267:2331) pasa a tres bloques anchos apilados.
  - Se acepta: 268:7404 duplica a 268:7402, mantiene el componente existente y está justificado y anotado como P3 en content-gaps.
  - Queda a confirmar con el estudio.

## Verificado sin hallazgos
- **V1**: `./init.ps1` VERDE: check:ds 0 errores, check:arch 0 errores, astro check 0 errores y build OK.
- **V2 Estructura**: el orden y los bloques coinciden con 267:2146:
  1. hero
  2. resultados
  3. contexto + reto/objetivos
  4. solución (lámina + web, piezas anchas)
  5. proceso + flujo
  6. alcance + herramientas/stack
  7. cierre
  8. siguiente proyecto
  9. contacto
- **V2 Copy**: se cruzó el texto de Figma con el JSON. Todo el copy textual está presente. Las únicas diferencias son las normalizaciones documentadas:
  - SEMANAS 1 → Semana 1;
  - before/after separados;
  - overline "Cappi / Sistema de marca", con el mismo patrón que Yupa, Remittven y Las Doñas;
  - la conclusión de Remittven, copiada por error en Figma, se reemplazó y quedó como P2.
- **Galería de la home**: 4 tarjetas en rejilla 2×2 desde lg, sin destacada (`featuredFirst` solo con número impar) y sin huecos. Orden: Yupa, Remittven, Las Doñas, Cappi Xtremo. Enlaces correctos en `dist/client/index.html`.
- **`/proyectos/`**: lista los 4 casos, enlaces correctos.
- **Ciclo de siguiente proyecto** (comprobado en el HTML construido): Yupa → Remittven → Las Doñas → Cappi Xtremo → Yupa. La tarjeta de Cappi muestra Yupa. `docs/content-model.md:134` está actualizado.
- **Menor arrastrado 1, portada en mobile**: `HeroCover.astro` usa `sizes="(min-width: 1024px) 100vw, 1700px"` y `widths` hasta 2000.
  - A 375 y 768, `currentSrc` es la variante grande (naturalWidth 1699 frente a unos 1700 CSS) en lugar de la de 640, así que ya no se ve blanda.
  - A 1440 usa la de 1440. Resuelto.
- **Menor arrastrado 2, sombra desde md**: `HeroCover.astro:26` usa `md:bg-(image:--project-cover-shade)`.
  - A 768 el h1, la promesa y el resumen quedan sobre fondo oscuro y legible.
  - `--project-cover-shade-sm` es más densa: el h1 se lee bien a 375. El cambio está justificado en el informe y afecta a las cuatro portadas por igual.
- **V3**: sin scroll horizontal (scrollWidth = clientWidth) a 375, 768, 1024 y 1440, y en la home a 375 y 1440. Herramientas: 2×2 a 375 y 4 en fila desde sm. Con 3 herramientas (resto de casos) no cambia. Nada se corta.
- **V4**:
  - Assets en `src/assets/projects/cappi-xtremo/` (7) y `tools/claude.png` existen y no están vacíos.
  - Cada uno está en su sitio: portada 320:576, logo 268:7394, web 268:7397 junto a la lámina, y portal inicio, portal pagos y backoffice como bloques anchos.
  - Las proporciones se conservan (`contain` en la solución).
  - GitHub reutiliza el SVG existente.
- **V5**:
  - Sin `[..]` arbitrarios, hex, `client:load`, `any` ni `ds-allow` en los archivos tocados.
  - Sin imports entre módulos y sin copy en componentes (el microcopy sale de `case-study.ts`).
  - `tokens.css` sin `initial` ni nombres por defecto redefinidos. No hay tokens nuevos.
- **V6**: un h1 en el caso, h2 por sección, `alt` descriptivos en todas las imágenes nuevas. No hay motion nuevo.
- **V7**: los cambios se limitan a la `acceptance` y a los dos menores arrastrados. El cambio en `ScopeTools` es genérico y está documentado. Docs y content-gaps están actualizados.
