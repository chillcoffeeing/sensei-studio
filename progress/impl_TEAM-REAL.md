# impl TEAM-REAL — Equipo: perfiles reales

Figma `flzA0qnj6JdalFCgyB2PdI` · 291:131 (get_design_context con screenshot). 6 cards en Figma;
la 3.ª (Jhoarling duplicada con la foto de relleno) no se construye → 5 integrantes en el orden pedido.

## Archivos

- `src/assets/team/natalia-reina.jpg` — reemplazada por la foto de 291:133 (antes, otra toma apaisada), recortada al encuadre de Figma (top 4,17 %).
- `src/assets/team/jhoarling-reina.jpg` — nueva, de 291:137 (recorte centrado).
- `src/assets/team/victor-veliz.jpg` — nueva, de 291:145 (PNG RGBA → JPG, recorte centrado).
- `src/assets/brand/sensei-logo.svg` — borrado (sin referencias; menor de verify_HOME-NO-STOCK). La carpeta `brand/` queda vacía y desaparece.
- `src/modules/team/schema.ts` — un solo `teamMemberSchema` (sin `kind`; `photo` opcional). Fuera `TeamPerson`/`TeamPlaceholder`.
- `src/modules/team/index.ts` — exporta `TeamContent`, `TeamMember`, `TeamSection`.
- `src/modules/team/Section.astro` — todas las diapositivas son `TeamCard` con "n de 5".
- `src/shared/ui/TeamCard.astro` — sin foto, `UserPlaceholder tone="dark"` dentro de `data-team-photo` (recibe el mismo blur/escala del hover).
- `src/shared/ui/TeamCardPlaceholder.astro` — borrado (sin uso: ya no hay huecos).
- `src/shared/ui/UserPlaceholder.astro` — prop `tone?: 'light' | 'dark'` (`bg-neutral-200` / `bg-neutral-500`).
- `src/shared/ui/types.ts` — `TeamCardData.photo` opcional.
- `src/shared/ui/team-card-image.ts` — comentario (ya no lo usa TeamCardPlaceholder).
- `src/content/data/pages/home.json` — 5 integrantes con rol, empresa, bio y foto (Maicol y Daniel sin foto).
- `src/content/ui-catalog.ts`, `src/pages/componentes.astro` — muestra de TeamCard con y sin foto; slider sin placeholders; fuera la entrada TeamCardPlaceholder.
- `docs/components.md`, `docs/architecture.md` — fichas y API del módulo al día.
- `design/content-gaps.md` — resumen #10 y sección Equipo: bios provisionales (P2), fotos de Maicol/Daniel (P2), "en Sensei Studio" (P3).
- `progress/current.md` — plan.

## Tokens

Ninguno agregado ni quitado. `bg-neutral-500` es utilidad nativa de Tailwind.

## Decisiones

- **Fotos pre-recortadas** al aspecto de la card (344:423) con el encuadre de Figma, a 1032 px de ancho (Victor 978, su original): el recorte `cover` del servidor queda neutro y los originales de 7 MB no entran al repo (~90 kB cada uno).
- **Sin foto → silueta en tono oscuro** (desviación de Figma, que repite una foto de relleno de otra persona): `bg-neutral-500` + scrim 40 % deja el texto blanco del reposo en ~9,6:1 (≈6:1 sobre la silueta); con `bg-neutral-200` no llegaba a AA.
- **Bios provisionales** (una frase, tono del sitio): Natalia conserva la suya; Jhoarling (visión de producto), Victor (diseño a código), Maicol (productos web de punta a punta), Daniel (interfaces, datos y servicios).
- Responsive: sin cambios de layout; la card sigue en `--team-card-w` (260 → 344) y los roles más largos ("Product Head UX/UI designer", "Full Stack Development Lead") caben en una línea a 260 px. Slider y hover no cambian (5 cards: más carril para el autoplay por pasos; el typewriter y reduced-motion siguen en hover.ts).
- Revisión visual en navegador: no pude levantar captura headless (el preview no era accesible desde el sandbox); queda para el verifier.

## init.ps1

check:ds, check:arch, tipos y `astro build` OK → "VERDE: todo en orden."
