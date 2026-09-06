# Project instructions

- The user's latest technology choice is **Three.js**. The two original briefs mention Godot by mistake; do not introduce Godot or Unity.
- Spanish is canonical. Edit vocabulary in `tools/author_content.py`, regenerate the catalogs, and regenerate affected narration. Do not put spoken phrases in gameplay code.
- Preserve the gentle, continuous forest. No quizzes, scores, pressure, analytics, accounts, or external runtime APIs.
- Blender generation scripts and `.blend` sources are the editable source of the models. Runtime models are `.glb` files in `public/models`.
- Run `npm run build` for TypeScript, data/asset validation, bundling and offline-cache generation. Use the browser checks for changes to interactions or layout; see `docs/testing.md`.
- Never commit `.tools`, `node_modules`, caches, deployment credentials, or generated `build/` output. Changes to public source should remain reproducible.
