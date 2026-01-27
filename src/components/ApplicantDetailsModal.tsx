import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  XCircle, 
  User, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar, 
  FileText,
  ExternalLink,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface Applicant {
  id: string;
  application_id: string;
  full_name: string;
  age: number;
  mobile: string;
  state: string;
  city: string | null;
  pincode: string | null;
  role: string;
  masjid_name: string;
  years_of_service: number;
  never_umrah: boolean;
  low_income: boolean;
  social_harmony: boolean;
  no_money_paid: boolean;
  proof_type: string | null;
  proof_url: string | null;
  status: string;
  created_at: string;
}

interface ApplicantDetailsModalProps {
  applicant: Applicant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: string;
}

const content = {
  en: {
    title: "Application Details",
    personalInfo: "Personal Information",
    name: "Full Name",
    age: "Age",
    mobile: "Mobile",
    location: "Location",
    city: "City",
    pincode: "Pincode",
    serviceInfo: "Service Information",
    role: "Role",
    masjid: "Masjid Name",
    yearsOfService: "Years of Service",
    declarations: "Declarations",
    neverUmrah: "Has never performed Umrah before",
    lowIncome: "Belongs to low-income family",
    socialHarmony: "Has worked for social harmony",
    noMoneyPaid: "Hasn't paid any money for this",
    proofDocument: "Proof Document",
    proofType: "Document Type",
    viewDocument: "View Document",
    noProof: "No proof document uploaded",
    applicationInfo: "Application Information",
    applicationId: "Application ID",
    status: "Status",
    appliedOn: "Applied On",
    close: "Close",
    years: "years",
    loadingDocument: "Loading document...",
    documentError: "Failed to load document",
  },
  ar: {
    title: "تفاصيل الطلب",
    personalInfo: "المعلومات الشخصية",
    name: "الاسم الكامل",
    age: "العمر",
    mobile: "الجوال",
    location: "الموقع",
    city: "المدينة",
    pincode: "الرمز البريدي",
    serviceInfo: "معلومات الخدمة",
    role: "الدور",
    masjid: "اسم المسجد",
    yearsOfService: "سنوات الخدمة",
    declarations: "الإقرارات",
    neverUmrah: "لم يؤد العمرة من قبل",
    lowIncome: "ينتمي إلى عائلة ذات دخل منخفض",
    socialHarmony: "عمل من أجل التناغم الاجتماعي",
    noMoneyPaid: "لم يدفع أي مبلغ لهذا",
    proofDocument: "وثيقة الإثبات",
    proofType: "نوع المستند",
    viewDocument: "عرض المستند",
    noProof: "لم يتم تحميل وثيقة إثبات",
    applicationInfo: "معلومات الطلب",
    applicationId: "رقم الطلب",
    status: "الحالة",
    appliedOn: "تاريخ التقديم",
    close: "إغلاق",
    years: "سنوات",
    loadingDocument: "جاري تحميل المستند...",
    documentError: "فشل تحميل المستند",
  },
  ur: {
    title: "درخواست کی تفصیلات",
    personalInfo: "ذاتی معلومات",
    name: "مکمل نام",
    age: "عمر",
    mobile: "موبائل",
    location: "مقام",
    city: "شہر",
    pincode: "پن کوڈ",
    serviceInfo: "خدمت کی معلومات",
    role: "کردار",
    masjid: "مسجد کا نام",
    yearsOfService: "خدمت کے سال",
    declarations: "اعلانات",
    neverUmrah: "پہلے کبھی عمرہ نہیں کیا",
    lowIncome: "کم آمدنی والے خاندان سے تعلق",
    socialHarmony: "سماجی ہم آہنگی کے لیے کام کیا",
    noMoneyPaid: "اس کے لیے کوئی رقم ادا نہیں کی",
    proofDocument: "ثبوت کی دستاویز",
    proofType: "دستاویز کی قسم",
    viewDocument: "دستاویز دیکھیں",
    noProof: "کوئی ثبوت اپ لوڈ نہیں کیا گیا",
    applicationInfo: "درخواست کی معلومات",
    applicationId: "درخواست نمبر",
    status: "حیثیت",
    appliedOn: "درخواست کی تاریخ",
    close: "بند کریں",
    years: "سال",
    loadingDocument: "دستاویز لوڈ ہو رہی ہے...",
    documentError: "دستاویز لوڈ کرنے میں ناکام",
  },
  hi: {
    title: "आवेदन विवरण",
    personalInfo: "व्यक्तिगत जानकारी",
    name: "पूरा नाम",
    age: "उम्र",
    mobile: "मोबाइल",
    location: "स्थान",
    city: "शहर",
    pincode: "पिनकोड",
    serviceInfo: "सेवा जानकारी",
    role: "भूमिका",
    masjid: "मस्जिद का नाम",
    yearsOfService: "सेवा के वर्ष",
    declarations: "घोषणाएं",
    neverUmrah: "पहले कभी उमराह नहीं किया",
    lowIncome: "कम आय वाले परिवार से",
    socialHarmony: "सामाजिक सद्भाव के लिए काम किया",
    noMoneyPaid: "इसके लिए कोई पैसा नहीं दिया",
    proofDocument: "प्रमाण दस्तावेज",
    proofType: "दस्तावेज़ प्रकार",
    viewDocument: "दस्तावेज़ देखें",
    noProof: "कोई प्रमाण अपलोड नहीं किया गया",
    applicationInfo: "आवेदन जानकारी",
    applicationId: "आवेदन आईडी",
    status: "स्थिति",
    appliedOn: "आवेदन तिथि",
    close: "बंद करें",
    years: "वर्ष",
    loadingDocument: "दस्तावेज़ लोड हो रहा है...",
    documentError: "दस्तावेज़ लोड करने में विफल",
  },
};

const DeclarationItem = ({ 
  label, 
  value 
}: { 
  label: string; 
  value: boolean;
}) => (
  <div className="flex items-center gap-3 py-2">
    {value ? (
      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
    ) : (
      <XCircle className="w-5 h-5 text-muted-foreground shrink-0" />
    )}
    <span className={value ? "text-foreground" : "text-muted-foreground"}>
      {label}
    </span>
  </div>
);

const InfoRow = ({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number | null;
}) => (
  <div className="flex items-start gap-3 py-2">
    <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium truncate">{value || "-"}</p>
    </div>
  </div>
);

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Applied":
      return <Badge variant="secondary">{status}</Badge>;
    case "Under Review":
      return <Badge className="bg-accent text-accent-foreground">{status}</Badge>;
    case "Approved":
      return <Badge className="bg-primary/10 text-primary border-primary/20">{status}</Badge>;
    case "Rejected":
      return <Badge variant="destructive">{status}</Badge>;
    case "Completed":
      return <Badge className="bg-secondary text-secondary-foreground">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const ApplicantDetailsModal = ({
  applicant,
  open,
  onOpenChange,
  language,
}: ApplicantDetailsModalProps) => {
  const t = content[language as keyof typeof content] || content.en;
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [urlError, setUrlError] = useState(false);

  // Fetch signed URL when modal opens with a proof document
  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (!open || !applicant?.proof_url) {
        setSignedUrl(null);
        setUrlError(false);
        return;
      }

      // Check if proof_url is already a full URL (legacy data) or just a path
      if (applicant.proof_url.startsWith('http')) {
        // Legacy data with full public URL - use as is
        setSignedUrl(applicant.proof_url);
        return;
      }

      setIsLoadingUrl(true);
      setUrlError(false);

      try {
        // Generate a signed URL valid for 1 hour
        const { data, error } = await supabase.storage
          .from('proof-documents')
          .createSignedUrl(applicant.proof_url, 3600);

        if (error) {
          console.error('Error creating signed URL:', error);
          setUrlError(true);
          setSignedUrl(null);
        } else {
          setSignedUrl(data.signedUrl);
        }
      } catch (err) {
        console.error('Failed to fetch signed URL:', err);
        setUrlError(true);
        setSignedUrl(null);
      } finally {
        setIsLoadingUrl(false);
      }
    };

    fetchSignedUrl();
  }, [open, applicant?.proof_url]);

  if (!applicant) return null;

  const locationParts = [
    applicant.city,
    applicant.state,
    applicant.pincode,
  ].filter(Boolean);

  // Get file extension from proof_url path for display logic
  const getFileExtension = (path: string) => {
    const match = path.match(/\.([^.]+)$/i);
    return match ? match[1].toLowerCase() : '';
  };

  const fileExtension = applicant.proof_url ? getFileExtension(applicant.proof_url) : '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
  const isPdf = fileExtension === 'pdf';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-8rem)] px-6">
          <div className="space-y-6 pb-6">
            {/* Application Info */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.applicationId}</span>
                <code className="text-sm font-mono bg-background px-2 py-0.5 rounded">
                  {applicant.application_id}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.status}</span>
                {getStatusBadge(applicant.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.appliedOn}</span>
                <span className="text-sm">
                  {format(new Date(applicant.created_at), "PPP")}
                </span>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div>
              <h3 className="font-semibold mb-3">{t.personalInfo}</h3>
              <div className="grid gap-1">
                <InfoRow icon={User} label={t.name} value={applicant.full_name} />
                <InfoRow icon={Calendar} label={t.age} value={`${applicant.age} ${t.years}`} />
                <InfoRow icon={Phone} label={t.mobile} value={applicant.mobile} />
                <InfoRow 
                  icon={MapPin} 
                  label={t.location} 
                  value={locationParts.join(", ")} 
                />
              </div>
            </div>

            <Separator />

            {/* Service Information */}
            <div>
              <h3 className="font-semibold mb-3">{t.serviceInfo}</h3>
              <div className="grid gap-1">
                <InfoRow icon={User} label={t.role} value={applicant.role} />
                <InfoRow icon={Building2} label={t.masjid} value={applicant.masjid_name} />
                <InfoRow 
                  icon={Calendar} 
                  label={t.yearsOfService} 
                  value={`${applicant.years_of_service} ${t.years}`} 
                />
              </div>
            </div>

            <Separator />

            {/* Declarations */}
            <div>
              <h3 className="font-semibold mb-3">{t.declarations}</h3>
              <div className="space-y-1">
                <DeclarationItem label={t.neverUmrah} value={applicant.never_umrah} />
                <DeclarationItem label={t.lowIncome} value={applicant.low_income} />
                <DeclarationItem label={t.socialHarmony} value={applicant.social_harmony} />
                <DeclarationItem label={t.noMoneyPaid} value={applicant.no_money_paid} />
              </div>
            </div>

            <Separator />

            {/* Proof Document */}
            <div>
              <h3 className="font-semibold mb-3">{t.proofDocument}</h3>
              {applicant.proof_url ? (
                <div className="space-y-3">
                  {applicant.proof_type && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t.proofType}:</span>
                      <span className="text-sm font-medium">{applicant.proof_type}</span>
                    </div>
                  )}
                  
                  {/* Document Preview */}
                  <div className="border rounded-lg overflow-hidden bg-muted/30">
                    {isLoadingUrl ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                        <p className="text-sm">{t.loadingDocument}</p>
                      </div>
                    ) : urlError ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <XCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t.documentError}</p>
                      </div>
                    ) : signedUrl ? (
                      isImage ? (
                        <img
                          src={signedUrl}
                          alt="Proof document"
                          className="w-full max-h-64 object-contain"
                        />
                      ) : isPdf ? (
                        <iframe
                          src={signedUrl}
                          className="w-full h-64"
                          title="Proof document"
                        />
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Document preview not available</p>
                        </div>
                      )
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Document preview not available</p>
                      </div>
                    )}
                  </div>

                  {signedUrl && !isLoadingUrl && !urlError && (
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a
                        href={signedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {t.viewDocument}
                      </a>
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t.noProof}</p>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            {t.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
