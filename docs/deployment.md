# Deployment

The application is entirely static. No backend, account, database, cloud inference, or runtime API key is required.

## GitHub Pages

GitHub authentication is available for `jmariasm1`; Cloudflare credentials were not present. The authorized fallback is the `elenitas-forest` repository and its GitHub Pages site:

`https://jmariasm1.github.io/elenitas-forest/`

`.github/workflows/deploy.yml` validates and builds source on pushes to `main`, uploads `build/web/`, and deploys it through GitHub Pages. Action major versions were checked against their official release APIs during setup. Generated assets and audio are included in Git, so CI does not need Blender or voice models.

Enable Pages with source **GitHub Actions**. Once the repository exists and source is committed:

```powershell
.\tools\deploy.ps1
```

The helper builds locally, pushes `main`, and dispatches the workflow. The workflow also runs on push, with a shared concurrency group so a later run supersedes an earlier pending deployment.

All asset URLs are relative to the deployment directory. A repository subpath works without changing application code. There are no cross-origin isolation requirements because this is a Three.js application, not a threaded Godot WebAssembly export.

## Cloudflare Pages alternative

Build command: `npm ci && npm run build`. Output directory: `build/web`.

For an authenticated Wrangler session and an existing Pages project:

```powershell
.\tools\deploy.ps1 -Provider cloudflare
```

The generated `_headers` file provides restrictive permissions and a content security policy for Cloudflare Pages. GitHub Pages does not apply `_headers`; do not assume those extra response headers exist there.

## PWA and offline cache

The build generates a service worker containing a hash of the release and a complete local file list. Installation caches files in small batches, then activates the new version. Both voice languages, future model-library files, and the space assets become available offline after installation finishes. The app also includes responsive metadata, an original icon, a web manifest, and an Apple touch icon.

Offline behavior requires HTTPS or localhost. A first visit with no network cannot install files that have never loaded. Browser storage can be evicted. No external CDN, font service, analytics service or TTS API is contacted by the released game.

## Verification

Public deployment is pending final production verification. Do not infer completion from this configured URL alone.
