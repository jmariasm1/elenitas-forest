import * as T from "three";
export function mesh(geometry: T.BufferGeometry, color: string) {
  return new T.Mesh(
    geometry,
    new T.MeshStandardMaterial({ color, roughness: 0.95 }),
  );
}
export function disk(radius: number, color: string, y = 0) {
  const o = mesh(new T.CylinderGeometry(radius, radius, 0.1, 64), color);
  o.position.y = y;
  o.receiveShadow = true;
  return o;
}
export function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  gradient.addColorStop(0, "rgba(40,61,43,.23)");
  gradient.addColorStop(1, "rgba(40,61,43,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new T.CanvasTexture(canvas);
}
const shadowMap = shadowTexture();
const shadowGeo = new T.PlaneGeometry(1, 1);
export function blobShadow(size = 2) {
  const m = new T.Mesh(
    shadowGeo,
    new T.MeshBasicMaterial({
      map: shadowMap,
      transparent: true,
      depthWrite: false,
    }),
  );
  m.rotation.x = -Math.PI / 2;
  m.scale.set(size, size, 1);
  m.position.y = 0.055;
  return m;
}
export function iconTexture(draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  draw(c.getContext("2d")!);
  return new T.CanvasTexture(c);
}
export function labelSprite(text: string, color = "#f7edd5") {
  const map = iconTexture((ctx) => {
    ctx.fillStyle = color;
    ctx.font = "bold 76px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 64, 64);
  });
  return new T.Sprite(
    new T.SpriteMaterial({ map, transparent: true, depthWrite: false }),
  );
}
