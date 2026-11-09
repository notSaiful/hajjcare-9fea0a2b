import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, beforeEach } from "vitest";

const root = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");

const EXPLORE_SECTIONS = [
  "circulars",
  "rules",
  "preparation",
  "money",
  "telecom",
  "guides",
  "buildings",
  "hotels",
  "mina",
  "mashaer",
  "qurbani",
  "lost",
  "women",
  "food",
  "social",
  "videos",
  "register",
  "volunteer",
  "contact",
  "fees",
  "after",
  "grievance",
];

describe("approved public demo", () => {
  const explore = read("public/explore.js");
  const library = read("public/library.html");
  const home = read("public/index.html");
  const integration = read("public/demo-integration.js");
  const vercel = JSON.parse(read("vercel.json"));

  it("keeps the Quran Complex translation link unchanged", () => {
    expect(library).toContain("https://qurancomplex.gov.sa/en/kfgqpc-quran-translate/");
    expect(library.match(/qurancomplex\.gov\.sa[^"']*/g)).toEqual([
      "qurancomplex.gov.sa/en/kfgqpc-quran-translate/",
    ]);
  });

  it("has a screen for every explore card", () => {
    for (const id of EXPLORE_SECTIONS) {
      expect(explore).toContain(`V.${id}=`);
    }
    expect(explore).toContain("library.html");
    expect(home).toContain("explore.html");
    expect(read("public/explore.html")).toContain("demo-integration.js");
  });

  it("keeps Video 1 local and leaves the other slots empty", () => {
    expect(explore).toContain("hajcare-demo-social-v1");
    expect(explore).toContain("not uploaded to HajCare servers");
    expect(explore).toContain("Coming soon");
    expect(explore).not.toMatch(/supabase\.storage|storage\/v1\/object/);
    expect(integration).toContain("Videos 2–6 are empty");
    expect(integration).not.toMatch(/upload\(|supabase/i);
  });

  it("does not describe training or volunteer demo submits as a completed registration", () => {
    expect(integration).toContain("Nothing was saved");
    expect(integration).toContain("This short form was not submitted");
    expect(integration).toContain("/auth?next=/volunteer");
    expect(integration).not.toMatch(/Registered \(demo\)|Registration saved/);
    expect(integration).not.toMatch(/supabase/i);
  });

  it("shows only the six training fields and keeps that form off the main Supabase project", () => {
    const register = explore.slice(explore.indexOf("V.register="), explore.indexOf("V.fees="));
    for (const name of ["cover_number", "name", "phone_number", "language", "state", "embarkation_point"]) {
      expect(register).toContain(`name="${name}"`);
    }
    expect(register.match(/name="/g)).toHaveLength(6);
    expect(register).not.toContain("email");
    expect(register).not.toContain("madhhab");
    expect(register).not.toContain("question");
    expect(register).toContain("pending verification");
    expect(register).not.toContain("maslak");
    expect(register).not.toContain("Registered (demo)");
    expect(read("public/explore.html")).toContain("training-enroll.js");
    const config = read("public/training-config.js");
    expect(config).toContain("https://pwtmrddreqmhyluqbfgi.supabase.co");
    expect(config).not.toContain("begtqcmwruvwposocnsr");
    expect(config).not.toContain("vvbbwlfzpfvgyweeggvw");
    expect(config).not.toContain("sb_publishable_");
    expect(config).not.toContain("service_role");
    expect(read("src/integrations/supabase/client.ts")).toContain("VITE_SUPABASE_URL");
    expect(read("src/integrations/supabase/client.ts")).not.toContain("pwtmrddreqmhyluqbfgi");
  });

  it("serves the demo at / and /explore and keeps the React app for other routes", () => {
    expect(vercel.rewrites[0]).toEqual({ source: "/", destination: "/index.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/explore", destination: "/explore.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/library", destination: "/library.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/auth", destination: "/app.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/volunteer", destination: "/app.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/service-fee", destination: "/app.html" });
    expect(vercel.rewrites.at(-1)).toEqual({ source: "/(.*)", destination: "/index.html" });
    expect(home).toContain("HajCare AI");
    expect(home).not.toContain("HajjCare");
    expect(home).not.toContain("demo-tag");
    expect(read("public/explore.html")).not.toContain("Demo preview");
    expect(read("public/library.html")).not.toContain("Demo preview");
    expect(read("public/library.html")).toContain("https://qurancomplex.gov.sa/en/kfgqpc-quran-translate/");
    expect(home).not.toContain('id="root"');
    expect(read("app.html")).toContain("/src/main.tsx");
    expect(read("app.html")).not.toContain("qovcctfoxgvowedjioil");
    expect(read("app.html")).not.toContain("supabase.co");
  });
});

describe("demo registration bridge", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.lang = "en";
    localStorage.clear();
    window.location.hash = "";
    delete (window as unknown as { __hcDemo?: unknown }).__hcDemo;
    delete (window as unknown as { __hcAfterRender?: unknown }).__hcAfterRender;
  });

  function loadBridge() {
    const code = read("public/demo-integration.js");
    window.eval(code);
  }

  function mount(hash: string, inner: string) {
    window.location.hash = hash;
    document.body.innerHTML = `<main id="main">${inner}</main>`;
    loadBridge();
  }

  it("refuses training submit and does not keep a local registration", () => {
    localStorage.setItem("hc-train", "[]");
    mount(
      "#register",
      `<h1>Training</h1><span class="tag s">Demo</span><form data-store="hc-train"><div class="res"></div><button>Submit</button></form><div id="list">old</div>`
    );
    const form = document.querySelector("form") as HTMLFormElement;
    const event = new Event("submit", { bubbles: true, cancelable: true });
    form.onsubmit?.(event);
    expect(event.defaultPrevented).toBe(true);
    expect(localStorage.getItem("hc-train")).toBeNull();
    expect(document.querySelector(".res")?.textContent).toMatch(/Nothing was saved/);
    expect(document.querySelector("#list")?.textContent).toBe("");
    expect(document.body.innerHTML).not.toMatch(/Registered/);
  });

  it("shows a training receipt only when the server save returns one", async () => {
    mount("#register", `<form data-store="hc-train"><div class="res"></div></form>`);
    (window as unknown as { __hcSubmitTrainingEnrollment?: (form: HTMLFormElement) => Promise<unknown> }).__hcSubmitTrainingEnrollment =
      async () => ({ ok: true, message: "Saved. Receipt abc", receiptId: "abc" });
    document.querySelector("form")?.dispatchEvent(new Event("submit", { cancelable: true }));
    await Promise.resolve();
    expect(document.querySelector(".res")?.textContent).toContain("Receipt abc");

    document.querySelector(".res")!.textContent = "";
    (window as unknown as { __hcSubmitTrainingEnrollment?: (form: HTMLFormElement) => Promise<unknown> }).__hcSubmitTrainingEnrollment =
      async () => ({ ok: true, message: "Saved. Receipt abc" });
    document.querySelector("form")?.dispatchEvent(new Event("submit", { cancelable: true }));
    await Promise.resolve();
    expect(document.querySelector(".res")?.textContent).toBe("Nothing was saved.");
    expect(localStorage.getItem("hc-train")).toBeNull();
  });

  it("sends volunteer registration to the existing signed-in form", () => {
    mount(
      "#volunteer",
      `<h1>Volunteer</h1><span class="tag s">Demo</span><form data-store="hc-vol"><div class="res"></div></form>`
    );
    const form = document.querySelector("form") as HTMLFormElement;
    form.onsubmit?.(new Event("submit", { cancelable: true }));
    const text = document.querySelector(".res")?.innerHTML || "";
    expect(text).toContain("/auth?next=/volunteer");
    expect(text).toContain("/volunteer");
    expect(text).toMatch(/not submitted/i);
    expect(localStorage.getItem("hc-vol")).toBeNull();
  });

  it("points a sample explore card at the related existing page", () => {
    mount("#money", "<h1>Money</h1>");
    const note = document.querySelector("[data-hc-live]");
    expect(note?.textContent).toMatch(/sample guidance/i);
    expect(note?.innerHTML).not.toContain('href="/money"');
  });
});
