import * as T from "three";
import { bus, settings } from "./core";
import { World } from "./world";
import { AudioSystem } from "./audio";
import { CameraSystem } from "./camera";
import { seeded } from "./graphics";
export class EnvironmentSystem {
  night = false;
  blend = 0;
  normalizedTime = 0.5;
  rainUntil = -100;
  windUntil = -100;
  private day = new T.Color("#e6eddb");
  private dusk = new T.Color("#dcc6bb");
  private dark = new T.Color("#233d50");
  private rain: T.Points;
  private fireflies: T.Points;
  private stars: T.Points;
  private rainPositions: Float32Array;
  private fireflyPositions: Float32Array;
  private nextCycle = performance.now() / 1000 + 210;
  private previous = -1;
  private growth = 0;
  private flowerScales: number[];
  private ripple: T.Mesh;
  constructor(
    private scene: T.Scene,
    private world: World,
    private camera: CameraSystem,
    private light: T.DirectionalLight,
    private ambient: T.HemisphereLight,
    private audio: AudioSystem,
  ) {
    const random = seeded(17);
    this.rainPositions = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      this.rainPositions[i * 3] = (random() - 0.5) * 13;
      this.rainPositions[i * 3 + 1] = random() * 7;
      this.rainPositions[i * 3 + 2] = (random() - 0.5) * 9;
    }
    const rainGeo = new T.BufferGeometry();
    rainGeo.setAttribute(
      "position",
      new T.BufferAttribute(this.rainPositions, 3),
    );
    this.rain = new T.Points(
      rainGeo,
      new T.PointsMaterial({
        color: "#c8e3e7",
        size: 0.065,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      }),
    );
    this.rain.visible = false;
    scene.add(this.rain);
    this.fireflyPositions = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      this.fireflyPositions[i * 3] = (random() - 0.5) * 13;
      this.fireflyPositions[i * 3 + 1] = 0.5 + random() * 1.2;
      this.fireflyPositions[i * 3 + 2] = (random() - 0.5) * 9;
    }
    const fg = new T.BufferGeometry();
    fg.setAttribute(
      "position",
      new T.BufferAttribute(this.fireflyPositions, 3),
    );
    this.fireflies = new T.Points(
      fg,
      new T.PointsMaterial({
        color: "#f8db87",
        size: 0.065,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    scene.add(this.fireflies);
    const starPositions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      starPositions[i * 3] = (random() - 0.5) * 50;
      starPositions[i * 3 + 1] = 8 + random() * 18;
      starPositions[i * 3 + 2] = -10 - random() * 25;
    }
    const sg = new T.BufferGeometry();
    sg.setAttribute("position", new T.BufferAttribute(starPositions, 3));
    this.stars = new T.Points(
      sg,
      new T.PointsMaterial({
        color: "#fff4d2",
        size: 0.07,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    scene.add(this.stars);
    this.flowerScales = world.flowers.map((f) => f.scale.x);
    this.ripple = new T.Mesh(
      new T.RingGeometry(0.85, 0.89, 48),
      new T.MeshBasicMaterial({
        color: "#dceee0",
        transparent: true,
        opacity: 0,
        side: T.DoubleSide,
        depthWrite: false,
      }),
    );
    this.ripple.rotation.x = -Math.PI / 2;
    this.ripple.position.set(2.7, 0.19, -0.4);
    scene.add(this.ripple);
    bus.on("rain", () => {
      this.rainUntil = performance.now() / 1000 + 10;
      this.growth = 1;
      bus.emit("grow", undefined);
      const frog = world.find("frog");
      if (frog) {
        frog.tapped = performance.now() / 1000;
        this.audio.animal("frog");
      }
    });
    bus.on("grow", () => {
      this.growth = 1;
    });
  }
  setNight(value: boolean) {
    this.night = value;
    this.nextCycle = performance.now() / 1000 + 210;
    bus.emit("night", value);
    if (value) {
      const owl = this.world.find("owl");
      if (owl) owl.tapped = performance.now() / 1000;
      this.audio.animal("owl");
    }
  }
  water() {
    (this.ripple.material as T.MeshBasicMaterial).opacity = 0.6;
    this.ripple.scale.setScalar(0.3);
  }
  wind() {
    this.windUntil = performance.now() / 1000 + 6;
    this.audio.tone(360, "environment", 2, 0.06);
  }
  update(time: number, dt: number) {
    if (time > this.nextCycle && !this.camera.space) this.setNight(!this.night);
    this.blend = T.MathUtils.damp(this.blend, this.night ? 1 : 0, 0.55, dt);
    this.normalizedTime = 0.5 + this.blend * 0.5;
    const inSpace = this.camera.space;
    const color = this.day
      .clone()
      .lerp(this.dusk, Math.sin(this.blend * Math.PI) * 0.6)
      .lerp(this.dark, this.blend);
    this.scene.background = inSpace ? new T.Color("#172f43") : color;
    const fog = this.scene.fog as T.Fog;
    fog.color.copy(this.scene.background as T.Color);
    const distance = this.camera.camera.position.distanceTo(this.camera.target);
    fog.near = distance + 6;
    fog.far = distance + 36;
    this.light.intensity = inSpace ? 2.4 : 2.4 - this.blend * 1.55;
    this.ambient.intensity = inSpace ? 2 : 2.15 - this.blend * 0.65;
    this.light.color
      .set(inSpace ? "#edf1fa" : "#fff0d5")
      .lerp(new T.Color("#bcd1ef"), inSpace ? 0 : this.blend);
    this.light.position.copy(this.camera.target).add(new T.Vector3(-7, 12, 8));
    this.light.target.position.copy(this.camera.target);
    this.light.target.updateMatrixWorld();
    this.world.sky.position.set(this.camera.target.x, 0, this.camera.target.z);
    this.world.sky.visible = !inSpace;
    const sun = this.world.find("sun")!,
      moon = this.world.find("moon")!;
    sun.object.visible = this.blend < 0.7;
    sun.enabled = sun.object.visible;
    moon.object.visible = this.blend > 0.35;
    moon.enabled = moon.object.visible;
    // Sun sets while the moon rises, preserving their separate silhouettes.
    sun.object.position.y = 4.3 - this.blend * 3;
    moon.object.position.set(5, 2 + this.blend * 2.3, -3);
    // Leave a clear touchable silhouette around every night star.
    this.world.find("cloud")!.object.position.y = 4.65 - this.blend * 1.6;
    this.world.entities
      .filter((e) => e.def.id.startsWith("sky_star"))
      .forEach((e) => {
        e.object.visible = this.blend > 0.5;
        e.enabled = e.object.visible;
        e.object.scale.setScalar(
          e.scale *
            (settings.value.reducedMotion
              ? 1
              : 0.94 + Math.sin(time * 0.8 + e.phase) * 0.06),
        );
      });
    this.rain.position.set(this.camera.target.x, 0, this.camera.target.z);
    this.rain.visible = time < this.rainUntil && !inSpace;
    if (this.rain.visible && !settings.value.reducedMotion) {
      for (let i = 0; i < 180; i++) {
        this.rainPositions[i * 3 + 1] -= dt * 2.8;
        if (this.rainPositions[i * 3 + 1] < 0.1)
          this.rainPositions[i * 3 + 1] = 7;
      }
      this.rain.geometry.attributes.position.needsUpdate = true;
      if (Math.floor(time) !== this.previous) {
        this.previous = Math.floor(time);
        this.audio.tone(900, "environment", 0.3, 0.023);
        this.water();
      }
    }
    this.fireflies.position.set(this.camera.target.x, 0, this.camera.target.z);
    this.fireflies.visible = !inSpace;
    (this.fireflies.material as T.PointsMaterial).opacity = this.blend * 0.8;
    if (!settings.value.reducedMotion) {
      this.fireflies.rotation.y = Math.sin(time * 0.07) * 0.05;
      this.fireflies.position.y = Math.sin(time * 0.6) * 0.12;
    }
    this.stars.position.set(
      this.camera.target.x,
      inSpace ? 73 : 0,
      this.camera.target.z,
    );
    (this.stars.material as T.PointsMaterial).opacity = inSpace
      ? 0.9
      : this.blend;
    this.growth = Math.max(0, this.growth - dt * 0.035);
    this.world.flowers.forEach((f, i) => {
      f.scale.setScalar(this.flowerScales[i] * (1 + this.growth * 0.35));
      if (!settings.value.reducedMotion)
        f.rotation.z = Math.sin(time * 0.8 + i) * 0.035;
    });
    if (!settings.value.reducedMotion) {
      this.world.trees.forEach(
        (tree, i) =>
          (tree.rotation.z =
            Math.sin(time * 0.55 + i) *
            (time < this.windUntil ? 0.045 : 0.007)),
      );
      this.world.grasses.forEach(
        (g, i) => (g.rotation.z = Math.sin(time + i) * 0.065),
      );
    }
    const rm = this.ripple.material as T.MeshBasicMaterial;
    rm.opacity = Math.max(0, rm.opacity - dt * 0.22);
    if (rm.opacity > 0 && !settings.value.reducedMotion)
      this.ripple.scale.addScalar(dt * 0.45);
    this.audio.ambient(time, this.night, inSpace);
  }
}
