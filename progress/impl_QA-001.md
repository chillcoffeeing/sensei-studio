# impl QA-001: pase final de SEO, rendimiento y responsive de la Homepage

Primera vuelta. No hay `figmaNodes` propios: la fidelidad por sección ya la cerró cada SEC-*. Esta vez se revisa la
página ensamblada y el `<head>`.

## Archivos

- `astro.config.mjs`: `site: process.env.SITE_URL || PLACEHOLDER_SITE`, con `PLACEHOLDER_SITE = 'https://dominio-por-confirmar.example'` (marcado como PUNTO A CONFIRMAR).
- `src/core/site.ts`: tipos `ShareImage` y `SiteMeta` (nombre, locale, imagen para compartir); `SiteChrome.meta`.
- `src/core/seo.ts` (nuevo): funciones puras `absoluteUrl`, `buildSitemap` y `buildRobots`.
- `src/pages/sitemap.xml.ts` (nuevo): endpoint prerenderizado; incluye las páginas sin `noindex` con URL absoluta.
- `src/pages/robots.txt.ts` (nuevo): endpoint prerenderizado `User-agent: * / Allow: / / Sitemap: <abs>`.
- `src/layout/BaseLayout.astro`: canonical y og:url siempre absolutas; `og:site_name`, `og:image` absoluta (la de la página o la del sitio), `og:image:width/height/alt`, `twitter:card=summary_large_image`, `twitter:title/description/image/image:alt`, `<link rel="sitemap">`. Google Fonts se carga sin bloquear el render.
- `src/content/site.ts`: `meta` (Sensei Studio · es_ES · `/og-image.jpg` 1200×630). En el header, "Studio" pasa de `/#studio` (ancla inexistente) a `/#equipo`.
- `public/og-image.jpg` (nuevo, 48 KB): captura del hero real (header + wordmark + servicios + lead + regla lima). Se tomó a 1621×851 (el hero completo de 2xl) y se redujo a 1200×630. Va en `public/` porque los scrapers de OG la piden por URL fija y no debe llevar hash.
- `tests/seo.test.ts` (nuevo): robots y sitemap; `meta` (con el archivo existente en `public/` y tamaño 1200×630); `site` definido en `astro.config`; **todos los `href` `/#…` del header, del footer y del contenido de la home (CTAs incluidos) apuntan a un id de sección real**, y los internos sin ancla solo apuntan a `/`.
- `feature_list.json`: QA-001 → `in_progress`. `progress/current.md`: plan.

Sin dependencias nuevas en el proyecto: sitemap y robots son endpoints propios, no `@astrojs/sitemap`. Lighthouse y
puppeteer-core se instalaron solo en el scratchpad de la sesión, fuera del repo.

Tokens: ninguno agregado ni modificado (no se tocó CSS).

## Enlaces internos (header, CTAs, footer)

Ids de la home: `inicio, clientes, proyectos, por-que-elegirnos, proceso, servicios, destacados, testimonios, equipo, faq, contacto`.

| Origen | Texto | href | Estado |
|---|---|---|---|
| Header nav | Studio | `/#studio` → **`/#equipo`** | **corregido** |
| Header nav | Proyectos | `/#proyectos` | ok |
| Header nav | Cotización | `/#contacto` | ok |
| Header CTA | Agenda una reunión | `/#contacto` | ok |
| Header logo | — | `/` | ok |
| Proyectos CTA | VER TODOS LOS PROYECTOS | `/#proyectos` | ok (autoenlace; no hay página de proyectos) |
| Testimonios CTA | Déjanos un comentario | `/#contacto` | ok |
| Footer · Páginas | Inicio / Nosotros / Proyectos / Contacto | `/#inicio` `/#equipo` `/#proyectos` `/#contacto` | ok |
| Footer · Trabajos | 4 nombres | `/#proyectos` | ok |
| Contacto legal | Terms / Privacy Policy | `https://example.com/…` | externos, placeholder de Figma (ver puntos a confirmar) |

**Por qué "Studio" va a `/#equipo`.** En una agencia, "Studio" en el nav es "quiénes somos". La sección que presenta
al estudio es "El equipo · Las personas detrás de cada proyecto", y el footer ya lleva "Nosotros" ahí. Las
alternativas descartadas son `/#por-que-elegirnos` (métricas: habla de resultados, no del estudio) y `/#servicios`
(ya cubierto por el hero). Cambiarlo es una línea en `src/content/site.ts`, y el test lo valida contra los ids.

## SEO (HTML generado, `dist/client/index.html`)

```
<link rel="canonical" href="https://dominio-por-confirmar.example/">
og:site_name=Sensei Studio · og:locale=es_ES · og:type=website · og:title · og:description
og:url=https://dominio-por-confirmar.example/
og:image=https://dominio-por-confirmar.example/og-image.jpg (+ width 1200, height 630, alt)
twitter:card=summary_large_image · twitter:title · twitter:description · twitter:image · twitter:image:alt
<link rel="sitemap" href="/sitemap.xml">
```

`robots.txt`: `User-agent: * · Allow: / · Sitemap: https://dominio-por-confirmar.example/sitemap.xml`.
`sitemap.xml`: un `<url>` con `https://dominio-por-confirmar.example/`.

**Dominio.** No hay dominio de producción en el repo; solo el plan archivado (`_archive/`) dice "confirmar el dominio
canónico". Por eso se usa un marcador `.example` (TLD reservado, RFC 2606), que nunca resuelve y no se confunde con
un dominio real. Para publicar: `SITE_URL=https://<dominio> pnpm build`, o cambiar la constante en `astro.config.mjs`.
Con el marcador, canonical, og:url, og:image, robots y sitemap apuntan a una URL que no existe. **No publicar sin
definirlo.**

h1 y keywords sin cambios: el h1 es `Sensei Studio: diseño, desarrollo y automatización con IA` (sr-only dentro del
wordmark), con title de 58 caracteres y description de 134. Keywords: `agencia de diseño web, desarrollo web,
automatización con IA, branding, Sensei Studio`. Quedan para revisar con el cliente.

## Rendimiento

### Lighthouse 13 (Edge 154 headless, contra `dist/client` servido con gzip en local)

| | Performance | Accesibilidad | Best practices | SEO | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|---|---|
| Mobile (antes del cambio de fuentes) | **89** | 100 | 100 | 100 | 2.8 s | 2.9 s | 0 ms | 0 | 3.9 s |
| **Mobile (final)** | **98** | **100** | **100** | **100** | 1.0 s | 1.4 s | 170 ms | 0.009 | 1.0 s |
| **Desktop (final)** | **100** | **100** | **100** | **100** | 0.2 s | 0.5 s | 0 ms | 0.003 | 0.2 s |

- **Causa del 89.** La hoja de Google Fonts bloqueaba el render unos 880 ms (render-blocking-insight), y el LCP (el
  hero `#inicio`: wordmark y lead, que es texto) arrastraba 2.3 s de *render delay*.
- **Arreglo.** `preload as=style` + `<link rel=stylesheet media=print onload="this.media='all'">` + `<noscript>`.
  Como ya se usa `display=swap`, el texto se pinta antes con la fuente de sistema. El intercambio de fuente deja un
  CLS de 0.009 en mobile, muy por debajo de 0.1.
- **Diagnósticos que quedan (menores):**
  - `image-delivery-insight`: unos 13 KiB en una imagen de proyectos (655×450 servida para 523×261 a DPR 1.75).
  - `render-blocking`: solo el CSS propio (18 KB gz, unos 130 ms).
  - `max-potential-fid`: 150 ms por la hidratación de las islas.
  - `astro check` da un *hint* (no un warning) ts(6133) por el `this.media` del atributo `onload`. Es inocuo.
- **Limitación.** Es una medición local, sin red real ni CDN. Conviene repetirla contra el dominio de producción.

### Peso (CDP, caché desactivada, transferido con gzip)

| Viewport | Carga inicial | Tras recorrer la página | Peticiones |
|---|---|---|---|
| 375 @2x | 202 KiB (HTML 21.5 · CSS 20.2 · JS 17.7 · fuentes 72 · img 69) | 363 KiB (img 223) | 29 → 45 |
| 1440 @1x | 193 KiB | 334 KiB (img 197) | 30 → 46 |

- **JS total: 24.5 KiB gz.** Runtime de Svelte 15.0 + 6 islas: MobileMenu 1.8, ServicesAccordion 1.9,
  FaqAccordion 1.4, ShowcaseScroller 1.2, ContactForm 2.0 y accordion 0.4. Al inicio solo carga el menú
  (`client:load`, 17.7 KiB). El resto hidrata `client:visible`.
- **HTML:** 232 KB sin comprimir, 21.5 KiB con gzip. Pesa sobre todo por las 20 reseñas y los SVG.
- **Imágenes:** la más pesada es el fondo de contacto (webp: 38.6 KiB en mobile, 56.9 en desktop). Todas las de
  contenido salen en avif/webp con `srcset`, y debajo del pliegue llevan `loading="lazy"`.
- **LCP candidato:** el texto del hero (`section#inicio`), no una imagen. No hace falta precargar imágenes.

## Revisión responsive de la página completa

Con Edge headless se recorrió la página, haciendo scroll para disparar el lazy loading. Se miraron `scrollWidth`,
los elementos fuera del viewport, el orden y el fondo de las secciones, los headings, los objetivos táctiles y las
imágenes sin `alt`. También se revisaron las capturas completas.

| Viewport | scrollWidth | Scroll horizontal | Alto total | `img` sin alt |
|---|---|---|---|---|
| 375 | 375 | no | 10134 | 0 |
| 768 | 768 | no | 11977 | 0 |
| 1024 | 1024 | no | 9904 | 0 |
| 1280 | 1280 | no | 9977 | 0 |
| 1440 | 1440 | no | 10608 | 0 |

- **Orden y transiciones (1440).** header ink 0–52 → hero ink 52–851 (regla lima en el borde) → logos 851 →
  proyectos 944 → por qué elegirnos 2718 → proceso (tarjeta ink) 3379 → servicios 4082 → showcase (banda ink)
  5367 → testimonios 6391 → equipo 7640 → FAQ 8340 → contacto (foto) 9266 → footer ink 9888–10608. No hay huecos
  ni solapes entre secciones. Header, hero y footer comparten la superficie ink con ruido, y el resto va sobre el
  fondo claro con el ritmo de `pt-(--<sección>-pad-top)` de cada módulo. Es coherente a 375, 768 y 1024, y no se
  tocó ningún espaciado.
- **Headings.** Un solo `h1` (hero). Hay un `h2` por sección: proyectos, stats, proceso, servicios, showcase,
  testimonios, equipo, FAQ y contacto, más los 4 títulos de columna del footer. Los `h3` van dentro de su `h2`
  (proyectos ×6, pasos ×4, servicios ×4, Natalia, preguntas ×5) y no se salta ningún nivel. Los logos no llevan
  heading porque su etiqueta es una lista con `aria-label`.
- **Objetivos de menos de 24px.**
  - Mobile: solo Terms y Privacy, que van en línea dentro de una frase (excepción de WCAG 2.5.8).
  - lg+: además, los enlaces del nav (20px de alto) y los CTA de texto "VER TODOS LOS PROYECTOS" y "Déjanos un
    comentario" (20px). Tienen separación de sobra (excepción por espaciado) y son de puntero fino. No bloquea;
    se deja como está, igual que en Figma.

## Puntos a confirmar con el cliente (consolidado)

**SEO y publicación**
1. **Dominio de producción** (bloquea la publicación): sustituir `https://dominio-por-confirmar.example` por `SITE_URL`.
2. **h1, title, description y keywords:** validar la propuesta actual (ver arriba) y la intención de búsqueda.
3. **Imagen para compartir:** hoy es una captura del hero. ¿Se quiere una pieza de diseño propia de 1200×630?
4. **"Studio" del header → `/#equipo`:** confirmar el destino (alternativa: `/#por-que-elegirnos`).

**Contenido placeholder de Figma**
5. Proyectos: "Dass design anthopoly" / "Web Design" ×6 con dos imágenes alternas (SEC-PROJECTS).
6. Footer · Trabajos (Horizon, Vertex Labs, Aurelius, Montegrapa) y "VER TODOS LOS PROYECTOS", que hoy llevan a `/#proyectos`.
7. Equipo incompleto: faltan nombre, rol y foto de 3 integrantes (SEC-TEAM).
8. FAQ: las respuestas 2–5 son provisionales, y "On average." parece una frase cortada (SEC-FAQ).
9. Imágenes de servicios: el placeholder de Figma se repite ×3 (SEC-SERVICES).
10. Showcase: "ESTRATEGÍA" de Figma se escribe "estrategia" (SEC-SHOWCASE).
11. Testimonios: erratas y nombres "La agencia" / "El estudio Sensei" dentro de las citas, que no se corrigieron;
    "Trusted by clients worldwide" va en inglés dentro de la imagen; el CTA "Déjanos un comentario" lleva a
    `/#contacto` (SEC-TESTIMONIALS).

**Enlaces y destinos**
12. Terms y Privacy Policy apuntan a `https://example.com/…`: faltan las páginas legales (SEC-CONTACT).
13. URLs de Instagram, LinkedIn y Twitter: faltan, y hoy se muestran sin enlace (SEC-FOOTER).
14. License y Style Guide, y el doble crédito "By Sensei Studio": es copy de plantilla (SEC-FOOTER).

**Formulario**
15. Backend de contacto: no hay endpoint, así que el formulario valida y avisa de que no envía. Falta decidir si
    "Empresa" es obligatoria, revisar los mensajes de validación (redactados por el implementer) y validar el color
    de error (`--color-danger`, @derived) (SEC-CONTACT).

**Idioma y accesibilidad**
16. Idioma mezclado: FAQ, "Let's talk.", el legal y la columna "By Sensei" del footer están en inglés (declarados con `lang="en"`).
17. Contraste en el footer: `ink-muted` sobre ink da 3.57:1 en textos de 12–13px (no cumple AA). Se respeta Figma (SEC-FOOTER).
18. Carril del equipo sin arrastre con ratón: con un ratón sin rueda horizontal cuesta ver el contenido cortado (SEC-TEAM).

## init.ps1

```
[OK] node v22.20.0 · pnpm v11.1.3 · pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[OK] check:ds   → 364 tokens · 0 ds-allow · 0 error(es)  (warn previo: 94 tokens sin uso aparente)
[OK] check:arch → 65 archivos · 11 módulos · 0 error(es)
[OK] astro check → 0 errors · 0 warnings (1 hint ts6133 en el onload de fuentes)
[OK] vitest     → 18 archivos · 167 tests
[OK] astro build
VERDE: todo en orden.
```
