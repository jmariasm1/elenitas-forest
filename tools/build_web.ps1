$ErrorActionPreference='Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    if (-not (Test-Path -LiteralPath 'node_modules')) { npm ci; if($LASTEXITCODE -ne 0){throw 'Dependency installation failed'} }
    node tools/build-icons.mjs
    npm run build
    if($LASTEXITCODE -ne 0){throw 'Web build failed'}
} finally { Pop-Location }
