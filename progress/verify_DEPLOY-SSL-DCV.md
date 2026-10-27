# Verify DEPLOY-SSL-DCV — vuelta 1
Resultado: VERDE

## Bloqueantes
Ninguno.

## Mayores
Ninguno.

## Menores
Ninguno.

## Verificado sin hallazgos
- **V1**: `./init.ps1` en VERDE (toolchain, dependencias, estado, check:ds, check:arch, astro check, astro build).
- **dist/.htaccess**: idéntico línea a línea a `public/.htaccess` tras el build (Compare-Object sin diferencias).
- **Lógica de las RewriteCond** (`public/.htaccess:26-27` y `:33-34`):
  - Las dos condiciones nuevas van delante de cada regla 301 y se combinan con AND (sin `[OR]`), así que
    cualquier petición bajo `/.well-known/` invalida las dos reglas: ni www->sin www ni http->https.
  - Petición directa (`GET /.well-known/pki-validation/x.txt`): `REQUEST_URI` empieza por `/.well-known/`,
    así que la primera condición falla y no hay 301.
  - ErrorDocument: si el archivo no existe, Apache hace una redirección interna a `/404.html` y vuelve a
    evaluar el `.htaccess` con `REQUEST_URI=/404.html`. `THE_REQUEST` conserva la línea original
    (`GET /.well-known/... HTTP/1.1`), así que `!\s/+\.well-known/` falla y no hay 301. Esto corrige el
    síntoma de las notes (`301 -> https://bysensei.com/404.html`): ahora responde 404 por HTTP.
  - El patrón de `THE_REQUEST` exige un espacio en blanco y luego `/`, de modo que solo coincide con la ruta
    al principio de la request-line. Un `/.well-known/` dentro de la query no coincide, porque los espacios
    van codificados. `/+` tolera `//.well-known/`.
  - Para el resto de rutas, las dos condiciones nuevas se cumplen siempre y el comportamiento es el de antes:
    www->sin www en un salto, http->https con la salvaguarda de `X-Forwarded-Proto`.
- **Resto del .htaccess sin cambios**: DirectoryIndex, `-Indexes`, ErrorDocument 404, MIME, deflate, caché
  (`/_astro/` immutable, HTML no-cache) y cabeceras de seguridad.
- **Comentarios**: el bloque explica el motivo (AutoSSL/Sectigo, `pki-validation`, `acme-challenge`) y qué
  caso cubre cada condición. Cumple el criterio "comentada" del acceptance.
- **Coherencia con el deploy** (solo lectura): `scripts/deploy.sh:83,151,155,157,162-163` ya excluye
  `.well-known` del borrado, del rsync `--delete`, del backup y del chmod. Los archivos DCV que cree cPanel
  no se pierden al desplegar.
- V2–V7: no aplican (no se tocan UI, assets, tokens ni código de `src/`).

## Fuera del repo (no bloquea)
Tras desplegar: `curl -I http://bysensei.com/.well-known/pki-validation/test.txt` debe dar 404 o 200, no 301.
Después, relanzar AutoSSL en cPanel.
