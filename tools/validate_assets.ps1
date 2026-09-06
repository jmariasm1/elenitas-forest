$ErrorActionPreference='Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try { node tools/validate.mjs; if($LASTEXITCODE -ne 0){throw 'Asset or content validation failed'} } finally { Pop-Location }
