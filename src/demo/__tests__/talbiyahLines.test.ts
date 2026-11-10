import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

const root = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");

type Line = { end_ms_in_full: number; file: string; hindi_meaning: string; english_meaning: string; arabic: string };
type Manifest = {
  door_open_arabic_female: { file: string };
  male_line: { file: string; text_on_screen: string; duration_ms: number };
  lines: Line[];
};

class FakeAudio {
  src = "";
  paused = true;
  muted = false;
  currentTime = 0;
  private listeners: Record<string, Array<() => void>> = {};
  play() {
    this.paused = false;
    this.muted = false;
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
  addEventListener(type: string, fn: () => void) {
    (this.listeners[type] ||= []).push(fn);
  }
  removeEventListener(type: string, fn: () => void) {
    this.listeners[type] = (this.listeners[type] || []).filter((item) => item !== fn);
  }
  dispatch(type: string) {
    (this.listeners[type] || []).slice().forEach((fn) => fn());
  }
}

const made: FakeAudio[] = [];

describe("talbiyah listening", () => {
  const home = read("public/index.html");
  const guide = read("src/pages/DuaGuidePage.tsx");
  const app = read("public/app.js");
  const manifest = JSON.parse(read("public/assets/talbiyah/manifest.json")) as Manifest;
  const script = read("public/talbiyah-listen.js");

  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.className = "";
    sessionStorage.clear();
    made.length = 0;
    delete (window as unknown as { __hcTalbiyahReady?: boolean }).__hcTalbiyahReady;
    window.requestAnimationFrame = (cb: FrameRequestCallback) => {
      cb(performance.now() + 5000);
      return 1;
    };
    (window as unknown as { Audio: typeof Audio }).Audio = function Audio() {
      const audio = new FakeAudio();
      made.push(audio);
      return audio;
    } as unknown as typeof Audio;
    window.fetch = (async (url: string) => {
      expect(String(url)).toContain("assets/talbiyah/manifest.json");
      return { ok: true, json: async () => manifest };
    }) as unknown as typeof fetch;
  });

  async function boot() {
    document.body.innerHTML = `<div id="intro"><div id="opener"></div></div>
      <audio id="talbiya" data-f="assets/talbiya-female-1x.mp3?v=1"></audio>
      <audio id="hmean"></audio><main></main>
      <section class="talbiya"><p class="eyebrow">तलबिया</p><p class="ar">اللهُ أَكْبَرُ</p><p class="tr">अल्लाहु अकबर।</p><p class="mean">“${manifest.lines.map((l) => l.hindi_meaning).join(" ")}”</p><p class="jigar">लबों पर जिगर</p></section>`;
    window.eval(script);
    for (let i = 0; i < 8 && !(window as unknown as { __hcTalbiyahReady?: boolean }).__hcTalbiyahReady; i++) {
      await Promise.resolve();
    }
    expect((window as unknown as { __hcTalbiyahReady?: boolean }).__hcTalbiyahReady).toBe(true);
    return made[0];
  }

  it("leaves the existing Talbiyah text and door audio element unchanged", () => {
    expect(home).toContain('id="talbiya" data-m="assets/talbiya-v2.mp3?v=2" data-f="assets/talbiya-female-1x.mp3?v=1"');
    expect(home).toContain('src="talbiyah-listen.js"');
    expect(home).not.toContain("talbiyah-ar-female-full.mp3");
    expect(guide).toContain(manifest.text_sources.full_arabic);
    expect(home).toContain(manifest.text_sources.full_hindi_meaning);
    expect(app).toContain("let voice='f'");
    expect(app).toContain("a.src=a.dataset[voice]");
    expect(read("public/style.css")).toContain("#talbiyah-listen");
    expect(script).not.toContain("talbiya-female-1x");
  });

  it("maps the full recording onto the manifest line times", () => {
    window.eval(script);
    const at = (window as unknown as { __hcTalbiyahLineIndexAt?: (lines: Line[], ms: number) => number }).__hcTalbiyahLineIndexAt;
    expect(at).toBeTypeOf("function");
    expect(at!(manifest.lines, 0)).toBe(0);
    expect(at!(manifest.lines, manifest.lines[0].end_ms_in_full)).toBe(1);
    expect(at!(manifest.lines, manifest.lines[2].end_ms_in_full)).toBe(3);
    expect(at!(manifest.lines, 99999)).toBe(3);
  });

  it("plays the female recitation when the door opens, then the male line, then each clip", async () => {
    const player = await boot();
    const original = document.querySelector("section.talbiya")!.innerHTML;
    document.getElementById("opener")!.click();
    const panel = document.getElementById("talbiyah-listen")!;
    expect(panel.hidden).toBe(false);
    expect(player.src).toContain(manifest.door_open_arabic_female.file);
    expect(player.paused).toBe(false);

    player.currentTime = 3;
    player.dispatch("timeupdate");
    const rows = [...panel.querySelectorAll("li")];
    expect(rows[1].classList.contains("tl-now")).toBe(true);
    expect(rows[1].querySelector(".tl-opt")?.hidden).toBe(false);
    expect(rows[1].textContent).toContain(manifest.lines[1].hindi_meaning);
    expect(rows[1].textContent).toContain(manifest.lines[1].english_meaning);
    expect(rows[3].querySelector(".tl-opt")?.hidden).toBe(true);

    player.dispatch("ended");
    expect(player.src).toContain(manifest.male_line.file);
    const aye = panel.querySelector(".tl-aye") as HTMLElement;
    expect(aye.hidden).toBe(false);
    expect(aye.textContent).toBe(manifest.male_line.text_on_screen);

    player.dispatch("ended");
    expect(player.src).toContain(manifest.lines[0].file);
    rows[1].querySelector("button")!.click();
    expect(player.src).toContain(manifest.lines[1].file);

    panel.querySelector<HTMLButtonElement>("[data-tl-loop]")!.click();
    expect(panel.querySelector("[data-tl-loop]")!.getAttribute("aria-pressed")).toBe("true");
    player.dispatch("ended");
    expect(player.paused).toBe(true);

    const play = [...panel.querySelectorAll("[data-tl-play]")].find((b) => b.textContent === "Play")!;
    play.dispatchEvent(new Event("click"));
    expect(player.src).toContain(manifest.door_open_arabic_female.file);

    panel.querySelector<HTMLButtonElement>('[aria-label="Stop Talbiyah"]')!.click();
    const src = player.src;
    expect(player.paused).toBe(true);
    expect(player.muted).toBe(true);
    player.dispatch("ended");
    expect(player.src).toBe(src);

    const oldAudio = document.getElementById("talbiya") as HTMLAudioElement;
    let pauses = 0;
    oldAudio.pause = () => {
      pauses += 1;
    };
    player.muted = false;
    (panel.querySelector("[data-tl-play]") as HTMLButtonElement).click();
    oldAudio.dispatchEvent(new Event("play"));
    expect(pauses).toBe(1);

    panel.querySelector<HTMLButtonElement>('[aria-controls="tl-old"]')!.click();
    expect(document.getElementById("tl-old")?.textContent).toContain("اللهُ أَكْبَرُ");
    expect(document.querySelector("section.talbiya")!.innerHTML).toBe(original);
  });

  it("does not autoplay again after the door has already been opened", async () => {
    sessionStorage.setItem("hc-talbiyah-listen", "1");
    const player = await boot();
    document.getElementById("opener")!.click();
    expect(document.getElementById("talbiyah-listen")?.hidden).toBe(false);
    expect(player.src).toBe("");
    expect(player.paused).toBe(true);
  });
});
