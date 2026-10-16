# Verify COPY-FINAL — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [Docs] `design/copy/services.md:72`: la nota "Imágenes por servicio: Figma solo tiene un placeholder (`imgFrame14`)… Se usa ese hasta tener imágenes reales" está desfasada. La sección ya usa 12 piezas reales (HOME-NO-STOCK, como dice `design/content-gaps.md`). Además, `services.md:15` ("El orden es el de Figma") convive con el nuevo párrafo de orden de las líneas 8-11. Conviene borrar la nota de la línea 72 y unificar el texto sobre el orden.
- [Docs] `design/copy/faq.md:20` dice que "post entrega" está registrado en `design/content-gaps.md`, pero la tabla FAQ de content-gaps (líneas 98-101) solo recoge cifras, "Wetransfer" y "EEUU". Hay que añadir "post entrega" (la RAE recomienda "posentrega") a la fila P3 de `content.items[15]`, o quitar la referencia.
- [V3, sugerencia, anterior a esta feature] A 1440 el acordeón de 18 ítems mide unos 1300 px y la cabecera de la columna izquierda (`src/modules/faq/Section.astro:31`) queda arriba, con el resto de la columna vacía. Fijar la cabecera con `xl:sticky` mejoraría el ritmo sin cambiar la estructura. No bloquea.
- [V3, anterior a esta feature] El botón de cada card de FAQ mide 32 px de alto (por encima del mínimo de 24 px de WCAG 2.5.8, pero por debajo de la guía de 44 px del checklist). Ocupa todo el ancho de la card (303 px a 375). Fuera del alcance de COPY-FINAL.

## Verificado sin hallazgos
- **V1**: `./init.ps1` ejecutado por mí, en VERDE (exit 0): check:ds, check:arch, tipos y build.
- **FAQ frente a Figma 328:7312** (`get_design_context`, fileKey flzA0qnj6JdalFCgyB2PdI): el nodo trae **18** preguntas, no 17. El texto manda, así que el criterio de "17" no aplica. `home.json` tiene exactamente las 18, en el mismo orden. Las comparé una por una, pregunta y respuesta: coinciden palabra por palabra salvo las erratas documentadas en `design/copy/faq.md` y en el informe del implementer: "paises"→"países", "dias"→"días", "informas"→"informes", "Global66,Binance"→"Global66, Binance", doble espacio en "online  a medida", "desarrollo Web"→"web", "Sin Intermediarios"→"Sin intermediarios." y espacios iniciales. No hay más cambios. "Wetransfer", "EEUU", "post entrega" y las cifras se dejan tal cual, como debe ser.
- **Preguntas viejas**: no quedan. No aparecen "subscription" ni "suscripción" en `src/`. Se quitó el `lang: "en"` del FAQ. Los dos `lang: "en"` que quedan en `home.json` (líneas 472 y 771) son de testimonios y de contacto, fuera de alcance. El esquema `faq/schema.ts:16` mantiene `lang` como opcional, sin efecto.
- **Servicios frente a Figma 130:707**: los 4 títulos, las 4 entradillas y las 4 listas (10/7/8/10 ítems) coinciden palabra por palabra. El título de Desarrollo es "Desarrollo de productos & automatización IA". El orden publicado (Branding, Email, UX/UI, Desarrollo) difiere del orden del texto, pero está justificado en `design/copy/services.md` e `impl` y no es un cambio de estructura: se mantiene el orden de la sección. Lo acepto.
- **Modal de cotización** (`src/content/site.ts:101-106`): las etiquetas Branding e identidad, Email Marketing, Diseño UX/UI y "Desarrollo de productos & automatización IA" coinciden con la sección. "Ads & SEO" ya estaba y queda fuera de alcance. A 375 la 5.ª opción ocupa la fila completa y su etiqueta se parte en 2 líneas sin cortarse (captura).
- **V3 en navegador** (Chrome headless, build estático de `dist/client`, a 375, 768, 1024 y 1440):
  - No hay scroll horizontal en ningún ancho (scrollWidth = clientWidth en la página, en `#faq` y en `#servicios`).
  - Hay 18 botones `aria-expanded` en el FAQ. Al abrir la pregunta 10 (la respuesta más larga), la card crece y el texto se ajusta sin saltos raros. El acordeón es de apertura única y el icono cambia a ×. A 1440 la columna mide 794 px y las preguntas caben en una línea.
  - En Servicios, con Desarrollo abierto (10 ítems), el alto del panel es igual a su scrollHeight en los cuatro anchos (515, 658, 658 y 358 px), así que nada se recorta. El título largo se parte en 2 líneas a 375 y cabe en una a 1440.
- **V4**: no hay assets nuevos ni sustituidos.
- **V5**: no se añadieron componentes ni tokens. El copy vive en `home.json` y `site.ts`, sin texto escrito a mano en los componentes.
- **V6**: hay un h2 en la sección FAQ ("¿Tienes preguntas? Tenemos respuestas."). Los patrones `aria-expanded` y `aria-controls` no cambian. El motion con reduced-motion no cambia.
- **V7**: el alcance está limitado a `home.json`, `site.ts` (una etiqueta) y la documentación de `design/`.
- **Docs**: `design/content-gaps.md` ya no tiene las filas resueltas (FAQ en inglés, P3 `services[3].title`). La sección FAQ pasa a "Real (18)". La fila 6 del resumen es ahora la incoherencia de cifras, registrada como P1, y Wetransfer/EEUU como P3.
