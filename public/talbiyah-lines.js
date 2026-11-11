/* Line-by-line Talbiyah text. Does not set, swap, or play audio. */
(function () {
  try {
    /* A saved skip only avoids autoplay. It must not hide the Skip button. */
    if (localStorage.getItem("hc-skip-talbiya") === "1") window.__talbiyaDone = true;
  } catch (e) {}
  /* Verbatim splits of the existing wording.
     Arabic, transliteration, and English: DuaGuidePage Talbiyah, broken on ، / , / .
     Hindi: homepage section.talbiya p.mean, broken on । and then the comma before the last clause. */
  var LINES = [
    {
      ar: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ،",
      tr: "Labbayk Allahumma labbayk,",
      hi: "हाज़िर हूँ, ऐ अल्लाह, मैं हाज़िर हूँ।",
      en: "Here I am, O Allah, here I am.",
    },
    {
      ar: "لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ،",
      tr: "labbayka la sharika laka labbayk,",
      hi: "हाज़िर हूँ, तेरा कोई शरीक नहीं, मैं हाज़िर हूँ।",
      en: "Here I am, You have no partner, here I am.",
    },
    {
      ar: "إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ،",
      tr: "innal-hamda wan-ni'mata laka wal-mulk,",
      hi: "बेशक सारी तारीफ़, सारी नेमतें और सारी बादशाहत तेरी ही है,",
      en: "Verily all praise and blessings are Yours, and all sovereignty.",
    },
    {
      ar: "لَا شَرِيكَ لَكَ",
      tr: "la sharika lak",
      hi: "तेरा कोई शरीक नहीं।",
      en: "You have no partner.",
    },
  ];

  function lineFromProgress(progress) {
    if (!(progress >= 0)) return 0;
    var i = Math.floor(Math.min(0.999999, progress) * LINES.length);
    if (i < 0) return 0;
    if (i > LINES.length - 1) return LINES.length - 1;
    return i;
  }

  function lineFromClock(duration, current, start) {
    if (!isFinite(duration) || !(duration > 0) || !isFinite(current)) return null;
    var from = isFinite(start) ? start : 0;
    var span = duration - from;
    if (!(span > 0)) return LINES.length - 1;
    return lineFromProgress((current - from) / span);
  }

  window.__hcTalbiyahLines = LINES;
  window.__hcTalbiyahLineFromProgress = lineFromProgress;
  window.__hcTalbiyahLineFromClock = lineFromClock;

  var opener = document.getElementById("opener");
  var intro = document.getElementById("intro");
  var audio = document.getElementById("talbiya");
  if (!opener && !intro) return;

  var panel = document.createElement("section");
  panel.id = "talbiyah-lines";
  panel.hidden = true;
  panel.setAttribute("aria-label", "मैं हाज़िर हूँ");

  var shortLine = document.createElement("p");
  shortLine.className = "tl-short";
  shortLine.lang = "hi";
  shortLine.setAttribute("data-hc-protect", "1");
  shortLine.textContent = "मैं हाज़िर हूँ";
  panel.append(shortLine);
  document.body.appendChild(panel);

  var shown = 0;
  var follow = true;
  var playStart = null;

  function label(lang, text) {
    var s = document.createElement("span");
    s.lang = lang;
    s.textContent = text;
    return s;
  }

  function reveal() {}

  var closed = false;
  var advanceBtn = document.createElement("button");
  advanceBtn.type = "button";
  advanceBtn.id = "talbiyah-next";
  advanceBtn.hidden = true;
  advanceBtn.append(label("en", "Next"), document.createTextNode(" / "), label("hi", "अगला"));
  document.body.appendChild(advanceBtn);
  advanceBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    advanceBtn.remove();
    var enter = document.getElementById("enter");
    if (enter) enter.click();
  });

  function movedOn() {
    return document.body.classList.contains("entered") || (intro && intro.classList.contains("gone"));
  }

  function finishPanel(offerNext) {
    if (closed) return;
    closed = true;
    panel.hidden = true;
    if (offerNext && !movedOn()) {
      advanceBtn.hidden = false;
      if (!advanceBtn.isConnected) document.body.appendChild(advanceBtn);
    }
  }

  function openPanel() {
    if (closed || !doorOpen()) return;
    panel.hidden = false;
    if (panel.parentElement !== document.body) document.body.appendChild(panel);
  }

  function doorOpen() {
    return (opener && opener.classList.contains("dopen")) || (intro && intro.classList.contains("opened"));
  }

  function clockLine() {
    if (!audio || !follow) return;
    var line = lineFromClock(audio.duration, audio.currentTime, playStart == null ? 0 : playStart);
    if (line == null) return;
    reveal(line);
  }

  function noteStart() {
    if (!audio || !isFinite(audio.duration) || !(audio.duration > 0)) return;
    if (playStart == null) playStart = audio.currentTime;
  }

  var hmean = document.getElementById("hmean");
  if (audio) {
    audio.addEventListener("playing", function () {
      if (closed) return;
      noteStart();
      openPanel();
      clockLine();
    });
    audio.addEventListener("timeupdate", function () {
      if (closed) return;
      clockLine();
    });
    audio.addEventListener("loadedmetadata", noteStart);
    audio.addEventListener("ended", function () {
      if (follow) reveal(LINES.length - 1);
      if (!hmean) finishPanel(true);
    });
    audio.addEventListener("error", function () {
      follow = false;
      finishPanel(true);
    });
  }
  if (hmean) {
    hmean.addEventListener("ended", function () { finishPanel(true); });
    hmean.addEventListener("error", function () { finishPanel(true); });
  }
  var skipBtn = document.createElement("button");
  skipBtn.type = "button";
  skipBtn.id = "talbiyah-skip";
  skipBtn.append(label("en", "Skip"), document.createTextNode(" / "), label("hi", "छोड़ें"));
  document.body.appendChild(skipBtn);
  function stopClips() {
    window.__talbiyaDone = true;
    [audio, hmean].forEach(function (el) {
      if (!el) return;
      try { el.pause(); } catch (err) {}
    });
  }
  function sectionShowing() {
    if (document.body.classList.contains("entered")) return false;
    if (intro && intro.classList.contains("gone")) return false;
    return true;
  }
  function hideCaptions() {
    var root = intro || document;
    root.querySelectorAll(".hcap").forEach(function (c) {
      c.textContent = "";
      c.classList.remove("on");
    });
    root.querySelectorAll(".hph.on").forEach(function (s) { s.classList.remove("on"); });
  }
  function syncSkip() {
    var show = sectionShowing();
    skipBtn.hidden = !show;
    if (show && !skipBtn.isConnected) document.body.appendChild(skipBtn);
  }
  skipBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    e.preventDefault();
    try { localStorage.setItem("hc-skip-talbiya", "1"); } catch (err) {}
    stopClips();
    if (advanceBtn.isConnected) advanceBtn.remove();
    finishPanel(false);
    hideCaptions();
    var go = document.getElementById("enter");
    if (go) go.click();
    syncSkip();
  });

  var enter = document.getElementById("enter");
  if (enter) enter.addEventListener("click", function () {
    if (advanceBtn.isConnected) advanceBtn.remove();
    hideCaptions();
    finishPanel(false);
    syncSkip();
  });

  var watch = new MutationObserver(function () {
    syncSkip();
    if (!sectionShowing()) {
      if (advanceBtn.isConnected) advanceBtn.remove();
      finishPanel(false);
      return;
    }
    if (intro && intro.classList.contains("tdone")) {
      finishPanel(true);
      return;
    }
    if (closed) return;
    if (doorOpen()) openPanel();
  });
  if (opener) watch.observe(opener, { attributes: true, attributeFilter: ["class"] });
  if (intro) watch.observe(intro, { attributes: true, attributeFilter: ["class"] });
  watch.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  reveal(0);
  syncSkip();
  if (doorOpen()) openPanel();
})();
