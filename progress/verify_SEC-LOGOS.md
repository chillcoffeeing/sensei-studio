# Verify SEC-LOGOS — vuelta 1
Resultado: ROJO

Fuente: Figma MCP no se usó porque está limitado. Se usó `design/figma/homepage.0.txt` (17:553, líneas 102–130), `design/figma/assets/imgCompanyLogo*.svg` y `design/figma/homepage-full.png`.
Verificación visual: `dist/client` servido en :4799 y medido con Chrome headless (CDP) a 375, 768, 1024, 1440 y 1920 px. La animación se congeló en las fases 0, 0.5 y 0.9999, y se probó también con `prefers-reduced-motion: reduce`.

## Bloqueantes
- [V2/acceptance "desplazamiento infinito"] Aparece un hueco vacío al final de cada vuelta en viewports de más de 1758 px.
  - `src/modules/logo-marquee/Section.astro:29-35`: la pista tiene 2 copias de 1785 px (9 logos + 9 gaps de 50) y se desplaza −50 %. Su borde derecho baja hasta `-27 + 3570 - 1785 = 1758 px`.
  - Medido a 1920 px en la fase 0.9999: pista `[-1811.8 … 1758]`. Quedan unos 162 px en blanco a la derecha (unos 212 px tras el último logo; ver captura). El hueco crece durante el último ~9 % de cada vuelta (unos 3,6 s de 40 s).
  - Esperado: el borde derecho de la pista se mantiene ≥ 100vw en todo el ciclo para cualquier ancho ≥1440 (la meta desktop es "≥1440").
  - Arreglo sugerido, sin JS: cada mitad de la pista lleva la lista repetida dos veces (por ejemplo `copies = [false, true]` × `sets = [0, 1]`, con todas las repeticiones salvo la primera `aria-hidden`). Así cada mitad mide unos 3570 px y −50 % sigue siendo una mitad exacta. Otra opción: más copias con un keyframe acorde. En los dos casos, añadir el caso ≥1920 al test.

## Mayores
(ninguno)

## Menores
- [V3] Con `prefers-reduced-motion` en desktop, `motion-reduce:overflow-x-auto` (`Section.astro:27`) muestra una barra de scroll horizontal nativa. La sección pasa de 93 a 108 px de alto a 1440 (medido), lo que añade 15 px y una barra que Figma no tiene. Opciones: ocultar la barra visualmente (`scrollbar-width: none` mediante utilidad) o aceptarlo como coste de accesibilidad y documentarlo.
- [V6] Las imágenes llevan `loading="lazy"` (`Section.astro:45`), pero la franja empieza en y=896 a 1440 y en y=674 a 375, es decir, en el primer viewport o al borde. Conviene `loading="eager"` o quitar el atributo. No bloquea.

## Verificado sin hallazgos
- V1: `./init.ps1` VERDE, exit 0. check:ds, check:arch, astro check, vitest y build en OK.
- Identidad y orden de los logos: los 9 SVG de `src/assets/logo-marquee/` son idénticos byte a byte (`cmp`) a `imgCompanyLogo`…`imgCompanyLogo8`, en el orden de los hijos de 17:553 (17:503, 17:512, 17:1036, 17:507, 17:1038, 17:1034, 17:1040, 17:1042, 17:1026). Al renderizarlos se lee Adobe, airbnb, Opendoor, Evernote, pipedrive, Fivetran, afterpay, elastic y Airwallex, y los `alt` coinciden. Excluir Amazon (décimo hijo, a color, fuera del frame) es coherente con "9 logos".
- V2 a 1440: la pista empieza en x=−27, y=896 (Figma left −27, top 896), gap 50 px y alto 48. Las x medidas de los logos (−27, 156, 334, 518, 732, 944, 1156, 1362, 1540) coinciden con el cálculo desde Figma, y los anchos son 133/128/134/164/162/162/156/128/168. pt 45 = 896 − 851 (el hero acaba en 851, medido).
- Loop sin salto: al final del ciclo (0.9999) la segunda copia está en x=−26.8, frente a −27 de la primera al inicio, en 375, 768, 1024, 1440 y 1920. Cada copia lleva `pr = gap`, así que −50 % equivale exactamente a una copia aunque el gap sea fluido.
- La copia duplicada lleva `aria-hidden="true"` y `alt=""`, y con reduced-motion queda en `display:none`.
- Pausa: el CSS compilado contiene `.group-hover:play-paused` (dentro de `@media (hover:hover)`) y `.group-focus-within:play-paused`. La sección tiene `tabindex="0"`, `aria-label` y un anillo `focus-visible` `outline-ink`.
- Reduced-motion: sin animación (`animation: none`, 0 animaciones), estática en la posición de Figma y desplazable a mano (`overflow-x: auto`).
- Sin isla ni script: no hay `client:`, `<script>` ni `.svelte`. Es un `.astro` puro con `@keyframes marquee` y token `--animate-marquee`.
- V3: no hay scroll horizontal de página (`scrollWidth == innerWidth` en 375, 768, 1024, 1440 y 1920). Gap y pt fluidos (32 a 50 y 24 a 45).
- V4: los 9 assets existen, se usan en su sitio y con su proporción (width/height del import), sin sustitutos.
- V5: sin `any`, `ds-allow`, hex, valores arbitrarios `[..]`, z-index ni imports entre módulos (solo `@/core/page` y `./schema`). El copy (label y alt) vive en `src/content/pages/home.ts`.
- V7: los cambios se limitan al módulo, sus assets, el registro y la unión de secciones, `home.ts`, tokens, la utilidad `play-paused`, el test y los docs regenerados.

# Verify SEC-LOGOS — vuelta 2
Resultado: VERDE

Medición: build actual (`dist/client`) servido en :4799 y medido con Chrome headless (CDP) a 375, 768, 1024, 1440, 1920, 2560 y 3840 px. La animación se congeló y se recorrió en 401 fases (0 … 0.99999). En cada fase se midió el borde derecho de la pista y el mayor tramo vacío entre logos visibles dentro del viewport. También se probó `prefers-reduced-motion: reduce` a 375 y 1440. Las capturas en la fase 0.9999 están en el scratchpad (`lv2/*_end.png`).

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [V3] (se arrastra de la vuelta 1, no se tocó) Con reduced motion a 1440, `motion-reduce:overflow-x-auto` (`src/modules/logo-marquee/Section.astro:30`) muestra una barra de scroll nativa y la sección pasa de 93 a 108 px de alto (medido).
- [V6] (se arrastra de la vuelta 1, no se tocó) `loading="lazy"` en `Section.astro:46` en una franja que está en el primer viewport (y=851 a 1440, y=650 a 375).

## Verificado sin hallazgos
- Bloqueante de la vuelta 1 resuelto. El borde derecho mínimo de la pista en todo el ciclo es 4842 (375), 5021 (768), 5138 (1024), 5328 (1440), 5328 (1920), 5328 (2560) y 5328 (3840). Siempre queda por encima de 100vw. El mayor tramo vacío dentro del viewport, en cualquier fase, es igual al gap (32 / 38,6 / 43 / 50 px): no hay hueco. Las capturas a 1920 y 2560 al final de la vuelta muestran la franja llena hasta el borde.
- Loop sin salto: la 2.ª mitad está en x=−26,9 en la fase 0.99999, frente a −27 de la 1.ª al inicio, en los 7 anchos. Las mitades miden igual (5355 / 5355 a ≥1440) y cada lista lleva `pr = gap`.
- Velocidad mantenida: 5355 px / 120 s ≈ 44,6 px/s, igual que en la vuelta 1 (1785 / 40 s). `--duration-marquee: 120s` está anotado `@derived`.
- Sin regresión a 1440: la sección empieza en y=851, con pt 45, alto 93 y gap 50. Las x de los 9 primeros logos son −27, 156, 334, 518, 732, 944, 1156, 1362 y 1540, idénticas a la vuelta 1 y a Figma 17:553.
- A11y: 54 `<img>`, 9 con alt de marca (solo la primera lista), 46 nodos `aria-hidden`. Con reduced motion: 0 animaciones, solo 9 logos visibles (pista de 1785 px a 1440 y 1623 px a 375) y `overflow-x: auto`, igual que en la vuelta 1.
- No hay scroll horizontal de página (`scrollWidth == innerWidth`) en ninguno de los 7 anchos.
- V1: `init.ps1` VERDE (check:ds 265 tokens / 0 errores, check:arch 0 errores, astro check 0/0/0, vitest 42/42, build OK).
- V5: en `src/modules/logo-marquee/*` no hay `[..]` arbitrarios, hex, `client:`, `any`, `ds-allow` ni `<script>`. `track.ts` es interno al módulo. El test cubre 1920, 2560 y 3840.
