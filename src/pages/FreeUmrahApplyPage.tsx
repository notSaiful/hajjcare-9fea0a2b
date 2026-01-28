import { useState, useRef } from "react";
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
import { ArrowLeft, Loader2, CheckCircle, Search, Upload, FileText, X, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { freeUmrahContent } from "@/data/freeUmrahContent";
import { DocumentReupload } from "@/components/DocumentReupload";
import { compressImage, needsCompression } from "@/lib/imageCompression";

// Note: generateApplicationId is now handled server-side in the edge function

// All Indian States and Union Territories
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const applicationSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  age: z.number().min(18, "Must be at least 18").max(100, "Age must be under 100"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Enter valid 10-digit mobile number"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter valid 6-digit pincode"),
  role: z.enum(["Imam", "Muazzin", "Hafiz"], { required_error: "Select your role" }),
  masjid_name: z.string().min(2, "Masjid/Madrasa name is required"),
  years_of_service: z.number().min(0, "Years must be positive").max(80, "Invalid years"),
  never_umrah: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  low_income: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  social_harmony: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  no_money_paid: z.literal(true, { errorMap: () => ({ message: "Declaration required" }) }),
  proof_type: z.enum(["Masjid Certificate"]).optional(),
});


const FreeUmrahApplyPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = freeUmrahContent[language as keyof typeof freeUmrahContent] || freeUmrahContent.en;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [checkId, setCheckId] = useState("");
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [checkedApplicationId, setCheckedApplicationId] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showReupload, setShowReupload] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    mobile: "",
    state: "",
    city: "",
    pincode: "",
    role: "",
    masjid_name: "",
    years_of_service: "",
    never_umrah: false,
    low_income: false,
    social_harmony: false,
    no_money_paid: false,
    proof_type: "Masjid Certificate",
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - only PDF and images allowed
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and image files (JPEG, PNG, GIF, WebP) are allowed");
      return;
    }

    // For images, try to compress if too large
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

    // For PDFs or small images, check size directly
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }
    
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // Client-side validation first
      const validated = applicationSchema.parse({
        ...formData,
        age: parseInt(formData.age) || 0,
        years_of_service: parseInt(formData.years_of_service) || 0,
        role: formData.role as "Imam" | "Muazzin" | "Hafiz",
        proof_type: formData.proof_type as "Masjid Certificate",
      });

      setIsSubmitting(true);

      // Build FormData for edge function
      const submitFormData = new FormData();
      submitFormData.append("full_name", validated.full_name);
      submitFormData.append("age", validated.age.toString());
      submitFormData.append("mobile", validated.mobile);
      submitFormData.append("state", validated.state);
      submitFormData.append("city", validated.city);
      submitFormData.append("pincode", validated.pincode);
      submitFormData.append("role", validated.role);
      submitFormData.append("masjid_name", validated.masjid_name);
      submitFormData.append("years_of_service", validated.years_of_service.toString());
      submitFormData.append("never_umrah", validated.never_umrah.toString());
      submitFormData.append("low_income", validated.low_income.toString());
      submitFormData.append("social_harmony", validated.social_harmony.toString());
      submitFormData.append("no_money_paid", validated.no_money_paid.toString());
      submitFormData.append("proof_type", validated.proof_type || "Masjid Certificate");
      
      if (selectedFile) {
        submitFormData.append("document", selectedFile);
      }

      // Submit via edge function
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
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            fieldErrors[e.path[0].toString()] = e.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        const errorMessage = err instanceof Error ? err.message : "Failed to submit application";
        toast.error(errorMessage);
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
    setCheckedApplicationId(null);
    setShowReupload(false);

    // Use the secure status check view (only exposes application_id, status, created_at)
    // This protects PII while allowing public status checks
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
                
                {/* Show re-upload option for SUBMITTED or UNDER_REVIEW */}
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
                  <Label htmlFor="mobile">{t.mobile} * <span className="text-xs text-muted-foreground">(10 digits)</span></Label>
                  <Input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, mobile: value });
                    }}
                    required
                  />
                  {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t.state} *</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.state} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t.city} *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                  {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">{t.pincode} *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    maxLength={6}
                    required
                  />
                  {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
                </div>
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

              {/* Hidden proof type - defaulting to Masjid Certificate */}
              <input type="hidden" value="Masjid Certificate" />

              {/* File Upload */}
              <div className="space-y-2">
                <Label>{t.proofDocument} <span className="text-xs text-muted-foreground">(Max 2MB)</span></Label>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm text-foreground truncate max-w-[200px]">
                        {selectedFile.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">{t.uploadHint}</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPEG, PNG • Max 2MB</p>
                    </>
                  )}
                </div>
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
