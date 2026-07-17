$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

node --check game.js
node --test tests/p0-regressions.test.js
if ($LASTEXITCODE -ne 0) { throw "Regression tests failed!" }

$index = Get-Content -Raw -Encoding utf8 index.html
$serviceWorker = Get-Content -Raw -Encoding utf8 sw.js
$version = (Get-Content -Raw -Encoding utf8 version.json | ConvertFrom-Json).version
$appVersion = "window.APP_VERSION='$version'"
$buildVersion = "const BUILD_VERSION = '$version'"
if ($index.Contains($appVersion) -eq $false) { throw "index.html APP_VERSION mismatch" }
if ($serviceWorker.Contains($buildVersion) -eq $false) { throw "sw.js BUILD_VERSION mismatch" }

Write-Host 'Preflight passed: syntax, P0 regression tests, and versions are consistent.'
