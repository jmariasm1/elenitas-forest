# Performance and loading

The release measured approximately 11.6 MB uncompressed and 7.7 MB as a sum of individually gzipped resources before the final polish pass. `npm run build` prints the exact current figures. The initial JavaScript bundle is approximately 174 KB gzip. Unused future models and all narration can cache in the background after the first forest loads. Space-specific models are loaded on demand, except Earth, which is also an English letter companion.

Models share geometry and vertex-color materials. Static parts are merged. Pixel ratio is capped at 1.5; rendering is capped near 60 FPS. Only nearby clearing groups render. Shadows use a 1024² map and restrained intensity. A fixed pool holds 48 feedback particles, five quantity butterflies and six honeycomb models. Web Audio has a maximum of 24 oscillators plus one narration and at most one pending phrase.

`?debug=1` enables FPS, draw calls, triangle count, target count, loaded geometry count and scene information. Statistics are local and never transmitted. FPS calculation uses actual elapsed time rather than the clamped simulation delta.

Desktop Chromium measured approximately 54–55 FPS after the cap across the ten requested viewport orientations, using this machine's GPU. This is **not a physical-phone benchmark**. Forest scenes vary around 150–350 draw calls and 75k–160k triangles; space is substantially lighter. Actual device testing should establish whether lower DPR, fewer distant props, or disabled shadows are needed for a specific phone.

On browser backgrounding, the app suspends audio, clears narration and tones, and stops frame work. On returning it resumes only when play was started and parent settings are closed. Local textures, models, audio, code and font files are cached by a versioned service worker for subsequent offline play.
