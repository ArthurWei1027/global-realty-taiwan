# 啟動環球置業官網公開 Demo（Cloudflare 臨時 URL）
$Root = Split-Path -Parent $PSScriptRoot
$Port = 8765
$Cloudflared = Join-Path $Root "tools\cloudflared.exe"

Write-Host ""
Write-Host "環球置業 Global Realty — 公開 Demo" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $Cloudflared)) {
    Write-Host "下載 cloudflared..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path (Join-Path $Root "tools") | Out-Null
    Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/download/2026.6.1/cloudflared-windows-amd64.exe" -OutFile $Cloudflared -UseBasicParsing
}

# 若 8765 已被占用則略過啟動 server
$listening = netstat -ano | Select-String ":$Port\s.*LISTENING"
if (-not $listening) {
    Write-Host "啟動本地伺服器 :$Port ..." -ForegroundColor DarkGray
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root'; python -m http.server $Port" -WindowStyle Minimized
    Start-Sleep -Seconds 2
}

Write-Host "啟動 Cloudflare 隧道..." -ForegroundColor Yellow
Write-Host "請複製下方 https://....trycloudflare.com 網址分享給團隊" -ForegroundColor Green
Write-Host "按 Ctrl+C 停止（停止後連結失效）" -ForegroundColor DarkGray
Write-Host ""

Set-Location $Root
& $Cloudflared tunnel --url "http://127.0.0.1:$Port" --no-autoupdate
