import content from "./data/content.json";
import type { Events, Language, Preferences, Definition, Place } from "./types";
export const definitions = content.entities as Definition[];
export const places = content.places as Place[];
export const vocabulary = content.strings;
export class EventBus {
  private listeners = new Map<string, Set<(value: never) => void>>();
  on<K extends keyof Events>(key: K, fn: (value: Events[K]) => void) {
    if (!this.listeners.has(key)) this.listeners.set(key, new Set());
    this.listeners.get(key)!.add(fn as (value: never) => void);
    return () => this.listeners.get(key)?.delete(fn as (value: never) => void);
  }
  emit<K extends keyof Events>(key: K, value: Events[K]) {
    this.listeners.get(key)?.forEach((fn) => fn(value as never));
  }
}
export const bus = new EventBus();
const defaults = (): Preferences => ({
  language: "es",
  subtitles: true,
  reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
  muted: false,
  volumes: {
    master: 0.75,
    narration: 0.85,
    music: 0.18,
    animals: 0.45,
    instruments: 0.65,
    environment: 0.22,
  },
});
export class Settings {
  value = defaults();
  constructor() {
    try {
      const v = JSON.parse(
        localStorage.getItem("elenita.preferences.v1") || "null",
      );
      if (v) {
        this.value.language = v.language === "en" ? "en" : "es";
        for (const key of ["subtitles", "reducedMotion", "muted"] as const)
          if (typeof v[key] === "boolean") this.value[key] = v[key];
        for (const key of Object.keys(
          this.value.volumes,
        ) as (keyof Preferences["volumes"])[])
          if (Number.isFinite(v.volumes?.[key]))
            this.value.volumes[key] = Math.max(0, Math.min(1, v.volumes[key]));
      }
    } catch {
      /* Storage can be unavailable in private mode. */
    }
  }
  save() {
    try {
      localStorage.setItem(
        "elenita.preferences.v1",
        JSON.stringify(this.value),
      );
    } catch {}
    bus.emit("settings", this.value);
  }
  reset() {
    this.value = defaults();
    this.save();
  }
  t(key: string, lang: Language = this.value.language) {
    return (
      (vocabulary[lang] as Record<string, string>)[key] ??
      (vocabulary.es as Record<string, string>)[key] ??
      key
    );
  }
}
export const settings = new Settings();
export const assetURL = (path: string) =>
  new URL(import.meta.env.BASE_URL + path, location.href).href;
export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
