import type { Group, Object3D, Vector3 } from "three";
export type Language = "es" | "en";
export type Kind =
  | "animal"
  | "shape"
  | "letter"
  | "number"
  | "instrument"
  | "environment"
  | "sky"
  | "planet"
  | "path";
export type AudioCategory =
  "master" | "narration" | "music" | "animals" | "instruments" | "environment";
export interface Definition {
  id: string;
  kind: Kind;
  model: string;
  place: string;
  position: number[];
  key: string;
  scale?: number;
  colors?: string[];
  color?: string;
  behavior?: string;
  value?: number;
  association?: string;
  note?: number;
}
export interface Entity {
  def: Definition;
  object: Group;
  base: Vector3;
  scale: number;
  tapped: number;
  taps: number;
  lastTap: number;
  phase: number;
  hitRadius: number;
  anchor?: Object3D;
  enabled: boolean;
}
export interface Place {
  id: string;
  key: string;
  position: number[];
  icon: string;
}
export interface Preferences {
  language: Language;
  subtitles: boolean;
  reducedMotion: boolean;
  muted: boolean;
  volumes: Record<AudioCategory, number>;
}
export type Events = {
  tap: Entity;
  rain: undefined;
  night: boolean;
  music: number;
  grow: undefined;
  place: string;
  subtitle: string;
  space: boolean;
  settings: Preferences;
};
