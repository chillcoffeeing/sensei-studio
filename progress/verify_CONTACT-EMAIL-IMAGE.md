# Verify CONTACT-EMAIL-IMAGE — vuelta 1
Resultado: VERDE

## Bloqueantes
(ninguno)

## Mayores
(ninguno)

## Menores
- [Docs] `docs/content-model.md:96` (regla 10) sigue usando `remittven-laptop.png` como ejemplo de nombre, pero ese archivo ya se eliminó. Conviene poner como ejemplo un archivo que exista (p. ej. `remittven-app-screens.jpg` de `slider-destacados-homepage/`).
- [V5] El correo está escrito literalmente en `src/content/data/pages/home.json:838` (`status.unavailable`), además de en `studioEmail` (`src/content/site.ts:39`). El informe dice que `site.ts` es el "único sitio donde vive". Es aceptable porque el JSON es contenido de CMS y no puede importar la constante, pero el informe debería decir que el correo está en dos sitios.
- [Figma] Figma no estaba autenticado, así que la imagen se tomó de `design/figma/assets/imgContactSection.png`, que es lo que prevén las notas de la feature. Falta que el usuario confirme que coincide con 174:73. Esto no bloquea.

## Verificado sin hallazgos
- **V1**: `./init.ps1` termina en VERDE (exit 0), con check:ds, check:arch, astro check y build bien. El build genera las variantes de `escritorio-dos-monitores`.
- **Limpieza de assets, sin roturas**: hice una comprobación independiente con un script. Buscó en `src/**` (ts/astro/svelte/json/css/md/js) y en `astro.config.mjs`:
  - **Claves MediaRef `images/...` en JSON**: todas existen en `src/assets/`.
  - **Imports `@/assets/...`**: todos existen.
  - **Rutas de `public/`** (`/og-image.jpg`, `/videos/hero-background.mp4`, favicons): todas existen. Las dos coincidencias que salieron (`/og-image.png` en `src/core/site.ts:83`, `/videos/…` en `src/shared/lib/media.ts:51`) están en comentarios JSDoc y no son referencias reales.
  - **Rutas construidas con plantillas**: no hay ninguna (`images/${`, `'images/' +`). `media.ts` resuelve las claves con `import.meta.glob` y falla en el build si falta alguna, y el build pasó.
  - **Huérfanos que quedan**: 0 en `src/assets/` y en `public/`.
  - **Archivos borrados** (`remittven-laptop.png`, `cappi-xtremo-backoffice.png`, `cappi-xtremo-laptop.jpg`, `yupa-app-catalog-screen.jpg`): ninguno se referencia en `src/`.
  - **`design/`**: la exportación de origen sigue en su sitio (`design/figma/assets/imgContactSection.png`).
- **V2**: estructura sin cambios. `contact/Section.astro` sigue usando `ContactBackdrop` con la misma composición: fondo a sangre al 30 % con velo `bg-scrim`, card y formulario. Solo cambian la imagen y el texto de los avisos.
- **V3**: revisión estática, sin capturas. La imagen es 2880×1920 (3:2), la misma proporción del recorte declarado (`width=1440 height=960`, `object-cover`, `sizes=100vw`, anchos 640–2880). Los avisos más largos son texto fluido, sin anchos fijos. No veo riesgo de scroll horizontal a 375/768/1024/1440.
- **V4**: el asset existe en `src/assets/images/contacto-homepage/escritorio-dos-monitores.jpg`, pesa 389 kB y tiene un nombre descriptivo. La revisé visualmente: dos monitores sobre un escritorio de madera, como describe la feature. Es la única imagen de la carpeta.
- **Correo**: en `src/content/site.ts:39-40`, `studioEmail = 'hola@bysensei.com'` y el `mailto:` de asesoría lleva destinatario y asunto. Los avisos `unavailable` de cotización (l. 211), asesoría (l. 282) y contacto (home.json:838) incluyen el correo. No hay más correos del estudio en el código, porque el footer y `/links` no muestran ninguno. Los demás `@` del código son ejemplos de placeholder o validación.
- **`design/content-gaps.md:132`**: hueco del correo marcado como RESUELTO. **`docs/content-model.md`**: la regla 9 documenta la excepción.
- **V5/V6**: en lo que se tocó no hay hex ni valores arbitrarios, ni `client:load` nuevo, ni `any`. El fondo sigue `decorative` dentro de `aria-hidden`, con un alt en español en el JSON.
- **V7**: el alcance se ajusta a `acceptance`: imagen, correo, limpieza y documentación.
