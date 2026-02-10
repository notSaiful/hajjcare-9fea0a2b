import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, Lock, User, MapPin, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const EMBARKATION_POINTS = [
  "Srinagar", "Gaya", "Guwahati", "Indore", "Jaipur", "Nagpur",
  "Delhi", "Mumbai", "Kolkata", "Bengaluru", "Hyderabad",
  "Cochin (Kochi)", "Chennai", "Ahmedabad", "Lucknow",
  "Kannur", "Calicut (Kozhikode)", "Vijayawada",
] as const;

const emailSchema = z.string().email("Invalid email address").max(255);
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(128);
const nameSchema = z.string().min(2, "Name must be at least 2 characters").max(100)
  .regex(/^[\p{L}\p{M}\s'-]+$/u, "Name can only contain letters, spaces, hyphens and apostrophes");

const labels = {
  en: { signIn: "Sign In", signUp: "Sign Up", email: "Email Address", password: "Password", fullName: "Full Name", embarkation: "Embarkation Point", showPassword: "Show", hidePassword: "Hide", haveAccount: "Have an account? Sign in", noAccount: "No account? Sign up", welcome: "Welcome back, pilgrim", joinUs: "Join the Hajj journey" },
  ar: { signIn: "تسجيل الدخول", signUp: "إنشاء حساب", email: "البريد الإلكتروني", password: "كلمة المرور", fullName: "الاسم الكامل", embarkation: "نقطة المغادرة", showPassword: "إظهار", hidePassword: "إخفاء", haveAccount: "لديك حساب؟ سجل دخولك", noAccount: "ليس لديك حساب؟ أنشئ واحداً", welcome: "مرحباً بعودتك أيها الحاج", joinUs: "انضم إلى رحلة الحج" },
  ur: { signIn: "لاگ ان", signUp: "اکاؤنٹ بنائیں", email: "ای میل", password: "پاسورڈ", fullName: "پورا نام", embarkation: "روانگی کا مقام", showPassword: "دکھائیں", hidePassword: "چھپائیں", haveAccount: "اکاؤنٹ ہے؟ لاگ ان کریں", noAccount: "اکاؤنٹ نہیں؟ بنائیں", welcome: "خوش آمدید حاجی", joinUs: "حج کے سفر میں شامل ہوں" },
  hi: { signIn: "लॉग इन", signUp: "खाता बनाएं", email: "ईमेल", password: "पासवर्ड", fullName: "पूरा नाम", embarkation: "प्रस्थान बिंदु", showPassword: "दिखाएं", hidePassword: "छिपाएं", haveAccount: "खाता है? लॉग इन करें", noAccount: "खाता नहीं? बनाएं", welcome: "वापसी पर स्वागत है", joinUs: "हज यात्रा में शामिल हों" },
};

interface EmailAuthFormProps {
  onSuccess: () => void;
}

export function EmailAuthForm({ onSuccess }: EmailAuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [embarkationPoint, setEmbarkationPoint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signUp, signIn } = useAuth();
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();

  const t = labels[language as keyof typeof labels] || labels.en;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;
    if (isSignUp) {
      const nameResult = nameSchema.safeParse(fullName);
      if (!nameResult.success) newErrors.fullName = nameResult.error.errors[0].message;
      if (!embarkationPoint) newErrors.embarkationPoint = "Please select your embarkation point";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName, embarkationPoint);
        if (error) {
          toast({ title: "Error", description: error.message.includes("already registered") ? "Email already registered" : error.message, variant: "destructive" });
        } else {
          toast({ title: isRTL ? "تم إنشاء الحساب" : "Account Created", description: isRTL ? "مرحباً بك" : "Welcome to Haj Care AI" });
          onSuccess();
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: "Error", description: isRTL ? "بيانات الدخول غير صحيحة" : "Invalid credentials", variant: "destructive" });
        } else {
          onSuccess();
        }
      }
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "An error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? t.joinUs : t.welcome}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <>
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.fullName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-2xl border-border/60 bg-background/60 focus:bg-background transition-colors"
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>
              {errors.fullName && <p className="text-xs text-destructive px-2">{errors.fullName}</p>}
            </div>

            {/* Embarkation Point */}
            <div className="space-y-1.5">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Select value={embarkationPoint} onValueChange={setEmbarkationPoint}>
                  <SelectTrigger className="pl-12 h-14 text-lg rounded-2xl border-border/60 bg-background/60 focus:bg-background transition-colors">
                    <SelectValue placeholder={t.embarkation} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {EMBARKATION_POINTS.map((point) => (
                      <SelectItem key={point} value={point}>{point}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.embarkationPoint && <p className="text-xs text-destructive px-2">{errors.embarkationPoint}</p>}
            </div>
          </>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl border-border/60 bg-background/60 focus:bg-background transition-colors"
              dir="ltr"
            />
          </div>
          {errors.email && <p className="text-xs text-destructive px-2">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-14 h-14 text-lg rounded-2xl border-border/60 bg-background/60 focus:bg-background transition-colors"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? t.hidePassword : t.showPassword}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive px-2">{errors.password}</p>}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-14 text-lg font-semibold rounded-2xl auth-gradient-btn transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isSignUp ? t.signUp : t.signIn}
        </Button>
      </form>

      {/* Toggle */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={() => { setIsSignUp(!isSignUp); setErrors({}); }}
          className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        >
          {isSignUp ? t.haveAccount : t.noAccount}
        </button>
      </div>
    </div>
  );
}
