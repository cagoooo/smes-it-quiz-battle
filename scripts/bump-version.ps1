param([string]$Notes = "內容更新")

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$encoding = New-Object System.Text.UTF8Encoding($false)
$today = Get-Date -Format 'yyyy.MM.dd'
$versionPath = Join-Path $root 'version.json'
$sequence = 1

if (Test-Path $versionPath) {
  $previous = (Get-Content -Raw -Encoding utf8 $versionPath | ConvertFrom-Json).version
  if ($previous -match "^$([regex]::Escape($today))-(\d+)$") { $sequence = [int]$Matches[1] + 1 }
}

$version = "$today-$sequence"
$versionJson = [ordered]@{ version = $version; notes = $Notes } | ConvertTo-Json
[System.IO.File]::WriteAllText($versionPath, $versionJson, $encoding)

$replacements = @(
  @{ File = 'sw.js'; Pattern = "const BUILD_VERSION = '[^']+';"; Value = "const BUILD_VERSION = '$version';" },
  @{ File = 'index.html'; Pattern = "window.APP_VERSION='[^']+'"; Value = "window.APP_VERSION='$version'" },
  @{ File = 'index.html'; Pattern = "\?v=\d{4}\.\d{2}\.\d{2}-\d+"; Value = "?v=$version" }
)

foreach ($replacement in $replacements) {
  $path = Join-Path $root $replacement.File
  $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
  $updated = [regex]::Replace($content, $replacement.Pattern, $replacement.Value)
  [System.IO.File]::WriteAllText($path, $updated, $encoding)
}

Write-Host "版本已升級為 $version"
