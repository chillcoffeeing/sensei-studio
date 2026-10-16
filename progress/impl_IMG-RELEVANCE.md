# Implementación — IMG-RELEVANCE

## Archivos

- `src/content/unsplash-photos.json` — recurada la selección de 30 slots no retrato; se mantienen los 5 retratos y 2 imágenes digitales ya pertinentes.
- `design/placeholders.md` — actualizadas las descripciones por hueco, el criterio de curación, las notas editoriales y los 37 créditos generados con UTM.
- `progress/impl_IMG-RELEVANCE.md` — informe de implementación.

No se modificaron `feature_list.json`, `progress/current.md`, componentes, módulos, orden, composición ni archivos de layout.

## Curación y Unsplash

- Los 30 nuevos IDs se eligieron revisando metadatos Unsplash de descripción, `alt_description`, etiquetas, color, dimensiones, likes y autor; las búsquedas cubrieron interfaces web/móviles, wireframes, UX/UI, paneles y código. Se evitó seleccionar por orden textual solamente.
- Cada ID es único entre los 37 slots. Se conservaron los retratos de equipo y testimonios, además del wireframe de UX y la imagen de analítica móvil que ya cumplían su función.
- Las 31 selecciones registradas —30 slots y un ajuste final de la foto de código del proyecto— pasaron por `pick`, que invoca `download_location` por cada foto elegida. La curación registró 40 peticiones en total (9 búsquedas + 31 callbacks), bajo el límite local de 48/hora.
- Se mantienen hotlinks `images.unsplash.com`, datos de atribución, `Photo.astro`, enlaces de créditos y UTM `utm_source=sensei_studio&utm_medium=referral`. El build no necesita clave ni consulta la API.

## Tokens y responsive

- Tokens agregados o eliminados: ninguno.
- Se mantienen las proporciones, dimensiones, `srcset` y `sizes` existentes; no se cambió el layout. El render sigue siendo mobile-first mediante el `Photo.astro` existente, con dimensiones explícitas y sin nuevos estilos ni crops.

## Dirección editorial y variaciones

Se conserva la dirección cálida y editorial documentada: mesas de madera, luz natural, bocetos claros y espacios de trabajo sobrios equilibran las pantallas de interfaz y código, que aportan contraste digital y en ocasiones son más oscuras o frías. Se ajustó en `design/placeholders.md` la regla anterior de “sin texto legible” para admitir interfaces y código reconocibles —necesarios para la relevancia solicitada—, manteniendo la exclusión de marcas, logotipos y copy promocional. No hubo desviaciones de estructura, proporciones o composición.

## Verificación

`./init.ps1` — **VERDE** (exit code 0): instalación de dependencias, estado del arnés con una feature `in_progress`, `check:ds` sin errores, `check:arch` con 273 archivos/14 módulos y sin errores, `astro check` y `astro build` aprobados.

## Vuelta de corrección — 2026-10-09

Se atendieron exclusivamente los hallazgos bloqueantes [V4] y [V6] del informe de verificación:

- `showcase-facade`: reemplazada por `hMYODfDWs9M`, de Ferenc Almasi; muestra una interfaz de animación CSS, sin marca ni copy promocional. La selección nueva se hizo con `unsplash-curate.mjs pick`, que llamó a `download_location`.
- `footer-camera`: `6LVyxpfSQic`, de Marc Wieland; portátil en una azotea al atardecer.
- `services-ux-swatches`: `KgpwQ2FM2Go`, de Kelly Sikkema; tableta y lápiz digital.
- `services-email-phone-window`: `TFZYKFalS6w`, de Miguel luiz Tinoco; silueta de una mano sosteniendo un móvil.
- `project-phone-hand`: `vmGffGNNYwM`, de Howard Bouchevereau; mano con teléfono sobre fondo neutro.
- Las cuatro fotos anteriores ya habían sido seleccionadas y acreditadas en una versión previa; se recuperaron sus registros de Unsplash, sin duplicar IDs.
- `services-email-envelopes-seal` conserva `lPiNaX2vs_U`, de RUT MIIT; el alt ahora describe fielmente la ilustración de automóvil dentro de un programa de diseño gráfico.
- `design/placeholders.md` conserva una fila de crédito por slot y enlaces de autor, foto y Unsplash con UTM. Los 37 slots siguen teniendo IDs únicos.

Archivos de esta corrección: `src/content/unsplash-photos.json`, `design/placeholders.md` y este informe. No se cambiaron tokens ni el responsive, layout, orden o componentes; tampoco se tocaron `feature_list.json`, `progress/current.md` ni `progress/history.md`. `figmaNodes` está vacío para esta feature, así que no aplica protocolo de Figma.

`./init.ps1` — **VERDE** (exit code 0): dependencias y estado válidos; `check:ds` 0 errores; `check:arch` 273 archivos/14 módulos, 0 errores; `astro check` 0 errores (1 hint existente); `astro build` aprobado.

## Vuelta de corrección puntual [V6] — 2026-10-09

- Corregidos únicamente los caracteres de reemplazo `?` por acentos españoles en los cinco alts señalados de `src/content/unsplash-photos.json` y sus cinco créditos correspondientes de `design/placeholders.md`; ambos textos coinciden exactamente.
- No se modificaron otros contenidos ni estados.
- `./init.ps1` — **VERDE** (exit code 0): dependencias y estado válidos; `check:ds` sin errores; `check:arch` 273 archivos/14 módulos, sin errores; tipos y `astro build` aprobados.

## Vuelta correctiva 5 — bloqueantes V4

- `services-email-envelopes-seal`: sustituida `lPiNaX2vs_U` por `Qsh64pRu6CE`, de Egor Komarov. Revisé la imagen completa y el recorte: interfaz digital con controles y forma de onda, sin marca ni copy comercial visible. Alt, crédito y enlace Unsplash con UTM actualizados; se registró `download_location`.
- `services-ux-swatches`: sustituida `KgpwQ2FM2Go` por `7VbXK7T6k8w`, de Shawn Rain. Revisé la imagen completa y el recorte: persona dibujando en tableta, lápiz sin inscripción comercial y herramientas de diseño genéricas. Alt, crédito y enlace Unsplash con UTM actualizados; se registró `download_location`.
- Permanecen 37 slots y 37 IDs únicos. No se modificaron otros slots, incluido `showcase-facade`, ni ningún asset local, código, layout o composición.

### Archivos de esta vuelta

- `src/content/unsplash-photos.json` — actualizados solo los dos registros indicados.
- `design/placeholders.md` — actualizados solo sus dos créditos, alts y enlaces Unsplash con UTM.
- `progress/impl_IMG-RELEVANCE.md` — añadido este informe de corrección.

Tokens: ninguno. Responsive inferido: sin cambio; se mantienen tamaños, proporciones, `srcset` y `sizes`. Figma no aplica (`figmaNodes` vacío).

`./init.ps1` — **VERDE** (exit code 0): `check:ds` sin errores; `check:arch` 273 archivos/14 módulos, sin errores; `astro check` sin errores (1 hint); `astro build` aprobado.
