# Verify SERVICES-IMAGES — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V3] Láminas UX/UI: con el recorte central a 187:318 se pierden ~6 % por lado y el rótulo de la lámina queda pegado al borde (en `ux-ui-diseno-validacion.png` el "03" de la izquierda queda cortado a medias). Se lee igual como pieza visual; si se quiere afinar, se puede probar con `"position": "left"` en esa imagen (`src/content/data/pages/home.json`, `services[2].images[2]`). No bloquea.
- [Pendiente acordado, no es hallazgo] Siguen en disco las 9 imágenes sin uso de `src/assets/images/servicios-homepage/` (el borrado lo denegó el sistema de permisos y espera la decisión del usuario). Más abajo se confirma que no tienen referencias.

## Verificado sin hallazgos
- **V1**: `./init.ps1` VERDE, código 0 (toolchain, dependencias, estado, check:ds, check:arch, astro check, astro build).
- **V2 Estructura**: el acordeón sigue con 4 disciplinas y 3 imágenes por fila. Solo cambian los datos de `images` en Branding, Email Marketing y UX/UI. No cambia la composición. Desarrollo & IA conserva yupa-app-catalog-screen, cappi-xtremo-backoffice (con `position: left`) y cappi-xtremo-laptop.
- **V4 Assets**: las 9 imágenes nuevas o reutilizadas existen y miden 1281 (o 1282) × 1913 (0,670), con la misma proporción entre ellas. A 187 px de ancho del hueco en 2x (374 px) hay resolución de sobra. El orden de UX/UI es investigación → wireframes/prototipo → diseño/validación, como pide el acceptance. Branding (Papito's, My Little Cat, Tiffany Studios) y Email (Casa Tierra Café, Odontosalud, Rutas Andinas) tienen nombres `branding-*` / `email-marketing-*` y van en JPEG optimizado (156–400 kB). El cambio de formato a JPEG está justificado en el informe.
- **V3 Responsive** (revisión estática más simulación del recorte): el hueco es `aspect-(--service-image-aspect)` = 187/318, con 3 columnas en mobile y `md:w-46.75` en md+. Rendericé las 9 imágenes con recorte `cover` centrado a 187 × 318. El contenido principal queda dentro en todas (productos de branding, cabecera y cuerpo de los correos, títulos de las láminas). No se cambia ningún estilo, así que no hay riesgo nuevo de scroll horizontal. No se tomaron capturas con navegador headless.
- **V6**: cada imagen nueva lleva un `alt` descriptivo en español, concreto y no redundante.
- **V5**: no se tocó código salvo un comentario en `src/content/ui-catalog.ts:173` (`services[0].images[1]` ya no lleva `position`). No hay `any`, ni `ds-allow`, ni clases arbitrarias, ni componentes nuevos.
- **V7 Alcance**: los únicos archivos modificados después de las 15:50 en src/design/docs/scripts/public son `home.json`, `ui-catalog.ts`, `design/content-gaps.md` y `design/placeholders.md`, además de las imágenes nuevas. `content-gaps.md` documenta el P2 PENDIENTE del estudio para `services[3].images`.
- **Imágenes sin uso (confirmado)**: hice un grep en todo el repo (sin node_modules, dist, .astro, .git ni progress). Estas 9 no tienen ninguna referencia a `servicios-homepage/<archivo>`:
  `las-donas-florist.jpg`, `las-donas-laptop.jpg` y `remittven-confirmation-screen.png` no aparecen en ningún sitio. `qfud-app-screens.jpg`, `pictdare-app-screens.jpg`, `just-make-it-fun-web-screens.jpg`, `yupa-checkout-screens.jpg`, `referi-app-screens.jpg` y `soldee-app-screens.jpg` solo aparecen como `images/slider-destacados-homepage/...`, que son copias aparte y siguen en uso. El resolutor `src/shared/lib/media.ts:49` usa `import.meta.glob` sin `eager`: solo se emiten las imágenes que se piden, así que estas no entran en el build. Se pueden borrar sin riesgo.
