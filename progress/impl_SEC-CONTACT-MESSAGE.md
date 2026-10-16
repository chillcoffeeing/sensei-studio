# impl SEC-CONTACT-MESSAGE · vuelta 1

Contacto: textarea "mensaje" para describir la solicitud. Sin figmaNodes: estilo derivado de
`InputGlass` y tokens existentes.

## Archivos

- `src/shared/ui/TextareaGlass.svelte` (nuevo): hermano multilínea de InputGlass, mismas utilidades + `block`, `resize-y`, `min-h-(--field-textarea-min-h)`; `value`/`ref` bindables + atributos nativos (`Omit<…,'class'|'value'|'children'>`).
- `src/styles/tokens.css`: token `--field-textarea-min-h` (grupo Librería de componentes).
- `src/modules/contact/schema.ts`: `ContactFieldName` + `'message'`; `ContactField.minLength?`; `ContactValidationMessages.tooShort` (con `{min}`); doc del POST.
- `src/modules/contact/form.ts`: `FIELD_ORDER`/`EMPTY_VALUES` con `message`; validación de longitud mínima (sobre el valor recortado) tras `required`; `tooShortMessage()`; `message` recortado en el body del POST.
- `src/modules/contact/ContactForm.svelte`: snippet `message()` (LabelHidden + TextareaGlass + FieldError, `rows={4}`, `minlength` nativo, `aria-invalid`/`aria-describedby`) bajo Email en el grupo gap-12; foco al primer inválido también para el textarea (`messageRef`).
- `src/content/pages/home.ts`: campo `message` (label/placeholder "Cuéntanos qué necesitas", requerido, `minLength: 20`), `required.message`, `tooShort`, comentario del endpoint.
- `src/content/ui-catalog.ts`: entrada TextareaGlass en Formularios + `samples.message`.
- `src/pages/componentes.astro`: import, ejemplo normal y con error, sobre ink.
- `docs/components.md`: sección `### TextareaGlass` + tabla de consumidores.
- `docs/design-system.md`: regenerado (`pnpm docs:ds`).
- `tests/contact.test.ts`: contenido del campo, validación (requerido, tooShort con/ sin espacios, límite exacto), POST con `message`, render del textarea, reveal intacto (3 items).
- `tests/ui-consumption.test.ts`: ContactForm consume TextareaGlass.
- `progress/current.md`: plan.

## Tokens

- `--field-textarea-min-h: calc(4lh + 2 * var(--spacing-12))` — `@derived` (Figma no diseña textarea): 4 líneas de text-body-sm + 12px arriba/abajo (11 de padding + 1 de borde, como InputGlass con border-box). `lh` se resuelve en el textarea (sustitución de var en el elemento que lo usa).
- Resto reutilizado: `rounded-field`, `border-glass-field`, `aria-invalid:border-danger`, `--field-pad-x`, `--field-pad-y`, `text-body-sm`, `placeholder:text-line`, `outline-paper`, `--field-error-gap`.
- CSS a mano: ninguno (solo utilidades Tailwind v4 y el token en `@theme`).

## Responsive inferido

- El textarea es `w-full min-w-0` dentro de la card `max-w-446`: a 375/768 ocupa el ancho disponible de la card, a 1440 los 446 − padding. `resize-y` impide que el usuario lo ensanche y rompa la card; alto mínimo 4 líneas en todos los anchos (no necesita clamp: el tipo y el padding del campo ya son fijos como en InputGlass).
- En 2xl la sección tiene `min-h-622`: el textarea añade altura y la sección crece (min-h, no h), sin desbordar.

## Decisiones

- Etiqueta oculta = placeholder (mismo patrón que los demás campos; evita discrepancia label/visible).
- Longitud mínima en contenido (`minLength: 20`) y mensaje con `{min}` para que no se desincronicen; también `minlength` nativo para el caso sin JS.
- MOT-REVEAL intacto: el textarea vive dentro del item "formulario"; Section.astro no se tocó.

## init.ps1

VERDE: toolchain, install, estado, check:ds (425 tokens, 0 errores), check:arch (0 errores),
astro check (0 errores), vitest 28 archivos / 531 tests, astro build OK. Verificado en
`dist/client/index.html`: `<textarea id="contacto-message" name="message" rows="4" minlength="20" … required>`.
