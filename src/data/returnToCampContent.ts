import { Language } from "@/contexts/LanguageContext";

export type ReturnToCampLabels = {
  // Page
  title: string;
  subtitle: string;
  back: string;
  // Saved camp section
  savedTitle: string;
  noSavedTitle: string;
  noSavedDesc: string;
  setMaktabBtn: string;
  changeMaktabBtn: string;
  saveBtn: string;
  cancelBtn: string;
  enterMaktabPlaceholder: string;
  invalidMaktab: string;
  // Maktab card
  yourMaktab: string;
  campStreet: string;
  transport: string;
  bus: string;
  metro: string;
  // Actions
  openInMaps: string;
  callManager: string;
  callAssistant: string;
  callMinaHousing: string;
  // Lost wizard
  ifLostTitle: string;
  ifLostStep1: string;
  ifLostStep2: string;
  ifLostStep3: string;
  ifLostStep4: string;
  // Show card (to locals/police)
  showCardTitle: string;
  showCardDesc: string;
  showCardLabelMaktab: string;
  showCardLabelStreet: string;
  showCardLabelManager: string;
  showCardLabelLost: string; // "I am lost. Please help me reach my Maktab."
  showCardArabicLine: string; // Arabic: "I am lost, please help me return to my Mina camp."
  // Helplines
  emergencyTitle: string;
  saudiEmergency: string; // 911
  hajjHelpline: string;
  call: string;
  // Quick action (home)
  qaTitle: string;
  qaSubtitle: string;
  qaCta: string;
};

const en: ReturnToCampLabels = {
  title: "Return to My Camp",
  subtitle: "If you get lost — your saved Maktab, route & emergency contacts",
  back: "Back",
  savedTitle: "Your saved Maktab",
  noSavedTitle: "Save your Maktab number",
  noSavedDesc: "Save it once. Then in one tap you'll see your camp address, manager phone, and a route to Mina.",
  setMaktabBtn: "Save my Maktab",
  changeMaktabBtn: "Change",
  saveBtn: "Save",
  cancelBtn: "Cancel",
  enterMaktabPlaceholder: "Enter Maktab number (e.g. 28)",
  invalidMaktab: "Maktab not found. Please check the number.",
  yourMaktab: "Maktab",
  campStreet: "Camp / Street",
  transport: "Transport",
  bus: "Bus",
  metro: "Metro Train",
  openInMaps: "Open Mina in Google Maps",
  callManager: "Call Manager",
  callAssistant: "Call Assistant Manager",
  callMinaHousing: "Call Mina Camp Housing",
  ifLostTitle: "If you are lost — do this",
  ifLostStep1: "Stay where you are. Sit in shade and drink water.",
  ifLostStep2: "Show the card below to any worker, police, or volunteer (in Arabic).",
  ifLostStep3: "Call your Maktab manager — number is below.",
  ifLostStep4: "If urgent or unwell, call Saudi emergency 911 or the Hajj Helpline.",
  showCardTitle: "Show this card to anyone",
  showCardDesc: "Workers, police and volunteers in Saudi Arabia read Arabic.",
  showCardLabelMaktab: "Maktab",
  showCardLabelStreet: "Camp / Street",
  showCardLabelManager: "Manager",
  showCardLabelLost: "I am lost. Please help me return to my Mina camp.",
  showCardArabicLine: "أنا تائه، أرجو مساعدتي للعودة إلى مخيمي في منى.",
  emergencyTitle: "Emergency",
  saudiEmergency: "Saudi Emergency 911",
  hajjHelpline: "Hajj Helpline (India)",
  call: "Call",
  qaTitle: "Lost? Return to your camp",
  qaSubtitle: "Save Maktab once · One-tap route, contacts & Arabic help card",
  qaCta: "Open Lost Mode",
};

const ar: ReturnToCampLabels = {
  title: "العودة إلى مخيمي",
  subtitle: "إذا ضللت الطريق — مكتبك المحفوظ، المسار وأرقام الطوارئ",
  back: "رجوع",
  savedTitle: "مكتبك المحفوظ",
  noSavedTitle: "احفظ رقم مكتبك",
  noSavedDesc: "احفظه مرة واحدة. ثم بضغطة واحدة ترى عنوان مخيمك ورقم المدير ومسار منى.",
  setMaktabBtn: "احفظ مكتبي",
  changeMaktabBtn: "تغيير",
  saveBtn: "حفظ",
  cancelBtn: "إلغاء",
  enterMaktabPlaceholder: "أدخل رقم المكتب (مثال: 28)",
  invalidMaktab: "المكتب غير موجود. يرجى التحقق من الرقم.",
  yourMaktab: "المكتب",
  campStreet: "المخيم / الشارع",
  transport: "النقل",
  bus: "حافلة",
  metro: "قطار المترو",
  openInMaps: "افتح منى في خرائط جوجل",
  callManager: "اتصل بالمدير",
  callAssistant: "اتصل بمساعد المدير",
  callMinaHousing: "اتصل بإسكان مخيم منى",
  ifLostTitle: "إذا ضللت الطريق — افعل ما يلي",
  ifLostStep1: "ابقَ مكانك. اجلس في الظل واشرب الماء.",
  ifLostStep2: "أظهر البطاقة أدناه لأي عامل أو شرطي أو متطوع (بالعربية).",
  ifLostStep3: "اتصل بمدير مكتبك — الرقم أدناه.",
  ifLostStep4: "إذا كان الأمر طارئاً أو شعرت بتوعك، اتصل بالطوارئ السعودية 911 أو خط مساعدة الحج.",
  showCardTitle: "أظهر هذه البطاقة لأي شخص",
  showCardDesc: "العمال والشرطة والمتطوعون في السعودية يقرؤون العربية.",
  showCardLabelMaktab: "المكتب",
  showCardLabelStreet: "المخيم / الشارع",
  showCardLabelManager: "المدير",
  showCardLabelLost: "أنا تائه. أرجو مساعدتي للعودة إلى مخيمي في منى.",
  showCardArabicLine: "أنا تائه، أرجو مساعدتي للعودة إلى مخيمي في منى.",
  emergencyTitle: "طوارئ",
  saudiEmergency: "الطوارئ السعودية 911",
  hajjHelpline: "خط مساعدة الحج (الهند)",
  call: "اتصل",
  qaTitle: "ضللت الطريق؟ عُد إلى مخيمك",
  qaSubtitle: "احفظ المكتب مرة واحدة · مسار وأرقام وبطاقة عربية بضغطة واحدة",
  qaCta: "افتح وضع الضائع",
};

const ur: ReturnToCampLabels = {
  title: "اپنے کیمپ واپس",
  subtitle: "اگر آپ بچھڑ جائیں — محفوظ مکتب، راستہ اور ایمرجنسی نمبرز",
  back: "واپس",
  savedTitle: "آپ کا محفوظ مکتب",
  noSavedTitle: "اپنا مکتب نمبر محفوظ کریں",
  noSavedDesc: "ایک بار محفوظ کر لیں۔ پھر ایک ٹیپ پر کیمپ کا پتا، منیجر کا نمبر اور منیٰ تک کا راستہ ملے گا۔",
  setMaktabBtn: "میرا مکتب محفوظ کریں",
  changeMaktabBtn: "تبدیل کریں",
  saveBtn: "محفوظ کریں",
  cancelBtn: "منسوخ",
  enterMaktabPlaceholder: "مکتب نمبر درج کریں (مثلاً 28)",
  invalidMaktab: "مکتب نہیں ملا۔ نمبر چیک کریں۔",
  yourMaktab: "مکتب",
  campStreet: "کیمپ / گلی",
  transport: "ٹرانسپورٹ",
  bus: "بس",
  metro: "میٹرو ٹرین",
  openInMaps: "گوگل میپس میں منیٰ کھولیں",
  callManager: "منیجر کو کال کریں",
  callAssistant: "اسسٹنٹ منیجر کو کال کریں",
  callMinaHousing: "منیٰ کیمپ ہاؤسنگ کو کال کریں",
  ifLostTitle: "اگر بچھڑ جائیں — یہ کریں",
  ifLostStep1: "وہیں رک جائیں۔ سائے میں بیٹھیں اور پانی پئیں۔",
  ifLostStep2: "نیچے کا کارڈ کسی بھی کارکن، پولیس یا رضاکار کو دکھائیں (عربی میں ہے)۔",
  ifLostStep3: "اپنے مکتب منیجر کو کال کریں — نمبر نیچے ہے۔",
  ifLostStep4: "ہنگامی یا طبیعت خراب ہو تو سعودی ایمرجنسی 911 یا حج ہیلپ لائن پر کال کریں۔",
  showCardTitle: "یہ کارڈ کسی کو بھی دکھائیں",
  showCardDesc: "سعودی عرب میں کارکنان، پولیس اور رضاکار عربی پڑھتے ہیں۔",
  showCardLabelMaktab: "مکتب",
  showCardLabelStreet: "کیمپ / گلی",
  showCardLabelManager: "منیجر",
  showCardLabelLost: "میں راستہ بھول گیا ہوں۔ براہ کرم مجھے میرے منیٰ کیمپ تک پہنچنے میں مدد کریں۔",
  showCardArabicLine: "أنا تائه، أرجو مساعدتي للعودة إلى مخيمي في منى.",
  emergencyTitle: "ایمرجنسی",
  saudiEmergency: "سعودی ایمرجنسی 911",
  hajjHelpline: "حج ہیلپ لائن (انڈیا)",
  call: "کال",
  qaTitle: "بچھڑ گئے؟ اپنے کیمپ واپس",
  qaSubtitle: "ایک بار مکتب محفوظ کریں · ایک ٹیپ پر راستہ، رابطے اور عربی کارڈ",
  qaCta: "لاسٹ موڈ کھولیں",
};

const hi: ReturnToCampLabels = {
  title: "अपने कैंप वापस",
  subtitle: "अगर आप बिछड़ जाएँ — सहेजा गया मक्तब, रास्ता और आपातकालीन नंबर",
  back: "वापस",
  savedTitle: "आपका सहेजा गया मक्तब",
  noSavedTitle: "अपना मक्तब नंबर सहेजें",
  noSavedDesc: "एक बार सहेज लें। फिर एक टैप पर कैंप का पता, मैनेजर का फ़ोन और मीना तक का रास्ता मिलेगा।",
  setMaktabBtn: "मेरा मक्तब सहेजें",
  changeMaktabBtn: "बदलें",
  saveBtn: "सहेजें",
  cancelBtn: "रद्द करें",
  enterMaktabPlaceholder: "मक्तब नंबर दर्ज करें (जैसे 28)",
  invalidMaktab: "मक्तब नहीं मिला। कृपया नंबर जाँचें।",
  yourMaktab: "मक्तब",
  campStreet: "कैंप / गली",
  transport: "परिवहन",
  bus: "बस",
  metro: "मेट्रो ट्रेन",
  openInMaps: "गूगल मैप्स में मीना खोलें",
  callManager: "मैनेजर को कॉल करें",
  callAssistant: "सहायक मैनेजर को कॉल करें",
  callMinaHousing: "मीना कैंप हाउसिंग को कॉल करें",
  ifLostTitle: "अगर आप बिछड़ जाएँ — यह करें",
  ifLostStep1: "वहीं रुक जाएँ। छाया में बैठें और पानी पिएँ।",
  ifLostStep2: "नीचे का कार्ड किसी भी कर्मचारी, पुलिस या स्वयंसेवक को दिखाएँ (अरबी में है)।",
  ifLostStep3: "अपने मक्तब मैनेजर को कॉल करें — नंबर नीचे है।",
  ifLostStep4: "गंभीर या तबियत खराब हो तो सऊदी आपातकाल 911 या हज हेल्पलाइन पर कॉल करें।",
  showCardTitle: "यह कार्ड किसी को भी दिखाएँ",
  showCardDesc: "सऊदी अरब में कर्मचारी, पुलिस और स्वयंसेवक अरबी पढ़ते हैं।",
  showCardLabelMaktab: "मक्तब",
  showCardLabelStreet: "कैंप / गली",
  showCardLabelManager: "मैनेजर",
  showCardLabelLost: "मैं रास्ता भूल गया हूँ। कृपया मुझे मेरे मीना कैंप तक पहुँचने में मदद करें।",
  showCardArabicLine: "أنا تائه، أرجو مساعدتي للعودة إلى مخيمي في منى.",
  emergencyTitle: "आपातकाल",
  saudiEmergency: "सऊदी आपातकाल 911",
  hajjHelpline: "हज हेल्पलाइन (भारत)",
  call: "कॉल",
  qaTitle: "बिछड़ गए? अपने कैंप वापस",
  qaSubtitle: "एक बार मक्तब सहेजें · एक टैप पर रास्ता, संपर्क और अरबी कार्ड",
  qaCta: "लॉस्ट मोड खोलें",
};

const ta: ReturnToCampLabels = {
  ...en,
  title: "என் முகாமுக்குத் திரும்பு",
  subtitle: "தொலைந்தால் — சேமித்த மக்தப், வழி மற்றும் அவசர எண்கள்",
  qaTitle: "தொலைந்தீரா? முகாமுக்குத் திரும்பு",
  qaSubtitle: "மக்தப் ஒருமுறை சேமி · ஒரு தட்டில் வழி, தொடர்புகள் & அரபு உதவி அட்டை",
  qaCta: "தொலைந்த பயன்முறை திற",
  showCardArabicLine: "أنا تائه، أرجو مساعدتي للعودة إلى مخيمي في منى.",
};

const te: ReturnToCampLabels = {
  ...en,
  title: "నా శిబిరానికి తిరిగి",
  subtitle: "మీరు తప్పిపోతే — సేవ్ చేసిన మక్తబ్, మార్గం మరియు అత్యవసర నంబర్లు",
  qaTitle: "తప్పిపోయారా? శిబిరానికి తిరిగి",
  qaSubtitle: "మక్తబ్ ఒకసారి సేవ్ · ఒక ట్యాప్‌లో మార్గం, పరిచయాలు & అరబిక్ కార్డ్",
  qaCta: "లాస్ట్ మోడ్ తెరవండి",
  showCardArabicLine: "أنا تائه، أرجو مساعدتي للعودة إلى مخيمي في منى.",
};

const mr: ReturnToCampLabels = {
  ...en,
  title: "माझ्या कॅम्पकडे परत",
  subtitle: "जर तुम्ही हरवलात — सेव्ह केलेला मक्तब, मार्ग व आपत्कालीन नंबर",
  qaTitle: "हरवलात? कॅम्पकडे परत",
  qaSubtitle: "मक्तब एकदा सेव्ह करा · एका टॅपवर मार्ग, संपर्क व अरबी कार्ड",
  qaCta: "लॉस्ट मोड उघडा",
  showCardArabicLine: "أنا تائه، أرجو مساعدتي للعودة إلى مخيمي في منى.",
};

const bn: ReturnToCampLabels = {
  ...en,
  title: "আমার ক্যাম্পে ফিরে",
  subtitle: "হারিয়ে গেলে — সংরক্ষিত মাকতাব, পথ ও জরুরি নম্বর",
  qaTitle: "হারিয়েছেন? ক্যাম্পে ফিরুন",
  qaSubtitle: "মাকতাব একবার সংরক্ষণ · এক ট্যাপে পথ, যোগাযোগ ও আরবি কার্ড",
  qaCta: "লস্ট মোড খুলুন",
  showCardArabicLine: "أنا تائه، أرجو مساعدتي للعودة إلى مخيمي في منى.",
};

const or: ReturnToCampLabels = {
  ...en,
  title: "ମୋ ଶିବିରକୁ ଫେରନ୍ତୁ",
  subtitle: "ଯଦି ହଜିଯାଆନ୍ତି — ସଂରକ୍ଷିତ ମକ୍ତବ, ରାସ୍ତା ଓ ଜରୁରୀ ନମ୍ବର",
  qaTitle: "ହଜିଗଲେ? ଶିବିରକୁ ଫେରନ୍ତୁ",
  qaSubtitle: "ମକ୍ତବ ଥରେ ସଂରକ୍ଷଣ କରନ୍ତୁ · ଏକ ଟ୍ୟାପ୍ ରେ ରାସ୍ତା, ଯୋଗାଯୋଗ ଓ ଆରବୀ କାର୍ଡ",
  qaCta: "ଲଷ୍ଟ ମୋଡ୍ ଖୋଲନ୍ତୁ",
  showCardArabicLine: "أنا تائه، أرجو مساعدتي للعودة إلى مخيمي في منى.",
};

const ml: ReturnToCampLabels = {
  ...en,
  title: "എന്റെ ക്യാമ്പിലേക്ക് മടങ്ങുക",
  subtitle: "നഷ്ടപ്പെട്ടാൽ — സേവ് ചെയ്ത മക്തബ്, വഴി, അടിയന്തര നമ്പറുകൾ",
  qaTitle: "നഷ്ടപ്പെട്ടോ? ക്യാമ്പിലേക്ക്",
  qaSubtitle: "മക്തബ് ഒരിക്കൽ സേവ് · ഒറ്റ ടാപ്പിൽ വഴി, കോൺടാക്റ്റുകൾ & അറബി കാർഡ്",
  qaCta: "ലോസ്റ്റ് മോഡ് തുറക്കുക",
  showCardArabicLine: "أنا تائه، أرجو مساعدتي للعودة إلى مخيمي في منى.",
};

const pa: ReturnToCampLabels = {
  ...en,
  title: "ਆਪਣੇ ਕੈਂਪ ਵਾਪਸ",
  subtitle: "ਜੇ ਤੁਸੀਂ ਗੁਆਚ ਜਾਓ — ਸੇਵ ਕੀਤਾ ਮਕਤਬ, ਰਸਤਾ ਤੇ ਐਮਰਜੈਂਸੀ ਨੰਬਰ",
  qaTitle: "ਗੁਆਚੇ? ਕੈਂਪ ਵਾਪਸ",
  qaSubtitle: "ਮਕਤਬ ਇੱਕ ਵਾਰ ਸੇਵ ਕਰੋ · ਇੱਕ ਟੈਪ 'ਤੇ ਰਸਤਾ, ਸੰਪਰਕ ਤੇ ਅਰਬੀ ਕਾਰਡ",
  qaCta: "ਲੌਸਟ ਮੋਡ ਖੋਲ੍ਹੋ",
  showCardArabicLine: "أنا تائه، أرجو مساعدتي للعودة إلى مخيمي في منى.",
};

const MAP: Record<Language, ReturnToCampLabels> = {
  en, ar, ur, hi, ta, te, mr, bn, or, ml, pa,
  tr: en, ru: en,
};

export const getReturnToCampLabels = (lang: Language): ReturnToCampLabels =>
  MAP[lang] ?? en;
