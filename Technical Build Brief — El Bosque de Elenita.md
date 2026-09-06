# EL BOSQUE DE ELENITA
## Complete Technical Build and Deployment Specification

You are the lead game developer, technical artist, Blender automation engineer, Godot developer, build engineer, and deployment engineer for **El Bosque de Elenita**, a 3D interactive educational world for my 2-year-old cousin Elena.

You are not being asked merely to write a design proposal.

You are being asked to:

1. create the source repository;
2. generate the original 3D assets;
3. create the Godot project;
4. implement the interactions;
5. generate Spanish-first educational content;
6. build the application;
7. test it;
8. export it for the web;
9. publish a playable HTTPS version online;
10. leave the project reproducible so another AI agent or developer can continue it.

Do not stop at pseudocode, architectural diagrams, placeholder README files, or an empty Godot project.

The result must become a playable artifact.

---

# 1. PRODUCT

Spanish title:

**El Bosque de Elenita**

English title:

**Elenita's Forest**

Primary language:

**Spanish**

Optional second language:

**English**

Spanish is the canonical content language.

The world contains living:

- animals
- geometric shapes
- letters
- numbers
- musical instruments
- plants
- clouds
- Sun
- Moon
- stars
- planets

Everything belongs to one coherent world.

There are no conventional educational quizzes.

The primary loop is:

**Elenita toca algo → el objeto responde → escucha su nombre/sonido → ocurre algo interesante.**

---

# 2. REQUIRED TECHNOLOGY STACK

Use the following default stack unless an actual technical blocker is discovered.

## 3D asset creation

**Blender**

Blender is already installed on this Windows machine through the Microsoft Store.

Do NOT require manual Blender modeling for the initial playable prototype.

Use Blender's Python API and command-line/background mode to create and export assets programmatically wherever practical.

Keep the `.blend` source files.

## Game engine

Use:

**Godot 4.x stable**

Programming language:

**GDScript**

Renderer:

**Compatibility renderer**

Do NOT use C# for the web version.

Do NOT use Unity unless a major blocker makes Godot unsuitable.

## 3D interchange format

Use:

**glTF 2.0 binary `.glb`**

for Blender → Godot asset exchange.

## Web target

Primary deployment target:

**HTML5/WebAssembly browser build**

The experience must work on modern:

- Chrome
- Edge
- Firefox
- Safari
- Android browsers
- iPhone/iPad browsers

It should be especially optimized for touch devices.

## Installation mode

Enable the application to behave as a **Progressive Web App (PWA)** when practical.

It should therefore be possible later to add El Bosque de Elenita to a mobile home screen.

## Hosting

Preferred production deployment:

**Cloudflare Pages**

Acceptable simpler fallback:

**GitHub Pages**

The final deliverable must include a publicly accessible HTTPS URL if deployment credentials are available.

If authentication to the hosting provider is the only blocker, complete everything else and leave a single documented deployment command or action rather than redesigning the project.

---

# 3. DEVELOPMENT PHILOSOPHY

Priorities, in order:

1. Immediate touch responsiveness
2. Stability
3. Toddler comprehensibility
4. Delightful animation
5. Educational correctness
6. Mobile performance
7. Visual polish
8. Graphical sophistication

Do not sacrifice responsiveness for elaborate graphics.

This should look like a charming stylized 3D toy world, not a graphics benchmark.

---

# 4. INITIAL ENVIRONMENT DISCOVERY

Before creating anything, inspect the machine.

Determine:

- Windows version
- CPU architecture
- available RAM
- GPU if easily discoverable
- Python version
- Git availability
- GitHub CLI availability
- Blender installation
- Blender version
- Godot installation
- Godot version

Write the results into:

`docs/environment.md`

Do not merely assume executable paths.

---

# 5. DISCOVER THE MICROSOFT STORE BLENDER INSTALLATION

First attempt:

```powershell
Get-Command blender -ErrorAction SilentlyContinue
```

and:

```powershell
where.exe blender
```

If that does not locate Blender, inspect Microsoft Store packages:

```powershell
Get-AppxPackage *Blender*
```

Inspect:

`InstallLocation`

The Microsoft Store Blender executable will normally exist beneath the package installation directory, potentially resembling:

```text
C:\Program Files\WindowsApps\<Blender package>\Blender\blender.exe
```

Do NOT hardcode that exact path.

Find the actual installation.

Then verify it by running:

```powershell
"<actual blender.exe>" --version
```

Create a reusable environment variable or configuration entry for the project scripts:

```text
BLENDER_EXE
```

For example:

```text
BLENDER_EXE=<detected path>
```

Never modify or delete the user's Blender installation.

---

# 6. GODOT INSTALLATION

Determine whether Godot 4 stable already exists.

Try common discovery methods such as:

```powershell
Get-Command godot -ErrorAction SilentlyContinue
```

```powershell
where.exe godot
```

and inspect normal installation locations.

If Godot is unavailable and the execution environment permits software installation, install or download the current stable Godot 4 standard edition.

Do not use the .NET/C# edition unless separately needed.

Record the path as:

```text
GODOT_EXE
```

Verify:

```powershell
"<godot executable>" --version
```

Install the corresponding export templates required for web export.

---

# 7. PROJECT DIRECTORY

Create a clean repository such as:

```text
elenitas-forest/
│
├── README.md
├── LICENSE
├── .gitignore
├── .gitattributes
│
├── docs/
│   ├── architecture.md
│   ├── environment.md
│   ├── art_direction.md
│   ├── asset_pipeline.md
│   ├── interaction_catalog.md
│   ├── localization.md
│   ├── performance.md
│   ├── testing.md
│   └── deployment.md
│
├── blender/
│   ├── source/
│   ├── scripts/
│   │   ├── common/
│   │   ├── generate_environment.py
│   │   ├── generate_animals.py
│   │   ├── generate_shapes.py
│   │   ├── generate_letters.py
│   │   ├── generate_numbers.py
│   │   ├── generate_instruments.py
│   │   ├── generate_planets.py
│   │   ├── validate_assets.py
│   │   └── export_assets.py
│   │
│   └── previews/
│
├── assets/
│   ├── models/
│   │   ├── animals/
│   │   ├── environment/
│   │   ├── shapes/
│   │   ├── letters/
│   │   ├── numbers/
│   │   ├── instruments/
│   │   └── space/
│   │
│   ├── textures/
│   ├── audio/
│   │   ├── es/
│   │   ├── en/
│   │   ├── animals/
│   │   ├── instruments/
│   │   ├── environment/
│   │   └── music/
│   │
│   └── fonts/
│
├── game/
│   ├── project.godot
│   ├── export_presets.cfg
│   │
│   ├── scenes/
│   │   ├── main/
│   │   ├── forest/
│   │   ├── creatures/
│   │   ├── environment/
│   │   ├── instruments/
│   │   ├── sky/
│   │   ├── space/
│   │   └── ui/
│   │
│   ├── scripts/
│   │   ├── core/
│   │   ├── interaction/
│   │   ├── creatures/
│   │   ├── environment/
│   │   ├── audio/
│   │   ├── localization/
│   │   ├── camera/
│   │   └── space/
│   │
│   ├── resources/
│   │   ├── creatures/
│   │   ├── interactions/
│   │   └── educational/
│   │
│   └── localization/
│       ├── es.csv
│       └── en.csv
│
├── tools/
│   ├── build_assets.ps1
│   ├── validate_assets.ps1
│   ├── build_web.ps1
│   ├── serve_web.ps1
│   └── deploy.ps1
│
├── tests/
│
└── build/
    └── web/
```

Generated caches must not be committed.

---

# 8. EVERYTHING MUST BE REPRODUCIBLE

The project must not depend on mysterious manual work.

A new developer should be able to clone the repository and run:

```powershell
.\tools\build_assets.ps1
```

to regenerate the Blender-generated assets.

Then:

```powershell
.\tools\build_web.ps1
```

to produce the web build.

Then:

```powershell
.\tools\serve_web.ps1
```

to test it locally.

Where possible:

```powershell
.\tools\deploy.ps1
```

should publish the current production build.

---

# 9. BLENDER AUTOMATION PIPELINE

Use Blender Python scripts for the first generation of original assets.

Example execution model:

```powershell
& $env:BLENDER_EXE `
  --background `
  --python blender/scripts/generate_animals.py
```

and:

```powershell
& $env:BLENDER_EXE `
  --background `
  --python blender/scripts/export_assets.py
```

The scripts must:

1. generate or load the source geometry;
2. configure materials;
3. configure pivots/origins;
4. create armatures if required;
5. create animations;
6. validate geometry;
7. save `.blend` source;
8. export `.glb`;
9. report errors;
10. return a non-zero process exit code if validation fails.

---

# 10. ART DIRECTION FOR PROCEDURAL MODELS

Create an original low-poly / stylized aesthetic.

Use:

- rounded primitives
- simple silhouettes
- slightly oversized heads on animals
- large readable eyes where appropriate
- short limbs
- soft proportions
- clean materials
- gentle colors
- very limited visual clutter

The style should resemble handcrafted 3D toys.

Do NOT imitate:

- Disney
- Pixar
- Peppa Pig
- Bluey
- Pokémon
- LEGO
- Duplo
- Pocoyo
- Cocomelon
- any other identifiable copyrighted visual style

Create an original visual identity.

---

# 11. BLENDER MODELING STRATEGY

Favor procedural construction from simple meshes.

Useful building blocks:

- UV spheres
- ico spheres
- beveled cubes
- cylinders
- cones
- curves
- simple custom meshes

Example rabbit:

```text
body       = elongated rounded sphere
head       = rounded sphere
ears       = elongated low-poly meshes
eyes       = small spheres
nose       = small rounded mesh
feet       = flattened rounded forms
tail       = sphere
```

Example frog:

```text
body
head
large eyes
four simple legs
wide mouth
```

Example owl:

```text
body
head
two large eyes
small beak
two wings
simple feet
```

The objective is not zoological realism.

The objective is instant recognizability.

---

# 12. ASSET SCALE CONVENTIONS

Use consistent real-world-inspired scale.

Use:

```text
1 Blender unit = approximately 1 meter
```

Characters may be deliberately stylized larger or smaller for toddler readability.

Every exported asset must have:

- sensible origin
- consistent scale
- applied transforms where appropriate
- predictable orientation
- meaningful name

Naming examples:

```text
ANM_Rabbit
ANM_Frog
ANM_Duck
ANM_Butterfly
ANM_Owl

SHP_Hexagon
SHP_Pentagon

INS_Xylophone
INS_Drum

ENV_Tree_A
ENV_Flower_Red_A

SPC_Earth
SPC_Saturn
```

---

# 13. WEB ASSET BUDGETS

This application must download reasonably quickly.

Do not create unnecessarily heavy assets.

Initial targets:

## Small environment props

Approximately:

```text
100–1,000 triangles
```

## Large environment props

Approximately:

```text
500–3,000 triangles
```

## Simple shapes / letters / numbers

Approximately:

```text
50–500 triangles
```

## Animals

Target roughly:

```text
1,500–5,000 triangles
```

per animal.

Higher counts require justification.

## Planets

Keep geometry very simple.

A UV sphere does not need excessive subdivisions on a mobile screen.

---

# 14. MATERIALS

Prefer simple PBR materials.

Avoid complicated shader graphs.

Use:

- base color
- roughness
- limited metallic values
- optional normal maps only when genuinely beneficial

Prefer:

- vertex colors
- flat/simple materials
- small reusable textures

over large unique textures.

Try to keep:

```text
1–3 materials per typical asset
```

to reduce draw calls.

---

# 15. TEXTURE BUDGET

Prefer:

```text
256×256
512×512
1024×1024
```

textures.

Avoid 2K/4K textures unless a concrete visual reason exists.

Atlas compatible textures where appropriate.

Use compressed web-friendly formats through Godot's import pipeline.

---

# 16. ANIMAL RIGGING

Animals requiring skeletal animation should use lightweight armatures.

Avoid unnecessarily complex rigs.

Typical animation set:

```text
Idle
IdleVariant
ReactTap
Move
Special
```

Examples:

Rabbit:

```text
Idle
EarWiggle
Hop
LookAt
```

Duck:

```text
Idle
Walk
Swim
Quack
Splash
```

Frog:

```text
Idle
Croak
Jump
Land
```

Butterfly:

```text
IdleFly
Flutter
Land
TakeOff
```

Owl:

```text
Idle
Blink
HeadTurn
WingFlap
Wake
```

---

# 17. ANIMATION PRINCIPLE

Animations should be:

- short
- readable
- smooth
- slightly exaggerated
- gentle

Avoid:

- violent motion
- rapid spinning
- camera shake
- flashing
- sudden large-scale movement

---

# 18. GENERATE ASSET PREVIEWS

For important generated assets, Blender automation should also render preview images.

Store them under:

```text
blender/previews/
```

For example:

```text
rabbit_front.png
rabbit_turntable_01.png
hexagon_yellow.png
xylophone.png
saturn.png
```

This allows visual QA without opening every `.blend` manually.

---

# 19. GLTF/GLB EXPORT

Export final game models to:

```text
assets/models/
```

using glTF 2.0 binary `.glb`.

Include:

- meshes
- materials
- rigs
- animations

where appropriate.

Do not use `.blend` files directly as the production game asset dependency.

The `.blend` files are source files.

The `.glb` files are runtime/import assets.

---

# 20. PROCEDURALLY GENERATED GEOMETRIC CREATURES

Generate shapes using Blender scripts.

Minimum initial set:

- círculo
- triángulo
- cuadrado
- rectángulo
- óvalo
- rombo
- semicírculo
- pentágono
- hexágono
- heptágono
- octágono
- trapecio
- estrella

Use proper mathematical geometry.

Do not draw a vaguely hexagonal object and call it a hexagon.

Shapes may appear in:

- rojo
- azul
- amarillo
- verde
- naranja
- morado
- rosado
- blanco

The same geometry should normally use material variants rather than duplicate meshes unnecessarily.

---

# 21. LETTER ASSETS

Generate 3D forms for the Spanish alphabet:

```text
A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z
```

Letters should be:

- thick
- rounded
- readable
- stable when animated
- easy to tap

Use a properly licensed font if converting text into geometry.

Record the font license in:

```text
docs/third_party_assets.md
```

Do not use an unlicensed commercial font.

---

# 22. NUMBER ASSETS

Generate:

```text
0 1 2 3 4 5 6 7 8 9 10
```

as readable 3D characters.

Architect the content system to support at least 0–20 later.

---

# 23. MUSICAL INSTRUMENT ASSETS

Initial instruments:

- xilófono
- tambor
- campanas

Later:

- piano
- maracas
- guitarra
- flauta
- arpa

Every interactive musical element must correspond spatially to its sound where practical.

Example:

Touching a xylophone bar should play the pitch belonging to that bar.

---

# 24. ENVIRONMENT ASSETS

Generate a modular environment kit.

Initial assets:

```text
Tree_A
Tree_B
Bush_A
GrassClump_A
Flower_A
Flower_B
Rock_A
Rock_B
Log_A
Mushroom_A
LilyPad_A
Pond
Cloud_A
Cloud_B
Sun
Moon
Star
Telescope
```

Reuse assets with controlled variation rather than creating hundreds of unique meshes.

---

# 25. PLANET ASSETS

Create:

- Sol
- Mercurio
- Venus
- Tierra
- Luna
- Marte
- Júpiter
- Saturno
- Urano
- Neptuno

Use simplified scientifically recognizable representations.

Saturn must have rings.

Jupiter should include a simplified Great Red Spot.

Earth should visually distinguish:

- oceans
- land

Do not imply that the simplified scene is to scale.

---

# 26. GODOT PROJECT CONFIGURATION

Configure Godot for a web-first 3D project.

Use:

```text
Renderer: Compatibility
Language: GDScript
```

Avoid engine features known to be unsuitable for WebGL/mobile unless necessary.

Do not introduce native GDExtensions unless strictly necessary.

Keep dependencies minimal.

---

# 27. GODOT SCENE ARCHITECTURE

Suggested top-level scene:

```text
Main
├── WorldManager
├── Forest
│   ├── Environment
│   ├── Creatures
│   ├── Instruments
│   └── InteractiveObjects
│
├── SkySystem
│   ├── Sun
│   ├── Moon
│   ├── Clouds
│   └── Stars
│
├── SpaceWorld
│
├── CameraRig
│
├── AudioManager
│
├── NarrationManager
│
├── LocalizationManager
│
├── InteractionManager
│
└── UI
```

`SpaceWorld` may remain disabled until needed.

---

# 28. COMPONENT ARCHITECTURE

Do not create one giant `Creature.gd` script.

Use composition.

Example conceptual structure:

```text
Rabbit
├── VisualModel
├── AnimationPlayer
├── InteractionTarget
├── CreatureIdentity
├── AudioEmitter
├── NarrationComponent
└── AnimalBehavior
```

Shape:

```text
Hexagon
├── VisualModel
├── InteractionTarget
├── CreatureIdentity
├── ShapeDefinition
├── ColorDefinition
├── AnimationPlayer
└── NarrationComponent
```

---

# 29. UNIVERSAL INTERACTION TARGET

Create a reusable component resembling:

```text
InteractionTarget
```

It should support:

```text
tap
press
release
simple_drag
```

and emit signals/events.

Example:

```gdscript
signal tapped(target)
signal pressed(target)
signal released(target)
```

Gameplay objects subscribe to these events.

Input handling should NOT be duplicated across every creature.

---

# 30. TODDLER HITBOXES

Visible geometry does not define the complete touch target.

Use deliberately oversized invisible collision shapes.

Touch targets should generally be significantly larger than the visible small object.

Avoid requiring pixel-perfect taps.

---

# 31. INPUT FILTERING

Implement:

```text
tap threshold
drag threshold
interaction cooldown
animation-state protection
multi-touch tolerance
```

A tiny finger movement during a tap should NOT automatically become a drag.

Rapidly tapping an animal 30 times should not create 30 overlapping sounds and 30 animations.

Use bounded queues or cooldowns.

Never permanently lock the object.

---

# 32. INTERACTION RESPONSE LATENCY

The visible response to a tap should begin effectively immediately.

Target:

```text
<100 ms perceived response where practical
```

Narration may follow slightly after the visual response.

For example:

```text
0 ms       tap
20 ms      animal looks/moves
100 ms     sound
250 ms     narration
```

Do not wait for narration before providing visual feedback.

---

# 33. LOCALIZATION DATA

Spanish is default.

Example:

```csv
key,es,en
animal.rabbit,Conejo,Rabbit
animal.frog,Rana,Frog
animal.duck,Pato,Duck
animal.butterfly,Mariposa,Butterfly
animal.owl,Búho,Owl
shape.hexagon,Hexágono,Hexagon
shape.pentagon,Pentágono,Pentagon
number.three,Tres,Three
sky.sun,Sol,Sun
sky.moon,Luna,Moon
planet.saturn,Saturno,Saturn
instrument.xylophone,Xilófono,Xylophone
```

Do not assume word associations translate directly.

For example:

```text
M → Mariposa
```

works in Spanish.

English associations should be authored independently when necessary.

---

# 34. NARRATION ASSET PIPELINE

Narration must use prerecorded audio assets rather than depending entirely on browser speech synthesis.

Desired structure:

```text
assets/audio/es/narration/
assets/audio/en/narration/
```

Examples:

```text
animal_rabbit.ogg
shape_hexagon.ogg
color_yellow.ogg
planet_saturn.ogg
```

Use a legally usable TTS system or recorded voice.

If no suitable Spanish TTS system is available in the environment, architect the pipeline fully and use clearly documented temporary narration assets rather than blocking the entire project.

Do not scrape copyrighted children's audio.

---

# 35. AUDIO POLICY

Audio categories:

```text
Master
Narration
Animals
Instruments
Environment
Music
```

Avoid overlapping narration.

If Elena rapidly touches:

```text
conejo
hexágono
pato
```

do not play three spoken phrases simultaneously.

Implement a short narration policy such as:

- finish very short current narration;
- replace queued narration with the most recent meaningful interaction;
- keep queue size strictly bounded.

---

# 36. FIRST FOREST

Build one actual navigable/interactive clearing.

Initial scene:

```text
El Claro de Elenita
```

Contains:

- grass
- trees
- pond
- flowers
- stones
- rabbit
- duck
- frog
- butterfly
- owl
- shapes
- letters
- numbers
- xylophone
- drum
- bells
- clouds
- Sun
- Moon
- stars
- telescope

Do not attempt a huge open world.

Create a small, dense, polished diorama.

---

# 37. CAMERA

Use a constrained child-friendly camera.

No free first-person movement.

No dual-stick control.

Preferred behavior:

1. Elena touches an interesting region/object.
2. Camera smoothly reframes it.
3. The object responds.
4. Camera remains stable.

Camera motion should use gentle interpolation.

No camera shake.

---

# 38. DAY/NIGHT SYSTEM

Create normalized time:

```text
0.0 → midnight
0.25 → sunrise
0.5 → midday
0.75 → sunset
1.0 → midnight
```

Day/night controls:

- Sun position
- Moon position
- sky color
- light intensity
- environmental ambience
- star visibility
- nocturnal animal activity

For the toddler experience, do not require waiting through an actual 24-hour cycle.

Allow specific interactions to accelerate time gently.

---

# 39. SKY INTERACTIONS

Sun:

```text
tap
→ warm pulse
→ "Sol"
```

Cloud:

```text
tap
→ wobble
→ rain
```

Moon:

```text
tap
→ gentle glow
→ "Luna"
```

Star:

```text
tap
→ brighter twinkle
→ musical note
```

---

# 40. CAUSE-AND-EFFECT SYSTEM

Implement reusable interaction chains.

Example:

```text
CloudTapped
→ StartRain
→ GrowFlowers
→ SpawnFrog
→ FrogCroaks
```

Another:

```text
NightStarted
→ ShowStars
→ WakeOwl
→ SpawnFireflies
```

Another:

```text
HexagonTapped
→ NarrateHexagon
→ FindNearbyHexagons
→ FormHoneycomb
```

Use signals/events rather than hardcoded cross-references whenever reasonable.

---

# 41. SPACE TRANSITION

Space is part of the same universe.

At night:

```text
touch telescope
→ camera approaches telescope
→ Moon enlarges
→ stars fill screen
→ smooth transition
→ solar-system scene
```

Avoid a conventional menu.

Returning:

```text
solar system
→ Earth
→ atmosphere
→ night sky
→ telescope
→ forest
```

---

# 42. SOLAR SYSTEM PERFORMANCE

Do NOT simulate physically accurate orbital distances.

Use an educational diorama.

Planets may orbit slowly.

Elena should be able to tap each planet.

Interactive target sizes should be much larger than physically proportional planetary sizes.

---

# 43. WEB-SPECIFIC PERFORMANCE TARGETS

Treat mobile web as the limiting platform.

Aim for:

```text
30 FPS minimum
60 FPS preferred
```

on reasonably modern phones/tablets.

Keep the initial compressed download preferably around:

```text
20–30 MB or less
```

for the first vertical slice.

Do not allow unnecessary assets to load before the first forest interaction.

---

# 44. LOADING STRATEGY

The first experience should load:

- engine
- central clearing
- initial animals
- initial sounds

Space assets may be loaded later.

Do not require all planet assets before Elena can touch the first rabbit.

Where practical:

```text
Forest → initial package
Space → deferred package
```

---

# 45. WEB EXPORT

Create a reproducible Web export preset.

Output:

```text
build/web/
```

containing the Godot-generated HTML/WebAssembly/project files.

The main page must be:

```text
index.html
```

Use a responsive canvas.

No horizontal browser scrolling.

No browser UI elements should cover primary game interaction.

---

# 46. THREADING

For the first deployment, prefer the simplest broadly compatible web configuration.

Do not enable web threading unless profiling demonstrates that it is necessary.

This avoids unnecessary deployment/header complexity.

If web threads are later enabled, configure the hosting environment correctly for cross-origin isolation.

---

# 47. PWA

Enable Godot's PWA features where compatible with the chosen export configuration.

Provide:

- application name
- icons
- manifest
- service worker
- appropriate mobile metadata

Application name:

```text
El Bosque de Elenita
```

Default language:

```text
es
```

---

# 48. ORIENTATION

Design primarily for:

**landscape**

because it provides more room for a 3D diorama.

However, the web wrapper must fail gracefully in portrait orientation.

If portrait is unsuitable, show a simple visual request to rotate the device.

Do not display technical text to the child.

---

# 49. LOCAL WEB TESTING

Create:

```powershell
.\tools\serve_web.ps1
```

It must start an appropriate local HTTP server.

Do NOT test the Godot web build by double-clicking `index.html` with a `file://` URL.

The build must be served over HTTP.

Document how to expose the test server temporarily to another device on the same Wi-Fi for phone/tablet testing.

---

# 50. DEPLOYMENT — CLOUDFLARE PAGES

Preferred hosting target:

**Cloudflare Pages**

The site is static.

No backend is required.

If threaded Godot exports are ever enabled, configure appropriate headers, for example through a Cloudflare Pages `_headers` file.

Keep hosting configuration under version control.

Example project structure:

```text
build/web/
├── index.html
├── ...
└── _headers
```

Do not introduce a server backend merely to host a static Godot game.

---

# 51. DEPLOYMENT — GITHUB PAGES FALLBACK

If Cloudflare credentials are unavailable but GitHub authentication exists, deploy to GitHub Pages.

For this fallback, ensure the chosen Godot web export works without custom response headers.

The public URL should resemble:

```text
https://<username>.github.io/elenitas-forest/
```

Do not hardcode the base path if the repository path may change.

---

# 52. SOURCE CONTROL

Initialize Git.

Use meaningful commits.

Example:

```text
chore: initialize Godot project
feat: add procedural rabbit asset
feat: implement toddler touch interaction
feat: add Spanish localization
feat: implement day night system
feat: add web export
```

Do not commit:

- `.godot/`
- temporary Blender renders
- caches
- local secrets
- deployment tokens

---

# 53. GITHUB REPOSITORY

If GitHub authentication is available, create:

```text
elenitas-forest
```

or a similarly appropriate repository.

Push source code.

Never commit:

- API keys
- Cloudflare tokens
- credentials
- private configuration

Use environment secrets for CI/CD.

---

# 54. CI/CD

Create an automated deployment pipeline where practical.

Desired flow:

```text
push to main
→ validate project
→ export Godot web build
→ publish build
```

If automatic Godot export in CI proves unnecessarily complicated for the first prototype, local deterministic build + automated static deployment is acceptable.

Document the chosen approach.

---

# 55. DEPLOYMENT VERIFICATION

Deployment is not complete merely because the upload command succeeded.

Verify the public URL.

Check:

1. HTTPS works.
2. Main page loads.
3. Godot engine initializes.
4. No missing `.wasm` file.
5. No missing `.pck` file.
6. No important 404 errors.
7. No fatal console errors.
8. Spanish content loads.
9. Touch/click input responds.
10. Audio initializes after user interaction.
11. Forest appears.
12. At least one animal can be touched.

Where browser automation is available, create a smoke test.

---

# 56. MOBILE TESTING

Test at simulated viewport sizes approximating:

```text
360×800
390×844
412×915
768×1024
820×1180
```

Also test actual touch hardware if accessible.

Test:

- landscape
- device rotation
- browser reload
- browser background/resume
- accidental multi-touch
- rapid taps

---

# 57. PERFORMANCE INSTRUMENTATION

Provide a developer-only debug overlay that can be enabled during testing.

Show:

```text
FPS
draw calls
visible objects
triangle count if available
loaded scene
memory estimate where practical
```

The overlay must be disabled in the normal child experience.

---

# 58. ASSET VALIDATION

Create an automated asset-validation script.

Check for:

- missing `.glb`
- zero-size files
- absurd polygon counts
- missing materials
- missing expected animations
- invalid naming
- inconsistent scale
- invalid transforms where relevant

Build should fail clearly if a critical required asset is missing.

---

# 59. GAME VALIDATION

Create automated or semi-automated checks for:

- localization keys
- missing narration
- invalid creature definitions
- duplicate IDs
- missing model paths
- missing sound paths
- invalid shape names
- invalid number definitions
- broken scene references

---

# 60. NO EXTERNAL RUNTIME DEPENDENCY

Once deployed, the child's game must NOT require:

- AI APIs
- OpenAI API
- cloud inference
- database
- account
- login
- advertising service
- analytics service

The playable forest should be static-client software.

AI is used to BUILD the game.

AI is not required for Elena to PLAY it.

---

# 61. PRIVACY

Collect no information about Elena.

No:

- account
- name entry
- microphone
- camera
- geolocation
- advertising ID
- behavioral analytics
- social features

The app should function without identifying the child.

---

# 62. FIRST PLAYABLE CONTENT

Implement this first:

## Animals

- conejo
- rana
- pato
- mariposa
- búho

## Shapes

- círculo
- triángulo
- cuadrado
- rectángulo
- pentágono
- hexágono
- trapecio
- estrella

## Numbers

0–5

## Letters

A
E
L
M
S

## Instruments

- xilófono
- tambor
- campanas

## Environment

- trees
- flowers
- pond
- grass
- stones
- clouds
- rain
- Sun
- Moon
- stars

## Space

- Sun
- Earth
- Moon
- Mars
- Jupiter
- Saturn

---

# 63. MINIMUM PLAYABLE INTERACTIONS

Implement at least:

```text
5 animal reactions
16 shape/color reactions
6 number reactions
5 letter reactions
8 instrument interactions
5 sky interactions
5 environmental cause/effect interactions
6 space interactions
```

At least approximately:

**50 meaningful touch responses**

should exist before calling the vertical slice complete.

---

# 64. EXAMPLE REQUIRED INTERACTION

Rabbit:

```text
tap rabbit
→ rabbit immediately looks toward interaction
→ ears move
→ rabbit hops
→ gentle rabbit sound if appropriate
→ Spanish narration: "Conejo."
```

Second interaction:

```text
tap rabbit later
→ rabbit hops toward flower
→ sniffs it
```

---

# 65. ADVANCED SHAPE EXAMPLE

Yellow hexagon:

```text
tap
→ immediate squash/stretch
→ rotate
→ Spanish narration:
   "Hexágono amarillo."
→ nearby hexagons approach
→ form honeycomb arrangement
```

No quiz.

No "correct" or "incorrect."

---

# 66. NUMBER EXAMPLE

Number 3:

```text
tap 3
→ 3 rises slightly
→ three butterflies arrive
→ narrator:
   "Uno."
   "Dos."
   "Tres."
```

The quantity must match the number.

---

# 67. MUSIC EXAMPLE

Xylophone:

Each bar:

```text
touch
→ bar moves down slightly
→ corresponding musical note
→ optional nearby star or shape reacts
```

Allow free play.

No requirement to reproduce a melody.

---

# 68. NIGHT EXAMPLE

Transition:

```text
sunset
→ sky becomes darker
→ Moon appears
→ stars appear
→ owl wakes
→ fireflies emerge
→ ambient sound changes
```

Night must remain friendly.

---

# 69. SPACE EXAMPLE

At night:

```text
tap telescope
→ telescope moves
→ camera approaches
→ Moon becomes prominent
→ transition to solar-system diorama
```

Tap Saturn:

```text
→ Saturn rotates
→ rings animate
→ "Saturno."
```

---

# 70. BLENDER-FIRST IMPLEMENTATION ORDER

Use the following order.

## Asset Batch 1

Generate:

```text
tree
flower
rock
pond
Sun
Moon
cloud
```

Export and import into Godot.

Confirm pipeline works.

## Asset Batch 2

Generate:

```text
rabbit
frog
duck
butterfly
owl
```

Rig and animate where needed.

## Asset Batch 3

Generate:

```text
shapes
letters
numbers
```

## Asset Batch 4

Generate:

```text
xylophone
drum
bells
```

## Asset Batch 5

Generate:

```text
planets
telescope
```

Do not build fifty assets before proving that one Blender-generated `.glb` successfully imports and works in Godot.

---

# 71. DEVELOPMENT MILESTONES

## Milestone 0 — Environment

Machine inspected.

Blender found.

Godot available.

Repository created.

## Milestone 1 — Pipeline proof

Blender script creates one tree.

Tree exports to `.glb`.

Godot imports it.

Web build displays it.

## Milestone 2 — First interaction

Rabbit appears.

Rabbit can be tapped.

Rabbit animates.

"¡Conejo!" or "Conejo." narration works.

## Milestone 3 — Forest

Core environment complete.

## Milestone 4 — Educational creatures

Shapes, letters and numbers integrated.

## Milestone 5 — Music

Instruments functional.

## Milestone 6 — Day/night

Sun, Moon, stars and owl behavior functional.

## Milestone 7 — Space

Telescope transition and planets functional.

## Milestone 8 — Mobile optimization

Performance and touch behavior tuned.

## Milestone 9 — Public deployment

Playable HTTPS URL online.

---

# 72. DEFINITION OF DONE

Do NOT claim the project is complete merely because code exists.

The first vertical slice is DONE only when:

- Blender-generated original assets exist;
- `.blend` source files exist;
- `.glb` runtime assets exist;
- Godot imports those assets;
- the forest loads;
- Spanish is the default language;
- animals respond;
- shapes respond;
- numbers respond;
- letters respond;
- instruments make sound;
- day/night works;
- Sun/Moon/stars animate;
- space can be reached;
- planets respond;
- web export succeeds;
- a local HTTP build works;
- mobile viewport testing works;
- no major browser console errors remain;
- README explains reproduction;
- public deployment works if hosting authentication is available.

---

# 73. FINAL DELIVERABLES

Deliver:

```text
1. Git repository
2. Godot source project
3. Blender Python generation scripts
4. Blender source files
5. GLB assets
6. Spanish localization
7. English localization structure
8. Audio asset structure
9. Web export
10. Build scripts
11. Validation scripts
12. Deployment configuration
13. Technical documentation
14. Public URL
```

Also provide:

```text
docs/asset_pipeline.md
docs/architecture.md
docs/testing.md
docs/deployment.md
docs/third_party_assets.md
```

---

# 74. README REQUIREMENTS

README must include:

## Play

Public URL.

## Build prerequisites

- Windows
- Blender
- Godot
- Python if required
- Git

## Rebuild assets

Exact command.

## Run Godot

Exact command.

## Export web version

Exact command.

## Test locally

Exact command.

## Deploy

Exact command.

## Project structure

Short explanation.

## Current content

List implemented creatures/interactions.

## Known limitations

Be explicit.

---

# 75. AGENT BEHAVIOR

Do not repeatedly ask me to approve routine technical decisions.

Use engineering judgment.

If something fails:

1. inspect error;
2. diagnose;
3. attempt a reasonable fix;
4. test again;
5. document the resolution.

Do not silently replace a failed feature with a fake implementation.

Distinguish:

```text
DONE
PARTIAL
PLACEHOLDER
BLOCKED
```

---

# 76. IMPORTANT RULE FOR ASSETS

Do not search the internet for random models and assemble an inconsistent asset pack.

The initial identity of El Bosque de Elenita should come from **original assets created specifically for this project**.

Use Blender-generated stylized assets wherever reasonable.

Third-party resources should only be used when:

- their license is clearly compatible;
- provenance is documented;
- creating them ourselves is unreasonable.

---

# 77. IMPORTANT RULE FOR THE WEB BUILD

The child should receive a URL.

Visiting that URL on a phone or tablet should be sufficient to begin.

No account.

No installation wizard.

No developer tools.

No downloading asset packs.

No game-engine knowledge.

The public experience must open directly into:

**El Bosque de Elenita.**

---

# 78. MOST IMPORTANT TECHNICAL PRINCIPLE

The complete pipeline should be:

```text
Python/Blender
      ↓
original .blend source
      ↓
automated GLB export
      ↓
Godot import
      ↓
data-driven interactions
      ↓
Spanish-first playable forest
      ↓
WebAssembly/WebGL web export
      ↓
HTTPS deployment
      ↓
phone/tablet browser
```

Every arrow in this pipeline must actually work.

Start by inspecting the Windows environment and locating the existing Microsoft Store Blender installation.

Then create the repository and prove the complete pipeline with ONE generated tree and ONE interactive rabbit before expanding the world.

Once that proof works, continue through the milestones without waiting for additional approval unless an external credential or genuinely irreversible action requires it.