# Verify ADV-MODAL — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V6] `src/layout/advice/AdviceStage.svelte:19`: `role="radiogroup"` envuelve radios nativos con el mismo `name`. Es redundante pero válido, y el grupo queda nombrado por el h3 y descrito por "Elige una opción". No hace falta cambiarlo. Como alternativa equivalente se podría usar `<fieldset>` + `<legend>`.
- [Contenido] `src/content/site.ts:40`: `studioEmail = ''`, así que "Escribir por correo" abre `mailto:?subject=…` sin destinatario. `whatsappHref` sigue siendo `https://wa.me/`, sin número. Los dos huecos están documentados como P1 en `design/content-gaps.md` y no son de esta feature.
- [V2] El mensaje de éxito se ve en `text-ink`, igual que "Enviando…". Se podría reforzar con un icono o un tono de éxito, pero es opcional.

## Verificado sin hallazgos
- **V1**: `./init.ps1` en VERDE (exit 0): check:ds, check:arch, astro check y build OK.
- **V2 Estructura**: comparé `get_screenshot` 272:8117 con capturas reales a 1440, 1024, 768 y 375.
  - Coinciden el orden y la jerarquía: cabecera (rótulo SENSEI STUDIO / ASESORÍA, cierre, h2 "¿No sabes por dónde empezar?", entradilla), "¿En qué punto estás?" con 2 tarjetas-radio, "¿Qué te gustaría resolver?" (Opcional, ayuda dentro de la caja), nombre + correo, nota de obligatorios, CTA lima "Solicitar asesoría" y el pie "¿Prefieres conversarlo?" con WhatsApp y "Escribir por correo".
  - Las desviaciones (título fluido, bordes stone-400 por contraste, botón de cierre de 44 y CTA de 50) están justificadas en el informe y no empeoran el resultado.
  - Bloques aislados en `src/layout/advice/*`.
- **V3 Responsive** (Chrome headless por CDP, perfil temporal propio, solo se terminó su PID):
  - **375**: pantalla completa (`h-dvh`), scroll interno de 1029/812 y fila del rótulo y el cierre sticky. Tarjetas, campos y canales apilados. El scroll horizontal del documento y del diálogo es 375/375.
  - **768**: tarjeta de 640×976 centrada, sin scroll interno.
  - **1024×768**: 640×720 con scroll interno (832/720).
  - **1440×900**: 640×852 sin scroll.
  - Sin desborde horizontal en ningún ancho.
  - Áreas táctiles: inputs de 44, canales de 44, cierre de 44×44 y CTA ≥50. Solo miden menos las etiquetas de texto y el label sr-only del textarea, que no son controles.
- **Aperturas**:
  - "Solicitar asesoría" de la barra flotante, en los 4 anchos.
  - "Agenda una reunión" del header a 1024 y 1440.
  - CTA del menú mobile a 375 y 768 (al cerrar, el foco vuelve a "Menú").
  - "Agenda una reunión" de `/proyectos/yupa/` (375).
  - Sin JS todos enlazan a `/#contacto`.
- **Diálogo**:
  - El foco inicial va al botón "Cerrar la solicitud de asesoría".
  - Shift+Tab desde el primero va a "Escribir por correo", y Tab desde el último vuelve al cierre.
  - Esc, el botón de cierre y el backdrop (≥640) cierran, y el foco vuelve al disparador.
  - `html` tiene `overflow: hidden` con el modal abierto y `visible` al cerrar.
- **Radio-cards**: Tab llega al radio, Espacio marca "desde-cero" y ↓ pasa a "proyecto-en-marcha". El foco visible es un outline de 2px sobre la tarjeta (`has-focus-visible`).
- **Validación**:
  - Envío vacío: `aria-invalid="true"` en nombre y correo, con `aria-describedby` hacia "Escribe tu nombre." y "Escribe tu correo.". El foco va al nombre y `role="status"` anuncia el resumen.
  - Correo inválido: el mensaje de formato aparece y recibe el foco.
  - Al corregir, `aria-invalid` desaparece.
- **Estados**:
  - Sin endpoint: aviso honesto de "no disponible" (mismo patrón que la cotización).
  - `?asesoria-simulada=sent`: "Enviando…" con `aria-busy=true` y botón `aria-disabled=true`; después "¡Gracias!…" y el formulario queda vacío (incluido el radio).
  - `=error`: mensaje en `red-700` y se conservan los valores.
- **Enlaces**:
  - WhatsApp: `target=_blank`, `rel="noopener noreferrer"` y aviso sr-only "(se abre en una pestaña nueva)".
  - Correo: `mailto:` con asunto codificado.
- **Una sola instancia**: un `#advice-title` y 2 `<dialog>` en el DOM (cotización y asesoría). Se monta una vez en `BaseLayout.astro:57` con `client:idle`.
- **Cotización**: abre con `data-quote-open` y solo queda abierto `quote-title`. Esc la cierra y no se abre el modal de asesoría. `QuoteDialog` reutiliza el `ModalDialog` común.
- **Motion**: con `prefers-reduced-motion: reduce`, `transition-duration` del diálogo es `0s`.
- **V4 Assets**: los 8 SVG de `src/assets/advice/` existen y se usan en su sitio: cierre, brote/proyecto, radio marcado, flechas, WhatsApp y correo. Las proporciones son correctas en las capturas.
- **V5**: grep sin resultados en `layout/advice` ni en `layout/dialog` para arbitrarios `[0-9#]`, hex, `client:load`, `any`, `ds-allow`, z-index mágico e imports entre módulos.
  - El copy vive en `src/content/site.ts`.
  - `tokens.css` solo agrega `--dialog-w-md` y renombra `--dialog-w-lg` y `--dialog-max-h`. Los tres están en uso (`ModalDialog.svelte:25,103`), no queda ningún `--quote-dialog-*` huérfano y no se redefine ningún nombre de Tailwind.
- **V7 Alcance**: el refactor de `layout/quote` → `layout/dialog` lo pide la acceptance ("reutiliza la infraestructura de QTE-MODAL"). El cambio del CTA del header a asesoría está documentado, como pide la acceptance.

Capturas: scratchpad `vshots/` (`adv-375`, `adv-375-errors`, `adv-768`, `adv-1024`, `adv-1024-sent`, `adv-1024-error`, `adv-1440`, `adv-1440-errors`, `adv-1440-rm`).
