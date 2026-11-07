/* Honest bridge from the approved demo screens to existing HajCare pages.
   100-day training saves only after the training server returns a receipt.
   Volunteer registration keeps the existing signed-in form.
   Video 1 stays in the demo's browser storage. */
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

  function trainingStatus() {
    if (en()) {
      return "Free enrollment is only for a registered haji. This form does not check your cover number against a Haj Committee list, so free eligibility is not confirmed. A receipt appears only after the server saves the request. No email or SMS is sent.";
    }
    return "मुफ़्त दाख़िला सिर्फ़ रजिस्टर्ड हाजी के लिए है। यह फ़ॉर्म कवर नंबर को हज कमेटी की सूची से नहीं जाँचता, इसलिए मुफ़्त पात्रता पक्की नहीं है। रसीद तभी दिखेगी जब सर्वर अनुरोध सेव कर दे। ईमेल या एसएमएस नहीं भेजा जाता।";
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
      if (tag && tag.classList && tag.classList.contains("tag")) tag.remove();
      try { localStorage.removeItem("hc-train"); } catch (e) { /* private mode */ }
      var list = document.getElementById("list");
      if (list) list.textContent = "";
      train.onsubmit = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        var res = train.querySelector(".res");
        if (!res) return false;
        res.textContent = "";
        var submit = window.__hcSubmitTrainingEnrollment;
        if (typeof submit !== "function") {
          res.textContent = en()
            ? "Nothing was saved. The enrollment service is not available in this page."
            : "कुछ सेव नहीं हुआ। इस पेज पर एनरोलमेंट सेवा उपलब्ध नहीं है।";
          return false;
        }
        submit(train).then(function (out) {
          res.textContent = "";
          var saved = !!(out && out.ok === true && out.receiptId);
          var box = document.createElement("div");
          var fallback = en() ? "Nothing was saved." : "कुछ सेव नहीं हुआ।";
          var text = out && out.message ? out.message : fallback;
          if (!saved && /^\s*saved\b/i.test(text)) text = fallback;
          box.className = saved ? "ok" : "note";
          box.textContent = text;
          res.appendChild(box);
        }).catch(function () {
          res.textContent = en() ? "Nothing was saved. The server did not confirm the request." : "कुछ सेव नहीं हुआ। सर्वर ने पुष्टि नहीं की।";
        });
        return false;
      };
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
          ? 'Account registration uses the existing HajCare sign-in. <a href="/auth">Create an account or sign in</a>. The 100-day form is saved only when the server returns a receipt. The cover number alone does not confirm free eligibility.'
          : 'खाता रजिस्ट्रेशन मौजूदा HajCare साइन-इन से होता है। <a href="/auth">खाता बनाएँ या साइन इन करें</a>। 100 दिन का फ़ॉर्म तभी सेव होता है जब सर्वर रसीद दे। सिर्फ़ कवर नंबर से मुफ़्त पात्रता पक्की नहीं होती।'
      );
    } else if (h === "register") {
      insertNote(trainingStatus());
    } else if (h === "volunteer") {
      insertNote(volunteerMessage());
    } else if (h === "fees") {
      insertNote(
        en()
          ? "Choosing an amount does not start a payment and does not charge you."
          : "रक़म चुनने से पेमेंट शुरू नहीं होता और पैसे नहीं कटते।"
      );
    } else if (h === "social") {
      insertNote(
        en()
          ? "Video 1 stays in this browser only. It is not uploaded. Videos 2–6 are empty."
          : "वीडियो 1 सिर्फ़ इस ब्राउज़र में रहता है। यह अपलोड नहीं होता। वीडियो 2–6 खाली हैं।"
      );
    } else if (h === "lost") {
      insertNote(
        en()
          ? "Anything saved on this screen stays on this device. It is not stored by HajCare."
          : "इस स्क्रीन पर सेव चीज़ सिर्फ़ इस डिवाइस में रहती है। HajCare इसे सर्वर पर नहीं रखता।"
      );
    } else if (h === "grievance") {
      insertNote(
        en()
          ? "This form is not sent to HajCare. It does not open a ticket."
          : "यह फ़ॉर्म HajCare को नहीं भेजा जाता। यह टिकट नहीं खोलता।"
      );
    } else if (LIVE[h]) {
      insertNote(
        en()
          ? "This screen is sample guidance. It is not a live official feed."
          : "यह स्क्रीन नमूना रहनुमाई है। यह लाइव आधिकारिक फ़ीड नहीं है।"
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
