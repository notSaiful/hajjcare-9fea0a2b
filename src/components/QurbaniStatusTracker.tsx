import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, CheckCircle2, Clock, FileQuestion, Info } from "lucide-react";

type QurbaniStatus = "not_recorded" | "in_process" | "completed" | "unavailable" | null;

const labels = {
  title: {
    en: "Adahi (Qurbani) Status Tracker",
    ar: "متتبع حالة الأضحية",
    ur: "قربانی کی حالت کا ٹریکر",
    hi: "कुर्बानी स्थिति ट्रैकर"
  },
  subtitle: {
    en: "Track your official Hajj sacrifice status",
    ar: "تتبع حالة ذبيحة الحج الرسمية",
    ur: "اپنی سرکاری حج قربانی کی حالت معلوم کریں",
    hi: "अपनी आधिकारिक हज कुर्बानी की स्थिति जानें"
  },
  placeholder: {
    en: "Enter your Adahi reference number",
    ar: "أدخل رقم مرجع الأضحية",
    ur: "اپنا اضحی حوالہ نمبر درج کریں",
    hi: "अपना अधही संदर्भ नंबर दर्ज करें"
  },
  checkStatus: {
    en: "Check Status",
    ar: "تحقق من الحالة",
    ur: "حالت چیک کریں",
    hi: "स्थिति जांचें"
  },
  notRecorded: {
    en: "Not Yet Recorded",
    ar: "لم يتم التسجيل بعد",
    ur: "ابھی تک درج نہیں ہوا",
    hi: "अभी तक दर्ज नहीं"
  },
  inProcess: {
    en: "In Process",
    ar: "قيد التنفيذ",
    ur: "جاری ہے",
    hi: "प्रक्रिया में"
  },
  completed: {
    en: "Completed",
    ar: "مكتمل",
    ur: "مکمل",
    hi: "पूर्ण"
  },
  statusMessage: {
    en: "Your Qurbani is being handled through official arrangements. Status updates will appear here when available.",
    ar: "يتم التعامل مع أضحيتك من خلال الترتيبات الرسمية. ستظهر تحديثات الحالة هنا عندما تتوفر.",
    ur: "آپ کی قربانی سرکاری انتظامات کے ذریعے ہو رہی ہے۔ حالت کی تازہ کاری یہاں دستیاب ہونے پر ظاہر ہوگی۔",
    hi: "आपकी कुर्बानी आधिकारिक व्यवस्थाओं के माध्यम से हो रही है। स्थिति अपडेट उपलब्ध होने पर यहां दिखाई देंगे।"
  },
  unavailableMessage: {
    en: "Status not yet updated. Please remain calm and follow official instructions.",
    ar: "لم يتم تحديث الحالة بعد. يرجى التزام الهدوء واتباع التعليمات الرسمية.",
    ur: "حالت ابھی تک اپ ڈیٹ نہیں ہوئی۔ براہ کرم پرسکون رہیں اور سرکاری ہدایات پر عمل کریں۔",
    hi: "स्थिति अभी तक अपडेट नहीं हुई। कृपया शांत रहें और आधिकारिक निर्देशों का पालन करें।"
  },
  disclaimer: {
    en: "This is an information-only service. It does not accept payments, sell animals, or issue religious rulings.",
    ar: "هذه خدمة معلومات فقط. لا تقبل المدفوعات أو تبيع الحيوانات أو تصدر أحكاماً شرعية.",
    ur: "یہ صرف معلوماتی خدمت ہے۔ یہ ادائیگیاں قبول نہیں کرتی، جانور نہیں بیچتی، اور شرعی فیصلے جاری نہیں کرتی۔",
    hi: "यह केवल सूचना सेवा है। यह भुगतान स्वीकार नहीं करती, जानवर नहीं बेचती, या धार्मिक फैसले जारी नहीं करती।"
  },
  completedMessage: {
    en: "Your Qurbani has been completed through official arrangements.",
    ar: "تم إتمام أضحيتك من خلال الترتيبات الرسمية.",
    ur: "آپ کی قربانی سرکاری انتظامات کے ذریعے مکمل ہو گئی ہے۔",
    hi: "आपकी कुर्बानी आधिकारिक व्यवस्थाओं के माध्यम से पूर्ण हो गई है।"
  },
  inProcessMessage: {
    en: "Your Qurbani is currently being processed through official channels.",
    ar: "يتم حالياً معالجة أضحيتك من خلال القنوات الرسمية.",
    ur: "آپ کی قربانی سرکاری ذرائع سے جاری ہے۔",
    hi: "आपकी कुर्बानी वर्तमान में आधिकारिक चैनलों के माध्यम से प्रक्रियाधीन है।"
  },
  notRecordedMessage: {
    en: "Your reference number has not yet been recorded in the system. Please contact your Hajj operator.",
    ar: "لم يتم تسجيل رقم المرجع الخاص بك في النظام بعد. يرجى الاتصال بمنظم الحج الخاص بك.",
    ur: "آپ کا حوالہ نمبر ابھی تک سسٹم میں درج نہیں ہوا۔ براہ کرم اپنے حج آپریٹر سے رابطہ کریں۔",
    hi: "आपका संदर्भ नंबर अभी तक सिस्टम में दर्ज नहीं हुआ है। कृपया अपने हज ऑपरेटर से संपर्क करें।"
  }
};

const QurbaniStatusTracker = () => {
  const { language } = useLanguage();
  const [referenceNumber, setReferenceNumber] = useState("");
  const [status, setStatus] = useState<QurbaniStatus>(null);
  const [isChecking, setIsChecking] = useState(false);

  const lang = (language === "en" || language === "ar" || language === "ur" || language === "hi") 
    ? language 
    : "en";

  const handleCheckStatus = async () => {
    if (!referenceNumber.trim()) return;
    
    setIsChecking(true);
    
    // Simulate API call - in production this would call the official Adahi API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo logic: show different statuses based on reference number patterns
    const trimmedRef = referenceNumber.trim().toUpperCase();
    if (trimmedRef.startsWith("C") || trimmedRef.endsWith("99")) {
      setStatus("completed");
    } else if (trimmedRef.startsWith("P") || trimmedRef.endsWith("50")) {
      setStatus("in_process");
    } else if (trimmedRef.startsWith("N") || trimmedRef.length < 5) {
      setStatus("not_recorded");
    } else {
      setStatus("unavailable");
    }
    
    setIsChecking(false);
  };

  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle2,
          label: labels.completed[lang],
          message: labels.completedMessage[lang],
          colorClass: "text-status-safe",
          bgClass: "bg-status-safe/10 border-status-safe/20"
        };
      case "in_process":
        return {
          icon: Clock,
          label: labels.inProcess[lang],
          message: labels.inProcessMessage[lang],
          colorClass: "text-status-assistance",
          bgClass: "bg-status-assistance/10 border-status-assistance/20"
        };
      case "not_recorded":
        return {
          icon: FileQuestion,
          label: labels.notRecorded[lang],
          message: labels.notRecordedMessage[lang],
          colorClass: "text-muted-foreground",
          bgClass: "bg-muted/50 border-muted-foreground/20"
        };
      case "unavailable":
        return {
          icon: Info,
          label: "",
          message: labels.unavailableMessage[lang],
          colorClass: "text-muted-foreground",
          bgClass: "bg-muted/30 border-muted-foreground/10"
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            {labels.title[lang]}
          </h2>
          <p className="text-sm text-muted-foreground">
            {labels.subtitle[lang]}
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-3">
          <Input
            type="text"
            placeholder={labels.placeholder[lang]}
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            className="text-lg h-14 text-center font-mono tracking-wider"
            dir="ltr"
          />
          <Button 
            onClick={handleCheckStatus}
            disabled={!referenceNumber.trim() || isChecking}
            className="w-full h-12 text-base gap-2"
          >
            {isChecking ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {labels.checkStatus[lang]}
          </Button>
        </div>

        {/* Status Display */}
        {statusConfig && (
          <div className={`rounded-xl p-5 border ${statusConfig.bgClass} transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-2`}>
            <div className="flex flex-col items-center text-center space-y-3">
              <statusConfig.icon className={`w-12 h-12 ${statusConfig.colorClass}`} />
              {statusConfig.label && (
                <span className={`text-xl font-semibold ${statusConfig.colorClass}`}>
                  {statusConfig.label}
                </span>
              )}
              <p className="text-foreground text-base leading-relaxed">
                {statusConfig.message}
              </p>
            </div>
          </div>
        )}

        {/* Default message when no status checked */}
        {!status && (
          <div className="bg-muted/30 rounded-xl p-4 border border-muted-foreground/10">
            <p className="text-center text-muted-foreground text-sm leading-relaxed">
              {labels.statusMessage[lang]}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            {labels.disclaimer[lang]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QurbaniStatusTracker;
