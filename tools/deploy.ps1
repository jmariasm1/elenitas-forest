param([ValidateSet('github','cloudflare')][string]$Provider='github')
$ErrorActionPreference='Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    & ./tools/build_web.ps1
    if($Provider -eq 'cloudflare') {
        npx wrangler pages deploy build/web --project-name elenitas-forest
        if($LASTEXITCODE -ne 0){throw 'Cloudflare deployment failed; authenticate with wrangler login.'}
    } else {
        git push origin main
        if($LASTEXITCODE -ne 0){throw 'Git push failed. Commit the reviewed source first.'}
        gh workflow run deploy.yml --ref main
        if($LASTEXITCODE -ne 0){throw 'Could not dispatch Pages workflow'}
        gh run list --workflow deploy.yml --limit 1
    }
} finally { Pop-Location }
