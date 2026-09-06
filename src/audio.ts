import { assetURL, bus, settings } from "./core";
import type { AudioCategory } from "./types";
export class AudioSystem {
  context: AudioContext | null = null;
  private gains = new Map<AudioCategory, GainNode>();
  private active = new Set<AudioBufferSourceNode>();
  private tones = new Set<OscillatorNode>();
  private cache = new Map<string, Promise<AudioBuffer>>();
  private narrationPlaying = false;
  private pending: string | null = null;
  private generation = 0;
  private nextBird = 0;
  private nextMusic = 0;
  unlocked = false;
  constructor() {
    bus.on("settings", () => {
      this.apply();
      this.cancelNarration();
    });
  }
  async unlock() {
    if (!this.context) {
      this.context = new AudioContext();
      const master = this.context.createGain();
      const limiter = this.context.createDynamicsCompressor();
      limiter.threshold.value = -12;
      limiter.knee.value = 18;
      limiter.ratio.value = 6;
      limiter.attack.value = 0.005;
      limiter.release.value = 0.25;
      master.connect(limiter);
      limiter.connect(this.context.destination);
      this.gains.set("master", master);
      for (const category of [
        "narration",
        "music",
        "animals",
        "instruments",
        "environment",
      ] as AudioCategory[]) {
        const g = this.context.createGain();
        g.connect(master);
        this.gains.set(category, g);
      }
      this.apply();
    }
    await this.context.resume();
    this.unlocked = true;
  }
  apply() {
    if (!this.context) return;
    for (const [key, gain] of this.gains) {
      gain.gain.setTargetAtTime(
        key === "master" && settings.value.muted
          ? 0
          : settings.value.volumes[key],
        this.context.currentTime,
        0.12,
      );
    }
  }
  async buffer(key: string) {
    const path = `audio/${settings.value.language}/narration/${key}.wav`;
    if (!this.cache.has(path))
      this.cache.set(
        path,
        fetch(assetURL(path))
          .then((r) => {
            if (!r.ok) throw new Error(`Missing narration ${path}`);
            return r.arrayBuffer();
          })
          .then((b) => this.context!.decodeAudioData(b))
          .catch((error) => {
            this.cache.delete(path);
            throw error;
          }),
      );
    return this.cache.get(path)!;
  }
  say(key: string) {
    bus.emit("subtitle", settings.t(key));
    if (
      !this.unlocked ||
      !this.context ||
      settings.value.muted ||
      settings.value.volumes.narration === 0
    )
      return;
    this.pending = key;
    if (!this.narrationPlaying) void this.playLatest();
  }
  private async playLatest() {
    const key = this.pending;
    if (!key || !this.context) return;
    this.pending = null;
    this.narrationPlaying = true;
    const generation = this.generation;
    try {
      const buffer = await this.buffer(key);
      if (generation !== this.generation) return;
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.gains.get("narration")!);
      this.active.add(source);
      source.onended = () => {
        this.active.delete(source);
        if (generation !== this.generation) return;
        this.narrationPlaying = false;
        void this.playLatest();
      };
      source.start();
    } catch (error) {
      console.warn("Narration unavailable", key, error);
      this.narrationPlaying = false;
      if (this.pending) void this.playLatest();
    }
  }
  cancelNarration() {
    this.generation++;
    this.pending = null;
    this.narrationPlaying = false;
    for (const source of this.active) {
      source.stop();
    }
    this.active.clear();
  }
  tone(
    frequency: number,
    category: AudioCategory = "instruments",
    duration = 0.8,
    level = 0.3,
    type: OscillatorType = "sine",
    delay = 0,
  ) {
    if (
      !this.context ||
      !this.unlocked ||
      document.hidden ||
      this.tones.size >= 24
    )
      return;
    const ctx = this.context;
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(level, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    this.tones.add(osc);
    osc.connect(gain);
    gain.connect(this.gains.get(category)!);
    osc.start(start);
    osc.stop(start + duration + 0.03);
    osc.onended = () => {
      this.tones.delete(osc);
      osc.disconnect();
      gain.disconnect();
    };
  }
  note(index: number, bell = false) {
    const hz = [261.63, 293.66, 329.63, 392, 440, 523.25][index % 6];
    this.tone(hz, "instruments", bell ? 1.8 : 0.85, 0.4);
    this.tone(hz * 2.756, "instruments", 0.25, 0.065);
    bus.emit("music", index);
  }
  drum() {
    this.tone(85, "instruments", 0.28, 0.65);
    this.tone(148, "instruments", 0.09, 0.15, "triangle");
    bus.emit("music", 0);
  }
  animal(id: string) {
    // Gentle stylized synthesis; rabbits and butterflies are intentionally quiet.
    if (id === "frog") {
      this.tone(160, "animals", 0.21, 0.28, "triangle");
      this.tone(130, "animals", 0.24, 0.2, "triangle", 0.24);
    }
    if (id === "duck") {
      this.tone(420, "animals", 0.12, 0.13, "triangle");
      this.tone(340, "animals", 0.16, 0.11, "triangle", 0.12);
    }
    if (id === "owl") {
      this.tone(370, "animals", 0.42, 0.17);
      this.tone(320, "animals", 0.5, 0.12, "sine", 0.5);
    }
  }
  ambient(time: number, night: boolean, space: boolean) {
    if (!this.unlocked || document.hidden) return;
    if (time > this.nextBird) {
      this.nextBird = time + 7 + Math.random() * 7;
      if (!space) {
        if (night) this.tone(1500, "environment", 0.08, 0.035);
        else {
          this.tone(1500, "environment", 0.13, 0.05);
          this.tone(1800, "environment", 0.14, 0.035, "sine", 0.18);
        }
      }
    }
    if (time > this.nextMusic) {
      this.nextMusic = time + 5.5;
      const hz = [196, 261.63, 293.66, 329.63, 392][Math.floor(time / 5) % 5];
      this.tone(hz, "music", 3, 0.18);
      this.tone(hz * 1.5, "music", 3, 0.07, "sine", 0.45);
    }
  }
  pause() {
    this.cancelNarration();
    for (const osc of this.tones) osc.stop();
    this.tones.clear();
    void this.context?.suspend();
  }
  resume() {
    if (this.unlocked) void this.context?.resume();
  }
  stats() {
    return {
      narrationPlaying: this.narrationPlaying,
      queued: this.pending ? 1 : 0,
      cached: this.cache.size,
      tones: this.tones.size,
      context: this.context?.state ?? "locked",
    };
  }
}
