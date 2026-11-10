/* Line-by-line Talbiyah text. Does not set, swap, or play audio. */
(function () {
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
  panel.setAttribute("aria-label", "Talbiyah, line by line");

  var list = document.createElement("ol");
  list.className = "tl-lines";
  LINES.forEach(function (line, i) {
    var item = document.createElement("li");
    item.hidden = true;
    item.dataset.tl = String(i);
    var ar = document.createElement("p");
    ar.className = "tl-ar";
    ar.lang = "ar";
    ar.dir = "rtl";
    ar.textContent = line.ar;
    var tr = document.createElement("p");
    tr.className = "tl-tr";
    tr.lang = "en";
    tr.textContent = line.tr;
    var hi = document.createElement("p");
    hi.className = "tl-hi";
    hi.lang = "hi";
    hi.textContent = line.hi;
    var en = document.createElement("p");
    en.className = "tl-en";
    en.lang = "en";
    en.textContent = line.en;
    item.append(ar, tr, hi, en);
    list.appendChild(item);
  });

  var live = document.createElement("p");
  live.className = "tl-count";
  live.setAttribute("aria-live", "polite");

  var prev = document.createElement("button");
  prev.type = "button";
  prev.className = "tl-nav";
  prev.append(label("hi", "पिछली"), document.createTextNode(" "), label("en", "Previous"));
  var next = document.createElement("button");
  next.type = "button";
  next.className = "tl-nav";
  next.append(label("hi", "अगली"), document.createTextNode(" "), label("en", "Next"));

  var oldBtn = document.createElement("button");
  oldBtn.type = "button";
  oldBtn.className = "tl-old-btn";
  oldBtn.setAttribute("aria-expanded", "false");
  oldBtn.setAttribute("aria-controls", "tl-old");
  oldBtn.append(label("en", "Old Talbiyah text"), document.createTextNode(" "), label("hi", "पुराना तलबिया पाठ"));

  var oldBox = document.createElement("div");
  oldBox.id = "tl-old";
  oldBox.hidden = true;

  var nav = document.createElement("div");
  nav.className = "tl-navs";
  nav.append(prev, next);
  panel.append(list, live, nav, oldBtn, oldBox);

  var shown = 0;
  var follow = true;
  var playStart = null;

  function label(lang, text) {
    var s = document.createElement("span");
    s.lang = lang;
    s.textContent = text;
    return s;
  }

  function reveal(index) {
    if (index < 0) index = 0;
    if (index > LINES.length - 1) index = LINES.length - 1;
    shown = index;
    list.querySelectorAll("li").forEach(function (item, i) {
      item.hidden = i > index;
      item.classList.toggle("tl-now", i === index);
    });
    live.textContent = index + 1 + " / " + LINES.length;
    prev.disabled = index === 0;
    next.disabled = index === LINES.length - 1;
  }

  function openPanel() {
    if (!doorOpen()) return;
    panel.hidden = false;
    dock();
  }

  function doorOpen() {
    return (opener && opener.classList.contains("dopen")) || (intro && intro.classList.contains("opened"));
  }

  function dock() {
    if (document.body.classList.contains("entered")) {
      var main = document.querySelector("main");
      if (main && panel.parentElement !== main) main.insertBefore(panel, main.firstChild);
      return;
    }
    if (panel.parentElement !== document.body) document.body.appendChild(panel);
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

  function fillOld() {
    oldBox.replaceChildren();
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
      oldBox.appendChild(p);
    });
  }

  prev.addEventListener("click", function (e) {
    e.stopPropagation();
    follow = false;
    reveal(shown - 1);
  });
  next.addEventListener("click", function (e) {
    e.stopPropagation();
    follow = false;
    reveal(shown + 1);
  });
  oldBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    var open = oldBox.hidden;
    if (open) fillOld();
    oldBox.hidden = !open;
    oldBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  if (audio) {
    audio.addEventListener("playing", function () {
      noteStart();
      openPanel();
      clockLine();
    });
    audio.addEventListener("timeupdate", clockLine);
    audio.addEventListener("loadedmetadata", noteStart);
    audio.addEventListener("ended", function () {
      if (follow) reveal(LINES.length - 1);
    });
    audio.addEventListener("error", function () {
      follow = false;
      openPanel();
    });
  }

  var watch = new MutationObserver(function () {
    if (doorOpen()) openPanel();
    if (!panel.hidden) dock();
  });
  if (opener) watch.observe(opener, { attributes: true, attributeFilter: ["class"] });
  if (intro) watch.observe(intro, { attributes: true, attributeFilter: ["class"] });
  watch.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  reveal(0);
  if (doorOpen()) openPanel();
  else dock();
})();
