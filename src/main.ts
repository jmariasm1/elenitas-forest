import "./style.css";
import * as T from "three";
import { Assets } from "./assets";
import { AudioSystem } from "./audio";
import { Behaviors } from "./behaviors";
import { CameraSystem } from "./camera";
import { bus, settings } from "./core";
import { Effects } from "./effects";
import { EnvironmentSystem } from "./environment";
import { TouchSystem } from "./input";
import { SpaceSystem } from "./space";
import { UI } from "./ui";
import { World } from "./world";

const canvas = document.querySelector<HTMLCanvasElement>("#forest")!;
let renderer: T.WebGLRenderer;
let ready = false,
  started = false,
  paused = false;
const audio = new AudioSystem();
const camera = new CameraSystem();
let touch: TouchSystem,
  space: SpaceSystem,
  environment: EnvironmentSystem,
  effects: Effects;
const ui = new UI({
  start: () => {
    started = true;
    touch.enabled = true;
    void audio.unlock();
  },
  place: (id) => {
    if (!ready || space.active || space.transitioning) return;
    audio.cancelNarration();
    effects.clear();
    camera.go(id);
  },
  home: () => space.home(),
  night: () => environment.setNight(!environment.night),
  pause: (value) => {
    paused = value;
    if (touch) touch.enabled = started && !value;
    if (value) audio.pause();
    else audio.resume();
  },
});
document.documentElement.lang = settings.value.language;
document.body.classList.toggle("reduce-motion", settings.value.reducedMotion);
try {
  renderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "default",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  const scene = new T.Scene();
  scene.background = new T.Color("#e6eddb");
  scene.fog = new T.Fog("#e6eddb", 21, 51);
  const hemisphere = new T.HemisphereLight("#fff3df", "#718761", 2.15);
  scene.add(hemisphere);
  const light = new T.DirectionalLight("#fff0d5", 2.4);
  light.position.set(-7, 12, 8);
  light.castShadow = true;
  light.shadow.intensity = 0.35;
  light.shadow.mapSize.set(1024, 1024);
  Object.assign(light.shadow.camera, {
    left: -11,
    right: 11,
    top: 11,
    bottom: -11,
    near: 0.5,
    far: 40,
  });
  light.shadow.bias = -0.001;
  light.shadow.normalBias = 0.035;
  scene.add(light, light.target);
  const assets = new Assets();
  const world = new World(scene, assets);
  await world.build((p) => ui.progress(p));
  effects = new Effects(scene, assets);
  environment = new EnvironmentSystem(
    scene,
    world,
    camera,
    light,
    hemisphere,
    audio,
  );
  const behaviors = new Behaviors(world, effects, audio, environment);
  space = new SpaceSystem(world, camera, environment, effects, audio, ui.veil);
  touch = new TouchSystem(canvas, camera, world.entities, (position) =>
    effects.puff(position, 4),
  );
  bus.on("tap", (e) => {
    if (e.def.kind === "path") camera.go(e.def.association!);
  });
  bus.on("settings", () => world.refreshAssociations());
  const resize = () => {
    renderer.setSize(innerWidth, innerHeight);
    camera.resize();
  };
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      audio.pause();
      touch.enabled = false;
    } else {
      if (started && !paused) {
        audio.resume();
        touch.enabled = true;
      }
      previous = performance.now() / 1000;
    }
  });
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    audio.pause();
    ui.error();
  });
  const developer = new URLSearchParams(location.search).has("debug");
  const debug = document.querySelector<HTMLOutputElement>("#debug")!;
  debug.hidden = !developer;
  let previous = performance.now() / 1000,
    frames = 0,
    frameTime = 0,
    fps = 60;
  const state = () => ({
    ready,
    started,
    place: camera.place,
    space: space.active,
    transitioning: space.transitioning,
    night: environment.night,
    nightBlend: environment.blend,
    raining: performance.now() / 1000 < environment.rainUntil,
    language: settings.value.language,
    reducedMotion: settings.value.reducedMotion,
    interactions: touch.interactions,
    ...effects.stats(),
    audio: audio.stats(),
    fps,
    drawCalls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
    geometries: renderer.info.memory.geometries,
    entities: world.entities.length,
  });
  if (developer)
    Object.assign(window, {
      __elenita: {
        state,
        targets: () =>
          world.entities
            .filter((e) => touch.visible(e))
            .map((e) => ({
              id: e.def.id,
              kind: e.def.kind,
              key: e.def.key,
              taps: e.taps,
              ...touch.project(e),
            })),
        preferences: () => structuredClone(settings.value),
      },
    });
  renderer.setAnimationLoop(() => {
    if (document.hidden) return;
    const time = performance.now() / 1000,
      elapsed = time - previous;
    if (elapsed < 1 / 60 - 0.0007) return;
    const dt = Math.min(0.05, elapsed);
    previous = time;
    if (!paused) {
      camera.update(dt);
      behaviors.update(time);
      environment.update(time, dt);
      effects.update(time);
      space.update(time);
    }
    world.placeGroups.forEach((group) => {
      group.visible = group.position.distanceTo(camera.target) < 33;
    });
    renderer.render(scene, camera.camera);
    frames++;
    frameTime += elapsed;
    if (frameTime >= 1) {
      fps = Math.round(frames / frameTime);
      frames = 0;
      frameTime = 0;
      if (developer) {
        const s = state();
        debug.textContent = `${fps} FPS · ${s.drawCalls} draws\n${s.triangles.toLocaleString()} triangles\n${s.entities} targets · ${s.geometries} geometries\n${s.space ? "space" : s.place} · ${s.language}\n${s.interactions} touches · queue ${s.audio.queued}`;
      }
    }
  });
  ready = true;
  ui.ready();
  if (import.meta.env.PROD && "serviceWorker" in navigator)
    void navigator.serviceWorker
      .register(new URL("./sw.js", location.href), { scope: "./" })
      .catch((e) => console.warn("Offline installation unavailable", e));
} catch (error) {
  console.error("Forest initialization failed", error);
  ui.error();
}
