# Verify HOME-NO-STOCK — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V7] `design/content-gaps.md:15`: la definición de P2 aún dice "(fotos de stock, huecos de equipo, textos por confirmar)". Ya no hay fotos de stock: cambiar el ejemplo (p. ej. "huecos de equipo, avatares sin foto, textos por confirmar"). Solo texto de documentación.
- [V4] `src/assets/brand/sensei-logo.svg` sigue sin uso y lo emite el glob de `media.ts` a `dist/_astro` (arrastrado desde verify_CM-CORE, no es de esta feature). Se puede borrar cuando toque.

## Verificado sin hallazgos
- **V1**: `./init.ps1` en VERDE (toolchain, estado, check:ds, check:arch, astro check, build), ejecutado por el verifier.
- **Sin Unsplash ni relleno (grep)**: 0 apariciones de `unsplash|imgix|picsum|pexels|remote-image|isUnsplash` en `src/`, `scripts/`, `astro.config.mjs` y `docs/`. Los únicos "credits" que quedan son `footer.studio.credits` (Copyright/Powered by/License/Style Guide), no créditos de fotos.
- **Sin Unsplash (build)**: `dist/client` sin ninguna coincidencia de esos dominios; ningún `src`/`srcset` externo en los 8 HTML (los únicos `https://` son fuentes de Google, wa.me, canonical y los enlaces legales `example.com` ya existentes). Todas las imágenes salen de `/_astro/` con base en `src/assets/projects/*`, `src/assets/portfolio/*`, `team/natalia-reina.jpg`, iconos y logos.
- **Borrados**: no existen `src/content/unsplash.ts`, `unsplash-photos.json`, `src/shared/lib/remote-image.ts`, `src/modules/credits/`, `creditos.json` ni `scripts/unsplash-curate.mjs`; no hay `dist/client/creditos/` ni `/creditos/` en `sitemap.xml`; `astro.config.mjs` sin `image.domains/remotePatterns`. `media.ts` y `Photo.astro` solo resuelven clave local o URL simple.
- **Galerías con piezas reales**: servicios (12 recortes 374×636 revisados uno a uno en una hoja de contacto: florista de Las Doñas, Qfud, Pictdare, Just Make It Fun, pedido de Yupa, Las Doñas en portátil, confirmación de Remittven, Referi, Soldee, catálogo de Yupa, backoffice y portal de Cappi), showcase (Yupa, Qfud, Remittven, Referi, florista, Pictdare, Remittven portátil), contacto (web de Remittven en portátil) y rueda del pie (Yupa, Las Doñas, Cappi, Remittven, Soldee, collage de Remittven). El encuadre con `position` (`left`/`right`/`top`) conserva logotipo o primera pantalla; ninguna pieza queda cortada de forma ilegible. Recorte en servidor (sharp `position`) + clase `object-*` completa (no interpolada).
- **Avatares/retratos de relleno**: los 4 avatares de `trust.avatars` son `{}` → `UserPlaceholder` (silueta neutral-400 sobre neutral-200, decorativa `aria-hidden`); los 3 huecos del equipo también. `UserPlaceholder` vive en `src/shared/ui/`, usa utilidades por defecto de Tailwind, sin tokens nuevos. Documentado en `docs/components.md` y catálogo.
- **/links**: solo logo, wordmark, `header-atmosphere.png` (textura exportada de Figma 230:979, LINKS-PAGE) y la portada de Yupa; nada de stock.
- **Orden de /proyectos/**: `proyectos.json` fija `["yupa","remittven","las-donas","cappi-xtremo"]`; el HTML construido de `/proyectos/` y de la home enlazan en ese mismo orden.
- **Medias apaisadas en mobile**: `project-solution/Section.astro:21-31,69-95` usa la proporción propia (`h-auto` + alto del respaldo) para `contain` más anchas que 4:3 por debajo de sm, y `sm:aspect-44/21` / `sm:aspect-4/3` desde sm. Captura de Cappi a 375: las cuatro capturas (~2.1:1) ocupan el ancho completo y se leen; a 768 vuelven a la caja 44:21.
- **Logo de Claude**: `ScopeTool.astro:26` `h-8 w-auto max-w-24 object-contain object-left`. Captura de Cappi a 768: Figma, Notion, Claude y GitHub con la misma altura óptica.
- **V2 Estructura**: mismo orden de secciones y bloques en home, casos y /links; las únicas desviaciones (silueta en los 3 huecos del equipo, retirada de "Photo Credits") están justificadas en el informe y no cambian la composición.
- **V3 Responsive**: capturas con headless shell (perfil temporal propio, reduced motion) del build servido en local: home a 375, 768, 1024 y 1440; Cappi a 375 y 768; /proyectos/ a 1440; /links a 375. Sin desbordes horizontales ni roturas. (Algunas imágenes `loading="lazy"` no llegaron a pintarse en la captura de 12000 px, p. ej. la card de Cappi en la home: los archivos existen y se sirven con 200; es un artefacto de la captura.)
- **V5–V7**: sin `[..]` arbitrarios con número/hex en clases, sin hex en `.astro`/`.svelte`, sin `any`, sin `ds-allow`, sin `--*: initial` en `tokens.css`. Los `client:load` existentes (FloatingBar, Header) son anteriores a esta feature. `docs/`, `design/placeholders.md` y `design/content-gaps.md` coherentes (salvo el menor de arriba).
