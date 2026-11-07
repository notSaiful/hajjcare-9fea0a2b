/* Honest bridge from the approved demo screens to existing HajCare pages.
   Training enrollment has no server table. Volunteer registration keeps the
   existing signed-in form. Video 1 stays in the demo's browser storage. */
(function (root) {
  var LIVE = {
    circulars: ["/circulars", "Circulars"],
    rules: ["/rules", "Saudi rules"],
    preparation: ["/hajj-training-videos", "Training videos"],
    money: ["/money", "Money guide"],
    telecom: ["/telecom", "Telecom guide"],
    guides: ["/umrah", "Umrah guide"],
    buildings: ["/hajj-buildings", "Makkah buildings"],
    hotels: ["/madinah-hotels", "Madinah hotels"],
    mina: ["/mina-tents", "Mina tents"],
    mashaer: ["/mashair-map", "Mashaer map"],
    qurbani: ["/qurbani", "Qurbani"],
    lost: ["/lost-and-found", "Lost & Found"],
    women: ["/women", "Women"],
    food: ["/food-guide", "Food guide"],
    social: ["/socials", "Social links"],
    videos: ["/hajj-training-videos", "Training videos"],
    contact: ["/contact-us", "Contact"],
    after: ["/post-hajj", "After Hajj"],
    grievance: ["/grievances", "Grievance guidance"],
  };

  function en() {
    return document.documentElement.lang === "en";
  }

  function currentHash() {
    var h = (location.hash || "").replace(/^#/, "");
    return h || "home";
  }

  function insertNote(html) {
    var main = document.getElementById("main");
    if (!main) return;
    var existing = main.querySelector("[data-hc-live]");
    if (existing) existing.remove();
    var p = document.createElement("div");
    p.className = "note";
    p.setAttribute("data-hc-live", "1");
    p.innerHTML = html;
    var h1 = main.querySelector("h1");
    if (h1 && h1.nextSibling) h1.insertAdjacentElement("afterend", p);
    else if (h1) h1.insertAdjacentElement("afterend", p);
    else main.insertAdjacentElement("afterbegin", p);
  }

  function blockForm(form, html) {
    if (!form) return;
    form.dataset.hcBlocked = "1";
    var list = document.getElementById("list");
    if (list) list.textContent = "";
    try {
      localStorage.removeItem("hc-train");
      localStorage.removeItem("hc-vol");
    } catch (e) { /* private mode */ }
    form.onsubmit = function (e) {
      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopPropagation) e.stopPropagation();
      var res = form.querySelector(".res");
      if (res) res.innerHTML = html;
      try {
        localStorage.removeItem("hc-train");
        localStorage.removeItem("hc-vol");
      } catch (err) { /* private mode */ }
      return false;
    };
  }

  function trainingMessage() {
    if (en()) {
      return "<b>Nothing was submitted.</b> HajCare does not have a training-enrollment record, so this form is not saved and is not a registration. <a href=\"/auth?next=/home\">Create a HajCare account or sign in</a>. An account does not enroll you in the 100-day training.";
    }
    return "<b>कुछ भी जमा नहीं हुआ।</b> HajCare के पास ट्रेनिंग-एनरोलमेंट का रिकॉर्ड नहीं है, इसलिए यह फ़ॉर्म सेव नहीं होता और रजिस्ट्रेशन नहीं है। <a href=\"/auth?next=/home\">HajCare खाता बनाएँ या साइन इन करें</a>। खाता 100 दिन की ट्रेनिंग में दाख़िला नहीं है।";
  }

  function volunteerMessage() {
    if (en()) {
      return "<b>This short form was not submitted.</b> Volunteer registration uses the existing signed-in HajCare form (identity, skills, availability, and declaration). <a href=\"/auth?next=/volunteer\">Sign in to continue</a> or <a href=\"/volunteer\">open the volunteer form</a>.";
    }
    return "<b>यह छोटा फ़ॉर्म जमा नहीं हुआ।</b> वॉलंटियर रजिस्ट्रेशन मौजूदा साइन-इन HajCare फ़ॉर्म पर होता है (पहचान, स्किल, उपलब्धता और घोषणा)। <a href=\"/auth?next=/volunteer\">जारी रखने के लिए साइन इन करें</a> या <a href=\"/volunteer\">वॉलंटियर फ़ॉर्म खोलें</a>।";
  }

  function wire() {
    var h = currentHash();
    var train = document.querySelector('form[data-store="hc-train"]');
    if (train) {
      var tag = train.previousElementSibling;
      if (tag && tag.classList && tag.classList.contains("tag")) {
        tag.textContent = en()
          ? "Not submitted — no training enrollment on the server"
          : "जमा नहीं — सर्वर पर ट्रेनिंग एनरोलमेंट नहीं है";
      }
      blockForm(train, '<div class="note">' + trainingMessage() + "</div>");
    }
    var vol = document.querySelector('form[data-store="hc-vol"]');
    if (vol) {
      var vtag = vol.previousElementSibling;
      if (vtag && vtag.classList && vtag.classList.contains("tag")) {
        vtag.textContent = en()
          ? "Not submitted here — use the signed-in volunteer form"
          : "यहाँ जमा नहीं — साइन-इन वाला वॉलंटियर फ़ॉर्म इस्तेमाल करें";
      }
      blockForm(vol, '<div class="note">' + volunteerMessage() + "</div>");
    }

    if (h === "home") {
      insertNote(
        en()
          ? 'Account registration uses the existing HajCare sign-in. <a href="/auth?next=/home">Create an account or sign in</a>. Training and volunteer cards do not save a registration from this demo.'
          : 'खाता रजिस्ट्रेशन मौजूदा HajCare साइन-इन से होता है। <a href="/auth?next=/home">खाता बनाएँ या साइन इन करें</a>। ट्रेनिंग और वॉलंटियर कार्ड इस डेमो से रजिस्ट्रेशन सेव नहीं करते।'
      );
    } else if (h === "register") {
      insertNote(trainingMessage());
    } else if (h === "volunteer") {
      insertNote(volunteerMessage());
    } else if (h === "fees") {
      insertNote(
        en()
          ? "Choosing an amount does not start a payment and does not charge you. Pricing already published on HajCare is a separate page: <a href=\"/pricing\">service fees disclosure</a>."
          : "रक़म चुनने से पेमेंट शुरू नहीं होता और पैसे नहीं कटते। HajCare पर पहले से छपी जानकारी अलग पेज है: <a href=\"/pricing\">सर्विस फ़ीस</a>।"
      );
    } else if (h === "social") {
      insertNote(
        en()
          ? "Video 1 stays in this browser only. It is not uploaded. Videos 2–6 are empty. <a href=\"/socials\">Social links page</a> is separate and does not receive this file."
          : "वीडियो 1 सिर्फ़ इस ब्राउज़र में रहता है। यह अपलोड नहीं होता। वीडियो 2–6 खाली हैं। <a href=\"/socials\">सोशल लिंक पेज</a> अलग है और इस फ़ाइल को नहीं लेता।"
      );
    } else if (h === "lost") {
      insertNote(
        en()
          ? 'Anything saved on this screen stays on this device. It is not a HajCare report. <a href="/lost-and-found">Open Lost &amp; Found</a> to file a report the app can store.'
          : 'इस स्क्रीन पर सेव चीज़ सिर्फ़ इस डिवाइस में रहती है। यह HajCare रिपोर्ट नहीं है। ऐप में दर्ज करने के लिए <a href="/lost-and-found">खोया-पाया खोलें</a>।'
      );
    } else if (h === "grievance") {
      insertNote(
        en()
          ? 'This form is not sent to HajCare. <a href="/grievances">Grievance guidance</a> explains where to report. It does not open a ticket.'
          : 'यह फ़ॉर्म HajCare को नहीं भेजा जाता। <a href="/grievances">शिकायत मार्गदर्शन</a> बताता है कहाँ रिपोर्ट करें। यह टिकट नहीं खोलता।'
      );
    } else if (LIVE[h]) {
      insertNote(
        en()
          ? 'This screen is the approved demo sample, not a live feed. Related HajCare page: <a href="' + LIVE[h][0] + '">' + LIVE[h][1] + "</a>."
          : 'यह स्क्रीन मंज़ूर डेमो का नमूना है, लाइव फ़ीड नहीं। HajCare का संबंधित पेज: <a href="' + LIVE[h][0] + '">' + LIVE[h][1] + "</a>।"
      );
    }
  }

  function install() {
    var prev = root.__hcAfterRender;
    root.__hcAfterRender = function (l) {
      if (typeof prev === "function") prev(l);
      wire();
    };
    if (document.getElementById("main")) wire();
  }

  root.__hcDemo = { wire: wire, LIVE: LIVE, blockForm: blockForm, install: install };
  if (document.getElementById("bk") || document.getElementById("main")) install();
})(window);
