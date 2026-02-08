import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePromoCode } from "@/hooks/usePromoCode";
import { Gift, Sparkles, Users, Copy, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WELCOME_DIALOG_KEY = "hajjcare_welcome_shown";

const labels = {
  title: {
    en: "Welcome to HajjCare AI 🕋",
    ar: "مرحباً في حج كير AI 🕋",
    ur: "حج کیئر AI میں خوش آمدید 🕋",
    hi: "HajjCare AI में स्वागत है 🕋",
    ta: "HajjCare AI-க்கு வரவேற்பு 🕋",
    te: "HajjCare AI కి స్వాగతం 🕋",
    mr: "HajjCare AI मध्ये स्वागत 🕋",
    bn: "HajjCare AI তে স্বাগতম 🕋",
    or: "HajjCare AI କୁ ସ୍ୱାଗତ 🕋",
    ml: "HajjCare AI ലേക്ക് സ്വാഗതം 🕋",
    pa: "HajjCare AI ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ 🕋",
  },
  tagline: {
    en: "Har qadam par saath.",
    ar: "معكم في كل خطوة.",
    ur: "ہر قدم پر ساتھ۔",
    hi: "हर कदम पर साथ।",
    ta: "ஒவ்வொரு அடியிலும் உடன்.",
    te: "ప్రతి అడుగులో తోడు.",
    mr: "प्रत्येक पावलावर सोबत.",
    bn: "প্রতিটি পদক্ষেপে সাথে।",
    or: "ପ୍ରତ୍ୟେକ ପଦକ୍ଷେପରେ ସାଥି।",
    ml: "ഓരോ ചുവടിലും കൂടെ.",
    pa: "ਹਰ ਕਦਮ 'ਤੇ ਨਾਲ।",
  },
  supportUs: {
    en: "We need your support — use a promo code & invite family to earn rewards!",
    ar: "نحتاج دعمكم — استخدم رمز ترويجي وادعُ عائلتك لكسب المكافآت!",
    ur: "ہمیں آپ کی حمایت چاہیے — پرومو کوڈ استعمال کریں اور خاندان کو مدعو کریں!",
    hi: "हमें आपके सहयोग की ज़रूरत है — प्रोमो कोड इस्तेमाल करें और परिवार को आमंत्रित करें!",
    ta: "உங்கள் ஆதரவு தேவை — புரோமோ குறியீடு பயன்படுத்தி குடும்பத்தை அழைக்கவும்!",
    te: "మీ మద్దతు అవసరం — ప్రోమో కోడ్ వాడి కుటుంబాన్ని ఆహ్వానించండి!",
    mr: "आम्हाला तुमच्या पाठिंब्याची गरज — प्रोमो कोड वापरा आणि कुटुंबाला आमंत्रित करा!",
    bn: "আপনার সমর্থন দরকার — প্রোমো কোড ব্যবহার করুন ও পরিবারকে আমন্ত্রণ জানান!",
    or: "ଆପଣଙ୍କ ସମର୍ଥନ ଆବଶ୍ୟକ — ପ୍ରୋମୋ କୋଡ ବ୍ୟବହାର କରନ୍ତୁ ଓ ପରିବାରକୁ ନିମନ୍ତ୍ରଣ କରନ୍ତୁ!",
    ml: "നിങ്ങളുടെ പിന്തുണ ആവശ്യമാണ് — പ്രോമോ കോഡ് ഉപയോഗിച്ച് കുടുംബത്തെ ക്ഷണിക്കൂ!",
    pa: "ਸਾਨੂੰ ਤੁਹਾਡੇ ਸਹਿਯੋਗ ਦੀ ਲੋੜ ਹੈ — ਪ੍ਰੋਮੋ ਕੋਡ ਵਰਤੋ ਅਤੇ ਪਰਿਵਾਰ ਨੂੰ ਸੱਦੋ!",
  },
  promoLabel: {
    en: "Use code",
    hi: "कोड इस्तेमाल करें",
    ur: "کوڈ استعمال کریں",
    ar: "استخدم الرمز",
  },
  promoOff: {
    en: "10% OFF",
    hi: "10% छूट",
    ur: "10% چھوٹ",
    ar: "خصم 10%",
  },
  referralInfo: {
    en: "Invite friends & family — both get ₹50 wallet credits!",
    ar: "ادعُ الأصدقاء والعائلة — كلاكما يحصل على ₹50!",
    ur: "دوستوں اور خاندان کو مدعو کریں — دونوں کو ₹50 ملے گا!",
    hi: "दोस्तों और परिवार को बुलाएं — दोनों को ₹50 मिलेंगे!",
    ta: "நண்பர்களையும் குடும்பத்தையும் அழைக்கவும் — இருவருக்கும் ₹50!",
    te: "స్నేహితులను & కుటుంబాన్ని ఆహ్వానించండి — ఇద్దరికీ ₹50!",
    mr: "मित्र व कुटुंबाला बोलवा — दोघांनाही ₹50!",
    bn: "বন্ধু ও পরিবারকে আমন্ত্রণ — দুজনকেই ₹50!",
    or: "ବନ୍ଧୁ ଓ ପରିବାରକୁ ନିମନ୍ତ୍ରଣ — ଦୁଇଜଣଙ୍କୁ ₹50!",
    ml: "സുഹൃത്തുക്കളെ ക്ഷണിക്കൂ — ഇരുവർക്കും ₹50!",
    pa: "ਦੋਸਤਾਂ ਨੂੰ ਸੱਦੋ — ਦੋਵਾਂ ਨੂੰ ₹50!",
  },
  goToRewards: {
    en: "Go to Rewards",
    ar: "انتقل للمكافآت",
    ur: "ریوارڈز پر جائیں",
    hi: "रिवॉर्ड्स पर जाएं",
  },
  maybeLater: {
    en: "Maybe Later",
    ar: "ربما لاحقاً",
    ur: "بعد میں",
    hi: "बाद में",
  },
};

export function WelcomePromoDialog() {
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const { language } = useLanguage();
  const { getWelcomePromoRemaining } = usePromoCode();
  const { toast } = useToast();
  const navigate = useNavigate();

  const t = (key: keyof typeof labels) =>
    labels[key][language as keyof (typeof labels)[typeof key]] || labels[key].en;

  useEffect(() => {
    const shown = localStorage.getItem(WELCOME_DIALOG_KEY);
    if (!shown) {
      // Small delay for smoother UX
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (open) {
      getWelcomePromoRemaining().then(setRemaining);
    }
  }, [open, getWelcomePromoRemaining]);

  const handleDismiss = () => {
    localStorage.setItem(WELCOME_DIALOG_KEY, "true");
    setOpen(false);
  };

  const handleGoToRewards = () => {
    localStorage.setItem(WELCOME_DIALOG_KEY, "true");
    setOpen(false);
    navigate("/rewards");
  };

  const copyCode = () => {
    navigator.clipboard.writeText("HAJJCARE50");
    toast({ title: "Copied!", description: "HAJJCARE50 copied to clipboard" });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleDismiss(); }}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl border-primary/20 p-0 overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-6 pb-4 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary-foreground">
              {t("title")}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 italic text-sm mt-1">
              {t("tagline")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Support message */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("supportUs")}
          </p>

          {/* Promo Code Card */}
          <div
            className="flex items-center gap-3 bg-muted rounded-xl p-3 cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={copyCode}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <code className="font-mono font-bold text-foreground tracking-wider text-base">
                  HAJJCARE50
                </code>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {t("promoOff")}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("promoLabel")} • <Copy className="w-3 h-3 inline" /> tap to copy
              </p>
            </div>
          </div>

          {remaining > 0 && (
            <p className="text-xs text-primary font-semibold text-center">
              🔥 {remaining.toLocaleString()} / 20,000 remaining
            </p>
          )}

          {/* Referral Info */}
          <div className="flex items-center gap-3 bg-accent/30 rounded-xl p-3">
            <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-sm text-foreground leading-snug">
              {t("referralInfo")}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" onClick={handleDismiss} className="flex-1 text-sm">
              {t("maybeLater")}
            </Button>
            <Button onClick={handleGoToRewards} className="flex-1 gap-1.5 text-sm">
              <Gift className="w-4 h-4" />
              {t("goToRewards")}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
