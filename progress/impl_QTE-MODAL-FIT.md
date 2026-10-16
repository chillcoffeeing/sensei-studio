# Implementación QTE-MODAL-FIT

## Archivos modificados

- `src/layout/dialog/ModalDialog.svelte`: `sm:h-fit` común a los dos modales; la prop `height` (`auto` | `fit`) pasa a `mobile` (`full` | `card`); `card` da una tarjeta centrada con alto natural también en mobile.
- `src/layout/quote/QuoteDialog.svelte`: usa `mobile="card"`; el formulario deja de estirarse (`min-h-full` y `flex-1` fuera, solo servían a pantalla completa).
- `src/layout/advice/AdviceDialog.svelte`: quita `height="fit"`, porque ahora `h-fit` desde sm es lo predeterminado. Sin cambio visual.
- `src/styles/tokens.css`: tokens `--dialog-w-compact` y `--dialog-max-h-compact`.
- `docs/architecture.md`, `docs/design-system.md`: documentan la prop `mobile` y los tokens nuevos.
- `progress/current.md`: plan.

## Tokens

- `--dialog-w-compact: calc(100% - var(--gutter-base) * 2)`: ancho de la tarjeta de cotización en mobile, con el gutter de página (16px) a cada lado.
- `--dialog-max-h-compact: calc(100dvh - var(--gutter-base) * 2)`: tope de alto en mobile (viewport menos 16px arriba y abajo).
- Ninguno eliminado. La variante `sm:h-auto` (alto completo) desaparece porque ya no la usa nadie.

## Responsive y comportamiento (medido en Chrome headless, build de producción)

| Viewport | Caja del diálogo | Notas |
|---|---|---|
| 375×812 | 343×780, a 16px de cada borde | contenido 1912px: scroll interno; sin scroll horizontal |
| 375×600 | 343×568, a 16px de cada borde | scroll interno |
| 768×1024 | 720×976, a 24px de cada borde | contenido 1436px: scroll interno |
| 1024×768 | 976×720 | contenido 934px: scroll interno |
| 1440×1264 | 1024×**942**, centrado (161px arriba y abajo) | alto natural, sin scroll; antes medía 1216 |
| 1440×900 | 1024×852 | contenido 942px: scroll interno con el pie pegado abajo |

- Mobile: tarjeta en lugar de pantalla completa, porque el criterio pide que esté centrada en todos los anchos. Ese tope se alcanza siempre, porque el formulario apilado es más alto que cualquier móvil. El header sigue pegado arriba. El pie no es sticky en mobile (como antes): apilado mide unos 150px y le quitaría demasiado espacio al formulario. Se llega a él con el scroll interno.
- Cambiar de opción (rango ↔ monto máximo) no cambia el alto en ningún ancho: en lg la columna derecha es la más alta, y por debajo de lg el diálogo ya está en su tope. Lo único que cambia el alto es enviar con errores. En 1440×1264 los mensajes suman 78px y la tarjeta se recentra 39px. Es un cambio aislado que llega junto con el foco en el primer campo con error, y no lo animé. El motion existente sigue con `motion-safe:`.
- Comprobado: Esc cierra; un clic en el fondo cierra; `html` queda en `overflow: hidden` con el diálogo abierto; el foco entra en el diálogo. El modal de asesoría no cambia: 375 a pantalla completa, 1440 en 640×839.

## Figma y desviaciones

No consulté el nodo 220:867 porque el MCP no está autenticado y el cambio es de comportamiento. Mantuve la estructura del modal. Única desviación: en mobile el diálogo es una tarjeta (`rounded-2xl`, sombra, 16px de margen) y no ocupa la pantalla completa, para cumplir el criterio de alto según contenido y centrado en todos los anchos.

## init.ps1

VERDE: check:ds, check:arch, astro check y astro build OK.
