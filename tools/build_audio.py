"""Generate local WAV narration with public-domain-dataset Piper voices.
Only this build step uses Piper. The game contains no inference runtime.
"""
import json,wave,sys,time
from pathlib import Path
from piper import PiperVoice
from piper.config import SynthesisConfig
ROOT=Path(__file__).resolve().parents[1]
content=json.loads((ROOT/'src/data/content.json').read_text(encoding='utf-8'))
for lang in ['es','en']:
    voice=PiperVoice.load(str(ROOT/'.tools/voices'/f'{lang}.onnx'))
    dest=ROOT/'public/audio'/lang/'narration';dest.mkdir(parents=True,exist_ok=True)
    for key,text in content['strings'][lang].items():
        if key.startswith('ui.') or key.startswith('place.'): continue
        file=dest/(key+'.wav')
        if file.exists() and '--force' not in sys.argv: continue
        with wave.open(str(file),'wb') as wav:
            voice.synthesize_wav(text,wav,syn_config=SynthesisConfig(length_scale=1.08,volume=.8))
        print(lang,key,flush=True)
print('NARRATION_OK')
