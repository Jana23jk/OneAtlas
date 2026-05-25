# OneAtlas dev starter — frees ports, syncs env, clears cache, starts Next.js
$ErrorActionPreference = "SilentlyContinue"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "Stopping anything on ports 3000 and 3001..." -ForegroundColor Cyan
foreach ($port in @(3000, 3001)) {
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}

if (Test-Path ".env.local") {
  Copy-Item ".env.local" ".env" -Force
  Write-Host "Synced .env.local -> .env" -ForegroundColor Cyan
}

if (Test-Path ".next") {
  Remove-Item -Recurse -Force ".next"
  Write-Host "Cleared .next cache" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Starting OneAtlas at http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

npm run dev
