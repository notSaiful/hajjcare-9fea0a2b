import type { Language } from "@/contexts/LanguageContext";
import { getClientPlatform } from "@/lib/medianAppSettings";

const messages = {
  en: {
    blocked:
      "Microphone access is blocked. In Chrome, tap the lock icon next to hajjcare.in → Permissions → Microphone → Allow, then reload. In the HajCare Android app, enable Microphone in Settings → Apps → HajCare AI → Permissions.",
    androidRuntimeDenied: "Android microphone permission is denied. Allow Microphone in Settings → Apps → HajCare AI → Permissions, then return and try again.",
    webViewDenied: "Android microphone permission is allowed, but the in-app WebView rejected microphone capture. Please tap Retry. If it continues, update Android System WebView and HajCare AI.",
    blockedIos: "Microphone access is blocked. On iPhone or iPad, enable Microphone for HajCare AI in Settings, then return and try again.",
    unavailable: "No microphone was found. Connect or enable a microphone, then try again.",
    busy: "Your microphone is being used by another app or call. Close it and try again.",
    insecure: "Voice calls require a secure HTTPS connection. Please open https://hajjcare.in and try again.",
    unsupported: "Voice calls require a supported browser with microphone access.",
    retry: "The microphone request was interrupted. Please try again.",
  },
  hi: {
    blocked:
      "माइक्रोफ़ोन की अनुमति बंद है। Chrome में hajjcare.in के पास लॉक आइकन → Permissions → Microphone → Allow करें, फिर पेज reload करें। HajCare Android ऐप में Settings → Apps → HajCare AI → Permissions → Microphone चालू करें।",
    androidRuntimeDenied: "Android माइक्रोफ़ोन अनुमति बंद है। Settings → Apps → HajCare AI → Permissions में Microphone Allow करें, फिर वापस आकर कोशिश करें।",
    webViewDenied: "Android माइक्रोफ़ोन अनुमति चालू है, लेकिन in-app WebView ने microphone capture रोक दिया। Retry करें। समस्या रहे तो Android System WebView और HajCare AI अपडेट करें।",
    blockedIos: "माइक्रोफ़ोन की अनुमति बंद है। iPhone या iPad में Settings से HajCare AI के लिए Microphone चालू करें, फिर वापस आकर कोशिश करें।",
    unavailable: "माइक्रोफ़ोन नहीं मिला। माइक्रोफ़ोन जोड़ें या चालू करें, फिर दोबारा कोशिश करें।",
    busy: "माइक्रोफ़ोन किसी अन्य ऐप या कॉल में इस्तेमाल हो रहा है। उसे बंद करके दोबारा कोशिश करें।",
    insecure: "वॉइस कॉल के लिए सुरक्षित HTTPS कनेक्शन चाहिए। https://hajjcare.in खोलकर फिर कोशिश करें।",
    unsupported: "वॉइस कॉल के लिए माइक्रोफ़ोन अनुमति वाले समर्थित ब्राउज़र की आवश्यकता है।",
    retry: "माइक्रोफ़ोन अनुरोध रुक गया। कृपया फिर कोशिश करें।",
  },
  ur: {
    blocked:
      "مائیکروفون کی اجازت بند ہے۔ Chrome میں hajjcare.in کے پاس لاک آئیکن → Permissions → Microphone → Allow کریں، پھر صفحہ دوبارہ کھولیں۔ HajCare Android ایپ میں Settings → Apps → HajCare AI → Permissions → Microphone فعال کریں۔",
    androidRuntimeDenied: "Android مائیکروفون کی اجازت بند ہے۔ Settings → Apps → HajCare AI → Permissions میں Microphone Allow کریں، پھر واپس آ کر کوشش کریں۔",
    webViewDenied: "Android مائیکروفون کی اجازت فعال ہے، مگر in-app WebView نے microphone capture روک دیا۔ Retry کریں۔ مسئلہ برقرار رہے تو Android System WebView اور HajCare AI اپ ڈیٹ کریں۔",
    blockedIos: "مائیکروفون کی اجازت بند ہے۔ iPhone یا iPad میں Settings سے HajCare AI کے لیے Microphone فعال کریں، پھر واپس آ کر کوشش کریں۔",
    unavailable: "مائیکروفون نہیں ملا۔ مائیکروفون جوڑیں یا فعال کریں، پھر دوبارہ کوشش کریں۔",
    busy: "مائیکروفون کسی اور ایپ یا کال میں استعمال ہو رہا ہے۔ اسے بند کر کے دوبارہ کوشش کریں۔",
    insecure: "وائس کال کے لیے محفوظ HTTPS کنکشن درکار ہے۔ https://hajjcare.in کھول کر دوبارہ کوشش کریں۔",
    unsupported: "وائس کال کے لیے مائیکروفون کی اجازت والا معاون براؤزر درکار ہے۔",
    retry: "مائیکروفون کی درخواست رک گئی۔ براہِ کرم دوبارہ کوشش کریں۔",
  },
} as const;

/** Converts browser media errors into a recovery step a pilgrim can act on. */
export function getMicrophonePermissionMessage(error: unknown, language: Language): string {
  const copy = messages[language === "hi" || language === "ur" ? language : "en"];
  const name = error instanceof DOMException ? error.name : error instanceof Error ? error.name : "";
  const detail = error instanceof Error ? error.message.toLowerCase() : "";

  if (detail.includes("android runtime microphone permission")) return copy.androidRuntimeDenied;
  if (detail.includes("android webview denied microphone")) return copy.webViewDenied;

  switch (name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return getClientPlatform() === "ios" ? copy.blockedIos : copy.blocked;
    case "NotFoundError":
    case "DevicesNotFoundError":
      return copy.unavailable;
    case "NotReadableError":
    case "TrackStartError":
      return copy.busy;
    case "SecurityError":
      return copy.insecure;
    case "AbortError":
      return copy.retry;
    default:
      return error instanceof Error && error.message ? error.message : copy.unsupported;
  }
}

export function isMicrophonePermissionDenied(error: unknown): boolean {
  const name = error instanceof DOMException ? error.name : error instanceof Error ? error.name : "";
  return name === "NotAllowedError" || name === "PermissionDeniedError";
}
