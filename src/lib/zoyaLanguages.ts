/**
 * Single source of truth for Zoya's language behaviour.  Browser speech
 * engines are device-dependent, so `speechLocales` are ordered fallbacks,
 * not a promise that every installed engine has a native voice.
 */
export interface ZoyaLanguage {
  code: string;
  locale: string;
  name: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  speechLocales: readonly string[];
}

const language = (
  code: string, locale: string, name: string, nativeName: string,
  speechLocales: readonly string[], dir: "ltr" | "rtl" = "ltr",
): ZoyaLanguage => ({ code, locale, name, nativeName, speechLocales, dir });

export const ZOYA_LANGUAGES: readonly ZoyaLanguage[] = [
  language("en", "en-IN", "English (India)", "English", ["en-IN", "en-GB", "en-US", "en"]),
  language("hi", "hi-IN", "Hindi", "हिन्दी", ["hi-IN", "hi"]),
  language("ur", "ur-PK", "Urdu", "اردو", ["ur-PK", "ur-IN", "ur"], "rtl"),
  language("bn", "bn-IN", "Bengali", "বাংলা", ["bn-IN", "bn-BD", "bn"]),
  language("mr", "mr-IN", "Marathi", "मराठी", ["mr-IN", "mr"]),
  language("gu", "gu-IN", "Gujarati", "ગુજરાતી", ["gu-IN", "gu"]),
  language("pa", "pa-IN", "Punjabi", "ਪੰਜਾਬੀ", ["pa-IN", "pa-PK", "pa"]),
  language("ta", "ta-IN", "Tamil", "தமிழ்", ["ta-IN", "ta"]),
  language("te", "te-IN", "Telugu", "తెలుగు", ["te-IN", "te"]),
  language("ml", "ml-IN", "Malayalam", "മലയാളം", ["ml-IN", "ml"]),
  language("kn", "kn-IN", "Kannada", "ಕನ್ನಡ", ["kn-IN", "kn"]),
  language("or", "or-IN", "Odia", "ଓଡ଼ିଆ", ["or-IN", "or"]),
  language("as", "as-IN", "Assamese", "অসমীয়া", ["as-IN", "as"]),
  language("gom", "gom-IN", "Konkani", "कोंकणी", ["gom-IN", "kok-IN", "kok"]),
  language("ks", "ks-IN", "Kashmiri", "कॉशुर", ["ks-IN", "ks"]),
  language("sa", "sa-IN", "Sanskrit", "संस्कृतम्", ["sa-IN", "sa"]),
  language("sd", "sd-IN", "Sindhi", "سنڌي", ["sd-IN", "sd-PK", "sd"], "rtl"),
  language("doi", "doi-IN", "Dogri", "डोगरी", ["doi-IN", "doi"]),
  language("mai", "mai-IN", "Maithili", "मैथिली", ["mai-IN", "mai"]),
  language("brx", "brx-IN", "Bodo", "बड़ो", ["brx-IN", "brx"]),
  language("sat", "sat-IN", "Santali", "ᱥᱟᱱᱛᱟᱲᱤ", ["sat-IN", "sat"]),
  language("mni", "mni-IN", "Manipuri (Meitei)", "ꯃꯤꯇꯩꯂꯣꯟ", ["mni-IN", "mni"]),
  language("ne", "ne-IN", "Nepali (India)", "नेपाली", ["ne-IN", "ne-NP", "ne"]),
];

export const DEFAULT_ZOYA_LANGUAGE = ZOYA_LANGUAGES[0];

export function getZoyaLanguage(code?: string): ZoyaLanguage {
  // Accept historic `kok` selections while storing the requested gom-IN locale.
  const normalized = code === "kok" ? "gom" : code;
  return ZOYA_LANGUAGES.find((item) => item.code === normalized) ?? DEFAULT_ZOYA_LANGUAGE;
}
