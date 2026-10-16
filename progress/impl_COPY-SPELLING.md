# impl COPY-SPELLING — Repaso global de ortografía

Primera vuelta. Sin Figma (no aplica). Solo correcciones ortográficas y tipográficas; ninguna reescritura.

## Alcance revisado

- `src/content/data/pages/home.json`, `proyectos.json`, `src/content/data/projects/*.json` (4 casos):
  seo, headings, cuerpo, alt, aria/labels de carruseles, mensajes de formulario.
- `src/content/site.ts`, `links.ts`, `case-study.ts`, `seo.ts`, `pages.ts`, `projects.ts`, `ui-catalog.ts`.
- Componentes `.astro`/`.svelte` de `src/`: no contienen microcopy visible propio (todo viene de `src/content/`).
- `public/site.webmanifest`: sin texto en español que corregir.
- `design/copy/*.md` (faq, process, services, testimonials).

## Correcciones aplicadas (archivo:línea · antes → después)

- `src/content/data/pages/home.json:438` · "diseño de Apps." → "diseño de apps." (mayúscula indebida, cita de Jonatan P.)
- `src/content/data/pages/home.json:467` · "Diseñadora Ux/Ui con…" → "Diseñadora UX/UI con…" (sigla, rol de Edgar)
- `src/content/data/pages/home.json:518` · "increíblecon IA" → "increíble con IA" (cita de Mateo R.)
- `src/content/data/pages/home.json:518` · "Su enfoque  para" → "Su enfoque para" (espacio doble, cita de Mateo R.)
- `src/content/data/pages/home.json:528` · "nos ayudo en todo" → "nos ayudó en todo" (cita de Sofía L.)
- `src/content/data/pages/home.json:772` · "transferencias bancarias EEUU, Canadá." → "transferencias bancarias EE. UU., Canadá." (abreviatura RAE)
- `src/content/data/projects/remittven.json:37` · "Seguro y rápido" → "Seguro y rápido." (punto final, como la línea anterior del claim y los demás casos)
- `src/content/data/projects/yupa.json:47` · "Diseño UX/UI y desarrollo de App" → "Diseño UX/UI y desarrollo de app" (mayúscula indebida; el mismo caso escribe "desarrollo de app" en l. 10 y 113)
- `src/content/data/projects/yupa.json:83` · "2,100px" → "2100px" (separador de miles en formato inglés; junto a "1,4%" se leía como 2,1 px)
- `src/content/site.ts:353` · "Políticas de Privacidad" → "Políticas de privacidad" (mayúscula indebida; par de "Términos y condiciones")

Mismo texto en `design/copy/`:
- `design/copy/testimonials.md:21` · "diseño de Apps." → "diseño de apps."
- `design/copy/testimonials.md:27` · "Ux/Ui" → "UX/UI"
- `design/copy/testimonials.md:37` · "increíblecon IA" → "increíble con IA"; "enfoque  para" → "enfoque para"
- `design/copy/testimonials.md:39` · "nos ayudo" → "nos ayudó"
- `design/copy/faq.md:65` · "EEUU" → "EE. UU."

Notas de documentación actualizadas (no es copy publicado):
- `design/copy/testimonials.md:42,44` · #18 y #20 marcados como resueltos.
- `design/copy/faq.md:20` · "EEUU" sale de la lista de "se mantienen tal cual".
- `design/content-gaps.md:116` (EEUU corregido) y `:164` ("Seguro y rápido." resuelto).
- `progress/current.md` · plan de la feature.

## Dudas no aplicadas

Citas de clientes (gramática o estilo, no ortografía; o cambio de palabra):
- `home.json:483` Pedro Avaria: "Muy buen diseñado UX" (probablemente "diseño"; cambia la palabra).
- `home.json:498` Javier Oberto: "100 confiables" (¿"100 % confiables"?; añadir el signo es suponer).
- `home.json:453` Rafael H.: "el diseño de app móviles" (concordancia, no ortografía).
- `home.json:478` María Andrea Reina: "Sensei Studio es organizado, escuchan…" (concordancia, estilo del cliente).

Nombres propios, marcas y títulos de proyecto (no se tocan):
- `home.json:492` "Wordpress y elementor" (las marcas se escriben WordPress y Elementor).
- `home.json:772` "Wetransfer" (marca WeTransfer; además ya figura en content-gaps como dudoso como método de pago).
- `home.json:471,476,491` "Joaquin", "Maria Andrea", "Ramirez" sin tilde: nombres de personas.
- Roles de las reseñas en Title Case ("Diseño Integral de Imagen: App, Web y Logo…", "Diseño de Gráfico de Sitio Web", etc.): son títulos de proyecto tal como vienen del cliente; se corrigió solo la sigla "Ux/Ui".
- `las-donas.json:30` alt cita la UI literal «Bienvenido a las Doñas» (minúscula de la marca en la propia interfaz).

Normas discutibles o de estilo de la casa:
- Prefijo *pos-*: "post-compra" (`home.json:233`), "post-lanzamiento" (`:295`), "post entrega" (`:776`); la RAE prefiere "poscompra", "poslanzamiento", "posentrega". Cambia la forma de la palabra.
- `home.json:760` "Porque lo que no se mide, no se puede mejorar." (coma entre sujeto y verbo; es la forma habitual del refrán).
- Porcentajes sin espacio en métricas ("97%", "−80%", "100% online") frente a "100 %" en el FAQ; la RAE pide espacio, pero en las métricas es un formato de cifra destacada coherente en todo el sitio.
- Mayúsculas de servicio "Email Marketing", "Desarrollo Web" (`home.json:32,34`): nombres de servicio en el hero, coherentes con los títulos de la sección de servicios.
- Inglés intencional: "Trusted by / clients worldwide", "By contacting us…", "Privacy Policy", "(opens in a new tab)", "Copyright / Powered by By Sensei Studio": no es ortografía.
- `las-donas.json:63` título incompleto "Más regalos que llegan a": ya es PUNTO A CONFIRMAR en content-gaps; completarlo sería redactar.

## Tokens

Ninguno agregado ni eliminado.

## Responsive

No aplica (solo texto).

## SEO

Ningún title/description se modificó. Longitudes actuales: home 58/134, proyectos 25/138,
casos (description) 156, 141, 148, 138: todos dentro de ≤ 60 / ≤ 160.

## init.ps1

VERDE: toolchain, dependencias, estado (1 in_progress), sistema de diseño, arquitectura,
astro check y astro build en OK.

## Vuelta 2

Corrige los hallazgos de `progress/verify_COPY-SPELLING.md`. Solo se tocaron signos y mayúsculas; no se reescribió nada.

Archivos modificados:
- `src/content/data/pages/home.json:751` (mayor): FAQ 10 `¿Tengo una idea, pueden…?` → `Tengo una idea, ¿pueden…?`
- `design/copy/faq.md:49`: el mismo cambio en el encabezado `## 10.`
- `src/content/data/pages/home.json:457` (menor): rol de Elliot `…para una App` → `…para una app` (mayúscula indebida, igual que en las correcciones de la vuelta 1)
- `design/copy/testimonials.md:25`: el mismo cambio, fila 6 (Elliot)

Comprobaciones: cada sustitución se aplicó una sola vez (grep). Los tres archivos siguen en CRLF homogéneo (todas sus líneas terminan en `\r`).

Tokens: ninguno. Responsive: no aplica.

### init.ps1 (vuelta 2)

VERDE: toolchain, dependencias, estado, sistema de diseño, arquitectura, astro check y astro build en OK.
