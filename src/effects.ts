import * as T from "three";
import { Assets } from "./assets";
import { definitions, settings } from "./core";
import { mesh } from "./graphics";
type Particle = {
  object: T.Mesh;
  start: number;
  life: number;
  base: T.Vector3;
  direction: T.Vector3;
};
export class Effects {
  private particles: Particle[] = [];
  private cursor = 0;
  private butterflies: T.Group[] = [];
  private quantityBase = new T.Vector3();
  quantity = 0;
  private quantityTime = -100;
  private honeycomb: T.Group[] = [];
  private honeyTime = -100;
  constructor(
    private scene: T.Scene,
    private assets: Assets,
  ) {
    const geometry = new T.SphereGeometry(0.055, 6, 4);
    for (let i = 0; i < 48; i++) {
      const object = mesh(geometry, "#f6d894");
      object.visible = false;
      scene.add(object);
      this.particles.push({
        object,
        start: -100,
        life: 1,
        base: new T.Vector3(),
        direction: new T.Vector3(),
      });
    }
    const capacity = Math.min(
      20,
      Math.max(
        5,
        ...definitions
          .filter((d) => d.kind === "number")
          .map((d) => d.value ?? 0),
      ),
    );
    for (let i = 0; i < capacity; i++) {
      const b = assets.clone("butterfly");
      b.visible = false;
      b.scale.setScalar(0.35);
      scene.add(b);
      this.butterflies.push(b);
    }
    for (let i = 0; i < 6; i++) {
      const h = assets.clone("shape_hexagon");
      h.visible = false;
      h.scale.setScalar(0.45);
      assets.tint(h, "#edc86f");
      scene.add(h);
      this.honeycomb.push(h);
    }
  }
  puff(position: T.Vector3, count = 7) {
    if (settings.value.reducedMotion) count = 3;
    for (let i = 0; i < count; i++) {
      const p = this.particles[this.cursor++ % this.particles.length];
      p.base.copy(position);
      p.start = performance.now() / 1000;
      p.life = 1.6;
      p.direction.set(
        Math.cos((i / count) * Math.PI * 2) * 0.5,
        0.45 + Math.random() * 0.4,
        Math.sin((i / count) * Math.PI * 2) * 0.35,
      );
      p.object.visible = true;
    }
  }
  count(n: number, position: T.Vector3) {
    this.quantity = Math.min(
      this.butterflies.length,
      Math.max(0, Math.floor(n)),
    );
    this.quantityTime = performance.now() / 1000;
    this.quantityBase.copy(position);
    this.butterflies.forEach((b, i) => (b.visible = i < this.quantity));
  }
  honey(position: T.Vector3) {
    this.honeyTime = performance.now() / 1000;
    this.honeycomb.forEach((h, i) => {
      h.position
        .copy(position)
        .add(
          new T.Vector3(
            Math.cos((i * Math.PI) / 3) * 1.04,
            0.2,
            Math.sin((i * Math.PI) / 3) * 0.85,
          ),
        );
      h.visible = true;
    });
  }
  clear() {
    this.butterflies.forEach((b) => (b.visible = false));
    this.honeycomb.forEach((h) => (h.visible = false));
    this.quantity = 0;
  }
  update(time: number) {
    for (const p of this.particles) {
      const t = (time - p.start) / p.life;
      if (t >= 1) {
        p.object.visible = false;
        continue;
      }
      if (t < 0) continue;
      p.object.position
        .copy(p.base)
        .addScaledVector(p.direction, settings.value.reducedMotion ? 0.1 : t);
      p.object.scale.setScalar(Math.sin(Math.PI * t) * 1.2);
    }
    this.butterflies.forEach((b, i) => {
      if (!b.visible) return;
      const t = time - this.quantityTime;
      if (t > 14) {
        b.visible = false;
        return;
      }
      const columns = Math.min(5, this.quantity);
      const row = Math.floor(i / 5);
      const a = ((i % 5) - (columns - 1) / 2) * 0.9;
      b.position
        .copy(this.quantityBase)
        .add(
          new T.Vector3(
            a,
            1.8 +
              row * 0.8 +
              (settings.value.reducedMotion
                ? 0
                : Math.sin(time * 2 + i) * 0.12),
            0.1,
          ),
        );
      const wing = b.getObjectByName("wing_l");
      if (wing && !settings.value.reducedMotion)
        wing.rotation.y = Math.sin(time * 7) * 0.5;
      const wr = b.getObjectByName("wing_r");
      if (wr && !settings.value.reducedMotion)
        wr.rotation.y = -Math.sin(time * 7) * 0.5;
    });
    if (time - this.honeyTime > 9)
      this.honeycomb.forEach((h) => (h.visible = false));
  }
  stats() {
    return {
      particles: this.particles.filter((p) => p.object.visible).length,
      quantity: this.quantity,
      butterflies: this.butterflies.filter((b) => b.visible).length,
    };
  }
}
