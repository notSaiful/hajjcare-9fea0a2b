/* Counts a public page once per path per India calendar day.
   Uses the training project's publishable config only. No name, email, phone, or address is sent. */
(function (root) {
  var ALLOWED = "uorfprlfpqdpjtrcaqrt.supabase.co";
  var FORBIDDEN = {
    "begtqcmwruvwposocnsr.supabase.co": 1,
    "pwtmrddreqmhyluqbfgi.supabase.co": 1,
    "vvbbwlfzpfvgyweeggvw.supabase.co": 1
  };
  var ID_KEY = "hc_vid";
  var SEEN_KEY = "hc_visit_seen";

  function config() {
    var cfg = root.__HC_TRAINING_CONFIG || {};
    var host = "";
    try { host = new URL(String(cfg.url || "")).host; } catch (e) { host = ""; }
    if (FORBIDDEN[host] || host !== ALLOWED) return null;
    var key = String(cfg.publishableKey || "").trim();
    if (!key || /service_role/i.test(key) || key.indexOf("sb_secret_") === 0) return null;
    return { key: key };
  }

  function istDay(now) {
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(now);
    } catch (e) {
      return "";
    }
  }

  function visitorId() {
    var id = "";
    try { id = localStorage.getItem(ID_KEY) || ""; } catch (e) { return ""; }
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return id;
    try {
      id = crypto.randomUUID();
      localStorage.setItem(ID_KEY, id);
      return id;
    } catch (e) {
      return "";
    }
  }

  function seen(day) {
    try {
      var data = JSON.parse(localStorage.getItem(SEEN_KEY) || "{}");
      if (!data || data.day !== day || !data.paths) return {};
      return data.paths;
    } catch (e) {
      return {};
    }
  }

  function mark(day, path) {
    var paths = seen(day);
    paths[path] = 1;
    try { localStorage.setItem(SEEN_KEY, JSON.stringify({ day: day, paths: paths })); } catch (e) { /* private mode */ }
  }

  async function record(path) {
    try {
      var cfg = config();
      if (!cfg) return;
      var target = String(path || (root.location && root.location.pathname) || "/");
      if (target.charAt(0) !== "/" || target.length > 120 || /[\s?#\\<>]/.test(target)) return;
      var day = istDay(new Date());
      if (!day || seen(day)[target]) return;
      var id = visitorId();
      if (!id) return;
      var res = await fetch("https://" + ALLOWED + "/functions/v1/site-visit", {
        method: "POST",
        redirect: "manual",
        cache: "no-store",
        headers: { "content-type": "application/json", apikey: cfg.key },
        body: JSON.stringify({ visitor_id: id, path: target })
      });
      if (res && res.status === 204) mark(day, target);
    } catch (e) { /* never break the page */ }
  }

  root.__hcRecordSiteVisit = record;
  root.__hcSiteVisitReady = record();
})(window);
