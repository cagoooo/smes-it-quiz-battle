# 讀取 .env 檔案並設定 GitHub Secrets 與 Pages
$ErrorActionPreference = "Stop"

if (Test-Path .env) {
    $envContent = Get-Content .env -Raw
    $urlMatch = [regex]::Match($envContent, 'VITE_SUPABASE_URL=(.*)')
    $keyMatch = [regex]::Match($envContent, 'VITE_SUPABASE_ANON_KEY=(.*)')
    
    $url = if ($urlMatch.Success) { $urlMatch.Groups[1].Value.Trim() } else { "" }
    $key = if ($keyMatch.Success) { $keyMatch.Groups[1].Value.Trim() } else { "" }
    
    if ($url -and $url -notlike "*YOUR_SUPABASE_URL*" -and $key -and $key -notlike "*YOUR_SUPABASE_ANON_KEY*") {
        Write-Host "✅ 偵測到本地真實金鑰，正在寫入 GitHub Secrets..." -ForegroundColor Green
        gh secret set VITE_SUPABASE_URL --body "$url"
        gh secret set VITE_SUPABASE_ANON_KEY --body "$key"
        Write-Host "✅ GitHub Secrets 寫入完成！" -ForegroundColor Green
    } else {
        Write-Warning "⚠️ 本地 .env 仍為佔位符，請先在 .env 檔案中填入您真實的 Supabase 專案 URL 與 ANON KEY。"
    }
} else {
    Write-Warning "⚠️ 找不到 .env 檔案，請先在專案根目錄建立 .env 檔案。"
}

Write-Host "⚡ 正在配置 GitHub Pages 部署分支為 gh-pages..." -ForegroundColor Cyan
try {
    gh api -X PUT /repos/cagoooo/smes-it-quiz-battle/pages -f "source[branch]=gh-pages" -f "source[path]=/"
    Write-Host "✅ GitHub Pages 配置完成！" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ GitHub Pages 已經配置過，或需要您在 GitHub 網頁上將部署來源改為 gh-pages 分支。" -ForegroundColor Yellow
}
