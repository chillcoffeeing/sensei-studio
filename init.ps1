# init.ps1 - Verificacion ejecutable del arnes
# Uso: ./init.ps1        Codigo de salida 0 = verde.

$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
$script:failures = 0

function Write-Step([string]$name) { Write-Host ""; Write-Host "==> $name" -ForegroundColor Cyan }
function Test-Result([bool]$ok, [string]$label) {
  if ($ok) { Write-Host "[OK]   $label" -ForegroundColor Green }
  else { Write-Host "[FAIL] $label" -ForegroundColor Red; $script:failures++ }
}
function Invoke-Pnpm([string]$script, [string]$label) {
  & pnpm run --silent $script
  Test-Result ($LASTEXITCODE -eq 0) $label
}

Write-Host "ARNES Sensei Studio - verificacion" -ForegroundColor Yellow

# 1. Toolchain
Write-Step "Toolchain"
$nodeVersion = $null; $pnpmVersion = $null
try { $nodeVersion = (& node --version) 2>$null } catch { }
try { $pnpmVersion = (& pnpm --version) 2>$null } catch { }
Test-Result ([bool]$nodeVersion) "node ($nodeVersion)"
Test-Result ([bool]$pnpmVersion) "pnpm (v$pnpmVersion)"
if (-not ($nodeVersion -and $pnpmVersion)) { Write-Host "ROJO: falta toolchain." -ForegroundColor Red; exit 1 }

# 2. Dependencias
Write-Step "Dependencias"
& pnpm install --prefer-offline 2>&1 | Out-Null
Test-Result ($LASTEXITCODE -eq 0) "pnpm install"

# 3. Estado del arnes
Write-Step "Estado (feature_list.json)"
try {
  $list = Get-Content -LiteralPath (Join-Path $root "feature_list.json") -Raw -Encoding utf8 | ConvertFrom-Json
  $valid = @('pending', 'in_progress', 'done', 'blocked')
  $inProgress = @($list.features | Where-Object { $_.status -eq 'in_progress' })
  $invalid = @($list.features | Where-Object { $valid -notcontains $_.status })
  $ids = @($list.features | ForEach-Object { $_.id })
  $badDeps = @($list.features | ForEach-Object { $f = $_; @($f.dependsOn) | Where-Object { $_ -and ($ids -notcontains $_) } | ForEach-Object { "$($f.id)->$_" } })
  Test-Result ($inProgress.Count -le 1) "maximo UNA feature in_progress (hay $($inProgress.Count))"
  Test-Result ($invalid.Count -eq 0) "estados validos"
  Test-Result ($badDeps.Count -eq 0) "dependsOn apuntan a features existentes $($badDeps -join ', ')"
} catch { Test-Result $false "feature_list.json parseable ($_)" }

# 4-7. Calidad
Write-Step "Sistema de diseno";  Invoke-Pnpm "check:ds"    "sin valores sueltos en src/"
Write-Step "Arquitectura";       Invoke-Pnpm "check:arch"  "fronteras de capas y modulos"
Write-Step "Tipos";              Invoke-Pnpm "check:types" "astro check"
Write-Step "Build";              Invoke-Pnpm "build"       "astro build"

Write-Host ""
Write-Host "==============================================" -ForegroundColor Yellow
if ($script:failures -eq 0) { Write-Host "VERDE: todo en orden." -ForegroundColor Green; exit 0 }
Write-Host "ROJO: $script:failures paso(s) fallando." -ForegroundColor Red
exit 1
