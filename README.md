# El Bosque de Elenita

A quiet, Spanish-first 3D forest made for Elenita. Touch an animal, a shape, a letter, a number, an instrument, or the sky and see what happens. No scores, quizzes, advertisements, accounts, tracking, or purchases.

**Runtime: Three.js + TypeScript.** The user's explicit correction replaces the Godot requirement in the original briefs. Blender creates the original models; no game engine installation is needed to play or build the website.

## Play

**[Play El Bosque de Elenita](https://jmariasm1.github.io/elenitas-forest/)** · [Source repository](https://github.com/jmariasm1/elenitas-forest)

The public HTTPS build has been verified. Deployment details are recorded in [docs/deployment.md](docs/deployment.md).

Landscape works best. Portrait remains playable and offers a gentle rotation hint. Press the large play button to enable browser audio. Use the illustrated trail at the bottom, or the large mushrooms beside each clearing, to move through the connected forest. Touch the telescope to visit space; the forest button brings you home. The Sun and Moon change the time of day.

For parent settings, press the lock, hold the leaf for about three seconds, then answer the addition question. Settings include Español/English, six separate volume controls, subtitles, reduced motion, and reset. Only these preferences are stored locally.

## Build prerequisites

- Node.js 24 and npm. Runtime and development packages are locked in `package-lock.json`.
- Windows PowerShell for the convenience scripts. The website build also works on Linux/macOS with `npm ci` and `npm run build`.
- Blender 5.2.1 was used to regenerate models; prebuilt `.glb` and editable `.blend` files are included.
- Python 3.13 was used for local hosting, vocabulary authoring, and optional voice regeneration. No Python is needed by players.
- Git; GitHub CLI for the deployment helper.

```powershell
npm ci
npm run dev
```

Open **http://localhost:5173/**. Vite also prints addresses for local network testing.

## Rebuild assets

```powershell
.\tools\build_assets.ps1
```

The script discovers Blender through `BLENDER_EXE`, a `blender` command, or the Microsoft Store `blender-launcher.exe` alias. It does not modify the installed Blender application. Output is written to `blender/source/`, `blender/previews/`, and `public/models/`.

To explicitly select an executable:

```powershell
$env:BLENDER_EXE = 'C:\path\to\blender.exe'
.\tools\build_assets.ps1
```

The initial pipeline can be exercised with `-Proof` to generate just a tree and rabbit. Run the full asset command afterwards before building the complete game.

## Rebuild vocabulary and narration

```powershell
python tools/author_content.py
.\tools\build_audio.ps1
```

Existing narration is included, so this is optional. The voice build creates a local virtual environment and downloads two pinned Piper models. Piper is a build tool only. To regenerate changed existing phrases, run `.\.tools\voice-env\Scripts\python.exe tools/build_audio.py --force`. Spanish and English each contain 70 prerecorded narration clips.

## Build and serve the release

```powershell
.\tools\build_web.ps1
.\tools\serve_web.ps1
```

Open **http://localhost:4173/**. The complete static release is in `build/web/`, including `index.html`, bundled JavaScript, models, audio, icons, manifest, and a generated service worker. Never open the HTML with a `file://` URL.

For another device on the same Wi-Fi, run `.\tools\serve_web.ps1 -LAN` and open `http://<computer-LAN-IP>:4173/`. Find the address with `Get-NetIPAddress -AddressFamily IPv4`; choose the actual network adapter rather than a virtual adapter. Windows may require allowing the server on the private network. Service-worker installation requires HTTPS or localhost, so test phone offline behavior using the public HTTPS site.

## Verify

```powershell
npm run validate
npx tsc --noEmit
node node_modules/@playwright/cli/playwright-cli.js -s=elenita open 'http://localhost:5173/?debug=1' --headed
node tools/run-browser-check.mjs tools/browser-smoke.js
node tools/run-browser-check.mjs tools/browser-mobile.js
node tools/run-browser-check.mjs tools/browser-settings.js
```

The scripts interact with actual canvas coordinates and parent controls. They require a fresh Spanish session; the settings test intentionally leaves English preferences saved. See [testing](docs/testing.md) for the production/offline check and test boundaries. `?debug=1` enables the developer overlay and a read-only inspection interface. Normal play exposes neither.

## Deploy

After committing your changes:

```powershell
.\tools\deploy.ps1
```

GitHub Actions builds, validates, and publishes pushes to `main`. The repository must have GitHub Pages configured to use GitHub Actions. The initial deployment uses GitHub Pages because no Cloudflare credential was available. Cloudflare Pages remains supported:

```powershell
.\tools\deploy.ps1 -Provider cloudflare
```

This command expects an authenticated Wrangler installation/session and an existing `elenitas-forest` Pages project. See [deployment](docs/deployment.md).

## Current content

- Five animals: rabbit, frog, duck, butterfly, owl.
- Eight mathematical shapes, each with two narrated color variants: circle, triangle, square, rectangle, pentagon, hexagon, trapezoid, star.
- A, E, L, M, S with independently authored Spanish and English associations.
- Numbers 0–5 with exactly matching butterfly groups; zero has an empty nest.
- Six individually playable xylophone bars, a drum, and bells. Drag across the bars to play.
- Rain, growing flowers, wind, pond ripples, daytime/nighttime lighting, a Moon, five musical stars, and fireflies.
- A telescope journey to the Sun, Earth, Moon, Mars, Jupiter and Saturn, with an easy return home.

There are 64 runtime target records after loading space, including navigation and one disabled instrument container: 51 enabled content targets, with 59 distinct responses when counting the second shape colors. The complete catalog is in [docs/interaction_catalog.md](docs/interaction_catalog.md).

The **84 original model assets** also include the full Spanish alphabet (including Ñ), numbers through 10, 13 geometric shapes, and all eight planets. The additional assets are available for expansion; they are not all placed in this first playable slice.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/` | Modular Three.js runtime, touch, behaviors, weather, audio, camera, UI and settings |
| `src/data/content.json` | Canonical bilingual content and entity definitions |
| `public/models/` | Blender-exported GLBs and the asset manifest |
| `public/audio/` | Local Spanish and English narration |
| `blender/scripts/` | Reproducible original model generation |
| `blender/source/` | Editable Blender source files |
| `tools/` | Asset, voice, validation, browser, build and deployment tools |
| `docs/` | Architecture, art, licensing, tests and deployment documentation |
| `.github/workflows/` | Static-site CI and deployment |

## Known limitations

- Device-size and multitouch tests use desktop Chromium emulation. Actual iPhone/iPad/Android hardware testing and observation of Elenita are still needed. No claim of physical-device or Safari verification is made.
- Voices are local synthetic speech, not a recorded family member. Animal sounds are gentle original synthesized approximations; rabbits and butterflies are intentionally quiet.
- The solar system is a compressed discovery diorama, not a scale model or a physical orbit simulation. Four additional planets are assets for future expansion.
- The first slice uses constrained camera travel and a small set of procedural reactions, not a free-roaming character or a fully simulated ecosystem. Shape stacking/bridge construction and elaborate secondary animal behaviors can be expanded.
- Offline play works after the first complete service-worker cache installation. Browsers may later evict stored site data. The cache contains both languages and space; there is no online AI dependency.

Original project code and models use the MIT license. Third-party font, library, and voice provenance is documented in [docs/third_party_assets.md](docs/third_party_assets.md).
