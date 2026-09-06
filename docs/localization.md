# Localization and narration

Spanish is the source language. `tools/author_content.py` generates `src/data/content.json` (runtime import) and `public/content.json` (inspectable content package). There are 114 keys in each language. Seventy non-UI/non-place keys have local narrated WAV files per language.

Keys describe concepts, for example `animal.rabbit`, `shape.hexagon.0`, `letter.m`, `count.3`, and `planet.saturn`. Gameplay selects identifiers rather than constructing spoken sentences. Shape/color phrases have authored agreement: `Estrella rosada`, `Hexágono amarillo`. Counting uses a single short clip and a matching bounded visual group.

Letter associations are authored independently:

| Letter | Español | English |
| --- | --- | --- |
| A | Árbol | Apple |
| E | Estrella | Earth |
| L | Luna | Leaf |
| M | Mariposa | Moon |
| S | Sol | Sun |

Associated models change with the language. The full Spanish alphabet, including Ñ, exists in the asset library. Only the five initial letters are placed in this slice.

One narration plays at a time. While it plays or loads, only the latest pending phrase is retained. Changing scenes/language or pausing cancels narration. Failed audio fetches can retry on a later tap. No narration is queued until a user gesture unlocks audio.

Additional languages can be added to the catalog and asset directory, then to the `Language` type, settings selector and validation language list. The architecture uses two explicitly supported languages today; adding a third is a small code-and-content change rather than claiming automatic language discovery.
