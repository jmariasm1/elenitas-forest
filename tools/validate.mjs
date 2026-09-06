import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const content = JSON.parse(
  readFileSync(resolve(root, "src/data/content.json"), "utf8"),
);
const manifest = JSON.parse(
  readFileSync(resolve(root, "public/models/manifest.json"), "utf8"),
);
const errors = [];
const ensure = (condition, message) => {
  if (!condition) errors.push(message);
};
const file = (path) => {
  ensure(existsSync(path), `Missing ${path}`);
  if (existsSync(path)) ensure(statSync(path).size > 0, `Empty ${path}`);
};
const ids = new Set();
for (const d of content.entities) {
  ensure(!ids.has(d.id), `Duplicate ${d.id}`);
  ids.add(d.id);
  file(resolve(root, "public/models", d.model + ".glb"));
  ensure(
    content.places.some((p) => p.id === d.place),
    `Unknown place ${d.id}`,
  );
  ensure(
    d.position.length === 3 && d.position.every(Number.isFinite),
    `Invalid placement ${d.id}`,
  );
  if (d.kind === "number")
    ensure(
      Number.isInteger(d.value) && d.value >= 0 && d.value <= 20,
      `Invalid number ${d.id}`,
    );
  const keys =
    d.kind === "shape"
      ? [d.key, d.key + ".0", d.key + ".1"]
      : d.kind === "number"
        ? [d.key, "count." + d.value]
        : [d.key];
  for (const key of keys)
    for (const lang of ["es", "en"]) {
      ensure(!!content.strings[lang][key], `Missing ${lang} ${key}`);
      file(resolve(root, `public/audio/${lang}/narration/${key}.wav`));
    }
}
const spanish = Object.keys(content.strings.es);
ensure(
  spanish.length === Object.keys(content.strings.en).length,
  "Localization parity",
);
for (const key of spanish) {
  ensure(!!content.strings.en[key], `Missing English ${key}`);
  if (!key.startsWith("ui.") && !key.startsWith("place."))
    for (const lang of ["es", "en"])
      file(resolve(root, `public/audio/${lang}/narration/${key}.wav`));
}
for (const asset of manifest) {
  const path = resolve(root, "public", asset.model);
  file(path);
  file(resolve(root, asset.source));
  if (!existsSync(path)) continue;
  const buffer = readFileSync(path);
  ensure(buffer.readUInt32LE(0) === 0x46546c67, `Bad GLB magic ${asset.id}`);
  ensure(buffer.readUInt32LE(4) === 2, `Bad GLB version ${asset.id}`);
  const length = buffer.readUInt32LE(12);
  let doc;
  try {
    doc = JSON.parse(buffer.subarray(20, 20 + length).toString("utf8"));
  } catch {
    errors.push(`Invalid GLB JSON ${asset.id}`);
    continue;
  }
  ensure(doc.meshes?.length > 0, `No geometry ${asset.id}`);
  ensure(doc.materials?.length > 0, `No materials ${asset.id}`);
  ensure(asset.triangles < 15000, `Excessive geometry ${asset.id}`);
  if (asset.animations.length)
    ensure(doc.animations?.length > 0, `Missing Idle animation ${asset.id}`);
  for (const node of doc.nodes ?? []) {
    if (node.scale)
      ensure(
        node.scale.every((v) => Number.isFinite(v) && Math.abs(v) < 20),
        `Invalid scale ${asset.id}`,
      );
    if (node.translation)
      ensure(
        node.translation.every((v) => Number.isFinite(v) && Math.abs(v) < 100),
        `Invalid transform ${asset.id}`,
      );
  }
}
for (const id of [
  "shape_circle",
  "shape_triangle",
  "shape_square",
  "shape_rectangle",
  "shape_pentagon",
  "shape_hexagon",
  "shape_trapezoid",
  "shape_star",
  "letter_ñ",
  "number_10",
  "planet_saturn",
])
  ensure(
    manifest.some((a) => a.id === id),
    `Missing required library asset ${id}`,
  );
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `Validated ${manifest.length} original GLBs and Blender sources, ${content.entities.length} definitions, ${spanish.length} bilingual keys and all narration.`,
);
