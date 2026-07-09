# Publish Global Realty Taiwan site to GitHub Pages
# Prerequisite: gh auth login (GitHub CLI)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$gh = 'C:\Program Files\GitHub CLI\gh.exe'
if (-not (Test-Path $gh)) { $gh = 'gh' }

& $gh auth status | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host 'Please run: gh auth login --web' -ForegroundColor Yellow
  exit 1
}

$repoName = 'global-realty-taiwan'
$owner = (& $gh api user -q .login).Trim()

$hasRemote = $false
try {
  git remote get-url origin 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) { $hasRemote = $true }
} catch {}

if (-not $hasRemote) {
  & $gh repo create $repoName --public --description '環球置業 Global Realty 台灣官網' --source=. --remote=origin --push
} else {
  git push -u origin main
}

& $gh api -X PUT "repos/$owner/$repoName/pages" `
  -f build_type=legacy `
  -f 'source[branch]=main' `
  -f 'source[path]=/' | Out-Null

$url = "https://$owner.github.io/$repoName/"
Write-Host ""
Write-Host "GitHub Pages URL:" -ForegroundColor Green
Write-Host $url
Write-Host ""
Write-Host "First deploy may take 1-3 minutes to become available."
