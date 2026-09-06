# El Bosque de Elenita

## Product and engine decision

See → touch → react → hear → discover. One small, connected landscape: a central meadow and pond, a shape garden, a letter trail, a quantity orchard, a musical clearing, and a hilltop observatory. No tests, scores, rewards, failure, accounts, or child data.

The original brief asked to compare Godot and Unity. Both support native 3D, asset animation, localization and audio; Godot would offer a smaller open-source GDScript project, while Unity brings a larger tooling/runtime footprint. The user's subsequent instruction explicitly selects **Three.js**, making browser-native JavaScript the runtime and eliminating engine/WebAssembly installation and export requirements. Blender remains the source of the original 3D assets.

## System boundaries

- Asset library: GLB caching, instancing, original source geometry.
- World builder: one continuous forest and connected paths; camera stops are places in the same scene.
- Touch system: generous projected hit areas, pointer IDs, small drag tolerance, per-object cooldown, bounded effects.
- Creature behaviors: animal, shape, letter, number, instrument, environment, and planet reactions.
- Camera: constrained framing and gentle travel between clearings, no joystick or independent camera controls.
- Environment: day/night, rain, growth, fireflies and owl activity, event-driven cause/effect.
- Space: deferred planet loading and a gentle telescope journey with a persistent forest return.
- Audio: prerecorded local narration, latest-only pending phrase, category gains, procedural original music/effects.
- Localization: Spanish canonical content, independently authored English associations.
- Parent settings: adult gate, independent volume sliders, language, subtitles, reduced motion, reset; preferences only in local storage.

## Map

The forest clearings form a connected ring around a planted interior. Each clearing has a visible path to its neighbors. Large illustrated wayfinding controls move the camera through this single world. The observatory leads upward to a compressed solar-system diorama. Earth and the persistent forest icon lead home.

## Content contract

Definitions carry ID, kind, model, narration key, color, placement, behavior, and optional quantity/note/association. The first slice contains five animals, eight shape types in two colors, A/E/L/M/S, 0–5, six xylophone bars plus drum and bells, sky objects, environmental interactions and six space bodies. Additional mathematical shapes, the Spanish alphabet including Ñ, numbers through 10 and all eight planets are generated as reusable asset-library content.

## Performance

Limit device pixel ratio, share geometry/materials, combine static model parts into vertex-colored meshes, cap effects, keep physics out of the frame loop and pause while hidden. Planet assets load when needed. No external requests are necessary after the static assets are cached.
