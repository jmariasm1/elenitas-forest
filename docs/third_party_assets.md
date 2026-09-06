# Third-party provenance

All 84 Blender models, their geometry, palette, scene layout, illustrations, interaction sounds and musical sequences were created for this project. No third-party model pack, copyrighted children's recording, downloaded song, or franchise artwork is used.

| Resource | Use | License / provenance |
| --- | --- | --- |
| Three.js 0.185.1 | Runtime rendering and GLTFLoader | MIT; https://github.com/mrdoob/three |
| Fredoka variable font | UI and extruded letter/number geometry | SIL Open Font License 1.1; Copyright 2016 The Fredoka Project Authors. Copy: `public/fonts/OFL-Fredoka.txt`. Source: https://github.com/google/fonts/tree/main/ofl/fredoka |
| Blender 5.2.1 | Development-only original asset generation | GPL; not shipped with the game. https://www.blender.org/ |
| Piper TTS 1.8.0 | Development-only narration synthesis | GPL-3.0; not shipped with the game. https://github.com/OHF-Voice/piper1-gpl |
| `es_MX-ald-medium` voice | Spanish WAV generation | Model card identifies the Ald Mexican Spanish dataset as Unlicense. Fine-tuned from davefx; model weights are not redistributed. https://huggingface.co/rhasspy/piper-voices/blob/main/es/es_MX/ald/medium/MODEL_CARD |
| `en_US-ljspeech-medium` voice | English WAV generation | Model card identifies LJ Speech as public domain. Model weights are not redistributed. https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ljspeech/medium/MODEL_CARD |
| Vite, TypeScript, Playwright CLI, resvg, Prettier | Development/build/testing | Respect their package licenses; installed dependencies are recorded in the lockfile. None is a runtime network service. |

Voice download revision: `1162a9173d0ce503555aed757976b7a9912eae4c`. The spoken text is original authored vocabulary. Voice assets are synthetic and should be evaluated by an adult for clarity and comfort; replacing them with family recordings does not require changing gameplay code. No personal voice has been cloned.

The original project MIT license does not replace the licenses of the font or third-party tools. Keep the font license when redistributing the assets. Model files and build-tool binaries are excluded from the source repository's `.tools/` folder.
