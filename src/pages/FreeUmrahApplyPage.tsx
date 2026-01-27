import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle, Search } from "lucide-react";
import { z } from "zod";

const applicationSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  age: z.number().min(18, "Must be at least 18").max(100, "Age must be under 100"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Enter valid 10-digit mobile number"),
  state: z.string().min(2, "State is required"),
  role: z.enum(["Imam", "Muazzin", "Hafiz"], { required_error: "Select your role" }),
  masjid_name: z.string().min(2, "Masjid/Madrasa name is required"),
  years_of_service: z.number().min(0, "Years must be positive").max(80, "Invalid years"),
  never_umrah: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  low_income: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  social_harmony: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  no_money_paid: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  proof_type: z.enum(["Masjid Certificate", "Self Video"]).optional(),
});

const content = {
  en: {
    title: "Free Umrah – Deeni Khidmat",
    subtitle: "Pilot Program: 10 Beneficiaries",
    fullName: "Full Name",
    age: "Age",
    mobile: "Mobile Number",
    state: "State / District",
    role: "Select Role",
    masjidName: "Masjid / Madrasa Name",
    yearsOfService: "Years of Service",
    declarations: "Declarations",
    neverUmrah: "I have never performed Umrah before",
    lowIncome: "I belong to a low-income family",
    socialHarmony: "I have never posted hate/communal content online",
    noMoneyPaid: "I understand I will not pay any money for this",
    proofType: "Proof Type",
    submit: "Submit Application",
    submitting: "Submitting...",
    success: "Application submitted successfully!",
    applicationId: "Your Application ID",
    checkStatus: "Check Status",
    statusPlaceholder: "Enter Application ID",
    check: "Check",
    status: "Status",
    notFound: "Application not found",
    applied: "Applied",
    underReview: "Under Review",
    approved: "Approved",
    rejected: "Rejected",
    completed: "Completed",
  },
  ur: {
    title: "مفت عمرہ – دینی خدمت",
    subtitle: "پائلٹ پروگرام: 10 مستفیدین",
    fullName: "پورا نام",
    age: "عمر",
    mobile: "موبائل نمبر",
    state: "ریاست / ضلع",
    role: "کردار منتخب کریں",
    masjidName: "مسجد / مدرسہ کا نام",
    yearsOfService: "خدمت کے سال",
    declarations: "اقرار نامہ",
    neverUmrah: "میں نے پہلے کبھی عمرہ نہیں کیا",
    lowIncome: "میں کم آمدنی والے خاندان سے ہوں",
    socialHarmony: "میں نے کبھی نفرت/فرقہ وارانہ مواد پوسٹ نہیں کیا",
    noMoneyPaid: "میں سمجھتا ہوں کہ اس کے لیے کوئی رقم نہیں دوں گا",
    proofType: "ثبوت کی قسم",
    submit: "درخواست جمع کرائیں",
    submitting: "جمع ہو رہا ہے...",
    success: "درخواست کامیابی سے جمع ہو گئی!",
    applicationId: "آپ کی درخواست کا نمبر",
    checkStatus: "حیثیت چیک کریں",
    statusPlaceholder: "درخواست نمبر درج کریں",
    check: "چیک کریں",
    status: "حیثیت",
    notFound: "درخواست نہیں ملی",
    applied: "درخواست دی گئی",
    underReview: "جائزہ میں",
    approved: "منظور",
    rejected: "مسترد",
    completed: "مکمل",
  },
  hi: {
    title: "मुफ्त उमराह – दीनी खिदमत",
    subtitle: "पायलट प्रोग्राम: 10 लाभार्थी",
    fullName: "पूरा नाम",
    age: "उम्र",
    mobile: "मोबाइल नंबर",
    state: "राज्य / जिला",
    role: "भूमिका चुनें",
    masjidName: "मस्जिद / मदरसा का नाम",
    yearsOfService: "सेवा के वर्ष",
    declarations: "घोषणाएं",
    neverUmrah: "मैंने पहले कभी उमराह नहीं किया",
    lowIncome: "मैं कम आय वाले परिवार से हूं",
    socialHarmony: "मैंने कभी नफरत/सांप्रदायिक सामग्री पोस्ट नहीं की",
    noMoneyPaid: "मैं समझता हूं कि इसके लिए कोई पैसा नहीं दूंगा",
    proofType: "प्रमाण प्रकार",
    submit: "आवेदन जमा करें",
    submitting: "जमा हो रहा है...",
    success: "आवेदन सफलतापूर्वक जमा हो गया!",
    applicationId: "आपकी आवेदन संख्या",
    checkStatus: "स्थिति जांचें",
    statusPlaceholder: "आवेदन संख्या दर्ज करें",
    check: "जांचें",
    status: "स्थिति",
    notFound: "आवेदन नहीं मिला",
    applied: "आवेदन किया गया",
    underReview: "समीक्षा में",
    approved: "स्वीकृत",
    rejected: "अस्वीकृत",
    completed: "पूर्ण",
  },
  ar: {
    title: "عمرة مجانية – خدمة دينية",
    subtitle: "البرنامج التجريبي: 10 مستفيدين",
    fullName: "الاسم الكامل",
    age: "العمر",
    mobile: "رقم الجوال",
    state: "الولاية / المنطقة",
    role: "اختر الدور",
    masjidName: "اسم المسجد / المدرسة",
    yearsOfService: "سنوات الخدمة",
    declarations: "الإقرارات",
    neverUmrah: "لم أؤدِ العمرة من قبل",
    lowIncome: "أنا من أسرة ذات دخل منخفض",
    socialHarmony: "لم أنشر محتوى كراهية/طائفي",
    noMoneyPaid: "أفهم أنني لن أدفع أي مال",
    proofType: "نوع الإثبات",
    submit: "تقديم الطلب",
    submitting: "جاري التقديم...",
    success: "تم تقديم الطلب بنجاح!",
    applicationId: "رقم طلبك",
    checkStatus: "تحقق من الحالة",
    statusPlaceholder: "أدخل رقم الطلب",
    check: "تحقق",
    status: "الحالة",
    notFound: "الطلب غير موجود",
    applied: "تم التقديم",
    underReview: "قيد المراجعة",
    approved: "موافق عليه",
    rejected: "مرفوض",
    completed: "مكتمل",
  },
};

const FreeUmrahApplyPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = content[language as keyof typeof content] || content.en;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [checkId, setCheckId] = useState("");
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    mobile: "",
    state: "",
    role: "",
    masjid_name: "",
    years_of_service: "",
    never_umrah: false,
    low_income: false,
    social_harmony: false,
    no_money_paid: false,
    proof_type: "Masjid Certificate",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = applicationSchema.parse({
        ...formData,
        age: parseInt(formData.age) || 0,
        years_of_service: parseInt(formData.years_of_service) || 0,
        role: formData.role as "Imam" | "Muazzin" | "Hafiz",
        proof_type: formData.proof_type as "Masjid Certificate" | "Self Video",
      });

      setIsSubmitting(true);

      const { data, error } = await supabase
        .from("applicants")
        .insert({
          full_name: validated.full_name,
          age: validated.age,
          mobile: validated.mobile,
          state: validated.state,
          role: validated.role,
          masjid_name: validated.masjid_name,
          years_of_service: validated.years_of_service,
          never_umrah: validated.never_umrah,
          low_income: validated.low_income,
          social_harmony: validated.social_harmony,
          no_money_paid: validated.no_money_paid,
          proof_type: validated.proof_type,
        })
        .select("application_id")
        .single();

      if (error) throw error;

      setSubmittedId(data.application_id);
      toast.success(t.success);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            fieldErrors[e.path[0].toString()] = e.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error("Failed to submit application");
        console.error(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!checkId.trim()) return;
    setIsChecking(true);
    setCheckResult(null);

    const { data, error } = await supabase
      .from("applicants")
      .select("status")
      .eq("application_id", checkId.trim())
      .maybeSingle();

    if (error || !data) {
      setCheckResult("not_found");
    } else {
      setCheckResult(data.status);
    }
    setIsChecking(false);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      Applied: t.applied,
      "Under Review": t.underReview,
      Approved: t.approved,
      Rejected: t.rejected,
      Completed: t.completed,
      not_found: t.notFound,
    };
    return statusMap[status] || status;
  };

  if (submittedId) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50">
          <div className="container max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold truncate">{t.title}</h1>
          </div>
        </header>
        <div className="container max-w-md mx-auto px-4 py-8">
          <Card className="text-center">
            <CardContent className="pt-8 pb-6 space-y-4">
              <CheckCircle className="w-16 h-16 text-primary mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">{t.success}</h2>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{t.applicationId}</p>
                <p className="text-2xl font-mono font-bold text-primary mt-1">{submittedId}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Save this ID to check your application status
              </p>
              <Button onClick={() => navigate("/")} className="w-full mt-4">
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50">
        <div className="container max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold truncate">{t.title}</h1>
        </div>
      </header>
      <div className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Status Check Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="w-4 h-4" />
              {t.checkStatus}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder={t.statusPlaceholder}
                value={checkId}
                onChange={(e) => setCheckId(e.target.value)}
              />
              <Button onClick={handleCheckStatus} disabled={isChecking}>
                {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : t.check}
              </Button>
            </div>
            {checkResult && (
              <div className={`p-3 rounded-lg text-center font-medium ${
                checkResult === "Approved" ? "bg-primary/10 text-primary" :
                checkResult === "Rejected" ? "bg-destructive/10 text-destructive" :
                checkResult === "not_found" ? "bg-muted text-muted-foreground" :
                "bg-accent text-accent-foreground"
              }`}>
                {t.status}: {getStatusLabel(checkResult)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">{t.fullName} *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
                {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">{t.age} *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                  {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">{t.mobile} *</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    required
                  />
                  {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">{t.state} *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
                {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label>{t.role} *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.role} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Imam">Imam</SelectItem>
                    <SelectItem value="Muazzin">Muazzin</SelectItem>
                    <SelectItem value="Hafiz">Hafiz</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="masjid_name">{t.masjidName} *</Label>
                <Input
                  id="masjid_name"
                  value={formData.masjid_name}
                  onChange={(e) => setFormData({ ...formData, masjid_name: e.target.value })}
                  required
                />
                {errors.masjid_name && <p className="text-sm text-destructive">{errors.masjid_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="years_of_service">{t.yearsOfService} *</Label>
                <Input
                  id="years_of_service"
                  type="number"
                  min="0"
                  value={formData.years_of_service}
                  onChange={(e) => setFormData({ ...formData, years_of_service: e.target.value })}
                  required
                />
                {errors.years_of_service && <p className="text-sm text-destructive">{errors.years_of_service}</p>}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Label className="text-base font-semibold">{t.declarations}</Label>
                
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="never_umrah"
                    checked={formData.never_umrah}
                    onCheckedChange={(checked) => setFormData({ ...formData, never_umrah: !!checked })}
                  />
                  <Label htmlFor="never_umrah" className="text-sm leading-tight cursor-pointer">
                    {t.neverUmrah} *
                  </Label>
                </div>
                {errors.never_umrah && <p className="text-sm text-destructive">{errors.never_umrah}</p>}

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="low_income"
                    checked={formData.low_income}
                    onCheckedChange={(checked) => setFormData({ ...formData, low_income: !!checked })}
                  />
                  <Label htmlFor="low_income" className="text-sm leading-tight cursor-pointer">
                    {t.lowIncome} *
                  </Label>
                </div>
                {errors.low_income && <p className="text-sm text-destructive">{errors.low_income}</p>}

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="social_harmony"
                    checked={formData.social_harmony}
                    onCheckedChange={(checked) => setFormData({ ...formData, social_harmony: !!checked })}
                  />
                  <Label htmlFor="social_harmony" className="text-sm leading-tight cursor-pointer">
                    {t.socialHarmony} *
                  </Label>
                </div>
                {errors.social_harmony && <p className="text-sm text-destructive">{errors.social_harmony}</p>}

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="no_money_paid"
                    checked={formData.no_money_paid}
                    onCheckedChange={(checked) => setFormData({ ...formData, no_money_paid: !!checked })}
                  />
                  <Label htmlFor="no_money_paid" className="text-sm leading-tight cursor-pointer">
                    {t.noMoneyPaid} *
                  </Label>
                </div>
                {errors.no_money_paid && <p className="text-sm text-destructive">{errors.no_money_paid}</p>}
              </div>

              <div className="space-y-2 pt-4">
                <Label>{t.proofType}</Label>
                <Select
                  value={formData.proof_type}
                  onValueChange={(value) => setFormData({ ...formData, proof_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masjid Certificate">Masjid Certificate</SelectItem>
                    <SelectItem value="Self Video">Self Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.submitting}
                  </>
                ) : (
                  t.submit
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreeUmrahApplyPage;
