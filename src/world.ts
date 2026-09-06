import * as T from "three";
import { Assets } from "./assets";
import { definitions, places, settings } from "./core";
import { blobShadow, disk, mesh, seeded } from "./graphics";
import type { Definition, Entity } from "./types";

export class World {
  forest = new T.Group();
  sky = new T.Group();
  space = new T.Group();
  entities: Entity[] = [];
  flowers: T.Group[] = [];
  grasses: T.Object3D[] = [];
  trees: T.Group[] = [];
  placeGroups = new Map<string, T.Group>();
  private rng = seeded(24);
  constructor(
    public scene: T.Scene,
    public assets: Assets,
  ) {
    scene.add(this.forest, this.sky, this.space);
    this.space.visible = false;
  }
  add(def: Definition, parent = this.forest): Entity {
    const object = new T.Group();
    const model = this.assets.clone(def.model);
    object.add(model);
    object.position.fromArray(def.position);
    const scale = def.scale ?? 1;
    object.scale.setScalar(scale);
    if (def.color || def.colors)
      this.assets.tint(model, def.color ?? def.colors![0]);
    parent.add(object);
    const e: Entity = {
      def,
      object,
      base: object.position.clone(),
      scale,
      tapped: -100,
      taps: 0,
      lastTap: -100,
      phase: this.rng() * 6,
      hitRadius: 40,
      enabled: true,
    };
    // The anchor uses an explicit readable center, independent of animation pivot.
    const anchor = new T.Object3D();
    anchor.position.y =
      def.kind === "animal"
        ? def.id === "rabbit"
          ? 1.05
          : 0.65
        : def.kind === "planet" || def.kind === "sky"
          ? 0
          : 0.65;
    object.add(anchor);
    e.anchor = anchor;
    this.entities.push(e);
    if (def.kind !== "sky" && def.kind !== "planet") {
      const shadow = blobShadow(def.kind === "animal" ? 1.8 : 1.6);
      shadow.position.x = def.position[0];
      shadow.position.z = def.position[2];
      parent.add(shadow);
    }
    return e;
  }
  prop(model: string, pos: number[], scale = 1, parent = this.forest) {
    const o = this.assets.clone(model);
    o.position.fromArray(pos);
    o.scale.setScalar(scale);
    parent.add(o);
    return o;
  }
  async build(progress: (fraction: number) => void) {
    const initial = [
      "tree",
      "fir",
      "flower",
      "rock",
      "bush",
      "grass",
      "mushroom",
      "log",
      "lily",
      "pond",
      "cloud",
      "sun",
      "moon",
      "star",
      "apple",
      "leaf",
      "planet_earth",
      ...definitions.map((d) => d.model),
    ];
    await this.assets.preload(initial, progress);
    const ground = disk(65, "#a9bb86", -0.2);
    ground.position.set(4, -0.2, -17);
    this.forest.add(ground);
    // The same continuous ground and winding paths connect every camera stop.
    for (let i = 0; i < places.length; i++) {
      const a = places[i].position,
        b = places[(i + 1) % places.length].position;
      const start = new T.Vector3(a[0], 0.02, a[1]),
        end = new T.Vector3(b[0], 0.02, b[1]);
      const direction = end.clone().sub(start).normalize();
      start.addScaledVector(direction, 6.4);
      end.addScaledVector(direction, -6.4);
      const mid = start
        .clone()
        .lerp(end, 0.5)
        .add(new T.Vector3(0, 0, 0.6));
      const curve = new T.CatmullRomCurve3([start, mid, end]);
      const path = mesh(
        new T.TubeGeometry(curve, 28, 0.95, 8, false),
        "#d6c8a0",
      );
      path.scale.y = 0.028;
      this.forest.add(path);
    }
    for (const place of places) {
      const group = new T.Group();
      group.position.set(place.position[0], 0, place.position[1]);
      this.forest.add(group);
      this.placeGroups.set(place.id, group);
      const clearing = disk(
        place.id === "meadow" ? 7.8 : 7.2,
        "#b9c991",
        -0.12,
      );
      group.add(clearing);
      const interior = disk(
        place.id === "meadow" ? 7.5 : 6.9,
        "#becf98",
        -0.09,
      );
      group.add(interior);
      // Trees frame the action; the open foreground keeps silhouettes readable.
      for (let i = 0; i < 9; i++) {
        const angle = Math.PI * 0.07 + (i / 8) * Math.PI * 0.86;
        const x = Math.cos(angle) * 8,
          z = -Math.sin(angle) * 6 - 1.5;
        const tree = this.prop(
          i % 3 === 0 ? "fir" : "tree",
          [x, 0, z],
          0.75 + this.rng() * 0.55,
          group,
        );
        tree.rotation.y = this.rng() * 6;
        this.trees.push(tree);
      }
      for (let i = 0; i < 14; i++) {
        const a = this.rng() * Math.PI * 2,
          r = 5.5 + this.rng() * 1.3;
        const flower = this.prop(
          "flower",
          [Math.cos(a) * r, 0, Math.sin(a) * r],
          0.75 + this.rng() * 0.6,
          group,
        );
        this.flowers.push(flower);
        if (i % 3 === 0)
          this.prop(
            "rock",
            [Math.cos(a) * r + 0.4, -0.02, Math.sin(a) * r - 0.3],
            0.4 + this.rng() * 0.5,
            group,
          );
        const grass = this.prop(
          "grass",
          [Math.cos(a) * r - 0.3, 0, Math.sin(a) * r + 0.3],
          1 + this.rng(),
          group,
        );
        this.grasses.push(grass);
      }
      this.prop("bush", [-5.8, 0, -0.8], 1.2, group);
      this.prop("bush", [5.7, 0, -2], 1.3, group);
      // A physical path marker at each edge responds as a generous target.
      for (const direction of [-1, 1]) {
        const dest =
          places[
            (places.indexOf(place) + direction + places.length) % places.length
          ];
        const e = this.add(
          {
            id: `path_${place.id}_${direction}`,
            kind: "path",
            model: "mushroom",
            place: place.id,
            position: [direction * 6, 0.05, 3.6],
            key: dest.key,
            association: dest.id,
            scale: 1.8,
          },
          group,
        );
        e.hitRadius = 38;
      }
    }
    const meadow = this.placeGroups.get("meadow")!;
    this.prop("pond", [2.7, 0, -0.45], 1, meadow);
    this.prop("lily", [4.2, 0.14, 1.5], 0.75, meadow);
    this.prop("flower", [-1.5, 0, 1.1], 0.9, meadow);
    this.prop("log", [-4.5, 1.35, -2.4], 1.5, meadow);
    const perch = mesh(new T.CylinderGeometry(0.25, 0.3, 1.5, 12), "#987855");
    perch.position.set(-4.5, 0.65, -2.4);
    meadow.add(perch);
    for (const def of definitions)
      this.add(def, this.placeGroups.get(def.place)!);
    for (const [id, model, pos, key] of [
      ["flowers", "flower", [-0.1, 0, 2.6], "nature.flower"],
      ["water", "lily", [2.5, 0.1, 1.5], "nature.pond"],
      ["tree_touch", "tree", [-5.3, 0, -4.5], "nature.tree"],
      ["mushroom_touch", "mushroom", [-0.8, 0, 3.8], "nature.mushroom"],
    ] as [string, string, number[], string][]) {
      this.add(
        {
          id,
          kind: "environment",
          model,
          place: "meadow",
          position: pos,
          key,
          scale: id === "tree_touch" ? 0.7 : 1.1,
        },
        meadow,
      );
    }
    // A small empty nest provides an honest zero representation.
    const numbers = this.placeGroups.get("numbers")!;
    const nest = mesh(new T.TorusGeometry(0.58, 0.1, 6, 28), "#987d58");
    nest.rotation.x = Math.PI / 2;
    nest.position.set(-4.2, 0.12, -0.7);
    numbers.add(nest);
    const music = this.entities.find((e) => e.def.id === "xylophone")!;
    music.enabled = false;
    for (let i = 0; i < 6; i++) {
      const bar = music.object.getObjectByName(`bar_${i}`)!;
      const e: Entity = {
        ...music,
        def: { ...music.def, id: `bar_${i}`, note: i },
        anchor: bar,
        enabled: true,
        hitRadius: 30,
      };
      this.entities.push(e);
    }
    const sun = this.add(
      {
        id: "sun",
        kind: "sky",
        model: "sun",
        place: "sky",
        position: [5, 5.6, -8],
        key: "sky.sun",
        scale: 0.62,
      },
      this.sky,
    );
    sun.hitRadius = 46;
    const moon = this.add(
      {
        id: "moon",
        kind: "sky",
        model: "moon",
        place: "sky",
        position: [5, 5.6, -8],
        key: "sky.moon",
        scale: 0.9,
      },
      this.sky,
    );
    moon.enabled = false;
    moon.object.visible = false;
    this.add(
      {
        id: "cloud",
        kind: "sky",
        model: "cloud",
        place: "sky",
        position: [-0.7, 4.65, -4],
        key: "sky.cloud",
        scale: 0.9,
      },
      this.sky,
    ).hitRadius = 48;
    for (let i = 0; i < 5; i++) {
      const e = this.add(
        {
          id: `sky_star_${i}`,
          kind: "sky",
          model: "star",
          place: "sky",
          position: [-5 + i * 2, 4.65 + Math.sin(i * 2) * 0.25, -9],
          key: "sky.star",
          scale: 0.26,
          note: i,
        },
        this.sky,
      );
      e.enabled = false;
      e.object.visible = false;
      e.hitRadius = 30;
    }
    // Decorative background clouds do not intercept the interactive cloud.
    this.prop("cloud", [-8, 6.7, -12], 1.35, this.sky);
    this.prop("cloud", [10, 8, -16], 1.5, this.sky);
    // Letters have visible association companions authored per language.
    this.refreshAssociations();
  }
  refreshAssociations() {
    for (const e of this.entities.filter((e) => e.def.kind === "letter")) {
      const old = e.object.getObjectByName("association");
      if (old) e.object.remove(old);
      const es = e.def.association!;
      const en: Record<string, string> = {
        letter_a: "apple",
        letter_e: "planet_earth",
        letter_l: "leaf",
        letter_m: "moon",
        letter_s: "sun",
      };
      const id = settings.value.language === "es" ? es : en[e.def.id];
      const companion = this.assets.clone(id);
      companion.name = "association";
      companion.position.set(0, 1.25, -0.45);
      companion.scale.setScalar(id === "tree" ? 0.2 : 0.35);
      e.object.add(companion);
    }
  }
  find(id: string) {
    return this.entities.find((e) => e.def.id === id);
  }
}
