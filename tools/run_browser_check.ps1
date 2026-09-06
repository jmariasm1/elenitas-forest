param([string]$File = 'tools/browser-smoke.js', [string]$Session = 'elenita')
$ErrorActionPreference='Stop'
& node tools/run-browser-check.mjs $File $Session
if($LASTEXITCODE -ne 0){throw 'Browser check failed'}
