# Verify QTE-MODAL-FIT — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V3] En viewports muy altos donde el formulario cabe entero (p. ej. 1440×1264, o un móvil de 375×2100), pasar de "Rango aproximado" a "Monto máximo fijo" o enviar con errores cambia el alto del diálogo y lo recentra (en 375×2100 medido: 1912 → 1834 px, top 94 → 133). En los anchos de referencia (375×812, 768×1024, 1024×768, 1440×900) el diálogo ya está en su tope y no se mueve. En 1440×1264 cambiar de opción no altera el alto (942 → 942). Se acepta como está. Si se quiere suavizar, se puede animar el alto con `interpolate-size` dentro de `motion-safe:`. (src/layout/dialog/ModalDialog.svelte:111)

## Verificado sin hallazgos
- **V1**: `./init.ps1` termina en VERDE con código 0 (check:ds, check:arch, astro check y build).
- **V2**: se mantiene la estructura de 220:867 (cabecera, 2 columnas en lg, pie con WhatsApp y envío). La única desviación es que en mobile se muestra como tarjeta (rounded-2xl, 16px de margen) en vez de a pantalla completa. Está justificada porque el criterio pide que el diálogo quede centrado en todos los anchos. Revisé las capturas a 375×812 y 1440×1264: legibilidad y jerarquía correctas.
- **V3**: mediciones con Chrome headless sobre el build de producción (`astro preview`):
  - 375×812: caja 343×780 a 16px de los bordes, scroll interno (contenido de 1912 px), scrollWidth 375.
  - 375×600: 343×568, scroll interno.
  - 375×2100: 343×1912, centrado (top 94), con el alto natural.
  - 768×1024: 720×976 a 24px; 1024×768: 976×720 a 24px, scroll interno.
  - 1440×1264: 1024×942, centrado (208/161), sin scroll (scrollHeight igual a clientHeight).
  - 1440×900: 1024×852 con scroll interno.
  - El botón de envío mide 44px de alto y se llega a él con el scroll interno en todos los casos.
  - No hay scroll horizontal en ningún viewport.
- No hay alto fijo ni min-height de pantalla completa en la variante `card`. Se quitaron `min-h-full` y `flex-1` del form en QuoteDialog.svelte.
- **V4**: no se tocaron assets.
- **V5**: sin valores arbitrarios, hex, `client:load`, `any` ni `ds-allow` en los archivos tocados. Los tokens `--dialog-w-compact` y `--dialog-max-h-compact` son nuevos, se usan (ModalDialog.svelte:31) y no redefinen nombres de Tailwind. Los dos están documentados en docs/design-system.md y docs/architecture.md.
- **V6**: comprobado en headless:
  - Escape cierra el diálogo.
  - Un clic en el backdrop lo cierra.
  - `html` queda con `overflow: hidden` mientras está abierto.
  - El foco entra en el diálogo.
  - La animación de apertura sigue bajo `motion-safe:`.
- **V7**: el alcance se limita a ModalDialog, QuoteDialog, AdviceDialog (se quitó una prop redundante), tokens y docs. El modal de asesoría no cambia: a 375 sigue a pantalla completa (375×812) y a 1440 mide 640×839, centrado.
