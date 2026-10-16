# Implementación ADV-MODAL-COMPACT

## Archivos creados o modificados

- `src/layout/advice/AdviceDialog.svelte`: deja de estirar el formulario y el contenedor desde `sm`; conserva el alto mínimo de pantalla completa en móvil.
- `src/layout/dialog/ModalDialog.svelte`: agrega la variante opcional de alto `fit`; la predeterminada `auto` conserva el comportamiento del modal de cotización.
- `docs/architecture.md`: documenta las variantes de altura del diálogo común.
- `feature_list.json`: cambia el estado de `ADV-MODAL-COMPACT` a `in_progress`.
- `progress/current.md`: registra el estado y plan de implementación.
- `progress/impl_ADV-MODAL-COMPACT.md`: este informe.

## Decisión de implementación

La asesoría usa `sm:h-fit`: con el `<dialog>` nativo, `height: auto` y los insets verticales del navegador el diálogo podía ocupar todo el espacio disponible aunque su contenido fuera más corto. El límite existente `--dialog-max-h` y `overflow-y-auto` siguen proporcionando scroll interno cuando el contenido no cabe. En móvil se mantienen `h-dvh`, el formulario flexible y el scroll del diálogo.

La variante predeterminada del contenedor sigue siendo `sm:h-auto`; la cotización no recibe la variante `fit` ni cambia su layout. Se mantienen el centrado nativo, el patrón accesible y las clases `motion-safe` existentes.

## Responsive revisado

Mediciones en navegador con viewports CSS 375×812, 768×1024, 1024×768 y 1440×1264:

- **375×812**: pantalla completa; contenido más alto que el viewport y scroll interno, sin desbordamiento horizontal del diálogo ni de la página.
- **768×1024**: tarjeta centrada de 640×824, con alto natural y sin scroll vertical interno.
- **1024×768**: tarjeta centrada de 640×720 (máximo viewport menos 48px); contenido de 828px con scroll vertical interno.
- **1440×1264**: tarjeta centrada de 640×838, coincidente con el alto natural esperado (~840px).

También comprobé la cotización a 1440×1264: conserva su caja de 1024×1216 y el alto completo previo.

## Diseño y desviaciones

La feature referencia Figma `flzA0qnj6JdalFCgyB2PdI`, nodo `272:7938`. No estuvo disponible en esta sesión la skill/MCP de Figma para solicitar un contexto y screenshot actualizado; usé el diseño y estructura ya implementados, las referencias previas de la asesoría y los criterios explícitos de esta feature. No cambié bloques, orden ni jerarquía. No hay desviaciones visuales adicionales: el alto medido de 838px en 1440×1264 responde al objetivo descrito de aproximadamente 840px. Se conserva la variante móvil a pantalla completa, permitida por los criterios.

## Tokens

- Ninguno agregado, eliminado o modificado; se conserva el límite existente `--dialog-max-h`.

## Verificación

- `./init.ps1`: **verde**, exit code 0.
- `check:ds`: 0 errores; `check:arch`: 0 errores.
- `astro check`: OK; `astro build`: OK.
- No se añadieron tests ni dependencias.

## Relanzamiento 2026-10-14

Relanzado con la implementación ya presente y `progress/verify_ADV-MODAL-COMPACT.md` en VERDE, sin hallazgos bloqueantes ni mayores. No hubo cambios de código: `ModalDialog` mantiene `height="fit"` (`sm:h-fit`) solo para asesoría, y la cotización sigue en `sm:h-auto`. Volví a ejecutar `./init.ps1`: **VERDE**, exit 0, con check:ds, check:arch, astro check y astro build OK.
