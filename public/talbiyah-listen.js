/* Additive Talbiyah listening. Does not change existing Talbiyah text or the #talbiya element. */
(function () {
  var KEY = "hc-talbiyah-listen";
  var BASE = "assets/talbiyah/";

  function lineIndexAt(lines, ms) {
    var i;
    if (!lines || !lines.length) return 0;
    for (i = 0; i < lines.length; i++) {
      if (ms < lines[i].end_ms_in_full) return i;
    }
    return lines.length - 1;
  }
  window.__hcTalbiyahLineIndexAt = lineIndexAt;

  var opener = document.getElementById("opener");
  var intro = document.getElementById("intro");
  if (!opener && !intro) return;

  var manifest = null;
  var panel = null;
  var items = [];
  var aye = null;
  var status = null;
  var player = new Audio();
  var step = 0;
  var phase = "idle";
  var loop = false;
  var started = false;
  var waiting = false;
  var hold = false;

  function heard() {
    try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function markHeard() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
  }

  function setHold(on) {
    hold = on;
    if (!on) return;
    ["talbiya", "hmean"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && !el.paused) {
        try { el.pause(); } catch (e) {}
      }
    });
  }

  ["talbiya", "hmean"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("play", function () {
      if (hold) {
        try { el.pause(); } catch (e) {}
      }
    });
  });

  function playEl() {
    player.muted = false;
    var result;
    try { result = player.play(); } catch (e) { return; }
    if (result && typeof result.catch === "function") result.catch(function () {});
  }

  function bindEnd(token, fn) {
    function onEnded() {
      player.removeEventListener("ended", onEnded);
      if (token !== step) return;
      fn();
    }
    player.addEventListener("ended", onEnded);
  }

  function sync() {
    if (!panel) return;
    var playing = !!player.src && !player.paused && !player.muted && phase !== "stopped" && phase !== "done" && phase !== "idle";
    panel.querySelectorAll("[data-tl-play]").forEach(function (b) {
      var label = playing ? "Pause" : "Play";
      b.textContent = label;
      b.setAttribute("aria-label", label + " Talbiyah");
    });
    panel.querySelectorAll("[data-tl-loop]").forEach(function (b) {
      b.setAttribute("aria-pressed", loop ? "true" : "false");
    });
  }

  function highlight(i) {
    items.forEach(function (item, n) {
      var on = n === i;
      item.classList.toggle("tl-now", on);
      if (on) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });
    if (status) status.textContent = "Line " + (i + 1) + " of " + items.length;
  }

  function showOptions(i) {
    var opt = items[i] && items[i].querySelector(".tl-opt");
    if (opt) opt.hidden = false;
  }

  function writeAye(text, ms, token) {
    aye.hidden = false;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      aye.textContent = text;
      aye.style.opacity = "1";
      return;
    }
    var t0 = performance.now();
    function frame(now) {
      if (token !== step) return;
      var p = Math.min(1, (now - t0) / ms);
      aye.style.opacity = String(p);
      aye.textContent = text.slice(0, Math.max(1, Math.ceil(text.length * p)));
      if (p < 1) requestAnimationFrame(frame);
      else aye.textContent = text;
    }
    aye.style.opacity = "0";
    requestAnimationFrame(frame);
  }

  function showPanel() {
    if (!panel) return;
    panel.hidden = false;
    dock();
  }

  function dock() {
    if (!panel) return;
    if (document.body.classList.contains("entered")) {
      var main = document.querySelector("main");
      if (main && panel.parentElement !== main) main.insertBefore(panel, main.firstChild);
      return;
    }
    if (panel.parentElement !== document.body) document.body.appendChild(panel);
  }

  function startFull() {
    if (!manifest) return;
    var token = ++step;
    phase = "full";
    setHold(true);
    showPanel();
    highlight(0);
    showOptions(0);
    player.src = BASE + manifest.door_open_arabic_female.file;
    bindEnd(token, startMale);
    playEl();
    sync();
  }

  function startMale() {
    if (!manifest) return;
    var token = ++step;
    phase = "male";
    var text = manifest.male_line.text_on_screen;
    var ms = manifest.male_line.duration_ms || 1900;
    writeAye(text, ms, token);
    player.src = BASE + manifest.male_line.file;
    bindEnd(token, function () {
      aye.textContent = text;
      aye.style.opacity = "1";
      playLine(0, true);
    });
    playEl();
    sync();
  }

  function playLine(i, advance) {
    var lines = manifest.lines;
    if (i >= lines.length) {
      if (loop) {
        playLine(0, true);
        return;
      }
      try { player.pause(); } catch (e) {}
      phase = "done";
      setHold(false);
      sync();
      return;
    }
    var token = ++step;
    phase = "line";
    highlight(i);
    showOptions(i);
    setHold(true);
    player.src = BASE + lines[i].file;
    bindEnd(token, function () {
      if (advance) playLine(i + 1, true);
      else {
        try { player.pause(); } catch (e) {}
        phase = "done";
        setHold(false);
        sync();
      }
    });
    playEl();
    sync();
  }

  function togglePlay() {
    if (!manifest) return;
    if (phase === "idle" || phase === "stopped" || phase === "done" || !player.src) {
      startFull();
      return;
    }
    if (player.paused || player.muted) playEl();
    else {
      try { player.pause(); } catch (e) {}
    }
    sync();
  }

  function stopAll() {
    step++;
    phase = "stopped";
    try { player.pause(); } catch (e) {}
    try { player.currentTime = 0; } catch (e) {}
    player.muted = true;
    setHold(false);
    sync();
  }

  function button(label, attrs) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    if (attrs) Object.keys(attrs).forEach(function (k) { b.setAttribute(k, attrs[k]); });
    b.addEventListener("click", function (e) { e.stopPropagation(); });
    return b;
  }

  function build() {
    panel = document.createElement("section");
    panel.id = "talbiyah-listen";
    panel.hidden = true;
    panel.setAttribute("aria-label", "Talbiyah listening");

    aye = document.createElement("p");
    aye.className = "tl-aye";
    aye.lang = "en";
    aye.hidden = true;
    aye.setAttribute("aria-live", "polite");

    status = document.createElement("p");
    status.className = "tl-count";
    status.setAttribute("aria-live", "polite");

    var list = document.createElement("ol");
    list.className = "tl-lines";
    manifest.lines.forEach(function (line, i) {
      var item = document.createElement("li");
      var ar = document.createElement("p");
      ar.className = "tl-ar";
      ar.lang = "ar";
      ar.dir = "rtl";
      ar.textContent = line.arabic;
      var tr = document.createElement("p");
      tr.className = "tl-tr";
      tr.lang = "en";
      tr.textContent = line.transliteration;
      var opt = document.createElement("div");
      opt.className = "tl-opt";
      opt.hidden = true;
      var hi = document.createElement("p");
      hi.className = "tl-hi";
      hi.lang = "hi";
      hi.textContent = line.hindi_meaning;
      var en = document.createElement("p");
      en.className = "tl-en";
      en.lang = "en";
      en.textContent = line.english_meaning;
      var row = document.createElement("div");
      row.className = "tl-controls";
      var repeat = button("Repeat", { "aria-label": "Repeat line " + (i + 1) });
      repeat.addEventListener("click", function () { playLine(i, false); });
      var loopBtn = button("Loop", { "aria-label": "Loop Talbiyah", "aria-pressed": "false", "data-tl-loop": "1" });
      loopBtn.addEventListener("click", function () {
        loop = !loop;
        sync();
      });
      var playBtn = button("Play", { "aria-label": "Play Talbiyah", "data-tl-play": "1" });
      playBtn.addEventListener("click", togglePlay);
      row.append(repeat, loopBtn, playBtn);
      opt.append(hi, en, row);
      item.append(ar, tr, opt);
      list.appendChild(item);
      items.push(item);
    });

    var global = document.createElement("div");
    global.className = "tl-controls";
    var gPlay = button("Play", { "aria-label": "Play Talbiyah", "data-tl-play": "1" });
    gPlay.addEventListener("click", togglePlay);
    var gLoop = button("Loop", { "aria-label": "Loop Talbiyah", "aria-pressed": "false", "data-tl-loop": "1" });
    gLoop.addEventListener("click", function () {
      loop = !loop;
      sync();
    });
    var stop = button("Stop", { "aria-label": "Stop Talbiyah" });
    stop.addEventListener("click", stopAll);
    global.append(gPlay, gLoop, stop);

    var oldBtn = button("Old Talbiyah text", { "aria-expanded": "false", "aria-controls": "tl-old" });
    oldBtn.className = "tl-old-btn";
    var oldBox = document.createElement("div");
    oldBox.id = "tl-old";
    oldBox.hidden = true;
    oldBtn.addEventListener("click", function () {
      var open = oldBox.hidden;
      if (open) fillOld(oldBox);
      oldBox.hidden = !open;
      oldBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    panel.append(aye, status, list, global, oldBtn, oldBox);
    dock();
    player.addEventListener("timeupdate", function () {
      if (phase !== "full" || !manifest) return;
      var i = lineIndexAt(manifest.lines, player.currentTime * 1000);
      highlight(i);
      showOptions(i);
    });
    player.addEventListener("play", sync);
    player.addEventListener("pause", sync);
    player.addEventListener("error", function () {});
    window.__hcTalbiyahReady = true;
    if (waiting) openAndMaybePlay();
  }

  function fillOld(box) {
    box.replaceChildren();
    var sec = document.querySelector("section.talbiya");
    if (!sec) return;
    [".eyebrow", ".ar", ".tr", ".mean", ".jigar"].forEach(function (sel) {
      var src = sec.querySelector(sel);
      if (!src) return;
      var p = document.createElement("p");
      p.className = "tl-kept";
      if (src.classList.contains("ar")) {
        p.lang = "ar";
        p.dir = "rtl";
      }
      p.textContent = src.textContent;
      box.appendChild(p);
    });
  }

  function openAndMaybePlay() {
    showPanel();
    if (heard()) return;
    markHeard();
    startFull();
  }

  function onGesture() {
    if (started) return;
    started = true;
    if (!manifest) {
      waiting = true;
      return;
    }
    openAndMaybePlay();
  }

  if (opener) {
    opener.addEventListener("click", onGesture, true);
    opener.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      onGesture();
    }, true);
    new MutationObserver(function () {
      if (opener.classList.contains("dopen") || (intro && intro.classList.contains("opened"))) onGesture();
    }).observe(opener, { attributes: true, attributeFilter: ["class"] });
  }
  if (intro) {
    new MutationObserver(function () {
      if (intro.classList.contains("opened")) onGesture();
      if (panel && !panel.hidden) dock();
    }).observe(intro, { attributes: true, attributeFilter: ["class"] });
  }
  new MutationObserver(function () {
    if (panel && !panel.hidden) dock();
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  fetch(BASE + "manifest.json")
    .then(function (r) { if (!r.ok) throw new Error("manifest"); return r.json(); })
    .then(function (data) {
      manifest = data;
      build();
    })
    .catch(function () {});
})();
