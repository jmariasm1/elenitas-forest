$ErrorActionPreference='Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    python tools/author_content.py
    New-Item -ItemType Directory -Force .tools/voices | Out-Null
    if(-not(Test-Path '.tools/voice-env/Scripts/python.exe')){python -m venv .tools/voice-env}
    & .tools/voice-env/Scripts/python.exe -m pip install 'piper-tts==1.8.0'
    $voices=@{es='es/es_MX/ald/medium/es_MX-ald-medium';en='en/en_US/ljspeech/medium/en_US-ljspeech-medium'}
    foreach($lang in $voices.Keys){
        foreach($extension in @('.onnx','.onnx.json')){
            $destination=".tools/voices/$lang$extension"
            if(-not(Test-Path $destination)){
                Invoke-WebRequest ("https://huggingface.co/rhasspy/piper-voices/resolve/1162a9173d0ce503555aed757976b7a9912eae4c/"+$voices[$lang]+$extension) -OutFile $destination
            }
        }
    }
    & .tools/voice-env/Scripts/python.exe tools/build_audio.py
    if($LASTEXITCODE -ne 0){throw 'Narration generation failed'}
} finally { Pop-Location }
