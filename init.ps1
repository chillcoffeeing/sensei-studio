# init.ps1 - Verificacion ejecutable del arnes
# Uso: ./init.ps1
# Codigo de salida 0 = verde. Cualquier otro = rojo.

$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$script:failures = 0

function Write-Step([string]$name) {
  Write-Host ""
  Write-Host "==> $name" -ForegroundColor Cyan
}

function Test-Result([bool]$ok, [string]$label) {
  if ($ok) {
    Write-Host "[OK]   $label" -ForegroundColor Green
  }
  else {
    Write-Host "[FAIL] $label" -ForegroundColor Red
    $script:failures++
  }
}

Write-Host "ARNES landing-de-ventas - verificacion inicial" -ForegroundColor Yellow

# 1. Toolchain ---------------------------------------------------------------
Write-Step "Toolchain"

$nodeOk = $false
try {
  $nodeVersion = (& node --version) 2>$null
  if ($LASTEXITCODE -eq 0) { $nodeOk = $true }
}
catch { }
Test-Result $nodeOk "node disponible ($nodeVersion)"

$pnpmOk = $false
try {
  $pnpmVersion = (& pnpm --version) 2>$null
  if ($LASTEXITCODE -eq 0) { $pnpmOk = $true }
}
catch { }
Test-Result $pnpmOk "pnpm disponible (v$pnpmVersion)"

if (-not ($nodeOk -and $pnpmOk)) {
  Write-Host ""
  Write-Host "ROJO: falta toolchain. Abortando." -ForegroundColor Red
  exit 1
}

# 2. Dependencias ------------------------------------------------------------
Write-Step "Dependencias"

if (-not (Test-Path -LiteralPath (Join-Path $root "node_modules"))) {
  Write-Host "node_modules no existe, instalando..."
  & pnpm install
  Test-Result ($LASTEXITCODE -eq 0) "pnpm install"
}
else {
  & pnpm install --prefer-offline 2>&1 | Out-Null
  Test-Result ($LASTEXITCODE -eq 0) "dependencias al dia"
}

# 3. Estado de feature_list.json ---------------------------------------------
Write-Step "Estado del arnes (feature_list.json)"

$listPath = Join-Path $root "feature_list.json"
if (-not (Test-Path -LiteralPath $listPath)) {
  Test-Result $false "feature_list.json existe"
}
else {
  try {
    $list = Get-Content -LiteralPath $listPath -Raw | ConvertFrom-Json
    $inProgress = @($list.features | Where-Object { $_.status -eq 'in_progress' })
    $validStatuses = @('pending', 'in_progress', 'done', 'blocked')
    $invalid = @($list.features | Where-Object { $validStatuses -notcontains $_.status })
    Test-Result ($inProgress.Count -le 1) "maximo UNA feature in_progress (hay $($inProgress.Count))"
    Test-Result ($invalid.Count -eq 0) "todos los estados son validos"
    Test-Result $true "$(@($list.features).Count) features registradas"
  }
  catch {
    Test-Result $false "feature_list.json parseable como JSON ($_)"
  }
}

# 4. Tests -------------------------------------------------------------------
Write-Step "Tests (vitest run)"

& pnpm test
Test-Result ($LASTEXITCODE -eq 0) "suite de tests verde"

# 5. Build -------------------------------------------------------------------
Write-Step "Build (astro build)"

& pnpm build
Test-Result ($LASTEXITCODE -eq 0) "build de produccion"

# Resumen ----------------------------------------------------------------------
Write-Host ""
Write-Host "==============================================" -ForegroundColor Yellow
if ($script:failures -eq 0) {
  Write-Host "VERDE: todo en orden. Arnes listo." -ForegroundColor Green
  exit 0
}
else {
  Write-Host "ROJO: $script:failures paso(s) fallando." -ForegroundColor Red
  exit 1
}
