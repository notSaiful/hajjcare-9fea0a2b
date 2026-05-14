import { Language } from "@/contexts/LanguageContext";

export type MinaTentsLabels = {
  title: string;
  subtitle: string;
  back: string;
  mapBtn: string;
  unofficial: string;
  unofficialDetail: string;
  forCorrections: string;
  searchPlaceholder: string;
  all: string;
  bus: string;
  metro: string;
  countOf: (shown: number, total: number) => string;
  noResults: string;
  maktab: string;
  maktabHash: string;
  campStreet: string;
  manager: string;
  viewContacts: string;
  // QuickAction
  qaTitle: string;
  qaSubtitle: string;
  qaPlaceholder: string;
  qaOpen: string;
  qaBrowse: (n: number) => string;
  // Search tips
  tipsTitle: string;
  tipsNumerals: string;
  tipsSpelling: string;
  tipsPartial: string;
};

const en: MinaTentsLabels = {
  title: "Mina Tent Locations",
  subtitle: "Hajj 2026 Maktab directory",
  back: "Back",
  mapBtn: "Map",
  unofficial: "Unofficial directory.",
  unofficialDetail: "Numbers shown are Saudi mobile numbers (prefix +966).",
  forCorrections: "For corrections contact",
  searchPlaceholder: "Search maktab #, street, name or phone...",
  all: "All",
  bus: "Bus",
  metro: "Metro Train",
  countOf: (s, t) => `${s} of ${t}`,
  noResults: "No maktab found matching your search.",
  maktab: "Maktab",
  maktabHash: "Maktab #",
  campStreet: "Camp/Street",
  manager: "Manager",
  viewContacts: "View all 6 contacts →",
  qaTitle: "Mina Tent Locations",
  qaSubtitle: "Find your Maktab tent & contacts",
  qaPlaceholder: "Maktab #",
  qaOpen: "Open",
  qaBrowse: (n) => `Browse all ${n} maktabs`,
};

const ar: MinaTentsLabels = {
  title: "مواقع خيام منى",
  subtitle: "دليل المكاتب لحج 2026",
  back: "رجوع",
  mapBtn: "الخريطة",
  unofficial: "دليل غير رسمي.",
  unofficialDetail: "الأرقام المعروضة هي أرقام جوال سعودية (بادئة +966).",
  forCorrections: "للتصحيحات تواصل مع",
  searchPlaceholder: "ابحث برقم المكتب أو الشارع أو الاسم أو الهاتف...",
  all: "الكل",
  bus: "حافلة",
  metro: "قطار المترو",
  countOf: (s, t) => `${s} من ${t}`,
  noResults: "لا يوجد مكتب مطابق لبحثك.",
  maktab: "المكتب",
  maktabHash: "المكتب #",
  campStreet: "المخيم/الشارع",
  manager: "المدير",
  viewContacts: "عرض جميع جهات الاتصال الستة ←",
  qaTitle: "مواقع خيام منى",
  qaSubtitle: "ابحث عن خيمة المكتب وجهات الاتصال",
  qaPlaceholder: "رقم المكتب",
  qaOpen: "فتح",
  qaBrowse: (n) => `تصفح جميع المكاتب الـ ${n}`,
};

const ur: MinaTentsLabels = {
  title: "منیٰ خیمہ مقامات",
  subtitle: "حج 2026 مکتب ڈائریکٹری",
  back: "واپس",
  mapBtn: "نقشہ",
  unofficial: "غیر سرکاری ڈائریکٹری۔",
  unofficialDetail: "دکھائے گئے نمبر سعودی موبائل نمبر ہیں (پریفکس +966)۔",
  forCorrections: "اصلاح کے لیے رابطہ کریں",
  searchPlaceholder: "مکتب نمبر، گلی، نام یا فون تلاش کریں...",
  all: "تمام",
  bus: "بس",
  metro: "میٹرو ٹرین",
  countOf: (s, t) => `${t} میں سے ${s}`,
  noResults: "آپ کی تلاش سے کوئی مکتب نہیں ملا۔",
  maktab: "مکتب",
  maktabHash: "مکتب #",
  campStreet: "کیمپ/گلی",
  manager: "منیجر",
  viewContacts: "تمام 6 رابطے دیکھیں ←",
  qaTitle: "منیٰ خیمہ مقامات",
  qaSubtitle: "اپنا مکتب خیمہ اور رابطے تلاش کریں",
  qaPlaceholder: "مکتب نمبر",
  qaOpen: "کھولیں",
  qaBrowse: (n) => `تمام ${n} مکاتب دیکھیں`,
};

const hi: MinaTentsLabels = {
  title: "मीना तंबू स्थान",
  subtitle: "हज 2026 मक्तब निर्देशिका",
  back: "वापस",
  mapBtn: "नक्शा",
  unofficial: "अनधिकृत निर्देशिका।",
  unofficialDetail: "दिखाए गए नंबर सऊदी मोबाइल नंबर हैं (प्रीफ़िक्स +966)।",
  forCorrections: "सुधार के लिए संपर्क करें",
  searchPlaceholder: "मक्तब #, गली, नाम या फ़ोन खोजें...",
  all: "सभी",
  bus: "बस",
  metro: "मेट्रो ट्रेन",
  countOf: (s, t) => `${t} में से ${s}`,
  noResults: "आपकी खोज से मेल खाता कोई मक्तब नहीं मिला।",
  maktab: "मक्तब",
  maktabHash: "मक्तब #",
  campStreet: "कैंप/गली",
  manager: "प्रबंधक",
  viewContacts: "सभी 6 संपर्क देखें →",
  qaTitle: "मीना तंबू स्थान",
  qaSubtitle: "अपना मक्तब तंबू और संपर्क खोजें",
  qaPlaceholder: "मक्तब #",
  qaOpen: "खोलें",
  qaBrowse: (n) => `सभी ${n} मक्तब देखें`,
};

const ta: MinaTentsLabels = {
  title: "மினா கூடார இடங்கள்",
  subtitle: "ஹஜ் 2026 மக்தப் அடைவு",
  back: "பின்",
  mapBtn: "வரைபடம்",
  unofficial: "அதிகாரப்பூர்வமற்ற அடைவு.",
  unofficialDetail: "காட்டப்பட்ட எண்கள் சவுதி மொபைல் எண்கள் (முன்னொட்டு +966).",
  forCorrections: "திருத்தங்களுக்கு தொடர்பு கொள்ளவும்",
  searchPlaceholder: "மக்தப் எண், தெரு, பெயர் அல்லது தொலைபேசி தேடுங்கள்...",
  all: "அனைத்தும்",
  bus: "பேருந்து",
  metro: "மெட்ரோ ரயில்",
  countOf: (s, t) => `${t} இல் ${s}`,
  noResults: "உங்கள் தேடலுக்குப் பொருந்தும் மக்தப் இல்லை.",
  maktab: "மக்தப்",
  maktabHash: "மக்தப் #",
  campStreet: "முகாம்/தெரு",
  manager: "மேலாளர்",
  viewContacts: "அனைத்து 6 தொடர்புகளையும் காண →",
  qaTitle: "மினா கூடார இடங்கள்",
  qaSubtitle: "உங்கள் மக்தப் கூடாரம் & தொடர்புகளைக் கண்டறியவும்",
  qaPlaceholder: "மக்தப் #",
  qaOpen: "திற",
  qaBrowse: (n) => `அனைத்து ${n} மக்தப்களையும் பார்க்கவும்`,
};

const te: MinaTentsLabels = {
  title: "మీనా టెంట్ స్థానాలు",
  subtitle: "హజ్ 2026 మక్తబ్ డైరెక్టరీ",
  back: "వెనుకకు",
  mapBtn: "మ్యాప్",
  unofficial: "అనధికారిక డైరెక్టరీ.",
  unofficialDetail: "చూపిన నంబర్లు సౌదీ మొబైల్ నంబర్లు (ప్రిఫిక్స్ +966).",
  forCorrections: "సవరణల కోసం సంప్రదించండి",
  searchPlaceholder: "మక్తబ్ #, వీధి, పేరు లేదా ఫోన్ శోధించండి...",
  all: "అన్నీ",
  bus: "బస్సు",
  metro: "మెట్రో రైలు",
  countOf: (s, t) => `${t} లో ${s}`,
  noResults: "మీ శోధనకు సరిపోలే మక్తబ్ కనుగొనబడలేదు.",
  maktab: "మక్తబ్",
  maktabHash: "మక్తబ్ #",
  campStreet: "క్యాంప్/వీధి",
  manager: "మేనేజర్",
  viewContacts: "మొత్తం 6 పరిచయాలను చూడండి →",
  qaTitle: "మీనా టెంట్ స్థానాలు",
  qaSubtitle: "మీ మక్తబ్ టెంట్ & పరిచయాలను కనుగొనండి",
  qaPlaceholder: "మక్తబ్ #",
  qaOpen: "తెరవండి",
  qaBrowse: (n) => `మొత్తం ${n} మక్తబ్‌లను చూడండి`,
};

const mr: MinaTentsLabels = {
  title: "मीना तंबू स्थाने",
  subtitle: "हज 2026 मक्तब निर्देशिका",
  back: "मागे",
  mapBtn: "नकाशा",
  unofficial: "अनधिकृत निर्देशिका.",
  unofficialDetail: "दर्शविलेले नंबर सौदी मोबाईल नंबर आहेत (प्रिफिक्स +966).",
  forCorrections: "सुधारणांसाठी संपर्क साधा",
  searchPlaceholder: "मक्तब #, रस्ता, नाव किंवा फोन शोधा...",
  all: "सर्व",
  bus: "बस",
  metro: "मेट्रो ट्रेन",
  countOf: (s, t) => `${t} पैकी ${s}`,
  noResults: "तुमच्या शोधाशी जुळणारे कोणतेही मक्तब सापडले नाही.",
  maktab: "मक्तब",
  maktabHash: "मक्तब #",
  campStreet: "कॅम्प/रस्ता",
  manager: "व्यवस्थापक",
  viewContacts: "सर्व 6 संपर्क पहा →",
  qaTitle: "मीना तंबू स्थाने",
  qaSubtitle: "तुमचा मक्तब तंबू आणि संपर्क शोधा",
  qaPlaceholder: "मक्तब #",
  qaOpen: "उघडा",
  qaBrowse: (n) => `सर्व ${n} मक्तब पहा`,
};

const bn: MinaTentsLabels = {
  title: "মিনা তাঁবুর অবস্থান",
  subtitle: "হজ ২০২৬ মাকতাব ডিরেক্টরি",
  back: "পেছনে",
  mapBtn: "মানচিত্র",
  unofficial: "অনানুষ্ঠানিক ডিরেক্টরি।",
  unofficialDetail: "প্রদর্শিত নম্বরগুলি সৌদি মোবাইল নম্বর (প্রিফিক্স +966)।",
  forCorrections: "সংশোধনের জন্য যোগাযোগ করুন",
  searchPlaceholder: "মাকতাব #, রাস্তা, নাম বা ফোন খুঁজুন...",
  all: "সব",
  bus: "বাস",
  metro: "মেট্রো ট্রেন",
  countOf: (s, t) => `${t} এর মধ্যে ${s}`,
  noResults: "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো মাকতাব পাওয়া যায়নি।",
  maktab: "মাকতাব",
  maktabHash: "মাকতাব #",
  campStreet: "ক্যাম্প/রাস্তা",
  manager: "ম্যানেজার",
  viewContacts: "সমস্ত ৬টি যোগাযোগ দেখুন →",
  qaTitle: "মিনা তাঁবুর অবস্থান",
  qaSubtitle: "আপনার মাকতাব তাঁবু ও যোগাযোগ খুঁজুন",
  qaPlaceholder: "মাকতাব #",
  qaOpen: "খুলুন",
  qaBrowse: (n) => `সমস্ত ${n}টি মাকতাব দেখুন`,
};

const or: MinaTentsLabels = {
  title: "ମୀନା ତମ୍ବୁ ସ୍ଥାନ",
  subtitle: "ହଜ୍ ୨୦୨୬ ମକ୍ତବ ତାଲିକା",
  back: "ପଛକୁ",
  mapBtn: "ମାନଚିତ୍ର",
  unofficial: "ଅନଧିକୃତ ତାଲିକା।",
  unofficialDetail: "ଦେଖାଯାଇଥିବା ନମ୍ବରଗୁଡ଼ିକ ସାଉଦୀ ମୋବାଇଲ୍ ନମ୍ବର (ପ୍ରିଫିକ୍ସ +966)।",
  forCorrections: "ସଂଶୋଧନ ପାଇଁ ଯୋଗାଯୋଗ କରନ୍ତୁ",
  searchPlaceholder: "ମକ୍ତବ #, ରାସ୍ତା, ନାମ କିମ୍ବା ଫୋନ୍ ଖୋଜନ୍ତୁ...",
  all: "ସମସ୍ତ",
  bus: "ବସ୍",
  metro: "ମେଟ୍ରୋ ଟ୍ରେନ୍",
  countOf: (s, t) => `${t} ମଧ୍ୟରୁ ${s}`,
  noResults: "ଆପଣଙ୍କ ସନ୍ଧାନ ସହିତ ମେଳ ଖାଉଥିବା କୌଣସି ମକ୍ତବ ମିଳିଲା ନାହିଁ।",
  maktab: "ମକ୍ତବ",
  maktabHash: "ମକ୍ତବ #",
  campStreet: "କ୍ୟାମ୍ପ/ରାସ୍ତା",
  manager: "ପରିଚାଳକ",
  viewContacts: "ସମସ୍ତ ୬ ଯୋଗାଯୋଗ ଦେଖନ୍ତୁ →",
  qaTitle: "ମୀନା ତମ୍ବୁ ସ୍ଥାନ",
  qaSubtitle: "ଆପଣଙ୍କ ମକ୍ତବ ତମ୍ବୁ ଓ ଯୋଗାଯୋଗ ଖୋଜନ୍ତୁ",
  qaPlaceholder: "ମକ୍ତବ #",
  qaOpen: "ଖୋଲନ୍ତୁ",
  qaBrowse: (n) => `ସମସ୍ତ ${n} ମକ୍ତବ ଦେଖନ୍ତୁ`,
};

const ml: MinaTentsLabels = {
  title: "മിന ടെന്റ് സ്ഥാനങ്ങൾ",
  subtitle: "ഹജ്ജ് 2026 മക്തബ് ഡയറക്ടറി",
  back: "തിരികെ",
  mapBtn: "മാപ്പ്",
  unofficial: "അനൗദ്യോഗിക ഡയറക്ടറി.",
  unofficialDetail: "കാണിച്ചിരിക്കുന്ന നമ്പറുകൾ സൗദി മൊബൈൽ നമ്പറുകളാണ് (പ്രിഫിക്സ് +966).",
  forCorrections: "തിരുത്തലുകൾക്കായി ബന്ധപ്പെടുക",
  searchPlaceholder: "മക്തബ് #, തെരുവ്, പേര് അല്ലെങ്കിൽ ഫോൺ തിരയുക...",
  all: "എല്ലാം",
  bus: "ബസ്",
  metro: "മെട്രോ ട്രെയിൻ",
  countOf: (s, t) => `${t} ൽ ${s}`,
  noResults: "നിങ്ങളുടെ തിരയലുമായി പൊരുത്തപ്പെടുന്ന മക്തബ് കണ്ടെത്തിയില്ല.",
  maktab: "മക്തബ്",
  maktabHash: "മക്തബ് #",
  campStreet: "ക്യാമ്പ്/തെരുവ്",
  manager: "മാനേജർ",
  viewContacts: "എല്ലാ 6 കോൺടാക്റ്റുകളും കാണുക →",
  qaTitle: "മിന ടെന്റ് സ്ഥാനങ്ങൾ",
  qaSubtitle: "നിങ്ങളുടെ മക്തബ് ടെന്റും കോൺടാക്റ്റുകളും കണ്ടെത്തുക",
  qaPlaceholder: "മക്തബ് #",
  qaOpen: "തുറക്കുക",
  qaBrowse: (n) => `എല്ലാ ${n} മക്തബുകളും കാണുക`,
};

const pa: MinaTentsLabels = {
  title: "ਮੀਨਾ ਤੰਬੂ ਸਥਾਨ",
  subtitle: "ਹੱਜ 2026 ਮਕਤਬ ਡਾਇਰੈਕਟਰੀ",
  back: "ਵਾਪਸ",
  mapBtn: "ਨਕਸ਼ਾ",
  unofficial: "ਅਣਅਧਿਕਾਰਤ ਡਾਇਰੈਕਟਰੀ।",
  unofficialDetail: "ਦਿਖਾਏ ਗਏ ਨੰਬਰ ਸਾਊਦੀ ਮੋਬਾਈਲ ਨੰਬਰ ਹਨ (ਪ੍ਰਿਫਿਕਸ +966)।",
  forCorrections: "ਸੁਧਾਰਾਂ ਲਈ ਸੰਪਰਕ ਕਰੋ",
  searchPlaceholder: "ਮਕਤਬ #, ਗਲੀ, ਨਾਮ ਜਾਂ ਫ਼ੋਨ ਖੋਜੋ...",
  all: "ਸਾਰੇ",
  bus: "ਬੱਸ",
  metro: "ਮੈਟਰੋ ਟ੍ਰੇਨ",
  countOf: (s, t) => `${t} ਵਿੱਚੋਂ ${s}`,
  noResults: "ਤੁਹਾਡੀ ਖੋਜ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਕੋਈ ਮਕਤਬ ਨਹੀਂ ਮਿਲਿਆ।",
  maktab: "ਮਕਤਬ",
  maktabHash: "ਮਕਤਬ #",
  campStreet: "ਕੈਂਪ/ਗਲੀ",
  manager: "ਮੈਨੇਜਰ",
  viewContacts: "ਸਾਰੇ 6 ਸੰਪਰਕ ਵੇਖੋ →",
  qaTitle: "ਮੀਨਾ ਤੰਬੂ ਸਥਾਨ",
  qaSubtitle: "ਆਪਣਾ ਮਕਤਬ ਤੰਬੂ ਅਤੇ ਸੰਪਰਕ ਲੱਭੋ",
  qaPlaceholder: "ਮਕਤਬ #",
  qaOpen: "ਖੋਲ੍ਹੋ",
  qaBrowse: (n) => `ਸਾਰੇ ${n} ਮਕਤਬ ਵੇਖੋ`,
};

const MAP: Record<Language, MinaTentsLabels> = {
  en, ar, ur, hi, ta, te, mr, bn, or, ml, pa,
  tr: en, ru: en,
};

export const getMinaTentsLabels = (lang: Language): MinaTentsLabels => MAP[lang] ?? en;
