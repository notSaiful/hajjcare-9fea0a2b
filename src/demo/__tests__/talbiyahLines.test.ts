import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, beforeEach } from "vitest";

const root = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");

const AR =
  "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ";
const TR =
  "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, innal-hamda wan-ni'mata laka wal-mulk, la sharika lak";
const EN =
  "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise and blessings are Yours, and all sovereignty. You have no partner.";
const HI =
  "हाज़िर हूँ, ऐ अल्लाह, मैं हाज़िर हूँ। हाज़िर हूँ, तेरा कोई शरीक नहीं, मैं हाज़िर हूँ। बेशक सारी तारीफ़, सारी नेमतें और सारी बादशाहत तेरी ही है, तेरा कोई शरीक नहीं।";

type Line = { ar: string; tr: string; hi: string; en: string };

describe("talbiyah line text", () => {
  const home = read("public/index.html");
  const guide = read("src/pages/DuaGuidePage.tsx");
  const app = read("public/app.js");
  const script = read("public/talbiyah-lines.js");

  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.className = "";
    localStorage.removeItem("hc-skip-talbiya");
    delete (window as unknown as { __hcTalbiyahLines?: unknown }).__hcTalbiyahLines;
    delete (window as unknown as { __talbiyaDone?: boolean }).__talbiyaDone;
  });

  it("keeps the door audio file and does not add another clip", () => {
    expect(home).toContain('id="talbiya" data-m="assets/talbiya-v2.mp3?v=2" data-f="assets/talbiya-female-1x.mp3?v=1"');
    expect(app).toContain("let voice='f'");
    expect(app).toContain("a.src=a.dataset[voice]");
    expect(home).toContain('src="talbiyah-lines.js"');
    expect(script).not.toMatch(/\.mp3|new Audio|\.play\(|\.src\s*=/);
    expect(read("public/style.css")).toContain("#talbiyah-lines");
  });

  it("splits the existing Talbiyah wording into the same four lines", () => {
    expect(guide).toContain(AR);
    expect(guide).toContain(TR);
    expect(guide).toContain(EN);
    expect(home).toContain(HI);
    window.eval(script);
    const lines = (window as unknown as { __hcTalbiyahLines: Line[] }).__hcTalbiyahLines;
    expect(lines).toHaveLength(4);
    expect(lines.map((line) => line.ar).join(" ")).toBe(AR);
    expect(lines.map((line) => line.tr).join(" ")).toBe(TR);
    expect(lines.map((line) => line.en).join(" ")).toBe(EN);
    expect(lines.map((line) => line.hi).join(" ")).toBe(HI);
    const clock = (window as unknown as { __hcTalbiyahLineFromClock: (d: number, c: number, s: number) => number | null })
      .__hcTalbiyahLineFromClock;
    expect(clock(Number.NaN, 0, 0)).toBeNull();
    expect(clock(40, 3.8, 3.8)).toBe(0);
    expect(clock(40, 3.8 + (40 - 3.8) * 0.26, 3.8)).toBe(1);
    expect(clock(40, 39.9, 3.8)).toBe(3);
  });

  it("shows lines when the door opens and still steps if audio fails", async () => {
    document.body.innerHTML = `<div id="intro"><div id="opener"></div></div><audio id="talbiya"></audio><main></main>
      <section class="talbiya"><p class="eyebrow">तलबिया</p><p class="ar">اللهُ أَكْبَرُ</p><p class="tr">अल्लाहु अकबर।</p><p class="mean">“${HI}”</p><p class="jigar">लबों पर जिगर</p><button class="hmb" type="button">▶ हिंदी मायने सुनें</button></section>`;
    const original = document.querySelector("section.talbiya")!.innerHTML;
    window.eval(script);
    expect(document.getElementById("talbiyah-lines")?.hidden).toBe(true);

    document.getElementById("opener")!.classList.add("dopen");
    await Promise.resolve();
    const panel = document.getElementById("talbiyah-lines")!;
    expect(panel.hidden).toBe(false);
    const items = [...panel.querySelectorAll("li")];
    expect(items[0]?.hidden).toBe(false);
    expect(items[0]?.textContent).toContain("Labbayk Allahumma labbayk,");
    expect(items[2]?.hidden).toBe(true);

    const buttons = [...panel.querySelectorAll("button")];
    expect(buttons.map((b) => b.textContent)).toEqual(
      expect.arrayContaining([expect.stringContaining("Previous"), expect.stringContaining("Next"), expect.stringContaining("Old Talbiyah text")])
    );

    const audio = document.getElementById("talbiya") as HTMLAudioElement;
    Object.defineProperty(audio, "duration", { configurable: true, get: () => 40 });
    audio.currentTime = 3.8;
    audio.dispatchEvent(new Event("playing"));
    audio.currentTime = 3.8 + (40 - 3.8) * 0.6;
    audio.dispatchEvent(new Event("timeupdate"));
    expect(items[0]?.hidden).toBe(true);
    expect(items[1]?.hidden).toBe(false);
    expect(items[2]?.hidden).toBe(false);
    expect(items[3]?.hidden).toBe(true);

    buttons.find((b) => b.textContent?.includes("Previous"))!.click();
    expect(items[1]?.hidden).toBe(false);
    expect(items[2]?.hidden).toBe(true);
    audio.currentTime = 39.9;
    audio.dispatchEvent(new Event("timeupdate"));
    expect(items[2]?.hidden).toBe(true);
    buttons.find((b) => b.textContent?.includes("Next"))!.click();
    expect(items[2]?.textContent).toContain("innal-hamda wan-ni'mata laka wal-mulk,");

    audio.dispatchEvent(new Event("error"));
    buttons.find((b) => b.textContent?.includes("Next"))!.click();
    expect(items[3]?.hidden).toBe(false);
    expect(items[3]?.textContent).toContain("You have no partner.");

    const old = buttons.find((b) => b.textContent?.includes("Old Talbiyah text"))!;
    expect(old.getAttribute("aria-expanded")).toBe("false");
    old.click();
    expect(old.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById("tl-old")?.textContent).toContain(HI);
    expect(document.getElementById("tl-old")?.textContent).not.toContain("हिंदी मायने सुनें");
    expect(document.querySelector("section.talbiya")!.innerHTML).toBe(original);
  });

  it("hides only after the Hindi meaning ends, then offers the existing Enter step", async () => {
    document.body.innerHTML = `<div id="intro"><div id="opener"></div><button id="enter" type="button">Enter</button></div><audio id="talbiya"></audio><audio id="hmean"></audio>`;
    let entered = 0;
    document.getElementById("enter")!.addEventListener("click", () => {
      entered += 1;
      document.getElementById("intro")!.classList.add("gone");
      document.body.classList.add("entered");
    });
    window.eval(script);
    document.getElementById("opener")!.classList.add("dopen");
    await Promise.resolve();
    const panel = document.getElementById("talbiyah-lines")!;
    const talbiya = document.getElementById("talbiya")!;
    talbiya.dispatchEvent(new Event("ended"));
    expect(panel.hidden).toBe(false);
    expect(document.getElementById("talbiyah-next")?.hidden).not.toBe(false);

    document.getElementById("hmean")!.dispatchEvent(new Event("ended"));
    expect(panel.hidden).toBe(true);
    const forward = document.getElementById("talbiyah-next")!;
    expect(forward.hidden).toBe(false);
    expect(forward.textContent).toContain("Next");
    expect(forward.textContent).toContain("आगे बढ़ें");
    forward.click();
    expect(entered).toBe(1);
    expect(document.getElementById("talbiyah-next")).toBeNull();
    expect(document.body.classList.contains("entered")).toBe(true);

    document.getElementById("opener")!.classList.remove("dopen");
    document.getElementById("opener")!.classList.add("dopen");
    await Promise.resolve();
    expect(panel.hidden).toBe(true);
  });

  it("skips the door clips immediately and still shows Skip next time", async () => {
    document.body.innerHTML = `<div id="intro"><div id="opener"></div><button id="enter" type="button">Enter</button></div><audio id="talbiya"></audio><audio id="hmean"></audio>`;
    const talbiya = document.getElementById("talbiya") as HTMLAudioElement;
    const hmean = document.getElementById("hmean") as HTMLAudioElement;
    let pauses = 0;
    talbiya.pause = () => { pauses += 1; };
    hmean.pause = () => { pauses += 1; };
    let entered = 0;
    document.getElementById("enter")!.addEventListener("click", () => {
      entered += 1;
    });
    window.eval(script);
    const skip = document.getElementById("talbiyah-skip")!;
    expect(skip.hidden).toBe(false);
    expect(skip.textContent).toContain("Skip");
    expect(skip.textContent).toContain("छोड़ें");
    document.getElementById("opener")!.classList.add("dopen");
    await Promise.resolve();
    expect(document.getElementById("talbiyah-lines")?.hidden).toBe(false);
    skip.click();
    expect((window as unknown as { __talbiyaDone?: boolean }).__talbiyaDone).toBe(true);
    expect(pauses).toBeGreaterThanOrEqual(2);
    expect(document.getElementById("talbiyah-lines")?.hidden).toBe(true);
    expect(entered).toBe(1);
    expect(localStorage.getItem("hc-skip-talbiya")).toBe("1");
    expect(document.getElementById("talbiyah-skip")).toBeNull();

    document.body.innerHTML = `<div id="intro"><div id="opener"></div></div><audio id="talbiya"></audio><audio id="hmean"></audio>`;
    window.eval(script);
    expect((window as unknown as { __talbiyaDone?: boolean }).__talbiyaDone).toBe(true);
    expect(document.getElementById("talbiyah-skip")?.textContent).toContain("Skip");
  });
});
