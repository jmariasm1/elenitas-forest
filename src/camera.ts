import * as T from "three";
import { bus, places, settings } from "./core";
export class CameraSystem {
  camera: T.PerspectiveCamera;
  target = new T.Vector3(0, 1.2, 0);
  destination = new T.Vector3(0, 1.2, 0);
  private positionGoal = new T.Vector3();
  private look = new T.Vector3();
  place = "meadow";
  space = false;
  overview = false;
  constructor() {
    this.camera = new T.PerspectiveCamera(
      37,
      innerWidth / innerHeight,
      0.1,
      150,
    );
    this.resize();
    this.camera.position.copy(this.positionGoal);
    this.camera.lookAt(this.target);
  }
  resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.frame();
  }
  private frame() {
    const aspect = this.camera.aspect;
    const distance =
      (this.space ? 19 : this.overview ? 55 : 14.5) * Math.max(1, 1.5 / aspect);
    this.positionGoal
      .copy(this.destination)
      .add(
        new T.Vector3(0, distance * (this.overview ? 0.85 : 0.48), distance),
      );
  }
  go(id: string) {
    const p = places.find((p) => p.id === id);
    if (!p) return;
    this.place = id;
    this.space = false;
    this.overview = false;
    this.destination.set(p.position[0], 1.2, p.position[1]);
    this.frame();
    if (settings.value.reducedMotion) {
      this.target.copy(this.destination);
      this.camera.position.copy(this.positionGoal);
    }
    bus.emit("place", id);
  }
  setSpace(value: boolean) {
    this.space = value;
    this.overview = false;
    if (value) {
      this.destination.set(0, 81, 0);
      this.frame();
    } else this.go("observatory");
  }
  map() {
    this.overview = !this.overview;
    if (this.overview) {
      this.destination.set(5, 0, -15);
      this.frame();
    } else this.go(this.place);
  }
  update(dt: number) {
    const speed = settings.value.reducedMotion ? 1.9 : 1.5;
    const alpha = 1 - Math.exp(-dt * speed);
    this.target.lerp(this.destination, alpha);
    this.camera.position.lerp(this.positionGoal, alpha);
    this.look.copy(this.target);
    this.camera.lookAt(this.look);
  }
}
