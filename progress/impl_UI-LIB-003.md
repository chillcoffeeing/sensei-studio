# impl UI-LIB-003: Consumir la librería en todo el sitio

Figma MCP: no disponible en esta sesión (requiere autorización), igual que en UI-LIB-001/002.
La feature no cambia ninguna medida: es una migración de marcado. La referencia de fidelidad es
el render previo, que ya estaba verificado contra 11:12. La comparación antes/después a
375/768/1440 da **0 píxeles distintos** (ver §4).

## 1. Qué consume cada sitio

| Consumidor | Antes (marcado propio) | Ahora |
|---|---|---|
| `layout/Header.astro` | `<a>` del logo, `<a>` del nav, `<a>` del CTA con píldora y círculo | `LinkLogo` (**nuevo**), `LinkNav`, `LinkCtaBrand` |
| `layout/MobileMenu.svelte` | 2 `<button>` con píldora, `<a>` del logo, enlaces y CTA | `ButtonBrand` ×2 (`bind:ref` para el foco), `LinkLogo`, `LinkMenu`, `LinkCtaBrand` |
| `layout/Footer.astro` | `h2` con una constante `overline`, `<li>` con `<a>`, separador vertical a mano | `HeadingOverline`, `LinkFooter`, `LegalLinks` |
| `modules/faq` | isla propia `FaqAccordion.svelte` (copia de `AccordionCards`) | `AccordionCards` (isla de la librería). **Se borró `FaqAccordion.svelte`** |
| `modules/contact/ContactForm.svelte` | `<label>`, `<input>`, `<p>` de error, `<button>` y `<p>` de estado | `LabelHidden`, `InputGlass`, `FieldError`, `ButtonInk`, `FormStatus` / `FormStatusError` |
| `modules/project-gallery` | card completa (Picture + pill + métricas) y enlace "VER TODOS" | `ProjectCard`, `LinkMore` (`slot="aside"` directo) |
| `modules/testimonials` | `<figure>` de la reseña con avatar y tonos, enlace "Déjanos…" | `ReviewCard` (→ `AvatarInitials`), `LinkMore` |
| `modules/stats`, `services`, `team` | `<p slot="aside" class="max-w-… font-body text-body …"><ToneText/>` | `<div slot="aside" class="max-w-410/401"><SectionDescription/></div>` |
| `modules/hero`, `process`, `showcase` | ya usaban `ToneText` / `ShowcaseCarousel` | sin cambios (sus composiciones son únicas) |
| `modules/logo-marquee` | — | sin cambios (composición única) |
| `layout/FooterWheel.svelte` | ya usaba `ButtonPauseGlass` (UI-LIB-002) | sin cambios |

Patrones revisados que **no** entran en la librería (tabla "Fuera de la librería" de
`docs/components.md`, actualizada): el círculo ink de 24 con + del equipo (distinto del de 32
de `AccordionCards` y único), los paneles ink de proceso y showcase (se ven distintos), el
rótulo de duración del proceso (no es `Eyebrow`: no tiene punto) y el rótulo de 14px de la
card de contacto (único).

## 2. Archivos

Creados:
- `src/shared/ui/LinkLogo.svelte`: patrón nuevo, el logo enlazado que estaba duplicado en el header y en el menú mobile. Tiene 3 props (`href`, `logo: UiIcon`, `label`) más los atributos nativos de `<a>`.
- `tests/ui-consumption.test.ts`: cada consumidor importa y pinta sus componentes, y no queda `<a>`, `<button>`, `<figure>`, `<h2>` ni `<Picture>` propio donde ya hay componente.
- `progress/screens/UI-LIB-003/`: `before-{375,768,1440}.png`, `after-{375,768,1440}.png` y `contact-errors-375.png`.

Modificados:
- `src/layout/Header.astro`: consume `LinkLogo`, `LinkNav` y `LinkCtaBrand`. Se agregó `lg:grid-rows-1` (ver §3).
- `src/layout/MobileMenu.svelte`: consume `ButtonBrand`, `LinkLogo`, `LinkMenu` y `LinkCtaBrand`. Solo conserva el estado, el foco y el diálogo.
- `src/layout/Footer.astro`: consume `HeadingOverline`, `LinkFooter` y `LegalLinks`.
- `src/modules/faq/Section.astro`: consume `AccordionCards` dentro de `<div lang={lang}>` y mapea `question/answer` a `title/body`.
- `src/modules/contact/ContactForm.svelte`: consume los controles de formulario. El error de envío usa `FormStatusError` y el resto de estados `FormStatus`; `data-contact-status` se mantiene.
- `src/modules/project-gallery/Section.astro`: consume `ProjectCard` y `LinkMore`, y solo define `sizes`.
- `src/modules/testimonials/Section.astro`: consume `ReviewCard` y `LinkMore`. Se quitó el mapa de tonos duplicado (`toneClass`) y el cálculo de iniciales: lo hace `ReviewCard`.
- `src/modules/stats/Section.astro`, `services/Section.astro` y `team/Section.astro`: consumen `SectionDescription`.
- `src/shared/ui/LinkFooter.astro`: pasa a `block w-fit` (ver §3).
- `src/shared/ui/LinkCtaBrand.svelte`: la flecha se pinta sin `width`/`height` (ver §3).
- `src/core/site.ts` y `src/content/site.ts`: se quitó `studio.divider`, porque `LegalLinks` trae su propio asset.
- `src/content/ui-catalog.ts` y `src/pages/componentes.astro`: entrada y muestra de `LinkLogo`.
- `src/styles/tokens.css`: se borraron los 8 alias "hasta UI-LIB-003" (`--faq-card-pad-x/y`, `--faq-answer-gap`, `--faq-icon-gap`, `--contact-field-pad-x/y`, `--contact-error-gap`, `--contact-status-gap`), que ya no tienen uso.
- `scripts/check-architecture.mjs`: check nuevo de duplicados de la librería (§5).
- Tests: `faq.test.ts` (lee `AccordionCards` y comprueba que no quedan alias), `contact.test.ts` (controles de la librería, sin `<input>`/`<label>`/`<button>` propios), `project-gallery.test.ts` (la secuencia MOT-PROJECTS se prueba en `ProjectCard.astro` y el módulo solo comprueba el consumo), `site.test.ts` (sin `divider`) y `check-architecture.test.ts` (2 casos del check nuevo).
- Docs: `docs/components.md` (ficha de `LinkLogo`, tabla "Quién consume qué", notas de `LinkFooter` y `LinkCtaBrand`, "Fuera de la librería" al día), `docs/architecture.md` (sección "Consumo de la librería" e islas que componen la librería; el mapa lo regenera `check:arch`), `docs/verification.md` (qué revisa `check:arch`) y `docs/design-system.md` (`pnpm docs:ds`).
- `feature_list.json` (`in_progress`) y `progress/current.md` (plan).

Borrados:
- `src/modules/faq/FaqAccordion.svelte`: era una copia de `AccordionCards`.
- `src/assets/footer/meta-divider.svg`: idéntico byte a byte (`cmp`) a `src/assets/ui/divider-vertical.svg`, el que usa `LegalLinks`.

## 3. Diferencias encontradas en la comparación y cómo se resolvieron

La primera pasada "después" no era idéntica. Las tres causas estaban en la colocación de los
componentes, no en el diseño:

1. **Header 1440, nav 2px más abajo.** `LinkLogo` y `LinkCtaBrand` traen un área táctil de 44
   (el logo antes tenía `lg:h-auto` y el CTA del header no tenía `min-h-44`), y la fila del grid
   pasó a medir 44. Se corrigió con `lg:grid-rows-1`: la fila mide los 40 de `h-40`, los dos
   enlaces quedan centrados y sobresalen 2px arriba y abajo. Ahora el logo, el nav y la píldora
   están en las mismas coordenadas. Lo único que cambia es la caja del `<a>` (área de foco y
   toque, de 26/40 a 44), que es invisible.
2. **Footer 375, cada enlace de columna 1px más alto** (27 → 28, +7px en el footer). Antes la
   fuente `text-title` iba en el `<li>`; con `LinkFooter` el `<li>` conserva la fuente del body
   y su línea añadía 1px. Se corrigió en el componente: `block w-fit` hace que su alto sea su
   propio interlineado.
3. **Flecha del CTA, 20px de antialiasing.** El SVG de Figma mide 11.1404 × 9 y
   `LinkCtaBrand` le ponía `width={11} height={9}` (los enteros del import), así que lo
   deformaba 0.14px. Ahora se pinta sin atributos, como antes en el header y en el menú. El
   círculo de 40 es fijo, así que no hay salto de layout.

## 4. Capturas antes/después (sin regresión)

Proceso: `astro build`, un servidor estático propio en Node (puerto efímero) y Chrome headless
con un perfil temporal y su propio `--remote-debugging-port`. Se termina solo su PID y luego se
borra el perfil. Se emulan `prefers-reduced-motion: reduce` (para quitar el autoplay y el
marquee) y `mobile` en 375. Se recorre la página para disparar los reveals y se captura a
página completa. Las capturas "antes" se hicieron sobre el build previo a tocar el código.

| Ancho | Alto antes → después | Cajas (503 elementos) | Píxeles con Δ > 30 |
|---|---|---|---|
| 375 | 10134 → 10134 | 0 diferencias | 0 |
| 768 | 11977 → 11977 | 0 diferencias | 0 |
| 1440 | 10608 → 10608 | 2: cajas `<a>` de logo y CTA (26/40 → 44, área táctil, §3.1) | 0 |

Con tolerancia 0 aparecen diferencias de 1 a 3 niveles en el blur del masonry, el equipo, el
fondo del contacto y la galería del footer. Es ruido de render: dos capturas del **mismo** build
dan diferencias en las mismas bandas.

Prueba de interacción (375, mismo build y método):
- menú mobile: abre, foco en "Cerrar", 5 enlaces (logo, 3 del nav, CTA), Escape lo cierra y el foco vuelve al botón;
- FAQ: abrir la 2.ª pregunta cierra la 1.ª;
- contacto vacío: `aria-invalid` en nombre y email, `FieldError` con sus mensajes y foco en el primer campo inválido (`contact-errors-375.png`).

## 5. Check de duplicados (`scripts/check-architecture.mjs`)

- Firma: cada `class="…"` de un `.astro`/`.svelte` de `shared/ui` con al menos 4 clases y
  alguna de aspecto (`bg-`, `text-`, `rounded-`, `border`, `shadow-`, `font-`).
- Candidatas: toda cadena entre comillas o backticks de `modules/` y `layout/` (atributos
  `class`, elementos de `class:list` y constantes). En Svelte se ignoran las interpolaciones
  `{…}`.
- Falla si una candidata contiene **todas** las clases de una firma:
  `src/…: replica el marcado de shared/ui/<Componente> (…): usa el componente`.
- `focus-visible:*` no cuenta: el anillo de foco se compone con constantes y, si contara, un
  duplicado que lo partiera en dos cadenas no se detectaría.
- Prueba en una copia temporal con el marcado viejo del nav del header (`class:list` +
  constante de foco) y la card del FAQ: detecta `LinkNav` y `AccordionCards`. Hay 2 casos en
  `tests/check-architecture.test.ts`. En el árbol actual: 0 errores.

## 6. Tokens

No se agregó ningún token. Se borraron los 8 alias de módulo de UI-LIB-001 (§2), que habían
quedado sin uso. Los valores siguen en `--accordion-card-*`, `--field-*` y `--form-status-gap`.

## 7. Responsive inferido

No hay decisiones nuevas: los componentes conservan el comportamiento fluido de cada sección.
Lo único que se movió es la caja del logo y del CTA en lg+ (§3.1).

## 8. Tailwind v4

No se escribió CSS a mano. Los cambios de colocación son utilidades (`lg:grid-rows-1`,
`block w-fit`).

## 9. `./init.ps1`

```
[OK] node v22.20.0 / pnpm v11.1.3 / pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[OK] check:ds   → 413 tokens · 0 ds-allow · 0 error(es)
[OK] check:arch → 113 archivos · 11 módulos · 0 error(es)   (incluye el check de duplicados)
[OK] astro check → 0 errors · 0 warnings
[OK] vitest → 27 archivos, 469 tests
[OK] astro build
VERDE: todo en orden.
```

## 10. Para el orquestador / verifier

- Hay que probar el menú mobile a 375 con un lector de pantalla o el teclado (Tab cíclico dentro del panel). La prueba automática cubrió apertura, foco, Escape y devolución del foco.
- Las capturas están en `progress/screens/UI-LIB-003/` (~15 MB en total, a página completa). Si pesan demasiado para el repo, se pueden recortar o borrar después de la verificación.
