# 啟動設計預覽站本地伺服器（從官網根目錄提供靜態檔）
$Port = 8765
$Root = Split-Path -Parent $PSScriptRoot
$Url = "http://localhost:$Port/design/"

Write-Host ""
Write-Host "澳華國際 設計預覽站" -ForegroundColor Cyan
Write-Host "  預覽站入口: $Url"
Write-Host "  Live 首頁:   http://localhost:$Port/index.html?design=1"
Write-Host ""
Write-Host "在 Cursor 內建瀏覽器開啟上述網址，即可使用 Design Mode 編輯元素。" -ForegroundColor Yellow
Write-Host "按 Ctrl+C 停止伺服器。" -ForegroundColor DarkGray
Write-Host ""

Set-Location $Root
python -m http.server $Port
