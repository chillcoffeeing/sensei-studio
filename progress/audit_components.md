# Auditoría: bloques aún no extraídos a componente propio (2026-10-09)

Criterio: markup con identidad propia (un bloque del diseño, un ítem repetido con más de un nodo
o lógica/estado propio) que hoy vive inline dentro de otro archivo. No se cuentan los `Section.astro`
que solo colocan bloques ni los `.map` de una línea que ya renderizan un componente.

## A. Duplicación real (prioridad alta)

| # | Dónde | Bloque inline | Propuesta |
|---|---|---|---|
| A1 | 13 archivos de `modules/project/` | `lines.map((line) => <span class="block">{line}</span>)` repetido en títulos, claims y notas | `project/TextLines.astro` (prop `lines`) |
| A2 | `contact/ContactForm.svelte` | snippets `field()` y `message()`: label oculto + input/textarea + error | `ContactInputField.svelte`, `ContactMessageField.svelte` |

## B. Ítems repetidos inline (prioridad media)

| # | Dónde | Bloque inline | Propuesta |
|---|---|---|---|
| B1 | `layout/Footer.astro:53-65` | columna de nav (overline + lista de enlaces) | `FooterNavColumn.astro` |
| B2 | `layout/Footer.astro:68-83` | bloque estudio (descripción + créditos + legales) | `FooterStudio.astro` |
| B3 | `layout/Footer.astro:94-111` | tarjeta de la galería (slot + Picture) | `FooterGalleryCard.astro` |
| B4 | `testimonials/Section.astro:94-113` | columna masonry (pista con lista duplicada aria-hidden) | `MasonryColumn.astro` |
| B5 | `logo-marquee/Section.astro` | mitad de la pista + logo | `LogoMarqueeTrack.astro` |
| B6 | `shared/ui/ProjectCard.astro` | métrica glass (dt/dd + icono) y pill de reposo | `ProjectCardMetric.astro`, `ProjectCardPill.astro` |
| B7 | `shared/ui/TrustBadge.astro` | pila de avatares + contador; estrellas | `AvatarStack.astro`, `RatingStars.astro` |
| B8 | `services/ServiceRow.svelte:71-106` | lista con viñetas; imagen `<picture>` con sources | `ServiceBullets.svelte`, `ServiceImage.svelte` |
| B9 | `project/SolutionPackagingSlider.astro` | puntos del slider (botón con 2 imágenes) | `PackagingSliderDots.astro` |

## C. Bloques de diseño dentro de un contenedor (prioridad media-baja)

| # | Dónde | Bloque inline | Propuesta |
|---|---|---|---|
| C1 | `hero/Section.astro` | video de fondo + velo; wordmark del h1 | `HeroBackgroundVideo.astro`, `HeroWordmark.astro` |
| C2 | `contact/Section.astro:73-90` | párrafo legal con enlaces en pestaña nueva; fondo + velo | `ContactLegal.astro`, `ContactBackdrop.astro` |
| C3 | `project/ProjectHero.astro` | portada (Picture + sombra); identificación (volver/estado/h1/categoría) | `HeroCover.astro`, `HeroIdentity.astro` |
| C4 | `project/SolutionStoreDesktop.astro` | barra de navegador; menú de tienda; beneficios | `StoreBrowserBar.astro`, `StoreMenu.astro`, `StoreBenefits.astro` |
| C5 | `project/SolutionStoreMobile.astro` | ficha de producto (nombre, detalles, colores, tallas, CTA) | `StoreMobileProduct.astro` |
| C6 | `project/ProcessIntro.astro` | ruta "estrategia → diseño → producto" | `ProcessRoute.astro` |
| C7 | `layout/quote/QuoteBudget.svelte` | campo de monto máximo (label + input + error) | `QuoteBudgetMax.svelte` |
| C8 | `layout/quote/QuoteProject.svelte` | textarea de idea con ayuda; grupo de objetivos | `QuoteIdea.svelte`, `QuoteGoals.svelte` |
| C9 | `shared/ui/TeamCard.astro` | capa de reposo y capa de detalle | `TeamCardRest.astro`, `TeamCardDetail.astro` |
| C10 | `layout/Header.astro:48-58` | nav de escritorio | `HeaderNav.astro` |

## Ya bien aislado (sin cambios)

Modal de cotización (`layout/quote/*`), barra flotante, secciones de proyecto Results/Context/Scope/
Closing, process/stats/faq/team/showcase/project-gallery del home, MobileMenu, FooterWheel.
