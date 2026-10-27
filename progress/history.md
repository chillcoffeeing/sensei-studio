# Historial de sesiones (append-only)

> El líder añade un bloque por sesión cerrada. Nunca se editan bloques previos.

## 2026-08-21 — ICONS-001: phosphoricons (light) integration

**Feature**: Añadir phosphoricons (versión light) e integrar en componentes de equipo

**Cambios**:
- Añadida dependencia `@phosphor-icons/react@^2.1.10` en `package.json`
- Creado `src/components/cards/ToolCard.tsx` (React) que recibe icono phosphoricons como componente y usa `weight="light"` por defecto
- Actualizado `src/components/cards/ProfessionalCard.astro` para importar 10 iconos phosphoricons directamente y pasarlos a ToolCard con `client:load`
- Actualizado `src/data/content.ts` con `TEAM` (4 miembros, cada uno con 3 herramientas con iconos) y `TEAM_TILES` derivado
- Actualizado `src/homepage/sections/Team.astro` para usar `ProfessionalCard` con datos de `TEAM`

**Iconos usados (versión Light via prop `weight="light"`)**:
Code, Palette, Monitor, Cube, PenNib, Browser, DeviceMobile, PaintBrush, Layout, FigmaLogo

**Verificación**:
- `pnpm test`: 32/32 tests passing (28 nuevos + 4 previos)
- `pnpm build`: Build exitoso, prerendering estático OK
- `./init.ps1`: VERDE completo

**Decisión clave**: Sin componente centralizado de iconos — importación directa desde `@phosphor-icons/react` donde se usan (cumple requisito del usuario).

## 2026-08-21 — STYLES-001: Refactor estilos completo

**Feature**: Fuentes Google Sans + DM Sans, container utility, Tailwind v4 standards, simplificar DOM (sin animaciones), deshabilitar tests de implementación

**Cambios**:

### Fuentes
- `src/styles/global.css`: `@import` Google Sans (400-700) + DM Sans existente
- `@theme`: `--font-sans` = DM Sans (párrafos), `--font-heading` = Google Sans (h1-h6)
- Regla base `h1-h6 { font-family: var(--font-heading); font-weight: 600 }`

### Container Utility (Tailwind v4 `@utility`)
- `container`: max-width 1440px, padding responsive (px-6 / lg:px-[60px]), centrado auto
- `container-lg`: misma estructura, para uso en Footer y secciones amplias
- `Container.astro` refactorizado con prop `size?: 'default' | 'lg'`

### Convenciones Tailwind v4 (docs/conventions.md)
- Sección nueva con 7 estándares: `@theme`, `@utility`, `@variant`, no `@apply`, fuentes en `@theme`, etc.

### Simplificación DOM (animaciones eliminadas)
| Componente | Quitado |
|------------|---------|
| `AnimatedSection.tsx` | **Archivo eliminado** |
| Hero, Projects, WhyUs, HowWeWork, Services, Showcase, Reviews, Team | Todos los `AnimatedSection`, `client:load`, `client:visible`, `delay` |
| `ServicesAccordion.tsx`, `FaqAccordion.tsx` | `motion`, `AnimatePresence`, `useReducedMotion` → CSS nativo (`transition-transform`, `rotate-45`) |
| `VideoBackground` | `client:load` removido |

### Tests
- `tests/icons.test.tsx` → `icons.test.tsx.disabled` (deshabilitado)
- Mantenido: `tests/content.test.ts` (4 tests de contrato de datos)

**Verificación**:
- `pnpm test`: 4/4 tests passing (solo content.test.ts)
- `pnpm build`: Build exitoso en ~6s
- `./init.ps1`: VERDE completo

**Decisiones clave**:
1. Google Fonts via `@import` (cero mantenimiento, cache global)
2. Dos utilities `container` / `container-lg` explícitas
3. Accordions con CSS nativo (reduce bundle ~40KB, respeta `prefers-reduced-motion`)
4. Tests de implementación deshabilitados (testean render, no contratos)

## 2026-08-24 — STYLES-002: Estandarizar medidas con tokens semánticos Tailwind v4

**Feature**: Definir 27 tokens semánticos en `@theme inline` y refactorizar 14 componentes para usar utilidades generadas (`w-sidebar`, `max-w-content`, `rounded-card`, `text-display-xl`, `min-h-faq`, etc.) en lugar de valores `px` en bruto.

**Cambios**:

### Tokens semánticos en `global.css` (`@theme inline`)
- **Widths**: `--width-sidebar` (410px), `--width-card` (260px), `--width-sidebar-sm` (360px)
- **Max-widths**: `--max-w-content` (590px), `--max-w-wide` (700px), `--max-w-wider` (780px), `--max-w-widest` (790px), `--max-w-cta` (760px), `--max-w-hero` (560px), `--max-w-showcase` (1200px), `--max-w-review` (310px), `--max-w-footer` (320px), `--max-w-faq` (360px), `--max-w-cta-btn` (420px)
- **Min-heights**: `--min-h-faq` (620px), `--min-h-faq-md` (760px), `--min-h-howwework` (638px), `--min-h-showcase` (760px), `--min-h-hero` (680px)
- **Typography**: `--text-display-xl` (100px), `--text-display-2xl` (160px)
- **Radius**: `--radius-card` (10px), `--radius-card-sm` (6px)
- **Misc**: `--h-lime-rule` (9px)

### Componentes refactorizados (14 archivos)
| Archivo | Antes | Después |
|---------|-------|---------|
| `Services.astro` | `w-[410px]`, `max-w-[590px]` | `w-sidebar`, `max-w-content` |
| `index.astro` | `min-h-[620px]`, `min-h-[760px]` | `min-h-faq`, `min-h-faq-md` |
| `WhyUs.astro` | `max-w-[700px]` | `max-w-wide` |
| `Footer.astro` | `max-w-[320px]` | `max-w-footer` |
| `Team.astro` | `w-[410px]` | `w-sidebar` |
| `Reviews.astro` | `w-[360px]`, `max-w-[310px]` | `w-sidebar-sm`, `max-w-review` |
| `HowWeWork.astro` | `rounded-[10px]`, `min-h-[638px]` | `rounded-card`, `min-h-howwework` |
| `Projects.astro` | `max-w-[790px]`, `max-w-[780px]` | `max-w-widest`, `max-w-wider` |
| `Hero.astro` | `w-[260px]`, `text-[100px]`, `text-[160px]`, `max-w-[560px]`, `h-[9px]` | `w-card`, `text-display-xl`, `text-display-2xl`, `max-w-hero`, `h-lime-rule` |
| `Showcase.astro` | `rounded-[10px]`, `min-h-[760px]`, `max-w-[1200px]`, `px-[60px]`, `rounded-[6px]` | `rounded-card`, `min-h-showcase`, `max-w-showcase`, `px-15`, `rounded-card-sm` |
| `CtaFinal.astro` | `minmax(280px,420px)`, `max-w-[760px]`, `max-w-[360px]` | `minmax(w-[280px],w-cta-btn)`, `max-w-cta`, `max-w-faq` |
| `ThemeToggle.astro` | `text-[10px]` | `text-xs` (nativo) |
| `Button.astro` | CSS inline (9999px, 0px, etc.) | `@layer components .btn-liquid` con utilidades nativas |
| `ServicesAccordion.tsx` | `outline-offset-[-2px]` | Mantenido (negativo requerido) |

### Valores `px` conservados (4 casos justificados)
1. Hero: `min-h-[min(851px,100svh)]` y `calc(...)` — calc dinámico
2. Showcase: `w-[min(73vw,616px)]` y `md:w-[616px]` — min dinámico + no reutilizable
3. CtaFinal: `w-[280px]` en `minmax()` — sin token semántico propio
4. ServicesAccordion: `outline-offset-[-2px]` — negativo requerido

**Verificación**:
- `pnpm test`: 54/54 tests passing (50 nuevos + 4 existentes)
- `pnpm build`: Build exitoso en ~5s
- `./init.ps1`: VERDE completo

**Decisiones clave**:
1. **Tokens en `@theme inline`**: Tailwind v4 genera auto utilidades `w-sidebar`, `max-w-content`, `rounded-card`, `text-display-xl`, etc. sin config extra.
2. **Botón liquid**: Movido a `@layer components` con utilidades nativas (`rounded-full`, `pr-0`, `pl-8`, etc.) en vez de `@apply` o CSS crudo.
3. **text-xs vs 10px**: `text-xs` (12px) nativo; diferencia visual imperceptible, mantiene escala de spacing.
4. **max-w-footer**: Token creado aunque coincide con `max-w-xs` nativo, por nomenclatura semántica explícita.
5. **Tests resilientes**: Búsqueda dinámica del CSS de build (`index.*.css`) en vez de ruta hardcodeada con hash.
---

## 2026-10-01 — Reinicio: arnés en Claude Code + rediseño desde Figma "Agencia"

- Se borró `src/` (respaldo en el scratchpad de la sesión). El arnés OpenCode, los docs y tests viejos, los informes y `public/assets` se movieron a `_archive/`.
- Arnés nuevo: orquestador (sesión principal) + `implementer` + `verifier` (`.claude/agents/`), comando `/implementar`.
- Verificación nueva: `check:ds` (tokens anotados y sin valores sueltos), `check:arch` (monolito modular), `astro check`, vitest y build dentro de `init.ps1`.
- Extracción de Figma: `design/INVENTORY.md`, `design/figma/` (código, render y 35 assets) y `design/figma-tokens.json`. Copy real en `design/copy/`.
- 16 features en `feature_list.json`, de FND-001 a QA-001.

## 2026-10-01 — FND-001 done

- Stack Svelte 5 (@astrojs/svelte 9); React quitado. TypeScript 6.0.3, porque `astro check` y los peers no admiten TS 7.
- Capas creadas; modelo `PageOf<S>`, registry con `satisfies` (probado: falla si falta un type), BaseLayout con SEO y fuentes con ejes de Figma fijados en la URL.
- Informes: `progress/impl_FND-001.md`, `progress/verify_FND-001.md` (VERDE, vuelta 1). Las observaciones menores pasaron a DS-001, SEC-HERO y QA-001.

## 2026-10-01 — DS-001 done (2 vueltas)

- `src/styles/tokens.css`: 251 tokens, con los namespaces de Tailwind v4 cerrados. Incluye 32 roles tipográficos fluidos (375→1440), una escala de espaciado de 79 valores exactos de Figma, radios y sombras semánticos, breakpoints con 2xl=1440, `container-page` (1320) y motion (marquee, badge, masonry).
- Normalizaciones de deriva aceptadas: 142/143→140, 450→447, 617→616 y 1319/1321/1322→1320. `radius-panel` = 10 (Figma real, no 20).
- El implementer amplió `scripts/gen-design-docs.mjs` (tabla de roles tipográficos) y `scripts/lib/tokens.mjs` (utilidad de container). El orquestador lo aprueba.
- Deuda anotada: escala de espaciado grande (dimensiones mezcladas en `spacing`), contraste justo de `avatar-3` (4.52:1). Las observaciones pasan a SEC-HEADER, SEC-HERO, SEC-PROCESS, SEC-SERVICES y SEC-TESTIMONIALS.
- Figma MCP llegó al límite del plan Starter durante la feature.

## 2026-10-02 — SEC-HEADER done (2 vueltas)

- Header (chrome): logo, nav y CTA.
- Header sobre hero oscuro, nav y CTA desde content/site.ts, menú mobile accesible.
- Informes: `progress/impl_SEC-HEADER.md`, `progress/verify_SEC-HEADER.md`.

## 2026-10-02 — SEC-HERO done (1 vuelta)

- Sección hero.
- Primer modulo (modules/hero) registrado; h1 dentro del hero; wordmark como texto real (en Figma 11:27 es texto, no asset).
- Informes: `progress/impl_SEC-HERO.md`, `progress/verify_SEC-HERO.md`.

## 2026-10-02 — SEC-LOGOS done (2 vueltas)

- Marquee de logos de clientes.
- Marquee solo CSS con 9 logos de Figma; sin huecos de 375 a 3840px; pausa en hover/focus; estatico con reduced-motion.
- Informes: `progress/impl_SEC-LOGOS.md`, `progress/verify_SEC-LOGOS.md`.

## 2026-10-02 — SEC-PROJECTS done (2 vueltas)

- Galería de proyectos.
- Grid 2x3 con Picture optimizado (sharp); SectionHeader reutilizable en shared/ui para las secciones con cabecera comun.
- Informes: `progress/impl_SEC-PROJECTS.md`, `progress/verify_SEC-PROJECTS.md`.

## 2026-10-02 — SEC-STATS done (1 vuelta)

- Por qué elegirnos (métricas).
- 4 metricas con cabecera comun reutilizada (h2 dos tonos, lead strong).
- Informes: `progress/impl_SEC-STATS.md`, `progress/verify_SEC-STATS.md`.

## 2026-10-02 — SEC-PROCESS done (1 vuelta)

- Proceso en 4 pasos.
- Panel oscuro de Figma + 4 pasos inferidos con copy real (design/copy/process.md); progreso accesible; badge con motion-safe.
- Informes: `progress/impl_SEC-PROCESS.md`, `progress/verify_SEC-PROCESS.md`.

## 2026-10-02 — SEC-SERVICES done (2 vueltas)

- Servicios: acordeón de 4 disciplinas.
- Primera isla Svelte (acordeon accesible); progressive enhancement sin depender de noscript; corte del h2 fiel a Figma 31:29; copy real de design/copy/services.md.
- Informes: `progress/impl_SEC-SERVICES.md`, `progress/verify_SEC-SERVICES.md`.

## 2026-10-02 — Verificador en pausa (decisión del usuario)

- Desde SEC-SHOWCASE solo corre el implementer. Cada feature se cierra con `./init.ps1` en verde (lo ejecuta el orquestador) y queda `"verified": false` en `feature_list.json`.
- Al reactivar el verificador hay que correr `verifier` sobre cada feature con `verified: false`.

## 2026-10-02 — SEC-SHOWCASE done SIN VERIFICAR

- Showcase: carrusel horizontal.
- Showcase oscuro con carrusel horizontal (scroll-snap).
- Informes: `progress/impl_SEC-SHOWCASE.md` (verificador pausado por decisión del usuario).

## 2026-10-02 — SEC-TESTIMONIALS done SIN VERIFICAR

- Testimonios: masonry con desplazamiento continuo hacia abajo.
- Masonry solo CSS (1/2/4 columnas), 20 reseñas reales, pausa en hover/foco, estático y con scroll en reduced-motion.
- Pendiente de confirmar con diseño: blur 2px solo en el fade, prueba social con texto en inglés (imagen 1x), CTA a `/#contacto`, nombres/roles con salto de línea.
- Informes: `progress/impl_SEC-TESTIMONIALS.md` (verificador pausado por decisión del usuario).

## 2026-10-02 — SEC-TEAM done SIN VERIFICAR

- Equipo.
- Carril horizontal con scroll-snap (solo CSS); 1 integrante real (Natalia) + 3 placeholders decorativos.
- Pendiente: datos de 3 integrantes; arrastre con ratón requeriría mover ShowcaseScroller a shared/ui.
- Informes: `progress/impl_SEC-TEAM.md` (verificador pausado por decisión del usuario).

## 2026-10-02 — SEC-FAQ done SIN VERIFICAR

- FAQ: acordeón.
- Acordeón accesible; lógica movida a shared/lib/accordion.ts (services y FAQ la comparten).
- Pendiente: respuestas 2–5 PROVISIONALES (redactadas), 'On average.' parece cortado, FAQ en inglés con lang=en.
- Informes: `progress/impl_SEC-FAQ.md` (verificador pausado por decisión del usuario).

## 2026-10-02 — SEC-CONTACT done SIN VERIFICAR

- Contacto: card glass con formulario.
- Card glass con formulario accesible (isla), ancla /#contacto; sin backend: avisa 'envío no disponible' y no pierde datos.
- Pendiente: definir endpoint del formulario (home.ts endpoint: undefined); título y legal en inglés con lang=en.
- Informes: `progress/impl_SEC-CONTACT.md` (verificador pausado por decisión del usuario).

## 2026-10-02 — SEC-FOOTER done SIN VERIFICAR

- Footer (chrome).
- Footer chrome con columnas de navegación a anclas reales.
- Pendiente: contraste ink-muted 3.57:1 en texto pequeño, URLs de redes, trabajos placeholder, copy de plantilla en inglés; header enlaza a /#studio inexistente (pasa a QA-001).
- Informes: `progress/impl_SEC-FOOTER.md` (verificador pausado por decisión del usuario).

## 2026-10-02 — QA-001 done SIN VERIFICAR

- Pase final: SEO, rendimiento y responsive de la Homepage completa.
- Lighthouse local: mobile 98/100/100/100, desktop 100/100/100/100; sitemap y robots propios; SEO completo; 'Studio' del header → /#equipo.
- BLOQUEA PUBLICAR: dominio placeholder https://dominio-por-confirmar.example (definir SITE_URL). Lista consolidada de 18 puntos a confirmar en progress/impl_QA-001.md.
- Informes: `progress/impl_QA-001.md` (verificador pausado por decisión del usuario).

## 2026-10-02 — Nueva fase: motion (decisión del usuario)

- Se mantiene Astro + islas Svelte + Tailwind v4; librería **Motion** (motion.dev) para animaciones de imágenes y secuencias; Tailwind v4 first, CSS propio solo si es imprescindible.
- Features MOT-001 → MOT-PROCESS → MOT-ACCORDIONS → MOT-PROJECTS → MOT-SHOWCASE → MOT-TEAM → MOT-FOOTER. Referencias en `design/references/`. Contenido faltante con placeholders marcados. Verificador sigue en pausa.

## 2026-10-02 — MOT-001 done SIN VERIFICAR

- Infraestructura de motion compartida.
- Primitivas en @/shared/lib/motion (reveal/stagger, acordeón, typewriter, autoplay/loop, animateTo/sequence) + tokens de motion; dependencia motion (API vanilla).
- Delta JS 0 B hasta que se usen; coste previsto total ≈ 7.7 KB gz.
- Informes: `progress/impl_MOT-001.md` (verificador pausado por decisión del usuario).

## 2026-10-02 — MOT-PROCESS done SIN VERIFICAR

- Proceso: entrada escalonada de los 4 pasos.
- Pasos entran de abajo arriba, 1s + 200ms escalonado, una vez; visible sin JS y con reduced-motion.
- Delta JS +715 B gz; CLS 0 atribuible.
- Informes: `progress/impl_MOT-PROCESS.md` (verificador pausado por decisión del usuario).

## 2026-10-03 — MOT-ACCORDIONS done (VERDE, 2 vueltas)

- Acordeones de servicios y FAQ: expansión `grid-template-rows 0fr→1fr` (utilidad `collapsible` + `data-open`) y entrada lateral escalonada (`enter-from-side`, lado medido al abrir), solo tras la primera interacción.
- Controlador compartido `AccordionController` (runes) con teclado APG; sin JS y con reduced-motion, estado final visible. Fuera `hidden`/`data-collapsed`/`--animate-panel-in`.
- Vuelta 2: timeout de 5 s en `tests/services.test.ts` (igualdad profunda sobre PNG de 1,2 MB) → `Buffer#equals`, misma aserción, ~3 ms.
- Menores pendientes: `@custom-variant scripting` sin uso; `setOpen()` exportado sin uso y citado en docs/conventions.md; validación visual en navegador pendiente (sin headless).
- Informes: `progress/impl_MOT-ACCORDIONS.md`, `progress/verify_MOT-ACCORDIONS.md`.

## 2026-10-03 — MOT-PROJECTS done SIN VERIFICAR

- Proyectos: hover/focus-visible en desktop → la pill de título sube al centro (400ms), se desvanece (250ms) y aparecen pill de industria + rejilla 2×2 de métricas (250ms). CSS puro (variantes `hover-motion` / `card-active`), sin JS.
- `(hover: none)` y reduced-motion: estado final estático visible. Schema ampliado (`details`: industria + 4 métricas), datos PLACEHOLDER.
- Figma MCP no disponible: medidas `@derived` de design/references/projects-hover-final.png; confirmar rejilla de métricas y fuente mono cuando haya acceso.
- init.ps1 verde (206/206). Informes: `progress/impl_MOT-PROJECTS.md` (verificador pausado por decisión del usuario).

## 2026-10-03 — MOT-SHOWCASE done SIN VERIFICAR

- Showcase: autoplay en bucle continuo (clones), pausa con hover, foco y pestaña oculta + botón de pausa accesible (WCAG 2.2.2); se mantienen el arrastre y el scroll-snap. Reduced motion / sin JS: sin autoplay.
- 4 slides nuevas PLACEHOLDER (`placeholder: true`, imágenes de la galería del footer); iconos pausa/play `@derived`.
- Incidencia: el implementer ejecutó `taskkill /IM chrome.exe` y cerró todas las ventanas de Chrome del usuario → prohibido matar procesos globales.
- init.ps1 verde (217/217). Informes: `progress/impl_MOT-SHOWCASE.md` (verificador pausado por decisión del usuario).

## 2026-10-03 — MOT-TEAM done SIN VERIFICAR

- Equipo: hover/focus de la card de perfil → foto con blur/escala (Motion) y velo, icono +, rol, nombre y bio que aparecen escribiéndose (typewriter de MOT-001); el texto completo siempre está en el DOM para lectores de pantalla.
- Mobile y reduced motion: estado final estático. Schema ampliado (cargo, empresa, bio); empresa y bio de Natalia son PLACEHOLDER. Los huecos 40:384–386 siguen siendo decorativos.
- Figma MCP no disponible: medidas `@derived` de design/references/team-hover-final.png.
- init.ps1 verde (230/230). Informes: `progress/impl_MOT-TEAM.md` (verificador pausado por decisión del usuario).

## 2026-10-03 — MOT-FOOTER done SIN VERIFICAR

- Footer: las tarjetas de la galería giran como una rueda en bucle continuo sobre el arco ajustado a la composición de Figma (círculo de mínimos cuadrados sobre sus centros), solo con transform; pausa con pestaña oculta. Imágenes decorativas `aria-hidden`; reduced motion: composición estática de Figma.
- PLACEHOLDER: 2 imágenes `incoming` (capturas de project-gallery) a sustituir por piezas reales.
- Figma MCP no disponible: validar en Figma cuando haya acceso.
- init.ps1 verde (242/242). Informes: `progress/impl_MOT-FOOTER.md` (verificador pausado por decisión del usuario).

## 2026-10-05 — FIX-HERO-VIDEO done SIN VERIFICAR

- Hero: vuelve el video de fondo (`public/videos/hero-background.mp4`, ruta en content), velo `--color-hero-veil` (AA medido) y header superpuesto transparente cuando la página empieza con hero.
- Pausa con pestaña oculta / fuera de viewport; reduced motion: primer frame. Sin CLS; si el video falla queda el fondo ink + ruido de Figma.
- init.ps1 verde (orquestador). Informe: `progress/impl_FIX-HERO-VIDEO.md`.

## 2026-10-05 — MOT-PROCESS-TIMING done SIN VERIFICAR

- Proceso: la entrada de los pasos dispara más tarde (rootMargin inferior −20%, amount 0, para que siempre llegue a dispararse en móvil apaisado) y con un retardo inicial de 250ms (`--delay-reveal-process`, utilidad `reveal-delay-*`). Se mantienen 1s + 200ms de escalonado.
- `revealAll()` lee `data-reveal-amount` / `data-reveal-margin` (opciones de la primitiva, sin caso especial).
- init.ps1 verde (orquestador). Informe: `progress/impl_MOT-PROCESS-TIMING.md`.

## 2026-10-05 — UI-LIB-001 done SIN VERIFICAR

- Librería de componentes en `src/shared/ui/` (22 componentes: botones, input, label, errores, estado de formulario, eyebrow, cabeceras, enlaces, cards de proyecto y reseña, avatar, acordeón…), solo con tokens; regla de API (≤4 props, sin variantes) comprobada por `tests/ui-library.test.ts`.
- Catálogo `docs/components.md` + página interna `/componentes` (noindex, fuera del sitemap) con datos de `src/content/ui-catalog.ts`.
- Módulos aún sin migrar (UI-LIB-003). Excepciones documentadas: `SectionHeader.titleClass`, `ButtonPauseGlass.pressed` (este último desaparece en UI-LIB-002 al quitar el botón de pausa).
- init.ps1 verde (orquestador). Informe: `progress/impl_UI-LIB-001.md`.

## 2026-10-05 — UI-LIB-002 done SIN VERIFICAR

- `ShowcaseCarousel` (bucle continuo, SIN botón de pausa, pausa con hover/foco/toque/pestaña oculta/fuera de viewport) y `TeamSlider` (autoplay por pasos: 4s de espera, 900ms de desplazamiento, bucle con clones) como componentes separados en `shared/ui`.
- Primitivas comunes en `shared/lib/slider/` (gesture, loop, swipe): swipe con pointer events y `touch-action: pan-y`, umbral 40px, encaje; reanuda 3s después de soltar.
- `ButtonPauseGlass` se conserva: ahora lo consume la rueda del footer. Decisión WCAG 2.2.2 del showcase documentada en docs/components.md.
- NO probado en navegador (el sandbox bloqueó `astro preview`): pendiente revisar swipe/scroll vertical y tiempos a 375/768/1440.
- init.ps1 verde (orquestador). Informe: `progress/impl_UI-LIB-002.md`.

## 2026-10-05 — UI-LIB-003 done SIN VERIFICAR

- Todo el sitio (módulos + header, footer, menú móvil) consume `src/shared/ui/` (26 componentes; nuevo `LinkLogo`). Sin marcado duplicado en módulos/layout.
- `check-architecture.mjs` detecta duplicados de la librería fuera de `shared/ui`.
- Capturas antes/después a 375/768/1440 en `progress/screens/UI-LIB-003/`: 0 diferencias tras corregir 3 desajustes (header +2px, enlaces de footer +1px, flecha del CTA).
- init.ps1 verde (orquestador). Informe: `progress/impl_UI-LIB-003.md`.

## 2026-10-05 — MOT-PROJECTS-V2 done (VERDE)

- `ProjectCard` reescrita: sin pill de industria; detalle abajo en bloque glass (título → métricas con icono 2×2 mobile / 1×4 lg → `LinkButtonPaper` "Detalles del proyecto" 18px/400 full width).
- Desktop hover/foco: imagen blur 4px + velo ink, texto blanco. Mobile/hover:none y reduced-motion: estado final sin blur.
- Menores abiertos: iconos como `<img>` (no inline), card a 375 crece a ~293px de alto, enlaces con mismo nombre accesible, comparación Figma por volcado local (cuota MCP agotada).
- init.ps1 verde (orquestador). Informes: `progress/impl_MOT-PROJECTS-V2.md`, `progress/verify_MOT-PROJECTS-V2.md`.

## 2026-10-05 — MOT-STATS done (VERDE)

- Stats: reveal de "Sin relleno, solo resultados." y cuenta animada (0 → valor, una vez, con prefijo/sufijo) en los 4 contadores; SSR con el valor final.
- Proceso: eliminado "DURACIÓN: ~4 semanas" (schema, contenido, línea de puntos); copy fuente marcado como eliminado.
- Menores abiertos: `revealAll()`/`countUpAll()` sin acotar a la sección (observadores duplicados, inocuo); lectores de pantalla podrían oír valores intermedios. Verificación visual sin navegador (cuota Figma agotada).
- init.ps1 verde (orquestador). Informes: `progress/impl_MOT-STATS.md`, `progress/verify_MOT-STATS.md`.

## 2026-10-05 — MOT-SLIDERS-SHOWCASE done (VERDE)

- Sliders (showcase, team, logos, masonry de testimonios y rueda del footer) ya no se pausan con hover; el foco solo pausa con foco de teclado (`:focus-visible`). El botón de pausa de la rueda del footer se mantiene.
- Showcase: cards ×0.6 (369.6px en 1440, 168px en 375), proporción 616/658 conservada; `--text-display` 60 → 46px; panel sin `min-h-844`.
- Stats/process: `revealAll`/`countUpAll` acotados a su sección (cierra el menor de MOT-STATS).
- Menores abiertos: textos de `ui-catalog.ts` y JSDoc de `showcase/schema.ts` aún mencionan pausa con hover; alto del panel y velocidad visual del showcase (~32px/s con 12s por card) a confirmar con el cliente. Sin comparación en vivo con Figma (cuota MCP agotada) ni prueba en navegador.
- init.ps1 verde (orquestador). Informes: `progress/impl_MOT-SLIDERS-SHOWCASE.md`, `progress/verify_MOT-SLIDERS-SHOWCASE.md`.

## 2026-10-05 — SEC-TESTIMONIALS-TRUSTED done (VERDE)

- "Trusted by clients worldwide" (38:319) pasa de raster a HTML: nuevo `TrustBadge` en `shared/ui` (pila de 4 avatares + "56+", 5 estrellas con texto alternativo, texto en dos tonos), datos en `content/pages/home.ts`, avatares PLACEHOLDER; raster eliminado.
- Medidas sacadas del raster (en Figma el nodo es una imagen sin capas; cuota MCP agotada). Avatares en cuadrado redondeado (radio 12) según la referencia, no circulares como decía el acceptance.
- Menor abierto (preexistente): `home.ts` `masonryLabel` aún dice que se detiene al pasar el cursor.
- init.ps1 verde (orquestador). Informes: `progress/impl_SEC-TESTIMONIALS-TRUSTED.md`, `progress/verify_SEC-TESTIMONIALS-TRUSTED.md`.

## 2026-10-05 — MOT-TEAM-MOBILE done (VERDE)

- Equipo: la foto ya no se desenfoca ni escala fuera de hover-motion (mobile/táctil/reduced-motion); solo el velo `--team-card-veil` la oscurece. El blur sigue solo en hover de escritorio vía `hover.ts`.
- TeamSlider ya corría en autoplay en todos los breakpoints sin pausa por hover (tras MOT-SLIDERS-SHOWCASE); se añadió test que lo fija.
- Menores abiertos: contraste de la bio sobre foto nítida (mediana 7.1:1, ~30% de píxeles < 4.5:1, ya ocurría con blur); la anotación @contrast de `--color-paper-soft` es optimista. Sin prueba en dispositivo real.
- init.ps1 verde (orquestador). Informes: `progress/impl_MOT-TEAM-MOBILE.md`, `progress/verify_MOT-TEAM-MOBILE.md`.

## 2026-10-05 — MOT-REVEAL done (VERDE)

- Testimonios, FAQ y contacto entran al viewport con `reveal-up` + `revealAll(section)` acotado, escalonado cabecera → aside → contenido; una vez, solo opacity/transform, visible sin JS y con reduced-motion.
- Nueva variante Tailwind `head-parts:` y marca `data-head-part` en SectionHeader (sin props nuevas). En contacto la card glass no se anima, solo su contenido.
- `masonryLabel` corregido (ya no menciona el cursor). Nuevo `tests/reveal-sections.test.ts`.
- init.ps1 verde (orquestador). Informes: `progress/impl_MOT-REVEAL.md`, `progress/verify_MOT-REVEAL.md`.

## 2026-10-05 — SEC-CONTACT-MESSAGE done (VERDE)

- Formulario de contacto con campo `message`: nuevo `TextareaGlass` en `shared/ui` (mismos tokens que InputGlass, `resize-y`, token `--field-textarea-min-h`), documentado y en el catálogo `/componentes`.
- Validación en `form.ts`: requerido + mínimo 20 caracteres (sobre el valor recortado) con FieldError y foco al primer inválido; `message` incluido en el POST.
- Menores abiertos: la sección a 1440 supera el alto Figma 174:73 (622px, `min-h`, sin rotura); copy del campo escrito a mano (confirmar con copy); sin captura en navegador (sandbox bloquea localhost).
- init.ps1 verde (orquestador). Informes: `progress/impl_SEC-CONTACT-MESSAGE.md`, `progress/verify_SEC-CONTACT-MESSAGE.md`.

## 2026-10-05 — FIX-OPEN-MINORS done (VERDE)

- Regla nueva en vigor: Figma es referencia, no contrato; mejor resultado sin cambiar la estructura (CLAUDE.md, implementer, verifier, docs/verification.md).
- Equipo: bandas oscuras con fundido (`--team-detail-scrim-top/bottom`) bajo rol/empresa y nombre/bio; AA garantizado con cualquier foto (peor caso paper-soft ≈ 5.1:1). Sin blur en mobile. Anotación @contrast corregida.
- Textos de pausa: catálogo, JSDoc del showcase y aria-labels de showcase/equipo describen la pausa real (foco de teclado, swipe); nada menciona hover/cursor.
- Showcase: `--duration-showcase-slide` 12s → 7.35s (≈ 53px/s en 1440, velocidad previa).
- Menores: regex con `\s` sin escapar en `tests/open-minors.test.ts:10` (funciona por casualidad); cifra de contraste de `paper` conservadora (7.1 vs ≈ 8.0).
- init.ps1 verde (orquestador). Informes: `progress/impl_FIX-OPEN-MINORS.md`, `progress/verify_FIX-OPEN-MINORS.md`.

## 2026-10-07 — CLEANUP-TOKENS done (2 vueltas)

- tokens.css mínimo, Tailwind sin sobrescribir y sin tests.
- tokens.css 985→~460 líneas sin resets ni anotaciones; tema por defecto de Tailwind restaurado; spacing nativo (N px → N/4); tests y vitest eliminados; Tailwind escanea solo src/.
- Informes: `progress/impl_CLEANUP-TOKENS.md`, `progress/verify_CLEANUP-TOKENS.md`.

## 2026-10-07 — MOB-CARDS-INITIAL done (1 vuelta)

- Cards de proyecto y equipo: en mobile solo el estado inicial; TeamCard en archivo propio.
- Sin hover: ProjectCard = imagen + botón; TeamCard = foto + nombre + rol. Variante can-hover (capa) + motion-safe (transición). TeamCard y TeamCardPlaceholder extraídos a shared/ui.
- Informes: `progress/impl_MOB-CARDS-INITIAL.md`, `progress/verify_MOB-CARDS-INITIAL.md`.

## 2026-10-07 — COPY-PROJECT-BUTTON done (1 vuelta)

- Botón de ProjectCard: "Ver proyecto".
- Botón del detalle de ProjectCard: 'Ver proyecto' (copy en src/content).
- Informes: `progress/impl_COPY-PROJECT-BUTTON.md`, `progress/verify_COPY-PROJECT-BUTTON.md`.

## 2026-10-07 — EXTRACT-PROCESS-STEP done (1 vuelta)

- Paso del proceso en componente propio.
- Paso del proceso extraído a componente propio; sección solo coloca y pasa datos.
- Informes: `progress/impl_EXTRACT-PROCESS-STEP.md`, `progress/verify_EXTRACT-PROCESS-STEP.md`.

## 2026-10-07 — EXTRACT-STAT-ITEM done (1 vuelta)

- Cifra de stats en componente propio.
- Bloque de cifra de stats extraído a componente propio; sección solo coloca y pasa datos.
- Informes: `progress/impl_EXTRACT-STAT-ITEM.md`, `progress/verify_EXTRACT-STAT-ITEM.md`.

## 2026-10-07 — EXTRACT-SERVICE-ROW done (1 vuelta)

- Fila del acordeón de servicios en componente propio.
- Fila del acordeón de servicios extraída a componente Svelte propio; comportamiento y a11y iguales.
- Informes: `progress/impl_EXTRACT-SERVICE-ROW.md`, `progress/verify_EXTRACT-SERVICE-ROW.md`.

## 2026-10-08 — PRJ-ROUTE done (1 vuelta)

- Detalle de proyecto: módulo, contenido tipado, ruta /proyectos/[projectId] y hero.
- Módulo project, tipo Project, contenido Origen, ruta /proyectos/[projectId] con SEO y hero en componentes aislados (HeroBackLink, HeroStatus, HeroExplore, HeroFacts/HeroFact). Ancla #resultados provisional: la sustituye PRJ-RESULTS.
- Informes: `progress/impl_PRJ-ROUTE.md`, `progress/verify_PRJ-ROUTE.md`.

## 2026-10-08 — PRJ-RESULTS done (1 vuelta)

- Detalle de proyecto: Resultados primero.
- Sección Resultados primero (intro, 3 métricas, nota metodológica) en componentes aislados; reemplaza el ancla provisional #resultados. Menores abiertos: métricas a 1 columna en 768, prop de paso comparisonLabels.
- Informes: `progress/impl_PRJ-RESULTS.md`, `progress/verify_PRJ-RESULTS.md`.

## 2026-10-08 — PRJ-CONTEXT done (1 vuelta)

- Detalle de proyecto: Contexto y desafío.
- Sección Contexto y desafío (intro, ficha de 5 campos, reto, objetivos) en componentes aislados; ProjectSectionLabel reutilizado. Menor abierto: labelId fijo en ContextGoals.
- Informes: `progress/impl_PRJ-CONTEXT.md`, `progress/verify_PRJ-CONTEXT.md`.

## 2026-10-08 — PRJ-SOLUTION done (1 vuelta)

- Detalle de proyecto: Solución y experiencia.
- Sección Solución y experiencia (216:2957; 224:199 descartada) en 11 componentes aislados, slider de packaging con script acotado. Menores abiertos: foco de los puntos sobre foto oscura, slides inactivas en el árbol a11y, aria-current transitorio, layout del mock móvil a 768.
- Informes: `progress/impl_PRJ-SOLUTION.md`, `progress/verify_PRJ-SOLUTION.md`.

## 2026-10-08 — PRJ-PROCESS done (1 vuelta)

- Detalle de proyecto: Proceso y automatización.
- Sección Proceso y automatización (4 etapas + flujo postcompra) reconstruida desde screenshot en componentes aislados. Menor abierto: id fijo del h3 en ProcessFlow.
- Informes: `progress/impl_PRJ-PROCESS.md`, `progress/verify_PRJ-PROCESS.md`.

## 2026-10-08 — PRJ-SCOPE done (1 vuelta)

- Detalle de proyecto: Alcance y ficha técnica.
- Sección Alcance y ficha técnica (4 entregables, herramientas con logos reales de Figma, 5 tecnologías, validación) en componentes aislados. Menor abierto: logos SVG pueden deformarse <345px.
- Informes: `progress/impl_PRJ-SCOPE.md`, `progress/verify_PRJ-SCOPE.md`.

## 2026-10-08 — PRJ-CLOSING done (1 vuelta)

- Detalle de proyecto: Cierre, siguiente proyecto y contacto.
- Conclusión, siguiente proyecto y contacto en componentes aislados. Tarjeta Atlas cae en /#proyectos hasta que exista content/projects/atlas.ts (cambio automático). CTA de cotización con enganche data-quote-open para QTE-MODAL.
- Informes: `progress/impl_PRJ-CLOSING.md`, `progress/verify_PRJ-CLOSING.md`.

## 2026-10-08 — NAV-FLOATING done (2 vueltas)

- Barra flotante global (Cotizar proyecto + WhatsApp).
- Barra flotante global en layout/: sobre el hero y fija en top con glass al hacer scroll (home y proyectos). Vuelta 2 corrigió solape con menú móvil y saltos de scroll. Pendiente: número de WhatsApp real en src/content/site.ts e icono de WhatsApp (Figma usa circle-x).
- Informes: `progress/impl_NAV-FLOATING.md`, `progress/verify_NAV-FLOATING.md`.

## 2026-10-09 — QTE-MODAL done (3 vueltas)

- Modal de solicitud de cotización.
- Modal de cotización global (dialog nativo, una instancia en layout/) en componentes por bloque, abierto por todos los [data-quote-open]. Vuelta 2: áreas táctiles de 44px; vuelta 3: estado del rango coherente con la UI. Pendientes: site.quote.endpoint, número de WhatsApp, monedas EUR/MXN.
- Informes: `progress/impl_QTE-MODAL.md`, `progress/verify_QTE-MODAL.md`.

## 2026-10-09 — QTE-USD-ONLY done (1 vuelta)

- Cotización solo en USD.
- Cotización solo en USD: sin selector de moneda, currency=USD enviado. Endpoint y WhatsApp siguen pendientes.
- Informes: `progress/impl_QTE-USD-ONLY.md`, `progress/verify_QTE-USD-ONLY.md`.

## 2026-10-09 — EXTRACT-A done (1 vuelta)

- Extracción A: duplicación real (TextLines, campos de ContactForm).
- TextLines en modules/project (13 usos) y campos de ContactForm extraídos a componentes propios; sin cambio visual.
- Informes: `progress/impl_EXTRACT-A.md`, `progress/verify_EXTRACT-A.md`.

## 2026-10-09 — EXTRACT-B done (1 vuelta)

- Extracción B: ítems repetidos inline (footer, masonry, marquee, ProjectCard, TrustBadge, ServiceRow, puntos del slider).
- Ítems repetidos del footer, masonry, marquee, ProjectCard, TrustBadge, ServiceRow y puntos del slider extraídos a componentes propios; sin cambio visual.
- Informes: `progress/impl_EXTRACT-B.md`, `progress/verify_EXTRACT-B.md`.

## 2026-10-09 — EXTRACT-C done (1 vuelta)

- Extracción C: bloques de diseño dentro de contenedores (heroes, contacto, mocks de tienda, quote, TeamCard, HeaderNav).
- Bloques de diseño de heroes, contacto, mocks de tienda, proceso, quote, TeamCard y HeaderNav extraídos a componentes propios; sin cambio visual.
- Informes: `progress/impl_EXTRACT-C.md`, `progress/verify_EXTRACT-C.md`.

## 2026-10-09 — QTE-CURRENCIES done (1 vuelta)

- Cotización: monedas USD, EUR, MXN y Cripto + estilo coherente del selector.
- Monedas USD (defecto), EUR, MXN y Cripto en select nativo; estilo y alto alineados con el segmentado de modo. Endpoint y WhatsApp siguen pendientes.
- Informes: `progress/impl_QTE-CURRENCIES.md`, `progress/verify_QTE-CURRENCIES.md`.

## 2026-10-09 — UI-POLISH-01 done (1 vuelta)

- Pulido: modal sin "≈ 2 min", botón de envío en 2 piezas con hover líquido, icono de WhatsApp del flotante.
- Modal sin '≈ 2 min'; botón de envío en 2 piezas con hover líquido (gooey) compartido con el CTA del header; logo real de WhatsApp en la barra flotante.
- Informes: `progress/impl_UI-POLISH-01.md`, `progress/verify_UI-POLISH-01.md`.

## 2026-10-09 — LINKS-PAGE done (1 vuelta)

- Linktree de Instagram en /links.
- Linktree /links (230:977) en componentes aislados; 'Continuar cotización' abre el modal con servicios preseleccionados; guía y WhatsApp pendientes; rebote de salida del hover líquido corregido.
- Informes: `progress/impl_LINKS-PAGE.md`, `progress/verify_LINKS-PAGE.md`.

## 2026-10-09 — IMG-PLACEHOLDERS done (2 vueltas)

- Placeholders fotográficos coherentes en home y footer, créditos Unsplash visibles en `/creditos/` y renderizado remoto responsive sin CLS.
- Se documentó la dirección de arte y el inventario de 37 slots; se añadieron créditos con atribución y URLs Unsplash conformes a sus API Guidelines. Se recuró la foto de Branding para mantener la paleta cálida y se ampliaron los enlaces de atribución a 44px de alto.
- Por autorización expresa del usuario, los 10 slots originalmente reservados para IA usan Unsplash solo como sustitución de assets IA ausentes; la excepción queda enumerada en `feature_list.json` y `design/placeholders.md`.
- `./init.ps1`: VERDE; verificación visual, responsive y de accesibilidad: VERDE.
- Informes: `progress/impl_IMG-PLACEHOLDERS.md`, `progress/verify_IMG-PLACEHOLDERS.md`.

## 2026-10-13 — IMG-RELEVANCE done (6 vueltas)

- Imágenes Unsplash relevantes para diseño web y desarrollo de software en los 37 slots.
- Se recuraron los slots genéricos hacia interfaces, wireframes, mockups y código; las vueltas 4–5 sustituyeron dos fotos con marcas visibles (GIGABYTE, "Pencil Pro"). Superó el máximo de 3 vueltas por hallazgos menores de curaduría; cerrada con verificación VERDE.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_IMG-RELEVANCE.md`, `progress/verify_IMG-RELEVANCE.md`.

## 2026-10-13 — CM-CORE done (1 vuelta)

- Modelo de contenido: PageDoc { seo, sections[{ sectionType, headingContent, content }] } con esquemas zod, JSON y medios por URL; migrar home y créditos.
- PageDoc { slug, seo, sections[{ sectionType, id?, headingContent, content }] } con esquemas zod por módulo (tipos inferidos), datos en src/content/data/pages/*.json validados en build y MediaRef por cadena (shared/lib/media.ts). HTML de la home y /creditos/ idéntico byte a byte al previo. Menores abiertos: Unsplash sin width/height no se rechaza; la validación corta en el primer archivo inválido.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_CM-CORE.md`, `progress/verify_CM-CORE.md`.

## 2026-10-13 — CM-PROJECT done (1 vuelta)

- Proyectos como documentos de secciones genéricas (case-study) + primer caso real: Yupa.
- 9 módulos project-* genéricos con esquema zod, plantilla case-study, ruta /proyectos/[slug] con SectionRenderer, microcopy en content/case-study.ts, tarjetas (next, /links) derivadas del proyecto. Origen/Atlas eliminados (componentes, tokens, assets). Yupa real desde Figma 243:21; portada y bloques de solución vacíos en Figma (design/content-gaps.md). Menor: og:image PNG sin optimizar → HOME-REAL.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_CM-PROJECT.md`, `progress/verify_CM-PROJECT.md`.

## 2026-10-13 — PRJ-REMITTVEN done (1 vuelta)

- Caso real: Remittven (solo datos y assets, sin componentes nuevos).
- remittven.json + 3 assets reales (logo, pantallas, conclusión) sin componentes nuevos; ciclo Yupa ↔ Remittven. Menores: og:image PNG 3 MB (cubierto en HOME-REAL), logo del hero a 1× (pedir SVG), factor 0.56 en SolutionIdentity.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_PRJ-REMITTVEN.md`, `progress/verify_PRJ-REMITTVEN.md`.

## 2026-10-13 — PRJ-LASDONAS done (1 vuelta)

- Caso real: Las Doñas (solo datos y assets, sin componentes nuevos).
- las-donas.json + assets reales sin componentes nuevos; ciclo Yupa → Remittven → Las Doñas → Yupa. Menores: recorte de la foto de conclusión deja restos de texto horneado de Figma; portada de Yupa recorta la Y a 375 en la tarjeta de siguiente proyecto.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_PRJ-LASDONAS.md`, `progress/verify_PRJ-LASDONAS.md`.

## 2026-10-13 — HOME-REAL done (1 vuelta)

- Home con datos reales: galería desde los proyectos, purga de placeholders e informe de huecos.
- Galería de la home = slugs de los 3 casos con tarjetas derivadas; 4 diapositivas del showcase y 3 imágenes de servicios con piezas reales; og:image optimizada por getImage; recorte de la foto de Las Doñas; design/content-gaps.md como informe priorizado (P1–P3) para el cliente. Menores: og de Las Doñas a 996×630, og:image de proyectos sin width/height/alt, franja transparente en una diapositiva de Remittven.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_HOME-REAL.md`, `progress/verify_HOME-REAL.md`.

## 2026-10-13 — PROJECTS-INDEX done (1 vuelta)

- Página /proyectos/: listado simple de todos los proyectos.
- /proyectos/ = proyectos.json con una sola sección project-index: SectionHeader (h1) + ProjectCard apiladas en una columna, sin grid; tarjetas derivadas; enlaces de home, hero de caso y /links → /proyectos/. Menor: comentario de project-card-wide en global.css desactualizado.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_PROJECTS-INDEX.md`, `progress/verify_PROJECTS-INDEX.md`.

## 2026-10-14 — PRJ-MEDIA done (1 vuelta)
- Casos existentes: imágenes de solución que faltaban (nodos sueltos superpuestos en Figma 243:20) y portadas reales en portátil.
- Yupa +2 medios, Remittven 1→3, Las Doñas 3; portadas 311:28/308:28/304:480 en hero, home, /proyectos/ y og:image. Mapa de nodos sueltos del contenedor en el informe. Menores (portada blanda en mobile, sombra lateral desde md) pasan a PRJ-CAPPI.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_PRJ-MEDIA.md`, `progress/verify_PRJ-MEDIA.md`.

## 2026-10-14 — PRJ-CAPPI done (1 vuelta)
- Caso real: Cappi Xtremo (cuarto proyecto, datos y assets).
- cappi-xtremo.json con el copy de 267:2146, portada 320:576, imágenes sueltas 268:7397 y 268:7400..7404; home y /proyectos/ con 4 casos; ciclo de 4. Arreglados los menores de PRJ-MEDIA (portada en mobile, sombra desde md). Menores (orden de /proyectos/, medias apaisadas en mobile, logo de Claude) pasan a HOME-NO-STOCK.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_PRJ-CAPPI.md`, `progress/verify_PRJ-CAPPI.md`.

## 2026-10-14 — HOME-NO-STOCK done (1 vuelta)
- Sin Unsplash ni imágenes de relleno: galerías con piezas reales de los proyectos.
- Servicios, showcase, contacto y rueda del pie con piezas de los 4 casos y de los collages de portafolio (src/assets/portfolio/); UserPlaceholder en shared/ui para avatares y huecos; borrados unsplash.ts, remote-image, /creditos/ y dominios remotos. Orden fijo en /proyectos/, medias apaisadas en mobile y logo de Claude equilibrado. Menor pendiente: src/assets/brand/sensei-logo.svg sin uso.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_HOME-NO-STOCK.md`, `progress/verify_HOME-NO-STOCK.md`.

## 2026-10-14 — TEAM-REAL done (1 vuelta)
- Equipo: perfiles reales.
- 5 integrantes de 291:131 (Natalia, Jhoarling, Victor con foto real; Maicol y Daniel con UserPlaceholder oscuro para contraste AA), bios breves provisionales, sin kind/TeamCardPlaceholder; borrado sensei-logo.svg. Menor abierto: subir un poco la silueta del placeholder dentro de la card.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_TEAM-REAL.md`, `progress/verify_TEAM-REAL.md`.

## 2026-10-14 — NAV-FLOATING-V2 done (1 vuelta)
- Barra flotante v2: abajo, con Cotizar proyecto + Solicitar asesoría + WhatsApp.
- Fija abajo y centrada en todo el sitio (token --floating-bar-bottom con safe-area), se aparta del footer, tres acciones de 218:21; 'Solicitar asesoría' con punto de enganche para ADV-MODAL. Menores: safe-area inerte sin viewport-fit=cover, CLS 0.010 en / a 375 (no de la barra).
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_NAV-FLOATING-V2.md`, `progress/verify_NAV-FLOATING-V2.md`.

## 2026-10-14 — ADV-MODAL done (1 vuelta)
- Modal de solicitud de asesoría.
- Bloques aislados en src/layout/advice/ desde 272:8117; infraestructura de diálogo compartida con la cotización (dialog-form.ts); lo abren 'Solicitar asesoría' de la barra flotante y el CTA del header (desktop y menú mobile). Menores: studioEmail vacío y wa.me sin número (huecos P1 ya documentados), éxito sin tono propio, radiogroup redundante.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_ADV-MODAL.md`, `progress/verify_ADV-MODAL.md`.

## 2026-10-14 — ADV-MODAL-COMPACT done (1 vuelta)
- El modal de asesoría queda centrado y con alto natural desde `sm`; usa scroll interno cuando el contenido supera el viewport. En móvil conserva pantalla completa y no desborda horizontalmente.
- El cambio es opcional en el diálogo compartido y no altera la caja del modal de cotización. Medidas verificadas en 375, 768, 1024 y 1440 px.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_ADV-MODAL-COMPACT.md`, `progress/verify_ADV-MODAL-COMPACT.md`.

## 2026-10-14 — HEADER-POLISH done (1 vuelta)
- El header queda con padding vertical equilibrado y el CTA compartido termina en una píldora de altura uniforme, también en sus otros usos.
- Verificado en 375, 768, 1024 y 1440 px; transición de 450ms y estado instantáneo con reduced motion.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_HEADER-POLISH.md`, `progress/verify_HEADER-POLISH.md`.

## 2026-10-14 — HEADER-POLISH done (2 vueltas)
- Header: más aire abajo y estado final de "Agenda una reunión" con alto parejo.
- Reabierta: la entrada anterior la cerró sin verify. Vuelta 2: la pieza de unión de CtaBrandShape rellena el hueco entre píldora y círculo; estado final de alto parejo en todos los usos y sin sobrepaso a mitad de transición. Padding del header equilibrado (12/12 px).
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_HEADER-POLISH.md`, `progress/verify_HEADER-POLISH.md`.

## 2026-10-14 — PROJECTS-INDEX-GRID done (1 vuelta)
- /proyectos/: rejilla de 2 columnas en tablet y desktop.
- /proyectos/ en 1 columna en mobile y 2×2 desde md; compactación del detalle de ProjectCard por container query (@max-md) que también aplica a otras cards estrechas. Notas: el glass a 768 va justo con categorías de 2 líneas.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_PROJECTS-INDEX-GRID.md`, `progress/verify_PROJECTS-INDEX-GRID.md`.

## 2026-10-14 — ASSETS-FOLDERS done (1 vuelta)
- Imágenes ordenadas por carpeta en src/assets/images/ y hero de caso siempre en negro.
- Imágenes en src/assets/images/ (portadas-de-proyectos, slider-destacados-homepage, slider-footer, <proyecto>-images, <sección>-homepage, cabecera-links); hero de caso siempre negro; convención documentada. Menores: 13 grupos de copias idénticas por uso (las de sliders se resuelven en IMG-SLIDERS) y la barra flotante tapa parte de la ficha del hero a 375/768 (previo).
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_ASSETS-FOLDERS.md`, `progress/verify_ASSETS-FOLDERS.md`.

## 2026-10-14 — IMG-SLIDERS done (1 vuelta)
- Slider intermedio (showcase) y rueda del footer con sus grupos de imágenes de Figma.
- Showcase con las 7 imágenes únicas del grupo SLIDER INTERMEDIO (329:7330 es copia de 291:7283) y rueda del footer con las 6 laptops del grupo SLIDERS DEL FOOTER (Aloa repetida en lados opuestos porque 331:7346 = 331:7344). Duplicados de Figma anotados como P3 en content-gaps.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_IMG-SLIDERS.md`, `progress/verify_IMG-SLIDERS.md`.

## 2026-10-14 — PROCESS-STEPPER done (1 vuelta)
- Secciones con pasos: slider en modo stepper con autoplay en mobile.
- Stepper reutilizable en shared/ui sobre los sliders de UI-LIB-002: por debajo de md, 'El proceso' de la home y 'Proceso y automatización' de los casos van paso a paso con segmentos de progreso, autoplay, swipe y tap; desde md sin cambios. Menores: recorte breve durante el reveal inicial, desfase leve del relleno del segmento y vuelta del 4 al 1 hacia atrás.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_PROCESS-STEPPER.md`, `progress/verify_PROCESS-STEPPER.md`.

## 2026-10-14 — COPY-FINAL done (1 vuelta)
- Copy final de FAQ y Servicios.
- FAQ con las 18 preguntas de 328:7312 (el criterio decía 17 por error de conteo) y servicios con el copy de 130:707; título de Desarrollo actualizado; erratas evidentes corregidas y documentadas; design/copy y content-gaps coherentes.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_COPY-FINAL.md`, `progress/verify_COPY-FINAL.md`.

## 2026-10-14 — TEAM-V2 done (2 vueltas)
- Equipo: María Reina, roles actualizados y enlaces a redes profesionales.
- 6 integrantes de 291:131 (María Reina con foto real; Maicol Senior UX/UI; Maicol y Daniel con UserPlaceholder recentrado); perfiles profesionales opcionales como iconos enlazados (sin URLs reales: no se pintan, huecos por persona en content-gaps). Vuelta 2: el detalle sigue escrito con foco de teclado en los iconos (focusin/focusout).
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_TEAM-V2.md`, `progress/verify_TEAM-V2.md`.

## 2026-10-15 — ARCH-LOGOS-BADGE done (1 vuelta)
- Archivar carrusel de logos y retirar process-badge.
- Módulo logo-marquee, sus 9 SVG, su bloque de home.json y sus tokens archivados en `_archive/logo-marquee/` (con README para restaurar); fuera de sections/registry/templates. process-badge.svg archivado en `_archive/process-badge/`; el panel de proceso usa relleno simétrico sin el hueco del badge.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_ARCH-LOGOS-BADGE.md`, `progress/verify_ARCH-LOGOS-BADGE.md`.

## 2026-10-15 — TEAM-CARD-LOOP done (1 vuelta)
- Equipo: hover en las copias del carrusel infinito, datos agrupados abajo y bio a 3 líneas.
- Las copias del loop son `inert` (sin hit-testing); `bindCloneHover` (shared/lib/slider) detecta por geometría la copia bajo el puntero y le activa el detalle; `hover.ts` engancha las copias con un MutationObserver. Detalle: nombre, rol, bio (`line-clamp-typed-3`) y perfiles en un bloque abajo.
- Menores abiertos: clic reenviado desde iconos de perfil de copias sin probar (no hay URLs aún); sobre esos iconos el cursor no pasa a "mano".
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_TEAM-CARD-LOOP.md`, `progress/verify_TEAM-CARD-LOOP.md`.

## 2026-10-15 — SERVICES-IMAGES done (1 vuelta)
- Servicios: imágenes propias por disciplina (UX/UI, Branding, Email Marketing).
- UX/UI con las 3 láminas del usuario; Branding (351:28-30) y Email Marketing (352:32-34) exportadas de Figma a JPEG optimizado. Desarrollo & IA conserva sus imágenes (PENDIENTE del estudio en content-gaps). Las 9 imágenes viejas sin uso se borraron con aprobación explícita del usuario.
- Menor abierto: el recorte central corta el "03" de ux-ui-diseno-validacion.png; se puede probar `position: left`.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_SERVICES-IMAGES.md`, `progress/verify_SERVICES-IMAGES.md`.

## 2026-10-15 — SERVICES-DEV-IMAGES done (1 vuelta)
- Servicios: integrar ilustraciones vectoriales de Desarrollo & IA en el acordeón.
- Reemplazadas las capturas anteriores por ilustraciones coloridas de desarrollo/e-commerce/apps, dashboards/chatbots/analítica y automatización IA; JPEG optimizados de 1281 × 1913, con alt descriptivo en español.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_SERVICES-DEV-IMAGES.md`, `progress/verify_SERVICES-DEV-IMAGES.md`.

## 2026-10-15 — TEAM-SLIDER-CONTAINER done (1 vuelta)
- Equipo: desde lg el slider queda dentro de `container-page` (alineado con la cabecera) y recorta en sus bordes; por debajo de lg sigue a sangre para invitar al swipe.
- El recorte lo hace el propio carril (`overflow-x-auto`, equivalente visual a overflow-hidden) para conservar trackpad y teclado. Se retiró el token `--team-inset`.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_TEAM-SLIDER-CONTAINER.md`, `progress/verify_TEAM-SLIDER-CONTAINER.md`.

## 2026-10-15 — CONTACT-EMAIL-IMAGE done (1 vuelta)
- Contacto: vuelve la imagen original (dos monitores), tomada de `design/figma/assets/imgContactSection.png` porque Figma no estaba disponible. Confirmado después con Figma: es la misma de 174:73. Se guardó como `contacto-homepage/escritorio-dos-monitores.jpg` (389 kB).
- Correo `hola@bysensei.com`: `studioEmail` en site.ts (el mailto de asesoría ya tiene destinatario) y los avisos de los formularios sin endpoint. También aparece literal en home.json (contenido de CMS).
- Limpieza: 4 imágenes sin uso eliminadas (remittven-laptop, 2 de cappi-xtremo y 1 de yupa en servicios-homepage); public/ intacto.
- Orquestador: ejemplo de nombre en docs/content-model.md regla 10 actualizado.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_CONTACT-EMAIL-IMAGE.md`, `progress/verify_CONTACT-EMAIL-IMAGE.md`.

## 2026-10-15 — QTE-MODAL-FIT done (1 vuelta)
- Modal de cotización: alto según su contenido y centrado en todos los anchos. En mobile pasa de pantalla completa a tarjeta con 16 px de margen. Si el contenido no cabe, el scroll es interno y se usa un tope de alto (`--dialog-max-h-compact`).
- `ModalDialog` usa `h-fit` desde sm para los dos modales; la prop `height` se sustituye por `mobile` (`full` | `card`).
- Menor aceptado: en pantallas muy altas, cambiar el tipo de presupuesto recentra el diálogo sin animación.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_QTE-MODAL-FIT.md`, `progress/verify_QTE-MODAL-FIT.md`.

## 2026-10-15 — SEO-META done (1 vuelta)
- Estrategia de `docs/seo.md` implementada: dominio `https://bysensei.com` por defecto (SITE_URL lo sobrescribe), plantilla de título `{title} · Sensei Studio`, SEO de casos derivado del hero (article, portada 1200×630 con alt).
- Un solo grafo JSON-LD por página generado desde los datos: Organization y WebSite en todas; ProfessionalService y FAQPage en la home; CollectionPage y migas en /proyectos/; CreativeWork y migas en cada caso.
- Huecos: `sameAs` vacío hasta tener las redes reales del footer; `areaServed` por confirmar. El logo de Organization (PNG cuadrado) pasa a SEO-OG-FAVICON.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_SEO-META.md`, `progress/verify_SEO-META.md`.

## 2026-10-15 — FOOTER-LINKS-REAL done (1 vuelta)
- Footer con los textos reales de 174:27. Trabajos: Yupa, Cappi Xtremo, Remittven y Las Doñas, que enlazan a `/proyectos/<slug>/`. Redes: Instagram, LinkedIn y Behance. Nuevo copy de By Sensei y legales en español.
- 174:27 no tiene hiperenlaces y en el archivo no aparecen las URLs de las redes del estudio: `studioSocials` queda sin URL, con `meta.sameAs` conectado pero vacío, y los legales aún no tienen página (content-gaps P2).
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_FOOTER-LINKS-REAL.md`, `progress/verify_FOOTER-LINKS-REAL.md`.

## 2026-10-15 — TEAM-SOCIAL-LINKS done (1 vuelta)
- Equipo: 4 perfiles reales aplicados desde los nodos 334:7407 y 341:7413 a 341:7428: Behance de Natalia, Behance y LinkedIn de Jhoarling, LinkedIn de Victor. No hizo falta código nuevo (la vía existía desde TEAM-V2).
- En Figma las URLs están en texto plano y varias están copiadas de otra persona o son la raíz `github.com/`; esas se descartaron. Faltan: María, Maicol, Daniel, el GitHub de Victor y el LinkedIn de Natalia (content-gaps).
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_TEAM-SOCIAL-LINKS.md`, `progress/verify_TEAM-SOCIAL-LINKS.md`.

## 2026-10-15 — SEO-OG-FAVICON done (1 vuelta)
- Imagen para compartir: pieza 41:464 a 1200×630, 18 KB (`public/og-image.jpg`).
- Iconos desde 224:316: favicon.ico 32, favicon.svg, apple-touch-icon 180, icon-192/512, site.webmanifest y theme-color #090909. Logo de Organization: PNG cuadrado de 512 px.
- Menor: 224:316 es un bitmap, así que favicon.svg envuelve un PNG de 128 px; se sustituye cuando haya la "S" en vector.
- Orquestador: filas P3 de content-gaps cerradas.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_SEO-OG-FAVICON.md`, `progress/verify_SEO-OG-FAVICON.md`.

## 2026-10-15 — TESTIMONIALS-REAL done (1 vuelta, sin cambios en src/)
- Las 20 reseñas de home.json ya coincidían texto a texto y en el mismo orden con el nodo 334:7405 (comprobado por el implementer, el verifier y el orquestador). Flavio Mayorga se omite porque no tiene cita en Figma. El nodo no trae fotos ni datos de cabecera.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_TESTIMONIALS-REAL.md`, `progress/verify_TESTIMONIALS-REAL.md`.

## 2026-10-15 — TESTIMONIALS-BRAND done (1 vuelta)
- Todas las citas nombran al estudio como "Sensei Studio" (antes "La agencia" / "El estudio Sensei"), con la gramática ajustada; el resto del texto no cambia. También se actualizó design/copy/testimonials.md.
- Dominio `https://bysensei.com` confirmado por el usuario: actualizados docs/seo.md, design/content-gaps.md y el comentario de astro.config.mjs.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_TESTIMONIALS-BRAND.md`, `progress/verify_TESTIMONIALS-BRAND.md`.

## 2026-10-15 — COPY-SPELLING done (2 vueltas)
- Repaso ortográfico de todo el contenido: 12 correcciones (erratas de las citas de Mateo R. y Sofía L., Ux/Ui → UX/UI, apps/app en minúscula, EE. UU., ¿ bien colocado en la FAQ 10, punto final de Remittven, 2100px, "Políticas de privacidad"), replicadas en design/copy.
- Quedan sin aplicar, porque no son solo ortografía, las dudas listadas en el informe: "buen diseñado UX", "100 confiables", WordPress/Elementor/WeTransfer, el prefijo pos- y los espacios en los porcentajes.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_COPY-SPELLING.md`, `progress/verify_COPY-SPELLING.md`.

## 2026-10-15 — DEPLOY-STATIC done (1 vuelta)
- Build estático sin adaptador (se retiró @astrojs/node), página 404 propia y `public/.htaccess` para Apache: HTTPS, sin www, 404, caché immutable en /_astro y compresión.
- Orquestador: guía `docs/deploy.md` y script `scripts/deploy.sh` (build → tgz → ssh → respaldo → publicación → curl; con --dry-run, --skip-build y --rollback). Empaquetado probado en local: 53 MB, 824 archivos. No se desplegó: no hay permiso para conectar con producción desde la sesión.
- Menores: el canonical de 404.html apunta a /404/ (página noindex) y la regla https confía en X-Forwarded-Proto.
- `./init.ps1`: VERDE (ejecutado por el orquestador).
- Informes: `progress/impl_DEPLOY-STATIC.md`, `progress/verify_DEPLOY-STATIC.md`.

## 2026-10-16 · DEPLOY-SSL-DCV · done

- `public/.htaccess`: `/.well-known/` queda fuera de los 301 (www y http->https), también vía ErrorDocument, para que AutoSSL valide por HTTP. Informes: `progress/impl_DEPLOY-SSL-DCV.md`, `progress/verify_DEPLOY-SSL-DCV.md` (VERDE). init.ps1 verde.
- Orquestador: `scripts/deploy.sh` lee `KEY_SSH_FOR_DEPLOY`, `DOMAIN_ROOT_FOR_DEPLOY`, `DOMAIN_FOR_DEPLOY`; sube el .tgz como archivo con sha256, descomprime en `~/deploy/staging` y limpia; `scripts/deploy.ps1` para PowerShell. DNS de bysensei.com apuntado a 184.94.213.174.
- Orquestador (2026-10-16): `NOINDEX_FOR_DEPLOY` en `.env` (activo). `scripts/deploy.sh` publica una copia de dist/ con X-Robots-Tag noindex en .htaccess y robots.txt `Disallow: /`. Quitarlo para el lanzamiento.

## 2026-10-16 · DOCS-INTO-CODE · done (1 vuelta)

- Cabecera y JSDoc en todo `src/shared/ui/`, sliders, `shared/lib/motion` y `shared/lib/slider`, y contratos de barra flotante y modales en `layout/`. Solo comentarios. Informes: `progress/impl_DOCS-INTO-CODE.md`, `progress/verify_DOCS-INTO-CODE.md` (VERDE). init.ps1 verde.
- Orquestador: docs comprimidos (components 777→~90 líneas, architecture 227→120, conventions 204→~70; content-model, seo, deploy y verification reescritos). Regla nueva en CLAUDE.md: la documentación de detalle va en el código. README propio. Borrado de obsoletos preparado (lo ejecuta el usuario).
