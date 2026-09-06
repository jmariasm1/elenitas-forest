# Original asset pipeline

`Blender Python → .blend source → .glb export → Three.js GLTFLoader → browser`

The pipeline was first proved with one tree and one rabbit. Both models loaded in the browser and the rabbit reacted to a click before the remaining library was generated.

Run `.\tools\build_assets.ps1`. On this machine, direct execution of the Microsoft Store package binary returned Access Denied. The registered `blender-launcher.exe` alias correctly forwarded `--background --python` arguments. The installed Blender application was not altered.

`blender/scripts/generate_assets.py` constructs rounded primitives, mathematical polygon extrusions, extruded Fredoka letterforms, modular environment props, instruments and astronomical bodies. One Blender unit corresponds to one world unit (approximately a stylized meter). Blender uses Z up and the models face -Y; GLB export converts to Three.js Y up, facing +Z. Animation pivots are preserved for ears, wings, bars and rings.

Static parts are merged into meshes with a shared vertex-color material. Movable parts remain separate. Animal GLBs include an `Idle` animation; runtime behaviors use lightweight procedural transforms to make touch reactions interruptible without stacking animation queues. They are not complex skeletal rigs.

The generator saves 84 editable sources and runtime models. Selected previews are rendered to `blender/previews/` (excluded from Git). Earth continents are subdivided and projected back onto a sphere so land does not disappear inside the ocean surface. Planet distances and relative sizes are intentionally compressed in the game.

`public/models/manifest.json` records IDs, paths, mesh counts, triangle counts and expected animations. `node tools/validate.mjs` verifies all required sources and GLBs, binary headers, mesh/material presence, animations, transforms, localization, numbers and narration. The build fails if any critical content is missing.

Icons are original SVG artwork rendered to PNG by `node tools/build-icons.mjs`. No third-party model pack or AI image service is used.

## Audio

`tools/author_content.py` is the editorial source. `tools/build_audio.py` uses Piper during development to render WAV files at the voices' native 22,050 Hz. Both languages' clips are included under `public/audio/<language>/narration/`. The model downloads are pinned to the repository revision in `tools/build_audio.ps1`. Changing an existing phrase requires `--force` or removing only the corresponding generated WAV before rerunning.

The game plays WAV files through Web Audio. It does not use browser speech synthesis, cloud TTS, or model inference. Animal effects, xylophone partials, percussion, nature ambience and sparse music are synthesized directly with bounded Web Audio oscillators.
