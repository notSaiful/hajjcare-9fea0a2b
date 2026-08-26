import { useState } from "react";
import { ExternalLink, Mic } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { canOpenNativeAppSettings, getClientPlatform, openNativeAppSettings } from "@/lib/medianAppSettings";

const copy = {
  en: {
    title: "Allow microphone to speak with Zoya",
    native: "Opening HajCare AI settings…",
    open: "Open app permissions",
    browserAndroid: "On Chrome: tap the lock icon beside hajjcare.in → Permissions → Microphone → Allow, then reload this page.",
    browserIos: "On iPhone or iPad: Settings → Safari → Microphone → Allow, then return to HajCare AI and try again.",
    browserWeb: "Allow microphone access in your browser's site settings for hajjcare.in, then reload this page.",
    appAndroid: "On Android: Settings → Apps → HajCare AI → Permissions → Microphone → Allow.",
    appIos: "On iPhone or iPad: Settings → HajCare AI → Microphone → On.",
  },
  hi: {
    title: "Zoya से बात करने के लिए माइक्रोफ़ोन अनुमति दें",
    native: "HajCare AI की सेटिंग खुल रही है…",
    open: "ऐप अनुमति खोलें",
    browserAndroid: "Chrome में hajjcare.in के पास लॉक आइकन → Permissions → Microphone → Allow करें, फिर पेज reload करें।",
    browserIos: "iPhone या iPad में: Settings → Safari → Microphone → Allow करें, फिर HajCare AI में वापस आकर कोशिश करें।",
    browserWeb: "अपने ब्राउज़र की hajjcare.in site settings में Microphone को Allow करें, फिर पेज reload करें।",
    appAndroid: "Android में: Settings → Apps → HajCare AI → Permissions → Microphone → Allow करें।",
    appIos: "iPhone या iPad में: Settings → HajCare AI → Microphone → On करें।",
  },
  ur: {
    title: "Zoya سے بات کے لیے مائیکروفون کی اجازت دیں",
    native: "HajCare AI کی سیٹنگز کھل رہی ہیں…",
    open: "ایپ کی اجازت کھولیں",
    browserAndroid: "Chrome میں hajjcare.in کے پاس لاک آئیکن → Permissions → Microphone → Allow کریں، پھر صفحہ دوبارہ کھولیں۔",
    browserIos: "iPhone یا iPad میں: Settings → Safari → Microphone → Allow کریں، پھر HajCare AI میں واپس آ کر کوشش کریں۔",
    browserWeb: "اپنے براؤزر کی hajjcare.in site settings میں Microphone کو Allow کریں، پھر صفحہ دوبارہ کھولیں۔",
    appAndroid: "Android میں: Settings → Apps → HajCare AI → Permissions → Microphone → Allow کریں۔",
    appIos: "iPhone یا iPad میں: Settings → HajCare AI → Microphone → On کریں۔",
  },
} as const;

export function MicrophonePermissionHelp({ language }: { language: Language }) {
  const [isOpening, setIsOpening] = useState(false);
  const nativeSettingsAvailable = canOpenNativeAppSettings();
  const platform = getClientPlatform();
  const text = copy[language === "hi" || language === "ur" ? language : "en"];
  const browserGuidance = platform === "ios" ? text.browserIos : platform === "android" ? text.browserAndroid : text.browserWeb;
  const appGuidance = platform === "ios" ? text.appIos : text.appAndroid;

  const openSettings = async () => {
    setIsOpening(true);
    await openNativeAppSettings();
    setIsOpening(false);
  };

  return (
    <div role="alert" className="w-full rounded-xl border border-amber-500/35 bg-amber-50 p-3 text-left text-sm text-amber-950 dark:bg-amber-950/25 dark:text-amber-100">
      <div className="flex gap-2">
        <Mic aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0">
          <p className="font-semibold">{text.title}</p>
          {nativeSettingsAvailable ? (
            <>
              <p className="mt-1 text-xs leading-5">{appGuidance}</p>
              <Button type="button" size="sm" className="mt-2 gap-1.5" onClick={openSettings} disabled={isOpening}>
                <ExternalLink className="h-3.5 w-3.5" />
                {isOpening ? text.native : text.open}
              </Button>
            </>
          ) : (
            <p className="mt-1 text-xs leading-5">{browserGuidance}</p>
          )}
        </div>
      </div>
    </div>
  );
}
