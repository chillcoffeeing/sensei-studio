# impl EXTRACT-A — Extracción A: duplicación real

Refactor sin cambio visual ni de comportamiento. Sin Figma (no tiene `figmaNodes`).

## Archivos

- `src/modules/project/TextLines.astro` (nuevo): prop `lines`, una `<span class="block">` por línea forzada.
- `src/modules/project/{ContactInvitation,ContactOptions,ContextIntro,NextProjectCard,ProcessIntro,ProjectHero,ProjectResults,ScopeIntro,ScopeValidation,SolutionDecisions,SolutionIdentity,SolutionIntro,SolutionStoreCampaign}.astro` (13): `lines.map(...)` inline pasa a `<TextLines lines={...} />` + import.
- `src/modules/contact/ContactInputField.svelte` (nuevo): antiguo snippet `field()` (LabelHidden + InputGlass + FieldError); props `baseId, name, field, type, autocomplete, error`, `bind:value`, `bind:ref`.
- `src/modules/contact/ContactMessageField.svelte` (nuevo): antiguo snippet `message()` (LabelHidden + TextareaGlass + FieldError); props `baseId, field, error`, `bind:value`, `bind:ref`.
- `src/modules/contact/ContactForm.svelte`: sin snippets; usa los dos campos. Estado, validación, foco al primer inválido y envío siguen en el formulario (los campos no tienen estado propio).
- `feature_list.json`: EXTRACT-A pasa a `in_progress`. `progress/current.md`: plan.

## Ubicación (criterio de acceptance)

- `TextLines`: solo lo usa `modules/project` (el patrón no aparece en otros módulos, comprobado con grep) → queda en el módulo.
- Campos de contacto: solo los usa `modules/contact` → quedan en el módulo. No se tocan `shared/ui`, `docs/components.md` ni `/componentes`.
- Sin variantes ni flags de estilo: `type`/`autocomplete` son atributos nativos que ya variaban entre llamadas del snippet; el textarea es un componente aparte en lugar de un flag.
- No se descarta ningún punto.

## Tokens

Ninguno agregado ni quitado.

## Responsive

Sin cambios: mismo markup y clases.

## Prueba de no-cambio

Build antes/después comparado: `dist/client/proyectos/origen/index.html` y `componentes/index.html` byte a byte idénticos; `index.html` solo cambia en los hashes de los chunks JS de la isla (normalizados, diff vacío). El SSR del formulario es idéntico; aria-invalid/aria-describedby, ids y el foco siguen la misma lógica.

## init.ps1

VERDE: toolchain, dependencias, estado (1 in_progress), sistema de diseño, arquitectura, astro check, astro build.
