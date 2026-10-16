# impl COPY-FINAL — Copy final de FAQ y Servicios

Fuente: Figma `flzA0qnj6JdalFCgyB2PdI`, nodos de texto `328:7312` (FAQ, en `334:7404`) y `130:707`
(servicios, en `334:7406`), extraídos con `get_design_context` y su captura.

## Archivos
- `src/content/data/pages/home.json`: FAQ sustituido por completo (18 preguntas en español; se quita `lang: "en"` y todas las preguntas viejas, incluida "suscripción mensual"); `services[3].title` → "Desarrollo de productos & automatización IA".
- `src/content/site.ts`: opción `web-ia` del modal de cotización (y de `/links`, que usa las mismas opciones) con el nuevo nombre.
- `design/copy/faq.md` (nuevo): fuente del FAQ con la lista de erratas corregidas.
- `design/copy/services.md`: fuente vigente 130:707, nuevo título de Desarrollo y justificación del orden.
- `design/content-gaps.md`: fuera la fila 6 del resumen (FAQ en inglés) y la fila P3 `services[3].title`; la sección FAQ pasa a "Real" con 2 huecos nuevos; la fila 6 del resumen pasa a ser la incoherencia de cifras.

Sin cambios de código de componentes ni de tokens: `AccordionCards` (shared/ui) ya admite N ítems y respuestas largas (texto en `<p>` que se ajusta, panel `collapsible` sin alto fijo).

## Desviaciones y decisiones
- **18 preguntas, no 17**: el nodo 328:7312 trae 18 (de "¿Qué es Sensei Studio…?" a "¿Garantizan resultados?"). Se publican todas, en el orden del texto.
- **Orden de servicios**: se mantiene el publicado (Branding, Email, UX/UI, Desarrollo). El texto es un volcado sin intención de orden explícita; reordenar movería las imágenes de cada fila y no aporta nada. El modal de cotización sigue el mismo orden. Listas y entradillas del texto coinciden con las ya publicadas palabra por palabra.
- "Sin Intermediarios" (subrayado en Figma) se publica como frase final en texto plano, "Sin intermediarios.": era énfasis, no un enlace, y el esquema de respuesta es texto plano.

## Erratas corregidas (FAQ)
"paises" → "países"; "dias" → "días"; "informas" → "informes"; "Global66,Binance" → "Global66, Binance"; doble espacio en "online  a medida"; "desarrollo Web" → "desarrollo web"; "Sin Intermediarios" → "Sin intermediarios." (minúscula y punto); espacios iniciales en varias respuestas. En Servicios no hay erratas.

No se tocan, porque no son erratas evidentes (registrados en content-gaps): "Wetransfer" como método de pago (¿Wise?), "EEUU", "post entrega" y las cifras (+500 clientes / +200 proyectos / +6 años), que chocan con stats (+250, +9 años) y testimonios (56+): **P1 para el estudio**.

## Tokens
Ninguno agregado ni eliminado.

## Responsive
Sin cambios de layout. El acordeón ya era una pila de cards a ancho completo en mobile y una columna de min(794px, 60%) en xl+; 18 ítems solo alargan la pila. Los títulos de servicio largos ya se ajustan en la fila (el de Desarrollo apenas cambia de longitud). En los modales, `web-ia` es la 5.ª opción (impar) y ocupa la fila completa (`last:odd:col-span-2`); la etiqueta tiene `min-w-0 flex-1` y se ajusta. Motion sin cambios (reduced-motion ya respetado por AccordionController y reveal).

## init.ps1
VERDE: check:ds, check:arch, tipos y `astro build` en orden. El `dist/client/index.html` contiene "¿Garantizan resultados?", el nuevo título de Desarrollo en sección y modal, y ninguna pregunta vieja ("monthly subscription").
