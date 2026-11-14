/* Live HajCare features on hajjcare-live (vvbbwlfzpfvgyweeggvw).
   Zoya uses ai-orchestrator (public). hajj-chat needs a user of that project,
   and site sign-in is a different project. Circulars are read from hajj_circulars.
   Voice calls the live voice functions. Service fees are the /service-fee page. */
(function (root) {
  var LIVE = "https://vvbbwlfzpfvgyweeggvw.supabase.co";
  var history = [];

  function cfg() {
    var c = root.__HC_TRAINING_REGISTER_CONFIG || {};
    var url = String(c.url || "");
    var key = String(c.publishableKey || "");
    if (url.indexOf("vvbbwlfzpfvgyweeggvw.supabase.co") !== 0 && url.indexOf("https://vvbbwlfzpfvgyweeggvw.supabase.co") !== 0) {
      return null;
    }
    if (!key || /service[-_]?role/i.test(key) || key.indexOf("sb_secret_") === 0) return null;
    return { key: key };
  }

  function headers(c) {
    return {
      "content-type": "application/json",
      apikey: c.key,
      authorization: "Bearer " + c.key
    };
  }

  function lang() {
    var code = (document.documentElement.lang || "hi").slice(0, 2);
    return code === "en" ? "en" : "hi";
  }

  function parseStream(text) {
    var out = "";
    var lines = String(text || "").split("\n");
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.indexOf("data:") !== 0) continue;
      var json = line.slice(5).trim();
      if (!json || json === "[DONE]") continue;
      try {
        var parsed = JSON.parse(json);
        var choice = parsed.choices && parsed.choices[0];
        var delta = choice && choice.delta && choice.delta.content;
        var message = choice && choice.message && choice.message.content;
        if (delta) out += delta;
        if (message) out += message;
      } catch (e) { /* keep partial */ }
    }
    return out.trim();
  }

  function askZoya(message) {
    var c = cfg();
    if (!c) return Promise.reject(new Error("Zoya is not configured on this build."));
    return fetch(LIVE + "/functions/v1/ai-orchestrator", {
      method: "POST",
      headers: headers(c),
      body: JSON.stringify({ message: message, messages: history.slice(-8), language: lang() })
    }).then(function (res) {
      return res.text().then(function (text) {
        if (!res.ok) {
          var err = "Zoya could not answer (" + res.status + ").";
          try {
            var body = JSON.parse(text);
            if (body && body.error) err = String(body.error);
          } catch (e) { /* plain */ }
          throw new Error(err);
        }
        var answer = parseStream(text);
        if (!answer) throw new Error("Zoya returned an empty answer.");
        history.push({ role: "user", content: message });
        history.push({ role: "assistant", content: answer });
        return answer;
      });
    });
  }

  function addBubble(box, cls, text) {
    var el = document.createElement("div");
    el.className = cls;
    el.textContent = text;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
    return el;
  }

  function bindHome() {
    var form = document.getElementById("zin");
    var input = document.getElementById("zq");
    var chat = document.getElementById("chat");
    var ov = document.getElementById("demo");
    if (!form || !chat || form.dataset.hcLive === "1") return;
    form.dataset.hcLive = "1";
    var priv = ov && ov.querySelector(".zpriv");
    if (priv) priv.textContent = lang() === "en"
      ? "Your question is sent to HajCare AI. The answer is help, not a fatwa."
      : "आपका सवाल HajCare AI को भेजा जाता है। जवाब मदद के लिए है, फ़तवा नहीं।";
    if (ov && !ov.querySelector(".hc-back")) {
      var back = document.createElement("button");
      back.type = "button";
      back.className = "hc-back";
      back.textContent = "‹ वापस";
      back.addEventListener("click", function () {
        var close = ov.querySelector(".dx");
        if (close) close.click();
      });
      var box = ov.querySelector(".dbox");
      if (box) box.insertBefore(back, box.firstChild);
    }
    function send(text) {
      text = String(text || "").trim();
      if (!text) return;
      addBubble(chat, "msg u", text);
      var pending = addBubble(chat, "msg z", lang() === "en" ? "Zoya is answering…" : "ज़ोया जवाब लिख रही है…");
      askZoya(text).then(function (answer) {
        pending.textContent = answer;
      }).catch(function (err) {
        pending.textContent = err && err.message ? err.message : "Zoya could not answer.";
      });
    }
    form.onsubmit = function (e) {
      if (e && e.preventDefault) e.preventDefault();
      send(input && input.value);
      if (input) input.value = "";
      return false;
    };
    if (ov) {
      ov.querySelectorAll("[data-a]").forEach(function (button) {
        button.onclick = function () { send(button.textContent || ""); };
      });
    }
    var say = ov && ov.querySelector(".say");
    if (say) {
      say.onclick = function () {
        var arabic = ov.querySelector(".arb");
        var line = arabic ? arabic.textContent : "";
        speakLive(line, ov.querySelector(".trl"));
      };
    }
  }

  function speakLive(line, statusEl) {
    var c = cfg();
    if (!line || line === "—") return;
    if (!c) {
      if (statusEl) statusEl.textContent = "Voice service is not configured on this build.";
      return;
    }
    if (statusEl) statusEl.textContent = lang() === "en" ? "Calling the voice service…" : "वॉइस सेवा को बुलाया जा रहा है…";
    var body = JSON.stringify({ text: line, language: "ar" });
    var h = headers(c);
    function tryFn(name) {
      return fetch(LIVE + "/functions/v1/" + name, { method: "POST", headers: h, body: body }).then(function (res) {
        return res.text().then(function (text) { return { name: name, status: res.status, ok: res.ok, text: text }; });
      });
    }
    tryFn("vapi-config").then(function () { return tryFn("rumik-tts"); }).then(function (rumik) {
      if (rumik.ok) return rumik;
      return tryFn("elevenlabs-tts").then(function (eleven) { return eleven.ok ? eleven : rumik; });
    }).then(function (result) {
      var audio = "";
      try {
        var data = JSON.parse(result.text || "{}");
        audio = data.audioContent || data.audio || "";
      } catch (e) { audio = ""; }
      if (result.ok && audio) {
        var player = new Audio("data:audio/mpeg;base64," + audio);
        player.play().catch(function () {});
        if (statusEl) statusEl.textContent = lang() === "en" ? "Live voice" : "लाइव आवाज़";
        return;
      }
      if (statusEl) {
        statusEl.textContent = lang() === "en"
          ? "The live voice functions answered " + result.status + ". A signed-in voice account is required before audio can play."
          : "लाइव वॉइस फ़ंक्शन ने " + result.status + " दिया। आवाज़ चलाने के लिए उसी सर्वर पर साइन-इन चाहिए।";
      }
    }).catch(function () {
      if (statusEl) statusEl.textContent = lang() === "en" ? "The voice service could not be reached." : "वॉइस सेवा तक पहुँच नहीं हुई।";
    });
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }

  function loadCirculars() {
    var box = document.getElementById("hc-circulars");
    if (!box || box.dataset.hcLoaded === "1") return;
    box.dataset.hcLoaded = "1";
    var c = cfg();
    if (!c) {
      box.textContent = lang() === "en" ? "Circulars are not configured on this build." : "इस बिल्ड पर सर्कुलर सेट नहीं हैं।";
      return;
    }
    var url = LIVE + "/rest/v1/hajj_circulars?select=id,title,title_hi,summary_en,summary_hi,source,source_url,circular_date,is_published&is_published=eq.true&order=created_at.desc&limit=20";
    fetch(url, { headers: { apikey: c.key, authorization: "Bearer " + c.key } }).then(function (res) {
      return res.json().then(function (data) { return { ok: res.ok, data: data }; });
    }).then(function (result) {
      var rows = result.ok && Array.isArray(result.data) ? result.data : null;
      if (!rows) {
        box.textContent = lang() === "en" ? "Circulars could not be loaded." : "सर्कुलर लोड नहीं हो सके।";
        return;
      }
      if (!rows.length) {
        box.textContent = lang() === "en" ? "No circulars published yet." : "अभी कोई सर्कुलर प्रकाशित नहीं है।";
        return;
      }
      var hi = lang() !== "en";
      box.className = "";
      box.innerHTML = rows.map(function (row) {
        var title = hi && row.title_hi ? row.title_hi : row.title;
        var summary = hi && row.summary_hi ? row.summary_hi : (row.summary_en || "");
        var link = row.source_url ? "<p><a class=\"btn o\" target=\"_blank\" rel=\"noopener\" href=\"" + esc(row.source_url) + "\">" + esc(row.source || "Source") + "</a></p>" : "";
        return "<div class=\"card\"><span class=\"tag\">" + esc(row.source || "") + "</span><h3>" + esc(title) + "</h3><p>" + esc(summary) + "</p>" + link + "</div>";
      }).join("");
    }).catch(function () {
      box.textContent = lang() === "en" ? "Circulars could not be loaded." : "सर्कुलर लोड नहीं हो सके।";
    });
  }

  function bindExplore() {
    var prev = root.__hcAfterRender;
    if (root.__hcLiveBound) return;
    root.__hcLiveBound = true;
    root.__hcAfterRender = function (l) {
      if (typeof prev === "function") prev(l);
      loadCirculars();
      var form = document.getElementById("zqq");
      if (form && form.form) form.form.dataset.hcLive = "1";
    };
    root.zReply = function (q) {
      var box = document.getElementById("zbox");
      if (!box || !String(q || "").trim()) return;
      var user = document.createElement("div");
      user.className = "zm u";
      user.textContent = q;
      var pending = document.createElement("div");
      pending.className = "zm z";
      pending.textContent = lang() === "en" ? "Zoya is answering…" : "ज़ोया जवाब लिख रही है…";
      box.appendChild(user);
      box.appendChild(pending);
      box.scrollTop = box.scrollHeight;
      askZoya(q).then(function (answer) {
        pending.textContent = answer;
      }).catch(function (err) {
        pending.textContent = err && err.message ? err.message : "Zoya could not answer.";
      });
    };
  }

  function boot() {
    bindHome();
    if (document.getElementById("main") || document.getElementById("bk")) bindExplore();
    loadCirculars();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  root.__hcAskZoya = askZoya;
})(window);
