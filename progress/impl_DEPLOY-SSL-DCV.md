# impl DEPLOY-SSL-DCV — Excluir /.well-known/ de las redirecciones

## Archivos
- `public/.htaccess`: dos condiciones nuevas, con comentario, delante de cada regla 301 (www->sin www y http->https).

## Cambio
En cada uno de los dos bloques 301:

```
RewriteCond %{REQUEST_URI} !^/\.well-known/ [NC]
RewriteCond %{THE_REQUEST} !\s/+\.well-known/ [NC]
```

- `REQUEST_URI` excluye la petición directa a `/.well-known/...` (validación HTTP de AutoSSL:
  `pki-validation/` y `acme-challenge/`).
- `THE_REQUEST` (línea de petición original del cliente, que no cambia en redirecciones
  internas) cubre el caso del ErrorDocument: si el archivo no existe, Apache hace una
  redirección interna a `/404.html`, el `.htaccess` se reevalúa con `REQUEST_URI=/404.html`
  y antes acababa en `301 -> https://bysensei.com/404.html` (el síntoma de las notes). Ahora
  esa petición devuelve un 404 normal por HTTP.
- El resto de peticiones sigue igual: https forzado, sin www, 404, caché, compresión, MIME.

## Tokens / responsive
No aplica.

## Verificación
- `pnpm build`: OK; `dist/.htaccess` contiene las 4 condiciones nuevas (líneas 26-27 y 33-34).
- `./init.ps1`: VERDE (toolchain, dependencias, estado, sistema de diseño, arquitectura, astro check, astro build).

## Pendiente fuera del repo
Tras desplegar: comprobar `curl -I http://bysensei.com/.well-known/pki-validation/test.txt`
(debe dar 404 o 200, no 301) y relanzar AutoSSL en cPanel.
