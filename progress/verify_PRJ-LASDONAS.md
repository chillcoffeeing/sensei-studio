# Verify PRJ-LASDONAS — vuelta 1
Resultado: VERDE

## Bloqueantes

Ninguno.

## Mayores

Ninguno.

## Menores

- [V4] `src/assets/projects/las-donas/conclusion-florist.jpg`: el raw de Figma (267:2026) trae texto horneado "EJEMPLOS TERRITOR…" en la franja superior (y≈30–48 px del raw). El recorte 3:2 centrado (desde y=43, igual que el `object-cover` de Figma) deja la mitad inferior de esas letras en el borde superior derecho de la foto (visible como una marca clara a 1440 y 768). Sugerencia: recortar desde y≈50 (1009×668 o reescalar a 3:2) para eliminar el fragmento. Figma muestra lo mismo, así que no bloquea.
- [V4] La imagen de conclusión mide 1009 px de ancho y el build pide un ancho de 1020 (`width="1020"` en el `<img>` generado). Es el comportamiento de `Photo`/`media.ts` compartido, no algo de esta feature. Solo se anota.
- [V3] A 375, la tarjeta "Siguiente proyecto" (portada derivada de Yupa, `object-cover`) corta la "Y" del logotipo YUPA por la izquierda. Pasa por la derivación de tarjetas ya existente y la imagen de Yupa, no por esta feature. Solo se anota.

## Verificado sin hallazgos

- **V1**: `./init.ps1` lo ejecuté yo y salió VERDE (exit 0): check:ds, check:arch, astro check y build OK.
- **Contrato / sin componentes nuevos**: `las-donas.json` es un PageDoc con las 9 secciones de la plantilla case-study en el orden por defecto y sin campos fuera de esquema. `solution.media: []` es la variante vacía que el contrato prevé. No hay ningún módulo, componente ni tipo con nombre de proyecto: las únicas menciones están en comentarios. El único cambio de código es `HeroLogo.astro` (`object-contain object-left`). Es genérico, no afecta a Remittven (logo apaisado) y está justificado en el informe.
- **Copy textual**: lo comparé contra `get_design_context` de 267:1761 (hero), 267:1793 (resultados), 267:1821 (contexto), 267:1869 (solución), 267:1898 (proceso), 267:1959 (alcance) y 267:2025 (conclusión). Todo coincide. Las desviaciones ("Las Doñas" en el h1, las semanas normalizadas, los puntos finales, "instante.." → ".", la 3.ª línea oculta del título de resultados) son las mismas que ya se decidieron en Yupa y Remittven y están anotadas en `design/content-gaps.md`.
- **Assets**: el sello SVG (136×136, cuadrado) se ve a 56 px (375/768) y a 80 px (≥1024), alineado a la izquierda y sin deformarse. Hotjar (600×156) y Analytics (600×147) se ven a 32 px de alto con su proporción. La conclusión es JPG de 130 KB (antes PNG de 1,37 MB), servida en avif con srcset, a 3:2 como en el hueco de Figma (510×340). El `alt` es descriptivo. Las portadas vacías de Figma se tratan como hueco.
- **Ciclo siguiente proyecto** (comprobado en el HTML generado y en el navegador): `/proyectos/yupa/` → remittven, `/proyectos/remittven/` → las-donas, `/proyectos/las-donas/` → yupa. `docs/content-model.md` documenta el ciclo.
- **V3 Responsive**: Chrome headless (perfil temporal, PID propio ya cerrado), con movimiento reducido, sobre el build estático, en las 3 rutas a 375/768/1024/1440. `scrollWidth == clientWidth` en las 12 combinaciones, sin elementos desbordados y sin imágenes rotas en Las Doñas. Las capturas de Las Doñas a los 4 anchos muestran jerarquía legible: métricas en 1 o 3 columnas, el flujo de fidelización en vertical en móvil, y las herramientas caben en una fila a 375.
- **V2 Estructura**: el orden de secciones, los bloques y la composición coinciden con 267:1745. La lámina ocupa la fila porque el bloque de packaging está vacío en Figma, tal como prevé el contrato.
- **V6**: hay un h1 ("Las Doñas") y un h2 por sección. Los iconos decorativos llevan `alt=""` y las imágenes de contenido tienen `alt`.
- **SEO**: el título tiene 48 caracteres, la descripción 141 y `ogImage` resuelve al asset optimizado.
- **content-gaps**: el bloque de Las Doñas está completo. Cubre la portada vacía, los tres bloques de solución vacíos (267:1891, 267:1897, 267:6146), los textos de plantilla, el año 2025, "Semana 8", las descripciones de Hotjar y Analytics y las correcciones.
- **V5/V7**: `HeroLogo.astro` no tiene valores arbitrarios, hex, `client:load` ni `ds-allow`. No se agregaron tokens. El alcance se limita a datos, assets, el ajuste genérico de HeroLogo y la documentación.
