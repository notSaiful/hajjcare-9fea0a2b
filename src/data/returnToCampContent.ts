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
  // Extended fields
  tentNumberLabel: string;
  tentNumberPlaceholder: string;
  sectorLabel: string;
  sectorPlaceholder: string;
  groupCompanyLabel: string;
  groupCompanyPlaceholder: string;
  busRouteLabel: string;
  busRoutePlaceholder: string;
  hotelLabel: string;
  hotelPlaceholder: string;
  leaderNameLabel: string;
  leaderNamePlaceholder: string;
  leaderPhoneLabel: string;
  leaderPhonePlaceholder: string;
  optionalHint: string;
  // Maktab card
  yourMaktab: string;
  campStreet: string;
  transport: string;
  bus: string;
  metro: string;
  // Actions
  openInMaps: string;
  navigateToCamp: string;
  callManager: string;
  callAssistant: string;
  callMinaHousing: string;
  callGroupLeader: string;
  callShi: string;
  shareLocation: string;
  shareLocationLoading: string;
  shareLocationError: string;
  speakArabic: string;
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
  showCardLabelLost: string;
  showCardArabicLine: string;
  // Helplines
  emergencyTitle: string;
  saudiEmergency: string;
  hajjHelpline: string;
  call: string;
  // Proactive AI banner
  farFromMinaTitle: string;
  farFromMinaDesc: string;
  // Quick action (home)
  qaTitle: string;
  qaSubtitle: string;
  qaCta: string;
  qaBadge: string;
  // Panic actions
  alertFamilyBtn: string;
  alertFamilyNoLeader: string;
  alertFamilySent: string;
  fullscreenCardBtn: string;
  fullscreenClose: string;
  fullscreenHint: string;
};

const en: ReturnToCampLabels = {
  title: "SafeReturn — Find My Camp",
  subtitle: "Lost? One tap to your Mina camp, leader & emergency help",
  back: "Back",
  savedTitle: "Your saved camp",
  noSavedTitle: "Save your camp details",
  noSavedDesc: "Save once. Then in one tap during panic you'll see camp address, group leader, route & an Arabic help card to show locals.",
  setMaktabBtn: "Save my camp",
  changeMaktabBtn: "Edit",
  saveBtn: "Save",
  cancelBtn: "Cancel",
  enterMaktabPlaceholder: "Maktab number (e.g. 28) — required",
  invalidMaktab: "Maktab not found. Please check the number.",
  tentNumberLabel: "Tent number",
  tentNumberPlaceholder: "e.g. 14 / A-12",
  sectorLabel: "Sector / Zone",
  sectorPlaceholder: "e.g. North Mina, Sector 3",
  groupCompanyLabel: "Group / Company",
  groupCompanyPlaceholder: "e.g. Al-Noor Travels",
  busRouteLabel: "Bus route",
  busRoutePlaceholder: "e.g. Bus 12 / Train Line C",
  hotelLabel: "Makkah hotel / building",
  hotelPlaceholder: "e.g. Ajyad, Building 502",
  leaderNameLabel: "Group leader name",
  leaderNamePlaceholder: "e.g. Imran Khan",
  leaderPhoneLabel: "Group leader phone",
  leaderPhonePlaceholder: "+91 9876543210",
  optionalHint: "Optional — fill what you know",
  yourMaktab: "Maktab",
  campStreet: "Camp / Street",
  transport: "Transport",
  bus: "Bus",
  metro: "Metro Train",
  openInMaps: "Open Mina in Google Maps",
  navigateToCamp: "Navigate to my camp",
  callManager: "Call Maktab Manager",
  callAssistant: "Call Assistant Manager",
  callMinaHousing: "Call Mina Camp Housing",
  callGroupLeader: "Call Group Leader",
  callShi: "Call Hajj Helpline (SHI)",
  shareLocation: "Share my live location",
  shareLocationLoading: "Getting location…",
  shareLocationError: "Could not get location. Enable GPS and try again.",
  speakArabic: "Speak help message (Arabic)",
  ifLostTitle: "If you are lost — do this",
  ifLostStep1: "Stay where you are. Sit in shade and drink water.",
  ifLostStep2: "Show the Arabic card below to any worker, police, or volunteer.",
  ifLostStep3: "Call your group leader or Maktab manager — numbers are below.",
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
  farFromMinaTitle: "You appear far from Mina",
  farFromMinaDesc: "Need help getting back? Tap Navigate or call your group leader.",
  qaTitle: "Lost? Return to Your Camp",
  qaSubtitle: "SafeReturn · One-tap route, leader call & Arabic help card · Works offline",
  qaCta: "Open SafeReturn",
  qaBadge: "Emergency",
  alertFamilyBtn: "I am LOST — Alert my family now",
  alertFamilyNoLeader: "Add a group leader phone in your saved camp to alert family in one tap.",
  alertFamilySent: "Opening WhatsApp with your location…",
  fullscreenCardBtn: "Show full-screen Arabic card",
  fullscreenClose: "Close",
  fullscreenHint: "Show this to any worker, police or volunteer nearby",
};

const ar: ReturnToCampLabels = {
  ...en,
  title: "عودة آمنة — اعثر على مخيمي",
  subtitle: "تائه؟ ضغطة واحدة إلى مخيمك في منى وقائد المجموعة والطوارئ",
  back: "رجوع",
  savedTitle: "مخيمك المحفوظ",
  noSavedTitle: "احفظ تفاصيل مخيمك",
  noSavedDesc: "احفظ مرة واحدة. ثم في حالة الذعر بضغطة واحدة ترى عنوان المخيم وقائد المجموعة والمسار وبطاقة عربية لإظهارها للسكان.",
  setMaktabBtn: "احفظ مخيمي",
  changeMaktabBtn: "تعديل",
  saveBtn: "حفظ",
  cancelBtn: "إلغاء",
  enterMaktabPlaceholder: "رقم المكتب (مثال: 28) — مطلوب",
  invalidMaktab: "المكتب غير موجود. يرجى التحقق من الرقم.",
  tentNumberLabel: "رقم الخيمة",
  tentNumberPlaceholder: "مثال: 14 / A-12",
  sectorLabel: "القطاع / المنطقة",
  sectorPlaceholder: "مثال: شمال منى، قطاع 3",
  groupCompanyLabel: "المجموعة / الشركة",
  groupCompanyPlaceholder: "مثال: النور للسفر",
  busRouteLabel: "خط الحافلة",
  busRoutePlaceholder: "مثال: حافلة 12 / مترو خط C",
  hotelLabel: "فندق / مبنى مكة",
  hotelPlaceholder: "مثال: أجياد، مبنى 502",
  leaderNameLabel: "اسم قائد المجموعة",
  leaderNamePlaceholder: "مثال: عمران خان",
  leaderPhoneLabel: "هاتف قائد المجموعة",
  leaderPhonePlaceholder: "+91 9876543210",
  optionalHint: "اختياري — املأ ما تعرفه",
  yourMaktab: "المكتب",
  campStreet: "المخيم / الشارع",
  bus: "حافلة",
  metro: "قطار المترو",
  openInMaps: "افتح منى في خرائط جوجل",
  navigateToCamp: "تنقل إلى مخيمي",
  callManager: "اتصل بمدير المكتب",
  callAssistant: "اتصل بمساعد المدير",
  callMinaHousing: "اتصل بإسكان منى",
  callGroupLeader: "اتصل بقائد المجموعة",
  callShi: "اتصل بخط مساعدة الحج",
  shareLocation: "شارك موقعي المباشر",
  shareLocationLoading: "جاري تحديد الموقع…",
  shareLocationError: "تعذر الحصول على الموقع. فعّل GPS وحاول مرة أخرى.",
  speakArabic: "نطق رسالة المساعدة (عربي)",
  ifLostTitle: "إذا ضللت الطريق — افعل ما يلي",
  ifLostStep1: "ابقَ مكانك. اجلس في الظل واشرب الماء.",
  ifLostStep2: "أظهر البطاقة العربية أدناه لأي عامل أو شرطي أو متطوع.",
  ifLostStep3: "اتصل بقائد مجموعتك أو مدير المكتب — الأرقام أدناه.",
  ifLostStep4: "إذا كان طارئاً، اتصل بالطوارئ السعودية 911 أو خط مساعدة الحج.",
  showCardTitle: "أظهر هذه البطاقة لأي شخص",
  showCardDesc: "العمال والشرطة والمتطوعون في السعودية يقرؤون العربية.",
  showCardLabelLost: "أنا تائه. أرجو مساعدتي للعودة إلى مخيمي في منى.",
  emergencyTitle: "طوارئ",
  saudiEmergency: "الطوارئ السعودية 911",
  hajjHelpline: "خط مساعدة الحج (الهند)",
  farFromMinaTitle: "يبدو أنك بعيد عن منى",
  farFromMinaDesc: "هل تحتاج مساعدة للعودة؟ اضغط تنقّل أو اتصل بقائد مجموعتك.",
  qaTitle: "تائه؟ عُد إلى مخيمك",
  qaSubtitle: "عودة آمنة · مسار وقائد وبطاقة عربية بضغطة · يعمل بدون إنترنت",
  qaCta: "افتح عودة آمنة",
  qaBadge: "طوارئ",
  alertFamilyBtn: "أنا تائه — أبلغ عائلتي الآن",
  alertFamilyNoLeader: "أضف رقم قائد المجموعة في مخيمك المحفوظ لإبلاغ العائلة بضغطة واحدة.",
  alertFamilySent: "جارٍ فتح واتساب مع موقعك…",
  fullscreenCardBtn: "اعرض البطاقة العربية بملء الشاشة",
  fullscreenClose: "إغلاق",
  fullscreenHint: "أظهر هذا لأي عامل أو شرطي أو متطوع قريب",
};

const ur: ReturnToCampLabels = {
  ...en,
  title: "سیف ریٹرن — اپنا کیمپ تلاش کریں",
  subtitle: "بچھڑ گئے؟ ایک ٹیپ پر کیمپ، گروپ لیڈر اور ایمرجنسی مدد",
  back: "واپس",
  savedTitle: "آپ کا محفوظ کیمپ",
  noSavedTitle: "اپنے کیمپ کی تفصیلات محفوظ کریں",
  noSavedDesc: "ایک بار محفوظ کر لیں۔ پھر گھبراہٹ میں ایک ٹیپ پر کیمپ کا پتہ، گروپ لیڈر، راستہ اور مقامی لوگوں کو دکھانے کے لیے عربی کارڈ ملے گا۔",
  setMaktabBtn: "میرا کیمپ محفوظ کریں",
  changeMaktabBtn: "ترمیم",
  saveBtn: "محفوظ کریں",
  cancelBtn: "منسوخ",
  enterMaktabPlaceholder: "مکتب نمبر (مثلاً 28) — لازمی",
  invalidMaktab: "مکتب نہیں ملا۔ نمبر چیک کریں۔",
  tentNumberLabel: "خیمہ نمبر",
  tentNumberPlaceholder: "مثلاً 14 / A-12",
  sectorLabel: "سیکٹر / زون",
  sectorPlaceholder: "مثلاً شمالی منیٰ، سیکٹر 3",
  groupCompanyLabel: "گروپ / کمپنی",
  groupCompanyPlaceholder: "مثلاً النور ٹریولز",
  busRouteLabel: "بس روٹ",
  busRoutePlaceholder: "مثلاً بس 12 / ٹرین لائن C",
  hotelLabel: "مکہ ہوٹل / عمارت",
  hotelPlaceholder: "مثلاً اجیاد، عمارت 502",
  leaderNameLabel: "گروپ لیڈر کا نام",
  leaderNamePlaceholder: "مثلاً عمران خان",
  leaderPhoneLabel: "گروپ لیڈر کا فون",
  leaderPhonePlaceholder: "+91 9876543210",
  optionalHint: "اختیاری — جو معلوم ہو وہ بھریں",
  yourMaktab: "مکتب",
  campStreet: "کیمپ / گلی",
  bus: "بس",
  metro: "میٹرو ٹرین",
  openInMaps: "گوگل میپس میں منیٰ کھولیں",
  navigateToCamp: "میرے کیمپ تک رہنمائی",
  callManager: "مکتب منیجر کو کال کریں",
  callAssistant: "اسسٹنٹ منیجر کو کال کریں",
  callMinaHousing: "منیٰ ہاؤسنگ کو کال کریں",
  callGroupLeader: "گروپ لیڈر کو کال کریں",
  callShi: "حج ہیلپ لائن کو کال کریں",
  shareLocation: "میری لائیو لوکیشن شیئر کریں",
  shareLocationLoading: "لوکیشن لی جا رہی ہے…",
  shareLocationError: "لوکیشن نہیں ملی۔ GPS آن کریں۔",
  speakArabic: "مدد کا پیغام (عربی) سنائیں",
  ifLostTitle: "اگر بچھڑ جائیں — یہ کریں",
  ifLostStep1: "وہیں رک جائیں۔ سائے میں بیٹھیں اور پانی پئیں۔",
  ifLostStep2: "نیچے کا عربی کارڈ کسی بھی کارکن، پولیس یا رضاکار کو دکھائیں۔",
  ifLostStep3: "اپنے گروپ لیڈر یا مکتب منیجر کو کال کریں — نمبر نیچے ہیں۔",
  ifLostStep4: "ہنگامی ہو تو سعودی ایمرجنسی 911 یا حج ہیلپ لائن کال کریں۔",
  showCardTitle: "یہ کارڈ کسی کو بھی دکھائیں",
  showCardDesc: "سعودی عرب میں کارکنان، پولیس اور رضاکار عربی پڑھتے ہیں۔",
  showCardLabelLost: "میں راستہ بھول گیا ہوں۔ براہ کرم مجھے میرے منیٰ کیمپ تک پہنچنے میں مدد کریں۔",
  emergencyTitle: "ایمرجنسی",
  saudiEmergency: "سعودی ایمرجنسی 911",
  hajjHelpline: "حج ہیلپ لائن (انڈیا)",
  farFromMinaTitle: "آپ منیٰ سے دور لگ رہے ہیں",
  farFromMinaDesc: "واپسی کے لیے مدد چاہیے؟ نیویگیٹ ٹیپ کریں یا گروپ لیڈر کو کال کریں۔",
  qaTitle: "بچھڑ گئے؟ اپنے کیمپ واپس",
  qaSubtitle: "سیف ریٹرن · ایک ٹیپ پر راستہ، لیڈر کال اور عربی کارڈ · آف لائن",
  qaCta: "سیف ریٹرن کھولیں",
  qaBadge: "ایمرجنسی",
  alertFamilyBtn: "میں بچھڑ گیا — ابھی فیملی کو الرٹ کریں",
  alertFamilyNoLeader: "ایک ٹیپ پر فیملی کو الرٹ کرنے کے لیے گروپ لیڈر کا فون شامل کریں۔",
  alertFamilySent: "آپ کی لوکیشن کے ساتھ واٹس ایپ کھل رہا ہے…",
  fullscreenCardBtn: "عربی کارڈ فل اسکرین دکھائیں",
  fullscreenClose: "بند کریں",
  fullscreenHint: "یہ قریب کے کسی کارکن، پولیس یا رضاکار کو دکھائیں",
};

const hi: ReturnToCampLabels = {
  ...en,
  title: "सेफरिटर्न — मेरा कैंप ढूँढें",
  subtitle: "बिछड़ गए? एक टैप पर कैंप, ग्रुप लीडर व आपातकालीन मदद",
  back: "वापस",
  savedTitle: "आपका सहेजा गया कैंप",
  noSavedTitle: "अपने कैंप की जानकारी सहेजें",
  noSavedDesc: "एक बार सहेजें। फिर घबराहट में एक टैप पर कैंप का पता, ग्रुप लीडर, रास्ता और स्थानीय लोगों को दिखाने के लिए अरबी कार्ड मिलेगा।",
  setMaktabBtn: "मेरा कैंप सहेजें",
  changeMaktabBtn: "बदलें",
  saveBtn: "सहेजें",
  cancelBtn: "रद्द",
  enterMaktabPlaceholder: "मक्तब नंबर (जैसे 28) — आवश्यक",
  invalidMaktab: "मक्तब नहीं मिला। नंबर जाँचें।",
  tentNumberLabel: "तंबू नंबर",
  tentNumberPlaceholder: "जैसे 14 / A-12",
  sectorLabel: "सेक्टर / ज़ोन",
  sectorPlaceholder: "जैसे उत्तर मीना, सेक्टर 3",
  groupCompanyLabel: "ग्रुप / कंपनी",
  groupCompanyPlaceholder: "जैसे अल-नूर ट्रैवल्स",
  busRouteLabel: "बस रूट",
  busRoutePlaceholder: "जैसे बस 12 / ट्रेन लाइन C",
  hotelLabel: "मक्का होटल / इमारत",
  hotelPlaceholder: "जैसे अजयाद, इमारत 502",
  leaderNameLabel: "ग्रुप लीडर का नाम",
  leaderNamePlaceholder: "जैसे इमरान खान",
  leaderPhoneLabel: "ग्रुप लीडर का फ़ोन",
  leaderPhonePlaceholder: "+91 9876543210",
  optionalHint: "वैकल्पिक — जो पता हो भरें",
  yourMaktab: "मक्तब",
  campStreet: "कैंप / गली",
  bus: "बस",
  metro: "मेट्रो ट्रेन",
  openInMaps: "गूगल मैप्स में मीना खोलें",
  navigateToCamp: "मेरे कैंप तक मार्गदर्शन",
  callManager: "मक्तब मैनेजर को कॉल करें",
  callAssistant: "सहायक मैनेजर को कॉल करें",
  callMinaHousing: "मीना हाउसिंग को कॉल करें",
  callGroupLeader: "ग्रुप लीडर को कॉल करें",
  callShi: "हज हेल्पलाइन को कॉल करें",
  shareLocation: "मेरी लाइव लोकेशन शेयर करें",
  shareLocationLoading: "लोकेशन ली जा रही है…",
  shareLocationError: "लोकेशन नहीं मिली। GPS चालू करें।",
  speakArabic: "मदद संदेश (अरबी) सुनाएँ",
  ifLostTitle: "यदि बिछड़ जाएँ — यह करें",
  ifLostStep1: "वहीं रुकें। छाया में बैठें और पानी पिएँ।",
  ifLostStep2: "नीचे का अरबी कार्ड किसी कर्मचारी, पुलिस या स्वयंसेवक को दिखाएँ।",
  ifLostStep3: "ग्रुप लीडर या मक्तब मैनेजर को कॉल करें — नंबर नीचे हैं।",
  ifLostStep4: "गंभीर हो तो सऊदी आपातकाल 911 या हज हेल्पलाइन कॉल करें।",
  showCardTitle: "यह कार्ड किसी को भी दिखाएँ",
  showCardDesc: "सऊदी अरब में कर्मचारी, पुलिस व स्वयंसेवक अरबी पढ़ते हैं।",
  showCardLabelLost: "मैं रास्ता भूल गया हूँ। कृपया मुझे मेरे मीना कैंप तक पहुँचने में मदद करें।",
  emergencyTitle: "आपातकाल",
  saudiEmergency: "सऊदी आपातकाल 911",
  hajjHelpline: "हज हेल्पलाइन (भारत)",
  farFromMinaTitle: "आप मीना से दूर लग रहे हैं",
  farFromMinaDesc: "वापसी के लिए मदद चाहिए? नेविगेट टैप करें या ग्रुप लीडर को कॉल करें।",
  qaTitle: "बिछड़ गए? अपने कैंप वापस",
  qaSubtitle: "सेफरिटर्न · एक टैप पर रास्ता, लीडर कॉल व अरबी कार्ड · ऑफ़लाइन",
  qaCta: "सेफरिटर्न खोलें",
  qaBadge: "आपातकाल",
};

const ta: ReturnToCampLabels = { ...en, qaTitle: "தொலைந்தீரா? முகாமுக்குத் திரும்பு", qaSubtitle: "சேஃப்-ரிட்டர்ன் · ஒரே தட்டில் வழி, தலைவர் & அரபு உதவி", qaCta: "சேஃப்-ரிட்டர்ன் திற", qaBadge: "அவசரம்" };
const te: ReturnToCampLabels = { ...en, qaTitle: "తప్పిపోయారా? శిబిరానికి తిరిగి", qaSubtitle: "సేఫ్‌రిటర్న్ · ఒక ట్యాప్‌లో మార్గం, లీడర్ & అరబిక్ సహాయం", qaCta: "సేఫ్‌రిటర్న్ తెరవండి", qaBadge: "అత్యవసరం" };
const mr: ReturnToCampLabels = { ...en, qaTitle: "हरवलात? कॅम्पकडे परत", qaSubtitle: "सेफरिटर्न · एका टॅपवर मार्ग, लीडर व अरबी मदत", qaCta: "सेफरिटर्न उघडा", qaBadge: "आपत्कालीन" };
const bn: ReturnToCampLabels = { ...en, qaTitle: "হারিয়েছেন? ক্যাম্পে ফিরুন", qaSubtitle: "সেফরিটার্ন · এক ট্যাপে পথ, লিডার ও আরবি সাহায্য", qaCta: "সেফরিটার্ন খুলুন", qaBadge: "জরুরি" };
const or: ReturnToCampLabels = { ...en, qaTitle: "ହଜିଗଲେ? ଶିବିରକୁ ଫେରନ୍ତୁ", qaSubtitle: "ସେଫ୍-ରିଟର୍ନ୍ · ଏକ ଟ୍ୟାପ୍ ରେ ରାସ୍ତା, ନେତା ଓ ଆରବୀ ସହାୟତା", qaCta: "ସେଫ୍-ରିଟର୍ନ୍ ଖୋଲନ୍ତୁ", qaBadge: "ଜରୁରୀ" };
const ml: ReturnToCampLabels = { ...en, qaTitle: "നഷ്ടപ്പെട്ടോ? ക്യാമ്പിലേക്ക്", qaSubtitle: "സേഫ്‌റിട്ടേൺ · ഒറ്റ ടാപ്പിൽ വഴി, ലീഡർ & അറബി സഹായം", qaCta: "സേഫ്‌റിട്ടേൺ തുറക്കുക", qaBadge: "അടിയന്തരം" };
const pa: ReturnToCampLabels = { ...en, qaTitle: "ਗੁਆਚੇ? ਕੈਂਪ ਵਾਪਸ", qaSubtitle: "ਸੇਫ਼ ਰਿਟਰਨ · ਇੱਕ ਟੈਪ 'ਤੇ ਰਸਤਾ, ਲੀਡਰ ਤੇ ਅਰਬੀ ਮਦਦ", qaCta: "ਸੇਫ਼ ਰਿਟਰਨ ਖੋਲ੍ਹੋ", qaBadge: "ਐਮਰਜੈਂਸੀ" };

const MAP: Record<Language, ReturnToCampLabels> = {
  en, ar, ur, hi, ta, te, mr, bn, or, ml, pa,
  tr: en, ru: en,
};

export const getReturnToCampLabels = (lang: Language): ReturnToCampLabels =>
  MAP[lang] ?? en;
