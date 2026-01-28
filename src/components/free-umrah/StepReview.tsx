import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Briefcase, FileCheck, CheckCircle2 } from "lucide-react";
import { FreeUmrahFormData } from "./types";

interface StepReviewProps {
  formData: FreeUmrahFormData;
  selectedFile: File | null;
  t: {
    fullName: string;
    age: string;
    mobile: string;
    state: string;
    city: string;
    pincode: string;
    role: string;
    masjidName: string;
    yearsOfService: string;
    neverUmrah: string;
    lowIncome: string;
    socialHarmony: string;
    noMoneyPaid: string;
    proofType: string;
  };
  language: string;
}

export function StepReview({ formData, selectedFile, t, language }: StepReviewProps) {
  const isRTL = language === "ar" || language === "ur";
  
  const reviewLabels = {
    en: {
      reviewTitle: "Review Your Application",
      reviewSubtitle: "Please verify all information before submitting",
      personal: "Personal Information",
      location: "Location Details",
      service: "Service Details",
      declarations: "Declarations",
      document: "Document",
      attached: "Attached",
      notAttached: "Not Attached",
    },
    ar: {
      reviewTitle: "مراجعة طلبك",
      reviewSubtitle: "يرجى التحقق من جميع المعلومات قبل الإرسال",
      personal: "المعلومات الشخصية",
      location: "تفاصيل الموقع",
      service: "تفاصيل الخدمة",
      declarations: "الإقرارات",
      document: "المستند",
      attached: "مرفق",
      notAttached: "غير مرفق",
    },
    ur: {
      reviewTitle: "اپنی درخواست کا جائزہ لیں",
      reviewSubtitle: "براہ کرم جمع کرانے سے پہلے تمام معلومات کی تصدیق کریں",
      personal: "ذاتی معلومات",
      location: "مقام کی تفصیلات",
      service: "خدمت کی تفصیلات",
      declarations: "اعلانات",
      document: "دستاویز",
      attached: "منسلک",
      notAttached: "منسلک نہیں",
    },
    hi: {
      reviewTitle: "अपने आवेदन की समीक्षा करें",
      reviewSubtitle: "कृपया जमा करने से पहले सभी जानकारी सत्यापित करें",
      personal: "व्यक्तिगत जानकारी",
      location: "स्थान विवरण",
      service: "सेवा विवरण",
      declarations: "घोषणाएं",
      document: "दस्तावेज़",
      attached: "संलग्न",
      notAttached: "संलग्न नहीं",
    },
  };

  const labels = reviewLabels[language as keyof typeof reviewLabels] || reviewLabels.en;

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className={`flex justify-between py-2 border-b border-border/50 last:border-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium text-foreground text-sm">{value || "—"}</span>
    </div>
  );

  const DeclarationRow = ({ label, checked }: { label: string; checked: boolean }) => (
    <div className={`flex items-center gap-2 py-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${checked ? 'text-primary' : 'text-muted-foreground'}`} />
      <span className={`text-sm ${checked ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">{labels.reviewTitle}</h3>
        <p className="text-sm text-muted-foreground">{labels.reviewSubtitle}</p>
      </div>

      {/* Personal Information */}
      <Card className="p-4">
        <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <User className="w-4 h-4 text-primary" />
          <h4 className="font-medium text-foreground">{labels.personal}</h4>
        </div>
        <div className="space-y-1">
          <InfoRow label={t.fullName} value={formData.full_name} />
          <InfoRow label={t.age} value={formData.age} />
          <InfoRow label={t.mobile} value={`${formData.country_code} ${formData.mobile}`} />
        </div>
      </Card>

      {/* Location Details */}
      <Card className="p-4">
        <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <MapPin className="w-4 h-4 text-primary" />
          <h4 className="font-medium text-foreground">{labels.location}</h4>
        </div>
        <div className="space-y-1">
          <InfoRow label={t.state} value={formData.state} />
          <InfoRow label={t.city} value={formData.city} />
          <InfoRow label={t.pincode} value={formData.pincode} />
        </div>
      </Card>

      {/* Service Details */}
      <Card className="p-4">
        <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Briefcase className="w-4 h-4 text-primary" />
          <h4 className="font-medium text-foreground">{labels.service}</h4>
        </div>
        <div className="space-y-1">
          <InfoRow label={t.role} value={formData.role} />
          <InfoRow label={t.masjidName} value={formData.masjid_name} />
          <InfoRow label={t.yearsOfService} value={formData.years_of_service} />
        </div>
      </Card>

      {/* Declarations */}
      <Card className="p-4">
        <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <FileCheck className="w-4 h-4 text-primary" />
          <h4 className="font-medium text-foreground">{labels.declarations}</h4>
        </div>
        <div className="space-y-1">
          <DeclarationRow label={t.neverUmrah} checked={formData.never_umrah} />
          <DeclarationRow label={t.lowIncome} checked={formData.low_income} />
          <DeclarationRow label={t.socialHarmony} checked={formData.social_harmony} />
          <DeclarationRow label={t.noMoneyPaid} checked={formData.no_money_paid} />
        </div>
      </Card>

      {/* Document */}
      <Card className="p-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FileCheck className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-foreground">{labels.document}</h4>
          </div>
          <Badge variant={selectedFile ? "default" : "secondary"}>
            {selectedFile ? `${labels.attached}: ${selectedFile.name}` : labels.notAttached}
          </Badge>
        </div>
      </Card>
    </div>
  );
}
