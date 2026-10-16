# impl TESTIMONIALS-REAL — 2026-10-15

Este informe sustituye al intento anterior, que se bloqueó porque Figma no estaba autenticado.

## Fuente leída
- `get_design_context` 334:7405 (`flzA0qnj6JdalFCgyB2PdI`): la respuesta es escasa. La sección contiene una banda lima con "TESTIMONIOS" (41:462/41:463) y un único nodo de texto, 41:460.
- `get_design_context` 41:460: el texto completo llegó sin truncar, así que no hizo falta `use_figma`. `get_screenshot` 334:7405 muestra solo texto.
- El texto tiene 21 bloques "Título del proyecto / Cliente / cita". Flavio Mayorga no tiene cita y no se publica (igual que antes).
- No hay fotos de clientes, estrellas ni datos de cabecera (contador o avatares de prueba social).

## Resultado de la comparación
Comparé con un script campo a campo (name, role, quote) las 20 reseñas con cita contra `home.json` › `testimonios.content.reviews`:
- **20/20 coinciden** en nombre, proyecto y cita, y en el mismo orden.
- Única diferencia: #15 role. Figma lleva un espacio doble en "Creación de página  para empresa industrial" y el contenido usa uno. Se mantiene normalizado porque es un título, no una cita. Las erratas *dentro* de las citas ("enfoque  para", "increíblecon"…) se conservan textuales y siguen pendientes de confirmar.

Por tanto, el contenido de la home ya era el real de Figma (lo cargó SEC-TESTIMONIALS desde `design/copy/testimonials.md`, que es el mismo texto). No hay testimonios de relleno ni datos inventados.

## Archivos creados o modificados
- `design/copy/testimonials.md`: nota de confirmación contra 334:7405/41:460, ausencia de fotos/estrellas/cabecera y la normalización del #15.
- `design/content-gaps.md`: Testimonios › avatares. Se anota que el nodo real tampoco trae fotos.
- `progress/current.md`: plan de la feature.
- `src/`: **sin cambios**. El contenido ya coincidía; las fotos no existen, así que se mantienen los avatares de iniciales; la cabecera no cambia en Figma.

## Tokens
Ninguno agregado ni eliminado.

## Responsive
No hay cambios visuales. Con 20 reseñas, el masonry (1/2/4 columnas a 375/768/1440, con reparto por alto estimado en `masonry.ts`, duplicado aria-hidden, fade y reduced-motion) queda igual que cuando se verificó SEC-TESTIMONIALS, sin huecos.

## init.ps1
VERDE: toolchain, dependencias, estado (1 in_progress), sistema de diseño, arquitectura, astro check y astro build en OK.
