param([switch]$Proof)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$blenderExecutable = $env:BLENDER_EXE
if (-not $blenderExecutable) {
    $command = Get-Command blender -ErrorAction SilentlyContinue
    if ($command) { $blenderExecutable = $command.Source }
    else {
        $launcher = Join-Path $env:LOCALAPPDATA 'Microsoft\WindowsApps\blender-launcher.exe'
        if (Test-Path -LiteralPath $launcher) { $blenderExecutable = $launcher }
        else { throw 'Set BLENDER_EXE to your Blender executable.' }
    }
}
$script = Join-Path $projectRoot 'blender\scripts\generate_assets.py'
$argsList = @('--background','--python-exit-code','1','--python',('"' + $script + '"'))
if ($Proof) { $argsList += @('--','--proof') }
$marker = Join-Path $projectRoot $(if ($Proof) { '.tools\proof.done' } else { '.tools\assets.done' })
New-Item -ItemType Directory -Force (Join-Path $projectRoot '.tools') | Out-Null
if (Test-Path -LiteralPath $marker) { Remove-Item -LiteralPath $marker }
$errorMarker = Join-Path $projectRoot '.tools\assets.error'
if (Test-Path -LiteralPath $errorMarker) { Remove-Item -LiteralPath $errorMarker }
Start-Process -FilePath $blenderExecutable -ArgumentList $argsList -WorkingDirectory $projectRoot -WindowStyle Hidden -Wait
# Store launcher may return before its Blender child process exits.
$deadline = (Get-Date).AddMinutes(15)
while (-not (Test-Path -LiteralPath $marker)) {
    if (Test-Path -LiteralPath $errorMarker) { throw (Get-Content -LiteralPath $errorMarker -Raw) }
    if ((Get-Date) -gt $deadline) { throw 'Blender did not finish. Run the command directly to inspect its errors.' }
    Start-Sleep -Seconds 2
}
Write-Output ('Generated assets: ' + (Get-Content -LiteralPath $marker))
