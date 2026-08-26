import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, MapPin, Heart, Users } from "lucide-react";

interface DataSharingConsentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConsent: (accepted: boolean) => void;
  isEnabling: boolean;
}

const CONSENT_LABELS = {
  en: {
    title: "Data Sharing Consent",
    description: "Please review what information will be shared with your family group members.",
    dataPoints: "What will be shared:",
    status: "Your current safety status (Normal / Assisted / Emergency)",
    location: "Your approximate location during Hajj",
    stage: "Your current ritual stage",
    groupOnly: "Visible only to verified family group members",
    privacy: "Privacy Guarantee",
    privacyNote: "Your phone number, emergency contact, and personal details are never shared. You can revoke access at any time.",
    agree: "I understand and consent to sharing",
    accept: "Enable Sharing",
    decline: "Cancel",
  },
  ar: {
    title: "موافقة مشاركة البيانات",
    description: "يرجى مراجعة المعلومات التي ستتم مشاركتها مع أفراد مجموعة عائلتك.",
    dataPoints: "ما سيتم مشاركته:",
    status: "حالة سلامتك الحالية (طبيعي / مساعدة / طوارئ)",
    location: "موقعك التقريبي أثناء الحج",
    stage: "مرحلة المناسك الحالية",
    groupOnly: "مرئي فقط لأفراد مجموعة العائلة المتحققين",
    privacy: "ضمان الخصوصية",
    privacyNote: "لن تتم مشاركة رقم هاتفك أو جهة اتصال الطوارئ أو بياناتك الشخصية أبداً. يمكنك إلغاء الوصول في أي وقت.",
    agree: "أفهم وأوافق على المشاركة",
    accept: "تفعيل المشاركة",
    decline: "إلغاء",
  },
  ur: {
    title: "ڈیٹا شیئرنگ کی رضامندی",
    description: "براہ کرم جائزہ لیں کہ آپ کے خاندانی گروپ کے ارکان کے ساتھ کیا معلومات شیئر کی جائیں گی۔",
    dataPoints: "کیا شیئر ہوگا:",
    status: "آپ کی موجودہ حفاظتی حالت (نارمل / مدد / ایمرجنسی)",
    location: "حج کے دوران آپ کا تخمینی مقام",
    stage: "آپ کا موجودہ مناسک کا مرحلہ",
    groupOnly: "صرف تصدیق شدہ خاندانی گروپ ارکان کو نظر آئے گا",
    privacy: "رازداری کی ضمانت",
    privacyNote: "آپ کا فون نمبر، ایمرجنسی رابطہ، اور ذاتی تفصیلات کبھی شیئر نہیں ہوں گی۔ آپ کسی بھی وقت رسائی منسوخ کر سکتے ہیں۔",
    agree: "میں سمجھتا/سمجھتی ہوں اور شیئرنگ کی رضامندی دیتا/دیتی ہوں",
    accept: "شیئرنگ فعال کریں",
    decline: "منسوخ",
  },
  hi: {
    title: "डेटा शेयरिंग सहमति",
    description: "कृपया देखें कि आपके परिवार समूह के सदस्यों के साथ कौन सी जानकारी साझा की जाएगी।",
    dataPoints: "क्या साझा किया जाएगा:",
    status: "आपकी वर्तमान सुरक्षा स्थिति (सामान्य / सहायता / आपातकाल)",
    location: "हज के दौरान आपका अनुमानित स्थान",
    stage: "आपका वर्तमान रिवाज चरण",
    groupOnly: "केवल सत्यापित परिवार समूह सदस्यों को दिखाई देगा",
    privacy: "गोपनीयता गारंटी",
    privacyNote: "आपका फोन नंबर, आपातकालीन संपर्क और व्यक्तिगत विवरण कभी साझा नहीं किए जाएंगे। आप कभी भी पहुंच रद्द कर सकते हैं।",
    agree: "मैं समझता/समझती हूं और शेयरिंग की सहमति देता/देती हूं",
    accept: "शेयरिंग सक्षम करें",
    decline: "रद्द करें",
  },
};

type LabelKey = keyof typeof CONSENT_LABELS.en;

export const DataSharingConsentModal = ({
  open,
  onOpenChange,
  onConsent,
  isEnabling,
}: DataSharingConsentModalProps) => {
  const { language, isRTL } = useLanguage();
  const [agreed, setAgreed] = useState(false);

  const labels = (CONSENT_LABELS[language as keyof typeof CONSENT_LABELS] || CONSENT_LABELS.en) as Record<LabelKey, string>;

  const handleAccept = () => {
    if (!agreed) return;
    onConsent(true);
    setAgreed(false);
  };

  const handleDecline = () => {
    onConsent(false);
    setAgreed(false);
    onOpenChange(false);
  };

  const dataItems = [
    { icon: Heart, text: labels.status },
    { icon: MapPin, text: labels.location },
    { icon: ShieldCheck, text: labels.stage },
    { icon: Users, text: labels.groupOnly },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setAgreed(false); onOpenChange(v); }}>
      <DialogContent
        className="sm:max-w-md rounded-2xl"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
            {labels.title}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {labels.description}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh]">
          <div className="space-y-4 py-2">
            {/* Data points list */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{labels.dataPoints}</p>
              <ul className="space-y-2.5 mt-2">
                {dataItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
                      <span>{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Privacy guarantee */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
              <p className="text-sm font-semibold text-foreground">{labels.privacy}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {labels.privacyNote}
              </p>
            </div>

            {/* Checkbox consent */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <Checkbox
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                className="mt-0.5"
              />
              <span className="text-sm font-medium text-foreground leading-snug">
                {labels.agree}
              </span>
            </label>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="rounded-xl"
          >
            {labels.decline}
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!agreed || isEnabling}
            className="rounded-xl"
          >
            {labels.accept}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
