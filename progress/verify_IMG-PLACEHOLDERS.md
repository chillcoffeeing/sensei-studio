# Verify IMG-PLACEHOLDERS — vuelta 2
Resultado: VERDE

## Bloqueantes

## Mayores

## Menores
- `progress/current.md:11-16`: el plan aún enumera como pendientes la recuración de `services-branding-sketchbook`, el ajuste del área táctil y la ejecución de `./init.ps1`, aunque `progress/impl_IMG-PLACEHOLDERS.md` confirma que se completaron en esta vuelta. Al cerrar o retomar la feature, marcar esas tareas como completadas o retirar el plan obsoleto; el estado abierto y el límite de autorización sí coinciden.

## Verificado sin hallazgos
- **V1:** ejecuté `./init.ps1`; terminó con código 0. Toolchain, instalación, estado, `check:ds`, `check:arch`, `astro check` y build en verde; 0 errores y 0 warnings de Astro (1 hint preexistente en `src/layout/DocumentHead.astro:66`).
- **V2:** inspección en navegador de `/` a 375px. La imagen de `services-branding-sketchbook` carga y se ve como un cuaderno claro con lápiz de madera, terracota y plantas: coherente con la dirección editorial cálida tierra/arena y con las otras dos imágenes de Branding. No cambian el orden, los bloques ni la composición del servicio. ID `_CGxNOLM1gQ`, autor Max Saeling; registro y alt descriptivo coinciden en `src/content/unsplash-photos.json` y `design/placeholders.md`.
- **V3:** comprobé `/` y `/creditos/` a 375, 768, 1024 y 1440px: en los cuatro tamaños `scrollWidth` coincide con `clientWidth` (sin overflow horizontal). En `/creditos/`, los 74 enlaces de atribución (autor y Unsplash para 37 fotos) miden al menos 44px de alto; cero quedan por debajo del mínimo. El foco de teclado muestra outline sólido visible (1.6px calculados). Se mantienen enlaces de autor y de Unsplash con referido `utm_source=sensei_studio&utm_medium=referral`.
- **V4:** la nueva foto carga en navegador (`naturalWidth` 187px), se usa en el slot y conserva el recorte/proporción responsive del componente. Manifiesto: original 4000×6000, alt en español, ID/foto y crédito de Max Saeling asociados correctamente. El uso remoto está dentro de la autorización registrada para este slot.
- **V5–V6:** `check:ds` y `check:arch` sin errores; búsqueda estática sin `ds-allow`, valores arbitrarios de estilo ni imports entre módulos. La sección mantiene un único h1, h2 por grupo, alt descriptivo en fotos, enlaces con nombre accesible y `rel="noopener"`; el foco visible quedó comprobado en navegador. Los `client:load` existentes corresponden al header interactivo y a la barra flotante, no a la sección de créditos.
- **V7:** `feature_list.json` mantiene `IMG-PLACEHOLDERS` en `in_progress`. Tanto `feature_list.json` como `design/placeholders.md` documentan expresamente la autorización del usuario del 2026-10-09 para usar Unsplash en sustitución de los assets IA ausentes, limitada a los diez slots `project-laptop-table`, `project-stationery`, `project-phone-hand`, `project-skincare`, `project-cafe`, `project-tablet-interior`, `services-branding-cards`, `services-branding-sketchbook`, `services-branding-tote` y `services-email-phone-linen`; no se extiende a otros slots. El informe de implementación describe esta corrección acotada, sin cambio de estructura ni layout.
