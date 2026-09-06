import * as T from "three";
import { bus } from "./core";
import type { Entity } from "./types";
import { CameraSystem } from "./camera";
export class TouchSystem {
  enabled = false;
  interactions = 0;
  private fingers = new Map<
    number,
    { x: number; y: number; last: Entity | null }
  >();
  private projected = new T.Vector3();
  private center = new T.Vector3();
  private lastEmpty = 0;
  private raycaster = new T.Raycaster();
  constructor(
    private canvas: HTMLCanvasElement,
    private camera: CameraSystem,
    private entities: Entity[],
    private empty: (position: T.Vector3) => void,
  ) {
    canvas.addEventListener("pointerdown", (e) => this.down(e));
    canvas.addEventListener("pointermove", (e) => this.move(e));
    canvas.addEventListener("pointerup", (e) =>
      this.fingers.delete(e.pointerId),
    );
    canvas.addEventListener("pointercancel", (e) =>
      this.fingers.delete(e.pointerId),
    );
    window.addEventListener("blur", () => this.fingers.clear());
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener("keydown", (e) => {
      if (!this.enabled) return;
      if (e.key === "Enter" || e.key === " ") {
        const target = this.entities.find(
          (x) =>
            x.enabled &&
            x.def.place === this.camera.place &&
            x.def.kind === "animal",
        );
        if (target) this.activate(target);
      }
    });
  }
  visible(e: Entity) {
    return (
      e.enabled &&
      e.object.visible &&
      (this.camera.space
        ? e.def.place === "space"
        : e.def.place === this.camera.place || e.def.place === "sky")
    );
  }
  project(e: Entity) {
    (e.anchor ?? e.object).getWorldPosition(this.center);
    this.projected.copy(this.center).project(this.camera.camera);
    const r = this.canvas.getBoundingClientRect();
    return {
      x: r.left + ((this.projected.x + 1) * r.width) / 2,
      y: r.top + ((1 - this.projected.y) * r.height) / 2,
      z: this.projected.z,
    };
  }
  hit(x: number, y: number) {
    // Accept the whole visible model first, then the generously padded target.
    const rect = this.canvas.getBoundingClientRect();
    this.raycaster.setFromCamera(
      new T.Vector2(
        ((x - rect.left) / rect.width) * 2 - 1,
        -((y - rect.top) / rect.height) * 2 + 1,
      ),
      this.camera.camera,
    );
    let direct: Entity | null = null;
    let depth = Infinity;
    for (const e of this.entities) {
      if (!this.visible(e)) continue;
      const object =
        e.def.kind === "instrument" && e.def.note !== undefined
          ? e.anchor!
          : e.object;
      const hit = this.raycaster.intersectObject(object, true)[0];
      if (hit && hit.distance < depth) {
        direct = e;
        depth = hit.distance;
      }
    }
    if (direct) return direct;
    let best: Entity | null = null,
      score = Infinity;
    for (const e of this.entities) {
      if (!this.visible(e)) continue;
      const p = this.project(e);
      if (p.z < 0 || p.z > 1) continue;
      // Minimum 60–96 CSS-pixel targets, growing slightly on tablets.
      const r = e.hitRadius * Math.min(1.3, Math.max(1, innerHeight / 650));
      const d = Math.hypot(x - p.x, y - p.y) / r;
      if (d <= 1 && d < score) {
        score = d;
        best = e;
      }
    }
    return best;
  }
  activate(e: Entity) {
    const now = performance.now() / 1000;
    const cooldown = e.def.kind === "instrument" ? 0.075 : 0.28;
    if (now - e.lastTap < cooldown) return;
    e.lastTap = now;
    e.tapped = now;
    e.taps++;
    this.interactions++;
    bus.emit("tap", e);
  }
  private down(e: PointerEvent) {
    if (!this.enabled) return;
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    const target = this.hit(e.clientX, e.clientY);
    this.fingers.set(e.pointerId, { x: e.clientX, y: e.clientY, last: target });
    if (target) this.activate(target);
    else if (performance.now() - this.lastEmpty > 120) {
      this.lastEmpty = performance.now();
      const r = this.canvas.getBoundingClientRect();
      const ray = new T.Raycaster();
      ray.setFromCamera(
        new T.Vector2(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          (-(e.clientY - r.top) / r.height) * 2 + 1,
        ),
        this.camera.camera,
      );
      const point = new T.Vector3();
      if (
        ray.ray.intersectPlane(new T.Plane(new T.Vector3(0, 1, 0), -0.2), point)
      )
        this.empty(point);
    }
  }
  private move(e: PointerEvent) {
    if (!this.enabled) return;
    const finger = this.fingers.get(e.pointerId);
    if (!finger) return;
    if (Math.hypot(e.clientX - finger.x, e.clientY - finger.y) < 14) return;
    const target = this.hit(e.clientX, e.clientY);
    if (target && target !== finger.last && target.def.kind === "instrument") {
      finger.last = target;
      this.activate(target);
    }
  }
}
