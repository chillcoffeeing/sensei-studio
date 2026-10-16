# impl_SEC-CONTACT — Contacto: card glass con formulario

## Fuente de diseño

El MCP de Figma **no está disponible** en esta sesión (no hay herramienta `get_design_context` que se pueda cargar).
Se usó la exportación local: `design/figma/homepage.0.txt` (líneas 809–860; el nodo 174:73 está completo:
174:74 velo, 174:75 card, 174:76–174:89) y un recorte de `design/figma/homepage-full.png` para medir lo que el
código no da (alto de la card ≈ 388 y hueco inferior ≈ 67). Conviene revalidar con el MCP cuando esté disponible.

## Archivos

- `src/modules/contact/schema.ts`: nuevo. `ContactContent`, `ContactField`, mensajes y `ContactSection`.
- `src/modules/contact/form.ts`: nuevo. Lógica pura: validación, ids ARIA y `submitContact` (el handler pendiente).
- `src/modules/contact/ContactForm.svelte`: nuevo. Isla con campos, errores, botón y región `role="status"`.
- `src/modules/contact/Section.astro`: nuevo. Fondo `<Image>`, velo, card glass, cabecera y legal.
- `src/modules/contact/index.ts`: nuevo. API pública del módulo.
- `src/assets/contact/contact-background.jpg`: nuevo. Copia de `design/figma/assets/imgContactSection.png`
  (el archivo es un JPEG de 4096×2731 aunque se llamaba .png; se renombra con su extensión real).
- `src/app/sections.ts`, `src/app/registry.ts`: `ContactSection` entra en la unión y `contact` en el registry.
- `src/content/pages/home.ts`: sección `contacto` (la última, después del FAQ) con el copy de Figma y los mensajes.
- `src/styles/tokens.css`: tokens nuevos (ver abajo). `docs/design-system.md` regenerado con `docs:ds`, y mapa de
  módulos de `docs/architecture.md` regenerado con `check:arch`.
- `tests/contact.test.ts`: nuevo. 21 tests de contenido, ancla, validación, envío y render/ARIA.
- `feature_list.json` (`in_progress`) y `progress/current.md` (plan).

No hay dependencias nuevas.

## Tokens agregados

| Token | Valor | Origen |
|---|---|---|
| `--color-danger` | `#FFB4AB` | @derived: Figma no diseña errores. Contraste sobre el glass compuesto: ≈ 7.5:1 típico y ≥ 5.5:1 en el peor caso |
| `--contact-offset-top` | `clamp(64px, 37.239px + 7.1362vw, 140px)` | @figma FAQ → 174:73 = 143, normalizado a 140 como los demás cortes · mínimo @derived |
| `--contact-pad-top` | `clamp(64px, 27.7324px + 9.6714vw, 167px)` | @figma 174:75 top 167 · mínimo @derived |
| `--contact-pad-bottom` | `64px` | @derived (en Figma ≈ 67; en 2xl manda `min-h-622`) |
| `--contact-card-pad` | `calc(clamp(24px, 19.7746px + 1.1268vw, 36px) - var(--spacing-px))` | @figma 174:75 padding 36 con trazo interior de 1px · mínimo @derived |
| `--contact-field-pad-x` | `calc(var(--spacing-16) - var(--spacing-px))` | @figma 174:81 px 16 con trazo interior |
| `--contact-field-pad-y` | `calc(var(--spacing-12) - var(--spacing-px))` | @figma 174:81 py 12 con trazo interior |
| `--contact-error-gap` | `var(--spacing-5)` | @derived |
| `--contact-status-gap` | `var(--spacing-12)` | @derived (= gap de 174:79) |

Se reutilizan tokens que ya existían (DS-001): `color-glass`, `color-glass-line`, `color-glass-field`, `color-scrim`,
`color-line`, `radius-glass`, `radius-field`, `blur-glass`, `text-title-xl`, `text-label-sm`, `text-button`,
`text-body-sm`, `text-legal`, `text-caption`, `spacing-446` y `spacing-622`.

**Trazo interior.** En Figma el borde de 1px no suma al tamaño; en CSS sí. Por eso los paddings de la card y de los
campos restan 1px, y así la card mide 388 y los campos 42, como en Figma. Con 36/12 sin restar salían 394 y 44.

## Decisiones

- **Ancla.** `id: 'contacto'` da `/#contacto`, el destino del nav "Cotización", del CTA "Agenda una reunión" y del CTA
  de testimonios. Lo comprueba un test.
- **Envío sin backend.** No se inventa ninguno. `submitContact(values, endpoint)` funciona así:
  - Sin `endpoint`, devuelve `'unavailable'` sin tocar la red. La isla lo dice claramente ("El envío del
    formulario aún no está disponible: tus datos no se han enviado.") y no borra los datos.
  - Con `endpoint`, hace un POST JSON `{ name, company, email }` y muestra `sent` o `error`.

  En `home.ts` queda `endpoint: undefined`, marcado como PUNTO A CONFIRMAR. El adaptador node ya está instalado
  por si el endpoint se aloja en el propio sitio.
- **Sin JS.** El botón está `disabled` hasta que la isla hidrata, porque no hay a dónde enviar. `novalidate` se
  aplica solo con JS; sin él valida el navegador (`required`, `type=email`).
- **Validación.**
  - Nombre y Email son obligatorios, y el Email debe tener la forma `algo@algo.algo`. Empresa es opcional porque
    Figma no marca campos obligatorios.
  - Los errores aparecen tras el primer intento y desde ahí se recalculan al escribir. El foco va al primer campo inválido.
  - Cada campo inválido lleva `aria-invalid` y `aria-describedby` apuntando a `<p id="…-error">`, y su borde pasa a
    `border-danger`.
- **Labels.** Figma solo dibuja el texto dentro del campo. Ese texto se usa como `placeholder` y como `<label>`
  `sr-only`, que da un nombre accesible estable. Los campos llevan además `autocomplete` (name, organization y
  email) y el de email `inputmode=email`.
- **Cabecera.** `headingEyebrow` es "Contacto" (p, 14/500, `text-line`) y `h2` es "Let's talk." (44/700, -1px).
  No usa `SectionHeader` porque la composición es distinta (va dentro de la card).
- **Idioma.** El título y el legal están en inglés en Figma (INVENTORY §3.1). Se marcan con `lang="en"`, igual que el FAQ.
- **Legal.** Los enlaces abren pestaña nueva, como en Figma, con `rel="noopener noreferrer"` y un aviso `sr-only`
  "(opens in a new tab)" que viene del contenido.
- **Fondo.**
  - `<Image>` de astro:assets con `widths` de 640 a 2880, `sizes="100vw"`, carga lazy y `alt=""`, dentro de una capa
    `aria-hidden`.
  - Va con `opacity-30` sobre `bg-ink` y el velo `bg-scrim` de 174:74.
  - El original pesa 5.4 MB; las variantes webp pesan entre 22 y 405 kB.
- **Apilado.** No se usa z-index porque el namespace está cerrado. La capa de fondo es `absolute` y el contenido
  `relative`, que se pinta encima por orden en el DOM.
- **Gutter.** La card se alinea con `container-page`, en x 60 a 1440. En Figma está a 58 del canvas (sección en −1
  y card en 59): se normaliza a 60, igual que en el resto de las secciones.

## Responsive inferido

- Mobile first: la card es `w-full max-w-446`, así que a 375 ocupa el ancho del contenedor (343).
- Nombre y Empresa siguen en fila incluso a 375: cada campo mide 141.5 y el placeholder cabe.
- Entre 375 y 1440 todo escala con clamp: el título pasa de 32 a 44 (`text-title-xl`), el padding de la card de 24 a 36 y el
  espacio superior de 64 a 167.
- En 2xl la sección tiene `min-h-622`, el alto de Figma.

## Responsive medido (Chrome headless sobre `dist/client`)

| Ancho | Sección | Hueco desde FAQ | Card (x · ancho · alto) | Top / bottom de la card | Padding | h2 | Campos (ancho; alto) |
|---|---|---|---|---|---|---|---|
| 1440 | 622 | 140 | 60 · 446 · 388 | 167 / 67 | 35 + 1 | 44 | 181 ×2 · 374 (42) |
| 1280 | 597 | 129 | 40 · 446 · 381 | 152 / 64 | 33.2 + 1 | 42.2 | 182.8 ×2 · 377.6 (42) |
| 1024 | 562 | 110 | 40 · 446 · 372 | 127 / 64 | 30.3 + 1 | 39.3 | 185.7 ×2 · 383.4 (42) |
| 768 | 528 | 92 | 32 · 446 · 362 | 102 / 64 | 27.4 + 1 | 36.4 | 188.6 ×2 · 389.2 (42) |
| 375 | 492 | 64 | 16 · 343 · 364 | 64 / 64 | 23 + 1 | 32 | 141.5 ×2 · 295 (42) |

No hay scroll horizontal en ningún ancho (scrollWidth = viewport). El botón mide 46 de alto.

**Interacción comprobada en el navegador:**
- Con el formulario vacío, el envío lleva el foco a Nombre, que queda con `aria-invalid="true"` y
  `aria-describedby="contacto-name-error"`. Se muestran "Escribe tu nombre." y "Escribe tu email.", y Empresa no
  marca error.
- Con Nombre y Email válidos desaparecen los errores y la región `role="status"` anuncia el aviso `unavailable`.
  La URL no cambia: no hubo GET ni POST.

## Puntos a confirmar

1. **Backend del formulario.** Hay que decidir a dónde se envía (endpoint propio con el adaptador node, un servicio de
   formularios, un CRM…). Luego basta con poner `endpoint` en `home.ts`, o ajustar `submitContact` si el servicio
   pide otro formato. Mientras tanto, el formulario avisa de que no envía.
2. **Enlaces legales.** Terms y Privacy apuntan a `https://example.com/…`, los placeholders de Figma, porque no existen
   páginas legales.
3. **Idioma.** "Let's talk." y el legal están en inglés y el resto en español. Si se traducen, hay que quitar `lang` del contenido.
4. **Empresa obligatoria o no.** Hoy es opcional; se cambia con `required: true` en el contenido.
5. **Mensajes de validación y de estado.** Los redacté yo porque Figma no los tiene; conviene revisarlos con copy.
6. **Color de error.** `--color-danger` (#FFB4AB) es @derived; debe validarlo diseño.

## init.ps1

```
[OK] toolchain · pnpm install · estado (1 in_progress)
check:ds → 337 tokens · 0 ds-allow · 0 error(es)   (docs:ds regenerado)
check:arch → 61 archivos · 11 módulos · 0 error(es)
astro check → 0 errors
vitest → 17 files, 153 tests passed
astro build → OK
VERDE: todo en orden.
```
