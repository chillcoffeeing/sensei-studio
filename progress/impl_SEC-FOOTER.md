# impl SEC-FOOTER — Footer (chrome)

Vuelta 1. Fuente de diseño: **el MCP de Figma no está disponible en esta sesión** (no hay
herramienta `get_design_context` y el conector de Figma pide autenticación). Por eso se usó la
exportación local: `design/figma/homepage.0.txt` (nodos 174:26–174:59 y 174:67–174:70, líneas
863–988) y `design/figma/homepage-full.png` (recorte del footer). No hay `design/copy/` del
footer, así que el copy es el de Figma.

## Archivos

- `src/layout/Footer.astro` — nuevo: footer chrome (nav con 3 columnas + columna del estudio + galería decorativa).
- `src/layout/BaseLayout.astro` — monta `<Footer footer={site.footer} />` después del `<slot />`.
- `src/core/site.ts` — tipos `SiteFooter`, `FooterLinkColumn`, `FooterLink` (href opcional), `FooterStudio`, `FooterCredit`; `SiteChrome.footer`.
- `src/content/site.ts` — datos del footer (copy de Figma 174:29–174:58, galería 174:67–174:70).
- `src/assets/footer/gallery-toy-block.png` — copia de `imgGalleryCard1.png` (174:67).
- `src/assets/footer/gallery-portrait.png` — copia de `imgGalleryCard2.png` (174:68).
- `src/assets/footer/gallery-handheld-console.png` — copia de `imgGalleryCard3.png` (174:69).
- `src/assets/footer/gallery-poster.png` — copia de `imgGalleryCard4.png` (174:70).
- `src/assets/footer/meta-divider.svg` — copia de `imgLine.svg` (línea de 174:57 entre License y Style Guide).
- `src/styles/tokens.css` — grupo nuevo "Footer" (abajo) y nota de decisión en `--color-ink-muted`.
- `tests/site.test.ts` — 6 tests nuevos del footer (columnas, anclas existentes en la home, hrefs no vacíos, estudio, galería de 4, navLabel).
- `docs/design-system.md` — regenerado (`pnpm docs:ds`).
- `feature_list.json` — SEC-FOOTER → `in_progress`; `progress/current.md` — plan.

## Tokens agregados (todos en `/* === Footer … === */`)

| Token | Valor | Origen |
|---|---|---|
| `--footer-pad-top` | `clamp(64px, … , 100px)` | @figma 174:26 pt 100 · @derived 64 a 375 |
| `--footer-pad-x` | `clamp(16px, … , 100px)` | @figma 174:26 px 100 · @derived 16 a 375 (= gutter-base) |
| `--footer-gap` | `clamp(48px, … , 80px)` | @figma 174:26 gap 80 · @derived 48 a 375 |
| `--footer-cols` | `minmax(0, 1fr) var(--spacing-360)` | @figma 174:27 (3 × flex-1 dentro del nav) + 174:48 w 360 |
| `--footer-gallery-unit` | `clamp(0.5px, … , 1px)` | @figma escala 1 a 1440 · @derived 0.5 a 375 |
| `--footer-gallery-w` | `1440u` | @figma 11:12 canvas (los left de las tarjetas son x de canvas) |
| `--footer-gallery-h` | `208.866u` | @figma 174:59 |
| `--footer-pad-bottom` | `80u` | @figma 174:26 pb 80 · @derived escala con la galería |
| `--footer-card-{1..4}-{x,y,w,h}` + `-rotate` (1, 3, 4) | `calc(… * u)` con los números crudos de Figma | @figma 174:67–174:70 (caja rotada + tamaño de tarjeta + giro −6°, 15.17°, 39.41°) |

Los `y` se miden desde la parte superior del hueco 174:59 (720 − 80 − 208.866 = 431.134 dentro de
174:26). Los `x/y` de las tarjetas giradas son la esquina de la tarjeta sin rotar centrada en la caja
rotada de Figma; el cálculo queda escrito en el propio `calc()`.

Tokens existentes reutilizados: `text-overline` (174:29), `text-title` (174:31), `text-body-lg`
(174:51), `text-meta` (174:53), `ink-muted`, `paper`, `brand` (hover), `radius-card` (16),
`spacing-{12,16,24,40,360,720}`, `max-w-page`, `surface-noise`.

## Decisiones

- **Fondo con ruido**: el código de 174:26 solo dice `bg #090909`, pero en `homepage-full.png` el
  fondo del footer mide media 16.8 / desviación 2.08, idéntico al hero con ruido (16.8 / 2.10); el
  showcase plano mide 9.0 / 0. Se usa `bg-ink surface-noise`, como el header y el hero.
- **Galería**: decorativa (`aria-hidden`, `alt=""`), tarjetas `absolute` dentro de una capa de
  1440u centrada; el footer recorta con `overflow-clip`. `<Picture>` avif/webp + jpg (las 4 PNG son
  opacas), `widths [303, 606]`, `loading="lazy"`.
- **Línea entre License y Style Guide**: `<img>` del SVG de Figma girado 90° en una caja de 0×10 con
  gap 12 a cada lado, como 174:55/174:57.
- **Títulos de columna** como `h2` (uppercase por CSS; el copy está en minúsculas en `content`).
- **Idioma**: la columna "By Sensei" está en inglés en Figma → `lang="en"` en esa columna, como FAQ y contacto.

### Enlaces (todos a anclas existentes de la home; lo comprueba `tests/site.test.ts`)

| Texto | href |
|---|---|
| Inicio | `/#inicio` |
| Nosotros | `/#equipo` |
| Proyectos | `/#proyectos` |
| Contacto | `/#contacto` |
| Horizon, Vertex Labs, Aurelius, Montegrapa | `/#proyectos` (no hay páginas de caso) |
| Instagram, LinkedIn, Twitter | sin `href`: texto plano (no hay URLs de perfiles; no se inventan) |
| License, Style Guide | sin `href`: texto plano (no existen esas páginas) |

## Responsive inferido

- Columnas: < md, nav de 2 columnas (Páginas | Trabajos, Redes debajo) y el estudio en otra fila;
  md–lg, nav de 3 columnas y el estudio debajo (max-w 360); xl+, la rejilla de Figma
  (nav 1fr con 3 columnas iguales + 360, gaps de 40).
- Gaps: columnas 24 (mobile) / 40 (md+); filas 40 (= gap de 174:50).
- Galería: toda la composición escala con `--footer-gallery-unit` (0.5 a 375 → 1 a 1440) y se centra;
  en mobile se ven la 2.ª y la 3.ª tarjeta y la 1.ª/4.ª quedan recortadas a los lados.
- `2xl:min-h-720` (174:26); por debajo el alto lo da el contenido.

## Medido (Chrome headless, build de producción, fuentes cargadas)

| Viewport | Alto footer | Scroll horizontal | Notas |
|---|---|---|---|
| 1440 | **720** | no | columnas en x 100 / 393.33 / 686.67 (ancho 253.34) y estudio en x 980 (360); títulos en y 100; tarjetas (caja girada) en 55/482 · 437/403 · 789/403 · 1076.41/540.45, tamaños 315.31×268.07 · 302.08×247.28 · 317.87×283.47 · 347.57×340.83 = Figma ±0.03 |
| 1280 | 660 | no | 4 columnas (nav 3 × 208 + 360) |
| 1024 | 855 | no | nav de 3 columnas + estudio debajo |
| 768 | 794 | no | ídem |
| 375 | 893 | no | nav 2 columnas, estudio a ancho completo (343) |

Capturas comparadas con el recorte de `homepage-full.png`: misma composición, saltos de línea de la
descripción ("…design, / code, and motion…") y posición de las tarjetas.

## Puntos a confirmar

1. **Contraste**: títulos de columna (12px) y meta (13px) en `ink-muted` #686868 sobre ink dan
   3.57:1 (no cumplen AA para texto pequeño). Se respeta Figma; la alternativa es `line` (10.04:1).
2. **URLs de redes sociales** (Instagram, LinkedIn, Twitter): faltan; hoy se pintan sin enlace.
3. **Trabajos** (Horizon, Vertex Labs, Aurelius, Montegrapa): parecen placeholders (INVENTORY §3.8);
   llevan a `/#proyectos`.
4. **"Nosotros" → `/#equipo`**: alternativa `/#por-que-elegirnos`.
5. **License / Style Guide** y el doble crédito "By Sensei Studio": copy de plantilla, en inglés.
6. **Header (fuera de alcance, no tocado)**: el enlace "Studio" del header apunta a `/#studio`, y en
   la home no hay ninguna sección con ese id. Hay que decidir el destino en una feature del header.

## init.ps1

```
[OK] node · pnpm · pnpm install
[OK] maximo UNA feature in_progress (hay 1) · estados validos · dependsOn
[OK] check:ds  → 364 tokens · 0 ds-allow · 0 error(es)  (warn: tokens sin uso previos)
[OK] check:arch → 62 archivos · 11 módulos · 0 error(es)
[OK] astro check → 0 errors · 0 warnings
[OK] vitest
[OK] astro build
VERDE: todo en orden.
```
