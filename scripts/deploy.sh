#!/usr/bin/env bash
# Despliegue estático a cPanel por SSH (guía: docs/deploy.md).
#
#   bash scripts/deploy.sh             build + subir + publicar
#   bash scripts/deploy.sh --dry-run   build + empaquetar, sin conectar al servidor
#   bash scripts/deploy.sh --skip-build  sube el dist/ que ya existe
#   bash scripts/deploy.sh --rollback  restaura el último respaldo del servidor
#
# Lee .env (nunca se versiona):
#   IP_SSH_FOR_DEPLOY, USER_SSH_FOR_DEPLOY, PORT_SSH_FOR_DEPLOY   obligatorias
#   PHRASE_SSH_FOR_DEPLOY   frase de la clave (opcional: sin ella se usa ssh-agent o se pide)
#   KEY_SSH_FOR_DEPLOY      clave privada; acepta ruta Windows (por defecto ~/.ssh/id_ed25519)
#   DOMAIN_ROOT_FOR_DEPLOY  Document Root relativo al home (por defecto public_html)
#   DOMAIN_FOR_DEPLOY       dominio (por defecto bysensei.com), para SITE_URL y la comprobación final
#   NOINDEX_FOR_DEPLOY      true = publica sin indexar: X-Robots-Tag noindex en .htaccess y
#                           robots.txt "Disallow: /". Solo cambia el paquete; dist/ queda intacto.
#
# Solo necesita bash, ssh y tar (Git Bash en Windows los trae). No usa rsync en local.
set -euo pipefail

cd "$(dirname "$0")/.."

DRY=0; SKIP_BUILD=0; ROLLBACK=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=1 ;;
    --skip-build) SKIP_BUILD=1 ;;
    --rollback) ROLLBACK=1 ;;
    *) echo "Opción desconocida: $arg" >&2; exit 2 ;;
  esac
done
[ "$ROLLBACK" = 1 ] && [ $((DRY + SKIP_BUILD)) -gt 0 ] && { echo "--rollback no se combina con otras opciones." >&2; exit 2; }

# --- .env --------------------------------------------------------------------------------------
[ -f .env ] || { echo "Falta .env en la raíz del proyecto." >&2; exit 1; }
env_get() { { grep -E "^$1=" .env || true; } | tail -1 | cut -d= -f2- | tr -d '\r' | sed -E 's/^"(.*)"$/\1/'; }

HOST="$(env_get IP_SSH_FOR_DEPLOY)"
SSH_USER="$(env_get USER_SSH_FOR_DEPLOY)"
PORT="$(env_get PORT_SSH_FOR_DEPLOY)"
PHRASE="$(env_get PHRASE_SSH_FOR_DEPLOY)"
KEY="$(env_get KEY_SSH_FOR_DEPLOY)"
KEY_SET="$KEY"
KEY="${KEY:-$HOME/.ssh/id_ed25519}"; KEY="${KEY/#\~/$HOME}"
command -v cygpath >/dev/null 2>&1 && KEY="$(cygpath -u "$KEY")"   # "C:\…" -> "/c/…" en Git Bash
# Relativo al home: "/bysensei.com" y "bysensei.com/" valen igual.
DEPLOY_PATH="$(env_get DOMAIN_ROOT_FOR_DEPLOY)"; DEPLOY_PATH="${DEPLOY_PATH#/}"; DEPLOY_PATH="${DEPLOY_PATH%/}"
DEPLOY_PATH="${DEPLOY_PATH:-public_html}"
DOMAIN="$(env_get DOMAIN_FOR_DEPLOY)"; DOMAIN="${DOMAIN:-bysensei.com}"
case "$(env_get NOINDEX_FOR_DEPLOY | tr '[:upper:]' '[:lower:]')" in
  1|true|yes|si|sí) NOINDEX=1 ;;
  *) NOINDEX=0 ;;
esac

for v in HOST SSH_USER PORT; do
  [ -n "${!v}" ] || { echo "Falta $v en .env (ver docs/deploy.md)." >&2; exit 1; }
done
[ -n "$KEY_SET" ] && [ ! -f "$KEY" ] && { echo "KEY_SSH_FOR_DEPLOY apunta a un archivo que no existe: $KEY" >&2; exit 1; }

STAMP="$(date +%Y%m%d-%H%M%S)"
# Ruta POSIX de mktemp: con "C:\…" el tar de Git Bash toma "C:" como host remoto.
TARBALL="$(mktemp -t sensei-dist.XXXXXX)"
PKG_DIR=""

# --- SSH ---------------------------------------------------------------------------------------
ASKPASS=""
cleanup() { [ -n "$ASKPASS" ] && rm -f "$ASKPASS"; [ -n "$PKG_DIR" ] && rm -rf "$PKG_DIR"; rm -f "$TARBALL"; }
trap cleanup EXIT

if [ -n "$PHRASE" ]; then
  # La frase viaja por variable de entorno al helper, nunca por la línea de comandos.
  ASKPASS="$(mktemp)"
  printf '#!/bin/sh\nprintf "%%s\\n" "$DEPLOY_SSH_PHRASE"\n' > "$ASKPASS"
  chmod 700 "$ASKPASS"
  export DEPLOY_SSH_PHRASE="$PHRASE" SSH_ASKPASS="$ASKPASS" SSH_ASKPASS_REQUIRE=force DISPLAY="${DISPLAY:-:0}"
fi

SSH_OPTS=(-p "$PORT" -o ConnectTimeout=20 -o ServerAliveInterval=15)
[ -f "$KEY" ] && SSH_OPTS+=(-i "$KEY" -o IdentitiesOnly=yes)
remote() { ssh "${SSH_OPTS[@]}" "$SSH_USER@$HOST" "$@"; }

# --- Rollback ----------------------------------------------------------------------------------
if [ "$ROLLBACK" = 1 ]; then
  echo "==> Restaurando el último respaldo en ~/$DEPLOY_PATH"
  remote "DEPLOY_PATH='$DEPLOY_PATH' bash -s" <<'REMOTE'
set -euo pipefail
LAST="$(ls -1t ~/deploy/backups/*.tgz 2>/dev/null | head -1 || true)"
[ -n "$LAST" ] || { echo "No hay respaldos en ~/deploy/backups"; exit 1; }
echo "Respaldo: $LAST"
find ~/"$DEPLOY_PATH" -mindepth 1 -maxdepth 1 ! -name .well-known ! -name cgi-bin -exec rm -rf {} +
tar xzf "$LAST" -C ~/"$DEPLOY_PATH"
echo "Restaurado."
REMOTE
  exit 0
fi

# --- Build -------------------------------------------------------------------------------------
if [ "$SKIP_BUILD" = 0 ]; then
  echo "==> Build estático (SITE_URL=https://$DOMAIN)"
  SITE_URL="https://$DOMAIN" pnpm build
fi

[ -f dist/index.html ] || { echo "dist/index.html no existe: ¿el build es estático? (astro.config.mjs: output static)" >&2; exit 1; }
[ -d dist/server ] && { echo "dist/server existe: el build no es estático; revisa astro.config.mjs." >&2; exit 1; }

PKG_SRC=dist
if [ "$NOINDEX" = 1 ]; then
  # Copia temporal para no ensuciar dist/: un build normal sigue siendo el de producción.
  echo "==> NOINDEX_FOR_DEPLOY: el sitio se publica sin indexar"
  PKG_DIR="$(mktemp -d -t sensei-pkg.XXXXXX)"
  cp -a dist/. "$PKG_DIR"/
  cat >> "$PKG_DIR/.htaccess" <<'HTACCESS'

# --- Sin indexar (lo añade scripts/deploy.sh por NOINDEX_FOR_DEPLOY) -----------------------
# Buscadores: no indexar, no seguir enlaces ni guardar copia. Para el lanzamiento, quitar
# NOINDEX_FOR_DEPLOY del .env y volver a desplegar.
<IfModule mod_headers.c>
  Header always set X-Robots-Tag "noindex, nofollow, noarchive"
</IfModule>
HTACCESS
  printf 'User-agent: *\nDisallow: /\n' > "$PKG_DIR/robots.txt"
  PKG_SRC="$PKG_DIR"
fi

echo "==> Empaquetando $PKG_SRC/"
tar czf "$TARBALL" -C "$PKG_SRC" .
echo "    $(du -h "$TARBALL" | cut -f1) · $(find "$PKG_SRC" -type f | wc -l | tr -d ' ') archivos"

if [ "$DRY" = 1 ]; then
  if [ "$NOINDEX" = 1 ]; then
    echo "    robots.txt del paquete: $(tr '\n' ' ' < "$PKG_SRC/robots.txt")"
    echo "    .htaccess del paquete:  $(grep -o 'X-Robots-Tag "[^"]*"' "$PKG_SRC/.htaccess")"
  fi
  echo "==> --dry-run: no se conecta al servidor. Paquete listo y descartado al salir."
  exit 0
fi

# --- Subida, descompresión y publicación -------------------------------------------------------
# El .tgz se sube como archivo (.part), se verifica su sha256 y solo entonces se descomprime en
# ~/deploy/staging/. Si la subida se corta, lo publicado no se toca y la próxima ejecución limpia
# los restos.
INCOMING="deploy/incoming/$STAMP.tgz"
UPLOADING=0
on_interrupt() {
  if [ "$UPLOADING" = 1 ]; then
    echo; echo "==> Interrumpido: borrando la subida parcial del servidor" >&2
    timeout 20 ssh "${SSH_OPTS[@]}" "$SSH_USER@$HOST" "rm -f ~/$INCOMING.part" 2>/dev/null || true
  fi
  exit 130
}
trap on_interrupt INT TERM

LOCAL_SUM="$(sha256sum "$TARBALL" | cut -d' ' -f1)"
echo "==> Limpiando restos de despliegues anteriores en el servidor"
remote 'rm -rf ~/deploy/incoming ~/deploy/staging ~/deploy/releases && mkdir -p ~/deploy/incoming'

echo "==> Subiendo paquete ($(du -h "$TARBALL" | cut -f1)) a ~/$INCOMING"
UPLOADING=1
remote "cat > ~/$INCOMING.part" < "$TARBALL"
REMOTE_SUM="$(remote "sha256sum ~/$INCOMING.part | cut -d' ' -f1")"
if [ "$LOCAL_SUM" != "$REMOTE_SUM" ]; then
  remote "rm -f ~/$INCOMING.part" || true
  echo "El paquete llegó incompleto o dañado (sha256 distinto). No se publicó nada." >&2; exit 1
fi
remote "mv ~/$INCOMING.part ~/$INCOMING"
UPLOADING=0
echo "    sha256 verificado"

echo "==> Descomprimiendo, respaldando ~/$DEPLOY_PATH y publicando"
remote "DEPLOY_PATH='$DEPLOY_PATH' INCOMING='$INCOMING' STAMP='$STAMP' bash -s" <<'REMOTE'
set -euo pipefail
TARGET=~/"$DEPLOY_PATH"
SRC=~/deploy/staging
mkdir -p "$TARGET" ~/deploy/backups "$SRC"

tar xzf ~/"$INCOMING" -C "$SRC"
rm -f ~/"$INCOMING"
[ -f "$SRC/index.html" ] || { echo "El paquete no contiene index.html; no se publica."; rm -rf "$SRC"; exit 1; }

# Respaldo de lo publicado (sin .well-known ni cgi-bin, que gestiona cPanel).
tar czf ~/deploy/backups/"$STAMP".tgz -C "$TARGET" --exclude=./.well-known --exclude=./cgi-bin . 2>/dev/null || true

# Sustitución: borra lo que ya no existe en el build y copia lo nuevo.
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete --exclude=.well-known --exclude=cgi-bin "$SRC"/ "$TARGET"/
else
  find "$TARGET" -mindepth 1 -maxdepth 1 ! -name .well-known ! -name cgi-bin -exec rm -rf {} +
  cp -a "$SRC"/. "$TARGET"/
fi

# Permisos estándar de cPanel: carpetas 755, archivos 644.
find "$TARGET" -path "$TARGET/.well-known" -prune -o -type d -exec chmod 755 {} +
find "$TARGET" -path "$TARGET/.well-known" -prune -o -type f -exec chmod 644 {} +

# Limpieza: sin carpeta temporal ni paquete; conserva los 3 últimos respaldos.
rm -rf "$SRC" ~/deploy/incoming
ls -1t ~/deploy/backups/*.tgz 2>/dev/null | tail -n +4 | xargs -r rm -f
echo "Publicado: $(find "$TARGET" -type f | wc -l) archivos en $TARGET"
REMOTE

# --- Comprobación ------------------------------------------------------------------------------
if command -v curl >/dev/null 2>&1; then
  echo "==> Comprobando https://$DOMAIN/"
  curl -s -o /dev/null -w "    /            %{http_code}\n" "https://$DOMAIN/" || true
  curl -s -o /dev/null -w "    /sitemap.xml %{http_code}\n" "https://$DOMAIN/sitemap.xml" || true
  curl -s -o /dev/null -w "    /no-existe   %{http_code} (debe ser 404)\n" "https://$DOMAIN/no-existe" || true
  if [ "$NOINDEX" = 1 ]; then
    echo "    X-Robots-Tag: $(curl -sI "https://$DOMAIN/" | tr -d '\r' | grep -i '^x-robots-tag:' | cut -d' ' -f2- || true)"
    echo "    robots.txt:   $(curl -s "https://$DOMAIN/robots.txt" | tr '\n' ' ' || true)"
  fi
fi
echo "Listo. Si algo falla: bash scripts/deploy.sh --rollback"
