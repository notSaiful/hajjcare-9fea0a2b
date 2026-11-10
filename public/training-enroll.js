/* Saves 100-day training only to https://uorfprlfpqdpjtrcaqrt.supabase.co.
   Refuses the live auth project, the old training project, and the voice/test project.
   Training sign-in accounts on this project are separate from the main site accounts
   (VITE_SUPABASE_*). Do not send those passwords or tokens to the main site. */
(function (root) {
  var ALLOWED = "uorfprlfpqdpjtrcaqrt.supabase.co";
  var ORIGIN = "https://" + ALLOWED;
  var FORBIDDEN = {
    "begtqcmwruvwposocnsr.supabase.co": 1,
    "pwtmrddreqmhyluqbfgi.supabase.co": 1,
    "vvbbwlfzpfvgyweeggvw.supabase.co": 1
  };
  var ENDPOINT = "https://uorfprlfpqdpjtrcaqrt.supabase.co/functions/v1/training-enroll";
  var SESSION_KEY = "hc-training-session";
  var REFRESH_SKEW = 60;

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
      not_configured: hi ? "रजिस्ट्रेशन अभी चालू नहीं है। कुछ सेव नहीं हुआ।" : "Registration is not open yet. Nothing was saved. रजिस्ट्रेशन अभी चालू नहीं है।",
      wrong_project: hi ? "कुछ सेव नहीं हुआ। यह फ़ॉर्म गलत सर्वर पर नहीं जाता।" : "Nothing was saved. This form will not use a different server.",
      validation: hi ? "कुछ सेव नहीं हुआ। फ़ॉर्म जाँचें और फिर कोशिश करें।" : "Nothing was saved. Check the form and try again.",
      duplicate: hi ? "कुछ नया सेव नहीं हुआ। इस कवर नंबर और मोबाइल का अनुरोध पहले से दर्ज है। मुफ़्त पात्रता अब भी जाँच बाकी है।" : "Nothing new was saved. A request for this cover number and mobile is already recorded. Free eligibility is still pending verification.",
      rate_limited: hi ? "कुछ सेव नहीं हुआ। कोशिशें ज़्यादा हो गईं। कुछ देर बाद फिर कोशिश करें।" : "Nothing was saved. Too many attempts. Wait and try again.",
      unavailable: hi ? "कुछ सेव नहीं हुआ। सर्वर ने पुष्टि नहीं की।" : "Nothing was saved. The server did not confirm the request.",
      sign_in_required: hi ? "रजिस्टर करने के लिए साइन इन करें। कुछ सेव नहीं हुआ।" : "Sign in to register. Nothing was saved.",
      bad_credentials: hi ? "ईमेल या पासवर्ड गलत है। कुछ सेव नहीं हुआ।" : "Wrong email or password. Nothing was saved.",
      confirm_email: hi ? "ईमेल की पुष्टि करें, फिर साइन इन करें। कुछ सेव नहीं हुआ।" : "Confirm your email, then sign in. Nothing was saved.",
      confirm_sent: hi ? "पुष्टि का ईमेल भेज दिया गया है। पुष्टि करें, फिर साइन इन करें। कुछ सेव नहीं हुआ।" : "We sent a confirmation email. Confirm it, then sign in. Nothing was saved.",
      weak_password: hi ? "कम से कम 8 अक्षर लिखें। कुछ सेव नहीं हुआ।" : "Use at least 8 characters. Nothing was saved.",
      bad_email: hi ? "ईमेल जाँचें और फिर कोशिश करें। कुछ सेव नहीं हुआ।" : "Check the email and try again. Nothing was saved."
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
    return { ok: true, key: key, url: ORIGIN };
  }

  function value(form, name) {
    var el = form.elements && form.elements[name];
    return el && typeof el.value === "string" ? el.value : "";
  }

  function readSession() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || typeof data.access_token !== "string" || typeof data.refresh_token !== "string") return null;
      if (!data.access_token || !data.refresh_token) return null;
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Number(data.expires_at) || 0
      };
    } catch (e) {
      return null;
    }
  }

  function writeSession(data) {
    if (!data || typeof data.access_token !== "string" || typeof data.refresh_token !== "string") return false;
    if (!data.access_token || !data.refresh_token) return false;
    var exp = Number(data.expires_at);
    if (!exp && data.expires_in) exp = Math.floor(Date.now() / 1000) + Number(data.expires_in);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: exp || 0
      }));
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* private mode */ }
  }

  function showAuth(form, text) {
    if (!form) return;
    var el = form.querySelector("[data-hc-auth-msg]");
    if (!el) return;
    el.textContent = text || "";
    el.className = text ? "note" : "";
  }

  function setDisabled(section, disabled) {
    if (!section) return;
    var nodes = section.querySelectorAll("input, select, textarea, button");
    for (var i = 0; i < nodes.length; i++) nodes[i].disabled = disabled;
  }

  function applyGate(form) {
    if (!form) return;
    var signin = form.querySelector("[data-hc-signin]");
    var enroll = form.querySelector("[data-hc-enroll]");
    var fields = form.querySelector("[data-hc-auth-fields]");
    if (!signin || !enroll) return;
    var cfg = readConfig();
    if (!cfg.ok) {
      signin.hidden = false;
      if (fields) fields.hidden = true;
      enroll.hidden = true;
      setDisabled(enroll, true);
      showAuth(form, say(cfg.code));
      return;
    }
    if (fields) fields.hidden = false;
    var signedIn = !!readSession();
    signin.hidden = signedIn;
    enroll.hidden = !signedIn;
    setDisabled(enroll, !signedIn);
  }

  function clearPassword(form) {
    if (!form) return;
    var input = form.querySelector("[data-hc-password]");
    if (input) input.value = "";
  }

  function emailOk(raw) {
    var email = String(raw || "").trim();
    if (!email || email.length > 200 || /\s/.test(email)) return "";
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return "";
    return email;
  }

  function authProblem(status, data) {
    var code = String(data && (data.error_code || data.error) || "").toLowerCase();
    var msg = String(data && (data.msg || data.error_description || data.message) || "").toLowerCase();
    var blob = code + " " + msg;
    if (status === 429 || blob.indexOf("rate") !== -1) return "rate_limited";
    if (blob.indexOf("not_confirmed") !== -1 || blob.indexOf("not confirmed") !== -1) return "confirm_email";
    if (blob.indexOf("weak_password") !== -1 || blob.indexOf("weak password") !== -1) return "weak_password";
    if (status === 400 || status === 401 || status === 422 || blob.indexOf("invalid") !== -1 || blob.indexOf("credential") !== -1) return "bad_credentials";
    return "unavailable";
  }

  async function authPost(path, body, key) {
    var res = await fetch(ORIGIN + path, {
      method: "POST",
      redirect: "manual",
      cache: "no-store",
      headers: { "content-type": "application/json", apikey: key },
      body: JSON.stringify(body)
    });
    if (!res || res.type === "opaqueredirect" || (res.status >= 300 && res.status < 400)) {
      return { ok: false, code: "unavailable" };
    }
    var data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    return { ok: true, status: res.status, data: data };
  }

  function sessionFrom(data) {
    if (!data || typeof data !== "object") return false;
    if (writeSession(data)) return true;
    if (data.session && writeSession(data.session)) return true;
    return false;
  }

  async function ensureAccess(cfg) {
    var session = readSession();
    if (!session) return "";
    var now = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at - now > REFRESH_SKEW) return session.access_token;
    var refreshed = await authPost("/auth/v1/token?grant_type=refresh_token", { refresh_token: session.refresh_token }, cfg.key);
    if (!refreshed.ok || !sessionFrom(refreshed.data)) {
      clearSession();
      return "";
    }
    var next = readSession();
    return next ? next.access_token : "";
  }

  function fail(form, code) {
    var message = say(code);
    showAuth(form, message);
    return { ok: false, message: message };
  }

  async function runAuth(mode, email, password, form) {
    var cfg = readConfig();
    if (!cfg.ok) return fail(form, cfg.code);
    var clean = emailOk(email);
    if (!clean) return fail(form, "bad_email");
    if (String(password || "").length < 8) return fail(form, "weak_password");
    var buttons = form ? form.querySelectorAll("[data-hc-sign-in], [data-hc-create]") : [];
    for (var i = 0; i < buttons.length; i++) buttons[i].disabled = true;
    var result;
    try {
      var posted = mode === "up"
        ? await authPost("/auth/v1/signup", { email: clean, password: password }, cfg.key)
        : await authPost("/auth/v1/token?grant_type=password", { email: clean, password: password }, cfg.key);
      if (!posted.ok) result = { ok: false, code: "unavailable" };
      else if (posted.status >= 200 && posted.status < 300 && sessionFrom(posted.data)) result = { ok: true };
      else if (posted.status >= 200 && posted.status < 300) result = { ok: false, code: "confirm_sent" };
      else result = { ok: false, code: authProblem(posted.status, posted.data) };
    } catch (e) {
      result = { ok: false, code: "unavailable" };
    } finally {
      clearPassword(form);
      for (var j = 0; j < buttons.length; j++) buttons[j].disabled = false;
    }
    if (result.ok) {
      showAuth(form, "");
      applyGate(form);
      return { ok: true, message: "" };
    }
    applyGate(form);
    return fail(form, result.code || "unavailable");
  }

  function mount(form) {
    if (!form || form.querySelector("[data-hc-signin]")) return;
    var hi = !en();
    var enroll = document.createElement("div");
    enroll.setAttribute("data-hc-enroll", "1");
    while (form.firstChild) enroll.appendChild(form.firstChild);
    var signOut = document.createElement("div");
    signOut.className = "cta";
    var signOutButton = document.createElement("button");
    signOutButton.type = "button";
    signOutButton.className = "btn o";
    signOutButton.setAttribute("data-hc-sign-out", "1");
    signOutButton.textContent = hi ? "साइन आउट" : "Sign out";
    signOut.appendChild(signOutButton);
    enroll.insertBefore(signOut, enroll.firstChild);
    var signin = document.createElement("div");
    signin.setAttribute("data-hc-signin", "1");
    signin.innerHTML = '<p class="sub"></p><div data-hc-auth-fields>'
      + '<label for="hc-auth-email"></label><input id="hc-auth-email" data-hc-email name="hc_auth_email" type="email" autocomplete="username" inputmode="email" maxlength="200">'
      + '<label for="hc-auth-password"></label><input id="hc-auth-password" data-hc-password name="hc_auth_password" type="password" autocomplete="current-password" maxlength="200">'
      + '<div class="cta"><button type="button" class="btn" data-hc-sign-in></button><button type="button" class="btn o" data-hc-create></button></div>'
      + '</div><div data-hc-auth-msg></div>';
    signin.querySelector(".sub").textContent = hi
      ? "100 दिन की ट्रेनिंग के लिए ईमेल और पासवर्ड से साइन इन करें।"
      : "Sign in with email and password to register for 100-day training.";
    var labels = signin.querySelectorAll("label");
    labels[0].textContent = hi ? "ईमेल" : "Email";
    labels[1].textContent = hi ? "पासवर्ड" : "Password";
    signin.querySelector("[data-hc-sign-in]").textContent = hi ? "साइन इन" : "Sign in";
    signin.querySelector("[data-hc-create]").textContent = hi ? "खाता बनाएँ" : "Create account";
    form.appendChild(enroll);
    form.insertBefore(signin, enroll);
    signin.querySelector("[data-hc-sign-in]").addEventListener("click", function () {
      runAuth("in", signin.querySelector("[data-hc-email]").value, signin.querySelector("[data-hc-password]").value, form);
    });
    signin.querySelector("[data-hc-create]").addEventListener("click", function () {
      var password = signin.querySelector("[data-hc-password]");
      password.setAttribute("autocomplete", "new-password");
      runAuth("up", signin.querySelector("[data-hc-email]").value, password.value, form);
    });
    signOutButton.addEventListener("click", function () {
      clearSession();
      clearPassword(form);
      showAuth(form, "");
      applyGate(form);
    });
    form.addEventListener("submit", function (e) {
      if (signin.hidden) return;
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      runAuth("in", signin.querySelector("[data-hc-email]").value, signin.querySelector("[data-hc-password]").value, form);
    }, true);
    applyGate(form);
  }

  async function submit(form) {
    try { localStorage.removeItem("hc-train"); } catch (e) { /* private mode */ }
    var cfg = readConfig();
    if (!cfg.ok) {
      applyGate(form);
      return fail(form, cfg.code);
    }
    var access = "";
    try {
      access = await ensureAccess(cfg);
    } catch (e) {
      return fail(form, "unavailable");
    }
    if (!access) {
      clearSession();
      applyGate(form);
      return fail(form, "sign_in_required");
    }
    var name = value(form, "name").trim();
    var cover = value(form, "cover_number").trim();
    var phone = value(form, "phone_number").trim();
    var state = value(form, "state").trim();
    var language = value(form, "language").trim();
    var embarkation = value(form, "embarkation_point").trim();
    if (!name || !cover || !phone || !state || !language || !embarkation) return fail(form, "validation");
    var button = form.querySelector("button[type='submit']");
    if (button) button.disabled = true;
    try {
      var res = await fetch(ENDPOINT, {
        method: "POST",
        redirect: "manual",
        cache: "no-store",
        headers: {
          "content-type": "application/json",
          apikey: cfg.key,
          authorization: "Bearer " + access
        },
        body: JSON.stringify({
          cover_number: cover,
          name: name,
          phone_number: phone,
          language: language,
          state: state,
          embarkation_point: embarkation
        })
      });
      if (!res || res.type === "opaqueredirect" || (res.status >= 300 && res.status < 400)) return fail(form, "unavailable");
      if (res.status === 401) {
        clearSession();
        applyGate(form);
        return fail(form, "sign_in_required");
      }
      var data = null;
      try { data = await res.json(); } catch (e) { data = null; }
      if (res.ok && data && data.ok === true && typeof data.receipt_id === "string" && data.receipt_id) {
        return { ok: true, receiptId: data.receipt_id, message: say("saved", data) };
      }
      var code = data && data.error === "duplicate" ? "duplicate" : data && data.error === "rate_limited" ? "rate_limited" : data && data.error === "validation" ? "validation" : data && data.error === "sign_in_required" ? "sign_in_required" : "unavailable";
      if (code === "sign_in_required") {
        clearSession();
        applyGate(form);
      }
      return fail(form, code);
    } catch (e) {
      return fail(form, "unavailable");
    } finally {
      if (form.querySelector("[data-hc-enroll]")) applyGate(form);
      else if (button) button.disabled = false;
    }
  }

  root.__hcSubmitTrainingEnrollment = submit;
  root.__hcTrainingReadConfig = readConfig;
  root.__hcMountTrainingGate = mount;
  root.__hcTrainingSignIn = function (email, password, form) { return runAuth("in", email, password, form || null); };
  root.__hcTrainingSignUp = function (email, password, form) { return runAuth("up", email, password, form || null); };
  root.__hcTrainingSignOut = function (form) {
    clearSession();
    clearPassword(form);
    showAuth(form, "");
    applyGate(form);
  };
})(window);
