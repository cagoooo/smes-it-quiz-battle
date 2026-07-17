# 協助重新授權並推送 workflow 設定檔
$ErrorActionPreference = "Stop"

Write-Host "⚡ 正在為 GitHub CLI 重新授權以取得 workflow 修改權限..." -ForegroundColor Cyan
Write-Host "💡 稍後會自動彈出瀏覽器視窗，請點擊【Authorize github】同意授權。" -ForegroundColor Yellow
gh auth refresh -s workflow

Write-Host "⚡ 正在將本地的金鑰注入與 gh-pages 部署設定檔推送到 GitHub..." -ForegroundColor Cyan
git add .github/
try {
    git commit -m "ci: 啟用金鑰自動注入與 gh-pages 部署工作流"
} catch {
    # 如果已經 commit 過，就繼續
}

$token = (gh auth token).Trim()
git push "https://cagoooo:$token@github.com/cagoooo/smes-it-quiz-battle.git" main

Write-Host "✅ 部署工作流已成功推送至遠端！" -ForegroundColor Green
