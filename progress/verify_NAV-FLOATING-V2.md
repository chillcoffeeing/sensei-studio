# Verify NAV-FLOATING-V2 — vuelta 1
Resultado: VERDE

Método: `./init.ps1` + Chrome headless por CDP (perfil temporal, cerrado por PID) contra el build
servido (`node dist/server/entry.mjs`, 127.0.0.1:4518), en 375×812, 768×1024, 1024×900 y 1440×900, sobre
`/`, `/proyectos/`, `/proyectos/yupa/` y `/links`. Capturas en el scratchpad de la sesión (`v/*.jpg`).

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V6] Safe-area: `--floating-bar-bottom` suma `env(safe-area-inset-bottom, 0px)` (src/styles/tokens.css:285), pero sin
  `viewport-fit=cover` vale 0. Es correcto hoy (sin `cover` iOS no dibuja bajo el indicador de inicio) y el token queda
  listo; si algún día se activa `viewport-fit=cover`, no hace falta tocar la barra. Solo anotado.
- [V3] CLS 0.010 en la primera carga de `/` a 375 (resto de páginas y anchos: 0). La barra no es la causa: siempre es
  `fixed` y solo anima `translate`/`opacity`. Muy por debajo de 0.1; probablemente carga de fuente/imagen del hero.
- [V2] `/proyectos/` en 375–1024: la página es corta y el footer entra pronto en la franja inferior, así que la barra se
  oculta a mitad de scroll. Es el comportamiento pedido (no tapar el footer), no un defecto.
- WhatsApp sigue con `https://wa.me/` sin número (pendiente heredado, `src/content/site.ts`).

## Verificado sin hallazgos
- **V1**: `./init.ps1` VERDE (check:ds, check:arch, astro check, build), exit 0.
- **Posición**: `position: fixed`, `bottom: 16px`, `z-index: 30`, centrada (margen izq. = der.: 63/63 a 375, 184/184 a
  768, 312/312 a 1024, 520/520 a 1440) en `/`, `/proyectos/` y `/proyectos/yupa/`. `/links` no la lleva por decisión
  documentada de LINKS-PAGE (`StandaloneLayout.astro:9-11`, `docs/architecture.md`): ya tiene su propio "Cotizar" y WhatsApp.
- **Responsive**: `scrollWidth == innerWidth` en los 4 anchos. Barra de 248×58 a 375 ("Cotizar" / "Asesoría" / WhatsApp)
  y de 401×62 desde 768 con el texto completo. Las tres acciones miden 44px de alto (WhatsApp 44×44).
- **No tapa contenido crítico**: con `#contacto` (formulario del home y CTA final del caso) o el `footer` en el 25 %
  inferior del viewport (probado con la zona al 95 %, 80 %, 50 % y 0 % del alto), la barra queda en `opacity 0`,
  `inert` y `pointer-events: none`. Barrido de toda la página cada 1/3 de viewport: ningún input, textarea, botón de
  formulario, enlace del footer ni enlace del CTA final queda bajo la barra visible (0 solapes en las 12 combinaciones).
  Al final de cada página: oculta e inert. A mitad del home/caso: visible.
- **Cotizar proyecto**: `data-quote-open`; clic en `/proyectos/yupa/` abre el `<dialog>` (open = true, sin navegar).
  Sin JS, `href="/#contacto"`.
- **Solicitar asesoría**: `<a href="/#contacto" data-advice-open>`; enganche documentado en `docs/architecture.md`
  (sección "Barra flotante"), `src/core/site.ts:109` y `src/content/site.ts:64`.
- **WhatsApp**: `target="_blank"`, `rel="noopener noreferrer"`, `aria-label="WhatsApp (se abre en una pestaña nueva)"`,
  icono `aria-hidden`.
- **Contraste**: las acciones son opacas: ink #090909 sobre lima rgb(228,255,64) (~18:1), ink sobre blanco (~19.6:1),
  blanco sobre ink (~19.6:1). El glass (`paper/60` + blur 12 + saturate 1.5) no interviene en el contraste del texto.
- **Accesibilidad**: `aside` con `aria-label="Contacto rápido"`; nombre accesible completo con texto corto `aria-hidden`
  y completo `max-sm:sr-only` (WCAG 2.5.3); oculta queda `inert`; foco `focus-visible:` outline ink + ring paper.
- **Reduced motion**: con `prefers-reduced-motion: reduce` la barra tiene `transition-property: none` y los enlaces
  `transition-duration: 0s`; el hover solo con `motion-safe` + `can-hover`.
- **Entrada / sin JS**: estados ocultos solo bajo `scripting:`; con JS entra por rAF animando transform + opacity.
- **V2 estructura**: píldora glass con lima / paper / círculo ink, mismo orden que Figma 218:21. Desviaciones (alto 44,
  padding compacto, texto corto en mobile, icono en el círculo, glass /60) justificadas en el informe y mejoran
  tacto/legibilidad.
- **V4**: `src/assets/floating-bar/whatsapp.svg` existe y se usa como máscara 20×20 (proporción 1:1).
- **V5**: sin arbitrarios `[..]`, hex, `any`, `ds-allow` ni imports entre módulos en los archivos tocados; copy en
  `src/content/site.ts`; `client:load` justificado (visible desde el primer frame); z-index por token
  (`--z-index-floating-bar`). Restos borrados: sin referencias a `data-page-hero`, `floating-bar-room/top/rise`,
  `floating-bar-anchored/trigger` ni `FloatingQuoteLink`.
- **V7**: alcance limitado a la barra, sus zonas protegidas (atributo en contact, project-contact y footer), tokens y docs.
