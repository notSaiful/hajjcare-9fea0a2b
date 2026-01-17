import { Phone, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useMemo } from "react";

interface SHCContact {
  state: string;
  stateHi: string;
  stateUr: string;
  stateAr: string;
  chairman: string;
  phone: string;
}

const SHC_CONTACTS: SHCContact[] = [
  { state: "Andaman & Nicobar", stateHi: "अंडमान और निकोबार", stateUr: "انڈمان و نکوبار", stateAr: "أندمان ونيكوبار", chairman: "The Chairman, Andaman Nicobar State Haj Committee", phone: "03192-233051" },
  { state: "Andhra Pradesh", stateHi: "आंध्र प्रदेश", stateUr: "آندھرا پردیش", stateAr: "أندرا براديش", chairman: "Mr. Ghouse Lazam", phone: "040-23298793" },
  { state: "Assam", stateHi: "असम", stateUr: "آسام", stateAr: "آسام", chairman: "Mr. Nakibur Zaman", phone: "0361-2237296" },
  { state: "Bihar", stateHi: "बिहार", stateUr: "بہار", stateAr: "بيهار", chairman: "Mr. Abdul Haque", phone: "0612-2203315" },
  { state: "Chandigarh", stateHi: "चंडीगढ़", stateUr: "چنڈی گڑھ", stateAr: "شانديغار", chairman: "The Chairman, Chandigarh State Haj Committee", phone: "0172-2700053" },
  { state: "Chhattisgarh", stateHi: "छत्तीसगढ़", stateUr: "چھتیس گڑھ", stateAr: "تشاتيسغار", chairman: "Mr. Mohammed Aslam Khan", phone: "0771-4266646" },
  { state: "Dadra & Nagar Haveli", stateHi: "दादरा और नगर हवेली", stateUr: "دادرا و نگر حویلی", stateAr: "دادرا ونغار هافيلي", chairman: "The Chairman, Dadra & Nagar Haveli State Haj Committee", phone: "0260-2642340" },
  { state: "Daman & Diu", stateHi: "दमन और दीव", stateUr: "دمن و دیو", stateAr: "دامان وديو", chairman: "The Chairman, Daman & Diu State Haj Committee", phone: "0260-2230922" },
  { state: "Delhi", stateHi: "दिल्ली", stateUr: "دہلی", stateAr: "دلهي", chairman: "Ms. Kausar Jahan", phone: "011-23230507" },
  { state: "Goa", stateHi: "गोवा", stateUr: "گوا", stateAr: "غوا", chairman: "Shri Urfan Mulla", phone: "0832-6573435" },
  { state: "Gujarat", stateHi: "गुजरात", stateUr: "گجرات", stateAr: "غوجارات", chairman: "Mr. Iqbaal Sayed", phone: "079-23254265" },
  { state: "Haryana", stateHi: "हरियाणा", stateUr: "ہریانہ", stateAr: "هاريانا", chairman: "Mr. Mohsin Choudhary", phone: "0172-2740229" },
  { state: "Himachal Pradesh", stateHi: "हिमाचल प्रदेश", stateUr: "ہماچل پردیش", stateAr: "هيماتشال براديش", chairman: "The Chairman, Himachal Pradesh State Haj Committee", phone: "0177-2626450" },
  { state: "UT Jammu & Kashmir", stateHi: "जम्मू और कश्मीर", stateUr: "جموں و کشمیر", stateAr: "جامو وكشمير", chairman: "Ms. Safeena Baig", phone: "0194-2495367" },
  { state: "Jharkhand", stateHi: "झारखंड", stateUr: "جھارکھنڈ", stateAr: "جهارخاند", chairman: "Dr. Irfan Ansari", phone: "0651-2283100" },
  { state: "Karnataka", stateHi: "कर्नाटक", stateUr: "کرناٹک", stateAr: "كارناتاكا", chairman: "Mr. S. Zulfiqar Ahamed Khan", phone: "080-28567673" },
  { state: "Kerala", stateHi: "केरल", stateUr: "کیرالہ", stateAr: "كيرالا", chairman: "Dr. Hussain Sakhafi Chullikkodu", phone: "0483-2710717" },
  { state: "Lakshadweep", stateHi: "लक्षद्वीप", stateUr: "لکشدیپ", stateAr: "لاكشادويب", chairman: "The Chairman, Lakshadweep State Haj Committee", phone: "04896-262321" },
  { state: "Ladakh UT", stateHi: "लद्दाख", stateUr: "لداخ", stateAr: "لداخ", chairman: "The Chairman, Executive Officer Ladakh UT Haj Committee", phone: "01982-257561" },
  { state: "Madhya Pradesh", stateHi: "मध्य प्रदेश", stateUr: "مدھیہ پردیش", stateAr: "ماديا براديش", chairman: "Mr. Rafat Warsi", phone: "0755-2530139" },
  { state: "Maharashtra", stateHi: "महाराष्ट्र", stateUr: "مہاراشٹر", stateAr: "ماهاراشترا", chairman: "Mr. Aasif Usman Khan", phone: "022-22626786" },
  { state: "Manipur", stateHi: "मणिपुर", stateUr: "منی پور", stateAr: "مانيبور", chairman: "Shri Y. Antas Khan", phone: "0385-2461063" },
  { state: "Odisha", stateHi: "ओडिशा", stateUr: "اوڈیشہ", stateAr: "أوديشا", chairman: "The Chairman, Odisha State Haj Committee", phone: "0671-2301185" },
  { state: "Puducherry", stateHi: "पुडुचेरी", stateUr: "پونڈیچیری", stateAr: "بودوتشيري", chairman: "Haji Y. Ismai", phone: "0413-2343268" },
  { state: "Punjab", stateHi: "पंजाब", stateUr: "پنجاب", stateAr: "بنجاب", chairman: "Mr. Mufti Mohammad Khalil Qasmi", phone: "0172-2747641" },
  { state: "Rajasthan", stateHi: "राजस्थान", stateUr: "راجستھان", stateAr: "راجستان", chairman: "Mr. Amin Kaqzi", phone: "0141-2227016" },
  { state: "Tamil Nadu", stateHi: "तमिलनाडु", stateUr: "تمل ناڈو", stateAr: "تاميل نادو", chairman: "Mr. Thiru. A. Abdul Jabbar", phone: "044-28252519" },
  { state: "Telangana", stateHi: "तेलंगाना", stateUr: "تلنگانہ", stateAr: "تيلانغانا", chairman: "Janab Mohammed Saleem", phone: "040-23298793" },
  { state: "Tripura", stateHi: "त्रिपुरा", stateUr: "تریپورہ", stateAr: "تريبورا", chairman: "Mr. Shah Alam", phone: "0381-2325841" },
  { state: "Uttar Pradesh", stateHi: "उत्तर प्रदेश", stateUr: "اتر پردیش", stateAr: "أوتار براديش", chairman: "Mr. Mohsin Raza", phone: "0522-2620980" },
  { state: "Uttarakhand", stateHi: "उत्तराखंड", stateUr: "اتراکھنڈ", stateAr: "أوتاراخاند", chairman: "Mr. Khatib Ahmed", phone: "01332-297520" },
  { state: "West Bengal", stateHi: "पश्चिम बंगाल", stateUr: "مغربی بنگال", stateAr: "غرب البنغال", chairman: "Mohammed Nadimul Haque, M.P.", phone: "0522-22141562" },
];

const labels = {
  en: {
    title: "SHC Chairpersons Directory",
    subtitle: "Contact your State Haj Committee",
    searchPlaceholder: "Search by state name...",
    chairman: "Chairman",
    tapToCall: "Tap to call",
    noResults: "No states found matching your search",
  },
  ar: {
    title: "دليل رؤساء لجان الحج الولائية",
    subtitle: "تواصل مع لجنة الحج في ولايتك",
    searchPlaceholder: "ابحث باسم الولاية...",
    chairman: "الرئيس",
    tapToCall: "انقر للاتصال",
    noResults: "لم يتم العثور على ولايات تطابق بحثك",
  },
  ur: {
    title: "ایس ایچ سی چیئرپرسنز ڈائریکٹری",
    subtitle: "اپنی ریاستی حج کمیٹی سے رابطہ کریں",
    searchPlaceholder: "ریاست کے نام سے تلاش کریں...",
    chairman: "چیئرمین",
    tapToCall: "کال کرنے کے لیے ٹیپ کریں",
    noResults: "آپ کی تلاش سے مماثل کوئی ریاست نہیں ملی",
  },
  hi: {
    title: "एसएचसी अध्यक्ष निर्देशिका",
    subtitle: "अपनी राज्य हज समिति से संपर्क करें",
    searchPlaceholder: "राज्य के नाम से खोजें...",
    chairman: "अध्यक्ष",
    tapToCall: "कॉल करने के लिए टैप करें",
    noResults: "आपकी खोज से मेल खाने वाला कोई राज्य नहीं मिला",
  },
  ta: {
    title: "SHC தலைவர்கள் அடைவு",
    subtitle: "உங்கள் மாநில ஹஜ் குழுவை தொடர்பு கொள்ளுங்கள்",
    searchPlaceholder: "மாநிலப் பெயரால் தேடுங்கள்...",
    chairman: "தலைவர்",
    tapToCall: "அழைக்க தட்டவும்",
    noResults: "உங்கள் தேடலுக்கு பொருந்தும் மாநிலங்கள் இல்லை",
  },
  te: {
    title: "SHC చైర్‌పర్సన్ల డైరెక్టరీ",
    subtitle: "మీ రాష్ట్ర హజ్ కమిటీని సంప్రదించండి",
    searchPlaceholder: "రాష్ట్రం పేరుతో శోధించండి...",
    chairman: "చైర్మన్",
    tapToCall: "కాల్ చేయడానికి నొక్కండి",
    noResults: "మీ శోధనకు సరిపోయే రాష్ట్రాలు కనుగొనబడలేదు",
  },
  mr: {
    title: "SHC अध्यक्ष निर्देशिका",
    subtitle: "आपल्या राज्य हज समितीशी संपर्क साधा",
    searchPlaceholder: "राज्याच्या नावाने शोधा...",
    chairman: "अध्यक्ष",
    tapToCall: "कॉल करण्यासाठी टॅप करा",
    noResults: "तुमच्या शोधाशी जुळणारी राज्ये सापडली नाहीत",
  },
  bn: {
    title: "SHC চেয়ারপারসন ডিরেক্টরি",
    subtitle: "আপনার রাজ্য হজ কমিটির সাথে যোগাযোগ করুন",
    searchPlaceholder: "রাজ্যের নাম দিয়ে অনুসন্ধান করুন...",
    chairman: "চেয়ারম্যান",
    tapToCall: "কল করতে ট্যাপ করুন",
    noResults: "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো রাজ্য পাওয়া যায়নি",
  },
  or: {
    title: "SHC ଅଧ୍ୟକ୍ଷ ନିର୍ଦ୍ଦେଶିକା",
    subtitle: "ଆପଣଙ୍କ ରାଜ୍ୟ ହଜ କମିଟି ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ",
    searchPlaceholder: "ରାଜ୍ୟ ନାମରେ ଖୋଜନ୍ତୁ...",
    chairman: "ଅଧ୍ୟକ୍ଷ",
    tapToCall: "କଲ୍ କରିବାକୁ ଟ୍ୟାପ୍ କରନ୍ତୁ",
    noResults: "ଆପଣଙ୍କ ସନ୍ଧାନ ସହ ମେଳ ଖାଉଥିବା କୌଣସି ରାଜ୍ୟ ମିଳିଲା ନାହିଁ",
  },
  ml: {
    title: "SHC ചെയർപേഴ്‌സൺ ഡയറക്ടറി",
    subtitle: "നിങ്ങളുടെ സംസ്ഥാന ഹജ്ജ് കമ്മിറ്റിയെ ബന്ധപ്പെടുക",
    searchPlaceholder: "സംസ്ഥാന പേര് ഉപയോഗിച്ച് തിരയുക...",
    chairman: "ചെയർമാൻ",
    tapToCall: "വിളിക്കാൻ ടാപ്പ് ചെയ്യുക",
    noResults: "നിങ്ങളുടെ തിരയലിന് പൊരുത്തമായ സംസ്ഥാനങ്ങൾ കണ്ടെത്തിയില്ല",
  },
  pa: {
    title: "SHC ਚੇਅਰਪਰਸਨ ਡਾਇਰੈਕਟਰੀ",
    subtitle: "ਆਪਣੀ ਰਾਜ ਹੱਜ ਕਮੇਟੀ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    searchPlaceholder: "ਰਾਜ ਦੇ ਨਾਮ ਨਾਲ ਖੋਜੋ...",
    chairman: "ਚੇਅਰਮੈਨ",
    tapToCall: "ਕਾਲ ਕਰਨ ਲਈ ਟੈਪ ਕਰੋ",
    noResults: "ਤੁਹਾਡੀ ਖੋਜ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਕੋਈ ਰਾਜ ਨਹੀਂ ਮਿਲੇ",
  },
};

export const SHCDirectory = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const l = labels[language as keyof typeof labels] || labels.en;

  const getStateName = (contact: SHCContact) => {
    switch (language) {
      case "hi":
        return contact.stateHi;
      case "ur":
        return contact.stateUr;
      case "ar":
        return contact.stateAr;
      default:
        return contact.state;
    }
  };

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return SHC_CONTACTS;
    const query = searchQuery.toLowerCase();
    return SHC_CONTACTS.filter(
      (contact) =>
        contact.state.toLowerCase().includes(query) ||
        contact.stateHi.includes(query) ||
        contact.stateUr.includes(query) ||
        contact.stateAr.includes(query) ||
        contact.chairman.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleCall = (phone: string) => {
    // Clean up phone number for dialing
    const cleanPhone = phone.split("/")[0].replace(/[^0-9-]/g, "").trim();
    window.location.href = `tel:${cleanPhone}`;
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">{l.title}</h2>
        <p className="text-sm text-muted-foreground">{l.subtitle}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={l.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Directory List */}
      <div className="space-y-3">
        {filteredContacts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{l.noResults}</p>
        ) : (
          filteredContacts.map((contact, index) => (
            <Card
              key={index}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
              onClick={() => handleCall(contact.phone)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">
                    {getStateName(contact)}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">{l.chairman}:</span> {contact.chairman}
                  </p>
                  <p className="text-sm text-primary font-medium mt-1">
                    {contact.phone}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{l.tapToCall}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
