# Verify TEAM-REAL — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V2] Placeholder de Maicol y Daniel: la silueta (`w-3/4 max-w-48`, apoyada abajo) deja la cabeza
  en la mitad inferior de la card y el cuerpo queda casi entero detrás del nombre y el rol
  (src/shared/ui/UserPlaceholder.astro:21-23). Se lee como usuario y el texto blanco mantiene
  contraste, pero subirla un poco (p. ej. un `pb` en la caja, o la silueta algo mayor) la
  centraría mejor en la zona libre de la card. No bloquea.

## Verificado sin hallazgos
- **V1**: `./init.ps1` → "VERDE: todo en orden." (check:ds, check:arch, tipos, build; código 0).
- **Figma 291:131** (`get_screenshot` + `get_metadata`, fileKey flzA0qnj6JdalFCgyB2PdI): 6 frames;
  el 3.º (291:141) repite "Jhoarling Reina" con la foto de relleno que también usan 291:149/291:154:
  se omite, como pide la feature. Orden y textos en `home.json` coinciden:
  Natalia Reina (Senior UX/UI designer), Jhoarling Reina (Product Head UX/UI designer),
  Victor Veliz (Full Stack Development Lead), Maicol Durán (Full Stack Development Lead),
  Daniel Rivera (Full Stack Development Lead).
- **V4 Fotos**: `src/assets/team/natalia-reina.jpg` y `jhoarling-reina.jpg` de 1032×1269, y
  `victor-veliz.jpg` de 978×1203, todas con proporción 344:423 (0,813). Las personas y los encuadres
  coinciden con 291:133, 291:137 y 291:145. Maicol y Daniel no llevan `photo` y se pintan con
  `UserPlaceholder tone="dark"` (bg-neutral-500 + silueta), sin retrato de relleno. Se usan los
  AVIF/WebP de astro:assets en cada ancho.
- **Bios**: una frase en español por integrante, en el tono del sitio. `design/content-gaps.md`:
  fila #10 del resumen y sección Equipo con `members[0..4].bio` PROVISIONAL (P2), fotos de
  `members[3]` y `members[4]` (P2) y `company` (P3).
- **Revisión en navegador**: Chrome headless por CDP contra `dist/client` (el build de init.ps1),
  con `--user-data-dir` temporal propio; al terminar se cerró solo ese proceso.
  - 375 / 768 (táctil, `hover: none`): `scrollWidth` igual al viewport, sin scroll horizontal.
    Cards de 260×320 y 291×358. En reposo solo se ve la capa de reposo (la de detalle tiene
    `display:none`). Autoplay por pasos: 0 → 281 → 562 → 843 → 1124 a 375 y 0 → 312 → 624 → 936 → 1248
    a 768, es decir, una card por paso cada 4 s, con los clones del bucle (10 hijos). El swipe
    táctil avanza una card (1124 → 1405). Los roles largos caben en una línea a 260 px.
  - 1024 / 1440 (`hover: hover`): cards de 311×383 y 344×423, sin scroll horizontal. Hover sobre
    Victor (con foto) y Maicol (placeholder): se ve el detalle con rol, "en Sensei Studio",
    nombre grande y bio; la foto o la silueta se difuminan con `blur(16px)`. El typewriter se
    capturó a media escritura ("en Sensei Stud", "Full Stack Development") y luego completo.
  - `prefers-reduced-motion: reduce` a 1440: sin autoplay (`data-playing` ausente, `scrollLeft` 0,
    sin clones); el hover cambia de capa sin blur ni escritura.
- **V5**: sin `[..]` arbitrarios, hex, `client:load`, `any` ni `ds-allow` en TeamCard,
  UserPlaceholder, `modules/team/*` y `types.ts`. `bg-neutral-500` es utilidad nativa de Tailwind.
  No hay imports entre módulos. El copy está en `home.json`.
- **V6**: cada card es `role="group"` con "n de 5", y los clones llevan `aria-hidden`. La silueta
  es `aria-hidden` con `alt=""`. Las fotos tienen alt "Retrato de …" y la card tiene foco visible
  (`focus-visible:outline-paper`).
- **V7 / contrato**: no queda ninguna referencia a `TeamCardPlaceholder`, `TeamPerson`,
  `TeamPlaceholder` ni `sensei-logo`. `docs/content-model.md` (silueta en lugar de retrato de
  relleno), `docs/components.md` (TeamCard con `photo?` y `UserPlaceholder` con `tone`) y
  `/componentes` están al día.
- Nota ajena a la feature: a 375 la barra flotante "Cotizar proyecto / WhatsApp" tapa el h2 del
  equipo mientras se hace scroll. Es un comportamiento previo a esta feature y no se cuenta aquí.
