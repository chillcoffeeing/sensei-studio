# Inventario de diseño — Figma "Agencia"

Fuente: `nIsbYsmg2bq9JJTCX1x530`
- Branding → node `1:17`
- Homepage → node `11:12` (frame "Diseño", 1440 × 10351, solo desktop)

Extraído el 2026-10-01. Material crudo en `design/figma/`:

| Archivo | Qué es |
|---|---|
| `homepage.0.txt` | Código de referencia (React+Tailwind) de toda la Homepage. **Truncado al final del FAQ** |
| *(FAQ)* | Re-extraído completo desde el nodo `174:157`: cards blancas, radio 16, padding 32/40, gap 16, pregunta 19px/500/-1%, respuesta DM Sans 16/26 `ink-muted`, botón negro de 32px con "+" de 12px. Volcado en `page-model.draft.ts` |
| `homepage-full.png` | Render completo (570 px de ancho, referencia visual baja) |
| `assets/` | 31 assets descargados (SVG + PNG). Las URLs de Figma caducan a los 7 días |
| `assets.txt` | Mapa nombre-de-constante → URL original |

> El frame no usa secciones ni auto-layout a nivel raíz: son ~25 capas con
> posición absoluta. La segmentación de abajo se hizo por posición `top`.

---

## 1. Tokens

### Color — variables de Figma (fuente de verdad)

| Variable Figma | Valor | Token propuesto |
|---|---|---|
| `principal` | `#E4FF40` | `--color-brand` |
| `negro` | `#090909` | `--color-ink` |
| `blanco` | `#FFFFFF` | `--color-paper` |
| `gris` | `#B8B8B8` | `--color-line` |
| `textos gris` | `#686868` | `--color-ink-muted` |
| `ruido general` | Effect NOISE, radius 4 | `--noise` (textura de fondo oscuro) |

### Color — valores sueltos que NO son variables (deriva)

| Valor | Usos | Dónde | Propuesta |
|---|---|---|---|
| `#0A0A0A` | 6 | color de los h2 | **= `ink`** (diferencia imperceptible, unificar) |
| `#6E6E73` | 12 | texto de reviews | nuevo token `--color-ink-soft` o unificar con `ink-muted` |
| `#AFAFAF` | 1 | parte atenuada del hero (sobre negro) | `--color-paper-muted` |
| `#1C1C1E` | 1 | — | revisar |
| `#A1A1A1` | 1 | borde del swatch blanco en Branding | solo documentación |
| `rgba(0,0,0,.04)` / `.03` | 15 | sombras de cards | dentro de `--shadow-*` |
| `rgba(255,255,255,.1/.13/.15)` | 5 | bordes/fondos de la card de contacto (glass) | `--color-glass-*` |
| Avatares: `#F2E2FE/#6C2BA1`, `#EAF7D3/#4E6B1B`, `#FEF6D2/#8A6D15`, `#FDE2E4/#A83356` | 4 pares | iniciales de reviews | `--color-avatar-{1..4}-bg/fg` |

### Tipografía

| Rol | Familia | Pesos usados | Ejes |
|---|---|---|---|
| Títulos / UI | **Google Sans Flex** | 400, 500 (dominante, 52 usos), 600, 700 | `GRAD 0, ROND 0, wdth 100` |
| Párrafos | **DM Sans** | 300, 400, 600, 700, 800 (logo) | `opsz 14` |

> En Branding también aparece Inter, pero solo en las etiquetas de la lámina; no forma parte del sistema.

**Escala de tamaños (px)** y en qué se usan:

| px | usos | rol |
|---|---|---|
| 160 | 1 | "Sensei" (logo tipográfico del hero) |
| 60 | 1 | showcase "CREATIVIDAD, TECNOLOGÍA…" |
| 45 | 10 | **h2 de sección** |
| 44 / 40 | 3 | estadísticas, "Studio." |
| 28 | 3 | títulos de servicios / footer |
| 20 | 2 | lead del hero |
| 19 | 3+ | preguntas FAQ (`tracking -0.19px` = -1%) |
| 18 | 7 | lista de servicios del hero, nav |
| 16 | 25 | **cuerpo** |
| 15 / 14 / 13 / 12 / 11 | ~50 | meta, eyebrows, cards, legal |

Interlineado: casi todo es `normal`. Excepciones: `1.5` (13), `2.23` (lista del hero), `4.28` (6, revisar), `26px` (respuesta FAQ), `16px`.

### Radios y sombras

| Valor | Usos | Token |
|---|---|---|
| 5px | 18 | `--radius-xs` (cards de proyecto) |
| 10px | 5 | `--radius-sm` |
| 16px | 23 | `--radius-md` (reviews, FAQ) |
| 20px | 12 | `--radius-lg` |
| 24px | 1 | `--radius-xl` (card de contacto) |
| 90 / 100 / 999px | 12 | `--radius-pill` (unificar) |
| `0 6px 8px rgba(0,0,0,.04)` | 12 | `--shadow-card` |
| `0 4px 6px rgba(0,0,0,.03)` | 5 | `--shadow-card-sm` (FAQ) |
| `backdrop-blur 20px` | 1 | `--blur-glass` |

### Layout

- Canvas de 1440, márgenes laterales de **60px** → contenido de **1320px**. Hay deriva de 1px (59/60, 1320/1321/1322), así que se normaliza a 60/1320.
- Los espaciados no siguen una escala: 2, 5, 10, 12, 15, 16, 20, 21, 24, 26, 30, 38, 40, 50, 51, 61, 80, 120. **Propuesta:** escala de 4px (`--spacing: 4px` de Tailwind v4), donde 15→16, 21→20, 26→24, 51→48 y 61→60. Esto implica ±1–3px respecto a Figma, así que hace falta tu decisión (ver §4).

---

## 2. Secciones de la Homepage

| # | `type` propuesto | Capas Figma | Contenido |
|---|---|---|---|
| — | *(layout)* header | `16:48` | Logo, nav (Studio, Proyectos, Cotización), CTA "Agenda una reunión" + botón flecha |
| 1 | `hero` | `11:13` `16:53` `11:41` `11:25` `11:24` | Fondo negro con ruido, wordmark "Sensei Studio.", lista de 5 servicios, lead en dos tonos, regla lima |
| 2 | `logo-marquee` | `17:553` | 9 logos (Adobe, airbnb, Opendoor, Evernote, pipedrive, Fivetran, afterpay, …), cortados a los lados → **marquee animado** |
| 3 | `project-gallery` | `32:82` `31:59` | Eyebrow, h2, link "VER TODOS LOS PROYECTOS +", grid 2×3 (imagen + pill con nombre y categoría) |
| 4 | `stats` | `31:19` | Eyebrow "POR QUÉ ELEGIRNOS", h2 en dos tonos, descripción con lead en negrita, 4 métricas |
| 5 | `process` | `35:132` `31:42` | Bloque negro "NUESTRO PROCESO 4 PASOS" + badge circular giratorio. **Los pasos no están diseñados** |
| 6 | `services` | `31:60` | Eyebrow, h2 en dos tonos, descripción, 4 filas (¿acordeón?) |
| 7 | `showcase` | `35:130` | Fondo negro, título de 60px, carrusel horizontal de proyectos |
| 8 | `testimonials` | `35:150` `174:190` | Eyebrow, h2 en dos tonos, prueba social (avatares, "56+", ★★★★★), CTA, masonry de 4 columnas con fade |
| 9 | `team` | `41:404` | Eyebrow, h2 en dos tonos, descripción, 4 cards de foto (2 son placeholders negros) |
| 10 | `faq` | `41:406` `174:157` | Eyebrow, h2 en dos tonos, acordeón de 5 preguntas |
| 11 | `contact` | `174:73` | Imagen de fondo, card glass: "Let's talk.", form (Nombre, Empresa, Email), botón, legal |
| — | *(layout)* footer | `174:26` `174:72` | 4 columnas (Páginas, Trabajos, Redes, By Sensei) + galería de 4 imágenes rotadas |

### Patrón común de cabecera de sección

Se repite en las secciones 3, 4, 6, 8, 9 y 10:

```
● EYEBROW            ← punto lima + texto en mayúsculas de 12px
h2 parte 1 [parte 2 en gris]   ← 45px Google Sans Flex 500, dos tonos
                      descripción a la derecha:  **lead en ink** + resto en gris
```

Por eso en el modelo `h2` y `headingDescriptions` no son strings planos: tienen partes con tono.

### Islas Svelte necesarias

| Isla | Motivo |
|---|---|
| `LogoMarquee` | Desplazamiento infinito. Podría hacerse solo con CSS, en cuyo caso no hace falta isla |
| `ShowcaseCarousel` | Arrastre y scroll horizontal |
| `FaqAccordion` | Abrir y cerrar preguntas |
| `ServicesAccordion` | Si las filas se expanden (por confirmar) |
| `ContactForm` | Validación y envío |
| Badge giratorio | Solo CSS (`@keyframes`), sin isla |

---

## 3. Problemas de contenido en el diseño

1. **Idioma mezclado:** FAQ, "Let's talk.", footer ("An independent studio…") y legal están en inglés; el resto en español.
2. **Typos:** "averageю" (ю cirílica) en la respuesta del FAQ, "anthopoly" → "Anthropology", "ESTRATEGÍA" → "ESTRATEGIA".
3. **Testimonios de otro producto:** hablan de "el curso", "curso de Javier", "UX Writing". No son reseñas de la agencia. Además hay 4 duplicados (Kevin, Denia, Tracy y Mariana aparecen dos veces).
4. **Proyectos placeholder:** las 6 cards dicen "Dass design anthopoly / Web Design" con 2 imágenes repetidas.
5. **Proceso sin diseñar:** el bloque "NUESTRO PROCESO 4 PASOS" está vacío.
6. **Equipo incompleto:** 2 de 4 cards son negras y solo Natalia tiene nombre y rol.
7. **FAQ:** solo la 1ª pregunta tiene respuesta.
8. **Footer:** "Horizon, Vertex Labs, Aurelius, Montegrapa" parecen placeholders.
9. **No hay diseño mobile ni tablet.**

---

## 4. Decisiones pendientes

| # | Pregunta | Opciones |
|---|---|---|
| D1 | Exactitud de espaciado | (a) valores exactos de Figma como tokens arbitrarios · (b) normalizar a escala de 4px (±1–3px) |
| D2 | `#0A0A0A` y `#6E6E73` | unificar con `ink` / `ink-muted` o crear tokens nuevos |
| D3 | Responsive | ¿hay diseño mobile o lo deduzco yo? |
| D4 | Contenido placeholder (§3) | ¿lo implemento tal cual o esperas el copy real? |
| D5 | Servicios | ¿las filas se expanden o son estáticas? |
