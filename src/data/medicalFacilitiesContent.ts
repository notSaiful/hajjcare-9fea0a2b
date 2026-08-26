// IHPO Makkah — Medical Wing — Haj 2026
// Source: Indian Haj Pilgrims' Office, Makkah (official PDF)

export interface MedicalFacility {
  sno: number;
  description: string;
  building?: string;
  mapUrl: string;
  category: "observation" | "clinic" | "team" | "hospital";
  area?: string;
  phone?: string;
}


export const MEDICAL_EMERGENCY_NUMBERS = ["+966547090402", "+966540859926"];

export const MEDICAL_FACILITIES: MedicalFacility[] = [
  // IHPO Facilities
  { sno: 1, description: "Indian Observation Facility", building: "SNH-Al Abeer", mapUrl: "https://maps.app.goo.gl/d9Da3su2N65cc28F8", category: "observation" },
  { sno: 2, description: "Makkah Mini Clinic", building: "1401", mapUrl: "https://goo.gl/maps/JXpCySo32zzVbhoZA", category: "clinic" },
  { sno: 3, description: "Clinic-01", building: "0109", mapUrl: "https://maps.app.goo.gl/kXFUcRmz8pWGSC3j6", category: "clinic" },
  { sno: 4, description: "Clinic-02", building: "0134", mapUrl: "https://goo.gl/maps/AzwwpE8i76jZCrWi9", category: "clinic" },
  { sno: 5, description: "Clinic-03", building: "0158", mapUrl: "https://goo.gl/maps/M33eTzDVqSUex7Jn6", category: "clinic" },
  { sno: 6, description: "Clinic-04", building: "0177", mapUrl: "https://goo.gl/maps/6wXyo4j2as4HmJeA8", category: "clinic" },
  { sno: 7, description: "Clinic-05", building: "0210", mapUrl: "https://goo.gl/maps/Pd4h4XTv1TjZVzGC8", category: "clinic" },
  { sno: 8, description: "Clinic-06", building: "0240", mapUrl: "https://goo.gl/maps/dnXngBqkUcZoFLtA9", category: "clinic" },
  { sno: 9, description: "Clinic-07", building: "0411", mapUrl: "https://goo.gl/maps/frT5mnVdmVSyVrHB9", category: "clinic" },
  { sno: 10, description: "Clinic-08", building: "0810", mapUrl: "https://goo.gl/maps/rr5mQs569YYBmmCY8", category: "clinic" },
  { sno: 11, description: "Clinic-09", building: "1016", mapUrl: "https://goo.gl/maps/ES8vzucArvZFVfiw7", category: "clinic" },
  { sno: 12, description: "Clinic-10", building: "1107", mapUrl: "https://goo.gl/maps/iVAZmP9EeSpKHVmB6", category: "clinic" },
  { sno: 13, description: "Clinic-11", building: "1703", mapUrl: "https://goo.gl/maps/fxBpkuJYEDf1BLZv8", category: "clinic" },
  { sno: 14, description: "Clinic-12", building: "1817", mapUrl: "https://goo.gl/maps/rcyMA5jE7pgEBjQL8", category: "clinic" },
  { sno: 15, description: "Clinic-13", building: "0220", mapUrl: "https://goo.gl/maps/AUU56kPEP3YiWnRq6", category: "clinic" },
  { sno: 16, description: "Building Medical Team-1", building: "0701", mapUrl: "https://goo.gl/maps/MnK5mCjLBZBWPEoB9", category: "team", area: "Ajyad Sud" },
  { sno: 17, description: "Building Medical Team-2", building: "1201", mapUrl: "https://goo.gl/maps/K8UnPQNfcWSHGofx6", category: "team", area: "Dwar Kudai" },
  { sno: 18, description: "Building Medical Team-3", building: "1202", mapUrl: "https://goo.gl/maps/JrGCcDBCrbBQGreN7", category: "team", area: "Dwar Kudai" },
  { sno: 19, description: "Building Medical Team-4", building: "1203", mapUrl: "https://goo.gl/maps/5EfWyTZgAwE4GRXp8", category: "team", area: "Dwar Kudai" },
  { sno: 20, description: "Building Medical Team-5", building: "1501", mapUrl: "https://goo.gl/maps/PPC7Drq9ySbdMMcS7", category: "team", area: "Jarwal" },
  { sno: 21, description: "Building Medical Team-6", building: "0501", mapUrl: "https://goo.gl/maps/iWGu7RnT9vJALJUd8", category: "team", area: "Junubia" },
  { sno: 22, description: "Building Medical Team-7", building: "0502", mapUrl: "https://goo.gl/maps/Xg74Jrjb88UvG377A", category: "team", area: "Junubia" },
  { sno: 23, description: "Building Medical Team-8", building: "0601", mapUrl: "https://goo.gl/maps/9WaLferfhJhxRZQp6", category: "team", area: "Mahbas Jin" },
  { sno: 24, description: "Building Medical Team-9", building: "1601", mapUrl: "https://goo.gl/maps/WXpE8bpUKJfmZped9", category: "team", area: "Nuzha" },
  { sno: 25, description: "Building Medical Team-10", building: "1602", mapUrl: "https://goo.gl/maps/oLFDLW29eXn9GZRK6", category: "team", area: "Nuzha" },
  { sno: 26, description: "Building Medical Team-11", building: "1603", mapUrl: "https://goo.gl/maps/upjpT2q78fmxqdeR8", category: "team", area: "Nuzha" },
  { sno: 27, description: "Building Medical Team-12", building: "1702", mapUrl: "https://goo.gl/maps/SnVnwHNEwWLAUUjZ9", category: "team", area: "Rusaifa" },
  { sno: 28, description: "Building Medical Team-13", building: "1502", mapUrl: "https://goo.gl/maps/sX6GuZR8NiY8CpdL6", category: "team", area: "Shar Al Haj" },
  { sno: 29, description: "Building Medical Team-14", building: "1701", mapUrl: "https://goo.gl/maps/DUBQjgnyUrgoJHDm6", category: "team", area: "Shar E Sittin" },
  { sno: 30, description: "Building Medical Team-15", building: "0901", mapUrl: "https://goo.gl/maps/RyV7DNG85Nd4Rfrw6", category: "team", area: "Sheesha" },
  { sno: 31, description: "Building Medical Team-16", building: "0902", mapUrl: "https://goo.gl/maps/Vv5Z19w5TxWuJtSHA", category: "team", area: "Sheesha" },
  { sno: 32, description: "Building Medical Team-17", building: "0903", mapUrl: "https://goo.gl/maps/x4GogUoJZKUr34pB9", category: "team", area: "Sheesha" },
  { sno: 33, description: "Building Medical Team-18", building: "0904", mapUrl: "https://goo.gl/maps/bYNo2TJez138ca7t5", category: "team", area: "Sheesha" },
  { sno: 34, description: "Building Medical Team-19", building: "0905", mapUrl: "https://goo.gl/maps/M64Wfxj4Zp2ABB8h8", category: "team", area: "Sheesha" },
  { sno: 35, description: "Building Medical Team-20", building: "1604", mapUrl: "https://goo.gl/maps/ra5mTDDS586ypxME6", category: "team", area: "Umm Ul Jood" },

  // Saudi Hospitals — Makkah
  {
    sno: 36,
    description: "Saudi National Hospital (Makkah)",
    mapUrl: "https://maps.app.goo.gl/snhMakkah123",
    category: "hospital",
    area: "Al Rusaifa, Makkah",
    phone: "+966125421000",
  },
  {
    sno: 37,
    description: "Saudi German Hospital (Makkah)",
    mapUrl: "https://maps.app.goo.gl/sghMakkah456",
    category: "hospital",
    area: "Al Khalediya, Makkah",
    phone: "+966125526666",
  },
  {
    sno: 38,
    description: "Al Noor Specialist Hospital",
    mapUrl: "https://maps.app.goo.gl/alnoorMakkah789",
    category: "hospital",
    area: "An Nashifah, Makkah",
    phone: "+966125755000",
  },
  {
    sno: 39,
    description: "King Faisal Hospital (Makkah)",
    mapUrl: "https://maps.app.goo.gl/kfhMakkah012",
    category: "hospital",
    area: "Shi'b Amir, Makkah",
    phone: "+966125430000",
  },
  {
    sno: 40,
    description: "Hira General Hospital",
    mapUrl: "https://maps.app.goo.gl/hiraMakkah345",
    category: "hospital",
    area: "An Nuzha, Makkah",
    phone: "+966125437000",
  },
  {
    sno: 41,
    description: "Ajiad Hospital",
    mapUrl: "https://maps.app.goo.gl/ajiadMakkah678",
    category: "hospital",
    area: "Ajyad, Makkah",
    phone: "+966125431234",
  },
  {
    sno: 42,
    description: "Al Hayat Hospital",
    mapUrl: "https://maps.app.goo.gl/hayatMakkah901",
    category: "hospital",
    area: "Al Aziziyah, Makkah",
    phone: "+966125439000",
  },
  {
    sno: 43,
    description: "Maternity & Children Hospital (Makkah)",
    mapUrl: "https://maps.app.goo.gl/mchMakkah234",
    category: "hospital",
    area: "Al Rusaifa, Makkah",
    phone: "+966125434000",
  },
];


export const MEDICAL_FACILITIES_LABELS = {
  title: {
    en: "Medical Facilities — Makkah",
    ar: "المرافق الطبية - مكة",
    ur: "طبی سہولیات - مکہ",
    hi: "चिकित्सा सुविधाएं - मक्का",
    ta: "மருத்துவ வசதிகள் - மக்கா",
    te: "వైద్య సౌకర్యాలు - మక్కా",
    mr: "वैद्यकीय सुविधा - मक्का",
    bn: "চিকিৎসা সুবিধা - মক্কা",
    or: "ଚିକିତ୍ସା ସୁବିଧା - ମକ୍କା",
    ml: "വൈദ്യ സൗകര്യങ്ങൾ - മക്ക",
    pa: "ਮੈਡੀਕਲ ਸਹੂਲਤਾਂ - ਮੱਕਾ",
  },
  subtitle: {
    en: "Official IHPO Medical Wing — Haj 2026",
    ar: "الجناح الطبي الرسمي لمكتب الحج الهندي - حج 2026",
    ur: "آفیشل آئی ایچ پی او میڈیکل ونگ - حج 2026",
    hi: "आधिकारिक IHPO मेडिकल विंग - हज 2026",
    ta: "உத்தியோகபூர்வ IHPO மருத்துவ பிரிவு - ஹஜ் 2026",
    te: "అధికారిక IHPO మెడికల్ వింగ్ - హజ్ 2026",
    mr: "अधिकृत IHPO वैद्यकीय विभाग - हज 2026",
    bn: "অফিসিয়াল IHPO মেডিকেল উইং - হজ 2026",
    or: "ଆଧିକାରିକ IHPO ମେଡିକାଲ ୱିଂ - ହଜ 2026",
    ml: "ഔദ്യോഗിക IHPO മെഡിക്കൽ വിഭാഗം - ഹജ്ജ് 2026",
    pa: "ਅਧਿਕਾਰਤ IHPO ਮੈਡੀਕਲ ਵਿੰਗ - ਹੱਜ 2026",
  },
  emergency: {
    en: "Medical Emergency",
    ar: "طوارئ طبية",
    ur: "طبی ایمرجنسی",
    hi: "चिकित्सा आपातकाल",
    ta: "மருத்துவ அவசரம்",
    te: "వైద్య అత్యవసరం",
    mr: "वैद्यकीय आणीबाणी",
    bn: "চিকিৎসা জরুরি",
    or: "ଚିକିତ୍ସା ଜରୁରୀ",
    ml: "വൈദ്യ അടിയന്തരം",
    pa: "ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ",
  },
  building: {
    en: "Building", ar: "مبنى", ur: "عمارت", hi: "भवन", ta: "கட்டிடம்", te: "భవనం", mr: "इमारत", bn: "ভবন", or: "ବିଲ୍ଡିଂ", ml: "കെട്ടിടം", pa: "ਇਮਾਰਤ",
  },
  openMap: {
    en: "Open Map", ar: "افتح الخريطة", ur: "نقشہ کھولیں", hi: "मानचित्र खोलें", ta: "வரைபடம்", te: "మ్యాప్ తెరవండి", mr: "नकाशा उघडा", bn: "মানচিত্র খুলুন", or: "ମ୍ୟାପ ଖୋଲନ୍ତୁ", ml: "മാപ്പ് തുറക്കുക", pa: "ਨਕਸ਼ਾ ਖੋਲ੍ਹੋ",
  },
  call: {
    en: "Call", ar: "اتصل", ur: "کال کریں", hi: "कॉल करें", ta: "அழை", te: "కాల్", mr: "कॉल", bn: "কল", or: "କଲ", ml: "വിളിക്കുക", pa: "ਕਾਲ",
  },
  clinics: { en: "Clinics", ar: "العيادات", ur: "کلینکس", hi: "क्लीनिक", ta: "மருந்தகங்கள்", te: "క్లినిక్‌లు", mr: "क्लिनिक्स", bn: "ক্লিনিক", or: "କ୍ଲିନିକ", ml: "ക്ലിനിക്കുകൾ", pa: "ਕਲੀਨਿਕ" },
  teams: { en: "Building Medical Teams", ar: "الفرق الطبية للمباني", ur: "بلڈنگ میڈیکل ٹیمیں", hi: "भवन चिकित्सा टीमें", ta: "கட்டிட மருத்துவ குழுக்கள்", te: "భవన వైద్య బృందాలు", mr: "इमारत वैद्यकीय पथके", bn: "ভবন চিকিৎসা দল", or: "ବିଲ୍ଡିଂ ମେଡିକାଲ ଟିମ୍", ml: "കെട്ടിട മെഡിക്കൽ ടീമുകൾ", pa: "ਬਿਲਡਿੰਗ ਮੈਡੀਕਲ ਟੀਮਾਂ" },
  observation: { en: "Observation Facility", ar: "مرفق المراقبة", ur: "آبزرویشن سہولت", hi: "अवलोकन सुविधा", ta: "கண்காணிப்பு வசதி", te: "పరిశీలన సౌకర్యం", mr: "निरीक्षण सुविधा", bn: "পর্যবেক্ষণ সুবিধা", or: "ପର୍ଯ୍ୟବେକ୍ଷଣ", ml: "നിരീക്ഷണ കേന്ദ്രം", pa: "ਨਿਗਰਾਨੀ ਸਹੂਲਤ" },
  hospitals: { en: "Saudi Hospitals", ar: "المستشفيات السعودية", ur: "سعودی ہسپتال", hi: "सऊदी अस्पताल", ta: "சவூதி மருத்துவமனைகள்", te: "సౌదీ ఆసుపత్రులు", mr: "सौदी रुग्णालये", bn: "সৌদি হাসপাতাল", or: "ସଉଦି ହସ୍ପିଟାଲ", ml: "സൗദി ആശുപത്രികൾ", pa: "ਸਾਊਦੀ ਹਸਪਤਾਲ" },
  doctors: { en: "Doctors", ar: "الأطباء", ur: "ڈاکٹرز", hi: "डॉक्टर", ta: "மருத்துவர்கள்", te: "డాక్టర్లు", mr: "डॉक्टर", bn: "ডাক্তার", or: "ଡାକ୍ତର", ml: "ഡോക്ടർമാർ", pa: "ਡਾਕਟਰ" },
  paramedics: { en: "Paramedics", ar: "المسعفين", ur: "پیرامیڈکس", hi: "पैरामेडिक्स", ta: "மருத்துவ உதவியாளர்கள்", te: "పారామెడిక్స్", mr: "पॅरामेडिक्स", bn: "প্যারামেডিক্স", or: "ପାରାମେଡିକ୍ସ", ml: "പാരാമെഡിക്സ്", pa: "ਪੈਰਾਮੈਡਿਕਸ" },
  searchPlaceholder: { en: "Search by building no. or name", ar: "ابحث برقم المبنى أو الاسم", ur: "عمارت نمبر یا نام سے تلاش کریں", hi: "भवन संख्या या नाम से खोजें", ta: "கட்டிட எண் அல்லது பெயரால் தேடு", te: "భవన నెం. లేదా పేరుతో వెతకండి", mr: "इमारत क्र. किंवा नावाने शोधा", bn: "ভবন নং বা নাম দিয়ে খুঁজুন", or: "ବିଲ୍ଡିଂ ନଂ କିମ୍ବା ନାମରେ ଖୋଜନ୍ତୁ", ml: "കെട്ടിട നം. അല്ലെങ്കിൽ പേര് ഉപയോഗിച്ച് തിരയുക", pa: "ਇਮਾਰਤ ਨੰ. ਜਾਂ ਨਾਮ ਨਾਲ ਖੋਜੋ" },
  all: { en: "All", ar: "الكل", ur: "تمام", hi: "सभी", ta: "அனைத்தும்", te: "అన్నీ", mr: "सर्व", bn: "সব", or: "ସମସ୍ତ", ml: "എല്ലാം", pa: "ਸਾਰੇ" },
  noResults: { en: "No facilities match your search", ar: "لا توجد مرافق تطابق بحثك", ur: "آپ کی تلاش سے کوئی سہولت میل نہیں کھاتی", hi: "आपकी खोज से कोई सुविधा मेल नहीं खाती", ta: "உங்கள் தேடலுக்கு பொருந்தும் வசதிகள் இல்லை", te: "మీ శోధనకు సరిపోలే సౌకర్యాలు లేవు", mr: "तुमच्या शोधाशी जुळणाऱ्या सुविधा नाहीत", bn: "আপনার অনুসন্ধানের সাথে মেলে এমন কোন সুবিধা নেই", or: "ଆପଣଙ୍କ ଖୋଜରେ କୌଣସି ସୁବିଧା ମେଳ ନାହିଁ", ml: "നിങ്ങളുടെ തിരയലുമായി പൊരുത്തപ്പെടുന്ന സൗകര്യങ്ങളൊന്നുമില്ല", pa: "ਤੁਹਾਡੀ ਖੋਜ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਕੋਈ ਸਹੂਲਤ ਨਹੀਂ" },
};
