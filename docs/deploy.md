# Despliegue (cPanel por SSH, sitio estático)

`pnpm build` deja en `dist/` un sitio plano (sin adapter, `output: 'static'`). `scripts/deploy.sh` lo
compila, sube el `.tgz` verificado con sha256, guarda un respaldo, publica en el Document Root y
comprueba con `curl`. El detalle de cada paso está comentado en el script. Las reglas de Apache están
en `public/.htaccess`. **Automático en cada push a `main`:** `docs/deploy-ci.md`.

## Configuración (una vez)

- Terminal con `bash`, `ssh` y `tar` (Git Bash en Windows), `pnpm` y Node 22.
- SSH activo en cPanel (puerto `21098` en Namecheap) y la clave pública autorizada en *SSH Access*.
- Conectar una vez a mano para guardar la huella en `known_hosts`.
- `.env` en la raíz (no se versiona):

  ```dotenv
  IP_SSH_FOR_DEPLOY=…
  USER_SSH_FOR_DEPLOY=…
  PORT_SSH_FOR_DEPLOY=21098
  PHRASE_SSH_FOR_DEPLOY=…                # opcional
  KEY_SSH_FOR_DEPLOY="C:\Users\<tú>\.ssh\<clave>"   # por defecto ~/.ssh/id_ed25519
  DOMAIN_ROOT_FOR_DEPLOY=/bysensei.com   # Document Root relativo al home (cPanel → Domains)
  DOMAIN_FOR_DEPLOY=bysensei.com
  NOINDEX_FOR_DEPLOY=true                # quitar para el lanzamiento
  ```

## Uso

Antes de desplegar, `./init.ps1` debe estar en verde. Desde PowerShell, usa `.\scripts\deploy.ps1`
con las mismas opciones: allí `bash` a secas abre WSL.

```bash
bash scripts/deploy.sh               # build + subir + publicar
bash scripts/deploy.sh --dry-run     # build + empaquetar, sin conectar
bash scripts/deploy.sh --skip-build  # sube el dist/ actual
bash scripts/deploy.sh --rollback    # restaura el último respaldo del servidor
```

- **Qué conserva:** el script no toca `.well-known` ni `cgi-bin`, borra lo que ya no
  está en el build y conserva 3 respaldos en `~/deploy/backups/`. Si una subida se corta, lo publicado
  no cambia.
- **`NOINDEX_FOR_DEPLOY=true`:** publica una copia de `dist/` con `X-Robots-Tag: noindex` en el
  `.htaccess` y `robots.txt` con `Disallow: /`. Para el lanzamiento: quitar la variable, redesplegar
  y enviar el sitemap en Search Console.

## Tras el primer despliegue

- **SSL:** en cPanel → *SSL/TLS Status*, pulsar *Run AutoSSL*. El DNS ya debe apuntar al servidor y
  `/.well-known/` queda fuera de los 301.
- **Previews:** pasar la URL por opengraph.xyz, el Facebook Sharing Debugger y el LinkedIn Post
  Inspector.
- **Formularios:** sin endpoint muestran el aviso con el correo (`design/content-gaps.md`).

## Problemas habituales

| Síntoma | Causa |
|---|---|
| `Permission denied (publickey)` | Clave no autorizada en cPanel o `KEY_SSH_FOR_DEPLOY` incorrecta |
| `Host key verification failed` | Falta conectar una vez a mano |
| `execvpe(/bin/bash) failed` | Se ejecutó el bash de WSL: usar `scripts/deploy.ps1` |
| `curl` da `000` | DNS sin propagar o sin certificado (AutoSSL) |
| 500 | Directiva de `.htaccess` no permitida: comentar el bloque |
| Las páginas internas dan 404 | `DOMAIN_ROOT_FOR_DEPLOY` no es el Document Root |
