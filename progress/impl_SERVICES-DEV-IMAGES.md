# Implementación — SERVICES-DEV-IMAGES

## Archivos creados o modificados

- `src/assets/images/servicios-homepage/desarrollo-web-ecommerce-apps.jpg` — JPEG optimizado, 1281 × 1913.
- `src/assets/images/servicios-homepage/dashboards-chatbots-analitica.jpg` — JPEG optimizado, 1281 × 1913.
- `src/assets/images/servicios-homepage/automatizacion-inteligencia-artificial.jpg` — JPEG optimizado, 1281 × 1913.
- `src/content/data/pages/home.json` — sustituye las tres referencias del servicio y añade alt descriptivo en español, en el orden solicitado.
- `design/content-gaps.md` — marca el pendiente de imágenes de Desarrollo & IA como resuelto.
- `design/prompts/servicios-imagenes.md` — documenta la entrega y la dirección vectorial colorida y variada.
- `design/placeholders.md` — actualiza el inventario que aún describía las capturas anteriores como pendiente.
- `feature_list.json` — cambia SERVICES-DEV-IMAGES a `in_progress`; no se marca como done.
- `progress/current.md` — registra la feature activa y su plan.
- `progress/impl_SERVICES-DEV-IMAGES.md` — este informe.
- Eliminados por estar sin referencias en `src/`: `desarrollo-productos-apps.png`, `automatizacion-ia.png` y `dashboards-chatbots-analitica.png`.

## Assets y encuadre

Las tres URLs entregadas se descargaron como PNG de 848 × 1264. Se aplicó recorte central mínimo para ajustar la proporción 1281 × 1913 sin deformación, reescalado Lanczos y exportación JPEG progresiva optimizada (calidad 88, submuestreo de color desactivado). Los archivos finales pesan aproximadamente 351 KB, 254 KB y 238 KB.

Se retiraron del JSON del servicio las referencias a Yupa y Cappi Xtremo. Sus assets existentes se conservaron; no se eliminaron otros archivos de imagen.

## Tokens y responsive

- Tokens agregados o retirados: ninguno.
- Responsive inferido: sin cambios de layout ni breakpoints. Se conserva el acordeón y su recorte central; la relación de aspecto de las imágenes mantiene una composición vertical uniforme en los tamaños existentes.
- Dirección visual: ilustración vectorial colorida con acentos variados (azul, turquesa, violeta, coral, naranja y lima), según el pedido; no se limitaron los acentos al lima.

## Verificación

- `./init.ps1`: **VERDE**.
- Sistema de diseño: sin valores sueltos.
- Arquitectura: fronteras y módulos correctos.
- Tipos: `astro check` correcto.
- Build: `astro build` correcto.
