import { bus, places, settings } from "./core";
import { icons } from "./icons";
import type { AudioCategory } from "./types";
export interface UIActions {
  start: () => void;
  place: (id: string) => void;
  home: () => void;
  night: () => void;
  pause: (paused: boolean) => void;
}
export class UI {
  private root = document.querySelector<HTMLDivElement>("#app")!;
  private started = false;
  private place = "meadow";
  private subtitleTimer = 0;
  private gateTimer = 0;
  private gateAnswer = 0;
  private focusBefore: HTMLElement | null = null;
  constructor(private actions: UIActions) {
    this.render();
    bus.on("subtitle", (text) => this.subtitle(text));
    bus.on("place", (id) => {
      this.place = id;
      this.updatePlace();
    });
    bus.on("space", (value) => {
      document.body.classList.toggle("in-space", value);
      this.updatePlace();
    });
    bus.on("settings", () => {
      document.documentElement.lang = settings.value.language;
      document.body.classList.toggle(
        "reduce-motion",
        settings.value.reducedMotion,
      );
      this.updateLabels();
      this.updatePlace();
    });
    bus.on("night", (night) => {
      document.body.classList.toggle("night", night);
      document.querySelector("#time-toggle")!.innerHTML =
        icons[night ? "sun" : "moon"];
    });
    document.addEventListener("keydown", (e) => {
      const dialog = document.querySelector<HTMLDialogElement>("#parents")!;
      if (e.key === "Escape" && dialog.open) {
        e.preventDefault();
        this.closeParents();
      }
    });
  }
  private t(key: string) {
    return settings.t("ui." + key);
  }
  private button(id: string, icon: string, key: string, cls = "round-button") {
    return `<button id="${id}" class="${cls}" aria-label="${this.t(key)}" data-label="${key}">${icons[icon]}</button>`;
  }
  private render() {
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand"><div class="brand-leaf">${icons.leaf}</div><div><p class="eyebrow" data-text="ready">${this.t("ready")}</p><h1 data-text="title">${this.t("title")}</h1></div></div>
        <div class="top-actions">${this.button("time-toggle", "moon", "sky")}${this.button("sound-toggle", "sound", "sound")}${this.button("parents-open", "lock", "parents")}</div>
      </header>
      <div class="intro" id="intro"><p class="intro-line" data-text="subtitle">${this.t("subtitle")}</p><button id="start" class="start-button" disabled><span class="play-disc">${icons.play}</span><span id="start-text">${this.t("loading")}</span><span class="button-leaf">${icons.leaf}</span></button><div class="loading-line"><span id="load-progress"></span></div></div>
      <div id="caption" class="caption" role="status" aria-live="polite"></div>
      <footer id="wayfinding" class="wayfinding">
        <div class="place-name"><span class="place-dot"></span><span id="place-name"></span></div>
        <nav class="trail" aria-label="${this.t("map")}">${this.button("previous", "left", "previous", "trail-arrow")}${places.map((p) => `<button class="place-button ${p.id === "meadow" ? "selected" : ""}" data-place="${p.id}" aria-label="${settings.t(p.key)}" title="${settings.t(p.key)}">${icons[p.icon]}<span class="selected-dot"></span></button>`).join("")}${this.button("next", "right", "next", "trail-arrow")}</nav>
        ${this.button("full-screen", "expand", "fullscreen")}
      </footer>
      <div class="space-home">${this.button("home", "home", "home")}<span data-text="home">${this.t("home")}</span></div>
      <div id="transition" class="transition"><div class="transition-stars">✧<span>✧</span>✧</div></div>
      <div class="portrait-hint" id="portrait-hint">${icons.rotate}<span data-text="rotate">${this.t("rotate")}</span><button id="portrait-dismiss" data-text="continue">${this.t("continue")}</button></div>
      <dialog id="parents"><div class="parent-card"><div class="parent-heading"><span class="parent-leaf">${icons.leaf}</span><h2 data-text="parents">${this.t("parents")}</h2>${this.button("parents-close", "close", "close")}</div><div id="gate"><p data-text="gate">${this.t("gate")}</p><button id="hold" class="hold-button">${icons.leaf}<span data-text="hold">${this.t("hold")}</span></button><form id="challenge" hidden><label for="answer" id="equation"></label><div class="answer-row"><input id="answer" type="number" inputmode="numeric" autocomplete="off" aria-label="${this.t("answer")}"/><button class="text-button" data-text="open">${this.t("open")}</button></div></form></div><div id="settings-panel" hidden></div></div></dialog>
      <div id="fatal" class="fatal" hidden><div>${icons.leaf}<h2 data-text="error">${this.t("error")}</h2><button id="retry" class="text-button" data-text="retry">${this.t("retry")}</button></div></div>
      <output id="debug" hidden></output>`;
    document.querySelector("#start")!.addEventListener("click", () => {
      this.started = true;
      document.body.classList.add("playing");
      document.querySelector("#intro")!.setAttribute("inert", "");
      this.actions.start();
      this.updatePlace();
    });
    document
      .querySelectorAll<HTMLButtonElement>("[data-place]")
      .forEach((b) =>
        b.addEventListener("click", () => this.actions.place(b.dataset.place!)),
      );
    document
      .querySelector("#previous")!
      .addEventListener("click", () => this.step(-1));
    document
      .querySelector("#next")!
      .addEventListener("click", () => this.step(1));
    document
      .querySelector("#home")!
      .addEventListener("click", () => this.actions.home());
    document.querySelector("#time-toggle")!.addEventListener("click", () => {
      if (this.started) this.actions.night();
    });
    document.querySelector("#sound-toggle")!.addEventListener("click", () => {
      settings.value.muted = !settings.value.muted;
      settings.save();
    });
    document
      .querySelector("#parents-open")!
      .addEventListener("click", () => this.openParents());
    document
      .querySelector("#parents-close")!
      .addEventListener("click", () => this.closeParents());
    const dialog = document.querySelector<HTMLDialogElement>("#parents")!;
    dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      this.closeParents();
    });
    const hold = document.querySelector<HTMLButtonElement>("#hold")!;
    const startHold = () => {
      if (this.gateTimer) return;
      hold.classList.add("holding");
      this.gateTimer = window.setTimeout(() => {
        this.gateTimer = 0;
        hold.hidden = true;
        document.querySelector<HTMLFormElement>("#challenge")!.hidden = false;
        const a = 11 + Math.floor(Math.random() * 9),
          b = 6 + Math.floor(Math.random() * 8);
        this.gateAnswer = a + b;
        document.querySelector("#equation")!.textContent = `${a} + ${b} =`;
        document.querySelector<HTMLInputElement>("#answer")!.focus();
      }, 2800);
    };
    const cancelHold = () => {
      clearTimeout(this.gateTimer);
      this.gateTimer = 0;
      hold.classList.remove("holding");
    };
    hold.addEventListener("pointerdown", (e) => {
      hold.setPointerCapture(e.pointerId);
      startHold();
    });
    for (const event of ["pointerup", "pointercancel", "blur"])
      hold.addEventListener(event, cancelHold);
    hold.addEventListener("keydown", (e) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) {
        e.preventDefault();
        startHold();
      }
    });
    hold.addEventListener("keyup", cancelHold);
    document.querySelector("#challenge")!.addEventListener("submit", (e) => {
      e.preventDefault();
      const answer = document.querySelector<HTMLInputElement>("#answer")!;
      if (Number(answer.value) === this.gateAnswer && answer.value !== "") {
        document.querySelector<HTMLElement>("#gate")!.hidden = true;
        this.renderSettings();
      } else {
        answer.value = "";
        answer.focus();
      }
    });
    document.querySelector("#full-screen")!.addEventListener("click", () => {
      if (!document.fullscreenElement)
        void document.documentElement.requestFullscreen?.().catch(() => {});
      else void document.exitFullscreen();
    });
    document
      .querySelector("#portrait-dismiss")!
      .addEventListener("click", () =>
        document.querySelector("#portrait-hint")!.classList.add("dismissed"),
      );
    document
      .querySelector("#retry")!
      .addEventListener("click", () => location.reload());
    this.updateLabels();
    this.updatePlace();
  }
  private step(direction: number) {
    const i = places.findIndex((p) => p.id === this.place);
    this.actions.place(
      places[(i + direction + places.length) % places.length].id,
    );
  }
  private updateLabels() {
    document
      .querySelectorAll<HTMLElement>("[data-text]")
      .forEach((el) => (el.textContent = this.t(el.dataset.text!)));
    document
      .querySelectorAll<HTMLElement>("[data-label]")
      .forEach((el) =>
        el.setAttribute("aria-label", this.t(el.dataset.label!)),
      );
    document.querySelector("#sound-toggle")!.innerHTML =
      icons[settings.value.muted ? "muted" : "sound"];
    document
      .querySelector("#sound-toggle")!
      .setAttribute("aria-pressed", String(settings.value.muted));
    document.querySelectorAll<HTMLElement>("[data-place]").forEach((el) => {
      const name = settings.t("place." + el.dataset.place);
      el.setAttribute("aria-label", name);
      el.title = name;
    });
    document.title = this.t("title");
  }
  private updatePlace() {
    document.querySelector("#place-name")!.textContent = settings.t(
      "place." + this.place,
    );
    document.querySelectorAll<HTMLElement>("[data-place]").forEach((el) => {
      const selected = el.dataset.place === this.place;
      el.classList.toggle("selected", selected);
      el.setAttribute("aria-current", String(selected));
    });
  }
  progress(fraction: number) {
    document.querySelector<HTMLElement>("#load-progress")!.style.width =
      `${fraction * 100}%`;
  }
  ready() {
    const start = document.querySelector<HTMLButtonElement>("#start")!;
    start.disabled = false;
    document.querySelector("#start-text")!.textContent = this.t("start");
    document.querySelector(".loading-line")!.classList.add("loaded");
  }
  subtitle(text: string) {
    const el = document.querySelector("#caption")!;
    clearTimeout(this.subtitleTimer);
    if (!settings.value.subtitles) return;
    el.textContent = text;
    el.classList.add("visible");
    this.subtitleTimer = window.setTimeout(
      () => el.classList.remove("visible"),
      2500,
    );
  }
  private openParents() {
    this.focusBefore = document.activeElement as HTMLElement;
    this.actions.pause(true);
    const dialog = document.querySelector<HTMLDialogElement>("#parents")!;
    document.querySelector<HTMLElement>("#gate")!.hidden = false;
    document.querySelector<HTMLElement>("#settings-panel")!.hidden = true;
    document.querySelector<HTMLElement>("#hold")!.hidden = false;
    document.querySelector<HTMLElement>("#challenge")!.hidden = true;
    document.querySelector<HTMLInputElement>("#answer")!.value = "";
    dialog.showModal();
  }
  private closeParents() {
    clearTimeout(this.gateTimer);
    this.gateTimer = 0;
    document.querySelector<HTMLDialogElement>("#parents")!.close();
    this.actions.pause(false);
    this.focusBefore?.focus();
  }
  private renderSettings() {
    const panel = document.querySelector<HTMLDivElement>("#settings-panel")!;
    panel.hidden = false;
    panel.innerHTML = `<label class="settings-row"><span>${this.t("language")}</span><select id="language"><option value="es">Español</option><option value="en">English</option></select></label><div class="volume-grid">${(["master", "narration", "music", "animals", "instruments", "environment"] as AudioCategory[]).map((c) => `<label class="volume-row"><span>${this.t(c)}</span><input aria-label="${this.t(c)}" data-volume="${c}" type="range" min="0" max="1" step="0.05" value="${settings.value.volumes[c]}"/></label>`).join("")}</div><label class="settings-row"><span>${this.t("subtitles")}</span><input id="subtitles" type="checkbox" ${settings.value.subtitles ? "checked" : ""}/></label><label class="settings-row"><span>${this.t("motion")}</span><input id="motion" type="checkbox" ${settings.value.reducedMotion ? "checked" : ""}/></label><p class="parent-note">${this.t("about")}</p><p class="parent-note">${this.t("voiceNote")}</p><p class="parent-note">${this.t("spaceNote")}</p><button id="reset" class="reset-button">${this.t("reset")}</button>`;
    const lang = panel.querySelector<HTMLSelectElement>("#language")!;
    lang.value = settings.value.language;
    lang.addEventListener("change", () => {
      settings.value.language = lang.value === "en" ? "en" : "es";
      settings.save();
      this.renderSettings();
    });
    panel.querySelectorAll<HTMLInputElement>("[data-volume]").forEach((input) =>
      input.addEventListener("input", () => {
        settings.value.volumes[input.dataset.volume as AudioCategory] = Number(
          input.value,
        );
        settings.save();
      }),
    );
    panel
      .querySelector<HTMLInputElement>("#subtitles")!
      .addEventListener("change", (e) => {
        settings.value.subtitles = (e.target as HTMLInputElement).checked;
        settings.save();
        if (!settings.value.subtitles)
          document.querySelector("#caption")!.classList.remove("visible");
      });
    panel
      .querySelector<HTMLInputElement>("#motion")!
      .addEventListener("change", (e) => {
        settings.value.reducedMotion = (e.target as HTMLInputElement).checked;
        settings.save();
      });
    panel.querySelector("#reset")!.addEventListener("click", () => {
      settings.reset();
      this.renderSettings();
    });
  }
  error() {
    document.querySelector<HTMLElement>("#fatal")!.hidden = false;
  }
  get veil() {
    return document.querySelector<HTMLElement>("#transition")!;
  }
}
