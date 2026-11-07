/* Saves 100-day training only to https://pwtmrddreqmhyluqbfgi.supabase.co.
   Refuses the live auth project and the voice/test project. */
(function (root) {
  var ALLOWED = "pwtmrddreqmhyluqbfgi.supabase.co";
  var FORBIDDEN = {
    "begtqcmwruvwposocnsr.supabase.co": 1,
    "vvbbwlfzpfvgyweeggvw.supabase.co": 1
  };
  var ENDPOINT = "https://pwtmrddreqmhyluqbfgi.supabase.co/functions/v1/training-enroll";

  function en() {
    return document.documentElement.lang === "en";
  }

  function say(code, receipt) {
    var hi = !en();
    if (code === "saved") {
      return (hi ? "सेव हो गया। रसीद " : "Saved. Receipt ") + receipt.receipt_id + ". " +
        (hi
          ? "मुफ़्त पात्रता जाँच बाकी है। कवर नंबर हज कमेटी की सूची से नहीं जाँचा गया।"
          : "Free eligibility is pending verification. The cover number was not checked against a Haj Committee list.");
    }
    var map = {
      not_configured: hi ? "कुछ सेव नहीं हुआ। ट्रेनिंग एनरोलमेंट अभी कॉन्फ़िगर नहीं है।" : "Nothing was saved. Training enrollment is not configured on this page.",
      wrong_project: hi ? "कुछ सेव नहीं हुआ। यह फ़ॉर्म गलत सर्वर पर नहीं जाता।" : "Nothing was saved. This form will not use a different server.",
      validation: hi ? "कुछ सेव नहीं हुआ। फ़ॉर्म जाँचें और फिर कोशिश करें।" : "Nothing was saved. Check the form and try again.",
      duplicate: hi ? "कुछ नया सेव नहीं हुआ। इस कवर नंबर और मोबाइल का अनुरोध पहले से दर्ज है। मुफ़्त पात्रता अब भी जाँच बाकी है।" : "Nothing new was saved. A request for this cover number and mobile is already recorded. Free eligibility is still pending verification.",
      rate_limited: hi ? "कुछ सेव नहीं हुआ। कोशिशें ज़्यादा हो गईं। कुछ देर बाद फिर कोशिश करें।" : "Nothing was saved. Too many attempts. Wait and try again.",
      unavailable: hi ? "कुछ सेव नहीं हुआ। सर्वर ने पुष्टि नहीं की।" : "Nothing was saved. The server did not confirm the request."
    };
    return map[code] || map.unavailable;
  }

  function readConfig(cfg) {
    cfg = cfg || root.__HC_TRAINING_CONFIG || {};
    var host = "";
    try { host = new URL(String(cfg.url || "")).host; } catch (e) { host = ""; }
    if (FORBIDDEN[host] || host !== ALLOWED) return { ok: false, code: "wrong_project" };
    var key = String(cfg.publishableKey || "");
    if (!key || /service_role/i.test(key)) return { ok: false, code: "not_configured" };
    return { ok: true, key: key };
  }

  function value(form, name) {
    var el = form.elements && form.elements[name];
    return el && typeof el.value === "string" ? el.value : "";
  }

  async function submit(form) {
    try { localStorage.removeItem("hc-train"); } catch (e) { /* private mode */ }
    var cfg = readConfig();
    if (!cfg.ok) return { ok: false, message: say(cfg.code) };
    var name = value(form, "name").trim();
    var cover = value(form, "cover").trim();
    var mobile = value(form, "mobile").trim();
    var state = value(form, "state").trim();
    var language = value(form, "preferred_language").trim();
    if (!name || !cover || !mobile || !state || !language) {
      return { ok: false, message: say("validation") };
    }
    var button = form.querySelector("button[type='submit'], button");
    if (button) button.disabled = true;
    try {
      var res = await fetch(ENDPOINT, {
        method: "POST",
        redirect: "manual",
        headers: {
          "content-type": "application/json",
          apikey: cfg.key
        },
        body: JSON.stringify({
          name: name,
          cover_number: cover,
          mobile_number: mobile,
          email: value(form, "email").trim(),
          state: state,
          madhhab: value(form, "madhhab").trim(),
          preferred_language: language,
          question_or_consultation: value(form, "question").trim()
        })
      });
      if (!res || res.type === "opaqueredirect" || (res.status >= 300 && res.status < 400)) {
        return { ok: false, message: say("unavailable") };
      }
      var data = null;
      try { data = await res.json(); } catch (e) { data = null; }
      if (res.ok && data && data.ok === true && typeof data.receipt_id === "string" && data.receipt_id) {
        return { ok: true, receiptId: data.receipt_id, message: say("saved", data) };
      }
      var code = data && data.error === "duplicate" ? "duplicate" : data && data.error === "rate_limited" ? "rate_limited" : data && data.error === "validation" ? "validation" : "unavailable";
      return { ok: false, message: say(code) };
    } catch (e) {
      return { ok: false, message: say("unavailable") };
    } finally {
      if (button) button.disabled = false;
    }
  }

  root.__hcSubmitTrainingEnrollment = submit;
  root.__hcTrainingReadConfig = readConfig;
})(window);
