import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, CheckCircle, Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { freeUmrahContent } from "@/data/freeUmrahContent";
import { DocumentReupload } from "@/components/DocumentReupload";
import { compressImage, needsCompression } from "@/lib/imageCompression";
import { WizardProgress } from "@/components/free-umrah/WizardProgress";
import { StepPersonalInfo } from "@/components/free-umrah/StepPersonalInfo";
import { StepLocation } from "@/components/free-umrah/StepLocation";
import { StepServiceDetails } from "@/components/free-umrah/StepServiceDetails";
import { StepDeclarations } from "@/components/free-umrah/StepDeclarations";
import { FreeUmrahFormData, initialFormData } from "@/components/free-umrah/types";

// Step-specific validation schemas
const step1Schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  age: z.number().min(18, "Must be at least 18").max(100, "Age must be under 100"),
  mobile: z.string().min(7, "Enter valid phone number").max(15, "Phone number too long"),
  country_code: z.string().min(1, "Country code required"),
});

const step2Schema = z.object({
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter valid 6-digit pincode"),
});

const step3Schema = z.object({
  role: z.enum(["Imam", "Muazzin", "Hafiz"], { required_error: "Select your role" }),
  masjid_name: z.string().min(2, "Masjid/Madrasa name is required"),
  years_of_service: z.number().min(0, "Years must be positive").max(80, "Invalid years"),
});

const step4Schema = z.object({
  never_umrah: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  low_income: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  social_harmony: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  no_money_paid: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
});

const TOTAL_STEPS = 4;

const stepLabels = {
  en: ["Personal", "Location", "Service", "Confirm"],
  ar: ["شخصي", "الموقع", "الخدمة", "تأكيد"],
  ur: ["ذاتی", "مقام", "خدمت", "تصدیق"],
  hi: ["व्यक्तिगत", "स्थान", "सेवा", "पुष्टि"],
};

const FreeUmrahApplyPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = freeUmrahContent[language as keyof typeof freeUmrahContent] || freeUmrahContent.en;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [checkId, setCheckId] = useState("");
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [checkedApplicationId, setCheckedApplicationId] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showReupload, setShowReupload] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FreeUmrahFormData>(initialFormData);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and image files (JPEG, PNG, GIF, WebP) are allowed");
      return;
    }

    if (file.type.startsWith('image/') && needsCompression(file, 2)) {
      try {
        toast.info("Compressing image...");
        const compressed = await compressImage(file, 2);
        if (compressed.size / 1024 / 1024 > 2) {
          toast.error("Image could not be compressed under 2MB. Please use a smaller image.");
          return;
        }
        toast.success("Image compressed successfully");
        setSelectedFile(compressed);
        return;
      } catch (err) {
        console.error("Compression error:", err);
        toast.error("Failed to compress image");
        return;
      }
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }
    
    setSelectedFile(file);
  };

  const validateCurrentStep = (): boolean => {
    setErrors({});
    try {
      switch (currentStep) {
        case 1:
          step1Schema.parse({
            ...formData,
            age: parseInt(formData.age) || 0,
          });
          break;
        case 2:
          step2Schema.parse(formData);
          break;
        case 3:
          step3Schema.parse({
            ...formData,
            role: formData.role as "Imam" | "Muazzin" | "Hafiz",
            years_of_service: parseInt(formData.years_of_service) || 0,
          });
          break;
        case 4:
          step4Schema.parse(formData);
          break;
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            fieldErrors[e.path[0].toString()] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setErrors({});

    try {
      setIsSubmitting(true);

      const submitFormData = new FormData();
      submitFormData.append("full_name", formData.full_name);
      submitFormData.append("age", formData.age);
      submitFormData.append("mobile", `${formData.country_code}${formData.mobile}`);
      submitFormData.append("state", formData.state);
      submitFormData.append("city", formData.city);
      submitFormData.append("pincode", formData.pincode);
      submitFormData.append("role", formData.role);
      submitFormData.append("masjid_name", formData.masjid_name);
      submitFormData.append("years_of_service", formData.years_of_service);
      submitFormData.append("never_umrah", formData.never_umrah.toString());
      submitFormData.append("low_income", formData.low_income.toString());
      submitFormData.append("social_harmony", formData.social_harmony.toString());
      submitFormData.append("no_money_paid", formData.no_money_paid.toString());
      submitFormData.append("proof_type", formData.proof_type);
      
      if (selectedFile) {
        submitFormData.append("document", selectedFile);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/free-umrah-apply`,
        {
          method: 'POST',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: submitFormData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setSubmittedId(result.applicationId);
      toast.success(t.success);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit application";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!checkId.trim()) return;
    setIsChecking(true);
    setCheckResult(null);
    setCheckedApplicationId(null);
    setShowReupload(false);

    const { data, error } = await supabase
      .from("applicants_status_check" as any)
      .select("status, application_id")
      .eq("application_id", checkId.trim())
      .maybeSingle();

    if (error || !data) {
      setCheckResult("not_found");
    } else {
      const typedData = data as unknown as { status: string; application_id: string };
      setCheckResult(typedData.status);
      setCheckedApplicationId(typedData.application_id);
    }
    setIsChecking(false);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      SUBMITTED: t.submitted,
      UNDER_REVIEW: t.underReview,
      VERIFIED: t.verified,
      REJECTED: t.rejected,
      SELECTED: t.selected,
      not_found: t.notFound,
    };
    return statusMap[status] || status;
  };

  const currentStepLabels = stepLabels[language as keyof typeof stepLabels] || stepLabels.en;

  // Success screen
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
              <CheckCircle className="w-16 h-16 text-primary mx-auto animate-scale-in" />
              <h2 className="text-xl font-semibold text-foreground">{t.success}</h2>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{t.applicationId}</p>
                <p className="text-2xl font-mono font-bold text-primary mt-1">{submittedId}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.saveIdHint}
              </p>
              <Button onClick={() => navigate("/")} className="w-full mt-4">
                {t.goHome}
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
              <div className="space-y-3">
                <div className={`p-3 rounded-lg text-center font-medium ${
                  checkResult === "VERIFIED" ? "bg-primary/10 text-primary" :
                  checkResult === "SELECTED" ? "bg-primary/10 text-primary" :
                  checkResult === "REJECTED" ? "bg-destructive/10 text-destructive" :
                  checkResult === "not_found" ? "bg-muted text-muted-foreground" :
                  "bg-accent text-accent-foreground"
                }`}>
                  {t.status}: {getStatusLabel(checkResult)}
                </div>
                
                {checkedApplicationId && (checkResult === "SUBMITTED" || checkResult === "UNDER_REVIEW") && (
                  <>
                    {!showReupload ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setShowReupload(true)}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t.updateDocument || "Update Document"}
                      </Button>
                    ) : (
                      <DocumentReupload
                        applicationId={checkedApplicationId}
                        currentStatus={checkResult}
                        language={language}
                        onSuccess={() => {
                          setShowReupload(false);
                          handleCheckStatus();
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Form Wizard */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress indicator */}
            <WizardProgress
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              stepLabels={currentStepLabels}
            />

            {/* Step content */}
            <div className="min-h-[280px]">
              {currentStep === 1 && (
                <StepPersonalInfo
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  t={t}
                />
              )}
              {currentStep === 2 && (
                <StepLocation
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  t={t}
                />
              )}
              {currentStep === 3 && (
                <StepServiceDetails
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  t={t}
                />
              )}
              {currentStep === 4 && (
                <StepDeclarations
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  onFileClear={() => setSelectedFile(null)}
                  t={t}
                />
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3 pt-4 border-t">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {language === "ar" || language === "ur" ? "السابق" : "Back"}
                </Button>
              )}
              
              {currentStep < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1"
                >
                  {language === "ar" || language === "ur" ? "التالي" : "Next"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t.submitting}
                    </>
                  ) : (
                    t.submit
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreeUmrahApplyPage;
