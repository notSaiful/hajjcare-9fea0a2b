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

  it("points the Quran card at QuranEnc and keeps the Complex credit and Tanzil link", () => {
    expect(library).toContain('href="https://quranenc.com/en/home"');
    expect(library).toContain(">Official translations ↗</a>");
    expect(library).toContain('href="https://quranenc.com/hi/home"');
    expect(library).toContain(">Hindi translations ↗</a>");
    expect(library).toContain("King Fahd Glorious Quran Printing Complex, Madinah (official translations)");
    expect(library).toContain('href="https://tanzil.net/"');
    expect(library).toContain(">Arabic text at Tanzil ↗</a>");
    expect(library).not.toContain("qurancomplex.gov.sa");
    expect(library.match(/quranenc\.com\/(?:en|hi)\/home/g)).toEqual([
      "quranenc.com/en/home",
      "quranenc.com/hi/home",
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

  it("keeps Hunafa and Umrah videos and drops the removed Hajj video set", () => {
    const removed = ["D_c1sVk-Tq4", "fwK4pwOzrRg", "qD5yWN3W3_8", "ZO6DouzTxUI", "MHDIRJGR77k", "jd9AVwtyp4Y"];
    for (const id of removed) expect(explore).not.toContain(id);
    expect(explore).not.toContain("Physical Preparation for Hajj");
    expect(explore).not.toContain("Mental Preparation For HAJJ");
    expect(explore).not.toContain("Rafiq ul harmain");
    expect(explore).not.toContain("['hajj','Hajj','हज']");
    expect(explore).toContain("['all','All','सब']");
    expect(explore).toContain("['umrah','Umrah','उमराह']");
    expect(explore).toContain("['quran','Quran','क़ुरआन']");
    expect(explore).toContain("['hadith','Hadith','हदीस']");
    expect(explore).toContain("7OwCzdes9gY");
    expect(explore).toContain("Hunafaa");
    expect(explore).toContain("JimvQuzod6I");
    expect(explore).toContain("Hxn32sAZTNI");
  });

  it("lists the four official Haj committee WhatsApp channels", () => {
    const channels = [
      ["Haj Committee of India", "Central", "https://whatsapp.com/channel/0029Vb6fWFfGk1FxTPwpLY26"],
      ["Gujarat State Haj Committee", "Gujarat", "https://whatsapp.com/channel/0029VaA1rkXFHWq8ARVKv82d"],
      ["Uttar Pradesh State Haj Committee", "Uttar Pradesh", "https://whatsapp.com/channel/0029Vb8jyFGLI8YOt4iu7N2Z"],
      ["J&K Haj Committee", "Jammu & Kashmir", "https://whatsapp.com/channel/0029VaFysS6GZNCyooJkJa3E"],
    ];
    const socials = read("src/pages/SocialsPage.tsx");
    expect(explore).toContain("const OFFICIAL_WA=");
    expect(explore).toContain("Official WhatsApp channels");
    expect(socials).toContain("const officialWhatsAppChannels = [");
    expect(socials).toContain("Official WhatsApp channels");
    expect(socials).toContain('target="_blank"');
    expect(socials).toContain('rel="noopener noreferrer"');
    for (const [name, state, url] of channels) {
      expect(explore).toContain(name);
      expect(explore).toContain(state);
      expect(explore).toContain(url);
      expect(explore).toContain('rel="noopener noreferrer"');
      expect(explore.match(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"))).toHaveLength(1);
      expect(socials).toContain(name);
      expect(socials).toContain(state);
      expect(socials).toContain(url);
      expect(socials.match(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"))).toHaveLength(1);
    }
    expect(explore).not.toContain("HAJ COMMITTEE OF INDIA — official updates on WhatsApp");
  });

  it("opens Haj, Umrah, Quran and Hadith on the first tap", () => {
    expect(explore).toContain("V.hajj=");
    expect(explore).toContain("V.umrah=");
    expect(explore).toContain("V.hadith=");
    expect(explore).toContain("V.guides=");
    expect(explore).toContain("V.videos=");
    expect(explore).toContain("if(h==='quran'){location.replace('library.html#quran');return}");
    expect(explore).toContain("['hajj','📖','Hajj','हज']");
    expect(explore).toContain("['umrah','📖','Umrah','उमरा']");
    expect(explore).toContain("['quran','📖','Quran','क़ुरआन']");
    expect(explore).toContain("['hadith','📜','Hadith','हदीस']");
    expect(explore).toContain("i[0]==='quran'?'library.html#quran'");
    expect(home).toContain('href="explore.html#hajj"');
    expect(home).toContain('href="explore.html#umrah"');
    expect(home).toContain('href="library.html#quran"');
    expect(home).toContain('href="explore.html#hadith"');
    expect(home).toContain('href="explore.html#guides"');
    expect(home).toContain('href="explore.html#videos"');
    expect(library).toContain('id="quran"');
    expect(explore).toContain('href="${c[0]===\'quran\'?\'library.html#quran\':\'#\'+c[0]}"');
  });

  it("embeds the Makkah YouTube live on the Hajj and Umrah guides", () => {
    expect(explore).toContain("https://www.youtube-nocookie.com/embed/${id}");
    expect(explore).toContain("gaPehpPcU7Q");
    expect(explore).toContain("BtMUUgApnPs");
    expect(explore).toContain("मदीना लाइव");
    expect(explore).toContain("Madinah Live (YouTube)");
    expect(explore).toContain("V.hajj=()=>`<h1>${t(GTOP[0][0],GTOP[0][1])}</h1>`+MAKKAH_LIVE()");
    expect(explore).toContain("V.umrah=()=>`<h1>${t(GTOP[1][0],GTOP[1][1])}</h1>`+MAKKAH_LIVE()");
    expect(explore).toContain("title=\"${en.replace(' (YouTube)','')}\"");
    expect(explore).toContain('loading="lazy"');
    expect(explore).toContain("allowfullscreen");
    expect(explore).toContain("मक्का लाइव");
    expect(explore).toContain("Makkah Live (YouTube)");
    expect(explore).toContain("https://www.youtube.com/live/gaPehpPcU7Q");
    expect(explore).toContain("https://www.youtube.com/live/BtMUUgApnPs");
    expect(explore).toContain("YouTube पर खोलें");
    expect(explore).not.toContain("autoplay=1");
    expect(explore).toContain("MAKKAH_LIVE()+GUIDE_NOTE()");
    expect(read("public/explore.css")).toContain("aspect-ratio:16/9");
    expect(read("public/sw.js")).not.toContain("caches.");
    expect(read("vercel.json")).not.toContain("Content-Security-Policy");
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
    expect(integration).not.toContain("This short form was not submitted");
    expect(integration).not.toContain("login-free");
    expect(integration).not.toContain("Open the HajCare volunteer form");
    expect(integration).not.toContain("बिना साइन-इन");
    expect(explore).toContain("/volunteer?form=1");
    expect(explore).not.toContain('data-store="hc-vol"');
    expect(explore).not.toContain("This short form is not submitted");
    expect(integration).not.toContain("/auth?next=/volunteer");
    expect(read("public/index.html")).toContain('id="training-registration"');
    expect(read("public/index.html")).toContain('href="/explore#register"');
    expect(read("public/explore.html")).toContain("training-register.js");
    expect(read("src/pages/VolunteerPage.tsx")).toContain('to="/explore#register"');
    expect(read("src/pages/VolunteerPage.tsx")).toContain("Register for training");
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
    expect(register).toContain("<!-- Internal only");
    expect(register).toContain("pending verification");
    expect(register).not.toContain('class="sub"');
    expect(register).not.toContain("maslak");
    expect(register).not.toContain("Registered (demo)");
    expect(read("public/explore.html")).toContain("training-enroll.js");
    const config = read("public/training-config.js");
    expect(config).toContain("https://uorfprlfpqdpjtrcaqrt.supabase.co");
    expect(config).not.toContain("begtqcmwruvwposocnsr");
    expect(config).not.toContain("pwtmrddreqmhyluqbfgi");
    expect(config).not.toContain("vvbbwlfzpfvgyweeggvw");
    expect(config).not.toContain("sb_publishable_");
    expect(config).not.toContain("service_role");
    expect(read("src/integrations/supabase/client.ts")).toContain("VITE_SUPABASE_URL");
    expect(read("src/integrations/supabase/client.ts")).not.toContain("pwtmrddreqmhyluqbfgi");
    expect(read("src/integrations/supabase/client.ts")).not.toContain("uorfprlfpqdpjtrcaqrt");
  });

  it("serves the demo at / and /explore and keeps the React app for other routes", () => {
    expect(vercel.rewrites[0]).toEqual({ source: "/", destination: "/index.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/explore", destination: "/explore.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/library", destination: "/library.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/visitors", destination: "/visitors.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/auth", destination: "/app.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/volunteer/training", destination: "/app.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/volunteer", destination: "/app.html" });
    expect(vercel.rewrites.findIndex((rule) => rule.source === "/volunteer/training")).toBeLessThan(vercel.rewrites.length - 1);
    expect(vercel.rewrites).toContainEqual({ source: "/service-fee", destination: "/app.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/reset-password", destination: "/app.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/privacy-policy", destination: "/privacy-policy.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/privacy", destination: "/privacy-policy.html" });
    expect(vercel.rewrites).toContainEqual({ source: "/account-deletion", destination: "/privacy-policy.html" });
    for (const source of ["/privacy-policy", "/privacy", "/account-deletion", "/reset-password", "/auth", "/explore", "/library", "/volunteer"]) {
      expect(vercel.rewrites.findIndex((rule) => rule.source === source)).toBeLessThan(vercel.rewrites.length - 1);
    }
    expect(vercel.rewrites.at(-1)).toEqual({ source: "/((?!videos/).*)", destination: "/index.html" });
    const policy = read("public/privacy-policy.html");
    expect(policy).toContain("Last updated: 12 Nov 2026");
    expect(policy).toContain("SAZO Management Private Limited");
    expect(policy).toContain("27ABDCS8059C1Z8");
    expect(policy).toContain("info@hajjcare.in");
    expect(policy).toContain('id="account-deletion"');
    expect(policy).toContain("ElevenLabs");
    expect(policy).toContain("Vapi");
    expect(policy).toContain("Razorpay");
    expect(policy).toContain("Supabase");
    expect(policy).toContain("Vercel");
    expect(policy).not.toMatch(/crescent|moon/i);
    expect(read("vite.config.ts")).toContain('nextPath = "/privacy-policy.html"');
    expect(JSON.stringify(vercel.headers)).toContain("video/mp4");
    expect(read("public/index.html")).toContain("/videos/day1-trailer-16x9.mp4");
    expect(read("public/explore.js")).toContain("/videos/day1-trailer-9x16.mp4");
    expect(home).toContain("HajCare AI");
    expect(home).toContain('class="train-bar" href="/classroom"');
    expect(home).toContain("HajCare AI Classroom खोलें");
    expect(home).not.toContain("Healthcare AI Classroom");
    expect(home).not.toContain("HajjCare");
    expect(home).not.toContain("demo-tag");
    expect(read("public/explore.html")).not.toContain("Demo preview");
    expect(read("public/library.html")).not.toContain("Demo preview");
    expect(read("public/library.html")).toContain("https://quranenc.com/en/home");
    expect(read("public/library.html")).toContain("https://quranenc.com/hi/home");
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
    sessionStorage.clear();
    window.location.hash = "";
    delete (window as unknown as { __hcDemo?: unknown }).__hcDemo;
    delete (window as unknown as { __hcAfterRender?: unknown }).__hcAfterRender;
    delete (window as unknown as { __HC_TRAINING_CONFIG?: unknown }).__HC_TRAINING_CONFIG;
    delete (window as unknown as { __hcMountTrainingGate?: unknown }).__hcMountTrainingGate;
    delete (window as unknown as { __hcSubmitTrainingEnrollment?: unknown }).__hcSubmitTrainingEnrollment;
    delete (window as unknown as { __hcSubmitTrainingRegistration?: unknown }).__hcSubmitTrainingRegistration;
    delete (window as unknown as { __hcPrepareTrainingRegistration?: unknown }).__hcPrepareTrainingRegistration;
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
    expect(document.querySelector(".hc-save-thanks")).toBeNull();

    document.querySelector(".res")!.textContent = "";
    (window as unknown as { __hcSubmitTrainingEnrollment?: (form: HTMLFormElement) => Promise<unknown> }).__hcSubmitTrainingEnrollment =
      async () => ({ ok: true, message: "Saved. Receipt abc" });
    document.querySelector("form")?.dispatchEvent(new Event("submit", { cancelable: true }));
    await Promise.resolve();
    expect(document.querySelector(".res")?.textContent).toBe("Nothing was saved.");
    expect(document.querySelector(".hc-save-thanks")).toBeNull();
    expect(localStorage.getItem("hc-train")).toBeNull();
  });

  it("shows the Hindi thanks only after a login-free training save, with the receipt under it", async () => {
    const phrase = "आपका रजिस्ट्रेशन मुकम्मल हुआ। अल्लाह आपका हज मबरूर और कबूल करे।";
    (window as unknown as { __hcSubmitTrainingRegistration?: (form: HTMLFormElement) => Promise<unknown> }).__hcSubmitTrainingRegistration =
      async () => ({ ok: true, message: "Saved. Receipt TR-AB23CD45", receiptId: "TR-AB23CD45" });
    (window as unknown as { __hcPrepareTrainingRegistration?: () => void }).__hcPrepareTrainingRegistration = () => {};
    mount("#register", `<form data-store="hc-train"><div class="res"></div></form>`);
    document.querySelector("form")?.dispatchEvent(new Event("submit", { cancelable: true }));
    await Promise.resolve();
    const text = document.querySelector(".res")?.textContent || "";
    expect(text.indexOf(phrase)).toBeGreaterThanOrEqual(0);
    expect(text.indexOf(phrase)).toBeLessThan(text.indexOf("TR-AB23CD45"));
    expect(document.querySelector(".hc-save-receipt")?.textContent).toBe("TR-AB23CD45");
    expect(document.querySelector(".res")?.textContent).not.toContain("Continue to volunteer registration");
    expect(document.querySelector(".res")?.textContent).not.toContain("वॉलंटियर रजिस्ट्रेशन जारी रखें");
    expect(document.querySelector("[data-hc-live]")?.textContent || "").not.toMatch(/Haj Committee|मुफ़्त दाख़िला|free eligibility/);

    (window as unknown as { __hcSubmitTrainingRegistration?: (form: HTMLFormElement) => Promise<unknown> }).__hcSubmitTrainingRegistration =
      async () => ({ ok: false, message: "Nothing new was saved." });
    document.querySelector("form")?.dispatchEvent(new Event("submit", { cancelable: true }));
    await Promise.resolve();
    expect(document.querySelector(".res")?.textContent).toBe("Nothing new was saved.");
    expect(document.querySelector(".hc-save-thanks")).toBeNull();
  });

  it("sends Explore volunteer straight to the open registration form", () => {
    const explore = read("public/explore.js");
    const home = read("public/index.html");
    expect(explore).toContain("location.replace('/volunteer?form=1')");
    expect(explore).toContain("i[0]==='volunteer'?'/volunteer?form=1'");
    expect(home).toContain('href="/volunteer?form=1"');
    expect(home).not.toContain("explore.html#volunteer");
    expect(read("src/pages/VolunteerPage.tsx")).toContain('form === "1"');
    expect(read("src/pages/VolunteerPage.tsx")).toContain('hash === "#form"');
    const volunteer = explore.slice(explore.indexOf("V.volunteer="), explore.indexOf("V.register="));
    expect(volunteer).toContain('href="/volunteer?form=1"');
    expect(volunteer).not.toContain("hc-vol");
    expect(volunteer).not.toContain("बिना साइन-इन");
    mount("#register", `<form data-store="hc-train"><div class="res"></div></form>`);
    expect(document.querySelector('form[data-store="hc-train"]')).not.toBeNull();
  });

  it("hides the training fields until the registration box is used", () => {
    window.eval(read("public/training-enroll.js"));
    (window as unknown as { __HC_TRAINING_CONFIG?: { url: string; publishableKey: string } }).__HC_TRAINING_CONFIG = {
      url: "https://uorfprlfpqdpjtrcaqrt.supabase.co",
      publishableKey: "sb_publishable_test_only",
    };
    mount(
      "#register",
      `<form data-store="hc-train"><input name="cover_number" value="AB-1234"><div class="res"></div><button type="submit">Submit</button></form>`
    );
    expect(document.querySelector("[data-hc-sign-in]")).toBeNull();
    expect(document.querySelectorAll("[data-hc-create]")).toHaveLength(1);
    expect(document.querySelector("[data-hc-register]")?.hasAttribute("hidden")).toBe(false);
    expect(document.querySelector("[data-hc-enroll]")?.hasAttribute("hidden")).toBe(true);
    expect((document.querySelector("[name=cover_number]") as HTMLInputElement).disabled).toBe(true);
    expect(document.body.textContent).toContain("REGISTER TO JOIN THE 100-DAY TRAINING");
    expect(document.querySelector("[data-hc-create]")?.textContent).toBe("REGISTER");
    expect(document.body.textContent).toContain("NAME");
    expect(document.body.textContent).toContain("PHONE NUMBER");
    expect(document.body.textContent).toContain("EMAIL");
    expect(document.body.textContent).toContain("PASSWORD");
    expect(document.body.textContent).not.toMatch(/Sign in|Create account/);
    expect(document.body.textContent).toContain("SIGN OUT");
    const css = read("public/explore.css");
    expect(css).toContain('form[data-store="hc-train"] label');
    expect(css).toContain("text-transform:uppercase");
    expect(css).toContain('form[data-store="hc-train"] input');
    expect(css).toContain("text-transform:none");
    expect(read("public/demo-integration.js")).toContain("__hcMountTrainingGate");
    expect(read("public/demo-integration.js")).not.toMatch(/supabase/i);
    expect(read("src/integrations/supabase/client.ts")).not.toContain("auth/v1/token");
  });

  it("points a sample explore card at the related existing page", () => {
    mount("#money", "<h1>Money</h1>");
    const note = document.querySelector("[data-hc-live]");
    expect(note?.textContent).toMatch(/sample guidance/i);
    expect(note?.innerHTML).not.toContain('href="/money"');
  });
});
