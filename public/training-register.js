/* Login-free Hajj training registration.
   Saves only to https://vvbbwlfzpfvgyweeggvw.supabase.co/functions/v1/training-register.
   Refuses the main site, the old training project, and the voice/test project.
   The browser sends the publishable key only. */
(function (root) {
  var ALLOWED = "vvbbwlfzpfvgyweeggvw.supabase.co";
  var ORIGIN = "https://" + ALLOWED;
  var FORBIDDEN = {
    "begtqcmwruvwposocnsr.supabase.co": 1,
    "pwtmrddreqmhyluqbfgi.supabase.co": 1,
    "uorfprlfpqdpjtrcaqrt.supabase.co": 1
  };
  var ENDPOINT = ORIGIN + "/functions/v1/training-register";
  var CARRY = "hc-reg-carry";

  function en() {
    return document.documentElement.lang === "en";
  }

  function say(code, receipt) {
    var hi = !en();
    /* Internal only: free eligibility stays pending because the cover number is not checked against a Haj Committee list. */
    if (code === "saved") {
      return (hi ? "सेव हो गया। रसीद " : "Saved. Receipt ") + receipt + ".";
    }
    var map = {
      not_configured: hi ? "रजिस्ट्रेशन अभी चालू नहीं है। कुछ सेव नहीं हुआ।" : "Registration is not open yet. Nothing was saved.",
      wrong_project: hi ? "कुछ सेव नहीं हुआ। यह फ़ॉर्म गलत सर्वर पर नहीं जाता।" : "Nothing was saved. This form will not use a different server.",
      validation: hi ? "कुछ सेव नहीं हुआ। फ़ॉर्म जाँचें और फिर कोशिश करें।" : "Nothing was saved. Check the form and try again.",
      duplicate: hi ? "कुछ नया सेव नहीं हुआ। इस कवर नंबर और मोबाइल का अनुरोध पहले से दर्ज है।" : "Nothing new was saved. A request for this cover number and mobile is already recorded.",
      rate_limited: hi ? "कुछ सेव नहीं हुआ। कोशिशें ज़्यादा हो गईं। कुछ देर बाद फिर कोशिश करें।" : "Nothing was saved. Too many attempts. Wait and try again.",
      unavailable: hi ? "कुछ सेव नहीं हुआ। सर्वर ने पुष्टि नहीं की।" : "Nothing was saved. The server did not confirm the request."
    };
    return map[code] || map.unavailable;
  }

  function readConfig(cfg) {
    cfg = cfg || root.__HC_TRAINING_REGISTER_CONFIG || {};
    var host = "";
    try { host = new URL(String(cfg.url || "")).host; } catch (e) { host = ""; }
    if (FORBIDDEN[host] || host !== ALLOWED) return { ok: false, code: "wrong_project" };
    var key = String(cfg.publishableKey || "");
    if (!key || /service[-_]?role/i.test(key) || key.indexOf("sb_secret_") === 0) return { ok: false, code: "not_configured" };
    return { ok: true, key: key };
  }

  function value(form, name) {
    var el = form.elements && form.elements[name];
    return el && typeof el.value === "string" ? el.value : "";
  }

  function readCarry() {
    try {
      var data = JSON.parse(sessionStorage.getItem(CARRY) || "null");
      if (!data || typeof data !== "object") return { name: "", phone: "", email: "" };
      return {
        name: typeof data.name === "string" ? data.name : "",
        phone: typeof data.phone === "string" ? data.phone : "",
        email: typeof data.email === "string" ? data.email : ""
      };
    } catch (e) {
      return { name: "", phone: "", email: "" };
    }
  }

  function writeCarry(name, phone, email) {
    try {
      sessionStorage.setItem(CARRY, JSON.stringify({ name: name || "", phone: phone || "", email: email || "" }));
    } catch (e) { /* private mode */ }
  }

  var RECEIPT_RE = /^(?:TR|HC)-[A-Z0-9]{8}$/;

  function prepare(form) {
    if (!form) return;
    /* Block the browser's own submit. A native POST reloads /explore and wipes the receipt while the row is already saved. */
    if (!form.dataset.hcNavLock) {
      form.dataset.hcNavLock = "1";
      form.addEventListener("submit", function (e) {
        if (e.preventDefault) e.preventDefault();
      }, true);
    }
    if (!form.querySelector("[name=company_website]")) {
      var trap = document.createElement("input");
      trap.type = "text";
      trap.name = "company_website";
      trap.tabIndex = -1;
      trap.autocomplete = "off";
      trap.setAttribute("aria-hidden", "true");
      trap.style.position = "absolute";
      trap.style.left = "-9999px";
      form.appendChild(trap);
    }
    var carried = readCarry();
    var name = form.querySelector("[name=name]");
    var phone = form.querySelector("[name=phone_number]");
    if (name && !String(name.value || "").trim() && carried.name) name.value = carried.name;
    if (phone && !String(phone.value || "").trim() && carried.phone) phone.value = carried.phone;
  }

  function fail(code) {
    return { ok: false, message: say(code) };
  }

  async function submit(form) {
    try { localStorage.removeItem("hc-train"); } catch (e) { /* private mode */ }
    var cfg = readConfig();
    if (!cfg.ok) return fail(cfg.code);
    if (value(form, "company_website").trim()) return fail("validation");
    var name = value(form, "name").trim();
    var cover = value(form, "cover_number").trim();
    var phone = value(form, "phone_number").trim();
    var state = value(form, "state").trim();
    var language = value(form, "language").trim();
    var embarkation = value(form, "embarkation_point").trim();
    if (!name || !cover || !phone || !state || !language || !embarkation) return fail("validation");
    var email = readCarry().email.trim();
    var button = form.querySelector("button[type='submit']");
    if (button) button.disabled = true;
    var savedOk = false;
    try {
      var res = await fetch(ENDPOINT, {
        method: "POST",
        redirect: "manual",
        cache: "no-store",
        headers: {
          "content-type": "application/json",
          apikey: cfg.key,
          authorization: "Bearer " + cfg.key
        },
        body: JSON.stringify({
          cover_number: cover,
          name: name,
          phone_number: phone,
          language: language,
          state: state,
          embarkation_point: embarkation,
          email: email,
          company_website: ""
        })
      });
      if (!res || res.type === "opaqueredirect" || (res.status >= 300 && res.status < 400)) return fail("unavailable");
      var data = null;
      try { data = await res.json(); } catch (e) { data = null; }
      if (res.ok && data && data.ok === true && typeof data.receipt_id === "string" && RECEIPT_RE.test(data.receipt_id)) {
        savedOk = true;
        writeCarry(name, phone, email);
        return { ok: true, receiptId: data.receipt_id, message: say("saved", data.receipt_id) };
      }
      var code = data && data.error === "duplicate" ? "duplicate" : data && data.error === "rate_limited" ? "rate_limited" : data && data.error === "validation" ? "validation" : "unavailable";
      return fail(code);
    } catch (e) {
      return fail("unavailable");
    } finally {
      if (button && !savedOk) button.disabled = false;
    }
  }

  root.__hcPrepareTrainingRegistration = prepare;
  root.__hcSubmitTrainingRegistration = submit;
  root.__hcTrainingRegisterReadConfig = readConfig;
})(window);
