# Despliegue automático con GitHub Actions

Con cada push a `main`, `.github/workflows/deploy.yml` hace lo siguiente en un servidor de GitHub:

1. Instala dependencias.
2. Ejecuta `./init.ps1` (verificación + build).
3. Si está en verde, publica con `scripts/deploy.sh --skip-build`.

Si algo falla, no se publica nada. Usa el mismo script que el despliegue manual (`docs/deploy.md`).

> **Orden importante:** configura los secrets (pasos 1–4) **antes** de subir el workflow a `main`.
> El primer push ya intenta desplegar.

## 1. Clave SSH solo para CI (Git Bash)

En CI nadie puede escribir una frase, así que esta clave va **sin frase**. Es una clave aparte
de la tuya, para poder revocarla sin tocar tu acceso.

```bash
ssh-keygen -t ed25519 -N "" -C "github-actions sensei-studio" -f ~/.ssh/sensei_ci_deploy
```

## 2. Autorizarla en cPanel

1. Ve a *Security → SSH Access → Manage SSH Keys → Import Key*.
2. Rellena el formulario:
   - **Name:** `sensei_ci_deploy`.
   - **Public Key:** pega la clave pública. Para copiarla, ejecuta `cat ~/.ssh/sensei_ci_deploy.pub | clip`.
   - **Private Key:** déjala vacía.
3. En *Public Keys* → `sensei_ci_deploy` → **Manage → Authorize**.
4. Pruébala:

   ```bash
   ssh -p 21098 -i ~/.ssh/sensei_ci_deploy -o IdentitiesOnly=yes kolidrqh@184.94.213.174 "echo ok"
   ```

## 3. Huella del servidor

Sirve para que CI compruebe que se conecta a tu servidor y no a otro. Sale de tu `known_hosts`, que
ya validaste al conectar:

```bash
ssh-keygen -F "[184.94.213.174]:21098" | grep -v '^#' | clip
```

## 4. Secrets y variables en GitHub

En el repo, ve a *Settings → Environments → New environment* y créalo con el nombre `production`.
Opcional: en *Deployment branches* limita el entorno a `main`, y activa *Required reviewers* si
quieres aprobar cada despliegue.

Dentro de `production`:

| Tipo | Nombre | Valor |
|---|---|---|
| Secret | `DEPLOY_SSH_KEY` | Clave **privada** completa: `cat ~/.ssh/sensei_ci_deploy \| clip` |
| Secret | `DEPLOY_KNOWN_HOSTS` | Las líneas del paso 3 |
| Secret | `DEPLOY_HOST` | `184.94.213.174` |
| Secret | `DEPLOY_USER` | `kolidrqh` |
| Secret | `DEPLOY_PORT` | `21098` |
| Variable | `DEPLOY_DOMAIN_ROOT` | `/bysensei.com` |
| Variable | `DEPLOY_DOMAIN` | `bysensei.com` |
| Variable | `NOINDEX_FOR_DEPLOY` | `true` hasta el lanzamiento, luego `false` |

También se pueden cargar con la CLI de GitHub (`gh auth login` antes). Ejecuta esto desde la raíz
del repo:

```bash
gh api -X PUT repos/chillcoffeeing/sensei-studio/environments/production
gh secret set DEPLOY_SSH_KEY --env production < ~/.ssh/sensei_ci_deploy
ssh-keygen -F "[184.94.213.174]:21098" | grep -v '^#' | gh secret set DEPLOY_KNOWN_HOSTS --env production
gh secret set DEPLOY_HOST --env production --body "184.94.213.174"
gh secret set DEPLOY_USER --env production --body "kolidrqh"
gh secret set DEPLOY_PORT --env production --body "21098"
gh variable set DEPLOY_DOMAIN_ROOT --env production --body "/bysensei.com"
gh variable set DEPLOY_DOMAIN --env production --body "bysensei.com"
gh variable set NOINDEX_FOR_DEPLOY --env production --body "true"
```

Cuando esté cargada en GitHub, puedes borrar la clave privada de tu equipo:
`rm ~/.ssh/sensei_ci_deploy`.

## 5. Primer despliegue

1. Haz commit y push de `.github/workflows/deploy.yml` a `main`.
2. Sigue el progreso en la pestaña *Actions → Deploy*. El último paso muestra las comprobaciones con
   `curl` (200 / 200 / 404).

## Uso diario

| Quiero… | Cómo |
|---|---|
| Publicar | Push a `main` |
| Redesplegar sin cambios | *Actions → Deploy → Run workflow* con `deploy` |
| Volver a la versión anterior | *Run workflow* con `rollback` |
| Lanzar (permitir indexar) | Variable `NOINDEX_FOR_DEPLOY` = `false` y *Run workflow* |
| Cortar el acceso de CI | En cPanel, *Deauthorize* o borrar la clave `sensei_ci_deploy` |

Si se hacen dos push seguidos, los despliegues se ejecutan en cola, nunca a la vez.

## Problemas

| Síntoma en el log | Causa |
|---|---|
| Se para en *Verificación y build* | `init.ps1` en rojo: no se publicó nada. Se ve igual en local |
| `Permission denied (publickey)` | Clave no autorizada en cPanel (paso 2) o `DEPLOY_SSH_KEY` incompleta (debe incluir las líneas `BEGIN`/`END`) |
| `Host key verification failed` | `DEPLOY_KNOWN_HOSTS` vacío o desactualizado: repetir el paso 3 |
| `Connection timed out` al conectar | El hosting bloquea las IPs de GitHub: pedir a Namecheap que permita SSH externo en el puerto 21098 |
| `curl` da `000` al final | DNS o certificado (`docs/deploy.md` › Problemas habituales). El sitio sí se publicó |
