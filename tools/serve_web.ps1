param([int]$Port=4173,[switch]$LAN)
$ErrorActionPreference='Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    if(-not(Test-Path -LiteralPath 'build/web/index.html')){throw 'Run .\tools\build_web.ps1 first.'}
    $bindAddress=if($LAN){'0.0.0.0'}else{'127.0.0.1'}
    Write-Output "El Bosque de Elenita: http://localhost:$Port"
    python -m http.server $Port --bind $bindAddress --directory build/web
} finally { Pop-Location }
