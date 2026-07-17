# Background listener for .env file update
$ErrorActionPreference = "Stop"

$count = 0
while ($count -lt 60) {
    if (Test-Path .env) {
        $envContent = Get-Content .env -Raw
        $urlMatch = [regex]::Match($envContent, 'VITE_SUPABASE_URL=(.*)')
        $keyMatch = [regex]::Match($envContent, 'VITE_SUPABASE_ANON_KEY=(.*)')
        
        $url = if ($urlMatch.Success) { $urlMatch.Groups[1].Value.Trim() } else { "" }
        $key = if ($keyMatch.Success) { $keyMatch.Groups[1].Value.Trim() } else { "" }
        
        if ($url -and $url -notlike "*YOUR_SUPABASE_URL*" -and $key -and $key -notlike "*YOUR_SUPABASE_ANON_KEY*") {
            Write-Host "Real keys detected. Uploading to GitHub Secrets..." -ForegroundColor Green
            $env:GITHUB_TOKEN = $null
            [Environment]::SetEnvironmentVariable("GITHUB_TOKEN", $null, "Process")
            gh secret set VITE_SUPABASE_URL --body "$url"
            gh secret set VITE_SUPABASE_ANON_KEY --body "$key"
            Write-Host "GitHub Secrets uploaded successfully." -ForegroundColor Green
            break
        }
    }
    Start-Sleep -Seconds 5
    $count++
}
