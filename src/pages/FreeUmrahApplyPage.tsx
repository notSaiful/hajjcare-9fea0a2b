import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, CheckCircle, Search, RefreshCw, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { StepReview } from "@/components/free-umrah/StepReview";
import { SuccessConfirmation } from "@/components/free-umrah/SuccessConfirmation";
import { FreeUmrahFormData, initialFormData } from "@/components/free-umrah/types";

const STORAGE_KEY = "free-umrah-application-draft";
const STEP_STORAGE_KEY = "free-umrah-application-step";

// State code mapping for Indian states
const stateCodeMap: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  "Assam": "AS",
  "Bihar": "BR",
  "Chhattisgarh": "CG",
  "Goa": "GA",
  "Gujarat": "GJ",
  "Haryana": "HR",
  "Himachal Pradesh": "HP",
  "Jharkhand": "JH",
  "Karnataka": "KA",
  "Kerala": "KL",
  "Madhya Pradesh": "MP",
  "Maharashtra": "MH",
  "Manipur": "MN",
  "Meghalaya": "ML",
  "Mizoram": "MZ",
  "Nagaland": "NL",
  "Odisha": "OD",
  "Punjab": "PB",
  "Rajasthan": "RJ",
  "Sikkim": "SK",
  "Tamil Nadu": "TN",
  "Telangana": "TS",
  "Tripura": "TR",
  "Uttar Pradesh": "UP",
  "Uttarakhand": "UK",
  "West Bengal": "WB",
  "Delhi": "DL",
  "Jammu and Kashmir": "JK",
  "Ladakh": "LA",
  "Puducherry": "PY",
  "Chandigarh": "CH",
  "Andaman and Nicobar Islands": "AN",
  "Dadra and Nagar Haveli and Daman and Diu": "DD",
  "Lakshadweep": "LD",
};

// Helper to get state code
const getStateCode = (stateName: string): string => {
  return stateCodeMap[stateName] || stateName.substring(0, 2).toUpperCase();
};

// Helper to format city name in Title Case
const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Step-specific validation schemas
const step1Schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  age: z.number().min(18, "Must be at least 18 years").max(60, "Must be 60 years or younger"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Enter valid 10-digit mobile number"),
});

const step2Schema = z.object({
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter valid 6-digit pincode"),
});

const step3Schema = z.object({
  role: z.enum(["Imam", "Muazzin", "Hafiz"], { required_error: "Select your role" }),
  masjid_name: z.string().min(2, "Masjid name is required"),
  masjid_registration_number: z.string().min(2, "Masjid registration number is required"),
  years_of_service: z.number().min(0, "Years must be positive").max(80, "Invalid years"),
});

const step4Schema = z.object({
  never_umrah: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  low_income: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  social_harmony: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  no_money_paid: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
});

const TOTAL_STEPS = 5;

const stepLabels = {
  en: ["Personal", "Location", "Service", "Confirm", "Review"],
  ar: ["شخصي", "الموقع", "الخدمة", "تأكيد", "مراجعة"],
  ur: ["ذاتی", "مقام", "خدمت", "تصدیق", "جائزہ"],
  hi: ["व्यक्तिगत", "स्थान", "सेवा", "पुष्टि", "समीक्षा"],
};

const FreeUmrahApplyPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = freeUmrahContent[language as keyof typeof freeUmrahContent] || freeUmrahContent.en;

  // Load saved step from localStorage
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
    return savedStep ? parseInt(savedStep, 10) : 1;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [checkId, setCheckId] = useState("");
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [checkedApplicationId, setCheckedApplicationId] = useState<string | null>(null);
  const [checkedState, setCheckedState] = useState<string | null>(null);
  const [checkedCity, setCheckedCity] = useState<string | null>(null);
  const [submittedFormData, setSubmittedFormData] = useState<FreeUmrahFormData | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showReupload, setShowReupload] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [masjidCertificate, setMasjidCertificate] = useState<File | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [rateLimitState, setRateLimitState] = useState<{ isLimited: boolean; resetTime: number; message: string } | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer effect for rate limiting
  useEffect(() => {
    if (!rateLimitState?.isLimited) return;
    
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((rateLimitState.resetTime - Date.now()) / 1000));
      setCountdown(remaining);
      
      if (remaining <= 0) {
        setRateLimitState(null);
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [rateLimitState]);

  // Load saved form data from localStorage
  const [formData, setFormData] = useState<FreeUmrahFormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all fields from initialFormData exist (handles schema evolution)
        return { 
          ...initialFormData, 
          ...parsed,
          // Explicitly reset fields that might have invalid values from old schema
          masjid_registration_number: parsed.masjid_registration_number || "",
        };
      } catch {
        return initialFormData;
      }
    }
    return initialFormData;
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
  }, [currentStep]);

  // Clear localStorage on successful submission
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_STORAGE_KEY);
  }, []);

  const processFile = async (file: File, allowPdf: boolean = true): Promise<File | null> => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedTypes = allowPdf ? [...imageTypes, 'application/pdf'] : imageTypes;
    
    if (!allowedTypes.includes(file.type)) {
      toast.error(allowPdf 
        ? "Only PDF and image files (JPEG, PNG, GIF, WebP) are allowed"
        : "Only image files (JPEG, PNG, GIF, WebP) are allowed for passport photo"
      );
      return null;
    }

    if (file.type.startsWith('image/') && needsCompression(file, 2)) {
      try {
        toast.info("Compressing image...");
        const compressed = await compressImage(file, 2);
        if (compressed.size / 1024 / 1024 > 2) {
          toast.error("Image could not be compressed under 2MB. Please use a smaller image.");
          return null;
        }
        toast.success("Image compressed successfully");
        return compressed;
      } catch (err) {
        console.error("Compression error:", err);
        toast.error("Failed to compress image");
        return null;
      }
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return null;
    }
    
    return file;
  };

  const handleMasjidCertSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const processed = await processFile(file, true);
    if (processed) {
      setMasjidCertificate(processed);
      setErrors(prev => ({ ...prev, masjid_certificate: "" }));
    }
  };

  const handlePassportPhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const processed = await processFile(file, false); // Only images for passport photo
    if (processed) {
      setPassportPhoto(processed);
      setErrors(prev => ({ ...prev, passport_photo: "" }));
    }
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
          // Also validate that both documents are uploaded
          if (!masjidCertificate) {
            setErrors(prev => ({ ...prev, masjid_certificate: "Masjid Registration Certificate is required" }));
            return false;
          }
          if (!passportPhoto) {
            setErrors(prev => ({ ...prev, passport_photo: "Passport-size photograph is required" }));
            return false;
          }
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

  const handleConfirmSubmit = () => {
    if (!validateCurrentStep()) return;
    // Final validation for documents before submission
    if (!masjidCertificate || !passportPhoto) {
      toast.error("Both documents are required to submit the application");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleSubmit = async () => {
    setShowConfirmDialog(false);
    setErrors({});

    try {
      setIsSubmitting(true);

      const submitFormData = new FormData();
      submitFormData.append("full_name", formData.full_name);
      submitFormData.append("age", formData.age);
      submitFormData.append("mobile", `+91${formData.mobile}`);
      submitFormData.append("state", formData.state);
      submitFormData.append("city", formData.city);
      submitFormData.append("pincode", formData.pincode);
      submitFormData.append("role", formData.role);
      submitFormData.append("masjid_name", formData.masjid_name);
      submitFormData.append("masjid_registration_number", formData.masjid_registration_number);
      submitFormData.append("years_of_service", formData.years_of_service);
      submitFormData.append("never_umrah", formData.never_umrah.toString());
      submitFormData.append("low_income", formData.low_income.toString());
      submitFormData.append("social_harmony", formData.social_harmony.toString());
      submitFormData.append("no_money_paid", formData.no_money_paid.toString());
      
      if (masjidCertificate) {
        submitFormData.append("masjid_certificate", masjidCertificate);
      }
      if (passportPhoto) {
        submitFormData.append("passport_photo", passportPhoto);
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
        // Handle duplicate application (409 Conflict)
        if (response.status === 409 && result.existingApplicationId) {
          toast.error(`${result.error}. Your Application ID: ${result.existingApplicationId}`);
          setCheckId(result.existingApplicationId);
          return;
        }
        
        // Handle rate limiting (429 Too Many Requests)
        if (response.status === 429) {
          const resetIn = result.resetIn || 60;
          setRateLimitState({
            isLimited: true,
            resetTime: Date.now() + (resetIn * 1000),
            message: result.error || "Too many applications. Please try again later.",
          });
          return;
        }
        
        throw new Error(result.error || "Failed to submit application");
      }

      setSubmittedId(result.applicationId);
      setSubmittedFormData({ ...formData });
      clearSavedData();
      toast.success(t.success);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
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
    setCheckedState(null);
    setCheckedCity(null);
    setShowReupload(false);

    const { data, error } = await supabase
      .from("applicants_status_check" as any)
      .select("status, application_id, state, city")
      .eq("application_id", checkId.trim())
      .maybeSingle();

    if (error || !data) {
      setCheckResult("not_found");
    } else {
      const typedData = data as unknown as { status: string; application_id: string; state: string; city: string };
      setCheckResult(typedData.status);
      setCheckedApplicationId(typedData.application_id);
      setCheckedState(typedData.state);
      setCheckedCity(typedData.city);
    }
    setIsChecking(false);
  };

  // Format checked application identifier
  const getCheckedFormattedIdentifier = () => {
    if (!checkedApplicationId || !checkedState || !checkedCity) return checkedApplicationId;
    const stateCode = getStateCode(checkedState);
    const cityName = toTitleCase(checkedCity);
    return `${stateCode} – ${cityName} – ${checkedApplicationId}`;
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

  // Rate limit screen
  if (rateLimitState?.isLimited) {
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
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">
                  {language === "hi" ? "कृपया प्रतीक्षा करें" : "Please Wait"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {rateLimitState.message}
                </p>
              </div>
              
              {countdown > 0 && (
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-primary font-mono">
                    {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === "hi" ? "पुनः प्रयास तक शेष समय" : "Time remaining before you can try again"}
                  </p>
                  <Progress value={((60 - countdown) / 60) * 100} className="h-2" />
                </div>
              )}
              
              <div className="pt-4 space-y-3">
                <Button
                  onClick={() => setRateLimitState(null)}
                  disabled={countdown > 0}
                  className="w-full"
                >
                  {countdown > 0 
                    ? (language === "hi" ? "प्रतीक्षा करें..." : "Please wait...") 
                    : (language === "hi" ? "पुनः प्रयास करें" : "Try Again")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === "hi" ? "होम पर वापस जाएं" : "Go Back Home"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Format the display identifier
  const getFormattedIdentifier = () => {
    if (!submittedFormData) return submittedId;
    const stateCode = getStateCode(submittedFormData.state);
    const cityName = toTitleCase(submittedFormData.city);
    return `${stateCode} – ${cityName} – ${submittedId}`;
  };

  // Success screen
  if (submittedId && submittedFormData) {
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
        <div className="container max-w-md mx-auto px-4 py-6">
          <SuccessConfirmation
            applicationId={submittedId}
            formData={submittedFormData}
            language={language}
            onGoHome={() => navigate("/")}
            getFormattedIdentifier={getFormattedIdentifier}
          />
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
                {checkedApplicationId && checkResult !== "not_found" && (
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t.applicationId}</p>
                    <p className="text-sm font-mono font-semibold text-foreground break-all">
                      {getCheckedFormattedIdentifier()}
                    </p>
                  </div>
                )}
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
                  masjidCertificate={masjidCertificate}
                  passportPhoto={passportPhoto}
                  onMasjidCertSelect={handleMasjidCertSelect}
                  onPassportPhotoSelect={handlePassportPhotoSelect}
                  onMasjidCertClear={() => setMasjidCertificate(null)}
                  onPassportPhotoClear={() => setPassportPhoto(null)}
                  t={t}
                />
              )}
              {currentStep === 5 && (
                <StepReview
                  formData={formData}
                  masjidCertificate={masjidCertificate}
                  passportPhoto={passportPhoto}
                  t={t}
                  language={language}
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
                  onClick={handleConfirmSubmit}
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

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "ar" ? "تأكيد الإرسال" : 
               language === "ur" ? "جمع کرانے کی تصدیق کریں" : 
               language === "hi" ? "जमा करने की पुष्टि करें" : 
               "Confirm Submission"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "ar" ? "هل أنت متأكد أنك تريد إرسال طلبك؟ لا يمكن التراجع عن هذا الإجراء." : 
               language === "ur" ? "کیا آپ واقعی اپنی درخواست جمع کرانا چاہتے ہیں؟ اس عمل کو واپس نہیں کیا جا سکتا۔" : 
               language === "hi" ? "क्या आप वाकई अपना आवेदन जमा करना चाहते हैं? इस क्रिया को पूर्ववत नहीं किया जा सकता।" : 
               "Are you sure you want to submit your application? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "ar" || language === "ur" ? "إلغاء" : 
               language === "hi" ? "रद्द करें" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              {language === "ar" ? "نعم، أرسل" : 
               language === "ur" ? "ہاں، جمع کریں" : 
               language === "hi" ? "हाँ, जमा करें" : 
               "Yes, Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FreeUmrahApplyPage;
