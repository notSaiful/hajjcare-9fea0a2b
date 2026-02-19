import { CheckCircle2, Clock, Eye, XCircle, Star, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentReupload } from "@/components/DocumentReupload";
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

const statusConfig = {
  SUBMITTED: {
    icon: Clock,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50 border-blue-200",
    dotClass: "bg-blue-500",
    step: 1,
  },
  UNDER_REVIEW: {
    icon: Eye,
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50 border-amber-200",
    dotClass: "bg-amber-500",
    step: 2,
  },
  VERIFIED: {
    icon: CheckCircle2,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50 border-emerald-200",
    dotClass: "bg-emerald-500",
    step: 3,
  },
  SELECTED: {
    icon: Star,
    colorClass: "text-primary",
    bgClass: "bg-primary/10 border-primary/20",
    dotClass: "bg-primary",
    step: 4,
  },
  REJECTED: {
    icon: XCircle,
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10 border-destructive/20",
    dotClass: "bg-destructive",
    step: -1,
  },
  not_found: {
    icon: AlertCircle,
    colorClass: "text-muted-foreground",
    bgClass: "bg-muted border-border",
    dotClass: "bg-muted-foreground",
    step: 0,
  },
};

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
      SUBMITTED: "Your application has been received and is queued for review.",
      UNDER_REVIEW: "Our team is currently reviewing your application.",
      VERIFIED: "Your application has been verified successfully.",
      SELECTED: "Congratulations! You have been selected for Free Umrah.",
      REJECTED: "Your application was not selected in this round.",
      not_found: "No application found with this ID. Please check and try again.",
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
      SUBMITTED: "تم استلام طلبك وهو في انتظار المراجعة.",
      UNDER_REVIEW: "فريقنا يراجع طلبك حالياً.",
      VERIFIED: "تم التحقق من طلبك بنجاح.",
      SELECTED: "تهانينا! تم اختيارك للعمرة المجانية.",
      REJECTED: "لم يتم اختيار طلبك في هذه الجولة.",
      not_found: "لم يتم العثور على طلب بهذا الرقم. يرجى التحقق والمحاولة مرة أخرى.",
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
      SUBMITTED: "آپ کی درخواست موصول ہو گئی ہے اور جائزے کے لیے قطار میں ہے۔",
      UNDER_REVIEW: "ہماری ٹیم اس وقت آپ کی درخواست کا جائزہ لے رہی ہے۔",
      VERIFIED: "آپ کی درخواست کامیابی سے تصدیق شدہ ہو گئی۔",
      SELECTED: "مبارک ہو! آپ مفت عمرہ کے لیے منتخب ہو گئے ہیں۔",
      REJECTED: "آپ کی درخواست اس راؤنڈ میں منتخب نہیں ہوئی۔",
      not_found: "اس نمبر سے کوئی درخواست نہیں ملی۔ براہ کرم چیک کریں اور دوبارہ کوشش کریں۔",
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
      SUBMITTED: "आपका आवेदन प्राप्त हो गया है और समीक्षा के लिए प्रतीक्षा में है।",
      UNDER_REVIEW: "हमारी टीम अभी आपके आवेदन की समीक्षा कर रही है।",
      VERIFIED: "आपका आवेदन सफलतापूर्वक सत्यापित हो गया।",
      SELECTED: "बधाई हो! आप मुफ्त उमराह के लिए चयनित हो गए हैं।",
      REJECTED: "इस राउंड में आपका आवेदन चयनित नहीं हुआ।",
      not_found: "इस ID से कोई आवेदन नहीं मिला। कृपया जांचें और पुनः प्रयास करें।",
    },
    updateDocument: "दस्तावेज़ अपडेट करें",
    recheck: "स्थिति ताज़ा करें",
  },
};

const timelineSteps = ["submitted", "underReview", "verified", "selected"] as const;

export function ApplicationStatusDisplay({
  checkResult,
  checkedApplicationId,
  formattedIdentifier,
  language,
  applicationIdLabel,
  updateDocumentLabel,
  onRecheck,
}: ApplicationStatusDisplayProps) {
  const [showReupload, setShowReupload] = useState(false);
  const lang = (language as keyof typeof labels) in labels ? (language as keyof typeof labels) : "en";
  const l = labels[lang];
  const isRTL = lang === "ar" || lang === "ur";

  const config = statusConfig[checkResult as keyof typeof statusConfig] || statusConfig.not_found;
  const Icon = config.icon;
  const currentStep = config.step;
  const isRejected = checkResult === "REJECTED";
  const isNotFound = checkResult === "not_found";

  const stepLabels = [l.submitted, l.underReview, l.verified, l.selected];
  const stepKeys = ["SUBMITTED", "UNDER_REVIEW", "VERIFIED", "SELECTED"];

  const description = l.statusDesc[checkResult as keyof typeof l.statusDesc] || "";

  const canUpdateDoc = checkedApplicationId && (checkResult === "SUBMITTED" || checkResult === "UNDER_REVIEW");

  return (
    <div className="space-y-4 animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>
      {/* Application ID */}
      {checkedApplicationId && !isNotFound && (
        <div className="bg-muted/50 rounded-xl p-3 text-center border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">{l.applicationId}</p>
          <p className="text-sm font-mono font-bold text-foreground break-all">{formattedIdentifier || checkedApplicationId}</p>
        </div>
      )}

      {/* Status Badge */}
      <div className={`rounded-xl border p-4 flex items-start gap-3 ${config.bgClass} ${isRTL ? "flex-row-reverse text-right" : ""}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white/60`}>
          <Icon className={`w-5 h-5 ${config.colorClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium uppercase tracking-wide mb-0.5 ${config.colorClass} opacity-70`}>
            {l.currentStatus}
          </p>
          <p className={`text-base font-bold ${config.colorClass}`}>
            {l[checkResult === "not_found" ? "notFound" : checkResult.toLowerCase().replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase()) as keyof typeof l] as string || checkResult}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
          )}
        </div>
      </div>

      {/* Timeline Progress (only for active statuses) */}
      {!isRejected && !isNotFound && (
        <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{l.statusTimeline}</p>
          <div className="space-y-0">
            {stepLabels.map((label, index) => {
              const stepNum = index + 1;
              const isDone = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              const isPending = currentStep < stepNum;
              const isLast = index === stepLabels.length - 1;

              return (
                <div key={stepKeys[index]} className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  {/* Dot + line */}
                  <div className={`flex flex-col items-center ${isRTL ? "items-center" : ""}`}>
                    <div className={`
                      w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all
                      ${isDone ? "bg-primary border-primary" : ""}
                      ${isCurrent ? `${config.dotClass} border-transparent` : ""}
                      ${isPending ? "bg-background border-muted-foreground/30" : ""}
                    `}>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <span className={`text-xs font-bold ${isCurrent ? "text-white" : "text-muted-foreground"}`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-6 mt-0.5 ${isDone ? "bg-primary" : "bg-muted-foreground/20"}`} />
                    )}
                  </div>

                  {/* Label */}
                  <div className={`pb-4 flex-1 flex items-start ${isLast ? "pb-0" : ""}`}>
                    <span className={`text-sm font-medium mt-0.5 ${
                      isDone ? "text-primary" :
                      isCurrent ? "text-foreground font-semibold" :
                      "text-muted-foreground"
                    }`}>
                      {label}
                    </span>
                    {isCurrent && (
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium ${config.bgClass} ${config.colorClass} border`}>
                        ●
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="outline" size="sm" className="w-full gap-2" onClick={onRecheck}>
          <RefreshCw className="w-3.5 h-3.5" />
          {l.recheck}
        </Button>

        {canUpdateDoc && (
          <>
            {!showReupload ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={() => setShowReupload(true)}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {l.updateDocument}
              </Button>
            ) : (
              <DocumentReupload
                applicationId={checkedApplicationId}
                currentStatus={checkResult}
                language={language}
                onSuccess={() => {
                  setShowReupload(false);
                  onRecheck();
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
