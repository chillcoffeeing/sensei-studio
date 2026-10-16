# Verify SEC-CONTACT-MESSAGE — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V2/nota] La feature no tiene `figmaNodes`. Al añadir el textarea (~4 líneas + 24px de padding + 12px de gap) bajo Email, la sección de contacto a 1440px pasa del alto Figma 174:73 (622px). No se rompe nada porque `src/modules/contact/Section.astro:32` usa `2xl:min-h-622` (min-h, no h). Es una desviación deliberada y la pide la feature. Solo hay que tenerla en cuenta en la próxima comparación píxel a píxel de 174:73.
- [V3/entorno] No se pudo hacer la verificación visual con navegador headless. El sandbox de este entorno bloquea las conexiones a localhost: `EACCES` en `::1:4321` (el dev server ya levantado) y en `::1:4399` (el `astro preview` que lancé y paré después con `astro preview stop`). En su lugar se revisaron estáticamente el HTML y el CSS compilados. La captura visual a 375/768/1024/1440 queda pendiente.
- [Copy/nota] No hay `design/copy/*.md` para el campo `message`. El label/placeholder "Cuéntanos qué necesitas", `required.message` y `tooShort` están escritos a mano, pero viven en la capa de contenido (`src/content/pages/home.ts:574-586`) y no en componentes. No es un antipatrón V5. Lo debería confirmar quien lleva el copy.

## Verificado sin hallazgos
- **V1**: lo ejecuté yo mismo y `./init.ps1` termina en VERDE con exit 0 (check:ds, check:arch, astro check, vitest, build).
- **V2**: no hay nodos Figma. TextareaGlass reutiliza los mismos tokens que InputGlass (174:81): `rounded-field`, `border-glass-field`, `px-(--field-pad-x)`, `py-(--field-pad-y)`, `text-body-sm`, `text-paper`, `placeholder:text-line`, `aria-invalid:border-danger` y el foco `outline-paper`. El único token nuevo es `--field-textarea-min-h` (`src/styles/tokens.css:618`), anotado `@derived` con `@usage`. En el CSS compilado sale `min-height:var(--field-textarea-min-h)`. El `lh` se resuelve en el textarea porque es una propiedad personalizada no registrada.
- **V3 (estático)**: el textarea es `block w-full min-w-0 resize-y` dentro de la card `w-full max-w-446`. `resize-y` impide ensancharlo y desbordar la card. No tiene anchos fijos ni valores arbitrarios, así que no hay riesgo de scroll horizontal a 375/768. El área táctil supera los 44px (alto mínimo de 4 líneas + 24px).
- **V4**: la feature no tiene assets.
- **V5**: `grep` en TextareaGlass.svelte, ContactForm.svelte, form.ts y schema.ts: sin `[0-9#]` en clases, sin hex, sin `client:load`, sin `any`, sin `ds-allow`, sin z-index mágico y sin imports entre módulos. Los componentes no llevan copy; los textos llegan por props desde `content`.
- **V6**: tiene `<label>` oculto (`LabelHidden for=contacto-message`), `aria-invalid` y `aria-describedby` → FieldError, `required` y `minlength` nativos para el caso sin JS, y el foco va al primer campo inválido aunque sea el textarea (`messageRef`). El foco es visible. HTML compilado: `<textarea id="contacto-message" name="message" rows="4" minlength="20" placeholder="Cuéntanos qué necesitas" required>`.
- **Validación y envío**: `form.ts` valida `required` y después `minLength` sobre el valor recortado. El mensaje `tooShort` sustituye `{min}`, y `message.trim()` va en el POST JSON. Los tests cubren el campo requerido, el límite exacto, los espacios y el body del POST.
- **Documentación**: `docs/components.md:310` tiene la sección TextareaGlass y la tabla de consumidores está actualizada (l.54). Hay entrada en `ui-catalog` y ejemplos normal y con error en `/componentes`.
- **V7**: los archivos tocados coinceden con lo que piden los criterios de aceptación (shared/ui, tokens, módulo contact, contenido, catálogo, docs y tests). `Section.astro` y MOT-REVEAL no se tocaron.
