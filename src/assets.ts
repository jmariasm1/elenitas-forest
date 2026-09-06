import { Color, Group, Mesh, MeshStandardMaterial, Object3D } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { assetURL } from "./core";
export class Assets {
  private loader = new GLTFLoader();
  private cache = new Map<string, Promise<Group>>();
  private geometry = new Map<string, Group>();
  async load(id: string) {
    if (!this.cache.has(id))
      this.cache.set(
        id,
        this.loader
          .loadAsync(assetURL(`models/${id}.glb`))
          .then((gltf) => {
            gltf.scene.traverse((o) => {
              if (o instanceof Mesh) {
                o.castShadow = true;
                o.receiveShadow = true;
              }
            });
            this.geometry.set(id, gltf.scene);
            return gltf.scene;
          })
          .catch((error) => {
            this.cache.delete(id);
            throw error;
          }),
      );
    return this.cache.get(id)!;
  }
  async preload(ids: string[], progress?: (fraction: number) => void) {
    let done = 0;
    // Keep request/decode bursts small on mobile.
    const list = [...new Set(ids)];
    for (let i = 0; i < list.length; i += 5)
      await Promise.all(
        list.slice(i, i + 5).map(async (id) => {
          await this.load(id);
          progress?.(++done / list.length);
        }),
      );
  }
  clone(id: string) {
    const model = this.geometry.get(id);
    if (!model) throw new Error(`Asset not loaded: ${id}`);
    return model.clone(true);
  }
  tint(object: Object3D, color: string) {
    object.traverse((o) => {
      if (o instanceof Mesh && o.name.startsWith("color_body")) {
        if (!o.userData.uniqueMaterial) {
          o.material = (o.material as MeshStandardMaterial).clone();
          o.userData.uniqueMaterial = true;
        }
        (o.material as MeshStandardMaterial).color.copy(new Color(color));
      }
    });
  }
}
