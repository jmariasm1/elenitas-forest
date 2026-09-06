import * as T from "three";
import { bus, settings } from "./core";
import { World } from "./world";
import { Effects } from "./effects";
import { AudioSystem } from "./audio";
import { EnvironmentSystem } from "./environment";
import type { Entity } from "./types";
export class Behaviors {
  private position = new T.Vector3();
  constructor(
    private world: World,
    private effects: Effects,
    private audio: AudioSystem,
    private environment: EnvironmentSystem,
  ) {
    bus.on("tap", (e) => this.tap(e));
    bus.on("music", () => {
      world.entities
        .filter((e) => e.def.kind === "shape" || e.def.id === "rabbit")
        .forEach((e) => (e.tapped = performance.now() / 1000));
    });
  }
  private tap(e: Entity) {
    const d = e.def;
    (e.anchor ?? e.object).getWorldPosition(this.position);
    if (d.kind === "path") return;
    if (d.kind !== "instrument") this.effects.puff(this.position, 6);
    let key = d.key;
    switch (d.kind) {
      case "animal":
        this.audio.animal(d.id);
        if (d.id === "duck") this.environment.water();
        break;
      case "shape": {
        const variant = (e.taps - 1) % 2;
        this.world.assets.tint(e.object, d.colors![variant]);
        key = d.key + "." + variant;
        if (d.behavior === "hexagon") this.effects.honey(this.position);
        break;
      }
      case "number":
        this.effects.count(d.value!, this.position);
        key = "count." + d.value;
        break;
      case "letter": {
        if (settings.value.language === "es" && d.id === "letter_m") {
          this.effects.count(1, this.position);
        }
        if (d.id === "letter_s") {
          bus.emit("grow", undefined);
        }
        if (d.id === "letter_l" && settings.value.language === "es") {
          this.environment.setNight(true);
        }
        break;
      }
      case "instrument": {
        if (d.id === "drum") this.audio.drum();
        else this.audio.note(d.note ?? 4, d.id === "bell");
        // Instruments remain musical during rapid play; names are sparse.
        if (e.taps === 1) this.audio.say(d.key);
        return;
      }
      case "sky":
        if (d.id === "sun") {
          bus.emit("grow", undefined);
          this.environment.setNight(true);
        } else if (d.id === "moon") {
          this.environment.setNight(false);
          this.audio.note(5, true);
        } else if (d.id === "cloud") bus.emit("rain", undefined);
        else this.audio.note(d.note ?? 2, true);
        break;
      case "environment":
        if (d.id === "flowers") {
          bus.emit("grow", undefined);
          this.effects.count(1, this.position);
        }
        if (d.id === "water") this.environment.water();
        if (d.id === "tree_touch") this.environment.wind();
        if (d.id === "mushroom_touch") this.effects.count(2, this.position);
        break;
    }
    this.audio.say(key);
  }
  update(time: number) {
    const reduced = settings.value.reducedMotion;
    for (const e of this.world.entities) {
      if (!e.enabled || e.def.kind === "sky" || e.def.kind === "path") continue;
      const kind = e.def.kind,
        age = time - e.tapped;
      const reaction =
        age >= 0 && age < 1.8 ? Math.sin((Math.PI * age) / 1.8) : 0;
      const idle = reduced ? 0 : Math.sin(time * 1.3 + e.phase) * 0.025;
      const d = e.def;
      if (kind === "instrument") {
        if (d.id.startsWith("bar_") && e.anchor) {
          e.anchor.position.y = 0.37 - reaction * 0.09;
        } else if (d.id === "drum")
          e.object.scale.set(
            e.scale * (1 + reaction * 0.035),
            e.scale * (1 - reaction * 0.1),
            e.scale * (1 + reaction * 0.035),
          );
        else if (d.id === "bell")
          e.object.rotation.z = reduced
            ? 0
            : Math.sin(age * 8) * reaction * 0.15;
        continue;
      }
      e.object.position.copy(e.base);
      e.object.rotation.set(0, 0, 0);
      e.object.scale.setScalar(e.scale);
      if (kind === "animal") {
        if (d.id === "rabbit" || d.id === "frog") {
          if (!reduced) {
            const sniff = d.id === "rabbit" && e.taps > 0 && e.taps % 2 === 0;
            e.object.position.y +=
              reaction * (sniff ? 0.1 : d.id === "rabbit" ? 0.5 : 0.65);
            e.object.position.x += reaction * (sniff ? 0.85 : -0.18);
            if (sniff) {
              e.object.rotation.z = -reaction * 0.18;
              e.object.rotation.x = reaction * 0.2;
            }
          }
          e.object.scale.y = e.scale * (1 + idle + reaction * 0.05);
          const ear = e.object.getObjectByName("ear_l");
          if (ear) ear.rotation.z = reduced ? 0 : reaction * 0.2;
          const other = e.object.getObjectByName("ear_r");
          if (other) other.rotation.z = reduced ? 0 : -reaction * 0.14;
        }
        if (d.id === "duck" && !reduced) {
          e.object.position.x += Math.sin(time * 0.32) * 0.35;
          e.object.position.z += Math.cos(time * 0.32) * 0.22;
          e.object.rotation.y = Math.sin(time * 0.3) * 0.2 + reaction * 0.28;
          e.object.position.y += Math.sin(time * 1.8) * 0.025;
        }
        if (d.id === "butterfly" && !reduced) {
          e.object.position.y += Math.sin(time * 1.5) * 0.25 + reaction * 0.35;
          e.object.position.x += Math.sin(time * 0.65) * 0.55;
          const l = e.object.getObjectByName("wing_l"),
            r = e.object.getObjectByName("wing_r");
          if (l) l.rotation.y = Math.sin(time * 7) * 0.55;
          if (r) r.rotation.y = -Math.sin(time * 7) * 0.55;
        }
        if (d.id === "owl") {
          e.object.rotation.z = reduced ? 0 : reaction * 0.17;
          e.object.scale.y = e.scale * (1 + idle);
          e.object.rotation.y = reduced
            ? 0
            : Math.sin(time * (this.environment.night ? 0.7 : 0.2)) *
              (this.environment.night ? 0.15 : 0.025);
        }
      }
      if (kind === "shape") {
        e.object.position.y += reduced ? 0 : idle + reaction * 0.25;
        if (!reduced) {
          const b = d.behavior;
          if (b === "circle") e.object.rotation.z = reaction * 0.75;
          else if (b === "trapezoid")
            e.object.rotation.z = Math.sin(age * 5) * reaction * 0.2;
          else if (b === "rectangle") e.object.rotation.x = -reaction * 0.7;
          else if (b === "square") {
            e.object.position.y += reaction * 0.35;
            e.object.scale.y = e.scale * (1 - reaction * 0.09);
          } else e.object.rotation.y = reaction * 0.7;
        }
      }
      if (kind === "letter" || kind === "number") {
        e.object.position.y += reduced ? 0 : idle + reaction * 0.3;
        e.object.rotation.z = reduced ? 0 : Math.sin(age * 5) * reaction * 0.08;
      }
      if (kind === "environment" && d.id === "telescope")
        e.object.rotation.y = reduced ? 0 : reaction * 0.16;
      if (kind === "planet") {
        // Keep the identifying surface features facing the child, with a gentle turn.
        e.object.rotation.y = reduced
          ? 0
          : Math.sin(time * 0.05 + e.phase) * 0.25 + reaction * 0.5;
        e.object.position.y += reduced ? 0 : idle + reaction * 0.2;
        const rings = e.object.getObjectByName("rings");
        if (rings) rings.rotation.z = reduced ? 0 : reaction * 0.12;
      }
    }
  }
}
