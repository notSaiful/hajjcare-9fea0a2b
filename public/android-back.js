/* Android hardware back for the Capacitor shell (in.hajjcare.app).
   This repo has no native project. The listener runs only when the
   WebView injects window.Capacitor. Registering it replaces Capacitor's
   default (go back, or exit when WebView history is empty), so this
   handler does both: history.back() when it can, otherwise the home
   menu, and exit only after a confirm on the public home screen.
   A new Play Store build is required if the installed app does not
   already include @capacitor/app. A shell that loads hajjcare.in
   remotely picks this file up when the website is deployed. */
(function () {
  function pathName() {
    var p = location.pathname || "/";
    if (p.length > 1 && p.charAt(p.length - 1) === "/") p = p.slice(0, -1);
    if (p === "/index.html") return "/";
    return p || "/";
  }

  function atSiteHome() {
    return pathName() === "/";
  }

  function onBack(ev) {
    if (ev && ev.canGoBack) {
      history.back();
      return;
    }
    if (!atSiteHome()) {
      location.assign("/#explore");
      return;
    }
    var cap = window.Capacitor;
    var App = cap && cap.Plugins && cap.Plugins.App;
    if (App && typeof App.exitApp === "function" && window.confirm("HajCare AI बंद करें?\nExit HajCare AI?")) {
      App.exitApp();
    }
  }

  function plugin() {
    var cap = window.Capacitor;
    if (!cap) return null;
    var App = cap.Plugins && cap.Plugins.App;
    if (!App && typeof cap.registerPlugin === "function") {
      try { App = cap.registerPlugin("App"); } catch (e) { App = null; }
    }
    if (!App || typeof App.addListener !== "function") return null;
    return App;
  }

  function attach() {
    if (window.__hcBackBound) return true;
    var App = plugin();
    if (!App) return false;
    window.__hcBackBound = true;
    App.addListener("backButton", onBack);
    return true;
  }

  if (!attach()) {
    var tries = 0;
    var timer = setInterval(function () {
      if (attach() || ++tries > 24) clearInterval(timer);
    }, 250);
  }

  window.__hcHardwareBack = onBack;
})();
