import * as T from "three";
import { bus, settings } from "./core";
import { World } from "./world";
import { CameraSystem } from "./camera";
import { EnvironmentSystem } from "./environment";
import { Effects } from "./effects";
import { AudioSystem } from "./audio";
export class SpaceSystem {
  active = false;
  transitioning = false;
  private loaded = false;
  private timer = 0;
  private returning = false;
  constructor(
    private world: World,
    private camera: CameraSystem,
    private environment: EnvironmentSystem,
    private effects: Effects,
    private audio: AudioSystem,
    private veil: HTMLElement,
  ) {
    bus.on("tap", (e) => {
      if (e.def.id === "telescope") void this.enter();
      if (e.def.id === "space_earth" && e.taps > 1) this.home();
    });
  }
  async enter() {
    if (this.transitioning || this.active) return;
    this.transitioning = true;
    this.environment.setNight(true);
    this.effects.clear();
    try {
      if (!this.loaded) {
        await this.world.assets.preload([
          "planet_earth",
          "planet_mars",
          "planet_jupiter",
          "planet_saturn",
        ]);
        const data: [string, string, number[], number][] = [
          ["sun", "sun", [-6, 81, 0], 1.15],
          ["earth", "planet_earth", [-3.2, 81, 1.2], 0.9],
          ["moon", "moon", [-1.9, 82.3, 0.2], 0.48],
          ["mars", "planet_mars", [0.1, 81, 0.2], 0.72],
          ["jupiter", "planet_jupiter", [3.0, 81, -0.7], 1.4],
          ["saturn", "planet_saturn", [6.1, 81, 1.5], 1.1],
        ];
        for (const [id, model, position, scale] of data)
          this.world.add(
            {
              id: "space_" + id,
              kind: "planet",
              model,
              place: "space",
              position,
              key: "planet." + id,
              scale,
            },
            this.world.space,
          );
        this.loaded = true;
        for (let i = 0; i < 3; i++) {
          const orbit = new T.Mesh(
            new T.RingGeometry(4 + i * 2.7, 4.02 + i * 2.7, 90),
            new T.MeshBasicMaterial({
              color: "#65878e",
              transparent: true,
              opacity: 0.16,
              side: T.DoubleSide,
            }),
          );
          orbit.rotation.x = -Math.PI / 2;
          orbit.position.set(0, 79.5, 0);
          this.world.space.add(orbit);
        }
      }
      this.veil.classList.add("visible");
      this.timer = performance.now() / 1000 + 1.7;
      this.returning = false;
    } catch (error) {
      console.error("Space assets could not load", error);
      this.transitioning = false;
      this.veil.classList.remove("visible");
      bus.emit("subtitle", settings.t("ui.error"));
    }
  }
  home() {
    if (!this.active || this.transitioning) return;
    this.transitioning = true;
    this.veil.classList.add("visible");
    this.timer = performance.now() / 1000 + 1.2;
    this.returning = true;
  }
  update(time: number) {
    if (!this.transitioning || !this.timer || time < this.timer) return;
    this.timer = 0;
    this.active = !this.returning;
    this.world.forest.visible = !this.active;
    this.world.space.visible = this.active;
    this.effects.clear();
    this.audio.cancelNarration();
    this.camera.setSpace(this.active);
    // Transition is covered while the camera changes height; no fast camera sweep is shown.
    this.camera.target.copy(this.camera.destination);
    this.camera.update(10);
    bus.emit("space", this.active);
    this.veil.classList.remove("visible");
    this.transitioning = false;
  }
}
