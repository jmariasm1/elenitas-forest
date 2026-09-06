You are the lead game designer, child-experience designer, 3D developer, software architect, and educational-content designer for a mobile 3D interactive experience intended for my 2-year-old cousin Elena.

Your job is to DESIGN AND IMPLEMENT a polished playable experience, not merely describe one.

# TITLE

The game is called:

**El Bosque de Elenita**

English localization:

**Elenita's Forest**

# CENTRAL CONCEPT

Create one continuous magical forest inhabited not only by animals, but also by living:

- geometric shapes
- letters
- numbers
- musical instruments

The forest itself should feel alive.

The sun, moon, stars, clouds, plants, water, animals, letters, numbers, shapes, and instruments should all be things Elena can discover and interact with.

This is not primarily a conventional game.

It is a **3D interactive world for curiosity, language, music, nature, mathematics, and discovery**.

The core experience should be:

**Ver → tocar → reaccionar → escuchar → descubrir**

See → Touch → React → Hear → Discover.

Examples:

- Elena touches a fox → it looks at her, moves its tail, makes a sound, and the narrator says "Zorro."
- Elena touches a yellow hexagon → it spins and the narrator says "Hexágono amarillo."
- She touches the letter M → it bounces and says "M. Mariposa."
- She touches the number 3 → three fireflies appear.
- She touches a piano → several keys play a simple melody.
- She touches a cloud → it begins raining.
- She touches the moon → nearby stars twinkle.
- She touches Saturn in space → its rings rotate and the narrator says "Saturno."

Everything should reward curiosity.

# PRIMARY LANGUAGE

The PRIMARY language of the entire experience is:

**Spanish**

Spanish must be treated as the canonical language during development, not as a translation added later.

Use natural, simple Spanish appropriate for a small child.

Examples:

"Vaca."

"Mariposa."

"Azul."

"Hexágono."

"Tres."

"La letra M."

"Sol."

"Luna."

"Saturno."

Avoid unnecessarily long sentences.

# SECOND LANGUAGE

English must also be supported as an optional second language.

Parents should be able to select:

- Español
- English
- optionally, later: Español + English

A future bilingual mode could say:

"Mariposa. Butterfly."

but do NOT make this mandatory in the initial version.

Architecture must support additional languages later.

Do not hardcode text or narration inside gameplay scripts.

Use localization identifiers such as:

animal.fox.name
animal.butterfly.name
shape.hexagon.name
shape.hexagon.yellow
letter.m
number.three
instrument.piano.name
sky.moon.name
planet.saturn.name

Spanish localization is the source/default localization.

# EL BOSQUE DE ELENITA

There is ONE principal world:

**El Bosque de Elenita.**

Do not create a collection of disconnected minigames.

The forest should function as one interconnected environment with different areas and discoveries.

Possible areas inside the forest:

## El Claro

A sunny central meadow.

Contains:

- flowers
- grass
- butterflies
- rabbits
- birds
- shapes
- letters
- numbers

This should be the initial starting area.

## El Estanque

Contains:

- ducks
- frogs
- fish
- lily pads
- dragonflies
- water interactions

## El Bosque Profundo

Contains:

- deer
- squirrels
- owls
- foxes
- mushrooms
- trees
- leaves
- hidden discoveries

Keep it friendly rather than dark or threatening.

## El Jardín de las Figuras

Shapes live naturally among flowers, rocks, paths, and trees.

This is not a separate quiz screen.

Shapes should behave almost like little creatures.

## El Sendero de las Letras

Letters may walk, hop, float, hide behind plants, or interact with objects whose names begin with them.

## El Rincón de los Números

Numbers can interact with groups of animals and objects.

## El Claro Musical

Musical instruments can be discovered among the trees.

## El Observatorio

A magical clearing where Elena can observe:

- the Moon
- stars
- planets
- constellations

It also serves as the gateway to the space experience.

All of these should feel like places within the same forest rather than menu-selected minigames.

# LIVING SHAPES

Geometric shapes are creatures inhabiting the forest.

They should have personality through:

- movement
- sound
- expression where appropriate
- physical behavior

Elena already recognizes many geometric shapes, so do NOT restrict the experience only to circle, square, and triangle.

Include:

- circle / círculo
- triangle / triángulo
- square / cuadrado
- rectangle / rectángulo
- oval / óvalo
- rhombus / rombo
- semicircle / semicírculo
- pentagon / pentágono
- hexagon / hexágono
- heptagon / heptágono
- octagon / octágono
- trapezium/trapezoid / trapecio
- star / estrella

Architecture should make additional shapes easy to add.

Shapes should have meaningful physical behaviors.

Examples:

Circle:
- rolls downhill

Square:
- stacks

Triangle:
- spins or balances

Rectangle:
- becomes a small bridge

Pentagon:
- rotates

Hexagon:
- can connect to other hexagons like a honeycomb

Star:
- glows gently at night

Trapezoid:
- rocks from side to side

Do not turn these into examination questions.

Allow Elena to learn their names through interaction.

# COLORS

Shapes, letters, numbers, musical objects, flowers, and other creatures may appear in different colors.

Initial color vocabulary:

- rojo
- azul
- amarillo
- verde
- naranja
- morado
- rosado
- blanco
- negro
- café

When appropriate, combine noun and color naturally.

Examples:

"Hexágono amarillo."

"Estrella azul."

"Cinco rojo."

Do not communicate information solely through color.

# LIVING LETTERS

Letters are forest inhabitants.

Use the Spanish alphabet as the primary alphabetic system.

Include:

A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z

Letters may:

- hop
- walk
- spin
- hide
- sing their sound
- interact with animals or objects
- gather together

Avoid requiring Elena to spell words.

Instead build associations.

Examples:

A — Árbol

B — Ballena or Bosque

C — Conejo

E — Estrella

F — Flor

G — Gato

L — Luna

M — Mariposa

N — Nube

Ñ — Ñandú

O — Oso

P — Pájaro

R — Rana

S — Sol

T — Tortuga

Z — Zorro

Associations should be culturally and linguistically natural in Spanish.

English localization can use different word associations where necessary rather than mechanically translating them.

# LIVING NUMBERS

Numbers also inhabit the forest.

Initially support:

0–10

Architect the system so it can later expand to at least 20.

Numbers should connect to real quantities.

Examples:

Touch 1:
→ one butterfly appears.

Touch 2:
→ two rabbits hop.

Touch 3:
→ three ducks swim past.

Touch 5:
→ five stars appear.

Touch 0:
→ an empty nest or empty group can illustrate "cero" gently and naturally.

Avoid arithmetic drills in the initial experience.

Later versions may introduce very simple quantity relationships through play.

# ANIMALS

Animals are among the most important inhabitants of El Bosque de Elenita.

Possible forest animals include:

- rabbit
- fox
- deer
- squirrel
- owl
- bird
- butterfly
- bee
- frog
- duck
- fish
- turtle
- hedgehog
- ladybug
- dragonfly

Every animal should have:

- idle animation
- tap reaction
- movement
- appropriate sound where relevant
- spoken Spanish name
- one or more secondary behaviors

Example:

Conejo:

Touch
→ ears move
→ rabbit hops
→ narrator says "Conejo."

Touch again later
→ rabbit finds a carrot.

Animals must never attack Elena.

Predator species such as foxes or owls should still behave as real animals but be depicted gently and without frightening hunting sequences.

# MUSICAL FOREST

Musical instruments may also exist naturally in the forest.

Possible instruments:

- piano
- xylophone
- drums
- maracas
- bells
- flute
- guitar
- harp

They should be physical 3D objects Elena can directly touch.

Examples:

Piano:
Each large key produces a note.

Xylophone:
Touching different bars produces different pitches.

Drum:
Touch produces an appropriate percussion sound.

Maracas:
Dragging or tapping causes them to shake.

Harp:
Touching strings creates notes.

Allow spontaneous musical play.

Do NOT require Elena to reproduce melodies correctly.

No failure state.

Later, animals and shapes may respond to music.

Examples:

- rabbits hop to a rhythm
- stars twinkle when bells play
- shapes dance
- flowers open
- birds sing back

# DAY AND NIGHT

The forest should have a beautiful dynamic day/night system.

The sky itself is interactive.

Include:

- sun
- moon
- clouds
- stars

## Sun

The sun should:

- move gradually through the sky
- illuminate the environment
- respond when touched
- produce gentle visual feedback

Narrator:

"Sol."

## Moon

The moon should:

- appear at night
- move gradually
- glow softly
- react when touched

Narrator:

"Luna."

Potential later feature:

Moon phases.

## Clouds

Clouds should:

- drift
- vary in shape
- respond to touch
- sometimes create rain

Cloud interaction:

Touch cloud
→ cloud wiggles
→ gentle rain begins
→ plants react
→ puddles form
→ frog appears

## Stars

Stars should:

- gradually appear at night
- twinkle gently
- be individually touchable where practical
- form simple patterns

Touch star
→ star glows
→ gentle musical note

Avoid flashing or rapid brightness changes.

# NATURAL TRANSITIONS

Day and night should change the behavior of the forest.

DAY:

- butterflies
- bees
- birds
- bright flowers
- warm sunlight

EVENING:

- warmer sky
- animals begin changing behavior

NIGHT:

- moon
- stars
- fireflies
- owl
- crickets
- glowing shapes
- quieter music

The same physical forest should feel meaningfully different at night.

Do not make nighttime frightening.

# WEATHER AND CAUSE AND EFFECT

Support simple environmental interactions.

Examples:

Cloud
→ rain
→ flowers grow
→ frog appears

Sun
→ flowers open
→ butterflies arrive

Wind
→ leaves move
→ seeds fly

Night
→ stars appear
→ owl wakes
→ fireflies emerge

These chains are extremely important.

The child should discover that things in the world affect other things.

# SPACE

Space should exist as an extension of El Bosque de Elenita rather than as an unrelated game.

The forest remains Elena's home.

At night, the observatory or another magical forest interaction can allow Elena to travel upward into the sky.

Possible transition:

Elenita looks through a telescope.

→ Moon becomes larger.

→ Stars surround the camera.

→ transition into space.

Alternatively:

A friendly magical rocket may appear near the observatory.

Keep the transition short, gentle, and comprehensible.

# THE SOLAR SYSTEM

Create a simplified interactive 3D solar system.

Include:

- Sun
- Mercury / Mercurio
- Venus
- Earth / Tierra
- Moon / Luna
- Mars / Marte
- Jupiter / Júpiter
- Saturn / Saturno
- Uranus / Urano
- Neptune / Neptuno

Do not present Pluto as one of the eight planets, but it may later appear as:

"Plutón, planeta enano."

Basic astronomical information must be scientifically accurate.

However, orbital sizes and distances may be visually compressed for usability.

Clearly treat the model as educationally simplified rather than physically to scale.

# PLANET INTERACTIONS

Every planet should respond to touch.

Example:

Touch Saturn:

→ Saturn rotates
→ rings animate
→ narrator says "Saturno."

Touch Earth:

→ Earth rotates
→ Moon appears
→ narrator says "La Tierra."

Touch Jupiter:

→ planet rotates
→ Great Red Spot becomes visible
→ narrator says "Júpiter."

Touch Mars:

→ Mars gently moves closer
→ narrator says "Marte."

Avoid giving long lectures.

Additional information should be optional and progressively discoverable.

# RETURNING HOME

Space must never feel like leaving the main game permanently.

Elena should always be able to return naturally to:

**El Bosque de Elenita.**

A simple transition could show Earth, then the forest, then the observatory.

Avoid complicated navigation buttons.

# TODDLER DESIGN PRINCIPLES

Elena is TWO YEARS OLD.

There should be:

- no losing
- no death
- no lives
- no health
- no score
- no countdown timers
- no pressure
- no punishment
- no negative buzzer sounds
- no complicated menus
- no reading requirement
- no precise aiming
- no conventional joystick requirement
- no advertisements
- no in-app purchases
- no external links accessible to the child
- no loot boxes
- no streaks
- no engagement-maximizing reward loops

The world should not tell Elena she is wrong.

If she touches something unexpected, something pleasant should usually happen.

# INTERACTION DESIGN

Primary interactions:

- tap
- touch
- simple drag
- simple swipe where appropriate

Avoid depending upon:

- double tap
- pinch gestures
- precise dragging
- multi-touch
- tiny UI targets
- complicated gesture sequences

Use generous invisible hitboxes.

Every important object should be easy to touch.

# CAMERA

Do NOT require Elena to operate a character and camera independently.

Prefer a child-friendly 3D diorama/adventure camera.

The camera should:

- move automatically when useful
- smoothly frame interesting objects
- remain slow
- never shake
- avoid sudden rotations
- prevent getting lost
- prevent clipping into objects

Movement through the forest should be simple.

Possible interaction:

Elena touches an interesting distant location.

→ camera gently moves toward that area.

Do not require traditional game navigation skills.

# VISUAL STYLE

Create an original stylized 3D aesthetic.

Characteristics:

- rounded forms
- soft natural environments
- clear silhouettes
- expressive but not exaggerated animation
- colorful but not visually chaotic
- warm lighting
- strong readability
- subtle environmental movement

Avoid copying any existing children's franchise.

Do not use hyperrealistic animals.

However, animals and astronomical objects should still remain recognizable and educationally accurate.

# AUDIO

Separate:

- narration
- music
- animal sounds
- instrument sounds
- ambient nature
- interaction feedback

Music should be calm and sparse enough that instruments remain understandable.

Nature ambience may include:

Day:
- birds
- wind
- water

Night:
- crickets
- owl
- gentle nighttime ambience

Avoid loud surprise sounds.

# NARRATION

Use a calm, affectionate, clear Spanish-speaking adult voice.

Keep narration extremely concise.

Preferred:

"Pentágono."

"Mariposa."

"Tres."

"Luna."

"Júpiter."

"Tambor."

Not preferred:

"¡Muy bien, Elena! Has identificado correctamente un pentágono de color amarillo."

Do not constantly praise or interrupt.

Allow quiet exploration.

# CHILD-DIRECTED SPEECH

Avoid turning every interaction into an instruction.

Prefer description:

"Hexágono."

rather than:

"Toca el hexágono."

Use occasional invitations only when necessary.

# PARENT AREA

The child-facing experience should contain minimal conventional UI.

A protected parent area may include:

- language
- Spanish / English
- narration volume
- music volume
- effects volume
- subtitles
- reduced motion
- reset preferences
- information/about

Protect it using a parent gate.

No child personal data should be required.

Keep the initial version offline-first wherever practical.

# TECHNICAL ARCHITECTURE

Compare Godot and Unity specifically for this project.

Then choose the engine that offers the best balance of:

- mobile performance
- maintainability
- rapid AI-assisted development
- Android support
- iOS support
- 3D capability
- localization
- audio
- animation
- extensibility
- reasonable project complexity

Proceed with implementation after making the decision.

Do not wait for my approval unless genuinely blocked.

# SYSTEM ARCHITECTURE

Keep the following systems modular:

- TouchInteractionSystem
- CreatureSystem
- AnimalBehaviorSystem
- ShapeCreatureSystem
- LetterCreatureSystem
- NumberCreatureSystem
- InstrumentSystem
- MusicSystem
- EnvironmentSystem
- WeatherSystem
- DayNightSystem
- SkyObjectSystem
- SpaceSystem
- SolarSystemSystem
- NarrationSystem
- AudioSystem
- LocalizationSystem
- CameraSystem
- ParentSettingsSystem
- SavePreferencesSystem

Avoid giant monolithic scripts.

# UNIVERSAL CREATURE MODEL

Animals, letters, shapes, and numbers are all inhabitants of the forest.

Design a reusable conceptual model such as:

ForestCreature

- id
- creatureType
- displayNameKey
- model
- primaryColor
- animations
- idleBehaviors
- tapBehaviors
- sounds
- narrationKey
- movementProfile
- interactionProfile

Creature types:

- animal
- shape
- letter
- number
- musical
- magical

Do not force completely unrelated concepts into one class if composition/component architecture would be cleaner.

Favor reusable components.

# DATA-DRIVEN CONTENT

New creatures should be addable mostly through data/configuration.

Example shape definition:

ShapeCreature

- id: hexagon
- nameKey: shape.hexagon
- sides: 6
- color
- model
- interaction
- narration

Example letter:

LetterCreature

- id: m
- nameKey: letter.m
- phoneme
- spanishAssociations:
  - mariposa
- englishAssociations:
  - moon

Example number:

NumberCreature

- value: 3
- nameKey: number.three
- quantityInteraction:
  spawn 3 butterflies

# TODDLER INPUT ROBUSTNESS

Assume chaotic interaction.

Test:

- repeated tapping
- multiple fingers
- tapping while animations play
- accidental dragging
- touching empty areas
- extremely rapid input
- switching objects quickly

The application must remain stable.

Do not allow input spam to permanently break object states.

Touch feedback should begin almost immediately.

# ACCESSIBILITY

Include:

- no flashing visuals
- reduced-motion option
- subtitles optional
- independent volume controls
- strong object/background contrast
- alternatives to color-only identification

# PERFORMANCE

Target ordinary recent smartphones and tablets rather than only flagship devices.

Use:

- optimized meshes
- modest texture sizes
- sensible lighting
- bounded particle effects
- object pooling where beneficial
- animation optimization
- appropriate LOD when useful

Prefer responsiveness over graphical complexity.

# FIRST PLAYABLE VERTICAL SLICE

Do NOT build every idea immediately.

Create one polished section of El Bosque de Elenita first.

Include:

## Environment

- central forest clearing
- several trees
- flowers
- pond
- rocks
- clouds
- Sun
- Moon
- stars
- functional day/night transition

## Animals

- rabbit
- frog
- duck
- butterfly
- owl

## Shapes

- circle
- triangle
- square
- pentagon
- hexagon
- trapezoid/trapezium

Each should appear in multiple possible colors.

## Letters

Start with:

A
E
L
M
S

Possible associations:

A — Árbol

E — Estrella

L — Luna

M — Mariposa

S — Sol

## Numbers

0–5

## Musical instruments

- xylophone
- drum
- bells

## Space

For the first vertical slice, implement:

- transition from forest night sky to space
- Sun
- Earth
- Moon
- Mars
- Jupiter
- Saturn

Other planets can follow once the interaction model is validated.

# MINIMUM INTERACTION TARGET

The vertical slice should contain at least:

- 5 animal interactions
- 12 shape interactions
- 5 letter interactions
- 6 number interactions
- 6 musical interactions
- 5 sky/environment interactions
- 6 space interactions
- 5 cause-and-effect chains

Aim for at least 40 meaningful touch responses.

# EXAMPLE DISCOVERY CHAINS

## Rain

Touch cloud
→ rain begins
→ flowers grow
→ frog appears
→ frog croaks

## Night

Touch Sun when appropriate
→ time advances gently
→ sunset
→ Moon appears
→ stars appear
→ owl wakes up

## Star Music

Touch stars
→ each produces a musical tone
→ nearby shapes gently dance

## Number Three

Touch number 3
→ three butterflies appear
→ narrator counts:

"Uno."

"Dos."

"Tres."

## Hexagon

Touch yellow hexagon
→ hexagon spins
→ narrator says:

"Hexágono amarillo."

→ nearby hexagons join it to form a honeycomb pattern.

## Letter M

Touch M
→ M hops
→ butterfly flies toward it
→ narrator says:

"M. Mariposa."

## Space

Touch telescope at night
→ camera approaches
→ Moon fills view
→ stars appear
→ transition to solar system.

# DEVELOPMENT PROCESS

PHASE 1 — Product and technical design

Produce:

- core experience description
- map of El Bosque de Elenita
- creature taxonomy
- interaction matrix
- day/night design
- space-transition design
- architecture
- folder structure
- scene hierarchy
- localization architecture
- asset requirements

PHASE 2 — Core prototype

Implement:

- forest clearing
- camera
- touch system
- Spanish narration architecture
- one animal
- one shape
- one letter
- one number
- one instrument
- one cloud interaction

Verify that everything works on a mobile touch device.

PHASE 3 — Forest vertical slice

Implement the complete initial forest content.

PHASE 4 — Day and night

Implement:

- Sun
- sunset
- Moon
- stars
- nocturnal behaviors

PHASE 5 — Space

Implement the first solar-system experience.

PHASE 6 — Toddler robustness

Stress-test input and unusual behavior.

PHASE 7 — Polish

Improve:

- animations
- sounds
- narration
- transitions
- visual effects
- performance
- loading

# OBSERVATIONAL TESTING

Once a playable version exists, prioritize observation of Elena using it.

Do not assume she will interact as an adult designer expects.

Record or note, without collecting unnecessary personal data:

- what she touches first
- what she touches repeatedly
- which objects she ignores
- where she appears confused
- which sounds attract her
- which interactions make her return
- whether camera movement confuses her
- which concepts she already recognizes
- whether she spontaneously names objects

Use this information to improve the interaction design.

Do not optimize for session length.

Optimize for comprehensibility, curiosity, and delight.

# QUALITY TEST FOR EVERY INTERACTION

For every interactive object ask:

1. Can Elena recognize that this might be interesting to touch?

2. Is the touch target large enough?

3. Does something happen immediately?

4. Is the consequence understandable without reading?

5. Is the Spanish narration concise and correct?

6. Can frantic tapping break it?

7. Is the interaction enjoyable even if Elena learns nothing explicitly?

8. Does the interaction respect the real concept being represented?

9. Does it fit naturally inside El Bosque de Elenita?

10. Would Elena plausibly want to touch it again?

# MOST IMPORTANT RULE

The experience must always feel like exploring:

**El Bosque de Elenita**

not navigating a collection of educational exercises.

Animals, geometric shapes, letters, numbers, instruments, weather, the day-night cycle, the sky, and eventually the solar system should feel like parts of one coherent magical universe.

Learning must arise from curiosity.

The design priority is:

**Elenita toca algo → el mundo responde → algo nuevo se descubre.**

Begin with PHASE 1.

Produce the concrete design of El Bosque de Elenita, the technical architecture, the map/areas, the creature system, and the interaction matrix.

Then proceed directly to implementation of the minimal playable prototype unless a genuine technical blocker requires input.