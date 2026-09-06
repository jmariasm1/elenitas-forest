# Testing record

Tests were performed in desktop Chromium through Playwright CLI. No physical phone/tablet or Safari claim is made.

## Completed checks

- Original tree/rabbit `.blend` → `.glb` → actual browser rendering pipeline proof.
- TypeScript typecheck and release build.
- Validation of 84 GLBs and Blender source files, materials, expected animal animation tracks, reasonable transforms/mesh budgets, unique definitions, localization parity and all 140 narration files.
- Clicked all five animals; both variants of all eight initial shapes; all six quantities; all five letters; all six xylophone bars, drum and bell; cloud; telescope; all six space bodies; and return home. The browser recorded 48 successful interactions in that pass, with no console errors.
- Quantity assertions confirmed exactly 0–5 rendered quantity butterflies.
- A dedicated 844×390 landscape check tapped all six quantities, the Sun, all five night stars, and the Moon. The sky layout keeps the cloud clear of the stars and the Sun/Moon in front of the tree line.
- All five requested viewports and rotated counterparts: 360×800, 390×844, 412×915, 768×1024, 820×1180. No horizontal overflow; primary animal and sky targets within screen bounds; rabbit responded in every viewport.
- Thirty-five rapid clicks, three simultaneous emulated touch points, and small accidental drag movements. Particle and narration queues stayed bounded.
- Parent gate rejected a brief press and an incorrect answer, accepted a held leaf plus correct answer, and exposed settings only afterwards.
- English, reduced motion, subtitles and volume changes persisted across reload. English audio unlocked correctly and disabled subtitles remained hidden.

## Browser commands

Run `npm run dev`, then:

```powershell
node node_modules/@playwright/cli/playwright-cli.js -s=elenita open 'http://localhost:5173/?debug=1' --headed
node tools/run-browser-check.mjs tools/browser-smoke.js
node tools/run-browser-check.mjs tools/browser-mobile.js
node tools/run-browser-check.mjs tools/browser-sky.js
node tools/run-browser-check.mjs tools/browser-settings.js
```

Use a fresh Spanish session for smoke/mobile tests. The settings test leaves English preferences saved intentionally. The CLI wrapper uses Node `execFileSync` with structured argument arrays so multiline JavaScript is not corrupted by Windows shell quoting. Tests click the real rendered canvas using projected target coordinates from the debug-only, read-only interface; they do not call gameplay reaction methods.

Visual artifacts are generated under `output/playwright/` and are excluded from Git. The browser tests throw on assertion failure. Normal child-facing builds hide all instrumentation.

## Remaining human validation

Test actual Android Chrome and iPhone/iPad Safari, including audio volume, rotation, home-screen installation, background/resume and offline reload. Observe Elenita with an adult: whether she recognizes targets, notices their reactions, understands camera travel, and enjoys the pace. Do not collect analytics or optimize for session length.

## Production verification — September 6, 2026

The built HTTP site installed a complete service-worker cache (236 requests, including the HTML entry point). With networking disabled through Playwright, reload succeeded, the rabbit responded with local narration, the deferred space scene loaded, and Saturn responded. No page errors occurred. Reproduce with a fresh Spanish session on the built site:

```powershell
node node_modules/@playwright/cli/playwright-cli.js -s=production open 'http://localhost:4173/?debug=1' --headed
node tools/run-browser-check.mjs tools/browser-offline.js production
```

The public HTTPS site returned 200 and the complete 48-interaction smoke sequence also passed there, including every initial creature category, space and return home. Its browser console contained no warnings or errors. The public address is [El Bosque de Elenita](https://jmariasm1.github.io/elenitas-forest/).

Two attempts to simulate real OS backgrounding with Playwright's tab/focus APIs did not change `document.visibilityState`; they timed out. This is not counted as a passed background/resume test. The implementation uses the standard visibility event, but actual background/resume remains on the human device checklist above.
