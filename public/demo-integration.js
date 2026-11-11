/* Honest bridge from the approved demo screens to existing HajCare pages.
   100-day training saves only after the training server returns a receipt.
   Volunteer registration is the login-free HajCare form. This demo form is not submitted.
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

  /* Internal only, not shown to a Hajji:
     Free enrolment is only for a registered haji. The cover number is not checked
     against a Haj Committee list, so free eligibility is not confirmed. A receipt
     appears only after the server saves the request. No email or SMS is sent.
     मुफ़्त दाख़िला सिर्फ़ रजिस्टर्ड हाजी के लिए है। यह फ़ॉर्म कवर नंबर को हज कमेटी की
     सूची से नहीं जाँचता। रसीद तभी दिखेगी जब सर्वर अनुरोध सेव कर दे। ईमेल या एसएमएस नहीं भेजा जाता। */

  function volunteerMessage() {
    if (en()) {
      return "<b>This short form was not submitted.</b> Volunteer registration is login-free. <a href=\"/volunteer\">Open the HajCare volunteer form</a>. Hajj and Umrah volunteer lessons show after that registration is confirmed.";
    }
    return "<b>यह छोटा फ़ॉर्म जमा नहीं हुआ।</b> वॉलंटियर रजिस्ट्रेशन बिना साइन-इन है। <a href=\"/volunteer\">HajCare वॉलंटियर फ़ॉर्म खोलें</a>। हज और उमरा के पाठ रजिस्ट्रेशन की पुष्टि के बाद दिखते हैं।";
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
      var loginFree = typeof root.__hcSubmitTrainingRegistration === "function";
      if (loginFree && typeof root.__hcPrepareTrainingRegistration === "function") root.__hcPrepareTrainingRegistration(train);
      else if (typeof root.__hcMountTrainingGate === "function") root.__hcMountTrainingGate(train);
      train.onsubmit = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        var res = train.querySelector(".res");
        if (!res) return false;
        res.textContent = "";
        var submit = loginFree ? root.__hcSubmitTrainingRegistration : window.__hcSubmitTrainingEnrollment;
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
          if (saved && loginFree) {
            var thanks = document.createElement("p");
            thanks.className = "hc-save-thanks";
            thanks.textContent = "आपका रजिस्ट्रेशन मुकम्मल हुआ। अल्लाह आपका हज मबरूर और कबूल करे।";
            var receipt = document.createElement("p");
            receipt.className = "hc-save-receipt";
            receipt.textContent = String(out.receiptId || "");
            box.appendChild(thanks);
            box.appendChild(receipt);
          }
          var detail = document.createElement("p");
          detail.textContent = text;
          box.appendChild(detail);
          res.appendChild(box);
          if (saved) {
            var next = document.createElement("p");
            var link = document.createElement("a");
            link.className = "btn";
            link.href = "/volunteer";
            link.textContent = en() ? "Continue to volunteer registration" : "वॉलंटियर रजिस्ट्रेशन जारी रखें";
            next.appendChild(link);
            res.appendChild(next);
          }
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
          ? "Not submitted here — register without signing in"
          : "यहाँ जमा नहीं — बिना साइन-इन रजिस्टर करें";
      }
      blockForm(vol, '<div class="note">' + volunteerMessage() + "</div>");
    }

    if (h === "home") {
      insertNote(
        en()
          ? 'Account registration uses the existing HajCare sign-in. <a href="/auth">Create an account or sign in</a>.'
          : 'खाता रजिस्ट्रेशन मौजूदा HajCare साइन-इन से होता है। <a href="/auth">खाता बनाएँ या साइन इन करें</a>।'
      );
    } else if (h === "volunteer") {
      insertNote(volunteerMessage());
    } else if (h === "fees") {
      insertNote(
        en()
          ? 'Choosing an amount does not start a payment and does not charge you. This fee is voluntary and not compulsory for any Haji. A receipt is issued only after the server verifies a payment. <a href="/service-fee">Open the service-fee page</a>.'
          : 'रक़म चुनने से पेमेंट शुरू नहीं होता और पैसे नहीं कटते। यह शुल्क स्वैच्छिक है और किसी हाजी के लिए ज़रूरी नहीं। रसीद तभी बनेगी जब सर्वर पेमेंट की जाँच कर दे। <a href="/service-fee">सेवा शुल्क पेज खोलें</a>।'
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
