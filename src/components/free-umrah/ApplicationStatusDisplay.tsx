import { CheckCircle2, Clock, Eye, XCircle, Star, AlertCircle, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentReupload } from "@/components/DocumentReupload";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ApplicationStatusDisplayProps {
  checkResult: string;
  checkedApplicationId: string | null;
  formattedIdentifier: string;
  language: string;
  applicationIdLabel: string;
  updateDocumentLabel: string;
  onRecheck: () => void;
}

/* ─── Status Configuration ─────────────────────────────────────── */
const statusConfig = {
  SUBMITTED: {
    icon: Clock,
    color: "blue",
    step: 1,
  },
  UNDER_REVIEW: {
    icon: Eye,
    color: "amber",
    step: 2,
  },
  VERIFIED: {
    icon: CheckCircle2,
    color: "emerald",
    step: 3,
  },
  SELECTED: {
    icon: Star,
    color: "primary",
    step: 4,
  },
  REJECTED: {
    icon: XCircle,
    color: "red",
    step: -1,
  },
  not_found: {
    icon: AlertCircle,
    color: "muted",
    step: 0,
  },
} as const;

type StatusColor = "blue" | "amber" | "emerald" | "primary" | "red" | "muted";

const colorMap: Record<StatusColor, { text: string; bg: string; border: string; ring: string; dot: string; fill: string }> = {
  blue:    { text: "text-blue-600",    bg: "bg-blue-50",      border: "border-blue-200",   ring: "ring-blue-200",   dot: "bg-blue-500",    fill: "bg-blue-500" },
  amber:   { text: "text-amber-600",   bg: "bg-amber-50",     border: "border-amber-200",  ring: "ring-amber-200",  dot: "bg-amber-500",   fill: "bg-amber-500" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50",   border: "border-emerald-200",ring: "ring-emerald-200",dot: "bg-emerald-500", fill: "bg-emerald-500" },
  primary: { text: "text-primary",     bg: "bg-primary/10",   border: "border-primary/25", ring: "ring-primary/20", dot: "bg-primary",     fill: "bg-primary" },
  red:     { text: "text-destructive", bg: "bg-destructive/10",border: "border-destructive/20",ring: "ring-destructive/20",dot: "bg-destructive",fill: "bg-destructive" },
  muted:   { text: "text-muted-foreground", bg: "bg-muted",   border: "border-border",     ring: "ring-border",     dot: "bg-muted-foreground",fill: "bg-muted-foreground" },
};

/* ─── Timeline step icons ──────────────────────────────────────── */
const stepIcons = [Clock, Eye, CheckCircle2, Star];
const stepColors: StatusColor[] = ["blue", "amber", "emerald", "primary"];

/* ─── Labels (11 languages) ───────────────────────────────────── */
const labels = {
  en: {
    applicationId: "Application ID",
    currentStatus: "Current Status",
    statusTimeline: "Application Progress",
    submitted: "Submitted",
    underReview: "Under Review",
    verified: "Verified",
    selected: "Selected",
    rejected: "Rejected",
    notFound: "Application not found",
    statusDesc: {
      SUBMITTED:    "Your application has been received and is queued for review.",
      UNDER_REVIEW: "Our team is currently reviewing your application.",
      VERIFIED:     "Your application has been verified successfully.",
      SELECTED:     "Congratulations! You have been selected for Free Umrah.",
      REJECTED:     "Your application was not selected in this round.",
      not_found:    "No application found with this ID. Please check and try again.",
    },
    updateDocument: "Update Proof Document",
    recheck: "Refresh Status",
  },
  ar: {
    applicationId: "رقم الطلب",
    currentStatus: "الحالة الحالية",
    statusTimeline: "تقدم الطلب",
    submitted: "تم التقديم",
    underReview: "قيد المراجعة",
    verified: "تم التحقق",
    selected: "تم الاختيار",
    rejected: "مرفوض",
    notFound: "الطلب غير موجود",
    statusDesc: {
      SUBMITTED:    "تم استلام طلبك وهو في انتظار المراجعة.",
      UNDER_REVIEW: "فريقنا يراجع طلبك حالياً.",
      VERIFIED:     "تم التحقق من طلبك بنجاح.",
      SELECTED:     "تهانينا! تم اختيارك للعمرة المجانية.",
      REJECTED:     "لم يتم اختيار طلبك في هذه الجولة.",
      not_found:    "لم يتم العثور على طلب بهذا الرقم. يرجى التحقق والمحاولة مرة أخرى.",
    },
    updateDocument: "تحديث المستند",
    recheck: "تحديث الحالة",
  },
  ur: {
    applicationId: "درخواست نمبر",
    currentStatus: "موجودہ حیثیت",
    statusTimeline: "درخواست کی پیشرفت",
    submitted: "جمع کرائی گئی",
    underReview: "جائزہ میں",
    verified: "تصدیق شدہ",
    selected: "منتخب",
    rejected: "مسترد",
    notFound: "درخواست نہیں ملی",
    statusDesc: {
      SUBMITTED:    "آپ کی درخواست موصول ہو گئی اور جائزے کی قطار میں ہے۔",
      UNDER_REVIEW: "ہماری ٹیم آپ کی درخواست کا جائزہ لے رہی ہے۔",
      VERIFIED:     "آپ کی درخواست کامیابی سے تصدیق شدہ ہو گئی۔",
      SELECTED:     "مبارک ہو! آپ مفت عمرہ کے لیے منتخب ہو گئے۔",
      REJECTED:     "آپ کی درخواست اس راؤنڈ میں منتخب نہیں ہوئی۔",
      not_found:    "اس نمبر سے کوئی درخواست نہیں ملی۔ براہ کرم چیک کریں۔",
    },
    updateDocument: "دستاویز اپ ڈیٹ کریں",
    recheck: "حیثیت تازہ کریں",
  },
  hi: {
    applicationId: "आवेदन संख्या",
    currentStatus: "वर्तमान स्थिति",
    statusTimeline: "आवेदन प्रगति",
    submitted: "जमा किया गया",
    underReview: "समीक्षा में",
    verified: "सत्यापित",
    selected: "चयनित",
    rejected: "अस्वीकृत",
    notFound: "आवेदन नहीं मिला",
    statusDesc: {
      SUBMITTED:    "आपका आवेदन प्राप्त हो गया और समीक्षा की प्रतीक्षा में है।",
      UNDER_REVIEW: "हमारी टीम आपके आवेदन की समीक्षा कर रही है।",
      VERIFIED:     "आपका आवेदन सफलतापूर्वक सत्यापित हो गया।",
      SELECTED:     "बधाई हो! आप मुफ्त उमराह के लिए चयनित हो गए।",
      REJECTED:     "इस राउंड में आपका आवेदन चयनित नहीं हुआ।",
      not_found:    "इस ID से कोई आवेदन नहीं मिला। कृपया जांचें।",
    },
    updateDocument: "दस्तावेज़ अपडेट करें",
    recheck: "स्थिति ताज़ा करें",
  },
  ta: {
    applicationId: "விண்ணப்ப எண்",
    currentStatus: "தற்போதைய நிலை",
    statusTimeline: "விண்ணப்ப முன்னேற்றம்",
    submitted: "சமர்ப்பிக்கப்பட்டது",
    underReview: "மதிப்பாய்வில்",
    verified: "சரிபார்க்கப்பட்டது",
    selected: "தேர்ந்தெடுக்கப்பட்டது",
    rejected: "நிராகரிக்கப்பட்டது",
    notFound: "விண்ணப்பம் கிடைக்கவில்லை",
    statusDesc: {
      SUBMITTED:    "உங்கள் விண்ணப்பம் பெறப்பட்டு மதிப்பாய்வுக்காக காத்திருக்கிறது.",
      UNDER_REVIEW: "எங்கள் குழு உங்கள் விண்ணப்பத்தை மதிப்பாய்வு செய்கிறது.",
      VERIFIED:     "உங்கள் விண்ணப்பம் வெற்றிகரமாக சரிபார்க்கப்பட்டது.",
      SELECTED:     "வாழ்த்துக்கள்! நீங்கள் இலவச உம்ராவிற்கு தேர்ந்தெடுக்கப்பட்டீர்கள்.",
      REJECTED:     "இந்த சுற்றில் உங்கள் விண்ணப்பம் தேர்ந்தெடுக்கப்படவில்லை.",
      not_found:    "இந்த ID உடன் விண்ணப்பம் கிடைக்கவில்லை.",
    },
    updateDocument: "ஆவணம் புதுப்பிக்கவும்",
    recheck: "நிலையை புதுப்பிக்கவும்",
  },
  te: {
    applicationId: "దరఖాస్తు సంఖ్య",
    currentStatus: "ప్రస్తుత స్థితి",
    statusTimeline: "దరఖాస్తు పురోగతి",
    submitted: "సమర్పించబడింది",
    underReview: "సమీక్షలో",
    verified: "ధృవీకరించబడింది",
    selected: "ఎంపిక చేయబడింది",
    rejected: "తిరస్కరించబడింది",
    notFound: "దరఖాస్తు కనుగొనబడలేదు",
    statusDesc: {
      SUBMITTED:    "మీ దరఖాస్తు అందుకోబడింది మరియు సమీక్షకు వేచి ఉంది.",
      UNDER_REVIEW: "మా బృందం మీ దరఖాస్తును సమీక్షిస్తోంది.",
      VERIFIED:     "మీ దరఖాస్తు విజయవంతంగా ధృవీకరించబడింది.",
      SELECTED:     "అభినందనలు! మీరు ఉచిత ఉమ్రాకు ఎంపిక చేయబడ్డారు.",
      REJECTED:     "ఈ రౌండ్‌లో మీ దరఖాస్తు ఎంపిక కాలేదు.",
      not_found:    "ఈ ID తో దరఖాస్తు కనుగొనబడలేదు.",
    },
    updateDocument: "పత్రాన్ని నవీకరించండి",
    recheck: "స్థితిని రిఫ్రెష్ చేయండి",
  },
  mr: {
    applicationId: "अर्ज क्रमांक",
    currentStatus: "सद्यस्थिती",
    statusTimeline: "अर्जाची प्रगती",
    submitted: "सादर केला",
    underReview: "पुनरावलोकनात",
    verified: "सत्यापित",
    selected: "निवडलेला",
    rejected: "नाकारलेला",
    notFound: "अर्ज सापडला नाही",
    statusDesc: {
      SUBMITTED:    "तुमचा अर्ज प्राप्त झाला आणि पुनरावलोकनाच्या रांगेत आहे.",
      UNDER_REVIEW: "आमची टीम तुमच्या अर्जाचे पुनरावलोकन करत आहे.",
      VERIFIED:     "तुमचा अर्ज यशस्वीरित्या सत्यापित झाला.",
      SELECTED:     "अभिनंदन! तुम्ही मोफत उमराहसाठी निवडले गेलात.",
      REJECTED:     "या फेरीत तुमचा अर्ज निवडला गेला नाही.",
      not_found:    "या ID सह अर्ज सापडला नाही.",
    },
    updateDocument: "दस्तऐवज अपडेट करा",
    recheck: "स्थिती रिफ्रेश करा",
  },
  bn: {
    applicationId: "আবেদন নম্বর",
    currentStatus: "বর্তমান অবস্থা",
    statusTimeline: "আবেদনের অগ্রগতি",
    submitted: "জমা দেওয়া হয়েছে",
    underReview: "পর্যালোচনাধীন",
    verified: "যাচাইকৃত",
    selected: "নির্বাচিত",
    rejected: "প্রত্যাখ্যাত",
    notFound: "আবেদন পাওয়া যায়নি",
    statusDesc: {
      SUBMITTED:    "আপনার আবেদন পাওয়া গেছে এবং পর্যালোচনার জন্য অপেক্ষায় আছে।",
      UNDER_REVIEW: "আমাদের দল আপনার আবেদন পর্যালোচনা করছে।",
      VERIFIED:     "আপনার আবেদন সফলভাবে যাচাই করা হয়েছে।",
      SELECTED:     "অভিনন্দন! আপনি বিনামূল্যে উমরাহর জন্য নির্বাচিত হয়েছেন।",
      REJECTED:     "এই রাউন্ডে আপনার আবেদন নির্বাচিত হয়নি।",
      not_found:    "এই ID দিয়ে কোনো আবেদন পাওয়া যায়নি।",
    },
    updateDocument: "নথি আপডেট করুন",
    recheck: "অবস্থা রিফ্রেশ করুন",
  },
  or: {
    applicationId: "ଆବେଦନ ନଂ",
    currentStatus: "ବର୍ତ୍ତମାନ ସ୍ଥିତି",
    statusTimeline: "ଆବେଦନ ଅଗ୍ରଗତି",
    submitted: "ଦାଖଲ ହୋଇଛି",
    underReview: "ସମୀକ୍ଷାଧୀନ",
    verified: "ଯାଞ୍ଚ ହୋଇଛି",
    selected: "ମନୋନୀତ",
    rejected: "ପ୍ରତ୍ୟାଖ୍ୟାତ",
    notFound: "ଆବେଦନ ମିଳିଲା ନାହିଁ",
    statusDesc: {
      SUBMITTED:    "ଆପଣଙ୍କ ଆବେଦନ ପ୍ରାପ୍ତ ହୋଇଛି ଏବଂ ସମୀକ୍ଷା ପାଇଁ ଅପେକ୍ଷା କରୁଛି।",
      UNDER_REVIEW: "ଆମ ଦଳ ଆପଣଙ୍କ ଆବେଦନ ସମୀକ୍ଷା କରୁଛି।",
      VERIFIED:     "ଆପଣଙ୍କ ଆବେଦନ ସଫଳଭାବେ ଯାଞ୍ଚ ହୋଇଛି।",
      SELECTED:     "ଅଭିନନ୍ଦନ! ଆପଣ ମାଗଣା ଉମ୍ରା ପାଇଁ ମନୋନୀତ ହୋଇଛନ୍ତି।",
      REJECTED:     "ଏହି ରାଉଣ୍ଡରେ ଆପଣଙ୍କ ଆବେଦନ ମନୋନୀତ ହୋଇଲା ନାହିଁ।",
      not_found:    "ଏହି ID ରେ କୌଣସି ଆବେଦନ ମିଳିଲା ନାହିଁ।",
    },
    updateDocument: "ଦଲିଲ ଅଦ୍ୟତନ କରନ୍ତୁ",
    recheck: "ସ୍ଥିତି ସତାଜା କରନ୍ତୁ",
  },
  ml: {
    applicationId: "അപേക്ഷ നമ്പർ",
    currentStatus: "നിലവിലെ സ്ഥിതി",
    statusTimeline: "അപേക്ഷ പുരോഗതി",
    submitted: "സമർപ്പിച്ചു",
    underReview: "അവലോകനത്തിൽ",
    verified: "പരിശോധിച്ചു",
    selected: "തിരഞ്ഞെടുത്തു",
    rejected: "നിരസിച്ചു",
    notFound: "അപേക്ഷ കണ്ടെത്തിയില്ല",
    statusDesc: {
      SUBMITTED:    "നിങ്ങളുടെ അപേക്ഷ ലഭിച്ചു, അവലോകനത്തിനായി കാത്തിരിക്കുന്നു.",
      UNDER_REVIEW: "ഞങ്ങളുടെ ടീം നിങ്ങളുടെ അപേക്ഷ അവലോകനം ചെയ്യുന്നു.",
      VERIFIED:     "നിങ്ങളുടെ അപേക്ഷ വിജയകരമായി പരിശോധിച്ചു.",
      SELECTED:     "അഭിനന്ദനങ്ങൾ! നിങ്ങൾ സൗജന്യ ഉംറയ്ക്ക് തിരഞ്ഞെടുക്കപ്പെട്ടു.",
      REJECTED:     "ഈ റൗണ്ടിൽ നിങ്ങളുടെ അപേക്ഷ തിരഞ്ഞെടുക്കപ്പെട്ടില്ല.",
      not_found:    "ഈ ID ഉപയോഗിച്ച് അപേക്ഷ കണ്ടെത്തിയില്ല.",
    },
    updateDocument: "രേഖ അപ്ഡേറ്റ് ചെയ്യുക",
    recheck: "സ്ഥിതി പുതുക്കുക",
  },
  pa: {
    applicationId: "ਅਰਜ਼ੀ ਨੰਬਰ",
    currentStatus: "ਮੌਜੂਦਾ ਸਥਿਤੀ",
    statusTimeline: "ਅਰਜ਼ੀ ਦੀ ਪ੍ਰਗਤੀ",
    submitted: "ਜਮ੍ਹਾਂ ਕੀਤੀ",
    underReview: "ਸਮੀਖਿਆ ਵਿੱਚ",
    verified: "ਤਸਦੀਕ ਕੀਤੀ",
    selected: "ਚੁਣੀ ਗਈ",
    rejected: "ਰੱਦ ਕੀਤੀ",
    notFound: "ਅਰਜ਼ੀ ਨਹੀਂ ਮਿਲੀ",
    statusDesc: {
      SUBMITTED:    "ਤੁਹਾਡੀ ਅਰਜ਼ੀ ਮਿਲ ਗਈ ਹੈ ਅਤੇ ਸਮੀਖਿਆ ਲਈ ਉਡੀਕ ਵਿੱਚ ਹੈ।",
      UNDER_REVIEW: "ਸਾਡੀ ਟੀਮ ਤੁਹਾਡੀ ਅਰਜ਼ੀ ਦੀ ਸਮੀਖਿਆ ਕਰ ਰਹੀ ਹੈ।",
      VERIFIED:     "ਤੁਹਾਡੀ ਅਰਜ਼ੀ ਸਫਲਤਾਪੂਰਵਕ ਤਸਦੀਕ ਕੀਤੀ ਗਈ।",
      SELECTED:     "ਵਧਾਈਆਂ! ਤੁਸੀਂ ਮੁਫ਼ਤ ਉਮਰਾ ਲਈ ਚੁਣੇ ਗਏ ਹੋ।",
      REJECTED:     "ਇਸ ਦੌਰ ਵਿੱਚ ਤੁਹਾਡੀ ਅਰਜ਼ੀ ਨਹੀਂ ਚੁਣੀ ਗਈ।",
      not_found:    "ਇਸ ID ਨਾਲ ਕੋਈ ਅਰਜ਼ੀ ਨਹੀਂ ਮਿਲੀ।",
    },
    updateDocument: "ਦਸਤਾਵੇਜ਼ ਅਪਡੇਟ ਕਰੋ",
    recheck: "ਸਥਿਤੀ ਤਾਜ਼ਾ ਕਰੋ",
  },
};

type LangKey = keyof typeof labels;
const stepKeys = ["SUBMITTED", "UNDER_REVIEW", "VERIFIED", "SELECTED"] as const;

function getStatusLabel(l: typeof labels["en"], status: string): string {
  const map: Record<string, string> = {
    SUBMITTED: l.submitted,
    UNDER_REVIEW: l.underReview,
    VERIFIED: l.verified,
    SELECTED: l.selected,
    REJECTED: l.rejected,
    not_found: l.notFound,
  };
  return map[status] || status;
}

/* ─── Main Component ───────────────────────────────────────────── */
export function ApplicationStatusDisplay({
  checkResult,
  checkedApplicationId,
  formattedIdentifier,
  language,
  onRecheck,
}: ApplicationStatusDisplayProps) {
  const [showReupload, setShowReupload] = useState(false);
  const lang: LangKey = (language in labels ? language : "en") as LangKey;
  const l = labels[lang];
  const isRTL = lang === "ar" || lang === "ur";

  const cfg = statusConfig[checkResult as keyof typeof statusConfig] ?? statusConfig.not_found;
  const Icon = cfg.icon;
  const currentStep = cfg.step;
  const c = colorMap[cfg.color];

  const isRejected = checkResult === "REJECTED";
  const isNotFound = checkResult === "not_found";
  const canUpdateDoc = !!checkedApplicationId && (checkResult === "SUBMITTED" || checkResult === "UNDER_REVIEW");

  const stepLabels = [l.submitted, l.underReview, l.verified, l.selected];

  return (
    <div className="space-y-4 animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>

      {/* ── Application ID pill ── */}
      {checkedApplicationId && !isNotFound && (
        <div className="bg-muted/60 rounded-2xl px-4 py-3 text-center border border-border/40">
          <p className="text-[11px] font-medium text-muted-foreground tracking-widest uppercase mb-1">
            {l.applicationId}
          </p>
          <p className="text-sm font-mono font-bold text-foreground break-all leading-snug">
            {formattedIdentifier || checkedApplicationId}
          </p>
        </div>
      )}

      {/* ── Status Hero badge ── */}
      <div className={cn(
        "rounded-2xl border-2 p-4 flex items-center gap-4",
        c.bg, c.border,
        isRTL && "flex-row-reverse text-right"
      )}>
        {/* Large circular icon */}
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
          "bg-white/70 border-2", c.border
        )}>
          <Icon className={cn("w-7 h-7", c.text)} strokeWidth={1.8} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn("text-[11px] font-semibold uppercase tracking-widest mb-0.5 opacity-60", c.text)}>
            {l.currentStatus}
          </p>
          <p className={cn("text-lg font-bold leading-tight", c.text)}>
            {getStatusLabel(l, checkResult)}
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {l.statusDesc[checkResult as keyof typeof l.statusDesc] || ""}
          </p>
        </div>
      </div>

      {/* ── 4-Step Timeline ── */}
      {!isRejected && !isNotFound && (
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          {/* Header */}
          <div className="px-4 pt-4 pb-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              {l.statusTimeline}
            </p>
          </div>

          {/* Steps */}
          <div className="px-4 pb-4 pt-1">
            {stepLabels.map((label, idx) => {
              const StepIcon = stepIcons[idx];
              const sc = colorMap[stepColors[idx]];
              const stepNum = idx + 1;
              const isDone    = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              const isPending = currentStep < stepNum;
              const isLast    = idx === stepLabels.length - 1;

              return (
                <div
                  key={stepKeys[idx]}
                  className={cn("flex gap-4", isRTL && "flex-row-reverse")}
                >
                  {/* ── Node + connector line ── */}
                  <div className="flex flex-col items-center">
                    {/* Circle node */}
                    <div className={cn(
                      "relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      "border-2 transition-all duration-300",
                      isDone    && "bg-primary border-primary shadow-sm",
                      isCurrent && cn(sc.bg, sc.border, "shadow-md ring-4", sc.ring),
                      isPending && "bg-muted/50 border-muted-foreground/20"
                    )}>
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                      ) : (
                        <StepIcon
                          className={cn(
                            "w-4.5 h-4.5 transition-all",
                            isCurrent ? cn(sc.text, "w-5 h-5") : "text-muted-foreground/40 w-4 h-4"
                          )}
                          strokeWidth={1.8}
                        />
                      )}
                      {/* Pulse ring for active step */}
                      {isCurrent && (
                        <span className={cn(
                          "absolute inset-0 rounded-full animate-ping opacity-20",
                          sc.fill
                        )} />
                      )}
                    </div>

                    {/* Connector */}
                    {!isLast && (
                      <div className={cn(
                        "w-0.5 flex-1 min-h-[24px] mt-1 mb-1 rounded-full transition-all duration-300",
                        isDone ? "bg-primary" : "bg-muted-foreground/15"
                      )} />
                    )}
                  </div>

                  {/* ── Step label ── */}
                  <div className={cn(
                    "flex-1 flex items-start gap-2 min-h-[40px]",
                    !isLast && "pb-2",
                    isRTL && "flex-row-reverse text-right"
                  )}>
                    <div className="pt-2 flex-1">
                      <span className={cn(
                        "text-sm font-semibold leading-tight",
                        isDone    && "text-primary",
                        isCurrent && cn(sc.text, "text-[15px]"),
                        isPending && "text-muted-foreground/50"
                      )}>
                        {label}
                      </span>

                      {/* Current step badge */}
                      {isCurrent && (
                        <div className={cn(
                          "inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                          sc.bg, sc.text, sc.border
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", sc.fill)} />
                          {label}
                        </div>
                      )}
                    </div>

                    {/* Step number (pending) */}
                    {isPending && (
                      <span className="mt-2 text-xs text-muted-foreground/40 font-mono flex-shrink-0">
                        {stepNum}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Rejected state ── */}
      {isRejected && (
        <div className="rounded-2xl border-2 border-destructive/20 bg-destructive/5 px-4 py-3 text-center space-y-1">
          <XCircle className="w-8 h-8 text-destructive mx-auto" strokeWidth={1.5} />
          <p className="text-xs text-muted-foreground">{l.statusDesc.REJECTED}</p>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2 h-10 rounded-xl text-sm"
          onClick={onRecheck}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {l.recheck}
        </Button>

        {canUpdateDoc && !showReupload && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 h-10 rounded-xl text-sm"
            onClick={() => setShowReupload(true)}
          >
            <Upload className="w-3.5 h-3.5" />
            {l.updateDocument}
          </Button>
        )}
      </div>

      {canUpdateDoc && showReupload && (
        <DocumentReupload
          applicationId={checkedApplicationId!}
          currentStatus={checkResult}
          language={language}
          onSuccess={() => {
            setShowReupload(false);
            onRecheck();
          }}
        />
      )}
    </div>
  );
}
