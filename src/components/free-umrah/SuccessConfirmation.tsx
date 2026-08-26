import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Copy, Share2, Home, FileCheck, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { FreeUmrahFormData } from "./types";

interface SuccessConfirmationProps {
  applicationId: string;
  formData: FreeUmrahFormData;
  language: string;
  onGoHome: () => void;
  getFormattedIdentifier: () => string;
}

const successLabels = {
  en: {
    title: "Application Submitted!",
    subtitle: "Your Free Umrah application has been successfully submitted",
    applicationId: "Your Application ID",
    copyId: "Copy ID",
    copied: "Copied!",
    shareTitle: "Share",
    whatNext: "What happens next?",
    step1: "Our team will review your application",
    step2: "You'll receive updates via WhatsApp",
    step3: "Selected candidates will be notified",
    saveIdHint: "Save this ID to check your application status anytime",
    goHome: "Go to Home",
    checkStatusLater: "You can check your status anytime using this ID",
    thankYou: "May Allah accept your intention",
    estimatedReview: "Estimated review time: 7-14 days",
  },
  ar: {
    title: "تم تقديم الطلب!",
    subtitle: "تم تقديم طلب العمرة المجانية بنجاح",
    applicationId: "رقم طلبك",
    copyId: "نسخ الرقم",
    copied: "تم النسخ!",
    shareTitle: "مشاركة",
    whatNext: "ماذا يحدث بعد ذلك؟",
    step1: "سيقوم فريقنا بمراجعة طلبك",
    step2: "ستتلقى تحديثات عبر واتساب",
    step3: "سيتم إخطار المرشحين المختارين",
    saveIdHint: "احفظ هذا الرقم للتحقق من حالة طلبك في أي وقت",
    goHome: "الصفحة الرئيسية",
    checkStatusLater: "يمكنك التحقق من حالتك في أي وقت باستخدام هذا الرقم",
    thankYou: "تقبل الله نيتك",
    estimatedReview: "وقت المراجعة المتوقع: 7-14 يوم",
  },
  ur: {
    title: "درخواست جمع ہو گئی!",
    subtitle: "آپ کی مفت عمرہ درخواست کامیابی سے جمع ہو گئی",
    applicationId: "آپ کی درخواست کا نمبر",
    copyId: "نمبر کاپی کریں",
    copied: "کاپی ہو گیا!",
    shareTitle: "شیئر کریں",
    whatNext: "اب کیا ہوگا؟",
    step1: "ہماری ٹیم آپ کی درخواست کا جائزہ لے گی",
    step2: "آپ کو واٹس ایپ کے ذریعے اپ ڈیٹس ملیں گی",
    step3: "منتخب امیدواروں کو مطلع کیا جائے گا",
    saveIdHint: "اپنی درخواست کی حیثیت کسی بھی وقت چیک کرنے کے لیے یہ نمبر محفوظ کریں",
    goHome: "ہوم پر جائیں",
    checkStatusLater: "آپ اس نمبر کا استعمال کرتے ہوئے کسی بھی وقت اپنی حیثیت چیک کر سکتے ہیں",
    thankYou: "اللہ آپ کی نیت قبول فرمائے",
    estimatedReview: "جائزے کا تخمینی وقت: 7-14 دن",
  },
  hi: {
    title: "आवेदन जमा हो गया!",
    subtitle: "आपका मुफ्त उमराह आवेदन सफलतापूर्वक जमा हो गया",
    applicationId: "आपकी आवेदन संख्या",
    copyId: "कॉपी करें",
    copied: "कॉपी हो गया!",
    shareTitle: "शेयर करें",
    whatNext: "अब आगे क्या?",
    step1: "हमारी टीम आपके आवेदन की समीक्षा करेगी",
    step2: "आपको WhatsApp पर अपडेट मिलेंगे",
    step3: "चयनित उम्मीदवारों को सूचित किया जाएगा",
    saveIdHint: "कभी भी अपनी आवेदन स्थिति जांचने के लिए यह नंबर सहेजें",
    goHome: "होम पर जाएं",
    checkStatusLater: "आप इस नंबर का उपयोग करके कभी भी अपनी स्थिति जांच सकते हैं",
    thankYou: "अल्लाह आपकी नीयत कबूल करे",
    estimatedReview: "अनुमानित समीक्षा समय: 7-14 दिन",
  },
};

export function SuccessConfirmation({
  applicationId,
  formData,
  language,
  onGoHome,
  getFormattedIdentifier,
}: SuccessConfirmationProps) {
  const labels = successLabels[language as keyof typeof successLabels] || successLabels.en;
  const isRTL = language === "ar" || language === "ur";
  const formattedId = getFormattedIdentifier();

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(formattedId);
      toast.success(labels.copied);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = formattedId;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success(labels.copied);
    }
  };

  const handleShare = async () => {
    const shareText = `${labels.title}\n${labels.applicationId}: ${formattedId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: labels.title,
          text: shareText,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await handleCopyId();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>
      {/* Success Header */}
      <div className="text-center space-y-4 py-4">
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <div className="relative w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-primary animate-scale-in" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            {labels.title}
            <Sparkles className="w-5 h-5 text-primary" />
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            {labels.subtitle}
          </p>
        </div>
      </div>

      {/* Application ID Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6 pb-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
              {labels.applicationId}
            </p>
            <p className="text-xl sm:text-2xl font-mono font-bold text-primary break-all px-2">
              {formattedId}
            </p>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyId}
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              {labels.copyId}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              {labels.shareTitle}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* What's Next Section */}
      <Card>
        <CardContent className="pt-5 pb-5 space-y-4">
          <h3 className={`font-semibold text-foreground flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="w-4 h-4 text-primary" />
            {labels.whatNext}
          </h3>
          
          <div className="space-y-3">
            {[
              { icon: FileCheck, text: labels.step1 },
              { icon: () => <span className="text-lg">📱</span>, text: labels.step2 },
              { icon: CheckCircle2, text: labels.step3 },
            ].map((step, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg bg-muted/50 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <p className="text-sm text-foreground">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <p className="text-xs text-muted-foreground text-center bg-accent/50 rounded-lg py-2 px-3">
              ⏱️ {labels.estimatedReview}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dua / Thank You */}
      <div className="text-center py-3">
        <p className="text-lg font-arabic text-primary italic">
          ✨ {labels.thankYou} ✨
        </p>
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground text-center">
        💡 {labels.saveIdHint}
      </p>

      {/* Go Home Button */}
      <Button onClick={onGoHome} className="w-full gap-2" size="lg">
        <Home className="w-4 h-4" />
        {labels.goHome}
      </Button>
    </div>
  );
}
