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
    expect(home).toContain('aria-label="touch करें"');
    expect(home).toContain('class="otxt">touch करें</span>');
    expect(home).toContain('class="ofing"');
    expect(home).not.toContain("छूकर दरवाज़ा खोलें");
    expect(app).toContain("tx.textContent='touch करें'");
    expect(app).not.toContain("tap.textContent='छूकर शुरू करें'");
    expect(read("public/style.css")).toContain("@keyframes ofing");
    expect(read("public/style.css")).toContain("#opener .ofing{animation:none!important}");
    expect(home).toContain('src="talbiyah-lines.js?v=38"');
    expect(script).not.toMatch(/\.mp3|new Audio|\.play\(|\.src\s*=/);
    const css = read("public/style.css");
    expect(css).toContain("#talbiyah-lines");
    expect(css).toContain("#intro .itb .imean{font-size:.76rem");
    expect(css).toContain("#intro h1.ar.big{font-size:1rem");
    expect(css).toContain("@media(max-width:430px)");
    expect(css).toContain("#talbiyah-lines .tl-ar{font-size:24px!important");
    expect(css).toContain("transition:opacity .7s ease");
    expect(css).not.toContain("#talbiyah-lines,#talbiyah-lines .tl-short{font-size:12px!important");
    expect(read("public/app.js")).toContain("a.addEventListener('loadedmetadata',seek,{once:true})");
    expect(read("public/app.js")).toContain("const pr=a.play()");
    expect(css).toContain("font-size:28px!important");
    expect(script).not.toContain("Old Talbiyah text");
    expect(script).not.toContain("पुराना तलबिया पाठ");
    expect(script).not.toContain("tl-old");
    expect(read("public/app.js")).not.toContain("a.play();a.pause()");
    expect(css).toContain(".hcap{");
    expect(css).toContain("font:600 .76rem/1.25");
    expect(css).toContain("#intro .itb{pointer-events:none");
    expect(css).toContain("#talbiyah-next{");
    expect(css).toContain("z-index:85");
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
    expect(panel.querySelector(".tl-now")?.textContent).toBe("لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ،");
    expect(panel.querySelectorAll(".tl-ar")).toHaveLength(4);
    expect(panel.dir).toBe("rtl");
    expect(panel.textContent).not.toContain("Labbayk Allahumma labbayk");
    expect(panel.textContent).not.toContain("तेरा कोई शरीक नहीं");
    expect(document.getElementById("tl-old")).toBeNull();
    expect(document.body.textContent).not.toContain("Old Talbiyah text");
    expect(document.body.textContent).not.toContain("पुराना तलबिया पाठ");
    expect(document.body.textContent).not.toContain("Previous");
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
    expect(panel.hidden).toBe(true);
    const forward = document.getElementById("talbiyah-next")!;
    expect(forward.hidden).toBe(false);
    expect(forward.textContent).toContain("Next");
    expect(forward.textContent).toContain("अगला");
    forward.click();
    expect(entered).toBe(1);
    expect(document.getElementById("talbiyah-next")).toBeNull();
    expect(document.body.classList.contains("entered")).toBe(true);

    document.getElementById("opener")!.classList.remove("dopen");
    document.getElementById("opener")!.classList.add("dopen");
    await Promise.resolve();
    expect(panel.hidden).toBe(true);
  });

  it("keeps Skip visible on every door visit, through both clips, and after a saved skip", async () => {
    document.body.innerHTML = `<div id="intro"><div id="opener"></div><p class="hcap on">हाज़िर हूँ,</p><span class="hph on">हाज़िर हूँ,</span><button id="enter" type="button">Enter</button></div><audio id="talbiya"></audio><audio id="hmean"></audio>`;
    const talbiya = document.getElementById("talbiya") as HTMLAudioElement;
    const hmean = document.getElementById("hmean") as HTMLAudioElement;
    let pauses = 0;
    talbiya.pause = () => { pauses += 1; };
    hmean.pause = () => { pauses += 1; };
    let entered = 0;
    document.getElementById("enter")!.addEventListener("click", () => {
      entered += 1;
      document.getElementById("intro")!.classList.add("gone");
      document.body.classList.add("entered");
    });
    window.eval(script);
    const skip = document.getElementById("talbiyah-skip")!;
    expect(skip.isConnected).toBe(true);
    expect(skip.hidden).toBe(false);
    expect(skip.textContent).toContain("Skip");
    expect(skip.textContent).toContain("छोड़ें");

    document.getElementById("opener")!.classList.add("dopen");
    await Promise.resolve();
    expect(skip.hidden).toBe(false);
    expect(document.getElementById("talbiyah-lines")?.hidden).toBe(false);
    talbiya.dispatchEvent(new Event("playing"));
    expect(skip.hidden).toBe(false);
    talbiya.dispatchEvent(new Event("ended"));
    hmean.dispatchEvent(new Event("playing"));
    expect(skip.isConnected).toBe(true);
    expect(skip.hidden).toBe(false);

    skip.click();
    expect((window as unknown as { __talbiyaDone?: boolean }).__talbiyaDone).toBe(true);
    expect(pauses).toBeGreaterThanOrEqual(2);
    expect(document.getElementById("talbiyah-lines")?.hidden).toBe(true);
    expect(document.querySelector(".hcap")?.textContent).toBe("");
    expect(document.querySelector(".hcap")?.classList.contains("on")).toBe(false);
    expect(document.querySelector(".hph")?.classList.contains("on")).toBe(false);
    expect(entered).toBe(1);
    expect(document.body.classList.contains("entered")).toBe(true);
    expect(localStorage.getItem("hc-skip-talbiya")).toBe("1");
    expect(document.getElementById("talbiyah-skip")).toBe(skip);

    document.body.classList.remove("entered");
    document.getElementById("intro")!.classList.remove("gone");
    await Promise.resolve();
    expect(skip.hidden).toBe(false);

    document.body.innerHTML = `<div id="intro"><div id="opener"></div><button id="enter" type="button">Enter</button></div><audio id="talbiya"></audio><audio id="hmean"></audio>`;
    window.eval(script);
    const again = document.getElementById("talbiyah-skip")!;
    expect((window as unknown as { __talbiyaDone?: boolean }).__talbiyaDone).toBe(true);
    expect(again.hidden).toBe(false);
    expect(again.textContent).toContain("Skip");
    document.getElementById("opener")!.classList.add("dopen");
    await Promise.resolve();
    document.getElementById("talbiya")!.dispatchEvent(new Event("playing"));
    document.getElementById("talbiya")!.dispatchEvent(new Event("ended"));
    document.getElementById("hmean")!.dispatchEvent(new Event("playing"));
    expect(again.hidden).toBe(false);
    expect(localStorage.getItem("hc-skip-talbiya")).toBe("1");
  });
});
